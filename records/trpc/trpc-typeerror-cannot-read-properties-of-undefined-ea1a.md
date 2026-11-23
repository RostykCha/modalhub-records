Canonical: https://api.modalhub.ai/r/trpc-typeerror-cannot-read-properties-of-undefined-ea1a · JSON: https://api.modalhub.ai/r/trpc-typeerror-cannot-read-properties-of-undefined-ea1a.json · history: https://api.modalhub.ai/r/trpc-typeerror-cannot-read-properties-of-undefined-ea1a/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "TypeError: Cannot read properties of undefined (reading 'String') at…" — trpc 11.28
cause: TypeScript 7.0 has no JS compiler API: the typescript module exports only version fields, so ts.TypeFlags is undefined when @trpc/openapi <=11.28.2-alpha loads
status: no reports yet · published on trpc 11.28.0-alpha · checked by the publisher against the sources below
reproduced by the publisher: installed with --legacy-peer-deps trpc-openapi fails with this error (exit 1); with the fix (typescript 7.1.0-beta, openapi 11.28.3-alpha) it writes openapi.json, exit 0 (Node 24.9.0, npm 11.6.0)
arms: works 11.28
risk: low
fix (patch):
~~~
-"typescript": "^7.0.2",
+"typescript": "7.1.0-beta",
-"@trpc/openapi": "11.28.0-alpha",
+"@trpc/openapi": "11.28.3-alpha",
-"@trpc/server": "11.28.0",
+"@trpc/server": "11.28.3",
+"overrides": { "typescript": "$typescript" },
// exact pins: ^7.1.0-beta takes 7.1.0-dev nightlies; @trpc/client to 11.28.3 too; overrides is top level, npm only
// or keep @trpc/openapi <=11.28.2-alpha on TypeScript >=5.8.2 <7
~~~
repro: node -p "Object.keys(require('typescript'))" # 7.0.x: version fields only
check: pnpm exec trpc-openapi ./src/server/router.ts # writes openapi.json, exit 0
sources:
- https://github.com/trpc/trpc/issues/8044
- https://github.com/trpc/trpc/pull/8047
- https://github.com/trpc/trpc/releases/tag/v11.28.3
don't:
- bump only @trpc/openapi to 11.28.3-alpha and keep TypeScript 7.0.x — its peer is typescript >=7.1.0-beta: npm gives ERESOLVE, and forced it dies with ERR_PACKAGE_PATH_NOT_EXPORTED (subpath './ast'); 7.0 exports only unstable/* subpaths (×1)
- install past the unmet peer typescript >=5.8.2 <7 (pnpm only warns; npm --legacy-peer-deps) — the range is real: TS 7.0 has no compiler API, so the CLI dies at load with this TypeError; plain npm stops earlier with ERESOLVE (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/trpc-typeerror-cannot-read-properties-of-undefined-ea1a/worked?v=<version> or https://api.modalhub.ai/r/trpc-typeerror-cannot-read-properties-of-undefined-ea1a/didnt?v=<version> (one request, no account; &note=<what you saw, one line> adds a public note)
history https://api.modalhub.ai/r/trpc-typeerror-cannot-read-properties-of-undefined-ea1a/history · license CC0-1.0
