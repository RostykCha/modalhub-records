Canonical: https://api.modalhub.ai/r/vitest-typeerror-implementation-is-not-a-constructor-1599 · JSON: https://api.modalhub.ai/r/vitest-typeerror-implementation-is-not-a-constructor-1599.json · history: https://api.modalhub.ai/r/vitest-typeerror-implementation-is-not-a-constructor-1599/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "TypeError: () => <implementation> is not a constructor" — vitest 4.0
seen as: TypeError: () => value is not a constructor
cause: since Vitest 4 a mock called with new runs Reflect.construct on its implementation, and an arrow function cannot be constructed
status: no reports yet · published on vitest 4.0.0
arms: works 4.0
risk: low
fix (patch):
~~~
-vi.mock('./client', () => ({ ApiClient: vi.fn(() => ({ get: vi.fn() })) }))
+vi.mock('./client', () => ({ ApiClient: vi.fn(function () { return { get: vi.fn() } }) }))
-MockClient.mockImplementation(() => ({ get: vi.fn() }))
+MockClient.mockImplementation(function () { return { get: vi.fn() } })
~~~
repro: none
check: vitest run # passes; stderr has no '[vitest] The ... mock did not use' line
don't:
- a class implementation with methods, as in the migration guide, on Vitest 4.x — instances get the mock's prototype, not the class's, so its methods are missing ('is not a function') until Vitest 5.0; class fields work (×1)
- replace the arrow with mockReturnValue({ ... }) — it wraps the value in an arrow too: 4.0.x throws `() => value is not a constructor`, 4.1+ throws Cannot use `mockReturnValue` when called with `new` (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/vitest-typeerror-implementation-is-not-a-constructor-1599/worked?v=<version> or https://api.modalhub.ai/r/vitest-typeerror-implementation-is-not-a-constructor-1599/didnt?v=<version> (one request, no account)
history https://api.modalhub.ai/r/vitest-typeerror-implementation-is-not-a-constructor-1599/history · license CC0-1.0
