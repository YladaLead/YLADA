# 📋 REVISÃO COMPLETA E PLANO DE TESTES - ÁREA COACH

**Data:** 2025-01-21  
**Objetivo:** Revisar completamente a área Coach baseando-se na área Nutri (funcionando) e criar plano de testes e ajustes

---

## 🎯 RESUMO EXECUTIVO

### Status Atual
- ✅ **Estrutura:** 41 páginas criadas (paridade com Nutri)
- ✅ **APIs:** 39 rotas API criadas (paridade com Nutri)
- ✅ **Componentes:** CoachSidebar e CoachNavBar criados
- ⚠️ **Problemas Identificados:** Vários pontos de atenção encontrados
- ✅ **Base de Referência:** Área Nutri funcionando como modelo

### Estratégia
Basear-se na área **Nutri** (que está funcionando) para:
1. Identificar diferenças críticas
2. Corrigir problemas encontrados
3. Garantir paridade funcional
4. Criar plano de testes completo

### ⚠️ PONTOS CRÍTICOS IDENTIFICADOS PELO USUÁRIO

1. **NÃO precisa de blocos de informação** - A estrutura mais simples está correta
2. **IA será implementada** - Precisam dar um nome depois, mas precisa estar funcionando
3. **Templates e Diagnósticos NÃO podem ser confundidos** - Houve grandes desafios com isso
4. **Diagnósticos e lembretes do Coach são DO COACH** - Devem ser específicos, não compartilhados

---

## 📊 COMPARAÇÃO ESTRUTURAL: NUTRI vs COACH

### 1. Estrutura de Pastas

#### ✅ Páginas (Frontend)
| Página | Nutri | Coach | Status |
|--------|-------|-------|--------|
| Landing (`page.tsx`) | ✅ | ✅ | ✅ |
| Home/Dashboard | ✅ | ✅ | ✅ |
| Ferramentas | ✅ | ✅ | ✅ |
| Ferramentas/Nova | ✅ | ✅ | ✅ |
| Ferramentas/Editar | ✅ | ✅ | ✅ |
| Ferramentas/Templates | ✅ | ✅ | ✅ |
| Leads | ✅ | ✅ | ✅ |
| Clientes | ✅ | ✅ | ✅ |
| Clientes/Novo | ✅ | ✅ | ✅ |
| Clientes/Kanban | ✅ | ✅ | ✅ |
| Clientes/[id] | ✅ | ✅ | ✅ |
| Formulários | ✅ | ✅ | ✅ |
| Formulários/Novo | ✅ | ✅ | ✅ |
| Formulários/[id] | ✅ | ✅ | ✅ |
| Formulários/[id]/Enviar | ✅ | ✅ | ✅ |
| Formulários/[id]/Respostas | ✅ | ✅ | ✅ |
| Portals | ✅ | ✅ | ✅ |
| Portals/Novo | ✅ | ✅ | ✅ |
| Portals/[id]/Editar | ✅ | ✅ | ✅ |
| Portal/[slug] | ✅ | ✅ | ✅ |
| Quizzes | ✅ | ✅ | ✅ |
| Quiz Personalizado | ✅ | ✅ | ✅ |
| Cursos | ✅ | ✅ | ✅ |
| Agenda | ✅ | ✅ | ✅ |
| Acompanhamento | ✅ | ✅ | ✅ |
| Relatórios | ✅ | ✅ | ✅ |
| Relatórios Gestão | ✅ | ✅ | ✅ |
| Configurações | ✅ | ✅ | ✅ |
| Suporte | ✅ | ✅ | ✅ |
| Login | ✅ | ✅ | ✅ |
| [user-slug]/[tool-slug] | ✅ | ✅ | ✅ |
| [user-slug]/quiz/[slug] | ✅ | ✅ | ✅ |
| Social/Story Interativo | ✅ | ✅ | ✅ |

**Total:** 39 páginas em cada área ✅

