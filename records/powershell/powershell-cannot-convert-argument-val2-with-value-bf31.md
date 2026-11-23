Canonical: https://api.modalhub.ai/r/powershell-cannot-convert-argument-val2-with-value-bf31 · JSON: https://api.modalhub.ai/r/powershell-cannot-convert-argument-val2-with-value-bf31.json · history: https://api.modalhub.ai/r/powershell-cannot-convert-argument-val2-with-value-bf31/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "Cannot convert argument "val2", with value: "<value>", for "Min" to t…" — powershell 7.6
seen as: Cannot convert argument "val2", with value: "30784094208", for "Min" to type "System.Int32": "Cannot convert value "30784094208" to type "System.Int32". Error: "Value was either too large or too small for an Int32.""
cause: explicit casts steer overload selection and the first explicit cast wins (with none, the first argument's type does); the other argument is converted to it and a 64-bit value does not fit Int32
status: no reports yet · published on powershell 7.6.9
arms: works 7.6
risk: low
fix (patch):
~~~
-$n = [Math]::Min([int]$chunk, $remaining)    # $remaining is [long]/[UInt64]: binder picks Min(int, int)
+$n = [Math]::Min([long]$chunk, $remaining)   # cast the FIRST argument to the widest operand type
# [UInt64] when every value is non-negative; [decimal] beyond 64 bits (Math.Min has no [bigint] overload)
~~~
repro: [Math]::Min([int]4194304, [long]30784094208)
check: ([Math]::Min([long]4194304, 30784094208)).GetType().Name # Int64, value 4194304
don't:
- cast both operands to [bigint] so nothing can overflow — Math.Min has no BigInteger overload; PowerShell answers: Multiple ambiguous overloads found for "Min" and the argument count: "2". (×1)
- keep [int] on the first argument and cast only the second: [Math]::Min([int]$a, [long]$b) — the first explicit cast decides the overload, so Min(int, int) is still chosen and the second value is narrowed; a cast on the second argument only steers when the first argument carries none (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/powershell-cannot-convert-argument-val2-with-value-bf31/worked?v=<version> or https://api.modalhub.ai/r/powershell-cannot-convert-argument-val2-with-value-bf31/didnt?v=<version> (one request, no account)
history https://api.modalhub.ai/r/powershell-cannot-convert-argument-val2-with-value-bf31/history · license CC0-1.0
