import _, { add, merge } from 'lodash';
import { join } from 'node:path';
import { getRootDir } from './index.js';
import { FluxCliConfig } from '../types.js';

function getSdkDefaultConfig(projectIndex: number) {
  const sdk = {
    name: 'GeneratedApi.ts',
    input: join(process.cwd(), `/dist/openapi-${projectIndex}.json`),
    templates: join(getRootDir(), '/sdk-templates/'),
    httpClientType: 'axios',
    moduleNameIndex: 0,
  };

  return sdk;
}

export async function getConfig(): Promise<FluxCliConfig> {
  const config: FluxCliConfig = (
    await import(join(process.cwd(), '/flux.config.js'))
  ).default;

  config.projects.forEach((project, index) => {
    if (project.sdk) {
      project.sdk = _.merge(getSdkDefaultConfig(index), project.sdk);

      if (project.sdk.output && project.sdk.output.startsWith('.')) {
        project.sdk.output = join(process.cwd(), project.sdk.output);
      }
    }
  });

  return config;
}
