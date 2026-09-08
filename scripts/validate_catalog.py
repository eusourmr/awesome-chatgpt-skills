#!/usr/bin/env python3
"""Validate catalog.json and report repository health."""
from __future__ import annotations

import argparse
import json
import sys
from collections import Counter
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "catalog.json"
PROGRESS = ROOT / "PROGRESS.md"
REQUIRED = {
    "id", "name", "category", "status", "rating", "reviews",
    "last_verified", "compatibility", "publisher", "source"
}
ALLOWED_STATUS = {"official", "verified", "community", "draft"}
ALLOWED_COMPAT = {"ChatGPT", "Codex", "Agents SDK"}
EVIDENCE_TIERS = ["indexed", "source-checked", "tested", "recommended"]


def load() -> dict:
    return json.loads(CATALOG.read_text(encoding="utf-8"))


def parse_date(value: object, where: str, errors: list[str]) -> date | None:
    if not isinstance(value, str):
        errors.append(f"{where} must be YYYY-MM-DD")
        return None
    try:
        return date.fromisoformat(value)
    except ValueError:
        errors.append(f"{where} must be YYYY-MM-DD")
        return None


def validate(data: dict) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []
    if data.get("schema_version") != 2:
        errors.append("schema_version must be 2")

    evidence = data.get("evidence_model")
    if not isinstance(evidence, dict):
        errors.append("evidence_model must be an object")
    else:
        if evidence.get("tiers") != EVIDENCE_TIERS:
            errors.append(f"evidence_model.tiers must be {EVIDENCE_TIERS}")
        bundled_cards = evidence.get("bundled_cards")
        if not isinstance(bundled_cards, str) or not bundled_cards:
            errors.append("evidence_model.bundled_cards must be a repository-relative path")
        elif not (ROOT / bundled_cards).is_file():
            errors.append(f"evidence_model.bundled_cards missing: {bundled_cards}")
        if evidence.get("trust_claim_policy") != "evidence-not-popularity":
            errors.append("evidence_model.trust_claim_policy must be evidence-not-popularity")

    entries = data.get("entries")
    if not isinstance(entries, list) or not entries:
        return [*errors, "entries must be a non-empty array"], warnings

    ids: set[str] = set()
    names: set[str] = set()
    for i, entry in enumerate(entries):
        where = f"entries[{i}]"
        if not isinstance(entry, dict):
            errors.append(f"{where} must be an object")
            continue
        missing = REQUIRED - entry.keys()
        if missing:
            errors.append(f"{where} missing: {', '.join(sorted(missing))}")
            continue
        if entry["id"] in ids:
            errors.append(f"duplicate id: {entry['id']}")
        ids.add(entry["id"])
        folded = str(entry["name"]).casefold()
        if folded in names:
            errors.append(f"duplicate name: {entry['name']}")
        names.add(folded)

        if entry["status"] not in ALLOWED_STATUS:
            errors.append(f"{where}.status must be one of {sorted(ALLOWED_STATUS)}")
        rating = entry["rating"]
        if not isinstance(rating, (int, float)) or isinstance(rating, bool) or not 0 <= rating <= 5:
            errors.append(f"{where}.rating must be a number from 0 to 5")
        reviews = entry["reviews"]
        if not isinstance(reviews, int) or isinstance(reviews, bool) or reviews < 0:
            errors.append(f"{where}.reviews must be a non-negative integer")
        compatibility = entry["compatibility"]
        if not isinstance(compatibility, list) or not compatibility:
            errors.append(f"{where}.compatibility must be a non-empty list")
        elif set(compatibility) - ALLOWED_COMPAT:
            errors.append(f"{where}.compatibility has unsupported values")
        verified = parse_date(entry["last_verified"], f"{where}.last_verified", errors)
        if verified and verified > date.today():
            warnings.append(f"{entry['id']} has a future last_verified date")

        local_path = entry.get("path")
        if local_path:
            skill_dir = ROOT / local_path
            skill_file = skill_dir / "SKILL.md"
            if not skill_file.is_file():
                errors.append(f"{entry['id']} missing {skill_file.relative_to(ROOT)}")
            elif not skill_file.read_text(encoding="utf-8").startswith("---\n"):
                errors.append(f"{skill_file.relative_to(ROOT)} must start with YAML frontmatter")

    stats = data.get("review_stats", {})
    if isinstance(stats, dict):
        accepted = stats.get("accepted")
        if accepted != len(entries):
            warnings.append("review_stats.accepted does not match catalog entry count")
        review_cycle = parse_date(stats.get("last_review_cycle"), "review_stats.last_review_cycle", errors)
        if review_cycle and review_cycle > date.today():
            warnings.append("review_stats.last_review_cycle is in the future")
    return errors, warnings


