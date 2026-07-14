const PROXY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/clms-proxy`;
const ANON_KEY  = import.meta.env.VITE_SUPABASE_ANON_KEY;
const TENANT    = 'AAL';

export type ApiBody = Record<string, string>;

export async function apiPost<T = unknown>(body: ApiBody, signal?: AbortSignal): Promise<T> {
  const res = await fetch(PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
      'Apikey': ANON_KEY,
    },
    body: JSON.stringify({ tenantCode: TENANT, ...body }),
    signal,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}
