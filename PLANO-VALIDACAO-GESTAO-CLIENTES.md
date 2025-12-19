# 🎯 PLANO DE VALIDAÇÃO - GESTÃO DE CLIENTES (GSAL)

**Data:** 18 de Dezembro de 2025  
**Objetivo:** Validar e testar todas as funcionalidades da área de Gestão de Clientes  
**Status:** Em Planejamento

---

## 📊 VISÃO GERAL - O QUE É GESTÃO DE CLIENTES (GSAL)?

**GSAL** significa:
- **G**erar → Captar leads através de ferramentas
- **S**ervir → Atender e criar valor para clientes
- **A**companhar → Monitorar evolução e resultados
- **L**ucrar → Organizar financeiro e crescer

---

## 🗂️ ESTRUTURA ATUAL DA GESTÃO DE CLIENTES

Baseado na análise do código, a área possui:

### ✅ **IMPLEMENTADO E FUNCIONAL**

1. **Painel GSAL** (`/pt/nutri/gsal`)
   - Visão geral do pipeline GSAL
   - Estatísticas de leads, clientes, avaliações

2. **Leads** (`/pt/nutri/leads`)
   - Lista de leads com filtros
   - Alertas de leads parados
   - Conversão de lead em cliente
   - Integração com ferramentas de captação

3. **Clientes - Lista** (`/pt/nutri/clientes`)
   - Listagem de todos os clientes
   - Filtros por status
   - Busca por nome, email, telefone
   - Botão para importar pacientes em massa
   - Botão para criar novo cliente

4. **Clientes - Kanban** (`/pt/nutri/clientes/kanban`)
   - Visualização em quadros (Contato, Pré-Consulta, Ativa, Pausa, Finalizada)
   - Drag & drop para mover clientes entre status
   - Adicionar clientes direto na coluna
   - Personalizar colunas e cards
   - Criar colunas customizadas

5. **Clientes - Perfil Individual** (`/pt/nutri/clientes/[id]`)
   - Abas: Info, Evolução, Avaliação, Emocional, Reavaliações, Agenda, Timeline, Programa, Documentos
   - **Aba Info:** Dados pessoais, contato, endereço
   - **Aba Evolução:** Registros de peso, medidas, gráficos
   - **Aba Avaliação:** Avaliações antropométricas completas
   - **Aba Emocional:** Histórico emocional/comportamental
   - **Aba Agenda:** Consultas agendadas
   - **Aba Timeline:** Histórico de atividades
   - **Aba Programa:** Planos nutricionais
   - **Aba Documentos:** Upload de arquivos

6. **Acompanhamento** (`/pt/nutri/acompanhamento`)
   - Lista de clientes ativos
   - Visão rápida de cada cliente

7. **Formulários** (`/pt/nutri/formularios`)
   - Criar formulários personalizados
   - Enviar para clientes
   - Ver respostas

### ⚠️ **PARCIALMENTE IMPLEMENTADO**

8. **Rotina Mínima**
   - Menu existe, mas não encontrei página implementada
   - ❌ PRECISA SER CRIADO OU VERIFICADO

9. **Métricas**
   - Menu existe, mas não encontrei página implementada  
   - ❌ PRECISA SER CRIADO OU VERIFICADO

---

## 🎯 O QUE REALMENTE PRECISA NA GESTÃO DE CLIENTES?

### 🔴 **ESSENCIAL (MVP MÍNIMO)**

Funcionalidades que uma nutricionista PRECISA para trabalhar:

1. ✅ **Cadastrar clientes** → JÁ TEM
2. ✅ **Ver lista de clientes** → JÁ TEM
3. ✅ **Ver perfil completo do cliente** → JÁ TEM
4. ✅ **Registrar evoluções físicas (peso, medidas)** → JÁ TEM
5. ✅ **Fazer avaliações nutricionais** → JÁ TEM
6. ✅ **Organizar clientes por status (Kanban)** → JÁ TEM
7. ✅ **Captar leads** → JÁ TEM
8. ✅ **Converter leads em clientes** → JÁ TEM
9. ✅ **Acompanhar clientes ativos** → JÁ TEM
10. ✅ **Enviar formulários para clientes** → JÁ TEM

### 🟡 **IMPORTANTE (NICE-TO-HAVE)**

Funcionalidades que melhoram muito a experiência:

