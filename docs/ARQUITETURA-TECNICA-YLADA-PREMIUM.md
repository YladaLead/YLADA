# 📐 DOCUMENTO INTERNO TÉCNICO — ARQUITETURA YLADA PREMIUM

**Data:** Hoje  
**Status:** Análise e Planejamento  
**Objetivo:** Mapear estrutura existente e propor reorganização para Arquitetura YLADA Premium

---

## 🎯 ENTENDIMENTO DA NOVA FILOSOFIA

### **Mudança de Posicionamento:**
- ✅ **ANTES:** Ferramentas como produto separado
- ✅ **AGORA:** Ferramentas = parte do Método YLADA (integradas)
- ✅ **ANTES:** Manual Técnico separado
- ✅ **AGORA:** Manual Técnico = Biblioteca (suporte ao método)
- ✅ **Foco:** Jornada de Transformação como elemento central

### **Princípio Central:**
> O YLADA não é uma lista de funcionalidades. É um **método completo de transformação** onde tudo conversa entre si.

---

## 📍 1. MAPEAMENTO DE ROTAS EXISTENTES (ÁREA NUTRI)

### **1.1. Rotas Principais**
```
/pt/nutri/
├── page.tsx                          # Landing Nutri
├── home/page.tsx                    # Home atual
├── dashboard/page.tsx                # Dashboard atual
├── login/page.tsx                    # Login
├── reset-password/page.tsx           # Reset senha
└── recuperar-senha/page.tsx         # Recuperar senha
```

### **1.2. Rotas de Captação (Ferramentas)**
```
/pt/nutri/
├── ferramentas/
│   ├── page.tsx                     # Listagem de ferramentas
│   ├── nova/page.tsx                # Criar nova ferramenta
│   ├── [id]/editar/page.tsx         # Editar ferramenta
│   └── templates/page.tsx           # Templates disponíveis
├── quizzes/
│   └── page.tsx                     # Listagem de quizzes
├── quiz-personalizado/
│   └── page.tsx                     # Criar quiz personalizado
├── portals/
│   ├── page.tsx                     # Listagem de portais
│   ├── novo/page.tsx                # Criar portal
│   └── [id]/editar/page.tsx         # Editar portal
└── leads/
    └── page.tsx                     # Gestão de leads
```

### **1.3. Rotas de Gestão (GSAL)**
```
/pt/nutri/
├── clientes/
│   ├── page.tsx                     # Listagem de clientes
│   ├── novo/page.tsx                # Novo cliente
│   ├── [id]/page.tsx                # Detalhes do cliente
│   └── kanban/page.tsx              # Kanban de clientes
├── agenda/
│   └── page.tsx                     # Agenda
├── acompanhamento/
│   └── page.tsx                     # Acompanhamento
└── relatorios-gestao/
    └── page.tsx                     # Relatórios
```

### **1.4. Rotas de Formação/Método YLADA** ⭐ **JÁ IMPLEMENTADO**
```
/pt/nutri/
├── metodo/
│   ├── page.tsx                     # Home do Método YLADA
│   ├── jornada/
│   │   ├── page.tsx                 # Painel da Jornada 30 Dias
│   │   ├── dia/[numero]/page.tsx    # Página de cada dia
│   │   └── concluida/page.tsx        # Jornada concluída
│   ├── pilares/
│   │   ├── page.tsx                 # Lista dos 5 Pilares
│   │   └── [id]/page.tsx            # Página de cada Pilar
│   ├── exercicios/
│   │   ├── page.tsx                 # Lista de exercícios
│   │   └── [id]/page.tsx            # Página de exercício
│   ├── ferramentas/
│   │   ├── page.tsx                 # Lista de ferramentas
│   │   └── [id]/page.tsx            # Página de ferramenta
│   ├── painel/
│   │   ├── diario/page.tsx          # Painel Diário
│   │   └── agenda/page.tsx          # Agenda Estratégica
│   └── manual/
│       └── page.tsx                 # Manual Técnico
└── formacao/                        # ⚠️ Rota antiga (manter por compatibilidade)
    └── ...                          # Mesma estrutura do /metodo
```

### **1.5. Rotas de Formulários**
```
/pt/nutri/
├── formularios/
│   ├── page.tsx                     # Listagem
│   ├── novo/page.tsx                # Criar
│   ├── [id]/page.tsx                # Detalhes
│   ├── [id]/enviar/page.tsx         # Enviar
│   └── [id]/respostas/page.tsx      # Respostas
```

### **1.6. Rotas Públicas**
```
/pt/nutri/
├── [user-slug]/
│   ├── [tool-slug]/page.tsx         # Ferramenta pública
│   └── quiz/[slug]/page.tsx         # Quiz público
└── portal/[slug]/page.tsx           # Portal público
```

