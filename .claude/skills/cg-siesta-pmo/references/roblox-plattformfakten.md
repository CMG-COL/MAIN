# Roblox-Plattformfakten (Stand Juli 2026)

Belegte Zahlen für Entscheidungen. **Nicht aus dem Gedächtnis zitieren** — wenn
eine Zahl für eine Entscheidung zählt, vorher gegen die Quelle prüfen. Roblox
ändert Kurse und Programme regelmäßig.

## Monetarisierung

| Fakt | Wert |
|---|---|
| Marktplatzgebühr | Roblox behält 30 %, dem Entwickler bleiben 70 % in Robux |
| DevEx-Kurs Standard | 0,0038 USD je verdienten Robux |
| DevEx-Kurs erhöht | 0,0054 USD — **nur** für Käufe von US-Spielern mit verifiziertem Alter 18+ (Passes, Developer Products, Abos, private Server) |
| Erhöhung in Kraft seit | 8. Juni 2026 (+42 % für US-18+-Umsätze) |
| Mindestauszahlung | 100.000 verdiente Robux |
| Robux-Preis für Spieler | ca. 400 R$ für 4,99 USD → ~0,0125 USD je Robux |
| Creator-Auszahlungen 2025 insgesamt | über 1,5 Mrd. USD via DevEx |

**Konsequenz:** Von einem Robux, den ein Spieler ausgibt, kommen bei uns rund
21 % als Geld an (30 % Gebühr, dann Kursdifferenz zwischen Kauf- und
Auszahlungswert). Unsere Zielgruppe ist überwiegend unter 18 — wir planen mit dem
Standardkurs, nicht mit dem erhöhten.

Verkaufsformen im Spiel:
- **Passes** — Einmalkauf, dauerhafter Vorteil oder Kosmetik
- **Developer Products** — wiederholbar kaufbar (Währung, Verbrauchsgüter)
- **Private Server**, **Abos** — zählen für den erhöhten Kurs mit

## Werbung

| Fakt | Wert |
|---|---|
| Mindestbudget Ads Manager | 10 Ad Credits ≈ 2.850 Robux ≈ 35 USD |
| Tagesbudget | ab ~1 USD/Tag möglich, empfohlen 10–50 USD/Tag zum Testen |
| Klickpreis Sponsored Experiences | typisch 0,10–0,50 USD |
| Auktionsmodell | CPM-Zweitpreisauktion; Gebot nach CPM, CPP (Cost per Play) oder CPV15 |
| Formate | **Sponsored Experiences** (Home/Discover), **Immersive Ads** (3D-Billboards und Portale in anderen Spielen) |
| Zugang | Creator Hub → Advertising → Kampagne anlegen, Zielgruppe nach Alter/Gerät |
| Rewarded Video Ads | eigenes Programm zur Monetarisierung, Teilnahme eingeschränkt |

**Konsequenz:** Bei 0,30 USD pro Klick kostet ein gewonnener Spieler rund
0,60 USD, während er im Schnitt Bruchteile eines Cents einbringt. Werbung ist
deshalb Anschub für den Algorithmus, kein Umsatzkanal — Rechnung in
`business/BUSINESS-CASE.md` §2.

## Discovery

- Der überwiegende Teil der Spielstarts kommt über **Home-Empfehlungen**, nicht
  über die Suche.
- Der Algorithmus testet neue Spiele mit kleinen Impression-Wellen und skaliert
  nach Qualified Play Through, Session-Zeit, D1/D7-Retention und Like-Ratio.
- **Titel** trägt die Suche (Limit 50 Zeichen), **Icon** trägt den Klick in
  Home/Discover, **Thumbnails** wirken auf der Spielseite.
- Irreführende Metadaten, insbesondere fremde Spielnamen als Tags, verstoßen gegen
  die Regeln und können das Spiel aus der Suche werfen.

## Automatisierung (Open Cloud)

| Fähigkeit | Stand |
|---|---|
| **Configs API** | Konfiguration einer Experience programmatisch lesen und schreiben, per API-Key oder OAuth 2.0 |
| **Analytics Query API** | Beta (Stand Juli 2026) — historische aggregierte Kennzahlen abfragen |
| Universe / Place lesen | `universe:read`, `universe.place:read` |
| DataStores | lesen/listen mit `universe-datastores.*`-Scopes |
| MessagingService | Nachricht an laufende Server, `universe-messaging-service:publish` |
| Place aktualisieren | `universe-places:write` |
| API-Keys | können inzwischen alle eigenen Experiences abdecken, statt einzeln ausgewählt zu werden |

**Unser MCP** (`roblox-mcp/`) deckt öffentliche Roblox-APIs plus Open-Cloud-Lesen,
DataStores und MessagingService ab. Nicht enthalten und Kandidaten für einen
Ausbau: Configs schreiben, Place publishen, Analytics abfragen.

**Wichtig:** Aus der Cloud-Session sind alle `*.roblox.com` durch die
Netzwerk-Policy gesperrt. Der MCP funktioniert nur lokal.

## Quellen

- [DevEx-Programm (Roblox Creator Hub)](https://create.roblox.com/docs/production/monetization/developer-exchange)
- [Roblox Newsroom: DevEx-Kurs +42 % für 18+-Umsätze](https://about.roblox.com/newsroom/2026/04/roblox-fuels-high-fidelity-games-over-18-players-increases-qualifying-devex-rate-42)
- [DevEx-Guide: Anforderungen und Kurse (RoLearn)](https://rolearn.dev/guidance/roblox-devex-guide-requirements-rates/)
- [Roblox Revenue Share erklärt (RoLearn)](https://rolearn.dev/insights/roblox-developer-revenue-share-2026/)
- [Ads Manager (Roblox Creator Hub)](https://create.roblox.com/docs/production/promotion/ads-manager)
- [Sponsored Experiences ziehen in den Ads Manager (DevForum)](https://devforum.roblox.com/t/sponsored-experiences-moving-to-ads-manager/2661756)
- [Roblox-Werbung: Leitfaden 2026 (BLOXG)](https://bloxg.com/guides/roblox-ads-guide)
- [Cloud API Referenz (Roblox Creator Hub)](https://create.roblox.com/docs/cloud)
- [Open Cloud Configs API (DevForum)](https://devforum.roblox.com/t/programmatically-update-configs-the-open-cloud-configs-api/4509549)
- [Open Cloud Analytics Query API, Beta (DevForum)](https://devforum.roblox.com/t/open-cloud-analytics-query-api-is-live-beta-%E2%80%94-tested-documented-with-a-client/4753664)
