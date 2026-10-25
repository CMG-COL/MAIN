"""One run of the settings twin on this machine: collect, start the local worker, run the session, stop.

Needs, set once per machine (see README.md):
  CG_TWIN_AGENT_ID           agent ID from claude-lock.json
  CG_TWIN_ENV_ID             this machine's environment ID from claude-lock.json
  ANTHROPIC_ENVIRONMENT_KEY  environment key generated in the Console for that environment
and an `ant auth login` profile for the session calls.

Usage: python3 run_audit.py --machine CMG2 --workdir ~/CGOS/settings-twin [--snapshot 20261017-0930]
"""

import argparse
import asyncio
import os
import subprocess
import sys
import threading
from pathlib import Path

import anthropic
from anthropic.lib.environments import EnvironmentWorker

HERE = Path(__file__).resolve().parent


def start_worker(workdir: Path) -> tuple[threading.Thread, callable]:
    """Run EnvironmentWorker in a background thread; return the thread and a stop function."""
    state: dict = {}
    ready = threading.Event()

    async def serve() -> None:
        key = os.environ["ANTHROPIC_ENVIRONMENT_KEY"]
        async with anthropic.AsyncAnthropic(auth_token=key) as client:
            worker = EnvironmentWorker(
                client,
                environment_id=os.environ["CG_TWIN_ENV_ID"],
                environment_key=key,
                workdir=str(workdir),
            )
            state["loop"] = asyncio.get_running_loop()
            state["task"] = asyncio.current_task()
            ready.set()
            await worker.run()

    def target() -> None:
        try:
            asyncio.run(serve())
        except asyncio.CancelledError:
            pass  # cancelled on purpose: the worker finished its in-flight item first

    thread = threading.Thread(target=target, daemon=True)
    thread.start()
    ready.wait(timeout=30)

    def stop() -> None:
        if "task" in state:
            state["loop"].call_soon_threadsafe(state["task"].cancel)
        thread.join(timeout=60)

    return thread, stop


def ask_owner(event) -> bool:
    """A paused tool call waits for Chris. Anything but 'y' denies it."""
    print(f"\n[approval needed] {event.name}: {event.input}")
    return input("Allow this call? (y/N) ").strip().lower() == "y"


def run_session(client: anthropic.Anthropic, machine: str, stamp: str) -> None:
    session = client.beta.sessions.create(
        agent=os.environ["CG_TWIN_AGENT_ID"],
        environment_id=os.environ["CG_TWIN_ENV_ID"],
        title=f"Settings twin {machine} {stamp}",
    )
    print(
        f"Watch live: https://platform.claude.com/workspaces/default/sessions/{session.id}"
    )

    rubric = (HERE / "rubric.md").read_text(encoding="utf-8")
    with client.beta.sessions.events.stream(session_id=session.id) as stream:
        # Stream first, then kick off, so no early event is missed.
        client.beta.sessions.events.send(
            session_id=session.id,
            events=[
                {
                    "type": "user.define_outcome",
                    "description": (
                        f"Build the settings digital twin for {machine} from snapshots/{stamp}/ "
                        f"and write the three output files with STAMP={stamp}."
                    ),
                    "rubric": {"type": "text", "content": rubric},
                    "max_iterations": 3,
                }
            ],
        )
        for event in stream:
            if event.type == "agent.message":
                for block in event.content:
                    if block.type == "text":
                        print(block.text, end="", flush=True)
            elif event.type == "agent.tool_use" and event.evaluated_permission == "ask":
                client.beta.sessions.events.send(
                    session_id=session.id,
                    events=[
                        {
                            "type": "user.tool_confirmation",
                            "tool_use_id": event.id,
                            "result": "allow" if ask_owner(event) else "deny",
                        }
                    ],
                )
            elif event.type == "span.outcome_evaluation_end":
                print(f"\n[grader] iteration {event.iteration}: {event.result}")
            elif event.type == "session.status_idle":
                if event.stop_reason.type != "requires_action":
                    break
            elif event.type == "session.status_terminated":
                break


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--machine", required=True)
    parser.add_argument("--workdir", required=True, type=Path)
    parser.add_argument(
        "--snapshot",
        help="reuse an existing snapshot folder instead of collecting a new one",
    )
    args = parser.parse_args()
    workdir = args.workdir.expanduser()

    stamp = args.snapshot
    if not stamp:
        out = subprocess.run(
            [
                sys.executable,
                str(HERE / "collect_settings.py"),
                "--machine",
                args.machine,
                "--workdir",
                str(workdir),
            ],
            check=True,
            capture_output=True,
            text=True,
        ).stdout
        print(out)
        stamp = out.strip().splitlines()[-1].removeprefix("SNAPSHOT=")
        input("Add the screenshots now, then press Enter to start the agent. ")

    _, stop_worker = start_worker(workdir)
    try:
        run_session(anthropic.Anthropic(), args.machine, stamp)
    finally:
        stop_worker()
    print(f"\nResults: {workdir / 'outputs'}")


if __name__ == "__main__":
    main()
