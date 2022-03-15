require('source-map-support/register');
require('tsconfig-paths').register({
  baseUrl: '.',
  paths: {
    '~/*': ['./dist/*'],
  },
});
const fs = require('fs');

if (!fs.existsSync('./dist/index.js')) {
  console.error('Please run npm run build first.');
  process.exit(1);
}

if (!process.argv[2]) {
  require('./dist/index');
}

if (process.argv[2] === 'v2') {
  require('./dist/index-v2');
}
