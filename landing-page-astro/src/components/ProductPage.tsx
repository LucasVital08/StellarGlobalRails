import { modulesData } from '../data/content';
import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, MotionValue } from 'motion/react';
import KivoShowcase from './kivo/KivoShowcase';
import KivoSimulator from './kivo/KivoSimulator';
import KivoSplit from './kivo/KivoSplit';
import KivoOffRamp from './kivo/KivoOffRamp';
import KivoSandbox from './kivo/KivoSandbox';
import KivoEcosystem from './kivo/KivoEcosystem';
import KivoInvoiceSimulator from './kivo/KivoInvoiceSimulator';
import KivoPayoutsSimulator from './kivo/KivoPayoutsSimulator';
import KivoSafeCheckoutSimulator from './kivo/KivoSafeCheckoutSimulator';
import KivoVakinhaSimulator from './kivo/KivoVakinhaSimulator';
import KivoFamilyBridgeSimulator from './kivo/KivoFamilyBridgeSimulator';
import KivoQuiloVoltSimulator from './kivo/KivoQuiloVoltSimulator';
import KivoContractEaseSimulator from './kivo/KivoContractEaseSimulator';
import KivoOnyxSimulator from './kivo/KivoOnyxSimulator';
import KivoCursor from './kivo/KivoCursor';
import KivoWebGLBackground from './kivo/KivoWebGLBackground';
import KivoKonamiCode from './kivo/KivoKonamiCode';
import KivoTerminalCLI from './kivo/KivoTerminalCLI';
import KivoVoiceCommand from './kivo/KivoVoiceCommand';
import KivoExitIntent from './kivo/KivoExitIntent';
import KivoTooltip from './kivo/KivoTooltip';
import KivoCommandPalette from './kivo/KivoCommandPalette';
import KivoSaude360Simulator from './kivo/KivoSaude360Simulator';

interface Props {
  slug?: string;
}

// Item 11: Text Reveal Animations (Scramble)
function ScrambleText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState('');
  const chars = '!<>-_\\\\/[]{}—=+*^?#________';

  useEffect(() => {
    let iteration = 0;
    const maxIterations = text.length * 2;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (index < iteration / 2) return char;
            if (char === ' ') return ' ';
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );
      iteration++;
      if (iteration > maxIterations) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayText}</span>;
}

// Item 13: Scroll-Triggered Audio Ambient
function ScrollAudioAmbient() {
  useEffect(() => {
    let ctx: AudioContext | null = null;
    let osc: OscillatorNode | null = null;
    let gain: GainNode | null = null;
    let initialized = false;

    const initAudio = () => {
      if (initialized) return;
      initialized = true;
      try {
        ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        osc = ctx.createOscillator();
        gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 50; // Low ambient hum
        gain.gain.value = 0;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
      } catch (e) {}
    };

    const handleScroll = () => {
      if (!initialized) initAudio();
      if (!gain || !osc || !ctx) return;
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollY / maxScroll, 1);
      
      osc.frequency.setTargetAtTime(50 + progress * 60, ctx.currentTime, 0.5);
      gain.gain.setTargetAtTime(progress * 0.05, ctx.currentTime, 0.5); // Fica super baixo, max 5%
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', initAudio, { once: true }); // Interação destrava o áudio
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (osc) { osc.stop(); osc.disconnect(); }
      if (gain) gain.disconnect();
      if (ctx) ctx.close();
    };
  }, []);
  return null;
}

