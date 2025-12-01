# 🔧 INSTRUÇÕES: Correção de Subscriptions Migradas

## 📋 Análise dos Resultados

Baseado nos dados fornecidos, identifiquei:

### Problemas Encontrados

1. **Datas Suspeitas em Lote**: Muitas subscriptions têm data `2025-12-12 18:19:XX`, indicando migração em lote com data incorreta
2. **Datas Iguais**: Muitas têm `original_expiry_date` = `current_period_end`, ambas incorretas
3. **Datas Muito no Futuro**: Algumas têm vencimento em 2026, quando deveriam ser 2025

### Situações Identificadas

- ✅ **Data original é mais recente**: 20 subscriptions - **USAR original_expiry_date**
- ⚠️ **Data original é mais antiga**: 2 subscriptions - **MANTER current_period_end** (já está melhor)
- ❌ **Sem data original ou datas iguais**: 7 subscriptions - **RECALCULAR** baseado em created_at

---

## 🚀 Script de Correção Criado

Criei o script: `scripts/corrigir-datas-migradas-especifico.sql`

Este script:
1. **Identifica** todas as subscriptions migradas com problemas
2. **Calcula** datas corretas usando prioridade:
   - Se `original_expiry_date` é válida e mais recente → usar ela
   - Se não → calcular baseado em `created_at` + tipo de plano
3. **Corrige** automaticamente
4. **Valida** os resultados

---

## 📝 Passo a Passo para Executar

### Passo 1: Ver o que será corrigido

Execute no Supabase SQL Editor a **Query 1** do script:

```sql
-- Identificar subscriptions migradas com problemas
```

**Resultado esperado**: Lista de todas as subscriptions que serão corrigidas.

### Passo 2: Ver as novas datas

Execute a **Query 2**:

```sql
-- Calcular datas corretas
```

**Revise cuidadosamente**:
- ✅ Subscriptions com `original_expiry_date` válida → usar ela
- ✅ Subscriptions sem `original_expiry_date` → calcular baseado em created_at
- ✅ Subscriptions com data suspeita (2025-12-12 18:19:XX) → recalcular

### Passo 3: Aplicar correções

Execute as queries 3, 4 e 5 **em ordem**:

**Query 3**: Corrigir usando `original_expiry_date` (quando válida)
```sql
UPDATE subscriptions
SET current_period_end = original_expiry_date
WHERE ...
```

**Query 4**: Corrigir datas suspeitas (2025-12-12 18:19:XX)
```sql
UPDATE subscriptions
SET current_period_end = (GREATEST(created_at, current_period_start) + INTERVAL '1 month/year')
WHERE current_period_end::text LIKE '2025-12-12 18:19:%'
```

**Query 5**: Corrigir outras datas incorretas
```sql
UPDATE subscriptions
SET current_period_end = (GREATEST(created_at, current_period_start) + INTERVAL '1 month/year')
WHERE ...
```

### Passo 4: Verificar

Execute a **Query 6** para validar:

```sql
-- Verificar correções aplicadas
```

**Resultado esperado**:
- Mensais: ~30 dias de validade média ✅
- Anuais: ~365 dias de validade média ✅
- Nenhuma com data suspeita (2025-12-12 18:19:XX) ✅

### Passo 5: Listar todas as migradas

Execute a **Query 7** para ver todas as subscriptions migradas após correção:

```sql
-- Listar subscriptions migradas corrigidas
```

---

## 🎯 Correções Específicas Baseadas nos Dados

### Para as 20 subscriptions com "Data original é mais recente"

**Ação**: Usar `original_expiry_date` (Query 3)

**Exemplos**:
- `naytenutri@gmail.com`: 2026-10-15 → usar esta data ✅
- `vnnuneshbl297@gmail.com`: 2025-11-15 → usar esta data ✅
- `joaoaraujo11@gmail.com`: 2025-11-15 → usar esta data ✅

### Para as 2 subscriptions com "Data original é mais antiga"

**Ação**: Manter `current_period_end` (já está melhor)

**Exemplos**:
- `gladisgordaliza@gmail.com`: Manter 2025-12-12 (melhor que 2025-12-20)
- `claudiavitto@hotmail.com`: Manter 2025-12-12 (melhor que 2025-12-20)

### Para as 7 subscriptions sem data original ou datas iguais

**Ação**: Recalcular baseado em `created_at` + tipo de plano (Query 4 ou 5)

**Exemplos**:
- `deisefaula@gmail.com`: Recalcular (2026-11-27 parece muito no futuro)
- `sperandio.rosanaelisa@gmail.com`: Recalcular (2026-11-03 parece muito no futuro)
- `reborges09@gmail.com`: Recalcular (2026-10-13 parece muito no futuro)

---

## ⚠️ IMPORTANTE

1. **Faça backup** antes de executar
2. **Execute em ordem**: Query 3 → Query 4 → Query 5
3. **Revise** os resultados da Query 2 antes de aplicar
4. **Valide** com Query 6 após aplicar
5. **Monitore** após correções

---

## 📊 Resultados Esperados

### Antes
- Média de dias: 2940 dias (8 anos) ❌
- Muitas com data 2025-12-12 18:19:XX ❌
- Datas muito no futuro (2026) ❌

### Depois (Esperado)
- Mensais: ~30 dias ✅
- Anuais: ~365 dias ✅
- Nenhuma com data suspeita ✅
- Datas coerentes com created_at ✅

---

## 🔄 Rollback (Se Necessário)

Se algo der errado, você pode reverter:

```sql
-- Restaurar do backup
-- Ou reverter manualmente:
UPDATE subscriptions
SET current_period_end = '[data_anterior]',
    updated_at = NOW()
WHERE id = '[subscription_id]';
```

---

**Status**: ✅ Script Pronto - Aguardando Execução

