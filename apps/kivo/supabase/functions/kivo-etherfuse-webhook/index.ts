const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-etherfuse-signature, x-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const toHex = (bytes: ArrayBuffer) =>
  [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, '0')).join('');

const timingSafeEqual = (left: string, right: string) => {
  if (left.length !== right.length) {
    return false;
  }

  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return result === 0;
};

const verifySignature = async (rawBody: string, signature: string | null, secret: string) => {
  if (!secret) {
    return true;
  }

  if (!signature) {
    return false;
  }

  const normalized = signature.includes('=')
    ? signature
        .split(',')
        .map((part) => part.trim())
        .find((part) => part.startsWith('v1='))
        ?.slice(3)
    : signature.trim();

  if (!normalized) {
    return false;
  }

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const digest = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(rawBody));
  return timingSafeEqual(toHex(digest), normalized.toLowerCase());
};

const pickString = (value: unknown): string | null => (typeof value === 'string' && value.length > 0 ? value : null);

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return json({ error: 'method_not_allowed' }, 405);
  }

  const rawBody = await request.text();
  let payload: Record<string, unknown>;
  try {
    payload = rawBody ? JSON.parse(rawBody) as Record<string, unknown> : {};
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }
  const signature = request.headers.get('x-etherfuse-signature') ?? request.headers.get('x-signature');
  const signatureValid = await verifySignature(rawBody, signature, Deno.env.get('ETHERFUSE_WEBHOOK_SECRET') ?? '');

  if (!signatureValid) {
    return json({ error: 'invalid_signature' }, 401);
  }

  const data = (payload.data ?? {}) as Record<string, unknown>;
  const event = {
    provider_event_id: pickString(payload.id) ?? pickString(payload.event_id),
    provider_order_id: pickString(payload.order_id) ?? pickString(payload.provider_order_id) ?? pickString(data.order_id),
    event_type: pickString(payload.type) ?? pickString(payload.event_type) ?? 'etherfuse.webhook',
    signature_valid: signatureValid,
    payload,
  };

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    return json({ received: true, persisted: false, reason: 'missing_supabase_edge_env' }, 202);
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/kivo_etherfuse_webhook_events`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    return json({ error: 'persist_failed', detail: await response.text() }, 502);
  }

  return json({ received: true, persisted: true }, 202);
});
