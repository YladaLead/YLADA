# 🔔 Guia: Sistema de Notificações de Suporte

## 📋 COMO FUNCIONA

Quando alguém solicita falar com um **atendente humano** no chat de suporte, o sistema:

1. ✅ Cria um ticket no banco de dados
2. ✅ **Envia notificação por EMAIL** para você (atendente)

---

## 📧 NOTIFICAÇÕES POR EMAIL

### **Como Funciona:**

1. **Busca Atendentes Online**
   - Sistema busca todos os atendentes com status `online` na área Nutri
   - Obtém o email de cada atendente online
   - Envia email para todos eles

2. **Se Não Há Atendentes Online**
   - Sistema usa email de notificação geral (configurável)
   - Você recebe mesmo sem estar "online" no sistema

3. **Conteúdo do Email**
   - ID do ticket
   - Assunto e mensagem do usuário
   - Prioridade (Baixa, Normal, Alta, Urgente)
   - Categoria
   - Nome e email do usuário
   - Link direto para ver e responder o ticket

---

## ⚙️ CONFIGURAÇÃO

### **1. Email de Notificação Geral (Opcional mas Recomendado)**

Configure um email que sempre receberá notificações, mesmo quando não há atendentes online:

**No `.env.local` (desenvolvimento):**
```env
SUPPORT_NOTIFICATION_EMAIL=seu-email@gmail.com
```

**No Vercel (produção):**
1. Vá em Settings → Environment Variables
2. Adicione: `SUPPORT_NOTIFICATION_EMAIL`
3. Valor: seu email (ex: `seu-email@gmail.com`)

**Ou use o email de contato existente:**
```env
CONTACT_NOTIFICATION_EMAIL=seu-email@gmail.com
```
(O sistema usa `SUPPORT_NOTIFICATION_EMAIL` primeiro, depois `CONTACT_NOTIFICATION_EMAIL`)

---

### **2. Configurar Resend (Já Deve Estar Configurado)**

O sistema usa **Resend** para enviar emails. Verifique se está configurado:

**Variáveis necessárias:**
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@ylada.com
RESEND_FROM_NAME=YLADA
```

**Verificar:**
- ✅ Resend está configurado? (usado para outros emails do sistema)
- ✅ Domínio verificado no Resend? (necessário para enviar)

---

## 👤 COMO SER NOTIFICADO

### **Opção 1: Como Atendente Online (Recomendado)**

1. **Registre-se como Atendente**
   - Acesse área de suporte como admin
   - Registre-se como atendente da área Nutri
   - Status será "offline" inicialmente

2. **Fique Online**
   - Altere status para "online" no sistema
   - Quando alguém criar ticket, você receberá email automaticamente

3. **Vantagens:**
   - Recebe notificações apenas quando está disponível
   - Pode controlar quando recebe
   - Sistema distribui entre atendentes online

### **Opção 2: Email de Notificação Geral**

1. **Configure Email**
   - Adicione `SUPPORT_NOTIFICATION_EMAIL` no `.env.local` e Vercel
   - Use seu email pessoal ou email da equipe

2. **Receba Sempre**
   - Recebe notificações mesmo sem estar "online"
   - Útil para garantir que nada seja perdido
   - Funciona como backup

---

## 📱 OUTRAS FORMAS DE NOTIFICAÇÃO (Futuro)

### **WhatsApp (A Implementar)**
- Enviar notificação por WhatsApp quando ticket é criado
- Requer integração com API do WhatsApp
- Pode usar Twilio, Evolution API, ou similar

### **Push Notifications (A Implementar)**
- Notificações no app mobile (se tiver app)
- Requer app instalado
- Notificações em tempo real

### **SMS (A Implementar)**
- Enviar SMS para número cadastrado
- Útil para urgências
- Requer serviço de SMS (Twilio, etc)

---

## 🎯 FLUXO COMPLETO

```
Usuário solicita atendente humano
    ↓
Sistema cria ticket
    ↓
Sistema busca atendentes online
    ↓
Envia email para:
  - Atendentes online (se houver)
  - OU email de notificação geral
    ↓
Você recebe email no celular/computador
    ↓
Clica no link do email
    ↓
Abre ticket no sistema
    ↓
Responde ao usuário
```

---

## 📧 EXEMPLO DE EMAIL RECEBIDO

Você receberá um email assim:

**Assunto:** `🎫 Novo Ticket NUTRI - 🔴 URGENTE Preciso falar com um atendente humano`

**Conteúdo:**
- Header com "Novo Ticket de Suporte"
- Badge de prioridade (🟢 Baixa, 🟡 Normal, 🟠 Alta, 🔴 Urgente)
- Informações do ticket (ID, assunto, categoria, usuário)
- Mensagem completa do usuário
- Botão "Ver Ticket e Responder" (link direto)

---

## ⚠️ IMPORTANTE

1. **Email é o método principal** de notificação atualmente
2. **Resend deve estar configurado** para funcionar
3. **Atendentes online têm prioridade** sobre email geral
4. **Notificações não bloqueiam** criação de tickets (se falhar, ticket ainda é criado)
5. **Você pode usar ambos:** ser atendente online E ter email de notificação

---

## 🔧 TROUBLESHOOTING

### **Não recebo emails:**
1. Verifique se `RESEND_API_KEY` está configurada
2. Verifique se `SUPPORT_NOTIFICATION_EMAIL` ou `CONTACT_NOTIFICATION_EMAIL` está configurado
3. Verifique spam/lixo eletrônico
4. Verifique logs do servidor para erros

### **Recebo emails mas não sou atendente:**
- Configure `SUPPORT_NOTIFICATION_EMAIL` para receber sempre
- Ou registre-se como atendente e fique online

### **Quero receber no WhatsApp:**
- Funcionalidade ainda não implementada
- Pode ser adicionada no futuro
- Por enquanto, use email (pode configurar notificações do email no celular)

---

## 📝 RESUMO RÁPIDO

**Para receber notificações:**

1. **Configure email de notificação:**
   ```env
   SUPPORT_NOTIFICATION_EMAIL=seu-email@gmail.com
   ```

2. **OU registre-se como atendente e fique online**

3. **Verifique se Resend está configurado** (já deve estar)

4. **Pronto!** Você receberá emails quando alguém solicitar atendente humano

---

## 🚀 PRÓXIMOS PASSOS

- [ ] Implementar notificações por WhatsApp
- [ ] Implementar push notifications (se tiver app)
- [ ] Adicionar preferências de notificação por usuário
- [ ] Criar dashboard de notificações

