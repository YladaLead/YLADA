# 🔍 ANÁLISE: Problemas com Datas de Vencimento de Assinaturas

## 📋 Resumo Executivo

**Problema Identificado**: Datas de vencimento de assinaturas não estão coerentes com pagamentos reais. Pessoas que pagaram recentemente aparecem como vencidas, e há muitas datas repetidas.

**Data da Análise**: [Data Atual]
**Status**: ⚠️ Análise Completa - Aguardando Correção

---

## 🔴 PROBLEMAS IDENTIFICADOS

### 1. **Múltiplas Subscriptions Ativas para Mesmo Usuário/Área**

#### Problema
O código do webhook do Mercado Pago busca apenas a subscription mais recente:
```typescript
const { data: existingSubscription } = await supabaseAdmin
  .from('subscriptions')
  .select('id, current_period_end, welcome_email_sent, status')
  .eq('user_id', userId)
  .eq('area', area)
  .eq('status', 'active')
  .order('current_period_end', { ascending: false })
  .limit(1)
  .maybeSingle()
```

**Risco**: Se houver múltiplas subscriptions ativas (por erro, migração, ou webhook duplicado), apenas uma é considerada, mas todas aparecem na lista admin.

#### Impacto
- ✅ Pagamento recente pode atualizar subscription A
- ❌ Mas subscription B (antiga) ainda aparece como ativa na admin
- ❌ Usuário aparece com data vencida (da subscription B)

---

### 2. **Renovação Estende a Partir de Data Já Vencida**

#### Problema
Quando há renovação, o código estende a partir de `current_period_end`:
```typescript
if (existingSubscription && existingSubscription.current_period_end) {
  expiresAt = new Date(existingSubscription.current_period_end)
  if (planType === 'monthly') {
    expiresAt.setMonth(expiresAt.getMonth() + 1)
  }
}
```

**Cenário Problemático**:
- Subscription vence em 01/12/2024
- Usuário paga em 15/12/2024 (14 dias depois)
- Código estende de 01/12/2024 → 01/01/2025
- **Resultado**: Usuário perde 14 dias que já pagou!

#### Impacto
- ❌ Usuários que pagam após vencimento perdem dias pagos
- ❌ Data de vencimento não reflete a data real do pagamento
- ❌ Pode causar confusão na área admin

---

### 3. **Webhooks Duplicados Criando Múltiplas Subscriptions**

#### Problema
Se o webhook do Mercado Pago for chamado múltiplas vezes (retry, duplicação), pode criar múltiplas subscriptions ao invés de atualizar uma existente.

**Código Atual**:
```typescript
if (existingSubscription) {
  // Atualiza existente
} else {
  // Cria nova
}
```

**Risco**: Se `existingSubscription` não for encontrado (por timing, status, etc.), cria nova subscription mesmo que já exista.

#### Impacto
- ❌ Múltiplas subscriptions para mesmo usuário
- ❌ Datas duplicadas na lista admin
- ❌ Confusão sobre qual subscription está ativa

---

### 4. **Stripe UPSERT Pode Sobrescrever Dados Incorretos**

#### Problema
O código do Stripe usa UPSERT com conflito em `stripe_subscription_id`:
```typescript
.upsert({
  // ... dados
}, {
  onConflict: 'stripe_subscription_id',
})
```

**Risco**: Se houver duas subscriptions com mesmo `stripe_subscription_id` (improvável, mas possível), ou se o `user_id` mudar, pode sobrescrever subscription errada.

#### Impacto
- ❌ Dados podem ser sobrescritos incorretamente
- ❌ Subscription de um usuário pode ser atribuída a outro

---

### 5. **Migrações Não Verificam Subscriptions Existentes**

#### Problema
Quando subscriptions são migradas manualmente via admin, o código pode não verificar se já existe subscription ativa:
```typescript
// Código de migração pode criar nova subscription
// sem verificar se já existe uma ativa
```

#### Impacto
- ❌ Múltiplas subscriptions criadas durante migração
- ❌ Datas conflitantes
- ❌ Status inconsistente

---

### 6. **Status Não Atualizado Corretamente**

#### Problema
Subscriptions podem ter `status = 'active'` mas `current_period_end` já passou, fazendo aparecer como "vencida" na admin.

**Código de Exibição**:
```typescript
proxVencimento: sub.current_period_end ? new Date(sub.current_period_end).toISOString().split('T')[0] : '',
```

Não há verificação se a data já passou para atualizar o status automaticamente.

#### Impacto
- ❌ Subscriptions aparecem como "ativa" mas com data vencida
- ❌ Confusão na área admin
- ❌ Usuários podem perder acesso mesmo com subscription "ativa"

---

## 🔍 ANÁLISE DETALHADA POR CENÁRIO

### Cenário 1: Pagamento Recente Aparece como Vencido

**Possíveis Causas**:

