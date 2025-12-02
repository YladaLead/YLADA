# 🔧 INSTRUÇÕES PARA CORRIGIR ERRO 500 AO CRIAR PLANO GRATUITO

## ❌ PROBLEMA

Ao tentar criar um plano gratuito para Amanda Bonfogo, está ocorrendo erro 500. O erro mais provável é que a constraint do banco de dados ainda não permite `plan_type: 'free'`.

## ✅ SOLUÇÃO

### 1. Execute a migração no Supabase SQL Editor

Acesse o Supabase Dashboard → SQL Editor e execute:

```sql
-- Remover constraint antiga
ALTER TABLE subscriptions 
DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;

-- Adicionar nova constraint que inclui 'free'
ALTER TABLE subscriptions 
ADD CONSTRAINT subscriptions_plan_type_check 
CHECK (plan_type IN ('monthly', 'annual', 'free'));
```

### 2. Verificar se foi aplicado

Execute para confirmar:

```sql
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'subscriptions'::regclass
  AND conname = 'subscriptions_plan_type_check';
```

Deve retornar:
```
constraint_name: subscriptions_plan_type_check
constraint_definition: CHECK ((plan_type = ANY (ARRAY['monthly'::character varying, 'annual'::character varying, 'free'::character varying])))
```

### 3. Tentar criar o plano novamente

Após executar a migração, tente criar o plano gratuito para Amanda novamente.

## 🔍 VERIFICAR SITUAÇÃO DA AMANDA

Execute este script para verificar a situação atual:

```sql
-- Verificar usuário Amanda
SELECT 
  u.id as user_id,
  u.email,
  up.perfil as area_perfil,
  s.id as subscription_id,
  s.area,
  s.plan_type,
  s.status,
  s.current_period_end
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
LEFT JOIN subscriptions s ON s.user_id = u.id
WHERE u.email ILIKE '%amandabonfogo%'
ORDER BY s.created_at DESC;
```

## 📝 O QUE FOI CORRIGIDO NO CÓDIGO

1. ✅ Removido campo `requires_manual_renewal` que pode não existir
2. ✅ Melhorado tratamento de erros com mensagens específicas
3. ✅ Adicionada detecção de erro de constraint com instruções claras
4. ✅ Melhorados logs para debug

## ⚠️ IMPORTANTE

- A migração **DEVE** ser executada no Supabase antes de criar planos gratuitos
- Se o erro persistir após a migração, verifique os logs do servidor para mais detalhes
- O código agora retorna mensagens mais claras sobre o que está faltando

