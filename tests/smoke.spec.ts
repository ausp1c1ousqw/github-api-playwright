import { test, expect } from "./fixtures/apiFixtures.js";
import { getAuthenticatedToken } from "../src/auth/getAuthenticatedToken.js";

test.describe("GET tequests", () => {
  test("Return 200 after request with correct token", async ({
    githubRequest,
  }) => {
    const owner = "ausp1c1ousqw";
    const repo = "private-for-tests";

    const token = await getAuthenticatedToken();
    const response = await githubRequest.get(`/repos/${owner}/${repo}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    expect(response.status()).toBe(200);
    expect(result.name).toBe(repo);
    expect(result.full_name).toBe(`${owner}/${repo}`);
    expect(result.private).toBe(true);
  });

  test("Return 401 after rquest with incorrect token", async ({ request }) => {
    const owner = "ausp1c1ousqw";
    const repo = "private-for-tests";
    const expiredToken =
      "Bearer ghs_4633201_eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRobmQiLCJjdHgiOiJ1b04wZTRkVlpYeThmdThySUlpQ04yM";
    const response = await request.get(`/repos/${owner}/${repo}`, {
      headers: { Authorization: `${expiredToken}` },
    });
    const result = await response.json();
    expect(response.status()).toBe(401);
  });

  test("Return 404 after rquest without token", async ({ request }) => {
    const owner = "ausp1c1ousqw";
    const repo = "private-for-tests";

    const response = await request.get(`/repos/${owner}/${repo}`);
    const result = await response.json();
    expect(response.status()).toBe(404);
  });
});
