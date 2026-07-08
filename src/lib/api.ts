const API_URL = 'https://devai.clms.in/webhook/clms-dashboard-new';
const TENANT  = 'AAL';

export type ApiBody = Record<string, string>;

export async function apiPost<T = unknown>(body: ApiBody, signal?: AbortSignal): Promise<T> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tenantCode: TENANT, ...body }),
    signal,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}
