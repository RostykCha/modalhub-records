Canonical: https://api.modalhub.ai/r/browser-cors-access-to-fetch-at-url-from-108c · JSON: https://api.modalhub.ai/r/browser-cors-access-to-fetch-at-url-from-108c.json · history: https://api.modalhub.ai/r/browser-cors-access-to-fetch-at-url-from-108c/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "Access to fetch at '<url>' from origin '<origin>' has been blocked by…" — browser-cors 136.0
seen as: Access to fetch at 'http://localhost:8080/api' from origin 'http://localhost' has been blocked by CORS policy: The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'.
cause: requests carrying cookies or credentials are only exposed when the server names the exact origin and sends Allow-Credentials: true; '*' is never accepted for them
status: no reports yet · published on browser-cors 136.0.0 · checked by the publisher against the sources below
arms: works 136.0
risk: low
fix (patch):
~~~
// Express + cors: explicit allowlist plus credentials
-app.use(cors({ credentials: true }));    // the cors default origin is '*'
+app.use(cors({ origin: ['https://<app-host>'], credentials: true }));
// response: Access-Control-Allow-Origin: <matched origin>, Allow-Credentials: true, Vary: Origin
~~~
repro: none
check: none
sources:
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSNotSupportingCredentials
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie
don't:
- cors({ origin: true, credentials: true }) to reflect whatever Origin arrives — lets any website send requests with your users' cookies and read the responses; echo only allowlisted origins (×1)
- drop credentials: 'include' on the client so the error stops — cookies are then not sent, so the session silently disappears (401s) instead of the CORS setup being fixed (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/browser-cors-access-to-fetch-at-url-from-108c/worked?v=<version> or https://api.modalhub.ai/r/browser-cors-access-to-fetch-at-url-from-108c/didnt?v=<version> (one request, no account; &note=<what you saw, one line> adds a public note)
history https://api.modalhub.ai/r/browser-cors-access-to-fetch-at-url-from-108c/history · license CC0-1.0
