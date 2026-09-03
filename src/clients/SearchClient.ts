import { APIResponse } from "@playwright/test";
import { BaseClient } from "./BaseClient.js";

export class SearchClient extends BaseClient {
  async searchIssues(
    query: string,
    params?: { per_page?: number; page?: number },
  ): Promise<APIResponse> {
    return this.get(
      "/search/issues",
      { q: query, ...params },
      "Searching issues",
    );
  }

  async searchRepositories(
    query: string,
    params?: { per_page?: number; page?: number },
  ): Promise<APIResponse> {
    return this.get(
      "/search/repositories",
      { q: query, ...params },
      "Searching repositories",
    );
  }

  async searchUsers(
    query: string,
    params?: { per_page?: number; page?: number },
  ): Promise<APIResponse> {
    return this.get(
      "/search/users",
      { q: query, ...params },
      "Searching users",
    );
  }
}
