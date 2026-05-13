const fs = require('fs');

const filePath = 'src/i18n/ui.ts';
let content = fs.readFileSync(filePath, 'utf8');

const internalTranslations = {
  'en': {
    'fv.arbitration.analyzing': 'AI ANALYZING DISPUTE...',
    'fv.compliance.aml': 'AML_VALIDATED_OK',
    'fv.core.desc': 'Connected global infrastructure, active and operating with magnetic stability.',
    'fv.core.status': 'Protocol Active',
    'fv.core.title': 'Stellar Core',
    'fv.crossborder.settled': 'Settled in 3.2s',
    'fv.h2m.analyzing': 'ANALYZING LIQUIDITY ROUTES...',
    'fv.h2m.cost': 'COST',
    'fv.h2m.input': 'Input',
    'fv.h2m.kivo_routing': 'Kivo Routing',
    'fv.h2m.network': 'Stellar Network',
    'fv.h2m.routing': 'Smart Routing',
    'fv.h2m.settled': 'Settled',
    'fv.h2m.traditional': 'Traditional',
    'fv.radar.fraud_denied': 'FRAUDE_DENIED',
    'fv.radar.optimizing': 'OPTIMIZING...',
    'fv.radar.risk_scan': 'Risk Analysis',
    'fv.radar.safe_batch': 'SAFE_BATCH',
    'fv.radar.status': 'Global Scan Status',
    'fv.terminal.approved': 'Approved',
    'fv.terminal.auth': 'Authentication',
    'fv.terminal.processing': 'Processing',
    'fv.terminal.tap': 'TAP CARD OR PHONE',
    'simulator.kivo.processing': 'PROCESSING...',
    'simulator.kivo.engine_active': 'ENGINE ACTIVE',
  },
  'es': {
    'fv.arbitration.analyzing': 'IA ANALIZANDO DISPUTA...',
    'fv.compliance.aml': 'AML_VALIDADO_OK',
    'fv.core.desc': 'Infraestructura global conectada, activa y operando con estabilidad magnética.',
    'fv.core.status': 'Protocolo Activo',
    'fv.core.title': 'Stellar Core',
    'fv.crossborder.settled': 'Liquidado en 3.2s',
    'fv.h2m.analyzing': 'ANALIZANDO RUTAS DE LIQUIDEZ...',
    'fv.h2m.cost': 'COSTO',
    'fv.h2m.input': 'Entrada',
    'fv.h2m.routing': 'Enrutamiento Inteligente',
    'fv.h2m.settled': 'Liquidado',
    'fv.radar.fraud_denied': 'FRAUDE_DENEGADO',
    'fv.radar.risk_scan': 'Análisis de Riesgo',
    'fv.terminal.approved': 'Aprobado',
    'fv.terminal.processing': 'Procesando',
    'fv.terminal.tap': 'ACERQUE EL CARTÓN O CELULAR',
  },
  'zh': {
    'fv.arbitration.analyzing': '人工智能正在分析争议...',
    'fv.compliance.aml': '反洗钱验证成功',
    'fv.core.desc': '全球基础设施已连接，运行稳定。',
    'fv.core.status': '协议激活',
    'fv.core.title': 'Stellar 核心',
    'fv.crossborder.settled': '3.2秒内完成结算',
    'fv.h2m.analyzing': '正在分析流动性路线...',
    'fv.h2m.cost': '成本',
    'fv.h2m.input': '输入',
    'fv.h2m.routing': '智能路由',
    'fv.h2m.settled': '已结算',
    'fv.radar.fraud_denied': '欺诈被拒绝',
    'fv.radar.risk_scan': '风险分析',
    'fv.terminal.approved': '已批准',
    'fv.terminal.processing': '处理中',
    'fv.terminal.tap': '请靠近卡片或手机',
    'simulator.kivo.processing': '处理中...',
  },
  'ko': {
    'fv.arbitration.analyzing': 'AI 분쟁 분석 중...',
    'fv.compliance.aml': 'AML 검증 완료',
    'fv.core.desc': '연결된 글로벌 인프라, 활발하고 안정적으로 운영 중.',
    'fv.core.status': '프로토콜 활성',
    'fv.core.title': 'Stellar 코어',
    'fv.crossborder.settled': '3.2초 만에 정산 완료',
    'fv.h2m.analyzing': '유동성 경로 분석 중...',
    'fv.h2m.cost': '비용',
    'fv.h2m.input': '입력',
    'fv.h2m.routing': '스마트 라우팅',
    'fv.h2m.settled': '정산됨',
    'fv.radar.fraud_denied': '사기 거부됨',
    'fv.radar.risk_scan': '리스크 분석',
    'fv.terminal.approved': '승인됨',
    'fv.terminal.processing': '처리 중',
    'fv.terminal.tap': '카드나 휴대폰을 가까이 대주세요',
    'simulator.kivo.processing': '처리 중...',
  },
  'ar': {
    'fv.arbitration.analyzing': 'الذكاء الاصطناعي يحلل النزاع...',
    'fv.compliance.aml': 'تم التحقق من غسيل الأموال',
    'fv.core.desc': 'بنية تحتية عالمية متصلة، نشطة وتعمل باستقرار.',
    'fv.core.status': 'البروتوكول نشط',
    'fv.core.title': 'Stellar Core',
    'fv.crossborder.settled': 'تمت التسوية في 3.2 ثانية',
    'fv.h2m.analyzing': 'تحليل مسارات السيولة...',
    'fv.h2m.cost': 'التكلفة',
    'fv.h2m.input': 'إدخال',
    'fv.h2m.routing': 'توجيه ذكي',
    'fv.h2m.settled': 'تمت التسوية',
    'fv.radar.fraud_denied': 'تم رفض الاحتيال',
    'fv.radar.risk_scan': 'تحليل المخاطر',
    'fv.terminal.approved': 'تمت الموافقة',
    'fv.terminal.processing': 'جاري المعالجة',
    'fv.terminal.tap': 'قرب البطاقة أو الهاتف',
    'simulator.kivo.processing': 'جاري المعالجة...',
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

for (const [lang, data] of Object.entries(internalTranslations)) {
  content = updateLangBlock(content, lang, data);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Internal visualizer translations updated.');
