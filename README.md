# Advent of Code 2025

This repository contains my solutions for [Advent of Code 2025](https://adventofcode.com/2025). Let's
celebrate the Advent of Christ with some code!

## About

Advent of Code presents daily coding challenges at 12:00AM EST. This year, there are only 12 days of
puzzles (Dec 1 - Dec 12). This year, I am using TypeScript to sharpen my skills.

## Getting Started

### Prerequisites

Ensure that you have installed the latest versions of [Node.js](https://nodejs.org/en/download) and
npm.

This is a [TypeScript](https://www.typescriptlang.org) project, so you will need to have TypeScript
installed as well. You can install it globally with `npm install -g typescript`.

### Setup

To get started run `make install` to install the project dependencies.

### Structure

I generate new files under `src/solutions` called `dayXX.ts` for each day, where `XX` is the day
number. Puzzle inputs are stored in the `src/inputs` directory.

## Solving the Daily Challenges

### Starting a New Day

To start a new day, run `Make nd DAY=XX`, where `XX` is the day number. This will generate a new
solution file with the appropriate name and add an empty input text file for the day.

Some days, the challenges will require additional setup. For example, sometimes a second input will
be provided for part 2 of the problem. In this case, just duplicate the input file and append it with
`-2`. Then, duplicate the solution file and append it with `-2`, ensuring the name matches the input
file name.

### Running the Solutions

To run a solution, use the `Make run DAY=XX` command, where `XX` is the day number. This will
transpile the TypeScript code and execute the compiled JavaScript code. Transpiled JavaScript files
will be stored in the `src/transpiled` directory, and will be ignored by git.

The outputs of the solution will be available in the terminal.
