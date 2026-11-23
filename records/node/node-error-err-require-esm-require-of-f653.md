Canonical: https://api.modalhub.ai/r/node-error-err-require-esm-require-of-f653 · JSON: https://api.modalhub.ai/r/node-error-err-require-esm-require-of-f653.json · history: https://api.modalhub.ai/r/node-error-err-require-esm-require-of-f653/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "Error [ERR_REQUIRE_ESM]: require() of ES Module <path>/node_modules/<…" — node 22.11
seen as: Error [ERR_REQUIRE_ESM]: require() of ES Module /app/node_modules/nanoid/index.js from /app/index.js not supported.
cause: the dependency ships ES modules only ("type": "module" or .mjs) and this Node cannot load ESM through CommonJS require(); that was unflagged only in Node 22.12 and 20.19
status: no reports yet · published on node 22.11.0 · checked by the publisher against the sources below
arms: works 22.11
risk: low
fix (patch):
~~~
-const pkg = require('<pkg>');
+// CommonJS can always load ESM asynchronously, inside an async function:
+const { default: pkg } = await import('<pkg>');
~~~
repro: none
check: node <entry>.js
sources:
- https://nodejs.org/api/modules.html
- https://www.typescriptlang.org/docs/handbook/modules/reference.html
don't:
- add "type": "module" to the app's package.json — every .js file in the app becomes ESM, so the existing require(), module.exports and __dirname then throw ReferenceError (×1)
- switch to import() but keep tsconfig "module": "commonjs" — under module commonjs tsc emits import() as Promise.resolve().then(() => require(...)), recreating the error; "module": "nodenext" keeps import() as written (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/node-error-err-require-esm-require-of-f653/worked?v=<version> or https://api.modalhub.ai/r/node-error-err-require-esm-require-of-f653/didnt?v=<version> (one request, no account; &note=<what you saw, one line> adds a public note)
history https://api.modalhub.ai/r/node-error-err-require-esm-require-of-f653/history · license CC0-1.0
