# 📋 YLADA NUTRI — MÓDULO DE GESTÃO (CRM)

## 🎯 Visão Geral

**Título:** ILADA NUTRI — ÁREA DE GESTÃO (MVP)  
**Subtítulo:** CRM Inteligente, Prático e Integrado para Nutricionistas

Este módulo organiza e centraliza todas as informações e atividades relacionadas à gestão de clientes na área Nutri.

> 📌 **Checklist Oficial do MVP:** Ver [`REQUISITOS-MVP-GESTAO-NUTRI.md`](./REQUISITOS-MVP-GESTAO-NUTRI.md) para a lista completa de funcionalidades obrigatórias.

---

## 📦 Componentes do Módulo

### 1. **Dados da Cliente**
- Informações pessoais completas
- Dados de contato (email, telefone, WhatsApp)
- Endereço completo
- Campos personalizados (JSONB)
- Tags para organização
- Histórico de status (ativo, inativo, pausado, encerrado)

### 2. **Evolução**
- Medidas corporais (peso, altura, IMC)
- Circunferências (pescoço, tórax, cintura, quadril, braço, coxa)
- Dobras cutâneas (opcional)
- Composição corporal (gordura, massa muscular, água, gordura visceral)
- Fotos de evolução (antes/depois)
- Gráficos de progresso ao longo do tempo

### 3. **Histórico**
- Log completo de todas as atividades
- Timeline de eventos
- Consultas realizadas
- Avaliações feitas
- Programas criados/atualizados
- Notas e observações
- Alterações de status
- **Histórico Emocional e Comportamental**
  - Registro de estado emocional (ansiedade, estresse, motivação)
  - Níveis de estresse e humor (scores 1-10)
  - Qualidade do sono
  - Nível de energia
  - Adesão ao programa (scores e percentuais)
  - Padrões identificados (ex: come por ansiedade)
  - Gatilhos comportamentais
  - Gráficos de evolução emocional/comportamental

### 4. **Agenda**
- Calendário de consultas
- Agendamentos (presencial, online, domicílio)
- Tipos de consulta (primeira consulta, retorno, avaliação, acompanhamento)
- Status (agendado, confirmado, em andamento, concluído, cancelado, falta)
- Lembretes automáticos
- Sugestão de próximas consultas

### 5. **Avaliações e Reavaliações**
- Avaliações antropométricas
- Bioimpedância
- Anamnese
- Questionários personalizados
- **Sistema de Reavaliações**
  - Vinculação com avaliação anterior
  - Numeração sequencial (1ª, 2ª, 3ª avaliação...)
  - Comparação automática com avaliação anterior
  - Dados comparativos (diferenças, percentuais)
  - Gráficos de evolução entre avaliações
- Estrutura flexível (JSONB) para diferentes tipos
- Resultados e interpretações
- Recomendações baseadas na avaliação

### 6. **Programas**
- Planos alimentares
- Protocolos personalizados
- Treinamentos
- Desafios
- Estrutura flexível (JSONB)
- Acompanhamento de adesão
- Período de duração

### 7. **Formulários Personalizados**
- Criação de formulários customizados
- Templates reutilizáveis
- Diferentes tipos (questionário, anamnese, avaliação, consentimento)
- Estrutura flexível (JSONB)
- Respostas dos clientes
- Histórico de preenchimentos

### 8. **Integração Automática com Leads da Captação**
- **Conversão automática de leads em clientes**
  - Botão "Converter em Cliente" na página de leads
  - Importação automática de dados (nome, email, telefone, WhatsApp)
  - Preservação de dados adicionais do lead (additional_data JSONB)
- **Rastreamento completo**
  - Vínculo com lead original (lead_id)
  - Origem do lead (lead_source: 'quiz-emagrecimento', 'calculadora-imc', etc.)
  - Template que gerou o lead (lead_template_id)
  - Flag de conversão (converted_from_lead)
- **Trabalho em conjunto com Captação**
  - Leads aparecem automaticamente disponíveis para conversão
  - Histórico completo desde a captação até o acompanhamento
  - Métricas de conversão (leads → clientes)

