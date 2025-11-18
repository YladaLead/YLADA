# 📋 CHECKLIST GERAL - ÁREA NUTRI

**Data:** Hoje  
**Status:** Em desenvolvimento  
**Objetivo:** Checklist completo do que falta implementar para área Nutri estar completa

---

## ✅ O QUE JÁ ESTÁ IMPLEMENTADO

### **APIs Criadas**
- ✅ `/api/nutri/ferramentas/route.ts` - CRUD completo
- ✅ `/api/nutri/quizzes/route.ts` - GET (listagem)
- ✅ `/api/nutri/portals/route.ts` - CRUD completo
- ✅ `/api/nutri/check-short-code/route.ts` - Validação de códigos curtos
- ✅ `/api/nutri/portals/check-slug/route.ts` - Validação de slugs
- ✅ `/api/nutri/ferramentas/check-slug/route.ts` - Validação de slugs
- ✅ `/api/nutri/templates/route.ts` - Listagem de templates

### **Páginas Criadas**
- ✅ `/pt/nutri/dashboard/page.tsx` - Dashboard principal
- ✅ `/pt/nutri/quizzes/page.tsx` - Listagem de quizzes (com short codes e QR codes)
- ✅ `/pt/nutri/portals/page.tsx` - Listagem de portais
- ✅ `/pt/nutri/portals/novo/page.tsx` - Criação de portal (com short codes)
- ✅ `/pt/nutri/portals/[id]/editar/page.tsx` - Edição de portal (com short codes)
- ✅ `/pt/nutri/ferramentas/page.tsx` - Listagem de ferramentas (com API real, short codes e QR codes)
- ✅ `/pt/nutri/ferramentas/[id]/editar/page.tsx` - Edição de ferramentas (com short codes)
- ✅ `/pt/nutri/ferramentas/nova/page.tsx` - Criação de ferramentas
- ✅ `/pt/nutri/ferramentas/templates/page.tsx` - Visualização de templates
- ✅ `/pt/nutri/quiz-personalizado/page.tsx` - Criação de quiz personalizado

### **Componentes**
- ✅ `NutriNavBar.tsx` - NavBar específica Nutri (com logo atualizado)

### **Funcionalidades**
- ✅ Short codes e QR codes nas listagens (quizzes, portais, ferramentas)
- ✅ Short codes na criação/edição de portais
- ✅ Short codes na edição de ferramentas
- ✅ Integração com API real na listagem de ferramentas
- ✅ Botões Editar/Excluir visíveis nos cards

---

## ❌ O QUE AINDA FALTA IMPLEMENTAR

### 🔴 **PRIORIDADE CRÍTICA** (Fazer Primeiro)

#### **1. Short Codes e QR Codes em Criação de Ferramentas**
- ❌ `/pt/nutri/ferramentas/nova/page.tsx`
  - Adicionar checkbox "Gerar URL Encurtada"
  - Adicionar checkbox "Personalizar Código"
  - Input para código personalizado
  - Validação em tempo real via `/api/nutri/check-short-code`
  - Exibir short code e QR code após criação
  - Enviar `generate_short_url` e `custom_short_code` no payload

#### **2. Short Codes e QR Codes em Criação de Quiz**
- ❌ `/pt/nutri/quiz-personalizado/page.tsx`
  - Adicionar seção "URL Encurtada" (similar a portais)
  - Checkbox "Gerar URL Encurtada"
  - Checkbox "Personalizar Código"
  - Input para código personalizado
  - Validação em tempo real
  - Exibir short code e QR code após criação
  - Atualizar `salvarQuiz` para enviar parâmetros de short code

#### **3. API de Dashboard para Nutri**
- ❌ `/api/nutri/dashboard/route.ts`
  - Calcular estatísticas (ferramentas ativas, leads, conversões)
  - Retornar ferramentas com leads e conversões calculadas
  - Filtrar por `profession='nutri'`
  - Similar a `/api/wellness/dashboard/route.ts`

#### **4. Atualizar Dashboard Nutri para Usar API Real**
- ❌ `/pt/nutri/dashboard/page.tsx`
  - Remover dados mockados
  - Integrar com `/api/nutri/dashboard`
  - Carregar estatísticas reais
  - Carregar ferramentas ativas reais
  - Adicionar loading states
  - Adicionar tratamento de erros

---

### 🟠 **PRIORIDADE ALTA** (Fazer Depois)

#### **5. Rotas Públicas para Visualização**
- ❌ `/pt/nutri/[user-slug]/[tool-slug]/page.tsx`
  - Página pública para visualizar ferramenta com user_slug
  - Similar a `/pt/wellness/[user-slug]/[tool-slug]/page.tsx`
  - Ajustar cores (verde → azul)
  - Filtrar por `profession='nutri'`