11. ❓ **Rotina mínima/checklist diário** → PRECISA VERIFICAR
12. ❓ **Métricas e relatórios** → PRECISA VERIFICAR
13. ✅ **Timeline de atividades** → JÁ TEM
14. ✅ **Upload de documentos** → JÁ TEM
15. ✅ **Importar pacientes em massa** → JÁ TEM
16. ✅ **Alertas de leads parados** → JÁ TEM

### 🟢 **OPCIONAL (FUTURO)**

Funcionalidades que podem esperar:

17. ⚪ Agendamento integrado de consultas
18. ⚪ Lembretes automáticos
19. ⚪ Mensagens automáticas (WhatsApp)
20. ⚪ Financeiro/pagamentos
21. ⚪ Relatórios personalizados avançados

---

## ✅ CHECKLIST DE VALIDAÇÃO E TESTES

### 🔵 FASE 1: TESTES BÁSICOS (FLUXO PRINCIPAL)

#### 1. TESTE: Cadastrar Novo Cliente Manualmente

- [ ] Acessar `/pt/nutri/clientes`
- [ ] Clicar em "Novo Cliente"
- [ ] Preencher apenas Nome (campo obrigatório)
- [ ] Verificar se salva com sucesso
- [ ] Preencher todos os campos (nome, email, telefone, CPF, data nascimento, etc.)
- [ ] Verificar se todos os dados foram salvos
- [ ] Cliente aparece na lista?
- [ ] Consegue acessar o perfil do cliente?

**Critério de Sucesso:**
✅ Cliente é criado e aparece na lista  
✅ Todos os dados preenchidos são salvos corretamente  
✅ Validações funcionam (email inválido, telefone, etc.)

---

#### 2. TESTE: Importar Pacientes em Massa

- [ ] Acessar `/pt/nutri/clientes`
- [ ] Clicar em "Importar Pacientes"
- [ ] Tentar importar arquivo CSV com 5 pacientes
- [ ] Verificar se todos foram importados
- [ ] Verificar se os dados estão corretos

**Critério de Sucesso:**
✅ Modal de importação abre  
✅ Aceita CSV/Excel  
✅ Mostra preview dos dados  
✅ Importa todos os pacientes  
✅ Mostra mensagem de sucesso

---

#### 3. TESTE: Buscar e Filtrar Clientes

- [ ] Acessar lista de clientes
- [ ] Buscar por nome
- [ ] Buscar por email
- [ ] Buscar por telefone
- [ ] Filtrar por status (Ativa, Pausa, Finalizada, etc.)
- [ ] Combinar busca + filtro

**Critério de Sucesso:**
✅ Busca funciona em tempo real  
✅ Filtros retornam resultados corretos  
✅ Performance é boa (< 1 segundo)

---

#### 4. TESTE: Visualizar Perfil do Cliente

- [ ] Clicar em um cliente da lista
- [ ] Verificar se abre o perfil completo
- [ ] Verificar todas as abas:
  - [ ] Info: Dados pessoais aparecem?
  - [ ] Evolução: Mostra mensagem "Nenhuma evolução registrada"?
  - [ ] Avaliação: Mostra mensagem "Nenhuma avaliação"?
  - [ ] Timeline: Mostra histórico de criação?
- [ ] Testar navegação entre abas

**Critério de Sucesso:**
✅ Todas as abas carregam sem erro  
✅ Navegação entre abas é fluida  
✅ Dados são exibidos corretamente

---

#### 5. TESTE: Editar Dados do Cliente

- [ ] Abrir perfil de um cliente
- [ ] Clicar em "Editar" (se tiver botão)
- [ ] OU editar diretamente na aba Info
- [ ] Mudar nome, email, telefone
- [ ] Salvar
- [ ] Verificar se as mudanças foram salvas

**Critério de Sucesso:**
✅ Consegue editar dados  
✅ Salva com sucesso  
✅ Mudanças aparecem imediatamente

---

#### 6. TESTE: Registrar Evolução Física

- [ ] Abrir perfil de um cliente
- [ ] Ir na aba "Evolução"
- [ ] Clicar em "Registrar Nova Medição" ou similar
- [ ] Preencher dados:
  - [ ] Data
  - [ ] Peso
  - [ ] Altura
  - [ ] Circunferências (cintura, quadril, etc.)
- [ ] Verificar se IMC é calculado automaticamente
- [ ] Salvar
- [ ] Verificar se evolução aparece na tabela

