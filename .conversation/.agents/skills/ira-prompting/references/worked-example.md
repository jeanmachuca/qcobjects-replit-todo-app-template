---
name: ira-prompting
---

# Worked example: phased tic-tac-toe build

> Source: "Vibe Leading The AI: The Corporate Race Against Machines" (Jean Machuca). Framework concept: the seven IRA techniques applied to a real build.

The same feature set, two ways. Naive approach scores about 3/10 per phase. The IRA approach holds 9/10.

## The naive approach (IRA ~ 3/10)

**Prompt (one giant Phase Contract violation):** "Build me a tic-tac-toe game with a glassmorphism design, Google sign-in, three difficulty levels, installable as a PWA, and deploy it. Make it look cool."

- **Scope (0):** five features in one prompt.
- **Constraints (0):** nothing stated.
- **Refinement (0):** not applicable, there was never a first good prompt to delta from.
- **Bug report (0):** any fix attempt will be "change the function in App.jsx," not a symptom.
- **Verification (0):** no close check.

Result: a generic game with no identity, drift everywhere, and no way to score what shipped. **3/10.**

## The IRA approach (IRA ~ 9/10)

### Phase 1 - core game
Constraint-first, one feature, precise, symptom-based bug reports, specific verification.

> "Constraint-first: plain console tic-tac-toe, no UI styling yet, standard 3x3. Core loop only. When it plays, the AI does not mark its move. Acceptance: I can play a full game against the AI and it always alternates turns. Verify: `game.js` has a turn-ownership check."

### Phase 2 - glassmorphism redesign
Design by Reference: use the exact visual vocabulary instead of "make it look cool."

> "Redesign with: `backdrop-filter: blur`, dark gradient background, parallax mouse effect, neon X (#00d4ff) and O (#ff2d95). 2-sentence delta only: keep the Phase 1 logic untouched. When the AI plays, the hover preview marker disappears as soon as the AI takes its turn. Verify: the neon classes are in `styles.css` and the hover marker retracts on AI turn."

### Phase 3 - Google Sign-In
Constrained prompt with a precise, prescriptive pivot.

> "Add Google Sign-In using GIS, fallback to guest, persist in localStorage. Behavioural: on click, show the Google picker; after callback, show the avatar in the nav; if GIS fails, show a Guest button that creates a local session."

Refinement (Delta + Pivot, exactly as given):

> "Remove prompt() — it causes FedCM errors. Guest always visible."

### Phase 4 - AI difficulty
Delta prompt on the existing model.

> "Add AI Easy/Normal/Hard."

Refinement (Delta, exactly as given):

> "Make Easy 30% smart so it isn't braindead."

### Phase 5 - PWA
Single concern, specific artifact names.

> "Make it installable as a PWA. Manifest at the site root, service worker precaching static assets. Behavior: offline reload still opens the game. Verify: `manifest.json` exists and the service worker registration is in the entry file."

### Phase 6 - deploy with secrets
Constraint-First for security, Checklist Close on the secret.

> "Deploy to GH Pages. Constraint: the Google Client ID lives only in GitHub secrets, never in `config.js` in the repo. CI reads it at build time. End with verification: does `config.js` still contain the real secret?"

Result per phase: **9/10.** One goal each phase, constraints first, deltas of two sentences, symptoms with file references, and named verification checks. The build ships in six Laps with a scorable, honest telemetry trail.