#### ✅ APIs (Backend)
| API | Nutri | Coach | Status |
|-----|-------|-------|--------|
| `/dashboard` | ✅ | ✅ | ✅ |
| `/profile` | ✅ | ✅ | ✅ |
| `/ferramentas` | ✅ | ✅ | ✅ |
| `/ferramentas/check-slug` | ✅ | ✅ | ✅ |
| `/ferramentas/by-url` | ✅ | ✅ | ✅ |
| `/ferramentas/track-view` | ✅ | ✅ | ✅ |
| `/portals` | ✅ | ✅ | ✅ |
| `/portals/check-slug` | ✅ | ✅ | ✅ |
| `/portals/by-slug/[slug]` | ✅ | ✅ | ✅ |
| `/quizzes` | ✅ | ✅ | ✅ |
| `/formularios` | ✅ | ✅ | ✅ |
| `/formularios/[id]` | ✅ | ✅ | ✅ |
| `/formularios/[id]/respostas` | ✅ | ✅ | ✅ |
| `/formularios/[id]/respostas/[responseId]` | ✅ | ✅ | ✅ |
| `/leads/alerts` | ✅ | ✅ | ✅ |
| `/leads/[id]/convert-to-client` | ✅ | ✅ | ✅ |
| `/clientes` | ✅ | ✅ | ✅ |
| `/clientes/[id]` | ✅ | ✅ | ✅ |
| `/clientes/[id]/convert-from-lead` | ✅ | ✅ | ✅ |
| `/clientes/[id]/avaliacoes` | ✅ | ✅ | ✅ |
| `/clientes/[id]/avaliacoes/[avaliacaoId]` | ✅ | ✅ | ✅ |
| `/clientes/[id]/avaliacoes/[avaliacaoId]/comparacao` | ✅ | ✅ | ✅ |
| `/clientes/[id]/avaliacoes/reevaluacao` | ✅ | ✅ | ✅ |
| `/clientes/[id]/evolucao` | ✅ | ✅ | ✅ |
| `/clientes/[id]/evolucao/[evolucaoId]` | ✅ | ✅ | ✅ |
| `/clientes/[id]/emocional` | ✅ | ✅ | ✅ |
| `/clientes/[id]/historico` | ✅ | ✅ | ✅ |
| `/clientes/[id]/programas` | ✅ | ✅ | ✅ |
| `/clientes/[id]/programas/[programId]` | ✅ | ✅ | ✅ |
| `/appointments` | ✅ | ✅ | ✅ |
| `/appointments/[id]` | ✅ | ✅ | ✅ |
| `/cursos` | ✅ | ✅ | ✅ |
| `/cursos/[trilhaId]` | ✅ | ✅ | ✅ |
| `/cursos/favoritos` | ✅ | ✅ | ✅ |
| `/cursos/favoritos/[itemId]` | ✅ | ✅ | ✅ |
| `/cursos/progresso` | ✅ | ✅ | ✅ |
| `/templates` | ✅ | ✅ | ✅ |
| `/check-short-code` | ✅ | ✅ | ✅ |
| `/change-password` | ✅ | ✅ | ✅ |

**Total:** 39 rotas API em cada área ✅

### 2. Diferenças Identificadas

#### ✅ Rotas de API - Padrão "c" Confirmado

**Status:** ✅ CORRETO - Área Coach usa `/api/c/*` e `/pt/c/*`

**Padrão Confirmado pelo Usuário:**
- ✅ URLs públicas: `/pt/c/[user-slug]/[tool-slug]` (usa apenas "c", não "coach")
- ✅ APIs: `/api/c/*` (alias válido para `/api/coach/*`)
- ✅ Rotas administrativas: `/pt/coach/*` (páginas protegidas)
- ✅ Rotas públicas: `/pt/c/*` (links compartilhados)

**Importante:**
- A letra "c" representa "coach" nas URLs públicas
- Isso é intencional e está correto
- Não confundir com outras áreas

