#!/usr/bin/env node
/**
 * roblox-mcp — MCP server for public Roblox.com web APIs.
 *
 * Exposes users, games, groups, catalog, badges, thumbnails and public
 * game servers as MCP tools over stdio. No authentication required.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { get, post, placeToUniverse, RobloxApiError } from "./roblox.js";

const server = new McpServer({
  name: "roblox",
  version: "0.1.0",
});

type ToolResult = {
  content: { type: "text"; text: string }[];
  isError?: boolean;
};

function ok(data: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

function fail(error: unknown): ToolResult {
  const message =
    error instanceof RobloxApiError
      ? error.message
      : error instanceof Error
        ? error.message
        : String(error);
  return { content: [{ type: "text", text: `Error: ${message}` }], isError: true };
}

async function run(fn: () => Promise<unknown>): Promise<ToolResult> {
  try {
    return ok(await fn());
  } catch (e) {
    return fail(e);
  }
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

server.registerTool(
  "get_user",
  {
    title: "Get Roblox user by ID",
    description:
      "Fetch a Roblox user's public profile (username, display name, description, created date, banned/verified flags) by numeric user ID.",
    inputSchema: { userId: z.number().int().positive().describe("Numeric Roblox user ID") },
  },
  async ({ userId }) =>
    run(() => get(`https://users.roblox.com/v1/users/${userId}`)),
);

server.registerTool(
  "get_users_by_usernames",
  {
    title: "Look up Roblox users by username",
    description:
      "Resolve one or more exact Roblox usernames to user IDs and display names.",
    inputSchema: {
      usernames: z
        .array(z.string().min(1))
        .min(1)
        .max(50)
        .describe("Exact usernames to resolve (max 50)"),
    },
  },
  async ({ usernames }) =>
    run(() =>
      post(`https://users.roblox.com/v1/usernames/users`, {
        usernames,
        excludeBannedUsers: false,
      }),
    ),
);

server.registerTool(
  "search_users",
  {
    title: "Search Roblox users",
    description: "Search Roblox users by keyword (partial username match).",
    inputSchema: {
      keyword: z.string().min(3).describe("Search keyword (min 3 characters)"),
      limit: z.number().int().min(10).max(100).default(10).describe("Max results (10, 25, 50 or 100)"),
    },
  },
  async ({ keyword, limit }) =>
    run(() =>
      get(
        `https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(keyword)}&limit=${limit}`,
      ),
    ),
);

server.registerTool(
  "get_user_friends",
  {
    title: "Get a user's friends",
    description:
      "List a Roblox user's friends (public). Also returns the total friend count.",
    inputSchema: { userId: z.number().int().positive().describe("Numeric Roblox user ID") },
  },
  async ({ userId }) =>
    run(async () => {
      const [friends, count] = await Promise.all([
        get(`https://friends.roblox.com/v1/users/${userId}/friends`),
        get(`https://friends.roblox.com/v1/users/${userId}/friends/count`),
      ]);
      return { count, friends };
    }),
);

server.registerTool(
  "get_user_badges",
  {
    title: "Get a user's badges",
    description: "List badges a Roblox user has earned, most recent first.",
    inputSchema: {
      userId: z.number().int().positive().describe("Numeric Roblox user ID"),
      limit: z.number().int().min(10).max(100).default(10).describe("Max results (10, 25, 50 or 100)"),
    },
  },
  async ({ userId, limit }) =>
    run(() =>
      get(
        `https://badges.roblox.com/v1/users/${userId}/badges?limit=${limit}&sortOrder=Desc`,
      ),
    ),
);

server.registerTool(
  "get_avatar_thumbnails",
  {
    title: "Get avatar thumbnail URLs",
    description:
      "Get avatar headshot image URLs for one or more Roblox users (PNG).",
    inputSchema: {
      userIds: z
        .array(z.number().int().positive())
        .min(1)
        .max(50)
        .describe("Roblox user IDs (max 50)"),
      size: z
        .enum(["48x48", "150x150", "420x420", "720x720"])
        .default("150x150")
        .describe("Image size"),
    },
  },
  async ({ userIds, size }) =>
    run(() =>
      get(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userIds.join(",")}&size=${size}&format=Png&isCircular=false`,
      ),
    ),
);

// ---------------------------------------------------------------------------
// Games
// ---------------------------------------------------------------------------

server.registerTool(
  "get_game_details",
  {
    title: "Get game details",
    description:
      "Fetch details for a Roblox game/experience (name, description, creator, playing count, visits, favorites, max players, genre) plus like/dislike votes. Accepts either a universeId or a placeId (the number in a roblox.com/games/<placeId>/ URL).",
    inputSchema: {
      universeId: z.number().int().positive().optional().describe("Universe ID (preferred if known)"),
      placeId: z.number().int().positive().optional().describe("Place ID from the game URL; resolved to a universeId automatically"),
    },
  },
  async ({ universeId, placeId }) =>
    run(async () => {
      if (!universeId && !placeId) {
        throw new Error("Provide either universeId or placeId.");
      }
      const uid = universeId ?? (await placeToUniverse(placeId!));
      const [details, votes] = await Promise.all([
        get<{ data: unknown[] }>(`https://games.roblox.com/v1/games?universeIds=${uid}`),
        get<{ data: unknown[] }>(`https://games.roblox.com/v1/games/votes?universeIds=${uid}`),
      ]);
      return {
        universeId: uid,
        details: details.data?.[0] ?? null,
        votes: votes.data?.[0] ?? null,
      };
    }),
);

server.registerTool(
  "get_game_icons",
  {
    title: "Get game icon URLs",
    description: "Get icon image URLs for one or more games by universeId (PNG).",
    inputSchema: {
      universeIds: z
        .array(z.number().int().positive())
        .min(1)
        .max(50)
        .describe("Universe IDs (max 50)"),
      size: z
        .enum(["128x128", "256x256", "512x512"])
        .default("512x512")
        .describe("Image size"),
    },
  },
  async ({ universeIds, size }) =>
    run(() =>
      get(
        `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeIds.join(",")}&size=${size}&format=Png&isCircular=false`,
      ),
    ),
);

server.registerTool(
  "get_game_servers",
  {
    title: "List public game servers",
    description:
      "List currently running public servers for a game by placeId, including player counts and ping.",
    inputSchema: {
      placeId: z.number().int().positive().describe("Place ID from the game URL"),
      limit: z.number().int().min(10).max(100).default(10).describe("Max results (10, 25, 50 or 100)"),
    },
  },
  async ({ placeId, limit }) =>
    run(() =>
      get(
        `https://games.roblox.com/v1/games/${placeId}/servers/Public?sortOrder=Desc&limit=${limit}`,
      ),
    ),
);

server.registerTool(
  "search_games",
  {
    title: "Search Roblox games",
    description:
      "Search Roblox games/experiences by keyword using the omni-search API (same backend the roblox.com search page uses). Returns matching games with universeId, placeId, name, player counts and votes.",
    inputSchema: {
      query: z.string().min(1).describe("Search keyword, e.g. a game name"),
    },
  },
  async ({ query }) =>
    run(async () => {
      const sessionId = crypto.randomUUID();
      const data = await get<{
        searchResults?: {
          contentGroupType?: string;
          contents?: unknown[];
        }[];
      }>(
        `https://apis.roblox.com/search-api/omni-search?searchQuery=${encodeURIComponent(query)}&sessionId=${sessionId}&pageType=all`,
      );
      const games = (data.searchResults ?? [])
        .filter((g) => g.contentGroupType === "Game")
        .flatMap((g) => g.contents ?? []);
      return { query, resultCount: games.length, games };
    }),
);

// ---------------------------------------------------------------------------
// Groups
// ---------------------------------------------------------------------------

server.registerTool(
  "get_group",
  {
    title: "Get Roblox group",
    description:
      "Fetch a Roblox group's public info (name, description, owner, member count) by group ID.",
    inputSchema: { groupId: z.number().int().positive().describe("Numeric group ID") },
  },
  async ({ groupId }) =>
    run(() => get(`https://groups.roblox.com/v1/groups/${groupId}`)),
);

server.registerTool(
  "search_groups",
  {
    title: "Search Roblox groups",
    description: "Search Roblox groups by keyword.",
    inputSchema: {
      keyword: z.string().min(1).describe("Search keyword"),
      limit: z.number().int().min(10).max(100).default(10).describe("Max results (10, 25, 50 or 100)"),
    },
  },
  async ({ keyword, limit }) =>
    run(() =>
      get(
        `https://groups.roblox.com/v1/groups/search?keyword=${encodeURIComponent(keyword)}&limit=${limit}&prioritizeExactMatch=true`,
      ),
    ),
);

// ---------------------------------------------------------------------------
// Catalog
// ---------------------------------------------------------------------------

server.registerTool(
  "search_catalog",
  {
    title: "Search the Roblox catalog",
    description:
      "Search avatar shop / catalog items (clothing, accessories, gear) by keyword. Returns item details including price in Robux.",
    inputSchema: {
      keyword: z.string().min(1).describe("Search keyword"),
      limit: z.number().int().min(10).max(120).default(10).describe("Max results (10, 28, 30, 60 or 120)"),
    },
  },
  async ({ keyword, limit }) =>
    run(() =>
      get(
        `https://catalog.roblox.com/v1/search/items/details?Keyword=${encodeURIComponent(keyword)}&Limit=${limit}`,
      ),
    ),
);

// ---------------------------------------------------------------------------

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("roblox-mcp server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
