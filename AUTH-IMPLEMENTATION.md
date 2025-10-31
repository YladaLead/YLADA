# 🔐 Sistema de Autenticação - YLADA

## ✅ Implementação Completa

### 📁 Estrutura Criada

#### 1. **Componentes de Autenticação**
- `src/components/auth/LoginForm.tsx` - Formulário reutilizável de login/cadastro
- `src/components/auth/ProtectedRoute.tsx` - Componente para proteger rotas no cliente

#### 2. **Páginas de Login (4 perfis)**
- `/pt/nutri/login` - Login para Nutricionistas
- `/pt/wellness/login` - Login para Consultores Wellness (logo verde)
- `/pt/coach/login` - Login para Coaches
- `/pt/nutra/login` - Login para Consultores Nutra

#### 3. **Helpers de Autenticação**
- `src/lib/auth.ts` - Funções server-side (getSession, getUser, requireAuth, etc)
- `src/hooks/useAuth.ts` - Hook client-side para gerenciar estado de autenticação

#### 4. **Schema do Banco de Dados**
- `schema-auth-users.sql` - Estrutura completa de tabelas, RLS, triggers e funções

---

## 🚀 Como Usar

### 1. **Configurar Supabase**

Execute o SQL em `schema-auth-users.sql` no Supabase SQL Editor:

```sql
-- Isso vai criar:
-- ✅ Tabela user_profiles
-- ✅ RLS policies (segurança)
-- ✅ Trigger automático para criar perfil ao registrar
-- ✅ Funções e views auxiliares
```

### 2. **Configurar Variáveis de Ambiente**

Certifique-se de ter no `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
```

### 3. **Proteger Rotas (Server Components)**

```tsx
import { requireAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await requireAuth('/pt/nutri/login')
  
  // Seu código aqui...
}
```

### 4. **Proteger Rotas (Client Components)**

```tsx
'use client'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function DashboardPage() {
  return (
    <ProtectedRoute perfil="nutri">
      {/* Seu conteúdo aqui */}
    </ProtectedRoute>
  )
}
```

### 5. **Usar Hook de Autenticação no Cliente**

```tsx
'use client'
import { useAuth } from '@/hooks/useAuth'

export default function Component() {
  const { user, isAuthenticated, loading, signOut } = useAuth()
  
  if (loading) return <p>Carregando...</p>
  if (!isAuthenticated) return <p>Faça login</p>
  
  return (
    <div>
      <p>Olá, {user?.email}</p>
      <button onClick={signOut}>Sair</button>
    </div>
  )
}
```

---

## 📋 Fluxo de Autenticação

### **Registro (Sign Up)**
1. Usuário preenche email, senha e nome
2. Supabase Auth cria conta
3. Trigger automático cria `user_profiles` com perfil informado
4. Email de confirmação enviado (se configurado)

### **Login (Sign In)**
1. Usuário preenche email e senha
2. Supabase valida credenciais
3. Sessão criada e armazenada
4. Redireciona para dashboard do perfil

### **Proteção de Rotas**
- Server Components: `requireAuth()` verifica sessão antes de renderizar
- Client Components: `<ProtectedRoute>` verifica e redireciona se não autenticado

---

## 🎨 Características do Login

- ✅ Suporte a 4 perfis (nutri, wellness, coach, nutra)
- ✅ Login e Cadastro na mesma página
- ✅ Logo verde para Wellness, azul para os demais
- ✅ Validação de formulário
- ✅ Mensagens de erro amigáveis
- ✅ Loading states
- ✅ Design responsivo

---

## 🔒 Segurança

### **Row Level Security (RLS)**
- ✅ Usuário só vê seu próprio perfil
- ✅ Usuário só atualiza seu próprio perfil
- ✅ Políticas automáticas configuradas

### **Boas Práticas Implementadas**
- ✅ Senha mínima de 6 caracteres
- ✅ Validação de email
- ✅ Tokens gerenciados pelo Supabase
- ✅ Sessões persistentes seguras

---

## 🔄 Próximos Passos Sugeridos

1. **Integração com Stripe** (já mencionado)
   - Verificar assinatura antes de acessar dashboard
   - Webhook para atualizar status de pagamento

2. **Recuperação de Senha**
   - Adicionar link "Esqueci minha senha" no login

3. **Verificação de Email**
   - Configurar templates de email no Supabase
   - Página de confirmação

4. **Perfil Completo**
   - Formulário para completar perfil após primeiro login
   - Upload de foto de perfil

5. **Logout**
   - Adicionar botão de logout nos dashboards

---

## 📝 Notas Importantes

- **Perfil é definido na URL**: `/pt/nutri/login` cria/valida usuário com perfil `nutri`
- **Redirecionamento automático**: Após login, redireciona para dashboard do perfil
- **Trigger automático**: Perfil criado automaticamente ao registrar (baseado em `metadata`)
- **RLS ativo**: Todas as consultas respeitam políticas de segurança

---

## 🧪 Testar

1. Acesse `/pt/nutri/login`
2. Clique em "Criar conta"
3. Preencha nome, email e senha
4. Faça login
5. Verifique redirecionamento para `/pt/nutri/dashboard`

Repita para os outros perfis! 🎉

