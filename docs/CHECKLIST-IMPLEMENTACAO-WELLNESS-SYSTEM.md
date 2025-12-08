# ✅ CHECKLIST DE IMPLEMENTAÇÃO - WELLNESS SYSTEM

**Data:** Janeiro 2025  
**Baseado em:** Arquivo completo de especificações recebido  
**Status:** Análise completa - Pronto para implementação

---

## 📊 ANÁLISE: O QUE JÁ EXISTE vs O QUE FALTA

### ✅ **JÁ IMPLEMENTADO (Não Repetir)**

#### 1. **Banco de Dados** ✅
- ✅ Tabela `wellness_scripts` (368 scripts únicos)
- ✅ Tabela `wellness_objecoes` (40 objeções)
- ✅ Tabela `wellness_consultant_interactions` (interações)
- ✅ Tabela `wellness_client_profiles` (perfis de clientes)
- ✅ Tabela `wellness_recruitment_prospects` (prospects)
- ✅ Tabela `wellness_learning_suggestions` (sugestões)
- ✅ Tabela `wellness_noel_profile` (onboarding)
- ✅ Tabela `wellness_noel_config` (configurações)

#### 2. **Motor NOEL Core** ✅
- ✅ Persona, Missão, Regras, Raciocínio
- ✅ 10 Modos de Operação
- ✅ Motor de Scripts (busca do banco)
- ✅ Handler de Objeções (detecção e resposta)
- ✅ Construtor de Resposta
- ✅ Regra Fundamental (não mencionar PV para novos prospects)

#### 3. **APIs do NOEL** ✅
- ✅ `/api/wellness/noel` (endpoint principal integrado)
- ✅ `/api/wellness/noel/v2` (nova API completa)
- ✅ `/api/wellness/noel/scripts` (buscar scripts)
- ✅ `/api/wellness/noel/objections` (buscar objeções)
- ✅ `/api/wellness/noel/onboarding` (onboarding inicial)

#### 4. **Estrutura de Páginas Wellness** ✅
- ✅ `/pt/wellness/home` (dashboard principal)
- ✅ `/pt/wellness/configuracao` (configurações)
- ✅ `/pt/wellness/ferramentas` (lista de ferramentas)
- ✅ `/pt/wellness/ferramentas/nova` (criar ferramenta)
- ✅ `/pt/wellness/templates` (templates disponíveis)
- ✅ `/pt/wellness/noel` (chat do NOEL)
- ✅ `/pt/wellness/system` (área de sistema com scripts/fluxos)

#### 5. **Componentes** ✅
- ✅ `WellnessChatWidget` (chat do NOEL)
- ✅ `NoelOnboarding` (onboarding inicial)
- ✅ `WellnessCTAButton` (botão CTA)
- ✅ `DynamicTemplatePreview` (preview de ferramentas)

---

## 🚧 O QUE FALTA IMPLEMENTAR (Baseado no Documento)

### 📋 **FASE 1: INFRAESTRUTURA E BASE**

#### 1.1. **Tabelas Adicionais do Banco de Dados** ⏭️
- [ ] **Tabela `wellness_usuarios`** (se não existir)
  - `id`, `nome`, `email`, `tipo_consultor`, `nivel`, `pv_mensal`, `meta`, `data_entrada`
  - ⚠️ **Verificar:** Pode já existir em `user_profiles` ou `auth.users`
  
- [ ] **Tabela `wellness_produtos`** (produtos e kits)
  - `id`, `nome`, `categoria` (shake, fiber, chá, etc.), `pv`, `preco`, `descricao`
  - ⚠️ **Verificar:** Pode já existir em outra tabela

- [ ] **Tabela `wellness_clientes`** (se diferente de `wellness_client_profiles`)
  - `id`, `usuario_id`, `nome`, `objetivo`, `produto_atual`, `data_compra`, `previsao_recompra`, `pv_gerado`
  - ⚠️ **Verificar:** `wellness_client_profiles` pode já ter esses campos

