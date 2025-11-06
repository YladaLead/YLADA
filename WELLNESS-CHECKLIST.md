# Checklist - Área Wellness

## ✅ Concluído

### Funcionalidades Core
- [x] Dashboard Wellness completo
- [x] Página de listagem de ferramentas
- [x] Página "Criar Novo Link" com preview builder
- [x] 13 templates funcionais e refatorados
- [x] Estrutura escalável com componentes compartilhados
- [x] Rotas dinâmicas `[user-slug]/[tool-slug]`
- [x] Integração com banco de dados (API routes)
- [x] Página de Configurações (com user_slug)
- [x] Página de Cursos
- [x] Página de Suporte
- [x] Validação de slug único

### API Routes
- [x] GET `/api/wellness/ferramentas` - Listar ferramentas
- [x] POST `/api/wellness/ferramentas` - Criar ferramenta
- [x] PUT `/api/wellness/ferramentas` - Atualizar ferramenta
- [x] DELETE `/api/wellness/ferramentas` - Deletar ferramenta
- [x] GET `/api/wellness/ferramentas/check-slug` - Validar slug
- [x] GET `/api/wellness/ferramentas/by-url` - Buscar por URL

## ⚠️ Pendências Críticas

### 1. **Página de Edição de Ferramentas** 🔴
**Status:** Botão "Editar" não funciona
**Localização:** `src/app/pt/wellness/ferramentas/page.tsx` (linha 308)
**Ação:**
- Criar página `/pt/wellness/ferramentas/[id]/editar`
- Reutilizar lógica da página "nova" mas preenchendo com dados existentes
- Permitir editar: título, descrição, cores, CTA, emoji, slug (com validação)

### 2. **Tracking de Visualizações** 🔴
**Status:** Não está incrementando views quando ferramenta é acessada
**Localização:** `src/app/pt/wellness/[user-slug]/[tool-slug]/page.tsx`
**Ação:**
- Adicionar chamada à API para incrementar `views` quando carregar ferramenta
- Criar endpoint ou usar PUT para atualizar contador

### 3. **Integração com Autenticação** 🟡
**Status:** Usando `user_id` temporário em vários lugares
**Locais:**
- `src/app/pt/wellness/ferramentas/page.tsx` linha 39
- `src/app/pt/wellness/ferramentas/nova/page.tsx` linha 321
- `src/app/pt/wellness/quiz-personalizado/page.tsx` linha 376
**Ação:**
- Integrar com sistema de autenticação existente
- Remover `user_id` temporário e usar contexto de autenticação

## 📋 Melhorias Opcionais

### 4. **Validação de user_slug** 🟡
**Status:** TODO comentado
**Localização:** `src/app/pt/wellness/configuracao/page.tsx` linha 45
**Ação:**
- Criar API route `/api/wellness/user-slug/check` para validar disponibilidade
- Integrar validação em tempo real no campo

### 5. **Estatísticas do Dashboard** 🟢
**Status:** Usando dados mockados
**Localização:** `src/app/pt/wellness/dashboard/page.tsx`
**Ação:**
- Integrar com API para buscar estatísticas reais
- Calcular métricas baseadas em ferramentas do usuário

### 6. **URL Dinâmica** 🟢
**Status:** Hardcoded como "ylada.app"
**Localização:** Vários arquivos
**Ação:**
- Usar variável de ambiente `NEXT_PUBLIC_APP_URL` ou `process.env.NEXT_PUBLIC_APP_URL`
- Permitir configuração por ambiente

### 7. **Página de Leads** 🔵
**Status:** Pasta vazia, mas não é necessária para Wellness (conforme especificação)
**Ação:**
- Remover pasta se não for necessária
- OU criar página placeholder explicando que Wellness não captura leads

### 8. **Feedback Visual após Criação** 🟢
**Status:** Usa `alert()` simples
**Localização:** `src/app/pt/wellness/ferramentas/nova/page.tsx` linha 363
**Ação:**
- Criar componente de toast/notificação mais elegante
- Mostrar URL completa copiável

### 9. **Testes End-to-End** 🔵
**Ação:**
- Testar fluxo completo: Criar → Verificar URL → Acessar → Verificar configurações aplicadas
- Validar todos os 13 templates com configurações personalizadas
- Testar edição e exclusão

### 10. **Otimizações de Performance** 🔵
**Ação:**
- Verificar se imports dinâmicos estão otimizados
- Considerar lazy loading em componentes grandes
- Otimizar queries do banco

## 🎯 Priorização

### Alta Prioridade (Fazer Agora)
1. **Página de Edição** - Usuários precisam editar suas ferramentas
2. **Tracking de Visualizações** - Métricas importantes para analytics

### Média Prioridade
3. **Integração com Autenticação** - Remove código temporário
4. **Validação de user_slug** - Melhora UX

### Baixa Prioridade
5. Estatísticas do Dashboard (pode usar mockados por enquanto)
6. URL dinâmica (funciona com hardcode)
7. Melhorias de UI/UX (feedback, toasts)







