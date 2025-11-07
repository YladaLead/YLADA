# 🚀 PLANO DE INTEGRAÇÃO: MERCADO PAGO (BR) + STRIPE (INTERNACIONAL)

## 📋 ESTRATÉGIA PROPOSTA

### ✅ Vantagens
- **Brasil**: Mercado Pago oferece Pix + Parcelamento nativo
- **Internacional**: Stripe mantém integração global
- **Mesmo fluxo**: Interface unificada para o usuário
- **Menos travas**: Cada gateway no seu melhor cenário

### 🎯 Divisão de Responsabilidades

| País/Região | Gateway | Motivo |
|------------|--------|--------|
| 🇧🇷 Brasil | Mercado Pago | Pix + Parcelamento nativo |
| 🌍 Resto do Mundo | Stripe | Cobertura global, múltiplas moedas |

---

## 🏗️ ARQUITETURA PROPOSTA

### 1. Camada de Abstração (Payment Gateway)

Criar uma camada unificada que esconde a complexidade:

```
Frontend (Checkout)
    ↓
Payment Gateway Abstraction Layer
    ↓
    ├─→ Mercado Pago (Brasil)
    └─→ Stripe (Internacional)
```

### 2. Fluxo Unificado

```
1. Usuário escolhe plano
2. Sistema detecta país
3. Se BR → Mercado Pago
4. Se não BR → Stripe
5. Mesma página de sucesso
6. Mesmo webhook handler
```

---

## 📁 ESTRUTURA DE ARQUIVOS PROPOSTA

```
src/
├── lib/
│   ├── payment-gateway.ts          # ✅ NOVO: Camada de abstração
│   ├── mercado-pago.ts              # ✅ NOVO: Cliente Mercado Pago
│   └── stripe-helpers.ts            # ✅ EXISTENTE: Manter para internacional
│
├── app/
│   └── api/
│       ├── wellness/
│       │   └── checkout/
│       │       └── route.ts         # ✅ MODIFICAR: Usar gateway abstraction
│       │
│       └── webhooks/
│           ├── mercado-pago/
│           │   └── route.ts         # ✅ NOVO: Webhook Mercado Pago
│           ├── stripe-br/
│           │   └── route.ts         # ⚠️ DEPRECAR: Não usar mais
│           └── stripe-us/
│               └── route.ts         # ✅ MANTER: Para internacional
│
└── components/
    └── checkout/
        └── PaymentGatewaySelector.tsx  # ✅ NOVO: Componente unificado
```

---

## 🔧 IMPLEMENTAÇÃO PASSO A PASSO

### FASE 1: Preparação (Sem quebrar código atual)

#### 1.1. Criar abstração de gateway
```typescript
// src/lib/payment-gateway.ts

export type PaymentGateway = 'mercadopago' | 'stripe'
export type PaymentMethod = 'card' | 'pix' | 'boleto'

export interface CheckoutRequest {
  area: string
  planType: 'monthly' | 'annual'
  user: User
  countryCode: string
}

export interface CheckoutResponse {
  gateway: PaymentGateway
  checkoutUrl: string
  sessionId: string
  metadata: Record<string, string>
}

export interface PaymentGatewayAdapter {
  createCheckout(request: CheckoutRequest): Promise<CheckoutResponse>
  handleWebhook(event: any): Promise<void>
  verifyPayment(sessionId: string): Promise<boolean>
}
```

#### 1.2. Implementar adaptador Mercado Pago
```typescript
// src/lib/mercado-pago.ts

import { PaymentGatewayAdapter } from './payment-gateway'

export class MercadoPagoAdapter implements PaymentGatewayAdapter {
  async createCheckout(request: CheckoutRequest): Promise<CheckoutResponse> {
    // Implementar criação de preferência Mercado Pago
  }
  
  async handleWebhook(event: any): Promise<void> {
    // Processar webhook do Mercado Pago
  }
  
  async verifyPayment(sessionId: string): Promise<boolean> {
    // Verificar status do pagamento
  }
}
```

