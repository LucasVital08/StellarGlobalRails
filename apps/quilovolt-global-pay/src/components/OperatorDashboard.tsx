"use client";
import { useState } from "react";
import { BarChart3, Zap, DollarSign, CheckCircle2, Activity, ExternalLink } from "lucide-react";
import { MOCK_SESSIONS } from "@/lib/mock-data";
import type { ChargingSession } from "@/lib/mock-data";
import type { CompletedSession } from "./DemoPaymentFlow";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

function statusLabel(s: ChargingSession["status"]) {
  const map: Record<string, string> = {
    awaiting_payment: "Aguardando",
    confirmed: "Pago",
    charging: "Ativo",
    finished: "Finalizado",
    failed: "Falhou",
    idle: "Idle",
    tx_sent: "Enviado",
  };
  return map[s] ?? s;
}

function statusColor(s: ChargingSession["status"]) {
  if (s === "finished" || s === "confirmed") return "#14d8c8";
  if (s === "charging") return "#4aa8ff";
  if (s === "failed") return "#f87171";
  if (s === "awaiting_payment") return "#f59e0b";
  return "#8ca4be";
}

const CHART_DATA = [
  { name: "Recife Shopping", value: 28.0 },
  { name: "Boa Viagem", value: 19.8 },
  { name: "PE-060", value: 34.8 },
  { name: "Academia", value: 15.2 },
];
const CHART_COLORS = ["#4aa8ff", "#14d8c8", "#7c6af7", "#f59e0b"];

interface Props { newSessions: CompletedSession[]; }

export default function OperatorDashboard({ newSessions }: Props) {
  const [showAll, setShowAll] = useState(false);

  const allSessions: ChargingSession[] = [
    ...newSessions.map((s) => ({
      id: s.id,
      stationId: "demo",
      stationName: s.stationName,
      user: s.user,
      wallet: s.wallet,
      asset: s.asset,
      amountPaid: s.amountPaid,
      kwh: s.kwh,
      platformFee: s.platformFee,
      netOperator: s.netOperator,
      status: "finished" as const,
      txHash: s.txHash,
      startedAt: s.startedAt,
      finishedAt: s.finishedAt,
      duration: s.duration,
      connector: "CCS2" as const,
    })),
    ...MOCK_SESSIONS,
  ];

  const total = allSessions.reduce((a, s) => a + s.amountPaid, 0);
  const totalKwh = allSessions.reduce((a, s) => a + s.kwh, 0);
  const fee = allSessions.reduce((a, s) => a + s.platformFee, 0);
  const net = allSessions.reduce((a, s) => a + s.netOperator, 0);
  const active = allSessions.filter((s) => s.status === "charging").length;
  const confirmed = allSessions.filter((s) => s.status === "finished" || s.status === "confirmed").length;

  const displayed = showAll ? allSessions : allSessions.slice(0, 5);

  return (
    <section id="dashboard" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12"><p className="text-[#14d8c8] text-sm font-semibold uppercase tracking-widest mb-3">Dashboard</p><h2 className="section-title text-4xl md:text-5xl font-extrabold text-white leading-tight">Painel do Operador</h2></div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MetricCard icon={Activity} label="Sessões hoje" value={String(allSessions.length)} color="#4aa8ff" />
          <MetricCard icon={DollarSign} label="Volume (R$)" value={`R$ ${total.toFixed(2)}`} color="#14d8c8" />
          <MetricCard icon={Zap} label="Energia entregue" value={`${totalKwh.toFixed(1)} kWh`} color="#7c6af7" />
          <MetricCard icon={CheckCircle2} label="Pagamentos confirmados" value={String(confirmed)} color="#14d8c8" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <MetricCard icon={DollarSign} label="Receita bruta" value={`R$ ${total.toFixed(2)}`} color="#f59e0b" />
          <MetricCard icon={DollarSign} label="Taxa plataforma" value={`R$ ${fee.toFixed(2)}`} color="#f87171" />
          <MetricCard icon={DollarSign} label="Valor líquido" value={`R$ ${net.toFixed(2)}`} color="#14d8c8" />
          <MetricCard icon={Zap} label="Sessões ativas" value={String(active)} color="#4aa8ff" />
        </div>

        <div className="glass rounded-2xl p-6 mb-8">
          <p className="text-white font-bold mb-5">Receita por estação (R$)</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={CHART_DATA} barSize={28}>
              <XAxis dataKey="name" tick={{ fill: "#8ca4be", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#8ca4be", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid #1e3a5f", borderRadius: 10, color: "#e8f0fc" }} cursor={{ fill: "rgba(74,168,255,0.06)" }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>{CHART_DATA.map((_, i) => (<Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />))}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between"><p className="text-white font-bold">Sessões recentes</p><div className="flex items-center gap-2"><span className="px-2.5 py-1 rounded-full text-xs bg-[#14d8c8]/15 text-[#14d8c8] font-semibold">{allSessions.length} sessões</span><span className="px-2 py-1 rounded text-xs border border-amber-400/30 text-amber-400">Testnet</span></div></div>
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-white/5">{["ID", "Estação", "Usuário", "Valor", "Asset", "kWh", "Status", "Horário", "Transação"].map((h) => (<th key={h} className="text-left px-4 py-3 text-[#8ca4be] text-xs font-semibold whitespace-nowrap">{h}</th>))}</tr></thead><tbody>{displayed.map((s) => (<tr key={s.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"><td className="px-4 py-3 font-mono text-xs text-[#4aa8ff]">{s.id}</td><td className="px-4 py-3 text-[#c8d8ec] whitespace-nowrap">{s.stationName}</td><td className="px-4 py-3 text-[#c8d8ec]">{s.user}</td><td className="px-4 py-3 text-white font-medium whitespace-nowrap">R$ {s.amountPaid.toFixed(2)}</td><td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-xs bg-[#14d8c8]/15 text-[#14d8c8]">{s.asset}</span></td><td className="px-4 py-3 text-[#c8d8ec]">{s.kwh.toFixed(2)}</td><td className="px-4 py-3"><span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: `${statusColor(s.status)}18`, color: statusColor(s.status), border: `1px solid ${statusColor(s.status)}30` }}>{statusLabel(s.status)}</span></td><td className="px-4 py-3 text-[#8ca4be] text-xs whitespace-nowrap">{new Date(s.startedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</td><td className="px-4 py-3"><button className="text-[#4aa8ff] hover:text-white transition-colors flex items-center gap-1 text-xs font-mono">{s.txHash.slice(0, 20)}…<ExternalLink size={10} /></button></td></tr>))}</tbody></table></div>
          {allSessions.length > 5 && (<div className="px-6 py-4 text-center border-t border-white/5"><button onClick={() => setShowAll((v) => !v)} className="text-sm text-[#4aa8ff] hover:text-white transition-colors font-semibold">{showAll ? "Ver menos" : `Ver todas (${allSessions.length})`}</button></div>)}
        </div>
      </div>
    </section>
  );
}

function MetricCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string; }) {
  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}18`, border: `1px solid ${color}30` }}><Icon size={16} style={{ color }} /></div>
      <div><p className="text-[#8ca4be] text-xs">{label}</p><p className="text-white font-bold text-lg leading-tight">{value}</p></div>
    </div>
  );
}
