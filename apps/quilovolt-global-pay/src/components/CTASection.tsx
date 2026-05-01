"use client";
import { Zap, ArrowRight } from "lucide-react";

interface Props { onSimulate: () => void; onDashboard: () => void; onArchitecture: () => void; }

export default function CTASection({ onSimulate, onDashboard, onArchitecture }: Props) {
  return (
    <section id="cta" className="py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="glass rounded-3xl p-10 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"><div className="absolute inset-0 bg-gradient-to-br from-[#14d8c8]/05 via-transparent to-[#4aa8ff]/08 rounded-3xl" /></div>
          <div className="relative">
            <div className="flex justify-center gap-2 mb-6"><span className="px-3 py-1 text-xs font-semibold rounded-full border border-[#14d8c8]/40 text-[#14d8c8] bg-[#14d8c8]/10">MVP Hackathon</span><span className="px-3 py-1 text-xs font-semibold rounded-full border border-[#4aa8ff]/40 text-[#4aa8ff] bg-[#4aa8ff]/10">Stellar Global Rails</span></div>
            <h2 className="section-title text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">QuiloVolt <span className="bg-gradient-to-r from-[#14d8c8] to-[#4aa8ff] bg-clip-text text-transparent">Global Pay</span></h2>
            <p className="text-[#4aa8ff] text-lg font-semibold mb-4">Pagamentos inteligentes para a nova mobilidade elétrica</p>
            <p className="text-[#8ca4be] max-w-2xl mx-auto text-base leading-relaxed mb-10">A QuiloVolt Global Pay começa como um MVP de pagamento e sessão simulada, mas nasce como uma infraestrutura de pagamentos para operadores de recarga, frotas, pontos comerciais e mobilidade conectada. Construída sobre o Stellar Global Rails, a solução combina stablecoins, QR Code, rastreabilidade, comprovantes digitais e potencial de integração com carregadores reais.</p>
            <div className="flex flex-wrap gap-4 justify-center mb-12"><button onClick={onSimulate} className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#14d8c8] to-[#4aa8ff] text-[#050b16] font-bold text-base hover:opacity-90 transition-all shadow-xl shadow-[#14d8c8]/15"><Zap size={18} />Simular Pagamento</button><button onClick={onDashboard} className="flex items-center gap-2 px-8 py-4 rounded-xl glass text-white font-semibold text-base hover:border-[#4aa8ff]/40 transition-all">Ver Dashboard</button><button onClick={onArchitecture} className="flex items-center gap-2 px-8 py-4 rounded-xl glass text-[#8ca4be] font-semibold text-base hover:text-white transition-all">Explorar Arquitetura<ArrowRight size={16} /></button></div>
            <div className="border-t border-white/5 pt-8 flex flex-col items-center gap-2"><p className="text-white font-bold text-base">QuiloVolt Global Pay</p><p className="text-[#8ca4be] text-sm">Módulo do Stellar Global Rails</p><p className="text-[#3a5070] text-xs">Pagamentos para mobilidade elétrica usando Stellar</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}
