# 🔍 Debug: E-mail Não Sendo Enviado

## ✅ O que foi feito

1. **Melhorias no redirecionamento:**
   - Página de pagamento-sucesso agora mostra botão diferente se usuário não estiver logado
   - Se não logado: mostra aviso e botão "Recuperar Acesso"

2. **Logs detalhados adicionados:**
   - Webhook agora tem logs muito detalhados em cada etapa do envio de e-mail
   - Verifica se Resend está configurado antes de tentar enviar
   - Loga todos os dados do webhook para identificar problemas

3. **Verificações de segurança:**
   - Resend agora verifica se está configurado antes de tentar enviar
   - Mensagens de erro mais claras

## 🔍 Como debugar

### 1. Verificar logs do webhook no Vercel

Após fazer um pagamento de teste:

1. Vercel → **Functions** → **Logs**
2. Procure por logs que começam com `📧`
3. Veja se há erros ou avisos

**Logs importantes a procurar:**
- `📧 Verificando condições para enviar e-mail de boas-vindas`
- `📧 Iniciando envio de e-mail de boas-vindas...`
- `📧 RESEND_API_KEY configurada:`
- `✅ E-mail de boas-vindas enviado e marcado como enviado`
- `❌ Erro ao enviar e-mail de boas-vindas:`

### 2. Verificar se e-mail do pagador está sendo capturado

No webhook, procure por:
- `⚠️ E-mail do pagador não disponível`
- `payerEmail:`

Se o e-mail não estiver sendo capturado, o problema pode ser:
- Mercado Pago não está enviando o e-mail no webhook
- E-mail está em campo diferente do esperado

### 3. Testar envio de e-mail manualmente

**Via console do navegador:**
```javascript
fetch('/api/email/test', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'falaandre@gmail.com' })
})
.then(r => r.json())
.then(console.log)
```

**Se der erro:**
- Verifique se `RESEND_API_KEY` está configurada no Vercel
- Verifique se a API Key tem permissão "Full Access"
- Verifique se o domínio está verificado no Resend

### 4. Verificar no Resend

1. Acesse: https://resend.com/emails
2. Veja se há e-mails enviados
3. Se não houver, o problema é no envio
4. Se houver mas não chegou, pode ser:
   - E-mail no spam
   - E-mail bloqueado
   - Problema de entrega

## 🎯 Respostas às suas perguntas

### "Para onde redireciona quando clica em Acessar Dashboard?"

**Agora:**
- Se usuário **estiver logado**: redireciona para `/pt/wellness/dashboard`
- Se usuário **não estiver logado**: mostra aviso e botão "Recuperar Acesso" que vai para `/pt/wellness/recuperar-acesso`

### "E-mail ainda não está funcionando"

**Próximos passos:**
1. Faça um novo pagamento de teste
2. Verifique os logs no Vercel (procure por `📧`)
3. Me diga o que aparece nos logs
4. Teste a rota `/api/email/test` e me diga o resultado

## 📋 Checklist

- [ ] API Key do Resend configurada no Vercel com "Full Access"
- [ ] Domínio verificado no Resend
- [ ] FROM_EMAIL configurado corretamente
- [ ] Fazer redeploy após mudar API Key
- [ ] Verificar logs do webhook após pagamento
- [ ] Testar rota `/api/email/test`

---

**Depois de fazer um pagamento de teste, me envie os logs que aparecem no Vercel!**