- [ ] **Tabela `wellness_ferramentas`** (se não existir)
  - `id`, `nome`, `descricao`, `tipo`
  - ⚠️ **Verificar:** Pode já existir em `user_templates`

#### 1.2. **Autenticação** ✅ (Já existe)
- ✅ Login funcionando
- ✅ Autenticação de usuários

#### 1.3. **Layout com Sidebar** ⏭️
- [ ] **Sidebar com navegação:**
  - NOEL
  - Ferramentas
  - Scripts
  - Clientes
  - Evolução
- ⚠️ **Verificar:** Pode já existir em `/pt/wellness/layout.tsx`

---

### 📋 **FASE 2: FERRAMENTAS PRINCIPAIS (CORE)**

#### 2.1. **Ferramenta: Diagnóstico Rápido** ⏭️
- [ ] **Perguntas automáticas:**
  - "O que mais te incomoda hoje?"
  - "Como está sua rotina?"
  - "Você prefere 1x ao dia ou durante o dia?"
- [ ] **Resultado → duas sugestões automáticas**
- [ ] **Integração com NOEL**
- ⚠️ **Verificar:** Pode já existir em `/pt/wellness/system/diagnosticos`

#### 2.2. **Ferramenta: Scripts Inteligentes** ⏭️
- [ ] **Categorias:**
  - Aberturas sociais
  - Aberturas comerciais
  - Scripts Light Copy
  - Scripts de acompanhamento
  - Scripts de objeções
  - Scripts de recrutamento
- [ ] **Busca e filtros**
- [ ] **Copiar com um clique**
- ⚠️ **Verificar:** Pode já existir em `/pt/wellness/system/scripts`

#### 2.3. **Ferramenta: Bebidas Funcionais** ⏭️
- [ ] **Itens:**
  - Energia
  - Acelera
  - Litrão Turbo
  - Hype Drink
  - Kits de entrada
  - Fluxos de venda
  - Scripts de conversa
  - Recompra semanal
- [ ] **Conteúdo pronto nas lousas** (aguardar conteúdo)
- ⚠️ **Status:** Conteúdo será enviado depois

#### 2.4. **Ferramenta: Produtos Fechados** ⏭️
- [ ] **Itens:**
  - Shake
  - Fiber
  - Chá
  - NRG
  - CR7
  - Creatina
  - Kits
  - Diagnóstico
  - Fechamento leve
  - Recompra 30 dias
  - Estratégia por objetivo
- [ ] **Módulo já concluído** (verificar se precisa integrar)

#### 2.5. **Ferramenta: Plano Presidente** ⏭️
- [ ] **Linha do tempo GET / Milionário / Presidente**
- [ ] **Níveis**
- [ ] **PV Inteligente**
- [ ] **Metas trimestrais**
- [ ] **Construção de equipe**
- [ ] **Ação do NOEL por nível**
- ⚠️ **Status:** Parte da estrutura já criada, conteúdo adicional será enviado

#### 2.6. **Ferramenta: Evolução e PV Inteligente** ⏭️
- [ ] **Cálculo automático de PV por cliente**
- [ ] **Evolução por meta**
- [ ] **Alertas NOEL**
- [ ] **Painel de progresso**

---

### 📋 **FASE 3: CLIENTE & PV INTELIGENTE**

#### 3.1. **Cadastro de Clientes** ⏭️
- [ ] **Tela de cadastro** (`/pt/wellness/clientes/novo`)
- [ ] **Formulário:**
  - Nome
  - Contato
  - Objetivo
  - Produto atual
  - Data de compra
  - Previsão de recompra
- [ ] **Integração com `wellness_client_profiles`**

#### 3.2. **Lista de Clientes** ⏭️
- [ ] **Tela `/pt/wellness/clientes`**
- [ ] **Exibir:**
  - Nome
  - Objetivo
  - Produto atual
  - Data de recompra
  - PV mensal
- [ ] **Filtros e busca**

#### 3.3. **Histórico de Compras** ⏭️
- [ ] **Registro de compras por cliente**
- [ ] **Histórico completo**
- [ ] **Cálculo de PV gerado**

