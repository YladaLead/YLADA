# 🔐 Sistema de Controle de Acesso Centralizado

## 📋 Visão Geral

Sistema unificado que gerencia acesso e redirecionamento baseado em autenticação e assinatura, garantindo uma experiência fluida para os usuários.

---

## 🎯 Regras Implementadas

### **1. Usuário SEM Assinatura tenta acessar página protegida**
- ✅ **Redireciona automaticamente para `/pt/{area}/checkout`**
- ✅ Não mostra mais página de "Assinatura Necessária"
- ✅ Melhor para conversão (leva direto ao checkout)

### **2. Usuário LOGADO volta para a plataforma**
- ✅ **Mantém sessão ativa** (sessão persiste)
- ✅ Se acessa página de login → redireciona para home do perfil
- ✅ Se acessa página protegida → permite acesso (RequireSubscription verifica assinatura)
- ✅ Se acessa página pública → permite acesso normalmente

### **3. Usuário NÃO LOGADO tenta acessar página protegida**
- ✅ **Redireciona para `/pt/{area}/login`**
- ✅ Após login, volta para a página que tentou acessar (se aplicável)

---

## 🏗️ Arquitetura

### **1. Sistema de Regras (`src/lib/access-rules.ts`)**

Define centralizadamente quais páginas requerem o quê:

```typescript
// Páginas públicas (não requerem nada)
- Landing pages (/pt/{area}/)
- Login (/login)
- Checkout (/checkout)
- HOM gravada (/pt/{area}/[user-slug]/hom)
- Ferramentas públicas (/pt/{area}/[user-slug]/[tool-slug])
- Formulários públicos (/f/[formId])
- Links curtos (/p/[code])

// Páginas que requerem apenas autenticação
- Checkout (precisa estar logado)
- Suporte (/suporte)

// Páginas que requerem assinatura ativa
- Dashboard (/dashboard, /home)
- Ferramentas (/ferramentas)
- Templates (/templates)
- Configurações (/configuracao)
- Leads, Relatórios, Cursos, etc.
```

**Funções principais:**
- `isPublicPage(pathname)` - Verifica se é pública
- `requiresAuth(pathname)` - Verifica se requer autenticação
- `requiresSubscription(pathname)` - Verifica se requer assinatura
- `getAccessRule(pathname)` - Retorna regra completa
- `getCheckoutPath(area)` - Retorna caminho de checkout
- `getHomePath(area)` - Retorna caminho de home

---

### **2. RequireSubscription (`src/components/auth/RequireSubscription.tsx`)**

**MELHORIAS IMPLEMENTADAS:**

1. **Redirecionamento automático quando sem assinatura:**
   ```typescript
   // Antes: Mostrava página "Assinatura Necessária"
   // Agora: Redireciona automaticamente para checkout
   if (!hasSubscription && !canBypass && user) {
     router.replace(getCheckoutPath(area))
   }
   ```

2. **Usa sistema de regras centralizado:**
   ```typescript
   const accessRule = getAccessRule(pathname)
   const redirectPath = accessRule?.redirectIfNoSubscription || getCheckoutPath(area)
   ```

3. **Evita loops de redirecionamento:**
   - Flag `hasRedirected` previne múltiplos redirecionamentos
   - Verifica se já está na página de destino antes de redirecionar

---

### **3. AutoRedirect (`src/components/auth/AutoRedirect.tsx`)**

**MELHORIAS IMPLEMENTADAS:**

1. **Mantém usuários logados:**
   - Sessão persiste (já configurado no Supabase)
   - Não força logout quando usuário volta

2. **Usa sistema de regras centralizado:**
   ```typescript
   const accessRule = getAccessRule(pathname)
   const isPublic = accessRule.isPublic || isPublicPage(pathname)
   ```

3. **Redirecionamento inteligente:**
   - Usuário logado em `/login` → redireciona para `/home`
   - Usuário não logado em página protegida → redireciona para `/login`
   - Usuário logado em página pública → permite acesso

