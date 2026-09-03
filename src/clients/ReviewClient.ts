import { APIRequestContext, APIResponse } from "@playwright/test";
import { BaseRepoClient } from "./BaseRepoClient.js";

export class ReviewClient extends BaseRepoClient {
  constructor(request: APIRequestContext) {
    super(request, "/pulls");
  }

  async listReviews(pullNumber: number): Promise<APIResponse> {
    return this.get(
      `/${pullNumber}/reviews`,
      undefined,
      `Listing reviews for pull request #${pullNumber}`,
    );
  }

  async getReview(pullNumber: number, reviewId: number): Promise<APIResponse> {
    return this.get(
      `/${pullNumber}/reviews/${reviewId}`,
      undefined,
      `Getting review #${reviewId}`,
    );
  }

  async createReview(
    pullNumber: number,
    data: {
      body?: string;
      event: "APPROVE" | "REQUEST_CHANGES" | "COMMENT";
      commit_id?: string;
    },
  ): Promise<APIResponse> {
    return this.post(
      `/${pullNumber}/reviews`,
      data,
      `Creating review on pull request #${pullNumber}`,
    );
  }

  async dismissReview(
    pullNumber: number,
    reviewId: number,
    message: string,
  ): Promise<APIResponse> {
    return this.put(
      `/${pullNumber}/reviews/${reviewId}/dismissals`,
      { message },
      `Dismissing review #${reviewId}`,
    );
  }
}
