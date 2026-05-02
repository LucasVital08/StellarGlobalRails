import { useEffect } from 'react';

export default function InvestorsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-32 relative z-0">
      <div className="fixed inset-0 z-[-1] bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial_gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>
      
      <section className="px-6 max-w-5xl mx-auto mb-32 gs-fade-up text-center">
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-sm uppercase tracking-widest">
          {/* @ts-ignore */}
          <iconify-icon icon="solar:chart-square-linear"></iconify-icon>
          Stellar Global Rails | Investors
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bricolage font-medium text-white mb-6 leading-tight max-w-4xl mx-auto">
          Uma infraestrutura financeira global construída sobre Stellar.
        </h1>
        <p className="text-xl text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
          Um ecossistema. Múltiplos módulos interconectados. Mercado de trilhões. Powered by Stellar 37º.
        </p>
      </section>

      <section className="px-6 max-w-6xl mx-auto mb-32 gs-fade-up">
        <h2 className="text-3xl md:text-5xl font-bricolage text-center text-white mb-16">
          Tese de investimento
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center text-2xl mb-6 text-white/80">
              {/* @ts-ignore */}
              <iconify-icon icon="solar:chart-square-linear"></iconify-icon>
            </div>
            <h3 className="text-xl text-white font-medium mb-4">Mercado</h3>
            <p className="text-white/60 leading-relaxed">
              Remessas globais: US$ 860bi/ano. Pagamentos B2B: US$ 120tri/ano. Trabalhadores informais no Brasil: 20 milhões.
            </p>
          </div>

          <div className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center text-2xl mb-6 text-white/80">
              {/* @ts-ignore */}
              <iconify-icon icon="solar:settings-linear"></iconify-icon>
            </div>
            <h3 className="text-xl text-white font-medium mb-4">Produto</h3>
            <p className="text-white/60 leading-relaxed">
              Plataforma com 13 módulos em produção no Stellar 37°. Demo ao vivo com transações reais na testnet.
            </p>
          </div>

          <div className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center text-2xl mb-6 text-white/80">
              {/* @ts-ignore */}
              <iconify-icon icon="solar:wad-of-money-linear"></iconify-icon>
            </div>
            <h3 className="text-xl text-white font-medium mb-4">Modelo</h3>
            <p className="text-white/60 leading-relaxed">
              Fee por transação · SaaS institucional · Certificação por crédito · White-label & API · Cashback por volume
            </p>
          </div>

          <div className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center text-2xl mb-6 text-white/80">
              {/* @ts-ignore */}
              <iconify-icon icon="solar:rocket-linear"></iconify-icon>
            </div>
            <h3 className="text-xl text-white font-medium mb-4">Tração</h3>
            <p className="text-white/60 leading-relaxed">
              5 sprints. Pitch Night no Rio de Janeiro. Premiação de até US$ 20.000. Equipe com projetos reais (AKS, ContractEase, ONYX, QuiloVolt, Saúde 360).
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 max-w-6xl mx-auto mb-32 gs-fade-up">
        <h2 className="text-3xl md:text-5xl font-bricolage text-center text-white mb-16">
          Oportunidade Massiva
        </h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 p-8 bg-neutral-900 border border-white/5 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full group-hover:bg-blue-500/20 transition-colors"></div>
            <p className="text-white/40 font-mono text-sm uppercase tracking-widest mb-4">TAM (Total Addressable Market)</p>
            <h3 className="text-5xl md:text-6xl font-medium text-white mb-4">US$ 120T<span className="text-2xl text-white/50">/ano</span></h3>
            <p className="text-white/60">Volume global de pagamentos transfronteiriços B2B. Mercados ineficientes com taxas médias de 1.5% a 3% e liquidação em vários dias.</p>
          </div>
          <div className="flex-1 p-8 bg-neutral-900 border border-white/5 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full group-hover:bg-emerald-500/20 transition-colors"></div>
            <p className="text-white/40 font-mono text-sm uppercase tracking-widest mb-4">SAM (Serviceable Addressable Market)</p>
            <h3 className="text-5xl md:text-6xl font-medium text-white mb-4">US$ 860B<span className="text-2xl text-white/50">/ano</span></h3>
            <p className="text-white/60">Volume global de remessas familiares e de pequenos negócios, onde as taxas são ainda mais abusivas (média global de 6.2%).</p>
          </div>
          <div className="flex-1 p-8 bg-neutral-900 border border-white/5 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full group-hover:bg-purple-500/20 transition-colors"></div>
            <p className="text-white/40 font-mono text-sm uppercase tracking-widest mb-4">SOM (Serviceable Obtainable Market)</p>
            <h3 className="text-5xl md:text-6xl font-medium text-white mb-4">US$ 25B<span className="text-2xl text-white/50">/ano</span></h3>
            <p className="text-white/60">América Latina e África. Considerando um take-rate conservador de 0.5%, representa uma oportunidade de receita massiva.</p>
          </div>
        </div>
      </section>

      <section className="px-6 max-w-6xl mx-auto mb-32 gs-fade-up">
        <h2 className="text-3xl md:text-5xl font-bricolage text-center text-white mb-16">
          Motor de Monetização
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 font-medium text-xl">
              {/* @ts-ignore */}
              <iconify-icon icon="solar:sale-linear"></iconify-icon>
            </div>
            <h4 className="text-xl font-medium text-white mb-3">Fee por Transação</h4>
            <p className="text-emerald-400 font-mono font-bold text-lg mb-4">0.1% a 0.5%</p>
            <p className="text-white/60 text-sm leading-relaxed">Taxa cobrada nas pontas de conversão (fiat para crypto). O custo nativo na rede Stellar é quase zero, garantindo spread atrativo.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 font-medium text-xl">
              {/* @ts-ignore */}
              <iconify-icon icon="solar:server-linear"></iconify-icon>
            </div>
            <h4 className="text-xl font-medium text-white mb-3">SaaS Institucional</h4>
            <p className="text-emerald-400 font-mono font-bold text-lg mb-4">US$ 150 - 5.000/mês</p>
            <p className="text-white/60 text-sm leading-relaxed">Licenciamento dos módulos corporativos (Payouts, ContractEase) baseado em volume processado, usuários e APIs customizadas.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 font-medium text-xl">
              {/* @ts-ignore */}
              <iconify-icon icon="solar:box-linear"></iconify-icon>
            </div>
            <h4 className="text-xl font-medium text-white mb-3">Hardware & B2C</h4>
            <p className="text-emerald-400 font-mono font-bold text-lg mb-4">Terminal + MDR</p>
            <p className="text-white/60 text-sm leading-relaxed">Venda direta do hardware Kivo Terminal e take-rate (MDR) competitivo nas vendas dos comerciantes e informais nas ruas.</p>
          </div>
        </div>
      </section>

      <section className="px-6 max-w-5xl mx-auto mb-32 gs-fade-up">
        <h2 className="text-3xl md:text-5xl font-bricolage text-center text-white mb-16">
          Roadmap Operacional
        </h2>
        
        <div className="flex flex-col gap-4 relative">
          <div className="absolute left-6 md:left-[50%] top-0 bottom-0 w-px bg-white/10"></div>
          
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center group">
            <div className="md:text-right pr-12 order-2 md:order-1 hidden md:block">
              <span className="text-emerald-500 font-mono tracking-widest text-sm uppercase">Agora</span>
            </div>
            <div className="absolute left-6 md:left-[50%] w-3 h-3 -translate-x-1.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10"></div>
            <div className="pl-16 md:pl-12 order-1 md:order-2">
              <span className="text-emerald-500 font-mono tracking-widest text-sm uppercase md:hidden block mb-2">Agora (Hackathon)</span>
              <h4 className="text-xl text-white font-medium mb-2">Demo Real e Ativa</h4>
              <p className="text-white/50">5 fluxos em demo real na testnet.</p>
            </div>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-8">
            <div className="md:text-right pr-12 order-2 md:order-1 hidden md:block">
              <span className="text-white/40 font-mono tracking-widest text-sm uppercase">30–60 dias</span>
            </div>
            <div className="absolute left-6 md:left-[50%] w-3 h-3 -translate-x-1.5 rounded-full bg-white/20 z-10"></div>
            <div className="pl-16 md:pl-12 order-1 md:order-2">
              <span className="text-white/40 font-mono tracking-widest text-sm uppercase md:hidden block mb-2">30–60 dias (Fase 1)</span>
              <h4 className="text-xl text-white font-medium mb-2">Produtos Físicos & Cartão</h4>
              <p className="text-white/50">Cartão de crédito · Kivo Terminal físico.</p>
            </div>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-8">
            <div className="md:text-right pr-12 order-2 md:order-1 hidden md:block">
              <span className="text-white/40 font-mono tracking-widest text-sm uppercase">6–12 meses</span>
            </div>
            <div className="absolute left-6 md:left-[50%] w-3 h-3 -translate-x-1.5 rounded-full bg-white/20 z-10"></div>
            <div className="pl-16 md:pl-12 order-1 md:order-2">
              <span className="text-white/40 font-mono tracking-widest text-sm uppercase md:hidden block mb-2">6–12 meses (Fase 2)</span>
              <h4 className="text-xl text-white font-medium mb-2">Go-to-Market LATAM</h4>
              <p className="text-white/50">Expansão LATAM · Todos os módulos em produção (mainnet).</p>
            </div>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-8">
            <div className="md:text-right pr-12 order-2 md:order-1 hidden md:block">
              <span className="text-white/40 font-mono tracking-widest text-sm uppercase">12–24 meses</span>
            </div>
            <div className="absolute left-6 md:left-[50%] w-3 h-3 -translate-x-1.5 rounded-full bg-white/20 z-10"></div>
            <div className="pl-16 md:pl-12 order-1 md:order-2">
              <span className="text-white/40 font-mono tracking-widest text-sm uppercase md:hidden block mb-2">12–24 meses (Fase 3)</span>
              <h4 className="text-xl text-white font-medium mb-2">Scale Global</h4>
              <p className="text-white/50">África · EUA & Canadá · Ásia via Singapura.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 max-w-6xl mx-auto mb-32 gs-fade-up">
        <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-5xl font-bricolage text-white mb-6">
              A Força Motriz
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-6">
              Validados e premiação durante o <strong className="text-white">Hackathon Stellar AKS</strong>. Nossa equipe consolidou a inteligência técnica, regulatória e de produto de vários sistemas:
            </p>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-3 text-white/80">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div> ContractEase (Jurídico on-chain)
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div> ONYX (Imobiliário RWA)
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div> QuiloVolt (Tokenização e Energia)
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div> Saúde 360 (Prontuário de saúde universal)
              </li>
            </ul>
            <p className="text-white/60 text-lg leading-relaxed mt-6">
              O Stellar Global Rails conecta a genialidade dessas verticais em uma única infraestrutura sólida, provando a tese de interoperabilidade máxima.
            </p>
          </div>
          <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
            <div className="aspect-square bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center p-6 text-center">
              <div className="text-4xl mb-3 border border-white/20 w-16 h-16 rounded-full flex items-center justify-center text-white/80">
                {/* @ts-ignore */}
                <iconify-icon icon="solar:code-circle-linear" width="32"></iconify-icon>
              </div>
              <p className="text-white font-medium">Engenharia Web3</p>
              <p className="text-white/40 text-xs mt-1">Stellar Soroban, Infra & Interfaces</p>
            </div>
            <div className="aspect-square bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center p-6 text-center">
              <div className="text-4xl mb-3 border border-white/20 w-16 h-16 rounded-full flex items-center justify-center text-white/80">
                {/* @ts-ignore */}
                <iconify-icon icon="solar:case-linear" width="32"></iconify-icon>
              </div>
              <p className="text-white font-medium">Business & Legal</p>
              <p className="text-white/40 text-xs mt-1">Compliance & Regulatório LATAM</p>
            </div>
            <div className="aspect-square bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center p-6 text-center">
              <div className="text-4xl mb-3 border border-white/20 w-16 h-16 rounded-full flex items-center justify-center text-white/80">
                {/* @ts-ignore */}
                <iconify-icon icon="solar:target-linear" width="32"></iconify-icon>
              </div>
              <p className="text-white font-medium">Go-to-Market</p>
              <p className="text-white/40 text-xs mt-1">Produto, UX Research e Escala</p>
            </div>
            <div className="aspect-square bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center p-6 text-center">
              <div className="text-4xl mb-3 border border-white/20 w-16 h-16 rounded-full flex items-center justify-center text-white/80">
                {/* @ts-ignore */}
                <iconify-icon icon="solar:cup-first-linear" width="32"></iconify-icon>
              </div>
              <p className="text-white font-medium">Tracionáveis</p>
              <p className="text-white/40 text-xs mt-1">Múltiplos pitchs de sucesso.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 max-w-6xl mx-auto mb-32 gs-fade-up">
        <h2 className="text-3xl md:text-5xl font-bricolage text-center text-white mb-16">
          The Ask <span className="text-white/30">(Rodada Seed)</span>
        </h2>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/3">
              <h3 className="text-5xl md:text-7xl font-medium text-white mb-2">US$ 1.5M</h3>
              <p className="text-emerald-400 font-mono uppercase tracking-widest text-sm mb-6">Funding Meta</p>
              <p className="text-white/80 leading-relaxed mb-6">Para assegurar 18 meses de runway focado na engenharia core, escalabilidade e expansão das verticais, obtenção de licenças regulatórias chave e marketing dos módulos B2B e B2C.</p>
              <div className="inline-flex items-center gap-2 text-white/50 text-sm font-mono bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
                Safe / Equity · Valuation TBD
              </div>
            </div>
            <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/40 backdrop-blur border border-white/10 p-6 rounded-2xl md:col-span-2 lg:col-span-1">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white font-medium">Engenharia & Produto</span>
                  <span className="text-emerald-400 font-mono font-bold">40%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-3">
                  <div className="bg-emerald-500 w-[40%] h-full"></div>
                </div>
                <p className="text-white/50 text-sm">Contratos Soroban e abstração multi-chain, interfaces, escalonamento do gateway Web3 e refinamento do ecossistema de módulos corporativos (ContractEase, ONYX, etc).</p>
              </div>
              <div className="bg-black/40 backdrop-blur border border-white/10 p-6 rounded-2xl md:col-span-2 lg:col-span-1">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white font-medium">Legal & Compliance</span>
                  <span className="text-emerald-400 font-mono font-bold">25%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-3">
                  <div className="bg-emerald-500 w-[25%] h-full"></div>
                </div>
                <p className="text-white/50 text-sm">Integrações de KYC/AML on-chain, licenças de pagamentos e parcerias com Anchors.</p>
              </div>
              <div className="bg-black/40 backdrop-blur border border-white/10 p-6 rounded-2xl md:col-span-2 lg:col-span-1">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white font-medium">Go-to-Market LATAM</span>
                  <span className="text-emerald-400 font-mono font-bold">25%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-3">
                  <div className="bg-emerald-500 w-[25%] h-full"></div>
                </div>
                <p className="text-white/50 text-sm">Aquisição de contas B2B, ativação de vendedores em campo e campanhas institucionais.</p>
              </div>
              <div className="bg-black/40 backdrop-blur border border-white/10 p-6 rounded-2xl md:col-span-2 lg:col-span-1">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white font-medium">Opex & Reservas</span>
                  <span className="text-emerald-400 font-mono font-bold">10%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-3">
                  <div className="bg-emerald-500 w-[10%] h-full"></div>
                </div>
                <p className="text-white/50 text-sm">Custos operacionais, infraestrutura cloud híbrida, auditorias de segurança de terceiros.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 max-w-5xl mx-auto text-center gs-fade-up">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-10 py-5 bg-white text-black rounded-full font-medium text-lg hover:bg-neutral-200 transition-colors">
            Falar com a equipe
          </button>
          <button className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-full font-medium hover:bg-white/10 transition-colors">
            Baixar pitch deck (PDF)
          </button>
        </div>
      </section>
    </div>
  );
}