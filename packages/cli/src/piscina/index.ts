import Piscina from 'piscina';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  GenerateApiConfiguration,
  GenerateApiParams,
} from 'swagger-typescript-api';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const piscina = new Piscina({
  filename: resolve(__dirname, 'worker.js'),
  maxThreads: 4,
});

export function runWorkerEsbuild() {
  return piscina.run({}, { name: 'runEsbuild' });
}

export function runWorkerSchemaGeneration() {
  return piscina.run({}, { name: 'runSchemaGeneration' });
}

export function runWorkerControllerGeneration() {
  return piscina.run({}, { name: 'runControllerGeneration' });
}

export function runWorkerSdkGeneration(sdk: GenerateApiParams) {
  return piscina.run(sdk, { name: 'runSdkGeneration' });
}

export function runWorkerTypecheck() {
  return piscina.run({}, { name: 'runTypecheck' });
}
