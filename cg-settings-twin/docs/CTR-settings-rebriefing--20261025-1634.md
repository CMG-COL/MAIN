# Rebriefing: CG Settings Twin (Version 2)

Stand: 25.10.2026, 16:34 UTC. Status: Entwurf, wartet auf Entscheidung von Chris (Gate POC Approval).
Ersetzt: `CTR-settings-rebriefing--20261025-1621.md` (Version 1, bleibt erhalten).

Änderungen gegenüber Version 1:

- Die Agenten-Anbindung von Claude ist jetzt Hauptmodul (M1).
- iPhones und iPads laufen über die Geräteverwaltung von Google Workspace.
- GAM, Chrome Enterprise Core und Strato sind neu im Scope.
- ChatGPT ist von "gering" auf "mittel, abhängig vom Plan" korrigiert.
- Die Einstufungen in Version 1 waren größtenteils ungeprüfte Annahmen. Recherchiert war nur das Thema Skills. Abschnitt 6 zeigt jetzt je Aussage den Prüfstand.

## 1. Auftrag

Das Vorhaben liefert drei Ergebnisse gleichzeitig:

1. **Plugin.** Es liest Einstellungen aus, gleicht sie ab und berichtet. Es läuft auf Abruf und als Routine.
2. **Digital Twin.** Eine strukturierte Darstellung aller erfassten Einstellungen und Schalter, je Eintrag mit SOLL-Wert und IST-Wert.
3. **IST-Abgleich.** Das Plugin liest die IST-Werte aus und vergleicht sie mit dem SOLL und mit dem letzten Lauf. Es berichtet die Abweichungen und den Gesamtstand.

Dazu kommen:

- **Hauptmodul Agenten-Anbindung Claude.**
- **Privacy-Modul.** Optional im Plugin, in diesem Lauf eingeschaltet.
- **Agenten-Anbindung** der übrigen Plattformen.

## 2. Scope und Erfassungsweg

Erfassungsarten:

- **A lokal:** Claude Code liest Dateien und Systemeinstellungen auf dem Gerät.
- **B Admin/API:** Lesen über Google-Admin-Schnittstellen, GAM oder einen Connector.
- **C Export:** Chris fordert einen Datenexport an, das Plugin verarbeitet ihn.
- **D geführt:** Das Plugin gibt eine Screenshot-Checkliste vor, Chris macht die Bilder.
- **E Browser (optional):** Das Plugin liest Seiten in Chris' bereits eingeloggtem Chrome. Der Agent loggt sich nie selbst ein.

| Objekt | Weg | Automatisierung | Grundlage |
|---|---|---|---|
| Claude (Chat, Cowork, Desktop, Code, Agenten-Anbindung) | A, B, C, D | hoch für Anbindung, mittel für UI-Schalter | Code und Desktop als Dateien. Plugins, Connectoren, Skills und Routinen sind über Claude-Code-Werkzeuge auflistbar. Chat- und Cowork-Schalter nur in der App. |
| CMG1, CMG2, CMG3 | A, B | hoch | Lokale Dateien und Systembefehle. Zusätzlich Geräteinventar über Workspace, falls die Geräte dort registriert sind. Betriebssystem unbekannt. |
| iPad 1 und 2, iPhone 1 und 2 | B, D | mittel bis hoch | Workspace-Geräteverwaltung: SOLL als Richtlinie setzen, Inventar und Status über Admin-Konsole oder GAM lesen. Gerätschalter außerhalb der Richtlinien bleiben bei D. |
| Google Workspace (Admin) | B | hoch nach Einrichtung | GAM liest Nutzer, Mobilgeräte, Chrome-Browser, Chrome-Richtlinien, Drive-Freigaben. Die Cloud Identity Policy API listet Admin-Einstellungen. |
| Google Drive | B | hoch | Drive-Connector und GAM lesen Freigaben und Eigentümer. |
| Google-Konto (persönlich) | D, E, C | gering bis mittel | Aktivitätseinstellungen und Drittanbieter-Zugriffe nur in der Kontoseite. Takeout für Daten. |
| Chrome | A, B | hoch | Chrome Enterprise Core (kostenlos, in der Admin-Konsole) meldet je Browser Version, Erweiterungen und Richtlinien. Lokal zusätzlich die Profildateien. |
| Strato | A, D | mittel | Öffentliche DNS-Einträge (MX, SPF, DKIM, DMARC) sind von jedem Gerät lesbar. Für Kundenkonto-Einstellungen ist keine Lese-API gefunden. |
| ChatGPT | C, D, B | mittel, abhängig vom Plan | Export für Chats. Business-Admin-Panel steuert Connectoren und GPTs. Die Compliance API (Chats, Memories, GPT-Konfiguration) ist nur für Enterprise belegt. |
| Littlebird | B, D | mittel | Connector liest Routinen und Meetings. Einstellungen in der App. |
| Gemini | C, D, E, B | gering bis mittel | Einstellungen im Google-Konto, Workspace-Admin steuert Gemini-Zugriff. Takeout-Umfang ungeprüft. |
| Manus | C, D, E | gering | Skills als Ordner bestätigt. Export und Einstellungszugriff ungeprüft. |

