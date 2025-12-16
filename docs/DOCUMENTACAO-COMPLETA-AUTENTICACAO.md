# 🔐 DOCUMENTAÇÃO COMPLETA - SISTEMA DE AUTENTICAÇÃO YLADA

**Data:** Dezembro 2024  
**Versão:** 1.0  
**Objetivo:** Explicar detalhadamente como funciona todo o processo de autenticação, desde o login até o acesso às páginas protegidas.

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Fluxo Completo de Autenticação](#fluxo-completo-de-autenticação)
4. [Componentes Principais](#componentes-principais)
5. [Gerenciamento de Sessão](#gerenciamento-de-sessão)
6. [Proteção de Rotas](#proteção-de-rotas)
7. [Redirecionamentos](#redirecionamentos)
8. [Possíveis Problemas e Diagnóstico](#possíveis-problemas-e-diagnóstico)

---

## 🎯 VISÃO GERAL

O sistema de autenticação do YLADA utiliza **Supabase Auth** como backend de autenticação, com uma camada de gerenciamento de estado no frontend através de React Context e hooks customizados.

### Características Principais:
- ✅ Autenticação baseada em email/senha
- ✅ Suporte a múltiplos perfis (wellness, nutri, coach, nutra, admin)
- ✅ Sessão persistente (cookies + localStorage)
- ✅ Proteção de rotas em múltiplas camadas
- ✅ Verificação de assinatura ativa
- ✅ Cache de perfil e assinatura para performance

---

## 🏗️ ARQUITETURA DO SISTEMA

### Estrutura de Arquivos

```
src/
├── components/
│   └── auth/
│       ├── LoginForm.tsx          # Formulário de login/cadastro
│       ├── ProtectedRoute.tsx     # Proteção por perfil
│       ├── RequireSubscription.tsx # Verificação de assinatura
│       ├── AutoRedirect.tsx       # Redirecionamento automático
│       └── AdminProtectedRoute.tsx # Proteção admin
├── contexts/
│   └── AuthContext.tsx            # Context Provider
├── hooks/
│   └── useAuth.ts                 # Hook principal de autenticação
├── lib/
│   ├── auth.ts                    # Helpers server-side
│   ├── supabase-client.ts         # Cliente Supabase browser
│   └── access-rules.ts            # Regras de acesso
└── app/
    └── pt/
        ├── wellness/login/page.tsx
        ├── nutri/login/page.tsx
        ├── coach/login/page.tsx
        └── nutra/login/page.tsx
```

### Fluxo de Dados

```
┌─────────────────┐
│   LoginForm      │
│  (Login/Cadastro)│
└────────┬─────────┘
         │
         ▼
┌─────────────────┐
│  Supabase Auth  │
│  (signIn/signUp)│
└────────┬─────────┘
         │
         ▼
┌─────────────────┐
│  useAuth Hook   │
│ (onAuthStateChange)│
└────────┬─────────┘
         │
         ▼
┌─────────────────┐
│ AuthContext     │
│ (Estado Global) │
└────────┬─────────┘
         │
         ├──► AutoRedirect (redireciona se necessário)
         ├──► ProtectedRoute (verifica perfil)
         └──► RequireSubscription (verifica assinatura)
```

---

## 🔄 FLUXO COMPLETO DE AUTENTICAÇÃO

### 1. PROCESSO DE LOGIN

#### Passo 1: Usuário acessa página de login
- URL: `/pt/wellness/login` (ou nutri/coach/nutra)
- Componente: `LoginForm`
- Estado inicial: `loading = false`, `isAuthenticated = false`

#### Passo 2: Usuário preenche credenciais e submete
```typescript
// LoginForm.tsx - handleSubmit
1. Validação de perfil (verifica se email corresponde à área)
2. Chamada: supabase.auth.signInWithPassword({ email, password })
3. Supabase retorna sessão ou erro
```

#### Passo 3: Verificação de perfil
```typescript
// LoginForm.tsx - após login bem-sucedido
1. Verifica se perfil existe na tabela user_profiles
2. Se não existe, cria automaticamente
3. Verifica se senha provisória expirou (se aplicável)
```

#### Passo 4: Redirecionamento após login
```typescript
// LoginForm.tsx - linha 360
1. Verifica última página visitada (useLastVisitedPage)
2. Valida se rota é válida
3. router.replace(finalRedirectPath)
4. Sessão já está disponível (não precisa aguardar)
```

### 2. PROCESSO DE CADASTRO

#### Passo 1: Usuário escolhe "Criar conta"
- Toggle `isSignUp = true`
- Campo "Nome completo" aparece

#### Passo 2: Validação antes de cadastrar
```typescript
// LoginForm.tsx - linha 114
1. Verifica se email já existe
2. Se existe e tem perfil em outra área → erro
3. Se existe mas não tem perfil → permite criar
4. Admin/Suporte pode criar em qualquer área
```

#### Passo 3: Criação de conta
```typescript
// LoginForm.tsx - linha 135
1. supabase.auth.signUp({ email, password, metadata })
2. Se precisa confirmar email → mostra mensagem
3. Se sessão criada → continua para login
```

#### Passo 4: Ativação de autorizações pendentes
```typescript
// LoginForm.tsx - linha 175
1. Chama /api/auth/activate-pending-authorization
2. Ativa autorizações que estavam aguardando este email
```

### 3. DETECÇÃO DE SESSÃO (useAuth)

#### Inicialização
```typescript
// useAuth.ts - useEffect (linha 141)
1. Busca sessão: supabase.auth.getSession()
2. Se encontrar sessão:
   - setSession(session)
   - setUser(session.user)
   - Busca perfil: fetchUserProfile(userId)
3. Se não encontrar:
   - setSession(null)
   - setUser(null)
   - setLoading(false)
```

#### Listener de Mudanças
```typescript
// useAuth.ts - onAuthStateChange (linha 298)
1. Escuta eventos: SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED
2. Debounce de 300ms (evita eventos duplicados)
3. Atualiza estado imediatamente
4. Busca perfil se necessário
```

#### Cache de Perfil
```typescript
// useAuth.ts - fetchUserProfile (linha 27)
1. Verifica cache em sessionStorage (TTL: 2 minutos)
2. Se cache válido → retorna imediatamente
3. Se cache expirado → busca do Supabase
4. Salva no cache após buscar
```

---

## 🧩 COMPONENTES PRINCIPAIS

### 1. AuthProviderWrapper

**Localização:** `src/components/providers/AuthProviderWrapper.tsx`

**Função:** Wrapper que inicializa o sistema de autenticação

```typescript
<AuthProvider>
  <AutoRedirect />           {/* Redirecionamento automático */}
  <NavigationTracker>        {/* Salva última página visitada */}
    {children}
  </NavigationTracker>
</AuthProvider>
```

**Quando é usado:** No layout raiz da aplicação

---

### 2. AuthContext

**Localização:** `src/contexts/AuthContext.tsx`

**Função:** Context Provider que disponibiliza estado de autenticação globalmente

**Estado disponível:**
- `user`: Usuário atual (User | null)
- `session`: Sessão atual (Session | null)
- `userProfile`: Perfil do usuário (UserProfile | null)
- `loading`: Se está carregando (boolean)
- `isAuthenticated`: Se está autenticado (boolean)
- `signOut`: Função para fazer logout

**Uso:**
```typescript
const { user, userProfile, loading, isAuthenticated } = useAuth()
```

---

### 3. useAuth Hook

**Localização:** `src/hooks/useAuth.ts`

**Função:** Hook que gerencia todo o estado de autenticação

**Fluxo interno:**

1. **Inicialização (useEffect linha 141)**
   - Busca sessão do Supabase
   - Verifica cache de perfil
   - Carrega perfil se necessário

2. **Listener de Mudanças (linha 298)**
   - Escuta `onAuthStateChange`
   - Atualiza estado quando sessão muda
   - Busca perfil quando usuário faz login

3. **Cache Strategy**
   - Cache em `sessionStorage` (TTL: 2 minutos)
   - Chave: `user_profile_${userId}`
   - Formato: `{ data: UserProfile, timestamp: number }`

4. **Timeout de Loading**
   - PWA: 500ms
   - Web: 800ms
   - Se timeout passar sem sessão → marca como não autenticado

---

### 4. LoginForm

**Localização:** `src/components/auth/LoginForm.tsx`

**Função:** Formulário reutilizável de login/cadastro

**Props:**
- `perfil`: 'nutri' | 'wellness' | 'coach' | 'nutra' | 'admin'
- `redirectPath`: Caminho para redirecionar após login
- `logoColor`: Cor do logo
- `initialSignUpMode`: Se inicia em modo cadastro

**Fluxo de Login:**
1. Validação de perfil (verifica se email corresponde à área)
2. `supabase.auth.signInWithPassword()`
3. Verifica/cria perfil automaticamente
4. Verifica senha provisória (se aplicável)
5. Redireciona para `redirectPath` ou última página visitada

**Fluxo de Cadastro:**
1. Validação de nome completo
2. Verifica se email já existe
3. `supabase.auth.signUp()`
4. Ativa autorizações pendentes
5. Redireciona

---

### 5. AutoRedirect

**Localização:** `src/components/auth/AutoRedirect.tsx`

**Função:** Gerencia redirecionamento automático baseado em autenticação

**Lógica:**

```typescript
// CASO 1: Usuário está logado
if (isAuthenticated && user) {
  if (isLoginPage) {
    // Redireciona para home do perfil
    router.replace(getHomePath(perfil))
  }
  if (isPublic) {
    // Permite acesso (não redireciona)
  }
  if (isProtected) {
    // Permite acesso (RequireSubscription verifica assinatura)
  }
}

// CASO 2: Usuário NÃO está logado
if (!isAuthenticated) {
  if (isPublic || isLoginPage) {
    // Permite acesso
  }
  if (isProtected) {
    // Redireciona para login
    router.replace(getLoginPath(area))
  }
}
```

**Importante:** 
- Não faz nada enquanto `loading = true`
- Usa `router.replace()` (não adiciona ao histórico)
- Respeita regras de acesso centralizadas (`access-rules.ts`)

---

### 6. ProtectedRoute

**Localização:** `src/components/auth/ProtectedRoute.tsx`

**Função:** Protege rotas verificando autenticação e perfil

**Props:**
- `perfil`: Perfil necessário para acessar
- `allowAdmin`: Se admin pode acessar (padrão: false)
- `allowSupport`: Se suporte pode acessar (padrão: true)

**Lógica:**

```typescript
1. Se loading && !hasTimedOut → mostra loading
2. Se !isAuthenticated → retorna null (AutoRedirect cuida)
3. Se perfil especificado:
   - Se allowAdmin && is_admin → permite
   - Se allowSupport && is_support → permite
   - Se userProfile.perfil !== perfil → bloqueia (ou permite se timeout)
4. Se passou todas verificações → renderiza children
```

**Timeout:** 500ms (com cache, raramente necessário)

---

### 7. RequireSubscription

**Localização:** `src/components/auth/RequireSubscription.tsx`

**Função:** Verifica se usuário tem assinatura ativa

**Lógica:**

```typescript
1. Se admin/suporte → permite imediatamente (bypass)
2. Se perfil não carregou:
   - Aguarda até timeout (2s)
   - Se timeout passou → permite temporariamente
3. Verifica cache de assinatura (TTL: 2 minutos)
4. Se cache válido → usa cache
5. Se não, chama API `/api/subscription/check`
6. Se tem assinatura → permite
7. Se não tem → redireciona para checkout
```

**Cache:** `subscription_${userId}_${area}` em sessionStorage

---

## 🍪 GERENCIAMENTO DE SESSÃO

### Como a Sessão é Armazenada

1. **Supabase gerencia automaticamente:**
   - Cookies HTTP-only (sb-access-token, sb-refresh-token)
   - localStorage (backup)
   - Sincronização automática

2. **Configuração de Cookies:**
```typescript
// supabase-client.ts
- path: '/'
- maxAge: 7 dias
- sameSite: 'lax' (padrão)
- secure: true (em HTTPS)
```

### Persistência

- **Cookies:** Persistem entre sessões do navegador
- **localStorage:** Backup caso cookies falhem
- **sessionStorage:** Cache de perfil e assinatura (2 minutos)

### Refresh de Token

- Supabase faz refresh automático
- Evento `TOKEN_REFRESHED` é disparado
- `useAuth` atualiza estado automaticamente

---

## 🛡️ PROTEÇÃO DE ROTAS

### Camadas de Proteção

Uma página protegida típica tem 3 camadas:

```typescript
<ProtectedRoute perfil="wellness" allowAdmin={true}>
  <RequireSubscription area="wellness">
    <ConteudoDaPagina />
  </RequireSubscription>
</ProtectedRoute>
```

**Ordem de Verificação:**

1. **AutoRedirect** (global, sempre ativo)
   - Verifica se usuário está autenticado
   - Redireciona para login se necessário
   - Redireciona de login para home se já logado

2. **ProtectedRoute**
   - Verifica se usuário está autenticado
   - Verifica se perfil corresponde
   - Permite admin/suporte se configurado

3. **RequireSubscription**
   - Verifica se tem assinatura ativa
   - Admin/suporte pode bypassar
   - Redireciona para checkout se não tem

### Regras de Acesso

**Arquivo:** `src/lib/access-rules.ts`

Define quais páginas são:
- Públicas (não requerem autenticação)
- Apenas autenticação (não requerem assinatura)
- Requerem assinatura

**Exemplos:**
- `/pt/wellness/login` → Pública
- `/pt/wellness/checkout` → Apenas autenticação
- `/pt/wellness/home` → Requer assinatura

---

## 🔀 REDIRECIONAMENTOS

### Fluxo de Redirecionamento Após Login

```
Login bem-sucedido
    │
    ├─► Verifica última página visitada
    │   └─► Se válida → usa ela
    │
    └─► Se não válida → usa redirectPath padrão
        │
        └─► router.replace(path)
            │
            └─► AutoRedirect detecta usuário logado
                │
                └─► Se está em login → redireciona para home
                    Se está em home → permite acesso
```

### Redirecionamento de Páginas Protegidas

```
Usuário não autenticado acessa /pt/wellness/home
    │
    └─► AutoRedirect detecta
        │
        ├─► loading = true → aguarda
        │
        └─► loading = false && !isAuthenticated
            │
            └─► router.replace('/pt/wellness/login')
```

### Redirecionamento de Login para Home

```
Usuário logado acessa /pt/wellness/login
    │
    └─► AutoRedirect detecta
        │
        ├─► isAuthenticated = true
        │
        └─► router.replace('/pt/wellness/home')
```

---

## 🔍 POSSÍVEIS PROBLEMAS E DIAGNÓSTICO

### Problema 1: "Fica autenticando no authentic"

**Possíveis Causas:**

1. **Loop de redirecionamento entre AutoRedirect e LoginForm**
   - AutoRedirect redireciona de login para home
   - Mas algo está redirecionando de volta para login
   - **Verificar:** Console logs de AutoRedirect

2. **Sessão não está sendo detectada**
   - Cookies não estão sendo salvos
   - localStorage não está sincronizando
   - **Verificar:** 
     - Console: "useAuth: Sessão encontrada"
     - DevTools → Application → Cookies → sb-*
     - DevTools → Application → Local Storage

3. **Perfil não está carregando**
   - `useAuth` fica em `loading = true`
   - Timeout não está sendo acionado
   - **Verificar:**
     - Console: "useAuth: Perfil carregado"
     - Network tab: requisição para `user_profiles`

**Diagnóstico:**
```javascript
// No console do navegador
1. Verificar sessão:
   supabase.auth.getSession().then(console.log)

2. Verificar perfil:
   supabase.from('user_profiles').select('*').eq('user_id', 'SEU_USER_ID').single()

3. Verificar cookies:
   document.cookie

4. Verificar cache:
   sessionStorage.getItem('user_profile_SEU_USER_ID')
```

---

### Problema 2: "Fica em Lupin"

**Nota:** Não encontrei referência a "Lupin" no código. Pode ser:
- Um estado de loading que não está sendo exibido corretamente
- Um componente que não está renderizando
- Um erro que está sendo silenciado

**Diagnóstico:**
```javascript
// Verificar estado do useAuth
const { loading, user, userProfile, isAuthenticated } = useAuth()
console.log({ loading, user, userProfile, isAuthenticated })

// Verificar se ProtectedRoute está bloqueando
// Verificar se RequireSubscription está bloqueando
```

---

### Problema 3: "Cria no lugar do login, tenta entrar na Home, volta para login e não fixa"

**Possíveis Causas:**

1. **Sessão não está persistindo**
   - Login cria sessão, mas ao redirecionar, sessão se perde
   - Cookies não estão sendo salvos corretamente
   - **Verificar:** Cookies após login

2. **AutoRedirect está redirecionando de volta**
   - Após login, redireciona para home
   - Mas AutoRedirect detecta que não está autenticado
   - Redireciona de volta para login
   - **Causa:** Race condition entre criação de sessão e detecção

3. **RequireSubscription está bloqueando**
   - Usuário faz login
   - Acessa home
   - RequireSubscription verifica assinatura
   - Não tem assinatura → redireciona para checkout
   - Mas algo está redirecionando para login
   - **Verificar:** Logs de RequireSubscription

**Fluxo Problemático:**
```
Login → Sessão criada → router.replace('/home')
    │
    └─► AutoRedirect executa ANTES de sessão ser detectada
        │
        └─► Detecta !isAuthenticated → router.replace('/login')
            │
            └─► Loop infinito
```

**Solução Esperada:**
```typescript
// LoginForm já faz router.replace() após criar sessão
// useAuth.onAuthStateChange deve detectar sessão imediatamente
// AutoRedirect deve aguardar loading = false antes de redirecionar
```

---

### Problema 4: "Não consegue logar"

**Possíveis Causas:**

1. **Erro de credenciais**
   - Email ou senha incorretos
   - **Verificar:** Mensagem de erro no LoginForm

2. **Perfil não corresponde à área**
   - Email está cadastrado em outra área
   - **Verificar:** Mensagem de erro no LoginForm

3. **Senha provisória expirada**
   - LoginForm verifica e faz signOut se expirada
   - **Verificar:** Mensagem de erro específica

4. **Erro de rede**
   - Supabase não está acessível
   - **Verificar:** Network tab, console errors

**Diagnóstico:**
```javascript
// Tentar login manualmente
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'teste@email.com',
  password: 'senha123'
})
console.log({ data, error })
```

---

## 📊 CHECKLIST DE DIAGNÓSTICO

Quando um usuário reporta problema de autenticação, verificar:

### 1. Console do Navegador
- [ ] Erros JavaScript?
- [ ] Logs de `useAuth` aparecem?
- [ ] Logs de `AutoRedirect` aparecem?
- [ ] Logs de `LoginForm` aparecem?

### 2. Network Tab
- [ ] Requisição de login retorna 200?
- [ ] Cookies estão sendo setados?
- [ ] Requisição de perfil retorna dados?

### 3. Application Tab
- [ ] Cookies `sb-*` existem?
- [ ] localStorage tem dados do Supabase?
- [ ] sessionStorage tem cache de perfil?

### 4. Estado da Aplicação
- [ ] `useAuth.loading` está true infinitamente?
- [ ] `useAuth.isAuthenticated` está false quando deveria ser true?
- [ ] `useAuth.userProfile` está null quando deveria ter dados?

### 5. Redirecionamentos
- [ ] AutoRedirect está redirecionando corretamente?
- [ ] Há loop de redirecionamento?
- [ ] URL está mudando mas conteúdo não?

---

## 🔧 PONTOS DE ATENÇÃO

### 1. Race Conditions

**Problema:** Múltiplos componentes verificando autenticação simultaneamente

**Solução:** 
- `useAuth` centraliza estado
- Debounce em `onAuthStateChange` (300ms)
- Timeouts para evitar loading infinito

### 2. Cache vs Dados Reais

**Problema:** Cache pode estar desatualizado

**Solução:**
- TTL de 2 minutos
- Invalidação automática em signOut
- Atualização em background quando cache é usado

### 3. Sessão em PWA

**Problema:** Cookies podem não funcionar em PWA

**Solução:**
- Fallback para localStorage
- Verificação especial em `useAuth` (linha 146)
- Timeout reduzido para PWA (500ms)

### 4. Múltiplos Redirecionamentos

**Problema:** Vários componentes tentando redirecionar ao mesmo tempo

**Solução:**
- `AutoRedirect` centraliza redirecionamentos
- `hasRedirectedRef` previne múltiplos redirecionamentos
- `router.replace()` não adiciona ao histórico

---

## 📝 RESUMO DO FLUXO COMPLETO

```
1. USUÁRIO ACESSA /pt/wellness/login
   └─► LoginForm renderiza

2. USUÁRIO FAZ LOGIN
   └─► LoginForm.handleSubmit()
       └─► supabase.auth.signInWithPassword()
           └─► Sessão criada
               └─► router.replace('/pt/wellness/home')

3. useAuth DETECTA MUDANÇA
   └─► onAuthStateChange('SIGNED_IN')
       └─► setSession(session)
           └─► setUser(user)
               └─► fetchUserProfile(userId)
                   └─► setUserProfile(profile)
                       └─► setLoading(false)

4. AutoRedirect VERIFICA
   └─► isAuthenticated = true
       └─► pathname = '/pt/wellness/home'
           └─► Permite acesso (não redireciona)

5. ProtectedRoute VERIFICA
   └─► isAuthenticated = true
       └─► userProfile.perfil === 'wellness'
           └─► Renderiza children

6. RequireSubscription VERIFICA
   └─► userProfile.is_admin || hasSubscription
       └─► Renderiza children

7. PÁGINA HOME RENDERIZA
   └─► Conteúdo exibido
```

---

## 🎯 CONCLUSÃO

O sistema de autenticação é complexo e envolve múltiplas camadas de verificação. Os principais pontos de falha são:

1. **Sessão não sendo detectada** → Verificar cookies/localStorage
2. **Race conditions** → Verificar timeouts e debounce
3. **Redirecionamentos em loop** → Verificar AutoRedirect e lógica de redirecionamento
4. **Perfil não carregando** → Verificar RLS policies e cache

Para diagnosticar problemas, sempre verificar:
- Console logs
- Network requests
- Cookies e localStorage
- Estado do useAuth

---

**Última atualização:** Dezembro 2024  
**Mantido por:** Equipe de Desenvolvimento YLADA

