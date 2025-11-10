# 🧪 Testar E-mail Agora

## ✅ Configuração Completa

- ✅ `.env.local` atualizado
- ✅ Vercel atualizado
- ✅ Deploy feito

Agora vamos testar!

---

## 🧪 TESTE 1: Rota de Teste

### Via Console do Navegador

1. Abra o site: https://www.ylada.com
2. Pressione **F12** (abrir DevTools)
3. Vá na aba **Console**
4. Cole e execute:

```javascript
fetch('/api/email/test', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'falaandre@gmail.com' })
})
.then(r => r.json())
.then(data => {
  console.log('📧 Resultado:', data)
  if (data.success) {
    alert('✅ E-mail enviado! Verifique sua caixa de entrada.')
  } else {
    alert('❌ Erro: ' + data.error)
  }
})
.catch(err => {
  console.error('❌ Erro:', err)
  alert('❌ Erro ao testar: ' + err.message)
})
```

### O que verificar:

- Se retornar `success: true` → ✅ Resend está funcionando!
- Se retornar `error` → ❌ Veja a mensagem de erro

---

## 🧪 TESTE 2: Verificar Logs no Vercel

1. Acesse: https://vercel.com
2. Seu projeto → **Functions** → **Logs**
3. Procure por logs que começam com `📧`

**Logs importantes:**
- `📧 RESEND_API_KEY configurada:`
- `📧 Enviando e-mail via Resend:`
- `✅ E-mail enviado com sucesso:`
- `❌ Erro ao enviar e-mail:`

**Me envie o que aparecer nos logs!**

---

## 🧪 TESTE 3: Verificar no Resend

1. Acesse: https://resend.com/emails
2. Veja se há e-mails enviados
3. Se aparecer → ✅ Está funcionando!
4. Se não aparecer → ❌ Problema no envio

---

## 🧪 TESTE 4: Fazer Pagamento de Teste

1. Faça um pagamento de teste
2. Após o pagamento, verifique os logs do webhook
3. Procure por:
   - `📧 Verificando condições para enviar e-mail de boas-vindas`
   - `📧 Iniciando envio de e-mail de boas-vindas...`
   - `✅ E-mail de boas-vindas enviado`

---

## 🔍 O QUE VERIFICAR SE NÃO FUNCIONAR

### 1. Permissões da API Key

- Acesse: https://resend.com/api-keys
- Verifique se a chave tem **"Full Access"** (não apenas "Sending access")

### 2. Domínio Verificado

- Acesse: https://resend.com/domains
- Verifique se `ylada.com` está verificado
- Se não estiver, precisa verificar o domínio primeiro

### 3. FROM_EMAIL

- Deve ser `noreply@ylada.com` (domínio verificado)
- Não pode ser outro domínio não verificado

### 4. Logs de Erro

- Vercel → Functions → Logs
- Procure por erros relacionados ao Resend
- Me envie os erros que aparecerem

---

## 📋 CHECKLIST

- [ ] Teste 1 executado (rota de teste)
- [ ] Logs do Vercel verificados
- [ ] Resend dashboard verificado
- [ ] Permissões da API Key verificadas
- [ ] Domínio verificado no Resend

---

**Execute o Teste 1 e me diga o resultado!** 🚀

