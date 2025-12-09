import { readFile } from './common/readFileLines.js';

class PaperRoll {
  private rowIdx: number;
  private colIdx: number;
  private neighbors: PaperRoll[] = [];
  private removed: boolean = false;

  constructor(rowIdx: number, colIdx: number) {
    this.rowIdx = rowIdx;
    this.colIdx = colIdx;
  }

  setNeighbors(neighbors: PaperRoll[]): void {
    this.neighbors = neighbors;
  }

  setRemoved(removed: boolean): void {
    this.removed = removed;
  }

  getNeighborCount(): number {
    return this.neighbors.length;
  }

  isRemoved(): boolean {
    return this.removed;
  }

  isAccessible(): boolean {
    return this.neighbors.filter((pRoll) => !pRoll.isRemoved()).length < 4;
  }

  areEqual(pRoll: PaperRoll): boolean {
    return this.rowIdx === pRoll.rowIdx && this.colIdx === pRoll.colIdx;
  }

  isNeighborRow(row: number): boolean {
    return row <= this.rowIdx + 1 && row >= this.rowIdx - 1;
  }

  isNeighborColumn(col: number): boolean {
    return col <= this.colIdx + 1 && col >= this.colIdx - 1;
  }

  isNeighbor(pRoll: PaperRoll): boolean {
    return !this.areEqual(pRoll) && this.isNeighborRow(pRoll.rowIdx) && this.isNeighborColumn(pRoll.colIdx);
  }
}

class PaperRollGrid {
  private paperRolls: PaperRoll[] = [];

  constructor(rows: string[]) {
    this.paperRolls = this.findPaperRolls(rows);
    this.determineNeighbors();
  }

  getAccessibleRolls(): PaperRoll[] {
    return this.paperRolls.filter((pRoll) => pRoll.isAccessible() && !pRoll.isRemoved());
  }

  removeAccessibleRolls(): number {
    const accessibleRolls: PaperRoll[] = this.getAccessibleRolls();
    accessibleRolls.forEach((pRoll) => {
      pRoll.setRemoved(true);
    });
    return accessibleRolls.length;
  }

  private determineNeighbors(): void {
    for (const pRoll of this.paperRolls) {
      pRoll.setNeighbors(this.paperRolls.filter((otheRoll) => pRoll.isNeighbor(otheRoll)));
    }
  }

  private findPaperRolls(rows: string[]): PaperRoll[] {
    const grid: string[][] = rows.map((row) => [...row]);

    const paperRolls: PaperRoll[] = grid.reduce((acc: PaperRoll[], row, rowIdx) => {
      row.forEach((item, colIdx) => {
        if (item === '@') {
          acc.push(new PaperRoll(rowIdx, colIdx));
        }
      });
      return acc;
    }, []);

    return paperRolls;
  }
}

function part1(lines: string[]): void {
  console.time('part1');
  const grid = new PaperRollGrid(lines);
  console.log('part 1 => ', grid.getAccessibleRolls().length);
  console.timeEnd('part1');
}

function part2(lines: string[]): void {
  console.time('part2');

  const grid = new PaperRollGrid(lines);
  let totalCount: number = 0;
  let currentCount: number = 0;
  while((currentCount = grid.removeAccessibleRolls()) > 0) {
    totalCount += currentCount;
  }

  console.log('part 2 => ', totalCount);
  console.timeEnd('part2');
}

const lines: string[] = readFile(import.meta.url).asArray();
part1(lines);
part2(lines);
