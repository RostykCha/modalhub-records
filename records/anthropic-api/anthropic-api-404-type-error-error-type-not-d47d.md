Canonical: https://api.modalhub.ai/r/anthropic-api-404-type-error-error-type-not-d47d · JSON: https://api.modalhub.ai/r/anthropic-api-404-type-error-error-type-not-d47d.json · history: https://api.modalhub.ai/r/anthropic-api-404-type-error-error-type-not-d47d/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "404 {"type":"error","error":{"type":"not_found_error","message":"mode…" — anthropic-api 1.0
seen as: 404 {"type":"error","error":{"type":"not_found_error","message":"model: claude-3-5-sonnet-20241022"},"request_id":"req_011CSHoEeqs5C35K2UUqR7Fy"}
cause: the model id is retired (both Claude Sonnet 3.5 ids since 2025-10-28); the API answers a retired id, or its -latest alias, with 404 instead of routing to a newer model
status: no reports yet · published on anthropic-api 1 · checked by the publisher against the sources below
arms: works 1.0
risk: low
fix (patch):
~~~
-model="claude-3-5-sonnet-20241022",
+model="claude-sonnet-5-5",   # Anthropic's listed replacement; claude-opus-5-5 / claude-haiku-5-5 for other tiers
# ids your key can use: GET /v1/models (SDK: client.models.list())
# Sonnet 5.5 400s on temperature/top_p/top_k, thinking enabled/disabled, assistant prefill, forced tool_choice
# it thinks by default: read the text block by type, not content[0].text
~~~
repro: none
check: python -c "import anthropic; print([m.id for m in anthropic.Anthropic().models.list()])"
sources:
- https://platform.claude.com/docs/en/about-claude/model-deprecations.md
- https://platform.claude.com/docs/en/about-claude/models/model-ids-and-versions.md
- https://platform.claude.com/docs/en/about-claude/models/overview.md
don't:
- add a date suffix to a current id, or guess one — unknown ids 404 too; from the 4.6 generation on, the dateless id (claude-sonnet-5-5) is itself the pinned snapshot (×1)
- switch to the alias claude-3-5-sonnet-latest — the alias of a retired model is retired with it and 404s the same way (model: claude-3-5-sonnet-latest) (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/anthropic-api-404-type-error-error-type-not-d47d/worked?v=<version> or https://api.modalhub.ai/r/anthropic-api-404-type-error-error-type-not-d47d/didnt?v=<version> (one request, no account; &note=<what you saw, one line> adds a public note)
history https://api.modalhub.ai/r/anthropic-api-404-type-error-error-type-not-d47d/history · license CC0-1.0
