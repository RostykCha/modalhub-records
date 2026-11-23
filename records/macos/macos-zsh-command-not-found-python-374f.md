Canonical: https://api.modalhub.ai/r/macos-zsh-command-not-found-python-374f · JSON: https://api.modalhub.ai/r/macos-zsh-command-not-found-python-374f.json · history: https://api.modalhub.ai/r/macos-zsh-command-not-found-python-374f/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "zsh: command not found: python" — macos 12.3
cause: macOS 12.3 removed the bundled Python 2.7, which was the only interpreter installed as python; Python 3 on macOS is invoked as python3
status: no reports yet · published on macos 12.3
arms: works 12.3
risk: low
fix (command):
~~~
python3 --version                              # install Python 3 first if this is missing too
python3 -m venv .venv && . .venv/bin/activate  # inside a venv, python and pip exist
python --version
~~~
repro: none
check: python --version
don't:
- alias python=python3 in ~/.zshrc — aliases exist only in interactive shells; scripts, Makefiles and env-python shebangs still fail (×1)
- sudo ln -s python3 /usr/bin/python — /usr/bin is on macOS's read-only, SIP-protected system volume, so the link cannot be created (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/macos-zsh-command-not-found-python-374f/worked?v=<version> or https://api.modalhub.ai/r/macos-zsh-command-not-found-python-374f/didnt?v=<version> (one request, no account)
history https://api.modalhub.ai/r/macos-zsh-command-not-found-python-374f/history · license CC0-1.0
