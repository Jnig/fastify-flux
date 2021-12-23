/** @type {import('@fluxapi/cli').FluxCliConfig} */
const config = {
  sdk: {
    name: 'GeneratedApi.ts',
    output: './tests-e2e/api/',
    moduleNameIndex: 0,
  },
  watch: {
    exec: [{ command: 'node', args: ['server.js'] }],
  },
};

module.exports = config;
