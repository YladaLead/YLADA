# 📚 Documentação: Lições Aprendidas - Implementação Wellness

## 🎯 Objetivo
Este documento registra os problemas encontrados e soluções implementadas durante o desenvolvimento da área Wellness, para evitar repetir os mesmos erros nas áreas Nutri, Coach e Nutra.

---

## 🔴 Problemas Encontrados e Soluções

### 1. **Erro de Recursão Infinita nas Políticas RLS**

#### Problema
```
Erro: infinite recursion detected in policy for relation "user_profiles"
```

**Causa:** Políticas RLS de admin consultavam `user_profiles` dentro da própria política, criando loop infinito.

#### Solução
Criar função helper com `SECURITY DEFINER` que bypassa RLS:

```sql
CREATE OR REPLACE FUNCTION public.is_user_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  v_is_admin boolean;
BEGIN
  SELECT COALESCE(is_admin, false) INTO v_is_admin
  FROM public.user_profiles
  WHERE user_id = auth.uid()
  LIMIT 1;
  
  RETURN COALESCE(v_is_admin, false);
END;
$$;
```

**Arquivo:** `corrigir-recursao-rls-user-profiles.sql`

**Aplicar em:** Todas as áreas (Nutri, Coach, Nutra)

---

### 2. **Erro de Ordem dos Hooks no React**

#### Problema
```
React has detected a change in the order of Hooks called by RequireSubscription
```

**Causa:** Hooks (`useState`, `useEffect`) declarados após retornos condicionais.

#### Solução
**Regra:** Todos os hooks devem estar no topo do componente, antes de qualquer `return`.

```typescript
export default function Component() {
  // ✅ TODOS OS HOOKS NO TOPO
  const [state1, setState1] = useState()
  const [state2, setState2] = useState()
  
  useEffect(() => { ... }, [])
  
  // ✅ AGORA SIM, RETORNOS CONDICIONAIS
  if (loading) return <Loading />
  if (!user) return <Login />
  
  return <Content />
}
```

**Arquivos corrigidos:**
- `src/components/auth/RequireSubscription.tsx`
- `src/app/pt/wellness/ferramentas/nova/page.tsx`

**Aplicar em:** Todos os componentes que usam hooks

---

### 3. **Geração Automática de Título com Capitalização Incorreta**

#### Problema
Título gerado como "Calculadora DE Agua" (com "DE" em maiúsculas).

**Causa:** Lógica antiga convertia palavras de 2-3 letras para maiúsculas automaticamente.

#### Solução
Criar função `gerarTituloDoSlug` que trata palavras de ligação corretamente:

```typescript
const gerarTituloDoSlug = (slug: string): string => {
  if (!slug) return ''
  
  const palavrasLigacao = new Set([
    'de', 'da', 'do', 'das', 'dos',
    'em', 'na', 'no', 'nas', 'nos',
    'para', 'por', 'com', 'sem',
    'a', 'o', 'as', 'os',
    'e', 'ou', 'mas',
    'que', 'qual', 'quais',
    'um', 'uma', 'uns', 'umas'
  ])
  
  const palavras = slug.split('-')
  
  const palavrasProcessadas = palavras.map((palavra, index) => {
    // Primeira palavra sempre capitalizada
    if (index === 0) {
      return palavra.charAt(0).toUpperCase() + palavra.slice(1)
    }
    
    // Palavras de ligação sempre minúsculas
    if (palavrasLigacao.has(palavra.toLowerCase())) {
      return palavra.toLowerCase()
    }
    
    // Outras palavras capitalizadas
    return palavra.charAt(0).toUpperCase() + palavra.slice(1)
  })
  
  return palavrasProcessadas.join(' ')
}
```

**Arquivos corrigidos:**
- `src/app/pt/wellness/ferramentas/nova/page.tsx`
- `src/app/pt/wellness/ferramentas/[id]/editar/page.tsx`

**Aplicar em:** Todas as áreas ao criar/editar ferramentas

---

### 4. **Erro 500 ao Criar Ferramenta - Colunas Faltando**

