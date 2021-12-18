import { Command } from 'commander';
import { addStartCommand } from './commands/start.js';
import { addBuildCommand } from './commands/build.js';
import { addSdkCommand } from './commands/sdk.js';
export * from './types.js';

const program = new Command();
addStartCommand(program);
addBuildCommand(program);
addSdkCommand(program);

program.parse(process.argv);
