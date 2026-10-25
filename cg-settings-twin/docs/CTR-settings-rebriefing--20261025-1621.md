# Rebriefing: CG Settings Twin

Stand: 25.10.2026, 16:21 UTC. Status: Entwurf, wartet auf Entscheidung von Chris (Gate POC Approval).
Ersetzt: den Auftrag "Managed Agent für Claude-Einstellungen auf CMG2" in diesem Chat.

## 1. Auftrag

Das Vorhaben liefert drei Ergebnisse gleichzeitig:

1. **Plugin.** Es liest Einstellungen aus, gleicht sie ab und berichtet. Es läuft auf Abruf und als Routine.
2. **Digital Twin.** Eine strukturierte Darstellung aller erfassten Einstellungen und Schalter, je Eintrag mit SOLL-Wert und IST-Wert.
3. **IST-Abgleich.** Das Plugin liest die IST-Werte aus und vergleicht sie mit dem SOLL und mit dem letzten Lauf. Es berichtet die Abweichungen und den Gesamtstand.

Dazu kommen zwei Erweiterungen:

- **Privacy-Modul.** Optional im Plugin, in diesem Lauf eingeschaltet. Es deckt Strukturen (Projekte, Routinen, Freigaben) und die prozessuale Aufbereitung der Chat-Inhalte ab.
- **Agenten-Anbindung.** Connectoren, Schlüssel-Ablageorte, Identitäten, Routinen und Skills je Plattform.

## 2. Scope und Erfassungsweg

Erfassungsarten:

- **A lokal:** Claude Code liest Dateien und Systemeinstellungen auf dem Gerät.
- **B Connector:** Lesen über einen vorhandenen Connector oder eine API.
- **C Export:** Chris fordert einen Datenexport an, das Plugin verarbeitet ihn.
- **D geführt:** Das Plugin gibt eine Screenshot-Checkliste vor, Chris macht die Bilder.
- **E Browser (optional):** Das Plugin liest Seiten in Chris' bereits eingeloggtem Chrome. Der Agent loggt sich nie selbst ein.

| Objekt | Erfassungsweg | Automatisierung | Bemerkung |
|---|---|---|---|
| CMG1, CMG2, CMG3 | A | hoch | Betriebssystem unbekannt. macOS: Dateien plus `defaults`, `system_profiler`, `profiles`. |
| iPad 1 und 2, iPhone 1 und 2 | D | gering | iOS erlaubt kein Auslesen fremder Einstellungen. Eine Geräteverwaltung (MDM) wäre für 4 Geräte unverhältnismäßig. |
| Google Workspace (Admin) | B oder D | mittel | Lesen der Admin-Konsole braucht Admin-Rechte. Die Agent-Identität ist Content Manager. |
| Google Drive | B | hoch | Drive-Connector liest Freigaben und Eigentümer. |
| Google-Konto | D, E, C | gering bis mittel | Aktivitätseinstellungen, Drittanbieter-Zugriffe, Takeout. |
| Chrome | A | hoch | Profildateien (Einstellungen, Erweiterungen) liegen lokal. |
| Claude | A, B, C, D | mittel | Code und Desktop als Dateien. Chat und Cowork nur in der App. Datenexport für Chats und Projekte. Routinen per Tool lesbar. |
| ChatGPT | C, D, E | gering bis mittel | Datenexport für Chats. Einstellungen nur in der App. |
| Littlebird | B, D | mittel | Connector liest Routinen und Meetings. |
| Gemini | C, D, E | gering bis mittel | Einstellungen im Google-Konto, Export über Takeout (zu prüfen). |
| Manus | C, D, E | gering | Exportweg zu prüfen. |

## 3. Vorgeschlagene Grundsätze

1. Das Plugin läuft in Claude Code. Cowork ist zweiter Kanal, sobald geprüft ist, dass das Plugin dort läuft.
2. Das Plugin liest nur. Änderungen schlägt es vor, Chris setzt sie um.
3. Geheimnisse erfasst das Plugin nur mit Ablageort, nie mit Wert.
4. Chat-Inhalte werden prozessual aufbereitet und nicht inhaltlich bewertet. Sie gehen nie in Memory.
5. Aus PR #2 werden Sammelskript, Systemprompt und Prüfliste übernommen. Die Managed-Agent-Dateien bleiben im Repo und werden als abgelöst markiert. Löschen darf nur Chris.

## 4. Module

