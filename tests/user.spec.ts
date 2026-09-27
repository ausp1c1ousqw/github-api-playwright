import { test, expect } from "./fixtures/apiFixtures.js";

test.describe("Users", () => {
  test("returns 403 for the authenticated user endpoint with an App installation token", async ({
    userClient,
  }) => {
    // GitHub App installation tokens aren't tied to a human user, so
    // GET /user isn't valid the way it would be with a PAT. This test
    // documents that behavior rather than assuming a PAT-style 200.
    const response = await userClient.getAuthenticatedUser();

    expect(response.status()).toBe(403);
  });

  test("gets a public user by username", async ({ userClient, repoClient }) => {
    const repo = await (await repoClient.getRepo()).json();
    const ownerUsername = repo.owner.login;

    const response = await userClient.getUser(ownerUsername);
    const result = await response.json();

    expect(response.status()).toBe(200);
    expect(result.login).toBe(ownerUsername);
  });

  test("returns 404 for a nonexistent username", async ({ userClient }) => {
    const response = await userClient.getUser(
      "this-username-should-not-exist-anywhere-12345",
    );

    expect(response.status()).toBe(404);
  });
});
