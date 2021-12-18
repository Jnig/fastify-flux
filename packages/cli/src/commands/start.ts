import { Command } from 'commander';
import { execa } from 'execa';
import chokidar from 'chokidar';
import {
  runWorkerControllerGeneration,
  runWorkerEsbuild,
  runWorkerSchemaGeneration,
  runWorkerSdkGeneration,
  runWorkerTypecheck,
} from '../piscina/index.js';
import { log } from '../log.js';

function runBackend(options: { debug: boolean }) {
  const args = ['./server.js'];
  if (options.debug) {
    args.unshift('--inspect');
  }

  const subprocess = execa('node', args);
  if (subprocess.stdout) {
    subprocess.stdout.on('data', (line) => {
      log({ component: 'app', details: line.toString().trim() });
    });
  }
  if (subprocess.stderr) {
    subprocess.stderr.pipe(process.stdout);
  }

  return subprocess;
}

async function handler(options: {
  watch: boolean;
  typecheck: boolean;
  sdk: string;
  debug: boolean;
}) {
  await Promise.all([
    runWorkerEsbuild(),
    runWorkerControllerGeneration(),
    runWorkerSchemaGeneration(),
  ]);
  let process = runBackend(options);

  const changeHandler = async (change: string) => {
    log({ component: 'cli', success: 'App reload', details: change });
    process.cancel();
    await Promise.all([
      runWorkerEsbuild(),
      runWorkerControllerGeneration(),
      runWorkerSchemaGeneration(),
    ]);
    process = runBackend(options);

    if (options.typecheck) {
      runWorkerTypecheck();
    }

    if (options.sdk) {
      runWorkerSdkGeneration();
    }
  };
  chokidar
    .watch('./src/', {
      disableGlobbing: true,
      persistent: true,
      ignoreInitial: true,
    })
    .on('add', changeHandler)
    .on('change', changeHandler);
}

export function addStartCommand(program: Command) {
  program
    .command('start')
    .option('-w, --watch', 'Automatically restart on file changes.')
    .option('-d, --debug', 'Run node with debug flag.')
    .option('--typecheck', 'Runs a typecheck in a seperate thread.')
    .option('--sdk <dir>', 'Generate client sdk in provided directory.')
    .action(handler);
}
