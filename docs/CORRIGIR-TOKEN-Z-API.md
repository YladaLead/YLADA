# 🔧 Como Corrigir Token Z-API

## 🐛 ERRO IDENTIFICADO

```
Error: your client-token is not configured
```

**Causa:** O token da Z-API está incorreto, expirado ou não está configurado na instância.

---

## ✅ SOLUÇÃO: Atualizar Token no Banco

### **Passo 1: Obter Token Atual da Z-API**

1. Acesse: https://developer.z-api.com.br/
2. Vá em **"Instâncias Web"**
3. Clique na sua instância (`3ED484E8415CF126D6009EBD599F8B90`)
4. Copie o **Token** atual

### **Passo 2: Atualizar Token no Banco**

Execute no Supabase SQL Editor:

```sql
-- Atualizar token da instância
UPDATE z_api_instances
SET 
  token = 'SEU_TOKEN_AQUI',
  updated_at = NOW()
WHERE instance_id = '3ED484E8415CF126D6009EBD599F8B90';

-- Verificar se foi atualizado
SELECT 
  id,
  name,
  instance_id,
  token,
  status,
  updated_at
FROM z_api_instances
WHERE instance_id = '3ED484E8415CF126D6009EBD599F8B90';
```

**Substitua `SEU_TOKEN_AQUI` pelo token copiado da Z-API!**

---

## 🔍 VERIFICAR TOKEN ATUAL

Execute no Supabase:

```sql
SELECT 
  instance_id,
  token,
  LENGTH(token) as token_length,
  status
FROM z_api_instances
WHERE instance_id = '3ED484E8415CF126D6009EBD599F8B90';
```

**Token deve ter:**
- ✅ Comprimento: ~24-32 caracteres
- ✅ Status: `connected`
- ✅ Não deve estar vazio ou NULL

---

## 🧪 TESTAR TOKEN MANUALMENTE

Após atualizar, teste via cURL:

```bash
curl -X POST https://api.z-api.io/instances/3ED484E8415CF126D6009EBD599F8B90/token/SEU_TOKEN_AQUI/send-text \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "5519996049800",
    "message": "Teste token"
  }'
```

**Se funcionar:** Token está correto ✅  
**Se der erro:** Token ainda está incorreto ❌

---

## ⚠️ POSSÍVEIS PROBLEMAS

### **1. Token Expirado**
- Tokens da Z-API podem expirar
- Gerar novo token na dashboard Z-API
- Atualizar no banco

### **2. Instância Desconectada**
- Verificar se instância está conectada na Z-API
- Reconectar se necessário (escanear QR Code)

### **3. Token Incorreto**
- Verificar se copiou token completo
- Verificar se não tem espaços extras
- Verificar se é o token correto da instância

---

## 📋 CHECKLIST

- [ ] Acessar dashboard Z-API
- [ ] Copiar token atual da instância
- [ ] Atualizar token no banco (SQL acima)
- [ ] Verificar se token foi atualizado
- [ ] Testar enviar mensagem novamente
- [ ] Verificar logs da Vercel

---

**Execute o SQL acima substituindo `SEU_TOKEN_AQUI` pelo token real da Z-API!**
