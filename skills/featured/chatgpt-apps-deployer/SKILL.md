---
name: chatgpt-apps-deployer
description: Prepare, validate, package, and release ChatGPT Apps SDK projects with MCP-compatible tools, UI assets, privacy metadata, deployment checks, submission evidence, and rollback-ready release artifacts.
---

# ChatGPT Apps Deployer

## Description

Turn a working ChatGPT Apps SDK project into a reviewable release artifact. The skill focuses on packaging, deployment readiness, privacy/safety metadata, MCP tool contracts, UI asset integrity, test evidence, and a reversible release plan. It does not claim that deployment to the ChatGPT directory is automatic.

## Use Cases

- Prepare an Apps SDK project for hosting and ChatGPT testing.
- Validate MCP tools and app metadata before submission.
- Package static UI assets and server files for CI/CD.
- Produce privacy, permission, and data-flow checks.
- Create a release manifest and rollback checklist.

## Installation

Install this skill with the repository CLI or copy this folder into your skills directory. Run the packaging helper from the app repository root.

## Workflow

1. Identify the app server, MCP tools, UI entry points, auth model, data stores, and external services.
2. Ensure every tool has a narrow description, typed input, predictable errors, and no hidden side effects.
3. Verify the UI does not expose secrets and all externally loaded assets are authorized.
4. Document data sent to OpenAI, data sent to third parties, retention, deletion, and user-facing privacy policy.
5. Run local/CI tests and capture the exact commit being released.
6. Build a deterministic package manifest with file hashes.
7. Separate “deployed to hosting” from “submitted/approved/published in ChatGPT”. Never report approval before the platform confirms it.
8. Keep the previous known-good release and rollback instructions.

## Example

```text
Use $chatgpt-apps-deployer to prepare this Apps SDK project for submission. Validate tool metadata, create a hashed release manifest, and flag anything that could fail privacy or functionality review.
```

```bash
python scripts/package_app.py . --output dist/app-release-manifest.json
```

## Output Contract

Return release readiness, blockers, tool inventory, privacy/data-flow summary, package manifest path, deployment steps, submission steps, and rollback plan.

## References

- https://help.openai.com/en/articles/12515353-build-with-the-apps-sdk
- https://openai.com/index/introducing-apps-in-chatgpt/
