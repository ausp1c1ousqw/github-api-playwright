import { defineConfig } from "@playwright/test";
import * as dotenv from "dotenv";

dotenv.config({quiet: true});

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: process.env.BASE_URL,
    
    extraHTTPHeaders: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  },
});
