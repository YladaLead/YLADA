# 🔍 Diagnóstico: Problema Login Nutri → Checkout

## ❌ **PROBLEMAS IDENTIFICADOS**

### **1. Redirecionamento Automático para `/checkout`**

**Sintoma:** Antes mesmo de digitar email/senha, a página já redireciona para `/pt/nutri/checkout`

**Causa Raiz:**
- O sistema salva a última página visitada no `localStorage`
- Se você visitou `/pt/nutri/checkout` antes, essa URL foi salva
- O `AutoRedirect` ou `LoginForm` está usando `getLastVisitedPage()` e redirecionando para essa URL
- **MAS:** A página `/pt/nutri/checkout` **NÃO EXISTE** (404)

**Arquivos Afetados:**
- `src/hooks/useLastVisitedPage.ts` - Salva última página
- `src/components/auth/LoginForm.tsx` - Usa `getLastVisitedPage()` no redirecionamento
- `src/components/auth/AutoRedirect.tsx` - Pode estar redirecionando baseado em última página

---

### **2. Página de Checkout Não Existe**

**Sintoma:** Ao acessar `/pt/nutri/checkout`, aparece erro 404

**Causa:**
- A página `src/app/pt/nutri/checkout/page.tsx` **NÃO EXISTE**
- A documentação (`docs/CHECKLIST-CHECKOUT-OUTRAS-AREAS.md`) confirma que precisa ser criada
- A API `/api/nutri/checkout` existe e funciona, mas a página frontend não existe

**Status:**
- ✅ API existe: `/api/[area]/checkout` (genérica, funciona para nutri)
- ❌ Página não existe: `src/app/pt/nutri/checkout/page.tsx`

---

### **3. Logo Genérico na Página 404**

**Sintoma:** Quando aparece 404, mostra logo genérico do YLADA, não o logo da área Nutri

**Causa:**
- A página `src/app/not-found.tsx` usa `<YLADALogo />` genérico
- Não detecta a área atual para mostrar logo específico

**Arquivo Afetado:**
- `src/app/not-found.tsx` - Usa logo genérico

---

## ✅ **CORREÇÕES JÁ APLICADAS**

### **1. Exclusão de `/checkout` do localStorage**
- ✅ `useLastVisitedPage.ts` - Não salva mais URLs com `/checkout`
- ✅ `LoginForm.tsx` - Não redireciona para `/checkout`
- ✅ `getLastVisitedPage()` - Limpa automaticamente URLs com `/checkout`

**Mas:** Se você já tinha `/checkout` salvo antes, precisa limpar manualmente.

---

## 🔧 **CORREÇÕES NECESSÁRIAS**

### **1. Criar Página de Checkout para Nutri**

**Arquivo a criar:**
```
src/app/pt/nutri/checkout/page.tsx
```

**Base:** Copiar de `src/app/pt/wellness/checkout/page.tsx`

**Ajustes necessários:**
- `perfil="wellness"` → `perfil="nutri"`
- `/api/wellness/checkout` → `/api/nutri/checkout`
- `/pt/wellness/login` → `/pt/nutri/login`
- `/pt/wellness/pagamento-sucesso` → `/pt/nutri/pagamento-sucesso`
- Logo: Usar logo da área Nutri

---

### **2. Melhorar Página 404 para Detectar Área**

**Arquivo a modificar:**
```
src/app/not-found.tsx
```

**Mudanças:**
- Detectar área atual pela URL (`/pt/nutri/...` → área `nutri`)
- Mostrar logo específico da área:
  - `/pt/nutri/...` → Logo Nutri
  - `/pt/coach/...` → Logo Coach
  - `/pt/wellness/...` → Logo Wellness
  - Outros → Logo YLADA genérico

---

### **3. Verificar AutoRedirect**

**Arquivo a verificar:**
```
src/components/auth/AutoRedirect.tsx
```

**Verificar:**
- Se está usando `getLastVisitedPage()` incorretamente
- Se está redirecionando antes do usuário fazer login
- Se está validando URLs antes de redirecionar

---

## 🧪 **TESTES NECESSÁRIOS**

### **Teste 1: Limpar localStorage**
1. Abrir Console (`F12`)
2. Executar:
   ```javascript
   localStorage.removeItem('ylada_last_visited_page')
   localStorage.removeItem('ylada_last_visited_timestamp')
   ```
3. Fechar e abrir navegador
4. Acessar `/pt/nutri/login`
5. **Esperado:** Não deve redirecionar automaticamente

### **Teste 2: Verificar Redirecionamento Após Login**
1. Limpar localStorage (Teste 1)
2. Fazer login com `nutri1@ylada.com`
3. **Esperado:** Deve redirecionar para `/pt/nutri/onboarding` ou `/pt/nutri/home`
4. **NÃO deve:** Redirecionar para `/checkout`

### **Teste 3: Acessar Checkout Diretamente**
1. Após criar a página de checkout
2. Acessar `/pt/nutri/checkout` (logado)
3. **Esperado:** Deve mostrar página de checkout com logo Nutri
4. **NÃO deve:** Mostrar erro 404

---

## 📋 **CHECKLIST DE IMPLEMENTAÇÃO**

- [ ] **Criar página de checkout:**
  - [ ] Copiar `src/app/pt/wellness/checkout/page.tsx`
  - [ ] Salvar como `src/app/pt/nutri/checkout/page.tsx`
  - [ ] Ajustar `perfil="nutri"`
  - [ ] Ajustar rotas de API
  - [ ] Ajustar rotas de login/sucesso
  - [ ] Verificar logo da área Nutri

- [ ] **Melhorar página 404:**
  - [ ] Detectar área pela URL
  - [ ] Mostrar logo específico da área
  - [ ] Ajustar links de retorno

- [ ] **Verificar AutoRedirect:**
  - [ ] Confirmar que não redireciona antes do login
  - [ ] Confirmar que valida URLs antes de redirecionar
  - [ ] Testar com localStorage limpo

- [ ] **Testar fluxo completo:**
  - [ ] Login → Onboarding/Home (não checkout)
  - [ ] Acesso direto ao checkout (deve funcionar)
  - [ ] 404 em outras páginas (deve mostrar logo correto)

---

## 🎯 **RESUMO**

**Problemas:**
1. ❌ Redirecionamento automático para `/checkout` (que não existe)
2. ❌ Página de checkout não existe
3. ❌ Logo genérico na página 404

**Correções Parciais:**
- ✅ Sistema não salva mais `/checkout` no localStorage
- ✅ Sistema não redireciona mais para `/checkout`

**Correções Pendentes:**
- ⏳ Criar página de checkout
- ⏳ Melhorar página 404 com logo da área
- ⏳ Verificar AutoRedirect

---

**Última atualização:** 16/12/2025


