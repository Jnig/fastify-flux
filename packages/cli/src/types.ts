import { BuildOptions } from 'esbuild';
import { GenerateApiParamsFromPath } from 'swagger-typescript-api';

export interface FluxProjectConfig {
  sdk?: GenerateApiParamsFromPath;
  run: string[];
}

export interface FluxCliConfig {
  entry: string;
  outdir: string;
  esbuild?: BuildOptions;
  tasks: FluxProjectConfig[];
}
