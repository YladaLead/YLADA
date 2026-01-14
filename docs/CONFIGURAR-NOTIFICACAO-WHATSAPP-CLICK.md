# 📱 Como Configurar Notificação de Clique no WhatsApp

## 🎯 O que foi implementado

Sistema de notificação que avisa você quando alguém clica no botão WhatsApp na página de vendas do Wellness System.

---

## 🔔 Opções de Notificação

### ✅ **OPÇÃO 1: Telegram (Recomendado - Gratuito e Simples)**

O sistema envia uma mensagem no Telegram quando alguém clica no botão WhatsApp.

#### **Passo 1: Criar Bot no Telegram**

1. Abra o Telegram e procure por **@BotFather**
2. Envie o comando: `/newbot`
3. Escolha um nome para o bot (ex: "YLADA Notificações")
4. Escolha um username (ex: "ylada_notificacoes_bot")
5. **Copie o TOKEN** que o BotFather vai te dar (algo como: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

#### **Passo 2: Obter seu Chat ID**

1. Procure pelo seu bot no Telegram (pelo username que você criou)
2. Envie uma mensagem qualquer para ele (ex: "Olá")
3. Acesse esta URL no navegador (substitua `SEU_TOKEN` pelo token do passo 1):
   ```
   https://api.telegram.org/botSEU_TOKEN/getUpdates
   ```
4. Procure por `"chat":{"id":` no resultado
5. **Copie o número** que aparece depois de `"id":` (ex: `123456789`)

#### **Passo 3: Configurar Variáveis de Ambiente**

Adicione estas variáveis no seu arquivo `.env.local` ou nas variáveis de ambiente da Vercel:

```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789
```

#### **Pronto!** 🎉

Agora, sempre que alguém clicar no botão WhatsApp, você receberá uma mensagem no Telegram:

```
🔔 Nova Solicitação de Atendimento

📱 Página: Wellness - Página de Vendas
⏰ Horário: 27/01/2025 14:30:25

Alguém clicou no botão WhatsApp para falar com você!
```

---

### ✅ **OPÇÃO 2: Email (Já Configurado)**

Se você já tem o Resend configurado, o sistema pode enviar email também. Mas o Telegram é mais rápido e prático.

---

## 📊 Analytics (Opcional)

O sistema também salva os cliques no banco de dados para você analisar depois.

### **Criar Tabela no Supabase (Opcional)**

Se quiser salvar os cliques para analytics, execute este SQL no Supabase:

```sql
CREATE TABLE IF NOT EXISTS whatsapp_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT,
  user_agent TEXT,
  referrer TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_whatsapp_clicks_clicked_at ON whatsapp_clicks(clicked_at DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_clicks_page ON whatsapp_clicks(page);
```

---

## 🧪 Como Testar

### **1. Testar Notificação Telegram:**

1. Configure as variáveis de ambiente
2. Acesse a página de vendas: `http://localhost:3000/pt/wellness`
3. Abra o chat do NOEL
4. Clique no botão "Tire suas dúvidas no WhatsApp"
5. **Verifique:** Você deve receber uma mensagem no Telegram em alguns segundos

### **2. Verificar Logs:**

Se não receber a notificação, verifique os logs do servidor:

```bash
# No terminal onde o servidor está rodando
# Procure por linhas como:
[WhatsApp Click] ✅ Notificação Telegram enviada
# ou
[WhatsApp Click] Telegram não configurado
```

---

## 🔧 Troubleshooting

### **Problema: Não recebo notificação no Telegram**

**Solução 1:** Verifique se as variáveis de ambiente estão configuradas:
```bash
echo $TELEGRAM_BOT_TOKEN
echo $TELEGRAM_CHAT_ID
```

**Solução 2:** Teste o bot manualmente:
```bash
curl -X POST "https://api.telegram.org/botSEU_TOKEN/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{"chat_id":"SEU_CHAT_ID","text":"Teste"}'
```

**Solução 3:** Verifique se você enviou uma mensagem para o bot antes de obter o Chat ID

### **Problema: Erro "Telegram não configurado"**

- Verifique se as variáveis estão no `.env.local` (desenvolvimento) ou na Vercel (produção)
- Reinicie o servidor após adicionar as variáveis

---

## 📝 Exemplo de Mensagem Recebida

Quando alguém clicar no botão, você receberá:

```
🔔 Nova Solicitação de Atendimento

📱 Página: Wellness - Página de Vendas
⏰ Horário: 27/01/2025 14:30:25

Alguém clicou no botão WhatsApp para falar com você!
```

---

## 🎯 Próximos Passos (Opcional)

### **Melhorias Futuras:**

1. **Adicionar mais informações:**
   - IP do visitante
   - País/região
   - Dispositivo (mobile/desktop)

2. **Integração com outros serviços:**
   - SMS (via Twilio)
   - Discord
   - Slack

3. **Dashboard de Analytics:**
   - Ver quantos cliques por dia
   - Horários de pico
   - Taxa de conversão

---

## ✅ Checklist de Configuração

- [ ] Bot Telegram criado
- [ ] Token do bot copiado
- [ ] Chat ID obtido
- [ ] Variáveis de ambiente configuradas
- [ ] Servidor reiniciado (se necessário)
- [ ] Teste realizado com sucesso

---

**Última atualização:** 2025-01-27  
**Status:** ✅ Implementado e pronto para configurar
