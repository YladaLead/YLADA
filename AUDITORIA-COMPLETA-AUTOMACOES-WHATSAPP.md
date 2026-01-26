# 🔍 AUDITORIA COMPLETA - Automações WhatsApp

**Data:** 2026-01-26  
**Objetivo:** Mapear todas as funcionalidades, identificar redundâncias e otimizar antes de implementar Banco + Worker On-Demand

---

## 📊 MAPEAMENTO COMPLETO DE FUNCIONALIDADES

### **1. FUNÇÕES CORE (src/lib/whatsapp-carol-ai.ts)**

| Função | O que faz | Quando é usada | Status |
|--------|-----------|----------------|--------|
| `processIncomingMessageWithCarol` | Responde automaticamente mensagens recebidas | Webhook Z-API (sempre) | ✅ **ESSENCIAL** |
| `sendWelcomeToNonContactedLeads` | Boas-vindas para quem preencheu mas não chamou | Cron diário ou manual | ✅ **IMPORTANTE** |
| `sendRemarketingToNonParticipant` | Remarketing para 1 pessoa específica | Quando marca "não participou" | ✅ **IMPORTANTE** |
| `sendRemarketingToNonParticipants` | Remarketing em massa | Cron diário ou manual | ⚠️ **REDUNDANTE** (ver abaixo) |
| `sendPreClassNotifications` | Notificações 24h, 12h, 2h, 30min antes | Cron a cada 30min | ✅ **IMPORTANTE** |
| `sendPostClassNotifications` | Notificações pós-aula | Cron ou manual | ⚠️ **POUCO USADO** |
| `sendFollowUpToNonResponders` | Follow-up para quem não respondeu | Cron ou manual | ⚠️ **POUCO USADO** |
| `sendSalesFollowUpAfterClass` | Fechamento/vendas pós-aula | Cron ou manual | ⚠️ **POUCO USADO** |
| `sendRegistrationLinkAfterClass` | Link de cadastro após participar | Quando marca "participou" | ✅ **IMPORTANTE** |
| `sendWorkshopReminders` | Lembretes de reunião | Cron diário | ✅ **IMPORTANTE** |

---

### **2. ENDPOINTS API**

#### **2.1. Cron Jobs (`/api/cron/whatsapp-carol`)**
| Tipo | Função chamada | Frequência | Status |
|------|----------------|------------|--------|
| `welcome` | `sendWelcomeToNonContactedLeads` | Diário 09:00 | ✅ Ativo |
| `remarketing` | `sendRemarketingToNonParticipants` | Diário 10:00 | ✅ Ativo |
| `pre-class` | `sendPreClassNotifications` | A cada 30min | ⚠️ **BLOQUEADO** (plano Hobby) |
| `post-class` | `sendPostClassNotifications` | - | ❌ Não configurado |
| `follow-up` | `sendFollowUpToNonResponders` | - | ❌ Não configurado |
| `sales-follow-up` | `sendSalesFollowUpAfterClass` | - | ❌ Não configurado |
| `reminders` | `sendWorkshopReminders` | Diário 08:00 | ✅ Ativo |

#### **2.2. Endpoints Admin (`/api/admin/whatsapp/carol/`)**

| Endpoint | O que faz | Status |
|----------|-----------|--------|
| `/disparos` | Dispara welcome, remarketing ou reminders | ✅ **USADO** |
| `/processar-conversas` | Processa todas conversas em massa | ⚠️ **POUCO USADO** |
| `/processar-especificos` | Processa telefones específicos (fechamento/remarketing) | ✅ **USADO** |
| `/disparar-pendentes` | Dispara para quem não escolheu agenda | ⚠️ **POUCO USADO** |
| `/chat` | Testa Carol com mensagem específica | ✅ **USADO** (teste) |
| `/enviar-opcao` | Envia opção de aula manualmente | ⚠️ **POUCO USADO** |

---

### **3. DISPAROS AUTOMÁTICOS POR EVENTO**

