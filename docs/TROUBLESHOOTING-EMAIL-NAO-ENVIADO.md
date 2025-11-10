# 🔧 Troubleshooting: E-mail Não Está Sendo Enviado

## 🎯 Problema

E-mails não estão sendo enviados pelo Resend, mesmo com:
- ✅ API Key configurada
- ✅ Domínio verificado
- ✅ SQL executado
- ✅ API retornando 200

---

## 🔍 DIAGNÓSTICO PASSO A PASSO

### 1. Verificar Variáveis de Ambiente no Vercel

**Acesse:** Vercel → Settings → Environment Variables

**Verifique:**
- `RESEND_API_KEY` = deve começar com `re_` e ter ~40 caracteres
- `RESEND_FROM_EMAIL` = deve ser `noreply@ylada.com` (domínio verificado)
- `RESEND_FROM_NAME` = `YLADA`

**⚠️ IMPORTANTE:**
- Após alterar variáveis, **faça novo deploy**
- Variáveis só são aplicadas em novos deploys

### 2. Testar API de E-mail

**Rota de teste criada:** `/api/email/test`

**Como testar:**

**Opção A: Via Terminal**
```bash
curl -X POST https://www.ylada.com/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"email": "falaandre@gmail.com"}'
```

**Opção B: Via Console do Navegador**
```javascript
fetch('/api/email/test', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'falaandre@gmail.com' })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

**O que verificar:**
- Se retornar `success: true` → Resend está funcionando
- Se retornar `error` → Ver mensagem de erro

### 3. Verificar Logs no Vercel

**Acesse:** Vercel → Functions → Logs

**Procure por:**
- `📧 Tentando enviar e-mail`
- `📧 Enviando e-mail via Resend`
- `✅ E-mail enviado com sucesso`
- `❌ Erro ao enviar e-mail`

**Se não aparecer nenhum log:**
- A função pode não estar sendo chamada
- Verifique se o webhook está sendo executado

### 4. Verificar Logs no Resend

**Acesse:** https://resend.com/logs

**Verifique:**
- Se há tentativas de envio
- Se há erros registrados
- Status dos e-mails (se aparecerem)

**Se não aparecer nada:**
- Resend não está recebendo as requisições
- Pode ser problema com API Key

### 5. Verificar API Key

**Acesse:** https://resend.com/api-keys

**Verifique:**
- Se a API Key está **ativa** (não revogada)
- Se tem permissão **"Sending access"**
- Se a API Key no Vercel **corresponde** à do Resend

**Como comparar:**
1. No Vercel: Settings → Environment Variables → `RESEND_API_KEY`
2. No Resend: API Keys → Token (primeiros caracteres)
3. Devem começar com os mesmos caracteres

---

## 🐛 PROBLEMAS COMUNS E SOLUÇÕES

### ❌ Problema 1: API Key Inválida

**Sintomas:**
- Erro: `Unauthorized` ou `Invalid API Key`
- Logs mostram erro 401

**Solução:**
1. Verifique se a API Key está correta no Vercel
2. Verifique se a API Key não foi revogada no Resend
3. Crie nova API Key se necessário
4. Atualize no Vercel e faça novo deploy

### ❌ Problema 2: Domínio Não Verificado

**Sintomas:**
- Erro: `Domain not verified`
- E-mails não aparecem no Resend

**Solução:**
- ✅ Seu domínio `ylada.com` já está verificado
- Se ainda der erro, verifique se `RESEND_FROM_EMAIL` está como `noreply@ylada.com`

### ❌ Problema 3: FROM_EMAIL Incorreto

**Sintomas:**
- E-mails não são enviados
- Sem erros nos logs

**Solução:**
1. Verifique `RESEND_FROM_EMAIL` no Vercel
2. Deve ser: `noreply@ylada.com` (domínio verificado)
3. **NÃO use:** `onboarding@resend.dev` em produção

### ❌ Problema 4: E-mail de Admin Causando Conflito

**Sintomas:**
- Usuário admin não recebe e-mails
- Outros usuários recebem normalmente

**Solução:**
- **Não deveria causar problema**, mas se suspeitar:
  1. Verifique se há múltiplos usuários com mesmo e-mail
  2. Verifique logs para ver qual usuário está sendo usado
  3. O sistema busca por e-mail (case-insensitive)

### ❌ Problema 5: Erro Silencioso

**Sintomas:**
- API retorna 200
- Mas e-mail não é enviado
- Sem erros nos logs

**Solução:**
1. Verifique logs detalhados no Vercel
2. Use a rota `/api/email/test` para testar
3. Verifique se `emailData?.id` está sendo retornado
4. Se `emailData` for `null`, há erro silencioso

---

## 🧪 TESTE COMPLETO

### Passo 1: Testar API de Teste

```bash
curl -X POST https://www.ylada.com/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"email": "falaandre@gmail.com"}'
```

**Resultado esperado:**
```json
{
  "success": true,
  "message": "E-mail de teste enviado com sucesso!",
  "emailId": "abc123...",
  "from": "noreply@ylada.com",
  "to": "falaandre@gmail.com"
}
```

### Passo 2: Verificar no Resend

1. Acesse: https://resend.com/emails
2. Verifique se o e-mail de teste aparece
3. Se aparecer → Resend está funcionando
4. Se não aparecer → Problema com API Key ou domínio

### Passo 3: Testar Recuperação de Acesso

1. Acesse: `/pt/wellness/recuperar-acesso`
2. Digite: `falaandre@gmail.com`
3. Clique em "Enviar Link de Acesso"
4. Verifique logs no Vercel
5. Verifique se e-mail aparece no Resend

---

## 📋 CHECKLIST DE VERIFICAÇÃO

Marque cada item:

- [ ] API Key do Resend está ativa
- [ ] API Key no Vercel corresponde à do Resend
- [ ] `RESEND_FROM_EMAIL` = `noreply@ylada.com`
- [ ] Domínio `ylada.com` está verificado no Resend
- [ ] Variáveis foram atualizadas após último deploy
- [ ] Teste `/api/email/test` retorna sucesso
- [ ] E-mail de teste aparece no Resend
- [ ] Logs no Vercel mostram tentativas de envio
- [ ] Não há erros nos logs

---

## 🔧 PRÓXIMOS PASSOS

1. **Execute o teste:** `/api/email/test`
2. **Verifique o resultado:**
   - Se sucesso → Resend está OK, problema pode ser no webhook
   - Se erro → Veja mensagem de erro e corrija

3. **Se teste funcionar mas recuperação não:**
   - Verifique se usuário existe no banco
   - Verifique se tem subscription ativa
   - Verifique logs da API `/api/email/send-access-link`

4. **Se nada funcionar:**
   - Verifique se API Key está correta
   - Verifique se domínio está realmente verificado
   - Entre em contato com suporte do Resend

---

## 📞 SUPORTE

- **Resend Support:** support@resend.com
- **Documentação:** https://resend.com/docs
- **Status:** https://status.resend.com

---

**Última atualização:** Janeiro 2025

