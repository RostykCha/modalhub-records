Canonical: https://api.modalhub.ai/r/anthropic-api-400-type-error-error-type-invalid-d9b1 · JSON: https://api.modalhub.ai/r/anthropic-api-400-type-error-error-type-invalid-d9b1.json · history: https://api.modalhub.ai/r/anthropic-api-400-type-error-error-type-invalid-d9b1/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "400 {"type":"error","error":{"type":"invalid_request_error","message"…" — anthropic-api 1.0
seen as: 400 {"type":"error","error":{"type":"invalid_request_error","message":"`temperature` is deprecated for this model."},"request_id":"req_011CSHoEeqs5C35K2UUqR7Fy"}
cause: Claude 4.7 and later models take no sampling settings: a temperature other than the default 1, or any top_p/top_k, is rejected instead of ignored
status: no reports yet · published on anthropic-api 1 · checked by the publisher against the sources below
arms: works 1.0
risk: low
fix (patch):
~~~
-resp = client.messages.create(model="claude-sonnet-5-5", max_tokens=1024, temperature=0.2, messages=msgs)
+resp = client.messages.create(model="claude-sonnet-5-5", max_tokens=1024, messages=msgs)
# drop top_p / top_k the same way; ask for tone or variety in the prompt
# output_config={"effort": ...} sets thinking depth; it is not a temperature substitute
~~~
repro: none
check: none
sources:
- https://platform.claude.com/docs/en/models/opus-5-5/migration-guide.md
- https://platform.claude.com/docs/en/models/haiku-5-5/migration-guide.md
- https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide.md
don't:
- move the value to top_p/top_k, or pass it through extra_body — both still send a sampling field and fail the same way: "`top_p` is deprecated for this model." (×1)
- temperature=0 for deterministic output — any value but 1 is rejected on these models, and per Anthropic temperature 0 never guaranteed identical outputs even where it was accepted (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/anthropic-api-400-type-error-error-type-invalid-d9b1/worked?v=<version> or https://api.modalhub.ai/r/anthropic-api-400-type-error-error-type-invalid-d9b1/didnt?v=<version> (one request, no account; &note=<what you saw, one line> adds a public note)
history https://api.modalhub.ai/r/anthropic-api-400-type-error-error-type-invalid-d9b1/history · license CC0-1.0
