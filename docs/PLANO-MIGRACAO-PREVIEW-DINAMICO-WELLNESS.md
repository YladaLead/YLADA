# 📋 PLANO: Migração Preview Dinâmico - Wellness

## 🎯 OBJETIVO

Migrar todos os previews customizados da área Wellness para usar o preview dinâmico baseado no `content` JSONB do banco.

---

## 📊 SITUAÇÃO ATUAL

### **Previews Customizados (27 templates):**

1. **Quizzes (22):**
   - QuizInterativoPreview
   - QuizBemEstarPreview
   - QuizPerfilNutricionalPreview
   - QuizDetoxPreview
   - QuizEnergeticoPreview
   - QuizEmocionalPreview
   - QuizIntoleranciaPreview
   - QuizPerfilMetabolicoPreview
   - QuizAvaliacaoInicialPreview
   - QuizEletrolitosPreview
   - QuizSintomasIntestinaisPreview
   - QuizProntoEmagrecerPreview
   - QuizTipoFomePreview
   - QuizAlimentacaoSaudavelPreview
   - QuizSindromeMetabolicaPreview
   - QuizRetencaoLiquidosPreview
   - QuizConheceSeuCorpoPreview
   - QuizNutridoVsAlimentadoPreview
   - QuizAlimentacaoRotinaPreview
   - QuizGanhosProsperidadePreview
   - QuizPotencialCrescimentoPreview
   - QuizPropositoEquilibrioPreview

2. **Checklists (2):**
   - ChecklistAlimentarPreview
   - ChecklistDetoxPreview

3. **Guias (1):**
   - GuiaHidratacaoPreview

4. **Desafios (2):**
   - Desafio7Dias (hardcoded no componente)
   - Desafio21Dias (hardcoded no componente)

---

## 🚀 PASSO A PASSO

### **FASE 1: Análise e Preparação**

1. ✅ Verificar quais templates têm `content` JSONB no banco
2. ✅ Verificar estrutura do `content` de cada template
3. ✅ Identificar quais previews podem ser migrados diretamente
4. ✅ Identificar quais precisam de ajustes no `content`

### **FASE 2: Migração Gradual**

**Estratégia:**
- Migrar um template por vez
- Testar após cada migração
- Manter preview customizado como fallback durante transição

**Ordem sugerida:**
1. Quizzes simples (menos complexos)
2. Checklists
3. Guias
4. Quizzes complexos
5. Desafios (mais complexos)

### **FASE 3: Validação**

1. Testar cada template migrado
2. Verificar se preview dinâmico funciona corretamente
3. Comparar com preview customizado original
4. Ajustar `content` JSONB se necessário

### **FASE 4: Limpeza**

1. Remover previews customizados não utilizados
2. Remover imports não utilizados
3. Atualizar lista de templates com preview customizado
4. Documentar mudanças

---

## 📝 PRÓXIMOS PASSOS IMEDIATOS

1. **Verificar content JSONB no banco:**
   - Listar todos os templates Wellness
   - Verificar quais têm `content` completo
   - Identificar quais precisam de `content` criado/atualizado

2. **Começar migração:**
   - Escolher primeiro template (sugestão: Quiz Interativo)
   - Verificar se `content` está completo
   - Se sim, remover preview customizado e usar dinâmico
   - Se não, criar/atualizar `content` primeiro

3. **Testar:**
   - Verificar preview dinâmico funciona
   - Comparar com preview customizado
   - Ajustar se necessário

---

## ⚠️ IMPORTANTE

- **Diagnósticos continuam hardcoded** (não mudam)
- **Cada área é independente** (Wellness não afeta Nutri)
- **Migração gradual** (não precisa fazer tudo de uma vez)
- **Manter fallback** durante transição

