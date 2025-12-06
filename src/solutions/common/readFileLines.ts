import { basename } from 'path';
import { readFileSync } from 'fs';

export default function readFileLines(filename: string, delimiter :string = '\n', trim : boolean = true): string[] {
  let fileContent: string = '';
  try {
    fileContent = readFileSync(`./src/inputs/${basename(filename, '.js')}.txt`, 'utf-8').replace(/\r/g, '');
  } catch (error) {
    console.error('Error reading file:', error);
  }

  return trim ? fileContent.trim().split(delimiter).map(String) : fileContent.split(delimiter).map(String);
}

export function readFileLinesWithSections(filename: string, delimiter :string = '\n', sectionDelimiter: string = '\n\n'): string[][] {
  let fileContent: string = '';
  try {
    fileContent = readFileSync(`./src/inputs/${basename(filename, '.js')}.txt`, 'utf-8').replace(/\r/g, '');
  } catch (error) {
    console.error('Error reading file:', error);
  }

  const sections: string[] = fileContent.split(sectionDelimiter);
  return sections.map((section: string): string[] => section.trim().split(delimiter).map(String));
}
