import {readFile } from './common/readFileLines.js';

function part1(lines: string[]): void {
  console.time('part1');
  // get all the operators
  const operators: string[] = lines[lines.length - 1].trim().split(/\s+/);
  // get all the first numbers
  let currentResults: number[] = lines[0].trim().split(/\s+/).map((num) => parseInt(num));
  // iterate over the remaining numbers and perform the related operations
  for (let i: number = 1; i < lines.length - 1; i++) {
    currentResults = lines[i].trim().split(/\s+/).map((num, index) => {
      return operators[index] === '+' ? currentResults[index] + parseInt(num) : currentResults[index] * parseInt(num);
    });
  }
  // add 'em up
  console.log('part 1 => ', currentResults.reduce((accumulator, currentValue) => accumulator + currentValue, 0));
  console.timeEnd('part1');
}

class Operation {
  public spacesCount: number;
  private numStrings: string[] = [];
  private operator: string;
  private numbers: number[] = [];

  constructor(operator: string, spacesCount: number) {
    this.operator = operator;
    this.spacesCount = spacesCount;
  }

  addToNumStrings(numString: string): void {
    this.numStrings.push(numString);
  }

  getNumStrings(): string[] {
    return this.numStrings;
  }

  getOperator(): string {
    return this.operator;
  }

  setNumbers(numbers: number[]): void {
    this.numbers = numbers;
  }

  calculate(): number {
    return this.operator === '+' ? this.numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0) : this.numbers.reduce((accumulator, currentValue) => accumulator * currentValue, 1);
  }
}

// TODO: I hate this... revisit this later
function part2(lines: string[]): void {
  console.time('part2');

  const operatorLineChars: string[] = lines[lines.length - 1].split('');

  // get all the operators
  let operations: Operation[] = [];
  let currentOperator: string =  operatorLineChars[0];
  let currentSpacesCount: number = 0;
  for (let i: number = 1; i < operatorLineChars.length; i++) {
    const char: string = operatorLineChars[i];
    if (char !== ' ') {
        operations.push(new Operation(currentOperator, currentSpacesCount));
        // reset operator and spaces count
        currentOperator = char;
        currentSpacesCount = 0;
      } else {
        currentSpacesCount++;
      }
  }
  operations.push(new Operation(currentOperator, currentSpacesCount + 1));

  let currentPosition = 0;
  for (let i: number = 0; i < lines.length - 1; i++) {
    for (let j: number = 0; j < operations.length; j++) {
      const currentOperation: Operation = operations[j];
      const spacesCount: number = currentOperation.spacesCount;
      currentOperation.addToNumStrings(lines[i].slice(currentPosition, currentPosition+spacesCount));
      currentPosition += spacesCount + 1;
    }
    currentPosition = 0;
  }

  let total: number = 0;
  for (let j: number = 0; j < operations.length; j++) {
    // determine the cephalopod numbers
    let cephalopodNumbers: number[] = [];
    operations[j].getNumStrings().forEach((num) => {
      num.split('').forEach((digitString, digitIndex) => {
        if (digitString !== ' ') {
          const digit: number = parseInt(digitString);
          if (cephalopodNumbers[digitIndex]) {
            cephalopodNumbers[digitIndex] = cephalopodNumbers[digitIndex] * 10 + digit;
          } else {
            cephalopodNumbers[digitIndex] = digit;
          }
        }
      });
    });
    // execute the operations and add 'em up
    operations[j].setNumbers(cephalopodNumbers);
    total += operations[j].calculate();
  }

  console.log('part 2 => ', total);
  console.timeEnd('part2');
}

const lines: string[] = readFile(import.meta.url).asArray({trim: false});
part1(lines);
part2(lines);