#### Problema
```
500 Internal Server Error
Estamos atualizando o sistema. Por favor, atualize a página (F5) e tente novamente.
```

**Causa:** Colunas necessárias não existiam na tabela `user_templates`:
- `short_code`
- `emoji`
- `custom_colors`
- `cta_type`
- `whatsapp_number`
- `external_url`
- `cta_button_text`
- `template_slug`
- `profession`

#### Solução
Criar script SQL para garantir todas as colunas:

```sql
-- Adicionar coluna short_code
ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS short_code VARCHAR(20) UNIQUE;

-- Adicionar outras colunas necessárias
ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS emoji VARCHAR(10);

ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS custom_colors JSONB DEFAULT '{"principal": "#10B981", "secundaria": "#059669"}'::jsonb;

-- ... (ver arquivo completo)
```

**Arquivo:** `garantir-colunas-user-templates.sql`

**Aplicar em:** Antes de implementar Nutri, Coach, Nutra

---

### 5. **Perfil Não Carregando - Problemas de RLS**

#### Problema
Perfil do usuário não carregava, causando bloqueios no dashboard.

**Causa:** 
- Políticas RLS incorretas
- Múltiplos registros duplicados
- Cache do Supabase desatualizado

#### Solução
1. **Corrigir RLS:** Usar função `is_user_admin()` nas políticas
2. **Limpar duplicatas:** Script `limpar-duplicatas-faulaandre.sql`
3. **Retry logic:** Adicionar tentativas no `useAuth`

**Arquivos:**
- `corrigir-recursao-rls-user-profiles.sql`
- `limpar-duplicatas-faulaandre.sql`
- `src/hooks/useAuth.ts`

---

## ✅ Checklist para Implementar Outras Áreas

### Antes de Começar

- [ ] Executar `corrigir-recursao-rls-user-profiles.sql` no Supabase
- [ ] Executar `garantir-colunas-user-templates.sql` no Supabase
- [ ] Verificar se todas as colunas necessárias existem
- [ ] Testar políticas RLS com usuário admin e usuário comum

### Durante o Desenvolvimento

- [ ] **Hooks:** Sempre declarar no topo do componente, antes de retornos condicionais
- [ ] **Títulos:** Usar função `gerarTituloDoSlug` para gerar títulos automaticamente
- [ ] **Validação:** Validar se todas as colunas existem antes de fazer INSERT
- [ ] **Logs:** Adicionar logs detalhados para facilitar debug
- [ ] **Tratamento de Erros:** Usar `translateError` para mensagens amigáveis

### Estrutura de Arquivos

```
src/app/pt/[area]/
├── ferramentas/
│   ├── nova/page.tsx          # Criar ferramenta
│   ├── [id]/editar/page.tsx   # Editar ferramenta
│   └── page.tsx               # Listar ferramentas
├── dashboard/page.tsx          # Dashboard principal
├── configuracao/page.tsx      # Configurações do perfil
└── login/page.tsx             # Login específico da área
```

### Scripts SQL Necessários

1. **Schema base:** `schema-wellness-ferramentas.sql` (adaptar para cada área)
2. **RLS:** `corrigir-recursao-rls-user-profiles.sql`
3. **Colunas:** `garantir-colunas-user-templates.sql`
4. **Admin:** `configurar-apenas-faula-andre-admin.sql` (adaptar)

---

## 🔧 Funções e Helpers Reutilizáveis

### 1. `gerarTituloDoSlug`
**Localização:** Copiar de `src/app/pt/wellness/ferramentas/nova/page.tsx`

**Uso:**
```typescript
const titulo = gerarTituloDoSlug('calculadora-de-agua')
// Retorna: "Calculadora de Agua"
```

### 2. `is_user_admin()` (SQL)
**Localização:** `corrigir-recursao-rls-user-profiles.sql`

**Uso em políticas RLS:**
```sql
CREATE POLICY "Admins can view all profiles"
ON user_profiles FOR SELECT
USING (
  auth.uid() = user_id 
  OR 
  public.is_user_admin()
);
```

