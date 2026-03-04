# CalcSkins 🧮✨

Calculadora SaaS com sistema de skins, XP e ranking. Construída com Next.js 15, Prisma, Auth.js e Pagar.me.

## Stack

- **Framework**: Next.js 15 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Autenticação**: Auth.js v5 (Google + Magic Link via Resend)
- **Pagamentos**: Pagar.me (PIX)
- **Banco**: PostgreSQL (Railway)
- **ORM**: Prisma

## Estrutura do projeto

```
calcskins/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # Auth.js handlers
│   │   ├── checkout/             # Cria pedidos no Pagar.me
│   │   ├── equip-skin/           # Equipar skin
│   │   ├── webhooks/pagarme/     # Recebe eventos do Pagar.me
│   │   └── xp/                   # Concede XP ao usuário
│   ├── app/                      # /app — dashboard (restrito)
│   │   ├── profile/              # Perfil do usuário
│   │   └── store/                # Loja de skins
│   ├── checkout/                 # Página de pagamento
│   ├── login/                    # Login
│   ├── ranking/                  # Ranking público
│   ├── register/                 # Cadastro
│   └── page.tsx                  # Landing page
├── components/
│   ├── calculator/
│   │   ├── Calculator.tsx        # Calculadora funcional com suporte a skins
│   │   └── XpBar.tsx             # Barra de progresso XP
│   └── ui/                       # shadcn/ui base
├── lib/
│   ├── pagarme.ts                # Utilitários Pagar.me
│   ├── prisma.ts                 # Prisma client singleton
│   ├── skins.ts                  # Catálogo de skins + lógica XP/Level
│   ├── utils.ts                  # cn()
│   └── xp.ts                     # grantXp(), grantCalcXp()
├── prisma/
│   └── schema.prisma             # Schema completo
├── auth.ts                       # Config Auth.js
├── middleware.ts                 # Proteção de rotas
├── nixpacks.toml                 # Build no Railway
└── railway.toml                  # Deploy config
```

## Setup local

### 1. Clone e instale dependências

```bash
git clone <repo>
cd calcskins
npm install
```

### 2. Configure variáveis de ambiente

```bash
cp .env.example .env
```

Preencha o `.env`:
- `DATABASE_URL` — URL do PostgreSQL (Railway, Supabase, ou local)
- `AUTH_SECRET` — gere com `npx auth secret`
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — [console.cloud.google.com](https://console.cloud.google.com)
- `PAGARME_SECRET_KEY` / `PAGARME_WEBHOOK_SECRET` — [dashboard.pagar.me](https://dashboard.pagar.me)

### 3. Rode as migrations

```bash
npx prisma migrate dev --name init
```

### 4. Inicie o servidor

```bash
npm run dev
```

## Deploy no Railway

### Passo a passo

1. **Crie um projeto no Railway** em [railway.app](https://railway.app)

2. **Adicione um banco PostgreSQL**:
   - New Service → Database → PostgreSQL
   - Copie a `DATABASE_URL` nas variáveis

3. **Conecte o repositório**:
   - New Service → GitHub Repo → selecione este repo

4. **Configure as variáveis de ambiente** no painel Railway:
   ```
   DATABASE_URL=<copiado do PostgreSQL>
   AUTH_SECRET=<gere localmente com npx auth secret>
   AUTH_URL=https://seu-projeto.railway.app
   NEXT_PUBLIC_APP_URL=https://seu-projeto.railway.app
   AUTH_GOOGLE_ID=...
   AUTH_GOOGLE_SECRET=...
   PAGARME_SECRET_KEY=...
   NEXT_PUBLIC_PAGARME_PUBLIC_KEY=...
   PAGARME_WEBHOOK_SECRET=...
   ```

5. **Railway fará o build automaticamente** usando `nixpacks.toml`

6. **Configure o Webhook no Pagar.me**:
   - Dashboard Pagar.me → Webhooks → Adicionar
   - URL: `https://seu-projeto.railway.app/api/webhooks/pagarme`
   - Eventos: `order.paid`, `subscription.payment_succeeded`, `subscription.canceled`

### Configurar Google OAuth

1. [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Credentials
2. Criar OAuth 2.0 Client ID
3. Authorized redirect URIs: `https://seu-dominio.railway.app/api/auth/callback/google`

## Modelo de Negócio

| Plano | Preço | Tipo |
|-------|-------|------|
| Mensal | R$ 5/mês | Recorrente |
| Anual | R$ 50/ano | Recorrente |
| Vitalício | R$ 100 | Único |

## Sistema de XP e Levels

| Ação | XP |
|------|----|
| Realizar cálculo | +1 XP |
| Sessão de 5 min | +5 XP |
| Login diário | +10 XP |
| Boas-vindas | +20 XP |

| Level | XP necessário | Recompensa |
|-------|--------------|------------|
| 0 | 10 | Skin "Classic Light" |
| 2 | 15 | Skin "Midnight Blue" |
| 4 | 25 | Skin "Forest Matrix" |
| 5 | 30 | Skin "Aurora" |

## Skins disponíveis

| Skin | Tipo | Unlock |
|------|------|--------|
| Classic Dark | Grátis | Padrão |
| Classic Light | Grátis | Level 0 |
| Midnight Blue | Grátis | Level 2 |
| Forest Matrix | Grátis | Level 4 |
| Aurora | Grátis | Level 5 |
| Neon Cyberpunk | Premium | R$ 9,90 |
| Retro Windows 95 | Premium | R$ 7,90 |
| Gold Luxury | Premium | R$ 14,90 |
