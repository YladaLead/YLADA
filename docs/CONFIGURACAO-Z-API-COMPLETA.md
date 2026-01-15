# 📱 Configuração Completa Z-API WhatsApp

## ✅ O QUE FOI IMPLEMENTADO

### 1. **Biblioteca Z-API** (`src/lib/z-api.ts`)
- ✅ Cliente Z-API completo
- ✅ Envio de mensagens individuais
- ✅ Envio em massa com delays automáticos
- ✅ Verificação de status da instância

### 2. **Webhook** (`src/app/api/webhooks/z-api/route.ts`)
- ✅ Recebe mensagens da Z-API
- ✅ Identifica área automaticamente (Nutri/Wellness)
- ✅ Salva conversas e mensagens no banco
- ✅ Notifica administradores

### 3. **APIs de Conversas**
- ✅ `GET /api/whatsapp/conversations` - Lista conversas
- ✅ `GET /api/whatsapp/conversations/[id]/messages` - Lista mensagens
- ✅ `POST /api/whatsapp/conversations/[id]/messages` - Envia mensagem

### 4. **Interface Administrativa** (`/admin/whatsapp`)
- ✅ Lista de conversas em tempo real
- ✅ Chat em tempo real
- ✅ Filtros por área (Nutri/Wellness)
- ✅ Contador de não lidas
- ✅ Atualização automática

### 5. **Banco de Dados**
- ✅ Tabelas criadas (migration `178-criar-tabelas-whatsapp-z-api.sql`)
- ✅ Conversas, mensagens, notificações
- ✅ Índices e triggers configurados

---

## 🚀 PASSO A PASSO DE CONFIGURAÇÃO

### **ETAPA 1: Executar Migration**

Execute a migration no Supabase:

```sql
-- Arquivo: migrations/178-criar-tabelas-whatsapp-z-api.sql
-- Execute no SQL Editor do Supabase
```

### **ETAPA 2: Configurar Variáveis de Ambiente**

Adicione no `.env.local` e na Vercel:

```env
# Z-API Configuração
Z_API_INSTANCE_ID=sua-instance-id-aqui
Z_API_TOKEN=seu-token-aqui
Z_API_BASE_URL=https://api.z-api.io

# Número para receber notificações (opcional)
Z_API_NOTIFICATION_PHONE=5511999999999
```

**Onde encontrar:**
- Acesse sua instância na Z-API
- Copie o **Instance ID** e **Token**
- Cole nas variáveis acima

### **ETAPA 3: Cadastrar Instância no Banco**

Execute no SQL Editor do Supabase:

```sql
INSERT INTO z_api_instances (
  name,
  instance_id,
  token,
  area,
  phone_number,
  status
) VALUES (
  'Ylada Nutri', -- Nome da instância
  'SEU_INSTANCE_ID_AQUI', -- Instance ID da Z-API
  'SEU_TOKEN_AQUI', -- Token da Z-API
  'nutri', -- Área: 'nutri', 'wellness', etc.
  '5511999999999', -- Número de WhatsApp conectado
  'connected' -- Status: 'connected' ou 'disconnected'
);
```

**Para múltiplas instâncias:**
```sql
-- Instância Nutri
INSERT INTO z_api_instances (name, instance_id, token, area, status)
VALUES ('Ylada Nutri', 'INSTANCE_ID_NUTRI', 'TOKEN_NUTRI', 'nutri', 'connected');

-- Instância Wellness
INSERT INTO z_api_instances (name, instance_id, token, area, status)
VALUES ('Ylada Wellness', 'INSTANCE_ID_WELLNESS', 'TOKEN_WELLNESS', 'wellness', 'connected');
```

### **ETAPA 4: Configurar Webhook na Z-API**

1. Acesse sua instância na Z-API
2. Vá em **"Webhooks"** ou **"Configurações"**
3. Configure a URL do webhook:
   ```
   https://seu-site.com/api/webhooks/z-api
   ```
4. Selecione os eventos:
   - ✅ **Ao receber** (On receive) - OBRIGATÓRIO
   - ✅ Receber status da mensagem (opcional)
   - ✅ Ao conectar (opcional)
   - ✅ Ao desconectar (opcional)
5. Salve

**Para desenvolvimento local (teste):**
- Use **ngrok** para expor sua URL local
- Configure o webhook com a URL do ngrok

### **ETAPA 5: Testar**

1. **Acesse a interface:**
   - Vá em `/admin/whatsapp`
   - Você deve ver a lista de conversas (vazia inicialmente)

2. **Envie uma mensagem de teste:**
   - Envie uma mensagem do WhatsApp para o número conectado
   - A mensagem deve aparecer na interface em alguns segundos

3. **Responda uma mensagem:**
   - Selecione uma conversa
   - Digite uma mensagem e clique em "Enviar"
   - A mensagem deve ser enviada via Z-API

---

## 📋 FUNCIONALIDADES

### **1. Recebimento Automático**
- Quando alguém envia mensagem → Webhook recebe
- Sistema identifica área (Nutri/Wellness)
- Salva no banco automaticamente
- Notifica você (se configurado)