### **1.7. Rotas de Suporte e Configurações**
```
/pt/nutri/
├── suporte/
│   ├── page.tsx                     # Suporte
│   ├── tickets/page.tsx             # Tickets
│   └── atendente/page.tsx           # Atendente
├── configuracao/page.tsx            # Configurações
└── configuracoes/page.tsx           # Configurações (alternativa)
```

---

## 🗄️ 2. MAPEAMENTO DE TABELAS SUPABASE

### **2.1. Tabelas de Autenticação e Perfil**
```sql
auth.users                    -- Usuários do Supabase Auth
user_profiles                 -- Perfis (nutri, wellness, coach, nutra)
```

### **2.2. Tabelas de Ferramentas e Captação**
```sql
user_templates                -- Instâncias de ferramentas criadas pelos usuários
templates_nutrition           -- Catálogo de templates pré-criados
generated_links               -- Links gerados
quizzes                       -- Quizzes criados
quiz_perguntas                -- Perguntas dos quizzes
quiz_respostas                -- Respostas dos quizzes
leads                         -- Leads capturados
coach_leads                   -- Leads específicos do Coach
```

### **2.3. Tabelas de Gestão (GSAL)**
```sql
clients                       -- Clientes (se existir)
appointments                  -- Consultas/Agendamentos (se existir)
-- Nota: Verificar nomes exatos das tabelas de gestão
```

### **2.4. Tabelas do Método YLADA** ⭐ **JÁ CRIADAS**
```sql
journey_days                  -- Dias da Jornada (30 dias)
journey_progress              -- Progresso da jornada por usuário
journey_checklist_log         -- Logs de checklist
journey_checklist_notes       -- Notas dos checklists
journey_daily_notes           -- Anotações diárias
journey_ritual_final          -- Dados do Ritual Final
pilar_notes                   -- Anotações dos Pilares
exercicio_notes               -- Notas dos exercícios
exercicio_progress            -- Progresso dos exercícios
```

### **2.5. Tabelas de Formação (Legado)**
```sql
courses_trails                -- Trilhas/Capítulos
trails_modules                -- Módulos das trilhas
trails_lessons                -- Aulas/Lições
microcourses                  -- Microcursos
library_files                 -- Arquivos da biblioteca
tutorials                     -- Tutoriais
progress_user_trails          -- Progresso nas trilhas
```

### **2.6. Tabelas de Assinaturas e Pagamentos**
```sql
subscriptions                 -- Assinaturas
payments                      -- Pagamentos
```

---

## 🧩 3. COMPONENTES REUTILIZÁVEIS EXISTENTES

### **3.1. Componentes de Layout**
```
src/components/
├── nutri/
│   ├── NutriSidebar.tsx              # Sidebar principal (ATUAL)
│   ├── ConditionalSidebar.tsx        # Sidebar condicional
│   └── NutriNavBar.tsx                # NavBar
└── formacao/
    ├── FormacaoHeader.tsx             # Header do Método
    └── FormacaoTabs.tsx               # Tabs de navegação
```

### **3.2. Componentes do Método YLADA**
```
src/components/formacao/
├── JornadaSection.tsx                 # Seção da Jornada
├── PilarSecao.tsx                     # Seção de Pilar
├── PilarAnotacao.tsx                  # Campo de anotação
├── ExercicioLayout.tsx                # Layout de exercício
├── ExercicioChecklist.tsx              # Checklist de exercício
├── ExercicioCampoTexto.tsx             # Campo de texto
├── AcaoPraticaCard.tsx                 # Card de ação prática
├── ChecklistItem.tsx                   # Item de checklist
└── ReflexaoDia.tsx                     # Reflexão do dia
```

### **3.3. Componentes de UI Genéricos**
```
src/components/
├── shared/
│   └── DynamicTemplatePreview.tsx     # Preview de templates
└── auth/
    ├── ProtectedRoute.tsx              # Rota protegida
    └── RequireSubscription.tsx         # Requer assinatura
```

---

## 🗺️ 4. MAPA DE NAVEGAÇÃO ATUAL

### **4.1. Sidebar Atual (NutriSidebar.tsx)**
```
🏠 Home
🎯 Captação
   ├── Home / Visão Geral
   ├── Meus Links
   ├── Quizzes
   ├── Templates
   └── Leads
📁 Gestão
   ├── Meus Clientes
   ├── Kanban de Clientes
   ├── Agenda
   ├── Acompanhamento
   └── Relatórios de Gestão
🧩 Formulários
🎓 Formação Empresarial → /pt/nutri/formacao
⚙️ Configurações
```