**Critério de Sucesso:**
✅ Modal/formulário abre  
✅ IMC calcula automaticamente  
✅ Validações funcionam (peso entre 30-300kg)  
✅ Evolução é salva e aparece na lista  
✅ Gráfico de peso é atualizado

---

#### 7. TESTE: Ver Gráfico de Evolução de Peso

- [ ] Após registrar pelo menos 2 evoluções
- [ ] Verificar se o gráfico aparece
- [ ] Gráfico mostra linha de peso ao longo do tempo?
- [ ] É legível e responsivo?

**Critério de Sucesso:**
✅ Gráfico renderiza corretamente  
✅ Mostra dados precisos  
✅ É responsivo (mobile/desktop)

---

#### 8. TESTE: Criar Avaliação Nutricional

- [ ] Abrir perfil de um cliente
- [ ] Ir na aba "Avaliação"
- [ ] Clicar em "Nova Avaliação"
- [ ] Preencher formulário completo:
  - [ ] Dados gerais
  - [ ] Medidas antropométricas
  - [ ] Composição corporal
  - [ ] Observações
- [ ] Salvar
- [ ] Verificar se avaliação aparece na lista

**Critério de Sucesso:**
✅ Formulário completo abre  
✅ Todas as seções funcionam  
✅ Validações funcionam  
✅ Salva com sucesso  
✅ Avaliação aparece na lista

---

#### 9. TESTE: Criar Reavaliação

- [ ] Após criar uma avaliação inicial
- [ ] Criar uma reavaliação
- [ ] Verificar se mostra comparação com avaliação anterior
- [ ] Verificar se calcula diferenças automaticamente

**Critério de Sucesso:**
✅ Reavaliação carrega dados anteriores  
✅ Mostra comparação lado a lado  
✅ Calcula diferenças (peso, IMC, % gordura)  
✅ Salva como 2ª avaliação, 3ª avaliação, etc.

---

#### 10. TESTE: Kanban - Visualizar e Mover Clientes

- [ ] Acessar `/pt/nutri/clientes/kanban`
- [ ] Verificar se aparece 5 colunas padrão:
  - [ ] Contato
  - [ ] Pré-Consulta
  - [ ] Ativa
  - [ ] Pausa
  - [ ] Finalizada
- [ ] Verificar se os clientes aparecem nas colunas corretas
- [ ] Arrastar um cliente de "Contato" para "Pré-Consulta"
- [ ] Verificar se status foi atualizado no banco
- [ ] Voltar para lista de clientes e conferir status

**Critério de Sucesso:**
✅ Kanban carrega com 5 colunas  
✅ Clientes aparecem nas colunas corretas  
✅ Drag & drop funciona  
✅ Status é atualizado no banco  
✅ Mudança persiste ao recarregar página

---

#### 11. TESTE: Kanban - Adicionar Cliente Direto na Coluna

- [ ] No Kanban, clicar em "+ Adicionar Cliente" em uma coluna
- [ ] Preencher formulário rápido
- [ ] Salvar
- [ ] Verificar se cliente aparece na coluna correta

**Critério de Sucesso:**
✅ Modal de novo cliente abre  
✅ Status inicial é pré-definido pela coluna  
✅ Cliente é criado e aparece na coluna

---

#### 12. TESTE: Kanban - Personalizar Colunas

- [ ] Clicar em "Personalizar Cards" ou "Configurações"
- [ ] Verificar opções de personalização:
  - [ ] Campos visíveis no card (telefone, email, objetivo, etc.)
  - [ ] Ações rápidas (WhatsApp, Ver perfil)
- [ ] Mudar configurações
- [ ] Salvar
- [ ] Verificar se cards foram atualizados

**Critério de Sucesso:**
✅ Modal de configuração abre  
✅ Permite escolher campos visíveis  
✅ Mudanças são salvas  
✅ Cards refletem as mudanças

---

#### 13. TESTE: Kanban - Criar Coluna Customizada

- [ ] Clicar em "Nova Coluna"
- [ ] Criar uma coluna customizada (ex: "Em Análise")
- [ ] Adicionar descrição
- [ ] Salvar
- [ ] Verificar se coluna aparece no Kanban
- [ ] Mover um cliente para essa coluna
- [ ] Deletar a coluna
- [ ] Verificar se clientes foram movidos para coluna padrão

