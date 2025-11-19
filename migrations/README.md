# 🔄 Migrações - Módulo de Gestão Nutri

## 📋 Scripts de Migração

### Script Principal (Recomendado)
**`migrate-gestao-nutri-complete.sql`** - Execute este script primeiro no Supabase SQL Editor.

Este script:
- ✅ Adiciona colunas de integração com Leads na tabela `clients`
- ✅ Adiciona colunas de reavaliação na tabela `assessments` (se existir)
- ✅ Cria a tabela `emotional_behavioral_history`
- ✅ Adiciona índices e políticas RLS
- ✅ Verifica se tudo foi criado corretamente

### Script de Ajustes Finais (OBRIGATÓRIO antes das interfaces)
**`ajustes-finais-schema-gestao.sql`** - Execute este script após o script principal.

Este script:
- ✅ Adiciona campos faltantes em `clients` (`phone_country_code`, `instagram`, `goal`)
- ✅ Ajusta valores de `status` para corresponder ao frontend
- ✅ Adiciona campos faltantes em `emotional_behavioral_history`
- ✅ Adiciona campos faltantes em `programs`
- ✅ Cria índices para novos campos
- ✅ Verifica se tudo foi aplicado corretamente

**⚠️ IMPORTANTE:** Execute este script antes de continuar com as interfaces do frontend!

### Scripts Individuais (Opcional)
Se preferir executar migrações separadamente:

1. **`add-lead-integration-columns.sql`** - Adiciona colunas de integração com Leads
2. **`add-reevaluation-columns.sql`** - Adiciona colunas de reavaliação
3. **`create-emotional-behavioral-table.sql`** - Cria tabela de histórico emocional/comportamental
4. **`add-missing-fields-checklist.sql`** - Adiciona campos faltantes do checklist

---

## 🚀 Como Executar

### Opção 1: Supabase SQL Editor (Recomendado)

1. Acesse o Supabase Dashboard
2. Vá em **SQL Editor**
3. Clique em **New Query**
4. Copie e cole o conteúdo de `migrate-gestao-nutri-complete.sql`
5. Clique em **Run** ou pressione `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)
6. Verifique os resultados no final do script

### Opção 2: Via CLI (psql)

```bash
psql -h [HOST] -U [USER] -d [DATABASE] -f migrations/migrate-gestao-nutri-complete.sql
```

---

## ✅ Verificação

Após executar o script, você deve ver:

1. **Colunas em clients:**
   - `converted_from_lead` (BOOLEAN)
   - `lead_source` (VARCHAR)
   - `lead_template_id` (UUID)

2. **Colunas em assessments** (se a tabela existir):
   - `is_reevaluation` (BOOLEAN)
   - `parent_assessment_id` (UUID)
   - `assessment_number` (INTEGER)
   - `comparison_data` (JSONB)

3. **Tabela emotional_behavioral_history:**
   - Tabela criada com todas as colunas
   - Índices criados
   - Políticas RLS ativas

---

## ⚠️ Notas Importantes

- O script usa `IF NOT EXISTS` para evitar erros se as colunas/tabelas já existirem
- Todas as operações estão dentro de um `BEGIN/COMMIT` para garantir atomicidade
- O script verifica se as tabelas existem antes de tentar adicionar colunas
- As políticas RLS são criadas apenas se não existirem

---

## 🐛 Resolução de Problemas

### Erro: "column already exists"
- Isso é normal! O script verifica antes de criar
- Pode ignorar ou remover a verificação se necessário

### Erro: "table does not exist"
- Se a tabela `assessments` não existir, o script simplesmente não adiciona as colunas
- Isso não é um problema - você pode criar a tabela depois

### Erro: "permission denied"
- Verifique se você tem permissões de administrador no Supabase
- Use uma conta com privilégios suficientes

---

## 📝 Próximos Passos

### Ordem de Execução:

1. **Primeiro:** Execute `migrate-gestao-nutri-complete.sql`
2. **Segundo:** Execute `ajustes-finais-schema-gestao.sql` (OBRIGATÓRIO antes das interfaces)
3. **Terceiro:** Verifique se todas as colunas foram adicionadas
4. **Quarto:** Teste as APIs com os novos campos
5. **Quinto:** Continue com o desenvolvimento do frontend

### Verificações:

Após executar ambos os scripts:

1. ✅ Verificar se todas as colunas foram adicionadas
2. ✅ Verificar se os valores de `status` foram migrados corretamente
3. ✅ Testar criação de clientes com dados de lead
4. ✅ Testar criação de reavaliações
5. ✅ Testar criação de registros emocionais/comportamentais
6. ✅ Testar APIs com os novos campos (`phone_country_code`, `instagram`, `goal`)
7. ⏳ Começar desenvolvimento do frontend

---

**Última atualização:** 2024

