# 💳 CONFIGURAR PLANO ANUAL COM PARCELAMENTO

## 🎯 PROBLEMA

Atualmente você tem:
- **Plano Mensal:** Assinatura recorrente (R$ 59,90/mês)
- **Plano Anual:** Assinatura anual (R$ 570,00 de uma vez, não parcelado)

**Cliente quer:** Plano anual parcelado em 12x de R$ 47,50

---

## ✅ SOLUÇÃO: CRIAR PAGAMENTO ÚNICO PARCELADO

Para ter parcelamento real, você precisa mudar o **plano anual** de **assinatura** para **pagamento único**.

### Como Funciona:

1. **Plano Mensal:** Continua como assinatura (R$ 59,90/mês)
2. **Plano Anual:** Vira pagamento único parcelado (12x de R$ 47,50)

---

## 🔧 COMO CONFIGURAR

### Opção 1: Pagamento Único com Parcelamento (Recomendado)

#### No Stripe Dashboard:

1. **Criar novo produto:** "YLADA Wellness BR - Anual Parcelado"
2. **Tipo:** `One-time` (não `Recurring`)
3. **Preço:** R$ 570,00 (valor total)
4. **Moeda:** BRL

#### No Código:

Você precisa criar uma rota separada para pagamento único:

```typescript
// Criar checkout com pagamento único (não assinatura)
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card', 'link'], // Pix + Cartão
  payment_method_options: {
    card: {
      installments: {
        enabled: true, // ✅ Agora funciona! (porque é pagamento único)
      }
    }
  },
  line_items: [
    {
      price_data: {
        currency: 'brl',
        product_data: {
          name: 'YLADA Wellness - Plano Anual',
        },
        unit_amount: 57000, // R$ 570,00 em centavos
      },
      quantity: 1,
    },
  ],
  mode: 'payment', // ✅ 'payment' em vez de 'subscription'
  // ... resto da configuração
})
```

**Resultado:**
- Cliente vê opção de parcelar em até 12x
- Stripe processa parcelamento real
- Cliente paga 12x de R$ 47,50

---

### Opção 2: Manter Assinatura + Explicar (Mais Simples)

Manter como está e comunicar claramente:

**Na página de checkout:**
```
Plano Anual: R$ 570,00
- Pagamento único anual
- Equivalente a R$ 47,50/mês
- Economia de 20,7% vs plano mensal
- ⚠️ Não é parcelado, é pagamento único
```

**Vantagens:**
- ✅ Mais simples (não precisa mudar código)
- ✅ Cliente entende que é pagamento único
- ✅ Você recebe tudo de uma vez

**Desvantagens:**
- ❌ Cliente não pode parcelar
- ❌ Pode perder vendas de quem quer parcelar

---

## 📋 IMPLEMENTAÇÃO RECOMENDADA

### Estrutura de Produtos:

1. **Plano Mensal (Assinatura):**
   - Tipo: `Recurring` → `Monthly`
   - Valor: R$ 59,90/mês
   - Cliente paga todo mês automaticamente

2. **Plano Anual Parcelado (Pagamento Único):**
   - Tipo: `One-time` (não Recurring)
   - Valor: R$ 570,00
   - Cliente pode parcelar em até 12x
   - Após pagar, você ativa acesso manualmente

3. **Plano Anual à Vista (Opcional):**
   - Tipo: `One-time`
   - Valor: R$ 570,00
   - Desconto para quem paga à vista
   - Cliente não pode parcelar

---

## 🔄 COMO FUNCIONA PARA O CLIENTE

### Cenário: Cliente escolhe Plano Anual Parcelado

1. **Cliente acessa checkout**
2. **Escolhe:** "Plano Anual - 12x de R$ 47,50"
3. **No checkout do Stripe:**
   - Vê opção de parcelar
   - Escolhe número de parcelas (até 12x)
   - Completa pagamento
4. **Você recebe:**
   - Primeira parcela imediatamente
   - Restante parcelado conforme escolhido
5. **Acesso:**
   - Você ativa acesso manualmente após confirmação
   - Ou cria sistema automático para ativar após pagamento

---

## ⚙️ CONFIGURAÇÃO NO STRIPE

### Criar Produto para Pagamento Único:

1. **Stripe Dashboard → Products → Add product**
2. **Nome:** `YLADA Wellness BR - Anual Parcelado`
3. **Tipo de Preço:** `One-time` (não Recurring)
4. **Valor:** R$ 570,00
5. **Moeda:** BRL
6. **✅ Copiar Price ID**

### Configurar Parcelamento:

1. **Settings → Payment methods → Cards**
2. **Verificar:** Installments está habilitado
3. **Para Brasil:** Deve estar ativo automaticamente

---

## 💻 CÓDIGO COMPLETO

Vou criar uma função auxiliar para você:

```typescript
// Criar checkout para plano anual parcelado (pagamento único)
async function createAnnualInstallmentCheckout(
  user: any,
  priceId: string, // Price ID do produto one-time
  baseUrl: string
) {
  const stripe = await getStripeInstance('br', false)
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'link'], // Pix + Cartão
    payment_method_options: {
      card: {
        installments: {
          enabled: true, // ✅ Parcelamento habilitado
        }
      }
    },
    line_items: [
      {
        price: priceId, // Price ID do produto one-time
        quantity: 1,
      },
    ],
    mode: 'payment', // ✅ 'payment' = pagamento único (permite parcelamento)
    customer_email: user.email,
    client_reference_id: user.id,
    metadata: {
      user_id: user.id,
      area: 'wellness',
      plan_type: 'annual_installment',
      stripe_account: 'br',
    },
    success_url: `${baseUrl}/pt/wellness/pagamento-sucesso?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/pt/wellness/checkout?canceled=true`,
    locale: 'pt-BR',
    currency: 'brl',
  })
  
  return session
}
```

---

## ⚠️ IMPORTANTE: DIFERENÇAS

| Aspecto | Assinatura Anual | Pagamento Único Parcelado |
|---------|------------------|---------------------------|
| **Tipo** | `mode: 'subscription'` | `mode: 'payment'` |
| **Parcelamento** | ❌ Não funciona | ✅ Funciona |
| **Renovação** | ✅ Automática | ❌ Manual (você precisa renovar) |
| **Acesso** | ✅ Automático | ⚠️ Precisa ativar manualmente |
| **Cobrança** | Todo ano automaticamente | Uma vez (parcelado) |

---

## 🎯 RECOMENDAÇÃO FINAL

### Estrutura Ideal:

1. **Plano Mensal:** Assinatura (R$ 59,90/mês)
   - Renovação automática
   - Cliente paga todo mês

2. **Plano Anual Parcelado:** Pagamento único (12x de R$ 47,50)
   - Cliente pode parcelar
   - Você precisa renovar manualmente após 12 meses
   - Ou criar sistema para renovar automaticamente

3. **Plano Anual à Vista (Opcional):** Pagamento único (R$ 570,00)
   - Desconto para quem paga à vista
   - Não pode parcelar

---

## 📝 PRÓXIMOS PASSOS

1. **Criar produto one-time no Stripe** (R$ 570,00)
2. **Atualizar código** para usar `mode: 'payment'` no plano anual
3. **Testar parcelamento** com cartão de teste
4. **Criar sistema de ativação** após pagamento (webhook)
5. **Comunicar claramente** ao cliente as opções

---

**Quer que eu implemente isso no código agora?**

