import { test, expect } from "@playwright/test";
test.describe("GET tequests", () => {
  test("API is reachable", async ({ request }) => {
    const owner = "ausp1c1ousqw";
    const repo = "private-for-tests";
    const token =
      "Bearer ghs_4633201_eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRobmQiLCJjdHgiOiJ1b04wZTRkVlpYeThmdThySUlpQ04yMVFyLUxOdXVDd3JOb1RmMkYxcFMzS2NRcEE0eWRuc3NZcElRIiwiZXhwIjoxNzg3MDQ2OTQ1LCJpYXQiOjE3ODcwNDMzNDUsImlzcyI6ImdpdGh1YiIsImp0aSI6IjFmMDVjODYzLWJkOGItNDYxOC04MThjLTE2Njg2MmVkODI1OSIsInZlciI6M30.Dng1Lh6zeUn_lhdfe1Ov1Q5iusO2jymOY8RXIZIPxWem8gNUcLFXz4OkJ_1kgc0jKRVk5FO46pQqQDYogdbr5Q";
    const response = await request.get(`/repos/${owner}/${repo}`, {
      headers: { Authorization: `${token}` },
    });
    const result = await response.json();
    console.log(result);
    expect(response.status()).toBe(200);
    expect(result.name).toBe(repo);
    expect(result.full_name).toBe(`${owner}/${repo}`);
    expect(result.private).toBe(true);
  });

  test("Expired token", async ({ request }) => {
    const owner = "ausp1c1ousqw";
    const repo = "private-for-tests";
    const expiredToken =
      "Bearer ghs_4633201_eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRobmQiLCJjdHgiOiJ1b04wZTRkVlpYeThmdThySUlpQ04yM";
    const response = await request.get(`/repos/${owner}/${repo}`, {
      headers: { Authorization: `${expiredToken}` },
    });
    const result = await response.json();
    console.log(result);
    expect(response.status()).toBe(401);
  });
});
