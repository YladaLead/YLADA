# 🔍 Problema: Subscription Anual não Aparece na Página de Receitas

## 📋 Situação

Subscription de **R$ 574,80** (Wellness, anual, criada em 01/12/2025) não está aparecendo na página `/admin/receitas`.

## ✅ Verificação no Banco

A subscription está **correta** no banco:
- ✅ Status: `'active'` → formatado como `'ativa'`
- ✅ Tipo: `'annual'` → formatado como `'anual'`
- ✅ Valor: R$ 574,80
- ✅ Não expirou: `current_period_end` = 2026-12-01

## 🔍 Causa do Problema

A página de receitas tem um **filtro de período** que funciona assim:

```typescript
// Linha 102-110 de src/app/admin/receitas/page.tsx
const receitasFiltradas = receitas.filter(r => {
  if (periodo === 'mes') {
    return r.tipo === 'mensal' || r.tipo === 'gratuito'  // ❌ EXCLUI ANUAIS!
  } else if (periodo === 'ano') {
    return r.tipo === 'anual'  // ✅ Mostra apenas anuais
  }
  // histórico mostra tudo
  return true
})
```

### Comportamento Atual:

1. **Período "Mês":**
   - Mostra apenas: `tipo === 'mensal'` ou `tipo === 'gratuito'`
   - ❌ **NÃO mostra anuais** (mesmo que ativos)

2. **Período "Ano":**
   - Mostra apenas: `tipo === 'anual'`
   - ✅ Mostra a subscription de R$ 574,80

3. **Período "Histórico":**
   - Mostra tudo
   - ✅ Mostra a subscription de R$ 574,80

## 💡 Solução

Para ver a subscription de R$ 574,80:

1. **Acesse:** `/admin/receitas`
2. **Mude o período para:** "Ano" ou "Histórico"
3. **Verifique os filtros:**
   - Área: "Todos" ou "Wellness"
   - Status: "Todos" ou "Active"

## 🔧 Melhoria Sugerida

O comportamento atual pode ser confuso. Sugestões:

1. **Opção 1:** No período "Mês", mostrar anuais também (mas com indicação de que são anuais)
2. **Opção 2:** Adicionar um indicador visual mostrando que há assinaturas anuais mesmo no período "Mês"
3. **Opção 3:** Mostrar totais anuais mesmo no período "Mês" (já está sendo feito, mas a lista não mostra)

## 📊 Totais

Os **totais** estão sendo calculados corretamente:
- Total Anual: Inclui a subscription de R$ 574,80
- Total Anual Mensalizado: R$ 574,80 / 12 = R$ 47,90/mês
- Total Geral: Inclui o valor mensalizado

## ✅ Conclusão

A subscription **está correta** e **está sendo contabilizada nos totais**. Ela só não aparece na **lista** quando o período está em "Mês" porque o filtro exclui anuais.

**Solução imediata:** Mude o período para "Ano" ou "Histórico" para ver a subscription.

