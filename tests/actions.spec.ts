import { test, expect } from "./fixtures/apiFixtures.js";

test.describe("Actions - workflows and runs", () => {
  test("lists workflows and returns 200", async ({ actionsClient }) => {
    const response = await actionsClient.listWorkflows();
    const result = await response.json();

    expect(response.status()).toBe(200);
    expect(Array.isArray(result.workflows)).toBe(true);
  });

  test("lists workflow runs and returns 200", async ({ actionsClient }) => {
    const response = await actionsClient.listWorkflowRuns();
    const result = await response.json();

    expect(response.status()).toBe(200);
    expect(Array.isArray(result.workflow_runs)).toBe(true);
  });

  test("returns 404 for a nonexistent workflow run", async ({
    actionsClient,
  }) => {
    const response = await actionsClient.getWorkflowRun(999999999);

    expect(response.status()).toBe(404);
  });

  // Not covered yet: triggerWorkflow and cancelWorkflowRun. Both need a
  // real workflow file in the repo with `on: workflow_dispatch`
  // configured — nothing to trigger against until that exists, and
  // creating one means writing a workflow YAML via ContentClient first.
  // Worth adding once the repo actually has a CI workflow set up.
});
