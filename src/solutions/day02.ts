import readFileLines from './common/readFileLines.js';

// checks only for twice-repeated pattern
function isProductIDValidV1(productID: number): boolean {
  const productIDString: string = productID.toString();

  if (productIDString.length % 2 !== 0) {
    return true;
  }

  const firstHalf: string = productIDString.substring(0, productIDString.length / 2);
  const secondHalf: string = productIDString.substring(productIDString.length / 2);

  return firstHalf !== secondHalf;
}

// checks for any number of repeated patterns
function isProductIDValidV2(productID: number): boolean {
  const productIDString: string = productID.toString();
  
  for (let i = 2; i <= productIDString.length; i++) {
    if (productIDString.length % i !== 0) {
      continue;
    }

    let allSectionsMatch: boolean = true;
    const patternLength: number = productIDString.length / i;
    for (let j = 1; j < i; j++) {
      const currentSection = productIDString.substring((j - 1) * patternLength, j * patternLength);
      const nextSection = productIDString.substring(j * patternLength, (j + 1) * patternLength);
      if (currentSection !== nextSection) {
        allSectionsMatch = false;
        break;
      }
    }

    if (allSectionsMatch) {
      return false;
    }
  }

  return true;
}

class ProductIDRange {
  private start: number;
  private end: number;
  public invalidProductIDs: number[] = [];

  constructor(start: number, end: number) {
    this.start = start;
    this.end = end;
  }

  findInvalidProductIDs(isProductIDValid: (productID: number) => boolean) {
    for (let i = this.start; i <= this.end; i++) {
      if (!isProductIDValid(i)) {
        this.invalidProductIDs.push(i);
      }
    }
  };
}

function part1(lines: string[]): void {
  let allInvalidIDs: number[] = [];
  lines.forEach((line) => {
    const lineParts = line.split('-');
    const productIDRange: ProductIDRange = new ProductIDRange(Number(lineParts[0]), Number(lineParts[1]));
    productIDRange.findInvalidProductIDs(isProductIDValidV1);
    // console.log('found invalid product IDs: ', productIDRange.invalidProductIDs);
    allInvalidIDs.push(...productIDRange.invalidProductIDs);
  });

  const sum: number = allInvalidIDs.reduce((sum, current) => sum + current, 0);
  console.log('part 1 => sum of all invalid IDs: ', sum);
}

function part2(lines: string[]): void {
  let allInvalidIDs: number[] = [];
  lines.forEach((line) => {
    const lineParts = line.split('-');
    const productIDRange: ProductIDRange = new ProductIDRange(Number(lineParts[0]), Number(lineParts[1]));
    productIDRange.findInvalidProductIDs(isProductIDValidV2);
    // console.log('found invalid product IDs: ', productIDRange.invalidProductIDs);
    allInvalidIDs.push(...productIDRange.invalidProductIDs);
  });

  const sum: number = allInvalidIDs.reduce((sum, current) => sum + current, 0);
  console.log('part 2 => sum of all invalid IDs: ', sum);
}

const lines: string[] = readFileLines(import.meta.url, ',');
part1(lines);
part2(lines);
