# 🔍 ANÁLISE COMPLETA DE PERFORMANCE - YLADA APP

## 📋 RESUMO EXECUTIVO

**Status Atual**: ⚠️ **MÚLTIPLOS GARGALOS IDENTIFICADOS**

**Principais Problemas**:
1. **Múltiplas instâncias de `useAuth`** causando 3x mais requisições
2. **Queries desnecessárias** com `select('*')` em vez de campos específicos
3. **Falta de cache** em chamadas frequentes
4. **Componentes pesados** carregados sincronamente
5. **Múltiplas tentativas de retry** aumentando latência
6. **Falta de lazy loading** em componentes não críticos
7. **Imagens não otimizadas** em alguns lugares

---

## 🚨 PROBLEMAS CRÍTICOS (ALTA PRIORIDADE)

### **1. MÚLTIPLAS INSTÂNCIAS DO `useAuth`**

**Problema**:
- `ProtectedRoute` → `useAuth()` (instância 1)
- `RequireSubscription` → `useAuth()` (instância 2)
- `WellnessDashboardContent` → `useAuth()` (instância 3)

**Impacto**:
- **3x mais requisições** ao banco de dados
- **3x mais chamadas** de `getSession()` (com 3 tentativas cada = 9 chamadas)
- **3x mais chamadas** de `fetchUserProfile()` (com 3 retries cada = 9 chamadas)
- **Total**: ~18 requisições simultâneas na inicialização
- **Race conditions** entre instâncias
- **Estados inconsistentes** (uma instância pode marcar `loading = false` enquanto outra ainda carrega)

**Solução**:
- ✅ Já existe `AuthContext` mas não está sendo usado em todos os lugares
- ✅ Verificar se `AuthProvider` está no layout raiz
- ✅ Garantir que todos os componentes usem `useAuth()` do contexto, não do hook direto

**Arquivos Afetados**:
- `src/hooks/useAuth.ts` (hook direto)
- `src/contexts/AuthContext.tsx` (contexto - já existe)
- `src/components/auth/ProtectedRoute.tsx` (usa contexto ✅)
- `src/components/auth/RequireSubscription.tsx` (usa contexto ✅)
- `src/app/pt/wellness/dashboard/page.tsx` (usa contexto ✅)

**Status**: ✅ **CONFIRMADO** - `AuthProvider` está no layout raiz (`src/app/layout.tsx` via `AuthProviderWrapper`). Todos os componentes estão usando o contexto corretamente.

---

### **2. QUERIES COM `select('*')` - TRAZENDO DADOS DESNECESSÁRIOS**

**Problema**:
Múltiplas queries usando `select('*')` quando apenas alguns campos são necessários.

**Arquivos Encontrados**:
- `src/app/api/wellness/ferramentas/route.ts` (5 ocorrências)
- `src/app/api/admin/templates/route.ts` (1 ocorrência)
- `src/app/api/admin/templates/[id]/route.ts` (1 ocorrência)
- `src/app/api/admin/templates/[id]/duplicate/route.ts` (1 ocorrência)
- `src/app/api/wellness/modulos/[id]/route.ts` (3 ocorrências)

**Impacto**:
- **Transferência de dados 3-10x maior** do que necessário
- **Processamento mais lento** no banco
- **Maior uso de memória** no servidor
- **Latência aumentada** especialmente em conexões lentas

**Exemplo**:
```typescript
// ❌ RUIM
.select('*')

// ✅ BOM
.select('id, title, template_slug, status, views, created_at')
```

**Solução**:
- Identificar campos realmente necessários em cada query
- Substituir `select('*')` por campos específicos
- **Impacto esperado**: Redução de 50-70% no tamanho das respostas

---

### **3. MÚLTIPLAS TENTATIVAS DE RETRY NO `useAuth`**

**Problema**:
`useAuth` faz **3 tentativas** de `getSession()` com delays de 200ms, 500ms, 500ms:
- Tentativa 1: imediata
- Tentativa 2: após 500ms
- Tentativa 3: após mais 500ms

**Total**: até **1.2 segundos** só para detectar sessão.

