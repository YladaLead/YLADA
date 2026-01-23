# 🤖 Carol - IA de Atendimento WhatsApp Completo

## 🎯 VISÃO GERAL

Sistema completo de automação com OpenAI para atendimento WhatsApp, recepção, remarketing e recuperação de vendas.

---

## ✅ FUNCIONALIDADES IMPLEMENTADAS

### **1. Resposta Automática (Carol IA)**

**Quando:** Pessoa envia mensagem no WhatsApp

**Como funciona:**
- Carol analisa a mensagem com OpenAI
- Usa contexto da conversa (tags, histórico, sessões)
- Gera resposta personalizada
- Envia automaticamente
- Salva no banco como "Carol - Secretária"

**Onde:** Integrado no webhook `/api/webhooks/z-api`

---

### **2. Disparo de Boas-vindas**

**Quando:** Pessoa preencheu workshop mas não chamou no WhatsApp

**Como funciona:**
- Busca leads dos últimos 7 dias
- Verifica se não têm conversa ativa
- Envia mensagem com opções de aula
- Adiciona tags automaticamente

**Como disparar:**
- Manual: `/admin/whatsapp/carol` → Botão "Disparar Boas-vindas"
- Automático: Cron job (configurar no Vercel)

---

### **3. Disparo de Remarketing**

**Quando:** Pessoa agendou mas não participou da aula

**Como funciona:**
- Busca conversas com tag "nao_participou_aula" ou "adiou_aula"
- Envia mensagem empática oferecendo novas opções
- Adiciona tag "recebeu_segundo_link"

**Como disparar:**
- Manual: `/admin/whatsapp/carol` → Botão "Disparar Remarketing"
- Automático: Cron job (configurar no Vercel)

---

### **4. Filtros de Agendadas**

**Onde:** `/admin/whatsapp/agendadas`

**Filtros disponíveis:**
- Por data (YYYY-MM-DD)
- Por hora (HH:MM)
- Por sessão específica

**Visualização:**
- Agrupado por data/hora
- Mostra quantas pessoas agendaram
- Link direto para cada conversa

---

## 🔧 CONFIGURAÇÃO

### **1. OpenAI API Key**

Adicione no `.env.local`:
```
OPENAI_API_KEY=sk-...
```

### **2. Cron Jobs (Opcional - Automático)**

No `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/whatsapp-carol?tipo=welcome",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/cron/whatsapp-carol?tipo=remarketing",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

E adicione no `.env.local`:
```
CRON_SECRET=sua-chave-secreta-aqui
```

---

## 📋 FLUXOS COMPLETOS

### **Fluxo 1: Pessoa Preenche e Chama no WhatsApp**

```
1. Pessoa preenche formulário
   ↓
2. Sistema envia mensagem automática (com opções)
   ↓
3. Pessoa responde no WhatsApp
   ↓
4. Carol (IA) responde automaticamente
   ↓
5. Conversa continua com Carol
```

---

### **Fluxo 2: Pessoa Preenche mas NÃO Chama**

```
1. Pessoa preenche formulário
   ↓
2. Sistema envia mensagem automática (com opções)
   ↓
3. Pessoa NÃO responde
   ↓
4. Após 1-2 horas: Disparo automático de boas-vindas
   ↓
5. Se responder: Carol atende
   ↓
6. Se não responder: Continuar remarketing
```

---

### **Fluxo 3: Pessoa Agenda mas NÃO Participa**

```
1. Pessoa recebe opções de aula
   ↓
2. Você adiciona tag "recebeu_link_workshop"
   ↓
3. Data da aula passa
   ↓
4. Você adiciona tag "nao_participou_aula"
   ↓
5. Disparo automático de remarketing
   ↓
6. Oferece novas opções de aula
   ↓
7. Adiciona tag "recebeu_segundo_link"
```

---

## 🎯 COMO USAR

### **1. Ver Agendadas por Data/Hora**

1. Acesse `/admin/whatsapp/agendadas`
2. Filtre por data, hora ou sessão
3. Veja quantas pessoas agendaram
4. Clique em "Ver Conversa" para cada uma

---

### **2. Disparar Boas-vindas Manualmente**

1. Acesse `/admin/whatsapp/carol`
2. Clique em "Disparar Boas-vindas"
3. Aguarde processamento
4. Veja quantas foram enviadas

---

### **3. Disparar Remarketing Manualmente**

1. Acesse `/admin/whatsapp/carol`
2. Clique em "Disparar Remarketing"
3. Aguarde processamento
4. Veja quantas foram enviadas

---

### **4. Ver Respostas da Carol**

1. Acesse `/admin/whatsapp`
2. Abra qualquer conversa
3. Mensagens da Carol aparecem como "Carol - Secretária"
4. Ela responde automaticamente quando pessoa envia mensagem

---

## 🤖 COMO A CAROL FUNCIONA

### **Contexto que Carol Usa:**

1. **Tags da conversa:**
   - `veio_aula_pratica` → Sabe que veio do formulário
   - `recebeu_link_workshop` → Sabe que já recebeu link
   - `participou_aula` → Sabe que participou
   - `nao_participou_aula` → Sabe que não participou
   - Etc.

2. **Histórico de mensagens:**
   - Últimas 6 mensagens da conversa
   - Entende contexto do que foi falado

3. **Sessões disponíveis:**
   - Próximas 2 sessões de workshop
   - Data, hora e link do Zoom

4. **Status da pessoa:**
   - Nome (se disponível)
   - Se já agendou
   - Se participou ou não

---

## 📊 RELATÓRIOS E DIAGNÓSTICOS

### **Ver Agendadas:**
- `/admin/whatsapp/agendadas` → Filtro por data/hora

### **Ver Relatórios:**
- `/admin/whatsapp/relatorios` → Índices e diagnósticos

### **Ver Conversas:**
- `/admin/whatsapp` → Todas as conversas com tags

---

## ⚙️ CONFIGURAÇÃO AVANÇADA

### **Ajustar Prompt da Carol:**

Edite: `src/lib/whatsapp-carol-ai.ts` → `CAROL_SYSTEM_PROMPT`

### **Ajustar Frequência de Disparos:**

Edite: `vercel.json` → `crons` (se usar cron jobs)

### **Desabilitar Resposta Automática:**

Comente a parte de Carol no webhook: `src/app/api/webhooks/z-api/route.ts`

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ Sistema criado e integrado
2. ⏳ Configurar cron jobs (opcional)
3. ⏳ Testar respostas da Carol
4. ⏳ Ajustar prompt se necessário
5. ⏳ Monitorar resultados

---

## 📝 NOTAS IMPORTANTES

- **Carol responde automaticamente** para TODAS as mensagens recebidas
- **Disparos manuais** podem ser feitos a qualquer momento
- **Filtros de agendadas** ajudam a organizar por data/hora
- **Tags são atualizadas automaticamente** pelos disparos
- **Sistema funciona 24/7** quando configurado

---

## ✅ PRONTO PARA USAR!

O sistema está completo e integrado. Teste e ajuste conforme necessário! 🚀