1. **Subscription Antiga Ainda Ativa**
   - Usuário tinha subscription A (vencida)
   - Pagamento criou/atualizou subscription B
   - Mas subscription A ainda está com `status = 'active'`
   - Admin mostra subscription A (vencida) ao invés de B (nova)

2. **Data de Vencimento Não Atualizada**
   - Webhook não processou corretamente
   - Data de vencimento ficou antiga
   - Status continua "active" mas data já passou

3. **Múltiplas Subscriptions**
   - Há subscription antiga e nova
   - Admin mostra a antiga primeiro
   - Nova subscription não aparece ou aparece depois

---

### Cenário 2: Datas Repetidas

**Possíveis Causas**:

1. **Múltiplas Subscriptions com Mesma Data**
   - Webhook duplicado criou múltiplas subscriptions
   - Todas com mesma data de vencimento
   - Todas aparecem na lista

2. **Migração em Massa**
   - Importação criou múltiplas subscriptions
   - Mesma data de vencimento para vários usuários
   - Aparecem agrupadas na lista

3. **Fuso Horário**
   - Datas podem estar sendo convertidas incorretamente
   - Mesma data aparece em formatos diferentes
   - Parece repetida mas é apenas formatação

---

## 🛠️ SOLUÇÕES RECOMENDADAS

### Solução 1: Garantir Apenas Uma Subscription Ativa por Usuário/Área

**Ação**: Antes de criar/atualizar subscription, cancelar todas as outras ativas para mesmo `user_id` + `area`.

```typescript
// Cancelar todas as outras subscriptions ativas
await supabaseAdmin
  .from('subscriptions')
  .update({ status: 'canceled' })
  .eq('user_id', userId)
  .eq('area', area)
  .eq('status', 'active')
  .neq('id', existingSubscription?.id || '00000000-0000-0000-0000-000000000000')
```

**Benefício**: Elimina múltiplas subscriptions ativas.

---

### Solução 2: Estender Vencimento a Partir da Data Atual (Não da Data de Vencimento)

**Ação**: Se pagamento for após vencimento, estender a partir de hoje, não da data antiga.

```typescript
const now = new Date()
const currentExpiry = new Date(existingSubscription.current_period_end)

if (currentExpiry < now) {
  // Pagamento após vencimento: estender a partir de hoje
  expiresAt = new Date()
  expiresAt.setMonth(expiresAt.getMonth() + 1) // ou +12 para anual
} else {
  // Pagamento antes de vencer: estender a partir da data atual
  expiresAt = new Date(currentExpiry)
  expiresAt.setMonth(expiresAt.getMonth() + 1)
}
```

**Benefício**: Usuários não perdem dias pagos.

---

### Solução 3: Idempotência nos Webhooks

**Ação**: Verificar se pagamento já foi processado antes de criar/atualizar.

```typescript
// Verificar se payment_id já foi processado
const { data: existingPayment } = await supabaseAdmin
  .from('payments')
  .select('id')
  .eq('stripe_payment_intent_id', paymentId)
  .single()

if (existingPayment) {
  console.log('⚠️ Pagamento já processado, ignorando webhook duplicado')
  return
}
```

**Benefício**: Evita processamento duplicado.

---

### Solução 4: Atualizar Status Automaticamente Baseado em Data

**Ação**: Criar função que atualiza status de subscriptions vencidas.

```typescript
// Atualizar subscriptions vencidas
await supabaseAdmin
  .from('subscriptions')
  .update({ status: 'past_due' })
  .eq('status', 'active')
  .lt('current_period_end', new Date().toISOString())
```

**Benefício**: Status sempre reflete realidade.

---

### Solução 5: Verificação na API de Receitas

**Ação**: Na API que lista subscriptions, verificar e filtrar duplicatas.

```typescript
// Agrupar por user_id + area e pegar apenas a mais recente
const subscriptionsUnicas = subscriptions
  .filter(sub => sub.status === 'active')
  .reduce((acc, sub) => {
    const key = `${sub.user_id}_${sub.area}`
    if (!acc[key] || new Date(sub.current_period_end) > new Date(acc[key].current_period_end)) {
      acc[key] = sub
    }
    return acc
  }, {})
```

**Benefício**: Admin mostra apenas subscription correta.

---

## 📊 QUERIES SQL PARA DIAGNÓSTICO

### Query 1: Encontrar Múltiplas Subscriptions Ativas

```sql
SELECT 
  user_id,
  area,
  COUNT(*) as total_ativas,
  STRING_AGG(id::text, ', ') as subscription_ids,
  STRING_AGG(current_period_end::text, ', ') as datas_vencimento
FROM subscriptions
WHERE status = 'active'
GROUP BY user_id, area
HAVING COUNT(*) > 1
ORDER BY total_ativas DESC;
```

**O que mostra**: Usuários com múltiplas subscriptions ativas.

---

### Query 2: Subscriptions Vencidas mas com Status Ativo

