import { Command } from 'commander';
import { addStartCommand } from './commands/start.js';
import { addBuildCommand } from './commands/build.js';

const program = new Command();
addStartCommand(program);
addBuildCommand(program);

program.parse(process.argv);
