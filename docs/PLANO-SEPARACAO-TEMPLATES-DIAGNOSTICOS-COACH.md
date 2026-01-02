# 🔒 PLANO: SEPARAÇÃO TOTAL - TEMPLATES E DIAGNÓSTICOS COACH

**Data:** 2025-01-21  
**Objetivo:** Garantir que Templates e Diagnósticos do Coach são TOTALMENTE SEPARADOS e não confundidos com Nutri

---

## 🎯 PRINCÍPIO FUNDAMENTAL

> **"Templates e Diagnósticos do Coach são DO COACH. Não podem ser confundidos."**

### Regras:
1. ✅ Templates do Coach no banco: `profession='coach'` OU tabela `coach_templates_nutrition`
2. ✅ Diagnósticos do Coach no código: `src/lib/diagnostics/coach/*.ts`
3. ❌ NUNCA usar diagnósticos de Nutri no Coach
4. ❌ NUNCA usar templates de Nutri no Coach
5. ❌ NUNCA ter pasta `nutri/` dentro de `diagnostics/coach/`

---

## 🔍 VERIFICAÇÕES NECESSÁRIAS

### 1. Verificar Estrutura de Pastas

#### ✅ Estrutura CORRETA:
```
src/lib/diagnostics/
├── coach/
│   ├── alimentacao-rotina.ts
│   ├── checklist-alimentar.ts
│   ├── quiz-interativo.ts
│   └── ... (todos os diagnósticos do Coach)
└── nutri/
    ├── checklist-alimentar.ts
    ├── quiz-interativo.ts
    └── ... (todos os diagnósticos do Nutri)
```

#### ❌ Estrutura INCORRETA (encontrada):
```
src/lib/diagnostics/
└── coach/
    ├── alimentacao-rotina.ts
    ├── checklist-alimentar.ts
    └── nutri/  ← ❌ PROBLEMA! Pasta nutri dentro de coach
        ├── checklist-alimentar.ts
        └── ...
```

**Ação:** Remover completamente `src/lib/diagnostics/coach/nutri/`

---

### 2. Verificar Arquivo `diagnosticos-coach.ts`

**Arquivo:** `src/lib/diagnosticos-coach.ts`

**Verificar:**
- [ ] Todos os imports vêm de `./diagnostics/coach/*`
- [ ] Nenhum import de `./diagnostics/nutri/*`
- [ ] Nenhum import de `./diagnostics/coach/nutri/*`
- [ ] Função `getDiagnostico()` retorna apenas diagnósticos do Coach quando `profissao='coach'`

**Exemplo CORRETO:**
```typescript
import { checklistAlimentarDiagnosticos } from './diagnostics/coach/checklist-alimentar'
import { quizInterativoDiagnosticos } from './diagnostics/coach/quiz-interativo'
```

**Exemplo INCORRETO:**
```typescript
import { checklistAlimentarDiagnosticos } from './diagnostics/nutri/checklist-alimentar' // ❌
import { checklistAlimentarDiagnosticos } from './diagnostics/coach/nutri/checklist-alimentar' // ❌
```

---

### 3. Verificar API de Templates

**Arquivo:** `src/app/api/coach/templates/route.ts`

**Verificar:**
- [ ] Filtra apenas `profession='coach'` OU usa tabela `coach_templates_nutrition`
- [ ] NÃO retorna templates com `profession='nutri'`
- [ ] NÃO retorna templates sem `profession` definido

**Código CORRETO:**
```typescript
const { data } = await supabaseAdmin
  .from('coach_templates_nutrition')
  .select('*')
  .eq('profession', 'coach') // ✅ Filtra apenas Coach
  .eq('is_active', true)
```

**Código INCORRETO:**
```typescript
const { data } = await supabaseAdmin
  .from('templates_nutrition')
  .select('*')
  .eq('is_active', true)
  // ❌ Sem filtro de profession - pode retornar templates de Nutri!
```

---

### 4. Verificar Função getDiagnostico

**Arquivo:** `src/lib/diagnosticos-coach.ts`

**Verificar:**
- [ ] Quando `profissao='coach'`, retorna apenas diagnósticos do Coach
- [ ] NÃO faz fallback para diagnósticos de Nutri
- [ ] Retorna `null` se não encontrar, em vez de buscar em Nutri

