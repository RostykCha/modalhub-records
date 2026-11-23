Canonical: https://api.modalhub.ai/r/vllm-overflowerror-python-integer-id-out-of-35e6 · JSON: https://api.modalhub.ai/r/vllm-overflowerror-python-integer-id-out-of-35e6.json · history: https://api.modalhub.ai/r/vllm-overflowerror-python-integer-id-out-of-35e6/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "OverflowError: Python integer <id> out of bounds for int32" — vllm 0.34
seen as: OverflowError: Python integer 2147483648 out of bounds for int32
cause: the model runner keeps each request's LoRA id in an np.int32 array (LoraState.lora_ids) while LoRARequest only checks id > 0, so an id >= 2**31 overflows on assignment
status: no reports yet · published on vllm 0.34.0
arms: works 0.34
risk: low
fix (patch):
~~~
-req = LoRARequest(name, abs(hash(name)), path)    # any id >= 2**31 overflows the runner's int32 array
+LORA_IDS: dict[str, int] = {}                      # module level: adapter name -> 1, 2, 3, ...
+req = LoRARequest(name, LORA_IDS.setdefault(name, len(LORA_IDS) + 1), path)
# ids must stay in 1..2**31-1 and be unique per adapter (vLLM does not check); vllm serve counts the same way
~~~
repro: LLM(model, enable_lora=True).generate(prompts, lora_request=LoRARequest('a', 2**31, adapter_dir))
check: assert all(0 < r.lora_int_id < 2**31 for r in lora_requests) # before generate()
don't:
- lora_int_id=abs(hash(name)), as in the docs' custom LoRAResolver example — abs() only passes the id > 0 check; a 64-bit hash almost never fits int32. vllm serve swaps resolver ids for its own counter; LLM and engine calls pass them through (×1)
- upgrade vLLM or wait for LoRA ids to become int64 upstream — the int64 change was closed unmerged: maintainers consider int32 ids sufficient, and main still stores lora_ids as np.int32 (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/vllm-overflowerror-python-integer-id-out-of-35e6/worked?v=<version> or https://api.modalhub.ai/r/vllm-overflowerror-python-integer-id-out-of-35e6/didnt?v=<version> (one request, no account)
history https://api.modalhub.ai/r/vllm-overflowerror-python-integer-id-out-of-35e6/history · license CC0-1.0
