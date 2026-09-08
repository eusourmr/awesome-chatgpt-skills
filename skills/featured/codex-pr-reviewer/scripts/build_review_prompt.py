#!/usr/bin/env python3
"""Build a deterministic Codex PR review prompt from JSON business rules."""
from __future__ import annotations
import argparse, json
from pathlib import Path

SEVERITIES = {"blocker", "warning", "advisory"}

def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("rules")
    p.add_argument("--output", default=".codex-review-prompt.md")
    args = p.parse_args()
    data = json.loads(Path(args.rules).read_text(encoding="utf-8"))
    rules = data.get("rules")
    if not isinstance(rules, list) or not rules:
        raise SystemExit("rules must be a non-empty array")
    lines = ["Review the current pull request. Focus on changed behavior and high-confidence defects.", "", "Business rules:"]
    seen = set()
    for rule in rules:
        rid, sev, text = rule.get("id"), rule.get("severity"), rule.get("rule")
        if not rid or rid in seen or sev not in SEVERITIES or not text:
            raise SystemExit(f"invalid rule: {rule}")
        seen.add(rid)
        lines.append(f"- [{sev.upper()}] {rid}: {text}")
    lines += ["", "For each finding cite the file/line, violated rule, impact, and smallest safe fix. Do not invent issues outside the diff."]
    Path(args.output).write_text("\n".join(lines)+"\n", encoding="utf-8")
    print(args.output)
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
