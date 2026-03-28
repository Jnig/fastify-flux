import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { generateApi } from 'swagger-typescript-api';
import { formatWithBiome } from './formatWithBiome.js';
import { log } from '../log.js';

export async function generateSdk(sdk: Parameters<typeof generateApi>[0]) {
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

  try {
    await generateApi(sdk);
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
    const filePath = join(sdk.output as string, sdk.fileName as string);
    const content = await readFile(filePath, 'utf-8');
    const formatted = await formatWithBiome(content);
    await writeFile(filePath, formatted);

    log({
      component: 'cli',
      success: 'SDK written to',
      details: sdk.output as string,
    });
  }
}
