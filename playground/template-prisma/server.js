require('source-map-support/register');
require('tsconfig-paths').register({
  baseUrl: '.',
  paths: {
    '~/*': ['./dist/*'],
  },
});

require('./dist/index');
