import { motion } from 'motion/react';

export default function Hero() {
  return (
    <header className="relative w-full overflow-hidden flex flex-col justify-end pb-12 md:pb-24 min-h-screen md:h-screen perspective-1000">
      <div className="absolute inset-0 z-0 bg-black">
        <motion.img 
          initial={{ scale: 1.5, filter: 'blur(30px) grayscale(100%)', opacity: 0 }}
          animate={{ scale: 1, filter: 'blur(0px) grayscale(0%)', opacity: 1 }}
          transition={{ duration: 4, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=3840&auto=format&fit=crop" 
          className="w-full h-full object-cover mix-blend-luminosity brightness-75" 
          alt="Earth from space" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-80 z-10"></div>
        <div className="bg-black/10 mix-blend-overlay absolute inset-0 z-10"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 1.8 }}
        className="absolute top-32 right-6 md:right-12 z-20 flex flex-col items-end gap-2"
      >
        <div className="px-4 py-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-mono tracking-wider uppercase text-white/90">
            Live: Stellar Mainnet
          </span>
        </div>
      </motion.div>

      <div className="relative z-20 w-full max-w-[90rem] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        <div className="md:col-span-7 relative">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="h-[1px] w-8 bg-white/60"></span>
            <span className="text-xs font-mono uppercase tracking-widest text-white/80">
              Versão Core 2026
            </span>
          </motion.div>

          <h1 className="font-bricolage text-white leading-[0.85] tracking-tight font-semibold">
            <span className="block text-[12vw] md:text-[6rem] lg:text-[7rem] mix-blend-normal text-white drop-shadow-2xl">
              <span className="inline-block overflow-hidden pb-2">
                <motion.span initial={{ y: "120%", rotateZ: 2, opacity: 0 }} animate={{ y: 0, rotateZ: 0, opacity: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 1.0 }} className="inline-block">Um</motion.span>
              </span>{' '}
              <span className="inline-block overflow-hidden pb-2">
                <motion.span initial={{ y: "120%", rotateZ: 2, opacity: 0 }} animate={{ y: 0, rotateZ: 0, opacity: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 1.1 }} className="inline-block">trilho</motion.span>
              </span>
            </span>
            <div className="flex flex-col gap-2 mt-4 md:mt-2">
              <span className="text-[10vw] md:text-[5rem] lg:text-[6rem] text-white/50 leading-none">
                <span className="inline-block overflow-hidden pb-2">
                  <motion.span initial={{ y: "120%", rotateZ: 2, opacity: 0 }} animate={{ y: 0, rotateZ: 0, opacity: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 1.2 }} className="inline-block">financeiro</motion.span>
                </span>{' '}
                <span className="inline-block overflow-hidden pb-2">
                  <motion.span initial={{ y: "120%", rotateZ: 2, opacity: 0 }} animate={{ y: 0, rotateZ: 0, opacity: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 1.3 }} className="inline-block">global.</motion.span>
                </span>
              </span>
              <span className="text-[8vw] md:text-[4rem] lg:text-[4rem] font-serif italic font-thin text-emerald-400 mt-2">
                <span className="inline-block overflow-hidden pb-2"><motion.span initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.5, ease: "easeOut", delay: 1.4 }} className="inline-block">Construído</motion.span></span>{' '}
                <span className="inline-block overflow-hidden pb-2"><motion.span initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.5, ease: "easeOut", delay: 1.48 }} className="inline-block">sobre</motion.span></span>{' '}
                <span className="inline-block overflow-hidden pb-2"><motion.span initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.5, ease: "easeOut", delay: 1.56 }} className="inline-block">a</motion.span></span>{' '}
                <span className="inline-block overflow-hidden pb-2"><motion.span initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.5, ease: "easeOut", delay: 1.64 }} className="inline-block">rede</motion.span></span>{' '}
                <span className="inline-block overflow-hidden pb-2"><motion.span initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.5, ease: "easeOut", delay: 1.72 }} className="inline-block">Stellar.</motion.span></span>
              </span>
            </div>
          </h1>
        </div>

        <div className="md:col-span-4 md:col-start-9 flex flex-col justify-end pb-4 md:pb-8">
          <motion.div 
            initial={{ opacity: 0, x: 40, rotateY: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 1.6 }}
            className="overflow-hidden md:p-8 bg-neutral-950/60 border-white/10 border rounded-2xl ring-white/5 ring-1 p-6 relative shadow-2xl backdrop-blur-2xl"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent z-0 pointer-events-none animate-shimmer-effect"></div>

            <div className="relative z-10">
              <p className="text-lg md:text-xl text-white font-light leading-relaxed mb-8 antialiased drop-shadow-md">
                Remessa familiar, payout institucional, certificado verificável e ponto de venda sem banco — tudo na mesma infraestrutura, com liquidação em segundos e taxa mínima.
              </p>

              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-6">
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">
                      Liquidação
                    </span>
                    <span className="text-2xl font-bricolage text-white">3-5s</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">
                      Módulos Startups
                    </span>
                    <span className="text-2xl font-bricolage text-white">13</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-white/20 pt-6">
                  <a href="#modules" className="group block">
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-between w-full p-3 border border-white/30 rounded-xl text-white hover:bg-white hover:text-black transition-all"
                    >
                      <span className="text-sm font-medium tracking-wide text-white">
                        Explorar os módulos
                      </span>
                      {/* @ts-ignore */}
                      <iconify-icon icon="solar:arrow-right-linear" class="group-hover:translate-x-1 transition-transform" width="18"></iconify-icon>
                    </motion.div>
                  </a>
                  
                  <a href="/investidores" className="group block">
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-between w-full p-3 border border-transparent hover:border-white/10 rounded-xl text-white/60 hover:text-white transition-all"
                    >
                      <span className="text-sm font-medium tracking-wide">
                        Para investidores
                      </span>
                      {/* @ts-ignore */}
                      <iconify-icon icon="solar:chart-square-linear" class="group-hover:translate-x-1 transition-transform" width="18"></iconify-icon>
                    </motion.div>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 2.0 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-widest text-white/40">
          Scroll
        </span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 2.2 }}
        className="absolute bottom-8 left-8 hidden lg:flex flex-col gap-2 z-20"
      >
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-white/40 font-mono">
          <span>Stellar.Net</span>
          <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>USDC / BRZ</span>
        </div>
      </motion.div>
    </header>
  );
}