## 3. Vorgeschlagene Grundsätze

1. Das Plugin läuft in Claude Code. Cowork ist zweiter Kanal, sobald geprüft ist, dass das Plugin dort läuft.
2. Das Plugin liest nur. Änderungen schlägt es vor, Chris setzt sie um.
3. Wo Workspace eine Richtlinie erzwingen kann, wird der SOLL-Wert dort gesetzt. Der Twin prüft dann die Einhaltung. Das gilt für iOS-Geräte und Chrome.
4. Geheimnisse erfasst das Plugin nur mit Ablageort, nie mit Wert.
5. Chat-Inhalte werden prozessual aufbereitet und nicht inhaltlich bewertet. Sie gehen nie in Memory.
6. Aus PR #2 werden Sammelskript, Systemprompt und Prüfliste übernommen. Die Managed-Agent-Dateien bleiben im Repo und werden als abgelöst markiert. Löschen darf nur Chris.

## 4. Module

| Nr. | Modul | Inhalt | Ergebnis |
|---|---|---|---|
| M0 | Governance | Scope, Rollen, Gates, Namensregel, Register, Grenzen | Rebriefing, Gate-Dokumente |
| **M1** | **Hauptmodul: Agenten-Anbindung Claude** | Je Oberfläche (Chat, Cowork, Desktop, Code, Claude in Chrome, Claude in Slack): Connectoren und MCP-Server, Plugins, Skills, Routinen und Zeitpläne, Projekte, Berechtigungen, Hooks, Identitäten cg@ und manus@ mit Rollen. Prüfung Regel 5.5: Chris nie ausgesperrt. | Anbindungs-Twin Claude, Abweichungsbericht |
| M2 | Twin-Modell und SOLL-Katalog | Datenmodell: Objekt, Bereich, Einstellung, Typ, SOLL, IST, Quelle, Erfassungsart, Datum, Schutzklasse. Katalog aller Einstellungen je Objekt. | Schema, Katalog je Objekt |
| M3 | Erfassungs-Adapter | ein Adapter je Objekt und Erfassungsart, mit Schwärzung von Geheimnissen. Darin GAM-Adapter für Workspace, Mobilgeräte, Chrome und Drive. | Snapshot je Lauf und Objekt |
| M4 | Abgleich und Report | IST gegen SOLL, IST gegen letzten Lauf, Gesamtstand | Twin-Datei, Abweichungsbericht |
| M5 | Verbesserungen | gerankte Vorschläge mit Klickpfad, Aufwand, Risiko, Kennzeichnung "gelbe Linie" | Verbesserungsliste |
| M6a | Privacy-Struktur | Freigaben, Projektstrukturen, Routinen, Drittzugriffe, Schalter für Training, Memory und Aufbewahrung | Privacy-Report Teil 1 |
| M6b | Privacy-Chats | Exporte von Claude, ChatGPT, Gemini, Manus einsammeln. Einheitliches Format: Plattform, Datum, Projekt, Titel, Umfang, Anhänge. Index, sensible Kategorien markiert. | Chat-Index im Data-Ordner, Privacy-Report Teil 2 |
| M7 | Agenten-Anbindung übrige Plattformen | ChatGPT, Gemini, Manus, Littlebird: Connectoren, GPTs, Routinen, Drittzugriffe | Anbindungs-Inventar |
| M8 | Skills plattformübergreifend | Inventar der Skills in Claude, ChatGPT, Manus. Abgleich mit einer zentralen Quelle. | Skill-Records, Drift-Bericht |
| M9 | Betrieb | Routine je Gerät für lokale Quellen, Cloud-Routine für Admin- und Connector-Quellen, Ablage in Drive, Eintrag in Register 2 | laufende Routine (nach Freigabe) |

