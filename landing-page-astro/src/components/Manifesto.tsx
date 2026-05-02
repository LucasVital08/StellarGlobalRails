import { motion } from 'motion/react';

export default function Manifesto() {
  return (
    <section className="py-32 bg-neutral-950 text-white relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(ellipse at center, rgba(16,185,129,0.2) 0%, transparent 60%)' }}></div>
      
      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="text-emerald-500 font-mono text-sm uppercase tracking-widest mb-4 block">Nossa missão</span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bricolage font-medium leading-tight">
            Democratizar o acesso a infraestrutura financeira global.
          </h2>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-white/60 text-lg md:text-xl leading-relaxed font-light mb-12"
        >
          Não queremos ser mais um banco. Queremos ser o trilho sobre o qual qualquer pessoa, empresa ou instituição pode construir suas próprias soluções financeiras — sem barreiras, sem burocracias, sem fronteiras.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a href="/investidores" className="px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-neutral-200 transition-colors">
            Para investidores
          </a>
          <a href="#modules" className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-medium hover:bg-white/10 transition-colors">
            Explorar módulos
          </a>
        </motion.div>
      </div>
    </section>
  );
}