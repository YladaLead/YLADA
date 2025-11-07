# 📍 ONDE COLOCAR OS PRICE IDs DO STRIPE

## ⚠️ IMPORTANTE: Product ID vs Price ID

- **Product ID:** `prod_xxxxxxxxxxxxx` ❌ (não é isso que precisamos)
- **Price ID:** `price_xxxxxxxxxxxxx` ✅ (é isso que precisamos!)

---

## 🔍 COMO ENCONTRAR O PRICE ID NO STRIPE

### No Stripe Dashboard:

1. **Acesse:** Products → Seu produto
2. **Role até:** Seção "Pricing"
3. **Você verá:** Lista de preços (Prices)
4. **Cada preço tem:**
   - Nome (ex: "YLADA BR Wellness - Mensal")
   - Price ID: `price_xxxxxxxxxxxxx` ← **COPIE ESTE!**

### Exemplo:

```
Produto: YLADA Wellness Brasil
├── Preço Mensal
│   └── Price ID: price_1ABC123... ← COPIE ESTE
└── Preço Anual
    └── Price ID: price_1XYZ789... ← COPIE ESTE
```

---

## 📝 ONDE COLOCAR NO `.env.local`

### Estrutura Completa:

```env
# =====================================================
# STRIPE BRASIL - WELLNESS
# =====================================================

# Plano Mensal (Assinatura)
STRIPE_PRICE_WELLNESS_MONTHLY_BR=price_xxxxxxxxxxxxx

# Plano Anual Parcelado (One-time - permite parcelamento)
STRIPE_PRICE_WELLNESS_ANNUAL_ONETIME_BR=price_xxxxxxxxxxxxx

# Plano Anual Normal (Fallback - se não tiver one-time)
STRIPE_PRICE_WELLNESS_ANNUAL_BR=price_xxxxxxxxxxxxx
```

---

## 🎯 NOMES DAS VARIÁVEIS

### Para Wellness Brasil:

| Plano | Variável | Onde Usar |
|-------|----------|-----------|
| **Mensal** | `STRIPE_PRICE_WELLNESS_MONTHLY_BR` | Assinatura recorrente |
| **Anual Parcelado** | `STRIPE_PRICE_WELLNESS_ANNUAL_ONETIME_BR` | Pagamento único (parcelado) |
| **Anual Normal** | `STRIPE_PRICE_WELLNESS_ANNUAL_BR` | Fallback (se não tiver one-time) |

### Para Outras Áreas (Nutri, Coach, Nutra):

```env
# Nutri
STRIPE_PRICE_NUTRI_MONTHLY_BR=price_xxxxxxxxxxxxx
STRIPE_PRICE_NUTRI_ANNUAL_ONETIME_BR=price_xxxxxxxxxxxxx

# Coach
STRIPE_PRICE_COACH_MONTHLY_BR=price_xxxxxxxxxxxxx
STRIPE_PRICE_COACH_ANNUAL_ONETIME_BR=price_xxxxxxxxxxxxx

# Nutra
STRIPE_PRICE_NUTRA_MONTHLY_BR=price_xxxxxxxxxxxxx
STRIPE_PRICE_NUTRA_ANNUAL_ONETIME_BR=price_xxxxxxxxxxxxx
```

---

## 📋 PASSO A PASSO

### 1. Encontrar Price IDs no Stripe:

**Para Plano Mensal:**
1. Products → Seu produto mensal
2. Seção "Pricing"
3. Copiar Price ID do preço mensal

**Para Plano Anual (Parcelado):**
1. Products → Seu produto anual (One-time)
2. Seção "Pricing"
3. Copiar Price ID do preço one-time

### 2. Adicionar no `.env.local`:

```env
# Plano Mensal
STRIPE_PRICE_WELLNESS_MONTHLY_BR=price_1ABC123DEF456...

# Plano Anual Parcelado (One-time)
STRIPE_PRICE_WELLNESS_ANNUAL_ONETIME_BR=price_1XYZ789GHI012...
```

### 3. Reiniciar servidor:

```bash
npm run dev
```

---

## ⚠️ IMPORTANTE

### Para Parcelamento Funcionar:

O **plano anual** precisa ser:
- ✅ Tipo: `One-time` (não `Recurring`)
- ✅ Price ID colocado em: `STRIPE_PRICE_WELLNESS_ANNUAL_ONETIME_BR`

Se você colocar em `STRIPE_PRICE_WELLNESS_ANNUAL_BR` (sem `_ONETIME`):
- ⚠️ O código vai usar, mas pode não ter parcelamento
- ⚠️ Depende se o produto foi criado como `One-time` ou `Recurring`

---

## 🔄 COMO O CÓDIGO BUSCA

**Prioridade:**

1. **Plano Anual BR:** Busca `STRIPE_PRICE_WELLNESS_ANNUAL_ONETIME_BR` primeiro
2. **Se não encontrar:** Usa `STRIPE_PRICE_WELLNESS_ANNUAL_BR` como fallback
3. **Plano Mensal:** Sempre usa `STRIPE_PRICE_WELLNESS_MONTHLY_BR`

---

## ✅ EXEMPLO COMPLETO

```env
# =====================================================
# STRIPE BRASIL - WELLNESS
# =====================================================

# Mensal (Assinatura)
STRIPE_PRICE_WELLNESS_MONTHLY_BR=price_1ABC123mensal

# Anual Parcelado (One-time - permite parcelar)
STRIPE_PRICE_WELLNESS_ANNUAL_ONETIME_BR=price_1XYZ789anual

# Anual Normal (Fallback - opcional)
STRIPE_PRICE_WELLNESS_ANNUAL_BR=price_1XYZ789anual
```

---

## 🧪 COMO VERIFICAR SE ESTÁ CORRETO

1. **Verificar logs do servidor:**
   - Deve mostrar: `💰 Usando preço one-time (parcelado) para wellness anual BR`
   - Ou: `⚠️ Price ID one-time não encontrado, usando preço padrão`

2. **Testar checkout:**
   - Criar checkout anual
   - Verificar se aparece opção de parcelar

---

**Última atualização:** {{ data atual }}

