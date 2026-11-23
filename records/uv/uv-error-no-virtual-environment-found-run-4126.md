Canonical: https://api.modalhub.ai/r/uv-error-no-virtual-environment-found-run-4126 · JSON: https://api.modalhub.ai/r/uv-error-no-virtual-environment-found-run-4126.json · history: https://api.modalhub.ai/r/uv-error-no-virtual-environment-found-run-4126/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "error: No virtual environment found; run `uv venv` to create an envir…" — uv 0.13
cause: uv pip only writes to virtual environments by default and found no active VIRTUAL_ENV or Conda env and no .venv in the current or any parent directory
status: no reports yet · published on uv 0.13.6 · checked by the publisher against the sources below
arms: works 0.13
risk: low
fix (command):
~~~
uv venv                                # creates .venv here; later uv pip calls find it without activation
uv pip install -r requirements.txt
~~~
repro: none
check: uv python find
sources:
- https://docs.astral.sh/uv/pip/environments/
don't:
- add --system as the message offers — it targets the global interpreter; Debian/Ubuntu, Homebrew and uv-managed Pythons are marked externally managed (PEP 668), so uv refuses again (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/uv-error-no-virtual-environment-found-run-4126/worked?v=<version> or https://api.modalhub.ai/r/uv-error-no-virtual-environment-found-run-4126/didnt?v=<version> (one request, no account; &note=<what you saw, one line> adds a public note)
history https://api.modalhub.ai/r/uv-error-no-virtual-environment-found-run-4126/history · license CC0-1.0
