import { readFileLinesWithSections } from './common/readFileLines.js';

class FreshnessRule {
  private min: number;
  private max: number;
  private count: number = 0;

  constructor(
    min: number,
    max: number
  ) {
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

  getMin(): number {
    return this.min;
  }

  getMax(): number {
    return this.max;
  }

  hasOverlap(rule: FreshnessRule) {
    return !(this.max < rule.min || this.min > rule.max);
  }

  merge(rule: FreshnessRule): void {
    this.min = Math.min(this.min, rule.min);
    this.max = Math.max(this.max, rule.max);
    this.count = this.max - this.min + 1;
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
    freshnessRules.push(new FreshnessRule(parseInt(min), parseInt(max)));
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
  ranges.forEach((range) => {
    const [, min, max] = rangeRegex.exec(range) ?? [];
    freshnessRules.push(new FreshnessRule(parseInt(min), parseInt(max)));
  });

  const mergedRules = mergeRules(freshnessRules);
  mergedRules.forEach((rule) => {
    count += rule.getCount();
  });
  console.log('part 2 => ', count);
  console.timeEnd('part2');
}

function mergeRules(freshnessRules: FreshnessRule[]): FreshnessRule[] {
  if (freshnessRules.length === 0) return [];
  
  // Sort by min value
  freshnessRules.sort((a, b) => a.getMin() - b.getMin());
  
  const merged: FreshnessRule[] = [freshnessRules[0]];
  
  for (let i = 1; i < freshnessRules.length; i++) {
    const last = merged[merged.length - 1];
    const current = freshnessRules[i];
    
    if (last.hasOverlap(current)) {
      // Overlapping, merge into last
      last.merge(current);
    } else {
      // No overlap, add new range
      merged.push(current);
    }
  }
  
  return merged;
}

const sections: string[][] = readFileLinesWithSections(import.meta.url);
part1(sections);
part2(sections);
