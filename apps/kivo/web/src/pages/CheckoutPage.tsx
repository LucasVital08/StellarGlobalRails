import { Icon } from '@iconify/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { PageHeader } from '@/components/ui/PageHeader';
import { kivoClient } from '@/services/kivoClient';
import type { X402Challenge, X402PaidResponse, X402UnlockedResponse } from '@/types/kivo';

const resources = [
  { label: 'Sessao EV charging', resource: '/api/x402/data', detail: 'Pagamento libera dados de uma sessao de recarga.' },
  { label: 'IoT data packet', resource: '/api/x402/data?dataset=iot', detail: 'Pagamento libera pacote premium de sensores.' },
  { label: 'Agent API call', resource: '/api/x402/data?tool=agent', detail: 'Pagamento libera uma chamada de API para agente.' },
];

export default function CheckoutPage() {
  const [selectedResource, setSelectedResource] = useState(resources[0]);
  const [txXDR, setTxXDR] = useState('');
  const [challenge, setChallenge] = useState<X402Challenge | null>(null);
  const [paid, setPaid] = useState<X402PaidResponse | null>(null);
  const [unlocked, setUnlocked] = useState<X402UnlockedResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const requestPrice = async () => {
    setLoading(true);
    setError('');
    setPaid(null);
    setUnlocked(null);
    try {
      setChallenge(await kivoClient.getX402Challenge(selectedResource.resource));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nao foi possivel iniciar o checkout.');
    } finally {
      setLoading(false);
    }
  };

  const payAndUnlock = async () => {
    if (!challenge) return;
    setLoading(true);
    setError('');
    try {
      const paidResponse = await kivoClient.payX402Challenge(challenge.nonce, txXDR);
      setPaid(paidResponse);
      setUnlocked(await kivoClient.unlockX402Resource(selectedResource.resource, paidResponse.paymentHeader));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Pagamento nao confirmado.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: 'Preco', active: Boolean(challenge), done: Boolean(challenge), icon: 'solar:tag-price-bold-duotone' },
    { label: 'Pagamento', active: Boolean(challenge) && !paid, done: Boolean(paid), icon: 'solar:wallet-money-bold-duotone' },
    { label: 'Acesso', active: Boolean(paid), done: Boolean(unlocked), icon: 'solar:lock-keyhole-unlocked-bold-duotone' },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Usuario final"
        title="Checkout x402"
        icon="solar:card-transfer-bold-duotone"
        description="Uma experiencia simples para pagar por um recurso, confirmar o pagamento e receber acesso liberado."
        action={<Link to="/x402" className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/5">Console tecnico</Link>}
      />

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <h2 className="font-bricolage text-xl font-bold text-white">Escolha o recurso</h2>
          <div className="mt-4 space-y-3">
            {resources.map((resource) => (
              <button
                key={resource.label}
                type="button"
                onClick={() => {
                  setSelectedResource(resource);
                  setChallenge(null);
                  setPaid(null);
                  setUnlocked(null);
                  setError('');
                }}
                className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                  selectedResource.label === resource.label ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-white/5 bg-black/25 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-bold text-white">{resource.label}</h3>
                  {selectedResource.label === resource.label && <Icon icon="solar:check-circle-bold" className="text-emerald-400" />}
                </div>
                <p className="mt-2 text-xs leading-5 text-neutral-500">{resource.detail}</p>
                <code className="mt-3 block break-all text-[11px] text-emerald-300">{resource.resource}</code>
              </button>
            ))}
          </div>

          <button type="button" onClick={requestPrice} disabled={loading} className="mt-5 w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black disabled:opacity-50">
            Ver preco e condicao
          </button>
        </Card>

        <Card>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-400">Resource</p>
              <h2 className="mt-2 font-bricolage text-2xl font-bold text-white">{selectedResource.label}</h2>
              <p className="mt-2 text-sm text-neutral-500">{selectedResource.detail}</p>
            </div>
            <Badge tone={unlocked ? 'confirmed' : challenge ? 'pending' : 'neutral'}>{unlocked ? 'liberado' : challenge ? 'aguardando pagamento' : 'bloqueado'}</Badge>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.label} className={`rounded-2xl border p-4 ${step.done ? 'border-emerald-500/25 bg-emerald-500/10' : step.active ? 'border-amber-500/25 bg-amber-500/10' : 'border-white/5 bg-black/25'}`}>
                <Icon icon={step.icon} className={`text-2xl ${step.done ? 'text-emerald-400' : step.active ? 'text-amber-400' : 'text-neutral-500'}`} />
                <p className="mt-3 text-sm font-bold text-white">{step.label}</p>
              </div>
            ))}
          </div>

          {challenge && (
            <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-400">HTTP 402 Payment Required</p>
                  <p className="mt-1 text-sm text-neutral-300">{challenge.amount} {challenge.asset.split(':')[0]} - timeout {challenge.maxTimeout}s</p>
                </div>
                <Badge tone="pending">nonce {challenge.nonce}</Badge>
              </div>
              <pre className="mt-4 max-h-32 overflow-auto whitespace-pre-wrap break-all rounded-xl bg-black/35 p-3 text-xs text-amber-100">{challenge.requiredHeader}</pre>
            </div>
          )}

          <div className="mt-6">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Transacao Stellar assinada</label>
            <textarea
              value={txXDR}
              onChange={(event) => setTxXDR(event.target.value)}
              placeholder="Cole o txXDR assinado para confirmar o pagamento"
              className="mt-2 min-h-32 w-full rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-xs text-emerald-100 outline-none focus:border-emerald-500"
            />
            <button type="button" onClick={payAndUnlock} disabled={!challenge || !txXDR.trim() || loading} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black disabled:cursor-not-allowed disabled:opacity-50">
              Pagar e desbloquear
              <Icon icon="solar:lock-keyhole-unlocked-bold" />
            </button>
          </div>

          {error && <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</p>}

          {paid && (
            <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Pagamento confirmado</p>
                <CopyButton value={paid.paymentHeader} label="Copiar X-PAYMENT" />
              </div>
              <pre className="mt-4 max-h-48 overflow-auto whitespace-pre-wrap break-all rounded-xl bg-black/35 p-3 text-xs text-emerald-100">{unlocked ? JSON.stringify(unlocked, null, 2) : JSON.stringify(paid.data, null, 2)}</pre>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
