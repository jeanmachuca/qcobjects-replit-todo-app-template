---
name: ira-prompting
---

# IRA Scoring Rubric

> Source: "Vibe Leading The AI: The Corporate Race Against Machines" (Jean Machuca). Framework concept: the Intent-Result Alignment scoring rubric for auditing prompts.

Score a single phase, not a whole session. Give one score per criterion. Max 10 per phase.

| Criterion | Bad (0) | OK (1) | Good (2) |
|-----------|---------|--------|----------|
| Scope | Multiple features in one prompt | One feature, vague | One feature, precise |
| Constraints | None | Mentioned after the AI starts | Stated first |
| Refinement | Re-explains everything | Partial re-explanation | 2-sentence delta |
| Bug report | Tells the AI what code to change | Symptom, no file | Symptom + relevant file |
| Verification | None | "Does it work?" | Specific check |

## Reading the score

- **8-10:** The phase Vibe is high-fidelity. Ship and start the next Lap.
- **6-7:** Acceptable but drifting. Sharpen the weakest criterion next phase.
- **Below 6:** You are iterating too much — the prompt, not the machine, is the problem. Rewrite the Vibe (Mission Script) rather than re-rolling the prompt.

## Scoring notes

- **Scope:** "Add a sign-in button and dark mode and fix the header" is a 0 regardless of how well each is described. One goal per prompt.
- **Constraints:** The moment the high-velocity amplifier runs without limits is exactly when hallucination begins. Constraints stated in the first sentence are the difference between a 1 and a 2.
- **Refinement:** Every re-explanation after the first prompt is context budget burned that could have gone to the change. Two sentences max.
- **Bug report:** Telling the AI the fix robs it of the diagnostic loop. Symptom + relevant file is the ceiling: the AI locates the cause and proposes the fix.
- **Verification:** "Does it work?" invites a self-congratulatory yes. A specific, named check can be verified by a human or an Auditor NPC.

Apply the rubric at the end of each phase so the Circuit Delta stays honest — a fast Lap is only fast if Traction is still green.