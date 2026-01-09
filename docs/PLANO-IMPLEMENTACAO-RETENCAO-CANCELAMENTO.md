# 📋 PLANO COMPLETO: SISTEMA DE RETENÇÃO ANTES DO CANCELAMENTO

## 🎯 OBJETIVOS

1. **Reduzir cancelamentos** através de retenção inteligente
2. **Coletar dados** sobre motivos de cancelamento
3. **Oferecer alternativas** contextualizadas antes do cancelamento definitivo
4. **Cancelar automaticamente** no Mercado Pago quando confirmado

---

## 📊 FASE 1: ESTRUTURA DE BANCO DE DADOS

### 1.1 Criar tabela `cancel_attempts` (tentativas de cancelamento)

```sql
-- =====================================================
-- TABELA: cancel_attempts
-- Registra todas as tentativas de cancelamento e retenções
-- =====================================================
CREATE TABLE IF NOT EXISTS cancel_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  
  -- Motivo do cancelamento
  cancel_reason VARCHAR(50) NOT NULL CHECK (cancel_reason IN (
    'no_time',
    'didnt_understand',
    'no_value',
    'forgot_trial',
    'too_expensive',
    'found_alternative',
    'other'
  )),
  cancel_reason_other TEXT, -- Se escolheu "other"
  
  -- Ações de retenção
  retention_offered VARCHAR(50), -- 'extend_trial', 'guided_tour', 'show_feature', 'pause_subscription'
  retention_accepted BOOLEAN DEFAULT false,
  retention_action_taken VARCHAR(50), -- O que foi feito exatamente
  
  -- Resultado final
  final_action VARCHAR(50) NOT NULL CHECK (final_action IN (
    'canceled',
    'retained',
    'pending'
  )),
  
  -- Informações adicionais
  days_since_purchase INTEGER,
  within_guarantee BOOLEAN DEFAULT false,
  request_refund BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  canceled_at TIMESTAMP WITH TIME ZONE
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_cancel_attempts_user_id ON cancel_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_cancel_attempts_subscription_id ON cancel_attempts(subscription_id);
CREATE INDEX IF NOT EXISTS idx_cancel_attempts_final_action ON cancel_attempts(final_action);
CREATE INDEX IF NOT EXISTS idx_cancel_attempts_created_at ON cancel_attempts(created_at);
```

### 1.2 Criar tabela `trial_extensions` (extensões de trial)

```sql
-- =====================================================
-- TABELA: trial_extensions
-- Registra extensões de trial oferecidas
-- =====================================================
CREATE TABLE IF NOT EXISTS trial_extensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  cancel_attempt_id UUID REFERENCES cancel_attempts(id) ON DELETE SET NULL,
  
  -- Detalhes da extensão
  extension_days INTEGER NOT NULL DEFAULT 7,
  original_expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  new_expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_trial_extensions_user_id ON trial_extensions(user_id);
CREATE INDEX IF NOT EXISTS idx_trial_extensions_subscription_id ON trial_extensions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_trial_extensions_status ON trial_extensions(status);
```

### 1.3 Adicionar campos na tabela `subscriptions` (se necessário)

```sql
-- Adicionar campo para rastrear se já foi oferecida retenção
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS retention_offered_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS retention_attempts_count INTEGER DEFAULT 0;
```

---

## 🎨 FASE 2: FRONTEND - MODAL DE RETENÇÃO

### 2.1 Criar componente `CancelRetentionModal.tsx`

**Localização:** `src/components/nutri/CancelRetentionModal.tsx`

**Funcionalidades:**
- Modal em 2 passos (pergunta motivo → oferta contextual)
- Design discreto e não invasivo
- Botão "Cancelar agora" sempre visível
- Animações suaves

**Estrutura:**
```typescript
interface CancelRetentionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirmCancel: () => void
  subscription: any
  daysSincePurchase: number
  withinGuarantee: boolean
}
```

