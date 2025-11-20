# 🔍 AUDITORIA COMPLETA - Schema Módulo de Gestão Nutri

**Data da Auditoria:** 2024  
**Comparação:** Schema atual vs Checklist Oficial do MVP

---

## 📊 RESUMO EXECUTIVO

| Item | Status | Observação |
|------|--------|------------|
| **Tabelas Obrigatórias** | ⚠️ **PARCIAL** | Algumas tabelas têm nomes diferentes |
| **Campos Obrigatórios** | ⚠️ **PARCIAL** | Alguns campos faltam ou têm nomes diferentes |
| **Relacionamentos** | ✅ **OK** | Todos os relacionamentos estão corretos |
| **Tipos de Dados** | ✅ **OK** | Tipos estão corretos |
| **Permissões (RLS)** | ✅ **OK** | RLS ativado e políticas criadas |
| **Nomenclatura** | ⚠️ **INCONSISTENTE** | Mistura de snake_case e nomes diferentes |

---

## 🟦 1. TABELA: `clients` (obrigatória)

### ✅ O QUE ESTÁ OK
- ✅ `id` (UUID) - Existe
- ✅ `user_id` (UUID) - Existe e referencia `users(id)`
- ✅ `name` (VARCHAR) - Existe
- ✅ `phone` (VARCHAR) - Existe
- ✅ `email` (VARCHAR) - Existe
- ✅ `whatsapp` (VARCHAR) - Existe
- ✅ `created_at` (TIMESTAMP) - Existe
- ✅ `updated_at` (TIMESTAMP) - Existe

### ⚠️ O QUE ESTÁ FALTANDO OU DIFERENTE

| Campo Obrigatório | Status Atual | Ação Necessária |
|-------------------|--------------|-----------------|
| `instagram` | ❌ **FALTA** | Adicionar campo `instagram VARCHAR(100)` |
| `status` | ⚠️ **DIFERENTE** | Atual: `'ativo', 'inativo', 'pausado', 'encerrado'`<br>Esperado: `'lead', 'pre_consulta', 'ativa', 'pausa', 'finalizada'` |
| `goal` | ❌ **FALTA** | Adicionar campo `goal TEXT` ou `goal VARCHAR(255)` |
| `origin` | ⚠️ **DIFERENTE** | Atual: `lead_source VARCHAR(100)`<br>Esperado: `origin VARCHAR(50)` com valores `'quiz', 'link', 'manual'` |
| `origin_id` | ⚠️ **DIFERENTE** | Atual: `lead_template_id UUID` e `lead_id UUID`<br>Esperado: `origin_id UUID` (genérico para quiz ou link) |

### 📝 CAMPOS EXTRAS (Não obrigatórios, mas úteis)
- ✅ `birth_date`, `gender`, `cpf` - Dados adicionais
- ✅ `address_*` - Endereço completo
- ✅ `tags`, `custom_fields` - Organização e flexibilidade
- ✅ `converted_from_lead`, `lead_source`, `lead_template_id` - Integração com Captação

---

## 🟩 2. TABELA: `progress` (evolução física)

### ⚠️ NOME DA TABELA
- **Checklist:** `progress`
- **Schema Atual:** `client_evolution`
- **Ação:** Considerar renomear ou criar alias

### ✅ O QUE ESTÁ OK
- ✅ `id` (UUID) - Existe
- ✅ `client_id` (UUID FK) - Existe e referencia `clients(id)`
- ✅ `weight` (DECIMAL) - Existe como `weight DECIMAL(5,2)`
- ✅ `waist` - Existe como `waist_circumference DECIMAL(5,2)`
- ✅ `hip` - Existe como `hip_circumference DECIMAL(5,2)`
- ✅ `body_fat` - Existe como `body_fat_percentage DECIMAL(5,2)`
- ✅ `muscle_mass` (DECIMAL) - Existe
- ✅ `notes` (TEXT) - Existe
- ✅ `date` - Existe como `measurement_date TIMESTAMP`
- ✅ `created_at` (TIMESTAMP) - Existe

### 📝 CAMPOS EXTRAS (Não obrigatórios, mas úteis)
- ✅ `height`, `bmi` - Altura e IMC
- ✅ Outras circunferências (neck, chest, arm, thigh)
- ✅ Dobras cutâneas
- ✅ Composição corporal completa (bone_mass, water_percentage, visceral_fat)
- ✅ `photos_urls` - Fotos de evolução

