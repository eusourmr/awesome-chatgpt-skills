#!/usr/bin/env python3
"""Create a minimal OpenAI Agents SDK starter project."""
from __future__ import annotations
import argparse
from pathlib import Path

APP = '''import asyncio\nfrom agents import Agent, Runner\n\nagent = Agent(\n    name={name!r},\n    instructions="""Be useful, concise, and explicit about uncertainty.\nDo not take side-effecting actions without the authorization required by the application.""",\n)\n\nasync def main() -> None:\n    result = await Runner.run(agent, "Introduce yourself and describe your role.")\n    print(result.final_output)\n\nif __name__ == "__main__":\n    asyncio.run(main())\n'''
README = '''# {name}\n\nGenerated with `openai-agents-sdk-builder`.\n\n## Run\n\n```bash\npython -m venv .venv\n# activate the virtual environment\npip install -r requirements.txt\nexport OPENAI_API_KEY=...\npython app.py\n```\n\nBefore production, add typed tools, authorization, tracing review, tests, and explicit failure handling.\n'''

def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("target")
    p.add_argument("--name", default="Assistant")
    p.add_argument("--force", action="store_true")
    args = p.parse_args()
    root = Path(args.target).resolve()
    if root.exists() and any(root.iterdir()) and not args.force:
        raise SystemExit("target is not empty; use --force to overwrite generated files")
    root.mkdir(parents=True, exist_ok=True)
    files = {
        "app.py": APP.format(name=args.name),
        "requirements.txt": "openai-agents\n",
        ".env.example": "OPENAI_API_KEY=\n",
        "README.md": README.format(name=args.name),
    }
    for rel, content in files.items():
        (root / rel).write_text(content, encoding="utf-8")
    print(f"Created {len(files)} files in {root}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
