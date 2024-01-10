import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import _ from 'lodash'
import { getConfig } from './config.js';
import { generateMeta } from './generateMeta.js';
import { generateSchema } from '../schema/generateSchema.js';
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
  const sorted = _.sortBy(JSON.parse(schema), "$id")
  writeFile(join(config.outdir, 'flux-schema.json'), JSON.stringify(sorted, null, 2));


  const functionMeta = JSON.parse(await generateMeta());
  const functionsSchema = _.sortBy(functionMeta.flatMap((x: any) => {
    return [x.returnSchema, ...x.params.filter((y: any) => y.schema).map((y: any) => y.schema)];
  }), '$id').reduce((acc, x) => {
    x['$id'] = x['$id'].replace('[]', '');
    acc[x['$id']] = x
    return acc
  }, {})

  writeFile(join(config.outdir, 'flux-schema-new.json'), JSON.stringify(functionsSchema, null, 2))
}

export function getRootDir() {
  return join(dirname(fileURLToPath(import.meta.url)), '../../');
}

export * from './esbuild.js';
