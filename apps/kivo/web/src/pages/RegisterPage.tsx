import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores';

export default function RegisterPage() {
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();
  const [name, setName] = useState('Kivo Operator');
  const [email, setEmail] = useState('operator@kivo.pay');
  const [password, setPassword] = useState('demo123');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await register(name, email, password);
    navigate('/dashboard', { replace: true });
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-white/10 bg-neutral-900 p-8 premium-shadow">
        <h1 className="font-bricolage text-3xl font-bold">Criar workspace Kivo</h1>
        <p className="mt-2 text-sm text-neutral-400">Conta local de demonstração para operadores e devs.</p>
        <div className="mt-8 space-y-4">
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nome" className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-emerald-500" />
          <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-emerald-500" />
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Senha" className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-emerald-500" />
        </div>
        <button className="mt-6 w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black">Criar e acessar</button>
        <Link to="/login" className="mt-5 block text-center text-xs text-neutral-500 hover:text-white">Já tenho conta</Link>
      </form>
    </main>
  );
}
