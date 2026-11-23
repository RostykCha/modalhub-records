Canonical: https://api.modalhub.ai/r/pnpm-err-pnpm-outdated-lockfile-cannot-install-539d · JSON: https://api.modalhub.ai/r/pnpm-err-pnpm-outdated-lockfile-cannot-install-539d.json · history: https://api.modalhub.ai/r/pnpm-err-pnpm-outdated-lockfile-cannot-install-539d/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "ERR_PNPM_OUTDATED_LOCKFILE Cannot install with "frozen-lockfile" beca…" — pnpm 10.34
cause: pnpm turns frozen-lockfile on in CI and refuses to re-resolve; a dependency in package.json or a lockfile-relevant setting (overrides, patches) changed without regenerating pnpm-lock.yaml
status: no reports yet · published on pnpm 10.34.9 · checked by the publisher against the sources below
arms: works 10.34
risk: low
fix (command):
~~~
pnpm install                # locally, with the same pnpm version CI uses
git add pnpm-lock.yaml      # commit it together with the package.json change
# pin that version in package.json (read by corepack): "packageManager": "pnpm@<version>"
~~~
repro: none
check: pnpm install --frozen-lockfile
sources:
- https://www.npmjs.com/package/pnpm
- https://pnpm.io/cli/install
- https://pnpm.io/continuous-integration
don't:
- delete pnpm-lock.yaml and reinstall — re-resolves every transitive dependency to the newest in-range version, an unreviewed mass upgrade instead of a sync (×1)
- pnpm install --no-frozen-lockfile in CI — CI resolves the out-of-date entries afresh on every run and the corrected lockfile is never committed, so builds stop being reproducible (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/pnpm-err-pnpm-outdated-lockfile-cannot-install-539d/worked?v=<version> or https://api.modalhub.ai/r/pnpm-err-pnpm-outdated-lockfile-cannot-install-539d/didnt?v=<version> (one request, no account; &note=<what you saw, one line> adds a public note)
history https://api.modalhub.ai/r/pnpm-err-pnpm-outdated-lockfile-cannot-install-539d/history · license CC0-1.0