**Estados do modal:**
1. **Step 1:** Seleção do motivo (obrigatório)
2. **Step 2:** Oferta contextual baseada no motivo
3. **Step 3:** Confirmação final (se não aceitou retenção)

### 2.2 Modificar `configuracao/page.tsx`

**Mudanças:**
- Substituir modal atual por `CancelRetentionModal`
- Adicionar estados para controlar fluxo de retenção
- Integrar com novas APIs

---

## 🔌 FASE 3: BACKEND - NOVAS APIs

### 3.1 API: Registrar tentativa de cancelamento

**Endpoint:** `POST /api/nutri/subscription/cancel-attempt`

**Função:** Registrar motivo e iniciar fluxo de retenção

**Request:**
```json
{
  "cancelReason": "no_time" | "didnt_understand" | "no_value" | "forgot_trial" | "other",
  "cancelReasonOther": "texto se other",
  "subscriptionId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "cancelAttemptId": "uuid",
  "retentionOffer": {
    "type": "extend_trial" | "guided_tour" | "show_feature" | null,
    "message": "Mensagem personalizada",
    "actionButton": "Texto do botão"
  }
}
```

### 3.2 API: Aceitar oferta de retenção

**Endpoint:** `POST /api/nutri/subscription/accept-retention`

**Função:** Processar aceitação da oferta de retenção

**Request:**
```json
{
  "cancelAttemptId": "uuid",
  "retentionType": "extend_trial" | "guided_tour" | "show_feature"
}
```

**Response:**
```json
{
  "success": true,
  "action": "trial_extended" | "tour_started" | "feature_shown",
  "message": "Mensagem de sucesso"
}
```

### 3.3 API: Confirmar cancelamento definitivo

**Endpoint:** `POST /api/nutri/subscription/confirm-cancel`

**Função:** Cancelar definitivamente (após retenção ou direto)

**Request:**
```json
{
  "cancelAttemptId": "uuid",
  "requestRefund": boolean,
  "reason": "texto opcional"
}
```

**Response:**
```json
{
  "success": true,
  "canceled": true,
  "message": "Assinatura cancelada com sucesso"
}
```

### 3.4 API: Estender trial

**Endpoint:** `POST /api/nutri/subscription/extend-trial`

**Função:** Estender trial por 7 dias

**Request:**
```json
{
  "subscriptionId": "uuid",
  "days": 7
}
```

**Response:**
```json
{
  "success": true,
  "newExpiryDate": "2025-01-15T00:00:00Z",
  "message": "Trial estendido por 7 dias"
}
```

---

## 🔄 FASE 4: LÓGICA DE RETENÇÃO

### 4.1 Mapeamento: Motivo → Oferta

```typescript
const RETENTION_STRATEGY = {
  'no_time': {
    type: 'extend_trial',
    message: 'Isso é super comum 😊 Quer que a gente pause sua cobrança por mais 7 dias, sem custo, pra você testar com calma?',
    actionButton: 'Estender trial por 7 dias',
    secondaryButton: 'Cancelar agora'
  },
  'didnt_understand': {
    type: 'guided_tour',
    message: 'Talvez a gente não tenha te mostrado o melhor caminho ainda. Quer que a LYA te guie em 5 minutos agora?',
    actionButton: 'Quero ajuda agora',
    secondaryButton: 'Cancelar'
  },
  'no_value': {
    type: 'show_feature',
    message: 'Entendo. Em 90% dos casos, o valor aparece quando a pessoa usa [feature-chave]. Quer testar isso agora antes de sair?',
    actionButton: 'Me mostra agora',
    secondaryButton: 'Cancelar'
  },
  'forgot_trial': {
    type: 'extend_trial',
    message: 'Sem problemas 😊 Podemos te avisar e adiar a cobrança por mais 7 dias, se quiser.',
    actionButton: 'Adiar cobrança + estender trial',
    secondaryButton: 'Cancelar'
  },
  'too_expensive': {
    type: 'pause_subscription',
    message: 'Entendemos. Que tal pausar por 30 dias sem custo? Você pode retomar quando quiser.',
    actionButton: 'Pausar por 30 dias',
    secondaryButton: 'Cancelar'
  },
  'found_alternative': {
    type: null, // Sem oferta, apenas cancelar
    message: 'Entendemos sua decisão. Tem certeza que quer cancelar?',
    actionButton: null,
    secondaryButton: 'Sim, cancelar'
  },
  'other': {
    type: null, // Depende do motivo específico
    message: 'Obrigado pelo feedback. Tem certeza que quer cancelar?',
    actionButton: null,
    secondaryButton: 'Sim, cancelar'
  }
}
```

