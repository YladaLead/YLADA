# 📋 IMPLEMENTAR CHECKOUT NAS OUTRAS ÁREAS

## ✅ O QUE JÁ ESTÁ PRONTO (GENÉRICO)

### **1. API de Checkout** ✅
- `/api/[area]/checkout` - **Já funciona para todas as áreas**
- Detecta automaticamente: wellness, nutri, coach, nutra
- Não precisa criar APIs específicas

### **2. Lógica de Pagamento** ✅
- `payment-gateway.ts` - **Já suporta todas as áreas**
- `payment-helpers.ts` - **Já suporta todas as áreas**
- Mercado Pago e Stripe - **Já configurados**

### **3. Webhook** ✅
- `/api/webhooks/mercado-pago` - **Já processa todas as áreas**
- `/api/webhooks/stripe-us` - **Já processa todas as áreas**

---

## ❌ O QUE PRECISA SER CRIADO

### **1. Páginas de Checkout**

**Arquivos que precisam ser criados:**
- `src/app/pt/nutri/checkout/page.tsx`
- `src/app/pt/coach/checkout/page.tsx`
- `src/app/pt/nutra/checkout/page.tsx`

**Base:** Copiar de `src/app/pt/wellness/checkout/page.tsx` e ajustar:
- `perfil="wellness"` → `perfil="nutri"` (ou coach/nutra)
- `/api/wellness/checkout` → `/api/nutri/checkout` (ou coach/nutra)
- `/pt/wellness/login` → `/pt/nutri/login` (ou coach/nutra)
- `/pt/wellness/pagamento-sucesso` → `/pt/nutri/pagamento-sucesso` (ou coach/nutra)

---

### **2. Páginas de Pagamento Sucesso**

**Arquivos que precisam ser criados:**
- `src/app/pt/nutri/pagamento-sucesso/page.tsx`
- `src/app/pt/coach/pagamento-sucesso/page.tsx`
- `src/app/pt/nutra/pagamento-sucesso/page.tsx`

**Base:** Copiar de `src/app/pt/wellness/pagamento-sucesso/page.tsx` e ajustar:
- Links e rotas para a área específica

---

## 📝 CHECKLIST DE IMPLEMENTAÇÃO

### **Para cada área (nutri, coach, nutra):**

- [ ] Criar `src/app/pt/[area]/checkout/page.tsx`
  - [ ] Ajustar `perfil` para a área
  - [ ] Ajustar API route (`/api/[area]/checkout`)
  - [ ] Ajustar rotas de login e sucesso
  - [ ] Testar checkout

- [ ] Criar `src/app/pt/[area]/pagamento-sucesso/page.tsx`
  - [ ] Ajustar links para a área
  - [ ] Testar redirecionamento

- [ ] Verificar preços no `payment-gateway.ts`
  - [ ] Verificar se preços estão configurados para a área
  - [ ] Ajustar se necessário

---

## 🔧 PASSO A PASSO

### **1. Criar Checkout para Nutri**

1. Copiar `src/app/pt/wellness/checkout/page.tsx`
2. Salvar como `src/app/pt/nutri/checkout/page.tsx`
3. Substituir:
   - `perfil="wellness"` → `perfil="nutri"`
   - `/api/wellness/checkout` → `/api/nutri/checkout`
   - `/pt/wellness/login` → `/pt/nutri/login`
   - `/pt/wellness/pagamento-sucesso` → `/pt/nutri/pagamento-sucesso`

### **2. Criar Pagamento Sucesso para Nutri**

1. Copiar `src/app/pt/wellness/pagamento-sucesso/page.tsx`
2. Salvar como `src/app/pt/nutri/pagamento-sucesso/page.tsx`
3. Ajustar links e rotas para nutri

### **3. Repetir para Coach e Nutra**

Mesmo processo para cada área.

---

## 💰 VERIFICAR PREÇOS

### **Preços Atuais (Brasil - Mercado Pago):**

```typescript
// src/lib/payment-gateway.ts
const prices: Record<string, Record<string, number>> = {
  wellness: {
    monthly: 59.90,
    annual: 470.72,
  },
  nutri: {
    monthly: 0, // ⚠️ PRECISA CONFIGURAR
    annual: 0,  // ⚠️ PRECISA CONFIGURAR
  },
  coach: {
    monthly: 0, // ⚠️ PRECISA CONFIGURAR
    annual: 0,  // ⚠️ PRECISA CONFIGURAR
  },
  nutra: {
    monthly: 0, // ⚠️ PRECISA CONFIGURAR
    annual: 0,  // ⚠️ PRECISA CONFIGURAR
  },
}
```

**Ação necessária:** Definir preços para nutri, coach e nutra.

---

## 🎯 RESUMO

### **O que NÃO precisa fazer:**
- ❌ Criar APIs específicas (já são genéricas)
- ❌ Configurar Mercado Pago/Stripe (já está configurado)
- ❌ Configurar webhooks (já está configurado)

### **O que PRECISA fazer:**
- ✅ Criar 3 páginas de checkout (nutri, coach, nutra)
- ✅ Criar 3 páginas de pagamento-sucesso (nutri, coach, nutra)
- ✅ Configurar preços no `payment-gateway.ts`

---

## 📊 TEMPO ESTIMADO

- **Checkout:** ~15 minutos por área (3 áreas = 45 min)
- **Pagamento Sucesso:** ~10 minutos por área (3 áreas = 30 min)
- **Configurar Preços:** ~5 minutos
- **Total:** ~1h20min

---

**Última atualização:** Janeiro 2025

