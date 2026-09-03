import fs from "fs";
import * as dotenv from "dotenv";
import { logger } from "../logging/logger.js";

dotenv.config({ quiet: true });

export interface GitHubAppConfig {
  appId: string;
  installationId: string;
  privateKey: string;
  owner: string;
  repo: string;
}

let cachedConfig: GitHubAppConfig | null = null;

export function loadGitHubAppConfig(): GitHubAppConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  const appId = process.env.GH_APP_ID;
  const installationId = process.env.GH_APP_INSTALLATION_ID;
  const privateKeyPath = process.env.GH_APP_PRIVATE_KEY_PATH;
  const owner = process.env.GH_OWNER;
  const repo = process.env.GH_REPO;

  if (!appId || !installationId || !privateKeyPath || !owner || !repo) {
    logger.error(
      "Missing GH_APP_ID, GH_APP_INSTALLATION_ID, GH_APP_PRIVATE_KEY_PATH, GH_OWNER, or GH_REPO in .env",
    );
    throw new Error(
      "Missing GH_APP_ID, GH_APP_INSTALLATION_ID, GH_APP_PRIVATE_KEY_PATH, GH_OWNER, or GH_REPO in .env",
    );
  }

  cachedConfig = {
    appId,
    installationId,
    privateKey: fs.readFileSync(privateKeyPath, "utf8"),
    owner,
    repo,
  };

  return cachedConfig;
}
