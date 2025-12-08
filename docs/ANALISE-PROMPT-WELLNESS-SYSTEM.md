# 📋 ANÁLISE DO PROMPT - WELLNESS SYSTEM

## ✅ SITUAÇÃO ATUAL DO PROJETO

O sistema Wellness **JÁ ESTÁ IMPLEMENTADO** e funcional. O prompt do ChatGPT parece ser para criar do zero, mas precisamos **ADAPTAR** para **COMPLEMENTAR** o que já existe.

---

## 🔍 COMPARAÇÃO: PROMPT vs REALIDADE

### 1. TABELAS PROPOSTAS vs EXISTENTES

| Tabela Proposta | Status | Tabela Existente | Ajuste Necessário |
|----------------|--------|------------------|-------------------|
| `users` | ✅ Existe | `auth.users` (Supabase) | Nenhum - usar auth.users |
| `clients` | ❌ Não existe | - | **CRIAR** - útil para gestão de clientes |
| `pv_records` | ⚠️ Parcial | `ylada_wellness_progresso.pv_dia` | **ADAPTAR** - criar tabela mensal separada |
| `tools` | ✅ Existe | `user_templates`, `coach_user_templates` | Nenhum - já funcional |
| `scripts` | ✅ Existe | Sistema de scripts em código | Nenhum - já funcional |
| `noel_interactions` | ✅ Existe | `wellness_user_queries`, `ylada_wellness_interacoes` | Nenhum - já funcional |
| `career_progress` | ⚠️ Parcial | `ylada_wellness_consultores.estagio_negocio` | **COMPLEMENTAR** - adicionar níveis detalhados |

---

## 🟢 O QUE JÁ ESTÁ PRONTO (NÃO PRECISA CRIAR)

### ✅ Dashboard
- `/pt/wellness/dashboard-novo` - Dashboard completo e funcional
- Exibe objetivos, ferramentas, scripts, configurações
- Integração com NOEL

### ✅ NOEL (IA Mentora)
- `/api/wellness/noel` - Endpoint funcional
- Integração com Agent Builder
- Base de conhecimento
- Sistema de aprendizado

### ✅ Ferramentas
- Sistema completo de templates
- Criação, edição, preview
- Links personalizados
- QR Codes

### ✅ Scripts
- Sistema completo de scripts
- Categorização por tipo de pessoa e objetivo
- Biblioteca organizada

### ✅ Fluxos de Recrutamento
- 9 fluxos completos implementados
- Diagnósticos funcionais
- Links personalizados

---

## 🟡 O QUE PRECISA SER CRIADO/COMPLEMENTADO

### 1. Tabela `clients` (Gestão de Clientes)