| Evento | Ação Automática | Onde está | Status |
|--------|-----------------|-----------|--------|
| Marca "participou" | Dispara `sendRegistrationLinkAfterClass` | `/api/admin/whatsapp/workshop/participants` | ✅ **FUNCIONANDO** |
| Marca "não participou" | Dispara `sendRemarketingToNonParticipant` | `/api/admin/whatsapp/workshop/participants` | ✅ **FUNCIONANDO** |
| Recebe mensagem | Responde com Carol IA | `/api/webhooks/z-api` | ✅ **FUNCIONANDO** |
| Preenche formulário | Cria lead (mas não dispara automaticamente) | - | ⚠️ **NÃO DISPARA** |

---

## 🔴 PROBLEMAS IDENTIFICADOS

### **1. REDUNDÂNCIAS**

#### **Problema 1: Duas funções de remarketing**
- `sendRemarketingToNonParticipant(conversationId)` - Para 1 pessoa
- `sendRemarketingToNonParticipants()` - Para todas

**Análise:**
- A função em massa (`sendRemarketingToNonParticipants`) é chamada por cron
- Mas já existe disparo automático quando marca "não participou"
- **Conclusão:** Função em massa é redundante se o disparo automático funcionar bem

#### **Problema 2: Múltiplos endpoints fazendo coisas similares**
- `/disparos` - Dispara welcome, remarketing, reminders
- `/processar-conversas` - Processa todas conversas (faz várias coisas)
- `/disparar-pendentes` - Dispara para quem não escolheu agenda
- `/processar-especificos` - Processa telefones específicos

**Análise:**
- Há sobreposição de funcionalidades
- `/processar-conversas` parece fazer tudo, mas é pouco usado
- **Conclusão:** Consolidar ou remover endpoints pouco usados

#### **Problema 3: Funções pouco usadas**
- `sendPostClassNotifications` - Não está em cron ativo
- `sendFollowUpToNonResponders` - Não está em cron ativo
- `sendSalesFollowUpAfterClass` - Não está em cron ativo

**Análise:**
- Essas funções existem mas não são usadas
- Podem ser úteis no futuro, mas não agora
- **Conclusão:** Manter mas não priorizar na migração

---

### **2. FUNCIONALIDADES OBSOLETAS OU POUCO USADAS**

| Funcionalidade | Motivo | Recomendação |
|----------------|--------|--------------|
| `sendPostClassNotifications` | Não está em cron, não é chamada automaticamente | ⚠️ Manter código, não migrar agora |
| `sendFollowUpToNonResponders` | Não está em cron, não é chamada automaticamente | ⚠️ Manter código, não migrar agora |
| `sendSalesFollowUpAfterClass` | Não está em cron, não é chamada automaticamente | ⚠️ Manter código, não migrar agora |
| `/processar-conversas` | Endpoint complexo, pouco usado | ⚠️ Avaliar se realmente necessário |
| `/disparar-pendentes` | Funcionalidade específica, pouco usada | ⚠️ Manter se for útil |

---

### **3. FUNCIONALIDADES CRÍTICAS (NÃO PODE QUEBRAR)**

| Funcionalidade | Por quê é crítica | Prioridade |
|----------------|-------------------|------------|
| `processIncomingMessageWithCarol` | Responde todas mensagens recebidas | 🔴 **CRÍTICA** |
| `sendWelcomeToNonContactedLeads` | Primeiro contato com leads | 🔴 **CRÍTICA** |
| `sendPreClassNotifications` | Lembretes antes da aula | 🔴 **CRÍTICA** |
| `sendRegistrationLinkAfterClass` | Fechamento após participar | 🔴 **CRÍTICA** |
| `sendRemarketingToNonParticipant` | Recuperação de não participantes | 🟡 **IMPORTANTE** |
| `sendWorkshopReminders` | Lembretes de reunião | 🟡 **IMPORTANTE** |

---

## ✅ FUNCIONALIDADES ESSENCIAIS PARA MIGRAR

### **Fase 1: Críticas (Migrar primeiro)**

1. **Boas-vindas (Welcome)**
   - Função: `sendWelcomeToNonContactedLeads`
   - Quando agendar: Quando detectar lead novo (ou verificação diária)
   - Prioridade: 🔴 Alta

2. **Notificações Pré-Aula**
   - Função: `sendPreClassNotifications`
   - Quando agendar: Quando pessoa agenda aula (24h, 12h, 2h, 30min antes)
   - Prioridade: 🔴 Alta

