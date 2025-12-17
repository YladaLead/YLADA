# 📋 ORDEM DE EXECUÇÃO - MIGRATIONS FICHA PADRÃO COACH

## 🎯 ORDEM RECOMENDADA

Execute as migrations nesta ordem exata:

### 1️⃣ Migration 169 - Campos de Objetivo
**Arquivo:** `169-adicionar-campos-objetivo-coach-clients.sql`

**O que faz:**
- Adiciona campos na tabela principal `coach_clients`
- Campos: `current_weight`, `current_height`, `goal_weight`, `goal_deadline`, `goal_type`

**Por que primeiro:**
- Não tem dependências
- Adiciona campos na tabela base que já existe
- Outras migrations podem precisar desses campos

**Comando:**
```sql
-- Execute: migrations/169-adicionar-campos-objetivo-coach-clients.sql
```

---

### 2️⃣ Migration 170 - Dados Profissionais
**Arquivo:** `170-criar-tabela-dados-profissionais-coach.sql`

**O que faz:**
- Cria tabela `coach_client_professional`
- Armazena dados profissionais e rotina

**Por que segundo:**
- Depende de `coach_clients` (já existe)
- Não depende de outras migrations novas
- Pode ser executada em paralelo com 171 e 172

**Comando:**
```sql
-- Execute: migrations/170-criar-tabela-dados-profissionais-coach.sql
```

---

### 3️⃣ Migration 171 - Saúde e Digestão
**Arquivo:** `171-criar-tabela-saude-coach.sql`

**O que faz:**
- Cria tabela `coach_client_health`
- Armazena dados de saúde, medicamentos e digestão

**Por que terceiro:**
- Depende de `coach_clients` (já existe)
- Não depende de outras migrations novas
- Pode ser executada em paralelo com 170 e 172

**Comando:**
```sql
-- Execute: migrations/171-criar-tabela-saude-coach.sql
```

---

### 4️⃣ Migration 172 - Hábitos Alimentares
**Arquivo:** `172-criar-tabela-habitos-alimentares-coach.sql`

**O que faz:**
- Cria tabela `coach_client_food_habits`
- Armazena hábitos alimentares detalhados

**Por que quarto:**
- Depende de `coach_clients` (já existe)
- Não depende de outras migrations novas
- Pode ser executada em paralelo com 170 e 171

**Comando:**
```sql
-- Execute: migrations/172-criar-tabela-habitos-alimentares-coach.sql
```

---

## 📊 DIAGRAMA DE DEPENDÊNCIAS

```
coach_clients (já existe)
    │
    ├── 169: Adiciona campos (ALTER TABLE)
    │
    ├── 170: coach_client_professional (FK → coach_clients)
    │
    ├── 171: coach_client_health (FK → coach_clients)
    │
    └── 172: coach_client_food_habits (FK → coach_clients)
```

**Observação:** As migrations 170, 171 e 172 podem ser executadas em qualquer ordem entre si, pois todas dependem apenas de `coach_clients` que já existe.

---

## ✅ CHECKLIST DE EXECUÇÃO

Execute nesta ordem:

- [ ] **1. Migration 169** - Adiciona campos de objetivo
- [ ] **2. Migration 170** - Cria tabela profissional
- [ ] **3. Migration 171** - Cria tabela saúde
- [ ] **4. Migration 172** - Cria tabela hábitos alimentares

---

## 🔍 VERIFICAÇÃO PÓS-EXECUÇÃO

Após executar todas as migrations, verifique:

```sql
-- Verificar campos adicionados em coach_clients
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'coach_clients' 
  AND column_name IN ('current_weight', 'current_height', 'goal_weight', 'goal_deadline', 'goal_type')
ORDER BY column_name;

-- Verificar tabelas criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN (
  'coach_client_professional',
  'coach_client_health',
  'coach_client_food_habits'
)
ORDER BY table_name;

-- Verificar foreign keys
SELECT 
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name IN (
    'coach_client_professional',
    'coach_client_health',
    'coach_client_food_habits'
  )
ORDER BY tc.table_name;
```

---

## ⚠️ OBSERVAÇÕES IMPORTANTES

1. **Ordem obrigatória:** Migration 169 deve ser executada primeiro
2. **Ordem flexível:** Migrations 170, 171 e 172 podem ser executadas em qualquer ordem
3. **Segurança:** Todas usam `IF NOT EXISTS`, então são seguras para reexecutar
4. **Rollback:** Se precisar reverter, execute os comandos de DROP na ordem inversa

---

## 🚀 COMANDO RÁPIDO (TODAS DE UMA VEZ)

Se quiser executar todas de uma vez, use esta ordem:

```sql
-- 1. Campos de objetivo
\i migrations/169-adicionar-campos-objetivo-coach-clients.sql

-- 2. Tabela profissional
\i migrations/170-criar-tabela-dados-profissionais-coach.sql

-- 3. Tabela saúde
\i migrations/171-criar-tabela-saude-coach.sql

-- 4. Tabela hábitos alimentares
\i migrations/172-criar-tabela-habitos-alimentares-coach.sql
```

---

**Documento criado em:** Dezembro 2025  
**Versão:** 1.0





