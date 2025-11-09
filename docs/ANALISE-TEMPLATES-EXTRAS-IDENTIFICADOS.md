# 🔍 ANÁLISE: Templates Extras Identificados

## 📊 SITUAÇÃO ATUAL

**Total:** 39 templates ativos (esperado: 35)
- **Calculadoras:** 4 ✅ (correto)
- **Planilhas:** 5 ⚠️ (esperado: 2)
- **Quizzes:** 30 ⚠️ (esperado: 24)

---

## 🔴 PROBLEMAS IDENTIFICADOS

### **1. TIPOS INCORRETOS (3 templates):**

#### **Planilhas que deveriam ser Quizzes:**
1. ❌ **"Desafio 21 Dias"** → Tipo: `planilha` (deveria ser `quiz`)
2. ❌ **"Desafio 7 Dias"** → Tipo: `planilha` (deveria ser `quiz`)
3. ⚠️ **"Guia de Hidratação"** → Tipo: `planilha` (pode estar correto se for guia, mas já migramos como quiz)

**Ação:** Corrigir tipos no banco (script criado)

---

### **2. DUPLICATAS/NOMES DIFERENTES (6 quizzes extras):**

#### **Possíveis Duplicatas Identificadas:**

1. **Quiz Bem-Estar (3 versões):**
   - ✅ "Quiz de Bem-Estar" (correto)
   - ❌ "Descubra seu Perfil de Bem-Estar" (duplicata?)
   - ❌ "Quiz: Perfil de Bem-Estar" (duplicata?)

2. **Quiz Detox (2 versões):**
   - ✅ "Quiz Detox" (correto)
   - ❌ "Seu corpo está pedindo Detox?" (duplicata?)

3. **Quiz Interativo (1 versão extra):**
   - ✅ "Quiz Interativo" (correto)
   - ❌ "Diagnóstico do Tipo de Metabolismo" (duplicata?)

4. **Quiz Energético (1 versão extra):**
   - ✅ "Quiz Energético" (correto)
   - ❌ "Avaliação do Sono e Energia" (duplicata?)

**Total de duplicatas possíveis:** 6 quizzes

---

## 🔧 CORREÇÕES NECESSÁRIAS

### **Script SQL Criado:**
`scripts/corrigir-tipos-templates-wellness.sql`

**O que faz:**
1. ✅ Corrige "Desafio 21 Dias" e "Desafio 7 Dias" de `planilha` para `quiz`
2. ✅ Identifica possíveis duplicatas de quizzes
3. ✅ Mostra contagem após correção

---

## 📋 PRÓXIMOS PASSOS

### **1. Corrigir Tipos:**
```sql
-- Executar: scripts/corrigir-tipos-templates-wellness.sql
```
Isso vai corrigir os 2 Desafios e reduzir planilhas de 5 para 3.

### **2. Verificar Duplicatas:**
Após executar o script, verificar quais são realmente duplicatas e:
- **Opção A:** Desativar as duplicatas (manter apenas 1 versão)
- **Opção B:** Remover as duplicatas do banco
- **Opção C:** Se não forem duplicatas, manter todas

### **3. Resultado Esperado Após Correções:**
- **Calculadoras:** 4 ✅
- **Planilhas:** 3 (Checklist Alimentar, Checklist Detox, Guia de Hidratação)
- **Quizzes:** 28 (24 esperados + 4 que podem ser duplicatas)

**Total:** 35 templates (se removermos as 4 duplicatas)

---

**Última atualização:** 2025-01-XX


