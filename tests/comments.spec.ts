import { expect } from "@playwright/test";
import { test } from "./fixtures/apiFixtures.js";
import {
  TEST_COMMENT_BODY,
  generateUniqueIssueTitle,
} from "./utils/testData.js";

test.describe("Issue Comments CRUD", () => {
  let issueNumber: number;

  test.beforeEach(async ({ issueClient }) => {
    const response = await issueClient.createIssue(generateUniqueIssueTitle());
    const createdIssue = await response.json();

    issueNumber = createdIssue.number;
  });

  test.afterEach(async ({ issueClient }) => {
    await issueClient.updateIssue(issueNumber, {
      state: "closed",
    });
  });

  test("creates a comment and returns 201 with the correct body", async ({
    commentClient,
  }) => {
    const body = TEST_COMMENT_BODY;

    const response = await commentClient.createComment(issueNumber, body);
    const createdComment = await response.json();

    try {
      expect(response.status()).toBe(201);
      expect(createdComment.body).toBe(body);
    } finally {
      await commentClient.deleteComment(createdComment.id);
    }
  });

  test("lists comments for an issue", async ({ commentClient }) => {
    const createResponse = await commentClient.createComment(
      issueNumber,
      "First comment",
    );
    const createdComment = await createResponse.json();

    try {
      const response = await commentClient.listComments(issueNumber);
      const comments = await response.json();

      expect(response.status()).toBe(200);
      expect(Array.isArray(comments)).toBe(true);
      expect(comments.length).toBeGreaterThan(0);

      for (const comment of comments) {
        expect(comment.id).toBeDefined();
      }
    } finally {
      await commentClient.deleteComment(createdComment.id);
    }
  });

  test("returns an empty array when an issue has no comments", async ({
    commentClient,
  }) => {
    const response = await commentClient.listComments(issueNumber);
    const comments = await response.json();

    expect(response.status()).toBe(200);
    expect(comments).toEqual([]);
  });

  test("gets a single comment by id", async ({ commentClient }) => {
    const body = TEST_COMMENT_BODY;

    const createResponse = await commentClient.createComment(issueNumber, body);
    const createdComment = await createResponse.json();

    try {
      const response = await commentClient.getComment(createdComment.id);
      const comment = await response.json();

      expect(response.status()).toBe(200);
      expect(comment.id).toBe(createdComment.id);
      expect(comment.body).toBe(body);
    } finally {
      await commentClient.deleteComment(createdComment.id);
    }
  });

  test("returns 404 when getting a nonexistent comment", async ({
    commentClient,
  }) => {
    const response = await commentClient.getComment(999999999);

    expect(response.status()).toBe(404);
  });

  test("updates a comment's body", async ({ commentClient }) => {
    const createResponse = await commentClient.createComment(
      issueNumber,
      "Original body",
    );
    const createdComment = await createResponse.json();

    const newBody = "Updated body";

    try {
      const updateResponse = await commentClient.updateComment(
        createdComment.id,
        newBody,
      );
      const updatedComment = await updateResponse.json();

      expect(updateResponse.status()).toBe(200);
      expect(updatedComment.body).toBe(newBody);
    } finally {
      await commentClient.deleteComment(createdComment.id);
    }
  });

  test("deletes a comment", async ({ commentClient }) => {
    const createResponse = await commentClient.createComment(
      issueNumber,
      "To be deleted",
    );
    const createdComment = await createResponse.json();

    const deleteResponse = await commentClient.deleteComment(createdComment.id);

    expect(deleteResponse.status()).toBe(204);

    const getResponse = await commentClient.getComment(createdComment.id);

    expect(getResponse.status()).toBe(404);
  });
});
