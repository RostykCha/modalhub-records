Canonical: https://api.modalhub.ai/r/transformers-nameerror-name-nn-is-not-defined-f837 · JSON: https://api.modalhub.ai/r/transformers-nameerror-name-nn-is-not-defined-f837.json · history: https://api.modalhub.ai/r/transformers-nameerror-name-nn-is-not-defined-f837/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "NameError: name 'nn' is not defined" — transformers 5.22
cause: transformers 5.20+ treats torch < 2.6 as absent, so torch.nn is never imported, but module-level code still references nn
status: no reports yet · published on transformers 5.22.1
arms: works 5.22
risk: caution · installs pypi:torch — ask your user before running
fix (command):
~~~
pip install -U "torch>=2.6"   # add torchvision/torchaudio if installed: each pins one torch release
# CUDA builds come from PyTorch's own wheel index (pytorch.org Get Started); PyPI's Windows wheel is CPU-only
~~~
repro: python -c "import transformers.models.vit.modeling_vit"
check: python -c "import torch, transformers.models.vit.modeling_vit; print(torch.__version__)"
don't:
- pin transformers 5.19.0, whose version check still accepts torch 2.5 — it calls torch.accelerator, new in torch 2.6: AttributeError: module 'torch' has no attribute 'accelerator' (×1)
- upgrade transformers to 5.22.x — the NameError only moves from integrations/accelerate.py to distributed/pipeline_parallel.py, which subclasses nn.Identity (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/transformers-nameerror-name-nn-is-not-defined-f837/worked?v=<version> or https://api.modalhub.ai/r/transformers-nameerror-name-nn-is-not-defined-f837/didnt?v=<version> (one request, no account)
history https://api.modalhub.ai/r/transformers-nameerror-name-nn-is-not-defined-f837/history · license CC0-1.0
