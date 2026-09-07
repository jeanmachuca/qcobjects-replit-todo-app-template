---
name: mission-script
---

# Mission Script Template

> Source: "Vibe Leading The AI: The Corporate Race Against Machines" (Jean Machuca). Framework concept: the Mission Script as the high-frequency strategic intent written as a technical specification.

## The six fields

| Field | What goes here | High-fidelity signal |
|-------|----------------|----------------------|
| Mission Name | One line naming the deliverable and its quality bar. | Names both the thing and the standard. |
| Frequency | Stealth/Precision or High-Velocity/Market-Capture. | Set in the first sentence. |
| Outcome | The concrete result, with the number or accuracy that defines done. | A measurable definition of done. |
| Constraints | Security, limits, must-nots, stated first. | Limits are said before work starts, not after. |
| Acceptance | How we know it worked. | An observable, checkable bar. |
| Verification | The explicit check(s) that close the phase. | A named artifact to inspect. |

## Fill-in template

```
MISSION NAME: <one line: deliverable + quality bar>
FREQUENCY: <Stealth/Precision | High-Velocity/Market-Capture>
OUTCOME: <the concrete result, with number or accuracy>
CONSTRAINTS:
  - <security / limit / must-not>
  - <security / limit / must-not>
ACCEPTANCE: <how we know it worked>
VERIFICATION: <explicit check to run when the phase closes>
```

## Worked example

```
MISSION NAME: Q3 Prospecting Gap Report, deliverable grade: confident enough to reallocate budget.
FREQUENCY: Stealth/Precision. Do not guess figures; flag anything uncertain.
OUTCOME: A report identifying the $2M gap in our Q3 prospecting with 99% accuracy,
         broken out by territory and stage.
CONSTRAINTS:
  - Use only the pipeline export dated 2026-08-31; do not blend in other quarters.
  - Do not infer win probabilities; report booked and lost only.
  - No customer PII in the output; tokenize any references as [CUSTOMER_01].
ACCEPTANCE: A finance reviewer can trace every number in the gap to a row in the export.
VERIFICATION: Is every stated figure tied to a pipeline source row? Does the report
              contain zero customer identifiers?
```

## How to calibrate

1. **Write the Vibe, then check it twice.** Is it poetically clear (a human feels it) and precisely executable (an AI can run it)? If either is missing, sharpen.
2. **Constraints first.** The AI reads the first sentence as the frame for everything after. Put frequency and the hard limits there.
3. **One outcome per script.** One goal per prompt. If the task splits into more than three concerns, split the script.
4. **Re-reference the file.** AI working memory holds roughly four files / eight turns. If a constraint was set at the top and the task ran long, restate it rather than assume it is still in context.