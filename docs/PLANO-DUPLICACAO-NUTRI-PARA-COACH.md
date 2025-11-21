# 📋 PLANO COMPLETO: DUPLICAÇÃO NUTRI → COACH

**Objetivo:** Duplicar 100% da área Nutri para Coach, mantendo tudo separado e individualizado.

**Estratégia:** Duplicação completa sem ajustes de conteúdo. Ajustes de diagnósticos e textos em segunda fase.

---

## 🎯 PRINCÍPIOS

1. ✅ **Banco de dados totalmente separado** - Cada área tem suas próprias tabelas
2. ✅ **Zero compartilhamento** - Tudo duplicado, nada compartilhado
3. ✅ **Duplicação literal** - Mesmos diagnósticos, mesmos textos (ajustar depois)
4. ✅ **Cores diferentes** - Nutri (azul) → Coach (roxo/púrpura)

---

## 📦 ESTRUTURA A DUPLICAR

### 1. **PÁGINAS FRONTEND** (~39 arquivos)
```
src/app/pt/nutri/ → src/app/pt/coach/
├── page.tsx
├── layout.tsx
├── login/page.tsx
├── home/page.tsx
├── dashboard/page.tsx
├── leads/page.tsx
├── clientes/
│   ├── page.tsx
│   ├── novo/page.tsx
│   ├── kanban/page.tsx
│   └── [id]/page.tsx
├── formularios/
│   ├── page.tsx
│   ├── novo/page.tsx
│   ├── [id]/page.tsx
│   ├── [id]/enviar/page.tsx
│   └── [id]/respostas/page.tsx
├── agenda/page.tsx
├── acompanhamento/page.tsx
├── relatorios/page.tsx
├── relatorios-gestao/page.tsx
├── cursos/page.tsx
├── ferramentas/
│   ├── page.tsx
│   ├── nova/page.tsx
│   ├── [id]/editar/page.tsx
│   └── templates/page.tsx
├── portals/
│   ├── page.tsx
│   ├── novo/page.tsx
│   └── [id]/editar/page.tsx
├── quizzes/page.tsx
├── quiz-personalizado/page.tsx
├── configuracao/page.tsx
├── configuracoes/page.tsx
├── suporte/page.tsx
└── [user-slug]/
    ├── [tool-slug]/page.tsx
    └── quiz/[slug]/page.tsx
```

### 2. **APIs** (~39 endpoints)
```
src/app/api/nutri/ → src/app/api/coach/
├── dashboard/route.ts
├── profile/route.ts
├── change-password/route.ts
├── check-short-code/route.ts
├── templates/route.ts
├── ferramentas/
│   ├── route.ts
│   ├── check-slug/route.ts
│   ├── by-url/route.ts
│   └── track-view/route.ts
├── portals/
│   ├── route.ts
│   ├── check-slug/route.ts
│   └── by-slug/[slug]/route.ts
├── quizzes/route.ts
├── clientes/
│   ├── route.ts
│   ├── [id]/route.ts
│   ├── [id]/convert-from-lead/route.ts
│   ├── [id]/avaliacoes/route.ts
│   ├── [id]/avaliacoes/[avaliacaoId]/route.ts
│   ├── [id]/avaliacoes/[avaliacaoId]/comparacao/route.ts
│   ├── [id]/avaliacoes/reevaluacao/route.ts
│   ├── [id]/evolucao/route.ts
│   ├── [id]/evolucao/[evolucaoId]/route.ts
│   ├── [id]/historico/route.ts
│   ├── [id]/emocional/route.ts
│   ├── [id]/programas/route.ts
│   └── [id]/programas/[programId]/route.ts
├── leads/
│   ├── alerts/route.ts
│   └── [id]/convert-to-client/route.ts
├── appointments/
│   ├── route.ts
│   └── [id]/route.ts
├── formularios/
│   ├── route.ts
│   ├── [id]/route.ts
│   ├── [id]/respostas/route.ts
│   └── [id]/respostas/[responseId]/route.ts
└── cursos/
    ├── route.ts
    ├── progresso/route.ts
    ├── favoritos/route.ts
    ├── favoritos/[itemId]/route.ts
    └── [trilhaId]/route.ts
```

### 3. **COMPONENTES**
```
src/components/nutri/ → src/components/coach/
├── NutriSidebar.tsx → CoachSidebar.tsx
└── NutriNavBar.tsx → CoachNavBar.tsx
```

