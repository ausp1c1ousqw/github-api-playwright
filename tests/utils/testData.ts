import { randomUUID } from "node:crypto";

export const TEST_ISSUE_BODY = "Created by the API test suite. Safe to close.";
export const TEST_COMMENT_BODY = "This is an automated test comment.";

export function generateUniqueIssueTitle(): string {
  return `[automated-test] ${randomUUID()}`;
}
