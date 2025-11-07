# ⚙️ COMO CONFIGURAR VARIÁVEIS DE AMBIENTE

## 🎯 RESUMO RÁPIDO

- **`.env.local`** = Desenvolvimento local (usa chaves de TESTE)
- **Vercel** = Produção (usa chaves de PRODUÇÃO)

---

## 📁 1. ARQUIVO `.env.local` (DESENVOLVIMENTO LOCAL)

### Onde fica:
Na **raiz do projeto** (mesmo nível do `package.json`)

### O que colocar:
**Use as chaves de TESTE** (para desenvolvimento)

```env
# =====================================================
# STRIPE BRASIL - TESTE (para desenvolvimento local)
# =====================================================

# Webhook Secret - TESTE
STRIPE_WEBHOOK_SECRET_BR=whsec_xxxxxxxxxxxxx

# API Keys - TESTE
STRIPE_SECRET_KEY_BR=sk_test_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_BR=pk_test_xxxxxxxxxxxxx
```

### ⚠️ IMPORTANTE:
- Use chaves de **TESTE** no `.env.local`
- Não use chaves de produção localmente
- O arquivo `.env.local` já está no `.gitignore` (não será commitado)

---

## ☁️ 2. VERCEL (PRODUÇÃO)

### Onde configurar:
1. Acesse: https://vercel.com/seu-projeto/settings/environment-variables
2. Ou: Vercel Dashboard → Seu Projeto → Settings → Environment Variables

### O que colocar:
**Use as chaves de PRODUÇÃO** (para produção)

### Variáveis para adicionar:

```
STRIPE_WEBHOOK_SECRET_BR = whsec_xxxxxxxxxxxxx
```

```
STRIPE_SECRET_KEY_BR = sk_live_xxxxxxxxxxxxx
```

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_BR = pk_live_xxxxxxxxxxxxx
```

### ⚠️ IMPORTANTE:
- Use chaves de **PRODUÇÃO** no Vercel
- Selecione o ambiente: **Production** (não Preview ou Development)
- Após adicionar, faça **redeploy** da aplicação

---

## 📋 CHECKLIST

### Para `.env.local` (Desenvolvimento):
- [ ] Arquivo criado na raiz do projeto
- [ ] Webhook Secret de TESTE adicionado
- [ ] Secret Key de TESTE adicionado
- [ ] Publishable Key de TESTE adicionado
- [ ] Servidor reiniciado (`npm run dev`)

### Para Vercel (Produção):
- [ ] Acessou Settings → Environment Variables
- [ ] Webhook Secret de PRODUÇÃO adicionado
- [ ] Secret Key de PRODUÇÃO adicionado
- [ ] Publishable Key de PRODUÇÃO adicionado
- [ ] Ambiente selecionado: **Production**
- [ ] Redeploy feito após adicionar variáveis

---

## 🔄 DIFERENÇAS

| Ambiente | Arquivo | Chaves Usadas | Quando Usar |
|----------|---------|---------------|-------------|
| **Desenvolvimento** | `.env.local` | TESTE (`sk_test_...`, `pk_test_...`) | Quando desenvolve localmente |
| **Produção** | Vercel | PRODUÇÃO (`sk_live_...`, `pk_live_...`) | Quando aplicação está no ar |

---

## 💡 DICA

**Para testar localmente com chaves de produção:**
- Não recomendado (risco de processar pagamentos reais)
- Se necessário, use Stripe CLI para testar webhooks localmente

---

## 📝 RESUMO

### `.env.local` (Local):
```env
STRIPE_WEBHOOK_SECRET_BR=whsec_xxxxxxxxxxxxx
STRIPE_SECRET_KEY_BR=sk_test_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_BR=pk_test_xxxxxxxxxxxxx
```

### Vercel (Produção):
```
STRIPE_WEBHOOK_SECRET_BR = whsec_xxxxxxxxxxxxx
STRIPE_SECRET_KEY_BR = sk_live_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_BR = pk_live_xxxxxxxxxxxxx
```

**⚠️ IMPORTANTE:** Substitua `xxxxxxxxxxxxx` pelas suas chaves reais do Stripe Dashboard.

---

**Última atualização:** {{ data atual }}

