import { test as base, APIRequestContext } from "@playwright/test";
import { getAuthenticatedToken } from "../../src/auth/getAuthenticatedToken.js";
import { IssueClient } from "../../src/clients/IssueClient.js";
import { CommentClient } from "../../src/clients/CommentClient.js";
import { logger } from "../../src/logging/logger.js";

interface ApiFixtures {
  githubRequest: APIRequestContext;
  issueClient: IssueClient;
  commentClient: CommentClient;
  testLogger: void;
}

export const test = base.extend<ApiFixtures>({
  githubRequest: async ({ playwright }, use) => {
    const token = await getAuthenticatedToken();
    const context = await playwright.request.newContext({
      baseURL: process.env.BASE_URL,
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    });

    await use(context);
    await context.dispose();
  },

  issueClient: async ({ githubRequest }, use) => {
    await use(new IssueClient(githubRequest));
  },

  commentClient: async ({ githubRequest }, use) => {
    await use(new CommentClient(githubRequest));
  },

  // Runs for every test automatically (auto: true) — logs a start line
  // before the test body runs, and a finish line (with pass/fail status
  // and duration) after it completes.
  testLogger: [
    async ({}, use, testInfo) => {
      logger.info(`▶ ${testInfo.title}`);

      await use();

      logger.info(
        `■ ${testInfo.title} (${testInfo.status}, ${testInfo.duration}ms)`,
      );
    },
    { auto: true },
  ],
});

export { expect } from "@playwright/test";
