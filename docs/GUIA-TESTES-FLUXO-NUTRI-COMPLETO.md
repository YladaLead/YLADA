# 🧪 GUIA DE TESTES: Fluxo Completo Nutri - Localhost

**Data:** Hoje  
**Objetivo:** Testar todo o fluxo implementado conforme proposta do ChatGPT  
**Status:** ✅ Guia completo de testes

---

## 🚀 PREPARAÇÃO

### **1. Verificar Servidor**
```bash
# O servidor já deve estar rodando em background
# Se não estiver, execute:
cd /Users/air/ylada-app
npm run dev
```

**URL:** `http://localhost:3000`

---

## 📋 CHECKLIST DE TESTES

### **TESTE 1: Onboarding Inicial** ✅

#### **Cenário:** Usuário novo sem diagnóstico

**Passos:**
1. Acessar `http://localhost:3000/pt/nutri/login`
2. Fazer login com conta que **NÃO tem diagnóstico completo**
3. **Esperado:** Redirecionar para `/pt/nutri/onboarding`

**O que verificar:**
- [ ] Tela de onboarding aparece
- [ ] Mensagem da LYA está visível
- [ ] Botão "Começar meu Diagnóstico Estratégico" está presente
- [ ] Design está limpo e focado
- [ ] Não há menus ou distrações

**Resultado esperado:**
```
✅ Redireciona para /pt/nutri/onboarding
✅ Tela minimalista com 1 CTA
✅ Mensagem da LYA clara
```

---

### **TESTE 2: Diagnóstico Estratégico** ✅

#### **Cenário:** Completar diagnóstico

**Passos:**
1. Na tela de onboarding, clicar em "Começar meu Diagnóstico Estratégico"
2. **Esperado:** Redirecionar para `/pt/nutri/diagnostico`
3. Preencher todos os campos do formulário
4. Clicar em "Salvar Perfil Nutri-Empresária"
5. **Esperado:** Redirecionar para `/pt/nutri/home`

**O que verificar:**
- [ ] Formulário carrega corretamente
- [ ] Todos os campos obrigatórios funcionam
- [ ] Validação funciona (não deixa enviar incompleto)
- [ ] Após salvar, redireciona para home
- [ ] Análise da LYA é gerada automaticamente

**Resultado esperado:**
```
✅ Formulário completo e funcional
✅ Redireciona para home após salvar
✅ Análise LYA aparece na home
```

---

### **TESTE 3: Dashboard Simplificado (Dia 1)** ✅

#### **Cenário:** Primeira vez na home (sem jornada iniciada)

**Passos:**
1. Após completar diagnóstico, estar em `/pt/nutri/home`
2. **Esperado:** Ver apenas WelcomeCard + Análise LYA

**O que verificar:**
- [ ] WelcomeCard aparece (grande, destacado, azul)
- [ ] Badge "LYA - Sua Mentora" visível
- [ ] Mensagem: "Seu plano de ação para hoje"
- [ ] Botão: "👉 Iniciar Dia 1" ou "👉 Executar Dia 1 com a LYA"
- [ ] Análise da LYA aparece abaixo
- [ ] **NÃO aparecem:** JornadaBlock, PilaresBlock, FerramentasBlock, GSALBlock, etc.
- [ ] Chat widget **NÃO aparece** (bloqueado até Dia 1)

**Resultado esperado:**
```
✅ Dashboard simplificado (apenas WelcomeCard + LYA)
✅ Nenhum outro bloco visível
✅ Chat widget bloqueado
```

---

### **TESTE 4: Sidebar Progressivo (Fase 1)** ✅

#### **Cenário:** Verificar sidebar nos primeiros dias

**Passos:**
1. Na home, verificar sidebar esquerdo
2. **Esperado:** Ver apenas itens da Fase 1

**O que verificar:**
- [ ] **Itens disponíveis:**
  - [ ] Home ✅
  - [ ] Jornada 30 Dias ✅
  - [ ] Perfil Nutri-Empresária ✅
  - [ ] Configurações ✅
