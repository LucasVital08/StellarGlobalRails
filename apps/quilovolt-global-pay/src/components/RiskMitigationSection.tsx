"use client";

const RISKS = [
  { risk: "Integração com carregadores reais", mitigation: "MVP começa com sessão simulada e roadmap claro para OCPP/IoT. Não bloqueia a jornada de pagamento." },
  { risk: "Dependência de operadores", mitigation: "Começar com pontos parceiros e modelo white-label. Plataforma independe de hardware proprietário." },
  { risk: "Complexidade regulatória", mitigation: "Usar testnet no MVP e documentar requisitos para produção. Stablecoins como BRZ já têm arcabouço regulatório." },
  { risk: "Parecer apenas uma tela mockada", mitigation: "Fluxo funcional de pagamento, estados reais, sessão com timer, comprovante e dashboard atualizado pela demo." },
  { risk: "Concorrência de apps existentes", mitigation: "Posicionar como camada de pagamento interoperável, não apenas um app de recarga. B2B focado." },
];

const INVESTOR = [
  { title: "Mercado em crescimento", desc: "Mobilidade elétrica, recarga urbana, frotas e infraestrutura energética em forte expansão no Brasil.", color: "#4aa8ff" },
  { title: "Diferenciação", desc: "Pagamentos globais, stablecoins e trilha auditável on-chain. Sem dependência de adquirente tradicional.", color: "#14d8c8" },
  { title: "Escalabilidade", desc: "Pode atender carregadores, operadores, redes, frotas e mobilidade leve com a mesma infraestrutura.", color: "#7c6af7" },
  { title: "Sinergia", desc: "Integra-se ao Stellar Global Rails com FamilyBridge, Stellar Payouts, ContractEase, Vakinha Global e Stellar Invoice.", color: "#f59e0b" },
  { title: "MVP demonstrável", desc: "Mesmo sem hardware, o projeto prova a jornada crítica: cobrança, pagamento, confirmação, sessão, comprovante.", color: "#14d8c8" },
];

export default function RiskMitigationSection() {
  return (
    <>
      <section id="riscos" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12"><p className="text-[#14d8c8] text-sm font-semibold uppercase tracking-widest mb-3">Riscos</p><h2 className="section-title text-4xl md:text-5xl font-extrabold text-white">Riscos e mitigações</h2></div>
          <div className="glass rounded-2xl overflow-hidden">
            <div className="grid grid-cols-2 bg-[#0e1f3a]/60 text-xs font-bold text-[#8ca4be] uppercase tracking-widest"><div className="px-6 py-3">Risco</div><div className="px-6 py-3">Mitigação</div></div>
            {RISKS.map(({ risk, mitigation }, i) => (<div key={risk} className={`grid grid-cols-2 border-t border-white/5 ${i % 2 === 0 ? "" : "bg-white/[0.015]"}`}><div className="px-6 py-4 text-[#f87171] text-sm font-medium flex items-start gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#f87171] flex-shrink-0" />{risk}</div><div className="px-6 py-4 text-[#8ca4be] text-sm leading-relaxed">{mitigation}</div></div>))}
          </div>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12"><p className="text-[#14d8c8] text-sm font-semibold uppercase tracking-widest mb-3">Para Investidores</p><h2 className="section-title text-3xl md:text-4xl font-extrabold text-white">Por que apostar na QuiloVolt?</h2></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{INVESTOR.map(({ title, desc, color }) => (<div key={title} className="glass rounded-2xl p-6 flex flex-col gap-3"><span className="w-8 h-1 rounded-full" style={{ background: color }} /><p className="text-white font-bold">{title}</p><p className="text-[#8ca4be] text-sm leading-relaxed">{desc}</p></div>))}</div>
        </div>
      </section>
    </>
  );
}