### **4.2. Fluxo Atual de Navegação**
1. Usuário entra em `/pt/nutri/home` ou `/pt/nutri/dashboard`
2. Sidebar oferece acesso a:
   - Captação (ferramentas, quizzes, leads)
   - Gestão (clientes, kanban, agenda)
   - Formulários
   - Formação Empresarial (redireciona para `/pt/nutri/formacao`)
   - Configurações
3. Formação Empresarial leva para `/pt/nutri/formacao` (ou `/pt/nutri/metodo`)

---

## 🎯 5. PROPOSTA DE MAPEAMENTO — NOVA ARQUITETURA YLADA PREMIUM

### **5.1. Nova Estrutura do Sidebar**
```
🏠 Home                              → /pt/nutri/home (NOVA HOME)
📘 Jornada 30 Dias                  → /pt/nutri/metodo/jornada
📚 Pilares do Método                → /pt/nutri/metodo/pilares
🧰 Ferramentas                      → /pt/nutri/ferramentas (REORGANIZAR)
📊 Gestão GSAL                      → /pt/nutri/clientes (REORGANIZAR)
🎒 Biblioteca                       → /pt/nutri/metodo/manual (NOVA)
📝 Minhas Anotações                 → /pt/nutri/anotacoes (NOVA)
⚙️ Configurações                    → /pt/nutri/configuracao
```

### **5.2. Mapeamento Detalhado**

#### **🏠 Home → Nova Home YLADA Premium**
- **Rota atual:** `/pt/nutri/home` ou `/pt/nutri/dashboard`
- **Ação:** REORGANIZAR conteúdo existente
- **Novo layout:**
  1. Bloco Jornada (progresso + botão "Continuar")
  2. Bloco Pilares (5 cards)
  3. Bloco Ferramentas (atalhos + grid)
  4. Bloco GSAL (resumo + pipeline)
  5. Bloco Biblioteca (links)
  6. Bloco Anotações (campo integrado)

#### **📘 Jornada 30 Dias**
- **Rota atual:** `/pt/nutri/metodo/jornada` ✅ **JÁ EXISTE**
- **Ação:** MANTER (já implementado)
- **Status:** ✅ Completo

#### **📚 Pilares do Método**
- **Rota atual:** `/pt/nutri/metodo/pilares` ✅ **JÁ EXISTE**
- **Ação:** MANTER (já implementado)
- **Status:** ✅ Completo

#### **🧰 Ferramentas**
- **Rota atual:** `/pt/nutri/ferramentas`
- **Ação:** REORGANIZAR layout (não mudar rotas)
- **Mudanças:**
  - Adicionar atalhos rápidos no topo
  - Adicionar filtros (Fluxos | Quizzes | Templates)
  - Manter grid existente
  - Adicionar botões "Abrir no GSAL" onde fizer sentido

#### **📊 Gestão GSAL**
- **Rota atual:** `/pt/nutri/clientes` (principal)
- **Ação:** REORGANIZAR e INTEGRAR
- **Mudanças:**
  - Adicionar card "Rotina Mínima" no topo
  - Adicionar painel resumo (KPIs)
  - Melhorar visualização do Kanban
  - Integrar com Painel Diário (`/pt/nutri/metodo/painel/diario`)

#### **🎒 Biblioteca**
- **Rota atual:** `/pt/nutri/metodo/manual` (existe, mas básico)
- **Ação:** EXPANDIR conteúdo
- **Estrutura:**
  - Manual Técnico
  - Tutoriais em Vídeo
  - PDFs da Formação
  - Bônus

#### **📝 Minhas Anotações**
- **Rota atual:** ❌ **NÃO EXISTE**
- **Ação:** CRIAR nova rota
- **Estrutura:**
  - Editor de anotações
  - Lista de anotações
  - Tags e categorias
  - Integração com exercícios concluídos

---

## 🔄 6. O QUE SERÁ REALOCADO, REAPROVEITADO E CRIADO

### **6.1. REALOCADO (Reorganizar Layout/Conteúdo)**
- ✅ `/pt/nutri/home` → Nova estrutura de blocos
- ✅ `/pt/nutri/ferramentas` → Adicionar atalhos e filtros
- ✅ `/pt/nutri/clientes` → Adicionar Rotina Mínima e KPIs
- ✅ `/pt/nutri/metodo/manual` → Expandir para Biblioteca completa

### **6.2. REAPROVEITADO (Manter Como Está)**
- ✅ `/pt/nutri/metodo/jornada` → Já completo
- ✅ `/pt/nutri/metodo/pilares` → Já completo
- ✅ `/pt/nutri/metodo/exercicios` → Já completo
- ✅ `/pt/nutri/metodo/painel` → Já completo
- ✅ Todas as rotas de API existentes
- ✅ Todas as tabelas do Supabase
- ✅ Componentes do Método YLADA

