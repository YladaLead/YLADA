# 📧 Como Ver E-mails e Páginas Criadas

## 📧 COMO VER OS E-MAILS

### 1. No Painel do Resend (Recomendado)

1. Acesse: https://resend.com/emails
2. Faça login na sua conta
3. Você verá todos os e-mails enviados:
   - ✅ Status (entregue, falhou, etc.)
   - ✅ Destinatário
   - ✅ Assunto
   - ✅ Data/hora
   - ✅ Preview do conteúdo

**Vantagens:**
- Visualização completa de todos os e-mails
- Status de entrega
- Logs de erros (se houver)
- Métricas de envio

### 2. Nos Logs do Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto `ylada-app`
3. Vá em **Deployments** → Clique no último deploy
4. Vá em **Functions** → Procure por `/api/webhooks/mercado-pago`
5. Veja os logs:
   ```
   ✅ E-mail de boas-vindas enviado: email@exemplo.com
   ✅ Token de acesso criado: ...
   ```

### 3. Nos Logs do Supabase

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Logs** → **API Logs**
4. Procure por queries relacionadas a `access_tokens` e `subscriptions`

### 4. No Console do Navegador (Desenvolvimento)

1. Abra o DevTools (F12)
2. Vá em **Console**
3. Após um pagamento, você verá:
   ```
   ✅ E-mail de boas-vindas enviado: email@exemplo.com
   ```

---

## 📄 COMO VER AS PÁGINAS CRIADAS

### ⚠️ IMPORTANTE: Páginas Frontend Ainda Não Foram Criadas

Atualmente, apenas a **estrutura backend** foi implementada:

✅ **O que JÁ existe:**
- APIs de backend (`/api/email/send-access-link`, `/api/auth/access-token`)
- Sistema de tokens
- Templates de e-mail
- Integração no webhook

❌ **O que AINDA NÃO existe:**
- Página de recuperação de acesso (`/pt/wellness/recuperar-acesso`)
- Página de acesso por token (`/pt/wellness/acesso?token=xxx`)
- Botão de reenvio na página de sucesso

### 📍 Onde Ver o que Existe

#### 1. APIs Criadas

**Enviar link de recuperação:**
```
POST /api/email/send-access-link
Body: { "email": "usuario@exemplo.com" }
```

**Validar token:**
```
POST /api/auth/access-token
Body: { "token": "token_aqui" }
```

**Testar via Postman/Insomnia:**
1. Faça uma requisição POST para essas URLs
2. Veja a resposta JSON

#### 2. Templates de E-mail

**Localização:** `src/lib/email-templates.ts`

**Funções:**
- `sendWelcomeEmail()` - E-mail de boas-vindas
- `sendRecoveryEmail()` - E-mail de recuperação
- `sendRenewalReminder()` - Lembrete de renovação

**Como ver:**
- Abra o arquivo no editor
- Veja o HTML dos templates

#### 3. Sistema de Tokens

**Localização:** `src/lib/email-tokens.ts`

**Funções:**
- `createAccessToken()` - Criar token
- `validateAndUseAccessToken()` - Validar token
- `cleanupExpiredTokens()` - Limpar tokens expirados

---

## 🧪 COMO TESTAR OS E-MAILS

### Teste 1: Fazer um Pagamento

1. Acesse: `https://www.ylada.com/pt/wellness/checkout`
2. Faça um pagamento de teste
3. Após confirmação, verifique seu e-mail
4. Você deve receber o e-mail de boas-vindas

### Teste 2: Verificar no Resend

1. Acesse: https://resend.com/emails
2. Procure pelo e-mail enviado
3. Veja o status e preview

### Teste 3: Testar API de Recuperação

```bash
curl -X POST https://www.ylada.com/api/email/send-access-link \
  -H "Content-Type: application/json" \
  -d '{"email": "seu-email@exemplo.com"}'
```

---

## 📊 ONDE VER OS DADOS NO BANCO

### 1. Tabela `access_tokens`

**No Supabase SQL Editor:**
```sql
SELECT * FROM access_tokens 
ORDER BY created_at DESC 
LIMIT 10;
```

**O que ver:**
- Tokens criados
- Usuários associados
- Datas de expiração
- Status de uso

### 2. Tabela `subscriptions`

**No Supabase SQL Editor:**
```sql
SELECT 
  id,
  user_id,
  area,
  plan_type,
  status,
  welcome_email_sent,
  welcome_email_sent_at,
  created_at
FROM subscriptions 
WHERE welcome_email_sent = true
ORDER BY welcome_email_sent_at DESC
LIMIT 10;
```

**O que ver:**
- Assinaturas que receberam e-mail
- Quando o e-mail foi enviado
- Status da assinatura

---

## 🚀 PRÓXIMOS PASSOS

### Para Criar as Páginas Frontend:

1. **Página de Recuperação** (`/pt/wellness/recuperar-acesso`)
   - Formulário para inserir e-mail
   - Botão "Enviar link de acesso"
   - Mensagem de confirmação

2. **Página de Acesso por Token** (`/pt/wellness/acesso?token=xxx`)
   - Validar token na URL
   - Fazer login automático
   - Redirecionar para dashboard

3. **Atualizar Página de Sucesso**
   - Adicionar mensagem sobre e-mail enviado
   - Botão "Reenviar e-mail"
   - Link para recuperação

**Quer que eu crie essas páginas agora?** 🚀

---

## 📞 SUPORTE

- **Resend Dashboard:** https://resend.com/emails
- **Vercel Logs:** https://vercel.com/dashboard
- **Supabase Logs:** https://supabase.com/dashboard

---

**Resumo:** 
- ✅ E-mails: Veja no Resend Dashboard
- ✅ APIs: Teste via Postman/Insomnia
- ❌ Páginas: Ainda não criadas (precisam ser implementadas)

