import { motion } from 'motion/react';
import { RailsLogo } from './ui/Logo';

export default function StatusQuo() {
  const comparisons = [
    {
      bad: { title: "Dias para liquidar (D+2, D+30)", desc: "Fluxos travados, empresas financiando capital de giro caro." },
      good: { title: "Liquidação em Segundos", desc: "Pagamento finalizado, irreversível e o capital chega na ponta imediatamente." }
    },
    {
      bad: { title: "Custos altíssimos em transações globais", desc: "SWIFT, câmbio spread, tarifas de correspondentes bancários." },
      good: { title: "Frações de um centavo", desc: "Custos previsíveis e negligenciáveis, permitindo micropagamentos reais." }
    },
    {
      bad: { title: "Barreiras de entrada rígidas", desc: "Exige contas bancárias formais, CNPJ, histórico de crédito perfeito." },
      good: { title: "Inclusivo (Não exige conta bancária)", desc: "Acesso democratizado via wallets non-custodial e anchors locais." }
    },
    {
      bad: { title: "Falta de interoperabilidade", desc: "Bancos isolados. Sistemas incompatíveis que exigem middlewares." },
      good: { title: "Padrão Aberto (On-chain)", desc: "Auditoria garantida, infraestrutura imutável e conectividade entre dApps." }
    }
  ];

  return (
    <section className="py-24 bg-neutral-950 text-white relative overflow-hidden border-t border-white/5 gs-fade-up">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bricolage font-medium mb-6">
            O problema dos trilhos antigos
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Sistemas financeiros desenhados no século passado não atendem à velocidade, escala e acessibilidade exigidas pelo mundo atual.
          </p>
        </motion.div>

        {/* Desktop Comparison Table */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="hidden md:block bg-neutral-900/50 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="grid grid-cols-2 border-b border-white/10">
            <div className="p-8 bg-red-500/5 flex items-center gap-4 relative overflow-hidden group">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-32 h-32 absolute top-0 right-0 bg-red-500/10 blur-[50px] rounded-full"
              ></motion.div>
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 relative z-10 shrink-0">
                {/* @ts-ignore */}
                <iconify-icon icon="solar:close-circle-bold" width="30"></iconify-icon>
              </div>
              <h3 className="text-2xl font-bricolage text-white relative z-10">Sistema Tradicional</h3>
            </div>
            <div className="p-8 bg-emerald-500/5 flex items-center gap-4 relative overflow-hidden group">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="w-32 h-32 absolute top-0 right-0 bg-emerald-500/10 blur-[50px] rounded-full"
              ></motion.div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-900/50 to-emerald-950/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400 relative z-10 shrink-0 group-hover:scale-110 transition-transform">
                <RailsLogo className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bricolage text-emerald-400 relative z-10">Stellar Global Rails</h3>
            </div>
          </div>

          <div className="flex flex-col relative bg-neutral-950/20">
            <div className="absolute inset-y-0 left-1/2 w-[1px] bg-white/5 z-0"></div>
            {comparisons.map((row, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="grid grid-cols-2 border-b border-white/5 last:border-0 relative z-10"
              >
                <div className="p-8 flex gap-5 hover:bg-white/[0.01] transition-colors">
                  <span className="text-red-500 mt-1 flex-shrink-0 text-xl leading-none opacity-60">✖</span>
                  <div>
                    <h4 className="font-medium mb-1 text-white/90 text-lg">{row.bad.title}</h4>
                    <p className="text-sm text-white/50 leading-relaxed pr-8">{row.bad.desc}</p>
                  </div>
                </div>
                <div className="p-8 flex gap-5 bg-emerald-500/[0.02] hover:bg-emerald-500/[0.04] transition-colors group">
                  <motion.span 
                    whileHover={{ scale: 1.2 }}
                    className="text-emerald-400 mt-1 flex-shrink-0 text-xl leading-none"
                  >
                    ✓
                  </motion.span>
                  <div>
                    <h4 className="font-medium mb-1 text-white/90 text-lg group-hover:text-white transition-colors">{row.good.title}</h4>
                    <p className="text-sm text-white/60 leading-relaxed pr-8 group-hover:text-white/80 transition-colors">{row.good.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mobile View */}
        <div className="grid grid-cols-1 md:hidden gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-red-500/5 border border-red-500/10 rounded-3xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] rounded-full"></div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                {/* @ts-ignore */}
                <iconify-icon icon="solar:close-circle-bold" width="30"></iconify-icon>
              </div>
              <h3 className="text-2xl font-bricolage text-white">Sistema Tradicional</h3>
            </div>
            <ul className="space-y-6 relative z-10">
              {comparisons.map((row, i) => (
                <li key={i} className="flex gap-4">
                  <span className="text-red-500 mt-1 flex-shrink-0">✖</span>
                  <div>
                    <h4 className="font-medium mb-1 text-white/90">{row.bad.title}</h4>
                    <p className="text-sm text-white/50">{row.bad.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full"></div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-900/50 to-emerald-950/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <RailsLogo className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bricolage text-emerald-400">Stellar Global Rails</h3>
            </div>
            <ul className="space-y-6 relative z-10">
              {comparisons.map((row, i) => (
                <li key={i} className="flex gap-4">
                  <span className="text-emerald-400 mt-1 flex-shrink-0">✓</span>
                  <div>
                    <h4 className="font-medium mb-1 text-white/90">{row.good.title}</h4>
                    <p className="text-sm text-white/60">{row.good.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}