### 4. **DIAGNÓSTICOS** (duplicar literalmente, ajustar depois)
```
src/lib/diagnostics/nutri/ → src/lib/diagnostics/coach/
├── alimentacao-rotina.ts
├── alimentacao-saudavel.ts
├── avaliacao-emocional.ts
├── avaliacao-intolerancia.ts
├── conhece-seu-corpo.ts
├── diagnostico-eletrolitos.ts
├── diagnostico-sintomas-intestinais.ts
├── ganhos-prosperidade.ts
├── nutrido-vs-alimentado.ts
├── perfil-metabolico.ts
├── potencial-crescimento.ts
├── pronto-emagrecer.ts
├── proposito-equilibrio.ts
├── retencao-liquidos.ts
├── sindrome-metabolica.ts
└── tipo-fome.ts
```

### 5. **BANCO DE DADOS**
```
schema-gestao-nutri.sql → schema-gestao-coach.sql
migrations/criar-estrutura-cursos-nutri.sql → migrations/criar-estrutura-cursos-coach.sql
```

**Tabelas a criar (com prefixo `coach_` ou manter nome + filtro por profession):**
- clients → coach_clients (ou clients com profession='coach')
- client_evolution → coach_client_evolution
- appointments → coach_appointments
- assessments → coach_assessments
- programs → coach_programs
- forms → coach_forms
- form_responses → coach_form_responses
- cursos_trilhas → coach_cursos_trilhas
- cursos_modulos → coach_cursos_modulos
- cursos_aulas → coach_cursos_aulas
- cursos_progresso → coach_cursos_progresso
- cursos_favoritos → coach_cursos_favoritos
- cursos_certificados → coach_cursos_certificados
- E todas as outras...

---

## 🔄 SUBSTITUIÇÕES NECESSÁRIAS

### 1. **Rotas e URLs**
- `/pt/nutri/` → `/pt/coach/`
- `/api/nutri/` → `/api/coach/`
- `href="/pt/nutri/` → `href="/pt/coach/`

### 2. **Nomes de Componentes e Funções**
- `Nutri` → `Coach`
- `nutri` → `coach`
- `NutriSidebar` → `CoachSidebar`
- `NutriNavBar` → `CoachNavBar`

### 3. **Profession/Perfil**
- `profession='nutri'` → `profession='coach'`
- `profession: 'nutri'` → `profession: 'coach'`
- `perfil="nutri"` → `perfil="coach"`

### 4. **Cores (Tailwind)**
- `blue-50` → `purple-50` ou `violet-50`
- `blue-100` → `purple-100` ou `violet-100`
- `blue-200` → `purple-200` ou `violet-200`
- `blue-600` → `purple-600` ou `violet-600`
- `blue-700` → `purple-700` ou `violet-700`
- `bg-blue-` → `bg-purple-` ou `bg-violet-`
- `text-blue-` → `text-purple-` ou `text-violet-`
- `border-blue-` → `border-purple-` ou `border-violet-`
- `hover:bg-blue-` → `hover:bg-purple-` ou `hover:bg-violet-`

### 5. **Logos e Imagens**
- `/images/logo/nutri/` → `/images/logo/coach/`
- `Logo_Nutri_horizontal.png` → `Logo_Coach_horizontal.png`
- `Logo_Nutri_quadrado.png` → `Logo_Coach_quadrado.png`

### 6. **Manifest e Metadata**
- `manifest-nutri.json` → `manifest-coach.json`
- `Nutri by YLADA` → `Coach by YLADA`

### 7. **Banco de Dados**
- `user_id` (filtro por profession='coach')
- Nomes de tabelas com prefixo `coach_` ou filtro por profession
- RLS policies específicas para coach

---

## 📝 PASSO A PASSO DETALHADO

### **FASE 1: ESTRUTURA DE ARQUIVOS**

#### Passo 1.1: Duplicar Páginas Frontend
```bash
# Copiar toda estrutura
cp -r src/app/pt/nutri src/app/pt/coach-temp
# Renomear arquivos e pastas manualmente ou via script
```

#### Passo 1.2: Duplicar APIs
```bash
cp -r src/app/api/nutri src/app/api/coach-temp
```

#### Passo 1.3: Duplicar Componentes
```bash
cp -r src/components/nutri src/components/coach-temp
```

