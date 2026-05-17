import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { WorkspaceContextBanner } from '@/components/WorkspaceContextBanner';
import { useAuthStore, useUIStore } from '@/stores';

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const environment = useUIStore((state) => state.environment);
  const apiUrl = import.meta.env.VITE_KIVO_API_URL || 'nao configurado';
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'nao configurado';

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Workspace" title="Configuracoes" icon="solar:settings-bold-duotone" description="Preferencias locais do console e integracoes reais obrigatorias do Kivo." />
      <WorkspaceContextBanner
        eyebrow="Conta e ambiente"
        title="Configuracoes como painel de workspace"
        icon="solar:settings-bold-duotone"
        tone="ready"
        description="Esta tela deixa de ser so variavel de ambiente: ela mostra quem esta no workspace, qual ambiente esta ativo e onde conferir readiness."
        checkpoints={['Usuario autenticado', 'Ambiente testnet/mainnet', 'API e Supabase conectados']}
        primaryAction={{ to: '/team', label: 'Time e escala' }}
        secondaryAction={{ to: '/deploy', label: 'Checklist deploy' }}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-bricolage text-xl font-bold text-white">Conta Supabase</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 rounded-xl bg-black/25 p-3"><span className="text-neutral-500">Nome</span><span className="text-right text-white">{user?.name}</span></div>
            <div className="flex justify-between gap-4 rounded-xl bg-black/25 p-3"><span className="text-neutral-500">Email</span><span className="break-all text-right text-white">{user?.email}</span></div>
            <div className="flex justify-between gap-4 rounded-xl bg-black/25 p-3"><span className="text-neutral-500">Workspace</span><span className="text-right text-white">{user?.organization}</span></div>
          </div>
        </Card>
        <Card>
          <h2 className="font-bricolage text-xl font-bold text-white">Ambiente</h2>
          <p className="mt-3 text-sm text-neutral-400">O console usa API HTTP, Supabase Auth, Postgres, Horizon e Etherfuse sem fallback mock silencioso.</p>
          <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-300">Ambiente atual: {environment}</div>
          <div className="mt-4 grid gap-3 text-sm">
            <div className="rounded-xl bg-black/25 p-3">
              <p className="text-neutral-500">VITE_KIVO_API_URL</p>
              <p className="mt-1 break-all font-mono text-xs text-white">{apiUrl}</p>
            </div>
            <div className="rounded-xl bg-black/25 p-3">
              <p className="text-neutral-500">VITE_SUPABASE_URL</p>
              <p className="mt-1 break-all font-mono text-xs text-white">{supabaseUrl}</p>
            </div>
          </div>
          <Link to="/deploy" className="mt-4 inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-neutral-300 transition-colors hover:bg-white/10 hover:text-white">
            Abrir checklist de deploy
          </Link>
        </Card>
      </div>
    </div>
  );
}
