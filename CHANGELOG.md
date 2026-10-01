# Changelog

All notable changes to `@cap2ui5/samples` are recorded here. The format
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the
versions [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- The pin moves to abap2UI5/samples `2e998ef` (2026-09-30). `Z2UI5_CL_SMP_APP_173`
  is translated again from its reworked original - a metadata-driven table
  and form with `template:with`, nested `template:repeat` and
  `template:if/elseif/else`. `Z2UI5_CL_SMP_APP_176` gained a button that
  re-renders only the nested view, through an `ASSIGN mt_layout[ … ] TO
  FIELD-SYMBOL( )` abap2js refuses, so it is ported by hand from here on and
  listed under `handwritten`.
- Five of the nine samples abap2UI5/samples added since, translated by
  abap2js: `Z2UI5_CL_SMP_APP_535` (CustomData writeToDom),
  `Z2UI5_CL_SMP_APP_536` (custom data on controls), `Z2UI5_CL_SMP_APP_537`
  (expressions, formatters and literals in `t_arg`), and two helper apps -
  `Z2UI5_CL_SMP_APP_533`, the wizard with page transitions
  `Z2UI5_CL_SMP_APP_531` calls, and `Z2UI5_CL_SMP_APP_534`, the popup-as-app
  `Z2UI5_CL_SMP_APP_532` calls. 76 of abap2UI5's 138 samples. The other four
  wait for abap2js: 531 reads a constant of another class, 532 uses `NEW`
  outside the navigation, 538 `VALUE #( OPTIONAL … )`, 539 `SPLIT`.
- `npm run generate` (and its `--check`, the CI gate) refuses a module in
  `srv/apps/` that `scripts/samples.json` does not list - such a module is
  packed, served and started by the tests, but never held to its original by
  the differential test, which reads `samples.json` - and names a listed
  sample the checkout at the pin does not have instead of failing on the read.
- The differential test transpiles the originals against open-abap-core at the
  commit `@abap2ui5/node-runtime` records in its `package.json`
  (`abap2ui5.openAbapCore`) instead of HEAD, so the original runs on the
  open-abap-core the translation runs on; a runtime that does not record it
  (1.145.0) still gets HEAD, with a warning.

## [0.2.0] - 2026-09-30

For `@cap2ui5/cds-plugin` 0.4.0, whose model carries only the fields an app
binds.

- The peer dependency is `@cap2ui5/cds-plugin` `^0.4.0`; 0.1.0 does not
  install beside 0.4.0.
- The samples are translated again by 0.4.0's abap2js from the same
  abap2UI5/samples commit: `Z2UI5_CL_SMP_APP_027` and `Z2UI5_CL_SMP_APP_067`
  start their numeric fields as numbers, not as strings.

## [0.1.0] - 2026-09-29

The first release: abap2UI5's samples as a package a CAP project adds.

- 71 of abap2UI5's 129 samples as cap2UI5 apps in `srv/apps/`: 69 translated
  by abap2js from abap2UI5/samples at the commit in `ABAP2UI5_SAMPLES_PIN`,
  two ported by hand. The differential test holds every one of them to its
  ABAP original.
- `npm add @cap2ui5/samples` in a project with `@cap2ui5/cds-plugin` 0.3 - a
  peer dependency - and the samples run beside the project's own apps: the
  package declares them for the plugin, `"cap2ui5": { "apps": "srv/apps" }`.

[Unreleased]: https://github.com/cap2UI5/samples/compare/v0.2.0...HEAD
[0.2.0]: https://www.npmjs.com/package/@cap2ui5/samples/v/0.2.0
[0.1.0]: https://www.npmjs.com/package/@cap2ui5/samples/v/0.1.0
