# 🔑 Atualizar RESEND_API_KEY no Vercel

## ✅ Você já atualizou no `.env.local` - Agora precisa atualizar no Vercel!

### 📍 Onde a chave precisa estar configurada:

1. ✅ **`.env.local`** (desenvolvimento) - **JÁ FEITO**
2. ⚠️ **Vercel** (produção) - **PRECISA ATUALIZAR**

---

## 🚀 PASSO A PASSO PARA ATUALIZAR NO VERCEL

### 1. Acessar Vercel

1. Acesse: https://vercel.com
2. Faça login na sua conta
3. Selecione o projeto **ylada-app** (ou o nome do seu projeto)

### 2. Ir para Environment Variables

1. Clique em **Settings** (Configurações)
2. No menu lateral, clique em **Environment Variables**

### 3. Encontrar `RESEND_API_KEY`

1. Procure por `RESEND_API_KEY` na lista
2. Se encontrar, clique nos **3 pontinhos** → **Edit**
3. Se **NÃO encontrar**, clique em **Add New**

### 4. Adicionar/Atualizar a Chave

**Se estiver editando:**
- Cole a nova chave do Resend
- Clique em **Save**

**Se estiver criando nova:**
- **Key:** `RESEND_API_KEY`
- **Value:** Cole sua nova chave do Resend (começa com `re_`)
- **Environment:** Selecione:
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- Clique em **Save**

### 5. Verificar outras variáveis do Resend

Certifique-se de que também estão configuradas:

- `RESEND_FROM_EMAIL` = `noreply@ylada.com`
- `RESEND_FROM_NAME` = `YLADA`

---

## ⚠️ IMPORTANTE: Fazer Novo Deploy

**Após atualizar as variáveis, você PRECISA fazer um novo deploy!**

### Opção 1: Redeploy Manual

1. Vercel → **Deployments**
2. Clique nos **3 pontinhos** do último deploy
3. Clique em **Redeploy**
4. Aguarde o deploy terminar

### Opção 2: Deploy via Git

```bash
git commit --allow-empty -m "Redeploy após atualizar RESEND_API_KEY"
git push origin main
```

---

## ✅ Verificar se Funcionou

### 1. Testar Rota de Teste

Após o deploy, teste:

```javascript
fetch('/api/email/test', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'falaandre@gmail.com' })
})
.then(r => r.json())
.then(console.log)
```

**Se retornar `success: true`** → ✅ Funcionou!

### 2. Verificar Logs

1. Vercel → **Functions** → **Logs**
2. Procure por: `📧 RESEND_API_KEY configurada:`
3. Se aparecer, a chave está sendo lida corretamente

### 3. Verificar no Resend

1. Acesse: https://resend.com/emails
2. Veja se há e-mails enviados
3. Se aparecer, está funcionando!

---

## 🔍 Checklist Completo

- [ ] Chave atualizada no `.env.local` ✅ (você já fez)
- [ ] Chave atualizada no Vercel
- [ ] `RESEND_FROM_EMAIL` configurado no Vercel
- [ ] `RESEND_FROM_NAME` configurado no Vercel
- [ ] Novo deploy feito no Vercel
- [ ] Teste de e-mail funcionando

---

## 🆘 Se Ainda Não Funcionar

1. **Verifique se a chave está correta:**
   - Deve começar com `re_`
   - Deve ter ~40 caracteres
   - Deve ter permissão "Full Access" no Resend

2. **Verifique se o domínio está verificado:**
   - Acesse: https://resend.com/domains
   - Verifique se `ylada.com` está verificado

3. **Verifique os logs:**
   - Vercel → Functions → Logs
   - Procure por erros relacionados ao Resend

---

**Depois de atualizar no Vercel e fazer o deploy, me avise se funcionou!** 🚀

