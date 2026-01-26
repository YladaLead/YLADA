# 🧹 PLANO DE LIMPEZA E REFATORAÇÃO - WhatsApp Automação

**Data:** 2026-01-26  
**Objetivo:** Limpar código, simplificar interface e implementar Banco + Worker On-Demand

---

## 📋 FUNCIONALIDADES ESSENCIAIS (MANTER)

### ✅ **1. Resposta Automática (Carol IA)**
- **Função:** `processIncomingMessageWithCarol`
- **Onde:** Webhook `/api/webhooks/z-api`
- **Status:** ✅ Funciona perfeitamente - MANTER
- **Ação:** Nenhuma alteração

### ✅ **2. Boas-vindas**
- **Função:** `sendWelcomeToNonContactedLeads`
- **Quando:** Lead novo ou verificação diária
- **Status:** ✅ Importante - MIGRAR para agendamento
- **Ação:** Migrar para sistema de agendamento

### ✅ **3. Notificações Pré-Aula**
- **Função:** `sendPreClassNotifications`
- **Quando:** 24h, 12h, 2h, 30min antes da aula
- **Status:** ✅ Importante - MIGRAR para agendamento
- **Ação:** Migrar para sistema de agendamento

### ✅ **4. Link Pós-Participação**
- **Função:** `sendRegistrationLinkAfterClass`
- **Quando:** Imediato ao marcar "participou"
- **Status:** ✅ Funciona bem - MANTER (já é event-driven)
- **Ação:** Garantir que cancela se pessoa respondeu

### ✅ **5. Remarketing Individual**
- **Função:** `sendRemarketingToNonParticipant`
- **Quando:** Imediato ao marcar "não participou"
- **Status:** ✅ Funciona bem - MANTER (já é event-driven)
- **Ação:** Garantir que cancela se pessoa respondeu

---

## 🗑️ FUNCIONALIDADES PARA REMOVER

### ❌ **1. Funções Não Usadas**
- `sendPostClassNotifications` - Não está em cron
- `sendFollowUpToNonResponders` - Não está em cron
- `sendSalesFollowUpAfterClass` - Não está em cron
- `sendRemarketingToNonParticipants` (em massa) - Redundante

### ❌ **2. Endpoints Redundantes**
- `/api/admin/whatsapp/carol/processar-conversas` - Complexo, pouco usado
- `/api/admin/whatsapp/carol/disparar-pendentes` - Funcionalidade específica, pouco usada
- `/api/admin/whatsapp/carol/enviar-opcao` - Pouco usado

### ❌ **3. Endpoints de Cron (Substituir)**
- `/api/cron/whatsapp-carol` - Substituir por worker on-demand

---

## 🏗️ NOVA ESTRUTURA PROPOSTA

### **1. Tabela de Agendamento**
```sql
CREATE TABLE whatsapp_scheduled_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES whatsapp_conversations(id),
  message_type VARCHAR(50) NOT NULL, -- 'welcome', 'pre_class_24h', 'pre_class_12h', etc.
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'cancelled', 'failed'
  message_data JSONB, -- Dados da mensagem
  retry_count INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE
);
```

### **2. Funções Core (Simplificadas)**
```
src/lib/whatsapp-automation/
  ├── carol-ai.ts          # Resposta automática (MANTER)
  ├── welcome.ts           # Boas-vindas (REFATORAR)
  ├── pre-class.ts         # Notificações pré-aula (REFATORAR)
  ├── post-class.ts        # Link pós-participação (MANTER)
  ├── remarketing.ts       # Remarketing individual (MANTER)
  └── scheduler.ts         # Sistema de agendamento (NOVO)
```

### **3. Endpoints API (Simplificados)**
```
src/app/api/admin/whatsapp/automation/
  ├── schedule/route.ts     # Agendar mensagem
  ├── process/route.ts      # Processar pendentes (worker)
  └── cancel/route.ts       # Cancelar agendamento
```

### **4. Interface Admin (Simplificada)**
```
src/app/admin/whatsapp/automation/
  ├── page.tsx              # Página principal (simples)
  └── components/
      ├── WelcomeButton.tsx
      ├── PendingList.tsx
      └── ScheduleList.tsx
```

---

## 📝 PLANO DE EXECUÇÃO

### **FASE 1: Preparação (Backup e Análise)**
- [ ] Criar backup do código atual
- [ ] Documentar funcionalidades que funcionam
- [ ] Mapear dependências

### **FASE 2: Criar Nova Estrutura**
- [ ] Criar migration para tabela `whatsapp_scheduled_messages`
- [ ] Criar `src/lib/whatsapp-automation/scheduler.ts`
- [ ] Criar funções de agendamento
- [ ] Criar funções de processamento

### **FASE 3: Migrar Funções Essenciais**
- [ ] Migrar `sendWelcomeToNonContactedLeads` para usar agendamento
- [ ] Migrar `sendPreClassNotifications` para usar agendamento
- [ ] Manter `sendRegistrationLinkAfterClass` (já funciona)
- [ ] Manter `sendRemarketingToNonParticipant` (já funciona)
- [ ] Adicionar cancelamento automático quando recebe mensagem

### **FASE 4: Criar Novos Endpoints**
- [ ] Criar `/api/admin/whatsapp/automation/schedule`
- [ ] Criar `/api/admin/whatsapp/automation/process` (worker)
- [ ] Criar `/api/admin/whatsapp/automation/cancel`

### **FASE 5: Refazer Interface Admin**
- [ ] Criar página `/admin/whatsapp/automation` (simples)
- [ ] Botão "Disparar Boas-vindas"
- [ ] Botão "Verificar Pendentes"
- [ ] Lista de mensagens agendadas
- [ ] Lista de mensagens enviadas

### **FASE 6: Remover Código Antigo**
- [ ] Remover funções não usadas
- [ ] Remover endpoints redundantes
- [ ] Remover interface antiga `/admin/whatsapp/carol`
- [ ] Remover crons do `vercel.json`

### **FASE 7: Integração e Testes**
- [ ] Testar boas-vindas
- [ ] Testar notificações pré-aula
- [ ] Testar cancelamento automático
- [ ] Testar worker on-demand
- [ ] Verificar que tudo funciona

### **FASE 8: Documentação**
- [ ] Documentar nova estrutura
- [ ] Documentar como usar
- [ ] Atualizar guias

---

## 🎯 RESULTADO ESPERADO

### **Antes:**
- ❌ 10 funções (muitas não usadas)
- ❌ 7 endpoints (muitos redundantes)
- ❌ Interface complexa e confusa
- ❌ Dependência de cron jobs (plano Hobby limitado)

### **Depois:**
- ✅ 5 funções essenciais
- ✅ 3 endpoints simples
- ✅ Interface limpa e direta
- ✅ Sistema de agendamento flexível (sem cron)
- ✅ Cancelamento automático
- ✅ Fácil de manter e expandir

---

## ⚠️ CUIDADOS

1. **Não quebrar o que funciona:**
   - Carol IA (resposta automática) deve continuar funcionando
   - Webhook deve continuar funcionando
   - Marcar "participou" deve continuar funcionando

2. **Testar cada etapa:**
   - Testar antes de remover
   - Garantir que funcionalidades críticas funcionam

3. **Backup:**
   - Manter backup do código antigo
   - Poder reverter se necessário

---

**Status:** 📋 Plano criado - Pronto para execução
