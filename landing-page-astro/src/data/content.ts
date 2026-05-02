export const modulesData = [
  {
    id: "familybridge",
    path: "/familybridge",
    icon: "solar:home-smile-linear",
    name: "FamilyBridge",
    tagline: "Envie dinheiro para o Brasil sem taxa absurda.",
    hero: {
      title: "Envie dinheiro para o Brasil sem pagar taxa absurda.",
      subtitle: "Filho nos EUA, pais no Brasil. USDC sai, BRL chega via Pix. Em segundos, com comprovante.",
      ctas: ["Criar envio", "Ver como funciona"]
    },
    problem: {
      title: "Remessas internacionais ainda custam caro.",
      items: [
        "Taxas de 5–10% por envio",
        "Câmbio ruim e spreads ocultos",
        "Demora de 1 a 3 dias úteis",
        "Experiência ruim para quem não tem conta no exterior"
      ]
    },
    solution: {
      title: "Um envio simples, barato e rastreável.",
      description: "O remetente paga em USDC. A Stellar liquida em segundos. O beneficiário recebe em BRL ou BRZ via Pix ou saldo digital. Comprovante gerado na hora, armazenado on-chain."
    },
    steps: [
      "Remetente cria envio informando valor e destinatário",
      "Sistema mostra cotação para BRL em tempo real",
      "Remetente paga em USDC via carteira Stellar",
      "Stellar processa a transação em 3–5 segundos",
      "Beneficiário recebe notificação e comprovante",
      "Saque via Pix disponível imediatamente"
    ],
    forWhom: [
      "Brasileiros que moram no exterior e enviam dinheiro para a família",
      "Trabalhadores internacionais com família no Brasil",
      "Qualquer pessoa que recebe em dólar e precisa converter para real"
    ],
    
    benefits: [
    {
        "icon": "lucide:rocket",
        "title": "Liquidação em segundos",
        "description": "Não espere dias úteis. Em 3 a 5 segundos, o recurso está liquidado."
    },
    {
        "icon": "lucide:shield-check",
        "title": "Rastreabilidade total",
        "description": "Cada etapa é visível na blockchain. Sem 'dinheiro perdido no sistema'."
    },
    {
        "icon": "lucide:wallet",
        "title": "Taxas até 90% menores",
        "description": "Use moedas digitais como USDC para fugir de spreads abusivos e custos de correspondentes."
    }
],
    techDetails: {
    "description": "FamilyBridge utiliza as capacidades nativas da Stellar para bridging de stablecoins (USDC) com rampas locais da rede (Pix no Brasil).",
    "points": [
        "Path Payment Strict Receive para conversão on-the-fly",
        "Integração com âncoras locais brasileiras (SEP-24)",
        "Custódia não-obrigatória: a chave fica no dispositivo",
        "Anchor Platform para compliance automático"
    ]
},
    faq: [
    {
        "question": "Preciso entender de cripto para usar?",
        "answer": "Não. A experiência do usuário foca exclusivamente em 'Enviar Dólar' e 'Receber Real', abstraindo toda a parte de blockchain, chaves e tokens para o background."
    },
    {
        "question": "O Pix cai na hora?",
        "answer": "Sim. Nossos parceiros de infraestrutura (âncoras) efetuam o Pix assim que a transação Stellar for confirmada na rede principal."
    }
],
    score: 94,
    finalCta: "Criar meu primeiro envio"
  },
  {
    id: "payouts",
    path: "/payouts",
    icon: "solar:buildings-linear",
    name: "Stellar Payouts",
    tagline: "Pague 200 bolsistas com um clique.",
    hero: {
      title: "Pague 200 bolsistas com um clique.",
      subtitle: "Upload de planilha, USDC depositado, pagamentos executados em lote. Dashboard mostra status de cada um em tempo real.",
      ctas: ["Começar agora", "Falar com a equipe"]
    },
    problem: {
      title: "Pagar muitas pessoas ao mesmo tempo ainda é um processo manual e opaco.",
      items: [
        "Planilhas e conciliação manual",
        "Comprovantes dispersos e difíceis de auditar",
        "Falhas de processamento sem visibilidade",
        "Zero transparência para o beneficiário"
      ]
    },
    solution: {
      title: "Pagamento em lote com rastreabilidade total on-chain.",
      description: "A instituição faz upload de uma lista, deposita saldo em USDC ou BRZ e executa os pagamentos com um clique. Cada beneficiário recebe comprovante verificável. O dashboard mostra status em tempo real: pendente, pago ou falhou."
    },
    steps: [
      "Instituição cadastra os beneficiários",
      "Faz upload de planilha CSV com valores",
      "Deposita USDC na plataforma",
      "Confirma e executa o lote",
      "Sistema processa cada pagamento individualmente",
      "Beneficiário recebe comprovante verificável",
      "Dashboard atualiza status em tempo real"
    ],
    forWhom: [
      "ONGs e institutos que pagam bolsistas",
      "Secretarias e órgãos públicos com programas sociais",
      "Empresas que pagam prestadores e freelancers em lote",
      "Programas de residência médica, artística ou acadêmica"
    ],
    
    benefits: [
    {
        "icon": "lucide:file-check",
        "title": "Automação via Planilhas",
        "description": "Faça um upload e pronto. O sistema processa mil pagamentos ao mesmo tempo."
    },
    {
        "icon": "lucide:layers",
        "title": "Redução do Custo Operacional",
        "description": "Zere os custos de TED/DOC internacionais e concentre sua liquidação via USDC/BRZ em lote."
    },
    {
        "icon": "lucide:trending-up",
        "title": "Reconciliação Automática",
        "description": "Relatórios perfeitos baixados no dashboard evidenciam erro/sucesso registro a registro."
    }
],
    techDetails: {
    "description": "A execução ocorre via envelopes de transação que agrupam múltiplas operações de pagamento, reduzindo tarifas de rede e maximizando o throughput.",
    "points": [
        "Transaction Envelopes Stellar para até 100 operações por vez",
        "Submissão assíncrona por workers para filas massivas",
        "Multi-assinatura (M-of-N) para aprovação de lotes de alto valor",
        "Rastreamento por 'Memo' para associação ao beneficiário"
    ]
},
    faq: [
    {
        "question": "Qual o limite de pessoas por lote?",
        "answer": "Não há limite estrito. Para arquivos muito grandes (acima de 10 mil linhas), o sistema quebra automaticamente em vários envelopes para envio otimizado."
    },
    {
        "question": "Se houver erro em um pagamento, o lote todo falha?",
        "answer": "O sistema isola falhas. Caso um endereço não possa receber, os demais são executados e o sistema sinaliza qual sub-operação falhou."
    }
],
    score: 92,
    finalCta: "Agendar demonstração"
  },
  {
    id: "contractease",
    path: "/contractease",
    icon: "solar:document-text-linear",
    name: "ContractEase Global",
    tagline: "Certificados que ninguém consegue falsificar.",
    hero: {
      title: "Contratos e certificados que ninguém consegue falsificar.",
      subtitle: "Hash registrado na Stellar. QR Code verificável por qualquer pessoa, a qualquer hora, sem depender da instituição emissora.",
      ctas: ["Emitir certificado", "Verificar documento"]
    },
    problem: {
      title: "Certificados digitais dependem da instituição para ser verificados.",
      items: [
        "Sem a instituição, não há como confirmar autenticidade",
        "Contratos podem ser alterados sem rastreabilidade",
        "Pagamentos vinculados a contratos não têm garantia automática",
        "Fraudes documentais são comuns e difíceis de provar"
      ]
    },
    solution: {
      title: "Documento verificável. Pagamento vinculado. Escrow opcional.",
      description: "O usuário envia o documento. O sistema gera o hash e registra na Stellar. O documento recebe um QR Code único. Qualquer pessoa pode verificar a autenticidade sem precisar da instituição. Em contratos de serviço, o valor pode ser depositado e liberado automaticamente após aceite."
    },
    steps: [
      "Usuário envia contrato ou certificado",
      "Sistema gera hash único do documento",
      "Hash é registrado na Stellar testnet",
      "Documento recebe QR Code verificável",
      "Verificador acessa o QR Code e confirma autenticidade",
      "Em contrato: valor depositado em USDC e liberado após aceite"
    ],
    forWhom: [
      "Instituições de ensino que emitem certificados",
      "Escritórios e advogados que trabalham com contratos",
      "Empresas que precisam de comprovação de entrega",
      "Programas que emitem certificados para beneficiários"
    ],
    
    benefits: [
    {
        "icon": "lucide:unlock",
        "title": "Verificação Independente",
        "description": "Mesmo que sua empresa feche as portas, o documento segue passível de verificação futura."
    },
    {
        "icon": "lucide:server",
        "title": "Proteção contra Fraudes",
        "description": "O hash criptográfico garante que nem mesmo 1 vírgula foi alterada do documento original."
    },
    {
        "icon": "lucide:zap",
        "title": "Gatilhos Financeiros Integrados",
        "description": "Acione depósitos assim que a parte contrária assinar digitalmente o documento."
    }
],
    techDetails: {
    "description": "Contratos e hashes são gravados na Stellar utilizando o recurso Manage Data das contas, ou através de Memos persistentes atrelados a micro-transações.",
    "points": [
        "Uso de SHA-256 para gerar o hash do documento",
        "Escrita permanente usando transações com Memo.Hash",
        "Interoperabilidade com IPFS para armazenar anexos volumosos",
        "Consulta de status através de endpoints Soroban/Horizon"
    ]
},
    faq: [
    {
        "question": "Onde o documento PDF fica salvo?",
        "answer": "A blockchain armazena apenas a 'impressão digital' (Hash) e metadados. O documento pode ser armzenado via nuvem comum ou IPFS para total resiliência."
    },
    {
        "question": "Qual a validade legal disso?",
        "answer": "Carimbos de tempo e hashes criptográficos constituem evidências técnicas irrefutáveis de pré-existência de arquivos em legislações de diversos países."
    }
],
    score: 90,
    finalCta: "Emitir meu primeiro certificado"
  },
  {
    id: "kivopay",
    path: "/kivo",
    icon: "solar:wallet-linear",
    name: "Kivo Pay",
    tagline: "O ecossistema completo para pagamentos offline e online.",
    hero: {
      title: "O ecossistema de pagamentos que não precisa de banco.",
      subtitle: "Terminal dedicado, aplicativo móvel e gateway global integrados em uma única infraestrutura usando a rede Stellar.",
      ctas: ["Conhecer ecossistema", "Criar conta Kivo"]
    },
    metrics: [
      { value: "3s", label: "Liquidação média" },
      { value: "US$ 0.0001", label: "Custo por transação" },
      { value: "100%", label: "Uptime on-chain" }
    ],
    problem: {
      title: "Receber pagamentos locais ou globais exige múltiplos parceiros, bancos e maquininhas caras.",
      items: [
        "Vendedores informais não têm acesso a maquininhas",
        "E-commerces pagam caro por gateways internacionais",
        "Maquininhas alugadas corroem a margem de lucro",
        "Risco de assalto usando celular exposto para vender"
      ]
    },
    solution: {
      title: "Um ecossistema unificado para cada necessidade.",
      description: "Do terminal dedicado para feiras offline ao gateway para e-commerces globais. O Kivo Pay liquida as vendas em segundos nas carteiras dos usuários, sem intermediários financeiros tradicionais."
    },
    steps: [
      "Escolha o módulo Kivo ideal para o seu negócio",
      "Venda via Terminal, Mobile App ou Gateway Web",
      "Receba em USDC ou BRL na sua carteira",
      "Liquidação em 3 a 5 segundos via Stellar",
      "Acesse todo o histórico no dashboard unificado",
      "Saque fácil a qualquer momento via parceiros locais"
    ],
    forWhom: [
      "Vendedores ambulantes e negócios locais sem CNPJ",
      "Prestadores de serviço e profissionais liberais",
      "E-commerces com vendas para o mundo todo",
      "Empresas em favelas e comércios de rua"
    ],
    
    benefits: [
    {
        "icon": "lucide:shopping-cart",
        "title": "Liquidez Global Instantânea",
        "description": "Cobre de Nova York ao Japão da mesma forma que cobra um Pix local."
    },
    {
        "icon": "lucide:banknote",
        "title": "Bypass de Gateway Tradicionais",
        "description": "Basta integrar a SDK e abrir caminho para liquidar fundos sem as travas bancárias antigas."
    },
    {
        "icon": "lucide:zap",
        "title": "Liquidação Multi-Ativos",
        "description": "Aceite em várias moedas, o contrato inteligente converte tudo para o ativo da sua preferência."
    }
],
    techDetails: {
    "description": "O ecossistema se baseia num protocolo de checkout e liquidação on-chain agnóstico para Point-Of-Sale e gateways Web.",
    "points": [
        "Integrações SDK via Stellar Turrets / Soroban Smart Contracts",
        "Payment Channels para micro-pagamentos frequentes",
        "Hardware NFC compatível offline usando Signed Envelopes",
        "Liquidez descentralizada (SDEX) buscando as melhores conversões"
    ]
},
    faq: [
    {
        "question": "Funciona sem internet no POS?",
        "answer": "Sim. Kivo Pay suporta assinaturas off-line temporárias, que são confirmadas pela rede assim que a máquina retoma conectividade."
    },
    {
        "question": "Qual moeda eu recebo?",
        "answer": "Você pode receber em USDC, EURC ou stablecoins atreladas a moeda local, permitindo fuga da inflação e proteção de capital."
    }
],
    score: 89,
    finalCta: "Conectar minha empresa ao Kivo Pay",
    pricing: {
      title: "Taxas justas. Sem asteriscos.",
      items: [
        { name: "Mensalidade e Adesão", value: "Grátis" },
        { name: "Pix e Cripto (USDC/BRZ)", value: "0.1%" },
        { name: "Cartão de Crédito", value: "0.99%" }
      ]
    },
    codeSnippet: {
      title: "Integre o Kivo Gateway em minutos",
      description: "Poucas linhas de código para aceitar pagamentos globais no seu e-commerce.",
      code: "import { KivoPayment } from '@kivo/sdk';\n\nconst checkout = new KivoPayment({\n  apiKey: 'pk_live_...',\n  amount: 45.00,\n  currency: 'USDC',\n  onSuccess: (receipt) => {\n    console.log('Pagamento liquidado on-chain!', receipt.hash);\n  }\n});\n\ncheckout.mount('#payment-element');"
    },
    subModules: [
      {
        name: "Kivo Mobile",
        description: "Venda com QR Code, NFC ou link sem precisar de CNPJ. Só instalar e usar. Transforme qualquer celular em uma maquininha global.",
        icon: "solar:smartphone-linear",
        features: ["Tap-to-pay via NFC", "Links de cobrança", "Conciliação automática"]
      },
      {
        name: "Kivo Terminal",
        description: "Um hardware dedicado incrivelmente barato. Bateria para uma semana, sem necessidade de celular pareado. Comprou, é seu.",
        icon: "solar:monitor-smartphone-linear",
        features: ["Chip 4G embutido global", "Bateria de 7 dias", "Sem tela sensível (anti-queda)"]
      },
      {
        name: "Kivo Gateway",
        description: "Checkout para sites com poucas linhas de código. Receba de clientes em 180+ países usando vias locais ou globais.",
        icon: "solar:code-circle-linear",
        features: ["SDK TypeScript", "Webhooks em tempo real", "Checkout white-label"]
      }
    ]
  },
  {
    id: "vakinha",
    path: "/vakinha",
    icon: "solar:heart-pulse-linear",
    name: "Vakinha Global",
    tagline: "Causas sociais que recebem do mundo todo.",
    hero: {
      title: "Sua causa. O mundo inteiro pode apoiar.",
      subtitle: "Arrecadação global em USDC e BRL com transparência on-chain. Qualquer doador, de qualquer país, com comprovante verificável.",
      ctas: ["Criar campanha", "Ver campanhas ativas"]
    },
    problem: {
      title: "Causas sociais locais não conseguem receber de fora do Brasil.",
      items: [
        "Plataformas tradicionais bloqueiam pagamentos internacionais",
        "Câmbio caro e taxas que corroem a arrecadação",
        "Sem transparência para o doador",
        "Fraude difícil de detectar sem validação"
      ]
    },
    solution: {
      title: "Vakinha global com transparência total on-chain.",
      description: "Criador define a meta em BRL. Doadores de qualquer país enviam em USDC, BRZ ou BRL. Progresso atualiza em tempo real. Cada doação gera comprovante on-chain. O criador saca quando a meta é atingida."
    },
    steps: [
      "Criador define campanha, meta e prazo",
      "Campanha passa por validação da plataforma",
      "Link é compartilhado em qualquer rede",
      "Doador paga em USDC/BRZ via carteira Stellar",
      "Progresso atualiza em tempo real",
      "Comprovante gerado para o doador",
      "Criador saca quando a meta é atingida"
    ],
    forWhom: [
      "ONGs e coletivos com causas sociais",
      "Projetos culturais e artísticos independentes",
      "Comunidades que precisam de apoio financeiro internacional",
      "Qualquer causa que queira receber doação de fora do Brasil"
    ],
    
    benefits: [
    {
        "icon": "lucide:globe",
        "title": "Alcance Sem Fronteiras",
        "description": "Um europeu, asiático ou americano pode doar via Pix internacional (USDC) facilmente."
    },
    {
        "icon": "lucide:eye",
        "title": "Transparência Inquebrável",
        "description": "Todos os fundos repousam on-chain. Não há acusação de desvio, a comunidade inteira pode auditar."
    },
    {
        "icon": "lucide:heart-handshake",
        "title": "Repasse 100%",
        "description": "Você não perde 20% do orçamento para plataformas de crowdfundings. Pague apenas a gasolina da rede (<US$0,01)."
    }
],
    techDetails: {
    "description": "Campanhas criam uma wallet temporária multifill que aglomera os fundos com transparência em tempo real, travando o saque baseado em regras Soroban opcionalmente.",
    "points": [
        "Smart contracts em Soroban para regras de resgate (Ex: bater meta)",
        "Escuta de transações via Horizon API em tempo real",
        "Asset emitido para lastrear as doações",
        "Suporte a M-of-N signers para comitês em ONGs"
    ]
},
    faq: [
    {
        "question": "Como o doador estrangeiro contribui?",
        "answer": "Ele utiliza cartão de crédito em Rampa externa via parceiros, o valor é tokenizado (USDC) e direcionado atômico ao destinatário."
    },
    {
        "question": "E se a meta não for atingida?",
        "answer": "Por defualt o modelo é tudo-ou-nada (smart contract devolve os tokens) ou flexível (criador pode sacar o valor menor)."
    }
],
    score: 88,
    finalCta: "Criar minha campanha agora"
  },
  {
    id: "invoice",
    path: "/invoice",
    icon: "solar:bill-list-linear",
    name: "Stellar Invoice",
    tagline: "Invoice internacional sem conta no exterior.",
    hero: {
      title: "Invoice internacional sem conta no exterior.",
      subtitle: "Crie, envie e receba em USDC. O cliente paga de qualquer lugar. O recibo sai automático.",
      ctas: ["Criar invoice", "Ver exemplo"]
    },
    problem: {
      title: "Cobrar clientes internacionais ainda é burocrático e caro.",
      items: [
        "Transferência bancária internacional lenta e cara",
        "IOF e taxas de câmbio corroem o valor recebido",
        "Sem comprovante organizado",
        "Conta no exterior exige burocracia pesada"
      ]
    },
    solution: {
      title: "Invoice simples, global e verificável.",
      description: "O freelancer ou PME cria a invoice na plataforma, gera link ou QR Code e compartilha com o cliente. O cliente paga em USDC ou BRZ. O sistema detecta o pagamento on-chain, marca a invoice como paga e emite recibo automático."
    },
    steps: [
      "Criar invoice com valor, descrição e prazo",
      "Gerar link de pagamento ou QR Code",
      "Enviar para o cliente por qualquer canal",
      "Cliente paga em USDC via carteira Stellar",
      "Sistema detecta pagamento on-chain",
      "Invoice muda para \"paga\"",
      "Recibo verificável emitido automaticamente"
    ],
    forWhom: [
      "Freelancers que atendem clientes internacionais",
      "Agências com contas fora do Brasil",
      "Pequenas empresas de serviço exportador",
      "Profissionais digitais que recebem em dólar"
    ],
    
    benefits: [
    {
        "icon": "lucide:coins",
        "title": "Menos burocracia de Swift",
        "description": "Nunca mais pague US$30 só de taxa Swift por transferência."
    },
    {
        "icon": "lucide:clock",
        "title": "Sem T+2 de Intermediários",
        "description": "O cliente manda. Cai em 3 segundos. Está nas suas mãos, não num 'clearing house'."
    },
    {
        "icon": "lucide:box",
        "title": "Automatização do Billing",
        "description": "Reconcilie notas e baixe automaticamente conforme a blockchain percebe o pagamento."
    }
],
    techDetails: {
    "description": "Invoces assinam um memo exclusivo no payload de pagamento, garantindo vínculo forte entre a transação de liquidação e o PDF/documento emitido.",
    "points": [
        "Geração de QR codes Stellar URI Scheme nativo",
        "Separação lógica via Text Memo e ID da Fatura",
        "Webhooks atrelados à conta do recebedor (Stellar Event listeners)",
        "Garantia atômica do valor recebido, protegendo contra estornos falsos"
    ]
},
    faq: [
    {
        "question": "Posso justificar para o contador?",
        "answer": "A infra permite a geração de um recibo unificado contendo o Tx Hash e os dados originais para contabilidade."
    },
    {
        "question": "O cliente não tem cripto, o que fazer?",
        "answer": "A fatura suporta 'Rampas integradas' pela rede SEP-24, ele paga no site em cartão ou bank transfer local e chega tokenizado."
    }
],
    score: 85,
    finalCta: "Criar minha primeira invoice"
  },
  {
    id: "quilovolt",
    path: "/quilovolt",
    icon: "solar:bolt-circle-linear",
    name: "QuiloVolt Global Pay",
    tagline: "Pague a recarga do seu elétrico com Stellar.",
    hero: {
      title: "Recarregue seu elétrico. Pague com Stellar.",
      subtitle: "Um gateway de pagamento agnóstico que funciona em qualquer carregador — o usuário paga em qualquer moeda, o operador recebe via Stellar.",
      ctas: ["Para operadores de carregadores", "Para usuários"]
    },
    problem: {
      title: "Cada rede de carregamento tem seu próprio app, cadastro e forma de pagamento.",
      items: [
        "Fricção enorme para o motorista elétrico",
        "Operadores dependem de sistemas proprietários caros",
        "Sem opção de pagamento internacional em roaming",
        "Liquidação lenta e cara para operadores"
      ]
    },
    solution: {
      title: "Uma camada de pagamento que funciona em qualquer carregador.",
      description: "Agnóstica de hardware. O usuário paga em moeda local, USDC, BRZ ou outro meio. O operador recebe liquidado via Stellar em segundos. Relatório de kWh, valor e repasse disponível no dashboard."
    },
    steps: [
      "Usuário chega no carregador e escaneia QR Code",
      "Seleciona forma de pagamento (USDC, BRZ ou moeda local)",
      "Paga via carteira Stellar",
      "Sistema detecta pagamento e libera sessão de recarga",
      "Dashboard mostra kWh, valor, taxa e repasse",
      "Operador recebe liquidação instantânea"
    ],
    forWhom: [
      "Operadores de redes de carregamento",
      "Condomínios e estacionamentos com EV charging",
      "Frotas de veículos elétricos corporativos",
      "Motoristas elétricos que viajam entre países"
    ],
    
    benefits: [
    {
        "icon": "lucide:zap",
        "title": "Roaming de Energia Livre",
        "description": "O aplicativo Quilovolt não o prende. Pague usando qualquer wallet com base em Stellar."
    },
    {
        "icon": "lucide:layers",
        "title": "Agnóstico a Hardware",
        "description": "OCPP-friendly, suportando o controle logístico de totens através dos protocolos universais."
    },
    {
        "icon": "lucide:line-chart",
        "title": "Micropagamentos Viáveis",
        "description": "Você consumiu $0,35c de energia? Com Stellar você pode transacionar micro valores sem lucro devorado por taxa."
    }
],
    techDetails: {
    "description": "Aplicações de infraestrutura EV usam pagamento pré-autorizado ou micro-pagamentos sucessivos.",
    "points": [
        "Mecanismos de Authorization Holds com Claimable Balances",
        "Comunicação híbrida entre IoT e Stellar Blockchain",
        "Liquidação contínua utilizando Payment Channels (Soroban)",
        "Controles de emissões de carbono auditáveis e green energy"
    ]
},
    faq: [
    {
        "question": "E se a conexão de internet do Totem cair?",
        "answer": "Quilovolt aceita processamentos assíncronos pós-recarga. Sessões offline são gravadas localmente e reconciliadas em batch após o retorno da rede."
    },
    {
        "question": "Como o provedor do posto de luz ganha?",
        "answer": "Os provedores configuram regras de liquidação como split de pagamento diretamente no contrato inteligente Stellar."
    }
],
    score: 83,
    finalCta: "Falar com a equipe QuiloVolt"
  },
  {
    id: "onyx",
    path: "/onyx",
    icon: "lucide:shield-check",
    name: "ONYX Stellar Risk",
    tagline: "Risco on-chain. Compliance em tempo real.",
    hero: {
      title: "Risco on-chain. Compliance em tempo real.",
      subtitle: "Análise de carteiras Stellar, grafo de transações e score de risco para fintechs, exchanges e órgãos de investigação.",
      ctas: ["Analisar uma carteira", "Para empresas"]
    },
    problem: {
      title: "Fintechs e exchanges precisam entender risco de carteiras Stellar — sem ferramenta dedicada.",
      items: [
        "Sem visibilidade do histórico de transações de uma carteira",
        "Compliance manual e lento",
        "Sem score de risco automatizado",
        "Investigação difícil sem grafo de relacionamentos"
      ]
    },
    solution: {
      title: "Insira uma carteira. Receba score, grafo e relatório.",
      description: "O usuário insere um endereço Stellar. O sistema busca todas as transações, monta o grafo de relacionamentos, calcula score de risco com heurísticas e gera relatório exportável. O hash do relatório pode ser registrado na própria Stellar."
    },
    steps: [
      "Inserir endereço de carteira Stellar",
      "Sistema busca e indexa todas as transações",
      "Grafo de relacionamentos é montado",
      "Heurísticas calculam score de risco",
      "Relatório gerado com detalhes e recomendações",
      "Hash do relatório registrado na Stellar (opcional)"
    ],
    forWhom: [
      "Exchanges e fintechs com obrigações de compliance",
      "Órgãos de investigação financeira",
      "Auditores e contadores de ativos digitais",
      "Empresas que precisam verificar parceiros na rede Stellar"
    ],
    
    benefits: [
    {
        "icon": "lucide:search",
        "title": "Análise Visual Imediata",
        "description": "Obtenha grafos interativos de fluxos com indicação visual de nós maliciosos."
    },
    {
        "icon": "lucide:flag",
        "title": "Proteja sua Plataforma",
        "description": "Impede o ingresso de capitais suspeitos rejeitando depósitos antes de cair no seu ecossistema."
    },
    {
        "icon": "lucide:database",
        "title": "Motor Baseado em Regras e IA",
        "description": "Integração híbrida (Machine Learning + Heurística clássica) num core hiperrápido."
    }
],
    techDetails: {
    "description": "Investigação aprofundada baseada em rastreamento Taint e análise de vizinhança de vértices por graus de parentesco na rede.",
    "points": [
        "Consumo de BigQuery/Stellar Data dumps puros para análise massiva retroativa",
        "Webhooks Horizon em live-time para sinalização anti-lavagem",
        "API Restful de altíssima latência (Score<100ms)",
        "Algoritmos Graph baseados em Pagerank Reverso e Clusterização DBScan"
    ]
},
    faq: [
    {
        "question": "Vocês acessam minha base de dados?",
        "answer": "Não. A ferramenta Onyx analisa somente dados públicos de ledger. Opcionalmente, pode assinar contratos NDA para processar seus dados on-premises."
    },
    {
        "question": "Qual velocidade do Webhhok?",
        "answer": "Menos de um segundo para classificação na latência nativa do bloco Stellar."
    }
],
    score: 81,
    finalCta: "Analisar minha primeira carteira"
  },
  {
    id: "saude360",
    path: "/saude360",
    icon: "solar:health-linear",
    name: "Saúde 360 Data Wallet",
    tagline: "Seus dados de saúde. Seu dinheiro.",
    hero: {
      title: "Seus dados de saúde. Seu controle. Sua remuneração.",
      subtitle: "Você decide quem acessa seus dados de saúde e recebe em USDC quando eles são utilizados de forma permitida.",
      ctas: ["Criar minha carteira", "Para pesquisadores"]
    },
    problem: {
      title: "Seus dados de saúde valem bilhões — mas o dinheiro vai para as instituições, não para você.",
      items: [
        "Paciente não controla quem acessa seus dados",
        "Sem participação econômica no uso dos dados",
        "Consentimento burocrático e não rastreável",
        "Pesquisadores têm dificuldade de acessar dados de qualidade"
      ]
    },
    solution: {
      title: "Consentimento controlado pelo paciente. Remuneração automática.",
      description: "O paciente controla quais finalidades autoriza, revoga acessos a qualquer momento e recebe em USDC quando seus dados são usados de forma permitida. Tudo registrado on-chain."
    },
    steps: [
      "Paciente cria perfil e carteira de dados",
      "Define quais finalidades autoriza",
      "Pesquisador ou empresa solicita acesso",
      "Paciente aprova ou rejeita via plataforma",
      "Sistema registra consentimento na Stellar",
      "Pesquisador paga em USDC",
      "Paciente recebe valor automaticamente"
    ],
    forWhom: [
      "Pacientes que querem controlar seus dados",
      "Pesquisadores que precisam de dados de qualidade",
      "Gestores de saúde pública",
      "Empresas de IA médica"
    ],
    
    benefits: [
    {
        "icon": "lucide:coins",
        "title": "Monetização Ativa",
        "description": "Estudos acadêmicos e laboratórios financiam o recebimento dos seus dados clínicos desidentificados."
    },
    {
        "icon": "lucide:key",
        "title": "Revogação Instantânea",
        "description": "Mude de ideia a qualquer minuto. Cortar o acesso encerra chaves de decriptografia."
    },
    {
        "icon": "lucide:database",
        "title": "Totalmente Privado",
        "description": "Seus dados estão na nuvem cifrados. A blockchain guarda a posse de acessos. Seus exames são impossíveis de vazar pelas redes."
    }
],
    techDetails: {
    "description": "Um protocolo Zero-Trust atrelado a tokens de permissão on-chain e armazenamento fora de cadeia encriptado.",
    "points": [
        "Criptografia ponta a ponta (AES-256 e RSA-4096)",
        "Gerenciamento de Identidade Descentralizada (DID)",
        "Token de Acesso emitido por NFT não transferível",
        "Troca atômica (Soroban) entre Token de Acesso vs Pagamento USDC"
    ]
},
    faq: [
    {
        "question": "Alguém pode hackear meus dados na blockchain?",
        "answer": "Os dados NUNCA vão para a blockchain. A blockchain guarda apenas as chaves de acesso. Somente com a sua permissão criptográfica o servidor libera a porta."
    },
    {
        "question": "Como os pagamentos ocorrem?",
        "answer": "O laboratório cria uma ordem de custódia na Stellar. Assim que você fornece a chave, um smart contract liquida a quantia para sua carteira."
    }
],
    score: 76,
    finalCta: "Criar minha carteira de dados"
  },
  {
    id: "escrow",
    path: "/escrow",
    icon: "solar:shield-keyhole-linear",
    name: "Marketplace B2B com Escrow",
    tagline: "Compre e venda sem risco para nenhum dos dois.",
    hero: {
      title: "Compre e venda sem risco para nenhum dos dois.",
      subtitle: "O comprador deposita. O fornecedor entrega. O pagamento é liberado automaticamente após confirmação. Sem intermediário financeiro.",
      ctas: ["Criar pedido", "Para fornecedores"]
    },
    problem: {
      title: "Em transações B2B, alguém sempre corre risco — ou o comprador que paga e não recebe, ou o fornecedor que entrega e não é pago.",
      items: [
        "Sem garantia automática de pagamento",
        "Disputas difíceis de resolver sem intermediário",
        "Confiança baixa em novas relações comerciais",
        "Custo alto de intermediários financeiros tradicionais"
      ]
    },
    solution: {
      title: "Escrow automático com liberação por confirmação.",
      description: "O comprador deposita o valor em USDC na Stellar. O fornecedor entrega. O comprador confirma o recebimento. O contrato libera o pagamento automaticamente. Sem banco, sem advogado, sem espera."
    },
    steps: [
      "Comprador cria pedido com descrição e valor",
      "Deposita USDC na plataforma",
      "Fornecedor recebe notificação e executa entrega",
      "Fornecedor marca entrega como concluída",
      "Comprador confirma recebimento",
      "Pagamento liberado automaticamente",
      "Comprovante gerado para ambas as partes"
    ],
    forWhom: [
      "Empresas em novas relações comerciais B2B",
      "Marketplaces que precisam garantir transações",
      "Profissionais que prestam serviço para novos clientes",
      "Importadores e exportadores sem histórico conjunto"
    ],
    
    benefits: [
    {
        "icon": "lucide:shield-alert",
        "title": "Fim da Fricção na Venda",
        "description": "Acabe com a desconfiança entre parceiros novos que nunca negociaram juntos."
    },
    {
        "icon": "lucide:scale",
        "title": "Termos Imutáveis",
        "description": "Depois de depositado no Escrow, as cláusulas não mudam de forma unilateral."
    },
    {
        "icon": "lucide:handshake",
        "title": "Painel de Arbitragem",
        "description": "Se a mercadoria não chegar, há mecanismos multicotas (Arbitros) previstos no sistema para devolver."
    }
],
    techDetails: {
    "description": "O escrow é implementado de forma descentralizada na rede Stellar usando mecanismos multi-sign e Claimable Balances predefinidos ou contratos inteligentes (Soroban).",
    "points": [
        "Smart Contracts de Custódia Baseados em Soroban",
        "Signatures Thresholds (ex: Comprador + Seller ou Arbitro)",
        "Timelocks temporais rigorosos para devoluções via timeouts",
        "Resende independente se houver falha na rede ou front-end"
    ]
},
    faq: [
    {
        "question": "Posso cancelar uma compra?",
        "answer": "Uma vez firmado o Escrow, a parte não pode cancelar unilateralmente, evitando que vendedores enviem produtos sem a certeza do pagamento."
    },
    {
        "question": "Quem soluciona um conflito?",
        "answer": "Comprador e vendedor nomeiam um terceiro árbitro (oracle) aprovado e automatizado para intervir com 1 voto."
    }
],
    score: 74,
    finalCta: "Criar meu primeiro pedido com escrow"
  }
];