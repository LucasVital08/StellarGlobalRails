import { Icon } from '@iconify/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores';

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('operator@kivo.pay');
  const [password, setPassword] = useState('demo123');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await login(email, password);
    const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';
    navigate(from, { replace: true });
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.16),transparent_28rem)]" />
      <form onSubmit={submit} className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-neutral-900/80 p-8 premium-shadow">
        <div className="mb-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-black">
            <Icon icon="solar:wallet-money-bold" className="text-2xl" />
          </div>
          <h1 className="font-bricolage text-3xl font-bold">Entrar no Kivo</h1>
          <p className="mt-2 text-sm text-neutral-400">Sessão mockada pronta para trocar por Supabase Auth.</p>
        </div>
        <div className="space-y-4">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Email</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500" />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Senha</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500" />
          </label>
        </div>
        <button type="submit" className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">
          Acessar console
          <Icon icon="solar:arrow-right-bold" />
        </button>
        <div className="mt-5 flex items-center justify-between text-xs text-neutral-500">
          <Link to="/register" className="hover:text-white">Criar conta</Link>
          <Link to="/forgot-password" className="hover:text-white">Recuperar senha</Link>
        </div>
      </form>
    </main>
  );
}