**Arquivos Afetados:**
- `src/app/pt/coach/(protected)/configuracao/page.tsx` → usa `/api/c/profile`
- `src/app/pt/coach/(protected)/home/page.tsx` → usa `/api/c/profile`
- `src/app/pt/coach/(protected)/formularios/page.tsx` → usa `/api/c/profile`
- `src/app/pt/coach/(protected)/ferramentas/nova/page.tsx` → usa `/api/c/profile`
- `src/app/pt/coach/(protected)/portals/novo/page.tsx` → usa `/api/wellness/profile` ❌
- `src/app/pt/coach/(protected)/portals/[id]/editar/page.tsx` → usa `/api/wellness/profile` ❌
- `src/app/pt/coach/(protected)/c/portals/novo/page.tsx` → usa `/api/wellness/profile` ❌
- `src/app/pt/coach/(protected)/c/portals/[id]/editar/page.tsx` → usa `/api/wellness/profile` ❌

**Ação Necessária:**
1. Padronizar para `/api/coach/*` OU `/api/c/*` (escolher um padrão)
2. Corrigir referências a `/api/wellness/profile` → `/api/coach/profile` ou `/api/c/profile`
3. Verificar se `/api/c/*` é um alias válido ou se deve ser removido

#### ⚠️ ATENÇÃO: Layout Protegido

**Nutri:**
```typescript
// src/app/pt/nutri/(protected)/layout.tsx
excludeRoutesFromSubscription: ['/onboarding', '/diagnostico', '/configuracao']
```

**Coach:**
```typescript
// src/app/pt/coach/(protected)/layout.tsx
// Não tem excludeRoutesFromSubscription
```

**Ação:** Verificar se Coach precisa de rotas excluídas da validação de assinatura

#### ⚠️ ATENÇÃO: Componentes Específicos Nutri

**Nutri tem componentes específicos que Coach pode não ter:**
- `RequireDiagnostico` - usado em NutriHome
- `JornadaBlock`, `PilaresBlock`, `FerramentasBlock`, `GSALBlock`, `BibliotecaBlock`, `AnotacoesBlock`
- `LyaChatWidget`, `LyaAnaliseHoje`
- `WelcomeCard`
- `useJornadaProgress` hook

**Coach Home:**
- Usa `ChatIA` (genérico)
- Não tem blocos específicos de formação
- Estrutura mais simples

**Ação:** Verificar se Coach precisa de componentes similares ou se a estrutura atual está correta

---

## 🔍 PROBLEMAS IDENTIFICADOS

### 🔴 CRÍTICO - SEPARAÇÃO DE TEMPLATES E DIAGNÓSTICOS

#### ⚠️ PROBLEMA: Confusão entre Templates e Diagnósticos
**Status:** 🔴 CRÍTICO  
**Impacto:** Pode causar confusão e bugs graves

**Descobertas:**
1. **Templates no Banco:** Usa tabela `coach_templates_nutrition` com `profession='coach'` ✅
2. **Diagnósticos no Código:** Usa `src/lib/diagnostics/coach/*.ts` ✅
3. **PROBLEMA:** Existe pasta `src/lib/diagnostics/coach/nutri/` ❌ (confusão!)

**Ação Necessária:**
- [ ] Verificar se há diagnósticos de Nutri sendo usados no Coach
- [ ] Remover pasta `src/lib/diagnostics/coach/nutri/` se não for necessária
- [ ] Garantir que todos os diagnósticos do Coach estão em `src/lib/diagnostics/coach/`
- [ ] Verificar que a função `getDiagnostico()` sempre retorna diagnósticos do Coach quando `profissao='coach'`

#### ⚠️ PROBLEMA: IA no Coach
**Status:** ⚠️ ATENÇÃO  
**Impacto:** IA precisa ser implementada/nomeada

**Descobertas:**
- ✅ `ChatIA` componente existe e aceita `area="coach"`
- ✅ Está sendo usado na Home do Coach (`src/app/pt/coach/(protected)/home/page.tsx`)
- ⚠️ Precisa verificar se está funcionando corretamente
- ⚠️ Precisa dar um nome específico para a IA do Coach (não usar genérico)

**Ação Necessária:**
- [ ] Verificar funcionamento do ChatIA na área Coach
- [ ] Definir nome para a IA do Coach
- [ ] Atualizar componente com nome específico
- [ ] Garantir que respostas são específicas para Coach

### 🔴 CRÍTICO (Corrigir Urgente)