#### 3.4. **Data Prevista de Recompra** ⏭️
- [ ] **Cálculo automático** (30 dias, 7 dias, etc.)
- [ ] **Alertas quando próximo**
- [ ] **Notificações do NOEL**

#### 3.5. **Cálculo Automático de PV** ⏭️
- [ ] **Algoritmo de cálculo**
- [ ] **PV por cliente**
- [ ] **PV mensal total**
- [ ] **PV de equipe** (futuro)

#### 3.6. **Painel de Evolução Mensal** ⏭️
- [ ] **Dashboard de evolução** (`/pt/wellness/evolucao`)
- [ ] **Gráficos de progresso**
- [ ] **Metas vs Realizado**
- [ ] **PV acumulado**

#### 3.7. **Alertas do NOEL** ⏭️
- [ ] **Quando PV estiver baixo**
- [ ] **Quando cliente está próximo de recompra**
- [ ] **Sugestões de estratégia**

#### 3.8. **Simulador de Metas** ⏭️
- [ ] **Quantos clientes → PV desejado**
- [ ] **Cálculo reverso**
- [ ] **Sugestões de estratégia**

---

### 📋 **FASE 4: DESENVOLVIMENTO DE CARREIRA**

#### 4.1. **Linha do Tempo GET / Milionário / Presidente** ⏭️
- [ ] **Tela `/pt/wellness/carreira`**
- [ ] **Visualização de níveis**
- [ ] **Requisitos por nível**
- [ ] **Progresso atual**

#### 4.2. **Requisitos por Nível** ⏭️
- [ ] **GET: requisitos**
- [ ] **Milionário: requisitos**
- [ ] **Presidente: requisitos**
- [ ] **Checklist por nível**

#### 4.3. **PV Próprio e PV de Equipe** ⏭️
- [ ] **Cálculo de PV próprio**
- [ ] **Cálculo de PV de equipe** (futuro)
- [ ] **Dashboard de equipe**

#### 4.4. **Checklist do Nível** ⏭️
- [ ] **Checklist interativo**
- [ ] **Marcar itens concluídos**
- [ ] **Progresso visual**

#### 4.5. **Ações Recomendadas pelo NOEL por Nível** ⏭️
- [ ] **Integração com NOEL**
- [ ] **Sugestões personalizadas**
- [ ] **Scripts por nível**

#### 4.6. **Dashboard do Plano Presidente** ⏭️
- [ ] **Tela dedicada**
- [ ] **Métricas de progresso**
- [ ] **Estratégias de construção de equipe**

---

### 📋 **FASE 5: FLUXOS OPERACIONAIS**

#### 5.1. **Fluxo: Consultor de Bebidas Funcionais** ⏭️
- [ ] **Quem prepara bebidas**
- [ ] **Fluxo específico**
- [ ] **Scripts e ferramentas**

#### 5.2. **Fluxo: Consultor de Produto Fechado** ⏭️
- [ ] **Quem NÃO prepara**
- [ ] **Fluxo específico**
- [ ] **Scripts e ferramentas**

#### 5.3. **Fluxo: Parceiro Wellness** ⏭️
- [ ] **Quem só usa e recomenda**
- [ ] **Fluxo específico**
- [ ] **Scripts e ferramentas**

#### 5.4. **Fluxo: Expansão (Duplicação e Recrutamento)** ⏭️
- [ ] **Fluxo de duplicação**
- [ ] **Fluxo de recrutamento**
- [ ] **Scripts e ferramentas**

---

### 📋 **FASE 6: ALGORITMOS**

#### 6.1. **Algoritmo: Produto Ideal (Diagnóstico Rápido)** ⏭️
- [ ] **Lógica de diagnóstico**
- [ ] **Sugestão de 2 produtos**
- [ ] **Baseado em objetivo**

#### 6.2. **Algoritmo: Recompra Automática 30 dias** ⏭️
- [ ] **Cálculo de data de recompra**
- [ ] **Alertas automáticos**
- [ ] **Scripts de recompra**

