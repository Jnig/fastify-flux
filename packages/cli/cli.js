#!/usr/bin/env node

import { dirname, join } from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'url';
import sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

const __dirname = dirname(fileURLToPath(import.meta.url));
const { version } = JSON.parse(readFileSync(join(__dirname, 'package.json')));
process.env.version = version;

import './dist/index.js';
