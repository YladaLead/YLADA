# 🧪 Guia Rápido de Testes - Nova Automação WhatsApp

**Data:** 2026-01-26  
**Status:** ✅ Migration executada - Pronto para testes

---

## ✅ CHECKLIST PRÉ-TESTE

- [x] Migration executada no Supabase
- [x] Tabela `whatsapp_scheduled_messages` criada
- [x] Código compilando sem erros

---

## 🧪 TESTE 1: Agendar Boas-vindas

### **Passo a Passo:**

1. **Acessar interface:**
   - Ir para: `/admin/whatsapp/automation`
   - Ou: Admin → WhatsApp → Automação

2. **Clicar em "Agendar Boas-vindas"**

3. **Verificar resultado:**
   - Deve mostrar: `Agendadas: X | Puladas: Y | Erros: Z`
   - Se `Agendadas > 0`, sucesso! ✅

4. **Verificar no banco:**
   ```sql
   SELECT * FROM whatsapp_scheduled_messages 
   WHERE message_type = 'welcome' 
   AND status = 'pending'
   ORDER BY scheduled_for;
   ```
   - Deve ter registros com `status = 'pending'`

---

## 🧪 TESTE 2: Processar Mensagens Pendentes

### **Passo a Passo:**

1. **Aguardar alguns segundos** (se agendou para agora)

2. **Clicar em "Verificar e Processar"**

3. **Verificar resultado:**
   - Deve mostrar: `Processadas: X | Enviadas: Y | Falhadas: Z`
   - Se `Enviadas > 0`, sucesso! ✅

4. **Verificar no banco:**
   ```sql
   SELECT * FROM whatsapp_scheduled_messages 
   WHERE status = 'sent'
   ORDER BY sent_at DESC
   LIMIT 5;
   ```
   - Deve ter registros com `status = 'sent'` e `sent_at` preenchido

5. **Verificar no WhatsApp:**
   - Mensagem deve ter sido enviada
   - Deve aparecer no histórico da conversa

---

## 🧪 TESTE 3: Agendamento Automático de Pré-Aula

### **Passo a Passo:**

1. **Adicionar participante a uma sessão:**
   - Ir para: `/admin/whatsapp/workshop`
   - Adicionar alguém a uma sessão futura

2. **Verificar no banco:**
   ```sql
   SELECT * FROM whatsapp_scheduled_messages 
   WHERE message_type LIKE 'pre_class%'
   AND status = 'pending'
   ORDER BY scheduled_for;
   ```
   - Deve ter 4 registros:
     - `pre_class_24h`
     - `pre_class_12h`
     - `pre_class_2h`
     - `pre_class_30min`

3. **Verificar horários:**
   - `pre_class_24h` deve ser 24h antes da sessão
   - `pre_class_12h` deve ser 12h antes da sessão
   - `pre_class_2h` deve ser 2h antes da sessão
   - `pre_class_30min` deve ser 30min antes da sessão

---

## 🧪 TESTE 4: Cancelamento Automático

### **Passo a Passo:**

1. **Agendar uma mensagem** (Teste 1)

2. **Enviar mensagem do WhatsApp** para o número que foi agendado

3. **Processar pendentes** (Teste 2)

4. **Verificar no banco:**
   ```sql
   SELECT * FROM whatsapp_scheduled_messages 
   WHERE status = 'cancelled'
   AND cancelled_reason = 'user_responded'
   ORDER BY cancelled_at DESC
   LIMIT 5;
   ```
   - Deve ter registros com `status = 'cancelled'`
   - `cancelled_reason = 'user_responded'`

5. **Verificar que mensagem NÃO foi enviada:**
   - Mesmo que estivesse agendada, não deve ter sido enviada

---

## 🔍 VERIFICAÇÕES ADICIONAIS

### **Verificar Logs:**
- Abrir console do navegador (F12)
- Verificar se há erros
- Verificar logs do servidor (Vercel)

### **Verificar Tabela:**
```sql
-- Ver todas as mensagens agendadas
SELECT 
  id,
  message_type,
  status,
  scheduled_for,
  sent_at,
  cancelled_at,
  cancelled_reason,
  created_at
FROM whatsapp_scheduled_messages
ORDER BY created_at DESC
LIMIT 20;
```

### **Verificar Conversas:**
```sql
-- Ver conversas com tags de automação
SELECT 
  id,
  phone,
  name,
  context->tags as tags,
  last_message_at
FROM whatsapp_conversations
WHERE context->tags @> '["veio_aula_pratica"]'::jsonb
ORDER BY last_message_at DESC
LIMIT 10;
```

---

## ❌ PROBLEMAS COMUNS

### **Erro: "Tabela não encontrada"**
- ✅ Verificar se migration foi executada
- ✅ Verificar nome da tabela: `whatsapp_scheduled_messages`

### **Erro: "Instância Z-API não encontrada"**
- ✅ Verificar se há instância Z-API cadastrada
- ✅ Verificar se status é `connected`

### **Nenhuma mensagem agendada**
- ✅ Verificar se há leads dos últimos 7 dias
- ✅ Verificar se leads têm telefone válido
- ✅ Verificar se leads já têm conversa ativa

### **Mensagens não são enviadas**
- ✅ Verificar se instância Z-API está conectada
- ✅ Verificar logs do servidor
- ✅ Verificar se telefone está no formato correto (55...)

---

## ✅ SUCESSO

Se todos os testes passarem:
- ✅ Sistema de agendamento funcionando
- ✅ Worker processando mensagens
- ✅ Cancelamento automático funcionando
- ✅ Agendamento automático de pré-aula funcionando

**Próximo passo:** Remover código antigo e limpar

---

**Última atualização:** 2026-01-26
