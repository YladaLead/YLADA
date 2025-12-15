# 📋 PLANO DE IMPLEMENTAÇÃO - FICHA PADRÃO COACH

## 🎯 OBJETIVO
Implementar ficha completa de cliente conforme modelo proposto, organizando todos os dados necessários para acompanhamento eficiente.

---

## 📊 ANÁLISE ATUAL vs PROPOSTA

### ✅ O que JÁ EXISTE (60%)
- Identificação básica (nome, data nascimento, CPF, contatos)
- Endereço completo
- Objetivo (campo `goal` - texto livre)
- Emocional/Comportamental (padrões, gatilhos, estado emocional)
- Evolução física (peso, medidas, circunferências)
- Reavaliações

### ❌ O que FALTA (40%)
- Dados profissionais e rotina
- Saúde geral estruturada
- Intestino e digestão
- Hábitos alimentares detalhados
- Observações estruturadas da coach

---

## 🏗️ ESTRUTURA DE DADOS PROPOSTA

### Opção 1: Usar `custom_fields` JSONB (RÁPIDO - Fase 1)
**Vantagens:** Implementação rápida, sem mudanças no schema  
**Desvantagens:** Menos estruturado, difícil de buscar/filtrar

### Opção 2: Criar tabelas específicas (IDEAL - Fase 2+)
**Vantagens:** Estruturado, fácil busca, validação de dados  
**Desvantagens:** Requer migrations, mais complexo

---

## 📅 PLANO DE IMPLEMENTAÇÃO EM FASES

### 🔴 FASE 1: DADOS CRÍTICOS (2-3 semanas)
**Prioridade:** ALTA  
**Objetivo:** Capturar dados essenciais para acompanhamento inicial

#### 1.1 Dados Profissionais e Rotina
**Onde armazenar:** `custom_fields` JSONB (temporário) ou nova tabela `coach_client_professional`

**Campos:**
```json
{
  "professional": {
    "occupation": "string",
    "work_schedule": {
      "start_time": "HH:mm",
      "end_time": "HH:mm"
    },
    "wake_time": "HH:mm",
    "sleep_time": "HH:mm",
    "who_cooks": "string",
    "household_members": "string",
    "takes_lunchbox": true/false
  }
}
```

**Interface:**
- Nova seção "Dados Profissionais" na aba "Informações Básicas"
- Formulário com campos organizados
- Validação de horários

#### 1.2 Saúde Geral
**Onde armazenar:** `custom_fields` JSONB ou nova tabela `coach_client_health`

**Campos:**
```json
{
  "health": {
    "health_problems": ["string"],
    "medications": [
      {
        "name": "string",
        "dose": "string"
      }
    ],
    "dietary_restrictions": ["string"],
    "supplements_current": ["string"],
    "supplements_recommended": ["string"]
  }
}
```

**Interface:**
- Nova seção "Saúde Geral" na aba "Informações Básicas"
- Lista de medicamentos (adicionar/remover)
- Lista de restrições (tags)
- Lista de suplementos

#### 1.3 Intestino e Digestão
**Onde armazenar:** `custom_fields` JSONB

**Campos:**
```json
{
  "digestion": {
    "bowel_function": "diario" | "dias_alternados" | "constipacao" | "diarreia",
    "digestive_complaints": ["estufamento", "gases", "refluxo", "dor_abdominal"]
  }
}
```

**Interface:**
- Nova seção "Intestino e Digestão" na aba "Informações Básicas"
- Select para funcionamento intestinal
- Checkboxes para queixas digestivas

---

### 🟡 FASE 2: DADOS IMPORTANTES (2-3 semanas)
**Prioridade:** MÉDIA  
**Objetivo:** Completar informações para acompanhamento detalhado

#### 2.1 Hábitos Alimentares Detalhados
**Onde armazenar:** Nova tabela `coach_client_food_habits` ou `custom_fields`

**Campos:**
```json
{
  "food_habits": {
    "water_intake_liters": "decimal",
    "breakfast": "string",
    "morning_snack": "string",
    "lunch": "string",
    "afternoon_snack": "string",
    "dinner": "string",
    "supper": "string",
    "snacks_between_meals": true/false,
    "snacks_description": "string",
    "alcohol_consumption": "string",
    "soda_consumption": "string"
  }
}
```

**Interface:**
- Nova seção "Hábitos Alimentares" na aba "Informações Básicas"
- Campos de texto para cada refeição
- Toggle para beliscos
- Campos para álcool e refrigerante

#### 2.2 Motivação e Emocional Expandido
**Onde armazenar:** Expandir `coach_emotional_behavioral_history` ou `custom_fields`

