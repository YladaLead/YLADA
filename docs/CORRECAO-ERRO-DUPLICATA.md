# 🔧 CORREÇÃO: Erro de Duplicata

## ⚠️ ERRO ENCONTRADO

```
ERROR: 23505: duplicate key value violates unique constraint "idx_templates_nutrition_slug"
DETAIL: Key (slug)=(quiz-interativo) already exists.
```

## 🔍 CAUSA

Alguns templates já existem no banco com os mesmos slugs. O script tentou inserir novamente e encontrou conflito na constraint única do `slug`.

## ✅ SOLUÇÃO APLICADA

Ajustei o script para usar `ON CONFLICT DO UPDATE`:

```sql
ON CONFLICT (slug) 
DO UPDATE SET
  content = EXCLUDED.content,
  description = EXCLUDED.description,
  updated_at = NOW()
WHERE templates_nutrition.profession = 'nutri' 
  AND templates_nutrition.language = 'pt';
```

**O que isso faz:**
- ✅ Se o slug **não existe**: Insere o template normalmente
- ✅ Se o slug **já existe**: Atualiza o `content` e `description` (preservando o que já existe)
- ✅ Só atualiza se for template Nutri em português

---

## 🚀 PRÓXIMO PASSO

**Execute o script novamente no Supabase:**

1. Copie o conteúdo atualizado de `scripts/migrar-templates-nutri-EFICIENTE.sql`
2. Cole no SQL Editor do Supabase
3. Execute novamente

**Agora deve funcionar sem erros!**

---

## 📊 O QUE VAI ACONTECER

- **Templates que NÃO existem:** Serão inseridos
- **Templates que JÁ existem:** Terão `content` e `description` atualizados (se necessário)
- **Total esperado:** 35 templates no banco (alguns novos, alguns atualizados)

---

## ✅ VERIFICAÇÃO

Após executar, verifique:

```sql
SELECT COUNT(*) as total_nutri
FROM templates_nutrition
WHERE profession = 'nutri' AND language = 'pt';
```

**Esperado:** ~35 templates (ou mais, se já tinha alguns)