- [ ] **Itens bloqueados (com 🔒):**
  - [ ] Pilares do Método 🔒
  - [ ] Ferramentas 🔒
  - [ ] Gestão GSAL 🔒
  - [ ] Biblioteca 🔒
  - [ ] Minhas Anotações 🔒
- [ ] Indicador de fase no topo: "Fase atual: Fundamentos"
- [ ] Tooltips aparecem ao passar mouse nos itens

**Resultado esperado:**
```
✅ Apenas 4 itens disponíveis
✅ Itens bloqueados aparecem com 🔒
✅ Indicador de fase visível
✅ Tooltips funcionam
```

---

### **TESTE 5: Dia 1 da Jornada** ✅

#### **Cenário:** Completar Dia 1

**Passos:**
1. Na home, clicar no botão do WelcomeCard: "👉 Iniciar Dia 1"
2. **Esperado:** Redirecionar para `/pt/nutri/metodo/jornada/dia/1`
3. Completar todas as tarefas do Dia 1
4. Marcar Dia 1 como concluído
5. Voltar para home

**O que verificar:**
- [ ] Página do Dia 1 carrega corretamente
- [ ] Tarefas do Dia 1 estão claras
- [ ] É possível marcar como concluído
- [ ] Após concluir, volta para home
- [ ] WelcomeCard muda a mensagem (se ainda estiver visível)

**Resultado esperado:**
```
✅ Dia 1 completo
✅ Progresso salvo
✅ Home atualiza
```

---

### **TESTE 6: Chat Livre Liberado (Após Dia 1)** ✅

#### **Cenário:** Verificar chat após completar Dia 1

**Passos:**
1. Após completar Dia 1, voltar para home
2. **Esperado:** Chat widget aparece

**O que verificar:**
- [ ] Chat widget flutuante aparece (canto inferior direito)
- [ ] Botão "Mentora LYA" visível
- [ ] Ao clicar, abre chat
- [ ] É possível enviar mensagens
- [ ] LYA responde no formato fixo (4 blocos)

**Resultado esperado:**
```
✅ Chat widget visível
✅ Chat funciona
✅ LYA responde corretamente
```

---

### **TESTE 7: Sidebar Progressivo (Fase 2)** ✅

#### **Cenário:** Avançar para Fase 2 (Dia 8-15)

**Passos:**
1. Completar dias até chegar no Dia 8
2. **Esperado:** Sidebar libera novos itens

**O que verificar:**
- [ ] **Itens da Fase 1 continuam:**
  - [ ] Home ✅
  - [ ] Jornada 30 Dias ✅
  - [ ] Perfil Nutri-Empresária ✅
  - [ ] Configurações ✅
- [ ] **Novos itens liberados:**
  - [ ] Ferramentas ✅ (sem 🔒)
  - [ ] Pilares do Método ✅ (sem 🔒)
- [ ] **Itens ainda bloqueados:**
  - [ ] Gestão GSAL 🔒
  - [ ] Biblioteca 🔒
  - [ ] Minhas Anotações 🔒
- [ ] Indicador de fase: "Nova fase liberada: Captação & Posicionamento"

**Resultado esperado:**
```
✅ Fase 2 liberada
✅ Ferramentas e Pilares disponíveis
✅ GSAL, Biblioteca, Anotações ainda bloqueados
```

---

### **TESTE 8: Sidebar Progressivo (Fase 3)** ✅

#### **Cenário:** Avançar para Fase 3 (Dia 16-30)

**Passos:**
1. Completar dias até chegar no Dia 16
2. **Esperado:** Sidebar libera todos os itens

**O que verificar:**
- [ ] **Todos os itens disponíveis:**
  - [ ] Home ✅
  - [ ] Jornada 30 Dias ✅
  - [ ] Pilares do Método ✅
  - [ ] Ferramentas ✅
  - [ ] Gestão GSAL ✅ (liberado)
  - [ ] Biblioteca ✅ (liberado)
  - [ ] Minhas Anotações ✅ (liberado)
  - [ ] Perfil Nutri-Empresária ✅
  - [ ] Configurações ✅
