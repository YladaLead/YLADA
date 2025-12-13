# 📊 ANÁLISE: Fluxo de Onboarding da Nutri

**Data:** Hoje  
**Objetivo:** Analisar o fluxo proposto pelo ChatGPT e comparar com implementação atual  
**Status:** Análise completa + Plano de ação

---

## 🎯 FLUXO PROPOSTO (ChatGPT)

### **Ordem Ideal:**
1. **Landing Inicial** → "Começar agora" (simples, sem opções)
2. **Perfil Profissional** → Dados básicos (obrigatório)
3. **Diagnóstico Estratégico** → Formulário completo (obrigatório)
4. **Primeira Análise da LYA** → Após diagnóstico
5. **Dia 1 da Jornada** → Primeira ação obrigatória
6. **Dashboard Principal** → Uso diário com acesso direto à LYA

### **Regras de Acesso:**
- ✅ Até completar Dia 1: LYA apenas em modo direcionado (análise diária)
- ✅ Após Dia 1: Chat livre liberado (mas sempre estruturado)

---

## ✅ O QUE JÁ ESTÁ IMPLEMENTADO

### **1. Controle de Acesso**
- ✅ `RequireDiagnostico` - Redireciona para `/pt/nutri/diagnostico` se não completou
- ✅ Página de diagnóstico funcional em `/pt/nutri/diagnostico`
- ✅ Flag `diagnostico_completo` no `user_profiles`

### **2. Home Page**
- ✅ `/pt/nutri/home` com vários blocos:
  - Vídeo de boas-vindas
  - LyaAnaliseHoje (análise diária)
  - JornadaBlock
  - PilaresBlock
  - FerramentasBlock
  - GSALBlock
  - BibliotecaBlock
  - AnotacoesBlock
- ✅ `NutriChatWidget` (chat widget flutuante)

### **3. LYA**
- ✅ API `/api/nutri/lya/analise` funcional
- ✅ Componente `LyaAnaliseHoje` na home
- ✅ RAG implementado (busca estado + memória + conhecimento)
- ✅ Formato fixo de resposta

### **4. Jornada 30 Dias**
- ✅ Páginas `/pt/nutri/metodo/jornada/dia/[numero]`
- ✅ Sistema de progresso (tabela `journey_progress`)

---

## ❌ O QUE FALTA IMPLEMENTAR

### **1. Landing Inicial Simples** 🔴 PRIORIDADE ALTA
**Problema:** Atualmente, após login, vai direto para `/pt/nutri/home` (muitas opções)

**Solução:**
- Criar página `/pt/nutri/onboarding` ou `/pt/nutri/welcome`
- Tela simples com:
  - Título: "Vamos organizar seu negócio de Nutrição em 30 dias"
  - Botão único: "Começar agora"
  - Redireciona para perfil/diagnóstico

**Arquivo:** `src/app/pt/nutri/onboarding/page.tsx` (NOVO)

---

### **2. Verificação de Dia 1 Completado** 🔴 PRIORIDADE ALTA
**Problema:** Não há verificação se completou Dia 1 antes de liberar chat livre

**Solução:**
- Criar componente `RequireDia1Completo` (similar ao `RequireDiagnostico`)
- Verificar na tabela `journey_progress` se `day_number >= 1`
- Se não completou: mostrar apenas análise diária (sem chat livre)
- Se completou: liberar botão "Falar com a LYA"

**Arquivo:** `src/components/auth/RequireDia1Completo.tsx` (NOVO)

---

### **3. Botão "Falar com a LYA" Fixo** 🟡 PRIORIDADE MÉDIA
**Problema:** Chat widget existe, mas não há botão dedicado para LYA

**Solução:**
- Adicionar botão fixo "Falar com a LYA" no dashboard/home
- Só aparece após completar Dia 1
- Abre modal/chat dedicado à LYA (não o chat genérico)

**Arquivo:** `src/components/nutri/LyaChatButton.tsx` (NOVO)

---

### **4. Chat Livre Estruturado da LYA** 🟡 PRIORIDADE MÉDIA
**Problema:** Atualmente só tem análise diária, não há chat livre