## 5. Skills von Manus und ChatGPT

Befund:

- Agent Skills ist ein offener Standard: ein Ordner mit `SKILL.md`, dazu optional Skripte und Referenzdateien. Claude nutzt ihn nativ.
- Manus hat den Standard nach eigener Aussage übernommen. Skills liegen dort als Ordner in der Sandbox und sind bearbeitbar.
- OpenAI unterstützt Skills nativ in Codex. In ChatGPT ist die Unterstützung laut Sekundärquellen Beta und nicht in allen Plänen verfügbar.

Vorschlag zur Einbindung:

1. Der Twin erfasst jeden installierten Skill je Plattform als eigenen Eintrag: Name, Quelle, Stand, Plattform.
2. Jeder Skill hat genau eine Quelle (SSOT im Vault oder Repo). Die Plattformen erhalten Kopien. Der Abgleich zeigt, wo eine Kopie veraltet ist.
3. Die Erfassungslogik des Plugins wird selbst als Skill gebaut. Dann kann dieselbe Anleitung auch in Manus oder ChatGPT laufen. Ob beide ihre eigenen Einstellungen auslesen können, ist ungeprüft.
4. Fremde Skills sind Anweisungen an einen Agenten. Vor Übernahme prüft das Plugin Skripte und Text auf Risiken.

## 6. Prüfstand der Aussagen

