import {
  apiKeys as seedApiKeys,
  deployChecks,
  deployServices,
  devices as seedDevices,
  mcpTools,
  ownerId,
  paymentConditions as seedConditions,
  payments as seedPayments,
  webhookDeliveries as seedDeliveries,
  webhooks as seedWebhooks,
  workflows,
  x402PricingRules as seedX402PricingRules,
} from '@/data/mockKivo';
import type {
  ApiKey,
  ApiKeyResult,
  ConditionProofInput,
  ConditionProofResult,
  CreatePaymentInput,
  DashboardSummary,
  DeployCheck,
  DeployServiceStatus,
  Device,
  DeviceRegistrationResult,
  McpAgentConfig,
  McpSimulationResult,
  McpTool,
  Payment,
  PaymentCondition,
  RegisterDeviceInput,
  SystemHealth,
  Webhook,
  WebhookDelivery,
  WebhookTestResult,
  Workflow,
  X402Challenge,
  X402PaidResponse,
  X402PricingRule,
  X402PricingRuleInput,
} from '@/types/kivo';

export interface KivoApiClient {
  getDashboardSummary(): Promise<DashboardSummary>;
  getHealth(): Promise<SystemHealth>;
  listDevices(): Promise<Device[]>;
  getDevice(id: string): Promise<DeviceRegistrationResult>;
  registerDevice(input: RegisterDeviceInput): Promise<DeviceRegistrationResult>;
  updateDeviceStatus(id: string, status: Device['status']): Promise<Device>;
  listPayments(): Promise<Payment[]>;
  getPayment(id: string): Promise<Payment>;
  createPayment(input: CreatePaymentInput): Promise<Payment>;
  executePayment(id: string): Promise<Payment>;
  submitConditionProof(id: string, input: ConditionProofInput): Promise<ConditionProofResult>;
  listWebhooks(): Promise<Webhook[]>;
  createWebhook(input: Pick<Webhook, 'url' | 'events'>): Promise<Webhook & { secret: string }>;
  toggleWebhook(id: string, active: boolean): Promise<Webhook>;
  testWebhook(id: string): Promise<WebhookTestResult>;
  deleteWebhook(id: string): Promise<void>;
  listWebhookDeliveries(webhookId?: string): Promise<WebhookDelivery[]>;
  listApiKeys(): Promise<ApiKey[]>;
  createApiKey(input: Pick<ApiKey, 'name' | 'scopes' | 'expiresAt'>): Promise<ApiKeyResult>;
  revokeApiKey(id: string): Promise<ApiKey>;
  listMcpTools(): Promise<McpTool[]>;
  getMcpAgentConfig(): Promise<McpAgentConfig>;
  simulateMcpTool(toolName: string, input: Record<string, unknown>): Promise<McpSimulationResult>;
  getX402Challenge(resource: string): Promise<X402Challenge>;
  payX402Challenge(nonce: string): Promise<X402PaidResponse>;
  listX402PricingRules(): Promise<X402PricingRule[]>;
  upsertX402PricingRule(input: X402PricingRuleInput): Promise<X402PricingRule>;
  listWorkflows(): Promise<Workflow[]>;
  listDeployChecks(): Promise<DeployCheck[]>;
  listDeployServices(): Promise<DeployServiceStatus[]>;
}

const clone = <T>(value: T): T => structuredClone(value);

const now = () => new Date().toISOString();

const randomId = (prefix: string) => `${prefix}_${Math.random().toString(16).slice(2, 10)}`;

