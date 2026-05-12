import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import MagneticButton from '../ui/MagneticButton';

export default function CoreSimulator({ slug, color }: { slug?: string, color: string }) {
  if (slug === 'kivopay' || slug === 'kivo') return <KivoPaySimulator color={color} />;
  if (slug === 'socialpay') return <SocialPaySimulator color={color} />;
  // Assuming contractease or default
  return <ContractEaseSimulator color={color} />;
}

function KivoPaySimulator({ color }: { color: string }) {
  const [step, setStep] = useState(0);

  const handleSimulate = () => {
    if (step > 0) return;
    setStep(1); // Routing
    setTimeout(() => setStep(2), 1500); // Fraud check
    setTimeout(() => setStep(3), 3000); // Success
    setTimeout(() => setStep(0), 6000); // Reset
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#050505] border border-white/10 rounded-[2rem] p-8 md:p-12 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
        <motion.div className="h-full" style={{ backgroundColor: color }} animate={{ width: step === 0 ? '0%' : step === 1 ? '33%' : step === 2 ? '66%' : '100%' }} transition={{ duration: 0.5 }} />
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 z-10">
          <h3 className="text-2xl font-bricolage text-white">Roteamento Dinâmico</h3>
          <p className="text-white/50 text-sm leading-relaxed">Simule uma transação de alto risco. Nosso motor irá rotear para o adquirente com maior taxa de aprovação enquanto o anti-fraude analisa em tempo real.</p>
          
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl font-mono text-sm text-white/70">
            <div className="flex justify-between mb-2"><span>Valor:</span> <span className="text-white">R$ 1.250,00</span></div>
            <div className="flex justify-between mb-2"><span>Cartão:</span> <span className="text-white">**** **** **** 4242</span></div>
            <div className="flex justify-between"><span>Risco Estimado:</span> <span className="text-yellow-400">Médio</span></div>
          </div>

          <MagneticButton onClick={handleSimulate} className="px-6 py-3 rounded-full text-black font-medium transition-all w-full flex justify-center" style={{ backgroundColor: step === 0 ? color : '#333', color: step === 0 ? '#000' : '#888', pointerEvents: step === 0 ? 'auto' : 'none' }}>
            {step === 0 ? 'Iniciar Transação' : step === 3 ? 'Aprovado!' : 'Processando...'}
          </MagneticButton>
        </div>

        <div className="flex-1 relative h-[300px] w-full flex items-center justify-center">
          {/* Nodes */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className={`w-32 h-32 rounded-full border ${step === 3 ? 'border-emerald-500' : 'border-white/10'} flex items-center justify-center bg-black relative z-20 transition-colors duration-500`}>
                <div className={`absolute inset-0 rounded-full opacity-20 blur-xl transition-all duration-500 ${step === 3 ? 'bg-emerald-500' : ''}`} style={{ backgroundColor: step !== 3 ? color : '' }}></div>
                {/* @ts-ignore */}
                <iconify-icon icon={step === 3 ? "solar:check-read-linear" : "solar:card-transfer-linear"} width="40" className={step === 3 ? 'text-emerald-500' : 'text-white'}></iconify-icon>
             </div>
          </div>
          
          {/* Orbits & Satellites */}
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute w-[240px] h-[240px] rounded-full border border-dashed border-white/10 flex items-center justify-between">
             <div className={`w-10 h-10 -ml-5 rounded-full flex items-center justify-center bg-[#111] border transition-colors ${step >= 1 ? 'border-white/30 text-white' : 'border-white/5 text-white/20'}`}>
               {/* @ts-ignore */}
               <iconify-icon icon="solar:shield-check-linear"></iconify-icon>
             </div>
             <div className={`w-10 h-10 -mr-5 rounded-full flex items-center justify-center bg-[#111] border transition-colors ${step >= 2 ? 'border-emerald-500 text-emerald-400' : 'border-white/5 text-white/20'}`}>
               {/* @ts-ignore */}
               <iconify-icon icon="solar:banknotes-linear"></iconify-icon>
             </div>
          </motion.div>

          {/* Pulses */}
          <AnimatePresence>
            {step === 1 && <motion.div initial={{ scale: 0.5, opacity: 1 }} animate={{ scale: 1.5, opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 1, repeat: Infinity }} className="absolute w-32 h-32 rounded-full border-2" style={{ borderColor: color }} />}
            {step === 2 && <motion.div initial={{ scale: 0.5, opacity: 1 }} animate={{ scale: 2, opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 1, repeat: Infinity }} className="absolute w-32 h-32 rounded-full border-2 border-emerald-500" />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function SocialPaySimulator({ color }: { color: string }) {
  const [dragged, setDragged] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#050505] border border-white/10 rounded-[2rem] p-8 md:p-12 overflow-hidden relative">
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 z-10">
          <h3 className="text-2xl font-bricolage text-white">Pagamento P2P Friccionless</h3>
          <p className="text-white/50 text-sm leading-relaxed">Arraste o token de pagamento até o recipiente. A infraestrutura em background realiza o split, compliance e ledger em 200ms.</p>
        </div>

        <div className="flex-1 relative h-[300px] w-full bg-white/[0.01] rounded-3xl border border-white/5 flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute top-8 text-white/40 text-xs tracking-widest uppercase">Arraste a moeda</div>
          
          <div className="flex items-center justify-between w-full px-12 mt-8">
            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center relative">
               {!dragged && (
                 <motion.div 
                   drag="x" 
                   dragConstraints={{ left: 0, right: 180 }}
                   onDragEnd={(e, info) => {
                     if (info.offset.x > 100) setDragged(true);
                   }}
                   whileHover={{ scale: 1.1 }}
                   whileTap={{ scale: 0.9, cursor: "grabbing" }}
                   className="w-12 h-12 rounded-full flex items-center justify-center cursor-grab shadow-[0_0_20px_rgba(0,0,0,1)] relative z-30"
                   style={{ backgroundColor: color }}
                 >
                   {/* @ts-ignore */}
                   <iconify-icon icon="solar:wallet-money-linear" width="24" className="text-black"></iconify-icon>
                 </motion.div>
               )}
            </div>

            <div className="h-0.5 flex-1 mx-4 bg-white/5 relative">
               <AnimatePresence>
                 {dragged && (
                   <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="absolute h-full left-0 top-0" style={{ backgroundColor: color }} />
                 )}
               </AnimatePresence>
            </div>

            <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center relative transition-colors duration-500 ${dragged ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 bg-white/5'}`}>
              <AnimatePresence>
                {dragged && (
                  <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute inset-0 rounded-full flex items-center justify-center text-emerald-400">
                    {/* @ts-ignore */}
                    <iconify-icon icon="solar:check-circle-bold" width="32"></iconify-icon>
                  </motion.div>
                )}
              </AnimatePresence>
              {!dragged && (
                // @ts-ignore
                <iconify-icon icon="solar:user-circle-linear" width="32" className="text-white/30"></iconify-icon>
              )}
            </div>
          </div>

          {dragged && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-12 text-emerald-400 text-sm font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Liquidação concluída (185ms)
            </motion.div>
          )}

          {dragged && (
            <button onClick={() => setDragged(false)} className="absolute bottom-4 text-xs text-white/30 hover:text-white underline">Reiniciar</button>
          )}
        </div>
      </div>
    </div>
  );
}

function ContractEaseSimulator({ color }: { color: string }) {
  const [signed, setSigned] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#050505] border border-white/10 rounded-[2rem] p-8 md:p-12 overflow-hidden relative">
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 z-10">
          <h3 className="text-2xl font-bricolage text-white">Execução de Contrato Smart</h3>
          <p className="text-white/50 text-sm leading-relaxed">Assine o documento digitalmente. A plataforma irá gerar o hash criptográfico e injetar no ledger imutável instantaneamente.</p>
          
          <MagneticButton onClick={() => setSigned(true)} className="px-6 py-3 rounded-full text-black font-medium transition-all w-full flex justify-center" style={{ backgroundColor: signed ? '#333' : color, color: signed ? '#888' : '#000', pointerEvents: signed ? 'none' : 'auto' }}>
            {signed ? 'Assinatura Registrada' : 'Assinar Contrato'}
          </MagneticButton>
        </div>

        <div className="flex-1 relative h-[300px] w-full flex items-center justify-center perspective-1000">
          <motion.div 
            animate={{ rotateY: signed ? 180 : 0 }} 
            transition={{ duration: 0.8, type: "spring" }}
            className="w-48 h-64 relative transform-style-3d"
          >
            {/* Front of Document */}
            <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col backface-hidden">
              <div className="w-1/2 h-2 bg-white/20 rounded mb-4"></div>
              <div className="w-full h-1 bg-white/10 rounded mb-2"></div>
              <div className="w-5/6 h-1 bg-white/10 rounded mb-2"></div>
              <div className="w-full h-1 bg-white/10 rounded mb-2"></div>
              <div className="w-4/5 h-1 bg-white/10 rounded mb-6"></div>
              
              <div className="mt-auto border-t border-dashed border-white/20 pt-4 flex justify-between items-end">
                <div className="w-16 h-1 bg-white/20 rounded"></div>
                {/* @ts-ignore */}
                <iconify-icon icon="solar:pen-linear" className="text-white/30"></iconify-icon>
              </div>
            </div>

            {/* Back of Document (Hash/Signed) */}
            <div className="absolute inset-0 bg-[#0a0a0a] border border-emerald-500/30 rounded-xl p-4 flex flex-col items-center justify-center backface-hidden [transform:rotateY(180deg)] shadow-[0_0_30px_rgba(16,185,129,0.1)]">
              {/* @ts-ignore */}
              <iconify-icon icon="solar:lock-keyhole-bold" width="48" className="text-emerald-500 mb-4"></iconify-icon>
              <div className="text-[8px] font-mono text-emerald-400/50 break-all text-center leading-tight">
                0x8f4b2c9a...<br/>
                SHA-256 SECURED<br/>
                TIMESTAMP: {new Date().toISOString().slice(0, 10)}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
