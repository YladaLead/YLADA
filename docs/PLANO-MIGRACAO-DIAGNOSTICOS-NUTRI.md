# 🔄 PLANO DE MIGRAÇÃO: DIAGNÓSTICOS NUTRI

**Data:** Hoje  
**Objetivo:** Migrar diagnósticos Nutri do arquivo único para estrutura modular (como Wellness) e integrar com código duplicado do Wellness

---

## 📊 SITUAÇÃO ATUAL

### **Estrutura Atual dos Diagnósticos Nutri**

```
src/lib/
└── diagnosticos-nutri.ts  (arquivo único ~1500 linhas)
    ├── quizInterativoDiagnosticos (nutri: ✅)
    ├── quizBemEstarDiagnosticos (nutri: ✅)
    ├── quizPerfilNutricionalDiagnosticos (nutri: ✅)
    ├── quizDetoxDiagnosticos (nutri: ✅)
    ├── quizEnergeticoDiagnosticos (nutri: ✅)
    ├── calculadoraImcDiagnosticos (nutri: ✅)
    ├── calculadoraProteinaDiagnosticos (nutri: ✅)
    ├── calculadoraAguaDiagnosticos (nutri: ✅)
    ├── calculadoraCaloriasDiagnosticos (nutri: ✅)
    ├── checklistDetoxDiagnosticos (nutri: ✅)
    ├── checklistAlimentarDiagnosticos (nutri: ✅) → JÁ TEM ARQUIVO MODULAR
    ├── desafio7DiasDiagnosticos (nutri: ✅)
    ├── desafio21DiasDiagnosticos (nutri: ✅)
    ├── guiaHidratacaoDiagnosticos (nutri: ✅)
    ├── miniEbookDiagnosticos (nutri: ✅)
    ├── guiaNutraceuticoDiagnosticos (nutri: ✅)
    ├── guiaProteicoDiagnosticos (nutri: ✅)
    ├── ... (outros diagnósticos Nutri específicos)
    └── getDiagnostico() → função helper que busca diagnósticos
```

**Problemas:**
- ❌ Arquivo único muito grande (difícil navegação)
- ❌ Mistura diagnósticos Nutri com imports de Wellness
- ❌ Estrutura diferente de Wellness (que está modularizada)
- ⚠️ Apenas `checklist-alimentar.ts` está modularizado

### **Estrutura Wellness (Referência)**

```
src/lib/diagnostics/wellness/
├── quiz-interativo.ts
├── quiz-bem-estar.ts
├── quiz-perfil-nutricional.ts
├── quiz-detox.ts
├── quiz-energetico.ts
├── calculadora-imc.ts
├── calculadora-proteina.ts
├── calculadora-agua.ts
├── calculadora-calorias.ts
├── checklist-detox.ts
├── checklist-alimentar.ts
├── desafio-7-dias.ts
├── desafio-21-dias.ts
├── guia-hidratacao.ts
└── ... (um arquivo por template)
```

**Vantagens:**
- ✅ Fácil navegação (um arquivo por template)
- ✅ Fácil manutenção
- ✅ Estrutura consistente
- ✅ Menos conflitos em merge

---

## 🎯 ESTRATÉGIA DE MIGRAÇÃO

### **FASE 1: Duplicar Estrutura Wellness para Nutri** ⚡ PRIORIDADE ALTA

**Objetivo:** Ter toda a estrutura atualizada do Wellness na área Nutri

#### **1.1. Duplicar APIs**
```
✅ /api/nutri/ferramentas/route.ts
✅ /api/nutri/quizzes/route.ts
✅ /api/nutri/portals/route.ts
✅ /api/nutri/check-short-code/route.ts
```

#### **1.2. Duplicar Páginas**
```
✅ /pt/nutri/ferramentas/page.tsx (atualizar para usar API real)
✅ /pt/nutri/ferramentas/[id]/editar/page.tsx
✅ /pt/nutri/quizzes/page.tsx
✅ /pt/nutri/portals/page.tsx
✅ /pt/nutri/portals/novo/page.tsx
✅ /pt/nutri/portals/[id]/editar/page.tsx
```