**Critério de Sucesso:**
✅ Permite criar coluna customizada  
✅ Coluna aparece no Kanban  
✅ Pode mover clientes para ela  
✅ Pode editar nome/descrição  
✅ Pode deletar (com confirmação)  
✅ Clientes são realocados ao deletar coluna

---

#### 14. TESTE: Leads - Ver Lista de Leads

- [ ] Acessar `/pt/nutri/leads`
- [ ] Verificar se mostra lista de leads
- [ ] Verificar estatísticas no topo:
  - [ ] Total de Leads
  - [ ] Novos
  - [ ] Contatados
  - [ ] Convertidos
- [ ] Testar filtros (status, ferramenta)
- [ ] Testar busca

**Critério de Sucesso:**
✅ Lista de leads carrega  
✅ Estatísticas são precisas  
✅ Filtros funcionam  
✅ Busca funciona

---

#### 15. TESTE: Leads - Converter Lead em Cliente

- [ ] Na lista de leads, clicar em "Converter em Cliente"
- [ ] Escolher status inicial (Contato, Pré-Consulta, Ativa)
- [ ] Opcionalmente marcar "Criar avaliação inicial"
- [ ] Confirmar conversão
- [ ] Verificar se:
  - [ ] Lead desaparece da lista de leads
  - [ ] Cliente aparece na lista de clientes
  - [ ] Status está correto
  - [ ] Se marcou, avaliação foi criada

**Critério de Sucesso:**
✅ Modal de conversão abre  
✅ Permite escolher status  
✅ Permite criar avaliação inicial  
✅ Lead é convertido com sucesso  
✅ Cliente aparece na lista de clientes  
✅ Status correto no Kanban

---

#### 16. TESTE: Leads - Alertas de Leads Parados

- [ ] Verificar se há alertas de leads sem contato há X dias
- [ ] Configurar dias para alertar (1, 3, 5, 7 dias)
- [ ] Verificar se alertas aparecem corretamente

**Critério de Sucesso:**
✅ Sistema identifica leads parados  
✅ Mostra alertas no topo da página  
✅ Permite configurar dias  
✅ Botão "Converter" rápido funciona

---

#### 17. TESTE: Acompanhamento - Ver Clientes Ativos

- [ ] Acessar `/pt/nutri/acompanhamento`
- [ ] Verificar se lista apenas clientes com status "Ativa"
- [ ] Clicar em um cliente
- [ ] Verificar se abre o perfil

**Critério de Sucesso:**
✅ Lista apenas clientes ativos  
✅ Cards mostram informações relevantes  
✅ Link para perfil funciona

---

#### 18. TESTE: Formulários - Criar Novo Formulário

- [ ] Acessar `/pt/nutri/formularios`
- [ ] Clicar em "Novo Formulário"
- [ ] Criar um formulário simples
- [ ] Adicionar perguntas (texto, múltipla escolha, etc.)
- [ ] Salvar
- [ ] Verificar se formulário aparece na lista

**Critério de Sucesso:**
✅ Interface de criação funciona  
✅ Pode adicionar diferentes tipos de perguntas  
✅ Formulário é salvo  
✅ Aparece na lista

---

#### 19. TESTE: Formulários - Enviar para Cliente

- [ ] Selecionar um formulário
- [ ] Clicar em "Enviar"
- [ ] Escolher cliente(s)
- [ ] Enviar
- [ ] Verificar se cliente recebe notificação/link

**Critério de Sucesso:**
✅ Interface de envio funciona  
✅ Permite selecionar múltiplos clientes  
✅ Envia com sucesso  
✅ Cliente consegue acessar e responder

---

#### 20. TESTE: Formulários - Ver Respostas

- [ ] Após cliente responder formulário
- [ ] Acessar "Ver Respostas"
- [ ] Verificar se mostra todas as respostas
- [ ] Verificar se consegue exportar/baixar

**Critério de Sucesso:**
✅ Mostra todas as respostas  
✅ Organizado e legível  
✅ Permite exportar (se implementado)

---

#### 21. TESTE: Timeline - Ver Histórico de Atividades

- [ ] Abrir perfil de um cliente
- [ ] Ir na aba "Timeline"
- [ ] Verificar se mostra:
  - [ ] Cliente criado
  - [ ] Status alterado
  - [ ] Evolução registrada
  - [ ] Avaliação criada
  - [ ] Documentos enviados
- [ ] Testar filtros (se houver)

