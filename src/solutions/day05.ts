import { readFileLinesWithSections } from './common/readFileLines.js';

class FreshnessRule {
  private id: number;
  private min: number;
  private max: number;
  private count: number = 0;

  constructor(
    id: number,
    min: number,
    max: number
  ) {
    this.id = id;
    this.min = min;
    this.max = max;
    this.count = this.max - this.min + 1;
  }

  getCount(): number {
    return this.count;
  }

  containsIngredient(ingredient: number) {
    return ingredient >= this.min && ingredient <= this.max;
  }

  mergeRules(freshnessRules: FreshnessRule[]): FreshnessRule[] {
    let merged: boolean = false;
    freshnessRules.forEach((rule, index) => {
      if (this.hasOverlap(rule)) {
        this.min = Math.min(this.min, rule.min);
        this.max = Math.max(this.max, rule.max);
        this.count = this.max - this.min + 1;
        freshnessRules.splice(index, 1);
        merged = true;
      }
    });
    return merged ? freshnessRules : [];
  }

  hasOverlap(rule: FreshnessRule) {
    return this.id !== rule.id && !(this.max < rule.min || this.min > rule.max);
  }
}

function part1(sections: string[][]): void {
  console.time('part1');
  const ranges = sections[0];
  const ingredients = sections[1];
  
  let freshnessRules: FreshnessRule[] = [];
  const rangeRegex = /(\d+)-(\d+)/;
  ranges.forEach((range, index) => {
    const [, min, max] = rangeRegex.exec(range) ?? [];
    freshnessRules.push(new FreshnessRule(index, parseInt(min), parseInt(max)));
  });

  let freshIngredientsFound: number = 0;
  ingredients.forEach((ingredient) => {
    freshnessRules.some((rule): boolean => {
      if (rule.containsIngredient(parseInt(ingredient))) {
        freshIngredientsFound++;
        return true;
      }
      return false;
    });
  });

  console.log('part 1 => ', freshIngredientsFound);
  console.timeEnd('part1');
}

function part2(sections: string[][]): void {
  console.time('part2');
  const ranges = sections[0];
  
  let count: number = 0;
  let freshnessRules: FreshnessRule[] = [];
  const rangeRegex = /(\d+)-(\d+)/;
  ranges.forEach((range, index) => {
    const [, min, max] = rangeRegex.exec(range) ?? [];
    freshnessRules.push(new FreshnessRule(index, parseInt(min), parseInt(max)));
  });

  let mergedRules = mergeRules(freshnessRules);
  while ((mergedRules = mergeRules(mergedRules)).length > 0) {
    freshnessRules = mergedRules;
  }
  freshnessRules.forEach((rule) => {
    count += rule.getCount();
  });
  console.log('part 2 => ', count);
  console.timeEnd('part2');
}

function mergeRules(freshnessRules: FreshnessRule[]): FreshnessRule[] {
  let merged: boolean = false;
  freshnessRules.forEach((rule1) => {
    const mergeResult = rule1.mergeRules(freshnessRules);
    if (mergeResult.length > 0) {
      freshnessRules = mergeResult;
      merged = true;
    }
  });
  return merged ? freshnessRules : [];
}

const sections: string[][] = readFileLinesWithSections(import.meta.url);
part1(sections);
part2(sections);
