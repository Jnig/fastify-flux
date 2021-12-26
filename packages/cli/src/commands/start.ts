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
import { FluxProjectConfig } from '../types.js';

interface Options {
  watch: boolean;
  typecheck: boolean;
  sdk: string;
  debug: boolean;
}

function startProcess(command: string[], projectIndex: number) {
  const [file, ...args] = command;
  const subprocess = execa(file, args, {
    env: { FLUX_PROJECT_INDEX: `${projectIndex}` },
  });

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

  constructor(private config: FluxProjectConfig['run'][]) {}

  cancelAll() {
    this.procs.forEach((x) => {
      x.cancel();
    });
  }

  startAll() {
    this.procs = this.config.map(startProcess);
  }
}

class WatchHandler {
  private excecHandler!: ExecHandler;

  constructor(private options: Options) {}

  async setup() {
    const config = await getConfig();
    const { tasks } = config;
    const commands = tasks.map((x) => x.run);

    commands.forEach((x) => {
      if (this.options.debug) {
        x.push('--inspect');
      }
    });

    this.excecHandler = new ExecHandler(commands);
    this.excecHandler.startAll();

    chokidar
      .watch(config.entry, {
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
  }
}

async function startSdkWatch() {
  const { tasks } = await getConfig();
  tasks.forEach((project) => {
    if (!project.sdk) {
      return;
    }

    const { sdk } = project;

    const handler = async () => await runWorkerSdkGeneration(sdk);

    chokidar
      .watch(sdk.input, {
        disableGlobbing: true,
        persistent: true,
        ignoreInitial: true,
      })
      .on('add', handler)
      .on('change', handler);
  });
}

async function handler(options: Options) {
  await runWorkerEsbuild(); //esbuild generated dist dir if not exists
  await Promise.all([
    runWorkerControllerGeneration(),
    runWorkerSchemaGeneration(),
  ]);

  const instance = new WatchHandler(options);
  await instance.setup();

  if (options.sdk) {
    startSdkWatch();
  }
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
