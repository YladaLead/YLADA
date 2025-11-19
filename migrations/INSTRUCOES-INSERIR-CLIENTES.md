# 📝 Instruções para Inserir Clientes Fictícios

## ⚠️ IMPORTANTE: Execute na ordem correta!

### Passo 1: Corrigir a Constraint (SE NECESSÁRIO)

Se você recebeu o erro:
```
insert or update on table "clients" violates foreign key constraint "clients_user_id_fkey"
```

Execute primeiro:
```sql
-- Arquivo: migrations/corrigir-constraint-clients-user-id.sql
```

Este script ajusta a foreign key de `clients.user_id` para referenciar `auth.users` ao invés de `users`.

---

### Passo 2: Fazer Login na Aplicação

1. Acesse: `http://localhost:3000/pt/nutri/login`
2. Faça login com sua conta
3. Isso cria automaticamente seu perfil em `user_profiles`

---

### Passo 3: Inserir Clientes Fictícios

Execute:
```sql
-- Arquivo: migrations/inserir-clientes-ficticios-FINAL.sql
```

Este script:
- ✅ Busca automaticamente seu `user_id`
- ✅ Não precisa modificar nada
- ✅ Insere 6 clientes com dados completos

---

## ✅ Verificação

Após executar, verifique se funcionou:

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

Você deve ver **6 clientes** listados.

---

## 🗑️ Remover Dados Fictícios

Quando terminar os testes:

```sql
-- Arquivo: migrations/remover-clientes-ficticios.sql
```

---

## ❓ Problemas Comuns

### Erro: "violates foreign key constraint clients_user_id_fkey"
**Solução:** Execute `corrigir-constraint-clients-user-id.sql` primeiro

### Erro: "Nenhum usuário encontrado"
**Solução:** Faça login na aplicação primeiro (`/pt/nutri/login`)

### Clientes não aparecem na lista
**Solução:** 
1. Verifique se foram criados (query acima)
2. Verifique se está logado com o mesmo `user_id`
3. Limpe o cache do navegador (Cmd+Shift+R)

