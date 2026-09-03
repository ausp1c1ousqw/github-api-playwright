import { APIResponse } from "@playwright/test";
import { BaseRepoClient } from "./BaseRepoClient.js";

// No constructor needed — no extra resource segment, so basePath
// (inherited from BaseRepoClient) already equals /repos/{owner}/{repo}.
export class RepoClient extends BaseRepoClient {
  async getRepo(): Promise<APIResponse> {
    return this.get("", undefined, "Getting repo");
  }

  async updateRepo(data: {
    description?: string;
    default_branch?: string;
    private?: boolean;
    has_issues?: boolean;
  }): Promise<APIResponse> {
    return this.patch("", data, "Updating repo");
  }

  async listBranches(params?: {
    protected?: boolean;
    per_page?: number;
    page?: number;
  }): Promise<APIResponse> {
    return this.get("/branches", params, "Listing branches");
  }

  async getBranch(branch: string): Promise<APIResponse> {
    return this.get(
      `/branches/${branch}`,
      undefined,
      `Getting branch ${branch}`,
    );
  }
}
