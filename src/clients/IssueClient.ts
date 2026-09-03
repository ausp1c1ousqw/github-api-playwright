import { APIRequestContext, APIResponse } from "@playwright/test";
import { BaseRepoClient } from "./BaseRepoClient.js";

export class IssueClient extends BaseRepoClient {
  constructor(request: APIRequestContext) {
    super(request, "/issues");
  }

  async listIssues(params?: {
    state?: "open" | "closed" | "all";
    labels?: string;
    sort?: "created" | "updated" | "comments";
    direction?: "asc" | "desc";
    per_page?: number;
    page?: number;
  }): Promise<APIResponse> {
    return this.get("", params, "Listing issues");
  }

  async getIssue(issue_number: number): Promise<APIResponse> {
    return this.get(
      `/${issue_number}`,
      undefined,
      `Getting issue #${issue_number}`,
    );
  }

  async createIssue(
    title: string,
    body?: string,
    labels?: string[],
  ): Promise<APIResponse> {
    return this.post("", { title, body, labels }, "Creating issue");
  }

  async updateIssue(
    issue_number: number,
    data: {
      title?: string;
      body?: string;
      state?: "open" | "closed";
      state_reason?: "completed" | "not_planned" | "reopened";
      labels?: string[];
      assignees?: string[];
    },
  ): Promise<APIResponse> {
    return this.patch(
      `/${issue_number}`,
      data,
      `Updating issue #${issue_number}`,
    );
  }
}
