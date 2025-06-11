import { Command } from 'commander';
import { execa } from 'execa';
import chokidar from 'chokidar';
import pMap from 'p-map';
import _ from 'lodash';
import { log } from '../log.js';
import { getConfig } from '../helper/config.js';
import { FluxProjectConfig } from '../types.js';
import { killProcess } from '../helper/killProcess.js';
import { existsSync, mkdirSync } from 'fs';
import { esbuildHelper } from '../helper/esbuild.js';
import { runTypecheck, writeControllerJson } from '../helper/index.js';
import { generateSdk } from '../helper/generateSdk.js';

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

  return subprocess.pid as number;
}

async function createDistDir() {
  const distDir = 'dist/';
  const distExists = existsSync(distDir);

  if (!distExists) {
    mkdirSync(distDir);
  }
}

class ExecHandler {
  private procs: number[] = [];

  constructor(private config: FluxProjectConfig['run'][]) {}

  async cancelAll() {
    await pMap(this.procs, async (pid) => {
      await killProcess(pid);
    });
  }

  restartAll() {
    this.cancelAll();
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

    chokidar
      .watch(config.entry, {
        disableGlobbing: true,
        persistent: true,
        ignoreInitial: true,
      } as any)
      .on('add', this.handleDebounced.bind(this))
      .on('change', this.handleDebounced.bind(this));
  }

  async build(changedFile?: string) {
    this.excecHandler.cancelAll();
    const esbuildSuccess = await esbuildHelper();
    if (!esbuildSuccess) {
      log({ component: 'cli', warning: 'Skipping restart... esbuild failed.' });
      return;
    }

    await writeControllerJson(changedFile);

    this.excecHandler.restartAll();
  }

  async handle(change: string) {
    log({ component: 'cli', success: 'App reload', details: change });

    await this.build(change);

    if (this.options.typecheck) {
      runTypecheck();
    }
  }

  handleDebounced = _.debounce(this.handle, 100);
}

async function startSdkWatch() {
  const { tasks } = await getConfig();
  tasks.forEach((project) => {
    if (!project.sdk) {
      return;
    }

    const { sdk } = project;

    const handler = async () => await generateSdk(sdk);

    if (!sdk.input) {
      throw new Error('SDK input path is not defined.');
    }

    chokidar
      .watch(sdk.input, {
        disableGlobbing: true,
        persistent: true,
        ignoreInitial: true,
      } as any)
      .on('add', handler)
      .on('change', handler);
  });
}

async function handler(options: Options) {
  await createDistDir();

  const instance = new WatchHandler(options);
  await instance.setup();
  await instance.build();

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
