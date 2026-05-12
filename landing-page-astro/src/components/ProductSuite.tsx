import { productsData } from '../data/content';
import type { Product } from '../data/content';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import SpotlightCard from './ui/SpotlightCard';

function FeaturePill({ feature, delay, productId }: { feature: Product['features'][0]; delay: number; productId: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <SpotlightCard href={`/products/${productId}#${feature.id}`} className="group flex flex-col items-start gap-4 p-5 rounded-2xl h-full">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
          {/* @ts-ignore */}
          <iconify-icon icon={feature.icon} width="20" class="text-white/70"></iconify-icon>
        </div>
        <div>
          <h5 className="text-white font-medium text-sm mb-1">{feature.name}</h5>
          <p className="text-white/40 text-xs leading-relaxed">{feature.description}</p>
          <span className="inline-block mt-2 text-[10px] uppercase tracking-widest text-white/20">ex-{feature.originModule}</span>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

function AIAgentCard({ agent, delay, color }: { agent: Product['aiAgents'][0]; delay: number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="h-full"
    >
      <SpotlightCard className="p-4 rounded-xl h-full group">
        <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }}></div>
        <div className="flex items-center gap-3 mb-2">
          {/* @ts-ignore */}
          <iconify-icon icon={agent.icon} width="18" style={{ color }}></iconify-icon>
          <span className="text-white/90 text-sm font-medium">{agent.title}</span>
        </div>
        <p className="text-white/35 text-xs leading-relaxed">{agent.description}</p>
      </SpotlightCard>
    </motion.div>
  );
}

function ProductSection({ product, index }: { product: Product; index: number }) {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const isReversed = index % 2 !== 0;

  return (
    <motion.div
      ref={sectionRef}
      className="relative py-24 md:py-32"
    >
      {/* Subtle product color glow */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[200px] pointer-events-none opacity-[0.04]"
        style={{ 
          backgroundColor: product.color,
          [isReversed ? 'left' : 'right']: '-200px'
        }}
      ></div>

      <div className="w-full max-w-[90rem] mx-auto px-6 md:px-12">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start ${isReversed ? 'lg:direction-rtl' : ''}`}>
          
          {/* Info column */}
          <div className={`${isReversed ? 'lg:order-2' : 'lg:order-1'}`} style={{ direction: 'ltr' }}>
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <div 
                className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center"
                style={{ backgroundColor: `${product.color}15`, color: product.color }}
              >
                {/* @ts-ignore */}
                <iconify-icon icon={product.icon} width="22"></iconify-icon>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white font-bricolage font-semibold text-lg">{product.name}</span>
                <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium border" style={{ color: product.color, borderColor: `${product.color}30` }}>
                  {t('suite.product')} {index + 1}
                </span>
              </div>
            </motion.div>

            {/* Tagline */}
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bricolage font-medium text-white mb-6 leading-[1.1] tracking-tight"
            >
              {t(`suite.${product.id}.tagline`)}
            </motion.h3>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/50 text-lg leading-relaxed mb-10 max-w-xl"
            >
              {t(`suite.${product.id}.desc`)}
            </motion.p>

            {/* Differentials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-3 mb-10"
            >
              {product.differentials.slice(0, 3).map((diff, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    {/* @ts-ignore */}
                    <iconify-icon icon="solar:check-circle-linear" width="12" style={{ color: product.color }}></iconify-icon>
                  </div>
                  <span className="text-white/60 text-sm">{diff}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.a
              href={product.path}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-medium text-white border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all duration-300 group"
            >
              <span>{t('suite.explore_product')}</span>
              {/* @ts-ignore */}
              <iconify-icon icon="solar:arrow-right-linear" width="18" class="group-hover:translate-x-1 transition-transform"></iconify-icon>
            </motion.a>
          </div>

          {/* Features column */}
          <div className={`${isReversed ? 'lg:order-1' : 'lg:order-2'} space-y-4`} style={{ direction: 'ltr' }}>
            {/* Features grid */}
            <div className="space-y-4">
              {product.features.map((feature, i) => (
                <FeaturePill key={feature.id} feature={feature} delay={0.2 + i * 0.1} productId={product.id} />
              ))}
            </div>

            {/* AI Agents */}
            {product.aiAgents.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/5">
                <div className="flex items-center gap-2 mb-4">
                  {/* @ts-ignore */}
                  <iconify-icon icon="solar:cpu-bolt-linear" width="16" class="text-white/30"></iconify-icon>
                  <span className="text-[10px] uppercase tracking-widest text-white/30 font-medium">{t('suite.ai_agents')}</span>
                </div>
                <div className="space-y-3">
                  {product.aiAgents.map((agent, i) => (
                    <AIAgentCard key={agent.id} agent={agent} delay={0.3 + i * 0.1} color={product.color} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProductSuite() {
  const { t } = useTranslation();

  return (
    <section id="products" className="bg-neutral-950 relative border-t border-white/5">
      {/* Section header */}
      <div className="w-full max-w-[90rem] mx-auto px-6 md:px-12 pt-24 md:pt-32 pb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] w-12 bg-emerald-500"></div>
          <span className="text-emerald-500 font-medium tracking-[0.2em] uppercase text-sm">{t('suite.badge')}</span>
        </div>
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-bricolage font-medium text-white mb-8 leading-[0.85] tracking-tighter">
          {t('suite.title')}
        </h2>
        <p className="text-white/40 text-xl md:text-2xl font-light max-w-3xl leading-relaxed">
          {t('suite.subtitle')}
        </p>
      </div>

      {/* Product sections */}
      <div className="divide-y divide-white/5">
        {productsData.map((product, idx) => (
          <ProductSection key={product.id} product={product} index={idx} />
        ))}
      </div>

      {/* Closing banner: ONYX Compliance */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-[90rem] mx-auto px-6 md:px-12 py-16"
      >
        <div className="relative rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[120px] bg-amber-500/10 pointer-events-none"></div>
          <div className="flex items-center gap-5 relative z-10">
            {/* @ts-ignore */}
            <iconify-icon icon="lucide:shield-check" width="40" class="text-amber-500/70"></iconify-icon>
            <div>
              <h4 className="text-white font-bricolage font-medium text-xl mb-1">{t('suite.onyx.title')}</h4>
              <p className="text-white/40 text-sm max-w-lg">{t('suite.onyx.desc')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500/80 text-xs font-medium tracking-wide uppercase shrink-0">
            {/* @ts-ignore */}
            <iconify-icon icon="solar:shield-check-linear" width="14"></iconify-icon>
            <span>{t('suite.onyx.badge')}</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
