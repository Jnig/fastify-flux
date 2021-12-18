import { readFileSync, writeFileSync } from 'fs';

export function writeFile(file: string, content: string) {
  let oldContent = '';
  try {
    oldContent = readFileSync(file, 'utf8');
  } catch (err) {}

  if (oldContent !== content) {
    writeFileSync(file, content);
  }
}
