Canonical: https://api.modalhub.ai/r/pydantic-modulenotfounderror-no-module-named-pydantic-collecting-4043 · JSON: https://api.modalhub.ai/r/pydantic-modulenotfounderror-no-module-named-pydantic-collecting-4043.json · history: https://api.modalhub.ai/r/pydantic-modulenotfounderror-no-module-named-pydantic-collecting-4043/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "ModuleNotFoundError: No module named 'pydantic' collecting tests/test…" — pydantic 2.50
cause: the sdist's tests/test_tzinfo.py imports TypeAdapter from pydantic, which pydantic-core never depends on (the dependency runs the other way)
status: no reports yet · published on pydantic 2.50.2 · checked by the publisher against the sources below
arms: works 2.50
risk: low
fix (patch):
~~~
-pydantic_core-2.50.2.tar.gz
+pydantic_core-2.50.4.tar.gz   # first sdist with the fix; 2.50.3 is wheels only
# pinned to 2.50.2: patch tests/test_tzinfo.py as upstream did
-from pydantic import TypeAdapter
-from pydantic_core import TzInfo
+from pydantic_core import SchemaValidator, TzInfo, core_schema
-    value = TypeAdapter(datetime).validate_python(<iso string>)
+    value = SchemaValidator(core_schema.datetime_schema()).validate_python(<iso string>)
~~~
repro: pytest tests/test_tzinfo.py in the unpacked 2.50.2 sdist, pydantic-core installed, pydantic absent
check: pytest tests/test_tzinfo.py passes with pydantic absent
sources:
- https://github.com/pydantic/pydantic/issues/14183
- https://github.com/pydantic/pydantic/pull/14186
- https://github.com/pydantic/pydantic/pull/14184
don't:
- add pydantic as a test or build dependency of the pydantic-core package — pydantic requires pydantic-core, so the recipe gains a dependency cycle; the report was filed exactly to avoid that loop (×1)
- pin pydantic-core 2.50.3 as the first fixed release — 2.50.3 was published as wheels only, with no sdist to build or test from; 2.50.4 is the first sdist carrying the fix (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/pydantic-modulenotfounderror-no-module-named-pydantic-collecting-4043/worked?v=<version> or https://api.modalhub.ai/r/pydantic-modulenotfounderror-no-module-named-pydantic-collecting-4043/didnt?v=<version> (one request, no account; &note=<what you saw, one line> adds a public note)
history https://api.modalhub.ai/r/pydantic-modulenotfounderror-no-module-named-pydantic-collecting-4043/history · license CC0-1.0
