# ✅ Resumo: Correções de Salvamento de Perfil - Constraints

## 🎯 Problema Principal

**Muitos usuários não conseguem salvar o próprio perfil** devido a erros de `check constraint` no banco de dados.

---

## 🔍 Problemas Identificados

### 1. ❌ `tempo_disponivel` - Constraint Incompleta

**Erro:**
```
new row for relation "wellness_noel_profile" violates check constraint 
"wellness_noel_profile_tempo_disponivel_che"
```

**Causa:** O valor `'1h_plus'` não estava na constraint do banco de dados, mesmo sendo válido no frontend e backend.

**Valor problemático:** `'1h_plus'` (Mais de 1 hora)

---

### 2. ❌ `objetivo_principal` - Constraint Incompleta (Já Corrigido)

**Erro:**
```
violates check constraint "wellness_noel_profile_objetivo_principal_check"
```

**Causa:** O valor `'plano_presidente'` não estava na constraint.

**Status:** ✅ Já corrigido na migration 020

---

## ✅ Correções Implementadas

### 1. ✅ Migration 021: Corrigir Constraint `tempo_disponivel`

**Arquivo:** `migrations/021-corrigir-constraint-tempo-disponivel.sql`

**O que faz:**
- Remove constraint antiga (se existir)
- Adiciona nova constraint com **TODOS** os valores válidos:
  - Valores novos: `'5min'`, `'15min'`, `'30min'`, `'1h'`, `'1h_plus'`
  - Valores antigos (compatibilidade): `'15_minutos'`, `'30_minutos'`, `'1_hora'`, `'mais_1_hora'`

---

### 2. ✅ Melhorar Mensagens de Erro

**Arquivo:** `src/app/api/wellness/noel/onboarding/route.ts`

**O que faz:**
- Mensagens de erro mais específicas para cada constraint:
  - `tempo_disponivel`: "Por favor, selecione uma opção da lista (5min, 15min, 30min, 1h ou Mais de 1 hora)."
  - `prepara_bebidas`: "Por favor, selecione uma opção da lista (Sim, Não, Aprender ou Nunca)."
  - `ritmo`: "Por favor, selecione uma opção da lista (Lento, Médio ou Rápido)."
  - `tom`: "Por favor, selecione uma opção da lista (Neutro, Extrovertido, Técnico ou Simples)."

---

## 🚀 Como Aplicar

### Passo 1: Executar Migration 021

1. Acesse: **Supabase Dashboard → SQL Editor**
2. Abra o arquivo: `migrations/021-corrigir-constraint-tempo-disponivel.sql`
3. Copie e cole o conteúdo completo
4. Execute (Run)

### Passo 2: Verificar Se Funcionou

Execute este SQL para verificar:
```sql
SELECT 
  constraint_name,
  check_clause
FROM information_schema.check_constraints
WHERE constraint_name = 'wellness_noel_profile_tempo_disponivel_check';
```

**Esperado:** Deve mostrar a constraint com todos os valores válidos, incluindo `'1h_plus'`.

### Passo 3: Testar

1. Usuário tenta salvar perfil com "Tempo Disponível: Mais de 1 hora"
2. **Esperado:** Deve salvar sem erro ✅

---

## 📊 Status das Correções

| Problema | Status | Migration | Arquivo |
|----------|--------|-----------|---------|
| `tempo_disponivel` constraint | ✅ Corrigido | 021 | `migrations/021-corrigir-constraint-tempo-disponivel.sql` |
| `objetivo_principal` constraint | ✅ Corrigido | 020 | `migrations/020-corrigir-constraint-objetivo-principal.sql` |
| Mensagens de erro | ✅ Melhoradas | - | `src/app/api/wellness/noel/onboarding/route.ts` |

---

## ⚠️ Importante

### Se Ainda Houver Problemas

1. **Verificar se as migrations foram executadas:**
   - Migration 020: `objetivo_principal`
   - Migration 021: `tempo_disponivel`

2. **Verificar logs do servidor:**
   - Os logs agora mostram qual campo específico está causando o erro
   - Mensagens de erro são mais claras

3. **Verificar valores no banco:**
   ```sql
   -- Ver constraints ativas
   SELECT 
     constraint_name,
     check_clause
   FROM information_schema.check_constraints
   WHERE constraint_name LIKE 'wellness_noel_profile_%_check';
   ```

---

## 📋 Checklist

- [x] Migration 021 criada
- [x] Mensagens de erro melhoradas
- [x] Documentação criada
- [ ] **Migration 021 executada no Supabase** ← **AÇÃO NECESSÁRIA**
- [ ] Testado com usuário real

---

## 🎯 Próximos Passos

1. **Executar migration 021 no Supabase SQL Editor**
2. **Testar salvamento de perfil com "Tempo Disponível: Mais de 1 hora"**
3. **Se ainda houver problemas, verificar logs e constraints no banco**

---

**Status:** ✅ Correções implementadas e deployadas - **Aguardando execução da migration 021 no Supabase**
