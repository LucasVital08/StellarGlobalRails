"use client";
import { CheckCircle2, ExternalLink, Download, QrCode } from "lucide-react";
import type { CompletedSession } from "./DemoPaymentFlow";

function fmt(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}min ${sec}s`;
}

export default function ReceiptCard({ session }: { session: CompletedSession }) {
  return (
    <div className="glass rounded-2xl overflow-hidden border border-[#14d8c8]/20">
      <div className="bg-gradient-to-r from-[#14d8c8]/15 to-[#4aa8ff]/10 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2 size={22} className="text-[#14d8c8]" />
          <div><p className="text-white font-bold text-base">Comprovante de Recarga</p><p className="text-[#8ca4be] text-xs">Sessão {session.id}</p></div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#14d8c8]/20 text-[#14d8c8] border border-[#14d8c8]/30">Pago</span>
      </div>

      <div className="px-6 py-5 space-y-3">
        <Row label="Estação" value={session.stationName} />
        <Row label="Usuário" value={session.user} />
        <Row label="Carteira" value={session.wallet} mono />
        <Row label="Asset" value={session.asset} />
        <Row label="Conectado em" value={fmt(session.startedAt)} />
        <Row label="Finalizado em" value={fmt(session.finishedAt)} />
        <Row label="Duração" value={formatDuration(session.duration)} />
        <Row label="Potência" value={session.power} />
        <div className="border-t border-white/5 pt-3 space-y-3">
          <Row label="Energia entregue" value={`${session.kwh} kWh`} accent="#14d8c8" bold />
          <Row label="Valor pago" value={`R$ ${session.amountPaid.toFixed(2)} ${session.asset}`} bold accent="#e8f0fc" />
          <Row label="Taxa da plataforma" value={`R$ ${session.platformFee.toFixed(2)}`} accent="#f87171" />
          <Row label="Valor líquido operador" value={`R$ ${session.netOperator.toFixed(2)}`} accent="#14d8c8" />
        </div>
        <div className="border-t border-white/5 pt-3"><p className="text-[#8ca4be] text-xs mb-1">Hash da transação</p><p className="font-mono text-[#4aa8ff] text-xs break-all">{session.txHash}</p></div>
      </div>

      <div className="px-6 pb-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"><QrCode size={56} className="text-[#050b16]" /></div>
        <div className="flex flex-col gap-2 w-full">
          <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#14d8c8]/15 text-[#14d8c8] font-semibold text-sm border border-[#14d8c8]/25 hover:bg-[#14d8c8]/25 transition-all"><Download size={14} /> Baixar Comprovante (PDF)</button>
          <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl glass text-[#8ca4be] font-semibold text-sm hover:text-white transition-all"><ExternalLink size={14} /> Ver no Stellar Explorer</button>
        </div>
      </div>

      <div className="border-t border-white/5 px-6 py-3 flex justify-between text-xs text-[#3a5070]"><span>Stellar Global Rails - QuiloVolt Global Pay</span><span className="text-amber-400/60">Testnet</span></div>
    </div>
  );
}

function Row({ label, value, bold, accent, mono }: { label: string; value: string; bold?: boolean; accent?: string; mono?: boolean; }) {
  return (
    <div className="flex justify-between items-baseline gap-2">
      <span className="text-[#8ca4be] text-sm flex-shrink-0">{label}</span>
      <span className={`text-sm text-right break-all ${bold ? "font-bold" : "font-medium"} ${mono ? "font-mono" : ""}`} style={{ color: accent ?? "#e8f0fc" }}>
        {value}
      </span>
    </div>
  );
}
