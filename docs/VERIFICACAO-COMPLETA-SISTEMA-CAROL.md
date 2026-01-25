# ✅ Verificação Completa do Sistema Carol

## 🎯 OBJETIVO
Verificar se Carol está respondendo corretamente, mantendo contexto e não repetindo informações.

---

## 📋 CHECKLIST DE VERIFICAÇÃO

### **1. TESTE DIRETO VIA WHATSAPP**

#### Teste Básico (30 segundos)
1. Envie mensagem para `5519997230912`: "Olá"
2. **Esperado:** Carol responde em até 10 segundos
3. **Se não responder:** Verificar logs (passo 2)

#### Teste de Contexto (2 minutos)
1. Envie: "Quero saber sobre a aula"
2. **Esperado:** Carol explica a aula e oferece opções
3. Envie: "Quero agendar"
4. **Esperado:** Carol envia opções SEM repetir explicação anterior
5. **Se repetir:** Problema de contexto (ver passo 4)

#### Teste de Continuidade (1 minuto)
1. Envie: "Olá"
2. Aguarde resposta
3. Envie: "Quero reagendar"
4. **Esperado:** Carol entende que é reagendamento e oferece novas opções
5. **Se não entender:** Problema de histórico (ver passo 4)

---

### **2. VERIFICAR LOGS DA VERCEL**

#### Acessar Logs
1. Vercel Dashboard → Projeto → Logs
2. Filtrar por: `[Carol AI]` ou `[Z-API Webhook]`

#### O que procurar:

**✅ SUCESSO:**
```
[Carol AI] 🚀 Iniciando processamento
[Carol AI] ✅ Resposta gerada
[Carol AI] 📤 Enviando resposta via Z-API
[Carol AI] 📤 Resultado do envio: { success: true }
```

**❌ ERROS COMUNS:**
```
[Carol AI] ❌ OPENAI_API_KEY não configurada
[Carol AI] ❌ Conversa não encontrada
[Carol AI] ❌ Instância Z-API não encontrada
[Z-API Webhook] ⚠️ Mensagem do número de notificação ignorada
```

**🔍 CONTEXTO:**
```
[Carol AI] 📜 Histórico de mensagens: {
  totalHistory: 5,
  usingLast: 5
}
```
- Se `totalHistory` for 0: Carol não está recebendo histórico
- Se `usingLast` for menor que o esperado: Problema de histórico

---

### **3. VERIFICAR BANCO DE DADOS**

#### Verificar se mensagens estão sendo salvas:

```sql
-- Últimas mensagens da Carol
SELECT 
  wm.created_at,
  wm.sender_type,
  wm.sender_name,
  wm.message,
  wc.phone,
  wc.name
FROM whatsapp_messages wm
JOIN whatsapp_conversations wc ON wm.conversation_id = wc.id
WHERE wm.sender_type = 'bot'
  AND wm.sender_name = 'Carol - Secretária'
ORDER BY wm.created_at DESC
LIMIT 10;
```

**O que verificar:**
- ✅ Mensagens aparecem com `sender_type = 'bot'`
- ✅ `sender_name = 'Carol - Secretária'`
- ✅ Mensagens têm conteúdo (não vazias)

#### Verificar histórico da conversa:

```sql
-- Histórico completo de uma conversa
SELECT 
  created_at,
  sender_type,
  sender_name,
  message,
  message_type
FROM whatsapp_messages
WHERE conversation_id = 'ID_DA_CONVERSA'
ORDER BY created_at ASC;
```

**O que verificar:**
- ✅ Mensagens do cliente (`sender_type = 'customer'`)
- ✅ Mensagens da Carol (`sender_type = 'bot'`)
- ✅ Ordem cronológica correta
- ✅ Últimas 10 mensagens estão presentes

#### Verificar contexto da conversa:

```sql
-- Contexto e tags da conversa
SELECT 
  id,
  phone,
  name,
  context,
  last_message_at,
  total_messages
FROM whatsapp_conversations
WHERE phone = '5519996049800'  -- Substituir pelo telefone de teste
ORDER BY last_message_at DESC
LIMIT 1;
```

**O que verificar:**
- ✅ `context.tags` contém tags relevantes
- ✅ `total_messages` está atualizado
- ✅ `last_message_at` é recente

---

### **4. VERIFICAR CONTEXTO E HISTÓRICO**

#### Problema: Carol repete informações

**Causa possível:** Histórico não está sendo enviado para OpenAI

**Verificar nos logs:**
```
[Carol AI] 📜 Histórico de mensagens: {
  totalHistory: 0,  ← PROBLEMA: Sem histórico
  usingLast: 0
}
```

**Solução:**
1. Verificar se mensagens estão sendo salvas no banco
2. Verificar se `conversationHistory` está sendo construído corretamente
3. Verificar se OpenAI está recebendo o histórico (ver logs completos)

#### Problema: Carol não entende continuidade

**Causa possível:** Histórico muito curto ou não incluído

**Verificar:**
- Logs mostram `usingLast: 10` (últimas 10 mensagens)
- Banco de dados tem pelo menos 10 mensagens na conversa
- Mensagens estão em ordem cronológica

---

### **5. VERIFICAR CONFIGURAÇÃO**

