# 🎯 FLUXO DE EXPERIÊNCIA DO USUÁRIO - UNIFICADO (Mercado Pago + Stripe)

## ⚠️ OBJETIVO CRÍTICO

**A experiência do usuário DEVE ser IDÊNTICA independente do gateway de pagamento.**

O usuário NÃO deve perceber diferença entre Mercado Pago e Stripe.

---

## 🔄 FLUXO COMPLETO (MESMO PARA AMBOS)

### 1. PÁGINA INICIAL DO USUÁRIO (Sua Página)
```
Usuário está em: /pt/wellness/checkout
├─ Escolhe plano (Mensal ou Anual)
├─ Clica em "Continuar para Pagamento"
└─ Sistema detecta país automaticamente
```

### 2. REDIRECIONAMENTO PARA CHECKOUT
```
Se BR → Redireciona para Mercado Pago Checkout
Se não BR → Redireciona para Stripe Checkout

IMPORTANTE: Usuário sai da sua página e vai para checkout externo
```

### 3. CHECKOUT EXTERNO (Mercado Pago OU Stripe)
```
Usuário faz pagamento no gateway externo:
├─ Preenche dados de pagamento
├─ Escolhe método (Pix, Cartão, etc.)
├─ Confirma pagamento
└─ Gateway processa pagamento
```

### 4. REDIRECIONAMENTO DE VOLTA (CRÍTICO!)
```
✅ AMBOS DEVEM REDIRECIONAR PARA:
/pt/wellness/pagamento-sucesso?payment_id={ID}&gateway={mercadopago|stripe}

URLs de retorno:
├─ Mercado Pago: success_url + back_urls
└─ Stripe: success_url
```

### 5. PÁGINA DE SUCESSO (MESMA PARA AMBOS)
```
Usuário vê: /pt/wellness/pagamento-sucesso
├─ Mostra "Pagamento Confirmado!"
├─ Botão "Acessar Dashboard"
├─ Link para suporte
└─ Aguarda webhook processar (3 segundos)
```

### 6. WEBHOOK PROCESSA (Background)
```
Gateway envia webhook → Nossa API processa:
├─ Verifica pagamento
├─ Ativa acesso no banco
├─ Envia e-mail de confirmação
└─ Cria registro de assinatura
```

### 7. E-MAIL DE CONFIRMAÇÃO
```
Usuário recebe e-mail (mesmo template para ambos):
├─ Título: "Pagamento Confirmado - YLADA Wellness"
├─ Mensagem de boas-vindas
├─ Link para dashboard
└─ Informações da assinatura
```

### 8. ACESSO AO DASHBOARD
```
Usuário clica em "Acessar Dashboard"
├─ Redireciona para: /pt/wellness/dashboard
├─ Acesso já está ativado (webhook processou)
└─ Pode começar a usar
```

---

## 🎨 INTERFACE - DEVE SER IDÊNTICA

### Página de Checkout (Sua Página)
```typescript
// Mesma interface, independente do gateway
<div>
  <h1>Finalizar Assinatura</h1>
  <PlanSelector />
  <button onClick={handleCheckout}>
    Continuar para Pagamento
  </button>
</div>
```

### Página de Sucesso (Mesma para Ambos)
```typescript
// EXATAMENTE a mesma página
<div>
  <h1>Pagamento Confirmado!</h1>
  <p>Sua assinatura foi ativada com sucesso</p>
  <Link href="/pt/wellness/dashboard">
    🚀 Acessar Dashboard
  </Link>
</div>
```

### E-mail de Confirmação (Mesmo Template)
```html
<!-- Mesmo template HTML para ambos -->
<h1>Pagamento Confirmado!</h1>
<p>Bem-vindo ao YLADA Wellness</p>
<a href="/pt/wellness/dashboard">Acessar Dashboard</a>
```

---

## 🔧 IMPLEMENTAÇÃO TÉCNICA

### 1. URLs de Retorno (CRÍTICO!)

#### Mercado Pago
```typescript
const preference = {
  back_urls: {
    success: `${baseUrl}/pt/wellness/pagamento-sucesso?payment_id={payment_id}&gateway=mercadopago`,
    failure: `${baseUrl}/pt/wellness/checkout?error=payment_failed`,
    pending: `${baseUrl}/pt/wellness/pagamento-sucesso?payment_id={payment_id}&gateway=mercadopago&status=pending`
  },
  auto_return: 'approved' // Redireciona automaticamente após pagamento
}
```

#### Stripe
```typescript
const session = {
  success_url: `${baseUrl}/pt/wellness/pagamento-sucesso?session_id={CHECKOUT_SESSION_ID}&gateway=stripe`,
  cancel_url: `${baseUrl}/pt/wellness/checkout?canceled=true`
}
```

**IMPORTANTE**: Ambos redirecionam para a MESMA página de sucesso!

---

### 2. Página de Sucesso Unificada