---

## 🟨 3. TABELA: `evaluations` (avaliação física inicial)

### ⚠️ NOME DA TABELA
- **Checklist:** `evaluations`
- **Schema Atual:** `assessments`
- **Ação:** Considerar renomear ou criar alias

### ✅ O QUE ESTÁ OK
- ✅ `id` (UUID) - Existe
- ✅ `client_id` (UUID FK) - Existe
- ✅ `weight` - Existe (dentro de `data` JSONB)
- ✅ `body_fat` - Existe (dentro de `data` JSONB)
- ✅ `visceral_fat` - Existe (dentro de `data` JSONB)
- ✅ `bmi` - Existe (dentro de `data` JSONB)
- ✅ `notes` (TEXT) - Existe como `notes` e `interpretation`
- ✅ `date` - Existe como `created_at` e pode ter `completed_at`

### ⚠️ ESTRUTURA DIFERENTE
- **Schema Atual:** Usa `data JSONB` para flexibilidade
- **Checklist:** Campos diretos na tabela
- **Ação:** Decidir se mantém JSONB (mais flexível) ou normaliza campos

### 📝 CAMPOS EXTRAS
- ✅ `assessment_type` - Tipo de avaliação
- ✅ `results`, `interpretation`, `recommendations` - Dados completos
- ✅ `metabolic_age` - Pode estar em `data` JSONB

---

## 🟧 4. TABELA: `emotional_evaluation` (avaliação emocional/comportamental)

### ⚠️ NOME DA TABELA
- **Checklist:** `emotional_evaluation`
- **Schema Atual:** `emotional_behavioral_history`
- **Ação:** Considerar renomear ou criar alias

### ✅ O QUE ESTÁ OK
- ✅ `id` (UUID) - Existe
- ✅ `client_id` (UUID FK) - Existe
- ✅ `notes` (TEXT) - Existe
- ✅ `date` - Existe como `record_date TIMESTAMP`

### ⚠️ CAMPOS OBRIGATÓRIOS - VERIFICAR MAPEAMENTO

| Campo Obrigatório | Status Atual | Mapeamento |
|-------------------|--------------|------------|
| `story` | ⚠️ **PODE ESTAR EM `notes`** | Adicionar campo específico `story TEXT` |
| `moment_of_change` | ❌ **FALTA** | Adicionar campo `moment_of_change TEXT` |
| `commitment` | ⚠️ **PODE ESTAR EM `adherence_score`** | Adicionar campo `commitment INTEGER` (1-10) |
| `biggest_fear` | ❌ **FALTA** | Adicionar campo `biggest_fear TEXT` |
| `behavioral_block` | ⚠️ **PODE ESTAR EM `patterns_identified`** | Adicionar campo `behavioral_block TEXT` |
| `trigger_points` | ✅ **EXISTE** | Existe como `triggers TEXT[]` |

### 📝 CAMPOS EXTRAS (Não obrigatórios, mas úteis)
- ✅ `emotional_state`, `stress_level`, `mood_score`
- ✅ `sleep_quality`, `energy_level`
- ✅ `adherence_score`, `meal_following_percentage`
- ✅ `patterns_identified` - Padrões identificados

---

## 🟥 5. TABELA: `revaluations` (reavaliações)

### ⚠️ NOME DA TABELA
- **Checklist:** `revaluations` (tabela separada)
- **Schema Atual:** Parte de `assessments` com flag `is_reevaluation`
- **Ação:** Decidir se mantém estrutura atual ou cria tabela separada

### ✅ O QUE ESTÁ OK (na estrutura atual)
- ✅ `id` (UUID) - Existe em `assessments`
- ✅ `client_id` (UUID FK) - Existe
- ✅ `weight` - Existe (em `data` JSONB)
- ✅ `waist` - Existe (em `data` JSONB)
- ✅ `hip` - Existe (em `data` JSONB)
- ✅ `notes` (TEXT) - Existe
- ✅ `date` - Existe como `created_at`

### ⚠️ ESTRUTURA DIFERENTE
- **Schema Atual:** Reavaliações são `assessments` com `is_reevaluation = true`
- **Checklist:** Tabela separada `revaluations`
- **Vantagem Atual:** Permite comparação automática via `parent_assessment_id`
- **Ação:** Decidir se mantém ou cria tabela separada

---

