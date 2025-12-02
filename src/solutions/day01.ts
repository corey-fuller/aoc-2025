import readFileLines from './common/readFileLines.js';

class DialAction {
  private count: number;
  public zeroClicksCount: number = 0;

  constructor(direction: string, count: number) {
    this.count = count * (direction === 'L' ? -1 : 1);
  }

  turn(currentPos: number): number {
    let newPos: number = currentPos + this.count;
    newPos = newPos % 100;
    newPos = newPos >= 0 ? newPos : 100 + newPos;
    return newPos;
  };

  turnCountingZeros(currentPos: number): number {
    let totalMove: number = currentPos + this.count;
    
    if (this.count > 0) {
      this.zeroClicksCount = Math.floor(totalMove / 100);
    } else if (this.count < 0) {
      if (totalMove < 0) {
        this.zeroClicksCount = Math.floor(Math.abs(totalMove) / 100) + (currentPos !== 0 ? 1 : 0);
      } else if (totalMove === 0) {
        this.zeroClicksCount++;
      }
    }

    // console.log('current position: ' + currentPos + '; count: ' + this.count + '; newPos: ' + newPos + '; zero clicks: ' + this.zeroClicksCount);

    return this.turn(currentPos);;
  }
}

function part1(lines: string[]): void {
  let pos: number = 50;
  let zeroCount: number = 0;

  lines.forEach((line) => {
    pos = new DialAction(line.slice(0, 1), parseInt(line.slice(1))).turn(pos);
    if (pos === 0) {
      zeroCount++;
    }
  });

  console.log('part 1 => zero results count: ', zeroCount);
}

function part2(lines: string[]): void {
  let pos: number = 50;
  let zeroCount: number = 0;

  lines.forEach((line) => {
    let action: DialAction = new DialAction(line.slice(0, 1), parseInt(line.slice(1)));
    pos = action.turnCountingZeros(pos);
    zeroCount += action.zeroClicksCount;
  });

  console.log('part 2 => zero clicks count: ', zeroCount);
}

const lines: string[] = readFileLines(import.meta.url);
part1(lines);
part2(lines);
