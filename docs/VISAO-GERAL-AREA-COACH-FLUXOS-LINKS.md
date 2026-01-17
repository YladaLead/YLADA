# 📊 VISÃO GERAL: ÁREA COACH - FLUXOS E LINKS

**Data:** 2025-01-21  
**Objetivo:** Documentar estado atual da área Coach, comparando com Nutri, focando em fluxos e links  
**Status:** Documentação apenas (sem alterações)

---

## 🎯 RESUMO EXECUTIVO

### **Estado Atual da Área Coach**

✅ **Estrutura Completa:**
- 41 páginas criadas (paridade com Nutri)
- 39 rotas API funcionais
- Sidebar e NavBar implementados
- Validação server-side com `(protected)`

❌ **Diferenças vs Nutri:**
- **NÃO possui diagnóstico/onboarding** (Nutri tem)
- **NÃO possui Jornada 30 Dias** (Nutri tem)
- **NÃO possui LYA** (Nutri tem)
- **NÃO possui Método YLADA** (Nutri tem)

✅ **Funcionalidades Completas:**
- Ferramentas/Links (igual Nutri)
- Gestão de Clientes (igual Nutri)
- Formulários (igual Nutri)
- Leads (igual Nutri)
- Portals (igual Nutri)

---

## 🔄 FLUXOS COMPARATIVOS: COACH vs NUTRI

### **1. FLUXO DE PRIMEIRO ACESSO**

#### **NUTRI** ✅
```
Login → Verifica diagnóstico
  ├─ Sem diagnóstico → /pt/nutri/onboarding
  │   └─ Botão "Começar" → /pt/nutri/diagnostico
  │       └─ Após completar → /pt/nutri/home
  └─ Com diagnóstico → /pt/nutri/home
```

**Páginas envolvidas:**
- `/pt/nutri/onboarding` - Tela de boas-vindas
- `/pt/nutri/diagnostico` - Formulário de diagnóstico estratégico
- `/pt/nutri/home` - Home principal

**Validação:**
- Flag `diagnostico_completo` no `user_profiles`
- `RequireDiagnostico` redireciona se não completou

#### **COACH** ❌
```
Login → /pt/coach/home (direto)
```

**Páginas envolvidas:**
- `/pt/coach/home` - Home principal (acesso direto)

**Validação:**
- Apenas validação de sessão e assinatura
- **NÃO possui diagnóstico/onboarding**

**Diagnóstico:**
- ❌ **Coach NÃO possui diagnóstico inicial**
- ❌ **Coach NÃO possui onboarding**
- ❌ **Coach NÃO possui fluxo de primeiro acesso estruturado**

---

### **2. FLUXO DE FERRAMENTAS/LINKS**

#### **NUTRI** ✅
```
/pt/nutri/ferramentas (listagem)
  ├─ Criar nova → /pt/nutri/ferramentas/nova
  ├─ Editar → /pt/nutri/ferramentas/[id]/editar
  └─ Templates → /pt/nutri/ferramentas/templates

Links públicos:
  ├─ /pt/nutri/[user-slug]/[tool-slug] (com user_slug)
  └─ /pt/nutri/ferramenta/[id] (fallback sem user_slug)

Quizzes:
  └─ /pt/nutri/[user-slug]/quiz/[slug]
```

**URLs geradas:**
- `https://ylada.app/pt/nutri/{user-slug}/{tool-slug}`
- `https://ylada.app/p/{short-code}` (encurtado)

#### **COACH** ✅
```
/pt/coach/ferramentas (listagem)
  ├─ Criar nova → /pt/coach/ferramentas/nova
  ├─ Editar → /pt/coach/ferramentas/[id]/editar
  └─ Templates → /pt/coach/ferramentas/templates

Links públicos:
  ├─ /pt/c/[user-slug]/[tool-slug] (com user_slug) ⚠️ DIFERENTE
  └─ /pt/c/ferramenta/[id] (fallback sem user_slug) ⚠️ DIFERENTE

Quizzes:
  └─ /pt/c/[user-slug]/quiz/[slug] ⚠️ DIFERENTE
```

**URLs geradas:**
- `https://ylada.app/pt/c/{user-slug}/{tool-slug}` ⚠️ **Usa `/c/` ao invés de `/coach/`**
- `https://ylada.app/p/{short-code}` (encurtado)

