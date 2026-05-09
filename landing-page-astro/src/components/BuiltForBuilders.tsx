import { motion } from 'motion/react';
import { useTranslation } from '../hooks/useTranslation';

export default function BuiltForBuilders() {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-neutral-950 text-white relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16 gs-fade-up">
          <span className="text-emerald-500 font-mono text-sm uppercase tracking-widest mb-4 block">
            {t('builders.badge')}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bricolage font-medium mb-6 leading-[0.9] tracking-tight">
            {t('builders.title.part1')}
            <span className="block text-white/30">{t('builders.title.part2')}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: t('builders.card1.title'), desc: t('builders.card1.desc') },
            { title: t('builders.card2.title'), desc: t('builders.card2.desc') },
            { title: t('builders.card3.title'), desc: t('builders.card3.desc') },
            { title: t('builders.card4.title'), desc: t('builders.card4.desc') },
            { title: t('builders.card5.title'), desc: t('builders.card5.desc') },
            { title: t('builders.card6.title'), desc: t('builders.card6.desc') }
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