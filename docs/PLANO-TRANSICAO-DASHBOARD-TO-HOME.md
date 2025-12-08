# 📋 PLANO DE TRANSIÇÃO: Dashboard → Home

## 🎯 OBJETIVO

Renomear a página inicial de "Dashboard" para "Home" e fazer a transição gradual dos usuários da estrutura antiga para a nova.

---

## 📊 SITUAÇÃO ATUAL

### Rotas Existentes:
- ✅ `/pt/wellness/dashboard` - Dashboard antigo (em uso)
- ✅ `/pt/wellness/dashboard-novo` - Nova estrutura (pronta)

### Estrutura Nova:
- `/pt/wellness/home` - Nova página inicial (criar)
- Manter `/pt/wellness/dashboard` como redirect temporário

---

## 🔄 ESTRATÉGIA DE TRANSIÇÃO

### Fase 1: Criar Nova Rota "Home" (AGORA)
1. ✅ Mover conteúdo de `dashboard-novo` para `home`
2. ✅ Criar redirect de `/dashboard` → `/home`
3. ✅ Atualizar todos os links internos

### Fase 2: Período de Transição (1-2 semanas)
- Manter ambas as rotas funcionando
- `/dashboard` redireciona para `/home`
- Usuários migram automaticamente

### Fase 3: Limpeza (Após confirmação)
- Remover `/dashboard` antigo
- Remover `/dashboard-novo`
- Limpar código não utilizado

---

## 📝 ARQUIVOS A MODIFICAR

### 1. Criar Nova Rota Home
- `src/app/pt/wellness/home/page.tsx` (mover de dashboard-novo)

### 2. Criar Redirect
- `src/app/pt/wellness/dashboard/page.tsx` (redirecionar para /home)

### 3. Atualizar Links Internos
- Componentes que apontam para `/dashboard`
- NavBar, menus, botões

### 4. Identificar Arquivos para Remover (Depois)
- `src/app/pt/wellness/dashboard/page.tsx` (após período de transição)
- `src/app/pt/wellness/dashboard-novo/page.tsx` (após migração)

---

## ⚠️ PONTOS DE ATENÇÃO

1. **URLs Compartilhadas:**
   - Usuários podem ter bookmarks em `/dashboard`
   - Redirect garante que continuem funcionando

2. **Links Internos:**
   - Verificar todos os componentes que linkam para dashboard
   - Atualizar para `/home`

3. **APIs:**
   - Verificar se há APIs que retornam URLs com `/dashboard`
   - Atualizar para `/home`

4. **Analytics:**
   - Monitorar uso de `/dashboard` vs `/home`
   - Remover `/dashboard` quando uso for zero

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [x] Criar `/pt/wellness/home/page.tsx`
- [x] Criar redirect em `/pt/wellness/dashboard/page.tsx`
- [x] Atualizar WellnessChatWidget (botão Home)
- [x] Atualizar `wellness-orientation.ts`
- [x] Atualizar `bem-vindo/page.tsx`
- [ ] Testar redirect funcionando
- [ ] Deploy e monitorar por 1-2 semanas
- [ ] Remover código antigo após confirmação

---

## 🗑️ ARQUIVOS PARA REMOVER (DEPOIS DA TRANSIÇÃO)

### Após 2 semanas de uso confirmado:
1. `src/app/pt/wellness/dashboard/page.tsx` (manter apenas redirect)
2. `src/app/pt/wellness/dashboard-novo/page.tsx` (remover completamente)

### Verificar antes de remover:
- [ ] Analytics mostram zero acessos em `/dashboard`
- [ ] Todos os links internos atualizados
- [ ] Nenhum erro de 404 relacionado

---

**Status:** 📋 Plano criado - Pronto para implementação

