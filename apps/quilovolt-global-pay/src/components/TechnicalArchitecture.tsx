"use client";

const BLOCKS = [
  { title: "Frontend", color: "#4aa8ff", items: ["React / Next.js", "Tailwind CSS", "Dashboard responsivo", "Fluxo de recarga", "Visualização de status"] },
  { title: "Backend", color: "#14d8c8", items: ["Node.js + Express", "APIs REST", "Serviço de sessões", "Serviço de pagamento", "Serviço de comprovantes", "Serviço de operadores"] },
  { title: "Blockchain", color: "#7c6af7", items: ["Stellar SDK", "Horizon API", "USDC / BRZ", "Stellar Testnet", "Freighter / Albedo", "Detecção de transações"] },
  { title: "Banco de dados", color: "#f59e0b", items: ["PostgreSQL", "Usuários", "Estações", "Sessões", "Transações", "Operadores", "Comprovantes"] },
  { title: "Integração futura", color: "#f87171", items: ["OCPP / IoT", "Carregadores reais", "Pix", "BRZ", "Split de receita", "Frotas", "Billing recorrente"] },
];

const DIAGRAM = ["Frontend QuiloVolt", "API Gateway - Stellar Global Rails", "Payment Service", "Stellar SDK / Horizon API", "Stellar Network", "Receipt Service + Operator Dashboard"];

export default function TechnicalArchitecture() {
  return (
    <section id="arquitetura" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"><div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7c6af7] opacity-[0.04] rounded-full blur-[100px]" /></div>
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-14"><p className="text-[#14d8c8] text-sm font-semibold uppercase tracking-widest mb-3">Arquitetura</p><h2 className="section-title text-4xl md:text-5xl font-extrabold text-white leading-tight">Arquitetura técnica</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">{BLOCKS.map(({ title, color, items }) => (<div key={title} className="glass rounded-2xl p-6 flex flex-col gap-4"><div className="flex items-center gap-3"><span className="w-2 h-8 rounded-full flex-shrink-0" style={{ background: color }} /><p className="text-white font-bold text-base">{title}</p></div><ul className="space-y-2">{items.map((item) => (<li key={item} className="flex items-center gap-2.5 text-[#8ca4be] text-sm"><span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: color }} />{item}</li>))}</ul></div>))}</div>
        <div className="glass rounded-2xl p-8 max-w-md mx-auto"><p className="text-[#8ca4be] text-xs uppercase tracking-widest text-center mb-6">Diagrama de integração</p><div className="flex flex-col items-center gap-0">{DIAGRAM.map((step, i) => (<div key={step} className="flex flex-col items-center w-full"><div className="glass rounded-xl px-4 py-3 w-full text-center text-sm text-white font-medium border border-white/[0.06] hover:border-[#4aa8ff]/30 transition-all">{step}</div>{i < DIAGRAM.length - 1 && (<div className="text-[#4aa8ff]/30 text-lg leading-none my-1">↓</div>)}</div>))}</div></div>
      </div>
    </section>
  );
}
