# 🔒 PLANO DE ISOLAMENTO DE ÁREAS - YLADA

## 🎯 Objetivo
Garantir que cada área (Nutri, Nutra, Wellness, Coach) trabalhe de forma **completamente independente**, com isolamento total de dados e acesso. Apenas a área administrativa terá visão geral de todas as áreas.

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### 1️⃣ **PROTEÇÃO DE ROTAS POR PERFIL**

#### A. Server Components (Páginas de Dashboard)
**Arquivos a modificar:**
- `src/app/pt/nutri/dashboard/page.tsx`
- `src/app/pt/nutra/dashboard/page.tsx`
- `src/app/pt/wellness/dashboard/page.tsx`
- `src/app/pt/coach/dashboard/page.tsx`
- `src/app/pt/nutri/ferramentas/**/*.tsx`
- `src/app/pt/nutra/ferramentas/**/*.tsx`
- `src/app/pt/wellness/ferramentas/**/*.tsx`
- `src/app/pt/coach/ferramentas/**/*.tsx`

**Ação:** Converter para Server Components e adicionar `requireProfile()` no início de cada página.

**Exemplo:**
```typescript
import { requireProfile } from '@/lib/auth'

export default async function NutriDashboard() {
  const profile = await requireProfile('nutri')
  // ... resto do código
}
```

---

#### B. Client Components (Componentes Protegidos)
**Arquivos a modificar:**
- `src/components/auth/ProtectedRoute.tsx`

**Ação:** Atualizar `ProtectedRoute` para verificar perfil do usuário além de autenticação.

**Mudança necessária:**
```typescript
// Adicionar verificação de perfil no ProtectedRoute
const { userProfile } = useAuth() // Precisa expor profile no useAuth
if (perfil && userProfile?.perfil !== perfil) {
  router.push(`/pt/${perfil}/login`)
}
```

---

#### C. Hook useAuth
**Arquivo:** `src/hooks/useAuth.ts`

**Ação:** Adicionar `userProfile` ao contexto de autenticação.

---

### 2️⃣ **ÁREA ADMINISTRATIVA SEPARADA**

#### A. Proteção de Admin
**Arquivos:**
- `src/app/admin/**/*.tsx`
- Criar: `src/lib/auth.ts` → função `requireAdmin()`

**Ação:**
- Criar função `requireAdmin()` que verifica se usuário tem perfil `admin`
- Adicionar campo `is_admin` ou `role = 'admin'` na tabela `user_profiles`
- Proteger todas as rotas `/admin/**` com `requireAdmin()`

**Implementação:**
```typescript
export async function requireAdmin() {
  const profile = await getUserProfile()
  
  if (!profile || profile.perfil !== 'admin' || !profile.is_admin) {
    redirect('/pt/admin/login')
  }
  
  return profile
}
```

---

#### B. SQL Schema para Admin
**Arquivo:** Atualizar `schema-auth-users-final.sql`

**Ação:** Adicionar coluna `is_admin BOOLEAN DEFAULT false` na tabela `user_profiles`.

---

### 3️⃣ **ISOLAMENTO DE DADOS NO BANCO**

#### A. Row Level Security (RLS) Policies
**Arquivo:** `schema-auth-users-final.sql` ou criar novo `schema-rls-policies.sql`

**Ação:** Criar políticas RLS que garantam:

1. **Usuários só veem seus próprios dados:**
   ```sql
   -- Exemplo para tabela de ferramentas
   CREATE POLICY "Users can only see own tools"
   ON user_tools FOR SELECT
   USING (
     auth.uid() IN (
       SELECT user_id FROM user_profiles 
       WHERE perfil = 'nutri' -- ou 'nutra', 'wellness', 'coach'
     )
   );
   ```

2. **Admins veem tudo:**
   ```sql
   CREATE POLICY "Admins can see all data"
   ON user_tools FOR SELECT
   USING (
     EXISTS (
       SELECT 1 FROM user_profiles 
       WHERE user_id = auth.uid() 
       AND is_admin = true
     )
   );
   ```

3. **Aplicar para todas as tabelas:**
   - `user_tools` / `wellness_tools`
   - `leads` / `contacts`
   - `quizzes`
   - Qualquer tabela com dados de usuário

---

### 4️⃣ **APIS SEPARADAS POR PERFIL**

#### A. Estrutura de APIs
**Arquivos a criar/modificar:**
- `src/app/api/nutri/**/*.ts`
- `src/app/api/nutra/**/*.ts`
- `src/app/api/wellness/**/*.ts`
- `src/app/api/coach/**/*.ts`
- `src/app/api/admin/**/*.ts` (para gestão geral)

