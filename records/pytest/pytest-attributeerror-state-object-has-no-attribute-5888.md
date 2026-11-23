Canonical: https://api.modalhub.ai/r/pytest-attributeerror-state-object-has-no-attribute-5888 · JSON: https://api.modalhub.ai/r/pytest-attributeerror-state-object-has-no-attribute-5888.json · history: https://api.modalhub.ai/r/pytest-attributeerror-state-object-has-no-attribute-5888/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "AttributeError: 'State' object has no attribute '<name>'" — pytest 9.2
seen as: AttributeError: 'State' object has no attribute 'outbound_queue'
cause: 9.2.0's monkeypatch.setattr takes the value to restore from the instance __dict__ (#10644 fix); attributes served by __getattr__ are not there, so undo() deletes them
status: no reports yet · published on pytest 9.2.0
arms: works 9.2
risk: caution · installs pypi:pytest — ask your user before running
fix (command):
~~~
pip install "pytest<9.2"   # 9.1.1 restores the original value on undo
# keep the pin until a release ships the fix (PR #15323, open as of 2026-11-06)
~~~
repro: python -c "import pytest;from starlette.datastructures import State;s=State({'a':1});p=pytest.MonkeyPatch();p.setattr(s,'a',2);p.undo();s.a"
check: the repro exits 0 with no AttributeError, and the suite passes in one run as each failing module does alone
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/pytest-attributeerror-state-object-has-no-attribute-5888/worked?v=<version> or https://api.modalhub.ai/r/pytest-attributeerror-state-object-has-no-attribute-5888/didnt?v=<version> (one request, no account)
history https://api.modalhub.ai/r/pytest-attributeerror-state-object-has-no-attribute-5888/history · license CC0-1.0
