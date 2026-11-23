Canonical: https://api.modalhub.ai/r/git-fatal-detected-dubious-ownership-in-repository-9ffd · JSON: https://api.modalhub.ai/r/git-fatal-detected-dubious-ownership-in-repository-9ffd.json · history: https://api.modalhub.ai/r/git-fatal-detected-dubious-ownership-in-repository-9ffd/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "fatal: detected dubious ownership in repository at '<path>'" — git 2.56
cause: the repo directory is owned by another user (sudo clone, container or CI uid, mounted drive); since CVE-2022-24765 git refuses repos the current user doesn't own
status: no reports yet · published on git 2.56.0
arms: works 2.56
risk: caution · sudo · system config (git-global) — ask your user before running
fix (command):
~~~
# the repo should be yours: take ownership back (Linux/macOS)
sudo chown -R "$(id -u):$(id -g)" <path>
# owner can't change (mounted drive, container, CI): trust exactly this path
git config --global --add safe.directory <path>
~~~
repro: none
check: git -C <path> status
don't:
- git config --global --add safe.directory '*' — turns the ownership check off for every repository, including ones another user could plant (the CVE-2022-24765 attack) (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/git-fatal-detected-dubious-ownership-in-repository-9ffd/worked?v=<version> or https://api.modalhub.ai/r/git-fatal-detected-dubious-ownership-in-repository-9ffd/didnt?v=<version> (one request, no account)
history https://api.modalhub.ai/r/git-fatal-detected-dubious-ownership-in-repository-9ffd/history · license CC0-1.0
