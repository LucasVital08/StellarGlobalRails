"use client";

const PHASES = [
  { phase: "Fase 1", title: "MVP Hackathon", color: "#4aa8ff", tag: "Agora", items: ["Front profissional responsivo", "Estações mockadas", "Pagamento Stellar testnet", "Sessão simulada + contador", "Comprovante digital", "Dashboard do operador"] },
  { phase: "Fase 2", title: "Integração técnica", color: "#14d8c8", tag: "Q3 2026", items: ["Stellar SDK real", "Horizon API", "Freighter / Albedo wallets", "Banco de dados PostgreSQL", "APIs internas"] },
  { phase: "Fase 3", title: "Operação piloto", color: "#7c6af7", tag: "Q4 2026", items: ["Integração com carregador real", "Operador parceiro", "Validação em ponto físico", "Medição de sessões reais"] },
  { phase: "Fase 4", title: "Infraestrutura", color: "#f59e0b", tag: "2027", items: ["OCPP / IoT", "Integração Pix + BRZ", "Split de receita automático", "Emissão fiscal", "Gestão de frotas"] },
  { phase: "Fase 5", title: "Escala", color: "#f87171", tag: "2027+", items: ["White-label", "Rede de parceiros", "Expansão para rodovias", "Integração com apps de mobilidade", "API pública"] },
];

export default function RoadmapSection() {
  return (
    <section id="roadmap" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14"><p className="text-[#14d8c8] text-sm font-semibold uppercase tracking-widest mb-3">Roadmap</p><h2 className="section-title text-4xl md:text-5xl font-extrabold text-white">Do MVP à escala nacional</h2></div>
        <div className="flex flex-col md:flex-row gap-5">{PHASES.map(({ phase, title, color, tag, items }, i) => (<div key={phase} className={`flex-1 glass rounded-2xl p-6 flex flex-col gap-4 border-t-2 ${i === 0 ? "ring-1 ring-[#4aa8ff]/30" : ""}`} style={{ borderTopColor: color }}><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wider" style={{ color }}>{phase}</span><span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>{tag}</span></div><p className="text-white font-bold text-base">{title}</p>{i === 0 && (<span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#4aa8ff]/20 text-[#4aa8ff] border border-[#4aa8ff]/30 self-start">MVP Hackathon ✓</span>)}<ul className="space-y-2">{items.map((item) => (<li key={item} className="flex items-start gap-2 text-[#8ca4be] text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />{item}</li>))}</ul></div>))}</div>
      </div>
    </section>
  );
}
