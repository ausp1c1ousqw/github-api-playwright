import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  forbidOnly: !!process.env.CI,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: process.env.CI
    ? [
        ["list"],
        ["html", { open: "never" }],
        ["junit", { outputFile: "results/junit.xml" }],
      ]
    : [["list"], ["html", { open: "never" }]],
  outputDir: "./test-results",
});
