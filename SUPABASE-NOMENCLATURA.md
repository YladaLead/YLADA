# 🗄️ YLADA - Nomenclatura Padronizada das Tabelas Supabase

## 📋 Análise da Situação Atual

### **Tabelas Existentes:**
```
users
user_profiles
templates_nutrition
user_templates
leads
quizzes
quiz_perguntas
quiz_respostas
```

---

## 🎯 Problemas Identificados

1. ❌ **`templates_nutrition`** - Muito específico, deveria ser genérico
2. ❌ **`user_templates`** - Redundância com "user" no início
3. ❌ **`leads`** - Genérico demais, não indica relacionamento claro
4. ❌ **`quiz_perguntas`** - Português misturado com inglês
5. ❌ Falta padrão consistente (algumas em PT, outras em EN)

---

## ✅ Proposta de Nomenclatura Padronizada

### **Convenções:**
- ✅ Nomes em **inglês** (padrão internacional)
- ✅ Plural para tabelas (`users`, `templates`)
- ✅ Singular para relacionamentos (`_id`)
- ✅ Prefixos apenas quando necessário
- ✅ Nomes auto-explicativos

### **Estrutura Proposta:**

```
users                  ✅ JÁ ESTÁ BOM
user_profiles         ✅ JÁ ESTÁ BOM (relaciona com users)
template_catalog      🔄 RENOMEAR (era: templates_nutrition)
user_instances        🔄 RENOMEAR (era: user_templates)
leads                 ✅ MANTER
quizzes               ✅ MANTER
quiz_questions        🔄 RENOMEAR (era: quiz_perguntas)
quiz_responses         🔄 RENOMEAR (era: quiz_respostas)
```

---

## 📊 Detalhamento da Estrutura

### **1. `users` ✅**
- **Manter como está**
- Usuários do sistema (profissionais)

### **2. `user_profiles` ✅**
- **Manter como está**
- Perfis específicos (nutricionista, coach, etc.)

### **3. `template_catalog` 🔄**
- **Renomear de:** `templates_nutrition`
- Templates pré-criados no sistema
- Catálogo base para todos os perfis

### **4. `user_instances` 🔄**
- **Renomear de:** `user_templates`
- Instâncias personalizadas pelos usuários
- Cada usuário cria sua "cópia" do template
- Liga com `template_catalog`

### **5. `leads` ✅**
- **Manter como está**
- Leads capturados em qualquer ferramenta
- Referência `instance_id` (era `template_id`)

### **6. `quizzes` ✅**
- **Manter como está**
- Quizzes personalizados do usuário

### **7. `quiz_questions` 🔄**
- **Renomear de:** `quiz_perguntas`
- Perguntas dos quizzes

### **8. `quiz_responses` 🔄**
- **Renomear de:** `quiz_respostas`
- Respostas dos quizzes

---

## 🔧 Script SQL para Renomear

