import { GenerateApiParams } from 'swagger-typescript-api';

export interface FluxProjectConfig {
  sdk: GenerateApiParams;
  exec: { command: string; args: string[] };
}

export interface FluxCliConfig {
  projects: FluxProjectConfig[];
}
