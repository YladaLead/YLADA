# 🗺️ ROADMAP COMPLETO: AJUSTES PARA LYA CONDUZINDO

## 📋 VISÃO GERAL

Este documento mapeia **TODAS** as páginas e componentes que precisam ser ajustados para a LYA conduzir completamente o fluxo do YLADA Nutri.

**Objetivo:** Transformar de "plataforma de conteúdo" para "sistema guiado de decisão e ação".

---

## 🎯 PRINCÍPIOS DE REVISÃO

### **Regras Aplicadas em TODAS as Páginas:**

1. ✅ **Linguagem simples** - Sem termos técnicos
2. ✅ **LYA como guia** - Presença ativa em cada etapa
3. ✅ **Revelação progressiva** - Conteúdo aparece quando faz sentido
4. ✅ **Uma ação por vez** - Foco claro em cada momento
5. ✅ **Área de clientes integrada** - Não compete com jornada
6. ✅ **Textos convidam, não explicam** - Ação > Explicação

---

## 📊 MAPEAMENTO COMPLETO DE PÁGINAS E COMPONENTES

### **FASE 1: ONBOARDING E DIAGNÓSTICO** 🥇 PRIORIDADE ABSOLUTA

#### **1.1 Página de Onboarding**
**Arquivo:** `src/app/pt/nutri/(protected)/onboarding/page.tsx`

**Ajustes Necessários:**
- [ ] Revisar textos para linguagem mais simples
- [ ] Enfatizar papel da LYA como guia
- [ ] Adicionar pergunta sobre clientes existentes
- [ ] Melhorar transição para diagnóstico

**Textos a Revisar:**
- Título e descrição principal
- Botão "Começar meu Diagnóstico Estratégico"
- Textos explicativos

**Status:** ⚠️ Parcialmente ajustado (botão funcionando, mas textos podem melhorar)

---

#### **1.2 Página de Diagnóstico**
**Arquivo:** `src/app/pt/nutri/(protected)/diagnostico/page.tsx`

**Ajustes Necessários:**
- [ ] Adicionar mensagens da LYA em cada seção do formulário
- [ ] Explicar "porquê" de cada pergunta em linguagem simples
- [ ] Criar componente `LyaDiagnosticSection`
- [ ] Tela de celebração após conclusão
- [ ] Mensagem personalizada da LYA baseada no diagnóstico
- [ ] Revisar todos os labels e textos do formulário

**Componentes a Criar:**
- `LyaDiagnosticSection` - Mensagens contextuais
- `LyaDiagnosticCompletion` - Tela de celebração

**Status:** ⚠️ Funcional, mas falta presença da LYA

---

### **FASE 2: HOME E DASHBOARD** 🥇 PRIORIDADE ABSOLUTA

#### **2.1 Página Home**
**Arquivo:** `src/app/pt/nutri/(protected)/home/page.tsx`

**Ajustes Necessários:**
- [ ] Simplificar dashboard (Dias 1-7: apenas WelcomeCard + LyaAnaliseHoje)
- [ ] Lógica de revelação progressiva de blocos
- [ ] Remover vídeo ou torná-lo secundário
- [ ] Integrar área de clientes quando relevante

**Lógica a Implementar:**
```typescript
// Dias 1-7: Simplificado
// Dia 8-14: Adicionar JornadaBlock + FerramentasBlock (filtrado)
// Dia 15+: Adicionar GSALBlock (se tiver leads)
// Dia 21+: Adicionar PilaresBlock + BibliotecaBlock
```

**Status:** ⚠️ Parcialmente implementado (já tem lógica de simplificação)

---

#### **2.2 WelcomeCard**
**Arquivo:** `src/components/nutri/home/WelcomeCard.tsx`

**Ajustes Necessários:**
- [ ] Revisar textos para linguagem mais simples
- [ ] Melhorar mensagens da LYA
- [ ] Adicionar contexto personalizado baseado no diagnóstico

**Status:** ✅ Já tem LYA, mas pode melhorar textos

---

