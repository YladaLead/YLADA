# 🔍 Diagnóstico: Erros 400 e 500 ao Enviar Mensagem

## 🐛 ERROS IDENTIFICADOS

### **Erro 400 (Bad Request)**
- **Causa:** Requisição malformada ou parâmetros inválidos
- **Possíveis causas:**
  - Número de telefone inválido
  - Mensagem vazia ou muito longa
  - Token ou instanceId incorretos

### **Erro 500 (Internal Server Error)**
- **Causa:** Erro no servidor ao processar a requisição
- **Possíveis causas:**
  - Instância Z-API não encontrada
  - Erro ao salvar no banco
  - Erro na API da Z-API

---

## ✅ VERIFICAÇÕES

### **1. Verificar Logs da Vercel**

Acesse: https://vercel.com → Seu projeto → Logs

Procure por:
- `[WhatsApp Messages] Erro:`
- `[Z-API] Erro ao enviar mensagem:`
- Mensagens de erro específicas

### **2. Verificar Instância no Banco**

```sql
-- Verificar se instância existe e está conectada
SELECT 
  id,
  name,
  instance_id,
  status,
  phone_number
FROM z_api_instances
WHERE instance_id = '3ED484E8415CF126D6009EBD599F8B90';
```

**Deve mostrar:**
- `status = 'connected'` ✅
- `instance_id` correto ✅

### **3. Verificar Conversa no Banco**

```sql
-- Verificar conversa
SELECT 
  id,
  phone,
  instance_id,
  area
FROM whatsapp_conversations
WHERE phone = '17862535032'
ORDER BY created_at DESC
LIMIT 1;
```

**Verificar:**
- `instance_id` não é NULL ✅
- `phone` está correto ✅

### **4. Verificar Token e InstanceId**

Na Vercel, verificar variáveis:
- `Z_API_INSTANCE_ID` = `3ED484E8415CF126D6009EBD599F8B90`
- `Z_API_TOKEN` = `6633B5CACF7FC081FCAC3611`

---

## 🔧 SOLUÇÕES

### **Solução 1: Verificar Formato do Número**

A Z-API precisa do número no formato internacional:
- ✅ Correto: `5517862535032` (55 + DDD + número)
- ❌ Incorreto: `17862535032` (sem código do país)

**Corrigir no código:**
```typescript
// Limpar e formatar número
const cleanPhone = phone.replace(/\D/g, '')
// Se não começar com 55, adicionar
const formattedPhone = cleanPhone.startsWith('55') 
  ? cleanPhone 
  : `55${cleanPhone}`
```

### **Solução 2: Verificar Token**

Se o token estiver incorreto ou expirado:
1. Acesse Z-API dashboard
2. Vá em "Instâncias Web"
3. Copie o token atual
4. Atualize na Vercel

### **Solução 3: Verificar Status da Instância**

Se a instância estiver desconectada:
1. Acesse Z-API dashboard
2. Reconecte a instância
3. Escaneie QR Code novamente

---

## 📋 CHECKLIST

- [ ] Verificar logs da Vercel (erro específico)
- [ ] Verificar se instância está conectada
- [ ] Verificar formato do número de telefone
- [ ] Verificar token na Vercel
- [ ] Verificar se conversa tem `instance_id` válido
- [ ] Testar enviar mensagem novamente

---

## 🧪 TESTE MANUAL

Execute no terminal:

```bash
curl -X POST https://api.z-api.io/instances/3ED484E8415CF126D6009EBD599F8B90/token/6633B5CACF7FC081FCAC3611/send-text \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "5517862535032",
    "message": "Teste manual"
  }'
```

**Se funcionar:** Problema está no código
**Se não funcionar:** Problema está na Z-API ou credenciais

---

**Verifique os logs da Vercel primeiro para ver o erro específico!**
