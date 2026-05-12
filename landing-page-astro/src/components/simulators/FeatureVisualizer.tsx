import { motion } from 'motion/react';

export default function FeatureVisualizer({ id, type, icon, color }: { id: string, type: 'feature' | 'agent', icon: string, color: string }) {
  // Deterministic "random" based on string length to select 1 of 3 layouts
  const variant = id.length % 3;

  if (variant === 0) {
    // 1. Quantum Shield / Security Simulator
    return (
      <div className="w-full max-w-sm aspect-square relative flex items-center justify-center">
        {/* Core Shield */}
        <motion.div 
          animate={{ rotateY: 360, rotateX: 15 }} 
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-48 h-48 rounded-full border border-white/20 relative flex items-center justify-center transform-style-3d"
          style={{ boxShadow: `inset 0 0 50px ${color}20` }}
        >
          {/* Inner rings */}
          <div className="absolute w-40 h-40 rounded-full border border-dashed border-white/30" style={{ transform: 'rotateX(90deg)' }}></div>
          <div className="absolute w-40 h-40 rounded-full border border-white/10" style={{ transform: 'rotateY(90deg)' }}></div>
          
          <div className="w-20 h-20 bg-black border border-white/10 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(var(--color),0.5)] z-10" style={{ boxShadow: `0 0 30px ${color}50` }}>
            <div className="absolute inset-0 opacity-30 animate-pulse" style={{ backgroundColor: color, filter: 'blur(10px)' }}></div>
            {/* @ts-ignore */}
            <iconify-icon icon={icon} width="32" style={{ color }}></iconify-icon>
          </div>
        </motion.div>
        
        {/* Deflected Particles */}
        <motion.div animate={{ x: [100, 40], y: [-50, -20], opacity: [0, 1, 0], scale: [1, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute right-8 top-1/4 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_red]" />
        <motion.div animate={{ x: [-100, -40], y: [50, 20], opacity: [0, 1, 0], scale: [1, 0] }} transition={{ duration: 1.5, delay: 0.7, repeat: Infinity }} className="absolute left-8 bottom-1/4 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_red]" />
        
        {/* Absorbed Data */}
        <motion.div animate={{ x: [0, 0], y: [100, 0], opacity: [0, 1, 0], scale: [0, 1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-4 w-1 h-8 rounded-full z-20" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />

        <div className="absolute -bottom-8 text-center w-full">
          <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">Criptografia Ativa</div>
          <div className="text-sm font-medium" style={{ color }}>Filtrando 10k requisições/s</div>
        </div>
      </div>
    );
  }

  if (variant === 1) {
    // 2. Neural Net / AI Simulator
    return (
      <div className="w-full max-w-sm aspect-square relative flex items-center justify-center">
        {/* Neural Nodes */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <line x1="20%" y1="70%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <line x1="80%" y1="30%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <line x1="80%" y1="70%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        </svg>

        <div className="absolute top-[30%] left-[20%] w-3 h-3 rounded-full bg-white/10 -mt-1.5 -ml-1.5"></div>
        <div className="absolute top-[70%] left-[20%] w-3 h-3 rounded-full bg-white/10 -mt-1.5 -ml-1.5"></div>
        <div className="absolute top-[30%] right-[20%] w-3 h-3 rounded-full bg-white/10 -mt-1.5 -mr-1.5"></div>
        <div className="absolute top-[70%] right-[20%] w-3 h-3 rounded-full bg-white/10 -mt-1.5 -mr-1.5"></div>

        {/* Brain Core */}
        <div className="w-24 h-24 rounded-full border-2 border-white/10 bg-black flex items-center justify-center relative z-10">
          <div className="absolute inset-0 rounded-full opacity-30 animate-pulse blur-lg" style={{ backgroundColor: color }}></div>
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 rounded-full border border-white/20"></motion.div>
          {/* @ts-ignore */}
          <iconify-icon icon={icon} width="36" style={{ color }} className="relative z-10"></iconify-icon>
        </div>

        {/* Synapse Pulses */}
        <motion.div animate={{ left: ['20%', '50%'], top: ['30%', '50%'], opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="absolute w-1.5 h-1.5 rounded-full z-20" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
        <motion.div animate={{ left: ['80%', '50%'], top: ['70%', '50%'], opacity: [0, 1, 0] }} transition={{ duration: 1, delay: 0.5, repeat: Infinity, ease: "linear" }} className="absolute w-1.5 h-1.5 rounded-full z-20" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />

        <div className="absolute -bottom-8 text-center w-full">
          <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">LLM Inference</div>
          <div className="text-sm font-medium" style={{ color }}>Otimizando tokens contextuais...</div>
        </div>
      </div>
    );
  }

  // 3. Database Indexing Simulator (variant === 2)
  return (
    <div className="w-full max-w-sm aspect-square relative flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 relative z-10">
        {[0, 1, 2, 3].map((layer) => (
          <motion.div 
            key={layer}
            animate={{ x: [0, (layer % 2 === 0 ? 5 : -5), 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, delay: layer * 0.2, repeat: Infinity }}
            className="w-40 h-8 rounded-[50%] border border-white/20 bg-white/5 relative flex flex-col justify-center overflow-hidden"
            style={{ 
              boxShadow: `inset 0 -10px 20px rgba(0,0,0,0.8), 0 5px 10px rgba(0,0,0,0.5)`,
              borderColor: layer === 1 ? color : 'rgba(255,255,255,0.2)'
            }}
          >
            {layer === 1 && (
              <div className="absolute inset-0 blur-md opacity-40" style={{ backgroundColor: color }}></div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Floating Query Component */}
      <motion.div 
        animate={{ y: [-50, 50], opacity: [0, 1, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 -ml-8 w-16 h-16 rounded-xl border border-white/10 bg-[#111] shadow-2xl flex items-center justify-center z-20"
        style={{ boxShadow: `0 0 30px ${color}20` }}
      >
        {/* @ts-ignore */}
        <iconify-icon icon={icon} width="24" style={{ color }}></iconify-icon>
      </motion.div>

      <div className="absolute -bottom-8 text-center w-full">
        <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">Indexação Distribuída</div>
        <div className="text-sm font-medium" style={{ color }}>Buscando shards (12ms)</div>
      </div>
    </div>
  );
}