## 🟫 6. TABELA: `appointments` (agenda/consultas)

### ✅ O QUE ESTÁ OK
- ✅ `id` (UUID) - Existe
- ✅ `client_id` (UUID FK) - Existe
- ✅ `title` (VARCHAR) - Existe
- ✅ `type` - Existe como `appointment_type VARCHAR(50)`
- ✅ `date` - Existe como `start_time TIMESTAMP`
- ✅ `time` - Existe como `start_time` e `end_time`
- ✅ `status` (VARCHAR) - Existe
- ✅ `notes` (TEXT) - Existe

### ⚠️ VALORES ESPERADOS
- **`type`:** Checklist espera `'consulta', 'reavaliação'`
- **Schema Atual:** `'consulta', 'retorno', 'avaliacao', 'acompanhamento', 'outro'`
- **Ação:** Alinhar valores ou manter mais opções

### 📝 CAMPOS EXTRAS
- ✅ `description`, `duration_minutes`
- ✅ `location_type`, `location_address`, `location_url`
- ✅ `confirmed_at`, `completed_at`, `cancelled_at`
- ✅ `reminder_sent`, `follow_up_required`

---

## 🟪 7. TABELA: `notes` (timeline/histórico)

### ⚠️ NOME DA TABELA
- **Checklist:** `notes`
- **Schema Atual:** `client_history`
- **Ação:** Considerar renomear ou criar alias

### ✅ O QUE ESTÁ OK
- ✅ `id` (UUID) - Existe
- ✅ `client_id` (UUID FK) - Existe
- ✅ `content` - Existe como `description TEXT` e `title VARCHAR`
- ✅ `created_at` (TIMESTAMP) - Existe

### 📝 CAMPOS EXTRAS
- ✅ `activity_type` - Tipo de atividade
- ✅ `metadata` (JSONB) - Dados adicionais
- ✅ `created_by` - Quem criou

---

## 🟦 8. TABELA: `programs` (programa/protocolo atual)

### ✅ O QUE ESTÁ OK
- ✅ `id` (UUID) - Existe
- ✅ `client_id` (UUID FK) - Existe
- ✅ `name` (VARCHAR) - Existe
- ✅ `notes` (TEXT) - Existe
- ✅ `start_date` (DATE) - Existe
- ✅ `end_date` (DATE) - Existe

### ⚠️ O QUE ESTÁ FALTANDO OU DIFERENTE

| Campo Obrigatório | Status Atual | Ação Necessária |
|-------------------|--------------|-----------------|
| `stage` | ❌ **FALTA** | Adicionar campo `stage VARCHAR(50)` ou `stage INTEGER` |
| `weekly_goal` | ❌ **FALTA** | Adicionar campo `weekly_goal TEXT` ou `weekly_goal JSONB` |

### 📝 CAMPOS EXTRAS
- ✅ `description`, `program_type`
- ✅ `content` (JSONB) - Conteúdo completo do programa
- ✅ `status`, `adherence_percentage`
- ✅ `duration_days`

---

## 🟩 9. TABELA: `forms` (criador de formulários)

### ⚠️ NOME DA TABELA
- **Checklist:** `forms`
- **Schema Atual:** `custom_forms`
- **Ação:** Considerar renomear ou criar alias

### ✅ O QUE ESTÁ OK
- ✅ `id` (UUID) - Existe
- ✅ `user_id` (UUID FK) - Existe
- ✅ `name` (VARCHAR) - Existe
- ✅ `description` (TEXT) - Existe
- ✅ `created_at` (TIMESTAMP) - Existe

### 📝 CAMPOS EXTRAS
- ✅ `form_type` - Tipo de formulário
- ✅ `structure` (JSONB) - Estrutura completa do formulário
- ✅ `is_active`, `is_template`

---

## 🟨 10. TABELAS: `form_questions` / `form_answers`

### ⚠️ ESTRUTURA DIFERENTE
- **Checklist:** Tabelas separadas `form_questions` e `form_answers`
- **Schema Atual:** 
  - `form_questions` → `structure JSONB` em `custom_forms`
  - `form_answers` → `form_responses` com `responses JSONB`

### ✅ O QUE ESTÁ OK (na estrutura atual)
- ✅ `form_responses.id` (UUID) - Existe
- ✅ `form_responses.form_id` (UUID FK) - Existe
- ✅ `form_responses.client_id` (UUID FK) - Existe
- ✅ `form_responses.answer` - Existe como `responses JSONB`
- ✅ `form_responses.created_at` (TIMESTAMP) - Existe

