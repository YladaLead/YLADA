# 🗺️ Roadmap - YLADA NUTRI — ÁREA DE GESTÃO (MVP)

## 📊 Status Geral

**Schema do Banco de Dados:** ✅ Completo  
**Frontend:** 🚧 Em Desenvolvimento  
**Integração com Captação:** ⏳ Pendente

---

## 🎯 Fase 1: Fundação (Atual)

### ✅ Concluído
- [x] Schema completo do banco de dados
- [x] Documentação de requisitos
- [x] Checklist oficial do MVP
- [x] Estrutura de tabelas (9 tabelas)
- [x] Integração com módulo de Captação (schema)

### ⏳ Em Progresso
- [ ] Executar schema no Supabase
- [ ] Criar estrutura de pastas e arquivos

---

## 🎯 Fase 2: Lista e Kanban de Clientes

### Objetivo
Criar a interface principal para visualizar e gerenciar clientes.

### Tarefas
- [ ] Página `/pt/nutri/clientes`
  - [ ] Lista de clientes com cards
  - [ ] Busca e filtros
  - [ ] Ordenação
- [ ] Visualização Kanban
  - [ ] Colunas por status
  - [ ] Drag & drop
  - [ ] Contadores
- [ ] Componentes
  - [ ] `ClientCard.tsx`
  - [ ] `ClientKanban.tsx`
  - [ ] `ClientFilters.tsx`

### Estimativa: 3-5 dias

---

## 🎯 Fase 3: Perfil Completo da Cliente

### Objetivo
Criar a página de detalhes com todas as abas obrigatórias.

### Tarefas
- [ ] Página `/pt/nutri/clientes/[id]`
  - [ ] Layout com abas
  - [ ] Navegação entre abas
- [ ] Aba: Informações Básicas
  - [ ] Formulário de edição
  - [ ] Dados de contato
  - [ ] Origem do lead
- [ ] Aba: Evolução Física
  - [ ] Gráficos (peso, IMC, medidas)
  - [ ] Tabela de medidas
  - [ ] Fotos de evolução
- [ ] Aba: Avaliação Física
  - [ ] Formulário de avaliação
  - [ ] Resultados
  - [ ] Interpretação
- [ ] Aba: Avaliação Emocional/Comportamental
  - [ ] Formulário de registro
  - [ ] Gráficos de evolução
  - [ ] Padrões identificados
- [ ] Aba: Reavaliações
  - [ ] Lista de reavaliações
  - [ ] Comparações visuais
  - [ ] Gráficos comparativos
- [ ] Aba: Agenda
  - [ ] Calendário da cliente
  - [ ] Lista de consultas
- [ ] Aba: Histórico Timeline
  - [ ] Timeline visual
  - [ ] Filtros por tipo
- [ ] Aba: Programa Atual
  - [ ] Visualização do programa
  - [ ] Acompanhamento de adesão

### Componentes
- [ ] `EvolutionChart.tsx`
- [ ] `AssessmentForm.tsx`
- [ ] `EmotionalBehavioralChart.tsx`
- [ ] `ReevaluationComparison.tsx`
- [ ] `ClientTimeline.tsx`
- [ ] `ProgramCard.tsx`

### Estimativa: 7-10 dias

---

## 🎯 Fase 4: Formulários Personalizados

### Objetivo
Sistema completo de criação e envio de formulários.

### Tarefas
- [ ] Página `/pt/nutri/formularios`
  - [ ] Lista de formulários
  - [ ] Criador de formulários
  - [ ] Editor de campos
- [ ] Sistema de criação
  - [ ] Tipos de campos
  - [ ] Validações
  - [ ] Preview
  - [ ] Templates
- [ ] Sistema de envio
  - [ ] Link compartilhável
  - [ ] Envio por email
  - [ ] Envio por WhatsApp
- [ ] Visualização de respostas
  - [ ] Lista de respostas
  - [ ] Detalhes da resposta

### Componentes
- [ ] `FormBuilder.tsx`
- [ ] `FormFieldEditor.tsx`
- [ ] `FormPreview.tsx`
- [ ] `FormSender.tsx`

### Estimativa: 5-7 dias

---

## 🎯 Fase 5: Relatórios Visuais

### Objetivo
Sistema de relatórios simples e visuais.

### Tarefas
- [ ] Página `/pt/nutri/relatorios`
  - [ ] Seleção de cliente
  - [ ] Seleção de período
  - [ ] Tipos de relatório
- [ ] Relatórios
  - [ ] Evolução física
  - [ ] Adesão ao programa
  - [ ] Consultas
  - [ ] Avaliações
- [ ] Exportação
  - [ ] PDF
  - [ ] Imagem

### Componentes
- [ ] `ReportGenerator.tsx`
- [ ] `EvolutionReport.tsx`
- [ ] `AdherenceReport.tsx`

### Estimativa: 3-5 dias

---

## 🎯 Fase 6: Integração com Captação

### Objetivo
Integrar conversão de leads e rastreamento de origem.

### Tarefas
- [ ] Página de Leads (`/pt/nutri/leads`)
  - [ ] Botão "Converter em Cliente"
  - [ ] Modal de conversão
- [ ] Conversão automática
  - [ ] Importação de dados
  - [ ] Preservação de dados adicionais
  - [ ] Rastreamento de origem
- [ ] Visualização de origem
  - [ ] No perfil do cliente
  - [ ] Link para lead original
  - [ ] Template que gerou o lead

### Estimativa: 2-3 dias

---

## 🎯 Fase 7: Polimento e Testes

### Objetivo
Refinar interface, adicionar animações e testar.

### Tarefas
- [ ] Animações e transições
- [ ] Responsividade mobile
- [ ] Testes de usabilidade
- [ ] Correção de bugs
- [ ] Otimização de performance
- [ ] Documentação de uso

### Estimativa: 3-5 dias

---

## 📊 Estimativa Total

**Tempo estimado:** 26-40 dias de desenvolvimento  
**Prioridade:** Alta  
**Status:** 🚧 Em Desenvolvimento

---

## 📝 Notas

- Todas as funcionalidades listadas são obrigatórias para o MVP
- Foco em simplicidade e usabilidade
- Design altamente visual e profissional
- Integração completa com módulo de Captação

---

**Última atualização:** 2024

