Canonical: https://api.modalhub.ai/r/python-modulenotfounderror-no-module-named-audioop-a1fc · JSON: https://api.modalhub.ai/r/python-modulenotfounderror-no-module-named-audioop-a1fc.json · history: https://api.modalhub.ai/r/python-modulenotfounderror-no-module-named-audioop-a1fc/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "ModuleNotFoundError: No module named 'audioop'" — python 3.13
cause: PEP 594 removed audioop from the 3.13 stdlib (deprecated since 3.11), so code and libraries that still import it, such as pydub, fail at import
status: no reports yet · published on python 3.13.0
arms: works 3.13
risk: low
fix (patch):
~~~
# requirements.txt (same marker string in the pyproject.toml dependencies list)
+audioop-lts; python_version >= "3.13"
# backport named in the 3.13 What's New; its module is still imported as audioop
~~~
repro: python3.13 -c "import audioop"
check: python -c "import audioop"
don't:
- add audioop-lts without the python_version marker — every release declares Requires-Python >=3.13, so installs on 3.12 and older fail with No matching distribution found for audioop-lts (×1)
- pip install audioop (or pyaudioop) — neither name exists on PyPI, so pip stops with No matching distribution found; the maintained backport is audioop-lts (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/python-modulenotfounderror-no-module-named-audioop-a1fc/worked?v=<version> or https://api.modalhub.ai/r/python-modulenotfounderror-no-module-named-audioop-a1fc/didnt?v=<version> (one request, no account)
history https://api.modalhub.ai/r/python-modulenotfounderror-no-module-named-audioop-a1fc/history · license CC0-1.0
