/** @type {import('fastify-flux-cli').FluxCliConfig} */
const config = {
  entry: './src/',
  outdir: './dist/',
  tasks: [
    {
      run: ['node', 'server.js'],
      sdk: {
        name: 'generated-api.ts',
        output: './tests-e2e/api/',
        moduleNameIndex: 0,
      },
    },
    {
      run: ['node', 'server.js', 'v2'],
      sdk: {
        name: 'generated-api-v2.ts',
        output: './tests-e2e/api/',
        moduleNameIndex: 0,
      },
    },
  ],
};

module.exports = config;
