import { motion } from 'motion/react';

export default function GlobalReach() {
  return (
    <section className="py-24 bg-neutral-900 text-white relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16 gs-fade-up">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bricolage font-medium mb-6 leading-[0.9] tracking-tight">
            Feito para o mundo.
            <span className="block text-emerald-400"> nascido no Brasil.</span>
          </h2>
          <p className="text-white/50 text-xl font-light max-w-3xl mx-auto">
            Uma infraestrutura que não escolhe país. Conectamos o Brasil ao mundo e o mundo ao Brasil.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "180+", desc: "Países alcançáveis via Stellar" },
            { title: "R$0.01", desc: "Custo por transação internacional" },
            { title: "3-5s", desc: "Tempo médio de liquidação" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center"
            >
              <h3 className="text-5xl font-bricolage font-medium text-emerald-400 mb-4">{item.title}</h3>
              <p className="text-white/60">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}