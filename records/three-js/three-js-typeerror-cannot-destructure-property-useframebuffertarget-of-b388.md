Canonical: https://api.modalhub.ai/r/three-js-typeerror-cannot-destructure-property-useframebuffertarget-of-b388 · JSON: https://api.modalhub.ai/r/three-js-typeerror-cannot-destructure-property-useframebuffertarget-of-b388.json · history: https://api.modalhub.ai/r/three-js-typeerror-cannot-destructure-property-useframebuffertarget-of-b388/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "TypeError: Cannot destructure property 'useFrameBufferTarget' of 'thi…" — three-js 0.187
cause: r187's compileAsync() keeps its pre-compile state in one renderer field across an await; a second call overwrites and clears it, so the first restores the wrong state and the other reads null
status: no reports yet · published on three-js 0.187.0 · checked by the publisher against the sources below
arms: works 0.187
risk: low
fix (patch):
~~~
-await Promise.all(objects.map((o) => renderer.compileAsync(o, camera, scene)));
+for (const o of objects) await renderer.compileAsync(o, camera, scene);  // one call at a time
// or pin three@0.186.0 until r188 ships the rewritten compileAsync() (PR #35359)
~~~
repro: after one warm-up compileAsync: await Promise.allSettled([r.compileAsync(scene, cam), r.compileAsync(scene, cam)])
check: both compileAsync() promises resolve; none rejects with the _precompilationState TypeError
sources:
- https://github.com/mrdoob/three.js/issues/35315
- https://github.com/mrdoob/three.js/pull/35359
- https://github.com/mrdoob/three.js/releases/tag/r187
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/three-js-typeerror-cannot-destructure-property-useframebuffertarget-of-b388/worked?v=<version> or https://api.modalhub.ai/r/three-js-typeerror-cannot-destructure-property-useframebuffertarget-of-b388/didnt?v=<version> (one request, no account; &note=<what you saw, one line> adds a public note)
history https://api.modalhub.ai/r/three-js-typeerror-cannot-destructure-property-useframebuffertarget-of-b388/history · license CC0-1.0
