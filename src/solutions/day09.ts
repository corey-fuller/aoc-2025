import { readFile } from './common/readFileLines.js';

class Rectangle {
  private redCorner1: number[] = new Array<number>(2);
  private redCorner2: number[] = new Array<number>(2);
  public area: number = 0;

  constructor(redCorner1: number[], redCorner2: number[]) {
    this.redCorner1 = redCorner1;
    this.redCorner2 = redCorner2;
    this.area = this.calculateArea();
  }

  private calculateArea(): number {
    return Math.abs(this.redCorner1[0] - this.redCorner2[0] + 1) * Math.abs(this.redCorner1[1] - this.redCorner2[1] + 1);
  }
}

function part1(lines: string[]): void {
  console.time('part1');
  let rectangles: Rectangle[] = [];
  lines.forEach((line, index) => {
    const redTileLocation = line.split(',').map(Number);
    for (let i = index + 1; i < lines.length; i++) {
      if (i === index){
        continue;
      }
      rectangles.push(new Rectangle(redTileLocation, lines[i].split(',').map(Number)));
    }
  });
  rectangles.sort((a, b) => b.area - a.area);
  console.log('part 1 => ', rectangles[0].area);
  console.timeEnd('part1');
}

function part2(lines: string[]): void {
  console.time('part2');
  let greenies: Set<Set<number>> = new Set<Set<number>>();
  let rectangles: Rectangle[] = [];
  lines.forEach((line, index) => {
    const redTileLocation = line.split(',').map(Number);
    for (let i = index + 1; i < lines.length; i++) {
      if (i === index){
        continue;
      }
      rectangles.push(new Rectangle(redTileLocation, lines[i].split(',').map(Number)));
    }
  });
  rectangles.sort((a, b) => b.area - a.area);
  rectangles.forEach((rectanlge) => {
    rectanlge
  });
  console.log('part 2 => ', rectangles[0].area);
  console.timeEnd('part2');
}

const lines: string[] = readFile(import.meta.url).asArray();
part1(lines);
part2(lines);
