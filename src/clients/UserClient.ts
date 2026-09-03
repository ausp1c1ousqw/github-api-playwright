import { APIResponse } from "@playwright/test";
import { BaseClient } from "./BaseClient.js";

/**
 * Not repo-scoped, so this extends BaseClient directly rather than
 * BaseRepoClient — no owner/repo/repoBasePath to carry around unused.
 *
 * Worth knowing before writing tests: GET /user behaves differently for
 * a GitHub App installation token than for a PAT — an installation
 * token isn't tied to a specific human user, so this endpoint may
 * return something unexpected (e.g. 403) depending on the token type.
 */
export class UserClient extends BaseClient {
  async getAuthenticatedUser(): Promise<APIResponse> {
    return this.get("/user", undefined, "Getting authenticated user");
  }

  async getUser(username: string): Promise<APIResponse> {
    return this.get(`/users/${username}`, undefined, `Getting user ${username}`);
  }
}