**Solução:**
- Criar componente `LyaChatModal` ou `LyaChatPage`
- Sempre injeta contexto (perfil, diagnóstico, estado, memória, GSAL)
- Resposta sempre no formato fixo (mesmo em chat livre)
- Proteções: máximo de mensagens, timeout, etc.

**Arquivo:** `src/components/nutri/LyaChatModal.tsx` (NOVO)

---

### **5. Fluxo de Redirecionamento Inteligente** 🟢 PRIORIDADE BAIXA
**Problema:** Redirecionamento atual não considera onboarding

**Solução:**
- Atualizar `AutoRedirect` ou criar `NutriOnboardingRedirect`
- Lógica:
  - Se não tem diagnóstico → `/pt/nutri/diagnostico`
  - Se tem diagnóstico mas não completou Dia 1 → `/pt/nutri/metodo/jornada/dia/1`
  - Se completou Dia 1 → `/pt/nutri/home`

**Arquivo:** `src/components/nutri/NutriOnboardingRedirect.tsx` (NOVO)

---

## 🧪 O QUE PRECISA SER TESTADO

### **1. Fluxo Completo de Onboarding**
- [ ] Login → Landing inicial
- [ ] Landing → Perfil (se não tem)
- [ ] Perfil → Diagnóstico (se não tem)
- [ ] Diagnóstico → Primeira análise LYA
- [ ] Análise LYA → Dia 1
- [ ] Dia 1 → Dashboard com chat livre

### **2. Controle de Acesso**
- [ ] Sem diagnóstico: bloqueia acesso à home
- [ ] Com diagnóstico, sem Dia 1: mostra apenas análise diária
- [ ] Com Dia 1: libera chat livre

### **3. LYA**
- [ ] Análise diária funciona
- [ ] Chat livre funciona (após Dia 1)
- [ ] Formato fixo de resposta mantido
- [ ] RAG funcionando (busca contexto correto)

### **4. Performance**
- [ ] Sem loops infinitos
- [ ] Carregamento rápido
- [ ] Sem erros no console

---

## 📋 PLANO DE AÇÃO (ORDEM DE IMPLEMENTAÇÃO)

### **FASE 1: Onboarding Básico** (1-2 horas)
1. ✅ Criar página `/pt/nutri/onboarding` (landing inicial)
2. ✅ Atualizar redirecionamento após login
3. ✅ Testar fluxo: login → onboarding → diagnóstico

### **FASE 2: Controle de Dia 1** (1-2 horas)
1. ✅ Criar `RequireDia1Completo`
2. ✅ Verificar progresso na Jornada
3. ✅ Bloquear chat livre até completar Dia 1
4. ✅ Testar: com/sem Dia 1

### **FASE 3: Chat Livre da LYA** (2-3 horas)
1. ✅ Criar `LyaChatModal`
2. ✅ Integrar com API `/api/nutri/lya/analise`
3. ✅ Adicionar botão "Falar com a LYA" (após Dia 1)
4. ✅ Testar chat livre

### **FASE 4: Refinamentos** (1 hora)
1. ✅ Melhorar UX do onboarding
2. ✅ Adicionar animações/transições
3. ✅ Testes finais

---

## 🎯 PRÓXIMOS PASSOS IMEDIATOS

1. **Criar landing inicial** (`/pt/nutri/onboarding`)
2. **Criar verificação de Dia 1** (`RequireDia1Completo`)
3. **Testar fluxo completo** (com conta demo)
4. **Ajustar redirecionamentos** conforme necessário

---

## 📝 NOTAS IMPORTANTES

- **Não quebrar o que já funciona:** Manter `RequireDiagnostico` e `LyaAnaliseHoje`
- **Proteção de custo:** Chat livre sempre estruturado (formato fixo)
- **UX clara:** Sempre mostrar próximo passo óbvio
- **Testes:** Usar conta `demo.nutri@ylada.com` para testar

---

**Status:** ✅ Análise completa  
**Próxima ação:** Implementar FASE 1 (Landing inicial)

