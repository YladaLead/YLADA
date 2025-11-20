# 📋 PLANO DE IMPLEMENTAÇÃO - MÓDULO DE GESTÃO NUTRI

## 🎯 Visão Geral

Este documento detalha o passo a passo completo para construir toda a área de Gestão do módulo Nutri, seguindo o MVP checklist oficial.

---

## 📊 FASE 1: FUNDAÇÃO E INFRAESTRUTURA

### ✅ 1.1 Schema do Banco de Dados (CONCLUÍDO)
- [x] Criar todas as tabelas necessárias
- [x] Configurar relacionamentos (FKs)
- [x] Implementar RLS (Row Level Security)
- [x] Criar índices para performance
- [x] Adicionar triggers e funções

**Status:** ✅ Completo
**Arquivos:** `schema-gestao-nutri.sql`, `migrations/migrate-gestao-nutri-complete.sql`

---

### 🔧 1.2 APIs e Backend (PRÓXIMO PASSO)

#### 1.2.1 API de Clientes
**Arquivo:** `src/app/api/nutri/clientes/route.ts`

**Endpoints necessários:**
- `GET /api/nutri/clientes` - Listar clientes (com busca, filtros, paginação)
- `GET /api/nutri/clientes/[id]` - Detalhes de um cliente
- `POST /api/nutri/clientes` - Criar novo cliente
- `PUT /api/nutri/clientes/[id]` - Atualizar cliente
- `DELETE /api/nutri/clientes/[id]` - Deletar cliente (soft delete)
- `POST /api/nutri/clientes/[id]/convert-from-lead` - Converter lead em cliente

**Funcionalidades:**
- Busca por nome, email, telefone
- Filtros: status, origem, data de criação
- Ordenação: nome, data, status
- Paginação
- Validação de dados
- RLS (apenas clientes do user_id)

#### 1.2.2 API de Evolução Física
**Arquivo:** `src/app/api/nutri/clientes/[id]/evolucao/route.ts`

**Endpoints:**
- `GET /api/nutri/clientes/[id]/evolucao` - Listar evoluções
- `POST /api/nutri/clientes/[id]/evolucao` - Registrar nova evolução
- `PUT /api/nutri/clientes/[id]/evolucao/[evolucaoId]` - Atualizar evolução
- `DELETE /api/nutri/clientes/[id]/evolucao/[evolucaoId]` - Deletar evolução

#### 1.2.3 API de Avaliações
**Arquivo:** `src/app/api/nutri/clientes/[id]/avaliacoes/route.ts`

**Endpoints:**
- `GET /api/nutri/clientes/[id]/avaliacoes` - Listar avaliações
- `POST /api/nutri/clientes/[id]/avaliacoes` - Criar avaliação inicial
- `POST /api/nutri/clientes/[id]/avaliacoes/reevaluacao` - Criar reavaliação
- `GET /api/nutri/clientes/[id]/avaliacoes/[avaliacaoId]/comparacao` - Comparar com avaliação anterior

#### 1.2.4 API de Agenda
**Arquivo:** `src/app/api/nutri/appointments/route.ts`

**Endpoints:**
- `GET /api/nutri/appointments` - Listar consultas (com filtros de data, cliente)
- `POST /api/nutri/appointments` - Criar consulta
- `PUT /api/nutri/appointments/[id]` - Atualizar consulta
- `DELETE /api/nutri/appointments/[id]` - Cancelar consulta

#### 1.2.5 API de Histórico/Timeline
**Arquivo:** `src/app/api/nutri/clientes/[id]/historico/route.ts`

**Endpoints:**
- `GET /api/nutri/clientes/[id]/historico` - Timeline completa
- `POST /api/nutri/clientes/[id]/historico` - Adicionar evento ao histórico

---

## 🎨 FASE 2: INTERFACE - LISTA DE CLIENTES

### 📄 2.1 Página Principal de Clientes
**Arquivo:** `src/app/pt/nutri/clientes/page.tsx`

