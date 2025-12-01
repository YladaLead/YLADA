# 🔧 CORREÇÃO: Subscriptions de Suporte e Administrador

## 📋 Contexto

- **Wellness**: Subscriptions migradas - ✅ Todas corretas (validadas)
- **Coach, Nutri, Nutra**: Apenas subscriptions de suporte e administrador
- **Problema**: Médias altas nessas áreas (1774 dias coach, 3652 dias nutra/nutri)

---

## 🔍 Problema Identificado

As subscriptions de suporte/admin nas áreas coach, nutri e nutra podem ter sido criadas com datas de vencimento muito no futuro, causando as médias altas reportadas.

---

## 🚀 Script de Correção

Criei o script: `scripts/corrigir-subscriptions-suporte-admin.sql`

Este script:
1. **Identifica** subscriptions não migradas nas áreas coach, nutri, nutra
2. **Encontra** aquelas com datas incorretas (mais de 60 dias para mensais, mais de 400 para anuais/gratuitos)
3. **Calcula** datas corretas baseadas em `created_at` + tipo de plano
4. **Corrige** automaticamente
5. **Valida** os resultados

---

## 📝 Passo a Passo

### Passo 1: Ver subscriptions com problemas

Execute a **Query 1**:

```sql
-- Identificar subscriptions de suporte/admin com problemas
```

**Resultado esperado**: Lista de subscriptions que precisam correção.

### Passo 2: Ver estatísticas gerais

Execute a **Query 2**:

```sql
-- Ver todas as subscriptions (estatísticas)
```

**Resultado esperado**: Médias, mínimos e máximos por área e tipo.

### Passo 3: Ver datas corrigidas

Execute a **Query 3**:

```sql
-- Calcular datas corretas
```

**Revise cuidadosamente**:
- ✅ Mensais: devem ter ~30 dias
- ✅ Anuais: devem ter ~365 dias
- ✅ Gratuitos: devem ter ~365 dias

### Passo 4: Aplicar correções

Execute as queries 4, 5 e 6 **em ordem**:

**Query 4**: Corrigir mensais
```sql
UPDATE subscriptions
SET current_period_end = (GREATEST(created_at, current_period_start) + INTERVAL '1 month')
WHERE ...
```

**Query 5**: Corrigir anuais
```sql
UPDATE subscriptions
SET current_period_end = (GREATEST(created_at, current_period_start) + INTERVAL '1 year')
WHERE ...
```

**Query 6**: Corrigir gratuitos
```sql
UPDATE subscriptions
SET current_period_end = (GREATEST(created_at, current_period_start) + INTERVAL '1 year')
WHERE ...
```

### Passo 5: Verificar

Execute a **Query 7**:

```sql
-- Verificar correções aplicadas
```

**Resultado esperado**:
- Mensais: ~30 dias ✅
- Anuais: ~365 dias ✅
- Gratuitos: ~365 dias ✅

---

## ⚠️ IMPORTANTE

1. **Faça backup** antes de executar
2. **Revise** a Query 3 antes de aplicar correções
3. **Execute em ordem**: Query 4 → 5 → 6
4. **Valide** com Query 7 após aplicar

---

## 📊 Resultados Esperados

### Antes
- Coach: 1774 dias ❌
- Nutra: 3652 dias ❌
- Nutri: 3652 dias ❌

### Depois (Esperado)
- Mensais: ~30 dias ✅
- Anuais: ~365 dias ✅
- Gratuitos: ~365 dias ✅

---

## 🔄 Após Correção

Após corrigir, execute novamente a query de análise por área:

```sql
SELECT 
  area,
  COUNT(*) as total_ativas,
  ROUND(AVG(EXTRACT(EPOCH FROM (current_period_end - created_at)) / 86400)) as dias_medio_validade
FROM subscriptions
WHERE status = 'active'
GROUP BY area
ORDER BY area;
```

**Resultado esperado**: Médias corretas para todas as áreas.

---

**Status**: ✅ Script Pronto - Aguardando Execução

