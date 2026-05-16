import { Icon } from '@iconify/react';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';
import type { AssetCode, ConditionType, PaymentStatus } from '@/types/kivo';
import { formatDateTime, shortId, statusLabel } from '@/utils/format';

export default function PaymentsPage() {
  const payments = useAsyncData(() => kivoClient.listPayments(), []);
  const devices = useAsyncData(() => kivoClient.listDevices(), []);
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState<PaymentStatus | 'all'>('all');
  const [fromDeviceId, setFromDeviceId] = useState('dev_ev_001');
  const [toDeviceId, setToDeviceId] = useState('dev_charger_a12');
  const [amount, setAmount] = useState('10.0000000');
  const [assetCode, setAssetCode] = useState<AssetCode>('USDC');
  const [conditionType, setConditionType] = useState<ConditionType>('energy_kwh');
  const [conditionValue, setConditionValue] = useState('10');
  const [memo, setMemo] = useState('m2m payment');

  const filtered = useMemo(() => {
    const data = payments.data ?? [];
    return status === 'all' ? data : data.filter((payment) => payment.status === status);
  }, [payments.data, status]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await kivoClient.createPayment({
      fromDeviceId,
      toDeviceId,
      amount,
      assetCode,
      conditionType,
      conditionValue: conditionType === 'none' ? undefined : conditionValue,
      timeoutSeconds: 3600,
      memo,
    });
    setModalOpen(false);
    await payments.reload();
  };

  const deviceName = (id: string) => devices.data?.find((device) => device.id === id)?.name ?? id;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Payment gateway"
        title="Pagamentos M2M"
        icon="solar:wallet-money-bold-duotone"
        description="Crie, filtre e acompanhe pagamentos imediatos ou condicionais sobre Stellar."
        action={<button onClick={() => setModalOpen(true)} className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black">Novo pagamento</button>}
      />

      <Card>
        <div className="flex flex-wrap gap-2">
          {(['all', 'pending', 'processing', 'confirmed', 'failed'] as const).map((item) => (
            <button key={item} onClick={() => setStatus(item)} className={`rounded-xl border px-3 py-2 text-xs font-bold ${status === item ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-white/10 bg-white/5 text-neutral-500'}`}>
              {item === 'all' ? 'Todos' : statusLabel(item)}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-neutral-500">
              <tr className="border-b border-white/5">
                <th className="py-3">Pagamento</th>
                <th>Origem</th>
                <th>Destino</th>
                <th>Condição</th>
                <th>Status</th>
                <th>Criado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((payment) => (
                <tr key={payment.id} className="hover:bg-white/[0.02]">
                  <td className="py-4">
                    <Link to={`/payments/${payment.id}`} className="font-mono text-xs text-emerald-400 hover:text-emerald-300">{shortId(payment.id)}</Link>
                    <p className="mt-1 font-bold text-white">{payment.amount} {payment.assetCode}</p>
                  </td>
                  <td className="text-neutral-300">{deviceName(payment.fromDeviceId)}</td>
                  <td className="text-neutral-300">{deviceName(payment.toDeviceId)}</td>
                  <td className="text-neutral-400">{payment.conditionType}{payment.conditionValue ? ` = ${payment.conditionValue}` : ''}</td>
                  <td><Badge tone={payment.status}>{statusLabel(payment.status)}</Badge></td>
                  <td className="text-neutral-500">{formatDateTime(payment.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={modalOpen} title="Criar pagamento" onClose={() => setModalOpen(false)}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <select value={fromDeviceId} onChange={(event) => setFromDeviceId(event.target.value)} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-emerald-500">
              {(devices.data ?? []).map((device) => <option key={device.id} value={device.id}>{device.name}</option>)}
            </select>
            <select value={toDeviceId} onChange={(event) => setToDeviceId(event.target.value)} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-emerald-500">
              {(devices.data ?? []).map((device) => <option key={device.id} value={device.id}>{device.name}</option>)}
            </select>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <input value={amount} onChange={(event) => setAmount(event.target.value)} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-emerald-500" />
            <select value={assetCode} onChange={(event) => setAssetCode(event.target.value as AssetCode)} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-emerald-500">
              <option value="USDC">USDC</option>
              <option value="XLM">XLM</option>
            </select>
            <select value={conditionType} onChange={(event) => setConditionType(event.target.value as ConditionType)} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-emerald-500">
              <option value="none">none</option>
              <option value="energy_kwh">energy_kwh</option>
              <option value="time_elapsed">time_elapsed</option>
              <option value="service_complete">service_complete</option>
              <option value="custom">custom</option>
            </select>
          </div>
          {conditionType !== 'none' && <input value={conditionValue} onChange={(event) => setConditionValue(event.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-emerald-500" placeholder="Valor da condição" />}
          <input value={memo} onChange={(event) => setMemo(event.target.value)} maxLength={28} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-emerald-500" placeholder="Memo Stellar" />
          <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black">
            Criar pagamento
            <Icon icon="solar:arrow-right-bold" />
          </button>
        </form>
      </Modal>
    </div>
  );
}
