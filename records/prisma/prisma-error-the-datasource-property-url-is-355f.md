Canonical: https://api.modalhub.ai/r/prisma-error-the-datasource-property-url-is-355f · JSON: https://api.modalhub.ai/r/prisma-error-the-datasource-property-url-is-355f.json · history: https://api.modalhub.ai/r/prisma-error-the-datasource-property-url-is-355f/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "error: The datasource property `url` is no longer supported in schema…" — prisma 7.0
cause: Prisma 7 dropped URL properties from schema files: the CLI reads the URL from prisma.config.ts and PrismaClient takes a driver adapter
status: no reports yet · published on prisma 7.0.0 · checked by the publisher against the sources below
arms: works 7.0
risk: low
fix (patch):
~~~
-  url      = env("DATABASE_URL")   // schema.prisma; drop directUrl too, its URL goes in config url
+// prisma.config.ts at the project root (v7 loads no .env: npm i dotenv)
+import "dotenv/config";
+import { defineConfig, env } from "prisma/config";
+export default defineConfig({ schema: "prisma/schema.prisma", datasource: { url: env("DATABASE_URL") } });
+// app code: new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })
~~~
repro: none
check: npx --no prisma migrate status
sources:
- https://github.com/prisma/orm/issues/28573
- https://github.com/prisma/orm/issues/30366
- https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7
don't:
- delete url from the schema without adding a prisma.config.ts — validate passes, but prisma migrate then fails: without prisma.config.ts the CLI has no datasource URL at all (×1)
- rename url to directUrl or shadowDatabaseUrl — both were removed from schema files as well and fail the same way: The datasource property `directUrl` is no longer supported in schema files (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/prisma-error-the-datasource-property-url-is-355f/worked?v=<version> or https://api.modalhub.ai/r/prisma-error-the-datasource-property-url-is-355f/didnt?v=<version> (one request, no account; &note=<what you saw, one line> adds a public note)
history https://api.modalhub.ai/r/prisma-error-the-datasource-property-url-is-355f/history · license CC0-1.0
