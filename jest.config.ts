import type { Config } from "jest";
import nextJest from "next/jest.js";

// Use next/jest so tests share the app's SWC transform, tsconfig paths (@/…),
// CSS/asset mocking, and env handling — lets us test React components, not just
// pure logic.
const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

export default createJestConfig(config);
