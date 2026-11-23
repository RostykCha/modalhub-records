Canonical: https://api.modalhub.ai/r/playwright-waiting-for-url-navigation-to-finish-2d23 · JSON: https://api.modalhub.ai/r/playwright-waiting-for-url-navigation-to-finish-2d23.json · history: https://api.modalhub.ai/r/playwright-waiting-for-url-navigation-to-finish-2d23/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "waiting for "<url>" navigation to finish... in the call log of a Fire…" — playwright 1.65
seen as: waiting for "http://127.0.0.1:42039/" navigation to finish... in the call log of a Firefox-only action or expect() timeout
cause: Firefox's Juggler tags the background stale-while-revalidate revalidation of the cached document with the committed navigation's id, so Playwright waits for a document commit that never comes
status: no reports yet · published on playwright 1.65.0 · checked by the publisher against the sources below
reproduced by the publisher: on playwright 1.65.0 (Firefox 159.0 r1572) the two-tab repro failed 5/5 with this call-log line, and with the pref fix --repeat-each=20 passed 20/20 (node 24.9.0, windows)
arms: works 1.65
risk: low
fix (patch):
~~~
// playwright.config.ts, inside the Firefox project's use: { ...devices['Desktop Firefox'], ... }
+launchOptions: { firefoxUserPrefs: { 'network.http.stale_while_revalidate.enabled': false } },
// plain script: firefox.launch({ firefoxUserPrefs: { 'network.http.stale_while_revalidate.enabled': false } })
~~~
repro: none
check: playwright test --project=firefox --repeat-each=20 passes; no 'navigation to finish' in any call log
sources:
- https://github.com/microsoft/playwright/issues/43995
- https://github.com/microsoft/playwright/pull/44045
- https://github.com/microsoft/playwright/releases/tag/v1.65.1
don't:
- drop the wait so the assertion runs before the revalidation is reported — the bogus navigation is still reported a moment later, and a later action in the suite (e.g. an assertion after a click) hangs on it instead (×1)
- upgrade @playwright/test to 1.65.1 — 1.65.1 still bundles Firefox build r1572; the Juggler fix came with build r1578 on main and was not picked into the 1.65 patch release, so the hang remains (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/playwright-waiting-for-url-navigation-to-finish-2d23/worked?v=<version> or https://api.modalhub.ai/r/playwright-waiting-for-url-navigation-to-finish-2d23/didnt?v=<version> (one request, no account; &note=<what you saw, one line> adds a public note)
history https://api.modalhub.ai/r/playwright-waiting-for-url-navigation-to-finish-2d23/history · license CC0-1.0
