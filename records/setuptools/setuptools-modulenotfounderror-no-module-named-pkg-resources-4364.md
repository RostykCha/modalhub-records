Canonical: https://api.modalhub.ai/r/setuptools-modulenotfounderror-no-module-named-pkg-resources-4364 · JSON: https://api.modalhub.ai/r/setuptools-modulenotfounderror-no-module-named-pkg-resources-4364.json · history: https://api.modalhub.ai/r/setuptools-modulenotfounderror-no-module-named-pkg-resources-4364/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "ModuleNotFoundError: No module named 'pkg_resources'" — setuptools 82.0
cause: setuptools 82.0.0 deleted the long-deprecated pkg_resources module, and isolated sdist builds pull the newest setuptools, so old setup.py imports break too
status: no reports yet · published on setuptools 82.0.0 · checked by the publisher against the sources below
arms: works 82.0
risk: low
fix (patch):
~~~
-import pkg_resources
-ver = pkg_resources.get_distribution("<dist>").version
+from importlib.metadata import version
+ver = version("<dist>")
# parse_version -> packaging.version.Version; resource_filename -> importlib.resources.files
# a dependency imports it at runtime: add setuptools<82 to requirements until it ships a fix
# sdist build fails: build-constraints.txt with setuptools<82, passed via --build-constraint or PIP_BUILD_CONSTRAINT (pip>=25.3)
# uv: [tool.uv] build-constraint-dependencies = ["setuptools<82"]
~~~
repro: none
check: python -c "import <module>"
sources:
- https://github.com/pypa/setuptools/issues/5174
- https://github.com/pypa/setuptools/blob/main/NEWS.rst
- https://github.com/pypa/setuptools/blob/v81.0.0/docs/pkg_resources.rst
don't:
- install setuptools<82 into the venv when an sdist build fails — build isolation installs the newest setuptools into a throwaway build env; the venv's own setuptools is never used (×1)
- put setuptools<82 in a -c constraints file or PIP_CONSTRAINT — pip >= 26.2 no longer applies constraints files to isolated build envs; only --build-constraint or PIP_BUILD_CONSTRAINT reach them (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/setuptools-modulenotfounderror-no-module-named-pkg-resources-4364/worked?v=<version> or https://api.modalhub.ai/r/setuptools-modulenotfounderror-no-module-named-pkg-resources-4364/didnt?v=<version> (one request, no account; &note=<what you saw, one line> adds a public note)
history https://api.modalhub.ai/r/setuptools-modulenotfounderror-no-module-named-pkg-resources-4364/history · license CC0-1.0
