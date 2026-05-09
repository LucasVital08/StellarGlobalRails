import { motion } from 'motion/react';
import { useTranslation } from '../hooks/useTranslation';

export default function Platform() {
  const { t, lang } = useTranslation();


  return (
    <section className="py-24 bg-neutral-900 text-white relative overflow-hidden" id="platform">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"
      ></motion.div>
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6 gs-fade-up">
              <span className="w-8 h-[1px] bg-emerald-500"></span>
              <span className="text-emerald-500 text-xs font-mono uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Stellar Global Rails
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bricolage font-medium mb-6 leading-[0.9] tracking-tight gs-fade-up">
              {t('platform.title')}
              <br />
              <span className="text-white/30 italic font-serif">{t('platform.subtitle')}</span>
            </h2>
            <p className="text-white/60 text-lg mb-8 leading-relaxed font-light gs-fade-up" data-delay="0.1">
               {t('platform.desc')}
            </p>

            <div className="space-y-6">
              <div className="flex gap-4 group cursor-default gs-fade-up" data-delay="0.2">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/50 transition-colors text-emerald-400">
                  {/* @ts-ignore */}
                  <iconify-icon icon="solar:bolt-circle-linear" width="24"></iconify-icon>
                </div>
                <div>
                  <h4 className="text-xl font-medium mb-1 font-bricolage">{t('platform.feature1.title')}</h4>
                  <p className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
                    {t('platform.feature1.desc')}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 group cursor-default gs-fade-up" data-delay="0.3">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 group-hover:border-blue-500/50 transition-colors text-blue-400">
                  {/* @ts-ignore */}
                  <iconify-icon icon="solar:global-linear" width="24"></iconify-icon>
                </div>
                <div>
                  <h4 className="text-xl font-medium mb-1 font-bricolage">{t('platform.feature2.title')}</h4>
                  <p className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
                    {t('platform.feature2.desc')}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 group cursor-default gs-fade-up" data-delay="0.4">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 group-hover:border-purple-500/50 transition-colors text-purple-400">
                  {/* @ts-ignore */}
                  <iconify-icon icon="solar:shield-check-linear" width="24"></iconify-icon>
                </div>
                <div>
                  <h4 className="text-xl font-medium mb-1 font-bricolage">{t('platform.feature3.title')}</h4>
                  <p className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
                    {t('platform.feature3.desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative lg:h-[600px] w-full rounded-3xl overflow-hidden border border-white/10 group gs-fade-up h-[300px] md:h-[500px] shadow-2xl" 
            data-delay="0.2"
          >
            <div className="absolute inset-0 z-10 mix-blend-overlay opacity-30 shadow-[inset_0_0_100px_rgba(0,0,0,1)] pointer-events-none"></div>
            <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/ee3841e8-ef6d-45b3-9f33-9df069f9708a_1600w.webp" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 mix-blend-luminosity brightness-75 group-hover:brightness-100" alt="Infrastructure Architecture" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-neutral-900/40 z-0"></div>

            {/* Smart Nodes */}
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.5 }}
              viewport={{ once: true }}
              className="absolute top-1/4 left-1/3 group/spot z-20"
            >
              <div className="w-4 h-4 bg-emerald-500 rounded-full animate-ping absolute inset-0"></div>
              <div className="w-4 h-4 bg-emerald-500 rounded-full relative z-10 cursor-pointer border-2 border-white shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>
              <div className="absolute left-6 top-0 bg-black/80 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 w-56 opacity-0 group-hover/spot:opacity-100 transition-all duration-300 translate-y-2 group-hover/spot:translate-y-0 pointer-events-none">
                <span className="text-xs font-mono text-emerald-400 block mb-1 uppercase tracking-wider">
                  {t('platform.settlement_done')}
                </span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.7 }}
              viewport={{ once: true }}
              className="absolute bottom-1/3 right-1/4 group/spot z-20"
            >
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping absolute inset-0 [animation-delay:0.5s]"></div>
              <div className="w-4 h-4 bg-blue-500 rounded-full relative z-10 cursor-pointer border-2 border-white shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
              <div className="absolute right-6 top-0 bg-black/80 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 w-56 opacity-0 group-hover/spot:opacity-100 transition-all duration-300 translate-y-2 group-hover/spot:translate-y-0 pointer-events-none text-right">
                <span className="text-xs font-mono text-blue-400 block mb-1 uppercase tracking-wider">
                  {t('platform.audit_active')}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}