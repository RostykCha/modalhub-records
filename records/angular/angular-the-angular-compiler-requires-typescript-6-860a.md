Canonical: https://api.modalhub.ai/r/angular-the-angular-compiler-requires-typescript-6-860a · JSON: https://api.modalhub.ai/r/angular-the-angular-compiler-requires-typescript-6-860a.json · history: https://api.modalhub.ai/r/angular-the-angular-compiler-requires-typescript-6-860a/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "The Angular Compiler requires TypeScript >=6.0.0 and <6.1.0 but <vers…" — angular 22.2
seen as: The Angular Compiler requires TypeScript >=6.0.0 and <6.1.0 but 7.0.2 was found instead.
cause: @angular/compiler-cli 22 checks the loaded ts.version against >=6.0.0 <6.1.0 when it creates the program; a 5.x TypeScript got in past its peer range, e.g. via --legacy-peer-deps
status: no reports yet · published on angular 22.2.4 · checked by the publisher against the sources below
arms: works 22.2
risk: low
fix (patch):
~~~
// package.json devDependencies: the range @angular/compiler-cli 22 peers on (>=6.0 <6.1)
-    "typescript": "~5.9.3",
+    "typescript": "~6.0.3",
// then a plain npm install; upgrading with ng update @angular/core @angular/cli bumps typescript too
~~~
repro: none
check: npm ls typescript # typescript@6.0.x, no invalid marker
sources:
- https://angular.dev/reference/versions
don't:
- npm i -D typescript@latest — latest is 7.x, the native port: its main export holds only the version, not the ts.* compiler API Angular calls, so ngc dies with ts2.parseCommandLine is not a function (×1)
- npm install --legacy-peer-deps (or --force) to get past the ERESOLVE on typescript — that is how the 5.x TypeScript got in: npm skips the peer check, then the compiler's own version check fails the build (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/angular-the-angular-compiler-requires-typescript-6-860a/worked?v=<version> or https://api.modalhub.ai/r/angular-the-angular-compiler-requires-typescript-6-860a/didnt?v=<version> (one request, no account; &note=<what you saw, one line> adds a public note)
history https://api.modalhub.ai/r/angular-the-angular-compiler-requires-typescript-6-860a/history · license CC0-1.0
