# ✅ Verificar E-mail Agora

## 🎯 O que fazer após mudar API Key para "Full Access"

### 1. Fazer Novo Deploy no Vercel

**IMPORTANTE:** Após mudar a API Key, você precisa fazer um novo deploy para as variáveis serem aplicadas.

**Como fazer:**
1. No Vercel, vá em **Deployments**
2. Clique nos **3 pontinhos** do último deploy
3. Clique em **Redeploy**
4. Ou faça um commit vazio e push:
   ```bash
   git commit --allow-empty -m "Redeploy após mudar API Key"
   git push origin main
   ```

### 2. Testar Envio de E-mail

**Opção A: Via Rota de Teste**

Abra o console do navegador (F12) e execute:

```javascript
fetch('/api/email/test', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'falaandre@gmail.com' })
})
.then(r => r.json())
.then(data => {
  console.log('Resultado:', data)
  if (data.success) {
    alert('✅ E-mail enviado! Verifique sua caixa de entrada.')
  } else {
    alert('❌ Erro: ' + data.error)
  }
})
.catch(err => {
  console.error('Erro:', err)
  alert('❌ Erro ao testar: ' + err.message)
})
```

**Opção B: Via Terminal**

```bash
curl -X POST https://www.ylada.com/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"email": "falaandre@gmail.com"}'
```

### 3. Verificar no Resend

1. Acesse: https://resend.com/emails
2. Aguarde alguns segundos (pode ter delay)
3. Verifique se o e-mail aparece na lista
4. Se aparecer → **Funcionou!** ✅

### 4. Testar Recuperação de Acesso

1. Acesse: `/pt/wellness/recuperar-acesso`
2. Digite: `falaandre@gmail.com`
3. Clique em "Enviar Link de Acesso"
4. Verifique sua caixa de entrada
5. Verifique no Resend se o e-mail foi enviado

---

## ⚠️ IMPORTANTE

**Permissões da API Key:**
- **"Sending access"** → Deveria ser suficiente para enviar e-mails
- **"Full access"** → Permite todas as operações (pode ser necessário para algumas funcionalidades)

Se ainda não funcionar com "Full access", pode ser:
1. API Key ainda não foi aplicada (precisa redeploy)
2. Domínio não está configurado corretamente
3. FROM_EMAIL não está correto

---

## 🔍 Verificar Logs

Após testar, verifique logs no Vercel:
1. Vercel → Functions → Logs
2. Procure por: `📧 Enviando e-mail via Resend`
3. Veja se há erros

---

**Próximo passo:** Faça o redeploy e teste novamente!

