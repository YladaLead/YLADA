# ✅ PLANO DE EXECUÇÃO: AJUSTES PARA LYA CONDUZINDO

## 🎯 OBJETIVO

Transformar completamente o YLADA Nutri para que a LYA conduza o usuário em cada etapa, com linguagem simples e revelação progressiva.

---

## 📅 CRONOGRAMA SUGERIDO (8 Semanas)

### **SPRINT 1: FUNDAÇÃO** (Semana 1-2) 🥇

**Foco:** Textos críticos e simplificação do dashboard

#### **Tarefas:**

**Dia 1-2: Revisão de Textos do Home**
- [ ] `JornadaBlock.tsx` - Revisar textos
- [ ] `PilaresBlock.tsx` - Revisar textos
- [ ] `FerramentasBlock.tsx` - Revisar textos
- [ ] `GSALBlock.tsx` - Revisar textos
- [ ] `BibliotecaBlock.tsx` - Revisar textos
- [ ] `AnotacoesBlock.tsx` - Revisar textos

**Dia 3-4: Simplificação do Dashboard**
- [ ] Ajustar lógica de revelação progressiva em `home/page.tsx`
- [ ] Dias 1-7: Apenas WelcomeCard + LyaAnaliseHoje
- [ ] Dias 8-14: Adicionar JornadaBlock + FerramentasBlock (filtrado)
- [ ] Dias 15+: Adicionar GSALBlock (quando relevante)
- [ ] Dias 21+: Adicionar PilaresBlock + BibliotecaBlock

**Dia 5-7: Diagnóstico com LYA**
- [ ] Criar componente `LyaDiagnosticSection`
- [ ] Adicionar mensagens da LYA em cada seção
- [ ] Criar componente `LyaDiagnosticCompletion`
- [ ] Tela de celebração após diagnóstico
- [ ] Revisar textos do formulário de diagnóstico

**Dia 8-10: Testes e Ajustes**
- [ ] Testar fluxo completo
- [ ] Ajustar textos baseado em feedback
- [ ] Verificar linguagem em todos os lugares

**Entregáveis Sprint 1:**
- ✅ Dashboard simplificado funcionando
- ✅ Diagnóstico com presença da LYA
- ✅ Textos revisados nos blocos principais
- ✅ Nenhum texto técnico visível

---

### **SPRINT 2: JORNADA E NAVEGAÇÃO** (Semana 3-4) 🥈

**Foco:** Integrar LYA na jornada e ajustar navegação

#### **Tarefas:**

**Dia 1-3: Componentes da LYA para Jornada**
- [ ] Criar `LyaDayIntroduction` - Apresentação do dia
- [ ] Criar `LyaDayCompletion` - Celebração após conclusão
- [ ] Criar `LyaContextualMessage` - Mensagens reutilizáveis

**Dia 4-6: Integração na Jornada**
- [ ] Adicionar `LyaDayIntroduction` em cada dia
- [ ] Integrar `LyaChatWidget` com contexto do dia
- [ ] Adicionar `LyaDayCompletion` após conclusão
- [ ] Revisar textos da página de jornada
- [ ] Revisar textos de `AcaoPraticaCard`

**Dia 7-8: Sidebar Progressivo**
- [ ] Verificar lógica em `sidebar-phases.ts`
- [ ] Garantir que fases estão corretas
- [ ] Adicionar notificações quando seções são desbloqueadas
- [ ] Revisar textos do sidebar

**Dia 9-10: Testes e Ajustes**
- [ ] Testar jornada completa
- [ ] Verificar sidebar progressivo
- [ ] Ajustar baseado em feedback

**Entregáveis Sprint 2:**
- ✅ Jornada com presença ativa da LYA
- ✅ Sidebar progressivo funcionando
- ✅ Celebrações após conclusão de dias
- ✅ Notificações quando seções são desbloqueadas

---

### **SPRINT 3: ÁREA DE CLIENTES** (Semana 5-6) 🥈

**Foco:** Integrar área de clientes sem competir com jornada

#### **Tarefas:**

**Dia 1-2: Onboarding com Pergunta sobre Clientes**
- [ ] Adicionar pergunta no onboarding: "Você já atende clientes hoje?"
- [ ] Criar fluxo baseado na resposta
- [ ] Mensagem da LYA adaptada à resposta

