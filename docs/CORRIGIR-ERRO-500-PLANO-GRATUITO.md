# 🔧 CORRIGIR ERRO 500 AO CRIAR PLANO GRATUITO

## ❌ PROBLEMA

Ao tentar criar um plano gratuito de 365 dias para Andressa Monteiro, está ocorrendo erro 500 no servidor.

**Erro no console:** `Failed to load resource: the server responded with a status of 500 ()`  
**Endpoint:** `/api/admin/subscriptions/free`

---

## ✅ SOLUÇÃO RÁPIDA

### Passo 1: Verificar e Corrigir a Constraint do Banco de Dados

O erro mais provável é que a constraint do banco de dados ainda não permite `plan_type: 'free'`.

**Execute este script no Supabase SQL Editor:**

1. Acesse: **Supabase Dashboard** → **SQL Editor**
2. Clique em **"+ New Query"**
3. Cole e execute o script abaixo:

```sql
-- Verificar constraint atual
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'subscriptions'::regclass
  AND conname = 'subscriptions_plan_type_check';

-- Corrigir se necessário
ALTER TABLE subscriptions 
DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;

ALTER TABLE subscriptions 
ADD CONSTRAINT subscriptions_plan_type_check 
CHECK (plan_type IN ('monthly', 'annual', 'free'));

-- Verificar se foi aplicado
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition,
  CASE 
    WHEN pg_get_constraintdef(oid) LIKE '%free%' THEN '✅ Permite "free"'
    ELSE '❌ NÃO permite "free"'
  END as status
FROM pg_constraint
WHERE conrelid = 'subscriptions'::regclass
  AND conname = 'subscriptions_plan_type_check';
```

**Resultado esperado:**
- Deve mostrar `✅ Permite "free"` no status

---

### Passo 2: Tentar Criar o Plano Novamente

Após executar o script acima:

1. Volte para a página de criar plano gratuito
2. Preencha os dados:
   - **Usuário:** Andressa Monteiro (andressamonteiro@hotmail.com)
   - **Área:** Nutri
   - **Válido por:** 365 dias
3. Clique em **"Criar Plano Gratuito"**

---

## 🔍 VERIFICAR SE FUNCIONOU

Execute este SQL para verificar se a assinatura foi criada:

```sql
SELECT 
  s.id,
  s.user_id,
  u.email,
  s.area,
  s.plan_type,
  s.status,
  s.current_period_start,
  s.current_period_end,
  EXTRACT(EPOCH FROM (s.current_period_end - s.current_period_start)) / 86400 as dias_validos
FROM subscriptions s
JOIN auth.users u ON u.id = s.user_id
WHERE u.email = 'andressamonteiro@hotmail.com'
  AND s.area = 'nutri'
ORDER BY s.created_at DESC
LIMIT 1;
```

**Deve mostrar:**
- `plan_type: free`
- `status: active`
- `dias_validos: 365` (ou próximo)

---

## 🆘 SE AINDA NÃO FUNCIONAR

### Verificar Logs do Servidor

1. Verifique os logs do servidor (Vercel ou local)
2. Procure por mensagens de erro específicas
3. Erros comuns:
   - `check constraint` → Execute o Passo 1 novamente
   - `column does not exist` → Pode faltar alguma coluna na tabela
   - `foreign key constraint` → Problema com user_id

### Verificar Estrutura da Tabela

Execute para verificar se todas as colunas necessárias existem:

```sql
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'subscriptions'
  AND column_name IN ('plan_type', 'area', 'status', 'current_period_start', 'current_period_end')
ORDER BY column_name;
```

---

## 📝 O QUE FOI CORRIGIDO NO CÓDIGO

1. ✅ Removido código duplicado que causava erro
2. ✅ Melhorado tratamento de erros com mensagens específicas
3. ✅ Adicionada detecção de erro de constraint com instruções claras
4. ✅ Melhorados logs para debug

---

## ⚠️ IMPORTANTE

- A constraint deve permitir `'free'` além de `'monthly'` e `'annual'`
- O plano gratuito pode ter até 400 dias de validade (365 está OK)
- Após criar, a assinatura deve aparecer como `status: active` e `plan_type: free`

---

## 🔗 ARQUIVOS RELACIONADOS

- **API:** `src/app/api/admin/subscriptions/free/route.ts`
- **Migração:** `migrations/add-free-to-plan-type.sql`
- **Script de verificação:** `migrations/verificar-e-corrigir-plan-type-free.sql`










