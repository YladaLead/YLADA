# 🔍 Passo a Passo: Diagnosticar Mensagem que Não Aparece

## ✅ CHECKLIST RÁPIDO

Execute estes passos na ordem:

---

## **PASSO 1: Verificar se Mensagem Chegou no Banco**

Execute no Supabase SQL Editor:

```sql
-- Ver últimas mensagens
SELECT 
  id,
  message,
  sender_phone,
  created_at
FROM whatsapp_messages
ORDER BY created_at DESC
LIMIT 5;
```

**Resultado:**
- ✅ **Se aparecer sua mensagem:** Webhook funcionou! Problema é na interface.
- ❌ **Se não aparecer:** Webhook não está recebendo ou não está salvando.

---

## **PASSO 2: Verificar se Conversa Foi Criada**

```sql
-- Ver últimas conversas
SELECT 
  id,
  phone,
  name,
  area,
  total_messages,
  last_message_at
FROM whatsapp_conversations
ORDER BY created_at DESC
LIMIT 5;
```

**Resultado:**
- ✅ **Se aparecer:** Conversa foi criada.
- ❌ **Se não aparecer:** Webhook não está criando conversa.

---

## **PASSO 3: Verificar Logs da Vercel**

1. Acesse: https://vercel.com/dashboard
2. Vá em **Deployments** → Último deploy
3. Clique em **Functions** → `/api/webhooks/z-api`
4. Procure por:
   - `[Z-API Webhook] Mensagem recebida` ✅
   - `[Z-API Webhook] Erro:` ❌
   - Qualquer linha em vermelho ❌

**O que procurar:**
- Se aparecer "Mensagem recebida" → Webhook está funcionando
- Se aparecer erro → Copie o erro e me envie

---

## **PASSO 4: Testar Webhook Manualmente**

Execute no terminal (ou Postman):

```bash
curl -X POST https://www.ylada.com/api/webhooks/z-api \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "5511999999999",
    "message": "Teste manual - verificar se salva",
    "name": "Teste",
    "instanceId": "3ED484E8415CF126D6009EBD599F8B90"
  }'
```

**Resultado esperado:**
```json
{"received": true, "conversationId": "..."}
```

**Depois verificar no banco:**
```sql
SELECT * FROM whatsapp_messages 
WHERE message LIKE '%Teste manual%'
ORDER BY created_at DESC 
LIMIT 1;
```

---

## **PASSO 5: Verificar Webhook na Z-API**

1. Acesse sua instância na Z-API
2. Vá em **Webhooks**
3. Verifique se está configurado:
   - URL: `https://www.ylada.com/api/webhooks/z-api`
   - Status: Ativo/Conectado
4. Verifique se há logs de chamadas do webhook

---

## 🐛 PROBLEMAS COMUNS E SOLUÇÕES

### **Problema 1: Mensagem não aparece no banco**

**Possíveis causas:**
- Webhook não está configurado na Z-API
- Webhook está com URL incorreta
- Instância desconectada na Z-API
- Erro ao salvar no banco

**Solução:**
1. Verificar webhook na Z-API
2. Testar webhook manualmente (Passo 4)
3. Verificar logs da Vercel
4. Verificar se migration foi executada

---

### **Problema 2: Mensagem aparece no banco mas não na interface**

**Possíveis causas:**
- Erro de autenticação (não é admin)
- Erro na API `/api/whatsapp/conversations`
- Filtro de área bloqueando

**Solução:**
1. Abrir console do navegador (F12)
2. Verificar erros na aba Console
3. Verificar Network → `/api/whatsapp/conversations`
4. Verificar se está logado como admin

---

### **Problema 3: Webhook retorna erro 500**

**Possíveis causas:**
- Migration não executada
- Instância não cadastrada no banco
- Erro no código

**Solução:**
1. Executar migration `178-criar-tabelas-whatsapp-z-api.sql`
2. Verificar se instância está cadastrada
3. Verificar logs da Vercel para erro específico

---

## 📋 RESUMO DO DIAGNÓSTICO

Execute na ordem:

1. ✅ **Verificar banco** (SQL acima)
2. ✅ **Verificar logs Vercel**
3. ✅ **Testar webhook manualmente**
4. ✅ **Verificar webhook na Z-API**
5. ✅ **Verificar console do navegador**

---

**Me envie os resultados de cada passo para eu ajudar a resolver!**