**Dia 3-5: Fluxo de Cadastro/Importação**
- [ ] Criar componente de importação simplificado
- [ ] Opções: Manual, CSV, Link de convite
- [ ] Mensagens da LYA durante processo
- [ ] Revisar textos da área de clientes

**Dia 6-7: Integração com Jornada**
- [ ] LYA orquestra jornada + clientes
- [ ] Mensagens contextuais quando tem clientes
- [ ] Sugestões da LYA baseadas em status de clientes

**Dia 8-10: Revisão Completa**
- [ ] Revisar página de lista de clientes
- [ ] Revisar página de cliente individual
- [ ] Revisar Kanban de clientes
- [ ] Adicionar mensagens da LYA onde faz sentido

**Entregáveis Sprint 3:**
- ✅ Onboarding pergunta sobre clientes
- ✅ Fluxo de cadastro/importação funcionando
- ✅ Área de clientes integrada com jornada
- ✅ LYA orienta sobre clientes quando relevante

---

### **SPRINT 4: REFINAMENTO** (Semana 7-8) 🥉

**Foco:** Revisar páginas restantes e ajustes finos

#### **Tarefas:**

**Dia 1-2: Páginas Principais**
- [ ] Revisar `configuracao/page.tsx`
- [ ] Revisar `gsal/page.tsx` (página completa)
- [ ] Revisar `anotacoes/page.tsx`
- [ ] Adicionar mensagens da LYA onde faz sentido

**Dia 3-4: Páginas Secundárias**
- [ ] Revisar `cursos/page.tsx`
- [ ] Revisar `ferramentas/page.tsx` (se existir)
- [ ] Revisar `leads/page.tsx`
- [ ] Revisar `formularios/page.tsx`

**Dia 5-6: Páginas de Método**
- [ ] Revisar `metodo/jornada/page.tsx` (lista)
- [ ] Revisar `metodo/manual/page.tsx`
- [ ] Revisar `metodo/pilares/page.tsx`

**Dia 7-8: Ajustes Finais**
- [ ] Revisar TODOS os textos uma última vez
- [ ] Garantir consistência de linguagem
- [ ] Verificar que LYA está presente onde faz sentido
- [ ] Testes finais de fluxo completo

**Dia 9-10: Documentação e Deploy**
- [ ] Documentar mudanças
- [ ] Criar guia de microcopy oficial
- [ ] Preparar para deploy
- [ ] Monitorar métricas após deploy

**Entregáveis Sprint 4:**
- ✅ Todas as páginas revisadas
- ✅ Linguagem consistente em toda plataforma
- ✅ LYA presente em momentos-chave
- ✅ Experiência coesa e guiada

---

## 📋 CHECKLIST POR COMPONENTE

### **COMPONENTES DO HOME**

#### **JornadaBlock**
- [ ] Título: "Jornada de Transformação" → "Sua Jornada de 30 Dias"
- [ ] Subtítulo: Simplificar linguagem
- [ ] "Carregando progresso" → "Carregando..."
- [ ] Adicionar mensagem da LYA quando aparecer

#### **PilaresBlock**
- [ ] Título e subtítulo revisados
- [ ] Todas as descriptions reescritas
- [ ] Remover "captar leads" → "fazer clientes chegarem"
- [ ] Remover "sistema completo" → "organizar do início ao fim"
- [ ] Mostrar apenas pilares da fase atual

#### **FerramentasBlock**
- [ ] Dica reescrita (remover "Você pode criar apenas")
- [ ] "Acesse todas as suas ferramentas" → "Veja suas ferramentas"
- [ ] Filtrar por relevância do dia/estado
- [ ] Adicionar mensagem da LYA

#### **GSALBlock**
- [ ] Mensagem de bloqueio reescrita
- [ ] Dica sobre LYA simplificada
- [ ] "Resumo GSAL" → "Como está seu negócio hoje"
- [ ] Aparecer apenas quando LYA detecta necessidade

#### **BibliotecaBlock**
- [ ] Título e subtítulo revisados
- [ ] Descriptions reescritas
- [ ] Remover "uso do sistema" → "como usar"