**Funcionalidades:**
- [ ] Listagem de clientes em cards ou tabela
- [ ] Barra de busca (nome, email, telefone)
- [ ] Filtros:
  - Status (lead, pre_consulta, ativa, pausa, finalizada)
  - Origem do lead
  - Data de criação
- [ ] Ordenação (nome, data, status)
- [ ] Paginação
- [ ] Botão "Novo Cliente"
- [ ] Botão "Converter Lead"
- [ ] Ações rápidas por cliente:
  - Ver perfil
  - Agendar consulta
  - Adicionar evolução
  - Ver histórico

**Componentes necessários:**
- `ClientList.tsx` - Lista principal
- `ClientCard.tsx` - Card individual
- `ClientFilters.tsx` - Filtros e busca
- `ClientSearch.tsx` - Barra de busca

---

### 📌 2.2 Trello/Kanban de Clientes
**Arquivo:** `src/app/pt/nutri/clientes/kanban/page.tsx`

**Funcionalidades:**
- [ ] Visualização em colunas por status
- [ ] Drag & drop entre colunas
- [ ] Contadores por coluna
- [ ] Filtros (origem, data)
- [ ] Busca
- [ ] Modal de detalhes ao clicar no card
- [ ] Atualização de status via drag & drop

**Componentes necessários:**
- `KanbanBoard.tsx` - Board principal
- `KanbanColumn.tsx` - Coluna individual
- `KanbanCard.tsx` - Card arrastável
- `useDragAndDrop.ts` - Hook para drag & drop

**Bibliotecas sugeridas:**
- `@dnd-kit/core` ou `react-beautiful-dnd` para drag & drop

---

## 👤 FASE 3: PERFIL COMPLETO DA CLIENTE

### 📋 3.1 Página de Detalhes do Cliente
**Arquivo:** `src/app/pt/nutri/clientes/[id]/page.tsx`

**Estrutura:**
- Header com nome, foto (se houver), status
- Abas de navegação:
  1. Informações Básicas
  2. Evolução Física
  3. Avaliação Física
  4. Avaliação Emocional/Comportamental
  5. Reavaliações
  6. Agenda
  7. Histórico Timeline
  8. Programa Atual

**Componentes:**
- `ClientHeader.tsx` - Header com informações principais
- `ClientTabs.tsx` - Navegação por abas
- `ClientInfoTab.tsx` - Aba de informações básicas
- `ClientEvolutionTab.tsx` - Aba de evolução
- `ClientAssessmentTab.tsx` - Aba de avaliação
- `ClientEmotionalTab.tsx` - Aba emocional/comportamental
- `ClientReevaluationsTab.tsx` - Aba de reavaliações
- `ClientAgendaTab.tsx` - Aba de agenda
- `ClientTimelineTab.tsx` - Aba de histórico
- `ClientProgramTab.tsx` - Aba de programa

---

### 📝 3.2 Aba: Informações Básicas
**Arquivo:** `src/components/nutri/clientes/ClientInfoTab.tsx`

**Campos:**
- [ ] Dados Pessoais:
  - Nome completo
  - Data de nascimento
  - CPF (opcional)
  - Gênero
  - Foto de perfil (upload)
- [ ] Contato:
  - Email
  - Telefone
  - WhatsApp
  - Instagram
- [ ] Endereço:
  - CEP, Rua, Número, Complemento
  - Bairro, Cidade, Estado
- [ ] Origem do Lead:
  - Mostrar origem (quiz, calculadora, link)
  - Data de conversão
  - Link para lead original (se aplicável)
- [ ] Campos Personalizados:
  - Renderizar campos customizados do user
- [ ] Meta/Objetivo:
  - Campo de texto para objetivo da cliente

**Funcionalidades:**
- [ ] Edição inline ou modal
- [ ] Validação de formulário
- [ ] Upload de foto
- [ ] Salvar alterações

---

### 📈 3.3 Aba: Evolução Física
**Arquivo:** `src/components/nutri/clientes/ClientEvolutionTab.tsx`

**Funcionalidades:**
- [ ] Gráficos:
  - Peso ao longo do tempo (linha)
  - IMC ao longo do tempo (linha)
  - Circunferências (barras ou linhas)
  - Composição corporal (% gordura, massa magra)
