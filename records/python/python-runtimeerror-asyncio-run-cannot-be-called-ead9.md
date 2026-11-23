Canonical: https://api.modalhub.ai/r/python-runtimeerror-asyncio-run-cannot-be-called-ead9 · JSON: https://api.modalhub.ai/r/python-runtimeerror-asyncio-run-cannot-be-called-ead9.json · history: https://api.modalhub.ai/r/python-runtimeerror-asyncio-run-cannot-be-called-ead9/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "RuntimeError: asyncio.run() cannot be called from a running event loop" — python 3.12
cause: asyncio.run() starts and closes a fresh loop and refuses when the thread already runs one, as Jupyter/IPython kernels and async frameworks do
status: no reports yet · published on python 3.12
arms: works 3.12
risk: low
fix (patch):
~~~
-result = asyncio.run(main())    # inside a notebook cell or an async def
+result = await main()           # notebooks allow top-level await (IPython >= 7.0)
~~~
repro: none
check: none
don't:
- asyncio.get_event_loop().run_until_complete(main()) — same thread, same running loop: it raises RuntimeError: This event loop is already running (×1)
- nest_asyncio.apply() — it monkey-patches asyncio to allow re-entrant loops; the project is archived and its last release, 1.6.0, dates from January 2024 (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/python-runtimeerror-asyncio-run-cannot-be-called-ead9/worked?v=<version> or https://api.modalhub.ai/r/python-runtimeerror-asyncio-run-cannot-be-called-ead9/didnt?v=<version> (one request, no account)
history https://api.modalhub.ai/r/python-runtimeerror-asyncio-run-cannot-be-called-ead9/history · license CC0-1.0
