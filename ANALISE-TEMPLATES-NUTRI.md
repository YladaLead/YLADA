# 📊 ANÁLISE: Templates Nutri - Status e Pendências

## 🎯 OBJETIVO
Verificar quais templates Nutri estão completos (com sequência de perguntas e diagnósticos) e quais precisam ser completados.

---

## ✅ DIAGNÓSTICOS DISPONÍVEIS (29 templates)

### **Quizzes (5)**
- ✅ `quiz-interativo` → `src/lib/diagnostics/nutri/quiz-interativo.ts`
- ✅ `quiz-bem-estar` → `src/lib/diagnostics/nutri/quiz-bem-estar.ts`
- ✅ `quiz-perfil-nutricional` → `src/lib/diagnostics/nutri/quiz-perfil-nutricional.ts`
- ✅ `quiz-detox` → `src/lib/diagnostics/nutri/quiz-detox.ts`
- ✅ `quiz-energetico` → `src/lib/diagnostics/nutri/quiz-energetico.ts`

### **Calculadoras (4)**
- ✅ `calculadora-imc` → `src/lib/diagnostics/nutri/calculadora-imc.ts`
- ✅ `calculadora-proteina` → `src/lib/diagnostics/nutri/calculadora-proteina.ts`
- ✅ `calculadora-agua` → `src/lib/diagnostics/nutri/calculadora-agua.ts`
- ✅ `calculadora-calorias` → `src/lib/diagnostics/nutri/calculadora-calorias.ts`

### **Checklists (2)**
- ✅ `checklist-alimentar` → `src/lib/diagnostics/nutri/checklist-alimentar.ts`
- ✅ `checklist-detox` → `src/lib/diagnostics/nutri/checklist-detox.ts`

### **Guias (3)**
- ✅ `guia-hidratacao` → `src/lib/diagnostics/nutri/guia-hidratacao.ts`
- ✅ `guia-nutraceutico` → `src/lib/diagnostics/nutri/guia-nutraceutico.ts`
- ✅ `guia-proteico` → `src/lib/diagnostics/nutri/guia-proteico.ts`

### **Desafios (2)**
- ✅ `desafio-7-dias` → `src/lib/diagnostics/nutri/desafio-7-dias.ts`
- ✅ `desafio-21-dias` → `src/lib/diagnostics/nutri/desafio-21-dias.ts`

### **Planilhas/Tabelas (5)**
- ✅ `tabela-comparativa` → `src/lib/diagnostics/nutri/tabela-comparativa.ts`
- ✅ `tabela-substituicoes` → `src/lib/diagnostics/nutri/tabela-substituicoes.ts`
- ✅ `tabela-sintomas` → `src/lib/diagnostics/nutri/tabela-sintomas.ts`
- ✅ `tabela-metas-semanais` → `src/lib/diagnostics/nutri/tabela-metas-semanais.ts`
- ✅ `plano-alimentar-base` → `src/lib/diagnostics/nutri/plano-alimentar-base.ts`

### **Outros (8)**
- ✅ `avaliacao-inicial` → `src/lib/diagnostics/nutri/avaliacao-inicial.ts`
- ✅ `cardapio-detox` → `src/lib/diagnostics/nutri/cardapio-detox.ts`
- ✅ `diario-alimentar` → `src/lib/diagnostics/nutri/diario-alimentar.ts`
- ✅ `formulario-recomendacao` → `src/lib/diagnostics/nutri/formulario-recomendacao.ts`
- ✅ `infografico-educativo` → `src/lib/diagnostics/nutri/infografico-educativo.ts`
- ✅ `mini-ebook` → `src/lib/diagnostics/nutri/mini-ebook.ts`
- ✅ `planner-refeicoes` → `src/lib/diagnostics/nutri/planner-refeicoes.ts`
- ✅ `rastreador-alimentar` → `src/lib/diagnostics/nutri/rastreador-alimentar.ts`
- ✅ `receitas` → `src/lib/diagnostics/nutri/receitas.ts`
- ✅ `simulador-resultados` → `src/lib/diagnostics/nutri/simulador-resultados.ts`
- ✅ `story-interativo` → `src/lib/diagnostics/nutri/story-interativo.ts`