- ❌ `/pt/nutri/ferramenta/[id]/page.tsx`
  - Página pública alternativa (sem user_slug)
  - Similar a `/pt/wellness/ferramenta/[id]/page.tsx`

- ❌ `/pt/nutri/portal/[slug]/page.tsx`
  - Página pública para visualizar portal
  - Similar a `/pt/wellness/portal/[slug]/page.tsx`
  - Filtrar por `profession='nutri'`

- ❌ `/pt/nutri/[user-slug]/portal/[slug]/page.tsx`
  - Página pública com user_slug
  - Similar a `/pt/wellness/[user-slug]/portal/[slug]/page.tsx`

- ❌ `/pt/nutri/quiz/[id]/page.tsx`
  - Página pública para visualizar quiz
  - Similar a `/pt/wellness/quiz/[id]/page.tsx`
  - Filtrar por `profession='nutri'`

#### **6. APIs Públicas para Rotas Públicas**
- ❌ `/api/nutri/ferramentas/by-url/route.ts`
  - Buscar ferramenta por URL pública
  - Similar a `/api/wellness/ferramentas/by-url/route.ts`

- ❌ `/api/nutri/portals/by-slug/[slug]/route.ts`
  - Buscar portal por slug
  - Similar a `/api/wellness/portals/by-slug/[slug]/route.ts`

- ❌ `/api/nutri/ferramentas/track-view/route.ts`
  - Tracking de visualizações
  - Similar a `/api/wellness/ferramentas/track-view/route.ts`

#### **7. API de Perfil Nutri**
- ❌ `/api/nutri/profile/route.ts`
  - GET: Buscar perfil do usuário
  - PUT: Atualizar perfil
  - Similar a `/api/wellness/profile/route.ts`
  - Filtrar por `profession='nutri'`

---

### 🟡 **PRIORIDADE MÉDIA** (Fazer Quando Possível)

#### **8. User Slug e URLs Personalizadas**
- ❌ Implementar suporte a `user_slug` em:
  - URLs de links: `/pt/nutri/[user_slug]/[slug]`
  - URLs de portais: `/pt/nutri/[user_slug]/portal/[slug]`
  - Verificar se `user_profiles` tem `user_slug` para área Nutri
  - Criar/atualizar `user_slug` no perfil Nutri

#### **9. Atualizar Redirecionamento de Short Codes**
- ❌ Verificar se `/p/[code]/route.ts` já busca em `user_templates`, `quizzes` e `wellness_portals` com `profession='nutri'`
  - Se não, adicionar filtro por `profession` na busca
  - Garantir que redireciona corretamente para `/pt/nutri/...`

#### **10. Diagnósticos Nutri Específicos**
- ❌ Revisar diagnósticos existentes em `src/lib/diagnosticos-nutri.ts`
- ❌ Modularizar diagnósticos (seguir padrão Wellness)
  - Criar arquivos em `src/lib/diagnostics/nutri/*.ts`
  - Um arquivo por template
- ❌ Adaptar linguagem para foco em nutricionista
- ❌ Adicionar CTAs de agendamento
- ❌ Verificar quais templates não têm diagnósticos Nutri

#### **11. Página de Tutoriais Nutri**
- ❌ `/pt/nutri/tutoriais/page.tsx`
  - Criar página de tutoriais específica para Nutri
  - Adaptar conteúdo de `docs/TUTORIAIS-WELLNESS-COMPLETO.md`
  - Ajustar exemplos e screenshots para área Nutri
  - Ajustar cores (verde → azul)

---

### 🟢 **PRIORIDADE BAIXA** (Melhorias Futuras)

#### **12. RequireSubscription para Nutri**
- ❌ Verificar se `RequireSubscription` funciona corretamente para área Nutri
- ❌ Testar bloqueio de acesso para usuários sem assinatura ativa
- ❌ Verificar se mensagens de erro estão adequadas

#### **13. Onboarding Nutri**
- ❌ `/pt/nutri/bem-vindo/page.tsx`
  - Criar página de onboarding específica para Nutri
  - Similar a `/pt/wellness/bem-vindo/page.tsx`
  - Ajustar cores e textos

#### **14. Configurações/Perfil Nutri**
- ❌ `/pt/nutri/configuracoes/page.tsx` ou `/pt/nutri/perfil/page.tsx`
  - Verificar se existe e está funcional
  - Integrar com `/api/nutri/profile`
  - Permitir edição de `user_slug`