```typescript
// src/app/pt/wellness/pagamento-sucesso/page.tsx

export default function PagamentoSucessoPage() {
  const searchParams = useSearchParams()
  
  // Aceita parâmetros de AMBOS os gateways
  const paymentId = searchParams.get('payment_id') || searchParams.get('session_id')
  const gateway = searchParams.get('gateway') || 'stripe' // Default para compatibilidade
  
  // Verifica pagamento (independente do gateway)
  useEffect(() => {
    verifyPayment(paymentId, gateway)
  }, [paymentId, gateway])
  
  // Mesma interface para ambos
  return (
    <div>
      <h1>Pagamento Confirmado!</h1>
      {/* ... mesma UI ... */}
    </div>
  )
}
```

---

### 3. Verificação de Pagamento Unificada

```typescript
// src/lib/payment-verifier.ts

export async function verifyPayment(
  paymentId: string,
  gateway: 'mercadopago' | 'stripe'
): Promise<PaymentStatus> {
  if (gateway === 'mercadopago') {
    return await verifyMercadoPagoPayment(paymentId)
  } else {
    return await verifyStripePayment(paymentId)
  }
}
```

---

### 4. Webhook Handler Unificado

```typescript
// src/lib/payment-handler.ts

export async function handlePaymentSuccess(
  paymentId: string,
  gateway: 'mercadopago' | 'stripe',
  metadata: PaymentMetadata
) {
  // LÓGICA COMUM PARA AMBOS:
  
  // 1. Verificar pagamento no gateway
  const payment = await verifyPayment(paymentId, gateway)
  
  // 2. Ativar acesso no banco (mesma lógica)
  await activateUserAccess({
    userId: metadata.userId,
    area: metadata.area,
    planType: metadata.planType,
    expiresAt: calculateExpiration(metadata.planType)
  })
  
  // 3. Enviar e-mail (mesmo template)
  await sendConfirmationEmail({
    to: metadata.userEmail,
    template: 'payment-confirmed',
    data: {
      area: metadata.area,
      planType: metadata.planType,
      amount: payment.amount
    }
  })
  
  // 4. Criar registro de assinatura (mesma estrutura)
  await createSubscriptionRecord({
    userId: metadata.userId,
    gateway: gateway,
    gatewayPaymentId: paymentId,
    status: 'active',
    // ...
  })
}
```

---

## 📋 CHECKLIST DE SINCRONIZAÇÃO

### ✅ URLs de Retorno
- [ ] Mercado Pago redireciona para `/pt/wellness/pagamento-sucesso?payment_id=xxx&gateway=mercadopago`
- [ ] Stripe redireciona para `/pt/wellness/pagamento-sucesso?session_id=xxx&gateway=stripe`
- [ ] Ambos usam a MESMA página de sucesso
- [ ] URLs de cancelamento também são consistentes

### ✅ Página de Sucesso
- [ ] Aceita parâmetros de ambos os gateways
- [ ] Interface idêntica (mesmo design)
- [ ] Mesma mensagem de sucesso
- [ ] Mesmos botões e links
- [ ] Mesmo tempo de espera (3 segundos)

### ✅ Verificação de Pagamento
- [ ] Função unificada que funciona para ambos
- [ ] Retorna mesmo formato de dados
- [ ] Trata erros da mesma forma
- [ ] Logs consistentes

### ✅ Webhook Processing
- [ ] Handler unificado processa ambos
- [ ] Mesma lógica de ativação de acesso
- [ ] Mesma estrutura de dados no banco
- [ ] Mesmos logs e métricas

### ✅ E-mail de Confirmação
- [ ] Mesmo template HTML
- [ ] Mesma mensagem
- [ ] Mesmos links
- [ ] Mesmo design visual
- [ ] Enviado no mesmo momento

### ✅ Ativação de Acesso
- [ ] Mesma lógica para ambos
- [ ] Mesma tabela no banco
- [ ] Mesmos campos
- [ ] Mesma validação

### ✅ Tratamento de Erros
- [ ] Mesmas mensagens de erro
- [ ] Mesma página de erro
- [ ] Mesmo fluxo de recuperação

---

## 🚨 PONTOS CRÍTICOS DE ATENÇÃO

### 1. Redirecionamento Após Pagamento
```
❌ ERRADO:
- Mercado Pago → /mercadopago-success
- Stripe → /stripe-success

✅ CORRETO:
- Mercado Pago → /pt/wellness/pagamento-sucesso?payment_id=xxx&gateway=mercadopago
- Stripe → /pt/wellness/pagamento-sucesso?session_id=xxx&gateway=stripe
```

### 2. Parâmetros na URL
```
✅ Usar parâmetros consistentes:
- payment_id (Mercado Pago) ou session_id (Stripe)
- gateway (mercadopago ou stripe)
- status (opcional, para pending)

❌ NÃO usar:
- Diferentes nomes de parâmetros
- Diferentes formatos de ID
```

### 3. Tempo de Processamento
```
✅ Ambos devem:
- Mostrar loading por 3 segundos
- Aguardar webhook processar
- Verificar status antes de mostrar sucesso

❌ NÃO fazer:
- Mostrar sucesso imediatamente
- Não verificar pagamento
- Diferentes tempos de espera
```

