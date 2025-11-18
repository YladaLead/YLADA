# 🔍 COMPARAÇÃO: PREVIEW TEMPLATES - WELLNESS vs NUTRI

## 📊 RESUMO EXECUTIVO

### **ÁREA WELLNESS:**
- ✅ Usa **componente dinâmico** `DynamicTemplatePreview` para a maioria dos templates
- ✅ Tem **componentes específicos** para alguns templates (lazy loaded)
- ✅ Preview é gerado automaticamente do `content` JSONB do Supabase
- ✅ Diagnósticos vêm de arquivos modulares (`src/lib/diagnostics/wellness/*.ts`)

### **ÁREA NUTRI:**
- ❌ Usa **previews hardcoded** para cada template específico
- ❌ Cada template tem seu próprio código de preview na página
- ❌ Preview não é dinâmico (precisa adicionar código para cada template)
- ✅ Diagnósticos vêm do arquivo único (`src/lib/diagnosticos-nutri.ts`)

---

## 🔄 PROCESSO WELLNESS (Dinâmico)

### **1. Carrega Templates:**
```typescript
// Busca do Supabase via API
const response = await fetch('/api/wellness/templates')
const templates = data.templates // 31 templates
```

### **2. Mostra Preview:**
```typescript
// Usa DynamicTemplatePreview (componente genérico)
<DynamicTemplatePreview
  template={template}
  profession="wellness"
  content={template.content} // JSONB do Supabase
/>
```

### **3. Como Funciona:**
- ✅ Lê `content` JSONB do template
- ✅ Renderiza perguntas automaticamente
- ✅ Busca diagnósticos via `getDiagnostico(template.slug, 'wellness')`
- ✅ Mostra resultados com diagnósticos

**Vantagens:**
- ✅ Funciona para qualquer template novo automaticamente
- ✅ Não precisa adicionar código para cada template
- ✅ Preview sempre atualizado com o `content` do banco

---

## 🔄 PROCESSO NUTRI (Hardcoded)

### **1. Carrega Templates:**
```typescript
// Busca do Supabase via API
const response = await fetch('/api/nutri/templates')
const templates = data.templates // 37 templates
```

### **2. Mostra Preview:**
```typescript
// Preview hardcoded para cada template
{templatePreviewSelecionado.id === 'diagnostico-eletritos' && (
  <div>Preview específico do Eletrólitos</div>
)}
{templatePreviewSelecionado.id === 'diagnostico-perfil-metabolico' && (
  <div>Preview específico do Perfil Metabólico</div>
)}
// ... e assim por diante para cada template
```

### **3. Como Funciona:**
- ❌ Verifica `id` do template hardcoded
- ❌ Renderiza preview específico para cada template
- ✅ Busca diagnósticos diretamente do import: `calculadoraAguaDiagnosticos.nutri.baixaHidratacao`
- ✅ Mostra resultados com diagnósticos

**Desvantagens:**
- ❌ Precisa adicionar código para cada template novo
- ❌ Preview não atualiza automaticamente se `content` mudar
- ❌ Muito código repetitivo (6449 linhas!)

---

## 📊 COMPARAÇÃO DETALHADA

| Aspecto | Wellness | Nutri |
|---------|---------|-------|
| **Componente Preview** | `DynamicTemplatePreview` (genérico) | Previews hardcoded (específicos) |
| **Linhas de Código** | ~3097 linhas | ~6449 linhas |
| **Templates com Preview** | Todos (dinâmico) | Apenas alguns (hardcoded) |
| **Manutenção** | Fácil (automático) | Difícil (manual) |
| **Novos Templates** | Funciona automaticamente | Precisa adicionar código |
| **Diagnósticos** | Arquivos modulares | Arquivo único |
| **Atualização** | Automática (do `content`) | Manual (código) |

---

## ✅ CONCLUSÃO

### **WELLNESS:**
- ✅ Processo **dinâmico e automático**
- ✅ Preview gerado do `content` JSONB
- ✅ Funciona para todos os templates
- ✅ Fácil manutenção

### **NUTRI:**
- ❌ Processo **hardcoded e manual**
- ❌ Preview específico para cada template
- ❌ Não funciona para todos os templates (só alguns têm)
- ❌ Difícil manutenção

---

## 🎯 RECOMENDAÇÃO

**MIGRAR NUTRI PARA USAR `DynamicTemplatePreview`** (como Wellness)

**Vantagens:**
- ✅ Preview automático para todos os 37 templates
- ✅ Reduz código de ~6449 para ~500 linhas
- ✅ Manutenção muito mais fácil
- ✅ Preview sempre atualizado com `content` do banco
- ✅ Mesmo processo que Wellness (consistência)

**Trabalho necessário:**
- Substituir previews hardcoded por `DynamicTemplatePreview`
- Garantir que `getDiagnostico()` mapeia todos os templates
- Testar previews de todos os templates

**Tempo estimado:** 2-3 horas