#### 1. Referências a APIs Incorretas
- **Arquivos usando `/api/wellness/profile` em Coach:**
  - `src/app/pt/coach/(protected)/portals/novo/page.tsx`
  - `src/app/pt/coach/(protected)/portals/[id]/editar/page.tsx`
  - `src/app/pt/coach/(protected)/c/portals/novo/page.tsx`
  - `src/app/pt/coach/(protected)/c/portals/[id]/editar/page.tsx`

**Impacto:** Pode retornar dados incorretos ou causar erros 404/500

**Correção:** Substituir por `/api/coach/profile` ou `/api/c/profile` (padronizar)

#### 2. Inconsistência de Rotas de API
- Coach usa tanto `/api/coach/*` quanto `/api/c/*`
- Precisa padronizar para um único padrão

**Correção:** 
- Opção 1: Usar apenas `/api/coach/*` (mais explícito)
- Opção 2: Usar apenas `/api/c/*` (mais curto, mas requer alias)

### ⚠️ MÉDIO (Corrigir em Seguida)

#### 3. Estrutura de Home Diferente
- **Nutri:** Home com blocos específicos (Jornada, Pilares, GSAL, Biblioteca)
- **Coach:** Home mais simples, sem blocos específicos

**Ação:** Verificar se Coach precisa de estrutura similar ou se está correto como está

#### 4. Layout Protegido
- **Nutri:** Tem `excludeRoutesFromSubscription`
- **Coach:** Não tem

**Ação:** Verificar se Coach precisa de rotas excluídas

### 📝 MENOR (Otimizar Depois)

#### 5. Console.logs Excessivos
- Muitos logs de debug que podem ser removidos em produção

#### 6. Pastas Vazias de Cursos
- `cursos/biblioteca/` (vazia)
- `cursos/meus-cursos/` (vazia)
- `cursos/microcursos/` (vazia)
- `cursos/tutoriais/` (vazia)

**Ação:** Remover ou criar páginas placeholder

---

## 📋 PLANO DE CORREÇÕES

### FASE 0: Separação de Templates e Diagnósticos (PRIORIDADE MÁXIMA)

#### ✅ Tarefa 0.1: Verificar e Limpar Diagnósticos
**Ação:** 
- Verificar se `src/lib/diagnostics/coach/nutri/` deve existir
- Se não, remover completamente
- Garantir que todos os diagnósticos do Coach estão em `src/lib/diagnostics/coach/` (raiz)

**Arquivos a verificar:**
- `src/lib/diagnostics/coach/nutri/` (pasta inteira)
- `src/lib/diagnosticos-coach.ts` (verificar imports)

**Estimativa:** 30 minutos

#### ✅ Tarefa 0.2: Verificar Separação de Templates
**Ação:**
- Verificar que API `/api/coach/templates` filtra apenas `profession='coach'`
- Verificar que não há templates de Nutri sendo retornados
- Verificar que tabela `coach_templates_nutrition` está sendo usada corretamente

**Estimativa:** 20 minutos

#### ✅ Tarefa 0.3: Verificar Função getDiagnostico
**Ação:**
- Verificar que `getDiagnostico(ferramentaId, 'coach', resultadoId)` sempre retorna diagnósticos do Coach
- Garantir que não há fallback para diagnósticos de Nutri
- Testar com várias ferramentas

**Estimativa:** 30 minutos

### FASE 1: Correções Críticas (Prioridade Máxima)

#### ✅ Tarefa 1.1: Corrigir Referências a `/api/wellness/profile`
**Arquivos:**
- `src/app/pt/coach/(protected)/portals/novo/page.tsx`
- `src/app/pt/coach/(protected)/portals/[id]/editar/page.tsx`
- `src/app/pt/coach/(protected)/c/portals/novo/page.tsx`
- `src/app/pt/coach/(protected)/c/portals/[id]/editar/page.tsx`

**Ação:** Substituir `/api/wellness/profile` por `/api/coach/profile`

**Estimativa:** 15 minutos

#### ✅ Tarefa 1.2: Padronizar Rotas de API
**Decisão:** Usar `/api/coach/*` como padrão (mais explícito)

