import { execa } from 'execa';
import { GenerateApiParams } from 'swagger-typescript-api';
import { generateSdk } from '../helper/generateSdk.js';
import {
  esbuildHelper,
  writeControllerJson,
  writeSchemaJson,
} from '../helper/index.js';

import { log } from '../log.js';

export default function handler() {
  console.log('runing handler');
}

export async function runControllerGeneration() {
  await writeControllerJson();
}

export async function runSchemaGeneration() {
  await writeSchemaJson();
}

export async function runEsbuild() {
  return await esbuildHelper();
}

export async function runTypecheck() {
  try {
    await execa('tsc', ['--noEmit']);
  } catch (err: any) {
    log({ component: 'cli', error: 'Typecheck failed', details: err.message });
  }
}

export async function runSdkGeneration(sdk: GenerateApiParams) {
  await generateSdk(sdk);
}
