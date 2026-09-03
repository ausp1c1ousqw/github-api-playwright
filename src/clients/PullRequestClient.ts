import { APIRequestContext, APIResponse } from "@playwright/test";
import { BaseRepoClient } from "./BaseRepoClient.js";

export class PullRequestClient extends BaseRepoClient {
  constructor(request: APIRequestContext) {
    super(request, "/pulls");
  }

  async listPullRequests(params?: {
    state?: "open" | "closed" | "all";
    head?: string;
    base?: string;
    sort?: "created" | "updated" | "popularity";
    direction?: "asc" | "desc";
    per_page?: number;
    page?: number;
  }): Promise<APIResponse> {
    return this.get("", params, "Listing pull requests");
  }

  async getPullRequest(pullNumber: number): Promise<APIResponse> {
    return this.get(
      `/${pullNumber}`,
      undefined,
      `Getting pull request #${pullNumber}`,
    );
  }

  async createPullRequest(data: {
    title: string;
    head: string;
    base: string;
    body?: string;
    draft?: boolean;
  }): Promise<APIResponse> {
    return this.post("", data, "Creating pull request");
  }

  async updatePullRequest(
    pullNumber: number,
    data: {
      title?: string;
      body?: string;
      state?: "open" | "closed";
      base?: string;
    },
  ): Promise<APIResponse> {
    return this.patch(
      `/${pullNumber}`,
      data,
      `Updating pull request #${pullNumber}`,
    );
  }

  async mergePullRequest(
    pullNumber: number,
    data?: {
      commit_title?: string;
      commit_message?: string;
      merge_method?: "merge" | "squash" | "rebase";
    },
  ): Promise<APIResponse> {
    return this.put(
      `/${pullNumber}/merge`,
      data,
      `Merging pull request #${pullNumber}`,
    );
  }

  async listFiles(pullNumber: number): Promise<APIResponse> {
    return this.get(
      `/${pullNumber}/files`,
      undefined,
      `Listing files for pull request #${pullNumber}`,
    );
  }

  async listCommits(pullNumber: number): Promise<APIResponse> {
    return this.get(
      `/${pullNumber}/commits`,
      undefined,
      `Listing commits for pull request #${pullNumber}`,
    );
  }
}