### 4.2 Verificações antes de oferecer retenção

- ✅ Usuário está dentro dos primeiros 7 dias? → Oferecer extensão
- ✅ Usuário nunca usou nenhuma feature? → Oferecer tour guiado
- ✅ Usuário já teve retenção oferecida? → Limitar a 1 tentativa
- ✅ Assinatura já está cancelada? → Não oferecer

---

## 💳 FASE 5: INTEGRAÇÃO COM MERCADO PAGO

### 5.1 Criar função para cancelar no Mercado Pago

**Localização:** `src/lib/mercado-pago-helpers.ts`

```typescript
export async function cancelMercadoPagoSubscription(
  subscriptionId: string,
  mercadoPagoSubscriptionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Buscar credenciais do Mercado Pago
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
    
    // Chamar API do Mercado Pago
    const response = await fetch(
      `https://api.mercadopago.com/preapproval/${mercadoPagoSubscriptionId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'cancelled'
        })
      }
    )
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro ao cancelar no Mercado Pago')
    }
    
    return { success: true }
  } catch (error: any) {
    console.error('❌ Erro ao cancelar no Mercado Pago:', error)
    return { success: false, error: error.message }
  }
}
```

### 5.2 Modificar API de cancelamento

**Arquivo:** `src/app/api/nutri/subscription/confirm-cancel/route.ts`

**Mudanças:**
- Buscar `mercado_pago_subscription_id` da subscription
- Chamar função de cancelamento no Mercado Pago
- Se falhar, ainda cancelar no banco mas registrar erro
- Log detalhado para revisão manual se necessário

---

## 📊 FASE 6: DASHBOARD E ANALYTICS

### 6.1 Criar view para analytics

```sql
-- View para análise de cancelamentos
CREATE OR REPLACE VIEW cancel_analytics AS
SELECT 
  ca.cancel_reason,
  ca.retention_offered,
  ca.retention_accepted,
  ca.final_action,
  COUNT(*) as total_attempts,
  COUNT(CASE WHEN ca.retention_accepted THEN 1 END) as retained_count,
  COUNT(CASE WHEN ca.final_action = 'canceled' THEN 1 END) as canceled_count,
  AVG(ca.days_since_purchase) as avg_days_since_purchase