#### **2.3 LyaAnaliseHoje**
**Arquivo:** `src/components/nutri/LyaAnaliseHoje.tsx`

**Ajustes Necessários:**
- [ ] Garantir que textos da LYA seguem regras de linguagem
- [ ] Verificar se não usa termos técnicos
- [ ] Melhorar apresentação visual

**Status:** ✅ Existe, precisa revisar conteúdo gerado

---

#### **2.4 JornadaBlock**
**Arquivo:** `src/components/nutri/home/JornadaBlock.tsx`

**Ajustes Necessários:**
- [ ] Revisar título: "Jornada de Transformação" → "Sua Jornada de 30 Dias"
- [ ] Revisar subtítulo para linguagem mais simples
- [ ] Adicionar mensagem da LYA quando aparecer
- [ ] Texto "Carregando progresso" → "Carregando..."

**Status:** ⚠️ Textos precisam revisão

---

#### **2.5 PilaresBlock**
**Arquivo:** `src/components/nutri/home/PilaresBlock.tsx`

**Ajustes Necessários:**
- [ ] Revisar título e subtítulo
- [ ] Reescrever todas as descriptions dos pilares
- [ ] Remover termos técnicos ("captar leads", "sistema completo")
- [ ] Só mostrar pilares da fase atual (não todos de uma vez)

**Status:** ⚠️ Textos precisam revisão completa

---

#### **2.6 FerramentasBlock**
**Arquivo:** `src/components/nutri/home/FerramentasBlock.tsx`

**Ajustes Necessários:**
- [ ] Revisar texto da dica (remover "Você pode criar apenas")
- [ ] Revisar texto "Acesse todas as suas ferramentas"
- [ ] Filtrar ferramentas por relevância do dia/estado
- [ ] Adicionar mensagem da LYA explicando por que aparecem

**Status:** ⚠️ Textos precisam revisão

---

#### **2.7 GSALBlock**
**Arquivo:** `src/components/nutri/home/GSALBlock.tsx`

**Ajustes Necessários:**
- [ ] Revisar mensagem de bloqueio ("será desbloqueada" → "quando chegar a hora")
- [ ] Revisar dica sobre LYA (simplificar linguagem)
- [ ] Mudar "Resumo GSAL" → "Como está seu negócio hoje"
- [ ] Aparecer apenas quando LYA detecta necessidade (não só por dia)

**Status:** ⚠️ Textos precisam revisão + lógica por estado

---

#### **2.8 BibliotecaBlock**
**Arquivo:** `src/components/nutri/home/BibliotecaBlock.tsx`

**Ajustes Necessários:**
- [ ] Revisar título e subtítulo
- [ ] Reescrever descriptions ("uso do sistema" → "como usar")
- [ ] Remover termos técnicos

**Status:** ⚠️ Textos precisam revisão

---

#### **2.9 AnotacoesBlock**
**Arquivo:** `src/components/nutri/home/AnotacoesBlock.tsx`

**Ajustes Necessários:**
- [ ] Revisar subtítulo ("insights" → "o que você aprendeu")
- [ ] Revisar placeholder
- [ ] Simplificar linguagem

**Status:** ⚠️ Textos precisam revisão

---

### **FASE 3: SIDEBAR E NAVEGAÇÃO** 🥈 PRIORIDADE ALTA

#### **3.1 NutriSidebar**
**Arquivo:** `src/components/nutri/NutriSidebar.tsx`

**Ajustes Necessários:**
- [ ] Revisar todos os labels dos itens de menu
- [ ] Garantir que sidebar progressivo está funcionando corretamente
- [ ] Adicionar notificações da LYA quando novas seções são desbloqueadas
- [ ] Revisar tooltips e mensagens de bloqueio

**Status:** ✅ Já tem lógica progressiva, precisa revisar textos

---

#### **3.2 sidebar-phases.ts**
**Arquivo:** `src/lib/nutri/sidebar-phases.ts`

**Ajustes Necessários:**
- [ ] Garantir que fases estão corretas
- [ ] Fase 1: Apenas Home + Jornada
- [ ] Fase 2: Adicionar Pilares + Ferramentas
- [ ] Fase 3: Adicionar GSAL
- [ ] Fase 4: Adicionar Cursos + Biblioteca

