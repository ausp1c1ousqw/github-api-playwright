import { test as base, APIRequestContext } from "@playwright/test";
import { getAuthenticatedToken } from "../../src/auth/getAuthenticatedToken.js";
import { logger } from "../../src/logging/logger.js";

import { IssueClient } from "../../src/clients/IssueClient.js";
import { CommentClient } from "../../src/clients/CommentClient.js";
import { RepoClient } from "../../src/clients/RepoClient.js";
import { ContentClient } from "../../src/clients/ContentClient.js";
import { PullRequestClient } from "../../src/clients/PullRequestClient.js";
import { ReviewClient } from "../../src/clients/ReviewClient.js";
import { UserClient } from "../../src/clients/UserClient.js";
import { SearchClient } from "../../src/clients/SearchClient.js";
import { ActionsClient } from "../../src/clients/ActionsClient.js";

interface ApiFixtures {
  githubRequest: APIRequestContext;
  issueClient: IssueClient;
  commentClient: CommentClient;
  repoClient: RepoClient;
  contentClient: ContentClient;
  pullRequestClient: PullRequestClient;
  reviewClient: ReviewClient;
  userClient: UserClient;
  searchClient: SearchClient;
  actionsClient: ActionsClient;
  testLogger: void;
}

function clientFixture<T>(ClientClass: new (request: APIRequestContext) => T) {
  return async (
    { githubRequest }: { githubRequest: APIRequestContext },
    use: (client: T) => Promise<void>,
  ) => {
    await use(new ClientClass(githubRequest));
  };
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

  issueClient: clientFixture(IssueClient),
  commentClient: clientFixture(CommentClient),
  repoClient: clientFixture(RepoClient),
  contentClient: clientFixture(ContentClient),
  pullRequestClient: clientFixture(PullRequestClient),
  reviewClient: clientFixture(ReviewClient),
  userClient: clientFixture(UserClient),
  searchClient: clientFixture(SearchClient),
  actionsClient: clientFixture(ActionsClient),

  testLogger: [
    async ({}, use, testInfo) => {
      logger.info(`▶ ${testInfo.title}`);

      await use();

      if (testInfo.status !== "passed") {
        const lastError = testInfo.errors[testInfo.errors.length - 1];
        if (lastError?.message) {
          logger.error(`  ${lastError.message}`);
        }
      }

      logger.info(
        `■ ${testInfo.title} (${testInfo.status}, ${testInfo.duration}ms)`,
      );
    },
    { auto: true },
  ],
});

export { expect } from "@playwright/test";
