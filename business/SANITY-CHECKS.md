# Sanity Checks — Turbo Siesta

Prüfliste, die vor jedem „wir sind live"-Statement durchläuft. Automatisiert nur
lokal möglich (Roblox aus der Cloud-Session gesperrt).

**Letzter Durchlauf:** 26.07.2026, manuell aus Screenshots — nicht über die API
verifiziert.

## Store & Sichtbarkeit

| # | Prüfung | Soll | Stand |
|---|---|---|---|
| 1 | Experience existiert | ja | ✅ „🌴 Turbo Siesta 🚗 Drift Delivery Simulator" |
| 2 | Playability | Public | ❌ **noch Private** |
| 3 | Titel enthält Suchbegriffe | Drift, Delivery, Simulator | ✅ |
| 4 | Beschreibung gesetzt | EN + DE, Tags-Zeile | ⬜ offen |
| 5 | Icon 512×512 hochgeladen | ja | ⬜ offen |
| 6 | 3 Thumbnails 1920×1080, Reihenfolge korrekt | ja | ⬜ offen |
| 7 | Genre | Sports & Racing → Racing | ⬜ offen |
| 8 | Geräte | Computer, Phone, Tablet — **VR aus** | ⚠️ VR war gesetzt, prüfen |
| 9 | Maturity-Fragebogen | ausgefüllt, „Minimal" | ⬜ offen |
| 10 | Server-Größe | 12 | ⬜ offen |
| 11 | Studio Access to API Services | aktiv (für DataStore) | ⬜ offen |
| 12 | Alte Experience „SiestaLovers's Place" | archiviert | ⬜ offen |

## Spiel im Live-Betrieb

| # | Prüfung | Soll | Stand |
|---|---|---|---|
| 13 | Welt baut beim Start | Straßen, Häuser, Palmen, Plaza | ✅ in Studio gesehen |
| 14 | Golden-Hour-Licht aktiv | warm-orange | ⚠️ v1.1 verstärkt, ungetestet |
| 15 | HUD kollidiert nicht mit Roblox-Topbar | frei | ⚠️ v1.1 gefixt, ungetestet |
| 16 | Hub-Schild lesbar | „¡PRONTO! HUB" | ⚠️ v1.1 gefixt, ungetestet |
| 17 | Auto fahrbar, Kamera schwenkt in Draufsicht | ja | ⬜ offen |
| 18 | Job annehmen → abliefern → Lohn | funktioniert | ⬜ offen |
| 19 | Waschanlage bankt + wäscht Sterne | funktioniert | ⬜ offen |
| 20 | Knöllchen bei Einkeilung | funktioniert | ⬜ offen |
| 21 | `Bank` in der Spielerliste | sichtbar | ✅ in Studio gesehen |
| 22 | Savegame übersteht Neustart (DataStore) | ja | ⬜ offen, braucht #11 |
| 23 | Touch-Steuerung auf dem Handy | funktioniert | ⬜ offen |
| 24 | Framerate auf dem Handy | flüssig | ⬜ offen |

## Zahlen

| # | Prüfung | Soll | Stand |
|---|---|---|---|
| 25 | Creator-Dashboard-Werte in `MESSWERTE.md` | mindestens eine Zeile | ⬜ offen |
| 26 | Zahlerquote messbar | nach Pass-Einbau | ⬜ nicht anwendbar |
| 27 | Keine Barausgaben ohne Freigabe | Saldo stimmt mit `FINANZEN.md` | ✅ 0,00 € |

## Recht & Regeln

| # | Prüfung | Soll | Stand |
|---|---|---|---|
| 28 | Keine fremde IP in Spiel, Titel, Tags | erfüllt | ✅ |
| 29 | Keine Krypto-Referenzen | erfüllt | ✅ für Roblox entfernt |
| 30 | Keine bezahlten Zufalls-Belohnungen | erfüllt | ✅ nichts gebaut |
| 31 | Keine Belohnung für Likes/Follows | erfüllt | ✅ |
| 32 | API-Key nicht im Repo | erfüllt | ✅ nur Env-Variable |

## Legende

✅ geprüft und in Ordnung · ⚠️ geändert, aber ungetestet · ⬜ offen · ❌ Problem