3. **Link de Cadastro Pós-Aula**
   - Função: `sendRegistrationLinkAfterClass`
   - Quando agendar: Imediato quando marca "participou" (já funciona assim)
   - Prioridade: 🔴 Alta

4. **Remarketing Individual**
   - Função: `sendRemarketingToNonParticipant`
   - Quando agendar: Imediato quando marca "não participou" (já funciona assim)
   - Prioridade: 🟡 Média

### **Fase 2: Importantes (Migrar depois)**

5. **Lembretes de Reunião**
   - Função: `sendWorkshopReminders`
   - Quando agendar: 12h antes da sessão (ou domingo 17h se segunda 10h)
   - Prioridade: 🟡 Média

6. **Remarketing em Massa** (se necessário)
   - Função: `sendRemarketingToNonParticipants`
   - Quando agendar: Verificação diária ou manual
   - Prioridade: 🟢 Baixa (pode ser substituído pelo individual)

### **Fase 3: Opcionais (Migrar se necessário)**

7. **Follow-up Pós-Aula**
   - Função: `sendPostClassNotifications`
   - Quando agendar: 15min, 2h, 24h após aula
   - Prioridade: 🟢 Baixa

8. **Follow-up Não Respondeu**
   - Função: `sendFollowUpToNonResponders`
   - Quando agendar: 24h, 48h, 72h após boas-vindas
   - Prioridade: 🟢 Baixa

9. **Fechamento/Vendas**
   - Função: `sendSalesFollowUpAfterClass`
   - Quando agendar: 3h, 12h, 24h após participar
   - Prioridade: 🟢 Baixa

---

## 🎯 RECOMENDAÇÕES FINAIS

### **O QUE MANTER E MIGRAR**

✅ **Migrar para Banco + Worker:**
1. Boas-vindas (welcome)
2. Notificações pré-aula (24h, 12h, 2h, 30min)
3. Lembretes de reunião (12h antes)
4. Remarketing individual (já funciona, só garantir que cancela se respondeu)

✅ **Manter como está (já funciona bem):**
1. Resposta automática (Carol IA) - via webhook
2. Link de cadastro pós-aula - já dispara automaticamente
3. Remarketing individual - já dispara automaticamente

### **O QUE REMOVER OU CONSOLIDAR**

⚠️ **Avaliar remoção:**
1. `sendRemarketingToNonParticipants` (em massa) - Redundante se individual funciona
2. `/processar-conversas` - Endpoint complexo, pouco usado
3. `/disparar-pendentes` - Funcionalidade específica, avaliar necessidade

⚠️ **Manter código mas não migrar agora:**
1. `sendPostClassNotifications`
2. `sendFollowUpToNonResponders`
3. `sendSalesFollowUpAfterClass`

### **ARQUITETURA PROPOSTA**

```
┌─────────────────────────────────────────┐
│         EVENTOS (Disparo Imediato)       │
├─────────────────────────────────────────┤
│ • Marca "participou" → Link cadastro    │
│ • Marca "não participou" → Remarketing   │
│ • Recebe mensagem → Resposta Carol IA   │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│    TABELA: whatsapp_scheduled_messages   │
├─────────────────────────────────────────┤
│ • Agendar quando eventos acontecem      │
│ • Status: pending, sent, cancelled      │
│ • Verificar on-demand ou manualmente    │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│      WORKER ON-DEMAND (Verificação)      │
├─────────────────────────────────────────┤
│ • Ao acessar /admin/whatsapp            │
│ • Botão "Verificar Pendentes"           │
│ • Processa mensagens agendadas          │
│ • Cancela se pessoa respondeu           │
└─────────────────────────────────────────┘
```

---

## 📋 PRÓXIMOS PASSOS

1. ✅ **Criar tabela** `whatsapp_scheduled_messages`
2. ✅ **Migrar funções críticas** (Fase 1)
3. ✅ **Criar worker on-demand** para verificar pendentes
4. ✅ **Adicionar cancelamento automático** quando recebe mensagem
5. ⚠️ **Remover crons** do `vercel.json` (ou deixar apenas 1x/dia para verificação)
6. ⚠️ **Consolidar endpoints** redundantes
7. ⚠️ **Documentar** nova arquitetura

---

**Última atualização:** 2026-01-26  
**Status:** ✅ Pronto para implementação