#### 1.3. Criar factory de gateway
```typescript
// src/lib/payment-gateway-factory.ts

export function getPaymentGateway(countryCode: string): PaymentGatewayAdapter {
  if (countryCode === 'BR') {
    return new MercadoPagoAdapter()
  }
  return new StripeAdapter() // Wrapper do Stripe existente
}
```

---

### FASE 2: Integração Mercado Pago

#### 2.1. Instalar SDK Mercado Pago
```bash
npm install mercadopago
```

#### 2.2. Configurar variáveis de ambiente
```env
# Mercado Pago (Brasil)
MERCADOPAGO_ACCESS_TOKEN=seu_access_token
MERCADOPAGO_PUBLIC_KEY=seu_public_key
MERCADOPAGO_WEBHOOK_SECRET=seu_webhook_secret

# Stripe (Internacional - manter)
STRIPE_SECRET_KEY_US=...
STRIPE_PUBLISHABLE_KEY_US=...
```

#### 2.3. Criar rota de checkout unificada
```typescript
// src/app/api/wellness/checkout/route.ts

import { getPaymentGateway } from '@/lib/payment-gateway-factory'

export async function POST(request: NextRequest) {
  // ... validações ...
  
  const countryCode = detectCountryCode(request)
  const gateway = getPaymentGateway(countryCode)
  
  const checkout = await gateway.createCheckout({
    area: 'wellness',
    planType,
    user,
    countryCode
  })
  
  return NextResponse.json({
    checkoutUrl: checkout.checkoutUrl,
    sessionId: checkout.sessionId,
    gateway: checkout.gateway
  })
}
```

---

### FASE 3: Webhooks Unificados

#### 3.1. Webhook Mercado Pago
```typescript
// src/app/api/webhooks/mercado-pago/route.ts

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  // Verificar assinatura do webhook
  // Processar eventos: payment.created, payment.updated, etc.
  // Ativar acesso do usuário
  // Enviar e-mail de confirmação
}
```

#### 3.2. Handler unificado de pagamento
```typescript
// src/lib/payment-handler.ts

export async function handlePaymentSuccess(
  gateway: PaymentGateway,
  sessionId: string,
  metadata: Record<string, string>
) {
  // Lógica comum para ambos os gateways:
  // 1. Verificar pagamento
  // 2. Ativar acesso no banco
  // 3. Enviar e-mail
  // 4. Criar registro de assinatura
}
```

---

## 💰 CONFIGURAÇÃO DE PREÇOS

### Mercado Pago (Brasil)

```typescript
const prices = {
  wellness: {
    monthly: {
      amount: 59.90,
      currency: 'BRL',
      description: 'Plano Mensal Wellness'
    },
    annual: {
      amount: 570.00,
      currency: 'BRL',
      description: 'Plano Anual Wellness',
      installments: true // ✅ Parcelamento habilitado
    }
  }
}
```

### Stripe (Internacional)

Manter configuração atual com Price IDs.

---

## 🎨 INTERFACE DO USUÁRIO

### Checkout Unificado

```typescript
// src/components/checkout/PaymentForm.tsx

export function PaymentForm({ planType, area }) {
  const { countryCode } = useCountry()
  const isBrazil = countryCode === 'BR'
  
  return (
    <div>
      {isBrazil ? (
        // Mostrar opções Mercado Pago: Pix, Cartão (parcelado), Boleto
        <MercadoPagoCheckout />
      ) : (
        // Mostrar opções Stripe: Cartão, etc.
        <StripeCheckout />
      )}
    </div>
  )
}
```

---

## 📊 COMPARAÇÃO: MERCADO PAGO vs STRIPE (BRASIL)

| Recurso | Mercado Pago | Stripe |
|---------|--------------|--------|
| **Pix** | ✅ Nativo (teste + produção) | ⚠️ Só produção |
| **Parcelamento** | ✅ Nativo (até 12x) | ❌ Não disponível |
| **Boleto** | ✅ Disponível | ⚠️ Limitado |
| **Cartão** | ✅ Todos os tipos | ✅ Todos os tipos |
| **Taxa** | ~4.99% | ~5.99% |
| **Repasse** | 14 dias | 7-14 dias |
| **Dashboard** | ✅ Completo | ✅ Completo |
| **API** | ✅ RESTful | ✅ RESTful |
| **Webhooks** | ✅ Sim | ✅ Sim |
| **SDK** | ✅ Node.js | ✅ Node.js |

