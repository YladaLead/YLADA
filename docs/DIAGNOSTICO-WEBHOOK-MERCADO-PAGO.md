# 🔍 Diagnóstico: Webhook Mercado Pago

Este documento descreve como diagnosticar problemas com webhooks do Mercado Pago que podem resultar em pagamentos não sendo registrados ou assinaturas não sendo criadas.

## 📋 Scripts de Diagnóstico

### 1. `scripts/diagnosticar-pagamentos-vs-assinaturas.sql`

Este script verifica:
- ✅ Pagamentos aprovados que não têm assinatura vinculada
- ✅ Assinaturas ativas que não têm pagamentos registrados
- ✅ Pagamentos e assinaturas do Mercado Pago
- ✅ Comparação entre pagamentos e assinaturas por área
- ✅ Pagamentos e assinaturas recentes (últimos 7 dias)

**Como usar:**
```sql
-- Execute o script completo no Supabase SQL Editor
-- Ele retornará múltiplos resultados mostrando diferentes aspectos do problema
```

### 2. `scripts/verificar-webhook-mercado-pago.sql`

Este script verifica:
- ✅ Assinaturas criadas hoje sem pagamentos (webhook de pagamento não chegou)
- ✅ Pagamentos aprovados hoje sem assinatura (webhook de subscription falhou)
- ✅ Assinaturas com múltiplos pagamentos (possível duplicação)
- ✅ Pagamentos duplicados (mesmo payment_intent_id)
- ✅ Assinaturas com gaps (criadas muito antes do primeiro pagamento)
- ✅ Resumo geral do status do webhook

**Como usar:**
```sql
-- Execute o script completo no Supabase SQL Editor
-- Foque nos resultados que mostram "⚠️" para identificar problemas
```

## 🔧 Problemas Comuns e Soluções

### Problema 1: Pagamentos Aprovados Sem Assinatura

**Sintoma:**
- Pagamentos com `status = 'succeeded'` mas `subscription_id IS NULL`
- Ou pagamentos cuja subscription foi deletada

**Possíveis Causas:**
1. Webhook de pagamento chegou antes do webhook de subscription
2. Webhook de subscription falhou ou não foi processado
3. Erro ao criar subscription no webhook

**Solução:**
1. Verificar logs do webhook em produção (Vercel logs)
2. Verificar se o webhook está configurado corretamente no Mercado Pago
3. Verificar se há erros no código do webhook (`src/app/api/webhooks/mercado-pago/route.ts`)

### Problema 2: Assinaturas Ativas Sem Pagamentos

**Sintoma:**
- Assinaturas com `status = 'active'` mas sem pagamentos registrados

**Possíveis Causas:**
1. Webhook de pagamento não chegou ou falhou
2. Pagamento foi aprovado mas o registro não foi criado
3. Subscription foi criada manualmente ou migrada

**Solução:**
1. Verificar se o pagamento existe no Mercado Pago Dashboard
2. Verificar logs do webhook para ver se o evento de pagamento foi recebido
3. Se necessário, criar o registro de pagamento manualmente ou reprocessar o webhook

### Problema 3: Webhooks Duplicados

**Sintoma:**
- Múltiplos pagamentos com o mesmo `payment_intent_id`
- Assinaturas com múltiplos pagamentos aprovados

**Possíveis Causas:**
1. Mercado Pago enviou o webhook múltiplas vezes
2. Retry do webhook após timeout
3. Falta de idempotência no código

**Solução:**
1. O código já tem proteção contra duplicação usando `stripe_payment_intent_id UNIQUE`
2. Verificar se há erros de constraint no banco
3. Se necessário, remover pagamentos duplicados manualmente

### Problema 4: Gaps Entre Criação de Subscription e Pagamento

**Sintoma:**
- Subscription criada muito antes do primeiro pagamento (> 1 hora)

**Possíveis Causas:**
1. Webhook de pagamento demorou para chegar
2. Pagamento foi processado manualmente depois
3. Problema de rede ou timeout

**Solução:**
1. Verificar logs do webhook para ver o tempo entre eventos
2. Verificar se há problemas de rede ou timeout
3. Considerar implementar retry automático para webhooks

## 📊 Como Interpretar os Resultados

### Resultados Esperados (Tudo OK)

- ✅ Todas as assinaturas ativas têm pelo menos um pagamento aprovado
- ✅ Todos os pagamentos aprovados têm uma assinatura vinculada
- ✅ Não há pagamentos duplicados
- ✅ Gaps entre criação e pagamento são < 1 hora

### Resultados com Problemas (⚠️)

- ⚠️ Assinaturas sem pagamentos → Verificar webhook de pagamento
- ⚠️ Pagamentos sem assinaturas → Verificar webhook de subscription
- ⚠️ Múltiplos pagamentos → Verificar duplicação de webhooks
- ⚠️ Gaps > 24h → Verificar problemas de rede/timeout

## 🔄 Processo de Correção

1. **Identificar o Problema:**
   - Execute os scripts de diagnóstico
   - Identifique qual tipo de problema está ocorrendo

2. **Verificar Logs:**
   - Acesse os logs do Vercel para o webhook
   - Procure por erros ou warnings relacionados

3. **Verificar Mercado Pago:**
   - Acesse o Mercado Pago Dashboard
   - Verifique se os pagamentos foram aprovados
   - Verifique se os webhooks foram enviados

4. **Corrigir Manualmente (se necessário):**
   - Se o pagamento existe mas a subscription não foi criada, criar manualmente
   - Se a subscription existe mas o pagamento não foi registrado, criar o registro manualmente
   - Se há duplicações, remover os registros duplicados

5. **Prevenir Futuros Problemas:**
   - Implementar melhor logging
   - Adicionar alertas para webhooks falhando
   - Considerar implementar retry automático

## 📝 Notas Importantes

- Os webhooks do Mercado Pago podem demorar alguns minutos para chegar
- Webhooks de teste são ignorados em produção (verificar `live_mode`)
- O código já tem proteção contra duplicação usando constraints UNIQUE
- Sempre verificar os logs antes de fazer correções manuais