**Status:** ⚠️ Precisa verificar se está correto

---

### **FASE 4: JORNADA 30 DIAS** 🥈 PRIORIDADE ALTA

#### **4.1 Página de Jornada (Lista)**
**Arquivo:** `src/app/pt/nutri/metodo/jornada/page.tsx`

**Ajustes Necessários:**
- [ ] Revisar textos introdutórios
- [ ] Adicionar mensagem da LYA explicando a jornada
- [ ] Garantir linguagem simples

**Status:** ⚠️ Precisa revisar

---

#### **4.2 Página de Dia da Jornada**
**Arquivo:** `src/app/pt/nutri/metodo/jornada/dia/[numero]/page.tsx`

**Ajustes Necessários:**
- [ ] Adicionar componente `LyaDayIntroduction` no topo
- [ ] Integrar `LyaChatWidget` com contexto do dia
- [ ] Adicionar componente `LyaDayCompletion` após conclusão
- [ ] Revisar todos os textos da página
- [ ] Garantir que botão "Acessar Pilar Relacionado" funciona

**Componentes a Criar:**
- `LyaDayIntroduction` - Apresentação do dia pela LYA
- `LyaDayCompletion` - Celebração após conclusão

**Status:** ⚠️ Funcional, mas falta presença da LYA

---

#### **4.3 AcaoPraticaCard**
**Arquivo:** `src/components/formacao/AcaoPraticaCard.tsx`

**Ajustes Necessários:**
- [ ] Revisar textos
- [ ] Garantir que link funciona corretamente
- [ ] Adicionar contexto da LYA se necessário

**Status:** ✅ Funcional, pode melhorar textos

---

### **FASE 5: ÁREA DE CLIENTES** 🥈 PRIORIDADE ALTA

#### **5.1 Página de Clientes (Lista)**
**Arquivo:** `src/app/pt/nutri/(protected)/clientes/page.tsx`

**Ajustes Necessários:**
- [ ] Revisar todos os textos
- [ ] Adicionar mensagens da LYA contextualmente
- [ ] Integrar com jornada (não competir)
- [ ] Adicionar pergunta no onboarding sobre clientes existentes
- [ ] Criar fluxo de importação/cadastro simplificado

**Status:** ⚠️ Precisa revisão completa

---

#### **5.2 Página de Cliente Individual**
**Arquivo:** `src/app/pt/nutri/(protected)/clientes/[id]/page.tsx`

**Ajustes Necessários:**
- [ ] Revisar textos
- [ ] Adicionar sugestões da LYA baseadas no status
- [ ] Integrar com jornada quando relevante

**Status:** ⚠️ Precisa revisão

---

#### **5.3 Kanban de Clientes**
**Arquivo:** `src/app/pt/nutri/(protected)/clientes/kanban/page.tsx`

**Ajustes Necessários:**
- [ ] Revisar textos
- [ ] Adicionar mensagens da LYA em cada coluna
- [ ] Explicar status em linguagem simples

**Status:** ⚠️ Precisa revisão

---

### **FASE 6: OUTRAS PÁGINAS** 🥉 PRIORIDADE MÉDIA

#### **6.1 Página de Configurações**
**Arquivo:** `src/app/pt/nutri/(protected)/configuracao/page.tsx`

**Ajustes Necessários:**
- [ ] Revisar textos
- [ ] Adicionar mensagens da LYA explicando cada seção
- [ ] Simplificar linguagem

**Status:** ⚠️ Precisa revisão

---

#### **6.2 Página GSAL**
**Arquivo:** `src/app/pt/nutri/(protected)/gsal/page.tsx`

**Ajustes Necessários:**
- [ ] Revisar todos os textos
- [ ] Adicionar mensagens da LYA contextualmente
- [ ] Explicar cada etapa em linguagem simples
- [ ] Remover termos técnicos

**Status:** ⚠️ Precisa revisão completa

---

