# 🔍 Verificar Pagamentos de Hoje

Este documento descreve como verificar se os 3 pagamentos mensais de hoje foram processados corretamente.

## 📋 Script SQL

Execute o script `scripts/verificar-pagamentos-hoje.sql` no Supabase SQL Editor para verificar:

1. ✅ **Pagamentos aprovados hoje** - Todos os pagamentos com `status = 'succeeded'` criados hoje
2. ✅ **Assinaturas criadas hoje** - Todas as assinaturas criadas hoje
3. ✅ **Pagamentos mensais Wellness de hoje** - Foco específico nos pagamentos mensais da área Wellness
4. ✅ **Assinaturas mensais Wellness criadas hoje** - Foco específico nas assinaturas mensais Wellness criadas hoje
5. ✅ **Comparação** - Verificar se há discrepâncias entre pagamentos e assinaturas

## 🔍 O que verificar

### 1. Pagamentos Aprovados

Execute a primeira query do script. Você deve ver:
- **Total:** 3 pagamentos (ou mais, se houver outros tipos)
- **Com assinatura:** 3 (todos devem ter `subscription_id`)
- **Sem assinatura:** 0 (nenhum pagamento deve ficar sem assinatura)

### 2. Detalhes dos Pagamentos

Execute a segunda query. Para cada pagamento, verifique:
- ✅ `status_verificacao` deve ser "✅ MENSAL WELLNESS" ou "✅ OK"
- ✅ `subscription_id` não deve ser NULL
- ✅ `subscription_status` deve ser "active"
- ✅ `area` deve ser "wellness"
- ✅ `plan_type` deve ser "monthly"

### 3. Assinaturas Criadas Hoje

Execute a terceira query. Você deve ver:
- **Total:** 3 assinaturas (ou mais, se houver outros tipos)
- **Ativas:** 3 (todas devem estar ativas)
- **Mensais Wellness:** 3 (todas devem ser mensais Wellness)

### 4. Detalhes das Assinaturas

Execute a quarta query. Para cada assinatura, verifique:
- ✅ `status_verificacao` deve ser "✅ MENSAL WELLNESS PAGANTE"
- ✅ `total_pagamentos` deve ser >= 1
- ✅ `pagamentos_aprovados` deve ser >= 1
- ✅ `categoria_calculada` deve ser "pagante" (não "gratuita" ou "suporte")

### 5. Pagamentos Mensais Wellness de Hoje

Execute a quinta query. Você deve ver:
- **Total pagamentos:** 3
- **Usuários diferentes:** 3 (cada pagamento deve ser de um usuário diferente)
- **Com assinatura ativa:** 3
- **Pagantes ativos:** 3

### 6. Detalhes dos Pagamentos Mensais Wellness

Execute a sexta query. Para cada pagamento, verifique:
- ✅ `status_detalhado` deve ser "✅ PAGANTE ATIVA"
- ✅ `categoria_calculada` deve ser "pagante"
- ✅ `is_admin` e `is_support` devem ser FALSE
- ✅ `valor_pagamento_reais` deve ser > 0 (geralmente R$ 47,00 ou similar)
- ✅ `subscription_id` não deve ser NULL

## ⚠️ Problemas Comuns

### Problema 1: Pagamentos sem Assinatura

**Sintoma:**
- Pagamentos com `subscription_id IS NULL`
- `status_verificacao` mostra "⚠️ SEM ASSINATURA"

**Causa:**
- Webhook de pagamento chegou antes do webhook de subscription
- Webhook de subscription falhou

**Solução:**
1. Verificar logs do webhook no Vercel
2. Verificar se o webhook está configurado corretamente no Mercado Pago
3. Se necessário, criar a assinatura manualmente vinculando ao pagamento

### Problema 2: Assinaturas sem Pagamentos

**Sintoma:**
- Assinaturas com `total_pagamentos = 0`
- `status_verificacao` mostra "⚠️ SEM PAGAMENTOS"

**Causa:**
- Webhook de pagamento não chegou ou falhou
- Pagamento foi aprovado mas o registro não foi criado

**Solução:**
1. Verificar se o pagamento existe no Mercado Pago Dashboard
2. Verificar logs do webhook
3. Se necessário, criar o registro de pagamento manualmente

### Problema 3: Categoria Incorreta

**Sintoma:**
- `categoria_calculada` mostra "gratuita" ou "suporte" para pagamentos pagantes
- `status_detalhado` mostra "ℹ️ GRATUITA" ou "ℹ️ SUPORTE/ADMIN"

**Causa:**
- `amount = 0` na subscription (mesmo que o pagamento tenha valor)
- `is_admin = TRUE` ou `is_support = TRUE` no perfil do usuário

**Solução:**
1. Verificar o valor da subscription (`s.amount`)
2. Verificar se o usuário está marcado como admin/suporte incorretamente
3. Corrigir o valor da subscription ou o perfil do usuário

## 📊 Verificar na Interface

Após executar o script SQL, verifique também na interface:

1. **Acesse:** `/admin/receitas`
2. **Abra o console do navegador** (F12)
3. **Procure pelos logs de debug** que começam com "🔍 DEBUG Receitas:"
4. **Verifique:**
   - `mensaisWellnessHoje` deve ser 3
   - `mensaisWellnessHojeDetalhes` deve mostrar os 3 pagamentos
   - Cada um deve ter `categoria: "pagante"` e `status: "ativa"`

## 🔄 Próximos Passos

Se os 3 pagamentos estiverem corretos:
- ✅ Eles devem aparecer na contagem de "Receita Mensal"
- ✅ Eles devem aparecer no card "Receita Mensal" na aba "💰 Análise de Receitas"
- ✅ Ao clicar no card, devem aparecer no modal de detalhes

Se não estiverem aparecendo:
1. Execute o script SQL para identificar o problema
2. Verifique os logs do console do navegador
3. Verifique os logs do webhook no Vercel
4. Se necessário, corrija manualmente no banco de dados