- [ ] Indicador de fase: "Você entrou na fase de Gestão & Escala"
- [ ] Nenhum item com 🔒

**Resultado esperado:**
```
✅ Todos os itens liberados
✅ Nenhum bloqueio
✅ Indicador mostra Fase 3
```

---

### **TESTE 9: Dashboard Completo (Dia 2+)** ✅

#### **Cenário:** Verificar home após Dia 1

**Passos:**
1. Após completar Dia 1, acessar home
2. **Esperado:** Ver todos os blocos

**O que verificar:**
- [ ] WelcomeCard **NÃO aparece** (apenas nos primeiros dias)
- [ ] **Todos os blocos aparecem:**
  - [ ] Vídeo (se disponível)
  - [ ] Análise da LYA
  - [ ] JornadaBlock
  - [ ] PilaresBlock
  - [ ] FerramentasBlock
  - [ ] GSALBlock
  - [ ] BibliotecaBlock
  - [ ] AnotacoesBlock

**Resultado esperado:**
```
✅ Dashboard completo
✅ WelcomeCard não aparece
✅ Todos os blocos visíveis
```

---

### **TESTE 10: LYA - Tom por Fase** ✅

#### **Cenário:** Verificar tom da LYA conforme fase

**Passos:**
1. Testar análise LYA na Fase 1 (Dia 1-7)
2. Testar análise LYA na Fase 2 (Dia 8-15)
3. Testar análise LYA na Fase 3 (Dia 16-30)

**O que verificar:**
- [ ] **Fase 1:** Tom calmo, foco em fundamentos
- [ ] **Fase 2:** Tom mais direto, foco em captação
- [ ] **Fase 3:** Tom estratégico, foco em gestão
- [ ] Formato fixo de resposta mantido (4 blocos)
- [ ] Regras da fase sendo aplicadas

**Resultado esperado:**
```
✅ Tom adapta conforme fase
✅ Formato fixo mantido
✅ Regras aplicadas corretamente
```

---

## 🔧 COMO CRIAR/RESETAR CONTAS DE TESTE

### **Opção 1: Usar Conta Existente**
1. Acessar `/pt/nutri/login`
2. Fazer login com conta que já existe
3. Se tiver diagnóstico, usar scripts SQL abaixo para resetar

### **Opção 2: Criar Nova Conta**
1. Acessar `/pt/nutri/login`
2. Clicar em "Criar conta"
3. Preencher dados
4. Confirmar email (se necessário)
5. Fazer login

### **Opção 3: Scripts SQL para Resetar (RECOMENDADO)** ✅

#### **A. Resetar Apenas Diagnóstico**
**Arquivo:** `scripts/reset-diagnostico-teste.sql`

**Como usar:**
1. Abrir Supabase SQL Editor
2. Abrir arquivo `scripts/reset-diagnostico-teste.sql`
3. Substituir `'seu-email@exemplo.com'` pelo email de teste
4. Executar script
5. **Resultado:** Usuário volta para onboarding

#### **B. Resetar Apenas Jornada**
**Arquivo:** `scripts/reset-jornada-teste.sql`

**Como usar:**
1. Abrir Supabase SQL Editor
2. Abrir arquivo `scripts/reset-jornada-teste.sql`
3. Substituir `'seu-email@exemplo.com'` pelo email de teste
4. Para avançar para fase específica, descomentar seção e ajustar `v_day_number`
5. Executar script
6. **Resultado:** Jornada resetada ou avançada para fase desejada

#### **C. Reset Completo (Tudo)**
**Arquivo:** `scripts/reset-completo-teste.sql`

**Como usar:**
1. Abrir Supabase SQL Editor
2. Abrir arquivo `scripts/reset-completo-teste.sql`
3. Substituir `'seu-email@exemplo.com'` pelo email de teste
4. Executar script
5. **Resultado:** Usuário volta ao estado inicial (sem diagnóstico, sem jornada)

