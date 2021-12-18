import { Command } from 'commander';

import { runWorkerSdkGeneration } from '../piscina/index.js';

async function handler() {
  await runWorkerSdkGeneration();
}

export function addSdkCommand(program: Command) {
  program.command('sdk').action(handler);
}