**Diferença importante:**
- Coach usa rota curta `/pt/c/` ao invés de `/pt/coach/`
- Isso é intencional para URLs mais curtas

---

### **3. FLUXO DE PORTALS**

#### **NUTRI** ✅
```
/pt/nutri/portals (listagem)
  ├─ Criar novo → /pt/nutri/portals/novo
  └─ Editar → /pt/nutri/portals/[id]/editar

Portal público:
  └─ /pt/nutri/portal/[slug]
```

#### **COACH** ✅
```
/pt/coach/portals (listagem)
  ├─ Criar novo → /pt/coach/portals/novo
  └─ Editar → /pt/coach/portals/[id]/editar

Portal público:
  └─ /pt/c/portal/[slug] ⚠️ DIFERENTE (usa /c/)
```

**Diferença:**
- Coach também usa `/pt/c/portal/` ao invés de `/pt/coach/portal/`

---

### **4. FLUXO DE FORMULÁRIOS**

#### **NUTRI** ✅
```
/pt/nutri/formularios (listagem)
  ├─ Criar novo → /pt/nutri/formularios/novo
  ├─ Editar → /pt/nutri/formularios/[id]
  ├─ Enviar → /pt/nutri/formularios/[id]/enviar
  └─ Respostas → /pt/nutri/formularios/[id]/respostas

Formulário público:
  └─ /pt/nutri/[user-slug]/formulario/[slug]
```

#### **COACH** ✅
```
/pt/coach/formularios (listagem)
  ├─ Criar novo → /pt/coach/formularios/novo
  ├─ Editar → /pt/coach/formularios/[id]
  ├─ Enviar → /pt/coach/formularios/[id]/enviar
  └─ Respostas → /pt/coach/formularios/[id]/respostas

Formulário público:
  └─ /f/[formId] (rota global, não específica de área)
```

**Diferença:**
- Coach usa rota global `/f/[formId]` para formulários públicos
- Nutri usa rota específica `/pt/nutri/[user-slug]/formulario/[slug]`

---

## 🔗 ESTRUTURA DE LINKS E ROTAS

### **Rotas Protegidas (Requerem Login)**

#### **COACH**
```
/pt/coach/
├── (protected)/
│   ├── home/page.tsx                    # Home principal
│   ├── dashboard/page.tsx                # Dashboard (redireciona para home)
│   ├── ferramentas/
│   │   ├── page.tsx                     # Listagem de ferramentas
│   │   ├── nova/page.tsx                # Criar nova ferramenta
│   │   ├── [id]/editar/page.tsx         # Editar ferramenta
│   │   └── templates/page.tsx            # Templates disponíveis
│   ├── clientes/
│   │   ├── page.tsx                     # Lista de clientes
│   │   ├── [id]/page.tsx                # Detalhes do cliente
│   │   ├── novo/page.tsx                # Criar novo cliente
│   │   └── kanban/page.tsx              # Kanban de clientes
│   ├── leads/page.tsx                   # Gestão de leads
│   ├── quizzes/page.tsx                 # Listagem de quizzes
│   ├── formularios/
│   │   ├── page.tsx                     # Listagem de formulários
│   │   ├── novo/page.tsx                # Criar novo formulário
│   │   ├── [id]/page.tsx                # Editar formulário
│   │   ├── [id]/enviar/page.tsx         # Enviar formulário
│   │   └── [id]/respostas/page.tsx      # Ver respostas
│   ├── agenda/page.tsx                  # Agenda de consultas
│   ├── acompanhamento/page.tsx          # Acompanhamento de clientes
│   ├── relatorios-gestao/page.tsx       # Relatórios de gestão
│   ├── cursos/page.tsx                  # Cursos e formação
│   ├── configuracao/page.tsx            # Configurações
│   └── portals/
│       ├── page.tsx                     # Listagem de portais
│       ├── novo/page.tsx                # Criar novo portal
│       └── [id]/editar/page.tsx         # Editar portal
├── login/page.tsx                       # Login
├── recuperar-senha/page.tsx             # Recuperar senha
└── reset-password/page.tsx               # Reset senha
```