```sql
-- =====================================================
-- YLADA - RENOMEAR TABELAS PARA NOMENCLATURA PADRONIZADA
-- Execute este script no Supabase SQL Editor
-- =====================================================

-- Renomear templates_nutrition → template_catalog
ALTER TABLE IF EXISTS templates_nutrition RENAME TO template_catalog;
ALTER INDEX IF EXISTS idx_templates_nutrition_language RENAME TO idx_template_catalog_language;
ALTER INDEX IF EXISTS idx_templates_nutrition_specialization RENAME TO idx_template_catalog_specialization;
ALTER INDEX IF EXISTS idx_templates_nutrition_active RENAME TO idx_template_catalog_active;
ALTER POLICY IF EXISTS "Users can view own templates" ON templates_nutrition RENAME TO "Users can view own templates";
ALTER POLICY IF EXISTS "Users can update own templates" ON templates_nutrition RENAME TO "Users can update own templates";
ALTER POLICY IF EXISTS "Users can insert own templates" ON templates_nutrition RENAME TO "Users can insert own templates";
ALTER POLICY IF EXISTS "Users can delete own templates" ON templates_nutrition RENAME TO "Users can delete own templates";

-- Renomear user_templates → user_instances
ALTER TABLE IF EXISTS user_templates RENAME TO user_instances;
ALTER INDEX IF EXISTS idx_user_templates_user_id RENAME TO idx_user_instances_user_id;
ALTER INDEX IF EXISTS idx_user_templates_slug RENAME TO idx_user_instances_slug;
ALTER INDEX IF EXISTS idx_user_templates_status RENAME TO idx_user_instances_status;
ALTER TABLE IF EXISTS leads DROP CONSTRAINT IF EXISTS leads_template_id_fkey;
ALTER TABLE IF EXISTS leads ADD CONSTRAINT leads_instance_id_fkey FOREIGN KEY (template_id) REFERENCES user_instances(id) ON DELETE CASCADE;
ALTER TABLE IF EXISTS leads RENAME COLUMN template_id TO instance_id;
ALTER POLICY IF EXISTS "Users can view own templates" ON user_templates RENAME TO "Users can view own instances";
ALTER POLICY IF EXISTS "Users can update own templates" ON user_templates RENAME TO "Users can update own instances";
ALTER POLICY IF EXISTS "Users can insert own templates" ON user_templates RENAME TO "Users can insert own instances";
ALTER POLICY IF EXISTS "Users can delete own templates" ON user_templates RENAME TO "Users can delete own instances";

-- Renomear quiz_perguntas → quiz_questions
ALTER TABLE IF EXISTS quiz_perguntas RENAME TO quiz_questions;
ALTER INDEX IF EXISTS idx_quiz_perguntas_quiz_id RENAME TO idx_quiz_questions_quiz_id;
ALTER INDEX IF EXISTS idx_quiz_perguntas_ordem RENAME TO idx_quiz_questions_ordem;
ALTER TABLE IF EXISTS quiz_respostas DROP CONSTRAINT IF EXISTS quiz_respostas_pergunta_id_fkey;
ALTER TABLE IF EXISTS quiz_respostas ADD CONSTRAINT quiz_respostas_question_id_fkey FOREIGN KEY (pergunta_id) REFERENCES quiz_questions(id) ON DELETE CASCADE;
ALTER TABLE IF EXISTS quiz_respostas RENAME COLUMN pergunta_id TO question_id;
ALTER POLICY IF EXISTS "Users can manage own quiz_perguntas" ON quiz_perguntas RENAME TO "Users can manage own quiz_questions";
ALTER INDEX IF EXISTS idx_quiz_respostas_pergunta_id RENAME TO idx_quiz_respostas_question_id;

-- Renomear quiz_respostas → quiz_responses
ALTER TABLE IF EXISTS quiz_respostas RENAME TO quiz_responses;
ALTER INDEX IF EXISTS idx_quiz_respostas_quiz_id RENAME TO idx_quiz_responses_quiz_id;
ALTER INDEX IF EXISTS idx_quiz_respostas_question_id RENAME TO idx_quiz_responses_question_id;
ALTER INDEX IF EXISTS idx_quiz_respostas_created_at RENAME TO idx_quiz_responses_created_at;
ALTER POLICY IF EXISTS "Anyone can insert quiz_respostas" ON quiz_respostas RENAME TO "Anyone can insert quiz_responses";
ALTER POLICY IF EXISTS "Users can view own quiz responses" ON quiz_respostas RENAME TO "Users can view own quiz responses";

-- Verificar tabelas renomeadas
SELECT 
    'TABELAS RENOMEADAS:' as info,
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('template_catalog', 'user_instances', 'quiz_questions', 'quiz_responses')
ORDER BY table_name;
```

---

## 📝 Resumo das Mudanças

| **ANTES** | **DEPOIS** | **MOTIVO** |
|-----------|------------|-----------|
| `templates_nutrition` | `template_catalog` | Mais genérico, não limita a nutrição |
| `user_templates` | `user_instances` | Evita redundância de "user" e clarifica o conceito |
| `quiz_perguntas` | `quiz_questions` | Padronizar para inglês |
| `quiz_respostas` | `quiz_responses` | Padronizar para inglês |

---

## 🚀 Como Aplicar

### **1. Fazer Backup Primeiro**
```sql
-- Criar backup das tabelas
CREATE TABLE templates_nutrition_backup AS SELECT * FROM templates_nutrition;
CREATE TABLE user_templates_backup AS SELECT * FROM user_templates;
```

### **2. Executar Script de Renomeação**
- Copiar e colar o script acima no Supabase SQL Editor
- Executar em ambiente de teste primeiro

### **3. Atualizar Código**
```typescript
// ANTES
const { data } = await supabase
  .from('templates_nutrition')
  .select('*')

// DEPOIS
const { data } = await supabase
  .from('template_catalog')
  .select('*')
```

### **4. Testar Tudo**
- Verificar se todos os queries funcionam
- Testar CRUD completo
- Verificar RLS policies

---

## ⚠️ Importante

- ❌ **NÃO fazer commit ainda** (conforme solicitado)
- ⏳ Ajustar primeiro no localhost
- ✅ Testar todas as queries antes de fazer commit
- ✅ Documentar as mudanças

---

## 📋 Checklist de Implementação

- [ ] Executar script de renomeação no Supabase
- [ ] Atualizar todas as referências no código
- [ ] Testar páginas de templates
- [ ] Testar páginas de quizzes
- [ ] Testar captura de leads
- [ ] Verificar RLS policies
- [ ] Fazer commit e deploy

