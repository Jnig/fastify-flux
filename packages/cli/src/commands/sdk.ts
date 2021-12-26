import { Command } from 'commander';
import pMap from 'p-map';
import { getConfig } from '../helper/config.js';

import { runWorkerSdkGeneration } from '../piscina/index.js';

async function handler() {
  const config = await getConfig();
  await pMap(config.tasks, async (project) => {
    if (!project.sdk) {
      return;
    }

    await runWorkerSdkGeneration(project.sdk);
  });
}

export function addSdkCommand(program: Command) {
  program.command('sdk').action(handler);
}
