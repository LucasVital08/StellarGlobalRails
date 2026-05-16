import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAuthStore, useUIStore } from '@/stores';

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const environment = useUIStore((state) => state.environment);

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Workspace" title="Configurações" icon="solar:settings-bold-duotone" description="Preferencias locais do console e pontos de troca para Supabase/API real." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-bricolage text-xl font-bold text-white">Conta mockada</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 rounded-xl bg-black/25 p-3"><span className="text-neutral-500">Nome</span><span className="text-right text-white">{user?.name}</span></div>
            <div className="flex justify-between gap-4 rounded-xl bg-black/25 p-3"><span className="text-neutral-500">Email</span><span className="break-all text-right text-white">{user?.email}</span></div>
            <div className="flex justify-between gap-4 rounded-xl bg-black/25 p-3"><span className="text-neutral-500">Workspace</span><span className="text-right text-white">{user?.organization}</span></div>
          </div>
        </Card>
        <Card>
          <h2 className="font-bricolage text-xl font-bold text-white">Ambiente</h2>
          <p className="mt-3 text-sm text-neutral-400">O v1 roda em mock API-ready. A troca futura para API real usa env vars e o mesmo contrato KivoApiClient.</p>
          <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-300">Ambiente atual: {environment}</div>
          <div className="mt-4 grid gap-3 text-sm">
            <div className="rounded-xl bg-black/25 p-3">
              <p className="text-neutral-500">VITE_KIVO_API_MODE</p>
              <p className="mt-1 font-mono text-xs text-white">mock | http</p>
            </div>
            <div className="rounded-xl bg-black/25 p-3">
              <p className="text-neutral-500">VITE_KIVO_API_URL</p>
              <p className="mt-1 break-all font-mono text-xs text-white">https://api.kivo.example</p>
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
