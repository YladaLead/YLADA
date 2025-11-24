# ✅ CHECKLIST: Copiar Content Wellness → Nutri

## 📊 RESUMO EXECUTIVO

**Total de templates Wellness com content:** 33 templates

### Por tipo:
- **Calculadoras:** 4 templates
- **Guias:** 1 template
- **Checklists/Planilhas:** 2 templates
- **Quizzes:** 26 templates
  - 22 com 5 perguntas
  - 2 com 6 perguntas
  - 2 com outro formato

---

## ✅ CHECKLIST DE EXECUÇÃO

### **FASE 1: PREPARAÇÃO**

- [ ] Abrir Supabase SQL Editor
- [ ] Abrir arquivo `copiar-content-wellness-para-nutri.sql`
- [ ] Ler o guia `GUIA-COPIAR-CONTENT-WELLNESS-NUTRI.md`

### **FASE 2: VERIFICAÇÃO PRÉVIA**

- [ ] **Query #1:** Verificar quais templates serão afetados
  - Verificar coluna `acao`:
    - ✅ `OK PARA COPIAR (slug idêntico)` → OK
    - ✅ `OK PARA COPIAR (slug alternativo)` → OK
    - ⚠️ `TEMPLATE NUTRI NÃO EXISTE` → Criar template primeiro
    - ⚠️ `WELLNESS SEM CONTENT` → Pular
    - ⚠️ `NUTRI JÁ TEM CONTENT (será sobrescrito)` → Decidir se quer sobrescrever

- [ ] **Query #2:** Verificar contagem
  - Anotar: `total_para_copiar = ?`
  - Anotar: `com_slug_identico = ?`
  - Anotar: `com_slug_alternativo = ?`

### **FASE 3: BACKUP**

- [ ] **Query #3:** Criar backup
  - Verificar: `total_backup = ?` (deve ser > 0)
  - ✅ Backup criado com sucesso

### **FASE 4: COPIAR CONTENT**

- [ ] **Query #4 - Versão 1:** Copiar slugs idênticos
  - Executar UPDATE para slugs idênticos
  - Verificar mensagem de sucesso

- [ ] **Query #4 - Versão 2:** Copiar slugs alternativos
  - Executar UPDATE para slugs alternativos
  - Verificar mensagem de sucesso

### **FASE 5: VERIFICAÇÃO PÓS-ATUALIZAÇÃO**

- [ ] **Query #5:** Verificar se foi copiado corretamente
  - Verificar coluna `comparacao`:
    - ✅ `CONTENT IDÊNTICO` → OK
    - ⚠️ `CONTENT DIFERENTE` → Investigar
  - Verificar coluna `status_content_nutri`:
    - ✅ `TEM CONTENT (X perguntas)` → OK
    - ❌ `SEM CONTENT` → Erro

### **FASE 6: ANÁLISE FINAL**

- [ ] **Query #6:** Templates Nutri sem correspondente Wellness
  - Listar templates que precisam de atenção
  - Decidir se precisam ser criados manualmente

- [ ] **Query #7:** Templates Wellness sem correspondente Nutri
  - Listar templates que podem precisar ser criados no Nutri
  - Decidir se criar ou não

---

## 📋 TEMPLATES POR CATEGORIA

### **✅ CALCULADORAS (4 templates)**
- [ ] `calc-hidratacao` → `calculadora-agua` (slug alternativo)
- [ ] `calc-calorias` → `calculadora-calorias` (slug alternativo)
- [ ] `calc-imc` → `calculadora-imc` (slug alternativo)
- [ ] `calc-proteina` → `calculadora-proteina` (slug alternativo)

### **✅ GUIAS (1 template)**
- [ ] `guia-hidratacao` → `guia-hidratacao` (slug idêntico)

### **✅ CHECKLISTS/PLANILHAS (2 templates)**
- [ ] `checklist-alimentar` → `checklist-alimentar` (slug idêntico)
- [ ] `checklist-detox` → `checklist-detox` (slug idêntico)

### **✅ QUIZZES (26 templates)**

