# 🤖 Como Usar o Sistema de Automação WhatsApp

## 🎯 VISÃO GERAL

O sistema de automação permite:
1. **Enviar mensagens automáticas** (respostas, boas-vindas, sequências)
2. **Controlar quando notificar** (horários, palavras-chave, prioridades)

---

## 📋 COMO FUNCIONA

### **1. Automação de Envio de Mensagens**

Quando uma mensagem chega, o sistema:
1. Verifica regras de automação ativas
2. Checa se as condições são atendidas
3. Executa a ação (envia mensagem, marca tag, etc.)

### **2. Notificações Inteligentes**

Antes de notificar, o sistema:
1. Verifica regras de notificação
2. Checa horário, palavras-chave, etc.
3. Notifica apenas se as condições forem atendidas

---

## 🚀 COMEÇAR A USAR

### **Passo 1: Criar Tabelas no Banco**

Execute a migration:
```sql
-- Arquivo: migrations/184-criar-tabelas-automacao-whatsapp.sql
```

### **Passo 2: Criar Primeira Regra de Automação**

**Exemplo: Mensagem de Boas-vindas**

```sql
INSERT INTO whatsapp_automation_rules (
  name,
  area,
  trigger_type,
  trigger_conditions,
  action_type,
  action_data,
  is_active,
  priority
) VALUES (
  'Boas-vindas Nutri',
  'nutri',
  'first_message',
  '{}',
  'send_message',
  '{
    "message": "Olá! 👋\n\nObrigado por entrar em contato com a Ylada Nutri.\n\nEm breve nossa equipe responderá sua mensagem.\n\nAtenciosamente,\nEquipe Ylada"
  }',
  true,
  10
);
```

### **Passo 3: Criar Regra de Notificação**

**Exemplo: Notificar apenas em horário comercial**

```sql
INSERT INTO whatsapp_notification_rules (
  name,
  area,
  conditions,
  notification_method,
  notification_phone,
  is_active,
  priority
) VALUES (
  'Horário Comercial',
  'nutri',
  '{
    "hours": [9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
  }',
  'whatsapp',
  '5519981868000',
  true,
  10
);
```

---

## 📝 TIPOS DE TRIGGERS

### **1. `first_message`** - Primeira Mensagem
- Aciona quando é a primeira mensagem da conversa
- Útil para: boas-vindas, apresentação

### **2. `keyword`** - Palavras-chave
- Aciona quando mensagem contém palavras-chave
- Exemplo: `{"keywords": ["preço", "valor", "quanto custa"]}`

### **3. `time_based`** - Baseado em Horário
- Aciona em horários específicos
- Exemplo: `{"hours": [9, 10, 11, 14, 15, 16, 17]}`

### **4. `ai_based`** - Baseado em IA
- (A implementar) Aciona baseado em análise de IA

---

## 🎯 TIPOS DE AÇÕES

### **1. `send_message`** - Enviar Mensagem
```json
{
  "message": "Texto da mensagem",
  "message_template_id": "uuid-do-template" // Opcional
}
```

### **2. `tag`** - Marcar Conversa
```json
{
  "tags": ["interessado", "nutri"]
}
```

### **3. `assign`** - Atribuir a Admin
```json
{
  "user_id": "uuid-do-admin"
}
```

### **4. `forward`** - Encaminhar
```json
{
  "phone": "5511999999999"
}
```

---

## 🔔 REGRAS DE NOTIFICAÇÃO

### **Condições Disponíveis:**

```json
{
  "hours": [9, 10, 11, 14, 15, 16, 17],  // Horários permitidos (0-23)
  "keywords": ["urgente", "emergência"],  // Palavras-chave obrigatórias
  "exclude_keywords": ["spam", "teste"], // Palavras-chave que não devem notificar
  "min_importance": 5                     // Nível mínimo de importância (0-10)
}
```

---

## 📊 EXEMPLOS PRÁTICOS

### **Exemplo 1: Resposta Automática para "Preço"**

```sql
INSERT INTO whatsapp_automation_rules (
  name, area, trigger_type, trigger_conditions, action_type, action_data, is_active, priority
) VALUES (
  'Resposta Preço',
  'nutri',
  'keyword',
  '{"keywords": ["preço", "valor", "quanto custa", "quanto é"]}',
  'send_message',
  '{"message": "Olá! 😊\n\nO investimento no Ylada Nutri é de R$ 497/mês.\n\nQuer saber mais detalhes?"}',
  true,
  5
);
```

### **Exemplo 2: Notificar Apenas Urgências Fora do Horário**

```sql
INSERT INTO whatsapp_notification_rules (
  name, area, conditions, notification_method, notification_phone, is_active, priority
) VALUES (
  'Urgências 24h',
  'nutri',
  '{"keywords": ["urgente", "emergência", "preciso agora"]}',
  'whatsapp',
  '5519981868000',
  true,
  20  -- Alta prioridade
);
```

---

## 🧪 TESTAR

1. Execute as migrations
2. Crie uma regra de teste
3. Envie mensagem de teste para `5519997230912`
4. Verifique se a automação foi executada nos logs

---

## 📈 PRÓXIMOS PASSOS

- [ ] Interface admin para gerenciar regras
- [ ] Templates de mensagens
- [ ] Integração com IA para respostas inteligentes
- [ ] Sequências de mensagens (drip campaigns)
- [ ] Analytics de automações

---

**Status:** 🚧 Em desenvolvimento - Estrutura básica pronta!