**Código CORRETO:**
```typescript
export function getDiagnostico(
  ferramentaId: string,
  profissao: string,
  resultadoId: string
): DiagnosticoCompleto | null {
  if (profissao !== 'coach') {
    return null // ✅ Não retorna diagnósticos de Coach para outras áreas
  }
  
  const diagnosticos = diagnosticosCoach[ferramentaId]
  if (!diagnosticos || !diagnosticos['coach'] || !diagnosticos['coach'][resultadoId]) {
    return null // ✅ Retorna null se não encontrar, NÃO busca em Nutri
  }
  
  return diagnosticos['coach'][resultadoId] // ✅ Retorna apenas do Coach
}
```

**Código INCORRETO:**
```typescript
export function getDiagnostico(...) {
  // ...
  if (!diagnosticos['coach'][resultadoId]) {
    // ❌ NUNCA fazer fallback para Nutri
    return getDiagnosticoNutri(...) // ❌ ERRADO!
  }
}
```

---

### 5. Verificar Uso nos Componentes

**Arquivos a verificar:**
- `src/components/shared/DynamicTemplatePreview.tsx`
- `src/app/pt/coach/[user-slug]/[tool-slug]/page.tsx`
- `src/app/pt/c/formularios/recomendacao/page.tsx`

**Verificar:**
- [ ] Usam `getDiagnostico` de `@/lib/diagnosticos-coach` quando área é Coach
- [ ] NÃO usam `getDiagnostico` de `@/lib/diagnosticos-nutri`
- [ ] Passam `profissao='coach'` corretamente

---

## 📋 CHECKLIST DE EXECUÇÃO

### Passo 1: Limpar Estrutura de Pastas
- [ ] Listar conteúdo de `src/lib/diagnostics/coach/nutri/`
- [ ] Verificar se arquivos são duplicados ou diferentes
- [ ] Se duplicados: remover pasta inteira
- [ ] Se diferentes: mover para local correto e remover pasta

### Passo 2: Verificar Imports
- [ ] Verificar `src/lib/diagnosticos-coach.ts`
- [ ] Garantir que todos os imports são de `./diagnostics/coach/*`
- [ ] Remover qualquer import de `./diagnostics/nutri/*` ou `./diagnostics/coach/nutri/*`

### Passo 3: Verificar API de Templates
- [ ] Verificar `src/app/api/coach/templates/route.ts`
- [ ] Garantir filtro `profession='coach'` ou uso de `coach_templates_nutrition`
- [ ] Testar que não retorna templates de Nutri

### Passo 4: Verificar Função getDiagnostico
- [ ] Verificar `src/lib/diagnosticos-coach.ts`
- [ ] Garantir que retorna apenas diagnósticos do Coach
- [ ] Garantir que não faz fallback para Nutri
- [ ] Testar com várias ferramentas

### Passo 5: Verificar Componentes
- [ ] Verificar todos os componentes que usam diagnósticos
- [ ] Garantir que usam `diagnosticos-coach` quando área é Coach
- [ ] Garantir que passam `profissao='coach'` corretamente

### Passo 6: Testes
- [ ] Testar criação de ferramenta Coach
- [ ] Testar preview de ferramenta Coach
- [ ] Testar diagnóstico de ferramenta Coach
- [ ] Verificar que não aparece diagnóstico de Nutri
- [ ] Verificar que templates retornados são apenas do Coach

---

## 🧪 TESTES DE VALIDAÇÃO

### Teste 1: Templates
```bash
# Fazer requisição
GET /api/coach/templates

# Verificar resposta
- Todos os templates têm profession='coach'
- Nenhum template tem profession='nutri'
- Nenhum template tem profession=null
```

### Teste 2: Diagnósticos
```typescript
// Testar função
const diagnostico = getDiagnostico('quiz-interativo', 'coach', 'metabolismoLento')

// Verificar
- diagnostico não é null
- diagnostico vem de diagnosticos-coach.ts
- diagnostico não vem de diagnosticos-nutri.ts
```

### Teste 3: Preview de Ferramenta
```
1. Criar ferramenta Coach
2. Abrir preview
3. Preencher formulário
4. Ver diagnóstico

Verificar:
- Diagnóstico é específico do Coach
- Não aparece texto de Nutri
- Cores são do Coach (roxo)
```

---

## ✅ CRITÉRIOS DE SUCESSO

- ✅ Pasta `src/lib/diagnostics/coach/nutri/` não existe
- ✅ Todos os imports em `diagnosticos-coach.ts` são de `./diagnostics/coach/*`
- ✅ API `/api/coach/templates` retorna apenas templates com `profession='coach'`
- ✅ Função `getDiagnostico('...', 'coach', '...')` retorna apenas diagnósticos do Coach
- ✅ Nenhum componente usa diagnósticos de Nutri quando área é Coach
- ✅ Testes passam 100%

---

**Documento criado em:** 2025-01-21  
**Última atualização:** 2025-01-21

