# MVSCord YoRHa — Modular Theme Project

Visual version 1.0.0 · MavisWRK

A modular Discord theme inspired by the YoRHa interface from NieR: Automata, combining a classic Discord layout with modern profile customization.

Available in four variants:

- **Light (Original YoRHa):** the original NieR: Automata UI color palette, with beige surfaces and dark text.
- **Dark:** charcoal surfaces with warm accents.
- **Pink:** soft pink surfaces with complementary text colors.
- **Midnight:** deep blue tones built around `#191970`.

## Project structure

| Path | Purpose |
| --- | --- |
| `src/styles/base/oldcord.css` | Layout inherited from MVSCord/Oldcord |
| `src/styles/components/` | Shared grids, profiles, inputs, code styling, and other components |
| `src/themes/light/` | Original NieR: Automata UI palette and variant-specific rules |
| `src/themes/dark/` | Dark palette and variant-specific rules |
| `src/themes/pink/` | Pink palette and variant-specific rules |
| `src/themes/midnight/` | Midnight palette and variant-specific rules |
| `src/themes/*/palette.css` | Main colors and texture settings |
| `src/themes/*/theme.json` | Theme metadata and explicit module order |
| `assets/wallpapers/` | Landscape and portrait wallpapers |
| `assets/icons/` | Emblem and icons extracted from the base |
| `assets/decorations/` | Selectors and decorative borders |
| `assets/manifest.json` | Asset inventory, MIME types, sizes, and hashes |
| `scripts/build.mjs` | Build and verification script, with no npm dependencies |
| `project.json` | Included variants and public asset base URL |
| Root `*.theme.css` files | Small installable loaders with metadata and one online import |
| `styles/` | Complete generated stylesheets loaded online |
| `dist/portable/` | Generated stylesheets with embedded images for local testing |

There is no React frontend, backend, or JavaScript running inside Discord. Node.js only prepares the files. Discord loads CSS and the images referenced by it.

## Build

Use Node.js 18 or later. No `npm install` is required.

```sh
npm run build
npm test
npm run build:portable
```

The build concatenates modules in the order defined by each `theme.json`. It does not use runtime imports between source modules, minification, or `@layer`, preserving rule precedence and producing a linear stylesheet. The existing external Oldcord variables import remains in place.

Each root theme file contains only its metadata and one absolute `@import` URL pointing to `styles/<variant>.css`. The hosted stylesheet references separate assets using absolute URLs, without embedded base64 images. Publish both `styles/` and `assets/`. This reduces the installed file size, but Discord still downloads the hosted CSS and images and may cache them locally; it does not eliminate network traffic or runtime memory use. The optional portable output embeds images and is larger; use it to test locally before publishing.

## Install with a raw URL in Vencord

After publishing the generated root loaders and the complete `styles/` and `assets/` folders to the public repository's `main` branch, add one of these URLs to Vencord's online themes list:

**Light — Original YoRHa palette**

```text
https://raw.githubusercontent.com/MavisWRK/MVSCord-YoRHa/refs/heads/main/MVSCord-YoRHa.theme.css
```

**Dark**

```text
https://raw.githubusercontent.com/MavisWRK/MVSCord-YoRHa/refs/heads/main/MVSCord-YoRHa-Dark.theme.css
```

**Pink**

```text
https://raw.githubusercontent.com/MavisWRK/MVSCord-YoRHa/refs/heads/main/MVSCord-YoRHa-Pink.theme.css
```

**Midnight**

```text
https://raw.githubusercontent.com/MavisWRK/MVSCord-YoRHa/refs/heads/main/MVSCord-Midnight.theme.css
```

Paste the plain URL without Markdown formatting or backticks. Enable only one MVSCord variant at a time. Existing raw theme links remain usable because the generated filenames and root locations are unchanged. Users do not need Node.js or the source folders to load the published theme.

## Test locally before publishing

1. Open `dist/portable/` in this package, or generate it with `npm run build:portable`.
2. Copy the desired variant into Vencord's themes folder.
3. Disable other variants and enable the selected theme.

Portable builds still depend on the external Oldcord variables import; they are not fully offline.

## Publish to the existing repository

The asset base URL configured in `project.json` is:

```text
https://raw.githubusercontent.com/MavisWRK/MVSCord-YoRHa/main/
```

1. Copy this project's contents into your existing repository checkout.
2. Preserve your screenshots, licenses, and other custom changes; merge documentation as needed.
3. Run `npm run build` and `npm test`.
4. Commit and push the four root `*.theme.css` files together with `styles/`, `assets/`, `src/`, `scripts/`, `project.json`, `package.json`, and the documentation.
5. Check that the published assets are accessible, then reload the theme in Discord.

Keep the contents at the repository root, rather than inside an extra `MVSCord-YoRHa-modular/` directory. Do not publish only the CSS: the theme requires the matching `styles/` and `assets/` folders to be published. Publish the supporting files before switching existing users to the new loaders. This package does not publish anything automatically.

For a different repository or branch, change `assetBase` in `project.json` and rebuild. For a temporary build, set the `MVSCORD_ASSET_BASE` environment variable to an absolute URL ending in `/`.

## Editing guide

- Main colors: `src/themes/<variant>/palette.css`.
- Component-specific colors: variant files such as `spotify.css`, `header-contrast.css`, and `surface-tokens.css`.
- Shared rules: locate the module in `src/styles/components/` and check which theme manifests include it.
- Inherited layout: `src/styles/base/oldcord.css`.
- Wallpapers: replace the image in `assets/wallpapers/`, keeping its filename and updating its manifest hash and size.
- New modules: create the CSS file and register its position in `theme.json`.

Modules with suffixes such as `-light` are shared only by the variants that list them. Variant differences remain explicit to avoid forcing a common palette onto Nitro profiles. Some historical overrides are intentionally preserved: merging or reordering them can introduce regressions. Do not edit the generated root loaders or the stylesheets in `styles/`; the build overwrites them.

## Verification

The initial migration was compared against all four previous stylesheets. After normalizing asset URLs, rule order and content were identical, and all 14 assets retained their original bytes. Both hosted and portable builds passed this comparison. This does not replace visual testing in Discord.

`npm test` checks asset integrity, module references, the approved cascade hash, and whether the generated loaders and hosted stylesheets match the sources. Run `npm run build` first after editing source files. An intentional CSS edit changes this hash. After reviewing the diff and visually validating the result, run:

```sh
npm run baseline:accept
npm test
```

Do not accept a new baseline merely to hide an unexpected failure. When replacing images, update the corresponding `sha256` and `bytes` fields in `assets/manifest.json` before building.

Pay particular attention to light and dark profiles, profile message inputs, JSON/TXT previews, the shop, settings, the Spotify player, and calls.

## Credits

See [CREDITS.md](CREDITS.md). Extracted assets retain their original attribution; reorganizing them does not change authorship.

## Individual downloads on GitHub

The four root `.theme.css` files are ready for individual download. Users can either add their raw URL to Vencord's online themes list or download one file into the local themes folder. Both methods load the actual styles and assets online.

For downloadable release attachments, create a GitHub release after publishing `styles/` and `assets/`, then attach the four root `.theme.css` files. The attachments continue to import the current `main` branch styles; they are not frozen snapshots of that release. Portable builds are an optional alternative for users who prefer embedded images.

No GitHub release or upload is performed by the build script. The repository must remain publicly accessible for these URLs to work.






