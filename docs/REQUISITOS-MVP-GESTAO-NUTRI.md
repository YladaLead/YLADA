# 📋 YLADA NUTRI — ÁREA DE GESTÃO (MVP)
## Checklist Oficial de Requisitos

**Versão:** MVP (Minimum Viable Product)  
**Data:** 2024  
**Status:** 🚧 Em Desenvolvimento

---

## ✅ Funcionalidades Obrigatórias

### 1. ✅ Lista de Clientes
- [ ] Página principal com listagem de todos os clientes
- [ ] Busca por nome, email, telefone
- [ ] Filtros (status, tags, data de cadastro)
- [ ] Cards visuais com informações resumidas
- [ ] Ações rápidas (WhatsApp, email, agendar)
- [ ] Ordenação (nome, data, status)

### 2. ✅ Trello/Kanban de Clientes
- [ ] Visualização em colunas (Kanban)
- [ ] Colunas por status (ex: Novos, Em Acompanhamento, Pausados, Encerrados)
- [ ] Arrastar e soltar (drag & drop) para mudar status
- [ ] Cards visuais com informações essenciais
- [ ] Filtros e busca no Kanban
- [ ] Contadores por coluna

### 3. ✅ Perfil Completo da Cliente

#### 3.1. Informações Básicas
- [ ] Dados pessoais completos
- [ ] Dados de contato (email, telefone, WhatsApp)
- [ ] Endereço completo
- [ ] Data de nascimento, gênero
- [ ] CPF (opcional)
- [ ] Tags e categorias
- [ ] Campos personalizados
- [ ] Origem do lead (integração com Captação)

#### 3.2. Evolução Física
- [ ] Gráficos de peso ao longo do tempo
- [ ] Gráficos de IMC
- [ ] Gráficos de circunferências (cintura, quadril, etc.)
- [ ] Composição corporal (gordura, massa muscular, água)
- [ ] Fotos de evolução (antes/depois)
- [ ] Tabela de medidas históricas
- [ ] Comparação entre períodos

#### 3.3. Avaliação Física
- [ ] Formulário de avaliação antropométrica
- [ ] Avaliação de bioimpedância
- [ ] Anamnese nutricional
- [ ] Dados de composição corporal
- [ ] Fotos de avaliação
- [ ] Resultados e interpretação
- [ ] Recomendações baseadas na avaliação

#### 3.4. Avaliação Emocional/Comportamental
- [ ] Formulário de registro emocional
- [ ] Estado emocional (ansiedade, estresse, motivação)
- [ ] Níveis de estresse e humor (scores 1-10)
- [ ] Qualidade do sono
- [ ] Nível de energia
- [ ] Adesão ao programa (scores e percentuais)
- [ ] Padrões identificados
- [ ] Gatilhos comportamentais
- [ ] Gráficos de evolução emocional/comportamental

#### 3.5. Reavaliações
- [ ] Sistema de reavaliações vinculadas
- [ ] Numeração sequencial (1ª, 2ª, 3ª avaliação...)
- [ ] Comparação automática com avaliação anterior
- [ ] Dados comparativos (diferenças, percentuais)
- [ ] Gráficos de comparação
- [ ] Histórico de todas as reavaliações

#### 3.6. Agenda
- [ ] Calendário de consultas da cliente
- [ ] Lista de agendamentos
- [ ] Tipos de consulta (primeira, retorno, avaliação, acompanhamento)
- [ ] Status (agendado, confirmado, concluído, cancelado, falta)
- [ ] Localização (presencial, online, domicílio)
- [ ] Lembretes
- [ ] Anotações pós-consulta
- [ ] Sugestão de próximas consultas

#### 3.7. Histórico Timeline
- [ ] Timeline visual completa
- [ ] Todas as atividades (consultas, avaliações, programas, notas)
- [ ] Histórico emocional/comportamental
- [ ] Filtros por tipo de atividade
- [ ] Busca no histórico
- [ ] Visualização cronológica