function StepCard({ step, idx, total, scrollYProgress }: { step: string, idx: number, total: number, scrollYProgress: MotionValue<number> }) {
  const target = idx / Math.max(1, (total - 1));
  const distance = 0.35;
  const yStagger = idx % 2 !== 0 ? 80 : 0;

  const scale = useTransform(scrollYProgress, (v) => {
    const dist = Math.abs(v - target);
    if (dist >= distance) return 0.85;
    return 0.85 + (1.05 - 0.85) * (1 - dist / distance);
  });
  
  const opacity = useTransform(scrollYProgress, (v) => {
    const dist = Math.abs(v - target);
    if (dist >= distance) return 0.3;
    return 0.3 + (1 - 0.3) * (1 - dist / distance);
  });
  
  const y = useTransform(scrollYProgress, (v) => {
    const dist = Math.abs(v - target);
    if (dist >= distance) return yStagger + 40;
    return yStagger + 40 + ((yStagger - 15) - (yStagger + 40)) * (1 - dist / distance);
  });
  
  const glowOpacity = useTransform(scrollYProgress, (v) => {
    const dist = Math.abs(v - target);
    if (dist >= distance) return 0;
    return 0 + (0.15 - 0) * (1 - dist / distance);
  });
  
  const iconBg = useTransform(scrollYProgress, (v) => {
    const dist = Math.abs(v - target);
    if (dist >= distance) return "rgba(255,255,255,0.05)";
    const mix = 1 - dist / distance;
    return `rgba(${Math.round(255 - mix*239)}, ${Math.round(255 - mix*70)}, ${Math.round(255 - mix*126)}, ${0.05 + mix*0.10})`;
  });

  const borderOpacity = useTransform(scrollYProgress, (v) => {
    const dist = Math.abs(v - target);
    if (dist >= distance) return "rgba(255,255,255,0.05)";
    const mix = 1 - dist / distance;
    return `rgba(${255 - mix*(255-16)}, ${255 - mix*(255-185)}, ${255 - mix*(255-129)}, ${0.05 + mix*0.45})`;
  });

  const iconColor = useTransform(scrollYProgress, (v) => {
    const dist = Math.abs(v - target);
    if (dist >= distance) return "rgba(255,255,255,1)";
    const mix = 1 - dist / distance;
    return `rgba(${255 - mix*(255-16)}, ${255 - mix*(255-185)}, ${255 - mix*(255-129)}, 1)`;
  });
  
  return (
    <motion.div 
      className="w-[340px] md:w-[480px] h-[400px] shrink-0"
      style={{ scale, opacity, y }}
    >
      <div 
        className="group relative rounded-3xl bg-neutral-900/50 p-8 md:p-10 flex flex-col gap-6 transition-colors duration-500 h-full overflow-hidden block shadow-2xl"
      >
        <motion.div 
          className="absolute inset-0 rounded-3xl border pointer-events-none transition-colors duration-300"
          style={{ borderColor: borderOpacity }}
        ></motion.div>
        
        <motion.div 
          className="absolute top-0 right-0 w-72 h-72 bg-emerald-500 blur-[90px] rounded-full pointer-events-none transition-opacity duration-300"
          style={{ opacity: glowOpacity }}
        ></motion.div>
        
        <motion.div 
          className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center relative z-10 shadow-lg font-bricolage font-bold text-2xl"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          {idx + 1}
        </motion.div>
        
        <div className="relative z-10 mt-2 flex-grow">
          <h4 className="text-xl md:text-2xl text-white font-bricolage font-medium mb-4">Passo {idx + 1}</h4>
          <p className="text-base md:text-lg text-white/50 leading-relaxed font-light">{step}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProductPage({ slug = '' }: Props) {
  const [profile, setProfile] = useState<'ceo' | 'dev'>('ceo');
  const [isOpen, setIsOpen] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // Carrega o perfil inicial e escuta mudanças vindas da Navigation
    const currentProfile = localStorage.getItem('kivo_profile') || 'ceo';
    setProfile(currentProfile as 'ceo' | 'dev');

    const handleProfileChange = (e: CustomEvent) => {
      setProfile(e.detail);
    };

    window.addEventListener('kivo_profile_change', handleProfileChange as EventListener);
    return () => window.removeEventListener('kivo_profile_change', handleProfileChange as EventListener);
  }, []);

  // Item 17 & 16: Parallax e Sticky Scroll setups
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  
  // xTransform pareado com a mesma lógica do ModuleGrid
  const xTransform = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);
  
  // Background Parallax Layer
  const { scrollYProgress: docScroll } = useScroll();
  const backgroundY = useTransform(docScroll, [0, 1], ["0%", "30%"]);
  
  const cleanPath = slug?.replace(/\/$/, '') || '';
  const currentPath = '/' + cleanPath;
  
  const moduleData = modulesData.find(mod => mod.path === currentPath);

  // DEV Profile Content Mapping
  const isDev = profile === 'dev';
  const heroTitle = isDev && moduleData ? `API REST e SDKs para ${moduleData.name}` : moduleData?.hero.title || '';
  const heroSubtitle = isDev ? `Webhooks, SDKs Node/Python e liquidação nativa na Stellar. Latência < 3s para o seu stack.` : moduleData?.hero.subtitle;
  const problemTitle = isDev ? "Arquiteturas monolíticas, APIs lentas e vendor lock-in." : moduleData?.problem.title;
  const solutionTitle = isDev ? "Infraestrutura Composable, Edge-Ready e Serverless." : moduleData?.solution.title;
  const solutionDesc = isDev ? "Integre nativamente. Receba callbacks instantâneos do ledger Stellar via Webhook. SDK TypeScript 100% tipado." : moduleData?.solution.description;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPath]);

  if (!moduleData) {
    return (
      <div className="pt-32 pb-32 text-center">
        <h1 className="text-4xl text-white mb-4">Página não encontrada</h1>
        <a href="/" className="text-emerald-400 hover:underline">Voltar para home</a>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 relative z-0">
      <KivoCursor />
      <KivoCommandPalette />
      <KivoKonamiCode />
      <KivoVoiceCommand />
      <KivoExitIntent />
      
      {/* Novo Background Animado com Gradient Blur (Substitui o WebGL 3D) */}
      <div className="fixed inset-0 z-[-2] bg-neutral-950 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-emerald-600/20 blur-[140px] rounded-full mix-blend-screen"
        ></motion.div>
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-emerald-900/30 blur-[150px] rounded-full mix-blend-screen"
        ></motion.div>
      </div>
      
      {/* Item 17: Parallax Background Multi-Layer */}
      <motion.div 
        style={{ y: backgroundY }}
        className="fixed inset-0 z-[-1] pointer-events-none"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </motion.div>
      
      <section className="px-6 max-w-5xl mx-auto mb-20 gs-fade-up">
        <a href="/#modules" className="inline-flex items-center text-sm text-white/40 hover:text-white mb-8 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar para Módulos
        </a>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            {/* @ts-ignore */}
            <iconify-icon icon={moduleData.icon} width="24"></iconify-icon>
          </div>
          <span className="text-emerald-500 font-mono text-sm uppercase tracking-widest">{moduleData.name}</span>
        </div>
        <h1 className="text-fluid-h1 font-bricolage font-medium text-white mb-6 leading-tight">
          <ScrambleText text={heroTitle} />
        </h1>
        <p className="text-xl text-white/50 mb-10 max-w-3xl leading-relaxed font-light">
          {heroSubtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-neutral-200 transition-colors">
            {moduleData.hero.ctas[0]}
          </button>
          <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-medium hover:bg-white/10 transition-colors">
            {moduleData.hero.ctas[1]}
          </button>
        </div>
      </section>

      <section className="px-6 max-w-5xl mx-auto mb-20 gs-fade-up">
        <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-8 md:p-12 transition-all duration-500">
          <h3 className="text-2xl md:text-3xl font-bricolage font-medium text-white mb-8">
            <ScrambleText text={problemTitle || ''} />
          </h3>
          <ul className="space-y-4">
            {moduleData.problem.items.map((item, idx) => (
              <li key={idx} className="flex items-start text-white/70">
                <span className="text-red-500 mr-4 font-bold text-lg mt-0.5">×</span>
                <span className="text-lg leading-relaxed">{isDev ? `Error 504 (Timeout): ${item}` : item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-6 max-w-5xl mx-auto mb-20 gs-fade-up">
        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-8 md:p-12 relative overflow-hidden transition-all duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center text-emerald-500 text-sm font-bold tracking-widest uppercase mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              {isDev ? "REST API / GraphQL" : "A Solução Kivo"}
            </div>
            <h3 className="text-3xl md:text-4xl font-bricolage font-medium text-white mb-6">
              <ScrambleText text={solutionTitle || ''} />
            </h3>
            <p className="text-lg text-white/70 leading-relaxed max-w-3xl mb-8">
              {solutionDesc}
            </p>

            <AnimatePresence>
              {isDev && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-black/50 border border-emerald-500/20 rounded-xl p-6 font-mono text-sm text-emerald-400 overflow-hidden"
                >
                  <pre><code>
{`// Exemplo de integração ${moduleData.id}
import { KivoClient } from '@kivopay/sdk';

const kivo = new KivoClient(process.env.KIVO_API_KEY);

const response = await kivo.${moduleData.id}.create({
  amount: "500.00",
  asset: "USDC",
  destination: "G..."
});

console.log(response.status); // "SUCCESS" - 3s latency`}
                  </code></pre>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Item 16: Scroll Horizontal Fixado (Sticky Scroll) */}
      <section ref={targetRef} className="relative h-[300vh]">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden py-16">
          <h3 className="text-fluid-h3 font-bricolage font-medium text-white mb-16 text-center px-6">
            <ScrambleText text="Como funciona a mágica por trás" />
          </h3>
          <div className="w-full overflow-hidden border-t border-white/5 pt-16 mt-8">
            <motion.div style={{ x: xTransform }} className="flex gap-16 md:gap-24 px-6 md:px-[20vw] w-max items-center h-[550px]">
              {moduleData.steps.map((step, idx) => (
                <StepCard
                  key={idx}
                  step={step}
                  idx={idx}
                  total={moduleData.steps.length}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="px-6 max-w-5xl mx-auto text-center gs-fade-up">
        <div className="mb-12 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
          <span className="text-white/50 text-sm uppercase tracking-widest font-mono">Nota Estratégica AKS:</span>
          <span className="text-emerald-400 font-mono font-bold">{moduleData.score}/100</span>
        </div>
        <br />
        <button className="px-10 py-5 bg-emerald-500 text-black rounded-full font-medium text-lg hover:bg-emerald-400 transition-colors shadow-[0_0_40px_rgba(16,185,129,0.3)]">
          {moduleData.finalCta}
        </button>
      </section>

      {currentPath === '/kivo' && (
        <>
          <KivoShowcase />
          <KivoEcosystem />
          <KivoSimulator />
          <KivoSplit />
          <KivoOffRamp />
          <KivoSandbox />
          <div className="px-6 max-w-3xl mx-auto mb-32 gs-fade-up">
             <div className="text-center mb-8">
               <h2 className="text-2xl font-bricolage text-white">Kivo CLI Simulado</h2>
               <p className="text-white/50 text-sm">Controle a infraestrutura direto do terminal (Item 23)</p>
             </div>
             <KivoTerminalCLI />
          </div>
        </>
      )}

      {currentPath === '/invoice' && <KivoInvoiceSimulator />}
      {currentPath === '/payouts' && <KivoPayoutsSimulator />}
      {currentPath === '/escrow' && <KivoSafeCheckoutSimulator />}
      {currentPath === '/vakinha' && <KivoVakinhaSimulator />}
      {currentPath === '/familybridge' && <KivoFamilyBridgeSimulator />}
      {currentPath === '/quilovolt' && <KivoQuiloVoltSimulator />}
      {currentPath === '/contractease' && <KivoContractEaseSimulator />}
      {currentPath === '/onyx' && <KivoOnyxSimulator />}
      {currentPath === '/saude360' && <KivoSaude360Simulator />}
    </div>
  );
}