**Arquivos a atualizar:**
- Todos os arquivos usando `/api/c/*` → `/api/coach/*`
- OU manter `/api/c/*` mas garantir que seja um alias válido

**Estimativa:** 30 minutos

### FASE 1.5: Implementação/Nomeação da IA

#### ✅ Tarefa 1.5.1: Verificar ChatIA no Coach
**Ação:**
- Testar ChatIA na área Coach
- Verificar se respostas são específicas para Coach
- Verificar se não há referências a Nutri nas respostas

**Estimativa:** 20 minutos

#### ✅ Tarefa 1.5.2: Implementar Nome da IA - CAROL ✅ CONCLUÍDO
**Ação:**
- ✅ Nome definido: **Carol**
- ✅ Componente ChatIA atualizado com nome "Carol"
- ✅ Mensagem inicial atualizada

**Estimativa:** ✅ CONCLUÍDO

### FASE 2: Verificações e Ajustes (Prioridade Alta)

#### ✅ Tarefa 2.1: Verificar Layout Protegido
**Ação:** 
- Comparar `src/app/pt/nutri/(protected)/layout.tsx` com `src/app/pt/coach/(protected)/layout.tsx`
- Verificar se Coach precisa de `excludeRoutesFromSubscription`

**Estimativa:** 15 minutos

#### ✅ Tarefa 2.2: Comparar Estrutura de Home
**Ação:**
- Comparar `src/app/pt/nutri/(protected)/home/page.tsx` com `src/app/pt/coach/(protected)/home/page.tsx`
- Verificar se Coach precisa de componentes similares aos de Nutri
- Decidir se estrutura atual está correta ou precisa de ajustes

**Estimativa:** 30 minutos

#### ✅ Tarefa 2.3: Verificar Componentes Faltantes
**Ação:**
- Listar componentes específicos de Nutri
- Verificar se Coach precisa de equivalentes
- Criar componentes se necessário

**Estimativa:** 1 hora

### FASE 3: Limpeza e Otimização (Prioridade Média)

#### ✅ Tarefa 3.1: Limpar Console.logs
**Ação:** Remover logs de debug desnecessários

**Estimativa:** 30 minutos

#### ✅ Tarefa 3.2: Remover Pastas Vazias
**Ação:** Remover ou criar páginas placeholder para pastas vazias

**Estimativa:** 15 minutos

---

## 🧪 PLANO DE TESTES

### Testes Baseados na Área Nutri (Funcionando)

### 1. TESTES DE AUTENTICAÇÃO E ACESSO

#### 1.1 Login
- [ ] Login com email e senha válidos
- [ ] Login com email inválido
- [ ] Login com senha incorreta
- [ ] Redirecionamento após login bem-sucedido
- [ ] Validação de perfil (coach) no login

#### 1.2 Recuperação de Senha
- [ ] Solicitar recuperação de senha
- [ ] Receber email de recuperação
- [ ] Resetar senha com link válido
- [ ] Tentar resetar com link expirado
- [ ] Tentar resetar com link inválido

#### 1.3 Validação de Acesso
- [ ] Acesso sem autenticação → redireciona para login
- [ ] Acesso com perfil incorreto → bloqueia acesso
- [ ] Acesso sem assinatura ativa → bloqueia (exceto rotas excluídas)
- [ ] Acesso de admin/suporte → permite bypass

### 2. TESTES DE PÁGINAS PRINCIPAIS

#### 2.1 Home/Dashboard
- [ ] Carregar página sem erros
- [ ] Exibir estatísticas corretas
- [ ] Exibir leads recentes
- [ ] Exibir próximas consultas
- [ ] Links de navegação funcionando
- [ ] Chat IA funcionando

#### 2.2 Ferramentas
- [ ] Listar ferramentas do usuário
- [ ] Criar nova ferramenta
- [ ] Editar ferramenta existente
- [ ] Excluir ferramenta
- [ ] Visualizar templates
- [ ] Short codes funcionando
- [ ] QR codes gerados corretamente

#### 2.3 Clientes
- [ ] Listar clientes
- [ ] Criar novo cliente
- [ ] Visualizar detalhes do cliente
- [ ] Editar cliente
- [ ] Kanban funcionando
- [ ] Converter lead em cliente
- [ ] Criar avaliação inicial
- [ ] Visualizar histórico