**Critério de Sucesso:**
✅ Timeline mostra todos os eventos  
✅ Ordenado cronologicamente (mais recente primeiro)  
✅ Ícones e descrições claros  
✅ Filtros funcionam (se implementado)

---

#### 22. TESTE: Documentos - Upload de Arquivos

- [ ] Abrir perfil de um cliente
- [ ] Ir na aba "Documentos"
- [ ] Fazer upload de um arquivo (PDF, imagem)
- [ ] Verificar se arquivo aparece na lista
- [ ] Tentar baixar o arquivo
- [ ] Tentar deletar o arquivo

**Critério de Sucesso:**
✅ Upload funciona  
✅ Suporta múltiplos formatos (PDF, JPG, PNG)  
✅ Mostra progresso do upload  
✅ Arquivo aparece na lista  
✅ Download funciona  
✅ Delete funciona (com confirmação)

---

#### 23. TESTE: Programa Nutricional (se implementado)

- [ ] Abrir perfil de um cliente
- [ ] Ir na aba "Programa"
- [ ] Criar um programa nutricional
- [ ] Salvar
- [ ] Verificar se programa aparece

**Critério de Sucesso:**
✅ Permite criar programa  
✅ Salva corretamente  
✅ Cliente consegue ver (se houver área do cliente)

---

#### 24. TESTE: Chat com LYA no Perfil do Cliente

- [ ] Abrir perfil de um cliente
- [ ] Verificar se widget de chat da LYA aparece
- [ ] Fazer uma pergunta sobre o cliente
- [ ] Verificar se LYA responde com contexto do cliente

**Critério de Sucesso:**
✅ Widget aparece no perfil  
✅ LYA tem contexto do cliente  
✅ Sugestões são relevantes  
✅ Chat funciona normalmente

---

### 🔵 FASE 2: TESTES AVANÇADOS

#### 25. TESTE: Performance com Muitos Clientes

- [ ] Importar 100+ clientes
- [ ] Testar velocidade de carregamento da lista
- [ ] Testar velocidade do Kanban
- [ ] Testar busca com muitos resultados

**Critério de Sucesso:**
✅ Lista carrega em < 2 segundos  
✅ Kanban carrega em < 3 segundos  
✅ Busca responde em < 1 segundo  
✅ Não há travamentos

---

#### 26. TESTE: Sincronização de Dados

- [ ] Abrir lista de clientes em uma aba
- [ ] Abrir Kanban em outra aba
- [ ] Mover cliente no Kanban
- [ ] Recarregar lista de clientes
- [ ] Verificar se status está atualizado

**Critério de Sucesso:**
✅ Dados são sincronizados  
✅ Mudanças aparecem em todas as views  
✅ Sem dados desatualizados

---

#### 27. TESTE: Validações e Segurança

- [ ] Tentar criar cliente sem nome (obrigatório)
- [ ] Tentar salvar email inválido
- [ ] Tentar salvar CPF inválido
- [ ] Tentar acessar cliente de outro usuário (via URL)

**Critério de Sucesso:**
✅ Validações impedem dados inválidos  
✅ Mensagens de erro são claras  
✅ Não consegue acessar dados de outros usuários

---

#### 28. TESTE: Responsividade (Mobile)

- [ ] Abrir todas as páginas no celular:
  - [ ] Lista de clientes
  - [ ] Perfil do cliente
  - [ ] Kanban
  - [ ] Leads
  - [ ] Acompanhamento
- [ ] Verificar se layouts adaptam
- [ ] Verificar se funcionalidades funcionam no mobile

**Critério de Sucesso:**
✅ Layout adapta para mobile  
✅ Menus móveis funcionam  
✅ Touch/drag funciona no Kanban  
✅ Formulários são usáveis no mobile

---

#### 29. TESTE: Integração com Outras Áreas

- [ ] Criar lead através de ferramenta (quiz/calculadora)
- [ ] Verificar se lead aparece na página de Leads
- [ ] Converter lead em cliente
- [ ] Verificar se cliente aparece no Dashboard (Home)
- [ ] Verificar se estatísticas do GSAL são atualizadas

**Critério de Sucesso:**
✅ Leads de ferramentas aparecem corretamente  
✅ Conversão atualiza todas as áreas  
✅ Dashboard reflete dados atualizados  
✅ Integração entre áreas funciona

---

### 🔵 FASE 3: VERIFICAR FUNCIONALIDADES FALTANTES

#### 30. INVESTIGAR: Rotina Mínima

