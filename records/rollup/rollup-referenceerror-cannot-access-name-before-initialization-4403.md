Canonical: https://api.modalhub.ai/r/rollup-referenceerror-cannot-access-name-before-initialization-4403 · JSON: https://api.modalhub.ai/r/rollup-referenceerror-cannot-access-name-before-initialization-4403.json · history: https://api.modalhub.ai/r/rollup-referenceerror-cannot-access-name-before-initialization-4403/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "ReferenceError: Cannot access '<name>' before initialization when loa…" — rollup 4.68
seen as: ReferenceError: Cannot access 'c' before initialization
cause: the namespace re-exports a binding from a module that initializes later in the cycle; Rollup copied it by value when building the namespace object, reading the const before its declaration
status: no reports yet · published on rollup 4.68.0
arms: works 4.68
risk: low
fix (patch):
~~~
// package.json: 4.68.1 emits getters for namespace members initialized later in a cycle
-    "rollup": "^4.68.0"
+    "rollup": "^4.68.1"
// then reinstall so the lockfile moves too
~~~
repro: none
check: node bundle.mjs exits 0 and logs the namespace with c as [Getter] (the member is a getter now), no ReferenceError
don't:
- downgrade rollup to 4.67.x, treating the by-value namespace as a 4.68.0 regression — 4.67.5 emits the same c: c member and throws the same ReferenceError; the by-value copy predates 4.68.0 and 4.68.1 is the first release that emits getters for those members (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/rollup-referenceerror-cannot-access-name-before-initialization-4403/worked?v=<version> or https://api.modalhub.ai/r/rollup-referenceerror-cannot-access-name-before-initialization-4403/didnt?v=<version> (one request, no account)
history https://api.modalhub.ai/r/rollup-referenceerror-cannot-access-name-before-initialization-4403/history · license CC0-1.0
