import { useState } from 'react';
import type { FormEvent } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';
import { useNotificationStore } from '@/stores';
import type { X402Challenge, X402PaidResponse, X402UnlockedResponse } from '@/types/kivo';

export default function X402Page() {
  const pricing = useAsyncData(() => kivoClient.listX402PricingRules(), []);
  const notify = useNotificationStore((state) => state.add);
  const [resource, setResource] = useState('/api/x402/data');
  const [amount, setAmount] = useState('0.0500000');
  const [asset, setAsset] = useState('USDC:GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5');
  const [maxTimeout, setMaxTimeout] = useState(300);
  const [txXDR, setTxXDR] = useState('');
  const [challenge, setChallenge] = useState<X402Challenge | null>(null);
  const [paid, setPaid] = useState<X402PaidResponse | null>(null);
  const [unlocked, setUnlocked] = useState<X402UnlockedResponse | null>(null);

  const requestChallenge = async () => {
    setPaid(null);
    setUnlocked(null);
    setChallenge(await kivoClient.getX402Challenge(resource));
  };

  const pay = async () => {
    if (!challenge) return;
    const paidResponse = await kivoClient.payX402Challenge(challenge.nonce, txXDR);
    setPaid(paidResponse);
    setUnlocked(await kivoClient.unlockX402Resource(resource, paidResponse.paymentHeader));
  };

  const savePricing = async (event: FormEvent) => {
    event.preventDefault();
    const rule = await kivoClient.upsertX402PricingRule({
      resource,
      amount,
      asset,
      maxTimeout,
      enabled: true,
      description: 'Regra operacional do playground x402.',
    });
    notify({ type: 'success', title: 'Regra x402 salva', message: `${rule.amount} em ${rule.resource}` });
    await pricing.reload();
  };

  const clientSnippet = `const initial = await fetch('${resource}');
if (initial.status === 402) {
  const challenge = await initial.json();
  const paid = await fetch('/v1/x402/pay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nonce: challenge.nonce, txXDR: signedTransactionXdr })
  }).then((res) => res.json());

  const unlocked = await fetch('${resource}', {
    headers: { 'X-PAYMENT': paid.paymentHeader }
  });
}`;

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="HTTP 402" title="x402 Playground" icon="solar:shield-keyhole-bold-duotone" description="Visualize o fluxo Payment Required -> X-PAYMENT -> recurso liberado." />
      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <h2 className="font-bricolage text-xl font-bold text-white">Request</h2>
          <input value={resource} onChange={(event) => setResource(event.target.value)} className="mt-4 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-emerald-500" />
          <textarea value={txXDR} onChange={(event) => setTxXDR(event.target.value)} placeholder="Cole o txXDR assinado da Stellar" className="mt-3 min-h-32 w-full rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-xs text-emerald-100 outline-none focus:border-emerald-500" />
          <button type="button" onClick={requestChallenge} className="mt-4 w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black">GET sem pagamento</button>
          <button type="button" onClick={pay} disabled={!challenge || !txXDR.trim()} className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-neutral-300 disabled:opacity-40">Retry com X-PAYMENT</button>
        </Card>
        <Card className="min-w-0 xl:col-span-2">
          <h2 className="font-bricolage text-xl font-bold text-white">Headers</h2>
          <div className="mt-4 grid gap-4">
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-400">HTTP/1.1 402 Payment Required</p>
                {challenge && <Badge tone="pending">nonce {challenge.nonce}</Badge>}
              </div>
              <pre className="mt-3 overflow-auto whitespace-pre-wrap break-all text-xs text-amber-100">{challenge?.requiredHeader ?? 'X-PAYMENT-REQUIRED aparecera aqui'}</pre>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">HTTP/1.1 200 OK</p>
                {paid && <CopyButton value={paid.paymentHeader} label="Copiar X-PAYMENT" />}
              </div>
              <pre className="mt-3 overflow-auto whitespace-pre-wrap break-all text-xs text-emerald-100">{unlocked ? JSON.stringify(unlocked, null, 2) : paid ? JSON.stringify(paid.data, null, 2) : 'Resposta liberada aparecera aqui'}</pre>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="min-w-0">
          <h2 className="font-bricolage text-xl font-bold text-white">Pricing rule</h2>
          <form onSubmit={savePricing} className="mt-4 space-y-3">
            <input value={amount} onChange={(event) => setAmount(event.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-sm outline-none focus:border-emerald-500" />
            <input value={asset} onChange={(event) => setAsset(event.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-sm outline-none focus:border-emerald-500" />
            <input type="number" min={30} max={900} value={maxTimeout} onChange={(event) => setMaxTimeout(Number(event.target.value))} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-emerald-500" />
            <button className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black">Salvar regra</button>
          </form>
        </Card>

        <Card className="min-w-0">
          <h2 className="font-bricolage text-xl font-bold text-white">Recursos ativos</h2>
          <div className="mt-4 space-y-3">
            {(pricing.data ?? []).map((rule) => (
              <button key={rule.id} type="button" onClick={() => {
                setResource(rule.resource);
                setAmount(rule.amount);
                setAsset(rule.asset);
                setMaxTimeout(rule.maxTimeout);
              }} className="w-full rounded-xl border border-white/5 bg-black/25 p-3 text-left transition-colors hover:bg-white/5">
                <div className="flex items-center justify-between gap-3">
                  <span className="break-all font-mono text-xs text-white">{rule.resource}</span>
                  <Badge tone={rule.enabled ? 'active' : 'paused'}>{rule.enabled ? 'on' : 'off'}</Badge>
                </div>
                <p className="mt-1 text-xs text-neutral-500">{rule.amount} · {rule.maxTimeout}s</p>
              </button>
            ))}
          </div>
        </Card>

        <Card className="min-w-0">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bricolage text-xl font-bold text-white">Client snippet</h2>
            <CopyButton value={clientSnippet} label="Copiar" />
          </div>
          <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap break-all rounded-xl border border-white/10 bg-black/50 p-4 text-xs text-blue-100">{clientSnippet}</pre>
        </Card>
      </div>
    </div>
  );
}
