# 📋 GUIA: Duplicar Templates Preservando Diagnósticos Revisados

## 🎯 OBJETIVO

Duplicar os 31 templates faltantes de Wellness para Nutri, **preservando os diagnósticos já revisados** da área Nutri.

---

## 🔍 ENTENDENDO A ESTRUTURA

### **Onde estão os diagnósticos?**

**❌ NÃO estão no banco de dados:**
- O campo `content` (JSONB) no banco contém apenas a estrutura do template (perguntas, opções, etc.)
- **NÃO contém os textos de diagnóstico**

**✅ Estão no código TypeScript:**
- **Nutri**: `src/lib/diagnosticos-nutri.ts` (arquivo único - já revisado)
- **Wellness**: `src/lib/diagnostics/wellness/*.ts` (arquivos separados)

### **Como funcionam?**

A função `getDiagnostico()` busca os diagnósticos do código baseado em:
- `ferramentaId` (ex: 'quiz-interativo')
- `profissao` ('nutri' ou 'wellness')
- `resultadoId` (ex: 'metabolismoLento')

```typescript
// Exemplo: Buscar diagnóstico para Nutri
const diagnostico = getDiagnostico('quiz-interativo', 'nutri', 'metabolismoLento')
// ↑ Busca de: diagnosticos-nutri.ts → quizInterativoDiagnosticos.nutri.metabolismoLento
```

---

## 📝 FLUXO DE DUPLICAÇÃO

### **ETAPA 1: Duplicar Templates no Banco** ✅

**Script:** `scripts/duplicar-templates-wellness-para-nutri-SEGURO.sql`

**O que faz:**
- ✅ Cria registros na tabela `templates_nutrition` com `profession='nutri'`
- ✅ Copia todos os campos (name, type, content, etc.)
- ✅ **NÃO mexe nos diagnósticos** (eles estão no código)

**Resultado:**
- Templates aparecerão na área Nutri
- Mas os diagnósticos ainda precisam ser configurados no código

---

### **ETAPA 2: Verificar Diagnósticos Existentes** ✅

**Arquivo:** `src/lib/diagnosticos-nutri.ts`

**Templates que JÁ TÊM diagnósticos revisados na Nutri:**
- ✅ `quizInterativoDiagnosticos` → `nutri: { ... }`
- ✅ `quizBemEstarDiagnosticos` → `nutri: { ... }`
- ✅ `quizPerfilNutricionalDiagnosticos` → `nutri: { ... }`
- ✅ `quizDetoxDiagnosticos` → `nutri: { ... }`
- ✅ `quizEnergeticoDiagnosticos` → `nutri: { ... }`
- ✅ `calculadoraImcDiagnosticos` → `nutri: { ... }`
- ✅ `calculadoraProteinaDiagnosticos` → `nutri: { ... }`
- ✅ `calculadoraAguaDiagnosticos` → `nutri: { ... }`
- ✅ `calculadoraCaloriasDiagnosticos` → `nutri: { ... }`
- ✅ `checklistDetoxDiagnosticos` → `nutri: { ... }`
- ✅ `checklistAlimentarDiagnosticos` → `nutri: { ... }`
- ✅ E mais alguns...

**Templates que NÃO TÊM diagnósticos na Nutri:**
- ❌ Calculadora de Água (já tem, mas verificar)
- ❌ Calculadora de Calorias (já tem, mas verificar)
- ❌ Calculadora de IMC (já tem, mas verificar)
- ❌ Calculadora de Proteína (já tem, mas verificar)
- ❌ Checklist Detox (já tem, mas verificar)
- ❌ Checklist Alimentar (já tem, mas verificar)
- ❌ **23 Quizzes novos** que não existem em `diagnosticos-nutri.ts`

---

### **ETAPA 3: Adicionar Diagnósticos Faltantes** ⚠️

**Para templates que JÁ EXISTEM em `diagnosticos-nutri.ts`:**

✅ **NÃO FAZER NADA!** Os diagnósticos já revisados serão preservados automaticamente.

**Para templates NOVOS que não existem:**

1. **Copiar estrutura de Wellness:**
   ```typescript
   // De: src/lib/diagnostics/wellness/quiz-avaliacao-inicial.ts
   export const avaliacaoInicialDiagnosticos: DiagnosticosPorFerramenta = {
     wellness: { ... }
   }
   ```

