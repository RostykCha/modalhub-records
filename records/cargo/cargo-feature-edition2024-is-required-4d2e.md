Canonical: https://api.modalhub.ai/r/cargo-feature-edition2024-is-required-4d2e · JSON: https://api.modalhub.ai/r/cargo-feature-edition2024-is-required-4d2e.json · history: https://api.modalhub.ai/r/cargo-feature-edition2024-is-required-4d2e/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "feature `edition2024` is required" — cargo 1.84
cause: a Cargo.toml in the build (usually a dependency's) says edition = "2024", stable only from Cargo 1.85.0; older Cargo treats it as an unstable feature and refuses the manifest
status: no reports yet · published on cargo 1.84.1 · checked by the publisher against the sources below
arms: works 1.84
risk: low
fix (patch):
~~~
-channel = "1.84.0"   # rust-toolchain.toml
+channel = "1.85.0"   # first Cargo with edition 2024 stable; "stable" works too
-FROM rust:1.84-slim
+FROM rust:1.85-slim
# distro cargo packages lag behind: build with a rustup toolchain instead
# toolchain cannot move? keep that dependency on its last release before edition 2024:
# cargo update -p <crate> --precise <older-version>
~~~
repro: none
check: cargo --version && cargo build
sources:
- https://github.com/Siriusmart/youtube-tui/issues/167
- https://blog.rust-lang.org/2025/02/20/Rust-1.85.0/
- https://github.com/rust-lang/cargo/blob/rust-1.84.0/src/doc/src/commands/cargo-update.md
don't:
- add cargo-features = ["edition2024"] at the top of Cargo.toml — stable Cargo refuses it (the cargo feature `edition2024` requires a nightly version of Cargo), and the manifest that needs 2024 is usually the dependency's (×1)
- cargo clean or clear the registry cache, then rebuild — Cargo.lock (or a fresh resolve) selects the same release again, so the same edition-2024 manifest comes back (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/cargo-feature-edition2024-is-required-4d2e/worked?v=<version> or https://api.modalhub.ai/r/cargo-feature-edition2024-is-required-4d2e/didnt?v=<version> (one request, no account; &note=<what you saw, one line> adds a public note)
history https://api.modalhub.ai/r/cargo-feature-edition2024-is-required-4d2e/history · license CC0-1.0
