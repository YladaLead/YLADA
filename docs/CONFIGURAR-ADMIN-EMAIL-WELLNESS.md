# 📧 Configurar Email do Admin - Learning Suggestions NOEL

## 🎯 O que é isso?

O sistema de notificações do NOEL precisa saber para qual email enviar quando uma nova sugestão de aprendizado é criada (quando frequência >= 3).

---

## ⚙️ CONFIGURAÇÃO

### **1. Desenvolvimento (Localhost)**

Adicione no arquivo `.env.local` na raiz do projeto:

```bash
# Email do administrador para receber notificações do NOEL
ADMIN_EMAIL=seu-email@exemplo.com
```

**Exemplo:**
```bash
ADMIN_EMAIL=admin@ylada.com
```

---

### **2. Produção (Vercel)**

**SIM, você precisa configurar na Vercel também!**

1. Acesse o dashboard da Vercel: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Adicione a variável:

   - **Name:** `ADMIN_EMAIL`
   - **Value:** `seu-email@exemplo.com`
   - **Environment:** Selecione **Production**, **Preview** e **Development** (ou só Production se preferir)

5. Clique em **Save**
6. **IMPORTANTE:** Faça um novo deploy para aplicar a mudança

---

## 🔍 Como o Sistema Busca o Email

O código busca o email nesta ordem:

1. `process.env.ADMIN_EMAIL` (variável de ambiente)
2. `process.env.NEXT_PUBLIC_ADMIN_EMAIL` (variável pública, se necessário)
3. Se não encontrar, não envia email (mas registra no console)

**Código:** `src/lib/wellness-learning-notifications.ts` (linha 30)

---

## ✅ Verificar se Está Configurado

### **No Localhost:**

1. Verifique se o arquivo `.env.local` existe e tem `ADMIN_EMAIL`
2. Reinicie o servidor (`npm run dev`)
3. Faça uma pergunta ao NOEL que gere uma sugestão com frequência >= 3
4. Verifique os logs do console - deve aparecer:
   ```
   [Wellness Learning Notifications] ✅ Email enviado com sucesso para seu-email@exemplo.com
   ```

### **Na Vercel:**

1. Verifique em **Settings** → **Environment Variables** se `ADMIN_EMAIL` está configurada
2. Verifique os logs da Vercel (Functions → Logs)
3. Verifique no Resend Dashboard: https://resend.com/emails

---

## 🚨 Problemas Comuns

### **Email não está sendo enviado:**

1. ✅ Verifique se `ADMIN_EMAIL` está configurado
2. ✅ Verifique se `RESEND_API_KEY` está configurado (necessário para enviar emails)
3. ✅ Verifique se o domínio está verificado no Resend (para produção)
4. ✅ Verifique os logs do console/vercel

### **Email configurado mas não recebe:**

1. ✅ Verifique a caixa de spam
2. ✅ Verifique no Resend Dashboard: https://resend.com/emails
3. ✅ Verifique se o email está correto (sem erros de digitação)

---

## 📋 Checklist

### **Desenvolvimento:**
- [ ] `ADMIN_EMAIL` adicionado no `.env.local`
- [ ] Servidor reiniciado após adicionar
- [ ] Testado fazendo pergunta ao NOEL

### **Produção (Vercel):**
- [ ] `ADMIN_EMAIL` adicionado nas Environment Variables da Vercel
- [ ] Variável configurada para Production (e Preview se necessário)
- [ ] Novo deploy feito após adicionar
- [ ] Testado em produção

---

## 🔐 Segurança

- ✅ `ADMIN_EMAIL` é uma variável de ambiente **privada** (não exposta ao cliente)
- ✅ Não use `NEXT_PUBLIC_ADMIN_EMAIL` a menos que realmente precise (expõe ao cliente)
- ✅ O email só é usado para enviar notificações, não é exposto na interface

---

## 📚 Referências

- **Código:** `src/lib/wellness-learning-notifications.ts`
- **Resend Config:** `src/lib/resend.ts`
- **Endpoint NOEL:** `src/app/api/wellness/noel/route.ts`

---

## 💡 Dica

Você pode usar o mesmo email que já usa para outras notificações do sistema (ex: suporte, tickets, etc).


