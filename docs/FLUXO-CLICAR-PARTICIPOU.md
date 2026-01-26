# 🎯 Fluxo Completo: Clicar em "Participou"

## 📋 RESUMO RÁPIDO

Quando você clica no botão **"✅ Participou"** no modal de participantes, o sistema:

1. ✅ **Imediatamente** envia o link de cadastro
2. ✅ **Automaticamente** inicia o processo de fechamento/vendas
3. ✅ **Programa** mensagens estratégicas em horários específicos

---

## 🔄 FLUXO PASSO A PASSO

### **1. Você Clica em "Participou"**

**Localização:** 
- Página: `/admin/whatsapp/workshop`
- Modal: "👥 Participantes Confirmados"
- Botão: **"✅ Participou"**

**Ação:**
```typescript
markParticipated(conversationId, true)
```

---

### **2. Frontend Chama a API**

**Endpoint:** `POST /api/admin/whatsapp/workshop/participants`

**Payload:**
```json
{
  "conversationId": "uuid-da-conversa",
  "participated": true
}
```

---

### **3. API Atualiza a Tag**

**O que acontece:**
- Remove tags antigas (`participou_aula` ou `nao_participou_aula`)
- Adiciona tag `participou_aula`
- Salva timestamp `participated_at` no contexto
- Atualiza a conversa no banco de dados

**Código:**
```typescript
// Remove tags antigas
const newTags = tags.filter(
  (tag: string) => tag !== 'participou_aula' && tag !== 'nao_participou_aula'
)

// Adiciona tag "participou_aula"
if (participated) {
  newTags.push('participou_aula')
}

// Atualiza no banco
await supabaseAdmin
  .from('whatsapp_conversations')
  .update({
    context: {
      ...context,
      tags: newTags,
      participated_at: new Date().toISOString(),
    },
  })
```

---

### **4. Flow é Disparado Automaticamente** 🚀

**Imediatamente após adicionar a tag:**

A API detecta que a tag `participou_aula` foi adicionada e dispara automaticamente:

```typescript
// Verifica se está adicionando a tag agora
const hadParticipatedTag = tags.includes('participou_aula')
const isAddingParticipatedTag = participated && !hadParticipatedTag

// Dispara flow em background
if (isAddingParticipatedTag) {
  sendRegistrationLinkAfterClass(conversationId)
}
```

---

### **5. Mensagem Imediata: Link de Cadastro**

**Função:** `sendRegistrationLinkAfterClass(conversationId)`

**O que faz:**
1. Busca a conversa no banco
2. Verifica se já tem tag `participou_aula`
3. Verifica se já recebeu o link (evita duplicatas)
4. Envia mensagem via Z-API

**Mensagem enviada:**
```
Olá [Nome]! 🎉

Que alegria ter você aqui! Espero que a aula tenha sido transformadora para você! 💚

Agora que você já viu o caminho, que tal darmos o próximo passo juntas?

Temos programas incríveis que vão te ajudar a transformar seu sonho em realidade:

🌟 *Qual você prefere começar?*

🔗 *Acesse aqui para ver os programas e fazer seu cadastro:*
https://ylada.com/pt/nutri/cadastro

O que você acha? Já quer começar ou tem alguma dúvida? 

Estou aqui para te ajudar em cada passo! 😊

Carol - Secretária YLADA Nutri
```

**Marcadores salvos:**
- `registration_link_sent: true`
- `registration_link_sent_at: timestamp`

---

### **6. Processo de Fechamento Automático**

**Função:** `sendSalesFollowUpAfterClass()` (executada via cron job)

**Como funciona:**
- Executa periodicamente (via cron job)
- Busca pessoas com tag `participou_aula`
- Verifica se já recebeu follow-up de vendas
- Calcula tempo desde a aula
- Envia mensagens em horários específicos

**Mensagens programadas:**

| Tempo | Mensagem |
|-------|----------|
| **3h depois** | Lembra o sonho/motivo |
| **6h depois** | Trabalha o emocional |
| **12h depois** | Reforça o motivo |
| **24h depois** | Cria urgência |
| **48h depois** | Última tentativa |