#### **6.3 Página de Ferramentas**
**Arquivo:** `src/app/pt/nutri/(protected)/ferramentas/page.tsx` (se existir)

**Ajustes Necessários:**
- [ ] Revisar textos
- [ ] Filtrar por relevância (não mostrar tudo)
- [ ] Adicionar mensagens da LYA

**Status:** ⚠️ Precisa verificar se existe e revisar

---

#### **6.4 Página de Cursos**
**Arquivo:** `src/app/pt/nutri/(protected)/cursos/page.tsx`

**Ajustes Necessários:**
- [ ] Revisar textos
- [ ] Adicionar mensagens da LYA
- [ ] Simplificar linguagem

**Status:** ⚠️ Precisa revisão

---

#### **6.5 Página de Anotações**
**Arquivo:** `src/app/pt/nutri/(protected)/anotacoes/page.tsx`

**Ajustes Necessários:**
- [ ] Revisar textos
- [ ] Simplificar linguagem
- [ ] Adicionar contexto da LYA

**Status:** ⚠️ Precisa revisão

---

## 🎯 PLANO DE EXECUÇÃO POR FASES

### **SPRINT 1: FUNDAÇÃO (Semana 1-2)** 🥇

**Objetivo:** Corrigir textos críticos e simplificar dashboard

**Tarefas:**
1. ✅ Revisar e corrigir textos dos blocos do Home
2. ✅ Simplificar dashboard (Dias 1-7)
3. ✅ Revisar textos do WelcomeCard
4. ✅ Revisar textos do JornadaBlock
5. ✅ Criar componente `LyaDiagnosticSection`
6. ✅ Adicionar mensagens da LYA no diagnóstico

**Entregáveis:**
- Home simplificado funcionando
- Diagnóstico com presença da LYA
- Textos revisados nos blocos principais

**Critério de Sucesso:**
- Dashboard mostra apenas 2 blocos nos primeiros dias
- Diagnóstico tem mensagens da LYA em cada seção
- Nenhum texto técnico visível

---

### **SPRINT 2: JORNADA E NAVEGAÇÃO (Semana 3-4)** 🥈

**Objetivo:** Integrar LYA na jornada e ajustar navegação

**Tarefas:**
1. ✅ Criar `LyaDayIntroduction`
2. ✅ Criar `LyaDayCompletion`
3. ✅ Integrar LYA na jornada (cada dia)
4. ✅ Revisar sidebar e garantir progressão correta
5. ✅ Revisar textos da jornada
6. ✅ Adicionar notificações quando seções são desbloqueadas

**Entregáveis:**
- Jornada com presença ativa da LYA
- Sidebar progressivo funcionando corretamente
- Celebrações após conclusão de dias

**Critério de Sucesso:**
- Cada dia da jornada tem introdução da LYA
- Celebração após conclusão
- Sidebar revela progressivamente

---

### **SPRINT 3: ÁREA DE CLIENTES (Semana 5-6)** 🥈

**Objetivo:** Integrar área de clientes sem competir com jornada

**Tarefas:**
1. ✅ Adicionar pergunta sobre clientes no onboarding
2. ✅ Criar fluxo de importação/cadastro simplificado
3. ✅ Revisar textos da área de clientes
4. ✅ Adicionar mensagens da LYA contextualmente
5. ✅ Integrar com jornada (LYA orquestra ambas)

**Entregáveis:**
- Onboarding pergunta sobre clientes
- Fluxo de cadastro/importação funcionando
- Área de clientes integrada com jornada

**Critério de Sucesso:**
- Nutri pode trazer clientes sem conflito
- LYA orienta sobre clientes quando relevante
- Não compete com jornada

---

### **SPRINT 4: REFINAMENTO (Semana 7-8)** 🥉

**Objetivo:** Revisar páginas restantes e ajustes finos

**Tarefas:**
1. ✅ Revisar página de configurações
2. ✅ Revisar página GSAL completa
3. ✅ Revisar página de ferramentas
4. ✅ Revisar página de cursos
5. ✅ Revisar página de anotações
6. ✅ Ajustes finos de linguagem em toda plataforma

