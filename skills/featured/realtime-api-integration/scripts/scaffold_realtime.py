#!/usr/bin/env python3
"""Scaffold a transport-neutral Realtime API starter plan."""
from __future__ import annotations
import argparse
import json
from pathlib import Path

SERVER = '''import OpenAI from "openai";\nimport express from "express";\n\nconst app = express();\napp.use(express.json({ limit: "1mb" }));\nconst client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });\n\napp.post("/api/realtime/call", async (req, res) => {\n  if (!req.body?.sdp) return res.status(400).json({ error: "missing sdp" });\n  const response = await client.realtime.calls.create({\n    sdp: req.body.sdp,\n    session: { type: "realtime", model: process.env.REALTIME_MODEL || "{model}" }\n  });\n  res.type("application/sdp").send(await response.text());\n});\n\napp.listen(process.env.PORT || 3000);\n'''
PLAN = {
  "browser_primary": "WebRTC through an application server call-creation endpoint",
  "server_primary": "WebSocket using server-held OPENAI_API_KEY",
  "fallback": "On browser WebRTC establishment failure, route the user to an application-controlled server session; never send a long-lived API key to the browser.",
  "reconnect": "Use bounded retries with jitter and do not replay ambiguous side effects.",
}

def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("target")
    p.add_argument("--model", default="gpt-realtime-2.1")
    args = p.parse_args()
    root = Path(args.target).resolve(); root.mkdir(parents=True, exist_ok=True)
    (root / "server.mjs").write_text(SERVER.format(model=args.model), encoding="utf-8")
    (root / "package.json").write_text(json.dumps({"type":"module","dependencies":{"express":"latest","openai":"latest"}}, indent=2)+"\n", encoding="utf-8")
    (root / ".env.example").write_text(f"OPENAI_API_KEY=\nREALTIME_MODEL={args.model}\nPORT=3000\n", encoding="utf-8")
    (root / "transport-plan.json").write_text(json.dumps(PLAN, indent=2)+"\n", encoding="utf-8")
    print(f"Realtime starter created in {root}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
