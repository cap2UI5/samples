# Changelog

All notable changes to `@cap2ui5/samples` are recorded here. The format
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the
versions [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-09-29

The first release: abap2UI5's samples as a package a CAP project adds.

- 71 of abap2UI5's 129 samples as cap2UI5 apps in `srv/apps/`: 69 translated
  by abap2js from abap2UI5/samples at the commit in `ABAP2UI5_SAMPLES_PIN`,
  two ported by hand. The differential test holds every one of them to its
  ABAP original.
- `npm add @cap2ui5/samples` in a project with `@cap2ui5/cds-plugin` 0.3 - a
  peer dependency - and the samples run beside the project's own apps: the
  package declares them for the plugin, `"cap2ui5": { "apps": "srv/apps" }`.

[Unreleased]: https://github.com/cap2UI5/samples/compare/v0.1.0...HEAD
[0.1.0]: https://www.npmjs.com/package/@cap2ui5/samples/v/0.1.0