#### 3.8. Programa Atual
- [ ] Visualização do programa ativo
- [ ] Detalhes do plano alimentar
- [ ] Protocolo personalizado
- [ ] Acompanhamento de adesão
- [ ] Histórico de programas anteriores
- [ ] Edição e atualização do programa

### 4. ✅ Criador de Formulários Personalizados
- [ ] Interface de criação de formulários
- [ ] Diferentes tipos de campos (texto, número, select, textarea, data, etc.)
- [ ] Validações (obrigatório, formato, etc.)
- [ ] Templates reutilizáveis
- [ ] Preview do formulário
- [ ] Salvar como template
- [ ] Edição de formulários existentes

### 5. ✅ Envio de Formulários
- [ ] Envio de formulário para cliente
- [ ] Link compartilhável
- [ ] Envio por email
- [ ] Envio por WhatsApp
- [ ] Notificação de preenchimento
- [ ] Visualização de respostas
- [ ] Histórico de envios

### 6. ✅ Relatórios Visuais Simples
- [ ] Relatório de evolução física
- [ ] Relatório de adesão ao programa
- [ ] Relatório de consultas
- [ ] Relatório de avaliações
- [ ] Gráficos simples e claros
- [ ] Exportação (PDF, imagem)
- [ ] Período customizável

### 7. ✅ Integração com Captação (Origem do Lead)
- [ ] Conversão de lead em cliente
- [ ] Importação automática de dados do lead
- [ ] Rastreamento da origem (quiz, calculadora, link)
- [ ] Template que gerou o lead
- [ ] Dados adicionais do lead preservados
- [ ] Histórico desde a captação
- [ ] Métricas de conversão

---

## 🗄️ Estrutura de Dados (Schema)

### Tabelas Necessárias
- ✅ `clients` - Dados da cliente
- ✅ `client_evolution` - Evolução física
- ✅ `appointments` - Agenda
- ✅ `assessments` - Avaliações e reavaliações
- ✅ `emotional_behavioral_history` - Avaliação emocional/comportamental
- ✅ `programs` - Programas atuais
- ✅ `custom_forms` - Formulários personalizados
- ✅ `form_responses` - Respostas aos formulários
- ✅ `client_history` - Histórico timeline

### Integração
- ✅ Campos de integração com `leads` (origem, template, dados)
- ✅ Campos de integração com `user_templates` (template que gerou o lead)

---

## 📁 Estrutura de Páginas

### Páginas Principais
1. `/pt/nutri/clientes` - Lista de clientes + Kanban
2. `/pt/nutri/clientes/[id]` - Perfil completo da cliente
3. `/pt/nutri/agenda` - Agenda geral
4. `/pt/nutri/formularios` - Criador de formulários
5. `/pt/nutri/relatorios` - Relatórios visuais

### Subpáginas do Perfil
- Aba: Informações Básicas
- Aba: Evolução Física
- Aba: Avaliação Física
- Aba: Avaliação Emocional/Comportamental
- Aba: Reavaliações
- Aba: Agenda
- Aba: Histórico Timeline
- Aba: Programa Atual

---

## 🎨 Design e UX

### Princípios
- **Simples** - Interface limpa e intuitiva
- **Profissional** - Visual moderno e confiável
- **Altamente Visual** - Gráficos, cards, timeline, Kanban

### Componentes Principais
- Cards de clientes
- Kanban board (drag & drop)
- Gráficos de evolução
- Timeline visual
- Formulários dinâmicos
- Calendário de agenda
- Relatórios visuais

---

## ✅ Status de Implementação

### Schema do Banco de Dados
- ✅ Schema completo criado
- ⏳ Aguardando execução no Supabase

### Frontend
- ⏳ Lista de clientes
- ⏳ Trello/Kanban
- ⏳ Perfil completo
- ⏳ Criador de formulários
- ⏳ Envio de formulários
- ⏳ Relatórios visuais
- ⏳ Integração com Captação

---

## 📝 Notas

- Este é o checklist oficial do MVP
- Todas as funcionalidades listadas são obrigatórias
- Prioridade: Funcionalidades básicas primeiro, depois avançadas
- Foco em simplicidade e usabilidade

---

**Última atualização:** 2024

