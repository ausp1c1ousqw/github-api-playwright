import { test, expect } from "./fixtures/apiFixtures.js";

test.describe("File content CRUD", () => {
  // Each test uses its own unique path so runs never collide with each
  // other or leave a shared file dangling between tests.
  function uniquePath(): string {
    return `automated-test/file-${Date.now()}.txt`;
  }

  test("creates a file and returns 201 with correct content", async ({
    contentClient,
  }) => {
    const path = uniquePath();
    const content = "Created by the API test suite.";

    const response = await contentClient.createFile(
      path,
      content,
      "Add test file",
    );
    const result = await response.json();

    expect(response.status()).toBe(201);
    expect(result.content.path).toBe(path);

    await contentClient.deleteFile(
      path,
      "Clean up test file",
      result.content.sha,
    );
  });

  test("gets file content and decodes it correctly", async ({
    contentClient,
  }) => {
    const path = uniquePath();
    const content = "Some content to read back.";

    const createResponse = await contentClient.createFile(
      path,
      content,
      "Add file for get test",
    );
    const created = await createResponse.json();

    const response = await contentClient.getContent(path);
    const result = await response.json();

    expect(response.status()).toBe(200);
    const decoded = Buffer.from(result.content, "base64").toString("utf8");
    expect(decoded).toBe(content);

    await contentClient.deleteFile(path, "Clean up", created.content.sha);
  });

  test("returns 404 when getting nonexistent content", async ({
    contentClient,
  }) => {
    const response = await contentClient.getContent(
      "this/path/does-not-exist.txt",
    );

    expect(response.status()).toBe(404);
  });

  test("updates an existing file using its current sha", async ({
    contentClient,
  }) => {
    const path = uniquePath();
    const original = "Original content.";
    const updated = "Updated content.";

    const createResponse = await contentClient.createFile(
      path,
      original,
      "Add file for update test",
    );
    const created = await createResponse.json();

    const updateResponse = await contentClient.updateFile(
      path,
      updated,
      "Update test file",
      created.content.sha,
    );
    const updateResult = await updateResponse.json();

    expect(updateResponse.status()).toBe(200);

    const getResponse = await contentClient.getContent(path);
    const getResult = await getResponse.json();
    const decoded = Buffer.from(getResult.content, "base64").toString("utf8");
    expect(decoded).toBe(updated);

    await contentClient.deleteFile(path, "Clean up", updateResult.content.sha);
  });

  test("deletes a file, then confirms it's gone", async ({ contentClient }) => {
    const path = uniquePath();
    const createResponse = await contentClient.createFile(
      path,
      "To be deleted.",
      "Add file for delete test",
    );
    const created = await createResponse.json();

    const deleteResponse = await contentClient.deleteFile(
      path,
      "Delete test file",
      created.content.sha,
    );
    expect(deleteResponse.status()).toBe(200);

    const getResponse = await contentClient.getContent(path);
    expect(getResponse.status()).toBe(404);
  });
});