---

## 🔄 Fluxo Completo

### **Cenário 1: Usuário sem assinatura tenta acessar dashboard**

```
1. Usuário acessa /pt/wellness/dashboard
2. AutoRedirect verifica: usuário logado ✅
3. ProtectedRoute verifica: usuário autenticado ✅
4. RequireSubscription verifica: sem assinatura ❌
5. RequireSubscription redireciona para /pt/wellness/checkout
6. Usuário vê página de checkout
```

### **Cenário 2: Usuário logado volta para plataforma**

```
1. Usuário acessa /pt/wellness/dashboard (já estava logado antes)
2. AutoRedirect verifica: usuário logado ✅
3. ProtectedRoute verifica: usuário autenticado ✅
4. RequireSubscription verifica: tem assinatura ✅
5. Dashboard renderiza normalmente
```

### **Cenário 3: Usuário não logado tenta acessar dashboard**

```
1. Usuário acessa /pt/wellness/dashboard
2. AutoRedirect verifica: usuário não logado ❌
3. AutoRedirect redireciona para /pt/wellness/login
4. Usuário faz login
5. Após login, pode ser redirecionado de volta (se aplicável)
```

### **Cenário 4: Usuário logado acessa página pública**

```
1. Usuário acessa /pt/wellness/[user-slug]/hom
2. AutoRedirect verifica: página pública ✅
3. Permite acesso (não redireciona)
4. Página pública renderiza normalmente
```

---

## ✅ Benefícios

1. **Experiência melhor:**
   - Usuários sem assinatura vão direto para checkout (mais conversões)
   - Usuários logados não precisam fazer login novamente

2. **Código mais limpo:**
   - Regras centralizadas em um único lugar
   - Fácil de manter e atualizar

3. **Menos confusão:**
   - Redirecionamentos claros e consistentes
   - Sem loops de redirecionamento

4. **Melhor para SEO:**
   - Páginas públicas acessíveis sem autenticação
   - Redirecionamentos corretos

---

## 🔧 Como Usar

### **Adicionar nova página pública:**

Edite `src/lib/access-rules.ts`:

```typescript
const PUBLIC_PAGES: (string | RegExp)[] = [
  // ... páginas existentes
  /\/nova-pagina-publica/, // Adicione aqui
]
```

### **Adicionar página que requer apenas autenticação:**

```typescript
const AUTH_ONLY_PAGES: (string | RegExp)[] = [
  // ... páginas existentes
  /\/minha-pagina/, // Adicione aqui
]
```

### **Adicionar página que requer assinatura:**

```typescript
const SUBSCRIPTION_REQUIRED_PAGES: (string | RegExp)[] = [
  // ... páginas existentes
  /\/minha-pagina-premium/, // Adicione aqui
]
```

---

## 🐛 Troubleshooting

### **Problema: Loop de redirecionamento**

**Solução:** Verifique se a página não está sendo marcada como pública e protegida ao mesmo tempo.

### **Problema: Usuário não é redirecionado para checkout**

**Solução:** Verifique se `RequireSubscription` está sendo usado na página e se a área está correta.

### **Problema: Usuário precisa fazer login toda vez**

**Solução:** Verifique se a sessão está persistindo (configuração do Supabase).

---

## 📝 Notas Técnicas

- **Sessão persiste:** Configurado no Supabase client (`persistSession: true`)
- **Cache de assinatura:** Usado para melhorar performance
- **Timeouts:** Reduzidos para melhor UX (1s para verificação de perfil)
- **Admin/Suporte:** Podem bypassar verificação de assinatura

---

## 🚀 Próximos Passos

1. ✅ Sistema de regras centralizado
2. ✅ Redirecionamento automático para checkout
3. ✅ Manutenção de sessão
4. ⏳ (Futuro) Analytics de redirecionamentos
5. ⏳ (Futuro) A/B testing de páginas de checkout







