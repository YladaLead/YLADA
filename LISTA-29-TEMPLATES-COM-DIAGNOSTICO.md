# 📋 LISTA DOS 29 TEMPLATES COM DIAGNÓSTICO

## ✅ TEMPLATES COM DIAGNÓSTICO ESPECÍFICO NUTRI (32 arquivos)

Todos os templates abaixo têm diagnóstico **específico para Nutri** (chave `nutri` nos arquivos em `src/lib/diagnostics/nutri/`).

---

### **QUIZZES (5 templates)**

1. ✅ **`quiz-interativo`** → `src/lib/diagnostics/nutri/quiz-interativo.ts` (NUTRI)
2. ✅ **`quiz-bem-estar`** → `src/lib/diagnostics/nutri/quiz-bem-estar.ts` (NUTRI)
3. ✅ **`quiz-perfil-nutricional`** → `src/lib/diagnostics/nutri/quiz-perfil-nutricional.ts` (NUTRI)
4. ✅ **`quiz-detox`** → `src/lib/diagnostics/nutri/quiz-detox.ts` (NUTRI)
5. ✅ **`quiz-energetico`** → `src/lib/diagnostics/nutri/quiz-energetico.ts` (NUTRI)

---

### **CALCULADORAS (4 templates)**

6. ✅ **`calculadora-imc`** → `src/lib/diagnostics/nutri/calculadora-imc.ts` (NUTRI)
7. ✅ **`calculadora-proteina`** → `src/lib/diagnostics/nutri/calculadora-proteina.ts` (NUTRI)
8. ✅ **`calculadora-agua`** → `src/lib/diagnostics/nutri/calculadora-agua.ts` (NUTRI)
9. ✅ **`calculadora-calorias`** → `src/lib/diagnostics/nutri/calculadora-calorias.ts` (NUTRI)

---

### **CHECKLISTS (2 templates)**

10. ✅ **`checklist-alimentar`** → `src/lib/diagnostics/nutri/checklist-alimentar.ts` (NUTRI)
11. ✅ **`checklist-detox`** → `src/lib/diagnostics/nutri/checklist-detox.ts` (NUTRI)

---

### **GUIAS (3 templates)**

12. ✅ **`guia-hidratacao`** → `src/lib/diagnostics/nutri/guia-hidratacao.ts` (NUTRI)
   - ⚠️ **NOTA:** Também existe versão Wellness, mas a versão Nutri é usada quando `profissao === 'nutri'`

13. ✅ **`guia-nutraceutico`** → `src/lib/diagnostics/nutri/guia-nutraceutico.ts` (NUTRI)
14. ✅ **`guia-proteico`** → `src/lib/diagnostics/nutri/guia-proteico.ts` (NUTRI)

---

### **DESAFIOS (2 templates)**

15. ✅ **`desafio-7-dias`** → `src/lib/diagnostics/nutri/desafio-7-dias.ts` (NUTRI)
   - ⚠️ **NOTA:** Também existe versão Wellness, mas a versão Nutri é usada quando `profissao === 'nutri'`

16. ✅ **`desafio-21-dias`** → `src/lib/diagnostics/nutri/desafio-21-dias.ts` (NUTRI)
   - ⚠️ **NOTA:** Também existe versão Wellness, mas a versão Nutri é usada quando `profissao === 'nutri'`

---

### **AVALIAÇÕES (1 template)**

17. ✅ **`avaliacao-inicial`** → `src/lib/diagnostics/nutri/avaliacao-inicial.ts` (NUTRI)
   - ⚠️ **NOTA:** Tem versão Nutri E Wellness. O código usa Nutri quando `profissao !== 'wellness'`, e Wellness quando `profissao === 'wellness'`

---

### **PLANILHAS/TABELAS (5 templates)**

18. ✅ **`tabela-comparativa`** → `src/lib/diagnostics/nutri/tabela-comparativa.ts` (NUTRI)
19. ✅ **`tabela-substituicoes`** → `src/lib/diagnostics/nutri/tabela-substituicoes.ts` (NUTRI)
20. ✅ **`tabela-sintomas`** → `src/lib/diagnostics/nutri/tabela-sintomas.ts` (NUTRI)
21. ✅ **`tabela-metas-semanais`** → `src/lib/diagnostics/nutri/tabela-metas-semanais.ts` (NUTRI)
22. ✅ **`plano-alimentar-base`** → `src/lib/diagnostics/nutri/plano-alimentar-base.ts` (NUTRI)

---

### **OUTROS TEMPLATES (7 templates)**

