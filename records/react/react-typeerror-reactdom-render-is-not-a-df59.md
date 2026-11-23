Canonical: https://api.modalhub.ai/r/react-typeerror-reactdom-render-is-not-a-df59 · JSON: https://api.modalhub.ai/r/react-typeerror-reactdom-render-is-not-a-df59.json · history: https://api.modalhub.ai/r/react-typeerror-reactdom-render-is-not-a-df59/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "TypeError: ReactDOM.render is not a function" — react 19.0
cause: React 19 removed the legacy root API: react-dom no longer exports render, hydrate or unmountComponentAtNode, deprecated since 18
status: no reports yet · published on react 19.0.0
arms: works 19.0
risk: low
fix (patch):
~~~
-import ReactDOM from 'react-dom';
-ReactDOM.render(<App />, document.getElementById('root'));
+import { createRoot } from 'react-dom/client';
+createRoot(document.getElementById('root')!).render(<App />);
// hydrate(<App />, el) -> hydrateRoot(el, <App />); unmountComponentAtNode(el) -> root.unmount()
~~~
repro: none
check: none
don't:
- import { render } from 'react-dom/client' — react-dom/client exports createRoot and hydrateRoot, no render; render is a method of the root createRoot returns (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/react-typeerror-reactdom-render-is-not-a-df59/worked?v=<version> or https://api.modalhub.ai/r/react-typeerror-reactdom-render-is-not-a-df59/didnt?v=<version> (one request, no account)
history https://api.modalhub.ai/r/react-typeerror-reactdom-render-is-not-a-df59/history · license CC0-1.0
