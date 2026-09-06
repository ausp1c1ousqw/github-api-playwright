import { test, expect } from "./fixtures/apiFixtures.js";

/**
 * LIMITATION: reviews only make sense against a real, open pull request
 * — and creating one needs the same branch infrastructure PullRequests
 * is waiting on (see pullRequests.spec.ts). Nothing here creates or
 * submits a review; it's just the one negative case that doesn't need
 * a real PR to be meaningful.
 *
 * Follow-up: once branch infra exists and a PR can be created in test
 * setup, add createReview (APPROVE/REQUEST_CHANGES/COMMENT), listReviews,
 * getReview, and dismissReview as a proper lifecycle here.
 */
test.describe("Pull Request Reviews (pending branch/PR infra)", () => {
  test("returns 404 when listing reviews for a nonexistent pull request", async ({
    reviewClient,
  }) => {
    const response = await reviewClient.listReviews(999999999);

    expect(response.status()).toBe(404);
  });
});
