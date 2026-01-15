# 📱 Guia Completo: Integração Z-API com WhatsApp

## 🎯 O QUE É Z-API?

**Z-API** é uma **API RESTful brasileira** que permite:
- ✅ Enviar mensagens via WhatsApp (individual ou em massa)
- ✅ Receber mensagens via webhooks
- ✅ Integrar com sistemas (CRMs, ERPs, automações)
- ✅ Usar o seu próprio número de WhatsApp
- ✅ Envio em massa com filas inteligentes
- ✅ Notificações em tempo real

**Site oficial:** https://www.z-api.io  
**Documentação:** https://developer.z-api.io

---

## ✅ RESPONDENDO SUAS PERGUNTAS

### **1. Como integrar a Z-API aqui no WhatsApp?**

A integração é feita via **API REST** (chamadas HTTP). Você não precisa instalar nada no WhatsApp, apenas:

1. **Criar conta na Z-API**
   - Acesse: https://www.z-api.io
   - Crie sua conta
   - Crie uma "instância" (uma conexão com seu WhatsApp)

2. **Conectar seu número de WhatsApp**
   - A Z-API gera um **QR Code**
   - Você escaneia com seu WhatsApp (igual WhatsApp Web)
   - O número fica conectado à API

3. **Obter credenciais**
   - `instanceId`: ID da sua instância
   - `token`: Token de autenticação
   - `phoneNumberId`: ID do número conectado

4. **Fazer chamadas HTTP**
   - Enviar mensagens: `POST https://api.z-api.io/instances/{instanceId}/token/{token}/send-text`
   - Receber mensagens: Configurar webhook

---

### **2. Vai funcionar no número que eu determinar?**

**SIM! ✅** 

Você escolhe **qual número de WhatsApp** vai usar:
- Pode ser seu número pessoal
- Pode ser número de empresa
- Pode ser qualquer número que você tenha acesso

**Como funciona:**
1. Você cria a instância na Z-API
2. Escaneia o QR Code com o WhatsApp do número escolhido
3. Aquele número fica conectado à API
4. Todas as mensagens saem daquele número

**Importante:**
- O número precisa estar **online** (celular ligado, WhatsApp conectado)
- Se o celular desligar, as mensagens ficam na fila até voltar
- Você pode ter **múltiplas instâncias** (múltiplos números)

---

### **3. Consegue fazer envio em massa?**

**SIM! ✅** 

A Z-API tem sistema de **filas (queue)** para envio em massa:

**Como funciona:**
- Você envia uma requisição para cada mensagem
- A Z-API enfileira as mensagens automaticamente
- Envia com **intervalo de 1 a 3 segundos** entre cada uma (simula comportamento humano)
- Se o celular estiver offline, aguarda até voltar

**Exemplo de envio em massa:**
```javascript
// Para cada contato na sua lista
const contatos = [
  { nome: "João", telefone: "5511999999999" },
  { nome: "Maria", telefone: "5511888888888" },
  // ... mais contatos
]

for (const contato of contatos) {
  await fetch(`https://api.z-api.io/instances/${instanceId}/token/${token}/send-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone: contato.telefone,
      message: `Olá ${contato.nome}, tudo bem?`
    })
  })
  
  // Delay automático de 1-3 segundos entre mensagens
  await new Promise(resolve => setTimeout(resolve, 2000))
}
```

**Limites:**
- Fila pode armazenar até **1000 mensagens** quando offline
- Velocidade limitada pelos delays (evita bloqueio)
- Recomendado: **máximo 100-200 mensagens por hora** para evitar bloqueios

---

### **4. É possível notificar outro telefone quando alguém está falando?**

**SIM! ✅** 

Você pode configurar **webhooks** para receber notificações quando:
- Alguém envia mensagem para o número conectado
- Mensagem é entregue
- Mensagem é lida
- Status muda

**Como funciona:**

1. **Configurar webhook na Z-API**
   - URL do seu servidor (ex: `https://seu-site.com/api/webhooks/z-api`)
   - Eventos que você quer receber (mensagens, entregas, leituras)

2. **Criar endpoint no seu sistema**
   ```typescript
   // /api/webhooks/z-api/route.ts
   export async function POST(request: NextRequest) {
     const body = await request.json()
     
     // body contém: phone, message, timestamp, etc.
     const { phone, message, timestamp } = body
     
     // Notificar outro telefone
     await sendNotificationToAnotherPhone({
       to: "5511999999999", // Seu número de notificação
       message: `Nova mensagem de ${phone}: ${message}`
     })
     
     return NextResponse.json({ received: true })
   }
   ```

