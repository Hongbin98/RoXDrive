import { existsSync, renameSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const output = join(process.cwd(), 'dist', 'client');
const index = join(output, 'index.html');
const prefixedAssets = join(output, 'RoXDrive', '_next');
const assets = join(output, '_next');

if (!existsSync(index) || !existsSync(prefixedAssets) || existsSync(assets)) {
  throw new Error('Unexpected static export layout; refusing to prepare an incomplete Pages artifact.');
}

// GitHub Pages already serves the artifact at /RoXDrive/. Flatten only the
// build-generated assets; source media remains in the artifact's root/videos/.
renameSync(prefixedAssets, assets);
writeFileSync(join(output, '.nojekyll'), '');