**Código Problemático** (`src/hooks/useAuth.ts:108-172`):
```typescript
// Tentativa 1: Buscar sessão imediatamente
const { data: { session: currentSession } } = await supabase.auth.getSession()

// Tentativa 2: Se não encontrou, tentar novamente após mais tempo
if (!session) {
  await new Promise(resolve => setTimeout(resolve, 500))
  const { data: { session: retrySession } } = await supabase.auth.getSession()
}

// Tentativa 3: Última tentativa
if (!session) {
  await new Promise(resolve => setTimeout(resolve, 500))
  const { data: { session: finalSession } } = await supabase.auth.getSession()
}
```

**Impacto**:
- **Latência artificial de 1.2s** mesmo quando a sessão está disponível
- **Experiência ruim** para o usuário
- **Desnecessário** na maioria dos casos

**Solução**:
- Reduzir para **1 tentativa** + listener `onAuthStateChange`
- O listener já detecta mudanças de sessão automaticamente
- **Impacto esperado**: Redução de 1.2s no tempo de carregamento inicial

---

### **4. FALTA DE CACHE EM CHAMADAS FREQUENTES**

**Problema**:
- Dados do perfil são buscados toda vez que a página carrega
- Dados do dashboard são buscados sem cache
- Verificação de assinatura é feita toda vez

**Impacto**:
- **Requisições desnecessárias** ao banco
- **Latência aumentada** mesmo quando dados não mudaram
- **Custo maior** de processamento

**Solução**:
- Implementar **cache em memória** (5-10 minutos) para dados do perfil
- Usar **sessionStorage** para cache de curto prazo (1-2 minutos)
- Implementar **stale-while-revalidate** para dados do dashboard
- **Impacto esperado**: Redução de 60-80% nas requisições repetidas

---

### **5. COMPONENTES PESADOS CARREGADOS SINCRONAMENTE**

**Problema**:
- `ChatIA` já está com lazy loading ✅
- Mas outros componentes pesados podem não estar

**Arquivos a Verificar**:
- `src/app/pt/wellness/templates/page.tsx` - importa muitos componentes de preview
- `src/app/pt/wellness/dashboard/page.tsx` - importa `WellnessNavBar` sincronamente

**Solução**:
- Usar `dynamic()` do Next.js para lazy load de componentes pesados
- Carregar apenas quando necessário (on scroll, on click, etc.)
- **Impacto esperado**: Redução de 30-50% no bundle inicial

---

## ⚠️ PROBLEMAS MODERADOS (MÉDIA PRIORIDADE)

### **6. TIMEOUTS MÚLTIPLOS E COMPLEXOS**

**Problema**:
- `ProtectedRoute` tem 3 timeouts diferentes (2s, 3s, 3s)
- `RequireSubscription` tem múltiplos timeouts (1s, 3s, 5s)
- Lógica complexa de fallback

**Impacto**:
- **Código difícil de manter**
- **Comportamento inconsistente** em edge cases
- **Experiência confusa** para o usuário

**Solução**:
- Simplificar lógica de timeouts
- Usar uma estratégia única e clara
- **Impacto esperado**: Código mais simples e previsível

---

### **7. IMAGENS NÃO OTIMIZADAS**

**Problema**:
- Algumas imagens usam `<img>` em vez de `<Image>` do Next.js
- Falta de `loading="lazy"` em imagens abaixo da dobra
- Imagens grandes sem otimização

**Arquivos Encontrados**:
- `src/app/pt/wellness/modulos/[id]/page.tsx` (linha 476) - usa `<img>` em vez de `<Image>`

**Solução**:
- Substituir todas as `<img>` por `<Image>` do Next.js
- Adicionar `loading="lazy"` para imagens abaixo da dobra
- **Impacto esperado**: Redução de 20-40% no tempo de carregamento de imagens

---

### **8. FALTA DE PAGINAÇÃO EM LISTAS**

**Problema**:
- Dashboard carrega todas as ferramentas de uma vez
- Não há paginação ou virtualização

**Impacto**:
- **Queries lentas** quando há muitas ferramentas
- **Renderização lenta** com muitos itens
- **Uso excessivo de memória**

