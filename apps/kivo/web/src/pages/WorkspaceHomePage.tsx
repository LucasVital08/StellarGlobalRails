import { Icon } from '@iconify/react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { deriveSoloFlows, soloMvpTemplates } from '@/data/soloMvp';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';
import { useAuthStore } from '@/stores';
import { formatCurrency, formatDateTime, shortId, statusLabel } from '@/utils/format';

const apiTone = {
  ok: 'emerald',
  degraded: 'amber',
  down: 'red',
} as const;

const flowTone = {
  active: 'active',
  needs_setup: 'warning',
  testing: 'processing',
  draft: 'paused',
  failed: 'failed',
} as const;

const integrationLabels = {
  gateway_sdk: 'Gateway SDK',
  api_middleware: 'API middleware',
  data_feed: 'Data feed',
} as const;

const sortByNewest = (left?: string, right?: string) => {
  const leftTime = left ? Date.parse(left) : 0;
  const rightTime = right ? Date.parse(right) : 0;

  return rightTime - leftTime;
};

const flowStatusLabel = (status: keyof typeof flowTone) => {
  if (status === 'needs_setup') {
    return statusLabel('warning');
  }

  if (status === 'testing') {
    return statusLabel('processing');
  }

  return statusLabel(status);
};

export default function WorkspaceHomePage() {
  const user = useAuthStore((state) => state.user);
  const summary = useAsyncData(() => kivoClient.getDashboardSummary(), []);
  const payments = useAsyncData(() => kivoClient.listPayments(), []);
  const devices = useAsyncData(() => kivoClient.listDevices(), []);
  const pricingRules = useAsyncData(() => kivoClient.listX402PricingRules(), []);

  const workspaceName = user?.organization?.trim() || 'Kivo workspace';
  const summaryData = summary.data;
  const paymentData = payments.data ?? [];
  const deviceData = devices.data ?? [];
  const pricingRuleData = pricingRules.data ?? [];

  const flows = useMemo(
    () =>
      deriveSoloFlows({
        devices: deviceData,
        payments: paymentData,
        pricingRules: pricingRuleData,
      }).sort((left, right) => sortByNewest(left.lastActivityAt, right.lastActivityAt)),
    [deviceData, paymentData, pricingRuleData],
  );

  const activeFlows = flows.filter((flow) => flow.status === 'active');
  const recentFlows = flows.slice(0, 4);
  const recentPayments = [...paymentData]
    .sort((left, right) => sortByNewest(left.createdAt, right.createdAt))
    .slice(0, 4);
  const completedSetupItems = flows.reduce(
    (total, flow) => total + flow.setupChecklist.filter((item) => item.complete).length,
    0,
  );
  const totalSetupItems = flows.reduce((total, flow) => total + flow.setupChecklist.length, 0);
  const setupComplete = totalSetupItems > 0 && completedSetupItems === totalSetupItems;
  const apiStatus = summaryData?.health.api ?? 'degraded';
  const apiLabelStatus = apiStatus === 'ok' ? 'online' : apiStatus;
  const hasFlows = flows.length > 0;
  const hasPayments = paymentData.length > 0;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Solo workspace"
        title={`Monetize seu primeiro recurso no ${workspaceName}`}
        icon="solar:home-angle-bold-duotone"
        description="Crie um flow, teste um pagamento x402 real e acompanhe receita sem entrar em detalhes de protocolo."
        action={
          <Link
            to="/create-flow"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black transition hover:bg-emerald-400"
          >
            Create Flow
            <Icon icon="solar:add-circle-bold-duotone" className="text-lg" />
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Flows ativos"
          value={activeFlows.length.toString()}
          detail={`${flows.length} flows no total`}
          icon="solar:bolt-circle-bold-duotone"
          tone="emerald"
        />
        <StatCard
          title="Receita"
          value={formatCurrency(summaryData?.totalVolumeUsdc ?? 0)}
          detail={`${summaryData?.confirmedPayments ?? 0} pagamentos confirmados`}
          icon="solar:wallet-money-bold-duotone"
          tone="blue"
        />
        <StatCard
          title="Pagamentos"
          value={(summaryData?.confirmedPayments ?? 0).toString()}
          detail={`${summaryData?.pendingPayments ?? 0} pendentes`}
          icon="solar:card-transfer-bold-duotone"
          tone="violet"
        />
        <StatCard
          title="Setup"
          value={totalSetupItems ? `${completedSetupItems}/${totalSetupItems}` : '0/0'}
          detail={setupComplete ? 'Tudo pronto' : 'Próximos checks pendentes'}
          icon="solar:checklist-minimalistic-bold-duotone"
          tone={setupComplete ? 'emerald' : 'amber'}
        />
        <StatCard
          title="API"
          value={statusLabel(apiLabelStatus)}
          detail={`v${summaryData?.health.version ?? 'local'}`}
          icon="solar:server-square-cloud-bold-duotone"
          tone={apiTone[apiStatus]}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-bricolage text-xl font-bold text-white">Comece por um template</h2>
              <p className="mt-1 text-sm leading-6 text-neutral-500">
                Escolha o recurso que voce quer monetizar e crie o flow em poucos passos.
              </p>
            </div>
            <Badge tone="active">Solo MVP</Badge>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {soloMvpTemplates.map((template) => (
              <Link
                key={template.id}
                to="/create-flow"
                className="group rounded-2xl border border-white/5 bg-black/25 p-4 transition hover:border-emerald-400/35 hover:bg-white/[0.04]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
                    <Icon icon={template.icon} className="text-2xl" />
                  </div>
                  <Icon
                    icon="solar:arrow-right-up-linear"
                    className="text-lg text-neutral-600 transition group-hover:text-emerald-300"
                  />
                </div>
                <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-400">
                  {template.category}
                </p>
                <h3 className="mt-2 text-lg font-bold text-white">{template.shortName}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-400">{template.description}</p>
                <p className="mt-4 text-xs font-semibold text-neutral-500">{template.primaryActionLabel}</p>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-bricolage text-xl font-bold text-white">Próximo melhor passo</h2>
              <p className="mt-1 text-sm leading-6 text-neutral-500">
                {hasFlows
                  ? hasPayments
                    ? 'Acompanhe seus flows ativos e ajuste configuracoes avancadas quando precisar escalar.'
                    : 'Seu primeiro flow ja existe. Agora valide a experiencia com um pagamento x402 real.'
                  : 'Crie seu primeiro flow para transformar um device, API ou data feed em recurso pago.'}
              </p>
            </div>
            <Badge tone={hasFlows ? 'ready' : 'warning'}>{hasFlows ? 'Em progresso' : 'Comecar'}</Badge>
          </div>

          <div className="mt-6 space-y-3">
            <Link
              to="/create-flow"
              className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-bold text-white transition hover:border-emerald-400/50"
            >
              <span className="flex items-center gap-3">
                <Icon icon="solar:add-circle-bold-duotone" className="text-xl text-emerald-300" />
                Criar ou editar flow
              </span>
              <Icon icon="solar:arrow-right-linear" className="text-neutral-500" />
            </Link>
            <Link
              to="/checkout"
              className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/25 p-4 text-sm font-bold text-neutral-200 transition hover:border-white/15 hover:bg-white/[0.04]"
            >
              <span className="flex items-center gap-3">
                <Icon icon="solar:card-transfer-bold-duotone" className="text-xl text-blue-300" />
                Testar pagamento x402
              </span>
              <Icon icon="solar:arrow-right-linear" className="text-neutral-500" />
            </Link>
            <Link
              to="/advanced"
              className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/25 p-4 text-sm font-bold text-neutral-200 transition hover:border-white/15 hover:bg-white/[0.04]"
            >
              <span className="flex items-center gap-3">
                <Icon icon="solar:settings-bold-duotone" className="text-xl text-violet-300" />
                Abrir configuracoes avancadas
              </span>
              <Icon icon="solar:arrow-right-linear" className="text-neutral-500" />
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-bricolage text-xl font-bold text-white">Flows recentes</h2>
              <p className="mt-1 text-sm text-neutral-500">Recursos monetizados a partir dos seus devices e regras x402.</p>
            </div>
            <Link to="/flows" className="text-xs font-bold text-emerald-400 hover:text-emerald-300">
              Ver todos
            </Link>
          </div>
          <div className="space-y-3">
            {recentFlows.length ? (
              recentFlows.map((flow) => (
                <Link
                  key={flow.id}
                  to={`/flows/${flow.id}`}
                  className="flex flex-col gap-3 rounded-xl border border-white/5 bg-black/25 p-4 transition hover:bg-white/5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-white">{flow.name}</p>
                      <Badge tone={flowTone[flow.status]}>{flowStatusLabel(flow.status)}</Badge>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                      {integrationLabels[flow.integrationMode]} · {flow.price} USDC/{flow.unit} ·{' '}
                      {formatDateTime(flow.lastActivityAt)}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm font-bold text-emerald-300">{formatCurrency(flow.revenueUsdc)}</p>
                    <p className="mt-1 text-xs text-neutral-500">{flow.paymentsCount} pagamentos</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-white/10 bg-black/25 p-5 text-sm leading-6 text-neutral-500">
                Nenhum flow criado ainda. Comece por um template para publicar seu primeiro recurso pago.
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-bricolage text-xl font-bold text-white">Pagamentos recentes</h2>
              <p className="mt-1 text-sm text-neutral-500">Pagamentos x402 e Stellar que alimentam sua receita.</p>
            </div>
            <Link to="/payments" className="text-xs font-bold text-emerald-400 hover:text-emerald-300">
              Ver todos
            </Link>
          </div>
          <div className="space-y-3">
            {recentPayments.length ? (
              recentPayments.map((payment) => (
                <Link
                  key={payment.id}
                  to={`/payments/${payment.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/25 p-4 transition hover:bg-white/5"
                >
                  <div>
                    <p className="font-mono text-xs text-emerald-400">{shortId(payment.id)}</p>
                    <p className="mt-1 text-sm text-white">
                      {payment.amount} {payment.assetCode} · {formatDateTime(payment.createdAt)}
                    </p>
                    {payment.memo && <p className="mt-1 text-xs text-neutral-500">{payment.memo}</p>}
                  </div>
                  <Badge tone={payment.status}>{statusLabel(payment.status)}</Badge>
                </Link>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-white/10 bg-black/25 p-5 text-sm leading-6 text-neutral-500">
                Nenhum pagamento registrado ainda. Use o checkout para testar o primeiro pagamento real.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