- [ ] Tabela histórica:
  - Data, Peso, IMC, Medidas, % Gordura
  - Ações: Editar, Deletar
- [ ] Fotos de evolução:
  - Galeria de fotos com data
  - Comparação lado a lado
- [ ] Botão "Adicionar Registro"
- [ ] Modal de registro:
  - Data
  - Peso
  - Medidas (cintura, quadril, braço, etc.)
  - Composição corporal
  - Fotos (múltiplas)

**Componentes:**
- `EvolutionChart.tsx` - Gráficos (usar Chart.js ou Recharts)
- `EvolutionTable.tsx` - Tabela histórica
- `EvolutionPhotos.tsx` - Galeria de fotos
- `EvolutionForm.tsx` - Formulário de registro

**Bibliotecas sugeridas:**
- `recharts` ou `chart.js` para gráficos

---

### 🏥 3.4 Aba: Avaliação Física
**Arquivo:** `src/components/nutri/clientes/ClientAssessmentTab.tsx`

**Funcionalidades:**
- [ ] Formulário de avaliação:
  - Antropométrica:
    - Altura, Peso
    - Circunferências
    - Dobras cutâneas
  - Bioimpedância:
    - % Gordura
    - Massa magra
    - Água corporal
    - Metabolismo basal
  - Anamnese:
    - Histórico médico
    - Medicamentos
    - Alergias
    - Objetivos
  - Resultados e Recomendações:
    - Campo de texto livre
- [ ] Visualização de avaliações anteriores
- [ ] Botão "Nova Avaliação"
- [ ] Botão "Nova Reavaliação" (cria reavaliação vinculada)

**Componentes:**
- `AssessmentForm.tsx` - Formulário completo
- `AssessmentView.tsx` - Visualização de avaliação salva
- `AssessmentComparison.tsx` - Comparação entre avaliações

---

### 💭 3.5 Aba: Avaliação Emocional/Comportamental
**Arquivo:** `src/components/nutri/clientes/ClientEmotionalTab.tsx`

**Funcionalidades:**
- [ ] Formulário de registro:
  - Estado emocional (escala ou seleção)
  - Nível de estresse (1-10)
  - Humor (1-10)
  - Qualidade do sono
  - Nível de energia
  - Adesão ao programa (1-10)
  - % de refeições seguidas
  - Frequência de exercícios
  - Ingestão de água (litros)
  - Padrões identificados (tags)
  - Gatilhos (tags)
  - Notas comportamentais
  - História pessoal (story)
  - Momento de mudança
  - Comprometimento (1-10)
  - Maior medo
  - Bloqueio comportamental
- [ ] Gráficos de evolução:
  - Estresse ao longo do tempo
  - Humor ao longo do tempo
  - Adesão ao longo do tempo
  - Padrões identificados (nuvem de tags)
- [ ] Histórico de registros
- [ ] Botão "Novo Registro"

**Componentes:**
- `EmotionalForm.tsx` - Formulário de registro
- `EmotionalCharts.tsx` - Gráficos de evolução
- `EmotionalHistory.tsx` - Histórico de registros

---

### 🔄 3.6 Aba: Reavaliações
**Arquivo:** `src/components/nutri/clientes/ClientReevaluationsTab.tsx`

**Funcionalidades:**
- [ ] Lista de avaliações (inicial + reavaliações)
- [ ] Numeração sequencial automática
- [ ] Comparação visual:
  - Side-by-side de métricas
  - Gráficos comparativos
  - Diferenças destacadas (positivas/negativas)
- [ ] Dados de comparação automática:
  - Diferença de peso
  - Diferença de IMC
  - Diferença de medidas
  - Diferença de composição corporal
- [ ] Botão "Nova Reavaliação"
- [ ] Visualização de histórico completo

**Componentes:**
- `ReevaluationList.tsx` - Lista de avaliações
- `ReevaluationComparison.tsx` - Comparação visual
- `ReevaluationForm.tsx` - Formulário de nova reavaliação

---

### 📅 3.7 Aba: Agenda
**Arquivo:** `src/components/nutri/clientes/ClientAgendaTab.tsx`

