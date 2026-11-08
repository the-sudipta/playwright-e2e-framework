import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { Booking } from '@support/types';

const JSON_HEADERS = { Accept: 'application/json' };

// /booking resource of the Restful Booker API.
export class BookingClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly token?: string,
  ) {}

  private authHeaders(): Record<string, string> {
    return this.token ? { ...JSON_HEADERS, Cookie: `token=${this.token}` } : JSON_HEADERS;
  }

  list(filters: Record<string, string> = {}): Promise<APIResponse> {
    return this.request.get('/booking', { params: filters, headers: JSON_HEADERS });
  }

  get(id: number | string): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`, { headers: JSON_HEADERS });
  }

  create(booking: Partial<Booking>): Promise<APIResponse> {
    return this.request.post('/booking', { data: booking, headers: JSON_HEADERS });
  }

  update(id: number, booking: Booking): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, { data: booking, headers: this.authHeaders() });
  }

  partialUpdate(id: number, fields: Partial<Booking>): Promise<APIResponse> {
    return this.request.patch(`/booking/${id}`, { data: fields, headers: this.authHeaders() });
  }

  delete(id: number): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, { headers: this.authHeaders() });
  }
}