- [ ] Acessar `/pt/nutri/rotina-minima` ou similar
- [ ] Verificar se página existe
- [ ] Se existe:
  - [ ] O que ela faz?
  - [ ] Funciona corretamente?
- [ ] Se NÃO existe:
  - [ ] Decidir se precisa ser criada
  - [ ] Definir o que seria "Rotina Mínima"

**Possível funcionalidade:**
- Checklist diário de tarefas da nutricionista
- Ex: "Responder mensagens", "Revisar agendamentos", "Seguir leads", etc.

---

#### 31. INVESTIGAR: Métricas

- [ ] Acessar `/pt/nutri/metricas` ou similar
- [ ] Verificar se página existe
- [ ] Se existe:
  - [ ] Quais métricas mostra?
  - [ ] Gráficos funcionam?
  - [ ] Dados estão corretos?
- [ ] Se NÃO existe:
  - [ ] Decidir se precisa ser criada
  - [ ] Definir quais métricas são importantes

**Possíveis métricas:**
- Total de clientes ativos vs inativos
- Taxa de conversão de leads
- Consultas realizadas no mês
- Receita (se houver integração financeira)
- Churn (clientes que cancelaram)
- Origem dos leads (qual ferramenta trouxe mais)

---

#### 32. INVESTIGAR: Painel GSAL

- [ ] Acessar `/pt/nutri/gsal`
- [ ] Verificar se é diferente da Home
- [ ] O que mostra?
- [ ] Funciona corretamente?

**Critério:**
✅ Painel mostra visão geral do pipeline  
✅ Gráficos e estatísticas são precisos  
✅ É útil para a nutricionista

---

## 📋 RESUMO DO PLANO DE VALIDAÇÃO

### ✅ O QUE JÁ ESTÁ BOM E FUNCIONA

1. ✅ Cadastro de clientes (manual e importação)
2. ✅ Lista de clientes com filtros e busca
3. ✅ Kanban completo e funcional
4. ✅ Perfil do cliente com múltiplas abas
5. ✅ Registro de evoluções físicas
6. ✅ Avaliações nutricionais
7. ✅ Reavaliações com comparação
8. ✅ Sistema de leads
9. ✅ Conversão de leads
10. ✅ Alertas inteligentes
11. ✅ Formulários personalizados
12. ✅ Timeline de atividades
13. ✅ Upload de documentos
14. ✅ Acompanhamento de clientes ativos

### ⚠️ O QUE PRECISA VERIFICAR

1. ❓ **Rotina Mínima** - Existe? Funciona? Precisa criar?
2. ❓ **Métricas** - Existe? Funciona? Precisa criar?
3. ❓ **Painel GSAL** - É diferente da Home? O que mostra?

### 🎯 PRIORIDADE DE TESTES

**PRIORIDADE MÁXIMA (testar primeiro):**
1. Criar cliente
2. Ver lista de clientes
3. Abrir perfil do cliente
4. Registrar evolução física
5. Criar avaliação
6. Kanban (visualizar e mover)
7. Converter lead em cliente

**PRIORIDADE ALTA:**
8. Importar pacientes
9. Criar reavaliação
10. Buscar e filtrar
11. Timeline
12. Formulários

**PRIORIDADE MÉDIA:**
13. Documentos
14. Personalizar Kanban
15. Alertas de leads
16. Acompanhamento

**PRIORIDADE BAIXA (pode testar depois):**
17. Performance com muitos clientes
18. Sincronização
19. Mobile
20. Integrações

---

## 🚀 PRÓXIMOS PASSOS

### HOJE

1. **Executar testes da Fase 1 (Testes Básicos)**
   - Focar nos itens de Prioridade Máxima
   - Anotar todos os bugs encontrados
   - Anotar todas as melhorias necessárias

2. **Investigar páginas faltantes**
   - Verificar se Rotina Mínima existe
   - Verificar se Métricas existe
   - Documentar o que falta

3. **Criar documento de bugs/melhorias**
   - Lista de bugs críticos
   - Lista de bugs menores
   - Lista de melhorias desejadas

### AMANHÃ

4. **Executar testes da Fase 2 (Avançados)**
5. **Corrigir bugs críticos encontrados**
6. **Testar novamente após correções**

### PRÓXIMOS DIAS

7. **Criar páginas faltantes (se necessário)**
8. **Implementar melhorias prioritárias**
9. **Executar testes da Fase 3**
10. **Documentar tudo que foi feito**