3. **Enviar notificação para outro número**
   - Pode usar a própria Z-API (outra instância)
   - Pode usar Telegram (mais simples)
   - Pode usar SMS
   - Pode usar email

**Exemplo completo:**
```typescript
// Quando receber mensagem via webhook
async function handleIncomingMessage(data: any) {
  const { phone, message, name } = data
  
  // Notificar seu número pessoal
  await sendWhatsAppViaZAPI({
    instanceId: "sua-instancia-notificacao",
    token: "seu-token-notificacao",
    to: "5511999999999", // Seu número
    message: `🔔 Nova mensagem!\n\nDe: ${name || phone}\nMensagem: ${message}`
  })
}
```

---

## 🔧 COMO IMPLEMENTAR (PASSO A PASSO)

### **ETAPA 1: Criar Conta e Instância**

1. Acesse: https://www.z-api.io
2. Crie sua conta
3. Vá em "Instâncias" → "Criar Nova Instância"
4. Escolha um nome (ex: "Meu WhatsApp Principal")
5. **Copie o `instanceId` e `token`** que aparecem

### **ETAPA 2: Conectar WhatsApp**

1. Na instância criada, clique em "Conectar"
2. Aparece um **QR Code**
3. Abra o WhatsApp no celular do número que você quer usar
4. Vá em "Dispositivos Conectados" → "Conectar um Dispositivo"
5. Escaneie o QR Code
6. ✅ Pronto! Número conectado

### **ETAPA 3: Configurar Variáveis de Ambiente**

Adicione no `.env.local`:
```env
# Z-API Configuração
Z_API_INSTANCE_ID=sua-instance-id-aqui
Z_API_TOKEN=seu-token-aqui
Z_API_BASE_URL=https://api.z-api.io

# Número para receber notificações (quando alguém fala)
Z_API_NOTIFICATION_PHONE=5511999999999
```

### **ETAPA 4: Criar Função de Envio**

