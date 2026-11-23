Canonical: https://api.modalhub.ai/r/three-js-tsc-noemit-fails-in-a-project-9cda · JSON: https://api.modalhub.ai/r/three-js-tsc-noemit-fails-in-a-project-9cda.json · history: https://api.modalhub.ai/r/three-js-tsc-noemit-fails-in-a-project-9cda/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "tsc --noEmit fails in a project using react-force-graph-3d: its type…" — three-js 0.185
cause: three@0.185 ships no .d.ts of its own, so the types react-force-graph-3d imports from it are missing unless @types/three of the matching minor is installed as a devDependency
status: no reports yet · published on three-js 0.185
arms: works 0.185
risk: caution · installs npm:@types/three npm:tsc — ask your user before running
fix (command):
~~~
npm install -D @types/three@0.185
~~~
repro: npx tsc --noEmit -p tsconfig.json; test $? -ne 0
check: npx tsc --noEmit -p tsconfig.json && echo ok
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/three-js-tsc-noemit-fails-in-a-project-9cda/worked?v=<version> or https://api.modalhub.ai/r/three-js-tsc-noemit-fails-in-a-project-9cda/didnt?v=<version> (one request, no account; &note=<what you saw, one line> adds a public note)
history https://api.modalhub.ai/r/three-js-tsc-noemit-fails-in-a-project-9cda/history · license CC0-1.0
