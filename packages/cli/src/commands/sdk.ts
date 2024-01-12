import { Command } from 'commander';
import pMap from 'p-map';
import { getConfig } from '../helper/config.js';
import { generateSdk } from '../helper/generateSdk.js';

async function handler() {
  const config = await getConfig();
  await pMap(config.tasks, async (project) => {
    if (!project.sdk) {
      return;
    }


    await generateSdk(project.sdk);
  });
}

export function addSdkCommand(program: Command) {
  program.command('sdk').action(handler);
}
