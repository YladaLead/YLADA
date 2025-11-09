# 📋 PLANO COMPLETO: Duplicar Templates Wellness → Nutri

## 🎯 OBJETIVO

Duplicar os 31 templates faltantes de Wellness para Nutri, **preservando 100% dos diagnósticos já revisados** da área Nutri.

---

## ✅ ETAPA 1: Duplicar Templates no Banco (SEGURO)

### **Script SQL:**
📄 `scripts/duplicar-templates-wellness-para-nutri-SEGURO.sql`

### **O que faz:**
- ✅ Cria registros na tabela `templates_nutrition` com `profession='nutri'`
- ✅ Copia todos os campos (name, type, content, slug, etc.)
- ✅ **NÃO mexe nos diagnósticos** (eles estão no código TypeScript)
- ✅ Usa `NOT EXISTS` para evitar duplicatas

### **Como executar:**
1. Abrir Supabase SQL Editor
2. Copiar e colar o script
3. Executar
4. Verificar resultado (deve criar ~31 templates)

### **Resultado esperado:**
- ✅ 38 templates na área Nutri (igual Wellness)
- ✅ Templates aparecem na interface Nutri
- ⚠️ Alguns templates podem não ter diagnósticos ainda (próxima etapa)

---

## ✅ ETAPA 2: Verificar Diagnósticos Existentes

### **Arquivo:** `src/lib/diagnosticos-nutri.ts`

### **Diagnósticos que JÁ TÊM versão Nutri (PRESERVAR):**

#### **Quizzes (5):**
- ✅ `quizInterativoDiagnosticos` → `nutri: { ... }`
- ✅ `quizBemEstarDiagnosticos` → `nutri: { ... }`
- ✅ `quizPerfilNutricionalDiagnosticos` → `nutri: { ... }`
- ✅ `quizDetoxDiagnosticos` → `nutri: { ... }`
- ✅ `quizEnergeticoDiagnosticos` → `nutri: { ... }`

#### **Calculadoras (4):**
- ✅ `calculadoraImcDiagnosticos` → `nutri: { ... }`
- ✅ `calculadoraProteinaDiagnosticos` → `nutri: { ... }`
- ✅ `calculadoraAguaDiagnosticos` → `nutri: { ... }`
- ✅ `calculadoraCaloriasDiagnosticos` → `nutri: { ... }`

#### **Checklists (2):**
- ✅ `checklistDetoxDiagnosticos` → `nutri: { ... }`
- ✅ `checklistAlimentarDiagnosticos` → `nutri: { ... }`

#### **Outros (vários):**
- ✅ `avaliacaoInicialDiagnosticos` → `nutri: { ... }` ✅ **JÁ TEM!**
- ✅ `desafio7DiasDiagnosticos` → `nutri: { ... }`
- ✅ `desafio21DiasDiagnosticos` → `nutri: { ... }`
- ✅ `guiaHidratacaoDiagnosticos` → `nutri: { ... }`
- ✅ E mais ~20 outros...

**✅ TOTAL: ~32 diagnósticos já revisados e preservados!**

---

## ⚠️ ETAPA 3: Adicionar Diagnósticos Faltantes

### **Diagnósticos que PRECISAM ser adicionados:**

O arquivo `diagnosticos-nutri.ts` já importa de Wellness, mas alguns só têm versão `wellness`. Precisamos adicionar versão `nutri`:

#### **Quizzes que precisam de versão Nutri:**

1. ❌ **Avaliação Emocional** (`avaliacaoEmocionalDiagnosticos`)
   - Wellness: ✅ Existe
   - Nutri: ❌ Faltando (mas já importado)

2. ❌ **Intolerância** (`intoleranciaDiagnosticos`)
   - Wellness: ✅ Existe
   - Nutri: ❌ Faltando (mas já importado)

3. ❌ **Perfil Metabólico** (`perfilMetabolicoDiagnosticos`)
   - Wellness: ✅ Existe
   - Nutri: ❌ Faltando (mas já importado)

4. ❌ **Eletrólitos** (`eletrolitosDiagnosticos`)
   - Wellness: ✅ Existe
   - Nutri: ❌ Faltando (mas já importado)

5. ❌ **Sintomas Intestinais** (`sintomasIntestinaisDiagnosticos`)
   - Wellness: ✅ Existe
   - Nutri: ❌ Faltando (mas já importado)

6. ❌ **Pronto para Emagrecer** (`prontoEmagrecerDiagnosticos`)
   - Wellness: ✅ Existe
   - Nutri: ❌ Faltando (mas já importado)

7. ❌ **Tipo de Fome** (`tipoFomeDiagnosticos`)
   - Wellness: ✅ Existe
   - Nutri: ❌ Faltando (mas já importado)

8. ❌ **Alimentação Saudável** (`alimentacaoSaudavelDiagnosticos`)
   - Wellness: ✅ Existe
   - Nutri: ❌ Faltando (mas já importado)

9. ❌ **Síndrome Metabólica** (`sindromeMetabolicaDiagnosticos`)
   - Wellness: ✅ Existe
   - Nutri: ❌ Faltando (mas já importado)

10. ❌ **Retenção de Líquidos** (`retencaoLiquidosDiagnosticos`)
    - Wellness: ✅ Existe
    - Nutri: ❌ Faltando (mas já importado)

11. ❌ **Conhece seu Corpo** (`conheceSeuCorpoDiagnosticos`)
    - Wellness: ✅ Existe
    - Nutri: ❌ Faltando (mas já importado)

