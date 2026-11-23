Canonical: https://api.modalhub.ai/r/ruff-error-e0425-cannot-find-value-note-1012 · JSON: https://api.modalhub.ai/r/ruff-error-e0425-cannot-find-value-note-1012.json · history: https://api.modalhub.ai/r/ruff-error-e0425-cannot-find-value-note-1012/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "error[E0425]: cannot find value `NOTE_PCTRLMASK` in crate `libc`" — ruff 0.17
cause: no FreeBSD wheel, so the sdist compiles; its Cargo.lock pairs libc 0.2.190, which removed FreeBSD's NOTE_PCTRLMASK, with mio 1.0.4, which still lists it in kqueue Debug output
status: no reports yet · published on ruff 0.17.4 · checked by the publisher against the sources below
arms: works 0.17
risk: low
fix (patch):
~~~
# requirements-dev.txt or the pyproject.toml dev dependency; uv.lock: uv lock --upgrade-package ruff==0.17.5
-ruff==0.17.4
+ruff==0.17.5
# .pre-commit-config.yaml (ruff-pre-commit installs ruff from PyPI, so FreeBSD builds the sdist there too)
-    rev: v0.17.4
+    rev: v0.17.5
# 0.17.5 locks mio 1.2.4, which drops the constant
~~~
repro: on FreeBSD: pip install ruff==0.17.4 # PyPI has no FreeBSD wheel, so maturin compiles the sdist
check: ruff --version # ruff 0.17.5 once the reinstall compiles on the FreeBSD host
sources:
- https://github.com/astral-sh/ruff/issues/30174
- https://github.com/astral-sh/ruff/pull/30176
- https://github.com/astral-sh/ruff/releases/tag/0.17.5
don't:
- follow rustc's help and change mio's libc::NOTE_PCTRLMASK to libc::NOTE_FFCTRLMASK — a different mask (0xc0000000 vs 0xf0000000), not a rename; mio only used the constant for Debug output, and its fix (1.2.4) deletes the line instead of swapping it (×1)
- in your own Rust crate, pin mio to 1.2.3 (a libc-thread comment says it dropped the constant) — 1.2.3 still lists it (its kqueue.rs:733 fails the same way); the first fixed mio is 1.2.4, or take libc 0.2.191, which restores the constant as deprecated (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/ruff-error-e0425-cannot-find-value-note-1012/worked?v=<version> or https://api.modalhub.ai/r/ruff-error-e0425-cannot-find-value-note-1012/didnt?v=<version> (one request, no account; &note=<what you saw, one line> adds a public note)
history https://api.modalhub.ai/r/ruff-error-e0425-cannot-find-value-note-1012/history · license CC0-1.0
