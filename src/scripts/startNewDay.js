import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const day = process.argv[2];

if (!day) {
  console.error("Usage: node startNewDay.js <DayNumber>");
  process.exit(1);
}

const solutionsTemplateContent = readFileSync(
  "./src/templates/day.ts.template",
  "utf8"
);

try {
  const solutionsPath = join("./src/solutions", `day${day}.ts`);
  writeFileSync(solutionsPath, solutionsTemplateContent, { flag: "wx" });
  console.log(`✓ Created solution file: ${solutionsPath}`);

  const inputsPath = join("./src/inputs", `day${day}.txt`);
  writeFileSync(inputsPath, "", { flag: "wx" });
  console.log(`✓ Created input file: ${inputsPath}`);

  console.log(`🎄 Ready to solve Day ${day}! Run: make run DAY=${day}`);
} catch (error) {
  if (error.code === "EEXIST") {
    console.log("⚠️ File already exists, no changes were made.");
  } else {
    console.error("❌ An unexpected error occurred:", error);
  }
}
