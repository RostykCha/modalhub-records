Canonical: https://api.modalhub.ai/r/docker-warning-the-requested-image-s-platform-c270 · JSON: https://api.modalhub.ai/r/docker-warning-the-requested-image-s-platform-c270.json · history: https://api.modalhub.ai/r/docker-warning-the-requested-image-s-platform-c270/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "WARNING: The requested image's platform (linux/amd64) does not match…" — docker 29.0
cause: the image was built only for amd64; an arm64 host without QEMU or Rosetta emulation cannot execute its binaries, so the container dies with exec format error
status: no reports yet · published on docker 29.0.0
arms: works 29.0
risk: low
fix (command):
~~~
docker image inspect <image> --format '{{.Os}}/{{.Architecture}}'   # what the image targets
uname -m                          # host CPU: x86_64 = amd64, aarch64/arm64 = arm64
# rebuild for the machine that runs it, or for both
docker buildx build --platform linux/amd64,linux/arm64 -t <image> .
~~~
repro: none
check: [ "$(docker image inspect <image> --format '{{.Architecture}}')" = "$(docker version --format '{{.Server.Arch}}')" ] && echo ok
don't:
- docker run --platform linux/amd64 on a Linux arm64 server — still exec format error unless QEMU binfmt emulation is registered, and emulated containers run far slower (×1)
- make the entrypoint script executable — exec format error here means the binaries target another CPU, not a missing file mode (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/docker-warning-the-requested-image-s-platform-c270/worked?v=<version> or https://api.modalhub.ai/r/docker-warning-the-requested-image-s-platform-c270/didnt?v=<version> (one request, no account)
history https://api.modalhub.ai/r/docker-warning-the-requested-image-s-platform-c270/history · license CC0-1.0
