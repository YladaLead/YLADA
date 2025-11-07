# 💳 HABILITAR PIX E PARCELAMENTO NO BRASIL

## 🎯 O QUE FOI IMPLEMENTADO

O código foi atualizado para habilitar automaticamente:
- ✅ **Pix** (através do método `link`)
- ✅ **Parcelamento** (para cartões, quando disponível)

---

## 🔧 COMO FUNCIONA

### Pix (Link)

Quando o cliente é do Brasil:
- O Stripe automaticamente adiciona a opção **Pix** no checkout
- O cliente pode escolher entre cartão ou Pix
- Pix é processado instantaneamente

### Parcelamento

**Importante:** Para assinaturas recorrentes:
- **Plano Mensal:** Cliente paga R$ 59,90 todo mês (não há parcelamento)
- **Plano Anual:** Cliente paga R$ 570,00 de uma vez (não há parcelamento tradicional)

**Parcelamento se aplica a:**
- Pagamentos únicos (não assinaturas)
- O Stripe mostra opções de parcelamento automaticamente quando disponível

---

## ⚙️ CONFIGURAÇÃO NO STRIPE DASHBOARD

### 1. Habilitar Pix (Link)

1. **Acesse:** Stripe Dashboard → Settings → Payment methods
2. **Procure por:** "Link" ou "Pix"
3. **Habilite:** Link (isso habilita Pix automaticamente no Brasil)
4. **Salve** as alterações

### 2. Verificar Configurações de Parcelamento

1. **Acesse:** Stripe Dashboard → Settings → Payment methods → Cards
2. **Verifique:** Se "Installments" está habilitado
3. **Para Brasil:** O Stripe deve mostrar opções de parcelamento automaticamente

---

## 📋 O QUE MUDOU NO CÓDIGO

### Antes:
```typescript
payment_method_types: ['card']
```

### Depois:
```typescript
// Para Brasil: card + link (Pix)
// Para outros países: apenas card
const paymentMethodTypes: string[] = ['card']
if (stripeAccount === 'br' || countryCode === 'BR') {
  paymentMethodTypes.push('link') // Habilita Pix
}

// Parcelamento para cartão (Brasil)
payment_method_options: {
  card: {
    installments: {
      enabled: true
    }
  }
}
```

---

## 🧪 COMO TESTAR

### Testar Pix:

1. **Criar checkout** de teste
2. **No checkout do Stripe**, você verá opção "Pix" ou "Link"
3. **Cliente pode escolher** Pix em vez de cartão
4. **Pagamento é instantâneo**

### Testar Parcelamento:

1. **Criar checkout** de teste
2. **Selecionar cartão** como método de pagamento
3. **O Stripe mostrará** opções de parcelamento (se disponível)
4. **Cliente pode escolher** número de parcelas

---

## ⚠️ LIMITAÇÕES IMPORTANTES

### Parcelamento em Assinaturas:

**O Stripe NÃO oferece parcelamento tradicional para assinaturas recorrentes.**

- **Mensal:** Cliente paga todo mês (não é parcelamento)
- **Anual:** Cliente paga valor total de uma vez (não é parcelamento)

**O que você pode fazer:**
- Mostrar "equivalente a 12x de R$ 47,50" na interface
- Mas o Stripe cobra R$ 570,00 de uma vez
- Isso é uma limitação do modelo de assinatura

### Parcelamento Real:

Para oferecer parcelamento real (12x de R$ 47,50), você precisaria:
- Usar gateway brasileiro (Mercado Pago, Asaas)
- Ou criar pagamentos únicos em vez de assinaturas
- Mais complexo, mas oferece parcelamento verdadeiro

---

## ✅ CHECKLIST

### No Stripe Dashboard:

- [ ] Habilitar Link (Pix) em Settings → Payment methods
- [ ] Verificar se Installments está habilitado para cartões
- [ ] Testar checkout com Pix
- [ ] Testar checkout com cartão (verificar parcelamento)

### No Código:

- [ ] Código atualizado (já feito ✅)
- [ ] Testar checkout Wellness
- [ ] Testar checkout outras áreas
- [ ] Verificar se Pix aparece para clientes BR
- [ ] Verificar se parcelamento aparece (quando aplicável)

---

## 💡 DICAS

1. **Pix é automático:** Quando você adiciona `'link'`, o Stripe mostra Pix automaticamente para clientes brasileiros

2. **Parcelamento limitado:** Para assinaturas, o "parcelamento" é apenas visual (equivalente mensal), não real

3. **Teste primeiro:** Sempre teste com cartões de teste antes de usar em produção

4. **Comunicação clara:** Na página de checkout, explique que:
   - Plano anual = pagamento único (não parcelado)
   - Mas equivalente a X parcelas mensais

---

## 📝 RESUMO

**O que foi habilitado:**
- ✅ Pix (através de Link) - automático para Brasil
- ✅ Parcelamento (para cartões, quando aplicável)

**Limitações:**
- ⚠️ Assinaturas não podem ser parceladas tradicionalmente
- ⚠️ Anual = pagamento único, não 12 parcelas

**Próximos passos:**
1. Habilitar Link no Stripe Dashboard
2. Testar checkout com Pix
3. Testar checkout com cartão
4. Verificar se tudo funciona corretamente

---

**Última atualização:** {{ data atual }}

