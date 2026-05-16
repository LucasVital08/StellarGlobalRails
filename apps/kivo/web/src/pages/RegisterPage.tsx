import { Icon } from '@iconify/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores';

export default function RegisterPage() {
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await register(name, email, password);
      navigate('/dashboard', { replace: true });
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : 'Nao foi possivel criar a conta.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 p-6 text-white">
      <form onSubmit={submit} className="premium-shadow w-full max-w-md rounded-3xl border border-white/10 bg-neutral-900 p-8">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-black">
          <Icon icon="solar:user-plus-bold" className="text-2xl" />
        </div>
        <h1 className="font-bricolage text-3xl font-bold">Criar workspace Kivo</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Cria usuario no Supabase Auth e profile Kivo automaticamente.
        </p>
        <div className="mt-8 space-y-4">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nome"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-emerald-500"
          />
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-emerald-500"
          />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="Senha"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-emerald-500"
          />
        </div>

        {error ? <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-200">{error}</div> : null}

        <button
          disabled={submitting}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black disabled:cursor-wait disabled:opacity-60"
        >
          {submitting ? 'Criando...' : 'Criar e acessar'}
          <Icon icon="solar:arrow-right-bold" />
        </button>
        <Link to="/login" className="mt-5 block text-center text-xs text-neutral-500 hover:text-white">
          Ja tenho conta
        </Link>
      </form>
    </main>
  );
}