#### **1.3. Ajustar Cores e Rotas**
```
✅ Trocar verde (#10B981) → azul (#3B82F6)
✅ Trocar /wellness → /nutri
✅ Trocar profession='wellness' → profession='nutri'
```

**Tempo estimado:** 8-10 horas

---

### **FASE 2: Extrair Diagnósticos Nutri do Arquivo Único** ⚡ PRIORIDADE ALTA

**Objetivo:** Modularizar diagnósticos Nutri seguindo padrão Wellness

#### **2.1. Identificar Diagnósticos Nutri Específicos**

**Diagnósticos que JÁ EXISTEM em `diagnosticos-nutri.ts` com versão Nutri:**

1. ✅ `quizInterativoDiagnosticos` → `nutri.metabolismoLento`, `metabolismoEquilibrado`, `metabolismoAcelerado`
2. ✅ `quizBemEstarDiagnosticos` → `nutri.bemEstarBaixo`, `bemEstarModerado`, `bemEstarAlto`
3. ✅ `quizPerfilNutricionalDiagnosticos` → `nutri.absorcaoBaixa`, `absorcaoModerada`, `absorcaoOtimizada`
4. ✅ `quizDetoxDiagnosticos` → (verificar se tem versão Nutri)
5. ✅ `quizEnergeticoDiagnosticos` → (verificar se tem versão Nutri)
6. ✅ `calculadoraImcDiagnosticos` → (verificar se tem versão Nutri)
7. ✅ `calculadoraProteinaDiagnosticos` → (verificar se tem versão Nutri)
8. ✅ `calculadoraAguaDiagnosticos` → (verificar se tem versão Nutri)
9. ✅ `calculadoraCaloriasDiagnosticos` → (verificar se tem versão Nutri)
10. ✅ `checklistDetoxDiagnosticos` → (verificar se tem versão Nutri)
11. ✅ `checklistAlimentarDiagnosticos` → **JÁ TEM ARQUIVO MODULAR** (`src/lib/diagnostics/nutri/checklist-alimentar.ts`)
12. ✅ `desafio7DiasDiagnosticos` → (verificar se tem versão Nutri)
13. ✅ `desafio21DiasDiagnosticos` → (verificar se tem versão Nutri)
14. ✅ `guiaHidratacaoDiagnosticos` → (verificar se tem versão Nutri)
15. ✅ `miniEbookDiagnosticos` → (verificar se tem versão Nutri)
16. ✅ `guiaNutraceuticoDiagnosticos` → (verificar se tem versão Nutri)
17. ✅ `guiaProteicoDiagnosticos` → (verificar se tem versão Nutri)
18. ✅ ... (outros)

#### **2.2. Criar Arquivos Modulares para Cada Diagnóstico Nutri**

**Estrutura a criar:**
```
src/lib/diagnostics/nutri/
├── quiz-interativo.ts          ← Extrair de diagnosticos-nutri.ts
├── quiz-bem-estar.ts          ← Extrair de diagnosticos-nutri.ts
├── quiz-perfil-nutricional.ts ← Extrair de diagnosticos-nutri.ts
├── quiz-detox.ts              ← Extrair ou criar se não existir
├── quiz-energetico.ts         ← Extrair ou criar se não existir
├── calculadora-imc.ts        ← Extrair ou criar se não existir
├── calculadora-proteina.ts   ← Extrair ou criar se não existir
├── calculadora-agua.ts        ← Extrair ou criar se não existir
├── calculadora-calorias.ts   ← Extrair ou criar se não existir
├── checklist-detox.ts        ← Extrair ou criar se não existir
├── checklist-alimentar.ts    ← ✅ JÁ EXISTE
├── desafio-7-dias.ts         ← Extrair ou criar se não existir
├── desafio-21-dias.ts        ← Extrair ou criar se não existir
├── guia-hidratacao.ts        ← Extrair ou criar se não existir
├── mini-ebook.ts             ← Extrair ou criar se não existir
├── guia-nutraceutico.ts      ← Extrair ou criar se não existir
├── guia-proteico.ts          ← Extrair ou criar se não existir
└── ... (um arquivo por template)
```

