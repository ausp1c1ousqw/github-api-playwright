import { APIResponse } from "@playwright/test";
import { BaseRepoClient } from "./BaseRepoClient.js";

/**
 * Wraps the GitHub Contents API — reading and writing individual files.
 *
 * Two things make this API different from Issues/Comments/Repo:
 *   1. Create AND update both go through the same PUT endpoint — GitHub
 *      distinguishes them by whether you send a `sha` (required to
 *      update an existing file, omitted to create a new one).
 *   2. File content must be base64-encoded before sending — this client
 *      handles that encoding so callers work with plain strings.
 */
export class ContentClient extends BaseRepoClient {
  async getContent(path: string, ref?: string): Promise<APIResponse> {
    return this.get(
      `/contents/${path}`,
      ref ? { ref } : undefined,
      `Getting content ${path}`,
    );
  }

  async createFile(
    path: string,
    content: string,
    message: string,
    branch?: string,
  ): Promise<APIResponse> {
    return this.put(
      `/contents/${path}`,
      {
        message,
        content: Buffer.from(content, "utf8").toString("base64"),
        branch,
      },
      `Creating file ${path}`,
    );
  }

  async updateFile(
    path: string,
    content: string,
    message: string,
    sha: string,
    branch?: string,
  ): Promise<APIResponse> {
    return this.put(
      `/contents/${path}`,
      {
        message,
        content: Buffer.from(content, "utf8").toString("base64"),
        sha,
        branch,
      },
      `Updating file ${path}`,
    );
  }

  async deleteFile(
    path: string,
    message: string,
    sha: string,
    branch?: string,
  ): Promise<APIResponse> {
    return this.delete(
      `/contents/${path}`,
      { message, sha, branch },
      `Deleting file ${path}`,
    );
  }
}
