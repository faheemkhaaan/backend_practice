// const fs = require('node:fs');
// const path = require('node:path')
// require('./file');
import fs from 'node:fs';
import path from 'path';

const __dirname = import.meta.dirname;

const filePath = path.join(__dirname, 'text.txt')

console.log(__dirname);
console.log(filePath)
const text = fs.readFileSync(filePath, 'utf8');
console.log(text);