import { motion } from 'motion/react';
import { RailsLogo } from './ui/Logo';
import { useTranslation } from '../hooks/useTranslation';

export default function StatusQuo() {
  const { t } = useTranslation();
  const comparisons = [
    {
      bad: { title: t('status.bad1.title'), desc: t('status.bad1.desc') },
      good: { title: t('status.good1.title'), desc: t('status.good1.desc') }
    },
    {
      bad: { title: t('status.bad2.title'), desc: t('status.bad2.desc') },
      good: { title: t('status.good2.title'), desc: t('status.good2.desc') }
    },
    {
      bad: { title: t('status.bad3.title'), desc: t('status.bad3.desc') },
      good: { title: t('status.good3.title'), desc: t('status.good3.desc') }
    },
    {
      bad: { title: t('status.bad4.title'), desc: t('status.bad4.desc') },
      good: { title: t('status.good4.title'), desc: t('status.good4.desc') }
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
            {t('status.title')}
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            {t('status.desc')}
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
              <h3 className="text-2xl font-bricolage text-white relative z-10">{t('status.traditional')}</h3>
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
              <h3 className="text-2xl font-bricolage text-emerald-400 relative z-10">{t('status.rails')}</h3>
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
              <h3 className="text-2xl font-bricolage text-white">{t('status.traditional')}</h3>
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
              <h3 className="text-2xl font-bricolage text-emerald-400">{t('status.rails')}</h3>
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