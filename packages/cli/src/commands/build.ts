import { Command } from 'commander';

import {
  runWorkerTypecheck,
} from '../piscina/index.js';

import { writeControllerJson, esbuildHelper } from '../helper/index.js';

async function handler(options: { typecheck: true }) {
  if (options.typecheck) {
    await runWorkerTypecheck();
  }
  await writeControllerJson();
  await esbuildHelper()
}

export function addBuildCommand(program: Command) {
  program
    .command('build')
    .option('--typecheck', 'Run typecheck before building the project.')
    .action(handler);
}
