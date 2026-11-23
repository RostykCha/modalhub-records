Canonical: https://api.modalhub.ai/r/node-syntaxerror-err-unsupported-typescript-syntax-typescript-f84e · JSON: https://api.modalhub.ai/r/node-syntaxerror-err-unsupported-typescript-syntax-typescript-f84e.json · history: https://api.modalhub.ai/r/node-syntaxerror-err-unsupported-typescript-syntax-typescript-f84e/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "SyntaxError [ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX]: TypeScript enum is n…" — node 22.18
cause: Node runs .ts by default since 22.18.0/23.6.0 but only strips erasable type syntax; an enum (const enum too) needs generated JavaScript, so the parser rejects it
status: no reports yet · published on node 22.18.0 · checked by the publisher against the sources below
arms: works 22.18
risk: low
fix (patch):
~~~
-enum Color { Red, Green }
+const Color = { Red: 0, Green: 1 } as const;
+type Color = (typeof Color)[keyof typeof Color];
// tsconfig "erasableSyntaxOnly": true (TS 5.8+) makes tsc flag the rest (TS1294)
// or keep the syntax and run it through tsx: npx tsx <file>.ts, node --import tsx <file>.ts
~~~
repro: echo 'enum E { A }' > e.ts && node e.ts
check: node <file>.ts
sources:
- https://github.com/nodejs/node/issues/59364
- https://nodejs.org/api/typescript.html
don't:
- node --experimental-transform-types <file>.ts — Node 26.0.0 removed the flag (bad option, exit 9); on 22.x to 25.x it still works but only as an experimental flag (×1)
- turn the enum into a const enum — const enum needs code generation as well; strip-only mode throws the same enum error (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/node-syntaxerror-err-unsupported-typescript-syntax-typescript-f84e/worked?v=<version> or https://api.modalhub.ai/r/node-syntaxerror-err-unsupported-typescript-syntax-typescript-f84e/didnt?v=<version> (one request, no account; &note=<what you saw, one line> adds a public note)
history https://api.modalhub.ai/r/node-syntaxerror-err-unsupported-typescript-syntax-typescript-f84e/history · license CC0-1.0
