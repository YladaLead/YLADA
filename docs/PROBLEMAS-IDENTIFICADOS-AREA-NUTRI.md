# 🔍 PROBLEMAS IDENTIFICADOS NA ÁREA NUTRI

## 📋 LISTA COMPLETA DE AJUSTES NECESSÁRIOS

### 1. ❌ **PONTUAÇÃO FALTANDO NOS DIAGNÓSTICOS**
   - **Problema:** As opções "DIAGNÓSTICO" e "CAUSA RAIZ" estão sem ponto final no término da frase
   - **Localização:** Todos os diagnósticos que exibem essas seções
   - **Exemplo:** 
     - ❌ `"diagnostico": "📋 DIAGNÓSTICO: Seu metabolismo está..."` (sem ponto final)
     - ✅ `"diagnostico": "📋 DIAGNÓSTICO: Seu metabolismo está...."` (com ponto final)

---

### 2. ❌ **ERRO DE DIGITAÇÃO: "Quase nunea" → "Quase nunca"**
   - **Problema:** Erro de digitação na questão 5 do Quiz Interativo
   - **Localização:** Template Quiz Interativo - Questão sobre atividade física
   - **Atual:** `"(A) Quase nunea Não pratico"`
   - **Correto:** `"(A) Quase nunca Não pratico"`

---

### 3. ❌ **TEXTO DUPLICADO/ERRADO: "Quanta Qual a quantidade de"**
   - **Problema:** Texto duplicado/errado na questão 3 do Quiz Interativo
   - **Localização:** Template Quiz Interativo - Questão sobre água
   - **Atual:** `"💧 3. Quanta Qual a quantidade de água você costuma beber por dia?"`
   - **Correto:** `"💧 3. Qual a quantidade de água você costuma beber por dia?"`

---

### 4. ❌ **OPÇÕES COM TEXTO RISCADO/CORRIGIDO**
   - **Problema:** Questão 3 do Quiz Interativo tem opções com texto duplicado/riscado
   - **Localização:** Template Quiz Interativo - Questão sobre água
   - **Opções atuais (com texto riscado):**
     - `(A) "Quase nenhuma Mais ou menos 1 litro"` (riscado: "Quase nenhuma")
     - `(B) "Mais ou menos 1 litro De 1 a 1,5 litros"` (riscado: "Mais ou menos 1 litro")
     - `(C) "Sempre carrego minha garrafinha-Acima de 2 litros"` (riscado: "Sempre carrego minha garrafinha")
   - **Opções corretas:**
     - `(A) "Quase nenhuma"`
     - `(B) "Mais ou menos 1 litro"`
     - `(C) "Acima de 2 litros"` (ou manter "Sempre carrego minha garrafinha" se for o texto desejado)

---

### 5. ❌ **ERRO DE DIGITAÇÃO: "tóxico moderade" → "moderado"**
   - **Problema:** Erro de digitação no Quiz Detox
   - **Localização:** Diagnóstico do Quiz Detox
   - **Atual:** `"Seu corpo mostra sinais de acúmulo tóxico moderade moderado de toxicinas"`
   - **Correto:** `"Seu corpo mostra sinais de acúmulo tóxico moderado de toxinas"` (também corrigir "toxicinas" → "toxinas")

---

### 6. ❌ **TEXTO GARBLED: "tásdoo moderade moderado de todolnaa"**
   - **Problema:** Texto completamente corrompido no Quiz Detox
   - **Localização:** Seção de diagnóstico do Quiz Detox
   - **Atual:** Texto ilegível `"tásdoo moderade moderado de todolnaa."`
   - **Correto:** Deve ser corrigido para o texto correto do diagnóstico

---

### 7. ⚠️ **FALTANDO ACENTOS OU Ç NOS RESULTADOS DOS TEMPLATES**
   - **Problema:** Acentos e caracteres especiais (ç) estão faltando nos resultados dos templates
   - **Localização:** Todos os templates que exibem resultados/diagnósticos
   - **Exemplos de problemas:**
     - `"diagnostico"` → `"diagnóstico"`
     - `"causa"` → `"causa"` (se deveria ter acento)
     - `"acao"` → `"ação"`
     - `"proximo"` → `"próximo"`
   - **Ação:** Verificar todos os arquivos de diagnósticos e garantir que acentos e ç estejam corretos

---

### 8. 📝 **TEMPLATES FALTANDO (Marcados como "Não tem template")**
   - **Problema:** Alguns templates estão listados mas não têm template implementado
   - **Localização:** Lista de templates da área Nutri
   - **Templates faltando:**
     - ❌ "Descubra seu Perfil de Bem-Estar" (Não tem template)
     - ❌ "Diagnóstico de Parasitose" (Não tem template)

---

## 🎯 RESUMO POR PRIORIDADE

### **ALTA PRIORIDADE (Críticos - Afetam exibição):**
1. ✅ Pontuação faltando nos diagnósticos (DIAGNÓSTICO e CAUSA RAIZ)
2. ✅ Acentos e ç faltando nos resultados
3. ✅ Texto garbled no Quiz Detox
4. ✅ Erro "tóxico moderade" → "moderado"

### **MÉDIA PRIORIDADE (Erros de digitação):**
5. ✅ "Quase nunea" → "Quase nunca"
6. ✅ "Quanta Qual" → "Qual"
7. ✅ Opções com texto riscado/duplicado

### **BAIXA PRIORIDADE (Funcionalidade):**
8. ⚠️ Templates faltando (requer criação de novos templates)

---

## 📂 ARQUIVOS QUE PRECISAM SER CORRIGIDOS

1. **`src/lib/diagnostics/nutri/quiz-interativo.ts`** - Diagnósticos do Quiz Interativo
2. **`src/lib/diagnostics/nutri/quiz-detox.ts`** - Diagnósticos do Quiz Detox
3. **`src/lib/diagnostics/nutri/*.ts`** - Todos os arquivos de diagnósticos (verificar acentos)
4. **Banco de dados `templates_nutrition`** - Content do Quiz Interativo (questões)
5. **Banco de dados `templates_nutrition`** - Content do Quiz Detox (se houver questões)

---

## ✅ PRÓXIMOS PASSOS

1. Corrigir pontuação em todos os diagnósticos
2. Corrigir acentos e ç em todos os diagnósticos
3. Corrigir erros de digitação no Quiz Interativo
4. Corrigir texto garbled no Quiz Detox
5. Verificar e corrigir content dos templates no banco de dados

