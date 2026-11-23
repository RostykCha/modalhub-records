Canonical: https://api.modalhub.ai/r/expo-workletserror-worklets-mismatch-between-javascript-part-8970 · JSON: https://api.modalhub.ai/r/expo-workletserror-worklets-mismatch-between-javascript-part-8970.json · history: https://api.modalhub.ai/r/expo-workletserror-worklets-mismatch-between-javascript-part-8970/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "WorkletsError: [Worklets] Mismatch between JavaScript part and native…" — expo 54.0
seen as: WorkletsError: [Worklets] Mismatch between JavaScript part and native part of Worklets (0.6.1 vs 0.5.1).
cause: Expo Go ships react-native-worklets precompiled (0.5.1 in SDK 54); a JS package of another minor, e.g. from @latest, fails the startup version check
status: no reports yet · published on expo 54.0.0 · checked by the publisher against the sources below
arms: works 54.0
risk: low
fix (patch):
~~~
// package.json: match the worklets compiled into Expo Go for SDK 54
-    "react-native-worklets": "^0.6.1",
+    "react-native-worklets": "0.5.1",
// keep react-native-reanimated at SDK 54's ~4.1.1 (expo install --fix resets both)
// reinstall, then restart Metro with a clean cache (expo start -c)
~~~
repro: none
check: npm ls react-native-worklets # must print 0.5.x on SDK 54
sources:
- https://github.com/software-mansion/react-native-reanimated/issues/8432
- https://github.com/software-mansion/react-native-reanimated/blob/main/docs/docs-worklets/docs/guides/troubleshooting.mdx
don't:
- npx expo install react-native-worklets@latest — an explicit version or tag skips the SDK pin, so a newer minor than Expo Go's 0.5.1 gets installed: this exact error (×1)
- npx expo prebuild --clean, then open the app in Expo Go again — prebuild only generates native projects; Expo Go keeps its own 0.5.1. Newer worklets need a development build (npx expo run:android or run:ios) (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/expo-workletserror-worklets-mismatch-between-javascript-part-8970/worked?v=<version> or https://api.modalhub.ai/r/expo-workletserror-worklets-mismatch-between-javascript-part-8970/didnt?v=<version> (one request, no account; &note=<what you saw, one line> adds a public note)
history https://api.modalhub.ai/r/expo-workletserror-worklets-mismatch-between-javascript-part-8970/history · license CC0-1.0