---

## 🔍 VERIFICAÇÃO NECESSÁRIA NO BANCO

### **O que verificar:**

1. **Templates no banco (`templates_nutrition`):**
   - Quantos templates existem com `profession='nutri'` e `language='pt'`?
   - Quais têm `content` completo (sequência de perguntas)?
   - Quais têm `content` vazio ou incompleto?

2. **Estrutura do `content` JSONB:**
   - Para **quizzes**: deve ter `content.questions[]` com array de perguntas
   - Para **calculadoras**: deve ter `content.fields[]` com campos
   - Para **checklists**: deve ter `content.items[]` com itens
   - Cada pergunta/item deve ter estrutura completa

3. **Mapeamento slug → diagnóstico:**
   - Verificar se o `slug` do template no banco corresponde ao diagnóstico no código
   - Verificar se há templates no banco sem diagnóstico correspondente

---

## 📋 CHECKLIST DE VERIFICAÇÃO

### **Para cada template no banco, verificar:**

- [ ] **Tem `content` JSONB?**
  - [ ] `content` não é NULL
  - [ ] `content` não é `{}` (objeto vazio)
  - [ ] `content` não é `null` (string)

- [ ] **Tem sequência completa?**
  - [ ] Para quizzes: `content.questions[]` existe e tem perguntas
  - [ ] Para calculadoras: `content.fields[]` existe e tem campos
  - [ ] Para checklists: `content.items[]` existe e tem itens
  - [ ] Cada pergunta/item tem estrutura completa (pergunta, opções, etc.)

- [ ] **Tem diagnóstico mapeado?**
  - [ ] O `slug` do template corresponde a um diagnóstico em `diagnosticosNutri`
  - [ ] O diagnóstico existe em `src/lib/diagnostics/nutri/*.ts`
  - [ ] O diagnóstico tem conteúdo completo (6 seções)

- [ ] **Preview funciona?**
  - [ ] O `DynamicTemplatePreview` consegue renderizar o template
  - [ ] As perguntas aparecem sequencialmente
  - [ ] Os diagnósticos aparecem no final

---

## 🛠️ AÇÕES NECESSÁRIAS

### **1. Executar SQL de Verificação**
Execute o arquivo `verificar-templates-nutri.sql` no Supabase para obter:
- Lista completa de templates
- Status do `content` (completo/incompleto/vazio)
- Estrutura do `content` (questions/items/steps)

### **2. Completar `content` dos Templates**
Para templates sem `content` ou com `content` incompleto:
- Criar sequência de perguntas no formato JSONB
- Seguir estrutura padrão do `DynamicTemplatePreview`
- Garantir que todas as perguntas têm opções completas

### **3. Mapear Slugs**
- Verificar se todos os templates têm `slug` correto
- Garantir que o `slug` corresponde ao diagnóstico
- Adicionar aliases no `diagnosticosNutri` se necessário

### **4. Criar Diagnósticos Faltantes**
Se houver templates no banco sem diagnóstico:
- Criar arquivo em `src/lib/diagnostics/nutri/[slug].ts`
- Adicionar ao `diagnosticosNutri` em `src/lib/diagnosticos-nutri.ts`
- Seguir estrutura padrão (6 seções)

---

## 📝 PRÓXIMOS PASSOS

1. **Executar SQL** → Verificar templates no banco
2. **Comparar** → Templates no banco vs Diagnósticos disponíveis
3. **Identificar gaps** → O que está faltando
4. **Priorizar** → Quais templates completar primeiro
5. **Implementar** → Completar `content` e diagnósticos

---

## 🔗 ARQUIVOS RELACIONADOS

- **SQL de Verificação:** `verificar-templates-nutri.sql`
- **API de Templates:** `src/app/api/nutri/templates/route.ts`
- **Preview Component:** `src/components/shared/DynamicTemplatePreview.tsx`
- **Diagnósticos:** `src/lib/diagnosticos-nutri.ts`
- **Página de Templates:** `src/app/pt/nutri/ferramentas/templates/page.tsx`







