import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import _ from 'lodash'
import { execa } from 'execa';
import { log } from '../log.js';

import { getConfig } from './config.js';
import { generateMeta } from './generateMeta.js';
import { writeFile } from './writeFile.js';

export async function writeControllerJson(changedFile?: string) {
  const config = await getConfig();
  const meta = await generateMeta(changedFile);

  writeFile(join(config.outdir, 'flux-controller.json'), meta);
}

export function getRootDir() {
  return join(dirname(fileURLToPath(import.meta.url)), '../../');
}

export async function runTypecheck() {
  try {
    await execa('tsc', ['--noEmit']);
  } catch (err: any) {
    log({ component: 'cli', error: 'Typecheck failed', details: err.message });
  }
}

export * from './esbuild.js';
