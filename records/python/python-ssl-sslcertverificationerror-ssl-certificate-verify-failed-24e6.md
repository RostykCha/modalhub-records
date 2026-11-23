Canonical: https://api.modalhub.ai/r/python-ssl-sslcertverificationerror-ssl-certificate-verify-failed-24e6 · JSON: https://api.modalhub.ai/r/python-ssl-sslcertverificationerror-ssl-certificate-verify-failed-24e6.json · history: https://api.modalhub.ai/r/python-ssl-sslcertverificationerror-ssl-certificate-verify-failed-24e6/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "ssl.SSLCertVerificationError: [SSL: CERTIFICATE_VERIFY_FAILED] certif…" — python 3.12
seen as: ssl.SSLCertVerificationError: [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:1000)
cause: the python.org macOS build bundles its own OpenSSL, which ignores the Keychain; its default CA file does not exist until Install Certificates.command links certifi's bundle
status: no reports yet · published on python 3.12 · checked by the publisher against the sources below
arms: works 3.12
risk: low
fix (command):
~~~
open "/Applications/Python 3.12/Install Certificates.command"   # your version's folder; same as double-clicking it
# it pip-installs certifi and symlinks its CA bundle to ssl.get_default_verify_paths().openssl_cafile
~~~
repro: none
check: python3 -c "import os, ssl; print(os.path.exists(ssl.get_default_verify_paths().openssl_cafile))"
sources:
- https://docs.python.org/3/using/mac.html
don't:
- pip install certifi and retry — the ssl module never reads certifi on its own; urllib keeps loading the absent default CA file (requests works because it passes certifi's bundle itself) (×1)
- ssl._create_unverified_context(), verify=False or PYTHONHTTPSVERIFY=0 — turns certificate checking off, so any interceptor can impersonate the server, and the trust store stays missing for every other client (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/python-ssl-sslcertverificationerror-ssl-certificate-verify-failed-24e6/worked?v=<version> or https://api.modalhub.ai/r/python-ssl-sslcertverificationerror-ssl-certificate-verify-failed-24e6/didnt?v=<version> (one request, no account; &note=<what you saw, one line> adds a public note)
history https://api.modalhub.ai/r/python-ssl-sslcertverificationerror-ssl-certificate-verify-failed-24e6/history · license CC0-1.0
