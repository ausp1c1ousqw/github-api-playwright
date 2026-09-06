import { test, expect } from "./fixtures/apiFixtures.js";
import { generateUniqueIssueTitle, TEST_ISSUE_BODY } from "./utils/testData.js";

test.describe("Issues CRUD", () => {
  test("creates an issue and returns 201 with the correct fields", async ({
    issueClient,
  }) => {
    const title = generateUniqueIssueTitle();
    const body = TEST_ISSUE_BODY;

    const response = await issueClient.createIssue(title, body);
    const createdIssue = await response.json();
    try {
      expect(response.status()).toBe(201);
      expect(createdIssue.title).toBe(title);
      expect(createdIssue.body).toBe(body);
      expect(createdIssue.state).toBe("open");
    } finally {
      await issueClient.updateIssue(createdIssue.number, { state: "closed" });
    }
  });

  test("returns 422 when creating an issue without a title", async ({
    issueClient,
  }) => {
    // @ts-expect-error - deliberately omitting the required `title` field
    const response = await issueClient.createIssue(undefined, "no title here");

    expect(response.status()).toBe(422);
  });

  test("gets an existing issue by number", async ({ issueClient }) => {
    const title = generateUniqueIssueTitle();

    const createResponse = await issueClient.createIssue(title);
    const createdIssue = await createResponse.json();

    const getResponse = await issueClient.getIssue(createdIssue.number);
    const issue = await getResponse.json();

    try {
      expect(getResponse.status()).toBe(200);
      expect(issue.number).toBe(createdIssue.number);
      expect(issue.title).toBe(title);
    } finally {
      await issueClient.updateIssue(issue.number, { state: "closed" });
    }
  });

  test("returns 404 when getting a nonexistent issue", async ({
    issueClient,
  }) => {
    const response = await issueClient.getIssue(999999999);

    expect(response.status()).toBe(404);
  });

  test("lists issues and returns an array", async ({ issueClient }) => {
    const response = await issueClient.listIssues();
    const issues = await response.json();

    expect(response.status()).toBe(200);
    expect(Array.isArray(issues)).toBe(true);
  });

  test("lists only open issues when state=open", async ({ issueClient }) => {
    const response = await issueClient.listIssues({ state: "open" });
    const issues = await response.json();

    expect(response.status()).toBe(200);

    for (const issue of issues) {
      expect(issue.state).toBe("open");
    }
  });

  test("lists only closed issues when state=closed", async ({
    issueClient,
  }) => {
    const response = await issueClient.listIssues({ state: "closed" });
    const issues = await response.json();

    expect(response.status()).toBe(200);

    for (const issue of issues) {
      expect(issue.state).toBe("closed");
    }
  });

  test("respects the per_page parameter", async ({ issueClient }) => {
    const response = await issueClient.listIssues({
      state: "all",
      per_page: 2,
    });
    const issues = await response.json();

    expect(response.status()).toBe(200);
    expect(issues.length).toBeLessThanOrEqual(2);
  });

  test("updates an issue's title and body", async ({ issueClient }) => {
    const createResponse = await issueClient.createIssue(
      generateUniqueIssueTitle(),
    );
    const createdIssue = await createResponse.json();

    const newTitle = generateUniqueIssueTitle();
    const newBody = TEST_ISSUE_BODY;

    const updateResponse = await issueClient.updateIssue(createdIssue.number, {
      title: newTitle,
      body: newBody,
    });
    const updatedIssue = await updateResponse.json();

    try {
      expect(updateResponse.status()).toBe(200);
      expect(updatedIssue.title).toBe(newTitle);
      expect(updatedIssue.body).toBe(newBody);
    } finally {
      await issueClient.updateIssue(createdIssue.number, {
        state: "closed",
      });
    }
  });

  test("closes an issue via update, then reopens it", async ({
    issueClient,
  }) => {
    const createResponse = await issueClient.createIssue(
      generateUniqueIssueTitle(),
    );
    const createdIssue = await createResponse.json();

    const closeResponse = await issueClient.updateIssue(createdIssue.number, {
      state: "closed",
    });
    const closedIssue = await closeResponse.json();
    try {
      expect(closeResponse.status()).toBe(200);
      expect(closedIssue.state).toBe("closed");

      const reopenResponse = await issueClient.updateIssue(
        createdIssue.number,
        {
          state: "open",
        },
      );
      const reopenedIssue = await reopenResponse.json();

      expect(reopenResponse.status()).toBe(200);
      expect(reopenedIssue.state).toBe("open");
    } finally {
      await issueClient.updateIssue(createdIssue.number, {
        state: "closed",
      });
    }
  });
});