**Ação:** 
- Mover APIs específicas para pastas por perfil
- Adicionar verificação de perfil em cada endpoint
- Garantir que cada API só retorne dados do próprio perfil

**Exemplo:**
```typescript
export async function GET(request: Request) {
  const profile = await requireProfile('nutri')
  
  // Query só retorna dados do próprio usuário
  const { data } = await supabase
    .from('user_tools')
    .select('*')
    .eq('user_id', profile.user_id)
    .eq('perfil', 'nutri')
  
  return Response.json(data)
}
```

---

### 5️⃣ **MIDDLEWARE DE PROTEÇÃO**

#### A. Middleware Global
**Arquivo:** `src/middleware.ts`

**Ação:** Adicionar verificação de perfil no middleware para rotas protegidas.

**Implementação:**
```typescript
// Verificar se rota requer perfil específico
if (pathname.startsWith('/pt/nutri/') && !pathname.includes('/login')) {
  const profile = await getUserProfile()
  if (!profile || profile.perfil !== 'nutri') {
    return NextResponse.redirect(new URL('/pt/nutri/login', request.url))
  }
}
// Repetir para nutra, wellness, coach
```

---

### 6️⃣ **COMPONENTES COMPARTILHADOS**

#### A. Componentes Neutros
**Ação:** Identificar componentes que podem ser compartilhados vs. específicos por perfil.

**Estrutura proposta:**
```
src/components/
├── shared/          # Componentes neutros (botões, modais, etc)
├── nutri/          # Componentes específicos Nutri
├── nutra/          # Componentes específicos Nutra
├── wellness/       # Componentes específicos Wellness (já existe)
└── coach/          # Componentes específicos Coach
```

---

## 🗂️ ESTRUTURA DE BANCO DE DADOS

### Tabelas a Proteger com RLS:
1. ✅ `user_profiles` - Já tem RLS básico
2. ⚠️ `user_tools` / `wellness_tools` - Precisa RLS por perfil
3. ⚠️ `leads` / `contacts` - Precisa RLS por perfil
4. ⚠️ `quizzes` - Precisa RLS por perfil
5. ⚠️ `subscriptions` - Precisa RLS por perfil

---

## 📝 ORDEM DE IMPLEMENTAÇÃO RECOMENDADA

1. **Fase 1: Proteção Básica** (Crítico)
   - ✅ Atualizar `requireProfile()` no `auth.ts`
   - ✅ Adicionar `userProfile` no `useAuth`
   - ✅ Proteger dashboards principais com `requireProfile()`
   - ✅ Atualizar `ProtectedRoute` para verificar perfil

2. **Fase 2: Área Admin** (Alta prioridade)
   - ✅ Adicionar campo `is_admin` no banco
   - ✅ Criar `requireAdmin()`
   - ✅ Proteger rotas `/admin/**`

3. **Fase 3: RLS Policies** (Alta prioridade)
   - ✅ Criar políticas RLS para todas as tabelas
   - ✅ Testar isolamento de dados

4. **Fase 4: APIs Separadas** (Média prioridade)
   - ✅ Reorganizar APIs por perfil
   - ✅ Adicionar verificação de perfil

5. **Fase 5: Middleware** (Opcional - camada extra de segurança)
   - ✅ Adicionar verificação no middleware

---

## ⚠️ PONTOS DE ATENÇÃO

1. **Migração de dados existentes:**
   - Verificar se há dados compartilhados entre perfis
   - Garantir que cada registro tenha `user_id` e `perfil` corretos

2. **Testes necessários:**
   - Testar acesso cruzado (nutri tentando acessar nutra)
   - Testar área admin acessando todos os perfis
   - Testar RLS policies no Supabase

3. **Performance:**
   - RLS pode impactar performance em queries grandes
   - Considerar índices adicionais se necessário

---

## ✅ RESULTADO FINAL ESPERADO

- ✅ Nutri só acessa `/pt/nutri/**`
- ✅ Nutra só acessa `/pt/nutra/**`
- ✅ Wellness só acessa `/pt/wellness/**`
- ✅ Coach só acessa `/pt/coach/**`
- ✅ Admin acessa `/admin/**` e vê todos os perfis
- ✅ Dados completamente isolados por perfil no banco
- ✅ APIs específicas por perfil

---

**Status:** 🟡 Aguardando implementação
**Prioridade:** 🔴 CRÍTICA (Segurança e isolamento de dados)

