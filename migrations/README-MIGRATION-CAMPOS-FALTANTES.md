# 🔧 Migration: Adicionar Campos Faltantes no Schema

**Data:** 2025-12-18  
**Projeto:** YLADA - Área Nutri - Gestão de Clientes  
**Status:** ✅ Pronto para executar

---

## 📋 O QUE ESTA MIGRATION FAZ

Esta migration adiciona **8 campos essenciais** que o frontend usa mas não existem no banco de dados:

### Tabela `clients` (3 campos):
- ✅ `goal` (TEXT) - Objetivo da cliente
- ✅ `instagram` (VARCHAR(100)) - Instagram da cliente
- ✅ `phone_country_code` (VARCHAR(5)) - Código do país para telefone

### Tabela `emotional_behavioral_history` (3 campos):
- ✅ `story` (TEXT) - História/contexto emocional
- ✅ `moment_of_change` (TEXT) - Momento de mudança identificado
- ✅ `commitment` (INTEGER) - Nível de comprometimento (1-10)

### Tabela `programs` (2 campos):
- ✅ `stage` (VARCHAR(50)) - Estágio do programa
- ✅ `weekly_goal` (TEXT) - Meta semanal

---

## 🚀 COMO EXECUTAR

### Passo 1: Execute a Migration

1. Acesse o Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/[SEU_PROJECT_ID]/editor
   ```

2. Vá em **SQL Editor**

3. Abra o arquivo:
   ```
   migrations/add-missing-schema-fields.sql
   ```

4. Copie todo o conteúdo e cole no SQL Editor

5. Clique em **RUN** para executar

6. Aguarde a mensagem de sucesso:
   ```
   ✅ SUCESSO! Todos os campos foram adicionados com sucesso!
   ```

### Passo 2: Verifique a Execução

Escolha uma das 3 opções abaixo (recomendamos começar pela mais simples):

**Opção 1 - Verificação Rápida (Mais Simples):**
```sql
-- Cole no SQL Editor:
scripts/quick-verify-schema.sql
```
- ✅ Ultra-simples: apenas conta os campos
- ✅ Funciona em QUALQUER versão do PostgreSQL
- ✅ Se todos os status estiverem "✅ OK", está perfeito!

**Opção 2 - Verificação Detalhada (Recomendada):**
```sql
-- Cole no SQL Editor:
scripts/verify-missing-schema-fields-simple.sql
```
- ✅ Mostra detalhes de cada campo
- ✅ Percentual de conclusão
- ✅ Lista campos faltantes (se houver)

**Opção 3 - Verificação Completa:**
```sql
-- Cole no SQL Editor:
scripts/verify-missing-schema-fields.sql
```
- ⚠️ Pode dar erro em algumas versões do Postgres
- ℹ️ Se der erro, use Opção 1 ou 2

---

## 📊 O QUE A MIGRATION INCLUI

### ✅ Campos com validação:
- `phone_country_code`: Padrão 'BR'
- `commitment`: Apenas valores entre 1 e 10

### ✅ Índices para performance:
- `idx_clients_instagram` - Busca por Instagram
- `idx_clients_goal` - Busca por objetivo
- `idx_programs_stage` - Busca por estágio

### ✅ Comentários de documentação:
- Todas as colunas têm comentários explicando seu propósito

### ✅ Idempotência:
- Pode ser executado múltiplas vezes sem problemas
- Usa `IF NOT EXISTS` para evitar erros

---

## ⚠️ IMPORTANTE

### Dados Existentes:
- ✅ Nenhum dado será perdido
- ✅ Campos novos terão valor `NULL` para registros existentes
- ✅ `phone_country_code` terá valor padrão 'BR' para novos registros

### Backup:
- 🔒 Sempre faça backup antes de migrations em produção
- 🔒 Esta migration é segura (apenas adiciona colunas)

### RLS (Row Level Security):
- ✅ RLS já está ativo nas tabelas
- ✅ Novos campos herdam as políticas existentes
- ✅ Nenhuma alteração de segurança necessária

---

## 🔍 VERIFICAÇÃO PÓS-EXECUÇÃO

### Verificação Rápida:

```sql
-- Verificar clients
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'clients' 
  AND column_name IN ('goal', 'instagram', 'phone_country_code');

-- Verificar emotional_behavioral_history
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'emotional_behavioral_history' 
  AND column_name IN ('story', 'moment_of_change', 'commitment');

-- Verificar programs
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'programs' 
  AND column_name IN ('stage', 'weekly_goal');
```

### Resultado Esperado:

Cada query deve retornar os campos com seus tipos corretos.

---

## 🐛 TROUBLESHOOTING

### Erro: "Column already exists"
- ✅ **Normal!** A migration detecta campos existentes e os ignora
- ✅ Veja as mensagens de `NOTICE` para saber o que foi pulado

### Erro: "column 'column_name' does not exist" (no script de verificação)
- ✅ **Solução:** Use o script simplificado:
  ```
  scripts/verify-missing-schema-fields-simple.sql
  ```
- ℹ️ Esse erro ocorre em algumas versões do PostgreSQL com queries UNION ALL complexas
- ℹ️ O script simplificado tem a mesma funcionalidade, apenas formatação diferente

### Erro: "Permission denied"
- ❌ Você precisa de permissões de admin no Supabase
- ❌ Verifique se está logado com a conta correta

### Verificação retorna menos de 100%
- ⚠️ Execute a migration novamente
- ⚠️ Verifique as mensagens de erro no console
- ⚠️ Contate o suporte se persistir

---

## 📝 ARQUIVOS RELACIONADOS

### Documentação:
- `docs/AJUSTES-SCHEMA-ANTES-INTERFACES.md` - Contexto completo
- `migrations/README-MIGRATION-CAMPOS-FALTANTES.md` - Este arquivo

### Schema Original:
- `schema-gestao-nutri.sql` - Schema base (antes da migration)

### Scripts:
- `migrations/add-missing-schema-fields.sql` - **Migration principal (EXECUTE ESTE PRIMEIRO)**
- `scripts/quick-verify-schema.sql` - **Verificação rápida (MAIS SIMPLES)**
- `scripts/verify-missing-schema-fields-simple.sql` - Verificação detalhada (recomendada)
- `scripts/verify-missing-schema-fields.sql` - Verificação completa (alternativa)

---

## ✅ CHECKLIST DE EXECUÇÃO

- [ ] Backup do banco de dados realizado (se produção)
- [ ] Migration executada no Supabase SQL Editor
- [ ] Mensagem de sucesso recebida
- [ ] Script de verificação executado
- [ ] Percentual de conclusão = 100%
- [ ] Frontend testado com novos campos

---

## 🎯 PRÓXIMOS PASSOS

Após executar esta migration:

1. ✅ Testar as interfaces do frontend:
   - Aba Informações Básicas (goal, instagram, phone_country_code)
   - Aba Emocional/Comportamental (story, moment_of_change, commitment)
   - Aba Programa Atual (stage, weekly_goal)

2. ✅ Verificar APIs:
   - GET /api/clients/:id
   - PATCH /api/clients/:id
   - GET/POST /api/emotional-behavioral-history
   - GET/POST /api/programs

3. ✅ Atualizar TypeScript interfaces (se necessário)

---

**Última atualização:** 2025-12-18  
**Autor:** Sistema YLADA  
**Status:** ✅ Pronto para produção