**Proposta do Prompt:**
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users.id,
  name TEXT,
  phone TEXT,
  goals TEXT,
  pv_category ENUM('50', '75', '100', 'unknown'),
  notes TEXT,
  last_purchase DATE,
  created_at TIMESTAMP
);
```

**Ajuste Necessário:**
- Usar `auth.users(id)` ao invés de `users.id`
- Adicionar campos: `email`, `status`, `origin`
- Nome sugerido: `wellness_clients` (seguindo padrão)

### 2. Tabela `pv_records` (Registros Mensais de PV)

**Proposta do Prompt:**
```sql
CREATE TABLE pv_records (
  id UUID PRIMARY KEY,
  user_id UUID,
  month TEXT, -- "2025-01"
  pv_kits NUMERIC,
  pv_turbo NUMERIC,
  pv_hype NUMERIC,
  pv_closed_products NUMERIC,
  pv_team NUMERIC,
  pv_total NUMERIC,
  created_at TIMESTAMP
);
```

**Ajuste Necessário:**
- Nome sugerido: `wellness_pv_records`
- Relacionar com `auth.users(id)`
- Adicionar índices para consultas mensais

### 3. Tabela `career_progress` (Progresso de Carreira)

**Proposta do Prompt:**
```sql
CREATE TABLE career_progress (
  id UUID PRIMARY KEY,
  user_id UUID,
  pv_current_month NUMERIC,
  pv_last_4_months NUMERIC[],
  team_pv NUMERIC,
  level ENUM('iniciante', '500pv', '1000pv', 'ativo_2500pv', 'equipe_mundial', 'get', 'milionário', 'presidente'),
  created_at TIMESTAMP
);
```

**Ajuste Necessário:**
- Nome sugerido: `wellness_career_progress`
- Relacionar com `ylada_wellness_consultores` (já existe estagio_negocio)
- Adicionar campos: `next_level_pv_required`, `progress_percentage`

---

## 🔧 AJUSTES DE NOMENCLATURA

### Padrão Atual do Projeto:
- Prefixo `wellness_` para tabelas Wellness
- Prefixo `ylada_wellness_` para tabelas NOEL
- Uso de `auth.users` do Supabase

### Ajustes no Prompt:
1. **`users`** → Usar `auth.users` (já existe)
2. **`clients`** → `wellness_clients`
3. **`pv_records`** → `wellness_pv_records`
4. **`tools`** → Já existe como `user_templates`
5. **`scripts`** → Sistema em código (não precisa tabela)
6. **`noel_interactions`** → Já existe como `wellness_user_queries`
7. **`career_progress`** → `wellness_career_progress`

---

## 📊 TELAS PROPOSTAS vs EXISTENTES

| Tela Proposta | Status | Tela Existente |
|--------------|--------|----------------|
| Dashboard | ✅ Existe | `/pt/wellness/dashboard-novo` |
| Ferramentas | ✅ Existe | Integrado no dashboard |
| Scripts | ✅ Existe | Integrado no dashboard |
| NOEL Chat | ✅ Existe | `WellnessChatWidget` |
| Carreira | ❌ Não existe | **CRIAR** |
| Recrutamento | ✅ Existe | Fluxos já implementados |

---

## 🎯 O QUE REALMENTE PRECISA SER FEITO

### Prioridade 1: Criar Tabelas Faltantes
1. ✅ `wellness_clients` - Gestão de clientes
2. ✅ `wellness_pv_records` - Registros mensais de PV
3. ✅ `wellness_career_progress` - Progresso de carreira

### Prioridade 2: Criar Tela de Carreira
- Exibir nível atual
- Progresso (PV)
- Metas dos próximos níveis
- Linha do tempo visual

### Prioridade 3: Endpoints API
1. ✅ `/api/wellness/clients` - CRUD de clientes
2. ✅ `/api/wellness/pv/update` - Atualizar PV mensal
3. ✅ `/api/wellness/career` - Dados de carreira

---

## ⚠️ PROBLEMAS IDENTIFICADOS NO PROMPT

1. **Duplicação de Funcionalidades:**
   - Prompt propõe criar `tools` e `scripts` como tabelas
   - Já existem sistemas funcionais em código
   - **Solução:** Manter sistema atual, não criar tabelas

2. **Nomenclatura Inconsistente:**
   - Prompt usa `users` genérico
   - Projeto usa `auth.users` + `user_profiles`
   - **Solução:** Adaptar para padrão existente

3. **Estrutura de NOEL:**
   - Prompt propõe tabela simples `noel_interactions`
   - Sistema atual tem estrutura mais rica (`wellness_user_queries`, `wellness_consultant_profile`, etc.)
   - **Solução:** Manter estrutura atual

---

## ✅ RECOMENDAÇÃO FINAL

### O que fazer:
1. ✅ **Criar apenas as 3 tabelas faltantes** (clients, pv_records, career_progress)
2. ✅ **Criar tela de Carreira** (única tela faltante)
3. ✅ **Criar endpoints API** para as novas tabelas
4. ✅ **Manter tudo que já existe** funcionando

### O que NÃO fazer:
1. ❌ Não recriar tabelas que já existem
2. ❌ Não duplicar funcionalidades
3. ❌ Não mudar nomenclatura do que já funciona

---

## 📝 PRÓXIMOS PASSOS SUGERIDOS

1. Criar script SQL para as 3 tabelas novas
2. Criar página `/pt/wellness/carreira`
3. Criar endpoints API necessários
4. Integrar com dashboard existente
5. Testar funcionalidades

---

**Status:** ✅ Prompt analisado e adaptado para realidade do projeto
**Ação:** Criar apenas o que está faltando, manter o que já funciona





