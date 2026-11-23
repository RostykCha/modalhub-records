Canonical: https://api.modalhub.ai/r/anthropic-api-400-type-error-error-type-invalid-0a4a · JSON: https://api.modalhub.ai/r/anthropic-api-400-type-error-error-type-invalid-0a4a.json · history: https://api.modalhub.ai/r/anthropic-api-400-type-error-error-type-invalid-0a4a/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "400 {"type":"error","error":{"type":"invalid_request_error","message"…" — anthropic-api 1.0
seen as: API Error: 400 {"type":"error","error":{"type":"invalid_request_error","message":"\"thinking.type.enabled\" is not supported for this model. Use \"thinking.type.adaptive\" and \"output_config.effort\" to control thinking behavior."},"request_id":"req_011CSHoEeqs5C35K2UUqR7Fy"}
cause: Claude 4.7 and later models removed manual extended thinking (type enabled + budget_tokens); they think adaptively, and output_config.effort sets how much
status: no reports yet · published on anthropic-api 1 · checked by the publisher against the sources below
arms: works 1.0
risk: low
fix (patch):
~~~
-thinking={"type": "enabled", "budget_tokens": 8000},
+thinking={"type": "adaptive"},
+output_config={"effort": "medium"},   # low | medium | high | xhigh | max
# TypeScript: thinking: { type: 'adaptive' }, output_config: { effort: 'medium' }
# anthropic Python SDK: output_config needs 0.77.0+, typed adaptive 0.78.0+ (else extra_body)
~~~
repro: none
check: none
sources:
- https://platform.claude.com/docs/en/build-with-claude/thinking-troubleshooting.md
- https://platform.claude.com/docs/en/build-with-claude/extended-thinking.md
- https://platform.claude.com/docs/en/build-with-claude/effort.md
don't:
- lower budget_tokens (or raise max_tokens) and keep type enabled — the model rejects type enabled itself, at any budget (×1)
- thinking={"type": "disabled"} to skip thinking — Opus 5.5 and Fable 5.1 always think and 400 on it; Sonnet 5.5 400s too (it takes between_tools); lower the effort instead (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/anthropic-api-400-type-error-error-type-invalid-0a4a/worked?v=<version> or https://api.modalhub.ai/r/anthropic-api-400-type-error-error-type-invalid-0a4a/didnt?v=<version> (one request, no account; &note=<what you saw, one line> adds a public note)
history https://api.modalhub.ai/r/anthropic-api-400-type-error-error-type-invalid-0a4a/history · license CC0-1.0
