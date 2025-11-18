# 🎯 PLANO DE AÇÃO: COMPLETAR ÁREA NUTRI

## 📊 SITUAÇÃO ATUAL

### **Templates Nutri no Supabase:**
- ✅ **COM DIAGNÓSTICO:** 8 templates
- ❌ **SEM DIAGNÓSTICO:** 29 templates
- **TOTAL:** 37 templates

### **Diagnósticos Nutri no Código:**
- **TOTAL:** 32 diagnósticos revisados

---

## ✅ TEMPLATES COM DIAGNÓSTICO (8)

1. ✅ Calculadora de Água → `calculadoraAguaDiagnosticos`
2. ✅ Calculadora de Calorias → `calculadoraCaloriasDiagnosticos`
3. ✅ Calculadora de IMC → `calculadoraImcDiagnosticos`
4. ✅ Calculadora de Proteína → `calculadoraProteinaDiagnosticos`
5. ✅ Guia Nutracêutico → `guiaNutraceuticoDiagnosticos`
6. ✅ Guia Proteico → `guiaProteicoDiagnosticos`
7. ✅ Mini E-book Educativo → `miniEbookDiagnosticos`
8. ✅ Quiz de Perfil Nutricional → `quizPerfilNutricionalDiagnosticos`

---

## ❌ TEMPLATES SEM DIAGNÓSTICO (29)

### **Quizzes (10):**
1. ❌ Avaliação de Fome Emocional
2. ❌ Avaliação de Intolerâncias/Sensibilidades
3. ❌ Avaliação do Perfil Metabólico
4. ❌ Descubra seu Perfil de Bem-Estar (duplicado?)
5. ❌ Quiz de Bem-Estar
6. ❌ Quiz Detox
7. ❌ Quiz Energético (duplicado?)
8. ❌ Quiz: Propósito e Equilíbrio
9. ❌ Qual é o seu Tipo de Fome?
10. ❌ Qual é seu perfil de intestino?

### **Diagnósticos/Testes (5):**
11. ❌ Diagnóstico de Eletrólitos
12. ❌ Diagnóstico de Parasitose
13. ❌ Risco de Síndrome Metabólica
14. ❌ Teste de Retenção de Líquidos (duplicado?)
15. ❌ Você conhece o seu corpo?

### **Checklists/Planilhas (4):**
16. ❌ Checklist Alimentar
17. ❌ Planilha Dieta Emagrecimento
18. ❌ Tabela Comparativa
19. ❌ Tabela de Substituições

### **Desafios/Programas (2):**
20. ❌ Desafio 7 Dias
21. ❌ Pronto para Emagrecer com Saúde?

### **Avaliações/Testes (8):**
22. ❌ Avaliação do Sono e Energia
23. ❌ Seu corpo está pedindo Detox?
24. ❌ Você é mais disciplinado ou emocional com a comida?
25. ❌ Você está nutrido ou apenas alimentado?
26. ❌ Você está se alimentando conforme sua rotina?

---

## 🔍 DIAGNÓSTICOS NO CÓDIGO QUE PODEM CORRESPONDER

### **Diagnósticos que EXISTEM no código mas podem não estar mapeados:**

1. ✅ `quizBemEstarDiagnosticos` → **Quiz de Bem-Estar** (template existe!)
2. ✅ `quizDetoxDiagnosticos` → **Quiz Detox** (template existe!)
3. ✅ `quizEnergeticoDiagnosticos` → **Quiz Energético** (template existe!)
4. ✅ `checklistAlimentarDiagnosticos` → **Checklist Alimentar** (template existe!)
5. ✅ `checklistDetoxDiagnosticos` → **Seu corpo está pedindo Detox?** (possível correspondência)
6. ✅ `desafio7DiasDiagnosticos` → **Desafio 7 Dias** (template existe!)
7. ✅ `tabelaComparativaDiagnosticos` → **Tabela Comparativa** (template existe!)
8. ✅ `tabelaSubstituicoesDiagnosticos` → **Tabela de Substituições** (template existe!)

### **Diagnósticos que podem usar templates Wellness como fallback:**