---

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

1. **`clients`** - Clientes (conversão de leads) + integração com Captação
2. **`client_evolution`** - Evolução física (peso, medidas, gráficos)
3. **`appointments`** - Agenda e consultas
4. **`assessments`** - Avaliações e **reavaliações** (com comparação)
5. **`programs`** - Programas/planos (protocolos)
6. **`custom_forms`** - Formulários personalizados (templates)
7. **`form_responses`** - Respostas aos formulários
8. **`client_history`** - Histórico geral de atividades
9. **`emotional_behavioral_history`** - Histórico emocional e comportamental

### Relacionamentos

```
users (nutricionista)
  ├── clients (1:N)
  │   ├── client_evolution (1:N)
  │   ├── appointments (1:N)
  │   ├── assessments (1:N)
  │   ├── programs (1:N)
  │   ├── form_responses (1:N)
  │   └── client_history (1:N)
  │
  ├── custom_forms (1:N)
  └── leads (1:N) → clients (conversão)
```

---

## 📁 Estrutura de Arquivos

```
src/app/pt/nutri/
├── clientes/
│   ├── page.tsx                    # Listagem de clientes
│   ├── [id]/
│   │   └── page.tsx                # Detalhes do cliente
│   └── novo/
│       └── page.tsx                # Novo cliente (conversão de lead)
│
├── agenda/
│   ├── page.tsx                    # Calendário de consultas
│   └── [id]/
│       └── page.tsx                # Detalhes da consulta
│
├── acompanhamento/
│   ├── page.tsx                    # Visão geral de acompanhamento
│   └── [id]/
│       └── page.tsx                # Acompanhamento específico
│
└── componentes/
    └── gestao/
        ├── ClientCard.tsx          # Card de cliente
        ├── EvolutionChart.tsx     # Gráfico de evolução
        ├── AssessmentForm.tsx     # Formulário de avaliação
        ├── ProgramCard.tsx         # Card de programa
        ├── AppointmentCalendar.tsx # Calendário de consultas
        └── ClientTimeline.tsx     # Timeline do histórico
```

---

## 🚀 Funcionalidades Principais

### Página de Clientes (`/pt/nutri/clientes`)
- ✅ Listagem de todos os clientes
- ✅ Busca e filtros (nome, status, tags)
- ✅ Cards com informações resumidas
- ✅ Conversão de leads em clientes
- ✅ Criação manual de clientes
- ✅ Ações rápidas (WhatsApp, email, agendar)

### Página de Detalhes do Cliente (`/pt/nutri/clientes/[id]`)
- ✅ Dados completos do cliente (centralizados)
- ✅ **Aba de Evolução Física**
  - Gráficos de peso, IMC, medidas
  - Gráficos de circunferências
  - Composição corporal
  - Fotos de evolução (antes/depois)
- ✅ **Aba de Histórico Emocional e Comportamental**
  - Timeline de registros emocionais
  - Gráficos de estado emocional
  - Padrões identificados
  - Gatilhos comportamentais
  - Adesão ao programa
- ✅ Aba de Histórico Geral (timeline completa)
- ✅ Aba de Agenda (consultas da cliente)
- ✅ Aba de Avaliações e Reavaliações (com comparações)
- ✅ Aba de Programas/Protocolos
- ✅ Aba de Formulários
- ✅ Notas e observações
- ✅ **Visualização altamente visual e profissional**

### Página de Agenda (`/pt/nutri/agenda`)
- ✅ Calendário mensal/semanal/diário
- ✅ Visualização de consultas
- ✅ Criação de agendamentos
- ✅ Edição e cancelamento
- ✅ Lembretes
- ✅ Filtros (status, tipo, cliente)

### Página de Acompanhamento (`/pt/nutri/acompanhamento`)
- ✅ Visão geral de todos os clientes
- ✅ Gráficos comparativos
- ✅ Métricas de adesão
- ✅ Alertas e notificações
- ✅ Relatórios

---

## 🔄 Fluxos Principais

