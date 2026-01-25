# 🔍 Como Verificar Sistema de Resposta da Carol

## 📋 FORMAS DE VERIFICAR

### **1. TESTE DIRETO NO WHATSAPP** (Mais Simples)

**Como fazer:**
1. Envie mensagem de outro número para: `5519997230912`
2. Aguarde resposta automática da Carol
3. Continue a conversa testando diferentes perguntas

**O que verificar:**
- ✅ Carol responde automaticamente?
- ✅ Respostas fazem sentido?
- ✅ Não repete informações?
- ✅ Oferece opções de aula quando apropriado?

---

### **2. VERIFICAR LOGS DA VERCEL** (Mais Técnico)

**Como fazer:**
1. Acesse: https://vercel.com → Seu projeto → Logs
2. Envie mensagem de teste
3. Procure por logs com `[Carol AI]`

**O que procurar:**
```
[Carol AI] 🚀 Iniciando processamento
[Carol AI] ✅ Conversa encontrada
[Carol AI] 💭 Gerando resposta com contexto
[Carol AI] ✅ Resposta gerada
[Carol AI] 📤 Enviando resposta via Z-API
[Carol AI] 📤 Resultado do envio: { success: true }
```

**Se aparecer erro:**
- `[Carol AI] ❌` → Ver qual erro específico

---

### **3. TESTE PELA INTERFACE ADMIN** (Mais Controle)

**Como fazer:**
1. Acesse: `/admin/whatsapp`
2. Selecione uma conversa
3. Use o campo "Testar Carol" (se disponível)
4. Ou envie mensagem manualmente e veja se Carol responde

**O que verificar:**
- ✅ Mensagens aparecem na interface?
- ✅ Carol responde automaticamente?
- ✅ Histórico está completo?

---

### **4. VERIFICAR NO BANCO DE DADOS** (Mais Completo)

**Como fazer:**
Execute no Supabase SQL Editor:

```sql
-- Ver últimas mensagens da Carol
SELECT 
  id,
  created_at,
  sender_type,
  sender_name,
  message,
  conversation_id
FROM whatsapp_messages
WHERE sender_type = 'bot'
  AND sender_name = 'Carol - Secretária'
ORDER BY created_at DESC
LIMIT 20;
```

**O que verificar:**
- ✅ Mensagens estão sendo salvas?
- ✅ `sender_type = 'bot'`?
- ✅ `sender_name = 'Carol - Secretária'`?

---

### **5. VERIFICAR CONVERSAS E CONTEXTO**

**Como fazer:**
```sql
-- Ver conversas com contexto
SELECT 
  id,
  phone,
  name,
  context,
  last_message_at,
  total_messages
FROM whatsapp_conversations
WHERE area = 'nutri'
ORDER BY last_message_at DESC
LIMIT 10;
```

**O que verificar:**
- ✅ `context` tem tags corretas?
- ✅ `total_messages` está atualizado?
- ✅ `last_message_at` está atualizado?

---

## 🧪 TESTE COMPLETO - PASSO A PASSO

### **Teste 1: Primeira Mensagem**
1. Envie: "Olá"
2. **Esperado:** Carol se apresenta e oferece ajuda

### **Teste 2: Pergunta sobre Aula**
1. Envie: "Quero saber mais sobre a aula"
2. **Esperado:** Carol explica a aula e oferece opções de dias/horários

### **Teste 3: Continuidade**
1. Envie: "Quero sim"
2. **Esperado:** Carol envia opções de dias/horários (sem repetir explicação)

### **Teste 4: Reagendamento**
1. Envie: "Quero reagendar"
2. **Esperado:** Carol oferece novas opções

---

## 📊 ONDE VERIFICAR CADA COISA

| O que verificar | Onde verificar |
|---|---|
| Carol responde? | WhatsApp ou Interface Admin |
| Respostas corretas? | WhatsApp (conversa real) |
| Mensagens salvas? | Banco de dados (`whatsapp_messages`) |
| Contexto correto? | Banco de dados (`whatsapp_conversations.context`) |
| Erros? | Logs da Vercel |
| Histórico usado? | Logs da Vercel (`[Carol AI] 📜 Histórico`) |

---

## 🔍 VERIFICAÇÃO RÁPIDA

**Teste em 30 segundos:**
1. Envie: "Olá" para `5519997230912`
2. Aguarde 10 segundos
3. Verifique se Carol respondeu

**Se não responder:**
- Verificar logs da Vercel
- Verificar se "Ler mensagens automático" está habilitado
- Verificar se `OPENAI_API_KEY` está configurada

---

**Resumo: Teste pelo WhatsApp e verifique logs da Vercel para diagnóstico completo!** ✅
