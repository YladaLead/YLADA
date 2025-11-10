# ✅ Checklist: Antes de Testar Pagamento Real

## 🎯 Objetivo
Verificar se tudo está configurado corretamente antes de fazer um pagamento real de teste.

---

## 📋 CHECKLIST COMPLETA

### 1. ✅ Scripts SQL Executados no Supabase

**Arquivo:** `scripts/CHECKOUT-SEM-AUTENTICACAO.sql`

**Como verificar:**
1. Acesse Supabase Dashboard → SQL Editor
2. Execute o script `scripts/CHECKOUT-SEM-AUTENTICACAO.sql`
3. Verifique se não houve erros

**O que o script cria:**
- ✅ Tabela `access_tokens` (para links de acesso por e-mail)
- ✅ Campos `welcome_email_sent` e `welcome_email_sent_at` na tabela `subscriptions`

**Como confirmar que funcionou:**
```sql
-- Verificar se a tabela access_tokens existe
SELECT * FROM access_tokens LIMIT 1;

-- Verificar se os campos foram adicionados
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'subscriptions' 
AND column_name IN ('welcome_email_sent', 'welcome_email_sent_at');
```

---

### 2. ✅ Variáveis de Ambiente Configuradas

#### 2.1 No `.env.local` (Desenvolvimento)

Verifique se estas variáveis estão configuradas:

```env
# Resend (E-mail)
RESEND_API_KEY=re_xxxxxxxxxxxxx  # ⚠️ Sua API Key real do Resend
RESEND_FROM_EMAIL=noreply@ylada.com
RESEND_FROM_NAME=YLADA

# URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL_PRODUCTION=https://www.ylada.com  # ⚠️ Sua URL de produção

# Mercado Pago (PRODUÇÃO)
MERCADOPAGO_ACCESS_TOKEN_LIVE=APP_USR-xxxxxxxxxxxxx  # ⚠️ Token de PRODUÇÃO
MERCADOPAGO_PUBLIC_KEY_LIVE=APP_USR-xxxxxxxxxxxxx     # ⚠️ Public Key de PRODUÇÃO
MERCADOPAGO_WEBHOOK_SECRET_LIVE=xxxxxxxxxxxxx        # ⚠️ Webhook Secret de PRODUÇÃO
```

**⚠️ IMPORTANTE:**
- Use credenciais de **PRODUÇÃO** do Mercado Pago (não TEST)
- Use API Key **real** do Resend (não placeholder)

#### 2.2 No Vercel (Produção)

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto `ylada-app`
3. Vá em **Settings** → **Environment Variables**
4. Verifique se estas variáveis estão configuradas:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `RESEND_FROM_NAME`
   - `NEXT_PUBLIC_APP_URL_PRODUCTION`
   - `MERCADOPAGO_ACCESS_TOKEN_LIVE`
   - `MERCADOPAGO_PUBLIC_KEY_LIVE`
   - `MERCADOPAGO_WEBHOOK_SECRET_LIVE`

**⚠️ IMPORTANTE:**
- Após adicionar/atualizar variáveis, faça um **novo deploy**
- Variáveis de ambiente só são aplicadas em novos deploys

---

### 3. ✅ Webhook do Mercado Pago Configurado

**URL do Webhook:** `https://www.ylada.com/api/webhooks/mercado-pago`

**Como configurar:**
1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em **Webhooks**
3. Adicione a URL: `https://www.ylada.com/api/webhooks/mercado-pago`
4. Eventos a escutar:
   - ✅ `payment`
   - ✅ `merchant_order`
   - ✅ `subscription` / `preapproval`
5. Copie o **Webhook Secret** e adicione em `MERCADOPAGO_WEBHOOK_SECRET_LIVE`

**Como testar:**
- O webhook será chamado automaticamente após um pagamento
- Verifique os logs no Vercel para confirmar que está recebendo eventos

---

### 4. ✅ Domínio do Resend Verificado (Opcional mas Recomendado)

