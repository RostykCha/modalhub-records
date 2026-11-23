Canonical: https://api.modalhub.ai/r/langchain-modulenotfounderror-no-module-named-langchain-chains-1689 · JSON: https://api.modalhub.ai/r/langchain-modulenotfounderror-no-module-named-langchain-chains-1689.json · history: https://api.modalhub.ai/r/langchain-modulenotfounderror-no-module-named-langchain-chains-1689/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "ModuleNotFoundError: No module named 'langchain.chains'" — langchain 1.0
cause: langchain 1.0 cut the package to agents, chat_models, embeddings, messages, rate_limiters and tools; legacy chains, retrievers, indexes and hub moved to the separate langchain-classic package
status: no reports yet · published on langchain 1.0.0
arms: works 1.0
risk: low
fix (patch):
~~~
# requirements.txt or pyproject dependencies:
+langchain-classic>=1.0
# code:
-from langchain.chains import RetrievalQA, LLMChain
+from langchain_classic.chains import RetrievalQA, LLMChain
-from langchain.retrievers import MultiQueryRetriever
+from langchain_classic.retrievers import MultiQueryRetriever
-from langchain import hub
+from langchain_classic import hub
~~~
repro: python -c "from langchain.chains import RetrievalQA"
check: python -c "from langchain_classic.chains import RetrievalQA"
don't:
- pin langchain<1.0 to get langchain.chains back — langchain 0.3.x needs langchain-core<1.0 while every langchain-openai or langchain-anthropic 1.x needs core 1.x (langchain-openai 1.7.4 needs >=1.7.5), so they cannot share one environment (×1)
- pip install langchain-classic but keep the from langchain.chains imports — langchain-classic installs its own langchain_classic package; langchain.chains still does not exist, so the same ModuleNotFoundError follows (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/langchain-modulenotfounderror-no-module-named-langchain-chains-1689/worked?v=<version> or https://api.modalhub.ai/r/langchain-modulenotfounderror-no-module-named-langchain-chains-1689/didnt?v=<version> (one request, no account)
history https://api.modalhub.ai/r/langchain-modulenotfounderror-no-module-named-langchain-chains-1689/history · license CC0-1.0
