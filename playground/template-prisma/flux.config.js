/** @type {import('@fluxapi/cli').FluxCliConfig} */
const config = {
  projects: [
    {
      exec: { command: 'node', args: ['server.js'] },
      sdk: {
        name: 'GeneratedApi.ts',
        output: './tests-e2e/api/',
        moduleNameIndex: 0,
      },
    },
  ],
};

module.exports = config;
