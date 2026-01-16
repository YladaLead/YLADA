# 🔍 Revisão Completa - WhatsApp Chat

## 📋 CONFIGURAÇÃO ATUAL

### **Telefone Integrado:**
- **Número:** `5519997230912`
- **Instância Z-API:** `3ED484E8415CF126D6009EBD599F8B90`
- **Área:** `nutri`
- **Status:** Conectado ✅

### **Telefone para Notificações:**
- **Número:** `19981868000`
- **Formato Internacional:** `5519981868000` (55 + DDD + número)
- **Configuração:** Variável de ambiente `Z_API_NOTIFICATION_PHONE`

---

## ✅ CHECKLIST DE VERIFICAÇÃO

### **1. Configuração do Banco de Dados**

Execute no Supabase:

```sql
-- Verificar instância
SELECT * FROM z_api_instances 
WHERE instance_id = '3ED484E8415CF126D6009EBD599F8B90';

-- Verificar se é admin
SELECT 
  u.email,
  u.raw_user_meta_data->>'role' as role,
  up.is_admin
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
WHERE u.email = 'faulaandre@gmail.com';
```

**Se não for admin:**
```sql
-- Executar script: migrations/180-tornar-faulaandre-admin.sql
```

---

### **2. Variáveis de Ambiente (Vercel)**

Acesse: https://vercel.com → Seu projeto → Settings → Environment Variables

**Verificar/Adicionar:**
```
Z_API_INSTANCE_ID=3ED484E8415CF126D6009EBD599F8B90
Z_API_TOKEN=6633B5CACF7FC081FCAC3611
Z_API_BASE_URL=https://api.z-api.io
Z_API_NOTIFICATION_PHONE=5519981868000
```

**Importante:** 
- `Z_API_NOTIFICATION_PHONE` deve estar no formato internacional: `5519981868000`
- Após adicionar, fazer **redeploy** na Vercel

---

### **3. Webhook na Z-API**

1. Acesse: https://developer.z-api.com.br/
2. Vá em **"Instâncias Web"**
3. Clique na sua instância
4. Vá em **"Webhooks"**
5. Configure:
   - **URL:** `https://www.ylada.com/api/webhooks/z-api`
   - **Evento:** "Ao receber" ✅ (habilitado)
   - **Status:** Ativo ✅

**Testar webhook:**
```bash
curl -X POST https://www.ylada.com/api/webhooks/z-api \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "5511999999999",
    "message": "Teste webhook",
    "name": "Teste",
    "instanceId": "3ED484E8415CF126D6009EBD599F8B90"
  }'
```

Depois verificar no banco:
```sql
SELECT * FROM whatsapp_messages 
WHERE message LIKE '%Teste webhook%'
ORDER BY created_at DESC LIMIT 1;
```

---

### **4. Chat Administrativo Não Visível**

#### **Problema 1: Não é Admin**

**Sintoma:** Erro 403 ao acessar `/admin/whatsapp`

**Solução:**
1. Execute `migrations/180-tornar-faulaandre-admin.sql` no Supabase
2. Faça logout e login novamente
3. Acesse `/admin/whatsapp`

#### **Problema 2: Nenhuma Conversa Aparece**

**Sintoma:** Página carrega mas não mostra conversas

**Verificar:**
```sql
-- Verificar se há mensagens
SELECT COUNT(*) FROM whatsapp_messages;

-- Verificar se há conversas
SELECT COUNT(*) FROM whatsapp_conversations;

-- Verificar última mensagem
SELECT * FROM whatsapp_messages 
ORDER BY created_at DESC LIMIT 5;
```

**Se não houver mensagens:**
- Webhook não está recebendo da Z-API
- Verificar logs da Vercel
- Verificar configuração do webhook na Z-API

#### **Problema 3: Erro ao Carregar**

**Sintoma:** Erro 500 ou página não carrega

**Verificar:**
- Logs da Vercel
- Console do navegador (F12)
- Verificar se API está respondendo:
  ```bash
  curl https://www.ylada.com/api/whatsapp/conversations
  ```

---

### **5. Notificações Não Chegam**

