import { test, expect } from "./fixtures/apiFixtures.js";

test.describe("GET requests", () => {
  const owner = "ausp1c1ousqw";
  const repo = "private-for-tests";

  test("Return 200 with valid token", async ({ githubRequest }) => {
    const response = await githubRequest.get(`/repos/${owner}/${repo}`);
    const result = await response.json();
    expect(response.status()).toBe(200);
    expect(result.name).toBe(repo);
    expect(result.full_name).toBe(`${owner}/${repo}`);
    expect(result.private).toBe(true);
  });

  test("Return 401 with invalid token", async ({ githubRequest }) => {
    const response = await githubRequest.get(`/repos/${owner}/${repo}`, {
      headers: { Authorization: "Bearer invalid-token-for-negative-test-case" },
    });
    expect(response.status()).toBe(401);
  });

  test("Return 404 with no token", async ({ githubRequest }) => {
    const response = await githubRequest.get(`/repos/${owner}/${repo}`, {
      headers: { Authorization: "" },
    });
    expect(response.status()).toBe(404);
  });
});
