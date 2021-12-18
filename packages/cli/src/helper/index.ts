import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateMeta } from './generateMeta.js';
import { generateSchema } from './generateSchema.js';
import { writeFile } from './writeFile.js';

const dir = join(process.cwd(), '/dist/');

export async function writeControllerJson() {
  const meta = await generateMeta();

  writeFile(join(dir, 'flux-controller.json'), meta);
}

export async function writeSchemaJson() {
  const schema = await generateSchema('./src/', { removeDateTime: false });

  writeFile(join(dir, 'flux-schema.json'), schema);
}

export function getRootDir() {
  return join(dirname(fileURLToPath(import.meta.url)), '../../');
}

export * from './esbuild.js';
