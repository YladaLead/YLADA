# 📋 Instruções para Executar Migrações SQL

## ⚠️ IMPORTANTE
Você precisa executar **3 migrações SQL** no Supabase para que as novas funcionalidades funcionem corretamente.

---

## 🚀 Como Executar

### Passo 1: Acessar o Supabase SQL Editor
1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. No menu lateral, clique em **"SQL Editor"**
4. Clique em **"New query"**

### Passo 2: Executar as Migrações (na ordem)

Execute cada migração **uma por vez**, copiando e colando o conteúdo completo de cada arquivo:

#### ✅ **Migração 016: Tabela de Metas de Construção**
**Arquivo:** `migrations/016-criar-tabela-metas-construcao-equipe.sql`

Esta migração cria a tabela `wellness_metas_construcao` para armazenar:
- Meta de PV de equipe
- Meta de recrutamento
- Meta de royalties
- Nível de carreira alvo

**O que faz:**
- Cria a tabela com todas as colunas necessárias
- Configura índices para performance
- Define políticas RLS (Row Level Security)
- Cria trigger para atualizar `updated_at`

---

#### ✅ **Migração 017: Campo Situações Particulares**
**Arquivo:** `migrations/017-adicionar-situacoes-particulares-wellness.sql`

Esta migração adiciona o campo `situacoes_particulares` na tabela `wellness_noel_profile`.

**O que faz:**
- Adiciona coluna `situacoes_particulares` (TEXT) na tabela `wellness_noel_profile`
- Adiciona comentário explicativo
- Usa `IF NOT EXISTS` para evitar erros se já existir

---

#### ✅ **Migração 018: Tabela de Push Subscriptions**
**Arquivo:** `migrations/018-criar-tabela-push-subscriptions.sql`

Esta migração cria a tabela `push_subscriptions` para armazenar subscriptions de notificações push.

**O que faz:**
- Cria a tabela com campos para endpoint, chaves de criptografia (p256dh, auth)
- Armazena metadados (user_agent, device_info)
- Configura índices e políticas RLS
- Cria trigger para atualizar `updated_at`

---

## 📝 Ordem de Execução Recomendada

Execute nesta ordem (uma de cada vez):

1. **Primeiro:** `016-criar-tabela-metas-construcao-equipe.sql`
2. **Segundo:** `017-adicionar-situacoes-particulares-wellness.sql`
3. **Terceiro:** `018-criar-tabela-push-subscriptions.sql`

---

## ✅ Como Verificar se Funcionou

Após executar cada migração, você deve ver a mensagem:
```
Success. No rows returned
```

Para verificar se as tabelas foram criadas:
1. No Supabase Dashboard, vá em **"Table Editor"**
2. Procure pelas tabelas:
   - `wellness_metas_construcao`
   - `push_subscriptions`
3. Para verificar a coluna `situacoes_particulares`:
   - Vá em `wellness_noel_profile`
   - Verifique se a coluna `situacoes_particulares` existe

---

## 🔍 Verificação Rápida via SQL

Execute este SQL para verificar se tudo está criado:

```sql
-- Verificar tabela de metas
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'wellness_metas_construcao'
) AS metas_table_exists;

-- Verificar coluna situacoes_particulares
SELECT EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_name = 'wellness_noel_profile' 
  AND column_name = 'situacoes_particulares'
) AS situacoes_column_exists;

-- Verificar tabela de push subscriptions
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'push_subscriptions'
) AS push_table_exists;
```

Todos devem retornar `true`.

---

## ⚠️ Problemas Comuns

### Erro: "relation already exists"
- **Causa:** A tabela/coluna já existe
- **Solução:** As migrações usam `IF NOT EXISTS`, então isso não deve acontecer. Se acontecer, pode ignorar ou verificar se já está criado.

### Erro: "permission denied"
- **Causa:** Você não tem permissão para criar tabelas
- **Solução:** Certifique-se de estar usando a conta com permissões de administrador no Supabase.

### Erro: "function already exists"
- **Causa:** A função já foi criada anteriormente
- **Solução:** As migrações usam `DROP ... IF EXISTS`, então isso não deve acontecer. Se acontecer, pode ignorar.

---

## 📚 Próximos Passos

Após executar as migrações:

1. ✅ **Configurar VAPID Keys** (se ainda não fez):
   - Execute: `node scripts/generate-vapid-keys.js`
   - Adicione as variáveis de ambiente no `.env.local` e na Vercel

2. ✅ **Instalar dependência `web-push`**:
   ```bash
   npm install web-push
   ```

3. ✅ **Testar as funcionalidades**:
   - Criar metas de construção de equipe
   - Preencher situações particulares no perfil
   - Ativar notificações push

---

## 📞 Suporte

Se encontrar algum problema ao executar as migrações, verifique:
- Os logs de erro no Supabase SQL Editor
- Se todas as dependências estão instaladas
- Se as variáveis de ambiente estão configuradas