```sql
SELECT 
  s.id,
  s.user_id,
  s.area,
  s.status,
  s.current_period_end,
  s.current_period_end::date - CURRENT_DATE as dias_vencido,
  up.email,
  up.nome_completo
FROM subscriptions s
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE s.status = 'active'
  AND s.current_period_end < NOW()
ORDER BY s.current_period_end ASC;
```

**O que mostra**: Subscriptions que aparecem como ativas mas já venceram.

---

### Query 3: Subscriptions com Mesma Data de Vencimento

```sql
SELECT 
  current_period_end::date as data_vencimento,
  COUNT(*) as total,
  STRING_AGG(user_id::text, ', ') as user_ids,
  STRING_AGG(area, ', ') as areas
FROM subscriptions
WHERE status = 'active'
GROUP BY current_period_end::date
HAVING COUNT(*) > 1
ORDER BY total DESC, data_vencimento DESC;
```

**O que mostra**: Datas de vencimento que aparecem múltiplas vezes.

---

### Query 4: Subscriptions Criadas Recentemente mas com Data Antiga

```sql
SELECT 
  s.id,
  s.user_id,
  s.area,
  s.created_at,
  s.current_period_end,
  s.current_period_end::date - s.created_at::date as dias_diferenca,
  up.email,
  up.nome_completo
FROM subscriptions s
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE s.status = 'active'
  AND s.created_at > NOW() - INTERVAL '30 days'
  AND s.current_period_end < NOW()
ORDER BY s.created_at DESC;
```

**O que mostra**: Subscriptions criadas recentemente mas já vencidas (indica problema no cálculo).

---

### Query 5: Histórico de Pagamentos vs Vencimentos

```sql
SELECT 
  s.id as subscription_id,
  s.user_id,
  s.area,
  s.current_period_end,
  s.created_at as subscription_criada,
  MAX(p.created_at) as ultimo_pagamento,
  COUNT(p.id) as total_pagamentos
FROM subscriptions s
LEFT JOIN payments p ON p.subscription_id = s.id
WHERE s.status = 'active'
GROUP BY s.id, s.user_id, s.area, s.current_period_end, s.created_at
HAVING MAX(p.created_at) > s.current_period_end
   OR (MAX(p.created_at) IS NOT NULL AND s.current_period_end < NOW())
ORDER BY ultimo_pagamento DESC;
```

**O que mostra**: Subscriptions com pagamentos recentes mas vencimento antigo.

---

## 🎯 CHECKLIST DE VERIFICAÇÃO

### No Supabase

- [ ] Executar Query 1: Verificar múltiplas subscriptions ativas
- [ ] Executar Query 2: Verificar subscriptions vencidas com status ativo
- [ ] Executar Query 3: Verificar datas duplicadas
- [ ] Executar Query 4: Verificar subscriptions recentes com data antiga
- [ ] Executar Query 5: Verificar pagamentos vs vencimentos

### No Código

- [ ] Verificar lógica de renovação do Mercado Pago
- [ ] Verificar lógica de UPSERT do Stripe
- [ ] Verificar código de migração
- [ ] Verificar API de receitas (filtragem de duplicatas)
- [ ] Verificar atualização automática de status

### Na Área Admin

- [ ] Verificar se lista mostra todas as subscriptions ou apenas ativas
- [ ] Verificar ordenação (por data, por criação, etc.)
- [ ] Verificar se há filtros aplicados
- [ ] Verificar se há agrupamento por usuário

---

## 📝 PRÓXIMOS PASSOS RECOMENDADOS

### Fase 1: Diagnóstico (Imediato)
1. Executar queries SQL de diagnóstico
2. Identificar quantos casos de cada problema
3. Listar usuários afetados

### Fase 2: Correção de Dados (Curto Prazo)
1. Cancelar subscriptions duplicadas (manter apenas a mais recente)
2. Atualizar status de subscriptions vencidas
3. Corrigir datas de vencimento baseadas em pagamentos reais

### Fase 3: Correção de Código (Médio Prazo)
1. Implementar Solução 1 (garantir apenas uma subscription ativa)
2. Implementar Solução 2 (estender a partir de hoje se vencido)
3. Implementar Solução 3 (idempotência nos webhooks)
4. Implementar Solução 4 (atualização automática de status)
5. Implementar Solução 5 (filtragem na API)

### Fase 4: Validação (Após Correções)
1. Testar webhooks com pagamentos reais
2. Verificar se problemas foram resolvidos
3. Monitorar por 1 semana

---

## ⚠️ AVISOS IMPORTANTES

1. **Não fazer correções em produção sem backup**
2. **Testar em ambiente de desenvolvimento primeiro**
3. **Comunicar usuários afetados antes de cancelar subscriptions**
4. **Documentar todas as mudanças**
5. **Monitorar logs após correções**

---

## 📞 CONTATO

Para dúvidas sobre esta análise ou implementação das correções, consulte a equipe de desenvolvimento.

---

**Documento criado em**: [Data]
**Versão**: 1.0
**Status**: ⚠️ Análise Completa - Aguardando Aprovação para Correções

