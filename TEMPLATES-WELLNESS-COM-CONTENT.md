# 📋 TEMPLATES WELLNESS COM CONTENT COMPLETO

## ✅ Total: 33 Templates Wellness com Content

Lista dos templates Wellness que têm `content` completo e podem ser copiados para Nutri.

---

## 📊 RESUMO POR TIPO

### **CALCULADORAS (4 templates)**
1. ✅ `calc-hidratacao` - Calculadora de Água (outro formato)
2. ✅ `calc-calorias` - Calculadora de Calorias (outro formato)
3. ✅ `calc-imc` - Calculadora de IMC (outro formato)
4. ✅ `calc-proteina` - Calculadora de Proteína (outro formato)

### **GUIAS (1 template)**
5. ✅ `guia-hidratacao` - Guia de Hidratação (outro formato)

### **CHECKLISTS/PLANILHAS (2 templates)**
6. ✅ `checklist-alimentar` - Checklist Alimentar (outro formato)
7. ✅ `checklist-detox` - Checklist Detox (outro formato)

### **QUIZZES (26 templates)**

#### **Quizzes com 5 perguntas (22 templates)**
8. ✅ `quiz-fome-emocional` - Avaliação de Fome Emocional (5 perguntas)
9. ✅ `avaliacao-intolerancia` - Avaliação de Intolerâncias/Sensibilidades (5 perguntas)
10. ✅ `avaliacao-perfil-metabolico` - Avaliação do Perfil Metabólico (5 perguntas)
11. ✅ `avaliacao-inicial` - Avaliação Inicial (5 perguntas)
12. ✅ `desafio-21-dias` - Desafio 21 Dias (5 perguntas)
13. ✅ `desafio-7-dias` - Desafio 7 Dias (5 perguntas)
14. ✅ `diagnostico-eletrolitos` - Diagnóstico de Eletrólitos (5 perguntas)
15. ✅ `diagnostico-sintomas-intestinais` - Diagnóstico de Sintomas Intestinais (5 perguntas)
16. ✅ `pronto-emagrecer` - Pronto para Emagrecer com Saúde? (5 perguntas)
17. ✅ `tipo-fome` - Qual é o seu Tipo de Fome? (5 perguntas)
18. ✅ `quiz-bem-estar` - Quiz de Bem-Estar (5 perguntas)
19. ✅ `quiz-detox` - Quiz Detox (5 perguntas)
20. ✅ `quiz-alimentacao-saudavel` - Quiz: Alimentação Saudável (5 perguntas)
21. ✅ `quiz-ganhos` - Quiz: Ganhos e Prosperidade (5 perguntas)
22. ✅ `quiz-potencial` - Quiz: Potencial e Crescimento (5 perguntas)
23. ✅ `quiz-proposito` - Quiz: Propósito e Equilíbrio (5 perguntas)
24. ✅ `sindrome-metabolica` - Risco de Síndrome Metabólica (5 perguntas)
25. ✅ `retencao-liquidos` - Teste de Retenção de Líquidos (5 perguntas)
26. ✅ `conhece-seu-corpo` - Você conhece o seu corpo? (5 perguntas)
27. ✅ `nutrido-vs-alimentado` - Você está nutrido ou apenas alimentado? (5 perguntas)

#### **Quizzes com 6 perguntas (2 templates)**
28. ✅ `quiz-energetico` - Quiz Energético (6 perguntas)
29. ✅ `quiz-interativo` - Quiz Interativo (6 perguntas)

#### **Quizzes com outro formato (2 templates)**
30. ✅ `disciplinado-emocional` - Você é mais disciplinado ou emocional com a comida? (outro formato)
31. ✅ `alimentacao-rotina` - Você está se alimentando conforme sua rotina? (outro formato)

---

## 🔍 MAPEAMENTO SLUG WELLNESS → NUTRI

### **Slugs que PRECISAM de correspondência (podem ter slugs diferentes)**

Alguns templates Wellness podem ter slugs diferentes no Nutri. Verificar:

- `calc-hidratacao` → Pode ser `calculadora-agua` no Nutri
- `calc-calorias` → Pode ser `calculadora-calorias` no Nutri
- `calc-imc` → Pode ser `calculadora-imc` no Nutri
- `calc-proteina` → Pode ser `calculadora-proteina` no Nutri
- `quiz-fome-emocional` → Pode ser `avaliacao-fome-emocional` no Nutri
- `quiz-alimentacao-saudavel` → Pode ser `alimentacao-saudavel` no Nutri
- `quiz-ganhos` → Pode ser `ganhos-prosperidade` no Nutri
- `quiz-potencial` → Pode ser `potencial-crescimento` no Nutri
- `quiz-proposito` → Pode ser `proposito-equilibrio` no Nutri
- `retencao-liquidos` → Pode ser `teste-retencao-liquidos` no Nutri

