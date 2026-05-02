import { motion } from 'motion/react';

export default function BuiltForBuilders() {
  return (
    <section className="py-24 bg-neutral-950 text-white relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16 gs-fade-up">
          <span className="text-emerald-500 font-mono text-sm uppercase tracking-widest mb-4 block">Para quem constrói</span>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bricolage font-medium mb-6 leading-[0.9] tracking-tight">
            Feito por quem entende
            <span className="block text-white/30">de verdade.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "APIs para desenvolvedores", desc: "Integre em horas, não em semanas" },
            { title: "Documentação completa", desc: "Tudo que você precisa para começar" },
            { title: "Suporte técnico dedicado", desc: "Equipe que entende de Stellar" },
            { title: "Sandbox para testes", desc: "Teste sem mexer com dinheiro real" },
            { title: "Webhooks em tempo real", desc: "Receba notificações de cada transação" },
            { title: "SLA garantido", desc: "99.9% de uptime na rede" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
            >
              <h4 className="text-xl font-bricolage font-medium text-white mb-2">{item.title}</h4>
              <p className="text-white/50 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}