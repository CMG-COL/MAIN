# cg-settings-twin

A Claude Managed Agent that reads the Claude Chat, Cowork, Desktop and Code settings on one machine, writes a digital twin of them, and suggests improvements. It only reads. It never changes a setting.

## How it works

| Part | Where it runs | What it does |
|---|---|---|
| `collect_settings.py` | CMG2 | Copies Claude Code and Desktop settings files into `snapshots/<STAMP>/`, replaces secrets with `<redacted>`, records missing files. No network. |
| Screenshots | CMG2, by Chris | Chat (claude.ai) and Cowork settings exist only in the app. Chris saves screenshots of each settings page into the snapshot folder. |
| Worker (inside `run_audit.py`) | CMG2 | Runs the agent's file tools on CMG2. Settings files never leave the machine; only what the agent reads goes to Anthropic. |
| Agent `cg-settings-twin` | Anthropic | Reads the snapshot, checks current Claude docs, writes the twin and the improvement list. Bash is off, so it can only read and write inside the work folder. |
| Outcome grader | Anthropic | Checks the result against `rubric.md` and sends it back for up to 3 revisions. |

Outputs land in `~/CGOS/settings-twin/outputs/` on CMG2:

- `CTR-settings-digitaltwin--<STAMP>.json` and `.md`: the twin, with a diff against the previous run.
- `CTR-settings-improvements--<STAMP>.md`: ranked suggestions with click paths, effort and a yellow-line flag.

## One-time setup on CMG2 (about 30 minutes)

Requires macOS or Linux. On Windows the worker needs WSL, because it calls `/bin/bash`.

1. Install the tools: `pip install anthropic`, and the `ant` CLI 1.30.0 or later (`brew install anthropics/tap/ant`).
2. Sign in: `ant auth login`. Make sure `ANTHROPIC_API_KEY` is not set, or it overrides the login.
3. Create the agent and the environment from this folder:
   ```sh
   ant apply --dry-run -v agents/cg-settings-twin.md environments/cg-settings-twin-cmg2.yaml
   ant apply agents/cg-settings-twin.md environments/cg-settings-twin-cmg2.yaml
   ```
   Keep the new `claude-lock.json`; it holds the IDs.
4. In the Console, open the environment `cg-settings-twin-cmg2` and click "Generate environment key". Store it in the Keychain:
   ```sh
   security add-generic-password -s cg-twin-env-key -a cmg2 -w
   ```
5. Add to `~/.zshrc` (IDs from `claude-lock.json`):
   ```sh
   export CG_TWIN_AGENT_ID=agent_...
   export CG_TWIN_ENV_ID=env_...
   export ANTHROPIC_ENVIRONMENT_KEY="$(security find-generic-password -s cg-twin-env-key -w)"
   ```

## Each run (about 15 minutes of your time)

```sh
python3 run_audit.py --machine CMG2 --workdir ~/CGOS/settings-twin
```

1. The script collects the settings files and prints the snapshot folder.
2. Save screenshots of every settings page into `screenshots/chat`, `screenshots/cowork` and `screenshots/desktop` in that folder, then press Enter.
3. The agent runs. The script prints a Console link to watch it. If the agent asks for approval, answer `y` or `n`; Enter alone means no.
4. When it finishes, the results are in `outputs/`.

## CMG1, CMG3 and cloud

Each machine gets its own environment file (`environments/cg-settings-twin-cmg1.yaml`, `...-cmg3.yaml`) and its own environment key, because a session goes to whichever worker polls its environment. The agent stays shared.
