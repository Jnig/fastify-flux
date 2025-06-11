import _, { add, merge } from 'lodash';
import { join } from 'node:path';
import { getRootDir } from './index.js';
import { FluxCliConfig } from '../types.js';

function getSdkDefaultConfig(projectIndex: number, outdir: string) {
  const sdk = {
    fileName: 'GeneratedApi.ts',
    input: join(outdir, `/openapi-${projectIndex}.json`),
    templates: join(getRootDir(), '/sdk-templates/'),
    httpClientType: 'axios',
    moduleNameIndex: 0,
  };

  return sdk;
}

async function readConfig() {
  const config: FluxCliConfig = (
    await import(join(process.cwd(), '/flux.config.js'))
  ).default;

  return _.cloneDeep(config);
}

export async function getConfig(): Promise<FluxCliConfig> {
  const config = await readConfig();

  config.outdir = join(process.cwd(), config.outdir);

  config.tasks.forEach((project, index) => {
    if (project.sdk) {
      project.sdk = _.merge(
        getSdkDefaultConfig(index, config.outdir),
        project.sdk,
      );

      if (project.sdk.output && project.sdk.output.startsWith('.')) {
        project.sdk.output = join(process.cwd(), project.sdk.output);
      }
    }
  });

  return config;
}
