---
name: realtime-api-integration
description: Design and scaffold OpenAI Realtime API integrations with server-side WebSocket control, browser WebRTC transport, explicit fallback policy, session configuration, observability, and secret isolation.
---

# Realtime API Integration

## Description

Create low-latency text/audio integrations for the OpenAI Realtime API. Use WebSocket for server-managed orchestration and WebRTC for browser media. Treat transport fallback as an explicit product policy: WebRTC and WebSocket have different trust, media, and deployment boundaries, so never silently expose a server API key to a browser.

## Use Cases

- Voice assistants and live copilots.
- Server-side Realtime agents over WebSocket.
- Browser audio sessions over WebRTC.
- A transport adapter that prefers WebRTC in browsers and falls back to an application-controlled server path.
- Reconnection, telemetry, turn handling, and latency diagnostics.

## Installation

Install this skill with the repository CLI or copy the folder into your skills directory. The support script scaffolds a transport plan and starter files; it does not embed credentials.

## Workflow

1. Identify client type, media modalities, model, latency budget, and whether tools run server-side.
2. Keep long-lived API keys on the server.
3. For browser media, create WebRTC calls through a server endpoint that authenticates to OpenAI.
4. For server orchestration, use WebSocket and centralize tool execution, approvals, and logging.
5. Define explicit fallback triggers: unsupported WebRTC, ICE failure, proxy restrictions, or server policy.
6. Add bounded reconnects with jitter; never replay an ambiguous side-effecting event automatically.
7. Track session start, transport, reconnect count, first-response latency, errors, and clean shutdown.
8. Test microphone denial, network loss, duplicate events, stale sessions, and model unavailability.

## Example

```text
Use $realtime-api-integration to design a browser voice concierge. Prefer WebRTC, but route to a server-side WebSocket session when WebRTC cannot be established. Keep all credentials server-side.
```

```bash
python scripts/scaffold_realtime.py ./realtime-starter --model gpt-realtime-2.1
```

## Output Contract

Return the selected transport, fallback decision tree, trust boundary, generated files, session lifecycle, telemetry, and failure tests. Mark preview/beta API assumptions explicitly.

## References

- https://developers.openai.com/api/docs/models/gpt-realtime
- https://developers.openai.com/api/reference/typescript/resources/realtime/subresources/calls/methods/create
- https://openai.github.io/openai-agents-python/realtime/quickstart/
