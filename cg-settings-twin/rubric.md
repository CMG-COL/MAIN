# Settings twin rubric (starter, tune after the first run)

- `outputs/` holds three new files named `CTR-settings-digitaltwin--<STAMP>.json`, `CTR-settings-digitaltwin--<STAMP>.md` and `CTR-settings-improvements--<STAMP>.md`, where `<STAMP>` equals the snapshot folder name.
- The JSON file parses and every record has all ten fields: id, surface, section, name, type, value, source, captured_at, machine, notes.
- Every source in `manifest.json` with status `found` and every screenshot file appears as the `source` of at least one record, or is listed under `unreadable_sources`.
- Every record's `surface` is one of chat, cowork, desktop, code, and all four surfaces appear, or the missing surface is named in `unreadable_sources`.
- No output contains a string that looks like a secret (for example `sk-ant-`, `ghp_`, `xoxb-`, `Bearer `); such values appear only as `<redacted>`.
- Values that could not be read are `"unknown"`; no value is invented.
- When an earlier twin exists in `outputs/`, the Markdown twin contains a diff section listing added, removed and changed record ids.
- Every improvement names the setting id, current value, proposed value, reason, a documentation URL fetched in the session, effort in minutes, risk, and a yellow-line flag.
- Improvements are ranked by benefit, and ideas that change no setting sit in a separate "Further ideas" section.
