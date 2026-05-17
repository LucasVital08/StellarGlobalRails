import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { accountScales, personaJourneys } from '@/data/workspaceExperience';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';
import { useAuthStore } from '@/stores';
import { formatCurrency, formatDateTime, shortId, statusLabel } from '@/utils/format';

export default function WorkspaceHomePage() {
  const user = useAuthStore((state) => state.user);
  const summary = useAsyncData(() => kivoClient.getDashboardSummary(), []);
  const payments = useAsyncData(() => kivoClient.listPayments(), []);
  const devices = useAsyncData(() => kivoClient.listDevices(), []);

  const workspaceName = user?.organization?.trim() || 'Kivo workspace';
  const summaryData = summary.data;
  const recentPayments = (payments.data ?? []).slice(0, 4);
  const activeDevices = (devices.data ?? []).filter((device) => device.status === 'active').slice(0, 3);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Workspace"
        title={`Bem-vindo ao ${workspaceName}`}
        icon="solar:home-angle-bold-duotone"
        description="Escolha a jornada certa para operar infraestrutura M2M, cobrar usuarios, integrar APIs ou acompanhar recebiveis."
        action={
          <Link to="/checkout" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">
            Simular checkout
            <Icon icon="solar:card-transfer-bold" />
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Devices" value={(summaryData?.totalDevices ?? 0).toString()} detail={`${summaryData?.activeDevices ?? 0} ativos`} icon="solar:devices-bold-duotone" />
        <StatCard title="Volume" value={formatCurrency(summaryData?.totalVolumeUsdc ?? 0)} icon="solar:wallet-money-bold-duotone" tone="blue" />
        <StatCard title="Confirmados" value={(summaryData?.confirmedPayments ?? 0).toString()} icon="solar:check-circle-bold-duotone" tone="emerald" />
        <StatCard title="Pendentes" value={(summaryData?.pendingPayments ?? 0).toString()} icon="solar:hourglass-bold-duotone" tone="amber" />
        <StatCard title="Falhas" value={(summaryData?.failedPayments ?? 0).toString()} icon="solar:danger-circle-bold-duotone" tone="red" />
      </div>

      <div className="grid gap-5 xl:grid-cols-4">
        {personaJourneys.map((persona) => (
          <Link key={persona.id} to={persona.primaryRoute} className="group rounded-2xl border border-white/5 bg-neutral-900/80 p-5 premium-shadow transition-colors hover:border-emerald-500/30 hover:bg-neutral-900">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <Icon icon={persona.icon} className="text-2xl" />
              </div>
              <Icon icon="solar:arrow-right-up-linear" className="text-neutral-600 transition-colors group-hover:text-emerald-400" />
            </div>
            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400">{persona.role}</p>
            <h2 className="mt-2 font-bricolage text-xl font-bold text-white">{persona.label}</h2>
            <p className="mt-3 min-h-20 text-sm leading-6 text-neutral-400">{persona.description}</p>
            <div className="mt-5 space-y-2">
              {persona.jobs.map((job) => (
                <div key={job} className="flex items-center gap-2 text-xs text-neutral-300">
                  <Icon icon="solar:check-circle-bold" className="text-emerald-400" />
                  <span>{job}</span>
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="font-bricolage text-xl font-bold text-white">Escala do workspace</h2>
              <p className="mt-1 text-sm text-neutral-500">O mesmo produto precisa servir solo, equipe pequena e operacao grande.</p>
            </div>
            <Link to="/team" className="text-xs font-bold text-emerald-400 hover:text-emerald-300">Ver time</Link>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {accountScales.map((scale) => (
              <div key={scale.id} className="rounded-2xl border border-white/5 bg-black/25 p-4">
                <div className="flex items-center justify-between gap-3">
                  <Icon icon={scale.icon} className="text-2xl text-emerald-400" />
                  <Badge tone={scale.id === 'solo' ? 'ready' : 'planned'}>{scale.id === 'solo' ? 'ativo' : 'readiness'}</Badge>
                </div>
                <h3 className="mt-4 font-bold text-white">{scale.label}</h3>
                <p className="mt-2 text-xs leading-5 text-neutral-500">{scale.description}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-bricolage text-xl font-bold text-white">Fluxo da demo</h2>
              <p className="mt-1 text-sm text-neutral-500">Uma historia que passa por todas as personas.</p>
            </div>
            <Badge tone="active">MVP</Badge>
          </div>
          <div className="mt-5 space-y-3">
            {['Operador cadastra device', 'Usuario paga via x402', 'Integrador recebe webhook', 'Financeiro concilia USDC'].map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-xl bg-black/30 p-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-xs font-bold text-black">{index + 1}</span>
                <span className="text-sm text-neutral-300">{step}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-bricolage text-xl font-bold text-white">Devices em destaque</h2>
              <p className="text-sm text-neutral-500">Ativos que sustentam a experiencia do usuario final.</p>
            </div>
            <Link to="/operations" className="text-xs font-bold text-emerald-400">Operar</Link>
          </div>
          <div className="space-y-3">
            {activeDevices.length ? activeDevices.map((device) => (
              <Link key={device.id} to={`/devices/${device.id}`} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/25 p-3 hover:bg-white/5">
                <div>
                  <p className="font-medium text-white">{device.name}</p>
                  <p className="mt-1 text-xs text-neutral-500">{device.metadata.location ?? 'sem local'} - {shortId(device.stellarPublicKey, 8, 6)}</p>
                </div>
                <Badge tone={device.status}>{statusLabel(device.status)}</Badge>
              </Link>
            )) : <p className="rounded-xl border border-white/5 bg-black/25 p-4 text-sm text-neutral-500">Nenhum device ativo ainda.</p>}
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-bricolage text-xl font-bold text-white">Pagamentos recentes</h2>
              <p className="text-sm text-neutral-500">O mesmo ledger visto por operador, usuario e financeiro.</p>
            </div>
            <Link to="/finance" className="text-xs font-bold text-emerald-400">Financeiro</Link>
          </div>
          <div className="space-y-3">
            {recentPayments.length ? recentPayments.map((payment) => (
              <Link key={payment.id} to={`/payments/${payment.id}`} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/25 p-3 hover:bg-white/5">
                <div>
                  <p className="font-mono text-xs text-emerald-400">{shortId(payment.id)}</p>
                  <p className="mt-1 text-sm text-white">{payment.amount} {payment.assetCode} - {formatDateTime(payment.createdAt)}</p>
                </div>
                <Badge tone={payment.status}>{statusLabel(payment.status)}</Badge>
              </Link>
            )) : <p className="rounded-xl border border-white/5 bg-black/25 p-4 text-sm text-neutral-500">Nenhum pagamento registrado ainda.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
