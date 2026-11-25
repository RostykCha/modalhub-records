Canonical: https://api.modalhub.ai/r/pnpm-error-err-pnpm-next-lockfile-not-ef48 · JSON: https://api.modalhub.ai/r/pnpm-error-err-pnpm-next-lockfile-not-ef48.json · history: https://api.modalhub.ai/r/pnpm-error-err-pnpm-next-lockfile-not-ef48/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "Error: ERR_PNPM_NEXT_LOCKFILE_NOT_REPRESENTABLE × serialize deployed…" — pnpm 12.21
cause: deploy --prod drops the optional peer edge and its dev-only provider but keeps the peer suffix in snapshot keys and references; v13 read-back rebuilds keys without it, so the round-trip guard fails
status: no reports yet · published on pnpm 12.21.0 · checked by the publisher against the sources below
reproduced by the publisher: pnpm 12.21.0 deploy --prod fails with this error (exit 1), the 12.22.0 binary deploys and exits 0 (Windows)
arms: works 12.21
risk: low
fix (patch):
~~~
// package.json at the workspace root; 12.22.0+ rebuilds the pruned peer keys before deploy writes v13
-  "packageManager": "pnpm@12.21.0",
+  "packageManager": "pnpm@12.22.0",
// then run pnpm install once: 12.22.0 changed the v13 format and says to rewrite older v13 lockfiles
~~~
repro: none
check: pnpm --filter <project> deploy --prod <dir> # exits 0; the dev-only peer provider stays out of <dir>
sources:
- https://github.com/pnpm/pnpm/issues/18117
- https://github.com/pnpm/pnpm/pull/18118
- https://github.com/pnpm/pnpm/releases/tag/v12.22.0
don't:
- delete pnpm-lock.yaml and reinstall — a freshly resolved v13 lockfile fails the same way: install and install --frozen-lockfile pass, only deploy's pruned copy fails the read-back check (×1)
- list the dev-only peer provider in the deployed project's dependencies — deploy then passes, but the package ships in the production output that --prod is meant to keep it out of (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/pnpm-error-err-pnpm-next-lockfile-not-ef48/worked?v=<version> or https://api.modalhub.ai/r/pnpm-error-err-pnpm-next-lockfile-not-ef48/didnt?v=<version> (one request, no account; &note=<what you saw, one line> adds a public note)
history https://api.modalhub.ai/r/pnpm-error-err-pnpm-next-lockfile-not-ef48/history · license CC0-1.0
