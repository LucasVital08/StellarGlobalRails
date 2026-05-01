# Stellar Global Rails

**Stellar Global Rails** é um monorepo para desenvolvimento de produtos e módulos Web3 voltados a pagamentos globais, liquidação com stablecoins, comprovantes digitais, certificados verificáveis, compliance e aplicações financeiras construídas sobre a infraestrutura da rede **Stellar**.

O projeto foi criado para organizar, desenvolver e demonstrar produtos independentes que compartilham uma mesma base tecnológica: identidade de usuário, ledger de transações, camada de comprovantes, integração com carteiras, Stellar SDK, Horizon API, dashboard operacional e lógica de pagamentos em stablecoins como **USDC** e **BRZ**.

---

## Visão Geral

O objetivo do Stellar Global Rails é funcionar como uma infraestrutura modular para mover valor entre:

- pessoas;
- empresas;
- instituições;
- causas sociais;
- operadores de serviços;
- governos;
- aplicações digitais.

A proposta é reduzir a fragmentação dos fluxos financeiros globais, permitindo que diferentes produtos usem a mesma camada de pagamentos, rastreabilidade e comprovantes.

Exemplos de uso:

- um brasileiro no exterior enviando dinheiro para familiares no Brasil;
- uma instituição pagando bolsas ou auxílios em massa;
- uma ONG recebendo doações internacionais;
- um freelancer emitindo invoice para cliente estrangeiro;
- uma empresa emitindo certificados verificáveis;
- um operador de recarga elétrica recebendo pagamentos por QR Code;
- uma instituição analisando risco de transações blockchain.

---

## Ecossistema de Produtos

O Stellar Global Rails é o guarda-chuva de vários módulos/produtos independentes, mas integrados por uma infraestrutura comum.

### 1. FamilyBridge

Módulo de **remessa familiar internacional**.

Permite que pessoas que moram no exterior enviem dinheiro para familiares em outro país usando stablecoins e a rede Stellar.

Exemplo:

> Um brasileiro que mora nos EUA envia USDC para sua mãe no Brasil, com liquidação rápida, comprovante digital e rastreabilidade.

---

### 2. Stellar Payouts

Módulo de **pagamentos institucionais em massa**.

Permite que instituições paguem bolsas, auxílios, salários, premiações, residentes, freelancers ou beneficiários sociais em lote.

Funcionalidades previstas:

- upload de planilha CSV;
- validação de beneficiários;
- pagamento em lote;
- status individual por beneficiário;
- comprovantes automáticos;
- dashboard institucional.

---

### 3. ContractEase Global

Módulo de **contratos, certificados e escrow**.

Permite registrar documentos, gerar hashes, emitir certificados verificáveis e vincular pagamentos ou escrow a contratos digitais.

Funcionalidades previstas:

- geração de hash SHA-256;
- emissão de certificado verificável;
- QR Code de validação;
- página pública de verificação;
- registro de comprovantes;
- contratos com pagamento vinculado;
- escrow programável.

---

### 4. Vakinha Global

Módulo de **doações multimoeda**.

Permite que ONGs, campanhas sociais e causas recebam doações internacionais em diferentes moedas e stablecoins.

Funcionalidades previstas:

- criação de campanhas;
- meta de arrecadação;
- doações em USDC, BRZ ou outras moedas;
- comprovante para doador;
- rastreabilidade on-chain;
- relatórios de impacto.

---

### 5. Stellar Invoice

Módulo de **cobranças internacionais para PMEs e freelancers**.

Permite criar invoices profissionais com link de pagamento, recebimento em stablecoins e emissão de comprovante.

Funcionalidades previstas:

- criação de invoice;
- link de pagamento;
- status de pagamento;
- recibo automático;
- histórico de cobranças;
- dashboard financeiro.

---

### 6. QuiloVolt Global Pay

Módulo de **pagamentos para mobilidade elétrica**.

Permite simular e futuramente integrar pagamentos para recarga de veículos elétricos, patinetes, bikes elétricas, frotas e pontos de recarga conectados.

Funcionalidades do MVP:

- seleção de estação de recarga;
- pagamento por QR Code;
- simulação de pagamento em USDC/BRZ;
- liberação simulada da sessão de recarga;
- comprovante digital;
- dashboard do operador;
- registro de sessão, valor, energia estimada e status.

Este é o primeiro produto em desenvolvimento no monorepo.

---

### 7. ONYX Stellar Risk

Módulo de **compliance e risk assessment**.

Permite analisar carteiras, transações e fluxos financeiros na rede Stellar, gerando score de risco, alertas e relatórios.

Funcionalidades previstas:

- análise de transações;
- risk score;
- alertas AML/KYC;
- relatórios de compliance;
- auditoria de fluxo financeiro;
- integração futura com dashboards institucionais.

---

### 8. Saúde 360 Data Wallet

Módulo de **data wallet e consentimento**.

Permite controlar consentimento, compartilhamento seletivo e rastreabilidade de acesso a dados sensíveis, especialmente na área de saúde.

Funcionalidades previstas:

- carteira de consentimento;
- compartilhamento temporário;
- registro de autorização;
- histórico de acessos;
- controle granular pelo usuário;
- integração futura com HealthChain/Saúde 360.

---

## Produto Atual em Desenvolvimento

### QuiloVolt Global Pay

Local do projeto:

```bash
apps/quilovolt-global-pay
