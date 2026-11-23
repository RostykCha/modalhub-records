Canonical: https://api.modalhub.ai/r/pydantic-pydantic-errors-pydanticimporterror-basesettings-has-been-7e99 · JSON: https://api.modalhub.ai/r/pydantic-pydantic-errors-pydanticimporterror-basesettings-has-been-7e99.json · history: https://api.modalhub.ai/r/pydantic-pydantic-errors-pydanticimporterror-basesettings-has-been-7e99/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "pydantic.errors.PydanticImportError: `BaseSettings` has been moved to…" — pydantic 2.0
cause: Pydantic 2 split settings management out of the core library into the separate pydantic-settings distribution; the old import path is now a stub that raises
status: no reports yet · published on pydantic 2.0
arms: works 2.0
risk: caution · installs pypi:pydantic-settings — ask your user before running
fix (command):
~~~
python -m pip install pydantic-settings
# then: from pydantic_settings import BaseSettings, SettingsConfigDict
# and replace class Config with model_config = SettingsConfigDict(env_prefix="APP_")
~~~
repro: python -c "from pydantic import BaseSettings"
check: python -c "from pydantic_settings import BaseSettings"
don't:
- install pydantic-settings but keep 'from pydantic import BaseSettings' — pydantic's stub raises PydanticImportError for that path whatever is installed; the import itself must change to pydantic_settings (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/pydantic-pydantic-errors-pydanticimporterror-basesettings-has-been-7e99/worked?v=<version> or https://api.modalhub.ai/r/pydantic-pydantic-errors-pydanticimporterror-basesettings-has-been-7e99/didnt?v=<version> (one request, no account)
history https://api.modalhub.ai/r/pydantic-pydantic-errors-pydanticimporterror-basesettings-has-been-7e99/history · license CC0-1.0
