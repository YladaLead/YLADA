# 📋 YLADA NUTRI — MÓDULO DE GESTÃO (CRM) - RESUMO EXECUTIVO

## ✅ Requisitos Implementados

### 1. ✅ Centralizar dados da cliente
- Tabela `clients` com todos os dados pessoais
- Endereço completo
- Campos personalizados (JSONB)
- Tags para organização
- Status e relacionamento

### 2. ✅ Mostrar evolução física (peso, medidas, gráficos)
- Tabela `client_evolution` com:
  - Peso, altura, IMC
  - Circunferências (pescoço, tórax, cintura, quadril, braço, coxa)
  - Dobras cutâneas
  - Composição corporal (gordura, massa muscular, água, gordura visceral)
  - Fotos de evolução
- Suporte para gráficos de evolução ao longo do tempo

### 3. ✅ Organizar histórico emocional e comportamental
- **Nova tabela `emotional_behavioral_history`** com:
  - **Registro Emocional:**
    - Estado emocional (ansioso, estressado, motivado, etc.)
    - Nível de estresse (1-10)
    - Score de humor (1-10)
    - Qualidade do sono
    - Nível de energia
  - **Registro Comportamental:**
    - Score de adesão (1-10)
    - Percentual de refeições seguidas
    - Frequência de exercícios
    - Ingestão de água
  - **Padrões e Gatilhos:**
    - Padrões identificados (ex: 'come por ansiedade')
    - Gatilhos comportamentais
  - Observações e notas

### 4. ✅ Registrar reavaliações
- Sistema de reavaliações na tabela `assessments`:
  - Flag `is_reevaluation` para identificar reavaliações
  - Campo `parent_assessment_id` para vincular com avaliação anterior
  - Campo `assessment_number` para numeração sequencial (1ª, 2ª, 3ª...)
  - Campo `comparison_data` (JSONB) para dados comparativos
  - Comparação automática com avaliação anterior

### 5. ✅ Mostrar agenda da cliente
- Tabela `appointments` com:
  - Consultas agendadas
  - Tipos (primeira consulta, retorno, avaliação, acompanhamento)
  - Status (agendado, confirmado, concluído, cancelado, falta)
  - Localização (presencial, online, domicílio)
  - Lembretes
  - Anotações pós-consulta

### 6. ✅ Acompanhar protocolos/programas
- Tabela `programs` com:
  - Planos alimentares
  - Protocolos personalizados
  - Treinamentos
  - Desafios
  - Estrutura flexível (JSONB)
  - Acompanhamento de adesão
  - Período de duração

### 7. ✅ Permitir envio e criação de formulários personalizados
- Tabela `custom_forms` (templates de formulários)
- Tabela `form_responses` (respostas dos clientes)
- Estrutura flexível (JSONB) para diferentes tipos
- Templates reutilizáveis
- Envio para clientes

### 8. ✅ Integrar automaticamente com leads vindos de quizzes e links
- **Campos de integração na tabela `clients`:**
  - `lead_id` - Vínculo com lead original
  - `converted_from_lead` - Flag de conversão
  - `lead_source` - Origem do lead (ex: 'quiz-emagrecimento', 'calculadora-imc')
  - `lead_template_id` - Template que gerou o lead
- Conversão automática preservando todos os dados do lead
- Rastreamento completo da origem

### 9. ✅ Ser simples, profissional e altamente visual
- Interface limpa e intuitiva
- Visual moderno e confiável
- Gráficos e visualizações interativas
- Cards visuais
- Timeline visual
- Design responsivo

### 10. ✅ Trabalhar em conjunto com a Captação
- Integração completa com módulo de Captação
- Leads aparecem automaticamente disponíveis para conversão
- Histórico completo desde captação até acompanhamento
- Métricas de conversão (leads → clientes)
- Rastreamento da origem de cada cliente

---

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais (9 tabelas)

1. **`clients`** - Dados centralizados da cliente + integração com leads
2. **`client_evolution`** - Evolução física (peso, medidas, gráficos)
3. **`appointments`** - Agenda da cliente
4. **`assessments`** - Avaliações e reavaliações
5. **`programs`** - Protocolos/programas
6. **`custom_forms`** - Formulários personalizados (templates)
7. **`form_responses`** - Respostas aos formulários
8. **`client_history`** - Histórico geral de atividades
9. **`emotional_behavioral_history`** - Histórico emocional e comportamental ⭐ NOVO

---

## 📊 Funcionalidades Principais

### Página de Clientes
- Listagem com busca e filtros
- Conversão de leads em clientes (automática)
- Cards visuais
- Ações rápidas (WhatsApp, email, agendar)

### Página de Detalhes do Cliente
- **Dados centralizados**
- **Evolução física** (gráficos de peso, medidas)
- **Histórico emocional/comportamental** (gráficos, padrões)
- **Reavaliações** (com comparações visuais)
- **Agenda** (consultas da cliente)
- **Protocolos/programas**
- **Formulários**
- **Timeline visual** completa

### Página de Agenda
- Calendário visual
- Consultas da cliente
- Agendamento, edição, cancelamento

### Página de Acompanhamento
- Visão geral de todos os clientes
- Gráficos comparativos
- Métricas de adesão
- Alertas e notificações

---

## 🎯 Próximos Passos

1. ✅ Schema do banco de dados criado
2. ⏳ Executar schema no Supabase
3. ⏳ Criar páginas e componentes
4. ⏳ Implementar gráficos e visualizações
5. ⏳ Integrar com módulo de Captação
6. ⏳ Testes e validações

---

**Status:** ✅ Schema Completo | 🚧 Frontend em Desenvolvimento

