# 🔧 COMO CORRIGIR USER_ID MANUALMENTE NA ÁREA ADMINISTRATIVA

## 📋 PROBLEMA IDENTIFICADO

Após migração, algumas subscriptions podem ter `user_id` diferente do `user_id` em `user_profiles`. Isso acontece porque:
- Durante migração, pode ter sido criado um novo usuário em `auth.users`
- O perfil foi criado com outro `user_id`
- A subscription ficou vinculada ao `user_id` errado

---

## ✅ SOLUÇÃO: CORREÇÃO MANUAL NA ÁREA ADMIN

### **Opção 1: Via Supabase Dashboard (Recomendado)**

1. **Acesse Supabase Dashboard**
   - Vá em "Table Editor"
   - Selecione tabela `subscriptions`

2. **Encontre a subscription com problema**
   - Filtre por email ou use a busca
   - Ou filtre por `is_migrated = true`

3. **Identifique o `user_id` correto**
   - Veja o `user_id` atual da subscription
   - Vá para tabela `user_profiles`
   - Busque pelo email do usuário
   - Anote o `user_id` que está em `user_profiles`

4. **Corrija o `user_id` da subscription**
   - Volte para a subscription
   - Clique no campo `user_id`
   - Cole o `user_id` correto (do `user_profiles`)
   - Salve

---

### **Opção 2: Via Área Admin do YLADA**

1. **Acesse `/admin/usuarios`**
   - Busque pelo nome ou email da pessoa

2. **Verifique a subscription**
   - Veja se aparece corretamente
   - Se não aparecer, pode ser problema de `user_id`

3. **Para corrigir via SQL:**
   - Use o script `corrigir-todos-user-id-migrados.sql`
   - Ou corrija manualmente no Supabase

---

## 🔍 COMO IDENTIFICAR CASOS COM PROBLEMA

### **Sintomas:**
- Subscription não aparece na área admin para o usuário
- `user_id` da subscription diferente do `user_id` do perfil
- Usuário não consegue acessar mesmo tendo subscription ativa

### **Verificação SQL:**
```sql
-- Verificar se há problemas
SELECT 
  s.id,
  s.user_id as subscription_user_id,
  u.email,
  up.user_id as perfil_user_id,
  CASE 
    WHEN s.user_id != up.user_id THEN '❌ PROBLEMA'
    ELSE '✅ OK'
  END as status
FROM subscriptions s
INNER JOIN auth.users u ON u.id = s.user_id
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE s.is_migrated = true
  AND s.status = 'active';
```

---

## 🚀 CORREÇÃO AUTOMÁTICA (Script SQL)

Se preferir corrigir todos de uma vez:

1. Execute `scripts/corrigir-todos-user-id-migrados.sql`
2. O script:
   - Identifica todos os casos com problema
   - Corrige automaticamente o `user_id`
   - Mostra resultado da correção

---

## ⚠️ IMPORTANTE

- **Sempre verifique antes de corrigir** - Execute a query de verificação primeiro
- **Faça backup** - Antes de executar UPDATEs em massa
- **Teste com um caso** - Corrija um caso manualmente primeiro para entender o processo

---

## 📝 EXEMPLO PRÁTICO: GLADIS

1. **Subscription atual:**
   - `user_id`: `62885dbf-83fd-4d55-8d95-b94bb63064fc` (ERRADO)

2. **Perfil correto:**
   - `user_id`: `55da1b82-5d38-436c-8234-89c7e50a7e1c` (CORRETO)

3. **Correção:**
   - Atualizar `subscriptions.user_id` para `55da1b82-5d38-436c-8234-89c7e50a7e1c`

---

## 💡 DICA

Se você tem muitos casos, é melhor usar o script SQL automático. Se são poucos casos, pode fazer manualmente no Supabase Dashboard.

