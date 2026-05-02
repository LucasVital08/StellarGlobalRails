import { modulesData } from '../data/content';
import { useEffect, useState } from 'react';
import KivoShowcase from './kivo/KivoShowcase';
import KivoSimulator from './kivo/KivoSimulator';
import KivoSplit from './kivo/KivoSplit';
import KivoOffRamp from './kivo/KivoOffRamp';
import KivoSandbox from './kivo/KivoSandbox';

interface Props {
  slug?: string;
}

export default function ProductPage({ slug = '' }: Props) {
  const [isOpen, setIsOpen] = useState<Record<number, boolean>>({});
  
  const cleanPath = slug?.replace(/\/$/, '') || '';
  const currentPath = '/' + cleanPath;
  
  const moduleData = modulesData.find(mod => mod.path === currentPath);

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
    <div className="pt-32 pb-32 relative z-0">
      <div className="fixed inset-0 z-[-1] bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>
      
      <section className="px-6 max-w-5xl mx-auto mb-32 gs-fade-up">
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
        <h1 className="text-4xl md:text-6xl font-bricolage font-medium text-white mb-6 leading-tight">
          {moduleData.hero.title}
        </h1>
        <p className="text-xl text-white/50 mb-10 max-w-3xl leading-relaxed font-light">
          {moduleData.hero.subtitle}
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

      <section className="px-6 max-w-5xl mx-auto mb-32 gs-fade-up">
        <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl font-bricolage font-medium text-white mb-8">
            {moduleData.problem.title}
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {moduleData.problem.items.map((item, idx) => (
              <li key={idx} className="flex gap-4 items-start">
                {/* @ts-ignore */}
                <iconify-icon icon="solar:close-circle-bold-duotone" width="24" class="text-red-500 shrink-0 mt-0.5"></iconify-icon>
                <span className="text-white/70 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-6 max-w-5xl mx-auto mb-32 gs-fade-up">
        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full"></div>
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bricolage font-medium text-white mb-6">
              {moduleData.solution.title}
            </h3>
            <p className="text-lg text-white/70 leading-relaxed max-w-3xl">
              {moduleData.solution.description}
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 max-w-5xl mx-auto mb-32 gs-fade-up">
        <h3 className="text-2xl md:text-3xl font-bricolage font-medium text-white mb-10 text-center">
          Como funciona
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {moduleData.steps.map((step, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 relative">
              <span className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-neutral-900 border border-white/20 flex items-center justify-center font-mono text-white/50 text-sm">
                {idx + 1}
              </span>
              <p className="text-white/80 mt-2">{step}</p>
            </div>
          ))}
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
          <KivoSimulator />
          <KivoSplit />
          <KivoOffRamp />
          <KivoSandbox />
        </>
      )}
    </div>
  );
}