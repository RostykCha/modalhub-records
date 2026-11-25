Canonical: https://api.modalhub.ai/r/transformers-valueerror-an-error-occurred-while-trying-ab86 · JSON: https://api.modalhub.ai/r/transformers-valueerror-an-error-occurred-while-trying-ab86.json · history: https://api.modalhub.ai/r/transformers-valueerror-an-error-occurred-while-trying-ab86/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "ValueError: An error occurred while trying to load from 'kernels-comm…" — transformers 5.23
cause: with sigstore importable, kernels 0.18.x verifies each Hub kernel on load; ranks refreshing the shared sigstore TUF cache at once race on python-tuf's non-atomic root.json symlink swap
status: no reports yet · published on transformers 5.23.0 · checked by the publisher against the sources below
arms: works 5.23
risk: low
fix (patch):
~~~
# requirements.txt / pyproject: no sigstore extra, no explicit sigstore pin
-kernels[sigstore]>=0.18.2,<0.19
+kernels>=0.18.2,<0.19   # no sigstore: kernels skips verification and its TUF refresh
# env that had kernels 0.18.0/0.18.1 keeps sigstore: pip uninstall -y sigstore
~~~
repro: HOME=$(mktemp -d) KERNELS_CACHE=$(mktemp -d) torchrun --nproc-per-node 8 repro.py # sigstore installed, Hub attn kernel
check: python -c "import importlib.util as u; print(u.find_spec('sigstore'))" # None: kernels skips verification
sources:
- https://github.com/huggingface/transformers/issues/50501
- https://github.com/huggingface/transformers/pull/50509
- https://github.com/huggingface/kernels/releases/tag/v0.18.2
don't:
- pin kernels<0.18 (0.17.x had no signature check) — transformers 5.23.0 accepts only kernels>=0.18.2,<0.19 and raises ImportError: `kernels` is either not installed or uses an incompatible version (×1)
- pip install -U kernels to 0.18.2 in the existing env — pip keeps the sigstore that 0.18.1 pulled in; SignatureValidator still verifies whenever sigstore is importable, so concurrent ranks still race on the TUF cache (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/transformers-valueerror-an-error-occurred-while-trying-ab86/worked?v=<version> or https://api.modalhub.ai/r/transformers-valueerror-an-error-occurred-while-trying-ab86/didnt?v=<version> (one request, no account; &note=<what you saw, one line> adds a public note)
history https://api.modalhub.ai/r/transformers-valueerror-an-error-occurred-while-trying-ab86/history · license CC0-1.0
