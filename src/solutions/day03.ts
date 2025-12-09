import { readFile } from './common/readFileLines.js';

class BatteryBank {
  private batteries: [number, number][];

  constructor(batteries: number[]) {
    this.batteries = batteries.map((joltage, position) => [position, joltage]);
  }

  findHighestJoltageBatteryBetween(start: number, end: number): [number, number] {
    return this.batteries.slice(start, end).reduce((max: [number, number], current: [number, number]) => current[1] > max[1] ? current : max);
  }

  findHighestJoltageBatteryCombo(size: number): number {
    let batteryJoltageCombo: number = 0;
    let currentBankPosition: number = 0;
    for (let i: number = size-1; i >=0; i--) {
      const battery = this.findHighestJoltageBatteryBetween(currentBankPosition, this.batteries.length - i);
      currentBankPosition = battery[0] + 1;
      batteryJoltageCombo = batteryJoltageCombo * 10 + battery[1];
    }
    return batteryJoltageCombo;
  }
}

function solve(lines: string[], size: number): number {
  let sumHighestJoltages: number = 0;
  lines.forEach((line) => {
    const bank: BatteryBank = new BatteryBank([...line].map(s => parseInt(s, 10)));
    const highestJoltageCombo = bank.findHighestJoltageBatteryCombo(size);
    sumHighestJoltages+= highestJoltageCombo;
  });
  return sumHighestJoltages;
}

function part1(lines: string[]): void {
  console.time('part1');
  console.log('part 1 => sum of all the highest joltage duos: ', solve(lines, 2));
  console.timeEnd('part1');
}

function part2(lines: string[]): void {
  console.time('part2');
  console.log('part 2 => sum of all the highest joltage combos: ', solve(lines, 12));
  console.timeEnd('part2');
}

const lines: string[] = readFile(import.meta.url).asArray();
part1(lines);
part2(lines);
