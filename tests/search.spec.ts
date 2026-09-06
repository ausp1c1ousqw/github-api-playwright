import { test, expect } from "./fixtures/apiFixtures.js";

test.describe("Search", () => {
  test("searches repositories and finds the test repo", async ({
    searchClient,
    repoClient,
  }) => {
    const repo = await (await repoClient.getRepo()).json();

    const response = await searchClient.searchRepositories(
      `repo:${repo.full_name}`,
    );
    const result = await response.json();

    expect(response.status()).toBe(200);
    expect(result.total_count).toBeGreaterThanOrEqual(1);
    expect(
      result.items.some(
        (item: { full_name: string }) => item.full_name === repo.full_name,
      ),
    ).toBe(true);
  });

  test("searches issues scoped to the test repo", async ({
    searchClient,
    issueClient,
    repoClient,
  }) => {
    const repo = await (await repoClient.getRepo()).json();
    const createResponse = await issueClient.createIssue(
      `[automated-test] searchable ${Date.now()}`,
    );
    const created = await createResponse.json();

    const response = await searchClient.searchIssues(
      `repo:${repo.full_name} is:issue is:open`,
    );
    const result = await response.json();

    expect(response.status()).toBe(200);
    expect(Array.isArray(result.items)).toBe(true);

    await issueClient.updateIssue(created.number, { state: "closed" });
  });

  test("searches users and finds the repo owner", async ({
    searchClient,
    repoClient,
  }) => {
    const repo = await (await repoClient.getRepo()).json();

    const response = await searchClient.searchUsers(`user:${repo.owner.login}`);
    const result = await response.json();

    expect(response.status()).toBe(200);
    expect(
      result.items.some(
        (item: { login: string }) => item.login === repo.owner.login,
      ),
    ).toBe(true);
  });
});
