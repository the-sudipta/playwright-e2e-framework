import type { APIRequestContext, APIResponse } from '@playwright/test';

// POST /auth of the Restful Booker API.
export class AuthClient {
  constructor(private readonly request: APIRequestContext) {}

  async createToken(username: string, password: string): Promise<APIResponse> {
    return this.request.post('/auth', { data: { username, password } });
  }

  async token(username: string, password: string): Promise<string> {
    const response = await this.createToken(username, password);
    const body = (await response.json()) as { token?: string };
    if (!body.token) throw new Error(`No token returned: ${JSON.stringify(body)}`);
    return body.token;
  }
}
