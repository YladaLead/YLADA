# 🔍 ANÁLISE - Problema do Slug da Calculadora

**Data:** 2025-01-27  
**Status:** ✅ Problema identificado e corrigido

---

## ❌ PROBLEMA IDENTIFICADO

### **Link Gerado (Errado):**
```
https://www.ylada.com/pt/wellness/andre/calculadora-agua
```

### **Link Correto (Funciona):**
```
https://www.ylada.com/pt/wellness/andre/agua
```

---

## 🔍 CAUSA DO PROBLEMA

### **Como a Rota Funciona:**
A rota `/pt/wellness/[user-slug]/[tool-slug]` busca a ferramenta pelo campo `slug` da tabela `user_templates`, **não** pelo `template_slug`.

### **O que estava acontecendo:**
1. Assistants API chama: `getFerramentaInfo({ ferramenta_slug: "calculadora-agua" })`
2. Function busca template base: ✅ Encontra (slug = "calculadora-agua")
3. Function busca ferramenta personalizada pelo `template_slug`: ❌ Pode não encontrar
4. Function usa `ferramenta_slug` diretamente no link: ❌ Gera link errado

### **O que deveria acontecer:**
1. Assistants API chama: `getFerramentaInfo({ ferramenta_slug: "calculadora-agua" })`
2. Function busca template base: ✅ Encontra
3. Function busca ferramenta personalizada pelo `template_slug`: ✅ Encontra
4. Function usa o `slug` da ferramenta (não `template_slug`): ✅ Gera link correto

---

## ✅ CORREÇÃO APLICADA

### **Melhorias na Busca:**

1. ✅ **Busca por template_slug** (já existia)
2. ✅ **Busca por slug diretamente** (novo)
3. ✅ **Busca todas ferramentas com template_slug** (novo)
4. ✅ **Usa sempre o `slug` da ferramenta** (não `template_slug`)

### **Fluxo Corrigido:**

```typescript
// 1. Buscar ferramenta pelo template_slug
const ferramentaPersonalizada = await buscarPorTemplateSlug('calculadora-agua')

if (ferramentaPersonalizada) {
  // Usar o slug da ferramenta (pode ser 'agua')
  link = buildWellnessToolUrl(user_slug, ferramentaPersonalizada.slug)
} else {
  // 2. Tentar buscar pelo slug diretamente
  const ferramentaPorSlug = await buscarPorSlug('calculadora-agua')
  
  if (ferramentaPorSlug) {
    link = buildWellnessToolUrl(user_slug, ferramentaPorSlug.slug)
  } else {
    // 3. Buscar todas ferramentas com esse template_slug
    const todasFerramentas = await buscarTodasPorTemplateSlug('calculadora-agua')
    
    if (todasFerramentas.length > 0) {
      // Usar o slug da primeira encontrada
      link = buildWellnessToolUrl(user_slug, todasFerramentas[0].slug)
    }
  }
}
```

---

## 🧪 VERIFICAÇÃO NO BANCO

**Execute este SQL para verificar:**

```sql
-- Verificar ferramentas do usuário "andre"
SELECT 
  ut.slug as tool_slug,
  ut.template_slug,
  ut.title,
  ut.status
FROM user_templates ut
INNER JOIN user_profiles up ON up.user_id = ut.user_id
WHERE 
  up.user_slug = 'andre'
  AND ut.profession = 'wellness'
  AND ut.status = 'active'
  AND (
    ut.template_slug = 'calculadora-agua' 
    OR ut.template_slug = 'calc-hidratacao'
    OR ut.slug = 'agua'
  )
ORDER BY ut.slug;
```

**O que procurar:**
- ✅ Se `tool_slug = 'agua'` e `template_slug = 'calculadora-agua'` → Link correto será `/pt/wellness/andre/agua`
- ✅ A function agora vai encontrar e usar o `slug` correto

---

## 🎯 RESULTADO ESPERADO

Após o deploy:

1. ✅ **"Quero enviar a calculadora de água para um cliente"**
   - Function busca ferramenta pelo `template_slug = 'calculadora-agua'`
   - Encontra ferramenta com `slug = 'agua'`
   - Gera link: `/pt/wellness/andre/agua` ✅
   - Link funciona!

---

## 📋 CHECKLIST

- [x] Problema identificado
- [x] Correção aplicada
- [x] Commit realizado
- [ ] Deploy concluído
- [ ] Teste realizado
- [ ] Link verificado (funciona)

---

**✅ Correção aplicada! Faça deploy e teste!**







