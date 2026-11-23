Canonical: https://api.modalhub.ai/r/numpy-attributeerror-module-numpy-has-no-attribute-1c43 · JSON: https://api.modalhub.ai/r/numpy-attributeerror-module-numpy-has-no-attribute-1c43.json · history: https://api.modalhub.ai/r/numpy-attributeerror-module-numpy-has-no-attribute-1c43/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "AttributeError: module 'numpy' has no attribute 'trapz'. Did you mean…" — numpy 2.4
cause: NumPy 2.4 removed np.trapz (deprecated in 2.0 in favour of np.trapezoid) and np.in1d; numpy's module __getattr__ finds nothing and Python suggests the nearest name, trace
status: no reports yet · published on numpy 2.4.0
arms: works 2.4
risk: low
fix (patch):
~~~
-area = np.trapz(y, x)
+area = np.trapezoid(y, x)    # NumPy >= 2.0, same arguments (y, x=None, dx=1.0, axis=-1)
-mask = np.in1d(a, b)
+mask = np.isin(a, b)         # in1d went in the same release; isin keeps a's shape, in1d flattened
# code that must also run on NumPy 1.x: from scipy.integrate import trapezoid
~~~
repro: python -c "import numpy as np; np.trapz([1, 2, 3])"
check: grep -rnE "\b(trapz|in1d)\(" --include=*.py . || echo clean
don't:
- follow the hint and call np.trace — trace returns the sum along an array's diagonals, not an integral; Python only picked the closest attribute name (×1)
- switch to scipy.integrate.trapz — SciPy 1.14 removed that name too (it became trapezoid in 1.6); use scipy.integrate.trapezoid (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/numpy-attributeerror-module-numpy-has-no-attribute-1c43/worked?v=<version> or https://api.modalhub.ai/r/numpy-attributeerror-module-numpy-has-no-attribute-1c43/didnt?v=<version> (one request, no account)
history https://api.modalhub.ai/r/numpy-attributeerror-module-numpy-has-no-attribute-1c43/history · license CC0-1.0
