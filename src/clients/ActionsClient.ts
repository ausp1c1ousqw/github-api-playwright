import { APIRequestContext, APIResponse } from "@playwright/test";
import { BaseRepoClient } from "./BaseRepoClient.js";

export class ActionsClient extends BaseRepoClient {
  constructor(request: APIRequestContext) {
    super(request, "/actions");
  }

  async listWorkflows(): Promise<APIResponse> {
    return this.get("/workflows", undefined, "Listing workflows");
  }

  async getWorkflow(workflowId: number | string): Promise<APIResponse> {
    return this.get(
      `/workflows/${workflowId}`,
      undefined,
      `Getting workflow ${workflowId}`,
    );
  }

  async listWorkflowRuns(params?: {
    status?: "queued" | "in_progress" | "completed";
    per_page?: number;
    page?: number;
  }): Promise<APIResponse> {
    return this.get("/runs", params, "Listing workflow runs");
  }

  async getWorkflowRun(runId: number): Promise<APIResponse> {
    return this.get(
      `/runs/${runId}`,
      undefined,
      `Getting workflow run #${runId}`,
    );
  }

  async cancelWorkflowRun(runId: number): Promise<APIResponse> {
    return this.post(
      `/runs/${runId}/cancel`,
      undefined,
      `Cancelling workflow run #${runId}`,
    );
  }

  async triggerWorkflow(
    workflowId: number | string,
    ref: string,
    inputs?: Record<string, string>,
  ): Promise<APIResponse> {
    return this.post(
      `/workflows/${workflowId}/dispatches`,
      { ref, inputs },
      `Triggering workflow ${workflowId}`,
    );
  }
}
