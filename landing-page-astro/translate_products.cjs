const fs = require('fs');

const filePath = 'src/i18n/ui.ts';
let content = fs.readFileSync(filePath, 'utf8');

const productTranslations = {
  'en': {
    'product.socialpay.name': 'SocialPay',
    'product.socialpay.tagline': 'Where the economy gets a human face.',
    'product.socialpay.feature.data-vault.name': 'Private Data Vault',
    'product.socialpay.feature.data-vault.desc': 'Management of sensitive data with end-to-end encryption. You decide who accesses your health data.',
    'product.socialpay.feature.community-marketplace.name': 'Community Marketplace',
    'product.socialpay.feature.community-marketplace.desc': 'Infrastructure for social and p2p marketplaces. Buy and sell services via @handle.',
    'product.socialpay.agent.identity.title': 'Digital Identity Agent',
    'product.socialpay.agent.identity.desc': 'AI to validate documents, detect fraud and ensure regulatory compliance in real time.',
    'product.contractease.name': 'ContractEase',
    'product.contractease.tagline': 'Where agreements become immutable and intelligent.',
    'product.contractease.feature.immutability-motor.name': 'Immutability Engine',
    'product.contractease.feature.immutability-motor.desc': 'Protocol for definitive registration on Stellar. Each interaction generates an immutable hash.',
    'product.contractease.feature.programmable-escrow.name': 'Programmable Escrow',
    'product.contractease.feature.programmable-escrow.desc': 'Automatic settlement based on contractual milestones. Money held on-chain.',
    'product.kivopay.name': 'Kivo Pay',
    'product.kivopay.tagline': 'Where money moves at the speed of light.',
    'product.kivopay.feature.cross-border.name': 'Cross-border Remittances',
    'product.kivopay.feature.cross-border.desc': 'Instant international sending with up to 90% lower fees. USDC out, BRL arrives via Pix.',
    'product.kivopay.feature.m2m-payments.name': 'Autonomous M2M Payments',
    'product.kivopay.feature.m2m-payments.desc': 'Micro-transactions via Stellar x402 protocol without human intervention.'
  },
  'es': {
    'product.socialpay.name': 'SocialPay',
    'product.socialpay.tagline': 'Donde la economía gana un rostro humano.',
    'product.socialpay.feature.data-vault.name': 'Bóveda de Datos Privados',
    'product.socialpay.feature.data-vault.desc': 'Gestión de datos sensibles con cifrado de extremo a extremo. Tú decides quién accede a tus datos.',
    'product.socialpay.feature.community-marketplace.name': 'Mercado Comunitario',
    'product.socialpay.feature.community-marketplace.desc': 'Infraestructura para mercados sociales y p2p. Compra y vende servicios vía @handle.',
    'product.socialpay.agent.identity.title': 'Agente de Identidad Digital',
    'product.socialpay.agent.identity.desc': 'IA para validar documentos, detectar fraudes y garantizar el cumplimiento normativo en tiempo real.',
    'product.contractease.name': 'ContractEase',
    'product.contractease.tagline': 'Donde los acuerdos se vuelven inmutables e inteligentes.',
    'product.contractease.feature.immutability-motor.name': 'Motor de Inmutabilidad',
    'product.contractease.feature.immutability-motor.desc': 'Protocolo de registro definitivo en Stellar. Cada interacción genera un hash inmutable.',
    'product.contractease.feature.programmable-escrow.name': 'Garantía Programable',
    'product.contractease.feature.programmable-escrow.desc': 'Liquidación automática basada en hitos contractuales. Dinero retenido on-chain.',
    'product.kivopay.name': 'Kivo Pay',
    'product.kivopay.tagline': 'Donde el dinero se mueve a la velocidad de la luz.',
    'product.kivopay.feature.cross-border.name': 'Remesas Transfronterizas',
    'product.kivopay.feature.cross-border.desc': 'Envío internacional instantáneo con tarifas hasta un 90% más bajas. Sale USDC, llega BRL vía Pix.',
    'product.kivopay.feature.m2m-payments.name': 'Pagos M2M Autónomos',
    'product.kivopay.feature.m2m-payments.desc': 'Microtransacciones vía protocolo Stellar x402 sin intervención humana.'
  },
  'zh': {
    'product.socialpay.name': 'SocialPay',
    'product.socialpay.tagline': '让经济拥有人性化的面孔。',
    'product.socialpay.feature.data-vault.name': '私有数据保险库',
    'product.socialpay.feature.data-vault.desc': '采用端到端加密管理敏感数据。由您决定谁可以访问您的健康数据。',
    'product.socialpay.feature.community-marketplace.name': '社区市场',
    'product.socialpay.feature.community-marketplace.desc': '社交和 P2P 市场的驱动引擎。通过 @handle 买卖服务。',
    'product.contractease.name': 'ContractEase',
    'product.contractease.tagline': '让协议变得不可篡改且智能。',
    'product.contractease.feature.immutability-motor.name': '不可篡改引擎',
    'product.contractease.feature.immutability-motor.desc': 'Stellar 上的最终注册协议。每次交互都会生成不可篡改的哈希。',
    'product.kivopay.name': 'Kivo Pay',
    'product.kivopay.tagline': '让货币以光速移动。',
    'product.kivopay.feature.cross-border.name': '跨境汇款',
    'product.kivopay.feature.cross-border.desc': '即时国际汇款，手续费降低高达 90%。USDC 转出，通过 Pix 接收 BRL。'
  },
  'ko': {
    'product.socialpay.name': 'SocialPay',
    'product.socialpay.tagline': '경제에 인간적인 얼굴을 부여하는 곳.',
    'product.socialpay.feature.data-vault.name': '개인 데이터 금고',
    'product.socialpay.feature.data-vault.desc': '종단간 암호화로 민감한 데이터를 관리합니다. 귀하의 건강 데이터에 접근할 사람을 귀하가 결정합니다.',
    'product.socialpay.feature.community-marketplace.name': '커뮤니티 마켓플레이스',
    'product.socialpay.feature.community-marketplace.desc': '소셜 및 P2P 마켓플레이스를 위한 인프라. @handle을 통해 서비스를 사고파세요.',
    'product.contractease.name': 'ContractEase',
    'product.contractease.tagline': '합의가 불변이고 지능적으로 변하는 곳.',
    'product.contractease.feature.immutability-motor.name': '불변성 엔진',
    'product.contractease.feature.immutability-motor.desc': 'Stellar에서의 최종 등록 프로토콜. 각 상호작용은 불변의 해시를 생성합니다.',
    'product.kivopay.name': 'Kivo Pay',
    'product.kivopay.tagline': '돈이 빛의 속도로 이동하는 곳.',
    'product.kivopay.feature.cross-border.name': '국경 간 송금',
    'product.kivopay.feature.cross-border.desc': '최대 90% 낮은 수수료로 즉시 국제 송금. USDC 송금, Pix를 통해 BRL 수령.'
  },
  'ar': {
    'product.socialpay.name': 'SocialPay',
    'product.socialpay.tagline': 'حيث يكتسب الاقتصاد وجهاً إنسانياً.',
    'product.socialpay.feature.data-vault.name': 'خزنة البيانات الخاصة',
    'product.socialpay.feature.data-vault.desc': 'إدارة البيانات الحساسة بتشفير من طرف إلى طرف. أنت تقرر من يصل إلى بياناتك الصحية.',
    'product.socialpay.feature.community-marketplace.name': 'سوق المجتمع',
    'product.socialpay.feature.community-marketplace.desc': 'بنية تحتية للأسواق الاجتماعية ومن نظير إلى نظير. بيع وشراء الخدمات عبر @handle.',
    'product.contractease.name': 'ContractEase',
    'product.contractease.tagline': 'حيث تصبح الاتفاقيات غير قابلة للتغيير وذكية.',
    'product.contractease.feature.immutability-motor.name': 'محرك عدم التغيير',
    'product.contractease.feature.immutability-motor.desc': 'بروتوكول للتسجيل النهائي على Stellar. كل تفاعل يولد هاش غير قابل للتغيير.',
    'product.kivopay.name': 'Kivo Pay',
    'product.kivopay.tagline': 'حيث يتحرك المال بسرعة الضوء.',
    'product.kivopay.feature.cross-border.name': 'الحوالات عبر الحدود',
    'product.kivopay.feature.cross-border.desc': 'إرسال دولي فوري برسوم أقل بنسبة تصل إلى 90٪. يخرج USDC، ويصل BRL عبر Pix.'
  }
};

// Function to safely update the file
function updateLangBlock(content, lang, data) {
  const blockRegex = new RegExp(`'${lang}': \\{([\\s\\S]*?)\\},`, 'm');
  const match = content.match(blockRegex);
  if (!match) return content;
  
  let blockContent = match[1];
  for (const [key, value] of Object.entries(data)) {
    const entryRegex = new RegExp(`'${key}': '((?:[^'\\\\]|\\\\.)*)',?`, 'g');
    if (blockContent.match(entryRegex)) {
      blockContent = blockContent.replace(entryRegex, `'${key}': '${value.replace(/'/g, "\\'")}',`);
    } else {
      blockContent += `    '${key}': '${value.replace(/'/g, "\\'")}',\n`;
    }
  }
  
  return content.replace(match[0], `'${lang}': {${blockContent}},`);
}

for (const [lang, data] of Object.entries(productTranslations)) {
  content = updateLangBlock(content, lang, data);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Product translations updated.');
