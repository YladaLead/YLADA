# 🔍 CHECKLIST: Diagnóstico Bot + OpenAI

## 📋 CHECKLIST OBJETIVO

### **1. CONFIGURAÇÃO OPENAI**

- [ ] **API Key configurada:**
  - [ ] Variável `OPENAI_API_KEY` existe no `.env.local` (local)
  - [ ] Variável `OPENAI_API_KEY` existe na Vercel (produção)
  - [ ] API Key está válida (formato: `sk-proj-...` ou `sk-...`)
  - [ ] API Key tem créditos disponíveis

- [ ] **Assistants IDs (se usar Assistants API):**
  - [ ] `OPENAI_ASSISTANT_NOEL_ID` configurado (se usar NOEL)
  - [ ] `OPENAI_ASSISTANT_LYA_ID` configurado (se usar LYA)
  - [ ] IDs estão corretos (formato: `asst_...`)

---

### **2. INTEGRAÇÃO Z-API**

- [ ] **Webhook configurado:**
  - [ ] Webhook "Ao receber" → `https://www.ylada.com/api/webhooks/z-api`
  - [ ] Webhook "Ao enviar" → `https://www.ylada.com/api/webhooks/z-api`
  - [ ] "Notificar as enviadas por mim também" → HABILITADO ✅
  - [ ] URLs não têm espaços em branco antes do `https://`

- [ ] **Instância Z-API:**
  - [ ] Instância está conectada (status: "connected")
  - [ ] Token está válido
  - [ ] Número do WhatsApp está ativo

---

### **3. TESTE DO BOT**

- [ ] **Enviar mensagem de teste:**
  - [ ] Mensagem chega no webhook (ver logs)
  - [ ] Webhook processa mensagem (ver logs)
  - [ ] Bot gera resposta (ver logs)
  - [ ] Resposta é enviada via Z-API (ver logs)
  - [ ] Resposta aparece no WhatsApp

---

### **4. LOGS PARA VERIFICAR**

**No Vercel (logs em tempo real):**

1. **Quando mensagem chega:**
   ```
   [Z-API Webhook] 📥 Payload completo recebido
   [Z-API Webhook] 🎯 Tipo de evento: received
   ```

2. **Quando bot processa:**
   ```
   [NOEL/Carol/LYA] Processando mensagem...
   [OpenAI] Chamando API...
   ```

3. **Se houver erro:**
   ```
   [ERROR] OpenAI API error: ...
   [ERROR] Erro ao gerar resposta: ...
   ```

---

### **5. ERROS COMUNS**

**Erro 1: "API Key não encontrada"**
- ✅ Verificar se `OPENAI_API_KEY` está no `.env.local` e Vercel
- ✅ Verificar se variável está escrita corretamente

**Erro 2: "Invalid API Key"**
- ✅ Verificar se API Key está correta
- ✅ Verificar se API Key não expirou
- ✅ Verificar se tem créditos na conta OpenAI

**Erro 3: "Assistant not found"**
- ✅ Verificar se `OPENAI_ASSISTANT_*_ID` está correto
- ✅ Verificar se Assistant existe na plataforma OpenAI

**Erro 4: "Bot não responde"**
- ✅ Verificar se webhook está configurado
- ✅ Verificar logs do webhook
- ✅ Verificar se mensagem está sendo processada

---

## 📸 PRINTS NECESSÁRIOS

Envie prints de:

1. **Z-API - Webhooks:**
   - Tela de configuração de webhooks
   - Mostrando URLs configuradas

2. **Z-API - Instância:**
   - Status da instância
   - Token (mascarado)

3. **OpenAI - API Keys:**
   - Lista de API Keys
   - Status (ativa/inativa)

4. **OpenAI - Assistants (se usar):**
   - Lista de Assistants
   - IDs dos Assistants

5. **Vercel - Environment Variables:**
   - Variáveis relacionadas a OpenAI
   - Variáveis relacionadas a Z-API

6. **Logs da Vercel:**
   - Quando enviar mensagem de teste
   - Mostrando erros (se houver)

---

## 🧪 TESTE RÁPIDO

### **Passo 1: Enviar Mensagem**
1. Envie uma mensagem pelo WhatsApp para o número do bot
2. Aguarde 5-10 segundos

### **Passo 2: Verificar Logs**
1. Acesse logs da Vercel
2. Procure por:
   - `[Z-API Webhook]` - Mensagem chegou?
   - `[OpenAI]` - Chamou API?
   - `[ERROR]` - Teve erro?

### **Passo 3: Verificar Resposta**
1. Verifique se resposta chegou no WhatsApp
2. Se não chegou, verifique logs para ver onde parou

---

## ✅ PRÓXIMOS PASSOS

Após enviar os prints e informações:

1. ✅ Vou analisar configuração da Z-API
2. ✅ Vou verificar integração OpenAI
3. ✅ Vou identificar onde está o problema
4. ✅ Vou corrigir e testar

---

**Envie os prints e vamos diagnosticar!** 🔍
