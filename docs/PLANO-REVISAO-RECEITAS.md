# 📋 Plano de Revisão e Melhorias - Página de Receitas

## 🔴 PROBLEMAS IDENTIFICADOS

### 1. Categorização Incorreta
- **Problema:** Muitas assinaturas aparecendo como "Gratuitas" quando não deveriam ser
- **Causa provável:** Lógica de categorização está usando `plan_type === 'free'` ou `valor === 0`, mas pode haver assinaturas pagantes com `amount = 0` temporariamente ou assinaturas migradas

### 2. Filtros de Período Limitados
- **Problema atual:** Apenas 3 opções fixas (Mês, Ano, Histórico)
- **Necessidade:** Filtros por:
  - Mês específico (ex: Dezembro 2025)
  - Trimestre (Q1, Q2, Q3, Q4)
  - Período customizado (data início - data fim)
  - Últimos N meses

### 3. Filtro de Receitas Pagantes
- **Necessidade:** Poder filtrar receitas pagantes por período também

---

## ✅ SOLUÇÕES PROPOSTAS

### 1. CORRIGIR CATEGORIZAÇÃO

**Lógica atual (PROBLEMÁTICA):**
```typescript
const isFree = sub.plan_type === 'free' || valor === 0
const isPagante = !isAdmin && !isSupport && !isFree && valor > 0
```

**Lógica corrigida:**
```typescript
// 1. Suporte/Admin sempre é suporte
const isAdmin = userProfile.is_admin === true
const isSupport = userProfile.is_support === true

// 2. Verificar se é realmente gratuito
// - plan_type === 'free' E amount === 0
// - OU é migrada gratuita (is_migrated = true e amount = 0)
// - MAS não é admin/suporte
const isFree = !isAdmin && !isSupport && 
  (sub.plan_type === 'free' || (valor === 0 && sub.is_migrated !== true))

// 3. Pagante: não é admin/suporte, não é free, e tem valor > 0
// OU é migrada mas tem valor > 0
const isPagante = !isAdmin && !isSupport && 
  (valor > 0 || (sub.is_migrated === true && valor > 0))
```

**Verificações adicionais:**
- Verificar se `amount` está em centavos (dividir por 100)
- Verificar se `plan_type` está correto no banco
- Verificar se há assinaturas com `amount = 0` mas que são pagantes

---

### 2. ADICIONAR FILTROS DE PERÍODO AVANÇADOS

**Novos filtros:**
1. **Seletor de Mês/Ano:**
   - Dropdown para escolher mês e ano
   - Ex: "Dezembro 2025", "Janeiro 2026"

2. **Seletor de Trimestre:**
   - Dropdown: Q1 2025, Q2 2025, Q3 2025, Q4 2025, etc.
   - Calcular automaticamente as datas

3. **Período Customizado:**
   - Date picker para data início
   - Date picker para data fim
   - Botão "Aplicar"

4. **Períodos Rápidos:**
   - Últimos 3 meses
   - Últimos 6 meses
   - Últimos 12 meses
   - Este mês
   - Mês passado
   - Este trimestre
   - Trimestre passado

**Filtro na API:**
```typescript
// Query params:
// - periodo_inicio: YYYY-MM-DD
// - periodo_fim: YYYY-MM-DD
// - periodo_tipo: 'mes' | 'trimestre' | 'custom' | 'ultimos_n_meses'

// Filtrar por created_at OU current_period_start
```

---

### 3. FILTRO DE RECEITAS PAGANTES POR PERÍODO

**Funcionalidade:**
- Quando filtro de categoria = "Pagantes", aplicar também filtro de período
- Mostrar apenas receitas pagantes no período selecionado
- Totais devem refletir apenas o período selecionado

---

## 📝 IMPLEMENTAÇÃO

### Fase 1: Corrigir Categorização
1. ✅ Revisar lógica de categorização
2. ✅ Adicionar verificações adicionais
3. ✅ Testar com dados reais
4. ✅ Criar script SQL para verificar categorias

### Fase 2: Adicionar Filtros de Período
1. ✅ Criar componente de seletor de período
2. ✅ Adicionar filtros na API
3. ✅ Atualizar interface
4. ✅ Testar filtros

### Fase 3: Integrar Filtros
1. ✅ Combinar filtro de categoria com período
2. ✅ Atualizar totais baseados nos filtros
3. ✅ Testar cenários combinados

---

## 🔍 VERIFICAÇÃO INICIAL

**Script SQL para verificar categorias:**
```sql
-- Verificar assinaturas que podem estar categorizadas errado
SELECT 
  s.id,
  s.plan_type,
  s.amount / 100.0 as valor_reais,
  s.is_migrated,
  up.is_admin,
  up.is_support,
  CASE 
    WHEN up.is_admin = true OR up.is_support = true THEN 'SUPORTE'
    WHEN s.plan_type = 'free' OR (s.amount = 0 AND s.is_migrated != true) THEN 'GRATUITA'
    WHEN s.amount > 0 THEN 'PAGANTE'
    ELSE 'VERIFICAR'
  END as categoria_esperada,
  up.email
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.status = 'active'
ORDER BY s.amount DESC, s.created_at DESC;
```

