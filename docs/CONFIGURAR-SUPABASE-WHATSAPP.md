# 🔧 Configurar Supabase para WhatsApp e Carol

## ✅ O QUE PRECISA ESTAR NO SUPABASE

### **1. Tabelas Criadas** (Migrations)

As tabelas já devem estar criadas pela migration `178-criar-tabelas-whatsapp-z-api.sql`:

- ✅ `z_api_instances` - Instâncias Z-API configuradas
- ✅ `whatsapp_conversations` - Conversas WhatsApp
- ✅ `whatsapp_messages` - Mensagens individuais
- ✅ `whatsapp_workshop_sessions` - Sessões do workshop
- ✅ `whatsapp_notification_rules` - Regras de notificação

**Se não estiverem criadas, execute a migration no Supabase SQL Editor.**

---

## 🔑 **2. INSTÂNCIA Z-API CADASTRADA** (OBRIGATÓRIO)

A instância Z-API **DEVE** estar cadastrada na tabela `z_api_instances` para o sistema funcionar.

### **Verificar se está cadastrada:**

Execute no Supabase SQL Editor:

```sql
SELECT 
  id,
  name,
  instance_id,
  token,
  area,
  phone_number,
  status,
  updated_at
FROM z_api_instances
WHERE instance_id = '3ED484E8415CF126D6009EBD599F8B90';
```

**Resultado esperado:**
- ✅ Deve retornar 1 linha
- ✅ `instance_id = '3ED484E8415CF126D6009EBD599F8B90'`
- ✅ `token = '6633B5CACF7FC081FCAC3611'`
- ✅ `status = 'connected'`
- ✅ `area = 'nutri'`

### **Se NÃO estiver cadastrada, execute:**

```sql
INSERT INTO z_api_instances (
  name,
  instance_id,
  token,
  area,
  phone_number,
  status
) VALUES (
  'Ylada Nutri',
  '3ED484E8415CF126D6009EBD599F8B90',
  '6633B5CACF7FC081FCAC3611',
  'nutri',
  '5519997230912',
  'connected'
)
ON CONFLICT (instance_id) 
DO UPDATE SET
  name = EXCLUDED.name,
  token = EXCLUDED.token,
  area = EXCLUDED.area,
  phone_number = EXCLUDED.phone_number,
  status = EXCLUDED.status,
  updated_at = NOW();
```

---

## 📋 **3. CHECKLIST COMPLETO**

### **Tabelas:**
- [ ] `z_api_instances` existe
- [ ] `whatsapp_conversations` existe
- [ ] `whatsapp_messages` existe
- [ ] `whatsapp_workshop_sessions` existe

### **Instância Z-API:**
- [ ] Instância cadastrada na tabela `z_api_instances`
- [ ] `instance_id` correto: `3ED484E8415CF126D6009EBD599F8B90`
- [ ] `token` correto: `6633B5CACF7FC081FCAC3611`
- [ ] `status = 'connected'`
- [ ] `area = 'nutri'`

---

## 🧪 **4. TESTAR APÓS CONFIGURAR**

1. **Enviar mensagem de teste** do WhatsApp para `5519997230912`
2. **Verificar se conversa foi criada:**

```sql
SELECT 
  id,
  phone,
  name,
  area,
  created_at
FROM whatsapp_conversations
ORDER BY created_at DESC
LIMIT 5;
```

3. **Verificar se mensagem foi salva:**

```sql
SELECT 
  id,
  conversation_id,
  sender_type,
  message,
  created_at
FROM whatsapp_messages
ORDER BY created_at DESC
LIMIT 5;
```

4. **Verificar se Carol respondeu:**

```sql
SELECT 
  id,
  conversation_id,
  sender_type,
  sender_name,
  message,
  created_at
FROM whatsapp_messages
WHERE sender_type = 'bot'
  AND sender_name = 'Carol - Secretária'
ORDER BY created_at DESC
LIMIT 5;
```

---

## ⚠️ **PROBLEMAS COMUNS**

### **Problema 1: "Instância não encontrada"**

**Solução:** Execute o INSERT acima para cadastrar a instância.

### **Problema 2: "Token incorreto"**

**Solução:** 
1. Verifique o token na Z-API
2. Atualize no banco:

```sql
UPDATE z_api_instances
SET 
  token = 'NOVO_TOKEN_AQUI',
  updated_at = NOW()
WHERE instance_id = '3ED484E8415CF126D6009EBD599F8B90';
```

### **Problema 3: "Status não é 'connected'**

**Solução:**

```sql
UPDATE z_api_instances
SET 
  status = 'connected',
  updated_at = NOW()
WHERE instance_id = '3ED484E8415CF126D6009EBD599F8B90';
```

---

## 📝 **RESUMO**

**O que precisa no Supabase:**

1. ✅ Tabelas criadas (migrations)
2. ✅ Instância Z-API cadastrada na tabela `z_api_instances`
3. ✅ Token e instance_id corretos
4. ✅ Status = 'connected'

**Se tudo estiver configurado, o sistema deve funcionar!**
