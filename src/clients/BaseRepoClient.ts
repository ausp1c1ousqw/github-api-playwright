import { APIRequestContext, APIResponse } from "@playwright/test";
import { BaseClient } from "./BaseClient.js";
import { loadGitHubAppConfig } from "../config/env.js";

export class BaseRepoClient extends BaseClient {
  protected readonly owner: string;
  protected readonly repo: string;
  protected readonly repoBasePath: string;
  protected readonly basePath: string;

  constructor(request: APIRequestContext, resourcePath: string = "") {
    super(request);
    const config = loadGitHubAppConfig();
    this.owner = config.owner;
    this.repo = config.repo;
    this.repoBasePath = `/repos/${config.owner}/${config.repo}`;
    this.basePath = `${this.repoBasePath}${resourcePath}`;
  }

  protected async get(
    path: string,
    params?: Record<string, string | number | boolean>,
    label?: string,
  ): Promise<APIResponse> {
    return super.get(`${this.basePath}${path}`, params, label);
  }

  protected async post(
    path: string,
    data?: object,
    label?: string,
  ): Promise<APIResponse> {
    return super.post(`${this.basePath}${path}`, data, label);
  }

  protected async patch(
    path: string,
    data?: object,
    label?: string,
  ): Promise<APIResponse> {
    return super.patch(`${this.basePath}${path}`, data, label);
  }

  protected async put(
    path: string,
    data?: object,
    label?: string,
  ): Promise<APIResponse> {
    return super.put(`${this.basePath}${path}`, data, label);
  }

  protected async delete(
    path: string,
    data?: object,
    label?: string,
  ): Promise<APIResponse> {
    return super.delete(`${this.basePath}${path}`, data, label);
  }
}
