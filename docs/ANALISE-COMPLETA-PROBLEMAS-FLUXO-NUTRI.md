# 🔍 ANÁLISE COMPLETA - PROBLEMAS NO FLUXO NUTRI

## 🐛 **PROBLEMAS IDENTIFICADOS**

### **1. REDIRECIONAMENTO PARA PÁGINA DE CONFIGURAÇÕES** 🔴 CRÍTICO

**Sintoma:**
- Usuário `nutri1@ylada.com` é redirecionado para página de perfil/configurações (com nome e email)
- Não deveria aparecer essa página para usuário novo

**Causa:**
- `lastPage` pode estar salvando `/pt/nutri/configuracao` ou `/pt/nutri/home`
- `LoginForm` está usando `lastPage` ao invés de sempre verificar diagnóstico primeiro
- Redirecionamento não está ignorando páginas que não devem ser acessadas por usuário novo

---

### **2. REDIRECIONAMENTO PARA DASHBOARD/HOME** 🔴 CRÍTICO

**Sintoma:**
- Usuário cai na página `/pt/nutri/home` ao invés de `/pt/nutri/onboarding`
- Deveria ir direto para onboarding se não tem diagnóstico

**Causa:**
- `lastPage` pode estar sobrescrevendo o `baseRedirectPath` correto
- Lógica de `isValidRoute` pode estar permitindo rotas que não deveria

---

### **3. BOTÃO DE DIAGNÓSTICO NÃO FUNCIONA** 🟡 MÉDIO

**Sintoma:**
- Clica em "Começar Diagnóstico" mas não navega
- Ou navega mas volta para onboarding

**Causa:**
- Pode ser problema com `router.push` vs `router.replace`
- Ou verificação de referrer na página de diagnóstico está bloqueando

---

### **4. SIDEBAR MOSTRANDO TODAS AS ABAS** 🔴 CRÍTICO

**Sintoma:**
- Sidebar mostra todas as abas abertas
- Deveria mostrar apenas Home e Jornada 30 Dias no início

**Causa:**
- `currentDay` pode ser `null` ou `0`
- Quando `currentDay` é `null`, `getCurrentPhase` retorna fase 1
- Mas se não há progresso registrado, pode estar mostrando tudo
- Lógica de `isItemAvailable` pode não estar funcionando corretamente

---

## ✅ **CORREÇÕES NECESSÁRIAS**

### **1. Corrigir redirecionamento após login**

**Problema:** `lastPage` está sobrescrevendo o redirecionamento correto baseado em diagnóstico.

**Solução:**
- **SEMPRE** verificar diagnóstico primeiro
- **NUNCA** usar `lastPage` se for página de configurações, home, ou outras rotas protegidas para usuário sem diagnóstico
- **SEMPRE** redirecionar para onboarding se não tem diagnóstico, independente de `lastPage`

### **2. Corrigir sidebar progressivo**

**Problema:** Sidebar não está bloqueando itens corretamente.

**Solução:**
- Verificar se `currentDay` é `null` ou `0` → Mostrar apenas Home e Jornada
- Garantir que `isItemAvailable` funciona corretamente
- Adicionar fallback para quando não há progresso

### **3. Corrigir navegação do botão de diagnóstico**

**Problema:** Botão pode não estar funcionando.

**Solução:**
- Usar `router.push` ao invés de `router.replace` no botão
- Garantir que a verificação de referrer na página de diagnóstico não bloqueia

### **4. Excluir configurações do redirecionamento**

**Problema:** Usuário novo não deveria ir para configurações.

**Solução:**
- Adicionar `/configuracao` na lista de páginas excluídas do redirecionamento
- Se usuário sem diagnóstico tentar acessar configurações, redirecionar para onboarding

---

## 📋 **ARQUIVOS A MODIFICAR**

1. ✅ `src/components/auth/LoginForm.tsx` - Corrigir lógica de redirecionamento
2. ✅ `src/components/nutri/NutriSidebar.tsx` - Corrigir lógica progressiva
3. ✅ `src/app/pt/nutri/(protected)/onboarding/page.tsx` - Corrigir botão
4. ✅ `src/app/pt/nutri/(protected)/diagnostico/page.tsx` - Ajustar verificação

---

**Status:** 🔴 Problemas identificados - Correções necessárias