---

## 📝 TEMPLATE PARA REPORTAR BUGS

```markdown
### BUG: [Título curto e descritivo]

**Severidade:** 🔴 Crítico | 🟡 Médio | 🟢 Baixo

**Onde:** [Página/Componente]

**Descrição:**
[O que aconteceu]

**Passos para reproduzir:**
1. [Passo 1]
2. [Passo 2]
3. [Passo 3]

**Comportamento esperado:**
[O que deveria acontecer]

**Comportamento atual:**
[O que está acontecendo]

**Screenshots:** (se aplicável)
[Adicionar imagem]

**Navegador/Dispositivo:**
[Chrome, Safari, Mobile, etc.]
```

---

## 📝 TEMPLATE PARA SUGERIR MELHORIAS

```markdown
### MELHORIA: [Título curto e descritivo]

**Prioridade:** 🔴 Alta | 🟡 Média | 🟢 Baixa

**Onde:** [Página/Componente]

**Descrição:**
[O que poderia ser melhorado]

**Justificativa:**
[Por que isso é importante]

**Sugestão de implementação:**
[Como poderia ser feito]

**Impacto:**
[Quantos usuários isso afeta? Quanto tempo economiza?]
```

---

## ✅ CRITÉRIOS DE SUCESSO GERAL

Para considerar a **Gestão de Clientes 100% validada e funcional**, TODOS esses critérios devem ser atendidos:

1. ✅ Nutricionista consegue cadastrar cliente (< 2 minutos)
2. ✅ Nutricionista consegue importar 10+ clientes de uma vez
3. ✅ Nutricionista consegue buscar e encontrar cliente rapidamente (< 5 segundos)
4. ✅ Nutricionista consegue ver perfil completo do cliente
5. ✅ Nutricionista consegue registrar evolução física (< 3 minutos)
6. ✅ Nutricionista vê gráfico de peso atualizado automaticamente
7. ✅ Nutricionista consegue criar avaliação nutricional completa (< 10 minutos)
8. ✅ Nutricionista consegue criar reavaliação com comparação automática
9. ✅ Nutricionista consegue organizar clientes no Kanban (drag & drop)
10. ✅ Nutricionista consegue captar e converter leads
11. ✅ Nutricionista vê alertas de leads parados
12. ✅ Nutricionista consegue enviar formulários para clientes
13. ✅ Nutricionista vê timeline de atividades de cada cliente
14. ✅ Nutricionista consegue fazer upload de documentos
15. ✅ Sistema funciona bem no mobile
16. ✅ Nenhum erro crítico no console
17. ✅ Performance aceitável (todas as páginas carregam em < 3 segundos)
18. ✅ Dados são salvos corretamente no banco
19. ✅ Integrações entre áreas funcionam (Leads → Clientes → Dashboard)
20. ✅ LYA consegue orientar sobre gestão de clientes

---

## 📞 PERGUNTAS PARA DECIDIR

### 1. Rotina Mínima

**Pergunta:** O que seria a "Rotina Mínima"?

**Opções:**
- A) Checklist diário de tarefas da nutricionista
- B) Rotina de atendimento (passo a passo)
- C) Hábitos mínimos para manter negócio funcionando
- D) Outra coisa?

**Decisão:** _______________________________

---

### 2. Métricas

**Pergunta:** Quais métricas são realmente importantes?

**Opções:**
- A) Total de clientes (ativas, inativas, por status)
- B) Taxa de conversão de leads
- C) Consultas realizadas no mês
- D) Origem dos leads (qual ferramenta trouxe mais)
- E) Receita/financeiro
- F) Churn (clientes que cancelaram)
- G) Todas as acima
- H) Apenas A, B e D

**Decisão:** _______________________________

---

### 3. Painel GSAL vs Home

**Pergunta:** O Painel GSAL deve ser diferente da Home?

**Opções:**
- A) Sim, Painel GSAL é mais detalhado (métricas, gráficos)
- B) Não, são a mesma coisa
- C) Painel GSAL é um resumo executivo específico

**Decisão:** _______________________________

---

**📌 IMPORTANTE:**  
Este documento deve ser usado como guia durante os testes. Marque cada checkbox conforme completa os testes e anote todos os bugs e melhorias encontrados.

**Última atualização:** 18 de Dezembro de 2025  
**Status:** 📋 Plano criado, aguardando execução dos testes