| Aussage | Stand | Quelle |
|---|---|---|
| Workspace verwaltet iOS-Geräte mit Richtlinien (erweiterte Verwaltung braucht ein Apple-Push-Zertifikat) | recherchiert | [Google: Apply settings for iOS devices](https://knowledge.workspace.google.com/admin/devices/apply-settings-for-ios-devices), [Google: Advanced mobile management](https://support.google.com/a/answer/7396025) |
| Welche Workspace-Edition die erweiterte Mobilverwaltung enthält | offen | Edition von colognemusicgroup.com unbekannt |
| GAM liest Mobilgeräte, Chrome-Browser, Chrome-Richtlinien, Drive-Dateien | recherchiert (Wiki-Seiten gefunden, Befehle für Mobilgeräte und Drive-Freigaben nicht im Detail gelesen) | [GAM Mobile Devices](https://github.com/taers232c/GAMADV-XTD3/wiki/Mobile-Devices), [GAM Chrome Policies](https://github.com/GAM-team/GAM/wiki/Chrome-Policies), [GAM Browser Cloud Management](https://github.com/taers232c/GAMADV-XTD3/wiki/Chrome-Browser-Cloud-Management), [GAM Users Drive Files](https://github.com/taers232c/GAMADV-XTD3/wiki/Users-Drive-Files) |
| Cloud Identity Policy API listet Admin-Einstellungen, 1 Abfrage pro Sekunde | recherchiert | [Google: Listing and getting policies](https://docs.cloud.google.com/identity/docs/how-to/list-get-policies) |
| Chrome Enterprise Core ist kostenlos und meldet Version, Erweiterungen, Richtlinien je Browser | recherchiert | [Google: Set up Chrome Enterprise Core](https://support.google.com/chrome/a/answer/9301421), [Google: Manage extensions](https://support.google.com/chrome/a/answer/9116814) |
| Strato hat keine Lese-API für Kundenkonto-Einstellungen | recherchiert, kein Treffer (nur DynDNS-Update gefunden) | [Netgate-Forum zu Strato DynDNS](https://forum.netgate.com/post/1022631) |
| Ob Strato Domain, DNS oder Mail für colognemusicgroup.com hostet | offen | DNS-Abfrage aus dieser Sitzung blockiert |
| ChatGPT Compliance API nur für Enterprise belegt | recherchiert | [OpenAI: Tools for ChatGPT Enterprise](https://openai.com/index/new-tools-for-chatgpt-enterprise) |
| ChatGPT Business: Admin steuert Connectoren und Dritt-GPTs | recherchiert | [OpenAI Academy: Feature controls](https://academy.openai.com/public/clubs/admins-6o6xf/resources/feature-controls-and-integrations-with-your-tools) |
| ChatGPT-Plan von Chris | offen | |
| Manus unterstützt Agent Skills | recherchiert (Herstellerangabe) | [Manus Docs](https://manus.im/docs/en/features/skills), [Manus Blog](https://www.manus.im/blog/manus-skills) |
| ChatGPT unterstützt Skills (Beta) | recherchiert (nur Sekundärquellen) | [handsonai.info](https://handsonai.info/platforms/openai/skills/), [devtoollab.com](https://devtoollab.com/blog/agent-skills-open-standard-guide) |
| Web-Einstellungen von Claude, Gemini, Manus, Littlebird ohne Lese-API | Annahme, ungeprüft | M3 prüft je Plattform |
| Exportumfang von Claude, Gemini (Takeout), Manus | Annahme, ungeprüft | M3 prüft je Plattform |

## 7. Grenzen

- Workspace-Admin und GAM brauchen Admin-Rechte. Die Agent-Identität manus@ ist Content Manager. Option 1: GAM läuft unter cg@ auf einem CMG, Chris startet es. Option 2: ein Nur-Lese-Dienstkonto, das Chris freigibt. Beides ist eine gelbe Linie.
- iOS-Schalter außerhalb der Workspace-Richtlinien bleiben bei Screenshots.
- Lokale Routinen laufen nur, wenn das Gerät eingeschaltet ist.
- Datenexporte fordert Chris selbst an, weil sie einen Login brauchen.

## 8. Phasen und Gates

| Phase | Umfang | Gate |
|---|---|---|
| POC | M1 Agenten-Anbindung Claude, CMG2, Chrome lokal, Drive, Privacy M6a und M6b für Claude | POC Approval |
| Test | Workspace über GAM, Chrome Enterprise Core, iOS über Workspace, CMG1 und CMG3, Strato DNS, ChatGPT, Littlebird | GO FOR TEST |
| Ausbau | Gemini, Manus, Google-Konto, Skills-Abgleich M8 | GO FOR IMPLEMENTATION |
| Betrieb | Routinen je Gerät und in der Cloud | ACTIVE plus Freigabe des Zeitplans |

## 9. Offene Entscheidungen für Chris

1. Betriebssystem von CMG1, CMG2, CMG3.
2. Workspace-Edition und ChatGPT-Plan.
3. GAM: unter cg@ von Chris gestartet, oder Nur-Lese-Dienstkonto?
4. iOS und Chrome über Workspace verwalten: ja oder nein? Das ändert Gerätezustände und ist eine gelbe Linie.
5. Was hostet Strato: Domain, DNS, Mail, Webspace?
6. SOLL-Werte. Vorschlag: Das Plugin schlägt SOLL-Werte aus Best Practice vor, Chris bestätigt, danach gelten sie als verifiziert.
7. Ablage: Drive-Topic-Ordner und Navigator-Eintrag. Ist Domain CTR richtig?
8. Browser-Erfassung E mit Chris' eingeloggtem Chrome: erlaubt oder nicht?
9. Chat-Inhalte: welche Plattformen, welcher Zeitraum, welcher Zielordner?
10. Rhythmus der Routine.

## 10. Zusätzliche Idee (nicht Teil des Auftrags)

Littlebird erfasst bereits Bildschirminhalte. Damit könnte Littlebird Einstellungsseiten passiv mitlesen, ohne eigene Screenshots. Das wirft eigene Datenschutzfragen auf und gehört erst nach dem POC auf den Tisch.