#### **NUTRI** (para comparação)
```
/pt/nutri/
├── (protected)/
│   ├── home/page.tsx                    # Home principal
│   ├── dashboard/page.tsx               # Dashboard
│   ├── onboarding/page.tsx              # ⚠️ Coach NÃO tem
│   ├── diagnostico/page.tsx              # ⚠️ Coach NÃO tem
│   ├── ferramentas/                     # (igual Coach)
│   ├── clientes/                        # (igual Coach)
│   ├── leads/                           # (igual Coach)
│   ├── formularios/                     # (igual Coach)
│   ├── agenda/                          # (igual Coach)
│   ├── acompanhamento/                  # (igual Coach)
│   ├── relatorios-gestao/               # (igual Coach)
│   ├── cursos/                          # (igual Coach)
│   ├── configuracao/                    # (igual Coach)
│   ├── portals/                         # (igual Coach)
│   └── metodo/                          # ⚠️ Coach NÃO tem
│       ├── jornada/                     # ⚠️ Coach NÃO tem
│       ├── pilares/                     # ⚠️ Coach NÃO tem
│       └── biblioteca/                  # ⚠️ Coach NÃO tem
├── login/page.tsx
├── recuperar-senha/page.tsx
└── reset-password/page.tsx
```

---

### **Rotas Públicas (Não Requerem Login)**

#### **COACH**
```
/pt/c/                                   # ⚠️ Rota curta (alias)
├── [user-slug]/
│   ├── [tool-slug]/page.tsx            # Ferramenta pública
│   └── quiz/[slug]/page.tsx            # Quiz público
└── portal/[slug]/page.tsx              # Portal público

/pt/coach/                               # Rota completa (também funciona)
├── [user-slug]/
│   ├── [tool-slug]/page.tsx            # Ferramenta pública
│   └── quiz/[slug]/page.tsx            # Quiz público
└── portal/[slug]/page.tsx               # Portal público

/p/[code]/route.ts                       # Link curto (global)
```

**URLs públicas geradas:**
- `https://ylada.app/pt/c/{user-slug}/{tool-slug}` (preferencial)
- `https://ylada.app/pt/coach/{user-slug}/{tool-slug}` (fallback)
- `https://ylada.app/p/{short-code}` (encurtado)

#### **NUTRI** (para comparação)
```
/pt/nutri/
├── [user-slug]/
│   ├── [tool-slug]/page.tsx            # Ferramenta pública
│   ├── quiz/[slug]/page.tsx            # Quiz público
│   └── formulario/[slug]/page.tsx      # Formulário público
└── portal/[slug]/page.tsx               # Portal público

/p/[code]/route.ts                       # Link curto (global)
```

**URLs públicas geradas:**
- `https://ylada.app/pt/nutri/{user-slug}/{tool-slug}`
- `https://ylada.app/p/{short-code}` (encurtado)

**Diferença:**
- Coach usa `/pt/c/` como rota curta (mais curta)
- Nutri usa sempre `/pt/nutri/` (sem alias)

---

## 🔧 FUNÇÕES DE URL (url-utils.ts)

### **Coach**
```typescript
// URL com user_slug (preferencial)
buildCoachToolUrl(userSlug, toolSlug)
// Retorna: https://ylada.app/pt/c/{user-slug}/{tool-slug}

// URL fallback (sem user_slug)
buildCoachToolUrlFallback(toolId)
// Retorna: https://ylada.app/pt/c/ferramenta/{id}

// Link curto
buildShortUrl(shortCode)
// Retorna: https://ylada.app/p/{short-code}
```

### **Nutri** (para comparação)
```typescript
// URL com user_slug (preferencial)
buildNutriToolUrl(userSlug, toolSlug)
// Retorna: https://ylada.app/pt/nutri/{user-slug}/{tool-slug}

// URL fallback (sem user_slug)
buildNutriToolUrlFallback(toolId)
// Retorna: https://ylada.app/pt/nutri/ferramenta/{id}

// Link curto
buildShortUrl(shortCode)
// Retorna: https://ylada.app/p/{short-code}
```

---

## 📋 APIS COMPARATIVAS

### **Ferramentas**

