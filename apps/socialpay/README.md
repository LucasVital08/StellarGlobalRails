# SocialPay

> **Envie dinheiro por @. A rede social financeira auditável na Stellar.**

SocialPay é uma rede social financeira onde cada usuário tem um identificador `@usuario` e uma carteira Stellar Testnet associada. Transferências de XLM são feitas simplesmente digitando `@gabriel`.

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS + Radix UI
- Prisma ORM + SQLite
- Stellar SDK (JavaScript) — Stellar Testnet
- Zod, bcryptjs, Sonner

## Instalação

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run db:seed
npm run dev
```

Acesse: http://localhost:3000

## Testar @lucas → @gabriel

1. Acesse http://localhost:3000/demo
2. Clique "Criar carteiras de teste"
3. Clique "Financiar carteiras"
4. Clique "Enviar 10 XLM de @lucas para @gabriel"
5. Veja o hash e comprovante

## Login demo

- lucas@socialpay.test / demo123456
- gabriel@socialpay.test / demo123456

## AVISO

Ambiente Stellar Testnet apenas. Sem valor financeiro real.
NÃO use em produção sem revisão de segurança completa.