**Funcionalidades:**
- [ ] Calendário específico da cliente
- [ ] Visualização:
  - Mês atual
  - Lista de consultas
- [ ] Tipos de consulta:
  - Presencial
  - Online
  - Retorno
  - Acompanhamento
- [ ] Status:
  - Agendada
  - Confirmada
  - Realizada
  - Cancelada
- [ ] Informações:
  - Data e hora
  - Localização (se presencial)
  - Link (se online)
  - Lembrete configurado
- [ ] Notas pós-consulta
- [ ] Botão "Agendar Consulta"

**Componentes:**
- `ClientCalendar.tsx` - Calendário
- `AppointmentCard.tsx` - Card de consulta
- `AppointmentForm.tsx` - Formulário de agendamento

---

### 📜 3.8 Aba: Histórico Timeline
**Arquivo:** `src/components/nutri/clientes/ClientTimelineTab.tsx`

**Funcionalidades:**
- [ ] Timeline visual vertical
- [ ] Eventos:
  - Criação do cadastro
  - Avaliações
  - Reavaliações
  - Evoluções registradas
  - Consultas
  - Registros emocionais/comportamentais
  - Mudanças de status
  - Notas adicionadas
- [ ] Filtros:
  - Tipo de evento
  - Período (data início/fim)
- [ ] Busca por texto
- [ ] Ordenação cronológica (mais recente primeiro ou mais antigo primeiro)

**Componentes:**
- `TimelineView.tsx` - Timeline principal
- `TimelineEvent.tsx` - Evento individual
- `TimelineFilters.tsx` - Filtros

---

### 📋 3.9 Aba: Programa Atual
**Arquivo:** `src/components/nutri/clientes/ClientProgramTab.tsx`

**Funcionalidades:**
- [ ] Visualização do programa ativo:
  - Nome do programa
  - Data de início
  - Duração
  - Etapa atual (stage)
  - Meta semanal
  - Descrição/Conteúdo
- [ ] Acompanhamento de adesão:
  - % de adesão geral
  - Gráfico de adesão ao longo do tempo
- [ ] Histórico de programas:
  - Programas anteriores
  - Resultados alcançados
- [ ] Botão "Atribuir Programa"
- [ ] Botão "Finalizar Programa"

**Componentes:**
- `ActiveProgramView.tsx` - Visualização do programa ativo
- `ProgramAdherence.tsx` - Acompanhamento de adesão
- `ProgramHistory.tsx` - Histórico

---

## 📝 FASE 4: FORMULÁRIOS PERSONALIZADOS

### 🎨 4.1 Criador de Formulários
**Arquivo:** `src/app/pt/nutri/formularios/page.tsx`

**Funcionalidades:**
- [ ] Lista de formulários criados
- [ ] Botão "Criar Novo Formulário"
- [ ] Interface de criação:
  - Nome do formulário
  - Descrição
  - Adicionar campos:
    - Texto
    - Texto longo (textarea)
    - Número
    - Data
    - Seleção única (radio)
    - Seleção múltipla (checkbox)
    - Dropdown
    - Arquivo (upload)
  - Validações por campo:
    - Obrigatório
    - Tamanho mínimo/máximo
    - Formato (email, telefone, etc.)
  - Reordenar campos (drag & drop)
  - Preview do formulário
- [ ] Salvar como template
- [ ] Duplicar formulário

**Componentes:**
- `FormList.tsx` - Lista de formulários
- `FormBuilder.tsx` - Construtor de formulários
- `FormFieldEditor.tsx` - Editor de campo
- `FormPreview.tsx` - Preview

---

### 📤 4.2 Envio de Formulários
**Arquivo:** `src/app/pt/nutri/formularios/[id]/enviar/page.tsx`

**Funcionalidades:**
- [ ] Opções de envio:
  - Gerar link público
  - Enviar por email
  - Enviar por WhatsApp
- [ ] Configurações:
  - Data de expiração do link
  - Mensagem personalizada
  - Notificação ao receber resposta
- [ ] Visualizar respostas recebidas
- [ ] Histórico de envios

