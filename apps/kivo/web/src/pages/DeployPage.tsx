import { Icon } from '@iconify/react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';
import { formatDateTime, statusLabel } from '@/utils/format';

const envTemplate = `VITE_KIVO_API_MODE=mock
VITE_KIVO_API_URL=https://api.kivo.example
KIVO_NETWORK=testnet
KIVO_STELLAR_HORIZON=https://horizon-testnet.stellar.org
KIVO_REDIS_URL=redis://localhost:6379`;

const releaseCommands = `npm install
npm run lint
npm test
npm run build`;

const scopeIcon: Record<string, string> = {
  frontend: 'solar:monitor-bold-duotone',
  api: 'solar:server-square-cloud-bold-duotone',
  workers: 'solar:queue-bold-duotone',
  stellar: 'solar:star-fall-bold-duotone',
  security: 'solar:shield-check-bold-duotone',
};

export default function DeployPage() {
  const checks = useAsyncData(() => kivoClient.listDeployChecks(), []);
  const services = useAsyncData(() => kivoClient.listDeployServices(), []);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Release ops"
        title="Deploy readiness"
        icon="solar:rocket-bold-duotone"
        description="Checklist operacional para publicar o front MVP e plugar a API Go quando ela chegar."
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <h2 className="font-bricolage text-xl font-bold text-white">Checklist MVP</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {(checks.data ?? []).map((check) => (
              <div key={check.id} className="rounded-xl border border-white/5 bg-black/25 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-emerald-300">
                      <Icon icon={scopeIcon[check.scope] ?? 'solar:check-circle-bold'} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-white">{check.label}</p>
                      <p className="text-xs text-neutral-500">{check.owner}</p>
                    </div>
                  </div>
                  <Badge tone={check.status}>{statusLabel(check.status)}</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-neutral-400">{check.description}</p>
                {check.value && <p className="mt-2 break-all font-mono text-xs text-emerald-300">{check.value}</p>}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bricolage text-xl font-bold text-white">Env template</h2>
            <CopyButton value={envTemplate} label="Copiar" />
          </div>
          <pre className="mt-4 overflow-auto rounded-xl border border-white/10 bg-black/50 p-4 text-xs text-emerald-100">{envTemplate}</pre>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bricolage text-xl font-bold text-white">Release commands</h2>
            <CopyButton value={releaseCommands} label="Copiar" />
          </div>
          <pre className="mt-4 overflow-auto rounded-xl border border-white/10 bg-black/50 p-4 text-xs text-blue-100">{releaseCommands}</pre>
        </Card>

        <Card className="xl:col-span-2">
          <h2 className="font-bricolage text-xl font-bold text-white">Servicos</h2>
          <div className="mt-4 divide-y divide-white/5">
            {(services.data ?? []).map((service) => (
              <div key={service.id} className="py-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-bold text-white">{service.name}</p>
                    <p className="mt-1 text-sm text-neutral-500">{service.description}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={service.status}>{statusLabel(service.status)}</Badge>
                    <Badge>{service.environment}</Badge>
                  </div>
                </div>
                <div className="mt-3 flex flex-col gap-2 text-xs text-neutral-600 md:flex-row md:items-center md:justify-between">
                  <span>{service.region ?? 'sem regiao'} · atualizado {formatDateTime(service.updatedAt)}</span>
                  {service.url && <span className="break-all font-mono text-emerald-300">{service.url}</span>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
