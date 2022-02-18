import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getConfig } from './config.js';
import { generateMeta } from './generateMeta.js';
import { generateSchema } from './generateSchema.js';
import { writeFile } from './writeFile.js';

export async function writeControllerJson() {
  const config = await getConfig();
  const meta = await generateMeta();

  writeFile(join(config.outdir, 'flux-controller.json'), meta);
}

export async function writeSchemaJson() {
  const config = await getConfig();
  let schema = await generateSchema(config.entry, { removeDateTime: false });
  if (!schema) {
    schema = '{}';
  }

  writeFile(join(config.outdir, 'flux-schema.json'), schema);
}

export function getRootDir() {
  return join(dirname(fileURLToPath(import.meta.url)), '../../');
}

export * from './esbuild.js';
