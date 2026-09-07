---
name: mission-script
---

# The Prompt Ladder

> Source: "Vibe Leading The AI: The Corporate Race Against Machines" (Jean Machuca). Framework concept: specificity of intent as a ladder that maps to Intent-Result Alignment (IRA).

The Prompt Ladder is the specificity ladder of the Vibe. The higher the rung, the sharper the intent, the higher the expected IRA (Intent-Result Alignment).

| Level | Example | IRA |
|-------|---------|-----|
| Aspirational | "Make it look cool." | Very low. The AI freewheels; your team iterates on whatever it imagines. |
| Functional | "Add Google Sign-In." | Medium. The feature is named but unconstrained: no method, no fallback, no state. |
| Constrained | "Add Google Sign-In using GIS, fallback to guest, persist in localStorage." | High. Method, fallback behavior, and persistence are pinned down. |
| Behavioural | "When the user clicks Sign In, show the Google picker. After callback, show avatar in nav. If GIS fails, show a Guest button that creates a local session." | Very high. The user-visible sequence and every reaction are specified. |
| Exemplar | "Like the sign-in on this reference site: (URL). Only the modal part." | Highest. You point at a working artifact instead of describing it. |

## Guidance

- **Start at the highest rung you can name.** If you already know the method, the fallback, and the sequence, write the Behavioural version. Describing less than you know is paying in advance to iterate.
- **Climb when the machine drifts.** Repeated re-explanation is the symptom that your Vibe is on too low a rung. Climb one rung rather than re-explaining.
- **Use Exemplar deliberately.** An exemplar is the cheapest way to define taste: "like this, only this part." Always bound it ("only the modal part") or the AI imports the whole page.
- **The ladder works for reports too.** "A report on Q3" is Aspirational. "Identify the $2M gap in our Q3 prospecting with 99% accuracy" is Constrained-plus.

A blurry intent on the Aspirational rung amplifies into hallucination the moment a high-velocity AI touches it. The ladder is the tool that keeps intent sharp.