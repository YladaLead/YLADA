# 🚨 AÇÃO URGENTE: CHAVE STRIPE EXPOSTA NO GITHUB

## ⚠️ ALERTA DE SEGURANÇA

Você recebeu um alerta do **GitGuardian** informando que um **Stripe Webhook Secret** foi exposto no GitHub.

---

## 🔴 O QUE FAZER AGORA (URGENTE)

### 1. REGENERAR A CHAVE NO STRIPE (IMEDIATO)

A chave exposta **DEVE ser regenerada** no Stripe:

#### Para Webhook de TESTE:
1. Acesse: **Stripe Dashboard → Developers → Webhooks**
2. Encontre seu webhook de **TESTE**
3. Clique em **"Reveal"** ou **"Rotate"** no Signing Secret
4. **Regenere** o secret
5. **Copie o novo secret**

#### Para Webhook de PRODUÇÃO:
1. Acesse: **Stripe Dashboard → Developers → Webhooks**
2. Encontre seu webhook de **PRODUÇÃO**
3. Clique em **"Reveal"** ou **"Rotate"** no Signing Secret
4. **Regenere** o secret
5. **Copie o novo secret**

### 2. ATUALIZAR VARIÁVEIS DE AMBIENTE

Após regenerar, atualize:

#### No `.env.local`:
```env
STRIPE_WEBHOOK_SECRET_BR=whsec_NOVO_SECRET_AQUI
```

#### No Vercel (se já estiver em produção):
1. Vercel Dashboard → Settings → Environment Variables
2. Atualize `STRIPE_WEBHOOK_SECRET_BR` com o novo secret

### 3. REMOVER CHAVE DO HISTÓRICO DO GIT (SE NECESSÁRIO)

Se a chave real foi commitada (não apenas placeholder):

1. **Verificar se foi commitada:**
   ```bash
   git log --all --full-history -S "whsec_SEU_SECRET_REAL" --source
   ```

2. **Se encontrar, remover do histórico:**
   - Use `git filter-branch` ou `git-filter-repo`
   - Ou force push (cuidado!)

3. **Alternativa mais segura:**
   - Regenerar a chave no Stripe (já feito acima)
   - A chave antiga fica inválida automaticamente

---

## ✅ VERIFICAÇÃO

### Arquivos que NÃO devem ter chaves reais:

- [ ] `docs/VARIAVEIS-AMBIENTE-STRIPE-COMPLETO.md` - ✅ Apenas placeholders
- [ ] `docs/COMO-CONFIGURAR-VARIAVEIS-AMBIENTE.md` - ✅ Apenas placeholders
- [ ] `docs/TEMPLATE-ENV-LOCAL-COMPLETO.md` - ✅ Apenas placeholders
- [ ] Qualquer arquivo `.md` na pasta `docs/` - ✅ Apenas placeholders

### Arquivos que DEVEM ter chaves (mas NÃO no Git):

- ✅ `.env.local` - Está no `.gitignore` (correto)
- ✅ `MINHAS-CHAVES-STRIPE-PRIVADO.txt` - Está no `.gitignore` (correto)

---

## 🔍 COMO VERIFICAR SE FOI COMMITADA

Execute:

```bash
# Procurar por webhook secrets reais no histórico
git log --all --full-history -S "whsec_" --source --oneline

# Ver conteúdo de commits suspeitos
git show <commit-hash> | grep -i "whsec_"
```

---

## 🛡️ PREVENÇÃO FUTURA

### ✅ Já implementado:

1. ✅ `.env.local` está no `.gitignore`
2. ✅ `MINHAS-CHAVES-STRIPE-PRIVADO.txt` está no `.gitignore`
3. ✅ Documentação usa apenas placeholders (`whsec_xxxxxxxxxxxxx`)

### ⚠️ Boas práticas:

1. **NUNCA** commite arquivos com chaves reais
2. **SEMPRE** use placeholders em documentação
3. **VERIFIQUE** antes de fazer commit:
   ```bash
   git diff --cached | grep -E "sk_|pk_|whsec_"
   ```
4. **USE** GitGuardian ou similar para monitorar

---

## 📋 CHECKLIST DE AÇÃO

- [ ] Regenerar webhook secret de TESTE no Stripe
- [ ] Regenerar webhook secret de PRODUÇÃO no Stripe
- [ ] Atualizar `.env.local` com novos secrets
- [ ] Atualizar Vercel com novos secrets (se em produção)
- [ ] Verificar histórico do Git (se necessário)
- [ ] Confirmar que chave antiga foi invalidada

---

## ⚠️ IMPORTANTE

**A chave antiga exposta está INVALIDA após regenerar no Stripe.**

Mesmo que alguém tenha visto a chave no GitHub, ela não funcionará mais após você regenerar no Stripe.

---

**Última atualização:** {{ data atual }}


