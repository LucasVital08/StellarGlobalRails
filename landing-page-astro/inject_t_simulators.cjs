const fs = require('fs');

const files = [
  'src/components/simulators/CoreSimulator.tsx',
  'src/components/simulators/FeatureVisualizer.tsx'
];

function translateFiles() {
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Add useTranslation if missing
    if (!content.includes('useTranslation()')) {
      content = content.replace(/export default function (\w+)\(([^)]*)\) {/, (m, name, args) => {
        return `export default function ${name}(${args}) {\n  const { t } = useTranslation();`;
      });
    }

    // Replace some common hardcoded patterns
    content = content.replace(/"(IA ANALISANDO DISPUTA\.\.\.)"/g, "t('fv.arbitration.analyzing')");
    content = content.replace(/"(AML_VALIDADO_OK)"/g, "t('fv.compliance.aml')");
    content = content.replace(/"(Liquidado em 3\.2s)"/g, "t('fv.crossborder.settled')");
    content = content.replace(/"(ANALISANDO ROTAS DE LIQUIDEZ\.\.\.)"/g, "t('fv.h2m.analyzing')");
    content = content.replace(/"(CUSTO)"/g, "t('fv.h2m.cost')");
    content = content.replace(/"(Entrada)"/g, "t('fv.h2m.input')");
    content = content.replace(/"(Roteamento Inteligente)"/g, "t('fv.h2m.routing')");
    content = content.replace(/"(Liquidado)"/g, "t('fv.h2m.settled')");
    content = content.replace(/"(FRAUDE_NEGADA)"/g, "t('fv.radar.fraud_denied')");
    content = content.replace(/"(Análise de Risco)"/g, "t('fv.radar.risk_scan')");
    content = content.replace(/"(Aprovado)"/g, "t('fv.terminal.approved')");
    content = content.replace(/"(Autenticação)"/g, "t('fv.terminal.auth')");
    content = content.replace(/"(Processando)"/g, "t('fv.terminal.processing')");
    content = content.replace(/"(APROXIME O CARTÃO OU CELULAR)"/g, "t('fv.terminal.tap')");
    content = content.replace(/"(PROCESSANDO\.\.\.)"/g, "t('simulator.kivo.processing')");
    content = content.replace(/"(MOTOR ATIVO)"/g, "t('simulator.kivo.engine_active')");

    fs.writeFileSync(file, content, 'utf8');
  });
  console.log('Internal files updated with t() calls.');
}

translateFiles();