12. ❌ **Nutrido vs Alimentado** (`nutridoVsAlimentadoDiagnosticos`)
    - Wellness: ✅ Existe
    - Nutri: ❌ Faltando (mas já importado)

13. ❌ **Alimentação Rotina** (`alimentacaoRotinaDiagnosticos`)
    - Wellness: ✅ Existe
    - Nutri: ❌ Faltando (mas já importado)

14. ❌ **Ganhos e Prosperidade** (`ganhosProsperidadeDiagnosticos`)
    - Wellness: ✅ Existe
    - Nutri: ❌ Faltando (mas já importado)

15. ❌ **Potencial e Crescimento** (`potencialCrescimentoDiagnosticos`)
    - Wellness: ✅ Existe
    - Nutri: ❌ Faltando (mas já importado)

16. ❌ **Propósito e Equilíbrio** (`propositoEquilibrioDiagnosticos`)
    - Wellness: ✅ Existe
    - Nutri: ❌ Faltando (mas já importado)

---

## 📝 COMO ADICIONAR DIAGNÓSTICOS (SEM PERDER OS EXISTENTES)

### **Exemplo: Adicionar "Avaliação Emocional" para Nutri**

**1. O arquivo já importa de Wellness:**
```typescript
// Linha 4 do diagnosticos-nutri.ts
import { avaliacaoEmocionalDiagnosticos as avaliacaoEmocionalDiagnosticosWellness } from './diagnostics/wellness/avaliacao-emocional'
```

**2. Adicionar export com versão Nutri:**

```typescript
// Em: src/lib/diagnosticos-nutri.ts

export const avaliacaoEmocionalDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    // Copiar estrutura de Wellness e adaptar textos para Nutri
    emocional: {
      diagnostico: '📋 DIAGNÓSTICO: ...',  // Adaptar para linguagem de nutricionista
      causaRaiz: '🔍 CAUSA RAIZ: ...',
      acaoImediata: '⚡ AÇÃO IMEDIATA: ...',
      plano7Dias: '📅 PLANO 7 DIAS: ...',
      suplementacao: '💊 SUPLEMENTAÇÃO: ...',
      alimentacao: '🍎 ALIMENTAÇÃO: ...',
      proximoPasso: '🎯 PRÓXIMO PASSO: ...'
    },
    // ... outros resultados
  },
  // Opcional: manter Wellness também
  wellness: avaliacaoEmocionalDiagnosticosWellness.wellness
}
```

**3. Atualizar função `getDiagnostico()`:**

```typescript
case 'avaliacao-emocional':
case 'quiz-emocional':
  diagnosticos = avaliacaoEmocionalDiagnosticos
  break
```

**4. Estratégia de adaptação:**
- ✅ Manter estrutura idêntica
- ✅ Adaptar tom para linguagem de nutricionista
- ✅ Focar em aspectos nutricionais
- ✅ Manter profissionalismo e clareza

---

## 🛡️ GARANTIAS DE SEGURANÇA

### **✅ O que está 100% protegido:**

1. **Diagnósticos já revisados:**
   - Estão em `diagnosticos-nutri.ts` com chave `nutri: { ... }`
   - **NÃO serão alterados** pelo script SQL
   - **NÃO serão alterados** ao adicionar novos
   - Continuarão funcionando normalmente

2. **Templates existentes:**
   - Script usa `NOT EXISTS` para evitar duplicatas
   - Templates que já existem **não serão alterados**

3. **Estrutura do código:**
   - Função `getDiagnostico()` já suporta múltiplas profissões
   - Apenas adicionar novos casos no `switch`

---

## 📊 CHECKLIST FINAL

### **Antes:**
- [ ] Backup do banco de dados
- [ ] Verificar templates faltantes: `scripts/comparar-templates-wellness-nutri.sql`

### **Executar SQL:**
- [ ] Executar `scripts/duplicar-templates-wellness-para-nutri-SEGURO.sql`
- [ ] Verificar quantos templates foram criados
- [ ] Confirmar que templates aparecem na área Nutri

### **Adicionar Diagnósticos:**
- [ ] Para cada template novo sem diagnóstico Nutri:
  - [ ] Copiar estrutura de Wellness
  - [ ] Adaptar textos para Nutri
  - [ ] Adicionar em `diagnosticos-nutri.ts`
  - [ ] Atualizar `getDiagnostico()`
  - [ ] Testar na área Nutri

### **Validação:**
- [ ] Testar templates antigos (verificar que diagnósticos funcionam)
- [ ] Testar templates novos (verificar que diagnósticos aparecem)
- [ ] Verificar que não há erros no console
- [ ] Confirmar que todas as áreas funcionam

---

## ✅ RESULTADO FINAL ESPERADO

- ✅ 38 templates na área Nutri (igual Wellness)
- ✅ ~32 diagnósticos já revisados preservados
- ✅ ~16 diagnósticos novos adicionados
- ✅ Funcionamento completo na área Nutri
- ✅ Zero perda de trabalho já realizado

---

## 🎯 PRÓXIMOS PASSOS

1. **Executar script SQL** (duplicar templates no banco)
2. **Adicionar diagnósticos faltantes** (um por um, preservando os existentes)
3. **Testar cada template** na área Nutri
4. **Validar que tudo funciona** corretamente

**Tempo estimado:** 2-3 horas para adicionar todos os diagnósticos faltantes.

