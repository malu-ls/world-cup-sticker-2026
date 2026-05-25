# Álbum Copa 2026 ⚽

PWA para controle de figurinhas da Copa do Mundo FIFA 2026, com login Google e sincronização via Supabase.

## Stack
- React + Vite + vite-plugin-pwa (instala no celular como app)
- Supabase (banco, auth Google, storage)
- react-router-dom

## Setup em 4 passos

### 1. Criar projeto no Supabase
1. Acesse supabase.com, crie conta e clique em New Project
2. Aguarde ~2 min a inicialização

### 2. Banco de dados
1. No painel: SQL Editor → New Query
2. Cole o conteúdo de `supabase-schema.sql` e clique Run

### 3. Login com Google

**Google Cloud Console:**
1. console.cloud.google.com → APIs & Services → Credentials
2. Create Credentials → OAuth 2.0 Client ID → Web application
3. Authorized redirect URIs: `https://SEU-PROJETO.supabase.co/auth/v1/callback`
4. Copie Client ID e Client Secret

**Supabase:**
1. Authentication → Providers → Google → Ativar
2. Cole Client ID e Client Secret

### 4. Variáveis de ambiente
```bash
cp .env.example .env
```
Edite .env com os valores de Project Settings → API no Supabase:
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

## Rodando

```bash
npm install
npm run dev
```

## Deploy (Vercel)
```bash
npx vercel
```
Adicione as vars de ambiente na Vercel e a URL do deploy em Authentication → URL Configuration no Supabase.

## Estrutura
```
src/
├── lib/
│   ├── supabase.js        # cliente Supabase
│   └── AuthContext.jsx    # contexto de auth global
├── components/
│   └── ProtectedRoute.jsx
├── pages/
│   ├── Login.jsx          # login com Google
│   └── Home.jsx           # álbum (expandido nos próximos passos)
└── styles/
    └── Login.module.css
```
