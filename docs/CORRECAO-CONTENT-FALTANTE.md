# 🔧 CORREÇÃO: Content Nutri Faltante

## 📊 RESULTADO DA EXECUÇÃO

```
total_templates: 37
com_content_nutri: 31  ← 6 templates sem "profession": "nutri"
com_content_geral: 36  ← 36 têm content, mas só 31 têm profession
sem_content: 0         ← Todos têm algum content
```

## ⚠️ PROBLEMA

**6 templates têm content, mas não têm o campo `"profession": "nutri"` no content.**

Isso pode acontecer porque:
- Alguns templates foram atualizados antes do script completo
- Alguns templates têm content básico sem o campo profession
- Alguns diagnósticos podem não ter recebido o campo corretamente

---

## ✅ SOLUÇÃO

Criei um script de correção: `scripts/corrigir-content-nutri-faltante.sql`

**Este script:**
1. Identifica quais templates não têm `"profession": "nutri"`
2. Adiciona o campo `"profession": "nutri"` usando operador `||` (merge JSONB)
3. Verifica o resultado final

---

## 🚀 PRÓXIMO PASSO

**Execute o script de correção:**

1. Abra: `scripts/corrigir-content-nutri-faltante.sql`
2. Copie TODO o conteúdo
3. Cole no SQL Editor do Supabase
4. Execute

**Resultado esperado:**
- ✅ 37 templates com `"profession": "nutri"`
- ✅ 0 templates sem profession

---

## 📊 DEPOIS DA CORREÇÃO

Após executar, você deve ver:
```
total_templates: 37
com_content_nutri: 37  ← Todos agora têm profession
com_content_geral: 37
sem_content: 0
```