### ⚠️ ESTRUTURA DE PERGUNTAS
- **Checklist:** Tabela `form_questions` com campos: `id`, `form_id`, `question`, `type`, `options`
- **Schema Atual:** Perguntas estão em `structure JSONB` dentro de `custom_forms`
- **Ação:** Decidir se normaliza em tabela separada ou mantém JSONB

---

## 🟧 11. TABELA: `photos` (opcional para V2)

### ⚠️ ESTRUTURA DIFERENTE
- **Checklist:** Tabela separada `photos`
- **Schema Atual:** `photos_urls TEXT[]` em `client_evolution`
- **Ação:** Decidir se cria tabela separada ou mantém array

### ✅ O QUE ESTÁ OK (na estrutura atual)
- ✅ URLs de fotos armazenadas
- ✅ Pode ter múltiplas fotos por registro

### ⚠️ CAMPOS FALTANDO
- ❌ `type` (before, after, progress) - Não está explícito
- ❌ `date` específico para cada foto

---

## 🟦 12. RELACIONAMENTOS

### ✅ RELACIONAMENTOS CORRETOS

| Relacionamento | Status | Observação |
|----------------|--------|------------|
| `clients 1:N progress` | ✅ **OK** | `client_evolution.client_id → clients.id` |
| `clients 1:N evaluations` | ✅ **OK** | `assessments.client_id → clients.id` |
| `clients 1:N revaluations` | ✅ **OK** | `assessments.client_id → clients.id` (com `is_reevaluation=true`) |
| `clients 1:N appointments` | ✅ **OK** | `appointments.client_id → clients.id` |
| `clients 1:N notes` | ✅ **OK** | `client_history.client_id → clients.id` |
| `clients 1:N programs` | ✅ **OK** | `programs.client_id → clients.id` |
| `clients 1:N form_answers` | ✅ **OK** | `form_responses.client_id → clients.id` |
| `forms 1:N form_questions` | ⚠️ **JSONB** | Perguntas em `structure JSONB` (não é FK) |
| `forms 1:N form_answers` | ✅ **OK** | `form_responses.form_id → custom_forms.id` |
| `quizzes/links 1:N clients` | ✅ **OK** | `clients.lead_id → leads.id` e `clients.lead_template_id → user_templates.id` |

### ✅ TODOS OS RELACIONAMENTOS ESTÃO CORRETOS

---

## 🟩 13. NOMES PADRONIZADOS

### ⚠️ INCONSISTÊNCIAS ENCONTRADAS

| Checklist | Schema Atual | Status |
|-----------|--------------|--------|
| `progress` | `client_evolution` | ⚠️ Nome diferente |
| `evaluations` | `assessments` | ⚠️ Nome diferente |
| `emotional_evaluation` | `emotional_behavioral_history` | ⚠️ Nome diferente |
| `revaluations` | `assessments` (com flag) | ⚠️ Estrutura diferente |
| `notes` | `client_history` | ⚠️ Nome diferente |
| `forms` | `custom_forms` | ⚠️ Nome diferente |
| `form_questions` | `structure JSONB` | ⚠️ Estrutura diferente |
| `form_answers` | `form_responses` | ⚠️ Nome diferente |

### ✅ PADRONIZAÇÃO
- ✅ Uso consistente de `snake_case`
- ✅ Prefixos consistentes (`client_`, `form_`)
- ✅ Nomes descritivos

---

## 🟦 14. TIPOS DE DADOS

### ✅ TIPOS CORRETOS

| Tipo Esperado | Schema Atual | Status |
|---------------|--------------|--------|
| `weight, waist, hip → numeric` | `DECIMAL(5,2)` | ✅ **OK** |
| `dates → date` | `DATE` ou `TIMESTAMP WITH TIME ZONE` | ✅ **OK** |
| `created_at → timestamp` | `TIMESTAMP WITH TIME ZONE` | ✅ **OK** |
| `status → text` | `VARCHAR(50)` | ✅ **OK** |
| `ids → uuid` | `UUID` | ✅ **OK** |

### ✅ TODOS OS TIPOS ESTÃO CORRETOS

---

## 🟧 15. PERMISSÕES (RLS)

