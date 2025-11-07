# 🔧 RESOLVER ERRO: "Price ID não configurado"

## ❌ ERRO

```
Price ID não configurado para wellness monthly br. 
Configure STRIPE_PRICE_WELLNESS_MONTHLY_BR no .env
```

---

## ✅ SOLUÇÃO RÁPIDA

### 1. Verificar se a variável está no `.env.local`

Abra o arquivo `.env.local` na raiz do projeto e verifique se tem:

```env
STRIPE_PRICE_WELLNESS_MONTHLY_BR=price_1SQmi9RN0Ga5apy8bklmiOuL
STRIPE_PRICE_WELLNESS_ANNUAL_ONETIME_BR=price_1SQo0RRN0Ga5apy89od4tBV7
```

### 2. Verificar se não tem espaços extras

❌ **ERRADO:**
```env
STRIPE_PRICE_WELLNESS_MONTHLY_BR = price_1SQmi9RN0Ga5apy8bklmiOuL
```

✅ **CORRETO:**
```env
STRIPE_PRICE_WELLNESS_MONTHLY_BR=price_1SQmi9RN0Ga5apy8bklmiOuL
```

**IMPORTANTE:** Não pode ter espaços antes ou depois do `=`

### 3. Reiniciar o servidor

Após adicionar ou modificar variáveis no `.env.local`, você **DEVE** reiniciar o servidor:

```bash
# Parar o servidor (Ctrl + C)
# Depois iniciar novamente:
npm run dev
```

### 4. Verificar se está na raiz do projeto

O arquivo `.env.local` deve estar na **raiz do projeto**, mesmo nível do `package.json`:

```
ylada-app/
├── .env.local          ← AQUI
├── package.json
├── src/
└── ...
```

---

## 🔍 VERIFICAÇÃO COMPLETA

### Checklist:

- [ ] Arquivo `.env.local` existe na raiz
- [ ] Variável `STRIPE_PRICE_WELLNESS_MONTHLY_BR` está presente
- [ ] Não tem espaços antes/depois do `=`
- [ ] Valor começa com `price_`
- [ ] Servidor foi reiniciado após adicionar variável
- [ ] Não tem aspas no valor (não precisa)

---

## 📝 EXEMPLO CORRETO DO `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-chave-aqui

STRIPE_WEBHOOK_SECRET_BR=whsec_xxxxxxxxxxxxx
STRIPE_SECRET_KEY_BR=sk_test_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_BR=pk_test_xxxxxxxxxxxxx

STRIPE_PRICE_WELLNESS_MONTHLY_BR=price_1SQmi9RN0Ga5apy8bklmiOuL
STRIPE_PRICE_WELLNESS_ANNUAL_ONETIME_BR=price_1SQo0RRN0Ga5apy89od4tBV7
```

---

## 🐛 SE AINDA NÃO FUNCIONAR

### 1. Verificar logs do servidor

Ao iniciar o servidor, verifique se não há erros de leitura do `.env.local`

### 2. Verificar se o arquivo está sendo ignorado

O `.env.local` deve estar no `.gitignore`, mas **não** deve estar sendo ignorado pelo Next.js.

### 3. Testar manualmente

Adicione um `console.log` temporário no código para verificar:

```typescript
// Em src/lib/stripe-helpers.ts (temporário)
console.log('🔍 Verificando variáveis:', {
  monthly: process.env.STRIPE_PRICE_WELLNESS_MONTHLY_BR,
  annual: process.env.STRIPE_PRICE_WELLNESS_ANNUAL_ONETIME_BR
})
```

---

## ✅ APÓS CORRIGIR

1. Salve o arquivo `.env.local`
2. Reinicie o servidor (`npm run dev`)
3. Recarregue a página do checkout
4. O erro deve desaparecer

---

**Última atualização:** {{ data atual }}

