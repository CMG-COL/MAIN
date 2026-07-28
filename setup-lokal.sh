#!/usr/bin/env bash
# Turbo Siesta — Einrichtung der lokalen Arbeitsumgebung.
# Macht alles, was ohne Mensch geht. Sagt am Ende, was noch fehlt.
set -uo pipefail

ok()   { printf "  \033[32m✔\033[0m %s\n" "$1"; }
bad()  { printf "  \033[31m✘\033[0m %s\n" "$1"; }
warn() { printf "  \033[33m!\033[0m %s\n" "$1"; }
head1() { printf "\n\033[1m%s\033[0m\n" "$1"; }

cd "$(dirname "$0")" || exit 1
REPO="$(pwd)"

head1 "1 · Werkzeuge"
if command -v node >/dev/null 2>&1; then
  NODE_MAJOR="$(node -v | sed 's/^v\([0-9]*\).*/\1/')"
  if [ "$NODE_MAJOR" -ge 18 ]; then ok "Node $(node -v)"; else bad "Node $(node -v) — mindestens v18 nötig: https://nodejs.org"; fi
else
  bad "Node fehlt. Installieren: https://nodejs.org  (dann dieses Skript erneut starten)"
  exit 1
fi
command -v git >/dev/null 2>&1 && ok "git $(git --version | awk '{print $3}')" || { bad "git fehlt"; exit 1; }

head1 "2 · Repo aktualisieren"
BRANCH="claude/gta-style-ios-game-1lrny6"
git fetch origin "$BRANCH" >/dev/null 2>&1 && ok "Branch geholt: $BRANCH" || warn "konnte nicht fetchen (offline?)"
if git rev-parse --verify "$BRANCH" >/dev/null 2>&1; then
  git checkout "$BRANCH" >/dev/null 2>&1 && git merge --ff-only "origin/$BRANCH" >/dev/null 2>&1 \
    && ok "auf aktuellem Stand" || warn "lokale Änderungen vorhanden — bitte selbst committen"
else
  git checkout -b "$BRANCH" "origin/$BRANCH" >/dev/null 2>&1 && ok "Branch angelegt"
fi

head1 "3 · MCP-Server bauen"
if [ -d roblox-mcp ]; then
  ( cd roblox-mcp && npm install --silent >/dev/null 2>&1 && npm run build >/dev/null 2>&1 )
  if [ -f roblox-mcp/dist/index.js ]; then
    TOOLS="$(grep -c 'server.registerTool' roblox-mcp/src/index.ts)"
    ok "roblox-mcp gebaut ($TOOLS Werkzeuge)"
  else
    bad "Build fehlgeschlagen — im Ordner roblox-mcp 'npm install && npm run build' manuell versuchen"
  fi
else
  bad "Ordner roblox-mcp fehlt"
fi

head1 "4 · Roblox erreichbar?"
CODE="$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 https://apis.roblox.com/cloud/v2/universes/1 2>/dev/null)"
[ -z "$CODE" ] && CODE=000
case "$CODE" in
  000) bad "Keine Verbindung zu apis.roblox.com — Netzwerk/Firewall prüfen" ;;
  401|403) ok "Roblox erreichbar (Antwort $CODE = erwartet ohne gültigen Key)" ;;
  *) ok "Roblox erreichbar (Antwort $CODE)" ;;
esac

head1 "5 · API-Key"
if [ -n "${ROBLOX_API_KEY:-}" ]; then
  ok "ROBLOX_API_KEY ist gesetzt (${#ROBLOX_API_KEY} Zeichen)"
else
  warn "ROBLOX_API_KEY fehlt — ohne ihn laufen nur die öffentlichen Werkzeuge."
  cat <<'KEY'

      So anlegen (2 Minuten, nur im Browser möglich):
      1. https://create.roblox.com/dashboard/credentials öffnen
      2. "Create API Key" → Name: turbo-siesta
      3. Diese Berechtigungen hinzufügen:
           universe:read, universe:write
           universe.place:read, universe.place:write
           universe-datastores.objects:read
      4. Als erlaubte IP  0.0.0.0/0  eintragen, Key kopieren
      5. Im Terminal (ersetzt DEIN_KEY):
           echo 'export ROBLOX_API_KEY="DEIN_KEY"' >> ~/.zshrc && source ~/.zshrc
KEY
fi

head1 "6 · Spielquellen prüfen"
if node roblox/build-rbxlx.js >/dev/null 2>&1; then ok "TurboSiesta.rbxlx neu gebaut und gültig"; else bad "Bau der .rbxlx fehlgeschlagen"; fi

head1 "Fertig — das bleibt für dich zu tun"
cat <<'NEXT'
  A) Studio-MCP einschalten (einmalig, nur per Klick möglich):
     Roblox Studio → File → Studio Settings → Beta Features → "MCP Server" an
     → Studio neu starten
     → Assistant Settings → MCP Servers → "Enable Studio as MCP server"
     → Quick connect → Claude

  B) Dein Spiel in Studio öffnen (Datei: roblox/TurboSiesta.rbxlx)

  C) Eine LOKALE Claude-Session in diesem Ordner starten und den Text aus
     business/BRIEFING-LOKAL.md komplett hineinkopieren. Den Rest macht sie.
NEXT
printf "\n"
