import fs from "fs";
import { z } from "zod";
import * as dotenv from "dotenv";
import { logger } from "../logging/logger.js";

dotenv.config({ quiet: true });

const envSchema = z.object({
  GH_APP_ID: z.string().min(1),
  GH_APP_INSTALLATION_ID: z.string().min(1),
  GH_APP_PRIVATE_KEY_PATH: z.string().min(1),
  GH_OWNER: z.string().min(1),
  GH_REPO: z.string().min(1),
  BASE_URL: z.url(),
});

export interface GitHubAppConfig {
  appId: string;
  installationId: string;
  privateKey: string;
  owner: string;
  repo: string;
  baseUrl: string;
}

let cachedConfig: GitHubAppConfig | null = null;

export function loadGitHubAppConfig(): GitHubAppConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    logger.error("Invalid environment configuration", {
      errors: z.treeifyError(parsed.error),
    });
    throw new Error("Environment validation failed — see logged errors above");
  }

  const {
    GH_APP_ID,
    GH_APP_INSTALLATION_ID,
    GH_APP_PRIVATE_KEY_PATH,
    GH_OWNER,
    GH_REPO,
    BASE_URL,
  } = parsed.data;

  cachedConfig = {
    appId: GH_APP_ID,
    installationId: GH_APP_INSTALLATION_ID,
    privateKey: fs.readFileSync(GH_APP_PRIVATE_KEY_PATH, "utf8"),
    owner: GH_OWNER,
    repo: GH_REPO,
    baseUrl: BASE_URL,
  };

  return cachedConfig;
}
