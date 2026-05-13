const fs = require('fs');

const filePath = 'src/i18n/ui.ts';
let content = fs.readFileSync(filePath, 'utf8');

const translations = {
  'en': {
    'howitworks.title': 'The Rails Engineering',
    'howitworks.subtitle': 'How we build an invisible bridge between legacy systems and on-chain liquidity.',
    'howitworks.sysarch': 'System Architecture',
    'howitworks.step1.title': 'Inbound (Onboarding)',
    'howitworks.step1.desc': 'User pays in BRL, USD or EUR via local methods (Pix, SEP24) with full regulatory compliance.',
    'howitworks.step2.title': 'Stellar + Soroban',
    'howitworks.step2.desc': 'The magic happens: on-chain conversion via AMMs to USDC or BRZ accompanied by agile execution of smart contracts.',
    'howitworks.step3.title': 'The Suite (The Products)',
    'howitworks.step3.desc': 'Infrastructure takes control via integrated products: programmable escrow, complex payment splits and coordinated on-chain issuance.',
    'howitworks.step4.title': 'Outbound (Payout)',
    'howitworks.step4.desc': 'Final and definitive settlement in the bank account or digital wallet of the recipient anywhere in the world.',
  },
  'es': {
    'howitworks.title': 'La Ingeniería de los Rieles',
    'howitworks.subtitle': 'Cómo construimos un puente invisible entre los sistemas heredados y la liquidez on-chain.',
    'howitworks.sysarch': 'Arquitectura del Sistema',
    'howitworks.step1.title': 'Entrada (Onboarding)',
    'howitworks.step1.desc': 'El usuario paga en BRL, USD o EUR a través de métodos locales (Pix, SEP24) con total cumplimiento normativo.',
    'howitworks.step2.title': 'Stellar + Soroban',
    'howitworks.step2.desc': 'La magia sucede: conversión on-chain vía AMMs a USDC o BRZ acompañada de ejecución ágil de contratos inteligentes.',
    'howitworks.step3.title': 'La Suite (Los Productos)',
    'howitworks.step3.desc': 'La infraestructura toma el control vía productos integrados: escrow programable, divisiones de pago complejas y emisión on-chain coordinada.',
    'howitworks.step4.title': 'Salida (Payout)',
    'howitworks.step4.desc': 'Liquidación final y definitiva en la cuenta bancaria o billetera digital del destinatario en cualquier parte del mundo.',
  },
  'zh': {
    'howitworks.title': '轨道工程',
    'howitworks.subtitle': '我们如何在遗留系统和链上流动性之间建立一座无形的桥梁。',
    'howitworks.sysarch': '系统架构',
    'howitworks.step1.title': '入站 (Onboarding)',
    'howitworks.step1.desc': '用户通过本地方式（Pix、SEP24）以 BRL、USD 或 EUR 支付，完全符合监管要求。',
    'howitworks.step2.title': 'Stellar + Soroban',
    'howitworks.step2.desc': '神奇的事情发生了：通过 AMM 在链上转换为 USDC 或 BRZ，并配合智能合约的灵活执行。',
    'howitworks.step3.title': '套件（产品）',
    'howitworks.step3.desc': '基础设施通过集成产品进行控制：可编程托管、复杂的支付拆分和协调的链上发行。',
    'howitworks.step4.title': '出站 (Payout)',
    'howitworks.step4.desc': '在世界任何地方的收款人银行账户或数字钱包中进行最终且确定性的结算。',
  },
  'ko': {
    'howitworks.title': '레일 엔지니어링',
    'howitworks.subtitle': '레거시 시스템과 온체인 유동성 사이에 보이지 않는 다리를 구축하는 방법.',
    'howitworks.sysarch': '시스템 아키텍처',
    'howitworks.step1.title': '인바운드 (온보딩)',
    'howitworks.step1.desc': '사용자는 완전한 규정 준수 하에 현지 방식(Pix, SEP24)을 통해 BRL, USD 또는 EUR로 결제합니다.',
    'howitworks.step2.title': 'Stellar + Soroban',
    'howitworks.step2.desc': '마법이 일어납니다: 스마트 계약의 민첩한 실행과 함께 AMM을 통한 USDC 또는 BRZ로의 온체인 변환.',
    'howitworks.step3.title': '스위트 (제품)',
    'howitworks.step3.desc': '인프라는 통합 제품을 통해 제어합니다: 프로그래밍 가능한 에스크로, 복잡한 결제 분할 및 조정된 온체인 발행.',
    'howitworks.step4.title': '아웃바운드 (지급)',
    'howitworks.step4.desc': '전 세계 어디서나 수취인의 은행 계좌 또는 디지털 지갑으로 최종적이고 확정적인 정산.',
  },
  'ar': {
    'howitworks.title': 'هندسة القضبان',
    'howitworks.subtitle': 'كيف نبني جسراً غير مرئي بين الأنظمة القديمة والسيولة على السلسلة.',
    'howitworks.sysarch': 'بنية النظام',
    'howitworks.step1.title': 'الدخول (التهيئة)',
    'howitworks.step1.desc': 'يدفع المستخدم بالريال البرازيلي أو الدولار أو اليورو عبر طرق محلية (Pix، SEP24) مع الامتثال التنظيمي الكامل.',
    'howitworks.step2.title': 'Stellar + Soroban',
    'howitworks.step2.desc': 'يحدث السحر: التحويل على السلسلة عبر AMMs إلى USDC أو BRZ مصحوباً بتنفيذ رشيق للعقود الذكية.',
    'howitworks.step3.title': 'المجموعة (المنتجات)',
    'howitworks.step3.desc': 'تتولى البنية التحتية السيطرة عبر المنتجات المتكاملة: الضمان المبرمج، وتقسيم المدفوعات المعقد، وإصدار الأصول المنسق على السلسلة.',
    'howitworks.step4.title': 'الخروج (الدفع)',
    'howitworks.step4.desc': 'التصفية النهائية والقطعية في الحساب البنكي أو المحفظة الرقمية للمستلم في أي مكان في العالم.',
  }
};

// Also adding the extracted product keys for all languages (Simplified subset for the user's critical areas)
const languages = ['en', 'es', 'zh', 'ko', 'ar'];
for (const lang of languages) {
  if (!translations[lang]) translations[lang] = {};
  
  // Basic common keys
  translations[lang]['suite.badge'] = lang === 'pt-br' ? 'A Plataforma Unificada' : (lang === 'en' ? 'The Unified Platform' : (lang === 'es' ? 'La Plataforma Unificada' : (lang === 'zh' ? '统一平台' : (lang === 'ko' ? '통합 플랫폼' : 'المنصة الموحدة'))));
  translations[lang]['suite.title'] = lang === 'pt-br' ? 'A Suíte de Produtos.' : (lang === 'en' ? 'The Product Suite.' : (lang === 'es' ? 'La Suite de Productos.' : (lang === 'zh' ? '产品套件。' : (lang === 'ko' ? '제품 스위트.' : 'مجموعة المنتجات.'))));
}

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

for (const [lang, data] of Object.entries(translations)) {
  content = updateLangBlock(content, lang, data);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Massive translation applied for critical sections.');
