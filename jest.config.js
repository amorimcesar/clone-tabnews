const dotenv = require("dotenv");
const nextJest = require("next/jest");

dotenv.config({
  path: ".env.development",
});

const createJestConfing = nextJest({
  dir: ".",
});
const jestConfig = createJestConfing({
  moduleDirectories: ["node_modules", "<rootDir>"],
  testTimeout: 60000,
});

module.exports = jestConfig;
