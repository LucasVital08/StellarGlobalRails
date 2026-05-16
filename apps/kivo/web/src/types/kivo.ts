export type DeviceStatus = 'active' | 'suspended' | 'decommissioned';
export type PaymentStatus = 'pending' | 'processing' | 'confirmed' | 'failed' | 'expired' | 'refunded';
export type ConditionType = 'none' | 'energy_kwh' | 'time_elapsed' | 'service_complete' | 'custom';
export type AssetCode = 'USDC' | 'XLM';
export type ApiHealth = 'ok' | 'degraded' | 'down';

export interface AssetBalance {
  assetCode: AssetCode;
  amount: string;
}

export interface Device {
  id: string;
  name: string;
  ownerId: string;
  apiKeyPreview: string;
  stellarPublicKey: string;
  status: DeviceStatus;
  metadata: Record<string, string>;
  balances: AssetBalance[];
  createdAt: string;
  updatedAt: string;
}

export interface RegisterDeviceInput {
  name: string;
  metadata?: Record<string, string>;
}

export interface DeviceRegistrationResult {
  device: Device;
  apiKey?: string;
}

export interface PaymentCondition {
  id: string;
  paymentId: string;
  conditionKey: ConditionType;
  expectedValue: string;
  actualValue?: string;
  proofData: Record<string, unknown>;
  metAt?: string;
  createdAt: string;
}

export interface PaymentEvent {
  id: string;
  label: string;
  description: string;
  status: 'done' | 'current' | 'failed' | 'waiting';
  createdAt: string;
}

export interface Payment {
  id: string;
  fromDeviceId: string;
  toDeviceId: string;
  amount: string;
  assetCode: AssetCode;
  assetIssuer?: string;
  conditionType: ConditionType;
  conditionValue?: string;
  status: PaymentStatus;
  stellarHash?: string;
  stellarLedger?: number;
  memo?: string;
  timeoutAt?: string;
  createdAt: string;
  confirmedAt?: string;
  failedReason?: string;
  feeCharged?: string;
  events: PaymentEvent[];
}

export interface CreatePaymentInput {
  fromDeviceId: string;
  toDeviceId: string;
  amount: string;
  assetCode: AssetCode;
  conditionType: ConditionType;
  conditionValue?: string;
  timeoutSeconds?: number;
  memo?: string;
}

export interface ConditionProofInput {
  conditionKey: ConditionType;
  actualValue: string;
  proofData: Record<string, unknown>;
}

export interface ConditionProofResult {
  conditionMet: boolean;
  payment: Payment;
  condition: PaymentCondition;
}

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  secretPreview: string;
  active: boolean;
  createdAt: string;
  deliveryCount: number;
  lastDeliveryStatus: 'delivered' | 'failed' | 'pending';
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  paymentId?: string;
  event: string;
  payload: Record<string, unknown>;
  status: 'pending' | 'delivered' | 'failed';
  attempts: number;
  responseCode?: number;
  nextRetryAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

export interface WebhookTestResult {
  webhookId: string;
  status: WebhookDelivery['status'];
  responseCode: number;
  latencyMs: number;
  signedPayloadPreview: string;
  delivery: WebhookDelivery;
}

export interface ApiKey {
  id: string;
  name: string;
  keyPreview: string;
  scopes: string[];
  status: 'active' | 'expired' | 'revoked';
  lastUsedAt?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface ApiKeyResult {
  apiKey: ApiKey;
  rawKey?: string;
}

export interface McpTool {
  id: string;
  name: string;
  title: string;
  description: string;
  safeForAutoUse: boolean;
  inputSchema: Record<string, unknown>;
  exampleInput: Record<string, unknown>;
}

export interface McpSimulationResult {
  simulated: boolean;
  toolName: string;
  output: Record<string, unknown>;
  createdAt: string;
}

export interface McpAgentConfig {
  server: {
    name: string;
    transport: 'http' | 'stdio';
    url: string;
  };
  env: Record<string, string>;
  tools: string[];
  approvalPolicy: {
    autoApproveSafeTools: boolean;
    maxAutoPaymentAmount: string;
    requireHumanFor: string[];
  };
  sampleConfig: Record<string, unknown>;
}

export interface X402Challenge {
  status: 402;
  resource: string;
  scheme: 'stellar';
  network: 'testnet' | 'mainnet';
  payTo: string;
  amount: string;
  asset: string;
  maxTimeout: number;
  nonce: string;
  requiredHeader: string;
}

export interface X402PaidResponse {
  status: 200;
  paymentHeader: string;
  data: Record<string, unknown>;
}

export interface X402PricingRule {
  id: string;
  resource: string;
  amount: string;
  asset: string;
  maxTimeout: number;
  enabled: boolean;
  description?: string;
  updatedAt: string;
}

export type X402PricingRuleInput = Omit<X402PricingRule, 'id' | 'updatedAt'>;

export interface WorkflowStep {
  id: string;
  label: string;
  status: 'done' | 'running' | 'queued' | 'failed' | 'future';
  description: string;
}

export interface Workflow {
  id: string;
  name: string;
  type: 'payment_worker' | 'webhook_worker' | 'x402_settlement' | 'temporal_future';
  status: 'healthy' | 'delayed' | 'paused' | 'future';
  engine: 'redis-worker' | 'temporal-future';
  trigger: string;
  relatedPaymentId?: string;
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
}

export interface SystemHealth {
  api: ApiHealth;
  db: ApiHealth;
  redis: ApiHealth;
  stellar: ApiHealth;
  mcp: ApiHealth;
  version: string;
}

export interface DeployCheck {
  id: string;
  label: string;
  scope: 'frontend' | 'api' | 'workers' | 'stellar' | 'security';
  status: 'ready' | 'warning' | 'blocked';
  description: string;
  owner: string;
  value?: string;
}

export interface DeployServiceStatus {
  id: string;
  name: string;
  environment: 'local' | 'staging' | 'production';
  status: 'online' | 'degraded' | 'offline' | 'planned';
  region?: string;
  url?: string;
  description: string;
  updatedAt: string;
}

export interface DashboardSummary {
  totalDevices: number;
  activeDevices: number;
  totalVolumeUsdc: number;
  confirmedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  health: SystemHealth;
}