#### 2.4 Leads
- [ ] Listar leads
- [ ] Filtrar leads por status
- [ ] Filtrar leads por ferramenta
- [ ] Buscar leads
- [ ] Converter lead em cliente
- [ ] Visualizar alertas de leads

#### 2.5 Formulários
- [ ] Listar formulários
- [ ] Criar novo formulário
- [ ] Editar formulário
- [ ] Enviar formulário
- [ ] Visualizar respostas
- [ ] Short code funcionando

#### 2.6 Portals
- [ ] Listar portais
- [ ] Criar novo portal
- [ ] Editar portal
- [ ] Visualizar portal público
- [ ] Short code funcionando

#### 2.7 Quizzes
- [ ] Listar quizzes
- [ ] Criar quiz personalizado
- [ ] Visualizar quiz público
- [ ] Short code funcionando

#### 2.8 Agenda
- [ ] Listar consultas
- [ ] Criar nova consulta
- [ ] Editar consulta
- [ ] Excluir consulta
- [ ] Visualizar calendário

#### 2.9 Configurações
- [ ] Carregar perfil
- [ ] Editar perfil
- [ ] Salvar alterações
- [ ] Validar slug
- [ ] Upload de logo
- [ ] Alterar senha

### 3. TESTES DE APIs

#### 3.1 APIs de Perfil
- [ ] GET `/api/coach/profile` - Buscar perfil
- [ ] PUT `/api/coach/profile` - Atualizar perfil
- [ ] Verificar validação de slug

#### 3.2 APIs de Ferramentas
- [ ] GET `/api/coach/ferramentas` - Listar
- [ ] POST `/api/coach/ferramentas` - Criar
- [ ] GET `/api/coach/ferramentas/[id]` - Buscar
- [ ] PUT `/api/coach/ferramentas/[id]` - Atualizar
- [ ] DELETE `/api/coach/ferramentas/[id]` - Excluir
- [ ] GET `/api/coach/ferramentas/check-slug` - Validar slug

#### 3.3 APIs de Clientes
- [ ] GET `/api/coach/clientes` - Listar
- [ ] POST `/api/coach/clientes` - Criar
- [ ] GET `/api/coach/clientes/[id]` - Buscar
- [ ] PUT `/api/coach/clientes/[id]` - Atualizar
- [ ] DELETE `/api/coach/clientes/[id]` - Excluir
- [ ] POST `/api/coach/clientes/[id]/convert-from-lead` - Converter lead

#### 3.4 APIs de Leads
- [ ] GET `/api/coach/leads` - Listar
- [ ] GET `/api/coach/leads/alerts` - Alertas
- [ ] POST `/api/coach/leads/[id]/convert-to-client` - Converter

#### 3.5 APIs de Formulários
- [ ] GET `/api/coach/formularios` - Listar
- [ ] POST `/api/coach/formularios` - Criar
- [ ] GET `/api/coach/formularios/[id]` - Buscar
- [ ] PUT `/api/coach/formularios/[id]` - Atualizar
- [ ] DELETE `/api/coach/formularios/[id]` - Excluir
- [ ] GET `/api/coach/formularios/[id]/respostas` - Listar respostas

#### 3.6 APIs de Portals
- [ ] GET `/api/coach/portals` - Listar
- [ ] POST `/api/coach/portals` - Criar
- [ ] GET `/api/coach/portals/[id]` - Buscar
- [ ] PUT `/api/coach/portals/[id]` - Atualizar
- [ ] DELETE `/api/coach/portals/[id]` - Excluir
- [ ] GET `/api/coach/portals/check-slug` - Validar slug

### 4. TESTES DE INTEGRAÇÃO

#### 4.1 Fluxo Completo: Captação → Conversão → Gestão
- [ ] Criar ferramenta
- [ ] Gerar link público
- [ ] Simular preenchimento (lead)
- [ ] Lead aparece na lista
- [ ] Converter lead em cliente
- [ ] Cliente aparece na lista
- [ ] Criar avaliação inicial
- [ ] Criar consulta
- [ ] Visualizar histórico

