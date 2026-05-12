import { motion, useScroll, useTransform } from 'motion/react';
import { useTranslation } from '../hooks/useTranslation';
import { useRef, useState, useEffect } from 'react';

function Counter({ value, duration = 2 }: { value: string, duration?: number }) {
  const [count, setCount] = useState(0);
  const target = parseInt(value.replace(/\D/g, ''));
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    let start = 0;
    const end = target;
    const totalFrames = duration * 60;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      setCount(Math.floor(end * progress));

      if (frame === totalFrames) clearInterval(timer);
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count}{suffix}</span>;
}

function WorldMap() {
  return (
    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
      {/* Stylized Dots Map Background */}
      <div className="absolute inset-0" style={{ 
        backgroundImage: 'radial-gradient(circle, rgba(16,185,129,0.2) 1px, transparent 1px)', 
        backgroundSize: '30px 30px' 
      }} />
      
      {/* Radar Pulse from Brazil */}
      <div className="absolute top-[65%] left-[30%] w-4 h-4">
         <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping" />
         <div className="absolute inset-[-40px] border border-emerald-500/20 rounded-full animate-[ping_4s_linear_infinite]" />
         <div className="absolute inset-[-80px] border border-emerald-500/10 rounded-full animate-[ping_6s_linear_infinite]" />
      </div>

      {/* Global Connections Lines (Simplified) */}
      <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 1000 500">
        <motion.path 
          d="M300,325 Q500,100 800,200" 
          fill="none" 
          stroke="url(#lineGrad)" 
          strokeWidth="1" 
          strokeDasharray="10,10"
          animate={{ strokeDashoffset: -100 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.path 
          d="M300,325 Q200,150 100,250" 
          fill="none" 
          stroke="url(#lineGrad)" 
          strokeWidth="1" 
          strokeDasharray="10,10"
          animate={{ strokeDashoffset: 100 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="1" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function GlobalReach() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <section className="py-32 bg-neutral-950 text-white relative overflow-hidden border-t border-white/5">
      <WorldMap />

      {/* Technical Scanning Line */}
      <motion.div 
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-y-0 w-px bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent z-10"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          onViewportEnter={() => setIsVisible(true)}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 mb-6">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Live Network Status</span>
          </div>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bricolage font-medium mb-8 leading-[0.85] tracking-tighter">
            {t('reach.title.part1')}
            <span className="block text-emerald-400">{t('reach.title.part2')}</span>
          </h2>
          <p className="text-white/40 text-xl font-light max-w-3xl mx-auto leading-relaxed">
            {t('reach.desc')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { title: t('reach.stat1.title'), desc: t('reach.stat1.desc'), icon: "solar:globus-linear" },
            { title: t('reach.stat2.title'), desc: t('reach.stat2.desc'), icon: "solar:bill-list-linear" },
            { title: t('reach.stat3.title'), desc: t('reach.stat3.desc'), icon: "solar:stopwatch-linear" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="group relative"
            >
              <div className="absolute -inset-4 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors rounded-[2.5rem] -z-10" />
              <div className="bg-neutral-900/40 border border-white/5 backdrop-blur-xl rounded-[2rem] p-10 text-center relative overflow-hidden group-hover:border-emerald-500/20 transition-all duration-500 shadow-2xl">
                
                {/* Technical Corner */}
                <div className="absolute top-0 right-0 w-16 h-16 opacity-20">
                   <div className="absolute top-4 right-4 w-4 h-px bg-white" />
                   <div className="absolute top-4 right-4 w-px h-4 bg-white" />
                </div>

                <div className="mb-6 inline-flex w-16 h-16 rounded-2xl bg-white/5 items-center justify-center text-emerald-400/50 group-hover:text-emerald-400 transition-colors">
                   {/* @ts-ignore */}
                   <iconify-icon icon={item.icon} width="32"></iconify-icon>
                </div>

                <h3 className="text-6xl font-bricolage font-medium text-emerald-400 mb-4 tracking-tighter">
                  {isVisible ? <Counter value={item.title} /> : item.title}
                </h3>
                <p className="text-white/40 font-light group-hover:text-white/60 transition-colors leading-relaxed">
                  {item.desc}
                </p>

                {/* Sub-text decoration */}
                <div className="mt-8 pt-8 border-t border-white/5 font-mono text-[10px] text-white/10 uppercase tracking-widest">
                   System Verified Protocol
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}