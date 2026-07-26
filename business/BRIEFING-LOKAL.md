# Briefing für die lokale Session

**Anleitung für Chris:** Diesen Block ab der Linie komplett kopieren und in eine
**lokale** Claude-Session einfügen, die im Ordner `MAIN` läuft (kein Wolken-Symbol).
Mehr musst du nicht erklären.

---

Du bist CPO/CSO/CFO für das Roblox-Spiel Turbo Siesta, Chris ist CEO. Lies zuerst
`CLAUDE.md` und `.claude/skills/cg-siesta-pmo/SKILL.md` — dort stehen Rolle,
Zug-Rhythmus und Guardrails. Der Zustand liegt in `business/`.

Du bist die **lokale** Session, also die einzige, die Roblox tatsächlich erreicht:
über den `roblox`-MCP (Open Cloud) und über den Studio-MCP (laufendes Studio).
Nutze das. Frag nicht nach Dingen, die du selbst prüfen kannst.

**Deine Aufgabe jetzt: Zug 1 aus `business/BACKLOG.md` — das Spiel live bringen.**

Arbeite in dieser Reihenfolge und melde nach jedem Punkt ein Wort Ergebnis:

1. **Bestandsaufnahme.** Finde die Universe-ID und Place-ID der Experience
   „🌴 Turbo Siesta 🚗 Drift Delivery Simulator" (der `roblox`-MCP kann von einer
   Place-ID auf die Universe-ID auflösen; die IDs stehen in der URL im Creator
   Hub). Lies dann mit `opencloud_get_universe` die aktuelle Konfiguration:
   Name, Beschreibung, Sichtbarkeit, Altersfreigabe.

2. **Prüfliste abgleichen.** Vergleiche mit `business/SANITY-CHECKS.md` und trage
   die tatsächlichen Stände dort ein (✅/⚠️/⬜/❌). Keine Vermutungen — nur was du
   über die API oder in Studio gesehen hast.

3. **Store-Seite füllen — so weit per API möglich.** Mit
   `opencloud_update_universe`:
   - Beschreibung: den 890-Zeichen-Block aus `marketing/ROBLOX-MARKETING.md`
     (englischer Teil + deutscher Anhang + Tags-Zeile)
   - Titel prüfen, er soll `🌴 Turbo Siesta 🚗 Drift Delivery Simulator` sein
   - Sichtbarkeit auf `PUBLIC` setzen
   Wenn Roblox die Sichtbarkeitsänderung ablehnt, ist meist der
   Maturity-Fragebogen offen — dann sag es mir mit der genauen Fehlermeldung,
   das ist einer der wenigen Punkte, die nur ich im Browser erledigen kann.

4. **Was die API nicht kann, in Studio machen.** Server-Größe 12, Geräte
   Computer/Phone/Tablet (VR aus), Settings → Security → „Enable Studio Access to
   API Services". Nutze dafür den Studio-MCP bzw. sag mir die zwei Klicks, wenn
   du nicht rankommst.

5. **Spiel testen, nicht raten.** Starte das Spiel in Studio (F5) und prüfe
   wirklich: Licht warm-orange, HUD nicht unter Roblox' Menüleiste, Hub-Schild
   lesbar, ins Auto steigen → Kamera schwenkt in die Draufsicht, einen Job
   annehmen und abliefern, Waschanlage durchfahren. Was hakt, fixe direkt in
   `roblox/src/*.luau`, baue neu mit `node roblox/build-rbxlx.js` und publishe
   über **Update existing experience** (nie „Create new").

6. **Erste Messwerte holen.** Sobald das Spiel öffentlich ist, hole über
   `opencloud_query_analytics` (oder aus dem Creator Dashboard, falls die Beta-API
   nichts liefert) Besuche, Session-Zeit und Like-Ratio und schreibe die erste
   Zeile in `business/MESSWERTE.md`.

7. **Aufräumen.** Die alte Experience „SiestaLovers's Place" archivieren.

8. **Buchen und committen.** `business/BACKLOG.md` fortschreiben (Zug 1 als
   erledigt, nächster Zug nach oben), `business/SANITY-CHECKS.md` aktualisieren,
   alles committen und pushen auf `claude/gta-style-ios-game-1lrny6`.

**Zum Schluss melde mir genau vier Dinge:**
- Universe-ID und Place-ID
- Ist das Spiel öffentlich? Ja/Nein, und falls nein: woran es hängt
- Welche Punkte der Prüfliste jetzt grün sind — und welche nicht
- Die erste Messwert-Zeile

**Guardrails, die du nicht brichst:** kein Geld ausgeben, keine Preise
festlegen, keine Monetarisierung einbauen ohne meine Freigabe. Keine
bezahlten Zufalls-Belohnungen, kein Pay-to-win (das Spiel hat eine Rangliste).
Was du nicht getestet hast, meldest du als ungetestet.