const rawKey = (prefix = 'kivo_test') => `${prefix}_${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;

const previewKey = (key: string) => `${key.slice(0, 10)}...${key.slice(-4).toUpperCase()}`;

const stellarKey = () => `G${Math.random().toString(36).slice(2).toUpperCase().padEnd(55, '0').slice(0, 55)}`;

const stellarHash = () => Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

const delay = <T>(value: T, ms = 120): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(clone(value)), ms));

const health: SystemHealth = {
  api: 'ok',
  db: 'ok',
  redis: 'degraded',
  stellar: 'ok',
  mcp: 'ok',
  version: '0.1.0-mock',
};

const buildMcpAgentConfig = (baseUrl = 'https://api.kivo.local'): McpAgentConfig => ({
  server: {
    name: 'kivo-mcp',
    transport: 'http',
    url: `${baseUrl.replace(/\/$/, '')}/mcp`,
  },
  env: {
    KIVO_API_URL: baseUrl,
    KIVO_API_KEY: 'env:KIVO_API_KEY',
    KIVO_DEVICE_ID: 'env:KIVO_DEVICE_ID',
    KIVO_NETWORK: 'testnet',
  },
  tools: mcpTools.map((tool) => tool.name),
  approvalPolicy: {
    autoApproveSafeTools: true,
    maxAutoPaymentAmount: '0.5000000 USDC',
    requireHumanFor: ['kivo_create_payment', 'kivo_execute_contract'],
  },
  sampleConfig: {
    mcpServers: {
      kivo: {
        url: `${baseUrl.replace(/\/$/, '')}/mcp`,
        headers: {
          Authorization: 'Bearer ${KIVO_API_KEY}',
          'X-Kivo-Device-Id': '${KIVO_DEVICE_ID}',
        },
      },
    },
  },
});

export class MockKivoApiClient implements KivoApiClient {
  private devices = clone(seedDevices);
  private payments = clone(seedPayments);
  private conditions = clone(seedConditions);
  private webhooks = clone(seedWebhooks);
  private deliveries = clone(seedDeliveries);
  private apiKeys = clone(seedApiKeys);
  private x402Rules = clone(seedX402PricingRules);

  async getDashboardSummary(): Promise<DashboardSummary> {
    const confirmed = this.payments.filter((payment) => payment.status === 'confirmed');
    return delay({
      totalDevices: this.devices.length,
      activeDevices: this.devices.filter((device) => device.status === 'active').length,
      totalVolumeUsdc: confirmed.reduce((sum, payment) => sum + Number(payment.amount), 0),
      confirmedPayments: confirmed.length,
      pendingPayments: this.payments.filter((payment) => payment.status === 'pending' || payment.status === 'processing').length,
      failedPayments: this.payments.filter((payment) => payment.status === 'failed').length,
      health,
    });
  }

  async getHealth(): Promise<SystemHealth> {
    return delay(health);
  }

  async listDevices(): Promise<Device[]> {
    return delay(this.devices);
  }

  async getDevice(id: string): Promise<DeviceRegistrationResult> {
    const device = this.findDevice(id);
    return delay({ device });
  }

  async registerDevice(input: RegisterDeviceInput): Promise<DeviceRegistrationResult> {
    const apiKey = rawKey();
    const timestamp = now();
    const device: Device = {
      id: randomId('dev'),
      name: input.name,
      ownerId,
      apiKeyPreview: previewKey(apiKey),
      stellarPublicKey: stellarKey(),
      status: 'active',
      metadata: input.metadata ?? {},
      balances: [
        { assetCode: 'USDC', amount: '0.0000000' },
        { assetCode: 'XLM', amount: '10.0000000' },
      ],
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.devices.unshift(device);
    return delay({ device, apiKey });
  }

  async updateDeviceStatus(id: string, status: Device['status']): Promise<Device> {
    const device = this.findDevice(id);
    device.status = status;
    device.updatedAt = now();
    return delay(device);
  }

  async listPayments(): Promise<Payment[]> {
    return delay(this.payments);
  }

  async getPayment(id: string): Promise<Payment> {
    return delay(this.findPayment(id));
  }

  async createPayment(input: CreatePaymentInput): Promise<Payment> {
    this.findDevice(input.fromDeviceId);
    this.findDevice(input.toDeviceId);

    const timestamp = now();
    const timeoutAt = input.timeoutSeconds ? new Date(Date.now() + input.timeoutSeconds * 1000).toISOString() : undefined;
    const payment: Payment = {
      id: randomId('pay'),
      fromDeviceId: input.fromDeviceId,
      toDeviceId: input.toDeviceId,
      amount: input.amount,
      assetCode: input.assetCode,
      conditionType: input.conditionType,
      conditionValue: input.conditionValue,
      status: input.conditionType === 'none' ? 'processing' : 'pending',
      memo: input.memo,
      timeoutAt,
      createdAt: timestamp,
      events: [
        {
          id: randomId('evt'),
          label: 'Pagamento criado',
          description: input.conditionType === 'none' ? 'Job de liquidação enfileirado.' : 'Aguardando prova da condição.',
          status: input.conditionType === 'none' ? 'current' : 'waiting',
          createdAt: timestamp,
        },
      ],
    };

    this.payments.unshift(payment);
    return delay(payment);
  }

  async executePayment(id: string): Promise<Payment> {
    const payment = this.findPayment(id);
    payment.status = 'processing';
    payment.events.push({
      id: randomId('evt'),
      label: 'Execução manual',
      description: 'Pagamento enviado para o worker Redis.',
      status: 'current',
      createdAt: now(),
    });
    return delay(payment);
  }

  async submitConditionProof(id: string, input: ConditionProofInput): Promise<ConditionProofResult> {
    const payment = this.findPayment(id);
    const conditionMet = payment.conditionValue === undefined || Number(input.actualValue) >= Number(payment.conditionValue);
    const timestamp = now();
    const condition: PaymentCondition = {
      id: randomId('cond'),
      paymentId: payment.id,
      conditionKey: input.conditionKey,
      expectedValue: payment.conditionValue ?? input.actualValue,
      actualValue: input.actualValue,
      proofData: input.proofData,
      metAt: conditionMet ? timestamp : undefined,
      createdAt: timestamp,
    };

    this.conditions.unshift(condition);
    payment.status = conditionMet ? 'processing' : 'pending';
    payment.events.push({
      id: randomId('evt'),
      label: conditionMet ? 'Condição cumprida' : 'Prova insuficiente',
      description: conditionMet ? 'Pagamento movido para processamento.' : 'Valor reportado ainda não alcançou o threshold.',
      status: conditionMet ? 'current' : 'waiting',
      createdAt: timestamp,
    });

    return delay({ conditionMet, payment, condition });
  }

  async listWebhooks(): Promise<Webhook[]> {
    return delay(this.webhooks);
  }

  async createWebhook(input: Pick<Webhook, 'url' | 'events'>): Promise<Webhook & { secret: string }> {
    const secret = rawKey('whsec');
    const webhook: Webhook = {
      id: randomId('wh'),
      url: input.url,
      events: input.events,
      secretPreview: previewKey(secret),
      active: true,
      createdAt: now(),
      deliveryCount: 0,
      lastDeliveryStatus: 'pending',
    };
    this.webhooks.unshift(webhook);
    return delay({ ...webhook, secret });
  }

  async toggleWebhook(id: string, active: boolean): Promise<Webhook> {
    const webhook = this.findWebhook(id);
    webhook.active = active;
    return delay(webhook);
  }

  async testWebhook(id: string): Promise<WebhookTestResult> {
    const webhook = this.findWebhook(id);
    const timestamp = now();
    const delivery: WebhookDelivery = {
      id: randomId('wd'),
      webhookId: webhook.id,
      event: 'webhook.test',
      payload: {
        id: randomId('test'),
        type: 'webhook.test',
        created_at: timestamp,
      },
      status: 'delivered',
      attempts: 1,
      responseCode: 200,
      deliveredAt: timestamp,
      createdAt: timestamp,
    };
    webhook.deliveryCount += 1;
    webhook.lastDeliveryStatus = delivery.status;
    this.deliveries.unshift(delivery);
    return delay({
      webhookId: webhook.id,
      status: delivery.status,
      responseCode: 200,
      latencyMs: 86,
      signedPayloadPreview: `t=${Date.now()},v1=${stellarHash().slice(0, 24)}`,
      delivery,
    });
  }

  async deleteWebhook(id: string): Promise<void> {
    this.findWebhook(id);
    this.webhooks = this.webhooks.filter((webhook) => webhook.id !== id);
    this.deliveries = this.deliveries.filter((delivery) => delivery.webhookId !== id);
    return delay(undefined);
  }

  async listWebhookDeliveries(webhookId?: string): Promise<WebhookDelivery[]> {
    const deliveries = webhookId ? this.deliveries.filter((delivery) => delivery.webhookId === webhookId) : this.deliveries;
    return delay(deliveries);
  }

  async listApiKeys(): Promise<ApiKey[]> {
    return delay(this.apiKeys);
  }

  async createApiKey(input: Pick<ApiKey, 'name' | 'scopes' | 'expiresAt'>): Promise<ApiKeyResult> {
    const raw = rawKey();
    const apiKey: ApiKey = {
      id: randomId('key'),
      name: input.name,
      keyPreview: previewKey(raw),
      scopes: input.scopes,
      status: 'active',
      expiresAt: input.expiresAt,
      createdAt: now(),
    };
    this.apiKeys.unshift(apiKey);
    return delay({ apiKey, rawKey: raw });
  }

  async revokeApiKey(id: string): Promise<ApiKey> {
    const apiKey = this.findApiKey(id);
    apiKey.status = 'revoked';
    return delay(apiKey);
  }

  async listMcpTools(): Promise<McpTool[]> {
    return delay(mcpTools);
  }

  async getMcpAgentConfig(): Promise<McpAgentConfig> {
    return delay(buildMcpAgentConfig());
  }

  async simulateMcpTool(toolName: string, input: Record<string, unknown>): Promise<McpSimulationResult> {
    return delay({
      simulated: true,
      toolName,
      output: {
        mock_payment_id: randomId('sim'),
        mock_stellar_hash: `SIM_${stellarHash().slice(0, 18)}`,
        estimated_fee_xlm: '0.00001',
        estimated_settlement_seconds: 4,
        network: 'testnet',
        input,
      },
      createdAt: now(),
    });
  }

  async getX402Challenge(resource: string): Promise<X402Challenge> {
    const nonce = randomId('nonce');
    const payTo = this.devices[1]?.stellarPublicKey ?? stellarKey();
    const rule = this.x402Rules.find((item) => item.resource === resource && item.enabled);
    const amount = rule?.amount ?? '0.0500000';
    const asset = rule?.asset ?? 'USDC:GATESTUSDCISSUER';
    const maxTimeout = rule?.maxTimeout ?? 300;
    return delay({
      status: 402,
      resource,
      scheme: 'stellar',
      network: 'testnet',
      payTo,
      amount,
      asset,
      maxTimeout,
      nonce,
      requiredHeader: `scheme=stellar,network=testnet,payTo=${payTo},amount=${amount},asset=${asset},maxTimeout=${maxTimeout},nonce=${nonce}`,
    });
  }

  async payX402Challenge(nonce: string): Promise<X402PaidResponse> {
    const envelope = {
      scheme: 'stellar',
      network: 'testnet',
      nonce,
      timestamp: now(),
      txXDR: `AAAA_${stellarHash()}`,
    };
    return delay({
      status: 200,
      paymentHeader: btoa(JSON.stringify(envelope)),
      data: {
        reading: 'premium sensor reading',
        carbon_intensity_gco2_kwh: 185,
        timestamp: now(),
      },
    });
  }

  async listX402PricingRules(): Promise<X402PricingRule[]> {
    return delay(this.x402Rules);
  }

  async upsertX402PricingRule(input: X402PricingRuleInput): Promise<X402PricingRule> {
    const existing = this.x402Rules.find((rule) => rule.resource === input.resource);
    const updated: X402PricingRule = {
      id: existing?.id ?? randomId('x402'),
      ...input,
      updatedAt: now(),
    };
    if (existing) {
      Object.assign(existing, updated);
    } else {
      this.x402Rules.unshift(updated);
    }
    return delay(updated);
  }

  async listWorkflows(): Promise<Workflow[]> {
    return delay(workflows);
  }

  async listDeployChecks(): Promise<DeployCheck[]> {
    return delay(deployChecks);
  }

  async listDeployServices(): Promise<DeployServiceStatus[]> {
    return delay(deployServices);
  }

  private findDevice(id: string): Device {
    const device = this.devices.find((item) => item.id === id);
    if (!device) {
      throw new Error(`Device not found: ${id}`);
    }
    return device;
  }

  private findPayment(id: string): Payment {
    const payment = this.payments.find((item) => item.id === id);
    if (!payment) {
      throw new Error(`Payment not found: ${id}`);
    }
    return payment;
  }

  private findWebhook(id: string): Webhook {
    const webhook = this.webhooks.find((item) => item.id === id);
    if (!webhook) {
      throw new Error(`Webhook not found: ${id}`);
    }
    return webhook;
  }

  private findApiKey(id: string): ApiKey {
    const apiKey = this.apiKeys.find((item) => item.id === id);
    if (!apiKey) {
      throw new Error(`API key not found: ${id}`);
    }
    return apiKey;
  }
}

type Fetcher = typeof fetch;

export interface CreateKivoClientOptions {
  mode?: 'mock' | 'http';
  baseUrl?: string;
  getToken?: () => Promise<string | undefined> | string | undefined;
  fetcher?: Fetcher;
}

export class HttpKivoApiClient implements KivoApiClient {
  public readonly baseUrl: string;

  private readonly getToken?: CreateKivoClientOptions['getToken'];
  private readonly fetcher: Fetcher;

  constructor(options: Omit<CreateKivoClientOptions, 'mode'> = {}) {
    this.baseUrl = options.baseUrl ?? '/api';
    this.getToken = options.getToken;
    this.fetcher = options.fetcher ?? fetch.bind(globalThis);
  }

  async getDashboardSummary(): Promise<DashboardSummary> {
    return this.request('/v1/dashboard');
  }

  async getHealth(): Promise<SystemHealth> {
    return this.request('/v1/health');
  }

  async listDevices(): Promise<Device[]> {
    return this.request('/v1/devices');
  }

  async getDevice(id: string): Promise<DeviceRegistrationResult> {
    return this.request(`/v1/devices/${encodeURIComponent(id)}`);
  }

  async registerDevice(input: RegisterDeviceInput): Promise<DeviceRegistrationResult> {
    return this.request('/v1/devices', { method: 'POST', body: JSON.stringify(input) });
  }

  async updateDeviceStatus(id: string, status: Device['status']): Promise<Device> {
    return this.request(`/v1/devices/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify({ status }) });
  }

  async listPayments(): Promise<Payment[]> {
    return this.request('/v1/payments');
  }

  async getPayment(id: string): Promise<Payment> {
    return this.request(`/v1/payments/${encodeURIComponent(id)}`);
  }

  async createPayment(input: CreatePaymentInput): Promise<Payment> {
    return this.request('/v1/payments', { method: 'POST', body: JSON.stringify(input) });
  }

  async executePayment(id: string): Promise<Payment> {
    return this.request(`/v1/payments/${encodeURIComponent(id)}/execute`, { method: 'POST' });
  }

  async submitConditionProof(id: string, input: ConditionProofInput): Promise<ConditionProofResult> {
    return this.request(`/v1/payments/${encodeURIComponent(id)}/condition-proof`, { method: 'POST', body: JSON.stringify(input) });
  }

  async listWebhooks(): Promise<Webhook[]> {
    return this.request('/v1/webhooks');
  }

  async createWebhook(input: Pick<Webhook, 'url' | 'events'>): Promise<Webhook & { secret: string }> {
    return this.request('/v1/webhooks', { method: 'POST', body: JSON.stringify(input) });
  }

  async toggleWebhook(id: string, active: boolean): Promise<Webhook> {
    return this.request(`/v1/webhooks/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify({ active }) });
  }

  async testWebhook(id: string): Promise<WebhookTestResult> {
    return this.request(`/v1/webhooks/${encodeURIComponent(id)}/test`, { method: 'POST' });
  }

  async deleteWebhook(id: string): Promise<void> {
    return this.request(`/v1/webhooks/${encodeURIComponent(id)}`, { method: 'DELETE' });
  }

  async listWebhookDeliveries(webhookId?: string): Promise<WebhookDelivery[]> {
    const path = webhookId ? `/v1/webhooks/${encodeURIComponent(webhookId)}/deliveries` : '/v1/webhook-deliveries';
    return this.request(path);
  }

  async listApiKeys(): Promise<ApiKey[]> {
    return this.request('/v1/api-keys');
  }

  async createApiKey(input: Pick<ApiKey, 'name' | 'scopes' | 'expiresAt'>): Promise<ApiKeyResult> {
    return this.request('/v1/api-keys', { method: 'POST', body: JSON.stringify(input) });
  }

  async revokeApiKey(id: string): Promise<ApiKey> {
    return this.request(`/v1/api-keys/${encodeURIComponent(id)}/revoke`, { method: 'POST' });
  }

  async listMcpTools(): Promise<McpTool[]> {
    return this.request('/v1/mcp/tools');
  }

  async getMcpAgentConfig(): Promise<McpAgentConfig> {
    return this.request('/v1/mcp/config');
  }

  async simulateMcpTool(toolName: string, input: Record<string, unknown>): Promise<McpSimulationResult> {
    return this.request(`/v1/mcp/tools/${encodeURIComponent(toolName)}/simulate`, { method: 'POST', body: JSON.stringify(input) });
  }

  async getX402Challenge(resource: string): Promise<X402Challenge> {
    return this.request(`/v1/x402/challenge?resource=${encodeURIComponent(resource)}`);
  }

  async payX402Challenge(nonce: string): Promise<X402PaidResponse> {
    return this.request('/v1/x402/pay', { method: 'POST', body: JSON.stringify({ nonce }) });
  }

  async listX402PricingRules(): Promise<X402PricingRule[]> {
    return this.request('/v1/x402/pricing-rules');
  }

  async upsertX402PricingRule(input: X402PricingRuleInput): Promise<X402PricingRule> {
    return this.request('/v1/x402/pricing-rules', { method: 'PUT', body: JSON.stringify(input) });
  }

  async listWorkflows(): Promise<Workflow[]> {
    return this.request('/v1/workflows');
  }

  async listDeployChecks(): Promise<DeployCheck[]> {
    return this.request('/v1/deploy/checks');
  }

  async listDeployServices(): Promise<DeployServiceStatus[]> {
    return this.request('/v1/deploy/services');
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await this.getToken?.();
    const headers = new Headers(init.headers);
    if (!headers.has('Content-Type') && init.body) {
      headers.set('Content-Type', 'application/json');
    }
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await this.fetcher(this.resolveUrl(path), {
      ...init,
      headers,
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `Kivo API error ${response.status}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  }

  private resolveUrl(path: string): string {
    if (/^https?:\/\//.test(path)) {
      return path;
    }
    if (/^https?:\/\//.test(this.baseUrl)) {
      return new URL(path, `${this.baseUrl.replace(/\/$/, '')}/`).toString();
    }
    return `${this.baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }
}

export const createKivoClient = (options: CreateKivoClientOptions = {}): KivoApiClient => {
  const envMode = import.meta.env.VITE_KIVO_API_MODE as 'mock' | 'http' | undefined;
  const envBaseUrl = import.meta.env.VITE_KIVO_API_URL as string | undefined;
  const mode = options.mode ?? (envMode === 'http' || envBaseUrl ? 'http' : 'mock');

  if (mode === 'http') {
    return new HttpKivoApiClient({
      baseUrl: options.baseUrl ?? envBaseUrl ?? '/api',
      getToken: options.getToken,
      fetcher: options.fetcher,
    });
  }

  return new MockKivoApiClient();
};

export const kivoClient: KivoApiClient = createKivoClient();
