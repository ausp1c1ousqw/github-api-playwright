import { APIRequestContext, APIResponse } from "@playwright/test";
import { BaseRepoClient } from "./BaseRepoClient.js";

export class CommentClient extends BaseRepoClient {
  constructor(request: APIRequestContext) {
    super(request, "/issues");
  }

  async createComment(issueNumber: number, body: string): Promise<APIResponse> {
    return this.post(
      `/${issueNumber}/comments`,
      { body },
      `Creating comment on issue #${issueNumber}`,
    );
  }

  async listComments(issueNumber: number): Promise<APIResponse> {
    return this.get(
      `/${issueNumber}/comments`,
      undefined,
      `Listing comments for issue #${issueNumber}`,
    );
  }

  async getComment(commentId: number): Promise<APIResponse> {
    return this.get(
      `/comments/${commentId}`,
      undefined,
      `Getting comment #${commentId}`,
    );
  }

  async updateComment(commentId: number, body: string): Promise<APIResponse> {
    return this.patch(
      `/comments/${commentId}`,
      { body },
      `Updating comment #${commentId}`,
    );
  }

  async deleteComment(commentId: number): Promise<APIResponse> {
    return this.delete(
      `/comments/${commentId}`,
      undefined,
      `Deleting comment #${commentId}`,
    );
  }
}
