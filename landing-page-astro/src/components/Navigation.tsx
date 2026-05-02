import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { useState } from 'react';
import { RailsLogo } from './ui/Logo';

export default function Navigation() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.div 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: hidden ? -150 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed flex z-[100] pr-6 pl-6 top-6 right-0 left-0 justify-center pointer-events-none"
    >
      <nav className="flex w-full max-w-7xl items-center justify-between pointer-events-auto">
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-black to-neutral-900 border border-white/20 flex items-center justify-center text-white group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:border-emerald-500/30 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <RailsLogo className="w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <span className="font-bricolage text-xl tracking-tight font-medium text-white leading-none group-hover:text-emerald-400 transition-colors">
              STELLAR
            </span>
            <span className="text-[10px] text-white/50 tracking-[0.2em] font-mono leading-none mt-1 group-hover:text-white/70 transition-colors">GLOBAL RAILS</span>
          </div>
        </a>

        <div className="hidden md:flex bg-neutral-900/80 border-white/10 border rounded-full pt-2 pb-2 px-6 shadow-xl backdrop-blur-xl items-center gap-8 text-sm font-medium text-white/60">
          <a href="/" className="hover:text-white transition-colors">
            A Plataforma
          </a>
          <a href="/#modules" className="hover:text-white transition-colors">
            Módulos Ativos
          </a>
          <a href="/investidores" className="hover:text-emerald-400 text-emerald-500 transition-colors">
            Investidores
          </a>
        </div>

        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('https://kivo.com.br', '_blank')}
            className="hidden md:flex bg-white text-black px-5 py-2.5 rounded-full text-sm font-medium hover:bg-emerald-400 hover:text-black transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(52,211,153,0.4)] group items-center"
          >
            Acesso
            {/* @ts-ignore */}
            <iconify-icon icon="solar:arrow-right-linear" width="16" class="ml-2 group-hover:translate-x-1 transition-transform"></iconify-icon>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white bg-neutral-900/80 border border-white/10 hover:bg-white/10 backdrop-blur-xl transition-colors md:hidden"
          >
            {/* @ts-ignore */}
            <iconify-icon icon="solar:hamburger-menu-linear" width="20"></iconify-icon>
          </motion.button>
        </div>
      </nav>
    </motion.div>
  );
}