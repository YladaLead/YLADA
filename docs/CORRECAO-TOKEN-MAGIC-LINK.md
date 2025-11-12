# 🔧 Correção: Token Magic Link não reconhecido

## 🐛 Problema Identificado

O Supabase estava gerando magic links que apontavam para `/auth/v1/verify` no domínio do Supabase, causando erro "Página não encontrada" quando o usuário clicava no link.

**URL problemática:**
```
https://www.ylada.com/auth/v1/verify?token=...&type=magiclink&redirect_to=...
```

## ✅ Solução Implementada

### 1. **Criada rota `/auth/v1/verify`**
- Intercepta magic links do Supabase
- Processa o token e cria sessão
- Redireciona para a página correta

**Arquivo:** `src/app/auth/v1/verify/route.ts`

### 2. **Melhorado callback `/auth/callback`**
- Agora aceita tanto `code` quanto `token` como parâmetro
- Melhor tratamento de erros

**Arquivo:** `src/app/auth/callback/route.ts`

### 3. **Correção de URLs no API**
- Detecta e corrige URLs que apontam para domínio do Supabase
- Substitui localhost por URL de produção
- Garante que magic links usem nosso domínio

**Arquivo:** `src/app/api/auth/access-token/route.ts`

## 🔍 Como Funciona Agora

1. **Usuário migrado entra com email** → `/migrado`
2. **Sistema valida token** → `/api/auth/access-token`
3. **Gera magic link** → Supabase retorna `action_link`
4. **Corrige URL** → Substitui domínio do Supabase/localhost pelo nosso
5. **Usuário clica no link** → Vai para `/auth/v1/verify` ou `/auth/callback`
6. **Cria sessão** → Troca token por sessão
7. **Redireciona** → Dashboard ou página configurada

## 📋 Verificações Necessárias

### No Supabase Dashboard:

1. **Authentication → URL Configuration**
   - Site URL: `https://www.ylada.com`
   - Redirect URLs devem incluir:
     - `https://www.ylada.com/auth/callback`
     - `https://www.ylada.com/auth/v1/verify` ⬅️ **NOVO**

### No Vercel:

1. **Environment Variables**
   - `NEXT_PUBLIC_APP_URL_PRODUCTION=https://www.ylada.com`

## ✅ Teste

1. Acesse `/migrado`
2. Digite um email de usuário migrado
3. Clique no link recebido
4. Deve redirecionar para o dashboard sem erro

## 🚨 Se Ainda Não Funcionar

1. Verifique logs do Vercel (Function Logs)
2. Verifique console do navegador (F12)
3. Confirme que a rota `/auth/v1/verify` está acessível
4. Verifique se o token está sendo gerado corretamente