**Componentes:**
- `FormSendOptions.tsx` - Opções de envio
- `FormResponses.tsx` - Visualização de respostas
- `FormSendHistory.tsx` - Histórico

---

## 📊 FASE 5: RELATÓRIOS VISUAIS

### 📈 5.1 Relatórios
**Arquivo:** `src/app/pt/nutri/relatorios/page.tsx`

**Tipos de relatórios:**
- [ ] Evolução Física:
  - Gráficos de peso, IMC, medidas
  - Período selecionável
  - Exportar PDF/Excel
- [ ] Adesão ao Programa:
  - % de adesão
  - Gráfico de evolução
  - Comparação entre clientes
- [ ] Consultas:
  - Total de consultas
  - Consultas por tipo
  - Taxa de comparecimento
- [ ] Avaliações:
  - Total de avaliações
  - Reavaliações realizadas
  - Comparação de resultados

**Componentes:**
- `ReportSelector.tsx` - Seletor de tipo de relatório
- `EvolutionReport.tsx` - Relatório de evolução
- `AdherenceReport.tsx` - Relatório de adesão
- `ConsultationsReport.tsx` - Relatório de consultas
- `ExportButton.tsx` - Botão de exportação

---

## 🔗 FASE 6: INTEGRAÇÃO COM CAPTAÇÃO

### 🎯 6.1 Conversão de Leads
**Funcionalidades:**
- [ ] Na página de Leads:
  - Botão "Converter em Cliente" em cada lead
- [ ] Modal de conversão:
  - Confirmar dados do lead
  - Completar informações faltantes
  - Definir status inicial
  - Salvar origem do lead
- [ ] Após conversão:
  - Lead marcado como convertido
  - Cliente criado automaticamente
  - Link para perfil do cliente

**Componentes:**
- `ConvertLeadModal.tsx` - Modal de conversão
- Integração com API de leads

---

## 🎯 ORDEM DE IMPLEMENTAÇÃO RECOMENDADA

### Sprint 1: Fundação
1. ✅ Schema do banco (CONCLUÍDO)
2. APIs básicas (Clientes, Evolução)
3. Página de lista de clientes (básica)

### Sprint 2: Lista e Kanban
4. Lista de clientes completa (busca, filtros)
5. Kanban/Trello de clientes

### Sprint 3: Perfil - Parte 1
6. Página de detalhes do cliente
7. Aba Informações Básicas
8. Aba Evolução Física

### Sprint 4: Perfil - Parte 2
9. Aba Avaliação Física
10. Aba Avaliação Emocional/Comportamental
11. Aba Reavaliações

### Sprint 5: Perfil - Parte 3
12. Aba Agenda
13. Aba Histórico Timeline
14. Aba Programa Atual

### Sprint 6: Formulários
15. Criador de formulários
16. Envio de formulários
17. Visualização de respostas

### Sprint 7: Relatórios e Integração
18. Relatórios visuais
19. Integração com Captação (conversão de leads)

---

## 📦 DEPENDÊNCIAS E BIBLIOTECAS

### Necessárias:
- `recharts` ou `chart.js` - Gráficos
- `@dnd-kit/core` ou `react-beautiful-dnd` - Drag & drop
- `date-fns` - Manipulação de datas
- `react-hook-form` - Formulários
- `zod` - Validação (já em uso)
- `jspdf` ou `pdfkit` - Geração de PDFs
- `xlsx` - Exportação Excel

### Opcionais:
- `react-calendar` - Calendários
- `react-image-gallery` - Galeria de fotos
- `react-select` - Dropdowns avançados

---

## ✅ CHECKLIST DE CONCLUSÃO

- [ ] Todas as APIs criadas e testadas
- [ ] Todas as páginas criadas
- [ ] Todos os componentes criados
- [ ] RLS funcionando corretamente
- [ ] Validações implementadas
- [ ] Tratamento de erros
- [ ] Loading states
- [ ] Responsividade (mobile)
- [ ] Testes básicos
- [ ] Documentação atualizada

---

**Última atualização:** 2024-01-XX
**Status:** 🚀 Pronto para começar a implementação


