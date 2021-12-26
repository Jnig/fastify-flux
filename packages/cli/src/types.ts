import { GenerateApiParams } from 'swagger-typescript-api';

export interface FluxProjectConfig {
  sdk?: GenerateApiParams;
  run: string[];
}

export interface FluxCliConfig {
  entry: string;
  outdir: string;
  tasks: FluxProjectConfig[];
}