**Por que verificar:**
- E-mails têm melhor entrega
- Evita spam
- Aumenta confiança

**Como verificar:**
1. Acesse: https://resend.com/domains
2. Adicione o domínio `ylada.com`
3. Adicione os registros DNS fornecidos
4. Aguarde verificação (1-48h)

**Alternativa temporária:**
- Usar `onboarding@resend.dev` para testes
- **NÃO usar em produção** - apenas para desenvolvimento

---

### 5. ✅ Deploy Atualizado no Vercel

**Verificar:**
1. Último deploy foi feito **após** adicionar as variáveis de ambiente
2. Deploy está em **produção** (não preview)
3. Não há erros no build

**Como fazer novo deploy:**
```bash
git push origin main
# Vercel fará deploy automaticamente
```

---

## 🧪 TESTE SUGERIDO

### Teste Completo do Fluxo:

1. **Acesse a página de checkout:**
   - URL: `https://www.ylada.com/pt/wellness/checkout`
   - Selecione **Plano Anual**

2. **Preencha o e-mail** (se não estiver logado)

3. **Clique em "Continuar para Pagamento"**

4. **No Mercado Pago:**
   - Use um cartão de teste do Mercado Pago
   - Ou use seu cartão real (será cobrado!)
   - Preencha os dados do cartão
   - **Verifique se o parcelamento aparece** (12x de R$ 47,90)

5. **Após pagamento:**
   - Você será redirecionado para `/pt/wellness/pagamento-sucesso`
   - Verifique se a página carrega corretamente

6. **Verificar e-mail:**
   - Verifique sua caixa de entrada
   - Deve receber e-mail de boas-vindas com link de acesso
   - Clique no link e verifique se acessa o dashboard

7. **Verificar no Supabase:**
   ```sql
   -- Verificar se usuário foi criado
   SELECT * FROM auth.users ORDER BY created_at DESC LIMIT 1;
   
   -- Verificar se perfil foi criado
   SELECT * FROM user_profiles ORDER BY created_at DESC LIMIT 1;
   
   -- Verificar se subscription foi criada
   SELECT * FROM subscriptions ORDER BY created_at DESC LIMIT 1;
   
   -- Verificar se token de acesso foi criado
   SELECT * FROM access_tokens ORDER BY created_at DESC LIMIT 1;
   ```

---

## ⚠️ O QUE PODE DAR ERRADO

### ❌ E-mail não foi enviado
**Possíveis causas:**
- `RESEND_API_KEY` não configurada ou inválida
- Domínio não verificado (usar `onboarding@resend.dev` temporariamente)
- Verificar logs do Resend: https://resend.com/emails

### ❌ Usuário não foi criado automaticamente
**Possíveis causas:**
- Webhook não está recebendo eventos
- Verificar logs no Vercel: Functions → Logs
- Verificar se `MERCADOPAGO_WEBHOOK_SECRET_LIVE` está correto

### ❌ Parcelamento não aparece
**Possíveis causas:**
- Valor muito baixo para parcelamento
- Cartão não permite parcelamento
- Configuração no painel do Mercado Pago

### ❌ Erro ao criar subscription
**Possíveis causas:**
- Tabela `subscriptions` não existe ou está com schema incorreto
- Verificar logs do webhook no Vercel

---

## ✅ PRONTO PARA TESTAR?

Marque cada item:

- [ ] Scripts SQL executados no Supabase
- [ ] Variáveis de ambiente configuradas no `.env.local`
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Webhook do Mercado Pago configurado
- [ ] Deploy atualizado no Vercel
- [ ] Domínio do Resend verificado (opcional)

**Se todos os itens estão marcados, você pode fazer o teste!** 🚀

---

## 📞 SUPORTE

Se algo der errado:
1. Verifique os logs no Vercel
2. Verifique os logs do Resend
3. Verifique os logs do Mercado Pago
4. Verifique o console do navegador (F12)