#### 6.3. **Algoritmo: Sugestão de Upgrade** ⏭️
- [ ] **Lógica de upgrade**
- [ ] **Quando sugerir**
- [ ] **Produtos sugeridos**

#### 6.4. **Algoritmo: Scripts por Categoria** ✅ (Já existe)
- ✅ Motor de scripts implementado

#### 6.5. **Algoritmo: PV Inteligente por Cliente** ⏭️
- [ ] **Cálculo automático**
- [ ] **Histórico**
- [ ] **Projeções**

#### 6.6. **Algoritmo: Evolução de Carreira (GET → Presidente)** ⏭️
- [ ] **Cálculo de progresso**
- [ ] **Requisitos por nível**
- [ ] **Sugestões de ação**

#### 6.7. **Algoritmo: Identificação do Tipo de Distribuidor** ⏭️
- [ ] **Lógica de identificação**
- [ ] **Perfis:**
  - Consultor Iniciante
  - Parceiro Wellness
  - Consultor de Produto Fechado
  - Consultor de Bebidas Funcionais
  - Consultor em Progressão de Carreira

#### 6.8. **Algoritmo: Roteiro de Duplicação** ⏭️
- [ ] **Lógica de duplicação**
- [ ] **Scripts e ferramentas**
- [ ] **Passo a passo**

#### 6.9. **Algoritmo: Perfis de Cliente** ⏭️
- [ ] **Perfis:**
  - Energia
  - Ansiedade
  - Pele
  - Treino
  - Emagrecimento
- [ ] **Diagnóstico automático**
- [ ] **Sugestões personalizadas**

---

### 📋 **FASE 7: TELAS E INTERFACES**

#### 7.1. **Tela Inicial (Dashboard)** ⏭️
- [ ] **Cards:**
  - "Peço Ajuda ao NOEL"
  - "Ferramentas"
  - "Scripts"
  - "Meus Clientes"
  - "Evolução"
- ⚠️ **Verificar:** `/pt/wellness/home` pode já ter isso

#### 7.2. **Tela do Chat do NOEL** ✅ (Já existe)
- ✅ Chat funcionando
- [ ] **Melhorias:**
  - Histórico contextual
  - Respostas adaptadas ao tipo de consultor
  - Acesso rápido a fluxos

#### 7.3. **Tela de Scripts** ⏭️
- [ ] **Categorias organizadas**
- [ ] **Busca**
- [ ] **Copiar com um clique**
- ⚠️ **Verificar:** `/pt/wellness/system/scripts` pode já ter isso

#### 7.4. **Tela de Ferramentas** ⏭️
- [ ] **Seções:**
  - Bebidas funcionais
  - Produtos fechados
  - Diagnóstico
  - Plano Presidente
  - Fluxos de consultor
- ⚠️ **Verificar:** `/pt/wellness/ferramentas` pode já ter isso

#### 7.5. **Tela de Clientes** ⏭️
- [ ] **Lista de clientes**
- [ ] **Filtros:**
  - Objetivo
  - Produto atual
  - Data de recompra
  - PV mensal
- [ ] **Ações:**
  - Ver detalhes
  - Editar
  - Adicionar compra
  - Marcar recompra

---

### 📋 **FASE 8: COMPORTAMENTO DO NOEL**

#### 8.1. **Tom de Voz** ✅ (Já implementado)
- ✅ Leve, educado, prestativo, estratégico, sem pressão, Light Copy

#### 8.2. **Diretrizes Principais** ✅ (Já implementado)
- ✅ Sempre perguntar objetivo
- ✅ Sempre oferecer duas opções
- ✅ Adaptar comunicação por nível
- ✅ Focar em benefício → substância → solução
- ✅ Evitar termos de PV para iniciantes
- ✅ Direcionar para scripts, ferramentas ou fluxos