**Campos:**
```json
{
  "motivation": {
    "reasons": ["autoestima", "saude", "roupas", "disposicao", "familia", "medico"],
    "emotional_blocks": ["ansiedade", "culpa", "compulsao", "sabotagem", "cansaço"]
  }
}
```

**Interface:**
- Expandir aba "Emocional/Comportamental"
- Adicionar seção "Motivação"
- Adicionar seção "Travas Emocionais"

#### 2.3 Objetivo e Meta Estruturado
**Onde armazenar:** Adicionar campos na tabela `coach_clients` ou `custom_fields`

**Campos:**
```sql
-- Adicionar à tabela coach_clients:
current_weight DECIMAL(5,2),
current_height DECIMAL(3,2),
goal_weight DECIMAL(5,2),
goal_deadline DATE,
goal_type VARCHAR(50) -- 'emagrecimento', 'saude', 'estetica', 'energia', 'qualidade_vida'
```

**Interface:**
- Expandir seção "Objetivo" na aba "Informações Básicas"
- Campos numéricos para peso atual, altura, meta
- Campo de data para prazo
- Select para tipo de objetivo

---

### 🟢 FASE 3: MELHORIAS E OTIMIZAÇÕES (2 semanas)
**Prioridade:** BAIXA  
**Objetivo:** Melhorar UX e funcionalidades avançadas

#### 3.1 Observações Estruturadas da Coach
**Onde armazenar:** Nova tabela `coach_client_coach_notes` ou expandir `notes`

**Campos:**
```json
{
  "coach_notes": {
    "insights": "text",
    "alerts": ["string"],
    "combinations_made": "text",
    "attention_points": "text"
  }
}
```

**Interface:**
- Nova seção "Observações da Coach" na aba "Informações Básicas"
- Área de texto para insights
- Lista de alertas
- Campos para combinações e pontos de atenção

#### 3.2 Melhorias na Interface
- **Abas colapsáveis:** Permitir colapsar/expandir seções
- **Indicadores visuais:** Mostrar % de preenchimento
- **Formulário progressivo:** Wizard para cadastro inicial
- **Busca avançada:** Filtrar clientes por qualquer campo
- **Exportação:** Exportar ficha completa em PDF

#### 3.3 Integrações
- **Agenda:** Usar horários de trabalho para sugerir consultas
- **Programas:** Usar hábitos alimentares para criar programas
- **Suplementos:** Integrar com estoque de suplementos
- **Histórico:** Timeline visual com todos os dados

---

## 🗄️ MUDANÇAS NO SCHEMA

### Migration 1: Adicionar campos de objetivo
```sql
ALTER TABLE coach_clients
ADD COLUMN IF NOT EXISTS current_weight DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS current_height DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS goal_weight DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS goal_deadline DATE,
ADD COLUMN IF NOT EXISTS goal_type VARCHAR(50);
```

### Migration 2: Criar tabela de dados profissionais (opcional)
```sql
CREATE TABLE IF NOT EXISTS coach_client_professional (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES coach_clients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  occupation VARCHAR(255),
  work_start_time TIME,
  work_end_time TIME,
  wake_time TIME,
  sleep_time TIME,
  who_cooks VARCHAR(255),
  household_members TEXT,
  takes_lunchbox BOOLEAN,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(client_id)
);
```

### Migration 3: Criar tabela de saúde (opcional)
```sql
CREATE TABLE IF NOT EXISTS coach_client_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES coach_clients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  health_problems TEXT[],
  medications JSONB, -- [{name, dose}]
  dietary_restrictions TEXT[],
  supplements_current TEXT[],
  supplements_recommended TEXT[],
  bowel_function VARCHAR(50), -- 'diario', 'dias_alternados', 'constipacao', 'diarreia'
  digestive_complaints TEXT[],
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(client_id)
);
```

### Migration 4: Criar tabela de hábitos alimentares (opcional)
```sql
CREATE TABLE IF NOT EXISTS coach_client_food_habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES coach_clients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  water_intake_liters DECIMAL(4,2),
  breakfast TEXT,
  morning_snack TEXT,
  lunch TEXT,
  afternoon_snack TEXT,
  dinner TEXT,
  supper TEXT,
  snacks_between_meals BOOLEAN,
  snacks_description TEXT,
  alcohol_consumption VARCHAR(255),
  soda_consumption VARCHAR(255),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(client_id)
);
```

---

## 🎨 MUDANÇAS NA INTERFACE

### Arquivo: `src/app/pt/coach/clientes/[id]/page.tsx`