**Formato de cada arquivo:**
```typescript
/**
 * DIAGNÓSTICOS: [Nome do Template] - ÁREA NUTRI
 * 
 * Foco em encaminhamento para nutricionista e consulta profissional
 */

import { DiagnosticosPorFerramenta } from '../types'

export const [nomeTemplate]Diagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    resultado1: {
      diagnostico: '📋 DIAGNÓSTICO: ...',
      causaRaiz: '🔍 CAUSA RAIZ: ...',
      acaoImediata: '⚡ AÇÃO IMEDIATA: ... (foco em consulta nutricional)',
      plano7Dias: '📅 PLANO 7 DIAS: ...',
      suplementacao: '💊 SUPLEMENTAÇÃO: ...',
      alimentacao: '🍎 ALIMENTAÇÃO: ...',
      proximoPasso: '🎯 PRÓXIMO PASSO: ... (CTA para agendar consulta)'
    },
    // ... outros resultados
  }
}
```

**Características dos Diagnósticos Nutri:**
- ✅ Foco em **encaminhamento para nutricionista**
- ✅ Linguagem mais técnica e profissional
- ✅ CTAs: "Agendar Consulta", "Falar com Nutricionista"
- ✅ Enfatiza avaliação profissional e acompanhamento
- ✅ Exemplo: "Busque avaliação nutricional para receber um protocolo seguro"

**Tempo estimado:** 4-6 horas (depende da quantidade de diagnósticos)

---

### **FASE 3: Atualizar Função Helper** ⚡ PRIORIDADE MÉDIA

**Objetivo:** Atualizar `getDiagnostico()` para buscar dos arquivos modulares

#### **3.1. Atualizar `src/lib/diagnosticos-nutri.ts`**

**Opção A: Manter arquivo único como wrapper (recomendado)**
```typescript
// Importar diagnósticos modulares
import { quizInterativoDiagnosticos } from './diagnostics/nutri/quiz-interativo'
import { quizBemEstarDiagnosticos } from './diagnostics/nutri/quiz-bem-estar'
// ... outros imports

// Manter função getDiagnostico() que busca dos módulos
export function getDiagnostico(
  ferramentaId: string,
  profissao: string,
  resultadoId: string
): DiagnosticoCompleto | null {
  // Buscar dos módulos modulares
  // ...
}
```

**Opção B: Remover arquivo único e usar apenas módulos**
- Mais limpo, mas requer atualizar todos os imports no código

**Recomendação:** Opção A (manter wrapper para compatibilidade)

**Tempo estimado:** 1-2 horas

---

### **FASE 4: Integrar com Código Duplicado** ⚡ PRIORIDADE MÉDIA

**Objetivo:** Garantir que código duplicado do Wellness use diagnósticos Nutri corretos

#### **4.1. Verificar Pontos de Integração**

**Onde os diagnósticos são usados:**
1. ✅ Páginas de templates (preview)
2. ✅ Páginas de ferramentas criadas (resultado)
3. ✅ API de templates
4. ✅ Função `getDiagnostico()`

#### **4.2. Garantir Filtro por Profession**

**Verificar se código duplicado:**
- ✅ Filtra por `profession='nutri'` ao buscar templates
- ✅ Passa `profession='nutri'` ao buscar diagnósticos
- ✅ Usa diagnósticos corretos baseado em `profession`

**Tempo estimado:** 1-2 horas

---

## 📋 CHECKLIST DE MIGRAÇÃO

### **FASE 1: Duplicar Estrutura**
- [ ] Duplicar todas as APIs do Wellness para Nutri
- [ ] Duplicar todas as páginas do Wellness para Nutri
- [ ] Ajustar cores (verde → azul)
- [ ] Ajustar rotas (/wellness → /nutri)
- [ ] Ajustar profession ('wellness' → 'nutri')
- [ ] Testar criação de links
- [ ] Testar criação de quizzes
- [ ] Testar criação de portais
- [ ] Testar short codes e QR codes

### **FASE 2: Modularizar Diagnósticos**
- [ ] Identificar todos os diagnósticos Nutri no arquivo único
- [ ] Criar arquivo modular para cada diagnóstico Nutri
- [ ] Extrair conteúdo do arquivo único para módulos
- [ ] Adaptar linguagem para foco em nutricionista (se necessário)
- [ ] Verificar se todos os templates têm diagnósticos Nutri
- [ ] Criar diagnósticos faltantes (usar Wellness como base e adaptar)