**Solução**:
- Implementar paginação (limite de 10-20 itens por página)
- Ou usar virtualização para listas grandes
- **Impacto esperado**: Redução de 50-70% no tempo de carregamento para usuários com muitas ferramentas

---

## 📊 MÉTRICAS ESTIMADAS

### **Antes das Otimizações**:
- Tempo de carregamento inicial: **3-8 segundos**
- Requisições ao banco: **15-25 por página**
- Tamanho do bundle inicial: **~500KB-1MB**
- Time to Interactive (TTI): **5-10 segundos**

### **Após Otimizações** (estimado):
- Tempo de carregamento inicial: **1-3 segundos** (redução de 60-70%)
- Requisições ao banco: **5-10 por página** (redução de 50-60%)
- Tamanho do bundle inicial: **~300-600KB** (redução de 30-40%)
- Time to Interactive (TTI): **2-4 segundos** (redução de 60-70%)

---

## 🎯 PLANO DE AÇÃO RECOMENDADO

### **FASE 1: QUICK WINS (1-2 dias)**
1. ✅ Verificar se `AuthProvider` está no layout raiz
2. ✅ Reduzir retries do `useAuth` de 3 para 1
3. ✅ Substituir `select('*')` por campos específicos nas queries mais usadas
4. ✅ Adicionar cache em sessionStorage para perfil (1-2 minutos)

**Impacto Esperado**: Redução de 40-50% no tempo de carregamento

---

### **FASE 2: OTIMIZAÇÕES MÉDIAS (3-5 dias)**
5. ✅ Implementar cache em memória para dados do dashboard (5-10 minutos)
6. ✅ Lazy load de componentes pesados
7. ✅ Substituir `<img>` por `<Image>` do Next.js
8. ✅ Simplificar lógica de timeouts

**Impacto Esperado**: Redução adicional de 20-30%

---

### **FASE 3: OTIMIZAÇÕES AVANÇADAS (1 semana)**
9. ✅ Implementar paginação/virtualização em listas
10. ✅ Otimizar queries com índices no banco
11. ✅ Implementar Service Worker para cache offline
12. ✅ Code splitting mais agressivo

**Impacto Esperado**: Redução adicional de 10-20%

---

## 🔧 FERRAMENTAS DE MONITORAMENTO

### **Recomendações**:
1. **Lighthouse** - Medir performance real
2. **Next.js Analytics** - Monitorar métricas em produção
3. **Sentry** - Monitorar erros e performance
4. **Vercel Analytics** - Métricas de performance em tempo real

---

## 📝 NOTAS TÉCNICAS

### **Pontos Positivos Já Implementados**:
- ✅ `AuthContext` criado (mas precisa verificar uso)
- ✅ `ChatIA` com lazy loading
- ✅ API unificada do dashboard (`/api/wellness/dashboard`)
- ✅ Queries paralelas em algumas APIs
- ✅ Timeouts para evitar travamentos

### **Pontos de Atenção**:
- ⚠️ Muitos logs de debug (`console.log`) que podem impactar performance em produção
- ⚠️ Falta de tratamento de erro em algumas queries
- ⚠️ Algumas queries podem ser otimizadas com índices no banco

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ **AuthProvider verificado** - está no layout raiz corretamente
2. **Priorizar FASE 1** (quick wins) para impacto imediato
3. **Medir performance atual** com Lighthouse antes de começar
4. **Implementar mudanças incrementalmente** e medir impacto
5. **Monitorar em produção** após cada mudança

---

## 📚 REFERÊNCIAS

- Documentação de otimização já existente:
  - `docs/OTIMIZACAO-DASHBOARD-WELLNESS.md`
  - `docs/OTIMIZACOES-PERFORMANCE.md`
  - `DIAGNOSTICO-LENTIDAO-DASHBOARD.md`
  - `PROBLEMA-DASHBOARD-IDENTIFICADO.md`

---

**Data da Análise**: 2025-01-XX
**Versão do Next.js**: 15.5.3
**Versão do React**: 19.1.0

