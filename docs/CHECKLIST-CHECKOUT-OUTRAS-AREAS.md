# ✅ CHECKLIST: IMPLEMENTAR CHECKOUT NAS OUTRAS ÁREAS

## 📊 STATUS ATUAL

### **✅ JÁ PRONTO (Genérico - Funciona para todas as áreas):**
- ✅ API `/api/[area]/checkout` - Genérica, funciona para wellness, nutri, coach, nutra
- ✅ Lógica de pagamento (`payment-gateway.ts`) - Suporta todas as áreas
- ✅ Webhooks - Processam todas as áreas automaticamente
- ✅ Preços configurados - Todas as áreas têm preços definidos

### **❌ FALTANDO (Específico por área):**
- ❌ Página de checkout para **nutri**
- ❌ Página de checkout para **coach**
- ❌ Página de checkout para **nutra**
- ❌ Página de pagamento-sucesso para **nutri**
- ❌ Página de pagamento-sucesso para **coach**
- ❌ Página de pagamento-sucesso para **nutra**

---

## 📋 PREÇOS CONFIGURADOS

### **Brasil (Mercado Pago):**
- **Wellness:** R$ 59,90/mês | R$ 574,80/ano
- **Nutri:** R$ 97,00/mês | R$ 1.164,00/ano
- **Coach:** R$ 97,00/mês | R$ 1.164,00/ano
- **Nutra:** R$ 97,00/mês | R$ 1.164,00/ano

### **Internacional (Stripe):**
- **Wellness:** $15/mês | $150/ano
- **Nutri:** $25/mês | $198/ano
- **Coach:** $25/mês | $198/ano
- **Nutra:** $25/mês | $198/ano

---

## 🔧 O QUE PRECISA SER FEITO

### **1. Criar Páginas de Checkout**

**Para cada área (nutri, coach, nutra):**

1. **Copiar arquivo:**
   ```bash
   cp src/app/pt/wellness/checkout/page.tsx src/app/pt/[AREA]/checkout/page.tsx
   ```

2. **Substituir no arquivo:**
   - `perfil="wellness"` → `perfil="[AREA]"`
   - `/api/wellness/checkout` → `/api/[AREA]/checkout`
   - `/pt/wellness/login` → `/pt/[AREA]/login`
   - `/pt/wellness/pagamento-sucesso` → `/pt/[AREA]/pagamento-sucesso`
   - `WellnessCheckoutPage` → `[Area]CheckoutPage`
   - `WellnessCheckoutContent` → `[Area]CheckoutContent`

3. **Ajustar preços no componente:**
   - Verificar se os preços exibidos estão corretos
   - Nutri/Coach/Nutra: R$ 97,00/mês

---

### **2. Criar Páginas de Pagamento Sucesso**

**Para cada área (nutri, coach, nutra):**

1. **Copiar arquivo:**
   ```bash
   cp src/app/pt/wellness/pagamento-sucesso/page.tsx src/app/pt/[AREA]/pagamento-sucesso/page.tsx
   ```

2. **Substituir no arquivo:**
   - Links para `/pt/[AREA]/dashboard`
   - Links para `/pt/[AREA]/checkout` (se necessário)

---

## 📝 CHECKLIST DETALHADO

### **Nutri:**
- [ ] Criar `src/app/pt/nutri/checkout/page.tsx`
- [ ] Ajustar `perfil="nutri"`
- [ ] Ajustar API route para `/api/nutri/checkout`
- [ ] Ajustar rotas de login/sucesso
- [ ] Verificar preços (R$ 97,00/mês)
- [ ] Criar `src/app/pt/nutri/pagamento-sucesso/page.tsx`
- [ ] Ajustar links para nutri
- [ ] Testar checkout completo

### **Coach:**
- [ ] Criar `src/app/pt/coach/checkout/page.tsx`
- [ ] Ajustar `perfil="coach"`
- [ ] Ajustar API route para `/api/coach/checkout`
- [ ] Ajustar rotas de login/sucesso
- [ ] Verificar preços (R$ 97,00/mês)
- [ ] Criar `src/app/pt/coach/pagamento-sucesso/page.tsx`
- [ ] Ajustar links para coach
- [ ] Testar checkout completo

### **Nutra:**
- [ ] Criar `src/app/pt/nutra/checkout/page.tsx`
- [ ] Ajustar `perfil="nutra"`
- [ ] Ajustar API route para `/api/nutra/checkout`
- [ ] Ajustar rotas de login/sucesso
- [ ] Verificar preços (R$ 97,00/mês)
- [ ] Criar `src/app/pt/nutra/pagamento-sucesso/page.tsx`
- [ ] Ajustar links para nutra
- [ ] Testar checkout completo

---

## 🎯 RESUMO

**O que NÃO precisa fazer:**
- ❌ Criar APIs (já são genéricas)
- ❌ Configurar Mercado Pago/Stripe (já está)
- ❌ Configurar webhooks (já está)
- ❌ Configurar preços (já está)

**O que PRECISA fazer:**
- ✅ Criar 3 páginas de checkout
- ✅ Criar 3 páginas de pagamento-sucesso
- ✅ Ajustar rotas e links
- ✅ Testar cada área

**Tempo estimado:** ~1h30min

---

**Última atualização:** Janeiro 2025

