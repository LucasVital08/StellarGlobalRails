import { RailsLogo } from './ui/Logo';

export default function Footer() {
  return (
    <>
      <footer className="text-white bg-neutral-950 z-10 border-white/10 border-t pt-16 pr-6 pb-16 pl-6 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 gs-fade-up">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-black to-neutral-900 border border-white/20 flex items-center justify-center text-white">
                <RailsLogo className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bricolage font-semibold">STELLAR RAILS</h2>
            </div>
            <p className="text-white/50 max-w-xs">
              Um trilho financeiro global. Construído sobre a rede Stellar.
            </p>
          </div>

          <div className="flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="/#modules" className="hover:text-white transition-colors">Módulos</a>
            <a href="/#platform" className="hover:text-white transition-colors">Como funciona</a>
            <a href="/investidores" className="hover:text-white transition-colors">Para investidores</a>
            <a href="#" className="hover:text-white transition-colors">Contato</a>
          </div>
        </div>

        <div className="w-full mt-24 overflow-hidden flex justify-center items-center pointer-events-none select-none gs-fade-up">
          <h1 
            className="text-[12vw] leading-none text-white/5 whitespace-nowrap italic tracking-tighter"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Stellar Global Rails
          </h1>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-white/40 gs-fade-up" data-delay="0.1">
          <p>© 2026 AKS · Stellar 37°</p>
        </div>
      </footer>
    </>
  );
}