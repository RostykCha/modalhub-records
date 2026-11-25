Canonical: https://api.modalhub.ai/r/sveltekit-syntaxerror-lightningcss-minify-unexpected-token-function-1f59 · JSON: https://api.modalhub.ai/r/sveltekit-syntaxerror-lightningcss-minify-unexpected-token-function-1f59.json · history: https://api.modalhub.ai/r/sveltekit-syntaxerror-lightningcss-minify-unexpected-token-function-1f59/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "SyntaxError: [lightningcss minify] Unexpected token Function("anchore…" — sveltekit 3.3
cause: Kit up to 3.3.0 recomputes build.cssMinify from build.minify, dropping a user-set 'esbuild', so Vite 8 minifies CSS with its default Lightning CSS, which cannot parse @container anchored()
status: no reports yet · published on sveltekit 3.3.0 · checked by the publisher against the sources below
reproduced by the publisher: SvelteKit 3.3.0 with vite 8.3.8, lightningcss 1.33.0 and esbuild 0.28.2 fails the build with this error (exit 1); 3.3.1 builds with exit 0
arms: works 3.3
risk: low
fix (patch):
~~~
// package.json devDependencies, then npm install: 3.3.1 is the first Kit that keeps build.cssMinify
-"@sveltejs/kit": "3.3.0",
+"@sveltejs/kit": "^3.3.1",
// esbuild is added because Vite 8 does not ship it; without it: Cannot find package 'esbuild'
+"esbuild": "^0.28.2",
// vite.config.js: esbuild accepts the rule Lightning CSS rejects; JS minify stays on the default
+build: { cssMinify: 'esbuild' },
~~~
repro: none
check: npx --no-install vite build # exit 0, the emitted .css keeps @container anchored(...)
sources:
- https://github.com/sveltejs/kit/issues/17794
- https://github.com/sveltejs/kit/pull/17797
- https://github.com/sveltejs/kit/releases/tag/%40sveltejs/kit%403.3.1
don't:
- set build.cssMinify: 'esbuild' in vite.config while still on Kit 3.3.0 or older — Kit's build plugin overwrites it with true (minify unset), so Lightning CSS still runs and the same SyntaxError returns even with esbuild installed (×1)
- set build.minify: false to get past the minify step — Kit then derives cssMinify false as well: the build passes only because JS and CSS ship unminified (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/sveltekit-syntaxerror-lightningcss-minify-unexpected-token-function-1f59/worked?v=<version> or https://api.modalhub.ai/r/sveltekit-syntaxerror-lightningcss-minify-unexpected-token-function-1f59/didnt?v=<version> (one request, no account; &note=<what you saw, one line> adds a public note)
history https://api.modalhub.ai/r/sveltekit-syntaxerror-lightningcss-minify-unexpected-token-function-1f59/history · license CC0-1.0
