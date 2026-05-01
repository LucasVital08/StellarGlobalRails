"use client";
import { User, Building2, TrendingUp } from "lucide-react";

const PROBLEMS = [
  {
    icon: User,
    title: "Dor do usuário",
    color: "#4aa8ff",
    items: [
      "Cada rede exige um aplicativo diferente",
      "Pagamentos dependem de cartão, cadastro, app ou POS",
      "Experiência ruim para motoristas em viagem",
      "Falta de interoperabilidade entre operadores",
      "Dificuldade de pagar em moeda diferente internacionalmente",
    ],
  },
  {
    icon: Building2,
    title: "Dor do operador",
    color: "#14d8c8",
    items: [
      "Custos de cartão e adquirência",
      "Conciliação financeira manual",
      "Dificuldade de repasse para parceiros",
      "Falta de comprovantes padronizados",
      "Sistemas de carregadores nem sempre integram soluções financeiras",
    ],
  },
  {
    icon: TrendingUp,
    title: "Dor do mercado",
    color: "#7c6af7",
    items: [
      "Mobilidade elétrica cresce, mas pagamentos são locais e fragmentados",
      "Frotas precisam de controle e relatórios",
      "Donos de pontos precisam receber sua parte",
      "Operadores precisam de rastreabilidade e escalabilidade",
    ],
  },
];

export default function ProblemSection() {
  return (
    <section id="problema" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[#14d8c8] text-sm font-semibold uppercase tracking-widest mb-3">O Problema</p>
          <h2 className="section-title text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Pagamentos para mobilidade elétrica
            <br />
            <span className="text-[#4aa8ff]">ainda são fragmentados</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROBLEMS.map(({ icon: Icon, title, color, items }) => (
            <div key={title} className="glass rounded-2xl p-7 flex flex-col gap-5 hover:border-white/10 transition-all group">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${color}18`, border: `1px solid ${color}33` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <h3 className="text-white font-bold text-lg">{title}</h3>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[#8ca4be] text-sm leading-snug">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
