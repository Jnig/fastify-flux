/** @type {import('@fluxapi/cli').FluxCliConfig} */
const config = {
  entry: './src/',
  outdir: './dist/',
  tasks: [
    {
      run: ['node', 'dist/index.js'],
    },
  ],
};

module.exports = config;
