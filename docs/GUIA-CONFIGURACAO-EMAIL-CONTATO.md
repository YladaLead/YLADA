# 📧 GUIA COMPLETO: Configuração de Email para Formulário de Contato

## 🎯 RESUMO RÁPIDO

Existem **2 emails diferentes** que você precisa configurar:

1. **Email que ENVIA** (`RESEND_FROM_EMAIL`) - Precisa verificar DNS no Resend
2. **Email que RECEBE** (`CONTACT_NOTIFICATION_EMAIL`) - Qualquer email seu (Gmail, etc)

---

## 📋 PARTE 1: Email que ENVIA (RESEND_FROM_EMAIL)

### O que é?
É o email que aparece como **remetente** dos emails enviados pelo sistema.

**Exemplo:** Quando alguém preenche o formulário, você recebe um email que vem de:
```
De: YLADA <noreply@ylada.com>
```

### Como configurar:

#### 1. Escolher o email remetente
Você pode usar:
- `noreply@ylada.com` (recomendado - não recebe respostas)
- `contato@ylada.com` (se quiser receber respostas)
- `suporte@ylada.com` (se quiser receber respostas)

#### 2. Verificar domínio no Resend (IMPORTANTE)

**⚠️ Você NÃO precisa configurar DNS para RECEBER emails!**
**✅ Você PRECISA configurar DNS para ENVIAR emails!**

**Passo a passo:**

1. **Acesse o Resend Dashboard:**
   - Vá em: https://resend.com/domains
   - Faça login na sua conta

2. **Adicionar domínio:**
   - Clique em **"Add Domain"**
   - Digite: `ylada.com` (sem www)
   - Clique em **"Add"**

3. **Copiar registros DNS:**
   O Resend vai mostrar registros DNS que você precisa adicionar:
   
   ```
   Tipo: TXT
   Nome: @
   Valor: resend-verification=xxxxxxxxxxxxx
   
   Tipo: TXT
   Nome: @
   Valor: v=spf1 include:resend.com ~all
   
   Tipo: TXT
   Nome: resend._domainkey
   Valor: (chave DKIM muito longa)
   ```

4. **Adicionar no seu provedor DNS:**
   - **Cloudflare:** DNS → Records → Add record
   - **GoDaddy:** DNS Management → Add
   - **Registro.br:** DNS → Adicionar registro
   
   ⚠️ **IMPORTANTE:** Adicione TODOS os registros que o Resend pedir!

5. **Aguardar verificação:**
   - Pode levar de 1 hora a 48 horas
   - Geralmente leva 1-2 horas
   - O Resend vai mostrar status: "Pending" → "Verified" ✅

6. **Configurar no projeto:**
   
   **`.env.local` (desenvolvimento):**
   ```env
   RESEND_FROM_EMAIL=noreply@ylada.com
   RESEND_FROM_NAME=YLADA
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```
   
   **Vercel (produção):**
   - Vá em: Settings → Environment Variables
   - Adicione as mesmas variáveis

---

## 📋 PARTE 2: Email que RECEBE (CONTACT_NOTIFICATION_EMAIL)

### O que é?
É o email **seu** onde você quer receber as notificações quando alguém preencher o formulário.

**Exemplo:** Você pode usar:
- `seu-email@gmail.com`
- `contato@ylada.com` (se você configurou para receber)
- `suporte@ylada.com` (se você configurou para receber)
- Qualquer email que você tenha acesso

### ⚠️ IMPORTANTE: Você NÃO precisa configurar DNS para RECEBER!

Para **receber** emails, você só precisa:
1. Ter acesso ao email
2. Configurar a variável `CONTACT_NOTIFICATION_EMAIL`

### Como configurar:

**`.env.local` (desenvolvimento):**
```env
CONTACT_NOTIFICATION_EMAIL=seu-email@gmail.com
```

**Vercel (produção):**
- Vá em: Settings → Environment Variables
- Adicione: `CONTACT_NOTIFICATION_EMAIL` = `seu-email@gmail.com`

### Se não configurar:
Se você **não** configurar `CONTACT_NOTIFICATION_EMAIL`, o sistema vai usar o `RESEND_FROM_EMAIL` como padrão.

