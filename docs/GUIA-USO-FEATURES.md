# 📚 GUIA DE USO - SISTEMA DE FEATURES/MÓDULOS

## 🎯 Visão Geral

O sistema de features permite controlar acesso granular a funcionalidades:
- **gestao**: CRM, Agenda, Clientes, Relatórios
- **ferramentas**: Quizzes, Calculadoras, Links Personalizados
- **cursos**: Formação Empresarial ILADA
- **completo**: Acesso a tudo

---

## 🔧 Como Usar

### 1. Verificar Acesso em Componentes

```typescript
import { hasFeatureAccess } from '@/lib/feature-helpers'

// Verificar se tem acesso a cursos
const canAccessCursos = await hasFeatureAccess(userId, 'nutri', 'cursos')

if (canAccessCursos) {
  // Mostrar área de cursos
}
```

### 2. Proteger Rotas com RequireFeature

```typescript
import RequireFeature from '@/components/auth/RequireFeature'

// Proteger página de cursos
<RequireFeature area="nutri" feature="cursos">
  <CursosPage />
</RequireFeature>

// Proteger com múltiplas features (qualquer uma)
<RequireFeature area="nutri" feature={['gestao', 'ferramentas']}>
  <FerramentasPage />
</RequireFeature>
```

### 3. Verificar em APIs

```typescript
import { hasFeatureAccess } from '@/lib/feature-helpers'

export async function GET(request: NextRequest) {
  const user = await requireApiAuth(request)
  
  // Verificar acesso
  const hasAccess = await hasFeatureAccess(user.id, 'nutri', 'cursos')
  
  if (!hasAccess) {
    return NextResponse.json(
      { error: 'Acesso negado. Upgrade necessário.' },
      { status: 403 }
    )
  }
  
  // Continuar...
}
```

### 4. Verificar via API Endpoint

```typescript
// GET /api/nutri/feature/check?feature=cursos
const response = await fetch('/api/nutri/feature/check?feature=cursos')
const { hasAccess } = await response.json()
```

---

## 📋 Helpers Disponíveis

### `hasFeatureAccess(userId, area, feature)`
Verifica se usuário tem acesso a uma feature específica.

**Retorna:** `true` se tiver acesso, `false` caso contrário.

**Regras:**
- Feature "completo" dá acesso a tudo
- Feature específica dá acesso apenas àquela funcionalidade

### `hasAnyFeature(userId, area, features[])`
Verifica se usuário tem acesso a qualquer uma das features.

**Uso:** Quando uma página requer múltiplas features (ex: gestão OU ferramentas).

### `hasCompleteAccess(userId, area)`
Verifica se usuário tem acesso completo.

**Equivalente a:** `hasFeatureAccess(userId, area, 'completo')`

### `getUserFeatures(userId, area)`
Retorna array de todas as features ativas do usuário.

**Retorna:** `Feature[] | null`

---

## 🗄️ Estrutura no Banco

### Campo `features` na tabela `subscriptions`

```json
// Plano completo
["completo"]

// Só cursos
["cursos"]

// Gestão + Ferramentas
["gestao", "ferramentas"]

// Gestão + Cursos
["gestao", "cursos"]
```

### Valores Padrão

- Assinaturas existentes: `["completo"]` (mantém acesso total)
- Novas assinaturas: Definir no checkout

---

## 🔐 Regras de Acesso

1. **Feature "completo"**
   - Dá acesso a todas as funcionalidades
   - Não precisa verificar outras features

2. **Features específicas**
   - Dá acesso apenas àquela funcionalidade
   - Pode ter múltiplas features (ex: `["gestao", "ferramentas"]`)

3. **Admin/Suporte**
   - Sempre têm acesso completo
   - Bypass automático em todos os checks

4. **Sem assinatura**
   - Sem acesso a nenhuma feature
   - Retorna `false` em todas as verificações

---

## 📝 Exemplos Práticos

### Exemplo 1: Página de Cursos

```typescript
// src/app/pt/nutri/cursos/page.tsx
import RequireFeature from '@/components/auth/RequireFeature'

export default function CursosPage() {
  return (
    <RequireFeature area="nutri" feature="cursos">
      <CursosContent />
    </RequireFeature>
  )
}
```

### Exemplo 2: API de Cursos

```typescript
// src/app/api/nutri/cursos/route.ts
import { hasFeatureAccess } from '@/lib/feature-helpers'

export async function GET(request: NextRequest) {
  const user = await requireApiAuth(request)
  
  // Verificar acesso
  const hasCursos = await hasFeatureAccess(user.id, 'nutri', 'cursos')
  const hasCompleto = await hasFeatureAccess(user.id, 'nutri', 'completo')
  
  if (!hasCursos && !hasCompleto) {
    return NextResponse.json(
      { error: 'Acesso negado. Upgrade para plano com cursos.' },
      { status: 403 }
    )
  }
  
  // Buscar cursos...
}
```

### Exemplo 3: Botão Condicional

```typescript
// Mostrar botão apenas se tiver acesso
const [hasCursos, setHasCursos] = useState(false)

useEffect(() => {
  const check = async () => {
    if (user) {
      const access = await hasFeatureAccess(user.id, 'nutri', 'cursos')
      setHasCursos(access)
    }
  }
  check()
}, [user])

{hasCursos && (
  <Link href="/pt/nutri/cursos">
    Acessar Cursos
  </Link>
)}
```

---

## ⚠️ Importante

1. **Sempre verificar no backend**
   - Frontend pode ser burlado
   - Verificação no backend é obrigatória

2. **Usar helpers, não queries diretas**
   - Helpers têm lógica de "completo"
   - Mantém consistência

3. **Testar com diferentes features**
   - Criar assinaturas de teste
   - Validar cada cenário

---

## 🧪 Testes

### Criar Assinatura de Teste

```sql
-- Assinatura com só cursos
INSERT INTO subscriptions (user_id, area, plan_type, features, status, current_period_end, ...)
VALUES (
  'user-id-aqui',
  'nutri',
  'annual',
  '["cursos"]'::jsonb,
  'active',
  NOW() + INTERVAL '1 year',
  ...
);

-- Assinatura completa
INSERT INTO subscriptions (user_id, area, plan_type, features, status, current_period_end, ...)
VALUES (
  'user-id-aqui',
  'nutri',
  'annual',
  '["completo"]'::jsonb,
  'active',
  NOW() + INTERVAL '1 year',
  ...
);
```

---

## ✅ Checklist de Implementação

- [ ] Migration SQL executada
- [ ] Helpers criados e testados
- [ ] Componente RequireFeature criado
- [ ] API endpoint criado
- [ ] Testado com usuário de teste
- [ ] Documentação atualizada

---

## 🚀 Próximos Passos

1. Implementar área de cursos usando features
2. Atualizar checkout para permitir seleção de features
3. Criar planos separados (Gestão, Ferramentas, Cursos)
4. Sistema de upgrade entre planos

