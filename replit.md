# QCObjects Todo

A local-first todo cockpit for capturing, prioritizing, and completing the next right thing.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/qcobjects-todo/src/App.tsx` — todo cockpit UI, filters, CRUD interactions, and routing.
- `artifacts/qcobjects-todo/src/lib/todo-storage.ts` — validated local persistence for todo records.
- `artifacts/qcobjects-todo/src/qcobjects/config.ts` — config.json loader and QCObjects runtime settings.
- `artifacts/qcobjects-todo/src/qcobjects/todo-controller.ts` — MVC-style mutation boundary.
- `artifacts/qcobjects-todo/src/qcobjects/vibe-leading.ts` — Mission Script and HUD telemetry.
- `artifacts/qcobjects-todo/public/config.json` — metadata-driven app configuration.
- `artifacts/qcobjects-todo/src/index.css` — warm cockpit visual system.

## Architecture decisions

- The first build is intentionally local-first: todo data stays in browser storage and no account or vendor service is required.
- QCObjects conventions are represented through a runtime `config.json`, component template path, and a separate controller/model boundary so rendering stays independent from mutations.
- VibeLeading is expressed as a Mission Script plus three HUD signals; the visible Traction percentage is derived from completed work.
- The app uses the generated artifact routing and React/Vite shell while keeping the product contract compatible with QCObjects's metadata-driven app model.

## Product

- Add todos with priority and optional due date.
- Search and filter by status or priority.
- Edit, complete/reopen, delete, and clear finished todos.
- Persist the list locally across refreshes with safe loading and empty states.

## User preferences

- Use QCObjects product-specs as the source of truth for metadata-driven, local-first behavior.
- Use VibeLeading Mission Script and HUD language when planning future task flows.

## Gotchas

- `config.json` is served from `public/`; the loader falls back to a typed default so the UI remains usable if static config is unavailable.
- Use `pnpm --filter @workspace/qcobjects-todo run typecheck` for the leaf app check.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
