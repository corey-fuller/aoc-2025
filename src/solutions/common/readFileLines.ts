import { basename } from 'path';
import { readFileSync, existsSync } from 'fs';

/**
 * Configuration options for reading files
 */
export interface ReadFileOptions {
  normalizeLineEndings?: boolean;
  trim?: boolean;
}

/**
 * Configuration options for splitting file content
 */
export interface SplitOptions extends ReadFileOptions {
  delimiter?: string;
}

/**
 * Configuration options for reading files with sections
 */
export interface SectionOptions extends ReadFileOptions {
  lineDelimiter?: string;
  sectionDelimiter?: string;
}

/**
 * Core file reader class for Advent of Code inputs
 */
class FileReader {
  private readonly filePath: string;

  constructor(filename: string) {
    this.filePath = `./src/inputs/${basename(filename, '.js')}.txt`;
  }

  /**
   * Reads the raw file content
   */
  private readRaw(options: ReadFileOptions = {}): string {
    const { normalizeLineEndings = true, trim = false } = options;

    try {
      let content = readFileSync(this.filePath, 'utf-8').replace(/\r/g, '');
      if (normalizeLineEndings) {
        content = content;
      }
      if (trim) {
        content = content.trim();
      }
      return content;
    } catch (error) {
      throw new Error(
        `Error reading file ${this.filePath}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Returns the raw file content as a string
   */
  asString(options: ReadFileOptions = {}): string {
    return this.readRaw(options);
  }

  /**
   * Splits the file content by a delimiter
   */
  asArray(options: SplitOptions = {}): string[] {
    const { delimiter = '\n', trim = true, ...readOptions } = options;
    const content = this.readRaw({ ...readOptions, trim });
    return content.split(delimiter);
  }

  /**
   * Splits the file into sections, then splits each section into lines
   */
  asSections(options: SectionOptions = {}): string[][] {
    const {
      lineDelimiter = '\n',
      sectionDelimiter = '\n\n',
      ...readOptions
    } = options;
    const content = this.readRaw(readOptions);
    const sections = content.split(sectionDelimiter);
    return sections.map(section => section.trim().split(lineDelimiter));
  }

  /**
   * Splits the file into a 2D grid of characters
   */
  asGrid(options: ReadFileOptions = {}): string[][] {
    const lines = this.asArray(options);
    return lines.map(line => line.split(''));
  }

  /**
   * Splits the file into lines and maps each line with a transform function
   */
  asLinesMap<T>(transform: (line: string, index: number) => T, options: ReadFileOptions = {}): T[] {
    const lines = this.asArray(options);
    return lines.map(transform);
  }

  /**
   * Splits the file into lines and parses each as a number
   */
  asNumbers(options: ReadFileOptions = {}): number[] {
    return this.asLinesMap(line => Number(line), options);
  }
}

/**
 * Reads a file and returns a FileReader instance with chainable methods
 * 
 * @param filename - The name of the file (with or without .js extension)
 * @returns A FileReader instance
 * 
 * @example
 * ```typescript
 * // Read as lines
 * const lines = readFile('day01').asLines();
 * 
 * // Read as string
 * const content = readFile('day01').asString();
 * 
 * // Read as sections
 * const sections = readFile('day01').asSections();
 * 
 * // Read as grid
 * const grid = readFile('day01').asGrid();
 * 
 * // Read and transform
 * const numbers = readFile('day01').asNumbers();
 * ```
 */
export function readFile(filename: string): FileReader {
  return new FileReader(filename);
}
