Canonical: https://api.modalhub.ai/r/node-error-connect-econnrefused-1-port-a6ee · JSON: https://api.modalhub.ai/r/node-error-connect-econnrefused-1-port-a6ee.json · history: https://api.modalhub.ai/r/node-error-connect-econnrefused-1-port-a6ee/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "Error: connect ECONNREFUSED ::1:<port>" — node 18.17
seen as: Error: connect ECONNREFUSED ::1:3000
cause: since Node 17 dns.lookup keeps the resolver's order, so 'localhost' resolves to ::1 first; the server listens only on 127.0.0.1 and nothing answers on IPv6
status: no reports yet · published on node 18.17.1
arms: works 18.17
risk: low
fix (patch):
~~~
-const base = 'http://localhost:<port>';
+const base = 'http://127.0.0.1:<port>';   // dial the address the server actually binds
// or make the server listen on '::' (dual-stack hosts accept IPv4 clients too)
~~~
repro: node -e "require('dns').lookup('localhost',(e,a)=>console.log(a))"
check: node -e "fetch('http://127.0.0.1:<port>/').then(r=>console.log(r.status))"
don't:
- add retries or a wait-on loop, assuming the server is not up yet — the server is up on IPv4; every attempt dials ::1 first and is refused again (×1)
- make the server listen on 'localhost' — listen() binds only the first address localhost resolves to (::1 on Node 17+), which moves the refusal to 127.0.0.1 clients (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/node-error-connect-econnrefused-1-port-a6ee/worked?v=<version> or https://api.modalhub.ai/r/node-error-connect-econnrefused-1-port-a6ee/didnt?v=<version> (one request, no account)
history https://api.modalhub.ai/r/node-error-connect-econnrefused-1-port-a6ee/history · license CC0-1.0