FROM cancel_attempts ca
GROUP BY ca.cancel_reason, ca.retention_offered, ca.retention_accepted, ca.final_action;
```

### 6.2 Página de analytics (opcional, futuro)

**Localização:** `src/app/admin/analytics/cancellations/page.tsx`

**Métricas:**
- Taxa de retenção por motivo
- Eficácia de cada tipo de oferta
- Tempo médio até cancelamento
- Motivos mais comuns

---

## 🧪 FASE 7: TESTES E VALIDAÇÃO

### 7.1 Testes unitários

- Testar mapeamento motivo → oferta
- Testar lógica de extensão de trial
- Testar integração com Mercado Pago (mock)

### 7.2 Testes de integração

- Fluxo completo: motivo → oferta → aceitação
- Fluxo completo: motivo → oferta → cancelamento
- Cancelamento direto (sem retenção)

### 7.3 Validações

- ✅ Usuário não pode ter múltiplas tentativas ativas
- ✅ Trial só pode ser estendido 1 vez
- ✅ Cancelamento no Mercado Pago deve ser idempotente
- ✅ Logs detalhados para debugging

---

## 📝 FASE 8: DOCUMENTAÇÃO

### 8.1 Documentar fluxo completo

- Diagrama de fluxo do cancelamento
- Decisões de retenção
- Tratamento de erros

### 8.2 Documentar APIs

- Swagger/OpenAPI para todas as novas APIs
- Exemplos de request/response

---

## 🚀 ORDEM DE IMPLEMENTAÇÃO RECOMENDADA

1. **Fase 1:** Criar tabelas no banco
2. **Fase 2:** Criar componente de modal (frontend)
3. **Fase 3:** Criar APIs básicas (registrar tentativa, aceitar retenção)
4. **Fase 4:** Implementar lógica de retenção
5. **Fase 5:** Integrar com Mercado Pago
6. **Fase 6:** Testes e ajustes
7. **Fase 7:** Analytics (opcional, pode ser depois)

---

## ⚠️ PONTOS DE ATENÇÃO

1. **Não dificultar cancelamento:** Botão "Cancelar agora" sempre visível
2. **Limitar tentativas:** Máximo 1 oferta de retenção por subscription
3. **Tratamento de erros:** Se Mercado Pago falhar, ainda cancelar no banco
4. **Logs detalhados:** Para revisão manual quando necessário
5. **Performance:** Índices nas tabelas para queries rápidas
6. **Privacidade:** Não armazenar dados sensíveis desnecessários

---

## 📈 MÉTRICAS DE SUCESSO

- **Taxa de retenção:** % de usuários que aceitam oferta
- **Redução de cancelamentos:** Comparar antes/depois
- **Tempo médio até cancelamento:** Identificar padrões
- **Motivos mais comuns:** Para melhorar produto

---

## 🔧 CONFIGURAÇÕES NECESSÁRIAS

### Variáveis de ambiente

```env
MERCADOPAGO_ACCESS_TOKEN=seu_token_aqui
MERCADOPAGO_WEBHOOK_SECRET=seu_secret_aqui
```

### Permissões no Supabase

- RLS (Row Level Security) nas novas tabelas
- Políticas para usuários lerem/escreverem seus próprios registros
- Políticas para admin lerem todos os registros

---

## 📦 ARQUIVOS A CRIAR/MODIFICAR

### Novos arquivos:
- `src/components/nutri/CancelRetentionModal.tsx`
- `src/app/api/nutri/subscription/cancel-attempt/route.ts`
- `src/app/api/nutri/subscription/accept-retention/route.ts`
- `src/app/api/nutri/subscription/confirm-cancel/route.ts`
- `src/app/api/nutri/subscription/extend-trial/route.ts`
- `src/lib/mercado-pago-helpers.ts`
- `scripts/migrations/create-cancel-retention-tables.sql`

### Arquivos a modificar:
- `src/app/pt/nutri/(protected)/configuracao/page.tsx`
- `src/app/api/nutri/subscription/cancel/route.ts` (deprecar ou integrar)

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Criar tabelas no banco de dados
- [ ] Criar componente `CancelRetentionModal`
- [ ] Integrar modal na página de configurações
- [ ] Criar API `cancel-attempt`
- [ ] Criar API `accept-retention`
- [ ] Criar API `confirm-cancel`
- [ ] Criar API `extend-trial`
- [ ] Implementar lógica de retenção
- [ ] Integrar cancelamento com Mercado Pago
- [ ] Adicionar tratamento de erros
- [ ] Criar índices no banco
- [ ] Configurar RLS no Supabase
- [ ] Testar fluxo completo
- [ ] Documentar APIs
- [ ] Deploy e monitoramento

---

**Próximo passo:** Começar pela Fase 1 (criar tabelas) e seguir a ordem recomendada.