#### **AnotacoesBlock**
- [ ] Subtítulo: "insights" → "o que você aprendeu"
- [ ] Placeholder reescrito
- [ ] Simplificar linguagem

---

### **PÁGINAS PRINCIPAIS**

#### **Onboarding**
- [ ] Revisar textos principais
- [ ] Enfatizar papel da LYA
- [ ] Adicionar pergunta sobre clientes
- [ ] Melhorar transição para diagnóstico

#### **Diagnóstico**
- [ ] Adicionar mensagens da LYA em cada seção
- [ ] Criar `LyaDiagnosticSection`
- [ ] Criar `LyaDiagnosticCompletion`
- [ ] Revisar todos os labels do formulário
- [ ] Tela de celebração após conclusão

#### **Home**
- [ ] Simplificar dashboard (Dias 1-7)
- [ ] Lógica de revelação progressiva
- [ ] Remover vídeo ou torná-lo secundário

#### **Jornada (Lista)**
- [ ] Revisar textos introdutórios
- [ ] Adicionar mensagem da LYA

#### **Jornada (Dia)**
- [ ] Adicionar `LyaDayIntroduction`
- [ ] Integrar `LyaChatWidget` com contexto
- [ ] Adicionar `LyaDayCompletion`
- [ ] Revisar todos os textos

#### **Clientes (Lista)**
- [ ] Revisar textos
- [ ] Adicionar mensagens da LYA
- [ ] Integrar com jornada

#### **Clientes (Individual)**
- [ ] Revisar textos
- [ ] Adicionar sugestões da LYA
- [ ] Integrar com jornada

#### **GSAL**
- [ ] Revisar TODOS os textos
- [ ] Adicionar mensagens da LYA
- [ ] Explicar cada etapa em linguagem simples

#### **Configurações**
- [ ] Revisar textos
- [ ] Adicionar mensagens da LYA
- [ ] Simplificar linguagem

---

## 🎯 PRIORIZAÇÃO RÁPIDA

### **FAZER AGORA (Esta Semana)**
1. ✅ Revisar textos dos blocos do Home
2. ✅ Simplificar dashboard (Dias 1-7)
3. ✅ Criar componentes da LYA para diagnóstico

### **FAZER DEPOIS (Próximas 2 Semanas)**
4. ✅ Integrar LYA na jornada
5. ✅ Ajustar sidebar progressivo
6. ✅ Área de clientes integrada

### **FAZER POR ÚLTIMO (Semanas Finais)**
7. ✅ Revisar páginas secundárias
8. ✅ Ajustes finos de linguagem
9. ✅ Testes e métricas

---

## 📝 REGRAS DE REVISÃO (Aplicar em TODOS)

### **Linguagem:**
- ❌ Remove: "Você pode...", "Esta área permite...", "Acesse..."
- ✅ Usa: "Vamos...", "Veja...", "Faça..."
- ❌ Remove: termos técnicos ("sistema", "funcionalidade", "recursos")
- ✅ Usa: linguagem do dia a dia da nutri
- ❌ Remove: termos de coach ("insights", "transformação profissional")
- ✅ Usa: palavras simples e diretas

### **Presença da LYA:**
- ✅ LYA aparece em momentos-chave?
- ✅ Mensagens seguem regras de linguagem?
- ✅ LYA explica "porquê" de forma simples?
- ✅ LYA celebra conquistas?

### **Revelação Progressiva:**
- ✅ Conteúdo aparece quando faz sentido?
- ✅ Não sobrecarrega no início?
- ✅ LYA anuncia quando coisas novas aparecem?

---

## 🚀 COMEÇAR AGORA

**Primeira Tarefa Imediata:**

1. Abrir `src/components/nutri/home/JornadaBlock.tsx`
2. Revisar textos conforme checklist acima
3. Aplicar mudanças
4. Testar
5. Seguir para próximo componente

**Próximos Passos:**
- Ver `docs/REVISAO-TEXTOS-INTERFACE-NUTRI.md` para textos específicos
- Ver `docs/ROADMAP-AJUSTES-LYA-CONDUZINDO.md` para visão completa

---

**Plano criado para execução prática.**
**Começar pelo Sprint 1 e seguir sequencialmente.**
