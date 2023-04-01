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

require('./dist/index');
