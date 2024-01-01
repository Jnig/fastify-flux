import { Command } from 'commander';

import {
  runWorkerControllerGeneration,
  runWorkerEsbuild,
  runWorkerSchemaGeneration,
  runWorkerTypecheck,
} from '../piscina/index.js';

async function handler(options: { typecheck: true }) {
  if (options.typecheck) {
    await runWorkerTypecheck();
  }

  await Promise.all([
    runWorkerEsbuild(),
    runWorkerControllerGeneration(),
    runWorkerSchemaGeneration(),
  ]);
}

export function addBuildCommand(program: Command) {
  program
    .command('build')
    .option('--typecheck', 'Run typecheck before building the project.')
    .action(handler);
}
