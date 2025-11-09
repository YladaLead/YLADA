# 🔍 ANÁLISE: Problema Quiz Interativo Preview

## ❌ PROBLEMA REPORTADO

O Quiz Interativo ainda está mostrando uma tela de introdução/landing, mesmo após ajustarmos o código para começar direto na primeira pergunta.

---

## 🔎 ANÁLISE DO CÓDIGO

### **1. DynamicTemplatePreview.tsx**
- ✅ Estado inicial: `useState(1)` - começa na primeira pergunta
- ✅ Removida lógica de landing (etapa 0)
- ✅ Botões "Reiniciar Preview" voltam para etapa 1

### **2. Wellness Templates Page**
- ✅ Quiz Interativo **NÃO** está na lista `templatesComPreviewCustomizado` (linha 2839-2866)
- ✅ Deveria usar `DynamicTemplatePreview` como fallback (linha 2874)
- ⚠️ Mas ainda existe arquivo `QuizInterativoPreview.tsx` (não está sendo usado)

### **3. API Route (`/api/wellness/templates`)**
- ✅ Retorna `content` do banco (linha 34)
- ✅ Campo `content` está sendo incluído no select (linha 57)

---

## 🎯 POSSÍVEIS CAUSAS

### **Causa 1: Content não está vindo do banco**
- O `template.content` pode estar `null` ou `undefined`
- Verificar se o SQL foi executado corretamente
- Verificar se o content está no formato JSONB correto

### **Causa 2: Cache do navegador**
- O navegador pode estar usando versão antiga do código
- Solução: Hard refresh (Ctrl+Shift+R ou Cmd+Shift+R)

### **Causa 3: Estrutura do content incorreta**
- O `content` pode não ter a estrutura esperada
- Verificar se tem `template_type: "quiz"` e `questions` array

### **Causa 4: ID/Slug do template não está batendo**
- O `template.id` pode não estar sendo reconhecido corretamente
- Verificar se o slug no banco é `quiz-interativo`

---

## ✅ PRÓXIMOS PASSOS PARA DIAGNOSTICAR

1. **Verificar no console do navegador:**
   ```javascript
   // Abrir DevTools (F12) e verificar:
   console.log('[DynamicPreview] Template:', ...)
   // Ver se o content está vindo
   ```

2. **Verificar no banco:**
   ```sql
   SELECT name, slug, content 
   FROM templates_nutrition 
   WHERE profession = 'wellness' 
   AND (slug = 'quiz-interativo' OR name ILIKE '%quiz interativo%');
   ```

3. **Verificar se o template está sendo detectado:**
   - Verificar se `isQuizInterativo` está sendo `true`
   - Verificar se está caindo no fallback do `DynamicTemplatePreview`

---

## 🔧 SOLUÇÕES PROPOSTAS

### **Solução 1: Verificar e corrigir content no banco**
- Executar script SQL novamente se necessário
- Verificar se o content tem a estrutura correta

### **Solução 2: Adicionar logs de debug**
- Adicionar console.log para verificar o que está sendo passado
- Verificar se `template.content` existe

### **Solução 3: Limpar cache**
- Hard refresh no navegador
- Limpar cache do Next.js (`rm -rf .next`)

---

## 📝 CHECKLIST DE VERIFICAÇÃO

- [ ] Content existe no banco para Quiz Interativo
- [ ] Content tem estrutura correta (`template_type: "quiz"`, `questions` array)
- [ ] API está retornando o content
- [ ] Frontend está recebendo o content
- [ ] DynamicTemplatePreview está sendo chamado (não preview customizado)
- [ ] Cache do navegador foi limpo
- [ ] Estado inicial está em `etapaAtual = 1`