### **FASE 3: Atualizar Helper**
- [ ] Atualizar imports em `diagnosticos-nutri.ts`
- [ ] Atualizar função `getDiagnostico()` para buscar dos módulos
- [ ] Manter compatibilidade com código existente
- [ ] Testar busca de diagnósticos

### **FASE 4: Integração**
- [ ] Verificar se APIs filtram por profession corretamente
- [ ] Verificar se páginas passam profession corretamente
- [ ] Testar exibição de diagnósticos Nutri
- [ ] Testar exibição de diagnósticos Wellness (não deve aparecer em Nutri)
- [ ] Validar CTAs (Agendar Consulta vs Conversar com Especialista)

---

## 🔍 DIFERENÇAS: DIAGNÓSTICOS NUTRI vs WELLNESS

### **Linguagem**

**Wellness:**
- "Conversar com Especialista"
- "Produtos e suplementos Wellness"
- "Especialista em bem-estar"
- Linguagem mais acessível

**Nutri:**
- "Agendar Consulta"
- "Falar com Nutricionista"
- "Avaliação nutricional"
- "Protocolo seguro e adequado"
- Linguagem mais técnica e profissional

### **Foco**

**Wellness:**
- Bem-estar geral
- Produtos e suplementos
- Autocuidado

**Nutri:**
- Nutrição profissional
- Consulta e acompanhamento
- Avaliação completa
- Protocolo personalizado

### **Exemplos de Diferenças**

**Wellness:**
```
acaoImediata: '⚡ AÇÃO IMEDIATA: Busque um acompanhamento especializado urgente com um especialista em bem-estar...'
```

**Nutri:**
```
acaoImediata: '⚡ AÇÃO IMEDIATA: Busque avaliação nutricional para receber um protocolo seguro e adequado ao seu perfil. Evite auto-suplementação — cada organismo responde de forma única'
```

---

## 📚 ESTRUTURA FINAL ESPERADA

### **Arquivos Modulares Nutri**
```
src/lib/diagnostics/nutri/
├── quiz-interativo.ts
├── quiz-bem-estar.ts
├── quiz-perfil-nutricional.ts
├── quiz-detox.ts
├── quiz-energetico.ts
├── calculadora-imc.ts
├── calculadora-proteina.ts
├── calculadora-agua.ts
├── calculadora-calorias.ts
├── checklist-detox.ts
├── checklist-alimentar.ts (✅ já existe)
├── desafio-7-dias.ts
├── desafio-21-dias.ts
├── guia-hidratacao.ts
├── mini-ebook.ts
├── guia-nutraceutico.ts
├── guia-proteico.ts
└── ... (um arquivo por template)
```

### **Arquivo Wrapper (Compatibilidade)**
```
src/lib/diagnosticos-nutri.ts
├── Imports de todos os módulos
├── Função getDiagnostico() atualizada
└── Exportações para compatibilidade
```

### **Código Duplicado do Wellness**
```
src/app/api/nutri/...
src/app/pt/nutri/...
├── Usa profession='nutri'
├── Busca diagnósticos via getDiagnostico(..., 'nutri', ...)
└── Exibe diagnósticos Nutri corretos
```

---

## ✅ CONCLUSÃO

**Estratégia:**
1. ✅ Duplicar TODA a estrutura Wellness para Nutri (APIs, páginas, componentes)
2. ✅ Extrair diagnósticos Nutri do arquivo único para módulos
3. ✅ Manter foco em encaminhamento para nutricionista
4. ✅ Integrar diagnósticos modulares com código duplicado

**Resultado:**
- ✅ Estrutura Nutri atualizada (igual Wellness)
- ✅ Diagnósticos Nutri modularizados (fácil manutenção)
- ✅ Foco correto em nutricionista (diferente de Wellness)
- ✅ Código limpo e organizado

**Tempo Total Estimado:** 14-20 horas

---

**Última atualização:** Hoje  
**Versão:** 1.0.0



