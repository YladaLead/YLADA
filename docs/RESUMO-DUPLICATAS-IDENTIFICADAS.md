# 🔍 RESUMO: Duplicatas Identificadas - Wellness

## 📊 SITUAÇÃO ATUAL

**Contagem:**
- **Calculadoras:** 4 ativos ✅ (correto)
- **Planilhas:** 3 ativas ⚠️ (esperado: 2)
- **Quizzes:** 32 ativos ⚠️ (esperado: 24)
- **Total:** 37 ativos (esperado: 35)

**Diferença:** +2 templates extras

---

## 🎯 QUIZZES DUPLICADOS IDENTIFICADOS

### 1. **Desafios** (4 → 2)
- ✅ **MANTER:** "Desafio 21 Dias" (slug: `desafio-21-dias`, criado 2025-11-09)
- ✅ **MANTER:** "Desafio 7 Dias" (slug: `desafio-7-dias`, criado 2025-11-09)
- ❌ **REMOVER:** "Desafio 21 Dias" (sem slug, criado 2025-11-06)
- ❌ **REMOVER:** "Desafio 7 Dias" (sem slug, criado 2025-11-06)

### 2. **Quiz Bem-Estar** (3 → 1)
- ✅ **MANTER:** "Quiz de Bem-Estar" (sem slug, criado 2025-11-06)
- ❌ **REMOVER:** "Descubra seu Perfil de Bem-Estar" (sem slug, criado 2025-11-06)
- ❌ **REMOVER:** "Quiz: Perfil de Bem-Estar" (sem slug, criado 2025-11-06)

### 3. **Quiz Detox** (2 → 1)
- ✅ **MANTER:** "Quiz Detox" (sem slug, criado 2025-11-06)
- ❌ **REMOVER:** "Seu corpo está pedindo Detox?" (sem slug, criado 2025-11-06)

### 4. **Quiz Metabolismo/Interativo** (2 → 1)
- ✅ **MANTER:** "Quiz Interativo" (slug: `quiz-interativo`, criado 2025-11-05)
- ❌ **REMOVER:** "Diagnóstico do Tipo de Metabolismo" (sem slug, criado 2025-11-06)

### 5. **Quiz Energia/Sono** (2 → 1)
- ✅ **MANTER:** "Quiz Energético" (sem slug, criado 2025-11-06)
- ❌ **REMOVER:** "Avaliação do Sono e Energia" (slug: `quiz-sono-energia`, criado 2025-11-05)

---

## 📋 RESUMO DE REMOÇÕES

**Total de quizzes a desativar:** 7
- 2 Desafios (versões sem slug)
- 2 Bem-Estar (duplicatas)
- 1 Detox (duplicata)
- 1 Metabolismo (duplicata)
- 1 Energia/Sono (duplicata)

**Resultado esperado após remoção:**
- Quizzes: 32 → 25 (ainda +1 extra, mas vamos verificar depois)

---

## 📊 PLANILHAS

**Status:** 3 ativas (esperado: 2)

**Próximo passo:** Executar `scripts/verificar-planilhas-wellness.sql` para identificar qual é a planilha extra.

---

## 🔧 SCRIPTS CRIADOS

1. ✅ `scripts/remover-quizzes-duplicados-wellness.sql`
   - Desativa 7 quizzes duplicados
   - Mantém apenas as versões corretas

2. ✅ `scripts/verificar-planilhas-wellness.sql`
   - Lista as 3 planilhas ativas
   - Identifica qual é a extra

---

## 📝 PRÓXIMOS PASSOS

1. ⏳ Executar `scripts/remover-quizzes-duplicados-wellness.sql` no Supabase
2. ⏳ Executar `scripts/verificar-planilhas-wellness.sql` no Supabase
3. ⏳ Identificar e desativar a planilha extra
4. ⏳ Verificar contagem final (deve ser 35 ativos)

---

**Última atualização:** 2025-01-XX