#### **Quizzes com 5 perguntas (22 templates)**
- [ ] `quiz-fome-emocional` → `avaliacao-fome-emocional` (slug alternativo)
- [ ] `avaliacao-intolerancia` → `avaliacao-intolerancia` (slug idêntico)
- [ ] `avaliacao-perfil-metabolico` → `avaliacao-perfil-metabolico` (slug idêntico)
- [ ] `avaliacao-inicial` → `avaliacao-inicial` (slug idêntico)
- [ ] `desafio-21-dias` → `desafio-21-dias` (slug idêntico)
- [ ] `desafio-7-dias` → `desafio-7-dias` (slug idêntico)
- [ ] `diagnostico-eletrolitos` → `diagnostico-eletrolitos` (slug idêntico)
- [ ] `diagnostico-sintomas-intestinais` → `diagnostico-sintomas-intestinais` (slug idêntico)
- [ ] `pronto-emagrecer` → `pronto-emagrecer` (slug idêntico)
- [ ] `tipo-fome` → `tipo-fome` (slug idêntico)
- [ ] `quiz-bem-estar` → `quiz-bem-estar` (slug idêntico)
- [ ] `quiz-detox` → `quiz-detox` (slug idêntico)
- [ ] `quiz-alimentacao-saudavel` → `alimentacao-saudavel` (slug alternativo)
- [ ] `quiz-ganhos` → `ganhos-prosperidade` (slug alternativo)
- [ ] `quiz-potencial` → `potencial-crescimento` (slug alternativo)
- [ ] `quiz-proposito` → `proposito-equilibrio` (slug alternativo)
- [ ] `sindrome-metabolica` → `sindrome-metabolica` (slug idêntico)
- [ ] `retencao-liquidos` → `teste-retencao-liquidos` (slug alternativo)
- [ ] `conhece-seu-corpo` → `conhece-seu-corpo` (slug idêntico)
- [ ] `nutrido-vs-alimentado` → `nutrido-vs-alimentado` (slug idêntico)

#### **Quizzes com 6 perguntas (2 templates)**
- [ ] `quiz-energetico` → `quiz-energetico` (slug idêntico)
- [ ] `quiz-interativo` → `quiz-interativo` (slug idêntico)

#### **Quizzes com outro formato (2 templates)**
- [ ] `disciplinado-emocional` → `disciplinado-emocional` (slug idêntico)
- [ ] `alimentacao-rotina` → `alimentacao-rotina` (slug idêntico)

---

## 🎯 PRÓXIMOS PASSOS APÓS COPIAR

### **1. Criar Diagnósticos Nutri**

Templates que **PRECISAM** de diagnóstico Nutri específico:

1. ❌ `quiz-fome-emocional` / `avaliacao-fome-emocional`
2. ❌ `avaliacao-intolerancia`
3. ❌ `avaliacao-perfil-metabolico`
4. ❌ `diagnostico-eletrolitos`
5. ❌ `diagnostico-sintomas-intestinais`
6. ❌ `pronto-emagrecer`
7. ❌ `tipo-fome`
8. ❌ `quiz-alimentacao-saudavel` / `alimentacao-saudavel`
9. ❌ `quiz-ganhos` / `ganhos-prosperidade`
10. ❌ `quiz-potencial` / `potencial-crescimento`
11. ❌ `quiz-proposito` / `proposito-equilibrio`
12. ❌ `sindrome-metabolica`
13. ❌ `retencao-liquidos` / `teste-retencao-liquidos`
14. ❌ `conhece-seu-corpo`
15. ❌ `nutrido-vs-alimentado`
16. ❌ `disciplinado-emocional`
17. ❌ `alimentacao-rotina`

### **2. Templates que JÁ TÊM diagnóstico Nutri (apenas copiar content):**

1. ✅ `avaliacao-inicial` - Já tem diagnóstico
2. ✅ `desafio-7-dias` - Já tem diagnóstico
3. ✅ `desafio-21-dias` - Já tem diagnóstico
4. ✅ `quiz-bem-estar` - Já tem diagnóstico
5. ✅ `quiz-detox` - Já tem diagnóstico
6. ✅ `quiz-energetico` - Já tem diagnóstico
7. ✅ `quiz-interativo` - Já tem diagnóstico
8. ✅ `calculadora-agua` - Já tem diagnóstico
9. ✅ `calculadora-calorias` - Já tem diagnóstico
10. ✅ `calculadora-imc` - Já tem diagnóstico
11. ✅ `calculadora-proteina` - Já tem diagnóstico
12. ✅ `checklist-alimentar` - Já tem diagnóstico
13. ✅ `checklist-detox` - Já tem diagnóstico
14. ✅ `guia-hidratacao` - Já tem diagnóstico

---

## 📊 ESTATÍSTICAS ESPERADAS

Após executar o script:

- **Total copiado:** ~33 templates
- **Com slug idêntico:** ~23 templates
- **Com slug alternativo:** ~10 templates
- **Templates prontos (content + diagnóstico):** ~14 templates
- **Templates que precisam diagnóstico:** ~17 templates

---

## ⚠️ ATENÇÃO

1. **Backup obrigatório:** Sempre execute Query #3 antes de copiar
2. **Verificação prévia:** Sempre execute Query #1 antes de copiar
3. **Slugs alternativos:** O script já mapeia automaticamente
4. **Content será sobrescrito:** Se Nutri já tiver content, será substituído

---

## ✅ CONFIRMAÇÃO FINAL

Após executar todas as queries:

- [ ] Todos os templates Nutri têm `content` completo
- [ ] Verificação pós-atualização confirmou sucesso
- [ ] Backup criado e salvo
- [ ] Próximo passo: Criar diagnósticos Nutri para os 17 templates faltantes










