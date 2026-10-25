"""Copy Claude settings files on this machine into a snapshot folder, with secrets redacted.

Runs locally, makes no network calls, and never prints a setting value.
Usage: python3 collect_settings.py --machine CMG2 --workdir ~/CGOS/settings-twin
"""

import argparse
import json
import os
import platform
import re
import shutil
from datetime import datetime
from pathlib import Path

HOME = Path.home()
APPDATA = Path(os.environ.get("APPDATA", HOME / "AppData" / "Roaming"))

# Candidate locations per surface. Missing files are recorded, never guessed.
SOURCES = {
    "code": [
        HOME / ".claude" / "settings.json",
        HOME / ".claude" / "keybindings.json",
        HOME / ".claude" / "CLAUDE.md",
        HOME / ".claude.json",
        Path("/Library/Application Support/ClaudeCode/managed-settings.json"),
        Path("/etc/claude-code/managed-settings.json"),
        Path("C:/Program Files/ClaudeCode/managed-settings.json"),
    ],
    "desktop": [
        HOME
        / "Library"
        / "Application Support"
        / "Claude"
        / "claude_desktop_config.json",
        HOME / "Library" / "Application Support" / "Claude" / "config.json",
        APPDATA / "Claude" / "claude_desktop_config.json",
        APPDATA / "Claude" / "config.json",
    ],
}
# Directories listed by name only (installed plugins, skills, agents), never copied.
LISTINGS = {
    "code": [
        HOME / ".claude" / "plugins",
        HOME / ".claude" / "skills",
        HOME / ".claude" / "agents",
    ],
}

SECRET_KEY = re.compile(
    r"token|secret|password|passwd|api[_-]?key|auth|credential|cookie|session|bearer|private",
    re.I,
)
SECRET_VALUE = re.compile(
    r"(sk-ant-|sk-|ghp_|gho_|github_pat_|xox[abp]-|AKIA|Bearer\s|eyJ)[A-Za-z0-9._\-]{8,}"
)
REDACTED = "<redacted>"


def redact(node, parent_key=""):
    """Replace secret-looking values. Every value under an `env` or `headers` map is treated as secret."""
    if isinstance(node, dict):
        out = {}
        for key, value in node.items():
            if parent_key in ("env", "headers") or (
                SECRET_KEY.search(key) and not isinstance(value, (dict, list, bool))
            ):
                out[key] = REDACTED
            else:
                out[key] = redact(value, key)
        return out
    if isinstance(node, list):
        return [redact(item, parent_key) for item in node]
    if isinstance(node, str):
        return SECRET_VALUE.sub(REDACTED, node)
    return node


def summarize_claude_json(data):
    """~/.claude.json also holds per-project history; keep the settings, count the projects."""
    if isinstance(data, dict) and isinstance(data.get("projects"), dict):
        data = dict(data)
        data["projects"] = f"<{len(data['projects'])} project entries omitted>"
    return data


def copy_source(path: Path, dest_dir: Path) -> dict:
    entry = {"path": str(path)}
    if not path.exists():
        return entry | {"status": "missing"}
    try:
        dest = dest_dir / path.name.lstrip(".")
        if path.suffix == ".json":
            data = json.loads(path.read_text(encoding="utf-8"))
            if path.name == ".claude.json":
                data = summarize_claude_json(data)
            dest.write_text(
                json.dumps(redact(data), indent=2, ensure_ascii=False), encoding="utf-8"
            )
        else:
            dest.write_text(
                SECRET_VALUE.sub(REDACTED, path.read_text(encoding="utf-8")),
                encoding="utf-8",
            )
        return entry | {
            "status": "found",
            "copied_to": str(dest.relative_to(dest_dir.parent)),
        }
    except (OSError, ValueError) as exc:
        return entry | {"status": "error", "error": type(exc).__name__}


def list_names(path: Path, depth: int = 2) -> dict:
    if not path.is_dir():
        return {"path": str(path), "status": "missing"}
    names = sorted(
        str(p.relative_to(path))
        for p in path.rglob("*")
        if len(p.relative_to(path).parts) <= depth and not p.name.startswith(".")
    )
    return {"path": str(path), "status": "found", "names": names}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--machine", required=True, help="CMG1, CMG2 or CMG3")
    parser.add_argument("--workdir", required=True, type=Path)
    args = parser.parse_args()

    stamp = datetime.now().strftime("%Y%m%d-%H%M")
    snap = args.workdir.expanduser() / "snapshots" / stamp
    for sub in (
        "code",
        "desktop",
        "screenshots/chat",
        "screenshots/cowork",
        "screenshots/desktop",
    ):
        (snap / sub).mkdir(parents=True, exist_ok=True)
    (args.workdir.expanduser() / "outputs").mkdir(parents=True, exist_ok=True)

    manifest = {
        "machine": args.machine,
        "captured_at": datetime.now().astimezone().isoformat(timespec="minutes"),
        "os": f"{platform.system()} {platform.release()}",
        "sources": {
            s: [copy_source(p, snap / s) for p in paths] for s, paths in SOURCES.items()
        },
        "listings": {
            s: [list_names(p) for p in paths] for s, paths in LISTINGS.items()
        },
    }
    (snap / "manifest.json").write_text(
        json.dumps(manifest, indent=2), encoding="utf-8"
    )

    found = sum(
        e["status"] == "found"
        for entries in manifest["sources"].values()
        for e in entries
    )
    print(f"Snapshot {stamp}: {found} settings files copied to {snap}")
    print(
        "Next: add screenshots of the settings pages to screenshots/chat, screenshots/cowork, screenshots/desktop."
    )
    print(f"SNAPSHOT={stamp}")


if __name__ == "__main__":
    main()
