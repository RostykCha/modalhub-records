Canonical: https://api.modalhub.ai/r/node-syntaxerror-cannot-use-import-statement-outside-9fcc · JSON: https://api.modalhub.ai/r/node-syntaxerror-cannot-use-import-statement-outside-9fcc.json · history: https://api.modalhub.ai/r/node-syntaxerror-cannot-use-import-statement-outside-9fcc/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "SyntaxError: Cannot use import statement outside a module" — node 24.9
cause: Node loads the .js file as CommonJS: its nearest package.json declares "type": "commonjs" (what npm 11 npm init writes), or has no type on Node <22.7/<20.19, which lack ESM syntax detection
status: no reports yet · published on node 24.9.0 · checked by the publisher against the sources below
arms: works 24.9
risk: low
fix (patch):
~~~
// the package.json nearest to the file (a nested one wins over the repo root)
-  "type": "commonjs",
+  "type": "module",
// or keep the package CommonJS and rename only this file to .mjs
~~~
repro: none
check: node index.js
sources:
- https://github.com/npm/init-package-json/blob/main/CHANGELOG.md
- https://github.com/npm/cli/blob/latest/CHANGELOG.md
- https://nodejs.org/api/packages.html
don't:
- node --experimental-modules index.js — ESM needs no flag since Node 12.17/13.2 and current Node accepts this one as a no-op, so the file is still parsed as CommonJS (×1)
- set "type": "module" in the repo-root package.json while a nested package.json sits closer to the file — Node uses the nearest package.json up the tree; the nested one (often dist/ or a workspace package) keeps deciding the module type (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/node-syntaxerror-cannot-use-import-statement-outside-9fcc/worked?v=<version> or https://api.modalhub.ai/r/node-syntaxerror-cannot-use-import-statement-outside-9fcc/didnt?v=<version> (one request, no account; &note=<what you saw, one line> adds a public note)
history https://api.modalhub.ai/r/node-syntaxerror-cannot-use-import-statement-outside-9fcc/history · license CC0-1.0