| Nr. | Modul | Inhalt | Ergebnis |
|---|---|---|---|
| M0 | Governance | Scope, Rollen, Gates, Namensregel, Register, Grenzen | dieses Rebriefing, Gate-Dokumente |
| M1 | Twin-Modell und SOLL-Katalog | Datenmodell: Objekt, Bereich, Einstellung, Typ, SOLL, IST, Quelle, Erfassungsart, Datum, Schutzklasse. Katalog aller zu erfassenden Einstellungen je Objekt. | Schema, Katalog je Objekt |
| M2 | Collector-Adapter | ein Adapter je Objekt und Erfassungsart A bis E, mit Schwärzung von Geheimnissen | Snapshot je Lauf und Objekt |
| M3 | Abgleich und Report | IST gegen SOLL, IST gegen letzten Lauf, Gesamtstand | Twin-Datei, Abweichungsbericht |
| M4 | Verbesserungen | gerankte Vorschläge mit Klickpfad, Aufwand, Risiko, Kennzeichnung "gelbe Linie" | Verbesserungsliste |
| M5a | Privacy-Struktur | Freigaben, Projektstrukturen, Routinen, Drittzugriffe, Schalter für Training, Memory und Aufbewahrung | Privacy-Report Teil 1 |
| M5b | Privacy-Chats | Exporte von Claude, ChatGPT, Gemini, Manus einsammeln. Einheitliches Format: Plattform, Datum, Projekt, Titel, Umfang, Anhänge. Index, sensible Kategorien markiert. | Chat-Index im Data-Ordner, Privacy-Report Teil 2 |
| M6 | Agenten-Anbindung | Connectoren und MCP-Server, OAuth-Freigaben, Schlüssel-Ablageorte, Identitäten cg@ und manus@ mit Rollen (Prüfung Regel 5.5: Chris nie ausgesperrt), Routinen und Zeitpläne, Plugins | Anbindungs-Inventar im Twin |
| M7 | Skills plattformübergreifend | Inventar der Skills in Claude, ChatGPT, Manus. Abgleich mit einer zentralen Quelle. | Skill-Records im Twin, Drift-Bericht |
| M8 | Betrieb | Routine je Gerät für lokale Quellen, Cloud-Routine für Connector-Quellen, Ablage in Drive, Eintrag in Register 2 | laufende Routine (nach Freigabe) |

## 5. Skills von Manus und ChatGPT

Befund:

- Agent Skills ist ein offener Standard: ein Ordner mit `SKILL.md`, dazu optional Skripte und Referenzdateien. Claude nutzt ihn nativ.
- Manus hat den Standard nach eigener Aussage übernommen. Skills liegen dort als Ordner in der Sandbox und sind bearbeitbar ([Manus Docs](https://manus.im/docs/en/features/skills), [Manus Blog](https://www.manus.im/blog/manus-skills)).
- OpenAI unterstützt Skills nativ in Codex. In ChatGPT ist die Unterstützung laut Sekundärquellen Beta und nicht in allen Plänen verfügbar ([handsonai.info](https://handsonai.info/platforms/openai/skills/), [devtoollab.com](https://devtoollab.com/blog/agent-skills-open-standard-guide)). Eine offizielle OpenAI-Seite ist noch nicht gelesen.

Vorschlag zur Einbindung:

1. Der Twin erfasst jeden installierten Skill je Plattform als eigenen Eintrag: Name, Quelle, Stand, Plattform.
2. Jeder Skill hat genau eine Quelle (SSOT im Vault oder Repo). Die Plattformen erhalten Kopien. Der Abgleich zeigt, wo eine Kopie veraltet ist.
3. Die Erfassungslogik des Plugins wird selbst als Skill gebaut. Dann kann dieselbe Anleitung auch in Manus oder ChatGPT laufen, etwa um dort eigene Einstellungen zu lesen. Ob Manus und ChatGPT ihre eigenen Einstellungen auslesen können, ist ungeprüft.
4. Fremde Skills sind Anweisungen an einen Agenten. Vor Übernahme prüft das Plugin Skripte und Text auf Risiken.

## 6. Grenzen

- iPhones und iPads: keine automatische Erfassung, nur geführte Screenshots.
- Web-Einstellungen von Claude, ChatGPT, Gemini, Manus und Littlebird: eine öffentliche Settings-Schnittstelle ist nicht bekannt. M2 prüft das je Plattform.
- Lokale Routinen laufen nur, wenn das Gerät eingeschaltet ist.
- Workspace-Admin: Lesen braucht Admin-Rechte. Optionen: Chris exportiert selbst, oder Chris gibt einen Nur-Lese-Zugang frei.
- Datenexporte fordert Chris selbst an, weil sie einen Login brauchen. Die Lieferung dauert je Plattform Minuten bis Tage.

## 7. Phasen und Gates

| Phase | Umfang | Gate |
|---|---|---|
| POC | CMG2, Claude, Chrome, Drive, Privacy M5a und M5b für Claude | POC Approval |
| Test | CMG1 und CMG3, Google-Konto, Littlebird, ChatGPT, iOS-Checkliste | GO FOR TEST |
| Ausbau | Gemini, Manus, Workspace-Admin, Skills-Abgleich M7 | GO FOR IMPLEMENTATION |
| Betrieb | Routinen je Gerät und in der Cloud | ACTIVE plus Freigabe des Zeitplans |

## 8. Offene Entscheidungen für Chris

1. Betriebssystem von CMG1, CMG2, CMG3.
2. SOLL-Werte. Vorschlag: Das Plugin schlägt SOLL-Werte aus Best Practice vor, Chris bestätigt, danach gelten sie als verifiziert.
3. Ablage. Drive-Topic-Ordner und Navigator-Eintrag. Ist Domain CTR richtig?
4. Browser-Erfassung E mit Chris' eingeloggtem Chrome: erlaubt oder nicht?
5. Chat-Inhalte: welche Plattformen, welcher Zeitraum, welcher Zielordner?
6. Workspace-Admin: Export durch Chris oder Nur-Lese-Zugang?
7. Rhythmus der Routine, etwa monatlich.

## 9. Zusätzliche Idee (nicht Teil des Auftrags)

Littlebird erfasst bereits Bildschirminhalte. Damit könnte Littlebird Einstellungsseiten passiv mitlesen, ohne eigene Screenshots. Das wirft eigene Datenschutzfragen auf und gehört erst nach dem POC auf den Tisch.
