# 💰 PREÇOS NUTRA - ATUALIZADOS

## 📋 RESUMO DOS PREÇOS

### 🇧🇷 Brasil (R$)
- **Mensal**: R$ 97/mês
- **Anual**: R$ 97 x 12 = **R$ 1.164/ano** (pagamento único)

### 🌍 Internacional - Espanhol/Inglês ($)
- **Mensal**: $25/mês
- **Anual**: $198/ano (pagamento único)

---

## 🔧 CONFIGURAÇÃO NO STRIPE

### Brasil (Mercado Pago)
⚠️ **Nota**: Brasil agora usa Mercado Pago, não Stripe BR.

Os preços devem ser configurados no Mercado Pago:
- Mensal: R$ 97
- Anual: R$ 1.164

### Internacional (Stripe US)
Configure os seguintes Price IDs no Stripe Dashboard (conta US):

```env
# Nutra Mensal (Internacional)
STRIPE_PRICE_NUTRA_MONTHLY_US=price_xxxxxxxxxxxxx
# Valor: $25 USD

# Nutra Anual (Internacional)
STRIPE_PRICE_NUTRA_ANNUAL_US=price_xxxxxxxxxxxxx
# Valor: $198 USD
```

---

## 📄 ONDE OS PREÇOS SÃO EXIBIDOS

### Página de Vendas (`/pt/nutra/page.tsx`)
- ✅ **Atualizado**: Mostra R$ 97/mês e R$ 1.164/ano
- A página em português mostra apenas preços em R$ (Brasil)

### Checkout
- O sistema detecta automaticamente o país do usuário
- **Brasil**: Usa Mercado Pago com preços em R$
- **Internacional**: Usa Stripe US com preços em USD ($)

---

## 🎯 DETECÇÃO DE PAÍS

O sistema detecta automaticamente o país através de:
1. IP Country Code (header `x-vercel-ip-country` ou `cf-ipcountry`)
2. Accept-Language header
3. Timezone

**Países BR (Mercado Pago)**: América Latina
**Países US (Stripe)**: Resto do mundo

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [x] Atualizar preços na página de vendas PT (`/pt/nutra/page.tsx`)
- [ ] Configurar preços no Mercado Pago (Brasil)
- [ ] Criar produtos no Stripe US (Internacional)
- [ ] Adicionar Price IDs no `.env.local` e Vercel
- [ ] Testar checkout Brasil (Mercado Pago)
- [ ] Testar checkout Internacional (Stripe US)

---

## 📝 NOTAS

- O plano anual no Brasil é **R$ 97/mês x 12 = R$ 1.164/ano** (mesmo valor mensal, pagamento único)
- O plano anual internacional é **$198/ano** (economia de $102 comparado ao mensal)
- Os preços são aplicados automaticamente no checkout baseado na detecção de país

