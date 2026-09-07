---
name: hud-setup
---

# HUD Metrics

> Source: "Vibe Leading The AI: The Corporate Race Against Machines" (Jean Machuca). Framework concept: the three HUD signals and their computation.

## Traction (Intent-Result Alignment)

What it measures: how closely the machine output matches the Vibe for the Lap.

How to compute:

```
IRA% = (phases scored with the rubric at 8-10 / total phases this Lap) x 100
```

Per-phase scores come from the IRA rubric (Scope, Constraints, Refinement, Bug report, Verification; 8-10 = good, below 6 = iterating too much). Alternative: audit a sample of outputs against the Mission Script's Outcome and Acceptance fields and grade 0-2 per item.

Worked example:

- Lap produced 5 phases. Rubric scores: 9, 8, 9, 7, 9.
- Phases at 8-10: 4 of 5. IRA = 80%.

Interpretation: below ~70% the Mission Script is the problem. Rewrite the Vibe, not the prompt.

## Circuit Delta

What it measures: the difference in Lap Time between today and yesterday. Are we solving faster?

How to compute:

```
Circuit Delta = Lap Time(today) - Lap Time(yesterday)
```

Lap Time = wall-clock hours from Lap start (Pit Stop) to Pit Stop. Negative delta = the squad is getting faster. Positive delta = something is dragging (blurry Vibe, missing data, a test suite gone red).

Worked example:

- Lap 3 took 22 hours. Lap 4 took 16 hours. Circuit Delta = -6 hours.
- Lap 5 took 19 hours. Circuit Delta = +3 hours. Investigate the Mission Script and data feeds for Lap 5.

## Hallucination Debt

What it measures: output that looks true but is invented — creative fiction the machine mistook for fact. Debt compounds across Laps.

How to compute:

Tally by sources rather than raw count, so a single hallucinated number in a report counts more than a typo:

```
Hallucination Debt points = 1 per unverifiable claim + 2 per wrong-cited source + 3 per invented metric
```

The Auditor NPC owns this tally. Risk Spotter actives a snap (connection cut) when the score or incident rate breaches its band.

## Thresholds and triggers

| Metric | Green | Yellow | Red | Trigger (automatic) |
|--------|-------|--------|-----|---------------------|
| Traction (IRA) | >= 95% | ~70% | < 60% | Yellow: Pilot re-audits the Mission Script. Red: Lap restarts with a rewritten Vibe. |
| Circuit Delta | <= 0 (faster) | 0 to +2 hrs | > +2 hrs | Red: Logic Navigator checks data feeds and test suite before the next Lap. |
| Hallucination Debt | 0 points | 1-3 points | 4+ points | Red: Risk Spotter snaps the connection on that agent. |

The trigger defines the owner and the act, so nothing waits for a meeting.