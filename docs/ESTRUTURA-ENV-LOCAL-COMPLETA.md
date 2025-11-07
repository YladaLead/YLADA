# 📋 ESTRUTURA COMPLETA DO .env.local

## ✅ SIM, VOCÊ PODE TER TODAS AS CHAVES NO .env.local!

É uma boa prática ter todas as chaves (teste e produção) no `.env.local`. O código escolhe automaticamente qual usar.

---

## 🔄 COMO O CÓDIGO ESCOLHE

O código verifica nesta ordem:

1. **Se `NODE_ENV === 'production'`** → usa chaves com sufixo `_LIVE` ou sem sufixo
2. **Se `NODE_ENV !== 'production'`** → usa chaves com sufixo `_TEST` ou sem sufixo

**Exemplo:**
- Localhost (`npm run dev`) → `NODE_ENV !== 'production'` → usa `_TEST`
- Vercel Produção → `NODE_ENV === 'production'` → usa `_LIVE` ou sem sufixo

---

## 📝 ESTRUTURA RECOMENDADA DO .env.local

```env
# =====================================================
# STRIPE BRASIL - TESTE
# =====================================================

# Webhook Secret - TESTE
STRIPE_WEBHOOK_SECRET_BR_TEST=whsec_xxxxxxxxxxxxx

# API Keys - TESTE
STRIPE_SECRET_KEY_BR_TEST=sk_test_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_BR_TEST=pk_test_xxxxxxxxxxxxx

# =====================================================
# STRIPE BRASIL - PRODUÇÃO
# =====================================================

# Webhook Secret - PRODUÇÃO
STRIPE_WEBHOOK_SECRET_BR=whsec_xxxxxxxxxxxxx

# API Keys - PRODUÇÃO
STRIPE_SECRET_KEY_BR=sk_live_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_BR=pk_live_xxxxxxxxxxxxx
```

---

## 💡 VANTAGENS DE TER TUDO NO .env.local

1. **Conveniência:** Todas as chaves em um só lugar
2. **Flexibilidade:** Pode testar produção localmente se necessário
3. **Organização:** Fácil de encontrar e atualizar
4. **Segurança:** Arquivo já está no `.gitignore`

---

## ⚠️ IMPORTANTE

- O arquivo `.env.local` **NÃO** será commitado (já está no `.gitignore`)
- No Vercel, você só precisa das chaves de **PRODUÇÃO**
- Localmente, o código usa **TESTE** automaticamente

---

## 🎯 RESUMO

**No `.env.local` (local):**
- ✅ Pode ter todas as chaves (teste + produção)
- ✅ Código escolhe automaticamente qual usar
- ✅ Mais prático e organizado

**No Vercel (produção):**
- ✅ Só precisa das chaves de produção
- ✅ Não precisa de chaves de teste

---

**Última atualização:** {{ data atual }}