9. ⚠️ `avaliacaoEmocionalDiagnosticosWellness` → **Avaliação de Fome Emocional**
10. ⚠️ `intoleranciaDiagnosticosWellness` → **Avaliação de Intolerâncias/Sensibilidades**
11. ⚠️ `perfilMetabolicoDiagnosticosWellness` → **Avaliação do Perfil Metabólico**
12. ⚠️ `eletrolitosDiagnosticosWellness` → **Diagnóstico de Eletrólitos**
13. ⚠️ `sintomasIntestinaisDiagnosticosWellness` → **Qual é seu perfil de intestino?**
14. ⚠️ `prontoEmagrecerDiagnosticosWellness` → **Pronto para Emagrecer com Saúde?**
15. ⚠️ `tipoFomeDiagnosticosWellness` → **Qual é o seu Tipo de Fome?**
16. ⚠️ `sindromeMetabolicaDiagnosticosWellness` → **Risco de Síndrome Metabólica**
17. ⚠️ `retencaoLiquidosDiagnosticosWellness` → **Teste de Retenção de Líquidos**
18. ⚠️ `conheceSeuCorpoDiagnosticosWellness` → **Você conhece o seu corpo?**
19. ⚠️ `nutridoVsAlimentadoDiagnosticosWellness` → **Você está nutrido ou apenas alimentado?**
20. ⚠️ `alimentacaoRotinaDiagnosticosWellness` → **Você está se alimentando conforme sua rotina?**
21. ⚠️ `propositoEquilibrioDiagnosticosWellness` → **Quiz: Propósito e Equilíbrio**

---

## 🎯 ESTRATÉGIA RECOMENDADA

### **ETAPA 1: Mapear Correspondências Existentes** ✅

**Diagnósticos Nutri que JÁ EXISTEM e correspondem a templates:**
- `quizBemEstarDiagnosticos` → Quiz de Bem-Estar
- `quizDetoxDiagnosticos` → Quiz Detox
- `quizEnergeticoDiagnosticos` → Quiz Energético
- `checklistAlimentarDiagnosticos` → Checklist Alimentar
- `desafio7DiasDiagnosticos` → Desafio 7 Dias
- `tabelaComparativaDiagnosticos` → Tabela Comparativa
- `tabelaSubstituicoesDiagnosticos` → Tabela de Substituições

**Ação:** Atualizar função `getDiagnostico()` para mapear corretamente.

---

### **ETAPA 2: Usar Diagnósticos Wellness como Fallback** ⚠️

**Templates que podem usar diagnósticos Wellness:**
- Avaliação de Fome Emocional → `avaliacaoEmocionalDiagnosticosWellness`
- Avaliação de Intolerâncias → `intoleranciaDiagnosticosWellness`
- Perfil Metabólico → `perfilMetabolicoDiagnosticosWellness`
- Eletrólitos → `eletrolitosDiagnosticosWellness`
- Sintomas Intestinais → `sintomasIntestinaisDiagnosticosWellness`
- Pronto para Emagrecer → `prontoEmagrecerDiagnosticosWellness`
- Tipo de Fome → `tipoFomeDiagnosticosWellness`
- Síndrome Metabólica → `sindromeMetabolicaDiagnosticosWellness`
- Retenção de Líquidos → `retencaoLiquidosDiagnosticosWellness`
- Conhece seu Corpo → `conheceSeuCorpoDiagnosticosWellness`
- Nutrido vs Alimentado → `nutridoVsAlimentadoDiagnosticosWellness`
- Alimentação Rotina → `alimentacaoRotinaDiagnosticosWellness`
- Propósito e Equilíbrio → `propositoEquilibrioDiagnosticosWellness`

**Ação:** Atualizar função `getDiagnostico()` para usar fallback Wellness quando não houver versão Nutri.

---

### **ETAPA 3: Criar Diagnósticos Nutri Específicos** (Opcional) 📝

**Templates que precisam de diagnósticos Nutri específicos:**
- Avaliação do Sono e Energia
- Diagnóstico de Parasitose
- Planilha Dieta Emagrecimento
- Descubra seu Perfil de Bem-Estar (se diferente de Quiz de Bem-Estar)

**Ação:** Criar diagnósticos Nutri específicos ou usar fallback.

---

## ✅ AÇÕES IMEDIATAS

1. ✅ **Atualizar `getDiagnostico()`** para mapear corretamente os 8 templates que já têm diagnósticos
2. ✅ **Adicionar fallbacks** para templates que podem usar diagnósticos Wellness
3. ⚠️ **Criar diagnósticos Nutri** para templates que precisam de versão específica (opcional)

---

## 📝 PRÓXIMO PASSO

**Atualizar função `getDiagnostico()` em `diagnosticos-nutri.ts` para:**
- Mapear corretamente os templates existentes
- Usar fallback Wellness quando apropriado
- Garantir que todos os 37 templates tenham diagnósticos funcionais



