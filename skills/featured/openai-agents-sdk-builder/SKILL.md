---
name: openai-agents-sdk-builder
description: Scaffold and review production-oriented OpenAI Agents SDK projects with explicit tools, guardrails, handoffs, tracing, state, sandbox boundaries, and testable acceptance criteria.
---

# OpenAI Agents SDK Builder

## Description

Build or refactor an agentic application using the current OpenAI Agents SDK. Prefer the smallest agent topology that solves the task. Start with one `Agent` and `Runner`; add tools, handoffs, agents-as-tools, sessions, guardrails, or sandbox execution only when the requirement justifies them.

## Use Cases

- Scaffold a new Python Agents SDK project.
- Convert an ad-hoc prompt loop into a managed agent workflow.
- Add function tools, handoffs, sessions, tracing, human approval, or sandbox execution.
- Review an existing agent design for unnecessary complexity, unsafe tool access, weak observability, or missing tests.
- Produce a deployment checklist for an agent that works across files or external services.

## Installation

Install this skill with the repository CLI or copy this folder into your skills directory. For generated Python projects, install the SDK with:

```bash
pip install openai-agents
```

Set `OPENAI_API_KEY` in the runtime environment. Never write API keys into generated source files.

## Workflow

1. Restate the job, inputs, outputs, tools, trust boundary, latency target, and failure modes.
2. Choose the minimum topology: single agent, manager with agents-as-tools, or handoffs.
3. Define every tool with a narrow contract, typed arguments, explicit authorization, and deterministic errors.
4. Add guardrails where an invalid input or output would create material risk.
5. Decide how state is carried: explicit history, SDK session, or OpenAI-managed continuation.
6. Use a sandbox when the agent must inspect or modify real files in an isolated workspace.
7. Enable tracing and define acceptance tests before adding more agents.
8. Produce a threat/abuse note for tools that can write, spend, publish, delete, or access sensitive data.

## Example

```text
Use $openai-agents-sdk-builder to scaffold a support triage agent in Python. It may read a local FAQ, create a ticket through one function tool, and must ask for confirmation before ticket creation.
```

For a starter project, run:

```bash
python scripts/scaffold_agent.py ./support-agent --name "Support Triage"
```

## Output Contract

Return: architecture, generated/changed files, tool contracts, state strategy, guardrails, observability plan, tests, and unresolved risks. Explain advanced SDK concepts in plain language before implementation details.

## References

- https://openai.github.io/openai-agents-python/
- https://openai.github.io/openai-agents-python/quickstart/
- https://openai.github.io/openai-agents-python/sandbox_agents/