### 3. `requireApiAuth`
**Localização:** `src/lib/api-auth.ts`

**Uso:**
```typescript
const authResult = await requireApiAuth(request, ['wellness', 'admin'])
if (authResult instanceof NextResponse) {
  return authResult // Erro de autenticação
}
const { user } = authResult
```

---

## 📋 Padrões de Código

### 1. Estrutura de Componente com Hooks
```typescript
export default function Component() {
  // 1. Hooks do React
  const [state, setState] = useState()
  const { user, userProfile } = useAuth()
  
  // 2. Hooks de efeito
  useEffect(() => { ... }, [])
  
  // 3. Funções auxiliares
  const handleAction = () => { ... }
  
  // 4. Retornos condicionais
  if (loading) return <Loading />
  if (!user) return <Login />
  
  // 5. Render principal
  return <Content />
}
```

### 2. Tratamento de Erros na API
```typescript
try {
  // Operação
} catch (error: any) {
  console.error('❌ Erro técnico:', {
    error,
    message: error?.message,
    code: error?.code,
    details: error?.details
  })
  
  // Erro de schema
  if (error?.message?.includes('column') || error?.code === '42703') {
    return NextResponse.json(
      { 
        error: 'Estamos atualizando o sistema. Por favor, atualize a página (F5) e tente novamente.',
        technical: error?.message
      },
      { status: 500 }
    )
  }
  
  // Outros erros
  return NextResponse.json(
    { error: translateError(error) },
    { status: 500 }
  )
}
```

### 3. Geração de Título
```typescript
// ✅ CORRETO
const titulo = gerarTituloDoSlug(slug)

// ❌ ERRADO
const titulo = slug
  .split('-')
  .map(p => p.toUpperCase())
  .join(' ')
```

---

## 🚨 Erros Comuns a Evitar

1. **❌ Declarar hooks após retornos condicionais**
   ```typescript
   if (loading) return <Loading />
   const [state, setState] = useState() // ❌ ERRADO
   ```

2. **❌ Consultar tabela dentro de política RLS da mesma tabela**
   ```sql
   -- ❌ ERRADO - causa recursão
   CREATE POLICY "test" ON user_profiles
   USING (EXISTS (SELECT 1 FROM user_profiles WHERE ...))
   ```

3. **❌ Tentar inserir colunas que não existem**
   ```typescript
   // ❌ ERRADO - verificar schema primeiro
   .insert({ short_code: 'abc' })
   ```

4. **❌ Capitalizar palavras de ligação**
   ```typescript
   // ❌ ERRADO
   'Calculadora DE Agua'
   
   // ✅ CORRETO
   'Calculadora de Agua'
   ```

---

## 📝 Notas Importantes

1. **Sempre testar RLS** com usuário comum e admin antes de deploy
2. **Verificar schema** antes de fazer INSERT/UPDATE
3. **Usar `IF NOT EXISTS`** em scripts SQL para evitar erros
4. **Adicionar logs detalhados** para facilitar debug
5. **Documentar mudanças** no schema em arquivos SQL separados

---

## 🔗 Arquivos de Referência

- `corrigir-recursao-rls-user-profiles.sql` - Correção de RLS
- `garantir-colunas-user-templates.sql` - Garantir colunas necessárias
- `schema-wellness-ferramentas.sql` - Schema base Wellness
- `src/lib/api-auth.ts` - Autenticação de API
- `src/hooks/useAuth.ts` - Hook de autenticação
- `src/components/auth/RequireSubscription.tsx` - Componente de proteção

---

## 📅 Histórico de Mudanças

- **2024-01-XX**: Documentação inicial criada
- **2024-01-XX**: Adicionada seção de recursão RLS
- **2024-01-XX**: Adicionada seção de hooks React
- **2024-01-XX**: Adicionada seção de geração de título
- **2024-01-XX**: Adicionada seção de colunas faltando

---

**Última atualização:** Janeiro 2024
**Mantido por:** Equipe de Desenvolvimento YLADA

