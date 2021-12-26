import { build, Plugin } from 'esbuild';
import fg from 'fast-glob';
import { join } from 'node:path';
import { getConfig } from './config.js';

const makeAllPackagesExternalPlugin = (): Plugin => ({
  name: 'make-all-packages-external',
  setup(build) {
    build.onResolve({ filter: /.*/ }, (args: any) => {
      if (args.resolveDir.includes('node_modules')) {
        return { path: args.path, external: true };
      }
    });
  },
});

export async function esbuildHelper() {
  const config = await getConfig();

  const files = await fg(join(config.entry, '/**/*.ts'), {
    absolute: true,
    markDirectories: true,
  });

  await build({
    platform: 'node',
    target: 'node16',
    format: 'cjs',
    entryPoints: files,
    outdir: config.outdir,
    outbase: config.entry,
    bundle: false,
    sourcemap: true,
    plugins: [makeAllPackagesExternalPlugin()],
  });
}
