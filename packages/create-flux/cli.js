#!/usr/bin/env node

const path = require('path');
const { version } = require(path.join(__dirname, 'package.json'));
process.env.version = version;

require('source-map-support/register');
require('./dist/index');