**Entregáveis:**
- Todas as páginas revisadas
- Linguagem consistente em toda plataforma
- LYA presente onde faz sentido

**Critério de Sucesso:**
- Nenhum texto técnico em nenhuma página
- LYA presente em momentos-chave
- Experiência coesa e guiada

---

## 📝 CHECKLIST GERAL DE REVISÃO

Para **CADA** página/componente, verificar:

### **Linguagem:**
- [ ] Remove termos técnicos ("sistema", "funcionalidade", "recursos")
- [ ] Remove termos de coach ("insights", "transformação profissional")
- [ ] Remove explicações de sistema ("Você pode...", "Esta área permite...")
- [ ] Usa linguagem do dia a dia da nutri
- [ ] Textos convidam à ação, não explicam

### **Presença da LYA:**
- [ ] LYA aparece em momentos-chave?
- [ ] Mensagens da LYA seguem regras de linguagem?
- [ ] LYA explica "porquê" de forma simples?
- [ ] LYA celebra conquistas?

### **Revelação Progressiva:**
- [ ] Conteúdo aparece quando faz sentido?
- [ ] Não sobrecarrega usuário no início?
- [ ] LYA anuncia quando coisas novas aparecem?

### **Área de Clientes:**
- [ ] Integrada sem competir com jornada?
- [ ] Pergunta sobre clientes no onboarding?
- [ ] Fluxo de cadastro/importação simples?

---

## 🎯 MÉTRICAS DE SUCESSO

### **KPIs Principais:**

1. **Taxa de Conclusão do Dia 1**
   - Meta: > 70%
   - Medir antes e depois

2. **Dias Consecutivos Ativos**
   - Meta: Média de 5+ dias consecutivos
   - Medir engajamento

3. **Taxa de Abandono (Primeiros 7 Dias)**
   - Meta: < 20%
   - Medir retenção

4. **Uso de Ferramentas Relevantes**
   - Meta: Usuário usa ferramentas sugeridas pela LYA
   - Medir aderência às sugestões

5. **Satisfação com Direcionamento**
   - Pesquisa: "A LYA te ajudou a saber o que fazer?"
   - Meta: > 80% "Sim"

---

## 📋 COMPONENTES A CRIAR

### **Novos Componentes Necessários:**

1. **`LyaDiagnosticSection`**
   - Mensagens da LYA em cada seção do diagnóstico
   - Explica "porquê" de forma simples

2. **`LyaDiagnosticCompletion`**
   - Tela de celebração após diagnóstico
   - Mensagem personalizada da LYA
   - Próximos passos claros

3. **`LyaDayIntroduction`**
   - Apresentação do dia pela LYA
   - Contexto personalizado baseado no diagnóstico

4. **`LyaDayCompletion`**
   - Celebração após conclusão do dia
   - Explicação do próximo passo

5. **`LyaBlockIntroduction`**
   - Quando novo bloco aparece no home
   - LYA explica por que agora e como usar

6. **`LyaContextualMessage`**
   - Mensagens da LYA em contextos específicos
   - Reutilizável em vários lugares

---

## 🚀 PRÓXIMOS PASSOS IMEDIATOS

1. ✅ **Revisar este roadmap** e ajustar prioridades se necessário
2. ✅ **Começar Sprint 1** - Revisar textos críticos do Home
3. ✅ **Criar componentes da LYA** conforme necessidade
4. ✅ **Testar cada mudança** antes de seguir para próxima
5. ✅ **Medir impacto** após cada sprint

---

## 📝 NOTAS IMPORTANTES

- **Não fazer tudo de uma vez** - Implementar por sprints
- **Testar cada mudança** - Garantir que funciona antes de seguir
- **Manter consistência** - Aplicar mesmas regras em todos os lugares
- **Medir impacto** - Verificar se mudanças estão funcionando
- **Iterar** - Ajustar baseado em feedback e métricas

---

**Roadmap criado para guiar toda a transformação.**
**Ajustar conforme necessário durante execução.**