**⚠️ ATENÇÃO:** Scripts usam variável `\set email`. Se seu SQL Editor não suportar, substitua manualmente `:'email'` pelo email entre aspas.

---

## 🎯 CENÁRIOS DE TESTE RÁPIDO

### **Cenário A: Usuário Novo Completo**
1. Login → Onboarding → Diagnóstico → Home (WelcomeCard) → Dia 1 → Chat liberado

### **Cenário B: Usuário com Diagnóstico, sem Dia 1**
1. Login → Home (WelcomeCard) → Dia 1 → Chat liberado

### **Cenário C: Usuário Fase 2**
1. Login → Home (completo) → Sidebar Fase 2 → Ferramentas liberadas

### **Cenário D: Usuário Fase 3**
1. Login → Home (completo) → Sidebar Fase 3 → Tudo liberado

---

## 🐛 PROBLEMAS COMUNS E SOLUÇÕES

### **Problema 1: Onboarding não aparece**
**Solução:**
- Verificar se `diagnostico_completo = false` no `user_profiles`
- Verificar redirecionamento no `RequireDiagnostico`

### **Problema 2: WelcomeCard não aparece**
**Solução:**
- Verificar se `current_day === null` ou `current_day <= 1`
- Verificar se `progress` está sendo carregado corretamente

### **Problema 3: Chat widget não aparece**
**Solução:**
- Verificar se Dia 1 foi completado (`current_day >= 2`)
- Verificar lógica em `home/page.tsx`

### **Problema 4: Sidebar mostra todos os itens**
**Solução:**
- Verificar se `current_day` está sendo calculado corretamente
- Verificar função `getCurrentPhase()` em `sidebar-phases.ts`

### **Problema 5: LYA não adapta tom**
**Solução:**
- Verificar se prompts estão sendo injetados no systemPrompt
- Verificar logs da API `/api/nutri/lya/analise`

---

## 📊 CHECKLIST FINAL

### **Fluxo Completo:**
- [ ] Onboarding aparece para usuário sem diagnóstico
- [ ] Diagnóstico completo redireciona para home
- [ ] WelcomeCard aparece nos primeiros dias
- [ ] Dashboard completo aparece após Dia 1
- [ ] Sidebar Fase 1 mostra apenas 4 itens
- [ ] Sidebar Fase 2 libera Ferramentas e Pilares
- [ ] Sidebar Fase 3 libera tudo
- [ ] Chat bloqueado até Dia 1
- [ ] Chat liberado após Dia 1
- [ ] LYA adapta tom por fase
- [ ] Tooltips funcionam no sidebar
- [ ] Indicador de fase aparece

---

## 🎬 ORDEM RECOMENDADA DE TESTES

### **TESTE RÁPIDO (15-20 min):**
1. **Reset completo** → Executar `scripts/reset-completo-teste.sql`
2. **Teste 1:** Onboarding (usuário novo)
3. **Teste 2:** Diagnóstico
4. **Teste 3:** Dashboard Simplificado
5. **Teste 4:** Sidebar Fase 1
6. **Teste 5:** Dia 1
7. **Teste 6:** Chat Livre

### **TESTE COMPLETO (30-40 min):**
1. **Reset completo** → Executar `scripts/reset-completo-teste.sql`
2. **Teste 1:** Onboarding (usuário novo)
3. **Teste 2:** Diagnóstico
4. **Teste 3:** Dashboard Simplificado
5. **Teste 4:** Sidebar Fase 1
6. **Teste 5:** Dia 1
7. **Teste 6:** Chat Livre
8. **Avançar para Fase 2** → Executar `scripts/reset-jornada-teste.sql` (ajustar para dia 8)
9. **Teste 7:** Sidebar Fase 2
10. **Avançar para Fase 3** → Executar `scripts/reset-jornada-teste.sql` (ajustar para dia 16)
11. **Teste 8:** Sidebar Fase 3
12. **Teste 9:** Dashboard Completo
13. **Teste 10:** LYA por Fase

---

**Status:** ✅ Guia completo  
**Próxima ação:** Seguir ordem de testes e validar cada etapa


