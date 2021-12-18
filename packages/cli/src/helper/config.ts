import _, { add, merge } from 'lodash';
import { join } from 'node:path';
import { getRootDir } from './index.js';
import { FluxCliConfig } from '../types.js';

const sdk = {
  name: 'GeneratedApi.ts',
  input: join(process.cwd(), '/dist/openapi.json'),
  templates: join(getRootDir(), '/sdk-templates/'),
  httpClientType: 'axios',
  moduleNameIndex: 0,
};

export async function getConfig(): Promise<FluxCliConfig> {
  const config = { sdk };

  const additional = await import(join(process.cwd(), '/flux.config.js'));

  const merged = _.merge(config, additional.default);

  if (merged.sdk.output && merged.sdk.output.startsWith('.')) {
    merged.sdk.output = join(process.cwd(), merged.sdk.output);
  }

  return merged;
}
