# 📋 PLANO: Páginas Admin - Templates e Analytics

## 🎯 Objetivo

Criar duas páginas administrativas completas para gerenciamento de templates e análise de dados do sistema.

---

## 📚 1. PÁGINA: Templates (`/admin/templates`)

### **Funcionalidades Principais**

#### **1.1 Listagem de Templates Base**
- Listar todos os templates da tabela `templates_nutrition`
- Filtros:
  - Por área (wellness, nutri, coach, nutra)
  - Por tipo (calculadora, quiz, planilha)
  - Por status (ativo/inativo)
  - Por idioma (pt, en, es)
- Busca por nome
- Ordenação (mais usados, mais recentes, alfabético)

#### **1.2 Estatísticas de Uso**
Para cada template, mostrar:
- Quantos usuários criaram links a partir dele (`user_templates` com `template_id`)
- Total de visualizações (soma de `views` dos `user_templates`)
- Total de leads gerados (soma de `leads_count` dos `user_templates`)
- Total de conversões (soma de `conversions_count` dos `user_templates`)
- Taxa de conversão (conversões / leads)

#### **1.3 Gerenciamento**
- **Ativar/Desativar** template
- **Editar** template (nome, descrição, conteúdo JSON)
- **Duplicar** template para outra área
- **Visualizar** template (preview)
- **Ver exemplos** de links criados a partir do template

#### **1.4 Criar Novo Template**
- Formulário completo:
  - Nome
  - Tipo (calculadora, quiz, planilha)
  - Área(s) disponível(is)
  - Idioma
  - Descrição
  - Conteúdo JSON (editor JSON)
  - CTA padrão
  - Mensagem WhatsApp padrão
  - Status (ativo/inativo)

---

## 📊 2. PÁGINA: Analytics (`/admin/analytics`)

### **Funcionalidades Principais**

#### **2.1 Dashboard Geral**
- **Visão geral** com cards principais:
  - Total de usuários
  - Total de leads
  - Total de conversões
  - Taxa de conversão geral
  - Receita total
  - Receita mensal

#### **2.2 Gráficos e Visualizações**

**2.2.1 Crescimento ao Longo do Tempo**
- Gráfico de linha:
  - Usuários cadastrados (por mês)
  - Leads gerados (por mês)
  - Conversões (por mês)
  - Receita (por mês)
- Filtro de período (7 dias, 30 dias, 3 meses, 6 meses, 1 ano, todo período)

**2.2.2 Comparativo por Área**
- Gráfico de barras comparando:
  - Wellness vs Nutri vs Coach vs Nutra
  - Métricas: usuários, leads, conversões, receita
- Tabela comparativa

**2.2.3 Funil de Conversão**
- Visualização do funil:
  - Visualizações → Leads → Conversões
- Por área
- Taxa de conversão em cada etapa

**2.2.4 Templates Mais Usados**
- Top 10 templates por:
  - Número de links criados
  - Total de leads gerados
  - Total de conversões
  - Taxa de conversão

**2.2.5 Análise de Receita**
- Receita mensal (últimos 12 meses)
- Receita por área
- Receita por tipo de plano (monthly vs annual)
- Projeção de receita (baseado em tendência)

**2.2.6 Usuários Mais Ativos**
- Top 10 usuários por:
  - Número de leads gerados
  - Número de conversões
  - Receita gerada (se aplicável)

#### **2.3 Relatórios Exportáveis**
- Exportar dados em:
  - CSV
  - Excel
  - PDF (relatório formatado)
- Filtros aplicáveis antes de exportar

#### **2.4 Insights e Recomendações**
- IA/Regras para gerar insights:
  - "Área Wellness tem baixa conversão, considere melhorar templates"
  - "Template X tem alta taxa de conversão, promova mais"
  - "Receita cresceu 20% este mês"
  - "Área Nutri tem mais leads, mas Coach converte melhor"

---

## 🗄️ Estrutura de Dados Necessária

### **Tabelas Utilizadas:**
- `templates_nutrition` - Templates base
- `user_templates` - Links criados pelos usuários
- `leads` - Leads capturados
- `user_profiles` - Perfis de usuários
- `subscriptions` - Assinaturas e receita
- `wellness_curso_modulos` - Cursos (e equivalentes para outras áreas)

### **APIs Necessárias:**
- `GET /api/admin/templates` - Listar templates com estatísticas
- `POST /api/admin/templates` - Criar novo template
- `PUT /api/admin/templates/[id]` - Atualizar template
- `PATCH /api/admin/templates/[id]/toggle` - Ativar/desativar
- `GET /api/admin/analytics/stats` - Estatísticas gerais
- `GET /api/admin/analytics/growth` - Dados de crescimento
- `GET /api/admin/analytics/comparison` - Comparativo por área
- `GET /api/admin/analytics/funnel` - Funil de conversão
- `GET /api/admin/analytics/top-templates` - Templates mais usados
- `GET /api/admin/analytics/revenue` - Análise de receita
- `GET /api/admin/analytics/top-users` - Usuários mais ativos

---

## 🎨 Design e UX

### **Templates:**
- Layout tipo tabela com cards
- Filtros laterais ou no topo
- Modal para edição
- Preview inline ou modal

### **Analytics:**
- Dashboard com grid de gráficos
- Gráficos interativos (Chart.js ou Recharts)
- Filtros de período no topo
- Cards de métricas principais
- Tabelas para dados detalhados

---

## 📅 Priorização

### **Fase 1 (MVP):**
1. ✅ Listagem básica de templates
2. ✅ Estatísticas básicas de uso
3. ✅ Dashboard Analytics com gráficos principais
4. ✅ Comparativo por área

### **Fase 2:**
1. Edição de templates
2. Criação de novos templates
3. Relatórios exportáveis
4. Insights automáticos

### **Fase 3:**
1. Análise avançada de receita
2. IA para recomendações
3. Alertas e notificações
4. Integração com ferramentas externas

---

## 🔗 Links Relacionados

- [Estrutura de Templates](./ESTRUTURA-FORNECIMENTO-TEMPLATES-LINKS-QUIZZES.md)
- [Como Funcionam Leads e Conversões](./COMO-FUNCIONAM-LEADS-E-CONVERSOES.md)
- [Schema de Subscriptions](../schema-subscriptions.sql)

