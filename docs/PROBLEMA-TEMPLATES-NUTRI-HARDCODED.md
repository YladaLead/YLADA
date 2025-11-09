# 🔍 PROBLEMA IDENTIFICADO: Templates Nutri Hardcoded

## ⚠️ SITUAÇÃO ATUAL

### **Página Nutri (`src/app/pt/nutri/ferramentas/templates/page.tsx`):**
- ❌ Templates estão **hardcoded** (fixos no código, linhas 47-93)
- ✅ Diagnósticos funcionam (estão no código TypeScript)
- ❌ **NÃO carrega do banco de dados**

### **Página Wellness (`src/app/pt/wellness/templates/page.tsx`):**
- ✅ Templates carregam do banco via API `/api/wellness/templates`
- ✅ Diagnósticos funcionam (estão no código TypeScript)
- ✅ **Sincronizado com banco de dados**

---

## 🎯 POR QUE FUNCIONA MAS NÃO ESTÁ NO BANCO?

**Resposta:** Porque está **hardcoded** no código!

```typescript
// Página Nutri - LINHA 47
const templates = [
  { id: 'quiz-interativo', nome: 'Quiz Interativo', ... },
  { id: 'quiz-bem-estar', nome: 'Quiz de Bem-Estar', ... },
  // ... 38 templates hardcoded
]
```

**Consequências:**
- ✅ Templates aparecem na interface
- ✅ Previews funcionam
- ✅ Diagnósticos funcionam (buscam do código TypeScript)
- ❌ Mas **não estão no banco** (por isso a comparação mostra apenas 8)

---

## ✅ SOLUÇÃO

### **ETAPA 1: Criar API Nutri** ✅ FEITO
- ✅ Criado: `src/app/api/nutri/templates/route.ts`
- ✅ Similar à API Wellness
- ✅ Busca templates com `profession='nutri'`

### **ETAPA 2: Atualizar Página Nutri**
- ⚠️ **PRECISA FAZER:** Atualizar `src/app/pt/nutri/ferramentas/templates/page.tsx`
- ⚠️ Remover templates hardcoded
- ⚠️ Adicionar `useEffect` para carregar do banco (como Wellness faz)

### **ETAPA 3: Executar Script SQL**
- ⚠️ **PRECISA FAZER:** Executar `scripts/duplicar-templates-wellness-para-nutri-SEGURO.sql`
- ⚠️ Sincronizar templates no banco

---

## 📋 PRÓXIMOS PASSOS

1. ✅ **API Nutri criada** (`/api/nutri/templates`)
2. ⚠️ **Atualizar página Nutri** para carregar do banco
3. ⚠️ **Executar script SQL** para duplicar templates
4. ✅ **Validar** que tudo funciona

---

## 🔄 FLUXO CORRETO (Após correção)

```
1. Página Nutri carrega
   ↓
2. useEffect() → fetch('/api/nutri/templates')
   ↓
3. API busca do banco: WHERE profession='nutri'
   ↓
4. Retorna templates do banco
   ↓
5. Página exibe templates
   ↓
6. Usuário clica em template
   ↓
7. Sistema busca diagnóstico: getDiagnostico(..., 'nutri', ...)
   ↓
8. Diagnóstico vem do código TypeScript (diagnosticos-nutri.ts)
   ↓
9. ✅ TUDO FUNCIONA!
```

---

## 🎯 RESULTADO ESPERADO

Após corrigir:
- ✅ Templates carregam do banco (não mais hardcoded)
- ✅ Diagnósticos continuam funcionando (código TypeScript)
- ✅ Tudo sincronizado
- ✅ Fácil manutenção (alterar no banco, não no código)

