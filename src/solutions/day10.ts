import { readFile } from './common/readFileLines.js';
// @ts-ignore - no types available for javascript-lp-solver
import solver from 'javascript-lp-solver';

class LightsPath {
  constructor(public buttonsPressed: number[][], public state: string[]) {}
}

class Machine {
  private diagram: string[];
  private buttons: number[][];
  private joltageRequirements: number[];
  public lightsToFlip: number[] = [];
  public buttonsToPress: number[] = [];

  constructor(diagram: string[], buttons: number[][], joltageRequirements: number[]) {
    this.diagram = diagram;
    this.buttons = buttons;
    this.joltageRequirements = joltageRequirements;
    this.lightsToFlip = this.diagram.filter((light, _) => light === '#').map((_, index) => index);
  }

  private pressButtonForLight(button: number[], currentState: string[]): string[] {
    button.forEach((index) => {
      currentState[index] = currentState[index] === '#' ? '.' : '#';
    })
    return currentState;
  }

  public pressButtonsForLights(): number[][] {
    const initialState: string[] = Array(this.diagram.length).fill('.');
    const paths: LightsPath[] = [new LightsPath([], initialState)];
    const visited = new Set<string>();
    visited.add(initialState.join(''));
    
    while (paths.length > 0) {
      const currentPath = paths.shift()!;
      
      if (currentPath.state.join('') === this.diagram.join('')) {
        return currentPath.buttonsPressed;
      }

      for (const button of this.buttons) {
        const newState = this.pressButtonForLight(button, [...currentPath.state]);
        const stateKey = newState.join('');

        if (!visited.has(stateKey)) {
          visited.add(stateKey);
          const newButtonsPressed = [...currentPath.buttonsPressed, button];
          paths.push(new LightsPath(newButtonsPressed, newState));
        }
      }
    }
    return [];
  }

  public pressButtonsForJoltage(): number {
    const numButtons = this.buttons.length;
    const numCounters = this.joltageRequirements.length;
    
    const lpModel: any = {
      optimize: 'total',
      opType: 'min',
      constraints: {},
      variables: {},
      ints: {}
    };
    
    // create variables for each button (how many times to press it)
    for (let b = 0; b < numButtons; b++) {
      lpModel.variables[`b${b}`] = { total: 1 };
      lpModel.ints[`b${b}`] = 1;
    }
    
    // create constraints for each counter
    for (let c = 0; c < numCounters; c++) {
      lpModel.constraints[`c${c}`] = { equal: this.joltageRequirements[c] };
      
      // add which buttons affect this counter
      for (let b = 0; b < numButtons; b++) {
        if (this.buttons[b].includes(c)) {
          if (!lpModel.variables[`b${b}`][`c${c}`]) {
            lpModel.variables[`b${b}`][`c${c}`] = 0;
          }
          lpModel.variables[`b${b}`][`c${c}`] = 1;
        }
      }
    }
    
    const solution = solver.Solve(lpModel);
    if (!solution.feasible) {
      return -1;
    }
    
    let total = 0;
    for (let b = 0; b < numButtons; b++) {
      const presses = solution[`b${b}`] || 0;
      total += presses;
    }
    
    return total;
  }
}

function part1(lines: string[]): void {
  console.time('part1');
  const lineRegex = /\[([\.\#]+)\] ((\(([\d,]+\) )+)+)\{([\d,]+)\}/;
  const buttonRegex = /\([\d,]+\)/g;
  let sumOfFewestPresses: number = 0;
  lines.forEach((line) => {
    const [, diagram, buttonStrings, , , joltageRequirements] = lineRegex.exec(line) ?? [];
    const buttons: number[][] = Array.from(buttonStrings.matchAll(buttonRegex)!).map((t) => t[0].substring(1, t[0]!.length - 1).split(',').map(Number));
    const machine: Machine = new Machine(diagram.split(''), buttons, joltageRequirements.split(',').map(Number));
    sumOfFewestPresses += machine.pressButtonsForLights().length;
  })
  console.log('part 1 => ', sumOfFewestPresses);
  console.timeEnd('part1');
}

function part2(lines: string[]): void {
  console.time('part2');
  const lineRegex = /\[([\.\#]+)\] ((\(([\d,]+\) )+)+)\{([\d,]+)\}/;
  const buttonRegex = /\([\d,]+\)/g;
  let sumOfFewestPresses: number = 0;
  lines.forEach((line) => {
    const [, diagram, buttonStrings, , , joltageRequirements] = lineRegex.exec(line) ?? [];
    const buttons: number[][] = Array.from(buttonStrings.matchAll(buttonRegex)!).map((t) => t[0].substring(1, t[0]!.length - 1).split(',').map(Number));
    const machine: Machine = new Machine(diagram.split(''), buttons, joltageRequirements.split(',').map(Number));
    sumOfFewestPresses += machine.pressButtonsForJoltage();
  })
  console.log('part 2 => ', sumOfFewestPresses);
  console.timeEnd('part2');
}

const lines: string[] = readFile(import.meta.url).asArray();
part1(lines);
part2(lines);
