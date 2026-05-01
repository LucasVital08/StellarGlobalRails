"use client";

const MODELS = [
  { title: "Taxa por transação", desc: "Pequena taxa sobre cada recarga paga pela plataforma.", color: "#4aa8ff" },
  { title: "Spread de conversão", desc: "Margem controlada sobre conversões entre stablecoins e moeda local.", color: "#14d8c8" },
  { title: "SaaS para operadores", desc: "Assinatura mensal para operadores de pontos de recarga.", color: "#7c6af7" },
  { title: "White-label", desc: "Plataforma personalizada para redes, shoppings, hotéis, estacionamentos e frotas.", color: "#f59e0b" },
  { title: "API de pagamentos", desc: "Cobrança por uso para integração com softwares de carregamento existentes.", color: "#4aa8ff" },
  { title: "Relatórios premium", desc: "Dashboards avançados para operadores e empresas.", color: "#14d8c8" },
  { title: "Gestão de frotas", desc: "Controle de recargas, consumo, pagamentos e relatórios corporativos.", color: "#7c6af7" },
];

const CASES = [
  { title: "Academia parceira", icon: "🏋️", desc: "Instala um carregador e usa QuiloVolt para receber pagamentos por QR Code sem criar app próprio." },
  { title: "Rodovia", icon: "🛣️", desc: "Motorista em viagem encontra estação, paga com stablecoin e recebe comprovante imediato." },
  { title: "Frotas", icon: "🚐", desc: "Empresa controla recargas de veículos, visualiza consumo, pagamentos e relatórios." },
  { title: "Ponto comercial", icon: "🏬", desc: "Shopping ou hotel oferece recarga como serviço adicional e recebe repasse automático." },
  { title: "Mobilidade leve", icon: "🛴", desc: "Patinetes e bikes elétricas usam micropagamentos para recarga ou uso por tempo." },
];

export default function BusinessModel() {
  return (
    <>
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12"><p className="text-[#14d8c8] text-sm font-semibold uppercase tracking-widest mb-3">Modelo de Negócio</p><h2 className="section-title text-4xl md:text-5xl font-extrabold text-white">Como a QuiloVolt gera receita</h2></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{MODELS.map(({ title, desc, color }) => (<div key={title} className="glass rounded-2xl p-6 flex flex-col gap-3 hover:scale-[1.01] transition-transform"><span className="w-8 h-1 rounded-full" style={{ background: color }} /><p className="text-white font-bold">{title}</p><p className="text-[#8ca4be] text-sm leading-relaxed">{desc}</p></div>))}</div>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12"><p className="text-[#14d8c8] text-sm font-semibold uppercase tracking-widest mb-3">Casos de Uso</p><h2 className="section-title text-4xl md:text-5xl font-extrabold text-white">Quem usa a QuiloVolt?</h2></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{CASES.map(({ title, icon, desc }) => (<div key={title} className="glass rounded-2xl p-6 flex flex-col gap-4"><span className="text-3xl">{icon}</span><p className="text-white font-bold">{title}</p><p className="text-[#8ca4be] text-sm leading-relaxed">{desc}</p></div>))}</div>
        </div>
      </section>
    </>
  );
}
