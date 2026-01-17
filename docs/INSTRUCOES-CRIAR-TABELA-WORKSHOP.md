# 📋 Instruções: Criar Tabela de Inscrições do Workshop

## ⚠️ IMPORTANTE

A tabela `workshop_inscricoes` precisa ser criada no Supabase para que o formulário de inscrição funcione corretamente.

---

## 🚀 Como Executar

### Passo 1: Acessar o Supabase SQL Editor

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. No menu lateral, clique em **"SQL Editor"**
4. Clique em **"New query"**

### Passo 2: Executar a Migração

1. Abra o arquivo: `migrations/176-criar-tabela-workshop-inscricoes.sql`
2. Copie **todo o conteúdo** do arquivo
3. Cole no SQL Editor do Supabase
4. Clique em **"Run"** ou pressione `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

---

## ✅ O que a Migração Faz

A migração cria a tabela `workshop_inscricoes` com:

- **Campos principais:**
  - `id` - UUID único
  - `nome` - Nome completo
  - `email` - Email do inscrito
  - `telefone` - Telefone/WhatsApp
  - `crn` - CRN (opcional)

- **Metadados:**
  - `source` - Origem da inscrição
  - `workshop_type` - Tipo de workshop
  - `status` - Status da inscrição

- **Rastreamento:**
  - `ip_address` - IP do inscrito
  - `user_agent` - Navegador usado

- **Timestamps:**
  - `created_at` - Data de criação
  - `updated_at` - Data de atualização (atualizado automaticamente)

- **Índices:**
  - Para busca rápida por email, telefone, status, etc.

- **Trigger:**
  - Atualiza `updated_at` automaticamente quando o registro é modificado

---

## 🔍 Verificar se Funcionou

Após executar a migração, você pode verificar se a tabela foi criada:

```sql
-- Verificar se a tabela existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'workshop_inscricoes';

-- Ver a estrutura da tabela
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'workshop_inscricoes'
ORDER BY ordinal_position;
```

---

## 🐛 Solução de Problemas

### Erro: "relation already exists"
- A tabela já existe. Isso é normal se você já executou a migração antes.
- O `CREATE TABLE IF NOT EXISTS` evita esse erro, mas se aparecer, pode ignorar.

### Erro: "permission denied"
- Verifique se você tem permissões de administrador no Supabase.
- Você precisa ser owner do projeto ou ter permissões de superuser.

### Erro: "function already exists"
- A função `update_workshop_inscricoes_updated_at` já existe.
- Isso é normal se você já executou a migração antes.

---

## 📝 Próximos Passos

Após criar a tabela:

1. ✅ Teste o formulário de inscrição na página do workshop
2. ✅ Verifique se os dados estão sendo salvos corretamente
3. ✅ Confirme se os emails estão sendo enviados

---

## 🔗 Arquivo da Migração

`migrations/176-criar-tabela-workshop-inscricoes.sql`

