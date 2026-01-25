# 🔍 Diagnóstico Completo: Carol Não Funciona

## 📋 CHECKLIST DE VERIFICAÇÃO

### **1. CONFIGURAÇÃO Z-API**

- [ ] **Webhook "Ao receber" configurado:**
  - URL: `https://www.ylada.com/api/webhooks/z-api`
  - Sem espaços antes do `https://`

- [ ] **Webhook "Ao enviar" configurado:**
  - URL: `https://www.ylada.com/api/webhooks/z-api`
  - Sem espaços antes do `https://`
  - "Notificar as enviadas por mim também" → HABILITADO ✅

- [ ] **"Ler mensagens automático" HABILITADO:**
  - Z-API → Instâncias Web → Sua instância → Webhooks
  - Toggle "Ler mensagens automático" → HABILITADO ✅

- [ ] **Instância conectada:**
  - Status: "Conectada" (verde)
  - WhatsApp online

---

### **2. CONFIGURAÇÃO OPENAI**

- [ ] **OPENAI_API_KEY configurada:**
  - No `.env.local` (local)
  - Na Vercel (produção)
  - API Key válida e com créditos

---

### **3. VARIÁVEIS DE AMBIENTE**

- [ ] **Z_API_INSTANCE_ID:** `3ED484E8415CF126D6009EBD599F8B90`
- [ ] **Z_API_TOKEN:** `6633B5CACF7FC081FCAC3611`
- [ ] **Z_API_CLIENT_TOKEN:** `F25db4f38d3bd46bb8810946b9497020aS`
- [ ] **Z_API_BASE_URL:** `https://api.z-api.io`
- [ ] **Z_API_NOTIFICATION_PHONE:** `5519981868000`
- [ ] **OPENAI_API_KEY:** Configurada

**Todas na Vercel (Production, Preview, Development)?**

---

### **4. TESTE COMPLETO**

**Passo 1: Enviar mensagem de teste**
- De outro número (não `5519981868000`)
- Para: `5519997230912`
- Mensagem: "Olá"

**Passo 2: Verificar logs da Vercel**

Procure por esta sequência:

1. **Mensagem chegou?**
   ```
   [Z-API Webhook] 📥 Payload completo recebido
   ```

2. **Conversa criada?**
   ```
   [Z-API Webhook] 💬 Conversa ID: ...
   ```

3. **Mensagem salva?**
   ```
   [Z-API Webhook] ✅ Mensagem salva no banco com sucesso
   ```

4. **Carol iniciou processamento?**
   ```
   [Z-API Webhook] 🤖 Iniciando processamento com Carol...
   [Carol AI] 🚀 Iniciando processamento
   ```

5. **Carol encontrou conversa?**
   ```
   [Carol AI] ✅ Conversa encontrada
   ```

6. **OpenAI chamado?**
   ```
   [Carol AI] 💭 Gerando resposta com contexto
   ```

7. **Resposta gerada?**
   ```
   [Carol AI] ✅ Resposta gerada
   ```

8. **Mensagem enviada?**
   ```
   [Z-API] 📤 Enviando mensagem...
   [Z-API] ✅ Mensagem enviada com sucesso
   ```

---

## 🚨 ERROS COMUNS E SOLUÇÕES

### **Erro 1: "Conversa não encontrada"**
- ✅ **Corrigido:** Retry adicionado
- Verificar se ainda aparece nos logs

### **Erro 2: "column customer_name does not exist"**
- ✅ **Corrigido:** Substituído por `name`
- Verificar se ainda aparece nos logs

### **Erro 3: "OPENAI_API_KEY não configurada"**
- Verificar se está na Vercel
- Verificar se API Key está válida

### **Erro 4: "Ler mensagens automático" desabilitado**
- Habilitar na Z-API

### **Erro 5: Webhook não está sendo chamado**
- Verificar se webhook está configurado
- Verificar se não tem espaços na URL

---

## 🔍 VERIFICAÇÃO NOS LOGS

**Envie os logs mais recentes quando enviar mensagem de teste.**

Procure especificamente por:
- `[Carol AI]` - Todos os logs da Carol
- `[ERROR]` - Todos os erros
- `[Z-API Webhook]` - Logs do webhook

---

## 📊 PRÓXIMOS PASSOS

1. **Verificar checklist acima**
2. **Enviar mensagem de teste**
3. **Copiar logs completos da Vercel**
4. **Enviar logs para análise**

---

**Envie os logs mais recentes para identificar o problema exato!** 🔍