### **2. Interface de Chat**
- Lista todas as conversas
- Filtro por área
- Contador de não lidas
- Chat em tempo real
- Atualização automática a cada 3-5 segundos

### **3. Envio de Mensagens**
- Digite e envie direto pela interface
- Mensagem vai via Z-API
- Salva no banco automaticamente
- Atualiza a conversa em tempo real

### **4. Identificação Automática de Área**
O sistema identifica a área de 3 formas:
1. **Busca no banco** (telefone em leads/conversas anteriores)
2. **Análise de palavras-chave** (Herbalife → Wellness, Nutrição → Nutri)
3. **Pergunta ao cliente** (se não identificar)

---

## 🔧 USO PROGRAMÁTICO

### **Enviar Mensagem Individual**

```typescript
import { sendWhatsAppMessage } from '@/lib/z-api'

await sendWhatsAppMessage(
  '5511999999999', // Telefone
  'Olá! Como posso ajudar?', // Mensagem
  'INSTANCE_ID', // Opcional (usa env se não informar)
  'TOKEN' // Opcional (usa env se não informar)
)
```

### **Envio em Massa**

```typescript
import { createZApiClient } from '@/lib/z-api'

const client = createZApiClient()

const contacts = [
  { phone: '5511999999999', message: 'Olá {{nome}}!', name: 'João' },
  { phone: '5511888888888', message: 'Olá {{nome}}!', name: 'Maria' },
]

const result = await client.sendBulkMessages(contacts, {
  delayBetweenMessages: 2, // 2 segundos entre cada mensagem
  onProgress: (sent, total) => {
    console.log(`Enviado: ${sent}/${total}`)
  }
})

console.log(`Sucesso: ${result.success}, Falhas: ${result.failed}`)
```

---

## 📊 ESTRUTURA DO BANCO

### **Tabelas Criadas:**

1. **`z_api_instances`** - Instâncias Z-API configuradas
2. **`whatsapp_conversations`** - Conversas com clientes
3. **`whatsapp_messages`** - Mensagens individuais
4. **`whatsapp_notifications`** - Notificações para admins

### **Relacionamentos:**
```
z_api_instances (1) ──→ (N) whatsapp_conversations
whatsapp_conversations (1) ──→ (N) whatsapp_messages
whatsapp_conversations (1) ──→ (N) whatsapp_notifications
```

---

## 🎯 PRÓXIMOS PASSOS (Opcional)

### **1. Integração com Bots**
- Conectar com NOEL (Wellness)
- Conectar com bot Nutri
- Respostas automáticas

### **2. Upload de Planilhas**
- Interface para upload CSV/Excel
- Envio em massa automático
- Personalização de mensagens

### **3. Analytics**
- Relatórios de conversas
- Métricas de atendimento
- Tempo de resposta

### **4. Atribuição de Agentes**
- Atribuir conversas a atendentes
- Histórico por agente
- Métricas por agente

---

## ⚠️ IMPORTANTE

### **Segurança:**
- ✅ Tokens são armazenados no banco (criptografar se necessário)
- ✅ Apenas admins podem acessar `/admin/whatsapp`
- ✅ Webhook valida payload (adicionar validação de assinatura se necessário)

### **Performance:**
- ✅ Índices criados no banco
- ✅ Atualização em tempo real (polling a cada 3-5s)
- ✅ Considerar WebSockets para melhor performance (futuro)

### **Limites:**
- ⚠️ Z-API tem limites de mensagens por plano
- ⚠️ Respeitar delays entre mensagens (evitar bloqueios)
- ⚠️ Máximo recomendado: 100-200 mensagens/hora

---

## 🐛 TROUBLESHOOTING

### **Mensagens não aparecem:**
1. Verifique se webhook está configurado na Z-API
2. Verifique logs do servidor (`/api/webhooks/z-api`)
3. Verifique se instância está "connected" no banco

### **Erro ao enviar mensagem:**
1. Verifique se Instance ID e Token estão corretos
2. Verifique se instância está conectada na Z-API
3. Verifique logs do servidor

### **Área não identificada:**
1. Verifique se telefone está cadastrado em `leads`
2. Adicione palavras-chave na função `identifyArea`
3. Sistema pergunta ao cliente se não identificar

---

## 📞 SUPORTE

Se tiver problemas:
1. Verifique logs do servidor
2. Verifique configuração na Z-API
3. Verifique variáveis de ambiente
4. Teste webhook manualmente (Postman/Insomnia)

---

## ✅ CHECKLIST DE CONFIGURAÇÃO

- [ ] Migration executada no Supabase
- [ ] Variáveis de ambiente configuradas
- [ ] Instância cadastrada no banco
- [ ] Webhook configurado na Z-API
- [ ] Teste de recebimento funcionando
- [ ] Teste de envio funcionando
- [ ] Interface `/admin/whatsapp` acessível

---

**Pronto! Sistema completo de WhatsApp integrado! 🎉**
