Canonical: https://api.modalhub.ai/r/tailwindcss-unknown-at-rule-theme-css-unknownatrules-c7e3 · JSON: https://api.modalhub.ai/r/tailwindcss-unknown-at-rule-theme-css-unknownatrules-c7e3.json · history: https://api.modalhub.ai/r/tailwindcss-unknown-at-rule-theme-css-unknownatrules-c7e3/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "Unknown at rule @theme css(unknownAtRules)" — tailwindcss 4.0
cause: VS Code lints .css files with its built-in CSS language service, which does not know Tailwind v4 directives; the CSS itself is valid and builds
status: no reports yet · published on tailwindcss 4.0.0
arms: works 4.0
risk: low
fix (config):
~~~
// .vscode/settings.json, with the Tailwind CSS IntelliSense extension (bradlc.vscode-tailwindcss)
{
  "files.associations": { "*.css": "tailwindcss" }
}
~~~
repro: none
check: the status bar shows Tailwind CSS as the file's language mode and Problems lists no css(unknownAtRules)
don't:
- install the IntelliSense extension and stop there — since 0.12.18 it no longer switches .css files to its language mode on its own; without the association the built-in linter keeps flagging (×1)
- rewrite or delete @theme, @plugin or @custom-variant, or move the theme back to tailwind.config.js — these at-rules are valid v4 syntax and the build compiles them; only the editor's CSS linter does not know them (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/tailwindcss-unknown-at-rule-theme-css-unknownatrules-c7e3/worked?v=<version> or https://api.modalhub.ai/r/tailwindcss-unknown-at-rule-theme-css-unknownatrules-c7e3/didnt?v=<version> (one request, no account)
history https://api.modalhub.ai/r/tailwindcss-unknown-at-rule-theme-css-unknownatrules-c7e3/history · license CC0-1.0
