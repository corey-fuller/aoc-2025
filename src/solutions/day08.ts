import { readFile } from './common/readFileLines.js';

class Circuit {
  private boxSet: Set<string>;
  
  constructor(public boxes: number[][]) {
    this.boxSet = new Set(boxes.map(b => `${b[0]},${b[1]},${b[2]}`));
  }

  public addBox(box: number[]): void {
    const key = `${box[0]},${box[1]},${box[2]}`;
    if (!this.boxSet.has(key)) {
      this.boxes.push(box);
      this.boxSet.add(key);
    }
  }

  public isBoxInCircuit(box: number[]): boolean {
    return this.boxSet.has(`${box[0]},${box[1]},${box[2]}`);
  }

  public getSize(): number {
    return this.boxes.length;
  }

  public merge(circuit: Circuit): void {
    circuit.boxes.forEach((box) => {
      this.addBox(box);
    });
  }
}

class JunctionBoxPair {
  private distance: number = 0;
  
  constructor(public box1: number[], public box2: number[]) {
    this.box1 = box1;
    this.box2 = box2;

    this.distance = this.calculateDistance();
  }

  private calculateDistance(): number {
    return Math.sqrt((this.box1[0] - this.box2[0])**2 + (this.box1[1] - this.box2[1])**2 + (this.box1[2] - this.box2[2])**2);
  }

  public getDistance(): number {
    return this.distance;
  }
}

function compareAllJunctionBoxes(lines: string[]): JunctionBoxPair[] {
  // get the distances between each junction box
  // TODO: optimize by not adding duplicate pairs
  const boxes = lines.map(line => line.split(',').map(Number));
  let jboxPairs : JunctionBoxPair[] = [];
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      jboxPairs.push(new JunctionBoxPair(boxes[i], boxes[j]));
    }
  }
  return jboxPairs.sort((a, b) => a.getDistance() - b.getDistance());
}

function connectJBoxes(circuits: Circuit[], jBoxPair: JunctionBoxPair): boolean {
  let newCircuitNeeded: boolean = true;
  let circuitsToBeMerged: number[] = [];
  for (let i = 0; i < circuits.length; i++) {
    const circuit: Circuit = circuits[i];
    if (circuit.isBoxInCircuit(jBoxPair.box1) && circuit.isBoxInCircuit(jBoxPair.box2)) {
      return false;
    }
    if (circuit.isBoxInCircuit(jBoxPair.box1)) {
      circuit.addBox(jBoxPair.box2);
      circuitsToBeMerged.push(i);
      newCircuitNeeded = false;
      continue;
    }
    if (circuit.isBoxInCircuit(jBoxPair.box2)) {
      circuit.addBox(jBoxPair.box1);
      circuitsToBeMerged.push(i);
      newCircuitNeeded = false;
      continue;
    }
  }

  if (newCircuitNeeded) {
    circuits.push(new Circuit([jBoxPair.box1, jBoxPair.box2]));
    return false;
  }

  if (circuitsToBeMerged.length > 1) {
    for (let i = circuitsToBeMerged.length - 1; i > 0; i--) {
      circuits[circuitsToBeMerged[0]].merge(circuits[circuitsToBeMerged[i]]);
      circuits.splice(circuitsToBeMerged[i], 1);
    }
  }

  return circuits.length === 1;
}

function part1(lines: string[]): void {
  console.time('part1');
  const desiredConnections: number = 1000;
  let circuitCount: number = 0;
  let circuits: Circuit[] = [];
  let sortedJBoxPairs : JunctionBoxPair[] = compareAllJunctionBoxes(lines);
  for (let i = 0; i < sortedJBoxPairs.length; i++) {
    const jBoxPair: JunctionBoxPair = sortedJBoxPairs[i];
    if (circuitCount === desiredConnections) {
      break;
    }
    circuitCount++;
    connectJBoxes(circuits, jBoxPair);
  }
  circuits.sort((a, b) => b.getSize() - a.getSize());
  console.log('part 1 => ', circuits[0].getSize() * circuits[1].getSize() * circuits[2].getSize());
  console.timeEnd('part1');
}

function part2(lines: string[]): void {
  console.time('part2');
  let sortedJBoxPairs : JunctionBoxPair[] = compareAllJunctionBoxes(lines);
  let finalJunctionBoxPair: JunctionBoxPair | undefined = undefined;
  let circuits: Circuit[] = [];
  let circuitComplete: boolean = false;
  for (let i = 0; i < sortedJBoxPairs.length; i++) {
    const jBoxPair: JunctionBoxPair = sortedJBoxPairs[i];
    circuitComplete = connectJBoxes(circuits, jBoxPair);
    if (circuitComplete) {
      finalJunctionBoxPair = jBoxPair;
      break;
    }
  }
  console.log('part 2 => ', finalJunctionBoxPair!.box1[0] * finalJunctionBoxPair!.box2[0]);
  console.timeEnd('part2');
}

const lines: string[] = readFile(import.meta.url).asArray();
part1(lines);
part2(lines);
