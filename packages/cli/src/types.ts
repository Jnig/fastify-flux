import { BuildOptions } from 'esbuild';
import { generateApi } from 'swagger-typescript-api';

export interface FluxProjectConfig {
  sdk?: Parameters<typeof generateApi>[0];
  run: string[];
}

export interface FluxCliConfig {
  entry: string;
  outdir: string;
  esbuild?: BuildOptions;
  tasks: FluxProjectConfig[];
}