### 1. Conversão de Lead em Cliente
```
Lead (módulo Captação)
  ↓
Botão "Converter em Cliente"
  ↓
Formulário de criação de cliente
  ↓
Cliente criado (vinculado ao lead)
  ↓
Redirecionamento para página do cliente
```

### 2. Nova Consulta
```
Página de Agenda
  ↓
Botão "Nova Consulta"
  ↓
Seleção de cliente (ou criação)
  ↓
Preenchimento de dados
  ↓
Agendamento criado
  ↓
Notificação/lembrete
```

### 3. Nova Avaliação
```
Página do Cliente
  ↓
Aba "Avaliações"
  ↓
Botão "Nova Avaliação"
  ↓
Seleção de tipo
  ↓
Preenchimento de dados
  ↓
Avaliação salva
  ↓
Registro no histórico
```

### 4. Criação de Programa
```
Página do Cliente
  ↓
Aba "Programas"
  ↓
Botão "Novo Programa"
  ↓
Seleção de tipo
  ↓
Preenchimento de conteúdo
  ↓
Programa criado
  ↓
Registro no histórico
```

---

## 🎨 Design e UX

### Princípios
- **Simples** - Interface limpa e intuitiva
- **Profissional** - Visual moderno e confiável
- **Altamente Visual** - Gráficos, cards, timeline, visualizações

### Cores
- **Verde** - Área de Gestão (já definido no sidebar)
- **Azul** - Ações e links
- **Cinza** - Textos secundários
- **Gradientes** - Para gráficos e visualizações

### Componentes Reutilizáveis
- Cards consistentes e visuais
- Formulários padronizados
- **Gráficos responsivos e interativos**
  - Gráficos de evolução física (peso, medidas)
  - Gráficos emocionais/comportamentais
  - Comparações entre avaliações
- Timeline visual
- Modais para ações
- Notificações de sucesso/erro
- Visualizações de dados (dashboards)

---

## 📊 Métricas e KPIs

- Total de clientes ativos
- Novos clientes no período
- Taxa de conversão (leads → clientes)
- Consultas agendadas/concluídas
- Adesão aos programas
- Evolução média dos clientes

---

## 🔐 Segurança

- Row Level Security (RLS) habilitado
- Usuários só veem seus próprios dados
- Políticas de acesso por user_id
- Validação de dados no frontend e backend

---

## 📝 Próximos Passos (Baseado no Checklist Oficial)

### Prioridade 1 - Funcionalidades Básicas
1. ✅ Criar schema do banco de dados
2. ⏳ **Lista de Clientes** - Página principal com listagem, busca e filtros
3. ⏳ **Trello/Kanban de Clientes** - Visualização em colunas com drag & drop
4. ⏳ **Perfil Completo da Cliente** - Página de detalhes com todas as abas

### Prioridade 2 - Funcionalidades do Perfil
5. ⏳ Aba: Informações Básicas
6. ⏳ Aba: Evolução Física (gráficos)
7. ⏳ Aba: Avaliação Física
8. ⏳ Aba: Avaliação Emocional/Comportamental
9. ⏳ Aba: Reavaliações
10. ⏳ Aba: Agenda
11. ⏳ Aba: Histórico Timeline
12. ⏳ Aba: Programa Atual

### Prioridade 3 - Funcionalidades Avançadas
13. ⏳ **Criador de Formulários Personalizados**
14. ⏳ **Envio de Formulários**
15. ⏳ **Relatórios Visuais Simples**
16. ⏳ **Integração com Captação** (conversão de leads)

> 📋 Ver checklist completo em [`REQUISITOS-MVP-GESTAO-NUTRI.md`](./REQUISITOS-MVP-GESTAO-NUTRI.md)

---

## 📚 Documentação Técnica

- **Schema SQL:** `schema-gestao-nutri.sql`
- **API Routes:** A definir
- **Componentes:** `src/components/nutri/gestao/`
- **Páginas:** `src/app/pt/nutri/clientes/`, `agenda/`, `acompanhamento/`

---

**Status:** 🚧 Em Desenvolvimento (MVP)