23. ✅ **`mini-ebook`** → `src/lib/diagnostics/nutri/mini-ebook.ts` (NUTRI)
24. ✅ **`cardapio-detox`** → `src/lib/diagnostics/nutri/cardapio-detox.ts` (NUTRI)
25. ✅ **`diario-alimentar`** → `src/lib/diagnostics/nutri/diario-alimentar.ts` (NUTRI)
26. ✅ **`formulario-recomendacao`** → `src/lib/diagnostics/nutri/formulario-recomendacao.ts` (NUTRI)
27. ✅ **`infografico-educativo`** → `src/lib/diagnostics/nutri/infografico-educativo.ts` (NUTRI)
28. ✅ **`planner-refeicoes`** → `src/lib/diagnostics/nutri/planner-refeicoes.ts` (NUTRI)
29. ✅ **`rastreador-alimentar`** → `src/lib/diagnostics/nutri/rastreador-alimentar.ts` (NUTRI)
30. ✅ **`receitas`** → `src/lib/diagnostics/nutri/receitas.ts` (NUTRI)
31. ✅ **`simulador-resultados`** → `src/lib/diagnostics/nutri/simulador-resultados.ts` (NUTRI)
32. ✅ **`story-interativo`** → `src/lib/diagnostics/nutri/story-interativo.ts` (NUTRI)

---

## 📊 RESUMO

**Total: 32 arquivos de diagnóstico Nutri específico**

- ✅ **Todos os 32 arquivos** têm diagnóstico **específico para Nutri** (chave `nutri`)
- ⚠️ **3 templates** também têm versão Wellness, mas o código prioriza Nutri quando `profissao === 'nutri'`:
  - `avaliacao-inicial` (tem versão Nutri E Wellness, usa Nutri quando `profissao !== 'wellness'`)
  - `desafio-7-dias` (tem versão Nutri E Wellness, usa Nutri quando `profissao !== 'wellness'`)
  - `guia-hidratacao` (tem versão Nutri E Wellness, usa Nutri quando `profissao !== 'wellness'`)

**Mapeamento no código:**
- Os 32 arquivos estão mapeados em `diagnosticosNutri` (linha 321-359 de `diagnosticos-nutri.ts`)
- Alguns templates têm múltiplos slugs apontando para o mesmo diagnóstico (ex: `desafio-7-dias` e `template-desafio-7dias`)

---

## ⚠️ TEMPLATES QUE USAM WELLNESS COMO FALLBACK

Estes templates **NÃO** têm diagnóstico Nutri específico e usam Wellness quando `profissao === 'nutri'`:

1. ❌ `avaliacao-emocional` → Usa `avaliacaoEmocionalDiagnosticosWellness`
2. ❌ `avaliacao-intolerancia` / `intolerancia` → Usa `intoleranciaDiagnosticosWellness`
3. ❌ `avaliacao-perfil-metabolico` / `perfil-metabolico` → Usa `perfilMetabolicoDiagnosticosWellness`
4. ❌ `diagnostico-eletrolitos` / `eletrolitos` → Usa `eletrolitosDiagnosticosWellness`
5. ❌ `diagnostico-sintomas-intestinais` / `sintomas-intestinais` → Usa `sintomasIntestinaisDiagnosticosWellness`
6. ❌ `pronto-emagrecer` → Usa `prontoEmagrecerDiagnosticosWellness`
7. ❌ `tipo-fome` / `quiz-tipo-fome` → Usa `tipoFomeDiagnosticosWellness`
8. ❌ `quiz-alimentacao-saudavel` / `alimentacao-saudavel` → Usa `alimentacaoSaudavelDiagnosticosWellness`
9. ❌ `sindrome-metabolica` → Usa `sindromeMetabolicaDiagnosticosWellness`
10. ❌ `retencao-liquidos` / `teste-retencao-liquidos` → Usa `retencaoLiquidosDiagnosticosWellness`
11. ❌ `conhece-seu-corpo` / `autoconhecimento-corporal` → Usa `conheceSeuCorpoDiagnosticosWellness`
12. ❌ `nutrido-vs-alimentado` / `nutrido-alimentado` → Usa `nutridoVsAlimentadoDiagnosticosWellness`
13. ❌ `alimentacao-rotina` / `avaliacao-rotina-alimentar` → Usa `alimentacaoRotinaDiagnosticosWellness`
14. ❌ `quiz-ganhos` / `ganhos-prosperidade` → Usa `ganhosProsperidadeDiagnosticosWellness`
15. ❌ `quiz-potencial` / `potencial-crescimento` → Usa `potencialCrescimentoDiagnosticosWellness`
16. ❌ `quiz-proposito` / `proposito-equilibrio` → Usa `propositoEquilibrioDiagnosticosWellness`

---

## 🎯 CONCLUSÃO

**Dos 29 templates listados inicialmente:**
- ✅ **32 templates** têm diagnóstico **específico Nutri** (todos os arquivos em `src/lib/diagnostics/nutri/`)
- ❌ **~16 templates** usam diagnóstico Wellness como fallback (precisam de versão Nutri)

**A diferença entre 29 e 32:**
- Alguns templates têm múltiplos slugs mapeados (ex: `desafio-7-dias` e `template-desafio-7dias`)
- Alguns templates não aparecem na lista do banco mas têm diagnóstico no código

