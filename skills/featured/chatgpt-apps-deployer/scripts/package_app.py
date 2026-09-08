#!/usr/bin/env python3
"""Create a deterministic SHA-256 manifest for a ChatGPT app release."""
from __future__ import annotations
import argparse, hashlib, json
from pathlib import Path

SKIP = {".git", "node_modules", ".venv", "dist"}

def digest(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("root", nargs="?", default=".")
    p.add_argument("--output", default="dist/app-release-manifest.json")
    args = p.parse_args()
    root = Path(args.root).resolve(); out = (root / args.output).resolve()
    files = []
    for path in sorted(p for p in root.rglob("*") if p.is_file()):
        rel = path.relative_to(root)
        if path == out or any(part in SKIP for part in rel.parts):
            continue
        files.append({"path": rel.as_posix(), "sha256": digest(path), "bytes": path.stat().st_size})
    out.parent.mkdir(parents=True, exist_ok=True)
    payload = {"schema_version": 1, "root": root.name, "files": files}
    out.write_text(json.dumps(payload, indent=2)+"\n", encoding="utf-8")
    print(f"Wrote {out} with {len(files)} files")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
