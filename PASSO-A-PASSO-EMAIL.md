# 📧 PASSO A PASSO: Configurar Email para Formulário de Contato

## 🎯 RESUMO RÁPIDO

Você precisa configurar **2 coisas**:

1. **Verificar domínio no Resend** (para ENVIAR emails) - Precisa DNS
2. **Configurar variáveis de ambiente** (email que RECEBE) - Não precisa DNS

---

## ✅ PASSO 1: Verificar Domínio no Resend (para ENVIAR)

### 1.1 Acessar Resend
1. Vá em: https://resend.com/domains
2. Faça login na sua conta

### 1.2 Adicionar Domínio
1. Clique em **"Add Domain"**
2. Digite: `ylada.com` (sem www)
3. Clique em **"Add"**

### 1.3 Copiar Registros DNS
O Resend vai mostrar registros DNS que você precisa adicionar:
- **TXT** para verificação
- **SPF** (autenticação)
- **DKIM** (assinatura)

### 1.4 Adicionar no seu Provedor DNS
**Exemplo (Cloudflare):**
1. Vá em: DNS → Records
2. Clique em "Add record"
3. Adicione cada registro que o Resend pedir:
   - Tipo: TXT
   - Nome: @ (ou o que o Resend pedir)
   - Valor: (copie do Resend)
4. Salve

**Exemplo (GoDaddy/Registro.br):**
1. Vá em: DNS Management
2. Adicione os registros TXT que o Resend pedir
3. Salve

### 1.5 Aguardar Verificação
- Pode levar de 1 hora a 48 horas
- Geralmente leva 1-2 horas
- O Resend vai mostrar: "Pending" → "Verified" ✅

---

## ✅ PASSO 2: Configurar Variáveis de Ambiente

### 2.1 No `.env.local` (desenvolvimento)

Adicione estas variáveis:

```env
# Resend API Key (obtenha em: https://resend.com/api-keys)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Email que ENVIA (precisa verificar DNS - passo 1)
RESEND_FROM_EMAIL=noreply@ylada.com
RESEND_FROM_NAME=YLADA

# Email que RECEBE (não precisa DNS - pode ser Gmail)
CONTACT_NOTIFICATION_EMAIL=seu-email@gmail.com
```

**Onde obter RESEND_API_KEY:**
1. Vá em: https://resend.com/api-keys
2. Clique em "Create API Key"
3. Dê um nome: `YLADA Development`
4. Copie a chave (ela só aparece uma vez!)

### 2.2 No Vercel (produção)

1. Acesse: https://vercel.com/seu-projeto/settings/environment-variables
2. Adicione as mesmas variáveis:
   - `RESEND_API_KEY` = sua chave de produção
   - `RESEND_FROM_EMAIL` = `noreply@ylada.com`
   - `RESEND_FROM_NAME` = `YLADA`
   - `CONTACT_NOTIFICATION_EMAIL` = seu email (ex: `seu-email@gmail.com`)

---

## 📝 EXEMPLO PRÁTICO

### Se você quer receber no Gmail:

**`.env.local`:**
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@ylada.com
RESEND_FROM_NAME=YLADA
CONTACT_NOTIFICATION_EMAIL=seu-email@gmail.com
```

**Resultado:**
- Email enviado **de:** `YLADA <noreply@ylada.com>`
- Email enviado **para:** `seu-email@gmail.com`
- Você recebe no Gmail normalmente ✅

---

## ⚠️ IMPORTANTE

### Você NÃO precisa configurar DNS para RECEBER emails!

- Para **receber** emails, qualquer email seu funciona (Gmail, Outlook, etc)
- Você só precisa configurar DNS para **enviar** emails (verificar domínio no Resend)

### Se não configurar CONTACT_NOTIFICATION_EMAIL:

O sistema vai usar `RESEND_FROM_EMAIL` como padrão, mas é melhor configurar um email seu.

---

## ✅ CHECKLIST FINAL

- [ ] Domínio `ylada.com` adicionado no Resend
- [ ] Registros DNS adicionados no provedor DNS
- [ ] Domínio verificado no Resend (status: "Verified" ✅)
- [ ] `RESEND_API_KEY` obtida e configurada
- [ ] `RESEND_FROM_EMAIL` configurada (`noreply@ylada.com`)
- [ ] `CONTACT_NOTIFICATION_EMAIL` configurada (seu email)
- [ ] Variáveis adicionadas no Vercel (produção)
- [ ] Teste realizado - formulário enviado e email recebido ✅

---

## 🧪 TESTAR

1. Preencha o formulário de contato no site
2. Verifique se recebeu o email em `CONTACT_NOTIFICATION_EMAIL`
3. Verifique se o email veio de `RESEND_FROM_EMAIL`

**Pronto!** 🎉
