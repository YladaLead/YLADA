# 🧪 Como Testar Automação WhatsApp

## 🎯 OBJETIVO

Testar se o sistema está recebendo mensagens, processando e respondendo automaticamente (quando configurado).

---

## ✅ PRÉ-REQUISITOS

1. ✅ Instância Z-API conectada
2. ✅ Webhook configurado na Z-API
3. ✅ Variáveis de ambiente configuradas na Vercel
4. ✅ Banco de dados com tabelas criadas
5. ✅ Você é admin (para ver o chat)

---

## 🧪 TESTE 1: Verificar Recebimento de Mensagens

### **Passo 1: Enviar Mensagem Real**

1. Envie uma mensagem de WhatsApp para: **`5519997230912`**
2. Mensagem de teste: `"Olá, quero testar"`

### **Passo 2: Verificar no Banco**

Execute no Supabase:

```sql
-- Verificar última mensagem recebida
SELECT 
  id,
  message,
  sender_phone,
  sender_name,
  created_at,
  area
FROM whatsapp_messages
ORDER BY created_at DESC
LIMIT 5;

-- Verificar conversa criada
SELECT 
  id,
  sender_phone,
  last_message_at,
  total_messages,
  unread_count
FROM whatsapp_conversations
ORDER BY last_message_at DESC
LIMIT 5;
```

**Resultado esperado:**
- ✅ Mensagem aparece na tabela `whatsapp_messages`
- ✅ Conversa criada/atualizada em `whatsapp_conversations`
- ✅ `area = 'nutri'`

---

## 🧪 TESTE 2: Verificar Notificação

### **Passo 1: Verificar Variável de Ambiente**

Na Vercel, verifique se `Z_API_NOTIFICATION_PHONE` está configurada:
- Valor: `5519981868000`

### **Passo 2: Enviar Mensagem**

Envie mensagem para `5519997230912`

### **Passo 3: Verificar Notificação**

1. Verifique se chegou mensagem no `19981868000`
2. Mensagem deve ser: `🔔 Nova mensagem WhatsApp\n\n📱 De: [número]\n💬 [preview]`

**Se não chegou:**
- Verificar logs da Vercel
- Verificar se variável está configurada
- Verificar se número está correto

---

## 🧪 TESTE 3: Verificar Interface Admin

### **Passo 1: Tornar-se Admin**

Execute no Supabase:

```sql
-- Executar migrations/180-tornar-faulaandre-admin.sql
```

### **Passo 2: Fazer Logout e Login**

1. Faça logout da aplicação
2. Faça login novamente
3. Acesse: `https://www.ylada.com/admin/whatsapp`

### **Passo 3: Verificar Conversas**

**Resultado esperado:**
- ✅ Lista de conversas aparece
- ✅ Última conversa no topo
- ✅ Contador de não lidas funciona
- ✅ Ao clicar, mensagens aparecem

---

## 🧪 TESTE 4: Testar Webhook Manualmente

### **Via cURL:**

```bash
curl -X POST https://www.ylada.com/api/webhooks/z-api \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "5511999999999",
    "message": "Teste manual do webhook",
    "name": "Teste Manual",
    "instanceId": "3ED484E8415CF126D6009EBD599F8B90"
  }'
```

**Resultado esperado:**
```json
{
  "received": true,
  "conversationId": "...",
  "area": "nutri"
}
```

**Depois verificar no banco:**
```sql
SELECT * FROM whatsapp_messages 
WHERE message LIKE '%Teste manual%'
ORDER BY created_at DESC 
LIMIT 1;
```

---

## 🤖 TESTE 5: Criar Automação Simples

### **Exemplo: Resposta Automática**

1. Criar arquivo: `src/lib/whatsapp-automation.ts`

```typescript
import { sendWhatsAppMessage } from '@/lib/z-api'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function processAutomation(
  phone: string,
  message: string,
  instanceId: string,
  token: string
): Promise<boolean> {
  const lowerMessage = message.toLowerCase().trim()
  
  // Resposta automática para "olá" ou "oi"
  if (lowerMessage === 'olá' || lowerMessage === 'oi' || lowerMessage === 'ola') {
    await sendWhatsAppMessage(
      phone,
      'Olá! 👋\n\nObrigado por entrar em contato com a Ylada Nutri.\n\nEm breve nossa equipe responderá sua mensagem.\n\nAtenciosamente,\nEquipe Ylada',
      instanceId,
      token
    )
    return true
  }
  
  // Resposta para "horário" ou "atendimento"
  if (lowerMessage.includes('horário') || lowerMessage.includes('atendimento')) {
    await sendWhatsAppMessage(
      phone,
      '🕐 Horário de Atendimento:\n\nSegunda a Sexta: 9h às 18h\nSábado: 9h às 13h\n\nEstamos aqui para ajudar! 😊',
      instanceId,
      token
    )
    return true
  }
  
  return false
}
```

2. Integrar no webhook (`src/app/api/webhooks/z-api/route.ts`):

```typescript
// Após salvar mensagem, antes de notificar
import { processAutomation } from '@/lib/whatsapp-automation'

// No POST handler, após saveMessage:
const automationProcessed = await processAutomation(
  body.phone,
  body.message,
  instanceId,
  instance.token
)

if (automationProcessed) {
  console.log('[Z-API Webhook] 🤖 Automação processada')
}
```

3. Testar:
   - Envie "olá" para `5519997230912`
   - Deve receber resposta automática
   - Verificar no banco se resposta foi salva

---

## 📊 CHECKLIST DE TESTES

- [ ] **Teste 1:** Mensagem real chega no banco
- [ ] **Teste 2:** Notificação chega no `19981868000`
- [ ] **Teste 3:** Interface admin mostra conversas
- [ ] **Teste 4:** Webhook manual funciona
- [ ] **Teste 5:** Automação responde (se implementada)

---

## 🐛 TROUBLESHOOTING

### **Mensagem não aparece no banco:**
- Verificar webhook na Z-API
- Verificar logs da Vercel
- Testar webhook manualmente

### **Notificação não chega:**
- Verificar `Z_API_NOTIFICATION_PHONE` na Vercel
- Verificar formato do número (5519981868000)
- Verificar logs da Vercel

### **Chat admin não carrega:**
- Verificar se é admin (SQL)
- Fazer logout/login
- Verificar console do navegador (F12)

### **Automação não responde:**
- Verificar se função está sendo chamada
- Verificar logs da Vercel
- Verificar se instância está conectada

---

**Execute os testes na ordem e me diga o resultado de cada um!**
