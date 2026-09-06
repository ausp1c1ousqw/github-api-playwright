import { test, expect } from "./fixtures/apiFixtures.js";
/**
 * LIMITATION: createPullRequest needs two real branches with an actual
 * diff between them — `head` must exist and differ from `base`, or
 * GitHub returns 422. That requires creating a branch via the Git Data
 * API (a ref/branch client we haven't built yet), so create/update/merge
 * aren't covered here. What follows is what's honestly testable without
 * that infrastructure: read-only endpoints and one clean negative case.
 *
 * Follow-up: once a branch/ref client exists, add create → list files →
 * list commits → merge as a full lifecycle test here.
 */
test.describe("Pull Requests (read-only, pending branch infra)", () => {
  test("lists pull requests and returns 200", async ({ pullRequestClient }) => {
    const response = await pullRequestClient.listPullRequests({ state: "all" });
    const result = await response.json();

    expect(response.status()).toBe(200);
    expect(Array.isArray(result)).toBe(true);
  });

  test("returns 404 when getting a nonexistent pull request", async ({
    pullRequestClient,
  }) => {
    const response = await pullRequestClient.getPullRequest(999999999);

    expect(response.status()).toBe(404);
  });

  test("returns 422 when creating a PR with a head branch that doesn't exist", async ({
    pullRequestClient,
    repoClient,
  }) => {
    const repo = await (await repoClient.getRepo()).json();

    const response = await pullRequestClient.createPullRequest({
      title: "[automated-test] should fail",
      head: "this-branch-does-not-exist-12345",
      base: repo.default_branch,
    });

    expect(response.status()).toBe(422);
  });
});
