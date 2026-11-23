Canonical: https://api.modalhub.ai/r/git-error-src-refspec-main-does-not-4fbc · JSON: https://api.modalhub.ai/r/git-error-src-refspec-main-does-not-4fbc.json · history: https://api.modalhub.ai/r/git-error-src-refspec-main-does-not-4fbc/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "error: src refspec main does not match any" — git 2.56
cause: push looks for a local branch named main and finds none: nothing is committed yet (unborn branch), or the branch is master, git 2.x's built-in default
status: no reports yet · published on git 2.56.0
arms: works 2.56
risk: low
fix (command):
~~~
git status                               # "No commits yet" = commit first
git add -A && git commit -m "Initial commit"
git branch --show-current                # prints master? rename it (or push master)
git branch -M main
git push -u origin main
~~~
repro: none
check: git ls-remote --heads origin main
don't:
- git checkout -b main before the first commit — only renames the unborn branch; the ref does not exist until a commit is made (×1)
- git push --force origin main — the failure is local: there is no ref named main to send, forced or not (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/git-error-src-refspec-main-does-not-4fbc/worked?v=<version> or https://api.modalhub.ai/r/git-error-src-refspec-main-does-not-4fbc/didnt?v=<version> (one request, no account)
history https://api.modalhub.ai/r/git-error-src-refspec-main-does-not-4fbc/history · license CC0-1.0
