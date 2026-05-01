"use client";
import { MapPin, Sliders, CreditCard, CheckCircle2, Zap, FileText, LayoutDashboard, ArrowRight } from "lucide-react";

const STEPS = [
  { icon: MapPin, title: "Selecionar estação", desc: "Usuário escolhe uma estação QuiloVolt próxima.", color: "#4aa8ff" },
  { icon: Sliders, title: "Escolher recarga", desc: "Seleciona valor ou kWh estimado desejado.", color: "#14d8c8" },
  { icon: CreditCard, title: "Cobrança gerada", desc: "Sistema gera cobrança em USDC ou BRZ.", color: "#7c6af7" },
  { icon: CheckCircle2, title: "Confirmar pagamento", desc: "Usuário confirma via carteira Stellar.", color: "#4aa8ff" },
  { icon: Zap, title: "Transação detectada", desc: "Stellar Global Rails detecta a transação.", color: "#14d8c8" },
  { icon: Zap, title: "Sessão liberada", desc: "Sessão de recarga liberada (simulada no MVP).", color: "#14d8c8" },
  { icon: FileText, title: "Comprovante gerado", desc: "Comprovante digital com hash e dados da sessão.", color: "#7c6af7" },
  { icon: LayoutDashboard, title: "Dashboard atualizado", desc: "Operador visualiza a transação em tempo real.", color: "#4aa8ff" },
];

interface Props { onSimulate: () => void; }

export default function UserFlowSection({ onSimulate }: Props) {
  return (
    <section id="como-funciona" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14"><p className="text-[#14d8c8] text-sm font-semibold uppercase tracking-widest mb-3">Como Funciona</p><h2 className="section-title text-4xl md:text-5xl font-extrabold text-white leading-tight">Jornada completa de pagamento</h2></div>
        <div className="hidden lg:grid grid-cols-8 gap-2 mb-16">{STEPS.map(({ icon: Icon, title, desc, color }, i) => (<div key={title} className="flex flex-col items-center gap-3 relative">{i < STEPS.length - 1 && (<div className="absolute top-5 left-[calc(50%+20px)] right-[-50%] h-px bg-gradient-to-r from-[#1e3a5f] to-transparent z-0" />)}<div className="w-10 h-10 rounded-full flex items-center justify-center z-10 flex-shrink-0 relative" style={{ background: `${color}20`, border: `2px solid ${color}50` }}><Icon size={16} style={{ color }} /></div><p className="text-white font-semibold text-xs text-center leading-tight">{title}</p><p className="text-[#8ca4be] text-xs text-center leading-tight">{desc}</p></div>))}</div>
        <div className="lg:hidden flex flex-col gap-0 mb-12">{STEPS.map(({ icon: Icon, title, desc, color }, i) => (<div key={title} className="flex gap-4"><div className="flex flex-col items-center"><div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${color}20`, border: `2px solid ${color}50` }}><Icon size={14} style={{ color }} /></div>{i < STEPS.length - 1 && <div className="w-px flex-1 bg-[#1e3a5f] my-1" />}</div><div className="pb-6"><p className="text-white font-semibold text-sm">{title}</p><p className="text-[#8ca4be] text-xs mt-1">{desc}</p></div></div>))}</div>
        <div className="glass rounded-2xl p-8 text-center"><p className="text-white font-semibold text-lg mb-2">Veja o fluxo em ação</p><p className="text-[#8ca4be] text-sm mb-6">A demo interativa simula todos os passos - estação, pagamento, sessão e comprovante.</p><button onClick={onSimulate} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#14d8c8] to-[#4aa8ff] text-[#050b16] font-bold hover:opacity-90 transition-all"><Zap size={16} />Iniciar Demo<ArrowRight size={16} /></button></div>
      </div>
    </section>
  );
}