#### 8.3. **Ações Automáticas do NOEL** ⏭️
- [ ] **Diagnóstico rápido (3 perguntas)**
- [ ] **Sugestão de produto (sempre 2 opções)**
- ✅ **Scripts light copy** (já existe)
- [ ] **Acompanhamento (7, 14, 30 dias)**
- [ ] **Recompra automática**
- [ ] **Upgrades**
- [ ] **Pedir indicação**
- [ ] **Estratégias para evolução (500–1000PV)**
- [ ] **Direcionamento para GET/Milionário/Presidente**
- ✅ **Suporte emocional e motivacional** (já existe)

---

### 📋 **FASE 9: SISTEMA DE NOTIFICAÇÕES**

#### 9.1. **Notificações para Admin** ⏭️
- [ ] **Quando nova learning suggestion é criada**
- [ ] **Email para admin**
- [ ] **Apenas quando `frequency >= 3`**

#### 9.2. **Notificações para Consultor** ⏭️
- [ ] **Alertas de recompra**
- [ ] **Alertas de PV baixo**
- [ ] **Sugestões do NOEL**

---

### 📋 **FASE 10: ÁREA ADMINISTRATIVA**

#### 10.1. **Gerenciar Learning Suggestions** ⏭️
- [ ] **Listar sugestões pendentes**
- [ ] **Aprovar/rejeitar**
- [ ] **Adicionar ao banco (scripts/objeções/knowledge)**

---

## 🎯 PRIORIZAÇÃO SUGERIDA

### 🔴 **ALTA PRIORIDADE (Fazer Primeiro)**
1. **Verificar tabelas existentes** (evitar duplicação)
2. **Tela de Clientes** (cadastro, lista, histórico)
3. **Cálculo de PV Inteligente** (automático)
4. **Painel de Evolução** (dashboard de progresso)
5. **Algoritmo de Recompra Automática** (30 dias)

### 🟡 **MÉDIA PRIORIDADE (Fazer Depois)**
6. **Ferramenta: Diagnóstico Rápido** (melhorar se já existe)
7. **Ferramenta: Bebidas Funcionais** (aguardar conteúdo)
8. **Ferramenta: Produtos Fechados** (verificar se precisa integrar)
9. **Plano Presidente** (linha do tempo, níveis)
10. **Fluxos Operacionais** (por tipo de consultor)

### 🟢 **BAIXA PRIORIDADE (Fazer Por Último)**
11. **Sistema de Notificações** (admin e consultor)
12. **Área Administrativa** (learning suggestions)
13. **Ajustes Finais e Polimento**

---

## ⚠️ **VERIFICAÇÕES NECESSÁRIAS ANTES DE COMEÇAR**

1. **Verificar tabelas existentes:**
   - `user_profiles` vs `wellness_usuarios`
   - `wellness_client_profiles` vs `wellness_clientes`
   - `user_templates` vs `wellness_ferramentas`
   - Produtos (onde estão armazenados?)

2. **Verificar páginas existentes:**
   - `/pt/wellness/system/scripts` (já tem scripts?)
   - `/pt/wellness/system/diagnosticos` (já tem diagnóstico?)
   - `/pt/wellness/clientes` (já existe?)

3. **Verificar componentes existentes:**
   - O que já está implementado?
   - O que precisa ser criado?
   - O que precisa ser melhorado?

---

## 📝 **PRÓXIMA AÇÃO**

**ANTES DE PROGRAMAR:**
1. ✅ Verificar tabelas existentes (evitar duplicação)
2. ✅ Verificar páginas existentes (evitar duplicação)
3. ✅ Mapear o que já existe vs o que falta
4. ✅ Criar plano de implementação detalhado
5. ⏭️ **Começar pela FASE 3 (Cliente & PV Inteligente)** - mais crítico

---

## ✅ **ENTENDI TUDO?**

- ✅ Estrutura geral do sistema
- ✅ Tipos de usuário
- ✅ Comportamento do NOEL
- ✅ Banco de dados necessário
- ✅ Ferramentas a implementar
- ✅ Telas a criar
- ✅ Algoritmos necessários
- ✅ Regras de qualidade
- ✅ Ordem de implementação

**Pronto para começar quando você autorizar!** 🚀





