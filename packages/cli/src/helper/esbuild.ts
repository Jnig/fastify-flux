import { build, Plugin } from 'esbuild';
import fg from 'fast-glob';

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
  const files = await fg('./src/**/*.ts', {
    absolute: true,
    markDirectories: true,
  });

  await build({
    platform: 'node',
    target: 'node16',
    format: 'cjs',
    entryPoints: files,
    outdir: 'dist/',
    outbase: 'src/',
    bundle: false,
    sourcemap: true,
    plugins: [makeAllPackagesExternalPlugin()],
  });
}
