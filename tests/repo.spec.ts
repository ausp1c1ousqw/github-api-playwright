import { test, expect } from "./fixtures/apiFixtures.js";

test.describe("Repo metadata and branches", () => {
  test("gets the repo and returns correct fields", async ({ repoClient }) => {
    const response = await repoClient.getRepo();
    const result = await response.json();

    expect(response.status()).toBe(200);
    expect(result.name).toBeTruthy();
    expect(result.full_name).toContain(result.name);
    expect(typeof result.private).toBe("boolean");
  });

  test("updates the repo description, then restores it", async ({
    repoClient,
  }) => {
    const before = await (await repoClient.getRepo()).json();
    const originalDescription: string | null = before.description;

    const newDescription = `[automated-test] ${Date.now()}`;
    const updateResponse = await repoClient.updateRepo({
      description: newDescription,
    });
    const updated = await updateResponse.json();

    expect(updateResponse.status()).toBe(200);
    expect(updated.description).toBe(newDescription);

    // restore whatever the description was before this test ran
    await repoClient.updateRepo({ description: originalDescription ?? "" });
  });

  test("lists branches and includes the default branch", async ({
    repoClient,
  }) => {
    const repo = await (await repoClient.getRepo()).json();

    const response = await repoClient.listBranches();
    const result = await response.json();

    expect(response.status()).toBe(200);
    expect(Array.isArray(result)).toBe(true);
    expect(
      result.some(
        (branch: { name: string }) => branch.name === repo.default_branch,
      ),
    ).toBe(true);
  });

  test("gets a single branch by name", async ({ repoClient }) => {
    const repo = await (await repoClient.getRepo()).json();

    const response = await repoClient.getBranch(repo.default_branch);
    const result = await response.json();

    expect(response.status()).toBe(200);
    expect(result.name).toBe(repo.default_branch);
  });

  test("returns 404 when getting a nonexistent branch", async ({
    repoClient,
  }) => {
    const response = await repoClient.getBranch(
      "this-branch-does-not-exist-12345",
    );

    expect(response.status()).toBe(404);
  });
});