**Marcadores salvos:**
- `sales_follow_up_sent: true`
- `sales_follow_up.sent_3h: true`
- `sales_follow_up.sent_6h: true`
- `sales_follow_up.sent_12h: true`
- `sales_follow_up.sent_24h: true`
- `sales_follow_up.sent_48h: true`

---

## 📊 DIAGRAMA DO FLUXO

```
┌─────────────────────────────────────┐
│  Você clica em "✅ Participou"      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  POST /api/admin/whatsapp/          │
│  workshop/participants               │
│  { conversationId, participated }    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  API atualiza tag no banco:         │
│  - Remove tags antigas              │
│  - Adiciona "participou_aula"       │
│  - Salva participated_at            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  🚀 DISPARO AUTOMÁTICO               │
│  sendRegistrationLinkAfterClass()   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  ✅ Mensagem Imediata                │
│  Link de cadastro enviado            │
│  registration_link_sent = true     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  ⏰ Processo de Fechamento           │
│  (via cron job)                      │
│  - 3h: Lembra sonho                  │
│  - 6h: Trabalha emocional            │
│  - 12h: Reforça motivo               │
│  - 24h: Urgência                     │
│  - 48h: Última tentativa             │
└─────────────────────────────────────┘
```

---

## 🎯 PONTOS IMPORTANTES

### ✅ **O que acontece automaticamente:**

1. **Imediato (ao clicar):**
   - Tag `participou_aula` é adicionada
   - Link de cadastro é enviado automaticamente
   - Timestamp `participated_at` é salvo

2. **Automático (via cron):**
   - Processo de fechamento inicia
   - Mensagens são enviadas nos horários programados
   - Sistema evita duplicatas

### ⚠️ **Proteções implementadas:**

- ✅ Não envia link se já foi enviado (`registration_link_sent`)
- ✅ Não envia follow-up se já foi enviado (`sales_follow_up_sent`)
- ✅ Não envia se já é cliente (`cliente_nutri`)
- ✅ Não envia se não tem tag `participou_aula`

---

## 📝 ARQUIVOS ENVOLVIDOS

### **Frontend:**
- `src/app/admin/whatsapp/workshop/page.tsx`
  - Função: `markParticipated()`
  - Linha: ~334

### **Backend:**
- `src/app/api/admin/whatsapp/workshop/participants/route.ts`
  - Endpoint: `POST /api/admin/whatsapp/workshop/participants`
  - Linha: ~72

### **Flows:**
- `src/lib/whatsapp-carol-ai.ts`
  - Função: `sendRegistrationLinkAfterClass()` (linha ~2680)
  - Função: `sendSalesFollowUpAfterClass()` (linha ~2438)

---

## 🔍 COMO VERIFICAR SE FUNCIONOU

### **1. Verificar Tag:**
```sql
SELECT context->>'tags' 
FROM whatsapp_conversations 
WHERE id = 'conversation-id';
-- Deve conter: ["participou_aula"]
```

### **2. Verificar Link Enviado:**
```sql
SELECT context->>'registration_link_sent' 
FROM whatsapp_conversations 
WHERE id = 'conversation-id';
-- Deve ser: true
```

### **3. Verificar Mensagens:**
```sql
SELECT * 
FROM whatsapp_messages 
WHERE conversation_id = 'conversation-id' 
  AND sender_type = 'bot'
ORDER BY created_at DESC;
-- Deve ter mensagem com link de cadastro
```

---

## 🚀 RESUMO FINAL

**Ao clicar em "Participou":**

1. ✅ Tag é adicionada
2. ✅ Link de cadastro é enviado **IMEDIATAMENTE**
3. ✅ Processo de fechamento inicia **AUTOMATICAMENTE**
4. ✅ Mensagens são enviadas em **3h, 6h, 12h, 24h, 48h**

**Tudo acontece automaticamente! Você só precisa clicar em "Participou".** 🎉

---

**Última atualização:** 2026-01-25  
**Versão:** 1.0
