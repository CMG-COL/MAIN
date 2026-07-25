/**
 * Thin client for the public Roblox web APIs.
 *
 * All endpoints used here are public and need no authentication.
 * Roblox rate-limits by IP; on HTTP 429 we surface a clear error so the
 * calling model can back off instead of retrying blindly.
 */

const USER_AGENT = "roblox-mcp/0.1.0 (+https://github.com/CMG-COL/MAIN)";

export class RobloxApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly url?: string,
  ) {
    super(message);
    this.name = "RobloxApiError";
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
    });
  } catch (e) {
    throw new RobloxApiError(
      `Network error calling Roblox API: ${e instanceof Error ? e.message : String(e)}`,
      undefined,
      url,
    );
  }

  if (res.status === 429) {
    throw new RobloxApiError(
      "Roblox API rate limit hit (HTTP 429). Wait a moment before retrying.",
      429,
      url,
    );
  }

  const text = await res.text();
  if (!res.ok) {
    // Roblox error bodies look like {"errors":[{"code":..,"message":".."}]}
    let detail = text.slice(0, 500);
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed?.errors)) {
        detail = parsed.errors
          .map((e: { message?: string }) => e.message)
          .filter(Boolean)
          .join("; ");
      }
    } catch {
      // keep raw text
    }
    throw new RobloxApiError(
      `Roblox API returned HTTP ${res.status}: ${detail}`,
      res.status,
      url,
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new RobloxApiError(
      `Roblox API returned non-JSON response: ${text.slice(0, 200)}`,
      res.status,
      url,
    );
  }
}

export function get<T>(url: string): Promise<T> {
  return request<T>(url);
}

export function post<T>(url: string, body: unknown): Promise<T> {
  return request<T>(url, { method: "POST", body: JSON.stringify(body) });
}

/** Resolve a placeId (from a roblox.com/games/<placeId>/... URL) to its universeId. */
export async function placeToUniverse(placeId: number): Promise<number> {
  const data = await get<{ universeId: number }>(
    `https://apis.roblox.com/universes/v1/places/${placeId}/universe`,
  );
  if (typeof data.universeId !== "number") {
    throw new RobloxApiError(
      `Could not resolve universeId for placeId ${placeId}`,
    );
  }
  return data.universeId;
}
