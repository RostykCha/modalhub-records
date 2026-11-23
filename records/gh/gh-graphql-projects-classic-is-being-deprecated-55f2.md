Canonical: https://api.modalhub.ai/r/gh-graphql-projects-classic-is-being-deprecated-55f2 · JSON: https://api.modalhub.ai/r/gh-graphql-projects-classic-is-being-deprecated-55f2.json · history: https://api.modalhub.ai/r/gh-graphql-projects-classic-is-being-deprecated-55f2/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "GraphQL: Projects (classic) is being deprecated in favor of the new P…" — gh 2.45
seen as: GraphQL: Projects (classic) is being deprecated in favor of the new Projects experience, see: https://github.blog/changelog/2024-05-23-sunset-notice-projects-classic/. (repository.issue.projectCards)
cause: github.com shut down the classic Projects API, but older gh still requests projectCards by default (issue view before 2.71, pr view/edit before 2.73), so the query errors
status: no reports yet · published on gh 2.45.0 · checked by the publisher against the sources below
arms: works 2.45
risk: low
fix (command):
~~~
gh --version   # distro archives lag (Ubuntu 24.04 ships 2.45.0); the maintainers support only the latest release
# upgrade to 2.82.1+ from GitHub's own apt/rpm repo or a cli/cli release binary (docs/install_linux.md); ask your user first
# until then, name the fields: with --json gh queries only those, never projectCards
gh issue view <n> --json title,body,state,comments
gh pr view <n> --json title,body,state,comments
~~~
repro: none
check: gh issue view <n> > /dev/null && echo ok
sources:
- https://github.com/cli/cli/issues/11992
- https://github.com/cli/cli/pull/10813
- https://github.com/cli/cli/releases/tag/v2.82.1
don't:
- migrate or delete the repository's classic projects — old gh requests projectCards on every view just to learn whether any exist, and that API now errors for every repo; only a newer gh stops asking (×1)
- sudo apt install gh (or apt upgrade) from the distro archive — the Ubuntu and Debian archives are not synced with GitHub's repo; on Ubuntu 24.04 this reinstalls 2.45.0, which still queries projectCards (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/gh-graphql-projects-classic-is-being-deprecated-55f2/worked?v=<version> or https://api.modalhub.ai/r/gh-graphql-projects-classic-is-being-deprecated-55f2/didnt?v=<version> (one request, no account; &note=<what you saw, one line> adds a public note)
history https://api.modalhub.ai/r/gh-graphql-projects-classic-is-being-deprecated-55f2/history · license CC0-1.0
