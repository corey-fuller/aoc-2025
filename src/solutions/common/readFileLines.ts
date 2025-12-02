import { basename } from 'path';
import { readFileSync } from 'fs';

export default function readFileLines(filename: string): string[] {
  let lines: string[] = [];
  try {
    lines = readFileSync(`./src/inputs/${basename(filename, '.js')}.txt`, 'utf-8').replace(/\r/g, "")
    .trim()
    .split("\n")
    .map(String);
  } catch (error) {
    console.error('Error reading file:', error);
  }
  return lines;
}
