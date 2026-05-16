import { describe, expect, it } from 'vitest';
import { createKivoClient, MockKivoApiClient } from './kivoClient';

describe('MockKivoApiClient', () => {
  it('registers a device and returns its raw API key only once', async () => {
    const client = new MockKivoApiClient();

    const created = await client.registerDevice({
      name: 'EV Charger Teste',
      metadata: { location: 'São Paulo', model: 'Kivo Edge' },
    });
    const fetched = await client.getDevice(created.device.id);

    expect(created.apiKey).toMatch(/^kivo_test_/);
    expect(created.device.name).toBe('EV Charger Teste');
    expect(fetched.apiKey).toBeUndefined();
    expect(fetched.device.stellarPublicKey).toMatch(/^G/);
  });

  it('creates a conditional payment and executes it after condition proof', async () => {
    const client = new MockKivoApiClient();
    const devices = await client.listDevices();

    const payment = await client.createPayment({
      fromDeviceId: devices[0].id,
      toDeviceId: devices[1].id,
      amount: '15.0000000',
      assetCode: 'USDC',
      conditionType: 'energy_kwh',
      conditionValue: '50',
      timeoutSeconds: 7200,
      memo: 'EV42 charge',
    });

    const proof = await client.submitConditionProof(payment.id, {
      conditionKey: 'energy_kwh',
      actualValue: '50',
      proofData: { signed_reading: 'mock-signature' },
    });

    expect(payment.status).toBe('pending');
    expect(proof.conditionMet).toBe(true);
    expect(proof.payment.status).toBe('processing');
  });

  it('simulates MCP and x402 flows without touching real funds', async () => {
    const client = new MockKivoApiClient();

    const mcp = await client.simulateMcpTool('kivo_simulate_payment', {
      from_device_id: 'dev_a',
      to_device_id: 'dev_b',
      amount: '0.05',
      currency: 'USDC',
    });
    const challenge = await client.getX402Challenge('/api/x402/data');
    const paid = await client.payX402Challenge(challenge.nonce);

    expect(mcp.simulated).toBe(true);
    expect(challenge.status).toBe(402);
    expect(paid.status).toBe(200);
  });

  it('manages webhook lifecycle with active toggles, tests and removal', async () => {
    const client = new MockKivoApiClient();

    const created = await client.createWebhook({
      url: 'https://ops.example.com/kivo',
      events: ['payment.confirmed'],
    });
    const paused = await client.toggleWebhook(created.id, false);
    const test = await client.testWebhook(created.id);
    await client.deleteWebhook(created.id);
    const webhooks = await client.listWebhooks();

    expect(created.secret).toMatch(/^whsec_/);
    expect(paused.active).toBe(false);
    expect(test.status).toBe('delivered');
    expect(webhooks.some((webhook) => webhook.id === created.id)).toBe(false);
  });

  it('revokes API keys without deleting the audit row', async () => {
    const client = new MockKivoApiClient();

    const created = await client.createApiKey({
      name: 'Agent runner',
      scopes: ['mcp:use', 'payments:write'],
    });
    const revoked = await client.revokeApiKey(created.apiKey.id);
    const keys = await client.listApiKeys();

    expect(revoked.status).toBe('revoked');
    expect(keys.find((key) => key.id === created.apiKey.id)?.status).toBe('revoked');
  });

  it('exposes MCP config, x402 pricing rules and deploy checks for MVP readiness', async () => {
    const client = new MockKivoApiClient();

    const config = await client.getMcpAgentConfig();
    const rule = await client.upsertX402PricingRule({
      resource: '/api/x402/premium-sensor',
      amount: '0.1250000',
      asset: 'USDC:GATESTUSDCISSUER',
      maxTimeout: 120,
      enabled: true,
    });
    const deploy = await client.listDeployChecks();

    expect(config.server.name).toBe('kivo-mcp');
    expect(config.env.KIVO_API_KEY).toContain('env:');
    expect(rule.resource).toBe('/api/x402/premium-sensor');
    expect(deploy.some((check) => check.id === 'env-api-url' && check.status === 'ready')).toBe(true);
  });

  it('selects mock or HTTP client from factory options', async () => {
    const mock = createKivoClient({ mode: 'mock' });
    const http = createKivoClient({
      mode: 'http',
      baseUrl: 'https://api.kivo.example',
      fetcher: async () => new Response(JSON.stringify({ version: '0.1.0', api: 'ok', db: 'ok', redis: 'ok', stellar: 'ok', mcp: 'ok' })),
    });

    await expect(mock.listDevices()).resolves.toEqual(expect.any(Array));
    await expect(http.getHealth()).resolves.toMatchObject({ version: '0.1.0', api: 'ok' });
  });
});