def health(data: dict) -> dict:
    today = date.today()
    stale_after = int(data.get("generated_policy", {}).get("stale_after_days", 90))
    entries = data["entries"]
    status = Counter(e["status"] for e in entries)
    stale = []
    unrated = []
    for e in entries:
        verified = date.fromisoformat(e["last_verified"])
        if (today - verified).days > stale_after:
            stale.append(e["id"])
        if e.get("rating_state") == "unrated" or (e["rating"] == 0 and e["reviews"] == 0):
            unrated.append(e["id"])
    official_openai = sum(1 for e in entries if e["status"] == "official" and e["publisher"] == "OpenAI")
    reviewed_at = data.get("review_stats", {}).get("last_review_cycle")
    if not isinstance(reviewed_at, str):
        reviewed_at = max(e["last_verified"] for e in entries)
    return {
        "total": len(entries),
        "official": status["official"],
        "official_openai": official_openai,
        "verified": status["verified"],
        "community": status["community"],
        "draft": status["draft"],
        "stale": len(stale),
        "stale_ids": stale,
        "unrated": len(unrated),
        "rejected_recorded": int(data.get("review_stats", {}).get("rejected_recorded", 0)),
        "catalog_schema": data.get("schema_version"),
        "evidence_tiers": data.get("evidence_model", {}).get("tiers", []),
        "updated": reviewed_at,
    }


def render_progress(h: dict) -> str:
    ddmmyyyy = date.fromisoformat(h["updated"]).strftime("%d/%m/%Y")
    return f"""# Repository Progress\n\n> Generated by `scripts/validate_catalog.py --write-progress`. Do not edit the metrics manually.\n\n| Metric | Count |\n|---|---:|\n| Total de Skills | **{h['total']}** |\n| Skills Oficiais da OpenAI | **{h['official_openai']}** |\n| Skills Verificadas (curadoria governada) | **{h['verified']}** |\n| Skills da Comunidade | **{h['community']}** |\n| Skills em rascunho | **{h['draft']}** |\n| Desatualizadas (>90 dias) | **{h['stale']}** |\n| Rejeições registradas | **{h['rejected_recorded']}** |\n| Última atualização | **{ddmmyyyy}** |\n\n## Interpretação\n\n`Official` significa autoria/publicação pela OpenAI e fonte verificada. `Verified` significa que a skill passou pelos gates editoriais deste repositório. `Community` identifica autoria de terceiros. O catálogo não confunde presença em uma coleção oficial com endosso da OpenAI a este repositório. A Trust Layer usa estados de evidência separados; popularidade não eleva automaticamente uma skill para `tested` ou `recommended`.\n"""


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--json", action="store_true", help="print health report as JSON")
    parser.add_argument("--write-progress", action="store_true", help="rewrite PROGRESS.md")
    args = parser.parse_args()
    try:
        data = load()
    except (OSError, json.JSONDecodeError) as exc:
        print(f"catalog error: {exc}", file=sys.stderr)
        return 1
    errors, warnings = validate(data)
    if errors:
        print("Catalog validation failed:", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1
    h = health(data)
    if args.write_progress:
        PROGRESS.write_text(render_progress(h), encoding="utf-8")
    if args.json:
        print(json.dumps({"health": h, "warnings": warnings}, indent=2))
    else:
        print("Repository health")
        print(f"- Catalog schema: {h['catalog_schema']}")
        print(f"- Evidence tiers: {', '.join(h['evidence_tiers'])}")
        print(f"- Total skills: {h['total']}")
        print(f"- OpenAI official: {h['official_openai']}")
        print(f"- Verified: {h['verified']}")
        print(f"- Community: {h['community']}")
        print(f"- Draft: {h['draft']}")
        print(f"- Stale: {h['stale']}")
        print(f"- Unrated: {h['unrated']}")
        print(f"- Rejections recorded: {h['rejected_recorded']}")
        for warning in warnings:
            print(f"warning: {warning}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())