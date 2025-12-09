import { readFile } from './common/readFileLines.js';

function part1(lines: string[]): void {
  console.time('part1');
  let splitCount: number = 0;
  let tachyonBeams: Set<number> = new Set([Math.floor(lines[0].length/2)]); // start with middle beam
  // skip the first two lines and find the beam splits
  for (let i = 2; i < lines.length; i += 2) {
    let line: string[] = lines[i].split('');
    let newBeams: Set<number> = new Set();
    tachyonBeams.forEach((beam) => {
      if (line[beam] === '^') {
        splitCount++;
        newBeams.add(beam - 1);
        newBeams.add(beam + 1);
      } else {
        newBeams.add(beam);
      }
    })
    tachyonBeams = newBeams;
  }
  console.log('part 1 => ', splitCount);
  console.timeEnd('part1');
}

function part2(lines: string[]): void {
  console.time('part2');
  // start with middle beam
  let possiblePaths: Map<number, number> = new Map([[Math.floor(lines[0].length/2), 1]]);
  // skip the first two lines and find the beam splits
  for (let i = 2; i < lines.length; i += 2) {
    let possibleNewPaths: Map<number, number> = new Map();
    let line: string[] = lines[i].split('');
    possiblePaths.forEach((pathCount, beam) => {
      if (line[beam] === '^') {
        possibleNewPaths.set(beam + 1,  (possibleNewPaths.get(beam + 1) || 0) + pathCount);
        possibleNewPaths.set(beam - 1,  (possibleNewPaths.get(beam - 1) || 0) + pathCount);
        possibleNewPaths.delete(beam);
      } else {
        possibleNewPaths.set(beam, (possibleNewPaths.get(beam) || 0) + pathCount);
      }
    })
    possiblePaths = possibleNewPaths;
  }
  console.log('part 2 => ', possiblePaths.values().reduce((a, b) => a + b, 0));
  console.timeEnd('part2');
}

const lines: string[] = readFile(import.meta.url).asArray();
part1(lines);
part2(lines);
