Canonical: https://api.modalhub.ai/r/docker-compose-warn-n-path-docker-compose-yml-0e1b · JSON: https://api.modalhub.ai/r/docker-compose-warn-n-path-docker-compose-yml-0e1b.json · history: https://api.modalhub.ai/r/docker-compose-warn-n-path-docker-compose-yml-0e1b/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "WARN[0000] <path>/docker-compose.yml: the attribute `version` is obso…" — docker-compose 2.29
cause: Compose v2 and later read every file as the Compose Specification, where the top-level version key is informational only; any value triggers this warning
status: no reports yet · published on docker-compose 2.29.0 · checked by the publisher against the sources below
arms: works 2.29
risk: low
fix (patch):
~~~
-version: "3.8"
 services:
~~~
repro: none
check: docker compose config -q 2>&1 | grep -q obsolete || echo ok
sources:
- https://docs.docker.com/reference/compose-file/version-and-name/
don't:
- change version to 3.9 or another value — the warning fires for any top-level version key; the value itself is ignored (×1)
- go back to docker-compose (v1, with a hyphen) — Compose v1 is unmaintained and was removed from Docker Desktop 4.23; use docker compose (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/docker-compose-warn-n-path-docker-compose-yml-0e1b/worked?v=<version> or https://api.modalhub.ai/r/docker-compose-warn-n-path-docker-compose-yml-0e1b/didnt?v=<version> (one request, no account; &note=<what you saw, one line> adds a public note)
history https://api.modalhub.ai/r/docker-compose-warn-n-path-docker-compose-yml-0e1b/history · license CC0-1.0