#### 1. Expandir `InfoTab` com novas seções:
```tsx
// Adicionar após seção de Endereço:

{/* Dados Profissionais */}
<ProfessionalDataSection cliente={cliente} clientId={clientId} />

{/* Saúde Geral */}
<HealthDataSection cliente={cliente} clientId={clientId} />

{/* Intestino e Digestão */}
<DigestionDataSection cliente={cliente} clientId={clientId} />

{/* Hábitos Alimentares */}
<FoodHabitsSection cliente={cliente} clientId={clientId} />

{/* Objetivo Expandido */}
<GoalExpandedSection cliente={cliente} clientId={clientId} />
```

#### 2. Criar componentes separados:
- `ProfessionalDataSection.tsx`
- `HealthDataSection.tsx`
- `DigestionDataSection.tsx`
- `FoodHabitsSection.tsx`
- `GoalExpandedSection.tsx`
- `CoachNotesSection.tsx`

---

## 📝 CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1 - Dados Críticos
- [ ] Criar migration para dados profissionais (ou usar custom_fields)
- [ ] Criar migration para saúde geral (ou usar custom_fields)
- [ ] Criar migration para intestino/digestão (ou usar custom_fields)
- [ ] Criar componente `ProfessionalDataSection`
- [ ] Criar componente `HealthDataSection`
- [ ] Criar componente `DigestionDataSection`
- [ ] Atualizar API `/api/coach/clientes/[id]` para salvar novos campos
- [ ] Testar salvamento e carregamento
- [ ] Adicionar validações

### Fase 2 - Dados Importantes
- [ ] Criar migration para hábitos alimentares
- [ ] Criar migration para objetivo expandido
- [ ] Criar componente `FoodHabitsSection`
- [ ] Criar componente `GoalExpandedSection`
- [ ] Expandir aba emocional com motivação
- [ ] Atualizar APIs
- [ ] Testar integração

### Fase 3 - Melhorias
- [ ] Criar componente `CoachNotesSection`
- [ ] Implementar abas colapsáveis
- [ ] Adicionar indicadores de preenchimento
- [ ] Criar formulário progressivo (wizard)
- [ ] Implementar busca avançada
- [ ] Criar exportação PDF
- [ ] Integrar com agenda/programas

---

## 🔄 ESTRATÉGIA DE MIGRAÇÃO DE DADOS

### Para clientes existentes:
1. **Dados em `custom_fields`:** Manter e migrar gradualmente
2. **Dados em `notes`:** Extrair informações estruturadas quando possível
3. **Dados em outras tabelas:** Criar scripts de migração

### Script de migração exemplo:
```sql
-- Migrar dados de custom_fields para novas tabelas
INSERT INTO coach_client_professional (client_id, user_id, occupation, ...)
SELECT 
  id,
  user_id,
  custom_fields->>'professional'->>'occupation',
  ...
FROM coach_clients
WHERE custom_fields->>'professional' IS NOT NULL
ON CONFLICT (client_id) DO NOTHING;
```

---

## 🎯 PRIORIZAÇÃO FINAL

### 🔴 CRÍTICO (Fazer primeiro)
1. Dados profissionais e rotina
2. Saúde geral (medicamentos, restrições)
3. Intestino e digestão

### 🟡 IMPORTANTE (Fazer depois)
4. Hábitos alimentares detalhados
5. Objetivo e meta estruturado
6. Motivação expandida

### 🟢 DESEJÁVEL (Fazer por último)
7. Observações estruturadas da coach
8. Melhorias de UX
9. Integrações avançadas

---

## 📊 MÉTRICAS DE SUCESSO

- **Cobertura de dados:** 90%+ dos campos preenchidos em novos clientes
- **Tempo de cadastro:** < 10 minutos para ficha completa
- **Uso:** 80%+ dos coaches usando todas as seções
- **Satisfação:** Feedback positivo sobre organização

---

## 🚀 PRÓXIMOS PASSOS IMEDIATOS

1. **Decidir estratégia:** `custom_fields` vs tabelas específicas
2. **Criar migrations:** Começar pela Fase 1
3. **Criar componentes:** Interface para novos campos
4. **Atualizar APIs:** Suporte para novos dados
5. **Testar:** Com usuários reais (coaches)

---

## 📌 NOTAS IMPORTANTES

- **Backward compatibility:** Manter suporte para dados antigos
- **Validação:** Validar todos os campos antes de salvar
- **Performance:** Indexar campos de busca frequente
- **Privacidade:** Considerar LGPD para dados sensíveis (saúde)
- **Flexibilidade:** Permitir campos opcionais para não sobrecarregar

---

**Documento criado em:** Dezembro 2025  
**Versão:** 1.0  
**Status:** Proposta - Aguardando aprovação
