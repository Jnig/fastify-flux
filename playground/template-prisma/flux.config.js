/** @type {import('fastify-flux').FluxCliConfig} */
const config = {
  entry: './src/',
  outdir: './dist/',
  tasks: [
    {
      run: ['node', 'server.js'],
      sdk: {
        name: 'GeneratedApi.ts',
        output: './tests-e2e/api/',
        moduleNameIndex: 0,
      },
    },
  ],
};

module.exports = config;
