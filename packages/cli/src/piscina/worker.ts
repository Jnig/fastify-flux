import { execa } from 'execa';
import { join } from 'node:path';
import {
  esbuildHelper,
  getRootDir,
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
  await esbuildHelper();
}

export async function runTypecheck() {
  try {
    await execa('tsc', ['--noEmit']);
  } catch (err: any) {
    log({ component: 'cli', error: 'Typecheck failed', details: err.message });
  }
}

export async function runSdkGeneration(options: { directory: string }) {
  const logFunction = console.log;

  let warning = [''] as string[];
  let error = [''] as string[];
  console.log = () => {};
  console.warn = (...message) => {
    warning.push(message.join(' '));
  };
  console.error = (...message) => {
    error.push(message.join(' '));
  };

  const output = join(process.cwd(), options.directory);
  try {
    const generator = await import('swagger-typescript-api');
    await generator.default.generateApi({
      name: 'GeneratedApi.ts',
      input: join(process.cwd(), '/dist/openapi.json'),
      output,
      templates: join(getRootDir(), '/sdk-templates/'),
      httpClientType: 'axios',
      moduleNameIndex: 0,
    });
  } catch (err: any) {
    console.error(err.message);
  }

  console.log = logFunction;

  if (warning.length > 1) {
    log({
      component: 'cli',
      warning: 'SDK warning',
      details: warning.join('\n'),
    });
  }

  if (error.length > 1) {
    log({ component: 'cli', error: 'SDK error', details: error.join('\n') });
  } else {
    log({ component: 'cli', success: 'SDK written to', details: output });
  }
}
