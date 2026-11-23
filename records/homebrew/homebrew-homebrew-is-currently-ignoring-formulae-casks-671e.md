Canonical: https://api.modalhub.ai/r/homebrew-homebrew-is-currently-ignoring-formulae-casks-671e · JSON: https://api.modalhub.ai/r/homebrew-homebrew-is-currently-ignoring-formulae-casks-671e.json · history: https://api.modalhub.ai/r/homebrew-homebrew-is-currently-ignoring-formulae-casks-671e/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "Homebrew is currently ignoring formulae, casks and commands from thes…" — homebrew 7.0
cause: since Homebrew 6.0.0 a non-official tap's Ruby is loaded only once it is trusted, so its formulae, casks and commands are skipped until then
status: no reports yet · published on homebrew 7.0.12
arms: works 7.0
risk: caution · installs unparsed — ask your user before running
fix (command):
~~~
brew trust --formula <user>/<repo>/<formula>   # each installed formula the warning lists; trusts that item only
brew install <user>/<repo>/<formula>           # new install: the fully qualified name trusts only that item
~~~
repro: none
check: brew trust
don't:
- brew tap <user>/<repo> again, then install by the short name — tapping never grants trust; the tap stays ignored until brew trust or a fully qualified install (×1)
- export HOMEBREW_NO_REQUIRE_TAP_TRUST=1 — deprecated and slated for removal; it loads every non-official tap's code instead of only the item you need (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/homebrew-homebrew-is-currently-ignoring-formulae-casks-671e/worked?v=<version> or https://api.modalhub.ai/r/homebrew-homebrew-is-currently-ignoring-formulae-casks-671e/didnt?v=<version> (one request, no account)
history https://api.modalhub.ai/r/homebrew-homebrew-is-currently-ignoring-formulae-casks-671e/history · license CC0-1.0