#### **COACH**
```
GET    /api/coach/ferramentas              # Listar ferramentas
POST   /api/coach/ferramentas              # Criar ferramenta
GET    /api/coach/ferramentas/[id]         # Obter ferramenta
PUT    /api/coach/ferramentas/[id]          # Atualizar ferramenta
DELETE /api/coach/ferramentas/[id]          # Excluir ferramenta
GET    /api/coach/ferramentas/by-url        # Buscar por user_slug + tool_slug
GET    /api/coach/ferramentas/check-slug    # Verificar slug disponível
GET    /api/coach/ferramentas/check-short-code # Verificar short_code disponível
POST   /api/coach/ferramentas/track-view    # Registrar visualização
```

#### **NUTRI** (para comparação)
```
GET    /api/nutri/ferramentas              # Listar ferramentas
POST   /api/nutri/ferramentas              # Criar ferramenta
GET    /api/nutri/ferramentas/[id]         # Obter ferramenta
PUT    /api/nutri/ferramentas/[id]          # Atualizar ferramenta
DELETE /api/nutri/ferramentas/[id]          # Excluir ferramenta
GET    /api/nutri/ferramentas/by-url        # Buscar por user_slug + tool_slug
GET    /api/nutri/ferramentas/check-slug    # Verificar slug disponível
GET    /api/nutri/ferramentas/check-short-code # Verificar short_code disponível
POST   /api/nutri/ferramentas/track-view    # Registrar visualização
```

**Status:** ✅ **APIs idênticas entre Coach e Nutri**

---

## 🎯 SIDEBAR E NAVEGAÇÃO

### **COACH Sidebar** (`CoachSidebar.tsx`)

**Estrutura do Menu:**
```
🏠 Home
  └─ /pt/coach/home

🎯 Captação
  ├─ 🏠 Home / Visão Geral → /pt/coach/home
  ├─ 🔗 Meus Links → /pt/coach/ferramentas
  ├─ 🎯 Quizzes → /pt/coach/quizzes
  ├─ 🧮 Quiz e Calculadoras → /pt/coach/ferramentas/templates
  └─ 📈 Leads → /pt/coach/leads

📁 Gestão
  ├─ 👤 Meus Clientes → /pt/coach/clientes
  ├─ 🗂️ Kanban de Clientes → /pt/coach/clientes/kanban
  ├─ 📅 Agenda → /pt/coach/agenda
  ├─ 📊 Acompanhamento → /pt/coach/acompanhamento
  └─ 📈 Relatórios de Gestão → /pt/coach/relatorios-gestao

🧩 Formulários
  └─ /pt/coach/formularios

✨ Filosofia
  └─ /pt/coach/cursos

⚙️ Configurações
  └─ /pt/coach/configuracao
```

### **NUTRI Sidebar** (para comparação)

**Estrutura do Menu:**
```
🏠 Home
  └─ /pt/nutri/home

🎯 Captação
  ├─ 🔗 Meus Links → /pt/nutri/ferramentas
  ├─ 🎯 Quizzes → /pt/nutri/quizzes
  └─ 📈 Leads → /pt/nutri/leads

📁 Gestão
  ├─ 👤 Meus Clientes → /pt/nutri/clientes
  ├─ 🗂️ Kanban → /pt/nutri/clientes/kanban
  ├─ 📅 Agenda → /pt/nutri/agenda
  └─ 📊 Relatórios → /pt/nutri/relatorios-gestao

🧩 Formulários
  └─ /pt/nutri/formularios

📚 Método YLADA                    # ⚠️ Coach NÃO tem
  ├─ 🗓️ Jornada 30 Dias → /pt/nutri/metodo/jornada
  ├─ 🎯 Pilares → /pt/nutri/metodo/pilares
  └─ 📖 Biblioteca → /pt/nutri/metodo/biblioteca

⚙️ Configurações
  └─ /pt/nutri/configuracao
```

**Diferenças:**
- Coach tem seção "Filosofia" (cursos)
- Nutri tem seção "Método YLADA" (Jornada, Pilares, Biblioteca)
- Coach NÃO tem Jornada 30 Dias
- Coach NÃO tem Pilares do Método
- Coach NÃO tem Biblioteca

---

## 🔍 DIAGNÓSTICO: O QUE COACH TEM vs NUTRI

### **✅ Coach TEM (igual Nutri):**
- ✅ Ferramentas/Links personalizados
- ✅ Gestão de Clientes completa
- ✅ Formulários
- ✅ Leads
- ✅ Portals
- ✅ Agenda
- ✅ Acompanhamento
- ✅ Relatórios de Gestão
- ✅ Cursos/Formação
- ✅ Configurações
- ✅ Short codes e QR codes
- ✅ URLs personalizadas (user_slug)
- ✅ Rotas públicas funcionais

