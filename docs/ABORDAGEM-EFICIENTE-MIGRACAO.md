# 🚀 ABORDAGEM EFICIENTE: Migração Templates Nutri

## ✅ VERSÃO EFICIENTE vs VERSÃO ANTERIOR

### **❌ Versão Anterior (38 INSERTs individuais):**
- 38 comandos INSERT separados
- Difícil de manter
- Propenso a erros
- Muito código repetitivo
- Difícil de debugar

### **✅ Versão Eficiente (CTE - Common Table Expression):**
- **1 único INSERT** com todos os templates
- **Fácil de manter** - todos os dados em um lugar
- **Menos propenso a erros** - estrutura única
- **Busca automática** de content de Wellness
- **Fácil de debugar** - vê todos os dados de uma vez

---

## 🎯 COMO FUNCIONA

### **1. CTE `templates_nutri_hardcoded`:**
```sql
WITH templates_nutri_hardcoded AS (
  SELECT * FROM (VALUES
    ('quiz-interativo', 'Quiz Interativo', 'quiz', ...),
    ('quiz-bem-estar', 'Quiz de Bem-Estar', 'quiz', ...),
    -- ... todos os 38 templates
  ) AS t(slug, name, type, description, search_term_1, search_term_2)
)
```
- Define **todos os 38 templates** de uma vez
- Inclui **termos de busca** para encontrar em Wellness

### **2. CTE `templates_com_content`:**
```sql
templates_com_content AS (
  SELECT 
    t.slug,
    t.name,
    t.type,
    t.description,
    COALESCE(
      (SELECT w.content FROM templates_nutrition w WHERE ...),
      -- Content básico se não encontrar
    ) as content
  FROM templates_nutri_hardcoded t
)
```
- **Busca automaticamente** content de Wellness
- Se não encontrar, cria **content básico** baseado no tipo

### **3. INSERT único:**
```sql
INSERT INTO templates_nutrition (...)
SELECT ... FROM templates_com_content
WHERE NOT EXISTS (...)
```
- **Insere todos de uma vez**
- **Evita duplicatas** com `NOT EXISTS`

---

## 📊 VANTAGENS

### **1. Eficiência:**
- ✅ **1 comando** vs 38 comandos
- ✅ **Execução mais rápida**
- ✅ **Menos overhead** de transação

### **2. Manutenibilidade:**
- ✅ **Todos os dados em um lugar**
- ✅ **Fácil de adicionar/remover templates**
- ✅ **Fácil de ajustar termos de busca**

### **3. Confiabilidade:**
- ✅ **Estrutura única** - menos chance de erro
- ✅ **Validação automática** - vê todos os dados antes de inserir
- ✅ **Fácil de debugar** - pode executar CTEs separadamente

### **4. Flexibilidade:**
- ✅ **Fácil ajustar** termos de busca
- ✅ **Fácil adicionar** novos templates
- ✅ **Fácil modificar** lógica de content

---

## 🔍 COMO USAR

### **1. Executar no Supabase:**
```sql
-- Copiar e colar o script completo
-- Executar tudo de uma vez
```

### **2. Verificar resultado:**
```sql
-- O script já inclui queries de verificação:
-- - Estado antes/depois
-- - Quantos foram criados
-- - Lista de templates criados
```

### **3. Ajustar se necessário:**
```sql
-- Se algum template não encontrou content de Wellness:
-- Ajustar search_term_1 ou search_term_2 na CTE
```

---

## ⚠️ IMPORTANTE

### **Termos de Busca:**
- `search_term_1` e `search_term_2` são usados para buscar em Wellness
- Se não encontrar, usa content básico
- Pode ajustar esses termos se necessário

### **Content Básico:**
- **Quiz:** `{"template_type": "quiz", "questions": 10}`
- **Calculadora:** `{"template_type": "calculator", "fields": []}`
- **Planilha:** `{"template_type": "planilha", "items": []}`

### **Evitar Duplicatas:**
- Script usa `NOT EXISTS` para evitar duplicatas
- Verifica por `name` ou `slug`
- Pode executar múltiplas vezes sem problemas

---

## ✅ PRÓXIMOS PASSOS

1. ✅ **Script criado** (`migrar-templates-nutri-EFICIENTE.sql`)
2. ⚠️ **Executar no Supabase**
3. ⚠️ **Verificar resultado** (queries já incluídas)
4. ⚠️ **Atualizar página Nutri** para carregar do banco

