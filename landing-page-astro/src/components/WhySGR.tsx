import { motion } from 'motion/react';
import { useTranslation } from '../hooks/useTranslation';

export default function WhySGR() {
  const { t, lang } = useTranslation();

  const pillars = [
    {
      id: 'socialpay',
      title: t('whysgr.p1.title'),
      desc: t('whysgr.p1.desc'),
      icon: 'solar:users-group-rounded-bold-duotone',
      color: '#EC4899',
      label: 'Identidade'
    },
    {
      id: 'contractease',
      title: t('whysgr.p2.title'),
      desc: t('whysgr.p2.desc'),
      icon: 'solar:document-text-bold-duotone',
      color: '#8B5CF6',
      label: 'Regras'
    },
    {
      id: 'kivopay',
      title: t('whysgr.p3.title'),
      desc: t('whysgr.p3.desc'),
      icon: 'solar:flash-drive-bold-duotone',
      color: '#10B981',
      label: 'Execução'
    }
  ];

  return (
    <section id="why-sgr" className="py-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a1a1a_0%,transparent_70%)] opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-emerald-500 font-mono text-sm uppercase tracking-widest mb-4 block"
          >
            Os 3 Pilares da SGR
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bricolage font-medium text-white mb-6"
          >
            {t('whysgr.title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/40 max-w-2xl mx-auto"
          >
            {t('whysgr.subtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * (i + 1) }}
              className="group relative p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-700 overflow-hidden"
            >
              {/* Background Glow */}
              <div 
                className="absolute -top-24 -right-24 w-48 h-48 blur-[80px] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-700"
                style={{ backgroundColor: pillar.color }}
              ></div>

              <div className="relative z-10">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500"
                  style={{ backgroundColor: `${pillar.color}15`, color: pillar.color, border: `1px solid ${pillar.color}30` }}
                >
                  {/* @ts-ignore */}
                  <iconify-icon icon={pillar.icon} width="32"></iconify-icon>
                </div>

                <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-4 block font-mono">
                  {pillar.label}
                </span>
                
                <h3 className="text-3xl font-bricolage font-medium text-white mb-6">
                  {pillar.title}
                </h3>
                
                <p className="text-white/40 leading-relaxed mb-8 text-lg">
                  {pillar.desc}
                </p>

                <div className="flex items-center gap-2 text-sm font-medium" style={{ color: pillar.color }}>
                  <span>Conhecer {pillar.id}</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
              
              {/* Bottom Decoration */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-1 transition-all duration-700 scale-x-0 group-hover:scale-x-100"
                style={{ backgroundColor: pillar.color }}
              ></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
