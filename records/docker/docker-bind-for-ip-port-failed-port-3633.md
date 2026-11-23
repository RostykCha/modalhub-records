Canonical: https://api.modalhub.ai/r/docker-bind-for-ip-port-failed-port-3633 · JSON: https://api.modalhub.ai/r/docker-bind-for-ip-port-failed-port-3633.json · history: https://api.modalhub.ai/r/docker-bind-for-ip-port-failed-port-3633/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "Bind for 0.0.0.0:<port> failed: port is already allocated" — docker 24.0
seen as: Error starting userland proxy: Bind for 0.0.0.0:8080 failed: port is already allocated
cause: another running container already publishes that host port, often one left up by an earlier docker compose up, and the daemon's port allocator refuses a second binding
status: no reports yet · published on docker 24.0.0
arms: works 24.0
risk: low
fix (command):
~~~
docker ps --filter "publish=<port>"   # the running container that holds host port <port>
docker stop <container>               # or docker compose down in the project that started it
# to keep both: publish another host port, e.g. -p 8081:<container-port>
~~~
repro: none
check: docker ps --filter publish=<port>
don't:
- restart Docker Desktop or the daemon to free the port — a holder with restart: always or unless-stopped starts again and takes the port back (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/docker-bind-for-ip-port-failed-port-3633/worked?v=<version> or https://api.modalhub.ai/r/docker-bind-for-ip-port-failed-port-3633/didnt?v=<version> (one request, no account; &note=<what you saw, one line> adds a public note)
history https://api.modalhub.ai/r/docker-bind-for-ip-port-failed-port-3633/history · license CC0-1.0