#### 4.2 Fluxo: Formulário → Respostas
- [ ] Criar formulário
- [ ] Gerar link público
- [ ] Simular preenchimento
- [ ] Resposta aparece na lista
- [ ] Visualizar resposta completa

#### 4.3 Fluxo: Portal → Ferramentas
- [ ] Criar portal
- [ ] Adicionar ferramentas ao portal
- [ ] Visualizar portal público
- [ ] Acessar ferramentas pelo portal

### 5. TESTES DE VALIDAÇÃO

#### 5.1 Validações de Formulário
- [ ] Campos obrigatórios
- [ ] Formato de email
- [ ] Formato de telefone
- [ ] Slug único
- [ ] Validação de senha

#### 5.2 Validações de Permissão
- [ ] Apenas dono pode editar/excluir
- [ ] Admin pode acessar tudo
- [ ] Suporte pode acessar tudo
- [ ] Usuário comum não acessa dados de outros

### 6. TESTES DE PERFORMANCE

#### 6.1 Carregamento de Páginas
- [ ] Home carrega em < 2s
- [ ] Lista de clientes carrega em < 2s
- [ ] Lista de ferramentas carrega em < 2s
- [ ] Dashboard carrega em < 2s

#### 6.2 Carregamento de APIs
- [ ] APIs respondem em < 500ms
- [ ] Sem timeouts
- [ ] Sem erros 500

### 7. TESTES DE RESPONSIVIDADE

#### 7.1 Mobile
- [ ] Home responsiva
- [ ] Sidebar funciona em mobile
- [ ] Formulários funcionam em mobile
- [ ] Tabelas responsivas

#### 7.2 Tablet
- [ ] Layout adaptado
- [ ] Navegação funcional

#### 7.3 Desktop
- [ ] Layout completo
- [ ] Todas funcionalidades visíveis

---

## 📝 CHECKLIST DE EXECUÇÃO

### Fase 0: Separação Templates/Diagnósticos (CRÍTICO)
- [ ] Verificar e limpar diagnósticos (remover pasta nutri/ dentro de coach/)
- [ ] Verificar separação de templates no banco
- [ ] Verificar função getDiagnostico
- [ ] Testar que diagnósticos do Coach são sempre do Coach

### Fase 1: Correções Críticas
- [ ] Corrigir referências a `/api/wellness/profile` ✅ (JÁ FEITO)
- [ ] Padronizar rotas de API
- [ ] Testar todas as correções

### Fase 1.5: IA do Coach
- [ ] Verificar ChatIA funcionando
- [ ] Definir nome para IA do Coach
- [ ] Implementar nome na interface

### Fase 2: Verificações
- [ ] Verificar layout protegido
- [ ] Comparar estrutura de Home
- [ ] Verificar componentes faltantes
- [ ] Testar funcionalidades

### Fase 3: Limpeza
- [ ] Limpar console.logs
- [ ] Remover pastas vazias
- [ ] Otimizar código

### Fase 4: Testes Completos
- [ ] Executar todos os testes de autenticação
- [ ] Executar todos os testes de páginas
- [ ] Executar todos os testes de APIs
- [ ] Executar todos os testes de integração
- [ ] Executar todos os testes de validação
- [ ] Executar todos os testes de performance
- [ ] Executar todos os testes de responsividade

---

## 🎯 PRÓXIMOS PASSOS

1. **Imediato:** Executar Fase 1 (Correções Críticas)
2. **Curto Prazo:** Executar Fase 2 (Verificações)
3. **Médio Prazo:** Executar Fase 3 (Limpeza)
4. **Longo Prazo:** Executar Fase 4 (Testes Completos)

---

## 📊 MÉTRICAS DE SUCESSO

- ✅ 100% das correções críticas implementadas
- ✅ 100% dos testes de autenticação passando
- ✅ 100% dos testes de páginas principais passando
- ✅ 100% das APIs funcionando corretamente
- ✅ 0 erros críticos no console
- ✅ Performance similar à área Nutri

---

**Documento criado em:** 2025-01-21  
**Última atualização:** 2025-01-21


