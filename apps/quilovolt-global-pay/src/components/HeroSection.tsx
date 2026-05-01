"use client";
import { Zap, QrCode, Wallet, CheckCircle2, Globe, ArrowRight, ChevronDown } from "lucide-react";

const BADGES = [
  { icon: Zap, label: "Pagamento em segundos" },
  { icon: Wallet, label: "USDC / BRZ" },
  { icon: Globe, label: "Rastreabilidade on-chain" },
  { icon: CheckCircle2, label: "Comprovante automático" },
  { icon: QrCode, label: "Integração futura OCPP/IoT" },
];

const FLOW = [
  { label: "Usuário" },
  { label: "QR Code" },
  { label: "Stellar\nGlobal Rails" },
  { label: "Stellar\nNetwork" },
  { label: "Operador" },
];

interface Props {
  onSimulate: () => void;
  onDashboard: () => void;
  onArchitecture: () => void;
}

export default function HeroSection({ onSimulate, onDashboard, onArchitecture }: Props) {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden px-4 pt-20 pb-12">
      <div className="absolute inset-0 grid-lines mask-bottom opacity-40 pointer-events-none" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#14d8c8] opacity-[0.07] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-32 right-8 w-[320px] h-[320px] bg-[#4aa8ff] opacity-[0.09] rounded-full blur-[80px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto w-full">
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <span className="px-3 py-1 text-xs font-semibold rounded-full border border-[#14d8c8]/40 text-[#14d8c8] bg-[#14d8c8]/10 tracking-wide">MVP Hackathon</span>
          <span className="px-3 py-1 text-xs font-semibold rounded-full border border-[#4aa8ff]/40 text-[#4aa8ff] bg-[#4aa8ff]/10 tracking-wide">Stellar Global Rails</span>
          <span className="px-3 py-1 text-xs font-semibold rounded-full border border-amber-400/40 text-amber-400 bg-amber-400/10 tracking-wide">Testnet</span>
        </div>

        <h1 className="section-title text-center text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6">
          <span className="text-white">QuiloVolt</span>{" "}
          <span className="bg-gradient-to-r from-[#14d8c8] via-[#4aa8ff] to-[#7c6af7] bg-clip-text text-transparent">Global Pay</span>
        </h1>

        <p className="text-center text-[#4aa8ff] text-xl md:text-2xl font-semibold mb-4 tracking-tight">Pagamentos instantâneos para mobilidade elétrica</p>
        <p className="text-center text-[#8ca4be] max-w-2xl mx-auto text-base md:text-lg leading-relaxed mb-10">
          A QuiloVolt Global Pay é uma camada de pagamento para recargas elétricas, frotas e serviços de mobilidade conectada. O usuário escaneia um QR Code, paga com stablecoin via Stellar, recebe confirmação em tempo real e a sessão de recarga é liberada de forma rastreável.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-14">
          <button onClick={onSimulate} className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#14d8c8] to-[#4aa8ff] text-[#050b16] font-bold text-base hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-[#14d8c8]/20"><Zap size={18} />Simular Recarga</button>
          <button onClick={onDashboard} className="flex items-center gap-2 px-7 py-3.5 rounded-xl glass text-white font-semibold text-base hover:border-[#4aa8ff]/40 transition-all">Ver Dashboard</button>
          <button onClick={onArchitecture} className="flex items-center gap-2 px-7 py-3.5 rounded-xl glass text-[#8ca4be] font-semibold text-base hover:text-white transition-all">Entender Arquitetura<ArrowRight size={16} /></button>
        </div>

        <div className="glass rounded-2xl p-6 md:p-8 max-w-3xl mx-auto mb-12">
          <p className="text-xs text-[#8ca4be] text-center mb-6 uppercase tracking-widest">Fluxo de pagamento</p>
          <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
            {FLOW.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2 flex-1 min-w-0">
                <div className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold bg-[#0e1f3a] border border-[#4aa8ff]/30 text-[#4aa8ff]">{i + 1}</div>
                  <span className="text-xs text-[#8ca4be] text-center whitespace-pre-line leading-tight">{step.label}</span>
                </div>
                {i < FLOW.length - 1 && (<ArrowRight size={14} className="text-[#4aa8ff]/40 flex-shrink-0 mb-5" />)}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {BADGES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-[#c8d8ec] border border-white/5"><Icon size={14} className="text-[#14d8c8]" />{label}</div>
          ))}
        </div>

        <div className="flex justify-center mt-14 animate-bounce"><ChevronDown size={22} className="text-[#4aa8ff]/40" /></div>
      </div>
    </section>
  );
}
