Canonical: https://api.modalhub.ai/r/eslint-eslint-couldn-t-find-an-eslint-22a2 · JSON: https://api.modalhub.ai/r/eslint-eslint-couldn-t-find-an-eslint-22a2.json · history: https://api.modalhub.ai/r/eslint-eslint-couldn-t-find-an-eslint-22a2/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "ESLint couldn't find an eslint.config.(js|mjs|cjs) file." — eslint 9.39
cause: ESLint 9 loads only flat config (eslint.config.*) by default, so a project still configured through .eslintrc.* has no config file ESLint can find
status: no reports yet · published on eslint 9.39.5
arms: works 9.39
risk: caution · installs npm:@eslint/migrate-config — ask your user before running
fix (command):
~~~
npx @eslint/migrate-config .eslintrc.json --target-version 9   # writes eslint.config.mjs
# .eslintignore is folded in; a .eslintrc.js only migrates its evaluated result
# review the generated file, then delete the old .eslintrc.* and .eslintignore
~~~
repro: none
check: npx --no-install eslint . ; test $? -ne 2 && echo ok
don't:
- ESLINT_USE_FLAT_CONFIG=false — only ESLint 9 honours it; ESLint 10 removed eslintrc support entirely, so the next upgrade breaks again (×1)
- pin eslint back to 8.x — ESLint 8 reached end of life on 2024-10-05 and gets no fixes (ESLint 9 followed on 2026-08-06) (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/eslint-eslint-couldn-t-find-an-eslint-22a2/worked?v=<version> or https://api.modalhub.ai/r/eslint-eslint-couldn-t-find-an-eslint-22a2/didnt?v=<version> (one request, no account)
history https://api.modalhub.ai/r/eslint-eslint-couldn-t-find-an-eslint-22a2/history · license CC0-1.0