#### **15. Limpeza de Código Obsoleto**
- ❌ Identificar e remover código antigo/obsoleto da área Nutri
- ❌ Remover arquivos não utilizados
- ❌ Remover imports não utilizados
- ❌ Consolidar lógica duplicada

---

## 📊 RESUMO POR CATEGORIA

### **APIs (Backend)**
- ✅ **7 APIs criadas** (ferramentas, quizzes, portals, check-short-code, check-slug, templates)
- ❌ **4 APIs faltantes** (dashboard, by-url, by-slug, track-view, profile)

### **Páginas (Frontend)**
- ✅ **10 páginas criadas** (dashboard, quizzes, portals, ferramentas, etc.)
- ❌ **8 páginas faltantes** (rotas públicas, tutoriais, onboarding, configurações)

### **Funcionalidades**
- ✅ **Short codes e QR codes** em listagens e edições
- ❌ **Short codes** em criação de ferramentas e quizzes
- ❌ **Rotas públicas** para visualização
- ❌ **User slug** e URLs personalizadas
- ❌ **Dashboard** com dados reais

---

## 🎯 PLANO DE AÇÃO RECOMENDADO

### **ETAPA 1: Completar Short Codes** (2-3 horas)
1. Adicionar short codes em `/pt/nutri/ferramentas/nova/page.tsx`
2. Adicionar short codes em `/pt/nutri/quiz-personalizado/page.tsx`

### **ETAPA 2: Dashboard Real** (2-3 horas)
3. Criar `/api/nutri/dashboard/route.ts`
4. Atualizar `/pt/nutri/dashboard/page.tsx` para usar API real

### **ETAPA 3: Rotas Públicas** (4-5 horas)
5. Criar rotas públicas para ferramentas (`/pt/nutri/[user-slug]/[tool-slug]`, `/pt/nutri/ferramenta/[id]`)
6. Criar rotas públicas para portais (`/pt/nutri/portal/[slug]`, `/pt/nutri/[user-slug]/portal/[slug]`)
7. Criar rotas públicas para quizzes (`/pt/nutri/quiz/[id]`)
8. Criar APIs públicas correspondentes (`by-url`, `by-slug`, `track-view`)

### **ETAPA 4: APIs e Funcionalidades Complementares** (3-4 horas)
9. Criar `/api/nutri/profile/route.ts`
10. Atualizar redirecionamento de short codes para incluir Nutri
11. Implementar user slug e URLs personalizadas

### **ETAPA 5: Conteúdo e Melhorias** (4-6 horas)
12. Criar página de tutoriais Nutri
13. Revisar e modularizar diagnósticos Nutri
14. Criar página de onboarding Nutri
15. Limpar código obsoleto

---

## ✅ CHECKLIST RÁPIDO

### **Backend (APIs)**
- [ ] `/api/nutri/dashboard/route.ts`
- [ ] `/api/nutri/profile/route.ts`
- [ ] `/api/nutri/ferramentas/by-url/route.ts`
- [ ] `/api/nutri/portals/by-slug/[slug]/route.ts`
- [ ] `/api/nutri/ferramentas/track-view/route.ts`

### **Frontend (Páginas)**
- [ ] `/pt/nutri/ferramentas/nova/page.tsx` - Adicionar short codes
- [ ] `/pt/nutri/quiz-personalizado/page.tsx` - Adicionar short codes
- [ ] `/pt/nutri/dashboard/page.tsx` - Integrar com API real
- [ ] `/pt/nutri/[user-slug]/[tool-slug]/page.tsx` - Rota pública
- [ ] `/pt/nutri/ferramenta/[id]/page.tsx` - Rota pública alternativa
- [ ] `/pt/nutri/portal/[slug]/page.tsx` - Rota pública portal
- [ ] `/pt/nutri/[user-slug]/portal/[slug]/page.tsx` - Rota pública portal com user_slug
- [ ] `/pt/nutri/quiz/[id]/page.tsx` - Rota pública quiz
- [ ] `/pt/nutri/tutoriais/page.tsx` - Página de tutoriais
- [ ] `/pt/nutri/bem-vindo/page.tsx` - Onboarding

### **Funcionalidades**
- [ ] Short codes em criação de ferramentas
- [ ] Short codes em criação de quizzes
- [ ] Dashboard com dados reais
- [ ] Rotas públicas funcionais
- [ ] User slug e URLs personalizadas
- [ ] Diagnósticos Nutri modularizados
- [ ] Limpeza de código obsoleto

---

**Total estimado:** 15-21 horas de desenvolvimento