#### Passo 1.4: Duplicar Diagnósticos
```bash
cp -r src/lib/diagnostics/nutri src/lib/diagnostics/coach-temp
```

### **FASE 2: SUBSTITUIÇÕES EM MASSA**

#### Passo 2.1: Substituir em Páginas
- `nutri` → `coach` (rotas, imports, referências)
- `Nutri` → `Coach` (componentes, funções)
- `/pt/nutri/` → `/pt/coach/`

#### Passo 2.2: Substituir em APIs
- `/api/nutri/` → `/api/coach/`
- `profession='nutri'` → `profession='coach'`
- Queries SQL com filtro por profession

#### Passo 2.3: Substituir em Componentes
- `NutriSidebar` → `CoachSidebar`
- `NutriNavBar` → `CoachNavBar`
- Imports e referências

#### Passo 2.4: Substituir Cores
- Todos os `blue-*` → `purple-*` ou `violet-*`

### **FASE 3: BANCO DE DADOS**

#### Passo 3.1: Criar Schema Coach
- Duplicar `schema-gestao-nutri.sql` → `schema-gestao-coach.sql`
- Adaptar nomes de tabelas ou adicionar filtro profession='coach'
- Criar RLS policies específicas

#### Passo 3.2: Criar Estrutura de Cursos Coach
- Duplicar `migrations/criar-estrutura-cursos-nutri.sql` → `migrations/criar-estrutura-cursos-coach.sql`
- Adaptar nomes de tabelas

### **FASE 4: AJUSTES FINAIS**

#### Passo 4.1: Logos e Manifest
- Verificar/criar logos do Coach
- Criar `manifest-coach.json`
- Ajustar metadata no layout

#### Passo 4.2: Sidebar e NavBar
- Ajustar menu items
- Ajustar cores
- Ajustar logos

#### Passo 4.3: Verificar Autenticação
- Middleware suporta 'coach'?
- ProtectedRoute funciona?
- RequireSubscription funciona?

### **FASE 5: TESTES**

#### Passo 5.1: Testar Rotas
- Todas as páginas carregam?
- Navegação funciona?

#### Passo 5.2: Testar APIs
- Endpoints respondem?
- Autenticação funciona?
- Dados corretos?

#### Passo 5.3: Testar Banco
- Tabelas criadas?
- RLS funciona?
- Queries retornam dados?

---

## ✅ CHECKLIST FINAL

### Frontend
- [ ] Todas as páginas duplicadas
- [ ] Todas as rotas funcionando
- [ ] Componentes duplicados e ajustados
- [ ] Cores alteradas
- [ ] Logos ajustados
- [ ] Manifest criado

### Backend
- [ ] Todas as APIs duplicadas
- [ ] Profession='coach' em todas as queries
- [ ] Autenticação funcionando
- [ ] RLS policies criadas

### Banco de Dados
- [ ] Schema coach criado
- [ ] Tabelas de gestão criadas
- [ ] Tabelas de cursos criadas
- [ ] Views criadas (se houver)
- [ ] Indexes criados
- [ ] RLS policies aplicadas

### Diagnósticos
- [ ] Todos duplicados (literalmente)
- [ ] Imports ajustados
- [ ] Funcionando (ajustar conteúdo depois)

### Testes
- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] Navegação funciona
- [ ] APIs respondem
- [ ] Banco de dados acessível

---

## 🎨 CORES COACH

**Sugestão:** Roxo/Púrpura (purple ou violet)
- Primary: `purple-600` ou `violet-600`
- Light: `purple-50`, `purple-100`
- Dark: `purple-700`, `purple-800`
- Hover: `purple-700` ou `violet-700`

---

## 📌 OBSERVAÇÕES

1. **Diagnósticos:** Duplicar literalmente agora, ajustar conteúdo em segunda fase
2. **Textos:** Manter textos de "nutricionista" por enquanto, ajustar depois
3. **Banco:** Totalmente separado, nada compartilhado
4. **Cores:** Trocar azul por roxo/púrpura em todos os lugares
5. **Logos:** Usar logos existentes do Coach ou criar genéricos

---

## 🚀 PRÓXIMOS PASSOS APÓS DUPLICAÇÃO

1. Ajustar diagnósticos para linguagem de coach
2. Ajustar textos de "nutricionista" → "coach"
3. Personalizar conteúdo específico de coach
4. Testar fluxo completo
5. Deploy

---

**Status:** Aguardando início da implementação

