import { Icon } from '@iconify/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores';

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login(email, password);
      const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';
      navigate(from, { replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Nao foi possivel entrar.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950 p-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.16),transparent_28rem)]" />
      <form onSubmit={submit} className="premium-shadow relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-neutral-900/80 p-8">
        <div className="mb-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-black">
            <Icon icon="solar:wallet-money-bold" className="text-2xl" />
          </div>
          <h1 className="font-bricolage text-3xl font-bold">Entrar no Kivo</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Sessao conectada ao Supabase Auth. Sem fallback local.
          </p>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Email</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500"
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Senha</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500"
            />
          </label>
        </div>

        {error ? <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-200">{error}</div> : null}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-60"
        >
          {submitting ? 'Entrando...' : 'Acessar console'}
          <Icon icon="solar:arrow-right-bold" />
        </button>
        <div className="mt-5 flex items-center justify-between text-xs text-neutral-500">
          <Link to="/register" className="hover:text-white">
            Criar conta
          </Link>
          <Link to="/forgot-password" className="hover:text-white">
            Recuperar senha
          </Link>
        </div>
      </form>
    </main>
  );
}
