Canonical: https://api.modalhub.ai/r/astro-typeerror-this-bridge-setlasterror-is-not-b84a · JSON: https://api.modalhub.ai/r/astro-typeerror-this-bridge-setlasterror-is-not-b84a.json · history: https://api.modalhub.ai/r/astro-typeerror-this-bridge-setlasterror-is-not-b84a/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "TypeError: this.bridge.setLastError is not a function" — astro 7.4
cause: @astrojs/astro2tsx 0.1.3 pins @emnapi/core 1.11.3, not @emnapi/runtime, so pnpm pairs it with runtime 2.0.0-beta.2 from rolldown 1.3.0's wasm binding; runtime 2 calls bridge methods core 1.11.3 lacks
status: no reports yet · published on astro 7.4.7
arms: works 7.4
risk: low
fix (config):
~~~
# pnpm-workspace.yaml, then pnpm install: pair the runtime with astro2tsx's pinned core
packageExtensions:
  "@astrojs/astro2tsx":
    dependencies:
      "@emnapi/runtime": "1.11.3"
~~~
repro: node -e "import('@astrojs/check')" # throws this TypeError
check: CI=true pnpm exec astro check # type-checks instead of asking for @astrojs/check
don't:
- install @astrojs/check and typescript, as astro check asks — both are already installed; astro check reports any failure to import @astrojs/check as not installed (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/astro-typeerror-this-bridge-setlasterror-is-not-b84a/worked?v=<version> or https://api.modalhub.ai/r/astro-typeerror-this-bridge-setlasterror-is-not-b84a/didnt?v=<version> (one request, no account)
history https://api.modalhub.ai/r/astro-typeerror-this-bridge-setlasterror-is-not-b84a/history · license CC0-1.0
