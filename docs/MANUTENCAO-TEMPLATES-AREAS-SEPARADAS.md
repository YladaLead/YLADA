# 🔧 MANUTENÇÃO: Templates em Áreas Separadas (Wellness vs Nutri)

## 📋 SITUAÇÃO ATUAL

### **Como Funciona Hoje:**

1. **Templates no Banco:**
   - Cada template tem `profession='wellness'` ou `profession='nutri'`
   - Templates são independentes por área
   - Um template pode existir em Wellness mas não em Nutri (e vice-versa)

2. **Preview Hardcoded:**
   - Cada área tem seu próprio arquivo de preview
   - Wellness: `src/app/pt/wellness/templates/page.tsx`
   - Nutri: `src/app/pt/nutri/ferramentas/templates/page.tsx`
   - Preview é identificado por `template.id` ou `template.slug`

3. **Diagnósticos Hardcoded:**
   - Wellness: `src/lib/diagnostics/wellness/*.ts`
   - Nutri: `src/lib/diagnosticos-nutri.ts`

---

## ⚠️ PROBLEMA DE MANUTENÇÃO

### **Cenário 1: Adicionar Template Novo em Wellness**

**Passos necessários:**
1. ✅ Adicionar template no banco com `profession='wellness'`
2. ✅ Adicionar preview hardcoded em `wellness/templates/page.tsx`
3. ✅ Adicionar diagnóstico em `lib/diagnostics/wellness/`

**Resultado:**
- ✅ Template aparece em Wellness
- ❌ Template NÃO aparece em Nutri (correto, pois não foi adicionado lá)

---

### **Cenário 2: Adicionar Template Novo em Nutri**

**Passos necessários:**
1. ✅ Adicionar template no banco com `profession='nutri'`
2. ✅ Adicionar preview hardcoded em `nutri/ferramentas/templates/page.tsx`
3. ✅ Adicionar diagnóstico em `lib/diagnosticos-nutri.ts`

**Resultado:**
- ✅ Template aparece em Nutri
- ❌ Template NÃO aparece em Wellness (correto, pois não foi adicionado lá)

---

### **Cenário 3: Duplicar Template de Wellness para Nutri**

**Passos necessários:**
1. ✅ Executar SQL para duplicar template no banco (mudar `profession='nutri'`)
2. ✅ Adicionar preview hardcoded em `nutri/ferramentas/templates/page.tsx`
3. ✅ Verificar se diagnóstico já existe em `lib/diagnosticos-nutri.ts`
   - Se não existir, adicionar
   - Se existir, usar o existente

**Resultado:**
- ✅ Template aparece em ambas as áreas

---

## 🔍 COMO O PREVIEW FUNCIONA HOJE

### **Wellness:**
```typescript
// Carrega templates do banco
const templates = await fetch('/api/wellness/templates')

// Preview é identificado por ID/Slug
{templatePreviewAberto === 'quiz-interativo' && (
  <QuizInterativoPreview />
)}
```

### **Nutri:**
```typescript
// Carrega templates do banco
const templates = await fetch('/api/nutri/templates')

// Preview é identificado por ID/Slug
{templatePreviewSelecionado.id === 'quiz-interativo' && (
  <div>Preview do Quiz Interativo</div>
)}
```

**Problema:** Se um template existe em Wellness mas não em Nutri:
- ❌ Não aparece na lista de Nutri (correto)
- ❌ Mas se alguém tentar acessar diretamente, pode dar erro

---

## ✅ SOLUÇÕES PROPOSTAS

### **Opção 1: Preview Dinâmico Baseado em Content (RECOMENDADO)**

**Vantagens:**
- ✅ Preview gerado automaticamente do `content` JSONB
- ✅ Não precisa adicionar preview hardcoded para cada template
- ✅ Funciona para templates novos automaticamente

**Como funciona:**
```typescript
// Em vez de:
{template.id === 'quiz-interativo' && <QuizInterativoPreview />}

// Fazer:
<DynamicPreview 
  template={template} 
  content={template.content}
  diagnostico={getDiagnostico(template.slug, profession)}
/>
```

**Implementação:**
- Criar componente `DynamicPreview` que lê `content` JSONB
- Renderiza perguntas, opções, calculadoras baseado no `content`
- Usa diagnósticos hardcoded apenas para resultados

---

### **Opção 2: Fallback para Templates Sem Preview**

**Vantagens:**
- ✅ Não quebra se template não tiver preview específico
- ✅ Mostra preview genérico baseado no tipo

**Como funciona:**
```typescript
{templatePreviewSelecionado && (
  template.id === 'quiz-interativo' ? (
    <QuizInterativoPreview />
  ) : template.type === 'quiz' ? (
    <GenericQuizPreview template={template} />
  ) : (
    <GenericPreview template={template} />
  )
)}
```

---

### **Opção 3: Manter Como Está (Atual)**

**Vantagens:**
- ✅ Controle total sobre cada preview
- ✅ Preview customizado para cada template

**Desvantagens:**
- ❌ Precisa adicionar preview manualmente para cada template novo
- ❌ Duplicação de código entre Wellness e Nutri
- ❌ Manutenção mais trabalhosa

---

## 📝 RECOMENDAÇÃO

**Implementar Opção 1 (Preview Dinâmico) + Opção 2 (Fallback):**

1. **Criar componente `DynamicPreview`:**
   - Lê `content` JSONB do template
   - Renderiza automaticamente baseado no tipo (quiz, calculadora, planilha)
   - Usa diagnósticos hardcoded apenas para resultados

2. **Manter previews customizados para casos especiais:**
   - Templates com lógica muito específica podem ter preview customizado
   - Fallback para `DynamicPreview` se não tiver preview customizado

3. **Benefícios:**
   - ✅ Adicionar template novo = apenas criar no banco
   - ✅ Preview funciona automaticamente
   - ✅ Menos código duplicado
   - ✅ Manutenção mais fácil

---

## 🚀 PRÓXIMOS PASSOS

1. Criar componente `DynamicPreview`
2. Migrar previews existentes para usar `DynamicPreview`
3. Manter previews customizados apenas quando necessário
4. Documentar processo de adicionar template novo