### ✅ RLS ATIVADO
- ✅ Todas as tabelas têm RLS habilitado
- ✅ Políticas criadas para SELECT, INSERT, UPDATE, DELETE
- ✅ Filtro por `user_id` usando `auth.uid() = user_id`

### ✅ PERMISSÕES CORRETAS
- ✅ Apenas o `user_id` dono pode ver/editar
- ✅ Políticas funcionando corretamente

---

## 📋 RESUMO DA AUDITORIA

### ✅ O QUE ESTÁ OK
1. ✅ **Relacionamentos** - Todos corretos
2. ✅ **Tipos de Dados** - Todos corretos
3. ✅ **Permissões (RLS)** - Todas ativas e funcionando
4. ✅ **Estrutura Geral** - Bem organizada
5. ✅ **Campos Extras** - Muitos campos úteis adicionais

### ⚠️ O QUE ESTÁ FALTANDO
1. ⚠️ **Campos em `clients`:**
   - `instagram` (VARCHAR)
   - `goal` (TEXT)
   - Ajustar `status` para valores: `'lead', 'pre_consulta', 'ativa', 'pausa', 'finalizada'`
   - Ajustar `origin` e `origin_id` (atualmente `lead_source` e `lead_template_id`)

2. ⚠️ **Campos em `emotional_behavioral_history`:**
   - `story` (TEXT)
   - `moment_of_change` (TEXT)
   - `commitment` (INTEGER)
   - `biggest_fear` (TEXT)
   - `behavioral_block` (TEXT)

3. ⚠️ **Campos em `programs`:**
   - `stage` (VARCHAR ou INTEGER)
   - `weekly_goal` (TEXT ou JSONB)

### ⚠️ O QUE PRECISA AJUSTAR
1. ⚠️ **Nomenclatura de Tabelas:**
   - Considerar aliases ou renomear para alinhar com checklist
   - `client_evolution` → `progress`
   - `assessments` → `evaluations` (ou manter e criar view)
   - `emotional_behavioral_history` → `emotional_evaluation`
   - `client_history` → `notes`
   - `custom_forms` → `forms`
   - `form_responses` → `form_answers`

2. ⚠️ **Estrutura de Reavaliações:**
   - Decidir: manter em `assessments` com flag ou criar tabela `revaluations` separada

3. ⚠️ **Estrutura de Formulários:**
   - Decidir: manter `structure JSONB` ou criar tabela `form_questions`

4. ⚠️ **Estrutura de Fotos:**
   - Decidir: manter `photos_urls TEXT[]` ou criar tabela `photos`

---

## 💡 SUGESTÕES DE MELHORIA

### 1. **Migração de Nomenclatura (Opcional)**
Criar views ou aliases para manter compatibilidade:
```sql
CREATE VIEW progress AS SELECT * FROM client_evolution;
CREATE VIEW evaluations AS SELECT * FROM assessments WHERE is_reevaluation = false;
CREATE VIEW revaluations AS SELECT * FROM assessments WHERE is_reevaluation = true;
CREATE VIEW notes AS SELECT * FROM client_history;
CREATE VIEW forms AS SELECT * FROM custom_forms;
CREATE VIEW form_answers AS SELECT * FROM form_responses;
```

### 2. **Adicionar Campos Faltantes**
Criar script de migração para adicionar campos obrigatórios.

### 3. **Normalizar Estruturas (Opcional)**
Considerar normalizar `form_questions` e `photos` em tabelas separadas se necessário para queries mais complexas.

### 4. **Manter Flexibilidade**
A estrutura atual com JSONB oferece mais flexibilidade. Avaliar se vale a pena normalizar.

---

## ✅ CONCLUSÃO

**Status Geral:** ⚠️ **PARCIALMENTE CONFORME**

- **Estrutura:** ✅ Sólida e bem organizada
- **Relacionamentos:** ✅ Todos corretos
- **Permissões:** ✅ Todas ativas
- **Nomenclatura:** ⚠️ Diferente do checklist (mas funcional)
- **Campos:** ⚠️ Alguns campos faltam, mas há campos extras úteis

**Recomendação:** Adicionar campos faltantes e considerar criar views/aliases para compatibilidade com o checklist, mantendo a estrutura atual que é mais flexível.

---

**Próximos Passos:**
1. Criar script de migração para adicionar campos faltantes
2. Decidir sobre nomenclatura (renomear ou criar views)
3. Decidir sobre estruturas (normalizar ou manter JSONB)

