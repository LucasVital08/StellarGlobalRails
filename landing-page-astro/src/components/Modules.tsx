import { useRef } from 'react';
import { motion } from 'motion/react';

export default function Modules() {
  const container = useRef<HTMLDivElement>(null);

  return (
    <section id="modules" ref={container} className="bg-neutral-950 border-white/5 border-t pt-24 pr-6 pb-48 pl-6 relative">
      <div className="absolute top-12 right-6 md:right-12 z-0 opacity-10 font-bricolage font-bold text-[8rem] md:text-[10rem] leading-none text-white pointer-events-none select-none tracking-tighter">
        VOL. III
      </div>

      <div className="z-10 w-full max-w-5xl mr-auto ml-auto relative">
        <motion.div 
          initial={{ opacity: 0, y: 40, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-24"
        >
          <h3 className="text-3xl md:text-5xl font-bricolage font-light text-white mb-4 tracking-tight">
            Aprofundamento
          </h3>
          <p className="text-white/50 text-lg">
            Páginas dedicadas e visão profunda por operação.
          </p>
        </motion.div>

        <div className="flex flex-col gap-12 sm:gap-24">
          
          <div className="sticky top-24 sm:top-32 group flex flex-col md:flex-row gap-8 items-center p-8 md:p-12 bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl transition-all duration-300 transform-gpu" style={{ zIndex: 10 }}>
            <div className="w-full md:w-1/3 flex items-center justify-center relative">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden shrink-0 relative bg-neutral-800 border border-white/5 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Phone" />
                <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay"></div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-neutral-900 rounded-2xl border border-white/10 flex items-center justify-center shadow-xl">
                {/* @ts-ignore */}
                <iconify-icon icon="solar:smartphone-linear" width="32" class="text-emerald-400"></iconify-icon>
              </div>
            </div>

            <div className="w-full md:w-2/3 flex flex-col justify-center">
              <span className="text-emerald-400 text-xs font-mono uppercase tracking-widest mb-3 block">Gateway Físico e Online</span>
              <h4 className="text-3xl md:text-4xl text-white font-bricolage font-medium mb-6">Kivo Mobile</h4>
              
              <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
                <div className="flex flex-col gap-1">
                  <span className="text-white/40 text-xs uppercase tracking-wider font-mono">Função</span>
                  <span className="text-white text-base">QR Code / Link</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-white/40 text-xs uppercase tracking-wider font-mono">Onboarding</span>
                  <span className="text-white text-base">Sem Banco</span>
                </div>
              </div>
              
              <p className="text-white/60 leading-relaxed font-light mb-8">
                Canal prioritário. Vendedor digita valor, comprador escaneia e dinheiro liquida via USDC direto na carteira do recebedor. Uma experiência de POS completa no celular.
              </p>

              <div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-full bg-white text-black font-semibold uppercase tracking-widest text-xs hover:bg-emerald-400 hover:text-black transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(52,211,153,0.4)]"
                >
                  Explorar Módulo
                </motion.button>
              </div>
            </div>
          </div>

          <div className="sticky top-28 sm:top-40 group flex flex-col md:flex-row gap-8 items-center p-8 md:p-12 bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl transition-all duration-300 transform-gpu" style={{ zIndex: 11 }}>
            <div className="w-full md:w-1/3 flex items-center justify-center relative">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden shrink-0 relative bg-neutral-800 border border-white/5 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80" className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-110" alt="Invoice" />
                <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay"></div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-neutral-900 rounded-2xl border border-white/10 flex items-center justify-center shadow-xl">
                {/* @ts-ignore */}
                <iconify-icon icon="solar:document-text-linear" width="32" class="text-blue-400"></iconify-icon>
              </div>
            </div>

            <div className="w-full md:w-2/3 flex flex-col justify-center">
              <span className="text-blue-400 text-xs font-mono uppercase tracking-widest mb-3 block">Freelancers & PMEs</span>
              <h4 className="text-3xl md:text-4xl text-white font-bricolage font-medium mb-6">Stellar Invoice</h4>
              
              <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
                <div className="flex flex-col gap-1">
                  <span className="text-white/40 text-xs uppercase tracking-wider font-mono">Função</span>
                  <span className="text-white text-base">Fatura int.</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-white/40 text-xs uppercase tracking-wider font-mono">Taxas</span>
                  <span className="text-white text-base">Custo Básico</span>
                </div>
              </div>
              
              <p className="text-white/60 leading-relaxed font-light mb-8">
                Ideal para freelancers gerarem links unificados usando infraestrutura direta de stablecoin, bypassando redes lentas como SWIFT. Cobranças cross-border nativas.
              </p>

              <div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-full bg-white text-black font-semibold uppercase tracking-widest text-xs hover:bg-blue-400 hover:text-white transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                >
                  Explorar Módulo
                </motion.button>
              </div>
            </div>
          </div>

          <div className="sticky top-32 sm:top-48 group flex flex-col md:flex-row gap-8 items-center p-8 md:p-12 bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl transition-all duration-300 transform-gpu" style={{ zIndex: 12 }}>
            <div className="w-full md:w-1/3 flex items-center justify-center relative">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden shrink-0 relative bg-neutral-800 border border-white/5 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Data" />
                <div className="absolute inset-0 bg-purple-500/10 mix-blend-overlay"></div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-neutral-900 rounded-2xl border border-white/10 flex items-center justify-center shadow-xl">
                {/* @ts-ignore */}
                <iconify-icon icon="solar:global-linear" width="32" class="text-purple-400"></iconify-icon>
              </div>
            </div>

            <div className="w-full md:w-2/3 flex flex-col justify-center">
              <span className="text-purple-400 text-xs font-mono uppercase tracking-widest mb-3 block">Social Impact</span>
              <h4 className="text-3xl md:text-4xl text-white font-bricolage font-medium mb-6">Vakinha Global</h4>
              
              <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
                <div className="flex flex-col gap-1">
                  <span className="text-white/40 text-xs uppercase tracking-wider font-mono">Moedas</span>
                  <span className="text-white text-base">USDC/BRZ/BRL</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-white/40 text-xs uppercase tracking-wider font-mono">Confiança</span>
                  <span className="text-white text-base">On-chain Verif.</span>
                </div>
              </div>
              
              <p className="text-white/60 leading-relaxed font-light mb-8">
                Sistema transparente de vaquinha internacional sem atrito de conversão manual e relatórios em tempo real. Cada doação registrada permanentemente na rede.
              </p>

              <div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-full bg-white text-black font-semibold uppercase tracking-widest text-xs hover:bg-purple-400 hover:text-white transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                >
                  Explorar Módulo
                </motion.button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}