import { motion } from 'motion/react';
import { useRef, useState } from 'react';

const steps = [
  {
    id: 1,
    title: "Entrada (Fiat)",
    desc: "O usuário paga em BRL, USD ou EUR via métodos locais (Pix, SEP24) com total conformidade regulatória.",
    icon: "solar:wallet-money-linear",
    color: "blue",
    bgClass: "bg-blue-500/20",
    borderClass: "border-blue-500/50",
    iconColor: "text-blue-400"
  },
  {
    id: 2,
    title: "Stellar + Soroban",
    desc: "A mágica acontece: conversão on-chain via AMMs para USDC ou BRZ acompanhada de execução ágil de contratos inteligentes.",
    icon: "solar:cpu-linear",
    color: "emerald",
    bgClass: "bg-emerald-500/20",
    borderClass: "border-emerald-500/50",
    iconColor: "text-emerald-400"
  },
  {
    id: 3,
    title: "Módulos (O Rails)",
    desc: "A infraestrutura assume o controle com módulos independentes: Escrow seguro, Split de Pagamentos complexos e Emissão CVM orquestrada.",
    icon: "solar:server-square-linear",
    color: "purple",
    bgClass: "bg-purple-500/20",
    borderClass: "border-purple-500/50",
    iconColor: "text-purple-400"
  },
  {
    id: 4,
    title: "Saída (Payout)",
    desc: "Liquidação final e definitiva na conta bancária ou carteira digital do destinatário em qualquer lugar do mundo.",
    icon: "solar:hand-money-linear",
    color: "orange",
    bgClass: "bg-orange-500/20",
    borderClass: "border-orange-500/50",
    iconColor: "text-orange-400"
  }
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section ref={containerRef} className="bg-neutral-950 text-white relative border-t border-white/5">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(ellipse at center, rgba(16,185,129,0.15) 0%, transparent 60%)' }}></div>
      
      <div className="max-w-[90rem] mx-auto px-6 md:px-12 py-24 md:py-32 relative z-10">
        
        <div className="text-center md:text-left mb-16 md:mb-32 gs-fade-up">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bricolage font-medium mb-6 leading-[0.9] tracking-tight">
            Como funciona a infraestrutura
          </h2>
          <p className="text-white/50 text-lg md:text-2xl max-w-2xl font-light leading-relaxed">
            Uma ponte fluida entre moedas estatais e a utilidade da blockchain Stellar.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 relative">
          
          {/* Left Column - Scrolling Text */}
          <div className="lg:w-1/2 flex flex-col space-y-[20vh] md:space-y-[35vh] pb-[20vh] relative z-10 h-full">
            {steps.map((step, idx) => (
              <motion.div 
                key={step.id} 
                initial={{ opacity: 0.3, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-10% 0px -10% 0px", once: false, amount: 0.6 }}
                onViewportEnter={() => setActiveStep(idx)}
                transition={{ duration: 0.5 }}
                className="flex flex-col justify-center min-h-[40vh]"
              >
                {/* Mobile visual representing the step */}
                <div className="lg:hidden mb-12">
                  <div className={`w-28 h-28 rounded-[2rem] bg-neutral-900 border border-white/10 flex items-center justify-center ${step.iconColor} shadow-2xl relative`}>
                    <div className={`absolute inset-0 ${step.bgClass} blur-[40px] rounded-full`}></div>
                    {/* @ts-ignore */}
                    <iconify-icon icon={step.icon} width="56"></iconify-icon>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-3 h-3 rounded-full ${step.iconColor} shadow-[0_0_15px_currentColor]`}></div>
                  <span className={`font-mono text-sm uppercase tracking-widest ${step.iconColor}`}>
                    Passo 0{step.id}
                  </span>
                </div>
                
                <h4 className="font-bricolage text-3xl md:text-5xl lg:text-6xl mb-8 text-white tracking-tight">
                  {step.title}
                </h4>
                
                <p className="text-lg md:text-2xl text-white/50 leading-relaxed font-light">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Right Column - Sticky Visual */}
          <div className="hidden lg:block lg:w-1/2">
            <div className="sticky top-0 h-screen flex items-center justify-center">
              
              <div className="relative w-full max-w-[500px] aspect-square rounded-[3rem] bg-neutral-900 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
                {/* Visual content crossfading */}
                {steps.map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                    animate={{ 
                      opacity: activeStep === idx ? 1 : 0, 
                      scale: activeStep === idx ? 1 : 1.1,
                      filter: activeStep === idx ? 'blur(0px)' : 'blur(10px)',
                      zIndex: activeStep === idx ? 10 : 0
                    }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <div className={`absolute inset-0 ${step.bgClass} opacity-80 blur-[80px]`}></div>
                    <div className="relative z-20 flex flex-col items-center gap-6">
                      <div className={`w-40 h-40 rounded-[2.5rem] bg-black border border-white/10 flex items-center justify-center ${step.iconColor} shadow-[0_0_40px_rgba(0,0,0,0.5)]`}>
                        {/* @ts-ignore */}
                        <iconify-icon icon={step.icon} width="80"></iconify-icon>
                      </div>
                      <div className="px-6 py-2 rounded-full border border-white/10 bg-black/50 backdrop-blur-md">
                        <span className={`font-mono text-sm uppercase tracking-widest ${step.iconColor}`}>
                          0{step.id} — {step.title}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Overlay details to make it look premium */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-neutral-900/80 to-transparent z-30 pointer-events-none"></div>
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-30 opacity-30">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}