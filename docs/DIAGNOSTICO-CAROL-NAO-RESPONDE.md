# 🔍 Diagnóstico: Carol Não Responde + Mensagens Não Aparecem

## 🚨 PROBLEMAS REPORTADOS

1. **Carol não responde automaticamente** quando pessoa envia mensagem
2. **Mensagens enviadas pelo usuário não aparecem** na plataforma administrativa

---

## ✅ CORREÇÕES IMPLEMENTADAS

### **1. Logs Melhorados**
- ✅ Logs detalhados em cada etapa do processamento
- ✅ Verificação de API Key do OpenAI
- ✅ Logs de erros específicos

### **2. Detecção de Mensagens Enviadas Melhorada**
- ✅ Mais campos verificados para detectar mensagens enviadas
- ✅ Verificação de `type === 'send'` ou `type === 'sent'`
- ✅ Verificação de campo `to` (mensagem enviada tem `to`, recebida tem `from`)

### **3. Teste de Carol**
- ✅ Endpoint de teste: `/api/admin/whatsapp/test-carol`
- ✅ Interface de teste em `/admin/whatsapp/carol`

---

## 🔧 VERIFICAÇÕES NECESSÁRIAS

### **1. Verificar OpenAI API Key**

**No `.env.local`:**
```bash
OPENAI_API_KEY=sk-proj-...
```

**Testar:**
1. Acesse `/admin/whatsapp/carol`
2. Use a seção "🧪 Testar Carol"
3. Cole o ID de uma conversa
4. Digite uma mensagem de teste
5. Clique em "Testar Carol"
6. Veja se aparece erro de API Key

---

### **2. Verificar Webhook "Ao Enviar" na Z-API**

**CRÍTICO:** Para mensagens enviadas aparecerem, o webhook "Ao enviar" precisa estar configurado.

**Como configurar:**
1. Acesse painel da Z-API
2. Vá em: **Webhooks** → **"Ao enviar"**
3. Configure URL: `https://seu-dominio.com/api/webhooks/z-api`
4. Salve

**Como verificar se está funcionando:**
1. Envie uma mensagem pelo WhatsApp Web ou telefone
2. Veja logs da Vercel (Functions → `/api/webhooks/z-api`)
3. Procure por: `[Z-API Webhook] 📥 Payload completo recebido`
4. Se aparecer, webhook está funcionando
5. Se não aparecer, webhook não está configurado

---

### **3. Verificar Logs da Vercel**

**Passos:**
1. Acesse: https://vercel.com
2. Vá em: **Deployments** → Último deploy
3. Vá em: **Functions** → `/api/webhooks/z-api`
4. Veja logs em tempo real

**O que procurar:**

**Se Carol não responde:**
```
[Z-API Webhook] 🤖 Iniciando processamento com Carol...
[Carol AI] 🚀 Iniciando processamento: ...
[Carol AI] ❌ OPENAI_API_KEY não configurada
```
→ **Solução:** Adicionar API Key no `.env.local` e Vercel

**Se mensagens não aparecem:**
```
[Z-API Webhook] 🔍 Detecção de mensagem enviada: { isFromUs: false, ... }
```
→ **Solução:** Verificar se webhook "Ao enviar" está configurado

---

## 🧪 TESTE PASSO A PASSO

### **Teste 1: Verificar se Carol Responde**

1. Acesse `/admin/whatsapp/carol`
2. Use "🧪 Testar Carol"
3. Cole ID de uma conversa real
4. Digite: "Olá, quero agendar uma aula"
5. Clique em "Testar Carol"
6. **Resultado esperado:**
   - ✅ Sucesso: Mostra resposta da Carol
   - ❌ Erro: Mostra erro específico

### **Teste 2: Verificar Mensagens Enviadas**

1. Envie uma mensagem pelo WhatsApp Web para um número de teste
2. Aguarde 10 segundos
3. Acesse `/admin/whatsapp`
4. Abra a conversa
5. **Resultado esperado:**
   - ✅ Sucesso: Mensagem aparece como enviada por "Telefone"
   - ❌ Erro: Mensagem não aparece

### **Teste 3: Verificar Resposta Automática**

1. Envie uma mensagem de teste do WhatsApp para o número
2. Aguarde 10-15 segundos
3. Verifique se Carol respondeu automaticamente
4. **Resultado esperado:**
   - ✅ Sucesso: Carol responde automaticamente
   - ❌ Erro: Nenhuma resposta

---

## 📊 VERIFICAR NO BANCO DE DADOS

Execute no Supabase:

```sql
-- Ver últimas mensagens da Carol
SELECT 
  id,
  created_at,
  sender_type,
  sender_name,
  message,
  is_bot_response
FROM whatsapp_messages
WHERE sender_name = 'Carol - Secretária'
ORDER BY created_at DESC
LIMIT 10;
```

**Se não aparecer mensagens:**
- Carol não está respondendo
- Verificar logs para erro específico

```sql
-- Ver mensagens enviadas pelo agente
SELECT 
  id,
  created_at,
  sender_type,
  sender_name,
  message
FROM whatsapp_messages
WHERE sender_type = 'agent'
ORDER BY created_at DESC
LIMIT 10;
```

**Se não aparecer mensagens:**
- Webhook "Ao enviar" não está configurado
- Ou detecção de `isFromUs` não está funcionando

---

## 🔧 SOLUÇÕES POR PROBLEMA

### **Problema 1: Carol Não Responde**

**Causas possíveis:**
1. ❌ API Key não configurada
2. ❌ Erro na chamada OpenAI
3. ❌ Conversa não encontrada

**Soluções:**
1. Verificar `.env.local` tem `OPENAI_API_KEY`
2. Verificar Vercel tem `OPENAI_API_KEY` nas Environment Variables
3. Testar com endpoint de teste
4. Ver logs da Vercel para erro específico

---

### **Problema 2: Mensagens Enviadas Não Aparecem**

**Causas possíveis:**
1. ❌ Webhook "Ao enviar" não configurado na Z-API
2. ❌ Detecção de `isFromUs` não está funcionando
3. ❌ Mensagem não está sendo salva no banco

**Soluções:**
1. **Configurar webhook "Ao enviar" na Z-API:**
   - URL: `https://seu-dominio.com/api/webhooks/z-api`
   - Evento: "Ao enviar"
2. **Verificar logs:**
   - Se não aparecer log, webhook não está configurado
   - Se aparecer mas `isFromUs = false`, problema na detecção
3. **Verificar payload:**
   - Ver logs completos do payload
   - Adicionar mais campos na detecção se necessário

---

## ✅ CHECKLIST DE VERIFICAÇÃO

- [ ] `OPENAI_API_KEY` configurada no `.env.local`
- [ ] `OPENAI_API_KEY` configurada na Vercel (Environment Variables)
- [ ] Webhook "Ao enviar" configurado na Z-API
- [ ] Teste de Carol funciona (`/admin/whatsapp/carol`)
- [ ] Logs da Vercel mostram processamento
- [ ] Mensagens enviadas aparecem no banco
- [ ] Carol responde automaticamente

---

## 🆘 SE AINDA NÃO FUNCIONAR

1. **Ver logs completos da Vercel**
2. **Testar com endpoint de teste**
3. **Verificar payload completo do webhook**
4. **Verificar se webhook está sendo chamado**

Envie os logs para diagnóstico mais preciso.
