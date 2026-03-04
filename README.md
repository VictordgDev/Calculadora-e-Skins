# CalcSkins 🧮

Uma calculadora funcional com skins visuais premium, sistema de XP/Level e ranking global.

## Tech Stack

- **Framework**: Next.js 15.1 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Autenticação**: Auth.js v5 — Google OAuth
- **Pagamentos**: InfinitePay
- **Banco de Dados**: PostgreSQL (Railway)
- **ORM**: Prisma 6
- **Testes**: Jest

## Setup local

### 1. Instalar dependências

```bash
npm install
```

### 2. Variáveis de ambiente

Copie o arquivo de exemplo e preencha com seus dados:

```bash
cp .env.example .env
```

### 3. Banco de dados

Execute as migrations no seu banco PostgreSQL (Railway):

```bash
npx prisma migrate dev --name init
```

### 4. Configurar Google OAuth

No [Google Cloud Console](https://console.cloud.google.com):

1. Crie um projeto e ative a API Google+
2. Em **Credenciais** → Criar credenciais → ID do cliente OAuth
3. Origens autorizadas: `http://localhost:3000`
4. URIs de redirecionamento: `http://localhost:3000/api/auth/callback/google`
5. Copie Client ID e Client Secret para o `.env`

### 5. Rodar em desenvolvimento

```bash
npm run dev
```

### 6. Rodar os testes

```bash
npm test
```

## Deploy na Vercel

1. Faça push do projeto para um repositório GitHub
2. Importe o projeto na [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente no painel da Vercel
4. Atualize `AUTH_URL` e `NEXT_PUBLIC_APP_URL` com a URL da Vercel
5. Adicione a URL de produção nas origens autorizadas do Google Cloud Console

> **Nota**: O `railway.toml` é usado para deploy no Railway (alternativa à Vercel). Para Vercel, as migrations devem ser executadas manualmente via `npx prisma migrate deploy`.

## Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js)
│   ├── api/
│   │   └── auth/[...nextauth]/  # Auth.js handler
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── auth.ts             # Configuração Auth.js
│   ├── prisma.ts           # Singleton Prisma Client
│   ├── xp.ts               # Lógica de XP e levels
│   ├── skins.ts            # Catálogo de skins
│   ├── infinitepay.ts      # Utilitários InfinitePay
│   └── utils.ts            # cn() helper
├── types/
│   └── next-auth.d.ts      # Extensão de tipos Auth.js
├── middleware.ts            # Proteção de rotas
└── __tests__/
    ├── xp.test.ts
    ├── infinitepay.test.ts
    └── skins.test.ts
prisma/
└── schema.prisma           # Schema completo do banco
```

## Plano de Execução

- [x] **Passo 1** — Setup, schema Prisma, estrutura base
- [ ] **Passo 2** — Landing page com animação de skins
- [ ] **Passo 3** — Autenticação Google OAuth (somente)
- [ ] **Passo 4** — Calculadora funcional + sistema de XP
- [ ] **Passo 5** — Integração InfinitePay (checkout + webhook)
- [ ] **Passo 6** — Loja de skins premium
- [ ] **Passo 7** — Página de perfil do usuário
- [ ] **Passo 8** — Sistema de ranking