2. **Adicionar versão Nutri em `diagnosticos-nutri.ts`:**
   ```typescript
   // Em: src/lib/diagnosticos-nutri.ts
   export const avaliacaoInicialDiagnosticos: DiagnosticosPorFerramenta = {
     nutri: {
       // Adaptar textos para linguagem de nutricionista
       // Manter estrutura, mas ajustar tom e foco
     },
     wellness: {
       // Manter diagnósticos de Wellness (se necessário)
     }
   }
   ```

3. **Atualizar função `getDiagnostico()`:**
   ```typescript
   case 'avaliacao-inicial':
     diagnosticos = avaliacaoInicialDiagnosticos
     break
   ```

---

## 🛡️ GARANTIAS DE SEGURANÇA

### **✅ O que está protegido:**

1. **Diagnósticos revisados da Nutri:**
   - Estão em `diagnosticos-nutri.ts`
   - **NÃO serão alterados** pelo script SQL
   - Continuarão funcionando normalmente

2. **Templates existentes:**
   - Script usa `NOT EXISTS` para evitar duplicatas
   - Templates que já existem na Nutri **não serão alterados**

3. **Estrutura do código:**
   - Função `getDiagnostico()` já suporta múltiplas profissões
   - Apenas precisamos adicionar novos casos no `switch`

---

## 📊 CHECKLIST DE EXECUÇÃO

### **Antes de executar:**

- [ ] Fazer backup do banco de dados
- [ ] Verificar quantos templates faltam: `scripts/comparar-templates-wellness-nutri.sql`
- [ ] Listar templates que serão duplicados

### **Executar:**

- [ ] Executar `scripts/duplicar-templates-wellness-para-nutri-SEGURO.sql` no Supabase
- [ ] Verificar quantos templates foram criados
- [ ] Confirmar que templates aparecem na área Nutri

### **Depois de executar:**

- [ ] Identificar quais templates novos precisam de diagnósticos
- [ ] Para cada template novo:
  - [ ] Copiar estrutura de Wellness
  - [ ] Adaptar textos para Nutri (linguagem de nutricionista)
  - [ ] Adicionar em `diagnosticos-nutri.ts`
  - [ ] Atualizar `getDiagnostico()`
- [ ] Testar templates na área Nutri
- [ ] Verificar que diagnósticos antigos continuam funcionando

---

## 🎯 EXEMPLO PRÁTICO

### **Template: "Avaliação Inicial"**

**1. Template já existe em Wellness:**
- ✅ Banco: `templates_nutrition` com `profession='wellness'`
- ✅ Diagnóstico: `src/lib/diagnostics/wellness/avaliacao-inicial.ts`

**2. Após executar script SQL:**
- ✅ Banco: Novo registro com `profession='nutri'` criado

**3. Adicionar diagnóstico Nutri:**

```typescript
// Em: src/lib/diagnosticos-nutri.ts

// Importar de Wellness (se necessário)
import { avaliacaoInicialDiagnosticos as avaliacaoInicialDiagnosticosWellness } from './diagnostics/wellness/avaliacao-inicial'

// Adicionar versão Nutri
export const avaliacaoInicialDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    resultado1: {
      diagnostico: '📋 DIAGNÓSTICO: ...',  // Adaptar para Nutri
      causaRaiz: '🔍 CAUSA RAIZ: ...',
      // ... (usar diagnósticos de Wellness como base, mas adaptar)
    },
    // ... outros resultados
  },
  // Opcional: manter Wellness também
  wellness: avaliacaoInicialDiagnosticosWellness.wellness
}

// Atualizar getDiagnostico()
case 'avaliacao-inicial':
case 'quiz-avaliacao-inicial':
  diagnosticos = avaliacaoInicialDiagnosticos
  break
```

---

## ⚠️ ATENÇÃO

1. **NÃO alterar diagnósticos existentes** em `diagnosticos-nutri.ts`
2. **NÃO remover** diagnósticos já revisados
3. **Sempre testar** após adicionar novos diagnósticos
4. **Manter consistência** na estrutura dos diagnósticos

---

## ✅ RESULTADO FINAL

Após completar todas as etapas:

- ✅ 38 templates na área Nutri (igual Wellness)
- ✅ Diagnósticos revisados preservados
- ✅ Novos diagnósticos adicionados
- ✅ Funcionamento completo na área Nutri