---

## 🔄 RESUMO: Diferença entre ENVIAR e RECEBER

| Tipo | Variável | O que faz | Precisa DNS? |
|------|----------|-----------|--------------|
| **ENVIA** | `RESEND_FROM_EMAIL` | Email que aparece como remetente | ✅ **SIM** - Verificar no Resend |
| **RECEBE** | `CONTACT_NOTIFICATION_EMAIL` | Email onde você recebe notificações | ❌ **NÃO** - Qualquer email seu |

---

## 📝 EXEMPLO PRÁTICO

### Cenário 1: Usando Gmail para receber

**Configuração:**
```env
# Email que ENVIA (precisa verificar DNS)
RESEND_FROM_EMAIL=noreply@ylada.com

# Email que RECEBE (não precisa DNS)
CONTACT_NOTIFICATION_EMAIL=seu-email@gmail.com
```

**Resultado:**
- Email enviado **de:** `YLADA <noreply@ylada.com>`
- Email enviado **para:** `seu-email@gmail.com`
- Você recebe no Gmail normalmente ✅

### Cenário 2: Usando contato@ylada.com para receber

**Configuração:**
```env
# Email que ENVIA
RESEND_FROM_EMAIL=noreply@ylada.com

# Email que RECEBE
CONTACT_NOTIFICATION_EMAIL=contato@ylada.com
```

**Resultado:**
- Email enviado **de:** `YLADA <noreply@ylada.com>`
- Email enviado **para:** `contato@ylada.com`
- Você recebe em `contato@ylada.com` (se configurou no seu provedor de email)

---

## 🚀 CONFIGURAÇÃO RÁPIDA (PASSO A PASSO)

### 1. No Resend (para ENVIAR):
1. Acesse: https://resend.com/domains
2. Adicione domínio: `ylada.com`
3. Copie os registros DNS
4. Adicione no seu provedor DNS
5. Aguarde verificação (1-48h)

### 2. No Projeto (variáveis de ambiente):

**`.env.local`:**
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@ylada.com
RESEND_FROM_NAME=YLADA
CONTACT_NOTIFICATION_EMAIL=seu-email@gmail.com
```

**Vercel:**
- Adicione as mesmas variáveis em Settings → Environment Variables

### 3. Testar:
1. Preencha o formulário de contato no site
2. Verifique se recebeu o email em `CONTACT_NOTIFICATION_EMAIL`
3. Verifique se o email veio de `RESEND_FROM_EMAIL`

---

## ❓ PERGUNTAS FREQUENTES

### 1. Preciso configurar DNS para receber emails?
**Não!** Você só precisa configurar DNS para **enviar** emails. Para receber, qualquer email seu funciona (Gmail, Outlook, etc).

### 2. Posso usar contato@ylada.com para receber?
**Sim!** Mas você precisa configurar esse email no seu provedor de email (Gmail, Outlook, etc) para receber mensagens. Isso é separado do Resend.

### 3. O que acontece se não verificar o domínio no Resend?
Os emails podem ir para spam ou serem bloqueados. **Sempre verifique o domínio!**

### 4. Posso usar Gmail para receber?
**Sim!** É a opção mais simples. Só configure:
```env
CONTACT_NOTIFICATION_EMAIL=seu-email@gmail.com
```

### 5. Quantos emails posso receber?
- **Resend gratuito:** 3.000 emails/mês
- **Resend pago:** 50.000 emails/mês por $20

---

## ✅ CHECKLIST FINAL

- [ ] Domínio `ylada.com` verificado no Resend
- [ ] Registros DNS adicionados no provedor DNS
- [ ] Status do domínio: "Verified" ✅ no Resend
- [ ] `RESEND_API_KEY` configurada
- [ ] `RESEND_FROM_EMAIL` configurada (ex: `noreply@ylada.com`)
- [ ] `CONTACT_NOTIFICATION_EMAIL` configurada (ex: `seu-email@gmail.com`)
- [ ] Variáveis adicionadas no Vercel (produção)
- [ ] Teste realizado e email recebido ✅

---

**Pronto!** Agora você sabe exatamente o que configurar! 🎉

