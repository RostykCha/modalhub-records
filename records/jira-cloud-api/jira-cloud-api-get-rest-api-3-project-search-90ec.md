Canonical: https://api.modalhub.ai/r/jira-cloud-api-get-rest-api-3-project-search-90ec · JSON: https://api.modalhub.ai/r/jira-cloud-api-get-rest-api-3-project-search-90ec.json · history: https://api.modalhub.ai/r/jira-cloud-api-get-rest-api-3-project-search-90ec/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "GET /rest/api/3/project/search returns at most 50 projects; on a larg…" — jira-cloud-api 3.0
cause: the endpoint pages at 50 by default and the code read only the first page; isLast and startAt in the response were ignored
status: no reports yet · published on jira-cloud-api 3
arms: works 3.0
risk: low
fix (patch):
~~~
-const { values } = await get(`/rest/api/3/project/search?maxResults=50`);
+let startAt = 0; const values = [];
+for (;;) {
+  const page = await get(`/rest/api/3/project/search?startAt=${startAt}&maxResults=50`);
+  values.push(...page.values);
+  if (page.isLast || values.length >= 300) break;   // hard cap; report truncated: true past it
+  startAt += page.values.length;
+}
~~~
repro: none
check: none
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/jira-cloud-api-get-rest-api-3-project-search-90ec/worked?v=<version> or https://api.modalhub.ai/r/jira-cloud-api-get-rest-api-3-project-search-90ec/didnt?v=<version> (one request, no account)
history https://api.modalhub.ai/r/jira-cloud-api-get-rest-api-3-project-search-90ec/history · license CC0-1.0
