import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const options = new Set(process.argv.slice(2));
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const json = file => JSON.parse(read(file));
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const project = json('project.json');
const assets = new Map(json('assets/manifest.json').map(asset => [asset.path, asset]));
const baseline = json('scripts/baseline.json');
const nextBaseline = {};
const portable = options.has('--portable');
const check = options.has('--check');
const assetBase = process.env.MVSCORD_ASSET_BASE || project.assetBase;
const safePath = file => {
  const absolute = path.resolve(root, file);
  if (!absolute.startsWith(root + path.sep)) throw new Error(`Path outside project: ${file}`);
  return absolute;
};

for (const asset of assets.values()) {
  const bytes = fs.readFileSync(safePath(asset.path));
  if (hash(bytes) !== asset.sha256) throw new Error(`Asset checksum mismatch: ${asset.path}`);
}

for (const configPath of project.themes) {
  const config = json(configPath);
  const variant = path.basename(path.dirname(configPath));
  const source = config.header + config.modules.map(file => {
    if (!file.endsWith('.css')) throw new Error(`Not a CSS module: ${file}`);
    return fs.readFileSync(safePath(file), 'utf8');
  }).join('');
  nextBaseline[variant] = hash(source);
  if (check && nextBaseline[variant] !== baseline[variant]) {
    throw new Error(`${variant}: source differs from the verified cascade baseline`);
  }
  const output = source.replace(/url\(["']@(assets\/[^"']+)["']\)/g, (_, file) => {
    const asset = assets.get(file);
    if (!asset) throw new Error(`Unregistered asset: ${file}`);
    if (portable) {
      const bytes = fs.readFileSync(safePath(file));
      return `url("data:${asset.mime};base64,${bytes.toString('base64')}")`;
    }
    return `url("${new URL(file, assetBase).href}")`;
  });
  if (output.includes('url("@assets/')) throw new Error(`Unresolved asset in ${variant}`);
  if (!portable && /url\(["']data:/.test(output)) throw new Error(`Embedded asset in ${variant}`);
  const hostedPath = `styles/${variant}.css`;
  const loader = `${config.header}\n\n@import url("${new URL(hostedPath, assetBase).href}");\n`;
  if (!check) {
    const target = portable ? path.join('dist/portable', config.name) : hostedPath;
    fs.mkdirSync(path.dirname(safePath(target)), { recursive: true });
    fs.writeFileSync(safePath(target), output);
    if (!portable) fs.writeFileSync(safePath(config.name), loader);
  } else {
    if (read(hostedPath) !== output) throw new Error(`Stale hosted CSS: ${hostedPath}. Run npm run build.`);
    if (read(config.name) !== loader) throw new Error(`Stale loader: ${config.name}. Run npm run build.`);
  }
  console.log(`${check ? 'Verified' : 'Built'} ${config.name}: ${Buffer.byteLength(output)} bytes`);
  if (!portable) console.log(`  Online loader: ${Buffer.byteLength(loader)} bytes -> ${hostedPath}`);
}
if (options.has('--accept-baseline')) {
  fs.writeFileSync(path.join(root, 'scripts/baseline.json'), JSON.stringify(nextBaseline, null, 2) + '\n');
  console.log('New cascade baseline recorded. Use only after reviewing intended changes.');
}
