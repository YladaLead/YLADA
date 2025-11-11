# ⚙️ Configuração Completa do Mercado Pago

## 📋 CHECKLIST DE CONFIGURAÇÃO

### ✅ 1. Credenciais (Access Token)

**Onde configurar:**
- Vercel → Settings → Environment Variables
- Adicionar:
  - `MERCADOPAGO_ACCESS_TOKEN_PRODUCTION` (para produção)
  - `MERCADOPAGO_ACCESS_TOKEN_TEST` (para testes, opcional)

**Como obter:**
1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em **"Suas integrações"**
3. Clique na sua aplicação
4. Copie o **"Access Token"** (produção ou teste)

---

### ✅ 2. Webhook URL (OBRIGATÓRIO)

**Onde configurar:**
1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em **"Webhooks"** ou **"Notificações"**
3. Configure a URL de produção:
   ```
   https://www.ylada.com/api/webhooks/mercado-pago
   ```
   Ou:
   ```
   https://ylada.vercel.app/api/webhooks/mercado-pago
   ```

**⚠️ IMPORTANTE:**
- **NÃO configure URL de teste** (deixe vazio) - isso evita conflitos
- Use apenas a URL de produção
- O sistema detecta automaticamente se é teste ou produção via `live_mode`

---

### ✅ 3. External Reference (Já Configurado ✅)

**Status:** ✅ Já está sendo enviado automaticamente

O código já envia `external_reference` no formato:
```
wellness_monthly_temp_portalmagra@gmail.com
```

**Formato:** `{area}_{planType}_{userId}`

**Onde é usado:**
- Criado automaticamente em `src/lib/mercado-pago.ts` (linha 165)
- Criado automaticamente em `src/lib/mercado-pago-subscriptions.ts` (linha 83)

**Não precisa configurar nada manualmente!**

---

### ✅ 4. Metadata (Já Configurado ✅)

**Status:** ✅ Já está sendo enviado automaticamente

O código já envia `metadata` nas assinaturas recorrentes (Preapproval):
```json
{
  "user_id": "temp_portalmagra@gmail.com",
  "area": "wellness",
  "plan_type": "monthly"
}
```

**Onde é usado:**
- Criado automaticamente em `src/lib/mercado-pago-subscriptions.ts` (linhas 97-101)

**Não precisa configurar nada manualmente!**

---

### ✅ 5. Payer Information (Já Configurado ✅)

**Status:** ✅ Já está sendo enviado automaticamente

O código já envia informações do pagador:
- `payer.email` (obrigatório)
- `payer.first_name` (recomendado - melhora aprovação)
- `payer.last_name` (recomendado - melhora aprovação)

**Onde é usado:**
- Criado automaticamente em `src/lib/mercado-pago.ts` (linhas 95-120)

**Não precisa configurar nada manualmente!**

---

### ✅ 6. Item Information (Já Configurado ✅)

**Status:** ✅ Já está sendo enviado automaticamente

O código já envia informações completas do item:
- `items.id` (obrigatório)
- `items.title` (recomendado)
- `items.description` (recomendado)
- `items.category_id` (recomendado)
- `items.quantity` (recomendado)
- `items.unit_price` (obrigatório)

**Onde é usado:**
- Criado automaticamente em `src/lib/mercado-pago.ts` (linhas 122-140)

**Não precisa configurar nada manualmente!**

---

## 🎯 O QUE VERIFICAR NO MERCADO PAGO

### 1. Verificar se Webhook está Configurado

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em **"Webhooks"** ou **"Notificações"**
3. Verifique se há uma URL configurada
4. **Deixe a URL de teste vazia** (se houver)

---

### 2. Verificar Histórico de Notificações

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em **"Webhooks"** ou **"Notificações"**
3. Veja o histórico de notificações
4. Verifique se há tentativas de notificação
5. Verifique o status (200 = sucesso, 500 = erro)

---

### 3. Verificar Qualidade da Integração

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em **"Qualidade da integração"**
3. Verifique a pontuação (deve ser 100/100)
4. Veja se há ações pendentes

**Se aparecer 100/100:** ✅ Tudo configurado corretamente!

---

## ⚠️ PROBLEMAS COMUNS

### ❌ Webhook não está sendo chamado

**Sintomas:**
- Nenhuma invocação aparece no Vercel
- Histórico de notificações no Mercado Pago está vazio

**Solução:**
1. Verificar se a URL do webhook está correta
2. Verificar se a URL está acessível (não bloqueada por firewall)
3. Verificar se o deploy no Vercel foi concluído

---

### ❌ Webhook retorna 500

**Sintomas:**
- Webhook é chamado, mas retorna erro 500
- Logs no Vercel mostram erros

**Solução:**
1. Verificar logs do Vercel para ver o erro específico
2. Verificar se as credenciais (Access Token) estão corretas
3. Verificar se o código foi deployado corretamente

---

### ❌ Dados não estão chegando no webhook

**Sintomas:**
- Webhook é chamado, mas `metadata`, `external_reference`, `payer` estão vazios

**Solução:**
- ✅ **JÁ CORRIGIDO!** O código agora busca dados completos via API
- Não precisa fazer nada - o código já faz isso automaticamente

---

## 📝 RESUMO

### ✅ **Já está configurado automaticamente:**
- External Reference
- Metadata (para assinaturas)
- Payer Information
- Item Information

### ⚙️ **Você precisa configurar manualmente:**
1. **Access Token** (se ainda não configurou)
2. **Webhook URL** (se ainda não configurou)

### 🔍 **Para verificar:**
1. Webhook está configurado?
2. Histórico de notificações mostra tentativas?
3. Qualidade da integração está em 100/100?

---

**Última atualização:** 11/11/2025

