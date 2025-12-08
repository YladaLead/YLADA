# 📋 VERIFICAÇÃO COMPLETA - Links Wellness

## 🎯 OBJETIVO
Listar todos os itens da página `/pt/wellness/links` e verificar:
1. ✅ Preview funcionando
2. ✅ Diagnóstico configurado
3. ✅ Link correto

---

## 📊 LISTA COMPLETA DE ITENS

### 👥 RECRUTAMENTO

#### Quizzes de Recrutamento (3 itens):
1. **Quiz: Ganhos e Prosperidade**
   - Slug esperado: `quiz-ganhos`, `ganhos-prosperidade`, `quiz-ganhos-prosperidade`
   - Diagnóstico: ✅ `ganhosProsperidadeDiagnosticos`
   - Preview: ✅ `DynamicTemplatePreview`
   - Status: ⚠️ Verificar se slug está sendo mapeado corretamente

2. **Quiz: Potencial e Crescimento**
   - Slug esperado: `quiz-potencial`, `potencial-crescimento`, `quiz-potencial-crescimento`
   - Diagnóstico: ✅ `potencialCrescimentoDiagnosticos`
   - Preview: ✅ `DynamicTemplatePreview`
   - Status: ⚠️ Verificar se slug está sendo mapeado corretamente

3. **Quiz: Propósito e Equilíbrio**
   - Slug esperado: `quiz-proposito`, `proposito-equilibrio`, `quiz-proposito-equilibrio`
   - Diagnóstico: ✅ `propositoEquilibrioDiagnosticos`
   - Preview: ✅ `DynamicTemplatePreview`
   - Status: ⚠️ Verificar se slug está sendo mapeado corretamente

#### Fluxos de Recrutamento:
- Lista completa em: `src/lib/wellness-system/fluxos-recrutamento.ts`
- Preview: ✅ `FluxoDiagnostico` (componente que mostra perguntas e diagnóstico)
- Diagnóstico: ✅ Cada fluxo tem `diagnostico` próprio
- Status: ✅ Funcionando

---

### 💰 VENDAS

#### Fluxos de Vendas:
- Lista completa em: `src/lib/wellness-system/fluxos-clientes.ts`
- Preview: ✅ `FluxoDiagnostico` (componente que mostra perguntas e diagnóstico)
- Diagnóstico: ✅ Cada fluxo tem `diagnostico` próprio
- Status: ✅ Funcionando

---

## 🔧 AJUSTES NECESSÁRIOS

### 1. Mapeamento de Slugs dos Quizzes
Adicionar mapeamentos adicionais no `wellnessDiagnosticsMap` para garantir que todos os slugs sejam reconhecidos.

### 2. Verificar Content dos Templates
Garantir que os templates dos 3 quizzes tenham `content` completo no banco de dados.

### 3. Preview dos Fluxos
Já implementado usando `FluxoDiagnostico` que mostra:
- Todas as perguntas
- Diagnóstico completo
- Exatamente o que a pessoa verá ao acessar o link

---

## ✅ CHECKLIST DE VERIFICAÇÃO

- [ ] Verificar se os 3 quizzes têm `content` no banco
- [ ] Verificar se os slugs estão sendo mapeados corretamente
- [ ] Testar preview de cada quiz
- [ ] Testar preview de cada fluxo
- [ ] Verificar se diagnósticos aparecem no preview
- [ ] Verificar se links estão funcionando
