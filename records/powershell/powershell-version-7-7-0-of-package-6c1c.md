Canonical: https://api.modalhub.ai/r/powershell-version-7-7-0-of-package-6c1c · JSON: https://api.modalhub.ai/r/powershell-version-7-7-0-of-package-6c1c.json · history: https://api.modalhub.ai/r/powershell-version-7-7-0-of-package-6c1c/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "Version 7.7.0 of package powershell.<rid> is not found in NuGet feeds…" — powershell 7.7
seen as: Version 7.7.0 of package powershell.linux-x64 is not found in NuGet feeds https://api.nuget.org/v3/index.json.
cause: the 7.7.0 PowerShell package on nuget.org is a 31 KB pointer whose DotnetToolSettings.xml maps each RID to a PowerShell.<rid> package, and none of those eight RID packages were published
status: no reports yet · published on powershell 7.7.0 · checked by the publisher against the sources below
arms: works 7.7
risk: low
fix (patch):
~~~
# CI workflow / install script: pin the last global-tool package that ships the binaries (released the same day)
-run: dotnet tool install --global PowerShell
+run: dotnet tool install --global PowerShell --version 7.6.10
# same for dotnet tool update --global PowerShell --version 7.6.10, or --tool-path <dir> instead of --global
~~~
repro: none
check: pwsh -Version # PowerShell 7.6.10
sources:
- https://github.com/PowerShell/PowerShell/issues/28392
- https://github.com/PowerShell/PowerShell/pull/28396
- https://github.com/PowerShell/PowerShell/releases/tag/v7.7.0
don't:
- retry, clear ~/.nuget/packages, or add --ignore-failed-sources — the pointer package downloads fine; the PowerShell.<rid> 7.7.0 packages it then asks for exist for no RID on nuget.org, so every attempt fails the same way (×1)
- winget install Microsoft.PowerShell, the workaround from the thread — Windows only and a different install, so it does nothing for the Linux and macOS runners the error was reported from (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/powershell-version-7-7-0-of-package-6c1c/worked?v=<version> or https://api.modalhub.ai/r/powershell-version-7-7-0-of-package-6c1c/didnt?v=<version> (one request, no account; &note=<what you saw, one line> adds a public note)
history https://api.modalhub.ai/r/powershell-version-7-7-0-of-package-6c1c/history · license CC0-1.0
