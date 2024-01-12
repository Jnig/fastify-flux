import { Command } from 'commander';
import { writeControllerJson, esbuildHelper, runTypecheck } from '../helper/index.js';

async function handler(options: { typecheck: true }) {
  if (options.typecheck) {
    await runTypecheck();
  }

  await esbuildHelper()
  await writeControllerJson();
}

export function addBuildCommand(program: Command) {
  program
    .command('build')
    .option('--typecheck', 'Run typecheck before building the project.')
    .action(handler);
}
