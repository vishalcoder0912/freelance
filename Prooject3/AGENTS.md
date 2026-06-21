## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, invoke the `skill` tool with `skill: "graphify"` before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## CareerVeda 2.0

Single-app repo. Only `careerveda-vite/` is active:

| Package | Tech | Dev command | Port | Purpose |
|---|---|---|---|---|
| `careerveda-vite/` | Vite 8 + React 19 + Tailwind v4 + react-router v7 | `npm run dev` | 5173 | Public marketing & app site (15 pages). Firebase auth. |

### Key conventions & gotchas

- Uses `@/` path alias, Tailwind v4 via `@tailwindcss/vite` plugin, and `react-router-dom` v7 with lazy-loaded routes.
- No CI workflows, no docker-compose, no task runner config in the repo.
