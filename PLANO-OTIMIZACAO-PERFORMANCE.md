# 🚀 PLANO DE OTIMIZAÇÃO DE PERFORMANCE - PASSO A PASSO

## 📋 ESTRATÉGIA

**Princípio**: Otimizar sem quebrar funcionalidades existentes
**Abordagem**: Incremental, testável, reversível
**Prioridade**: Quick Wins primeiro (maior impacto, menor risco)

---

## ✅ FASE 1: QUICK WINS (Alto Impacto, Baixo Risco)

### **PASSO 1.1: Reduzir Retries do `useAuth`**
**Arquivo**: `src/hooks/useAuth.ts`
**Mudança**: Reduzir de 3 tentativas para 1 tentativa + listener
**Risco**: ⚠️ BAIXO (listener já existe e funciona)
**Impacto**: ⚡ ALTO (redução de 1.2s no tempo de carregamento)
**Teste**: Verificar se sessão ainda é detectada corretamente

**Antes**:
- 3 tentativas com delays (200ms + 500ms + 500ms = 1.2s)

**Depois**:
- 1 tentativa imediata
- Listener `onAuthStateChange` detecta mudanças automaticamente

---

### **PASSO 1.2: Cache em sessionStorage para Perfil**
**Arquivo**: `src/hooks/useAuth.ts`
**Mudança**: Adicionar cache de 2 minutos para dados do perfil
**Risco**: ✅ MUITO BAIXO (apenas cache, não afeta lógica)
**Impacto**: ⚡ ALTO (redução de 60-80% nas requisições repetidas)
**Teste**: Verificar se perfil ainda atualiza quando necessário

**Implementação**:
- Salvar perfil no `sessionStorage` após buscar
- Verificar cache antes de fazer requisição
- Invalidar cache após 2 minutos ou quando necessário

---

### **PASSO 1.3: Otimizar Queries `select('*')` em APIs Críticas**
**Arquivos**:
- `src/app/api/wellness/ferramentas/route.ts` (5 ocorrências)
- `src/app/api/wellness/dashboard/route.ts` (verificar)
**Mudança**: Substituir `select('*')` por campos específicos
**Risco**: ⚠️ MÉDIO (precisa garantir que todos os campos necessários estão incluídos)
**Impacto**: ⚡ ALTO (redução de 50-70% no tamanho das respostas)
**Teste**: Verificar se todas as funcionalidades ainda funcionam

**Campos necessários por query**:
- Ferramentas: `id, title, template_slug, status, views, leads_count, conversions_count, created_at, user_id, profession`
- Dashboard: Já otimizado ✅

---

### **PASSO 1.4: Cache em Memória para Dashboard**
**Arquivo**: `src/app/api/wellness/dashboard/route.ts`
**Mudança**: Adicionar cache em memória de 5 minutos
**Risco**: ✅ BAIXO (cache apenas, não afeta lógica)
**Impacto**: ⚡ MÉDIO (redução de 50-60% nas requisições repetidas)
**Teste**: Verificar se dados ainda atualizam quando necessário

**Implementação**:
- Cache em memória (Map) com TTL de 5 minutos
- Chave: `user_id + timestamp (arredondado para 5 min)`
- Invalidar cache quando dados mudarem

---

## ⚡ FASE 2: OTIMIZAÇÕES MÉDIAS (Médio Impacto, Baixo Risco)

### **PASSO 2.1: Lazy Load de Componentes Pesados**
**Arquivos**:
- `src/app/pt/wellness/dashboard/page.tsx` (WellnessNavBar)
- `src/app/pt/wellness/templates/page.tsx` (previews)
**Mudança**: Usar `dynamic()` do Next.js
**Risco**: ✅ BAIXO (apenas carregamento, não afeta funcionalidade)
**Impacto**: ⚡ MÉDIO (redução de 30-40% no bundle inicial)
**Teste**: Verificar se componentes ainda aparecem corretamente

---

### **PASSO 2.2: Substituir `<img>` por `<Image>` do Next.js**
**Arquivo**: `src/app/pt/wellness/modulos/[id]/page.tsx`
**Mudança**: Substituir tag `<img>` por componente `<Image>`
**Risco**: ✅ BAIXO (apenas otimização de imagem)
**Impacto**: ⚡ MÉDIO (redução de 20-30% no tempo de carregamento de imagens)
**Teste**: Verificar se imagens ainda aparecem corretamente

---

### **PASSO 2.3: Simplificar Lógica de Timeouts**
**Arquivos**:
- `src/components/auth/ProtectedRoute.tsx`
- `src/components/auth/RequireSubscription.tsx`
**Mudança**: Simplificar lógica de timeouts (manter funcionalidade, reduzir complexidade)
**Risco**: ⚠️ MÉDIO (afeta comportamento de loading)
**Impacto**: ⚡ BAIXO (melhora manutenibilidade)
**Teste**: Verificar se timeouts ainda funcionam corretamente

---

## 📊 ORDEM DE EXECUÇÃO

### **Sessão 1 (Hoje)**: FASE 1 - Quick Wins
1. ✅ Passo 1.1: Reduzir retries do useAuth
2. ✅ Passo 1.2: Cache em sessionStorage
3. ✅ Passo 1.3: Otimizar queries select(*)
4. ✅ Passo 1.4: Cache em memória para dashboard

### **Sessão 2 (Próxima)**: FASE 2 - Otimizações Médias
5. ✅ Passo 2.1: Lazy load de componentes
6. ✅ Passo 2.2: Otimizar imagens
7. ✅ Passo 2.3: Simplificar timeouts

---

## 🧪 ESTRATÉGIA DE TESTES

Para cada mudança:
1. **Teste Local**: Verificar se funciona em `localhost`
2. **Teste de Regressão**: Verificar se funcionalidades existentes ainda funcionam
3. **Teste de Performance**: Medir tempo de carregamento antes/depois
4. **Commit Incremental**: Commitar cada passo separadamente para fácil reversão

---

## 🔄 PLANO DE REVERSÃO

Cada mudança será:
- ✅ Commitada separadamente
- ✅ Documentada com mensagem clara
- ✅ Reversível com `git revert`

Se algo quebrar:
1. Reverter commit específico
2. Investigar problema
3. Corrigir e tentar novamente

---

## 📈 MÉTRICAS DE SUCESSO

**Antes**:
- Tempo de carregamento: 3-8s
- Requisições ao banco: 15-25 por página

**Meta (FASE 1)**:
- Tempo de carregamento: 1.5-4s (redução de 50%)
- Requisições ao banco: 8-15 por página (redução de 40%)

**Meta (FASE 2)**:
- Tempo de carregamento: 1-3s (redução de 70%)
- Requisições ao banco: 5-10 por página (redução de 60%)

---

## ✅ CHECKLIST DE SEGURANÇA

Antes de cada mudança:
- [ ] Backup do código atual (git commit)
- [ ] Entender o que o código faz
- [ ] Identificar dependências
- [ ] Planejar teste de regressão
- [ ] Documentar mudança

Depois de cada mudança:
- [ ] Testar localmente
- [ ] Verificar console por erros
- [ ] Testar funcionalidades relacionadas
- [ ] Commitar com mensagem clara
- [ ] Documentar resultado

---

**Vamos começar! 🚀**

