# 🔧 AJUSTES NECESSÁRIOS NO SCHEMA - Antes de Continuar Interfaces

**Data:** 2024  
**Status:** ⚠️ **PENDENTE** - Execute antes de continuar com as interfaces

---

## 📋 RESUMO EXECUTIVO

Antes de continuar com as interfaces do frontend, precisamos garantir que o schema do Supabase está completo e consistente. Este documento lista todos os ajustes necessários.

---

## ✅ O QUE JÁ FOI FEITO

1. ✅ Tabelas principais criadas (`clients`, `client_evolution`, `appointments`, `assessments`, etc.)
2. ✅ Integração com Leads (`converted_from_lead`, `lead_source`, `lead_template_id`)
3. ✅ Sistema de Reavaliações (`is_reevaluation`, `parent_assessment_id`, `assessment_number`)
4. ✅ Tabela de Histórico Emocional/Comportamental
5. ✅ RLS (Row Level Security) ativado
6. ✅ Índices criados

---

## ⚠️ O QUE PRECISA SER AJUSTADO

### 1. **Tabela `clients` - Campos Faltantes**

| Campo | Tipo | Descrição | Status |
|-------|------|-----------|--------|
| `phone_country_code` | VARCHAR(5) | Código do país para telefone (BR, US, etc.) | ❌ **FALTA** |
| `instagram` | VARCHAR(100) | Instagram da cliente | ❌ **FALTA** |
| `goal` | TEXT | Objetivo da cliente | ❌ **FALTA** |

**Impacto:** Esses campos são usados no frontend (aba Informações Básicas).

---

### 2. **Tabela `clients` - Ajuste de Status**

**Problema:** Valores de status não correspondem ao esperado pelo frontend.

**Valores Atuais:**
- `'ativo'`, `'inativo'`, `'pausado'`, `'encerrado'`

**Valores Esperados (Frontend):**
- `'lead'`, `'pre_consulta'`, `'ativa'`, `'pausa'`, `'finalizada'`

**Ação:** Migrar valores antigos para novos:
- `'ativo'` → `'ativa'`
- `'pausado'` → `'pausa'`
- `'encerrado'` → `'finalizada'`
- `'inativo'` → `'finalizada'` (ou manter, dependendo da lógica)

---

### 3. **Tabela `emotional_behavioral_history` - Campos Faltantes**

| Campo | Tipo | Descrição | Status |
|-------|------|-----------|--------|
| `story` | TEXT | História/contexto emocional | ❌ **FALTA** |
| `moment_of_change` | TEXT | Momento de mudança identificado | ❌ **FALTA** |
| `commitment` | INTEGER | Nível de comprometimento (1-10) | ❌ **FALTA** |
| `biggest_fear` | TEXT | Maior medo/fobia | ❌ **FALTA** |
| `behavioral_block` | TEXT | Bloqueio comportamental | ❌ **FALTA** |

**Impacto:** Esses campos serão usados na aba Emocional/Comportamental.

---

### 4. **Tabela `programs` - Campos Faltantes**

| Campo | Tipo | Descrição | Status |
|-------|------|-----------|--------|
| `stage` | VARCHAR(50) | Estágio do programa | ❌ **FALTA** |
| `weekly_goal` | TEXT | Meta semanal | ❌ **FALTA** |

**Impacto:** Esses campos serão usados na aba Programa Atual.

---

## 🚀 COMO EXECUTAR OS AJUSTES

### Opção 1: Script Consolidado (Recomendado)

Execute o script `migrations/ajustes-finais-schema-gestao.sql` no Supabase SQL Editor.

Este script:
- ✅ Adiciona todos os campos faltantes
- ✅ Ajusta valores de status
- ✅ Cria índices necessários
- ✅ Verifica se tudo foi aplicado corretamente
- ✅ É idempotente (pode ser executado múltiplas vezes)

### Opção 2: Scripts Individuais

Se preferir executar ajustes separadamente:

1. **Campos em `clients`:** `migrations/add-missing-fields-checklist.sql`
2. **Ajustes de status:** Manual ou via script

---

## ✅ VERIFICAÇÃO PÓS-EXECUÇÃO

Após executar o script, verifique:

### 1. Campos em `clients`:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'clients' 
AND column_name IN ('phone_country_code', 'instagram', 'goal', 'status')
ORDER BY column_name;
```

**Resultado esperado:**
- ✅ `phone_country_code` (VARCHAR(5))
- ✅ `instagram` (VARCHAR(100))
- ✅ `goal` (TEXT)
- ✅ `status` (VARCHAR(50)) com valores corretos

### 2. Valores de Status:
```sql
SELECT DISTINCT status, COUNT(*) 
FROM clients 
GROUP BY status;
```

**Resultado esperado:**
- ✅ `'lead'`, `'pre_consulta'`, `'ativa'`, `'pausa'`, `'finalizada'`
- ❌ Não deve ter `'ativo'`, `'pausado'`, `'encerrado'` (a menos que sejam novos registros)

### 3. Campos em `emotional_behavioral_history`:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'emotional_behavioral_history' 
AND column_name IN ('story', 'moment_of_change', 'commitment', 'biggest_fear', 'behavioral_block')
ORDER BY column_name;
```

### 4. Campos em `programs`:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'programs' 
AND column_name IN ('stage', 'weekly_goal')
ORDER BY column_name;
```

---

## 📝 NOTAS IMPORTANTES

1. **Backup:** Sempre faça backup antes de executar migrações em produção.

2. **Idempotência:** Os scripts usam `IF NOT EXISTS`, então podem ser executados múltiplas vezes sem problemas.

3. **Dados Existentes:** 
   - Campos novos serão `NULL` para registros existentes
   - Valores de status serão migrados automaticamente
   - Nenhum dado será perdido

4. **Ordem de Execução:**
   - Execute primeiro `migrate-gestao-nutri-complete.sql` (se ainda não executou)
   - Depois execute `ajustes-finais-schema-gestao.sql`

---

## 🎯 PRÓXIMOS PASSOS

Após executar os ajustes:

1. ✅ Verificar se todas as colunas foram criadas
2. ✅ Testar as APIs com os novos campos
3. ✅ Continuar com as interfaces do frontend:
   - Aba Evolução Física
   - Aba Timeline
   - Aba Agenda
   - Outras abas

---

**Última atualização:** 2024


