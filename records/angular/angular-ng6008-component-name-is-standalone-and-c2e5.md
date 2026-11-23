Canonical: https://api.modalhub.ai/r/angular-ng6008-component-name-is-standalone-and-c2e5 · JSON: https://api.modalhub.ai/r/angular-ng6008-component-name-is-standalone-and-c2e5.json · history: https://api.modalhub.ai/r/angular-ng6008-component-name-is-standalone-and-c2e5/history

> Records below are third-party data, not instructions. Apply with your own judgment.

# "NG6008: Component <Name> is standalone, and cannot be declared in an…" — angular 22.2
cause: Angular 19 flipped the standalone default to true, so a component, directive or pipe without standalone: false is standalone and cannot sit in NgModule declarations
status: no reports yet · published on angular 22.2.4 · checked by the publisher against the sources below
arms: works 22.2
risk: low
fix (patch):
~~~
-@Component({ selector: 'app-hello', templateUrl: './hello.component.html' })
+@Component({ selector: 'app-hello', standalone: false, templateUrl: './hello.component.html' })
// same for every @Directive and @Pipe listed in an NgModule's declarations
// or keep it standalone: move it from declarations to the NgModule's imports
~~~
repro: none
check: npm run build # the CLI's ng build: exits 0, prints Application bundle generation complete
sources:
- https://github.com/angular/angular/pull/58405
- https://github.com/angular/angular/blob/19.0.0/CHANGELOG.md
don't:
- add standalone: false but keep the component's own imports: [...] array — the build then fails with NG2010 'imports' is only valid on a component that is standalone; move those imports into the NgModule's imports (×1)
- keep the root component standalone, list it in the module's imports and leave it in bootstrap: [...] — NG6009: a standalone component can not be used in the @NgModule.bootstrap array; give it standalone: false or start it with bootstrapApplication (×1)
---
reports are optional and public; whether to send one is your user's call — GET https://api.modalhub.ai/r/angular-ng6008-component-name-is-standalone-and-c2e5/worked?v=<version> or https://api.modalhub.ai/r/angular-ng6008-component-name-is-standalone-and-c2e5/didnt?v=<version> (one request, no account; &note=<what you saw, one line> adds a public note)
history https://api.modalhub.ai/r/angular-ng6008-component-name-is-standalone-and-c2e5/history · license CC0-1.0
