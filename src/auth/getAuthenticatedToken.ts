import { loadGitHubAppConfig, GitHubAppConfig } from "../config/env.js";
import jwt from "jsonwebtoken";
import { logger } from "../logging/logger.js";

function generateAppJWT(
  config: GitHubAppConfig,
  now: number = Math.floor(Date.now() / 1000),
): string {
  const payload = {
    iat: now - 60,
    exp: now + 9 * 60,
    iss: config.appId,
  };

  const token = jwt.sign(payload, config.privateKey, { algorithm: "RS256" });
  return token;
}

async function getInstallationToken(
  appJwt: string,
  config: GitHubAppConfig,
): Promise<string> {
  const response = await fetch(
    `https://api.github.com/app/installations/${config.installationId}/access_tokens`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${appJwt}`,
        Accept: "application/vnd.github+json",
      },
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    logger.error(
      `Failed to get installation token: ${response.status} ${errorBody}`,
    );
    throw new Error(
      `Failed to get installation token: ${response.status} ${errorBody}`,
    );
  }

  interface InstallationTokenResponse {
    token: string;
    expires_at: string;
  }
  const data = (await response.json()) as InstallationTokenResponse;

  logger.info(`Installation token obtained (expires ${data.expires_at})`);

  return data.token;
}

export async function getAuthenticatedToken(): Promise<string> {
  const config = loadGitHubAppConfig();
  const appJwt = generateAppJWT(config);
  return getInstallationToken(appJwt, config);
}