### **6.3. CRIADO DO ZERO**
- ⚠️ `/pt/nutri/anotacoes` → Nova página de anotações
- ⚠️ Componentes genéricos reutilizáveis (se necessário):
  - `PageLayout.tsx`
  - `Section.tsx`
  - `Card.tsx`
  - `PrimaryButton.tsx`
  - `SecondaryButton.tsx`
  - `ProgressBar.tsx`

### **6.4. TABELAS (NÃO ALTERAR)**
- ✅ **NÃO criar novas tabelas** sem aprovação
- ✅ **NÃO renomear tabelas existentes**
- ✅ **NÃO alterar estrutura de tabelas existentes**
- ⚠️ Se necessário criar `anotacoes` (nova tabela), mas só após aprovação

---

## 🎨 7. COMPONENTIZAÇÃO PROPOSTA

### **7.1. Componentes Genéricos a Criar/Reaproveitar**
```
src/components/shared/
├── PageLayout.tsx                    # Layout padrão de página
├── Section.tsx                       # Seção com título
├── Card.tsx                          # Card genérico
├── PrimaryButton.tsx                 # Botão primário
├── SecondaryButton.tsx               # Botão secundário
├── ProgressBar.tsx                   # Barra de progresso
└── KPICard.tsx                       # Card de KPI
```

### **7.2. Componentes Específicos da Home**
```
src/components/nutri/home/
├── JornadaBlock.tsx                  # Bloco da Jornada
├── PilaresBlock.tsx                  # Bloco dos Pilares
├── FerramentasBlock.tsx              # Bloco de Ferramentas
├── GSALBlock.tsx                     # Bloco GSAL
├── BibliotecaBlock.tsx               # Bloco Biblioteca
└── AnotacoesBlock.tsx                # Bloco Anotações
```

---

## 📋 8. CHECKLIST DE IMPLEMENTAÇÃO

### **ETAPA 1 — Diagnóstico** ✅ **ESTE DOCUMENTO**
- [x] Mapear rotas existentes
- [x] Mapear tabelas Supabase
- [x] Mapear componentes existentes
- [x] Mapear navegação atual
- [x] Propor mapeamento da nova arquitetura
- [x] Identificar o que será realocado, reaproveitado e criado

### **ETAPA 2 — Navbar + Home** ⏳ **PRÓXIMO**
- [ ] Atualizar `NutriSidebar.tsx` com nova estrutura
- [ ] Criar nova Home (`/pt/nutri/home`) com blocos
- [ ] Criar componentes de blocos da Home
- [ ] Integrar com dados existentes (Jornada, Pilares, etc.)

### **ETAPA 3 — Páginas Estruturais**
- [ ] Reorganizar `/pt/nutri/ferramentas`
- [ ] Reorganizar `/pt/nutri/clientes` (GSAL)
- [ ] Expandir `/pt/nutri/metodo/manual` (Biblioteca)
- [ ] Criar `/pt/nutri/anotacoes`

### **ETAPA 4 — Conexão com Dados**
- [ ] Conectar Home com APIs existentes
- [ ] Integrar Rotina Mínima no GSAL
- [ ] Conectar Anotações com exercícios concluídos

### **ETAPA 5 — Refinos de UX/Visual**
- [ ] Ajustar espaçamentos e cores
- [ ] Testar responsividade
- [ ] Validar navegação

---

## ⚠️ 9. AVISOS IMPORTANTES

### **9.1. NÃO QUEBRAR**
- ❌ NÃO alterar rotas de API existentes
- ❌ NÃO renomear tabelas do Supabase
- ❌ NÃO alterar estrutura de tabelas existentes
- ❌ NÃO remover funcionalidades existentes
- ❌ NÃO alterar lógica de autenticação/autorização

### **9.2. PRINCÍPIOS**
- ✅ Reaproveitar ao máximo o que já existe
- ✅ Adicionar, não substituir
- ✅ Reorganizar layout, não estrutura
- ✅ Componentizar para facilitar manutenção
- ✅ Manter compatibilidade com código existente

---

## ✅ 10. CONFIRMAÇÃO DE ENTENDIMENTO

### **Entendi que:**
1. ✅ A nova filosofia integra Ferramentas ao Método (não são produtos separados)
2. ✅ Manual Técnico vai para Biblioteca (suporte ao método)
3. ✅ Jornada é o elemento central da experiência
4. ✅ Tudo deve conversar entre si (Jornada → Pilares → Ferramentas → Gestão)
5. ✅ NÃO devo quebrar o que já existe
6. ✅ Devo REORGANIZAR e APRIMORAR, não recriar

### **Próximo passo:**
Aguardar aprovação deste documento antes de iniciar implementação.

---

**Documento criado em:** Hoje  
**Status:** Aguardando aprovação para iniciar implementação

