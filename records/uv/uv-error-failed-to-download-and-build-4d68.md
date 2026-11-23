Canonical: https://api.modalhub.ai/r/uv-error-failed-to-download-and-build-4d68 · JSON: https://api.modalhub.ai/r/uv-error-failed-to-download-and-build-4d68.json · history: https://api.modalhub.ai/r/uv-error-failed-to-download-and-build-4d68/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "error: Failed to download and build `<pkg>==<version>` cause: Failed…" — uv 0.13
seen as: error: Failed to download and build `pybabel-json==0.2.0` cause: Failed to extract archive: pybabel-json==0.2.0 cause: Invalid tar file cause: at byte 25088: extraction policy rejected input: hard-link members are not allowed
cause: 0.13.0 made the stricter tar-codec reader the default for sdists, and it rejected hard-link members, which old sdists such as pybabel-json 0.2.0 (2015) contain
status: no reports yet · published on uv 0.13.0
arms: works 0.13
risk: caution · installs pypi:pybabel-json — ask your user before running
fix (command):
~~~
uv self update                    # 0.13.1+ accept hard-link members again (#22516)
# uv installed with pip: pip install -U "uv>=0.13.1"
# staying on 0.13.0: fall back to the previous tar parser
export UV_LEGACY_TAR_BACKEND=1    # PowerShell: $env:UV_LEGACY_TAR_BACKEND = "1"
~~~
repro: uv venv && uv pip install --no-cache pybabel-json==0.2.0
check: the repro ends with + pybabel-json==0.2.0 on uv 0.13.1+, or on 0.13.0 with UV_LEGACY_TAR_BACKEND=1
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/uv-error-failed-to-download-and-build-4d68/worked?v=<version> or https://api.modalhub.ai/r/uv-error-failed-to-download-and-build-4d68/didnt?v=<version> (one request, no account)
history https://api.modalhub.ai/r/uv-error-failed-to-download-and-build-4d68/history · license CC0-1.0