---

## ⚠️ PONTOS DE ATENÇÃO

### 1. Migração de Dados
- Usuários com pagamento Stripe BR: manter histórico
- Novos pagamentos BR: usar Mercado Pago
- Não quebrar assinaturas ativas

### 2. Testes
- Ambiente de teste Mercado Pago (sandbox)
- Testar todos os métodos de pagamento
- Validar webhooks
- Testar fluxo completo

### 3. Monitoramento
- Logs unificados
- Alertas para falhas
- Dashboard de métricas

### 4. Suporte
- Documentação para equipe
- Fluxograma de troubleshooting
- Contatos de suporte de cada gateway

---

## 🚀 ROADMAP DE IMPLEMENTAÇÃO

### Semana 1: Preparação
- [ ] Criar conta Mercado Pago
- [ ] Configurar ambiente de teste
- [ ] Criar abstração de gateway
- [ ] Implementar adaptador Mercado Pago básico

### Semana 2: Integração
- [ ] Implementar checkout Mercado Pago
- [ ] Criar webhook handler
- [ ] Testar fluxo completo
- [ ] Validar parcelamento e Pix

### Semana 3: Unificação
- [ ] Integrar com rota de checkout existente
- [ ] Atualizar frontend
- [ ] Testes end-to-end
- [ ] Documentação

### Semana 4: Deploy e Monitoramento
- [ ] Deploy em staging
- [ ] Testes com usuários reais
- [ ] Deploy em produção
- [ ] Monitoramento e ajustes

---

## 📝 CHECKLIST DE IMPLEMENTAÇÃO

### Configuração Mercado Pago
- [ ] Criar conta Mercado Pago
- [ ] Obter Access Token
- [ ] Obter Public Key
- [ ] Configurar webhook URL
- [ ] Testar em sandbox

### Código
- [ ] Instalar SDK Mercado Pago
- [ ] Criar `payment-gateway.ts`
- [ ] Criar `mercado-pago.ts`
- [ ] Criar `payment-gateway-factory.ts`
- [ ] Modificar `checkout/route.ts`
- [ ] Criar `webhooks/mercado-pago/route.ts`
- [ ] Atualizar frontend

### Testes
- [ ] Testar checkout BR (Mercado Pago)
- [ ] Testar checkout internacional (Stripe)
- [ ] Testar Pix
- [ ] Testar parcelamento
- [ ] Testar webhooks
- [ ] Testar fluxo de erro

### Documentação
- [ ] Atualizar README
- [ ] Documentar variáveis de ambiente
- [ ] Criar guia de troubleshooting
- [ ] Documentar fluxo de pagamento

---

## 💡 RECOMENDAÇÕES FINAIS

### ✅ FAZER
1. **Manter Stripe para internacional** - Funciona bem globalmente
2. **Usar Mercado Pago para Brasil** - Melhor para Pix e parcelamento
3. **Criar abstração** - Facilita manutenção futura
4. **Testar bem** - Ambos os gateways antes de produção
5. **Monitorar** - Logs e métricas de ambos

### ❌ EVITAR
1. **Não misturar lógica** - Cada gateway em seu adaptador
2. **Não quebrar código existente** - Implementar gradualmente
3. **Não esquecer webhooks** - Ambos precisam funcionar
4. **Não pular testes** - Validar cada método de pagamento

---

## 📞 SUPORTE

### Mercado Pago
- Documentação: https://www.mercadopago.com.br/developers
- Suporte: https://www.mercadopago.com.br/developers/support

### Stripe
- Documentação: https://stripe.com/docs
- Suporte: https://support.stripe.com

---

## 🎯 CONCLUSÃO

Esta estratégia permite:
- ✅ Pix funcionando (teste + produção)
- ✅ Parcelamento nativo no Brasil
- ✅ Stripe mantido para internacional
- ✅ Mesmo fluxo para o usuário
- ✅ Código organizado e manutenível
- ✅ Fácil adicionar novos gateways no futuro

**Próximo passo**: Começar pela Fase 1 (Preparação) e criar a abstração de gateway.