---

## ⚠️ TEMPLATES QUE PRECISAM DE ATENÇÃO

### **1. Calculadoras com slugs diferentes**

Os templates Wellness usam `calc-*` mas os Nutri podem usar `calculadora-*`:

- `calc-hidratacao` (Wellness) → `calculadora-agua` (Nutri?)
- `calc-calorias` (Wellness) → `calculadora-calorias` (Nutri?)
- `calc-imc` (Wellness) → `calculadora-imc` (Nutri?)
- `calc-proteina` (Wellness) → `calculadora-proteina` (Nutri?)

**Ação:** Verificar se os templates Nutri existem com esses slugs ou criar mapeamento alternativo.

### **2. Templates com formato "outro formato"**

Estes templates têm `content` mas não seguem o padrão `questions` array:

- `calc-hidratacao` (calculadora)
- `calc-calorias` (calculadora)
- `calc-imc` (calculadora)
- `calc-proteina` (calculadora)
- `guia-hidratacao` (guia)
- `checklist-alimentar` (planilha)
- `checklist-detox` (planilha)
- `disciplinado-emocional` (quiz)
- `alimentacao-rotina` (quiz)

**Ação:** Verificar se o formato é compatível antes de copiar.

---

## 📋 CHECKLIST PARA COPIAR

### **Antes de copiar:**

- [ ] Verificar se todos os templates Nutri correspondentes existem
- [ ] Verificar se os slugs são idênticos ou criar mapeamento
- [ ] Verificar formato do `content` (calculadoras podem ter formato diferente)
- [ ] Criar backup (Query #3 do script SQL)

### **Templates prioritários (quizzes com perguntas):**

1. ✅ `quiz-interativo` (6 perguntas) - **JÁ TEM DIAGNÓSTICO NUTRI**
2. ✅ `quiz-bem-estar` (5 perguntas) - **JÁ TEM DIAGNÓSTICO NUTRI**
3. ✅ `quiz-detox` (5 perguntas) - **JÁ TEM DIAGNÓSTICO NUTRI**
4. ✅ `quiz-energetico` (6 perguntas) - **JÁ TEM DIAGNÓSTICO NUTRI**
5. ✅ `avaliacao-inicial` (5 perguntas) - **JÁ TEM DIAGNÓSTICO NUTRI**
6. ✅ `desafio-7-dias` (5 perguntas) - **JÁ TEM DIAGNÓSTICO NUTRI**
7. ✅ `desafio-21-dias` (5 perguntas) - **JÁ TEM DIAGNÓSTICO NUTRI**

### **Templates que PRECISAM de diagnóstico Nutri:**

8. ❌ `quiz-fome-emocional` - Precisa diagnóstico Nutri
9. ❌ `avaliacao-intolerancia` - Precisa diagnóstico Nutri
10. ❌ `avaliacao-perfil-metabolico` - Precisa diagnóstico Nutri
11. ❌ `diagnostico-eletrolitos` - Precisa diagnóstico Nutri
12. ❌ `diagnostico-sintomas-intestinais` - Precisa diagnóstico Nutri
13. ❌ `pronto-emagrecer` - Precisa diagnóstico Nutri
14. ❌ `tipo-fome` - Precisa diagnóstico Nutri
15. ❌ `quiz-alimentacao-saudavel` - Precisa diagnóstico Nutri
16. ❌ `quiz-ganhos` - Precisa diagnóstico Nutri
17. ❌ `quiz-potencial` - Precisa diagnóstico Nutri
18. ❌ `quiz-proposito` - Precisa diagnóstico Nutri
19. ❌ `sindrome-metabolica` - Precisa diagnóstico Nutri
20. ❌ `retencao-liquidos` - Precisa diagnóstico Nutri
21. ❌ `conhece-seu-corpo` - Precisa diagnóstico Nutri
22. ❌ `nutrido-vs-alimentado` - Precisa diagnóstico Nutri
23. ❌ `disciplinado-emocional` - Precisa diagnóstico Nutri
24. ❌ `alimentacao-rotina` - Precisa diagnóstico Nutri

---

## 🎯 PRÓXIMOS PASSOS

1. **Executar script SQL** para copiar `content` Wellness → Nutri
2. **Verificar correspondência de slugs** (especialmente calculadoras)
3. **Criar diagnósticos Nutri** para os 17 templates que precisam
4. **Testar previews** no frontend
5. **Ajustar linguagem** se necessário (foco em nutricionista)

---

## 📊 ESTATÍSTICAS

- **Total templates Wellness com content:** 33
- **Templates com diagnóstico Nutri já pronto:** 7
- **Templates que precisam diagnóstico Nutri:** 17
- **Templates com formato diferente:** 9 (calculadoras, checklists, guias)







