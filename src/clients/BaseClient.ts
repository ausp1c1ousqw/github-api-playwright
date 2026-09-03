import { APIRequestContext, APIResponse } from "@playwright/test";
import { logger } from "../logging/logger.js";

export class BaseClient {
  constructor(protected readonly request: APIRequestContext) {}

  protected async get(
    url: string,
    params?: Record<string, string | number | boolean>,
    label?: string,
  ): Promise<APIResponse> {
    return this.logged("GET", url, label, () =>
      this.request.get(url, { params }),
    );
  }

  protected async post(
    url: string,
    data?: object,
    label?: string,
  ): Promise<APIResponse> {
    return this.logged("POST", url, label, () =>
      this.request.post(url, { data }),
    );
  }

  protected async patch(
    url: string,
    data?: object,
    label?: string,
  ): Promise<APIResponse> {
    return this.logged("PATCH", url, label, () =>
      this.request.patch(url, { data }),
    );
  }

  protected async put(
    url: string,
    data?: object,
    label?: string,
  ): Promise<APIResponse> {
    return this.logged("PUT", url, label, () =>
      this.request.put(url, { data }),
    );
  }

  protected async delete(
    url: string,
    data?: object,
    label?: string,
  ): Promise<APIResponse> {
    return this.logged("DELETE", url, label, () =>
      this.request.delete(url, data ? { data } : undefined),
    );
  }

  private async logged(
    method: string,
    url: string,
    label: string | undefined,
    send: () => Promise<APIResponse>,
  ): Promise<APIResponse> {
    const start = Date.now();
    const response = await send();
    const duration = Date.now() - start;
    const status = response.status();
    const description = label ?? `${method} ${url}`;

    logger.info(`${description} → ${status} (${duration}ms)`);

    return response;
  }
}