```typescript
// src/lib/z-api.ts
export async function sendWhatsAppMessage(
  to: string,
  message: string,
  options?: {
    delayMessage?: number // Delay em segundos (opcional)
  }
) {
  const instanceId = process.env.Z_API_INSTANCE_ID
  const token = process.env.Z_API_TOKEN
  const baseUrl = process.env.Z_API_BASE_URL || 'https://api.z-api.io'
  
  if (!instanceId || !token) {
    throw new Error('Z-API não configurada. Configure Z_API_INSTANCE_ID e Z_API_TOKEN')
  }
  
  const response = await fetch(
    `${baseUrl}/instances/${instanceId}/token/${token}/send-text`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: to.replace(/\D/g, ''), // Remove caracteres não numéricos
        message: message,
        delayMessage: options?.delayMessage || 2, // Delay padrão de 2 segundos
      }),
    }
  )
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Erro ao enviar WhatsApp: ${error.message || 'Erro desconhecido'}`)
  }
  
  return await response.json()
}
```

### **ETAPA 5: Criar Endpoint para Webhook**

```typescript
// src/app/api/webhooks/z-api/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { sendWhatsAppMessage } from '@/lib/z-api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Dados que vêm do webhook da Z-API
    const { phone, message, name, timestamp } = body
    
    // Notificar outro telefone (se configurado)
    const notificationPhone = process.env.Z_API_NOTIFICATION_PHONE
    
    if (notificationPhone) {
      await sendWhatsAppMessage(
        notificationPhone,
        `🔔 Nova mensagem recebida!\n\n👤 De: ${name || phone}\n💬 Mensagem: ${message}\n⏰ ${new Date(timestamp).toLocaleString('pt-BR')}`
      )
    }
    
    // Salvar no banco (opcional)
    // await saveMessageToDatabase({ phone, message, timestamp })
    
    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('[Z-API Webhook] Erro:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

### **ETAPA 6: Configurar Webhook na Z-API**

1. Acesse sua instância na Z-API
2. Vá em "Webhooks" ou "Configurações"
3. Adicione a URL: `https://seu-site.com/api/webhooks/z-api`
4. Selecione os eventos:
   - ✅ Mensagens recebidas
   - ✅ Mensagens entregues
   - ✅ Mensagens lidas
5. Salve

---

## 📊 ENVIO EM MASSA - EXEMPLO COMPLETO

```typescript
// src/app/api/whatsapp/send-bulk/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { sendWhatsAppMessage } from '@/lib/z-api'

export async function POST(request: NextRequest) {
  try {
    const { contacts, message } = await request.json()
    
    // Array para armazenar resultados
    const results = []
    
    // Enviar para cada contato
    for (const contact of contacts) {
      try {
        // Personalizar mensagem (ex: substituir {{nome}})
        const personalizedMessage = message.replace('{{nome}}', contact.nome)
        
        // Enviar mensagem
        const result = await sendWhatsAppMessage(
          contact.telefone,
          personalizedMessage,
          { delayMessage: 2 } // 2 segundos entre cada mensagem
        )
        
        results.push({
          telefone: contact.telefone,
          status: 'enviado',
          messageId: result.id
        })
        
        // Delay entre mensagens (já tem delay na função, mas pode adicionar mais)
        await new Promise(resolve => setTimeout(resolve, 1000))
        
      } catch (error: any) {
        results.push({
          telefone: contact.telefone,
          status: 'erro',
          error: error.message
        })
      }
    }
    
    return NextResponse.json({
      success: true,
      total: contacts.length,
      results: results
    })
    
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

---

## 💰 CUSTOS

**Z-API oferece planos:**
- **Plano Gratuito:** Limitado (poucas mensagens)
- **Plano Básico:** ~R$ 50-100/mês (até X mensagens)
- **Plano Profissional:** ~R$ 200-500/mês (mensagens ilimitadas ou volume alto)

**Recomendação:**
- Comece com plano básico
- Monitore uso
- Aumente conforme necessidade

---

## ⚠️ CUIDADOS E BOAS PRÁTICAS

### **1. Evitar Bloqueios**
- ✅ Use listas com **consentimento** (opt-in)
- ✅ Não envie spam
- ✅ Respeite horários comerciais (8h-20h)
- ✅ Use delays entre mensagens (1-3 segundos)
- ✅ Limite volume (máx 100-200/hora)

### **2. Conteúdo**
- ✅ Evite links suspeitos
- ✅ Não envie conteúdo ofensivo
- ✅ Use templates aprovados quando possível
- ✅ Personalize mensagens

### **3. Monitoramento**
- ✅ Monitore taxa de entrega
- ✅ Monitore bloqueios
- ✅ Acompanhe leituras
- ✅ Registre logs de erros

---

## 🎯 RESUMO DAS SUAS PERGUNTAS

| Pergunta | Resposta |
|----------|----------|
| **Como integrar?** | Via API REST, criar instância, conectar WhatsApp, fazer chamadas HTTP |
| **Funciona no número que eu escolher?** | ✅ SIM - Você escolhe qual número conectar |
| **Consegue envio em massa?** | ✅ SIM - Sistema de filas com delays automáticos |
| **Pode notificar outro telefone?** | ✅ SIM - Via webhooks, você recebe notificações e pode enviar para outro número |

---

## 📝 PRÓXIMOS PASSOS

**Se quiser que eu implemente:**

1. **Me diga:**
   - Você já tem conta na Z-API?
   - Qual número você quer usar?
   - Você quer envio em massa ou apenas notificações?

2. **Eu implemento:**
   - Função de envio de mensagens
   - Endpoint de webhook para receber mensagens
   - Sistema de notificações para outro telefone
   - Função de envio em massa
   - Integração com seu sistema atual

3. **Você configura:**
   - Variáveis de ambiente
   - Webhook na Z-API
   - Testa e valida

---

## 🔗 LINKS ÚTEIS

- **Site Z-API:** https://www.z-api.io
- **Documentação:** https://developer.z-api.io
- **Dashboard:** https://app.z-api.io
- **Suporte:** Via chat no site ou email

---

## 💡 DICA EXTRA

**Enquanto não implementa:**
- Você pode testar manualmente via Postman ou Insomnia
- Use a documentação da Z-API para fazer testes
- Valide o fluxo antes de integrar no sistema

**Quando implementar:**
- Comece com poucas mensagens
- Teste webhook localmente (use ngrok)
- Monitore logs e erros
- Aumente volume gradualmente
