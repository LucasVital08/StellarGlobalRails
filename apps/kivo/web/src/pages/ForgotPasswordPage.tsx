import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-neutral-900 p-8 text-center premium-shadow">
        <h1 className="font-bricolage text-3xl font-bold">Recuperação mockada</h1>
        <p className="mt-3 text-sm text-neutral-400">No v1 mockado não enviamos email. A tela existe para manter o fluxo pronto para Supabase Auth.</p>
        <Link to="/login" className="mt-6 inline-flex rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-black">Voltar ao login</Link>
      </div>
    </main>
  );
}