**Verificar:**
1. Variável `Z_API_NOTIFICATION_PHONE` configurada na Vercel
2. Formato correto: `5519981868000` (sem espaços, sem caracteres especiais)
3. Número está no mesmo WhatsApp da instância (mesmo dispositivo)
4. Verificar logs da Vercel ao receber mensagem

**Testar notificação manualmente:**
```sql
-- Simular notificação (após receber mensagem real)
SELECT * FROM whatsapp_notifications 
ORDER BY created_at DESC LIMIT 5;
```

---

## 🧪 TESTAR AUTOMAÇÃO

### **Opção 1: Teste Manual via API**

```bash
# Enviar mensagem de teste
curl -X POST https://www.ylada.com/api/webhooks/z-api \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "5511999999999",
    "message": "Olá, quero testar a automação",
    "name": "Teste Automação",
    "instanceId": "3ED484E8415CF126D6009EBD599F8B90"
  }'
```

### **Opção 2: Enviar Mensagem Real**

1. Envie uma mensagem de WhatsApp para `5519997230912`
2. Verifique se chegou no banco:
   ```sql
   SELECT * FROM whatsapp_messages 
   ORDER BY created_at DESC LIMIT 1;
   ```
3. Verifique se notificação foi enviada para `19981868000`
4. Verifique se aparece em `/admin/whatsapp`

### **Opção 3: Testar Bot/Automação**

**Criar automação simples:**

1. Criar arquivo: `src/lib/whatsapp-automation.ts`
2. Implementar lógica de resposta automática
3. Integrar no webhook (`src/app/api/webhooks/z-api/route.ts`)

**Exemplo básico:**
```typescript
// Resposta automática simples
if (message.toLowerCase().includes('olá') || message.toLowerCase().includes('oi')) {
  await sendWhatsAppMessage(
    phone,
    'Olá! Obrigado por entrar em contato. Em breve responderemos.',
    instanceId,
    token
  )
}
```

---

## 📊 DIAGNÓSTICO PASSO A PASSO

### **Passo 1: Verificar Banco**
```sql
-- Instância
SELECT * FROM z_api_instances;

-- Mensagens
SELECT COUNT(*) as total FROM whatsapp_messages;

-- Conversas
SELECT COUNT(*) as total FROM whatsapp_conversations;

-- Admin
SELECT u.email, up.is_admin 
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
WHERE u.email = 'faulaandre@gmail.com';
```

### **Passo 2: Verificar Vercel**
- Acesse: https://vercel.com → Seu projeto → Logs
- Procure por: `[Z-API Webhook]`
- Verifique se há erros

### **Passo 3: Verificar Z-API**
- Dashboard mostra instância conectada? ✅
- Webhook configurado? ✅
- URL correta? `https://www.ylada.com/api/webhooks/z-api`

### **Passo 4: Testar Webhook**
```bash
curl -X POST https://www.ylada.com/api/webhooks/z-api \
  -H "Content-Type: application/json" \
  -d '{"phone":"5511999999999","message":"Teste","instanceId":"3ED484E8415CF126D6009EBD599F8B90"}'
```

### **Passo 5: Verificar Interface**
- Acesse: `https://www.ylada.com/admin/whatsapp`
- Está logado como admin? ✅
- Conversas aparecem? ✅

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ **Configurar `Z_API_NOTIFICATION_PHONE` na Vercel:** `5519981868000`
2. ✅ **Executar SQL para tornar admin** (se ainda não fez)
3. ✅ **Verificar webhook na Z-API** (URL correta)
4. ✅ **Testar enviando mensagem real**
5. ✅ **Verificar se notificação chega** no `19981868000`
6. ✅ **Implementar automação** (se necessário)

---

## 📝 RESUMO

| Item | Status | Ação |
|------|--------|------|
| Instância Z-API | ✅ Configurada | Verificar conexão |
| Webhook | ⚠️ Verificar | Configurar na Z-API |
| Variável Notificação | ⚠️ Configurar | Adicionar na Vercel |
| Admin | ⚠️ Verificar | Executar SQL |
| Chat Admin | ⚠️ Testar | Acessar após ser admin |
| Automação | 📝 Pendente | Implementar se necessário |

---

**Execute os passos acima e me diga o resultado de cada um!**
