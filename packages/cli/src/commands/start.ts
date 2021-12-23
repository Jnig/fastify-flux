import { Command } from 'commander';
import { execa, ExecaChildProcess } from 'execa';
import chokidar from 'chokidar';
import {
  runWorkerControllerGeneration,
  runWorkerEsbuild,
  runWorkerSchemaGeneration,
  runWorkerSdkGeneration,
  runWorkerTypecheck,
} from '../piscina/index.js';
import { log } from '../log.js';
import { getConfig } from '../helper/config.js';
import { FluxCliConfig } from '../types.js';

interface Options {
  watch: boolean;
  typecheck: boolean;
  sdk: string;
  debug: boolean;
}

function startProcess(command: FluxCliConfig['watch']['exec'][number]) {
  const subprocess = execa(command.command, command.args);
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

class ExecHandler {
  private procs: ExecaChildProcess[] = [];

  constructor(private config: FluxCliConfig['watch']) {}

  cancelAll() {
    this.procs.forEach((x) => {
      x.cancel();
    });
  }

  startAll() {
    this.procs = this.config.exec.map(startProcess);
  }
}

class WatchHandler {
  private excecHandler!: ExecHandler;

  constructor(private options: Options) {}

  async setup() {
    const config = await getConfig();

    if (!config.watch.exec) {
      throw new Error('Config: Config path watch.exec is missing.');
    }

    config.watch.exec.forEach((x) => {
      if (this.options.debug) {
        x.args.push('--inspect');
      }
    });

    this.excecHandler = new ExecHandler(config.watch);
    this.excecHandler.startAll();

    chokidar
      .watch('./src/', {
        disableGlobbing: true,
        persistent: true,
        ignoreInitial: true,
      })
      .on('add', this.handle.bind(this))
      .on('change', this.handle.bind(this));
  }

  async handle(change: string) {
    log({ component: 'cli', success: 'App reload', details: change });

    this.excecHandler.cancelAll();
    await Promise.all([
      runWorkerEsbuild(),
      runWorkerControllerGeneration(),
      runWorkerSchemaGeneration(),
    ]);
    this.excecHandler.startAll();

    if (this.options.typecheck) {
      runWorkerTypecheck();
    }

    if (this.options.sdk) {
      runWorkerSdkGeneration();
    }
  }
}

async function handler(options: Options) {
  await runWorkerEsbuild(); //esbuild generated dist dir if not exists
  await Promise.all([
    runWorkerControllerGeneration(),
    runWorkerSchemaGeneration(),
  ]);

  const instance = new WatchHandler(options);
  await instance.setup();
}

export function addStartCommand(program: Command) {
  program
    .command('start')
    .option('-w, --watch', 'Automatically restart on file changes.')
    .option('-d, --debug', 'Run node with debug flag.')
    .option('--typecheck', 'Runs a typecheck in a seperate thread.')
    .option('--sdk', 'Generate client sdk.')
    .action(handler);
}
