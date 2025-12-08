# 🚀 PRÓXIMOS PASSOS - IMPLEMENTAÇÃO DAS LOUSAS

Data: Agora

---

## ✅ O QUE JÁ FOI CONCLUÍDO

### 1. Estrutura de Dados ✅
- ✅ Migration 013: Tabela `wellness_links` criada
- ✅ Migration 014: Tabela `wellness_treinos` criada
- ✅ Migration 011: Tabelas de fluxos criadas (via seed)

### 2. Seeds Executados com Sucesso ✅
- ✅ **37 Links Wellness** inseridos
- ✅ **35 Treinos** inseridos (15 de 1min, 10 de 3min, 10 de 5min)
- ✅ **6 Fluxos Completos** inseridos (com passos, scripts e dicas)
- ✅ **28 Scripts** inseridos (com correção de duplicatas)

### 3. APIs Criadas ✅
- ✅ `/api/wellness/links` - Lista links
- ✅ `/api/wellness/links/[codigo]` - Link específico
- ✅ `/api/wellness/treinos` - Lista treinos
- ✅ `/api/wellness/treinos/[codigo]` - Treino específico
- ✅ `/api/wellness/treinos/aleatorio` - Treino aleatório

### 4. Lógica do NOEL Criada ✅
- ✅ System Prompt completo (Lousa 7) - `src/lib/noel-wellness/system-prompt-lousa7.ts`
- ✅ Flux Engine - `src/lib/wellness-system/flux-engine.ts`
- ✅ Links Recommender - `src/lib/noel-wellness/links-recommender.ts`

---

## 🎯 PRÓXIMOS PASSOS IMEDIATOS

### FASE 1: INTEGRAR NOEL COM NOVO CONTEÚDO (Prioridade Alta)

#### 1.1 Atualizar System Prompt do NOEL
**Arquivo:** `src/app/api/wellness/noel/route.ts`

**O que fazer:**
- Importar `NOEL_SYSTEM_PROMPT_LOUSA7`
- Substituir ou combinar com o prompt atual
- Testar respostas do NOEL

**Status:** ⏳ Pendente

---

#### 1.2 Adicionar Funções NOEL para Links Wellness
**Arquivo:** `src/lib/noel-assistant-handler.ts`

**O que fazer:**
- Adicionar função `recomendarLinkWellness` 
- Adicionar função `buscarTreino`
- Integrar com `links-recommender.ts`

**Status:** ⏳ Pendente

---

#### 1.3 Criar Endpoints NOEL para Novas Funções
**Arquivos a criar:**
- `src/app/api/noel/recomendarLinkWellness/route.ts`
- `src/app/api/noel/buscarTreino/route.ts`

**O que fazer:**
- Criar endpoints que usam `links-recommender.ts`
- Integrar com APIs de treinos
- Testar function calls do NOEL

**Status:** ⏳ Pendente

---

### FASE 2: INTEGRAR FLUX ENGINE (Prioridade Média)

#### 2.1 Integrar Flux Engine com NOEL
**Arquivo:** `src/lib/noel-assistant-handler.ts`

**O que fazer:**
- Adicionar função `detectarGatilhoFluxo`
- Adicionar função `recomendarFluxo`
- Usar `flux-engine.ts` para detectar gatilhos

**Status:** ⏳ Pendente

---

#### 2.2 Criar Endpoint para Flux Engine
**Arquivo:** `src/app/api/noel/detectarFluxo/route.ts`

**O que fazer:**
- Criar endpoint que usa `flux-engine.ts`
- Retornar fluxo recomendado baseado em contexto
- Integrar com NOEL

**Status:** ⏳ Pendente

---

### FASE 3: CRIAR PÁGINAS FRONTEND (Prioridade Média)

#### 3.1 Página de Links Wellness
**Arquivo:** `src/app/pt/wellness/links/page.tsx`

**O que fazer:**
- Listar os 37 Links Wellness
- Filtrar por categoria
- Mostrar detalhes de cada link
- Permitir copiar script curto

**Status:** ⏳ Pendente

---

#### 3.2 Página de Treinos
**Arquivo:** `src/app/pt/wellness/treinos/micro/page.tsx`

**O que fazer:**
- Listar treinos por tipo (1min, 3min, 5min)
- Mostrar treino aleatório
- Permitir buscar treino por gatilho
- Integrar com NOEL para sugerir treinos

**Status:** ⏳ Pendente

---

#### 3.3 Melhorar Página de Fluxos
**Arquivo:** `src/app/pt/wellness/fluxos/page.tsx`

**O que fazer:**
- Buscar fluxos do banco (não hardcoded)
- Mostrar fluxos com passos, scripts e dicas
- Integrar com Flux Engine

**Status:** ⏳ Pendente

---

### FASE 4: GATILHOS AUTOMÁTICOS (Prioridade Baixa)

#### 4.1 Implementar Gatilhos Temporais
**Arquivo:** `src/lib/wellness-system/triggers.ts` (já criado)

**O que fazer:**
- Criar job/cron para gatilhos diários
- Implementar gatilho de treino diário
- Implementar gatilhos semanais (segunda, sexta, domingo)

**Status:** ⏳ Pendente

---

#### 4.2 Implementar Gatilhos Comportamentais
**O que fazer:**
- Detectar inatividade de distribuidores
- Detectar leads que sumiram
- Sugerir fluxos de retenção automaticamente

**Status:** ⏳ Pendente

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Alta Prioridade
- [ ] Integrar System Prompt Lousa 7 no NOEL
- [ ] Adicionar função NOEL `recomendarLinkWellness`
- [ ] Adicionar função NOEL `buscarTreino`
- [ ] Criar endpoints NOEL para novas funções
- [ ] Testar NOEL com novo conteúdo

### Média Prioridade
- [ ] Integrar Flux Engine com NOEL
- [ ] Criar página de Links Wellness
- [ ] Criar página de Treinos Micro
- [ ] Melhorar página de Fluxos

### Baixa Prioridade
- [ ] Implementar gatilhos automáticos
- [ ] Criar jobs/cron para gatilhos temporais
- [ ] Implementar notificações baseadas em gatilhos

---

## 🎯 RECOMENDAÇÃO: COMEÇAR POR

**1. Integrar System Prompt do NOEL** (Mais Impacto)
- Atualizar `src/app/api/wellness/noel/route.ts`
- Importar e usar `NOEL_SYSTEM_PROMPT_LOUSA7`
- Testar se NOEL está usando a nova lógica

**2. Adicionar Função de Recomendar Links**
- Criar função NOEL `recomendarLinkWellness`
- Integrar com `links-recommender.ts`
- Testar se NOEL consegue recomendar links

**3. Testar NOEL com Cenários Reais**
- Testar recomendação de links
- Testar sugestão de treinos
- Testar detecção de fluxos

---

## 📝 NOTAS IMPORTANTES

- Todo o conteúdo está no banco de dados ✅
- APIs estão criadas e funcionais ✅
- Lógica do NOEL está criada mas não integrada ⏳
- Frontend precisa ser criado/atualizado ⏳

**Próximo passo mais importante:** Integrar o System Prompt do NOEL para que ele comece a usar toda a lógica criada.

