# 🚀 COMO USAR O SCRIPT PARA CRIAR PRODUTOS NO STRIPE

## 📋 PRÉ-REQUISITOS

1. Ter `STRIPE_SECRET_KEY_BR` configurado no `.env.local` (para teste)
2. Ter `STRIPE_SECRET_KEY_BR_LIVE` configurado no `.env.local` (para produção - opcional)

---

## 🎯 USO DO SCRIPT

### Criar Produtos no Modo TESTE:

```bash
npm run create-stripe-products -- --mode test
```

### Criar Produtos no Modo PRODUÇÃO:

```bash
npm run create-stripe-products -- --mode live
```

---

## 📝 O QUE O SCRIPT FAZ

1. **Cria Produto Mensal:**
   - Nome: "YLADA Wellness Brasil - Mensal"
   - Preço: R$ 59,90/mês (Recurring - Monthly)
   - Tipo: Assinatura recorrente

2. **Cria Produto Anual:**
   - Nome: "YLADA Wellness BR - Anual Parcelado"
   - Preço: R$ 570,00 (One-time)
   - Tipo: Pagamento único (permite parcelamento)

3. **Mostra os Price IDs:**
   - Copie os Price IDs que aparecem no final
   - Adicione no `.env.local`

---

## ✅ EXEMPLO DE EXECUÇÃO

```bash
$ npm run create-stripe-products -- --mode test

🚀 Criando produtos no Stripe (Modo: TESTE)

📦 Criando produto mensal...
   ✅ Produto criado: prod_xxxxxxxxxxxxx
   ✅ Preço mensal criado: price_xxxxxxxxxxxxx
   💰 Price ID: price_1SQmi9RN0Ga5apy8bklmiOuL

📦 Criando produto anual (parcelado)...
   ✅ Produto criado: prod_xxxxxxxxxxxxx
   ✅ Preço anual criado: price_xxxxxxxxxxxxx
   💰 Price ID: price_1SQo0RRN0Ga5apy89od4tBV7

============================================================
✅ PRODUTOS CRIADOS COM SUCESSO!

📋 Adicione estas variáveis no .env.local:

STRIPE_PRICE_WELLNESS_MONTHLY_BR=price_1SQmi9RN0Ga5apy8bklmiOuL
STRIPE_PRICE_WELLNESS_ANNUAL_ONETIME_BR=price_1SQo0RRN0Ga5apy89od4tBV7

============================================================

⚠️  IMPORTANTE:
   1. Copie os Price IDs acima
   2. Adicione no .env.local
   3. Reinicie o servidor (npm run dev)
```

---

## 🔄 PRÓXIMOS PASSOS

1. **Execute o script** para modo TESTE
2. **Copie os Price IDs** mostrados
3. **Adicione no `.env.local`**
4. **Reinicie o servidor** (`npm run dev`)
5. **Teste o checkout**
6. **Depois, execute para modo LIVE** e configure no Vercel

---

## ⚠️ IMPORTANTE

- **Modo TESTE:** Use para desenvolvimento local
- **Modo LIVE:** Use para produção (configure no Vercel)
- **Não misture:** Price IDs de teste não funcionam em produção

---

**Última atualização:** {{ data atual }}

