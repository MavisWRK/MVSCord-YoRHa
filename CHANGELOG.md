# Changelog

## Small online loaders — 2026-10-17

- Replaced root theme files with metadata and one hosted CSS import.
- Moved complete generated stylesheets to `styles/`, preserving all rules and their order.
- Kept existing raw installation URLs and portable builds.
- Added generated-output checks and individual download/release instructions.

## English documentation — 2026-10-17

- Translated the README and modular migration notes into English.
- Added raw URL installation instructions for all four variants.
- Confirmed that build messages and theme descriptions are in English.
- No changes to stylesheets, palettes, layout, assets, or build behavior.

## Modular organization — 2026-10-17

- Separated source styles, palettes, shared components, and generated files.
- Extracted 14 embedded assets while preserving their original bytes.
- Added a linear build for Light, Dark, Pink, and Midnight.
- Added hosted output with external images and portable output for testing.
- Verified cascade equivalence and asset integrity.
- No intended visual changes; the separate NerdFont edition remains unchanged.