### 4. E-mail de Confirmação
```
✅ Mesmo template, mesmo momento, mesmo conteúdo

❌ NÃO fazer:
- Templates diferentes
- Enviar em momentos diferentes
- Conteúdo diferente
```

---

## 🔍 TESTES DE SINCRONIZAÇÃO

### Teste 1: Fluxo Completo Mercado Pago
```
1. Acessar /pt/wellness/checkout
2. Escolher plano anual
3. Clicar em "Continuar para Pagamento"
4. ✅ Deve redirecionar para Mercado Pago
5. Fazer pagamento com Pix
6. ✅ Deve redirecionar para /pt/wellness/pagamento-sucesso?payment_id=xxx&gateway=mercadopago
7. ✅ Página deve mostrar "Pagamento Confirmado!"
8. ✅ Aguardar 3 segundos
9. ✅ Clicar em "Acessar Dashboard"
10. ✅ Deve redirecionar para /pt/wellness/dashboard
11. ✅ Acesso deve estar ativado
12. ✅ E-mail deve ter sido enviado
```

### Teste 2: Fluxo Completo Stripe
```
1. Acessar /pt/wellness/checkout (com IP não-BR)
2. Escolher plano mensal
3. Clicar em "Continuar para Pagamento"
4. ✅ Deve redirecionar para Stripe
5. Fazer pagamento com cartão
6. ✅ Deve redirecionar para /pt/wellness/pagamento-sucesso?session_id=xxx&gateway=stripe
7. ✅ Página deve mostrar "Pagamento Confirmado!" (MESMA página)
8. ✅ Aguardar 3 segundos
9. ✅ Clicar em "Acessar Dashboard"
10. ✅ Deve redirecionar para /pt/wellness/dashboard
11. ✅ Acesso deve estar ativado
12. ✅ E-mail deve ter sido enviado (MESMO template)
```

### Teste 3: Comparação Visual
```
1. Fazer pagamento com Mercado Pago
2. Tirar screenshot da página de sucesso
3. Fazer pagamento com Stripe
4. Tirar screenshot da página de sucesso
5. ✅ Screenshots devem ser IDÊNTICOS (exceto IDs)
```

---

## 📝 CÓDIGO DE EXEMPLO

### Checkout Route (Unificado)
```typescript
// src/app/api/wellness/checkout/route.ts

export async function POST(request: NextRequest) {
  const { planType } = await request.json()
  const countryCode = detectCountryCode(request)
  const gateway = countryCode === 'BR' ? 'mercadopago' : 'stripe'
  
  // Criar checkout no gateway apropriado
  const checkout = await createCheckout({
    gateway,
    planType,
    user,
    successUrl: `${baseUrl}/pt/wellness/pagamento-sucesso?payment_id={payment_id}&gateway=${gateway}`,
    cancelUrl: `${baseUrl}/pt/wellness/checkout?canceled=true`
  })
  
  // Redirecionar para checkout externo
  return NextResponse.json({
    checkoutUrl: checkout.url,
    gateway
  })
}
```

### Página de Sucesso (Unificada)
```typescript
// src/app/pt/wellness/pagamento-sucesso/page.tsx

export default function PagamentoSucessoPage() {
  const searchParams = useSearchParams()
  const paymentId = searchParams.get('payment_id') || searchParams.get('session_id')
  const gateway = searchParams.get('gateway') || 'stripe'
  
  useEffect(() => {
    if (paymentId) {
      verifyAndProcessPayment(paymentId, gateway)
    }
  }, [paymentId, gateway])
  
  // MESMA interface para ambos
  return (
    <div className="pagamento-sucesso">
      <h1>Pagamento Confirmado!</h1>
      <p>Sua assinatura foi ativada com sucesso</p>
      <Link href="/pt/wellness/dashboard">
        🚀 Acessar Dashboard
      </Link>
    </div>
  )
}
```

---

## ✅ GARANTIAS DE SINCRONIZAÇÃO

1. **Mesma URL de retorno** → Ambos redirecionam para mesma página
2. **Mesma página de sucesso** → Interface idêntica
3. **Mesma verificação** → Lógica unificada
4. **Mesmo webhook handler** → Processamento idêntico
5. **Mesmo e-mail** → Template único
6. **Mesma ativação** → Lógica comum
7. **Mesmos logs** → Formato consistente

---

## 🎯 RESULTADO FINAL

O usuário NÃO deve conseguir distinguir se pagou via Mercado Pago ou Stripe. A experiência deve ser **100% idêntica** em todos os aspectos:

- ✅ Mesma página de checkout inicial
- ✅ Mesmo redirecionamento para gateway externo
- ✅ Mesma página de sucesso
- ✅ Mesmo e-mail de confirmação
- ✅ Mesmo acesso ao dashboard
- ✅ Mesma experiência visual
- ✅ Mesmo tempo de processamento

**O gateway é transparente para o usuário final.**

