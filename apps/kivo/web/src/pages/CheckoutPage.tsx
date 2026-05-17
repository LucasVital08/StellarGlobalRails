import { Icon } from '@iconify/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  formatX402AssetLabel,
  getX402CheckoutState,
  previewPublicKey,
  x402CheckoutResources,
} from '@/data/x402Experience';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';
import type { X402Challenge, X402PaidResponse, X402UnlockedResponse } from '@/types/kivo';

export default function CheckoutPage() {
  const etherfuse = useAsyncData(() => kivoClient.getEtherfuseStatus(), []);
  const [selectedResource, setSelectedResource] = useState(x402CheckoutResources[0]);
  const [txXDR, setTxXDR] = useState('');
  const [challenge, setChallenge] = useState<X402Challenge | null>(null);
  const [paid, setPaid] = useState<X402PaidResponse | null>(null);
  const [unlocked, setUnlocked] = useState<X402UnlockedResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkoutState = getX402CheckoutState({ challenge, paid, unlocked });
  const asset = challenge ? formatX402AssetLabel(challenge.asset) : null;

  const resetPaymentState = () => {
    setChallenge(null);
    setPaid(null);
    setUnlocked(null);
    setTxXDR('');
    setError('');
  };

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
      setError(err instanceof Error ? err.message : 'Pagamento nao confirmado pela API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Usuario final"
        title="Pagar recurso protegido"
        icon="solar:card-transfer-bold-duotone"
        description="Fluxo MVP do cliente: escolhe um recurso, recebe o challenge x402, assina o pagamento USDC na Stellar testnet e desbloqueia o acesso com X-PAYMENT."
        action={<Link to="/x402" className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/5">Playground tecnico</Link>}
      />

      <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <Card className="min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-400">Catalogo pago</p>
              <h2 className="mt-2 font-bricolage text-2xl font-bold text-white">O que o usuario quer acessar?</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-400">Cada item abaixo e um recurso protegido por HTTP 402 e liquidado pelo mesmo trilho Etherfuse/Stellar.</p>
            </div>
            <Badge tone={checkoutState.tone}>{checkoutState.primaryStatus}</Badge>
          </div>

          <div className="mt-5 space-y-3">
            {x402CheckoutResources.map((resource) => (
              <button
                key={resource.label}
                type="button"
                onClick={() => {
                  setSelectedResource(resource);
                  resetPaymentState();
                }}
                className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                  selectedResource.label === resource.label ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-white/5 bg-black/25 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-emerald-300">
                    <Icon icon={resource.icon} className="text-2xl" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-bold text-white">{resource.label}</h3>
                      {selectedResource.label === resource.label && <Icon icon="solar:check-circle-bold" className="text-xl text-emerald-400" />}
                    </div>
                    <p className="mt-1 text-xs text-neutral-500">{resource.customer} para {resource.operator}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-5 text-neutral-400">{resource.detail}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge tone="neutral">{resource.settlementRail}</Badge>
                  <Badge tone="neutral">{resource.resource}</Badge>
                </div>
              </button>
            ))}
          </div>

          <button type="button" onClick={requestPrice} disabled={loading} className="mt-5 w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? 'Solicitando...' : challenge ? 'Atualizar preco' : 'Ver preco e pagar'}
          </button>
        </Card>

        <Card className="min-w-0 overflow-hidden">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-400">Recurso protegido</p>
              <h2 className="mt-2 font-bricolage text-3xl font-bold text-white">{selectedResource.label}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">{selectedResource.outcome}</p>
            </div>
            <Badge tone={checkoutState.tone}>{checkoutState.primaryStatus}</Badge>
          </div>

          <div className="mt-6 rounded-2xl border border-white/5 bg-black/25 p-4">
            <p className="text-sm leading-6 text-neutral-300">{checkoutState.summary}</p>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {checkoutState.steps.map((step) => (
              <div key={step.label} className={`rounded-2xl border p-4 ${
                step.status === 'complete'
                  ? 'border-emerald-500/25 bg-emerald-500/10'
                  : step.status === 'current'
                    ? 'border-amber-500/25 bg-amber-500/10'
                    : 'border-white/5 bg-black/25'
              }`}
              >
                <Icon icon={step.icon} className={`text-2xl ${step.status === 'complete' ? 'text-emerald-400' : step.status === 'current' ? 'text-amber-400' : 'text-neutral-500'}`} />
                <p className="mt-3 text-sm font-bold text-white">{step.title}</p>
                <p className="mt-1 text-xs leading-5 text-neutral-500">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/5 bg-black/25 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Anchor</p>
              <p className="mt-2 text-sm font-bold text-white">Etherfuse {etherfuse.data?.mode ?? 'sandbox'}</p>
              <p className="mt-1 text-xs text-neutral-500">{etherfuse.loading ? 'checando status...' : etherfuse.error ?? (etherfuse.data?.configured ? 'configurado no backend' : 'aguardando secrets')}</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-black/25 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Rede</p>
              <p className="mt-2 text-sm font-bold text-white">{challenge?.network ?? etherfuse.data?.network ?? 'testnet'}</p>
              <p className="mt-1 text-xs text-neutral-500">Stellar + USDC allowlist</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-black/25 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Moeda base</p>
              <p className="mt-2 text-sm font-bold text-white">{etherfuse.data?.default_fiat ?? 'MXN'}</p>
              <p className="mt-1 text-xs text-neutral-500">conversao anchor-side</p>
            </div>
          </div>

          {challenge && (
            <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-400">HTTP 402 Payment Required</p>
                  <p className="mt-1 text-sm text-neutral-300">
                    {challenge.amount} {asset?.label} para {previewPublicKey(challenge.payTo)}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">Issuer {asset?.issuerPreview} - nonce {challenge.nonce}</p>
                </div>
                <CopyButton value={challenge.requiredHeader} label="Copiar challenge" />
              </div>
              <pre className="mt-4 max-h-32 overflow-auto whitespace-pre-wrap break-all rounded-xl bg-black/35 p-3 text-xs text-amber-100">{challenge.requiredHeader}</pre>
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-white/5 bg-black/25 p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Pagamento real</p>
                <h3 className="mt-1 font-bricolage text-xl font-bold text-white">Carteira ou SDK assina a transacao</h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">O MVP nao marca sucesso sozinho: a API so libera o recurso quando recebe um txXDR assinado e aceito pela Stellar testnet.</p>
              </div>
              {paid && <Badge tone="processing">ledger {paid.stellarLedger}</Badge>}
            </div>

            <label className="mt-5 block text-xs font-bold uppercase tracking-wider text-neutral-500">XDR assinado retornado pela carteira</label>
            <textarea
              value={txXDR}
              onChange={(event) => setTxXDR(event.target.value)}
              placeholder="Cole aqui o txXDR assinado pela carteira/SDK Stellar"
              className="mt-2 min-h-28 w-full rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-xs text-emerald-100 outline-none focus:border-emerald-500"
            />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button type="button" onClick={payAndUnlock} disabled={!challenge || !txXDR.trim() || loading} className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50">
                Enviar pagamento e liberar
                <Icon icon="solar:lock-keyhole-unlocked-bold" />
              </button>
              <p className="text-xs text-neutral-500">Sem XDR assinado, o backend retorna erro em vez de simular sucesso.</p>
            </div>
          </div>

          {error && <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</p>}

          {paid && (
            <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Pagamento aceito</p>
                  <p className="mt-1 text-sm text-neutral-300">Hash {paid.stellarHash}</p>
                </div>
                <CopyButton value={paid.paymentHeader} label="Copiar X-PAYMENT" />
              </div>
              <pre className="mt-4 max-h-48 overflow-auto whitespace-pre-wrap break-all rounded-xl bg-black/35 p-3 text-xs text-emerald-100">{unlocked ? JSON.stringify(unlocked, null, 2) : JSON.stringify(paid.data, null, 2)}</pre>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
