---
name: regenerative-impact-map
description: Map a complex initiative across people, relationships, knowledge, resources, and ecology before a high-impact decision or when local fixes create downstream effects.
---

# Regenerative Impact Map

Make the whole system visible before recommending an intervention. Use the user's language and put a plain explanation before technical detail.

## Systemic contract

Call an outcome regenerative only when it:

- names a concrete benefit and an observable indicator in at least three lenses: human, social, knowledge, resources, and ecology;
- leaves no material harm in the other lenses without an owner and mitigation;
- states one reinforcing loop and one balancing safeguard;
- leaves a reusable map, capability, relationship, or restored resource;
- compares the expected use of attention, time, money, compute, data, materials, and energy with a baseline; and
- marks untested benefits as hypotheses, not facts.

Before action, name at least one resource or capability expected to end above baseline and set a limit for every material resource. After action, call the outcome regenerative only when indicators support that threshold; a gain in one unit does not erase a deficit in another.

## Workflow

1. State the decision, affected place or population, time horizon, and what is outside the boundary.
2. Include direct users, non-users affected by spillovers, maintainers, future users, and the living environment. Mark missing voices.
3. Describe the current state in the five lenses. Use `unknown` where evidence is missing.
4. Map important stocks, flows, delays, dependencies, and power differences.
5. Draw the dominant causal loop. Distinguish reinforcing behavior from balancing behavior; a reinforcing loop is not automatically beneficial.
6. Compare interventions by leverage, reversibility, delayed effects, and burden shifting.
7. Choose the smallest intervention that can improve at least three lenses without exporting costs.
8. Define leading and lagging indicators, an owner, a review date, a stop condition, and what will be restored if the intervention fails.

## Output

Lead with a five-sentence plain-language brief. Then provide:

```yaml
decision: ""
boundary: ""
affected_and_missing_voices: []
lenses:
  human: {mechanism: "", indicator: ""}
  social: {mechanism: "", indicator: ""}
  knowledge: {mechanism: "", indicator: ""}
  resources: {mechanism: "", indicator: ""}
  ecology: {mechanism: "", indicator: ""}
reinforcing_loop: ""
balancing_safeguard: ""
resource_baseline_and_budget: ""
chosen_intervention: ""
regenerative_seed: ""
review: {owner: "", date: "", stop_condition: "", restoration: ""}
```

Explain specialized terms on first use. Preserve equations, standards, and precise terminology in a technical appendix when they matter.

## Boundaries

Do not invent stakeholder consent, ecological benefit, causal certainty, or comparable units for unlike resources. Do not turn a score into permission for an irreversible action.

## References

- <https://www.w3.org/TR/web-sustainability-guidelines/>
- <https://www.undrr.org/terminology/resilience>
