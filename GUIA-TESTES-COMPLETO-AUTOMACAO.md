# 🧪 Guia Completo de Testes - Automação WhatsApp

**Data:** 2026-01-26  
**Status:** ✅ Sistema refatorado e pronto para testes

---

## 📍 ONDE TESTAR

### **Opção 1: Nova Interface (Recomendada)**
- **URL:** `/admin/whatsapp/automation`
- **Acesso:** Admin → WhatsApp → ⚙️ (ícone no topo) ou Admin → WhatsApp → Carol → "⚙️ Automação"

### **Opção 2: Interface Antiga (Compatibilidade)**
- **URL:** `/admin/whatsapp/carol`
- **Acesso:** Admin → WhatsApp → Carol - IA de Atendimento
- **Nota:** Agora tem link para nova interface e botões atualizados

---

## 🧪 TESTES A FAZER

### **TESTE 1: Agendar Boas-vindas**

**Onde:** `/admin/whatsapp/automation` ou `/admin/whatsapp/carol`

**Passo a Passo:**
1. Clique em **"Agendar Boas-vindas"** (ou "Disparar Boas-vindas" na interface antiga)
2. Aguarde processamento
3. Veja resultado:
   - **Agendadas:** Quantas mensagens foram agendadas
   - **Puladas:** Quantas foram puladas (já têm conversa)
   - **Erros:** Se houver algum erro

**O que verificar:**
- ✅ Se mostra números (mesmo que 0)
- ✅ Se não dá erro
- ✅ Se mensagens foram agendadas no banco

**Verificar no banco (opcional):**
```sql
SELECT COUNT(*) FROM whatsapp_scheduled_messages 
WHERE message_type = 'welcome' AND status = 'pending';
```

---

### **TESTE 2: Processar Mensagens Pendentes**

**Onde:** `/admin/whatsapp/automation` ou `/admin/whatsapp/carol`

**Passo a Passo:**
1. Clique em **"Verificar e Processar"** (ou "⚙️ Verificar e Processar Mensagens Agendadas")
2. Aguarde processamento
3. Veja resultado:
   - **Processadas:** Quantas foram processadas
   - **Enviadas:** Quantas foram enviadas com sucesso
   - **Falhadas:** Quantas falharam
   - **Canceladas:** Quantas foram canceladas (pessoa respondeu)

**O que verificar:**
- ✅ Se mostra números
- ✅ Se mensagens foram enviadas no WhatsApp
- ✅ Se aparecem no histórico da conversa

---

### **TESTE 3: Agendamento Automático de Pré-Aula**

**Onde:** `/admin/whatsapp/workshop`

**Passo a Passo:**
1. Vá para `/admin/whatsapp/workshop`
2. Adicione alguém a uma sessão futura
3. Aguarde 1-2 segundos
4. Verifique no banco:

```sql
SELECT 
  message_type,
  scheduled_for,
  status,
  created_at
FROM whatsapp_scheduled_messages 
WHERE conversation_id = 'ID_DA_CONVERSA'
ORDER BY scheduled_for;
```

**O que verificar:**
- ✅ Deve ter 4 mensagens agendadas:
  - `pre_class_24h` - 24h antes
  - `pre_class_12h` - 12h antes
  - `pre_class_2h` - 2h antes
  - `pre_class_30min` - 30min antes
- ✅ Todas com `status = 'pending'`
- ✅ Horários corretos (baseados na data da sessão)

---

### **TESTE 4: Cancelamento Automático**

**Onde:** Enviar mensagem do WhatsApp

**Passo a Passo:**
1. Agende uma mensagem (Teste 1)
2. Envie uma mensagem do WhatsApp para o número que foi agendado
3. Processe pendentes (Teste 2)
4. Verifique no banco:

```sql
SELECT * FROM whatsapp_scheduled_messages 
WHERE status = 'cancelled' 
AND cancelled_reason = 'user_responded'
ORDER BY cancelled_at DESC
LIMIT 5;
```

**O que verificar:**
- ✅ Mensagem foi cancelada (`status = 'cancelled'`)
- ✅ `cancelled_reason = 'user_responded'`
- ✅ Mensagem NÃO foi enviada (mesmo que estivesse agendada)

---

### **TESTE 5: Diagnóstico**

**Onde:** `/admin/whatsapp/automation`

**Passo a Passo:**
1. Clique em **"Fazer Diagnóstico"**
2. Abra o console do navegador (F12 → Console)
3. Veja os detalhes no console

**O que verificar:**
- ✅ Quantos leads há (últimos 7 dias e 30 dias)
- ✅ Quantas conversas existem
- ✅ Quantas mensagens estão agendadas
- ✅ Se há erros

---

## 📊 VERIFICAÇÕES NO BANCO

### **Ver Mensagens Agendadas:**
```sql
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

### **Ver Mensagens Pendentes:**
```sql
SELECT COUNT(*) 
FROM whatsapp_scheduled_messages 
WHERE status = 'pending' 
AND scheduled_for <= NOW();
```

### **Ver Mensagens Enviadas:**
```sql
SELECT COUNT(*) 
FROM whatsapp_scheduled_messages 
WHERE status = 'sent';
```

### **Ver Mensagens Canceladas:**
```sql
SELECT COUNT(*) 
FROM whatsapp_scheduled_messages 
WHERE status = 'cancelled';
```

---

## ✅ CHECKLIST DE TESTES

- [ ] **Teste 1:** Agendar boas-vindas funciona
- [ ] **Teste 2:** Processar pendentes funciona
- [ ] **Teste 3:** Agendamento automático de pré-aula funciona
- [ ] **Teste 4:** Cancelamento automático funciona
- [ ] **Teste 5:** Diagnóstico mostra informações corretas
- [ ] **Verificação:** Mensagens aparecem no WhatsApp
- [ ] **Verificação:** Mensagens aparecem no histórico
- [ ] **Verificação:** Cancelamento funciona quando pessoa responde

---

## 🎯 RESULTADO ESPERADO

Se todos os testes passarem:
- ✅ Sistema de agendamento funcionando
- ✅ Worker processando mensagens
- ✅ Cancelamento automático funcionando
- ✅ Agendamento automático de pré-aula funcionando
- ✅ Interface funcionando (antiga e nova)

---

**Última atualização:** 2026-01-26
