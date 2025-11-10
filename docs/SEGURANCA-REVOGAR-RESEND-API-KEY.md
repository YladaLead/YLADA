# 🚨 URGENTE: Revogar API Key do Resend Exposta

## ⚠️ ALERTA DE SEGURANÇA

Uma API Key do Resend foi detectada como exposta no GitHub pelo GitGuardian.

**API Key exposta:** `re_9XRiCdTz_GPphuZGNyfRb3xeCpuf1AkE6`

**Ação imediata necessária:** Revogar esta chave e gerar uma nova.

---

## 🔒 PASSO A PASSO PARA REVOGAR

### 1. Acessar Painel do Resend

1. Acesse: https://resend.com/api-keys
2. Faça login na sua conta

### 2. Revogar API Key Exposta

1. Encontre a API Key `re_9XRiCdTz_GPphuZGNyfRb3xeCpuf1AkE6`
2. Clique no botão de **"Delete"** ou **"Revoke"**
3. Confirme a revogação

### 3. Gerar Nova API Key

1. Clique em **"Create API Key"**
2. Nome: `YLADA Production (Nova)`
3. Permissão: **Sending access**
4. Domain: **All Domains**
5. **Copie a nova chave** (ela só aparece uma vez!)

### 4. Atualizar em Todos os Lugares

**⚠️ IMPORTANTE:** Atualize a nova chave em:

1. **`.env.local`** (desenvolvimento)
   ```env
   RESEND_API_KEY=nova_chave_aqui
   ```

2. **Vercel** (produção)
   - Settings → Environment Variables
   - Editar `RESEND_API_KEY` com a nova chave
   - Fazer novo deploy

3. **Qualquer outro lugar** onde a chave esteja configurada

### 5. Verificar se Funciona

1. Fazer um pagamento de teste
2. Verificar se o e-mail foi enviado
3. Verificar logs do Resend para confirmar que a nova chave está funcionando

---

## 🛡️ PREVENÇÃO FUTURA

### ✅ Boas Práticas

1. **NUNCA** commite credenciais no Git
2. **SEMPRE** use variáveis de ambiente
3. **SEMPRE** use placeholders (`re_xxxxxxxxxxxxx`) em documentação
4. **SEMPRE** adicione `.env.local` ao `.gitignore`
5. **SEMPRE** revise commits antes de fazer push

### ✅ Checklist Antes de Commitar

- [ ] Verifique se há credenciais no código
- [ ] Verifique se há credenciais na documentação
- [ ] Use `git diff` para ver o que está sendo commitado
- [ ] Use ferramentas como GitGuardian para escanear

---

## 📞 SUPORTE

- **Resend Support:** support@resend.com
- **GitGuardian:** https://dashboard.gitguardian.com

---

## ⏰ PRAZO

**Revogue a chave IMEDIATAMENTE** - quanto mais tempo passar, maior o risco de uso indevido.

---

**Status:** ✅ API Key removida da documentação
**Próximo passo:** Revogar a chave no Resend e gerar uma nova

