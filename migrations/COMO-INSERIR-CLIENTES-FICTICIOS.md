# 📝 Como Inserir Clientes Fictícios para Teste

## 🔍 Passo 1: Encontrar Seu User ID

Execute este comando no Supabase SQL Editor:

```sql
SELECT user_id, email, nome_completo, perfil 
FROM user_profiles 
WHERE perfil = 'nutri';
```

**Copie o `user_id` que aparece no resultado.**

---

## 🚀 Passo 2: Escolher o Script

### Opção A: Script Automático (Recomendado)
**Arquivo:** `migrations/inserir-clientes-ficticios-v2.sql`

Este script tenta encontrar automaticamente seu `user_id` de:
1. `user_profiles` (perfil 'nutri')
2. `auth.users` (fallback)

**Execute no Supabase SQL Editor.**

---

### Opção B: Script Manual (Se o automático não funcionar)
**Arquivo:** `migrations/inserir-clientes-ficticios-manual.sql`

1. Abra o arquivo
2. Procure por `'SEU_USER_ID_AQUI'`
3. Substitua pelo seu `user_id` real (copiado no Passo 1)
4. Execute no Supabase SQL Editor

**Exemplo:**
```sql
DECLARE
  v_user_id UUID := '62885dbf-0eab-4288-87fb-18e3850f7029'::UUID; -- Seu user_id aqui
```

---

## ✅ Passo 3: Verificar se Funcionou

Após executar o script, execute esta query para verificar:

```sql
SELECT 
  name, 
  status, 
  email, 
  created_at 
FROM clients 
WHERE name IN (
  'Maria Silva Santos',
  'João Pedro Oliveira', 
  'Ana Carolina Costa',
  'Carlos Eduardo Lima',
  'Fernanda Alves',
  'Roberto Santos'
)
ORDER BY created_at;
```

**Você deve ver 6 clientes listados.**

---

## 🗑️ Passo 4: Remover Dados Fictícios (Depois)

Quando terminar os testes, execute:

```sql
-- Arquivo: migrations/remover-clientes-ficticios.sql
```

Isso remove todos os dados fictícios criados.

---

## ❓ Problemas Comuns

### Erro: "Nenhum usuário encontrado"
**Solução:** 
1. Faça login na aplicação primeiro (`/pt/nutri/login`)
2. Isso cria seu perfil em `user_profiles`
3. Depois execute o script novamente

### Erro: "null value in column user_id"
**Solução:** Use o script manual (Opção B) e especifique seu `user_id` diretamente

### Clientes não aparecem na lista
**Solução:**
1. Verifique se os clientes foram criados (Passo 3)
2. Verifique se você está logado com o mesmo `user_id`
3. Limpe o cache do navegador (Cmd+Shift+R)

---

## 📊 O que será criado:

- ✅ 6 clientes (diferentes status)
- ✅ 6 evoluções físicas
- ✅ 5 consultas
- ✅ 4 registros emocional/comportamental
- ✅ 2 avaliações (1 inicial + 1 reavaliação)
- ✅ Histórico completo

