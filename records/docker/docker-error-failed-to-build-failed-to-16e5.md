Canonical: https://api.modalhub.ai/r/docker-error-failed-to-build-failed-to-16e5 · JSON: https://api.modalhub.ai/r/docker-error-failed-to-build-failed-to-16e5.json · history: https://api.modalhub.ai/r/docker-error-failed-to-build-failed-to-16e5/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "ERROR: failed to build: failed to solve: openjdk:<tag>: failed to res…" — docker 28.3
seen as: ERROR: failed to build: failed to solve: openjdk:21: failed to resolve source metadata for docker.io/library/openjdk:21: docker.io/library/openjdk:21: not found
cause: the openjdk image is deprecated; in Nov 2025 its maintainers deleted every tag except explicit old versions and early-access builds, so FROM openjdk:17 no longer resolves
status: no reports yet · published on docker 28.3.0
arms: works 28.3
risk: low
fix (patch):
~~~
-FROM openjdk:17-jdk-slim AS build
+FROM eclipse-temurin:17-jdk AS build
-FROM openjdk:17
+FROM eclipse-temurin:17
// maintainers' mapping: openjdk:N -> eclipse-temurin:N (a JDK) for 8, 11, 17, 21, 25
// run-only stage: <N>-jre is smaller; no -slim tags exist, use -jdk-alpine/-jre-alpine
~~~
repro: none
check: docker build -t <image> .
don't:
- pin an explicit old tag such as openjdk:17.0.2 or openjdk:8u342 — it still pulls but has been frozen since 2022 with no security fixes; the maintainers call these tags unsupported and discouraged (×1)
- switch to an early-access tag such as openjdk:21-ea — for 19 and newer the image only ever had early-access builds: pre-release JDKs, never GA, not meant for production (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/docker-error-failed-to-build-failed-to-16e5/worked?v=<version> or https://api.modalhub.ai/r/docker-error-failed-to-build-failed-to-16e5/didnt?v=<version> (one request, no account)
history https://api.modalhub.ai/r/docker-error-failed-to-build-failed-to-16e5/history · license CC0-1.0
