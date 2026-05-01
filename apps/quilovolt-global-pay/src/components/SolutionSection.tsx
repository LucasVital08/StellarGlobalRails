"use client";
import { QrCode, Wallet, CheckCircle2, FileText, BarChart3, Rocket } from "lucide-react";

const PILLARS = [
  { icon: QrCode, title: "QR Code de pagamento", description: "O usuário escaneia o QR Code do ponto de recarga, sem app obrigatório ou cadastro prévio.", tag: "UX", color: "#14d8c8" },
  { icon: Wallet, title: "Pagamento via Stellar", description: "O sistema gera uma cobrança em USDC ou BRZ e registra a operação no ledger Stellar.", tag: "Blockchain", color: "#4aa8ff" },
  { icon: CheckCircle2, title: "Confirmação rápida", description: "A transação é detectada via Stellar Horizon e a sessão de recarga é liberada.", tag: "Real-time", color: "#14d8c8" },
  { icon: FileText, title: "Comprovante automático", description: "O usuário recebe comprovante com valor, energia estimada, estação, data e hash.", tag: "Auditável", color: "#7c6af7" },
  { icon: BarChart3, title: "Dashboard do operador", description: "O operador acompanha sessões, valores, taxas e status em tempo real.", tag: "Operacional", color: "#4aa8ff" },
  { icon: Rocket, title: "Roadmap de integração", description: "Integração futura com carregadores reais, OCPP, Pix, BRZ, frotas e split de receita.", tag: "Roadmap", color: "#7c6af7" },
];

export default function SolutionSection() {
  return (
    <section id="solucao" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"><div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-[#4aa8ff] opacity-[0.04] rounded-full blur-[100px]" /></div>
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-5">
          <p className="text-[#14d8c8] text-sm font-semibold uppercase tracking-widest mb-3">A Solução</p>
          <h2 className="section-title text-4xl md:text-5xl font-extrabold text-white leading-tight mb-5">Uma camada de pagamento Stellar<br /><span className="text-[#14d8c8]">para recarga elétrica</span></h2>
          <p className="text-[#8ca4be] max-w-2xl mx-auto text-base md:text-lg leading-relaxed">A QuiloVolt Global Pay não substitui o software do carregador. Ela funciona como uma <strong className="text-white">camada de pagamento e liquidação</strong> que pode ser integrada a operadores, dashboards, sistemas de recarga e, futuramente, protocolos como OCPP.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-12">{["Mock OCPP", "Stellar Ready", "Stablecoins", "MVP"].map((b) => (<span key={b} className="px-3 py-1 rounded-full text-xs font-semibold border border-[#4aa8ff]/30 text-[#4aa8ff] bg-[#4aa8ff]/08">{b}</span>))}</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{PILLARS.map(({ icon: Icon, title, description, tag, color }) => (<div key={title} className="glass rounded-2xl p-6 flex flex-col gap-4 hover:scale-[1.02] transition-transform"><div className="flex items-center justify-between"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18`, border: `1px solid ${color}33` }}><Icon size={18} style={{ color }} /></div><span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>{tag}</span></div><h3 className="text-white font-bold text-base">{title}</h3><p className="text-[#8ca4be] text-sm leading-relaxed">{description}</p></div>))}</div>
      </div>
    </section>
  );
}
