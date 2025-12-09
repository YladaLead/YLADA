# 🔧 Corrigir Erro: tempo_disponivel Constraint

## ❌ Problema

**Erro reportado:**
```
new row for relation "wellness_noel_profile" violates check constraint 
"wellness_noel_profile_tempo_disponivel_che"
```

**Valor problemático:** `'1h_plus'` para o campo "Tempo Disponível"

---

## 🔍 Análise

### Valores Válidos no Frontend

O frontend (`NoelOnboardingCompleto.tsx`) permite os seguintes valores:
- `'5min'`
- `'15min'`
- `'30min'`
- `'1h'`
- `'1h_plus'` ← **Este valor está causando o erro**

### Valores Válidos no Backend

O backend (`onboarding/route.ts`) valida os seguintes valores:
```typescript
const temposValidos = [
  '5min',
  '15min',
  '30min',
  '1h',
  '1h_plus',  // ← Incluído no backend
  // Valores antigos (compatibilidade)
  '15_minutos',
  '30_minutos',
  '1_hora',
  'mais_1_hora'
]
```

### Problema no Banco de Dados

A constraint do banco de dados **não inclui** `'1h_plus'` nos valores permitidos.

A migration `003-expandir-wellness-noel-profile.sql` deveria ter corrigido isso, mas:
- Pode não ter sido executada
- Pode ter falhado silenciosamente
- Pode ter sido sobrescrita por outra migration

---

## ✅ Solução

### Migration 021: Corrigir Constraint tempo_disponivel

Criada migration idempotente que:
1. Remove a constraint antiga (se existir)
2. Adiciona nova constraint com **TODOS** os valores válidos
3. Inclui valores novos e antigos (compatibilidade)

**Arquivo:** `migrations/021-corrigir-constraint-tempo-disponivel.sql`

---

## 📋 Valores Válidos na Constraint

### Valores Novos (Atualizados)
- `'5min'`
- `'15min'`
- `'30min'`
- `'1h'`
- `'1h_plus'` ← **Agora incluído**

### Valores Antigos (Compatibilidade)
- `'15_minutos'`
- `'30_minutos'`
- `'1_hora'`
- `'mais_1_hora'`

---

## 🚀 Como Aplicar

### 1. Executar Migration no Supabase

1. Acesse: **Supabase Dashboard → SQL Editor**
2. Abra o arquivo: `migrations/021-corrigir-constraint-tempo-disponivel.sql`
3. Copie e cole o conteúdo
4. Execute (Run)

### 2. Verificar Se Funcionou

Execute este SQL para verificar:
```sql
SELECT 
  constraint_name,
  check_clause
FROM information_schema.check_constraints
WHERE constraint_name = 'wellness_noel_profile_tempo_disponivel_check';
```

**Esperado:** Deve mostrar a constraint com todos os valores válidos, incluindo `'1h_plus'`.

### 3. Testar

1. Usuário tenta salvar perfil com "Tempo Disponível: Mais de 1 hora" (`'1h_plus'`)
2. **Esperado:** Deve salvar sem erro ✅

---

## ⚠️ Outros Problemas Possíveis

### Problema 1: objetivo_principal ainda falhando

Se ainda houver erro com `objetivo_principal`:
- Verificar se a migration `020-corrigir-constraint-objetivo-principal.sql` foi executada
- Verificar se o valor `'plano_presidente'` está na constraint

### Problema 2: Valores Abreviados

Nas imagens, aparecem valores como:
- "sm" (provavelmente "sim" para `prepara_bebidas`)
- "me" (provavelmente "medio" para `ritmo`)

**Solução:** Verificar se o frontend está enviando valores completos ou abreviados.

---

## 📊 Status

- ✅ Migration criada: `migrations/021-corrigir-constraint-tempo-disponivel.sql`
- ⏳ **Aguardando execução no Supabase**

---

**Próximo Passo:** Executar a migration no Supabase SQL Editor.