#### Variáveis de Ambiente:
```bash
# Verificar se está configurado
echo $OPENAI_API_KEY  # Deve retornar chave (não vazio)
```

#### Z-API:
1. Acessar painel Z-API
2. Verificar se "Ler mensagens automático" está **HABILITADO**
3. Verificar se webhook "Ao receber" está configurado
4. Verificar se webhook "Ao enviar" está configurado

#### Instância no Banco:
```sql
-- Verificar instância Z-API
SELECT 
  id,
  instance_id,
  name,
  area,
  status,
  is_active
FROM z_api_instances
WHERE area = 'nutri'
  AND is_active = true;
```

**O que verificar:**
- ✅ `status = 'connected'`
- ✅ `is_active = true`
- ✅ `instance_id` não é nulo

---

## 🧪 TESTE COMPLETO PASSO A PASSO

### **Cenário 1: Primeira Interação**
1. **Enviar:** "Olá"
2. **Esperado:** Carol se apresenta e oferece ajuda
3. **Verificar:**
   - ✅ Resposta em até 10 segundos
   - ✅ Mensagem salva no banco
   - ✅ Logs mostram sucesso

### **Cenário 2: Pergunta sobre Aula**
1. **Enviar:** "Quero saber mais sobre a aula"
2. **Esperado:** Carol explica a aula e oferece opções
3. **Verificar:**
   - ✅ Explica o que é a aula
   - ✅ Oferece opções de dias/horários
   - ✅ Não repete informações já ditas

### **Cenário 3: Continuidade (SEM REPETIR)**
1. **Enviar:** "Quero agendar"
2. **Esperado:** Carol envia opções SEM repetir explicação
3. **Verificar:**
   - ✅ NÃO repete o que é a aula
   - ✅ Apenas envia opções
   - ✅ Mantém contexto da conversa anterior

### **Cenário 4: Reagendamento**
1. **Enviar:** "Quero reagendar"
2. **Esperado:** Carol oferece novas opções
3. **Verificar:**
   - ✅ Entende que é reagendamento
   - ✅ Oferece novas opções
   - ✅ Não pergunta o que é reagendamento

---

## 🔍 DIAGNÓSTICO RÁPIDO

### **Carol não responde:**
1. ✅ Verificar logs: `[Carol AI] ❌ OPENAI_API_KEY não configurada`
2. ✅ Verificar Z-API: "Ler mensagens automático" habilitado
3. ✅ Verificar webhook: URL correta e funcionando

### **Carol responde mas repete:**
1. ✅ Verificar logs: `totalHistory` deve ser > 0
2. ✅ Verificar banco: Mensagens anteriores estão salvas
3. ✅ Verificar histórico: Últimas 10 mensagens estão sendo enviadas

### **Carol não entende contexto:**
1. ✅ Verificar histórico: Pelo menos 5-10 mensagens na conversa
2. ✅ Verificar ordem: Mensagens em ordem cronológica
3. ✅ Verificar tags: Contexto tem tags corretas

---

## 📊 RESUMO - ONDE VERIFICAR CADA COISA

| O que verificar | Onde verificar | Como verificar |
|---|---|---|
| **Carol responde?** | WhatsApp | Enviar mensagem e aguardar |
| **Respostas corretas?** | WhatsApp | Ler resposta e avaliar |
| **Mensagens salvas?** | Banco de dados | Query `whatsapp_messages` |
| **Contexto correto?** | Banco de dados | Query `whatsapp_conversations.context` |
| **Erros?** | Logs Vercel | Filtrar por `[Carol AI]` |
| **Histórico usado?** | Logs Vercel | Procurar `📜 Histórico de mensagens` |
| **Instância Z-API?** | Banco de dados | Query `z_api_instances` |
| **OpenAI configurado?** | Logs Vercel | Procurar `OPENAI_API_KEY` |

---

## ✅ CHECKLIST FINAL

Antes de considerar o sistema funcionando:

- [ ] Carol responde em até 10 segundos
- [ ] Mensagens são salvas no banco de dados
- [ ] Logs mostram sucesso (sem erros)
- [ ] Histórico está sendo usado (logs mostram `totalHistory > 0`)
- [ ] Carol não repete informações já ditas
- [ ] Carol entende continuidade da conversa
- [ ] Instância Z-API está conectada
- [ ] OpenAI API Key está configurada

---

## 🚨 PROBLEMAS COMUNS E SOLUÇÕES

### **Problema:** "Instância Z-API não encontrada"
**Solução:** Verificar se `instance_id` no webhook corresponde ao `instance_id` no banco

### **Problema:** "Conversa não encontrada"
**Solução:** Aguardar alguns segundos e tentar novamente (problema de timing)

### **Problema:** Carol não responde
**Solução:** 
1. Verificar "Ler mensagens automático" na Z-API
2. Verificar webhook "Ao receber" configurado
3. Verificar `OPENAI_API_KEY` configurada

### **Problema:** Carol repete informações
**Solução:**
1. Verificar se histórico está sendo enviado (logs)
2. Verificar se mensagens anteriores estão no banco
3. Aumentar `conversationHistory.slice(-10)` se necessário

---

**Última atualização:** 2026-01-25
**Versão:** 1.0
