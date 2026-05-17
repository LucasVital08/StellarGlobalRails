import { describe, expect, it } from 'vitest';
import { createKivoClient } from './kivoClient';

describe('HttpKivoApiClient', () => {
  it('uses HTTP by default instead of silently falling back to mock data', async () => {
    let requestedUrl = '';
    const client = createKivoClient({
      baseUrl: 'https://api.kivo.example',
      fetcher: async (input) => {
        requestedUrl = String(input);
        return jsonResponse({ version: '0.1.0-real', api: 'ok', db: 'ok', redis: 'ok', stellar: 'ok', mcp: 'ok' });
      },
    });

    await expect(client.getHealth()).resolves.toMatchObject({ version: '0.1.0-real' });
    expect(requestedUrl).toBe('https://api.kivo.example/v1/health');
  });

  it('submits payment execution with a real Stellar XDR payload', async () => {
    let body = '';
    const client = createKivoClient({
      baseUrl: 'https://api.kivo.example',
      fetcher: async (_input, init) => {
        body = String(init?.body);
        return jsonResponse({
          id: 'pay_real',
          fromDeviceId: 'dev_a',
          toDeviceId: 'dev_b',
          amount: '0.0500000',
          assetCode: 'USDC',
          conditionType: 'none',
          status: 'confirmed',
          stellarHash: 'hash_real',
          stellarLedger: 123,
          createdAt: new Date().toISOString(),
          events: [],
        });
      },
    });

    const payment = await client.executePayment('pay_real', 'AAAA_REAL_XDR');

    expect(JSON.parse(body)).toEqual({ txXDR: 'AAAA_REAL_XDR' });
    expect(payment.stellarHash).toBe('hash_real');
  });

  it('pays x402 only by sending a signed transaction XDR', async () => {
    let body = '';
    const client = createKivoClient({
      baseUrl: 'https://api.kivo.example',
      fetcher: async (_input, init) => {
        body = String(init?.body);
        return jsonResponse({
          status: 200,
          paymentHeader: 'encoded',
          stellarHash: 'hash_real',
          stellarLedger: 456,
          data: { unlocked: true },
        });
      },
    });

    const paid = await client.payX402Challenge('nonce_real', 'AAAA_REAL_XDR');

    expect(JSON.parse(body)).toEqual({ nonce: 'nonce_real', txXDR: 'AAAA_REAL_XDR' });
    expect(paid.stellarHash).toBe('hash_real');
  });

  it('calls MCP tools through JSON-RPC instead of a simulate endpoint', async () => {
    let requestedUrl = '';
    let body = '';
    const client = createKivoClient({
      baseUrl: 'https://api.kivo.example',
      fetcher: async (input, init) => {
        requestedUrl = String(input);
        body = String(init?.body);
        return jsonResponse({
          jsonrpc: '2.0',
          id: 1,
          result: {
            content: [{ type: 'text', text: JSON.stringify({ status: 'confirmed' }) }],
            isError: false,
          },
        });
      },
    });

    const result = await client.callMcpTool('kivo_check_status', { paymentId: 'pay_real' });

    expect(requestedUrl).toBe('https://api.kivo.example/mcp');
    expect(JSON.parse(body)).toMatchObject({ method: 'tools/call', params: { name: 'kivo_check_status' } });
    expect(result.output).toEqual({ status: 'confirmed' });
  });

  it('surfaces API error messages instead of raw JSON strings', async () => {
    const client = createKivoClient({
      baseUrl: 'https://api.kivo.example',
      fetcher: async () =>
        jsonResponse(
          {
            code: 'unauthorized',
            message: 'valid Supabase JWT or Kivo API key is required',
          },
          401,
        ),
    });

    let errorMessage = '';
    try {
      await client.getDashboardSummary();
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : String(error);
    }

    expect(errorMessage).toBe('valid Supabase JWT or Kivo API key is required');
  });
});

const jsonResponse = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
