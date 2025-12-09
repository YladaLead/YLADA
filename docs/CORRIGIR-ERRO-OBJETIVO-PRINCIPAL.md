# 🔧 Corrigir Erro de Constraint: objetivo_principal

## ❌ Problema

Novos usuários estão recebendo o erro ao tentar salvar o perfil:

```
new row for relation "wellness_noel_profile"
violates check constraint
"wellness_noel_profile_objetivo_principal_check"
```

## 🔍 Causa

A constraint no banco de dados não está atualizada com todos os valores válidos, ou a migration `003-expandir-wellness-noel-profile.sql` não foi executada.

## ✅ Solução

### 1. Executar a Migration de Correção

Execute a migration `migrations/020-corrigir-constraint-objetivo-principal.sql` no Supabase SQL Editor:

```sql
-- Copiar e colar o conteúdo completo do arquivo
-- migrations/020-corrigir-constraint-objetivo-principal.sql
```

Esta migration:
- Remove a constraint antiga (se existir)
- Adiciona a constraint atualizada com TODOS os valores válidos
- É idempotente (pode ser executada múltiplas vezes sem erro)

### 2. Valores Válidos para objetivo_principal

Após a migration, os seguintes valores serão aceitos:

**Valores novos:**
- `usar_recomendar`
- `renda_extra`
- `carteira`
- `plano_presidente` ✅ (este é o que está causando o erro)
- `fechado`
- `funcional`

**Valores antigos (compatibilidade):**
- `vender_mais`
- `construir_carteira`
- `melhorar_rotina`
- `voltar_ritmo`
- `aprender_divulgar`

### 3. Verificar se Funcionou

Após executar a migration, teste criando um novo usuário e selecionando "Plano Presidente" no onboarding.

## 🔍 Debug

Se o erro persistir após executar a migration:

1. **Verificar a constraint atual:**
```sql
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conname = 'wellness_noel_profile_objetivo_principal_check';
```

2. **Verificar valores na tabela:**
```sql
SELECT DISTINCT objetivo_principal 
FROM wellness_noel_profile 
WHERE objetivo_principal IS NOT NULL;
```

3. **Verificar logs do backend:**
   - Os logs agora mostram o valor recebido e se é válido
   - Verifique o console do servidor ao tentar salvar

## 📝 Notas

- A validação no backend (`src/app/api/wellness/noel/onboarding/route.ts`) agora valida os valores antes de tentar salvar
- Se um valor inválido for enviado, o backend retornará um erro claro antes de tentar salvar no banco
- O componente frontend (`NoelOnboardingCompleto.tsx`) já está enviando os valores corretos (com underscore, ex: `plano_presidente`)
