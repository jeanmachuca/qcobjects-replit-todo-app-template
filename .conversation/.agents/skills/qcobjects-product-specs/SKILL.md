---
name: qcobjects-product-specs
description: Use the QCObjects product specifications as the normative source of truth when designing, implementing, reviewing, or planning changes for the QCObjects core, SDK, CLI, app templates, handlers, or ecosystem. Consult the relevant reference spec before making framework, configuration, architecture, release, or roadmap decisions.
version: 0.1.0
license: MIT
---

# QCObjects Product Specs

Treat the bundled QCObjects product specifications as the source of truth for
the ecosystem. They define the current framework contract, app structure,
configuration schema, build/release conventions, add-ons, and the v3 roadmap.

## Authority and decision rules

1. Read the relevant spec in `references/docs/` before proposing or changing
   QCObjects behavior.
2. Normative language (`MUST`, `MUST NOT`, `SHOULD`, `MAY`) is binding.
3. Spec 15, Unified Vision v3, governs direction when it conflicts with specs
   01–14; update the affected older spec in the same change.
4. Keep code links pinned to release tags, not floating development branches,
   unless the reference is to this specifications repository itself.
5. Every feature proposal should identify the product guarantee, governing
   principal, affected spec, verification bar, and (for v3 work) phase P1, P2,
   or P3.

## Core product model

- QCObjects is a full-stack JavaScript framework for micro-frontends and
  micro-services in an N-Tier architecture.
- The ecosystem is layered: `qcobjects` core → `qcobjects-sdk` → `qcobjects-cli`
  and runtime → independently installable handlers/microservices → apps.
- `config.json` is the runtime source of truth. Use `$ENV(...)` for environment
  values and secrets and `$config(...)` for derived settings; never hardcode
  credentials, paths, or routing.
- The runtime is transpiler-free for JavaScript applications, while TypeScript
  authoring and first-party declarations are supported. New framework code
  should prefer native `class`/`extends`; the legacy `Class()` factory remains
  supported.
- Components use MVC/MVCC primitives, HTML templates with `{{...}}` bindings
  and `$...(...)` processors, recursive nested routing, and optional Shadow DOM.
- Browser-to-vendor secret flows must use a same-origin backend proxy.

## Working conventions

- Keep the five-layer dependency direction: a layer may depend on lower layers,
  never on higher layers.
- Preserve the standard package outputs and exports: CJS, ESM, browser, and
  declarations.
- For services and microservices, preserve standard response shapes and use
  `this.body` plus `done()` rather than writing raw streams.
- Tests should use `kind:"mockup"` or `kind:"local"` services instead of stub
  URLs, so they never touch the network.
- For app work, preserve the generated layout and boot configuration in the
  app-structure spec; treat `public/` as generated output.
- For ecosystem changes, use the contribution order core → SDK → CLI →
  templates/handlers → apps, with a spec update before code when the behavior
  is not already covered.

## Reference map

- `docs/01-product-vision.md` — identity and 25 design principals
- `docs/02-architecture.md` — layers, rendering, routing, services, handlers
- `docs/03-core-framework.md` — class system, components, processors, loaders
- `docs/04-sdk.md` — SDK namespaces, widgets, controllers, effects, sessions
- `docs/05-cli.md` — commands, servers, scaffolding, autoloading, versioning
- `docs/06-app-structure.md` — generated app layout and boot contract
- `docs/07-app-templates.md` — template and CSS interoperability contract
- `docs/08-ci-conventions.md` — branches, tags, CI, publishing
- `docs/09-license.md` — LGPLv3 history and MIT v3 migration
- `docs/10-contribution-pipeline.md` — cross-repository change flow
- `docs/11-features.md` — feature/status and delivery-channel matrix
- `docs/12-schemas.md` — `config.json` and `package.json` contracts
- `docs/13-diagrams.md` — ecosystem, lifecycle, routing, and component maps
- `docs/14-build-scripts-blueprint.md` — build modalities and script contracts
- `docs/15-unified-vision-v3.md` — governing P1/P2/P3 direction
- `docs/16-addons.md` — official handlers, libraries, commands, and admin libs

## Verification

Use the verification section of the governing spec as the acceptance criteria.
For documentation changes, run the repository's link, schema, and strict
MkDocs checks. For code changes, preserve the relevant lint, test, type, build,
package-export, and smoke-test requirements from the referenced spec.