### **❌ Coach NÃO TEM (que Nutri tem):**
- ❌ **Diagnóstico Estratégico** (`/pt/nutri/diagnostico`)
- ❌ **Onboarding** (`/pt/nutri/onboarding`)
- ❌ **Jornada 30 Dias** (`/pt/nutri/metodo/jornada`)
- ❌ **Pilares do Método** (`/pt/nutri/metodo/pilares`)
- ❌ **Biblioteca** (`/pt/nutri/metodo/biblioteca`)
- ❌ **LYA (IA Mentora)** (`/api/nutri/lya/*`)
- ❌ **Análise Diária da LYA** (componente na home)
- ❌ **Chat Widget com LYA** (flutuante)
- ❌ **GSAL Block** (bloco na home)
- ❌ **Anotações Block** (bloco na home)

### **⚠️ Coach TEM (mas diferente):**
- ⚠️ **Rota curta `/pt/c/`** (Nutri usa sempre `/pt/nutri/`)
- ⚠️ **Formulários públicos via `/f/[formId]`** (Nutri usa rota específica)

---

## 📊 COMPARAÇÃO DE HOME PAGES

### **COACH Home** (`/pt/coach/home`)

**Blocos presentes:**
1. ✅ Estatísticas (leads, clientes, conversões, links ativos)
2. ✅ Resumo de Captação de Clientes
3. ✅ Resumo de Gestão de Clientes
4. ✅ Links recentes (preview de ferramentas)
5. ✅ Ações Rápidas (Criar Link, Cliente, Formulário, Consulta)
6. ✅ Chat com IA (genérico, não LYA)

**Blocos ausentes (que Nutri tem):**
- ❌ Vídeo de boas-vindas
- ❌ LyaAnaliseHoje (análise diária)
- ❌ JornadaBlock
- ❌ PilaresBlock
- ❌ FerramentasBlock (detalhado)
- ❌ GSALBlock
- ❌ BibliotecaBlock
- ❌ AnotacoesBlock

### **NUTRI Home** (`/pt/nutri/home`) - para comparação

**Blocos presentes:**
1. ✅ Vídeo de boas-vindas
2. ✅ LyaAnaliseHoje (análise diária da IA)
3. ✅ JornadaBlock (progresso da jornada)
4. ✅ PilaresBlock (5 pilares do método)
5. ✅ FerramentasBlock (ferramentas disponíveis)
6. ✅ GSALBlock (Gerar, Servir, Acompanhar, Lucrar)
7. ✅ BibliotecaBlock (materiais extras)
8. ✅ AnotacoesBlock (anotações pessoais)
9. ✅ NutriChatWidget (chat flutuante com LYA)

---

## 🎯 CONCLUSÃO

### **Estado Atual da Área Coach:**

✅ **Funcionalidades Completas:**
- Todas as funcionalidades de captação, gestão e acompanhamento estão implementadas
- APIs funcionais e completas
- Rotas públicas funcionando
- Links e ferramentas operacionais

❌ **Funcionalidades Ausentes (vs Nutri):**
- **Diagnóstico/Onboarding:** Coach não possui fluxo de primeiro acesso estruturado
- **Método YLADA:** Coach não possui Jornada 30 Dias, Pilares, Biblioteca
- **LYA:** Coach não possui IA mentora personalizada

⚠️ **Diferenças Técnicas:**
- Coach usa rota curta `/pt/c/` para URLs públicas (mais curta)
- Coach usa rota global `/f/[formId]` para formulários públicos
- Nutri usa sempre `/pt/nutri/` e rotas específicas

### **Recomendações (se desejar implementar):**

1. **Diagnóstico Coach:** Criar diagnóstico específico para coaches (diferente do Nutri)
2. **Onboarding Coach:** Criar fluxo de primeiro acesso para coaches
3. **Método Coach:** Adaptar ou criar método específico para coaches (se aplicável)
4. **LYA Coach:** Adaptar LYA para contexto de coaching (se aplicável)

---

**Última atualização:** 2025-01-21  
**Versão:** 1.0



