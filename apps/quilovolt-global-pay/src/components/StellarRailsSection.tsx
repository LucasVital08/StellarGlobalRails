"use client";
import { Zap, ArrowRight } from "lucide-react";

const STELLAR_COMPONENTS = [
  "Identidade de usuário",
  "Ledger de transações",
  "Camada de comprovantes",
  "Motor de conversão de moedas",
  "API Gateway",
  "Sistema de notificações",
  "Dashboard",
  "Stellar SDK / Horizon API",
  "Suporte a USDC / BRZ",
  "Dados off-chain em PostgreSQL",
  "Eventos verificáveis",
];

const ECOSYSTEM = [
  "FamilyBridge",
  "Stellar Payouts",
  "ContractEase Global",
  "Vakinha Global",
  "Stellar Invoice",
  "QuiloVolt Global Pay",
];

export default function StellarRailsSection() {
  return (
    <section id="stellar-rails" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#4aa8ff] opacity-[0.04] rounded-full blur-[120px]" /></div>
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-14">
          <p className="text-[#14d8c8] text-sm font-semibold uppercase tracking-widest mb-3">Ecossistema</p>
          <h2 className="section-title text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">Integração com <span className="bg-gradient-to-r from-[#4aa8ff] to-[#14d8c8] bg-clip-text text-transparent">Stellar Global Rails</span></h2>
          <p className="text-[#8ca4be] max-w-2xl mx-auto text-base leading-relaxed">A QuiloVolt Global Pay usa a infraestrutura comum do Stellar Global Rails, compartilhando camadas essenciais com outros módulos do ecossistema.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="glass rounded-2xl p-7">
            <p className="text-white font-bold mb-5">Componentes compartilhados</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{STELLAR_COMPONENTS.map((c) => (<div key={c} className="flex items-center gap-2.5 text-[#8ca4be] text-sm"><Zap size={12} className="text-[#14d8c8] flex-shrink-0" />{c}</div>))}</div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="glass rounded-2xl p-7">
              <p className="text-white font-bold mb-5">Módulos do ecossistema</p>
              <div className="flex flex-wrap gap-2">{ECOSYSTEM.map((e) => (<span key={e} className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${e === "QuiloVolt Global Pay" ? "bg-[#14d8c8]/20 text-[#14d8c8] border-[#14d8c8]/40" : "bg-white/5 text-[#8ca4be] border-white/10"}`}>{e}</span>))}</div>
            </div>

            <div className="glass rounded-2xl p-7">
              <p className="text-[#8ca4be] text-xs uppercase tracking-widest mb-5">Fluxo de integração</p>
              <div className="flex flex-col gap-1">{["Frontend QuiloVolt","API Gateway Stellar Global Rails","Payment Service","Stellar SDK / Horizon API","Stellar Network","Receipt Service + Operator Dashboard"].map((s, i, arr) => (<div key={s} className="flex flex-col items-center"><div className="w-full text-center py-2.5 px-4 rounded-xl glass text-sm font-medium text-white border border-white/[0.06] hover:border-[#4aa8ff]/25 transition-all">{s}</div>{i < arr.length - 1 && (<ArrowRight size={14} className="text-[#4aa8ff]/30 rotate-90 my-0.5" />)}</div>))}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
