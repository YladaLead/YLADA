# 🔍 DEBUG - Internal Server Error

## Problema
Erro "Internal Server Error" ao acessar `/pt/wellness/home`

## Possíveis Causas

1. **Variáveis de ambiente não configuradas**
   - Verificar: `NEXT_PUBLIC_SUPABASE_URL`
   - Verificar: `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **Problema com cookies**
   - Cookies podem não estar sendo lidos corretamente
   - Verificar se há cookies no navegador

3. **Problema com query do Supabase**
   - Query de `user_profiles` pode estar falhando
   - Verificar RLS policies

4. **Problema com redirect**
   - Next.js redirect() pode estar causando problema
   - Verificar se está sendo usado corretamente

## Como Debuggar

### 1. Verificar Logs do Servidor
```bash
# Ver logs do Next.js no terminal onde está rodando
# Procurar por:
# - "❌ ProtectedLayout"
# - "Erro na validação"
# - Stack trace completo
```

### 2. Testar Validação Simplificada
Temporariamente desabilitar validação de assinatura:

```typescript
// Em layout.tsx, mudar para:
await validateProtectedAccess('wellness', {
  requireSubscription: false, // ← Desabilitar temporariamente
  allowAdmin: true,
  allowSupport: true,
})
```

### 3. Verificar Variáveis de Ambiente
```bash
# No terminal
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 4. Testar Acesso Direto ao Helper
Criar uma rota de teste:

```typescript
// app/api/test-auth/route.ts
import { validateProtectedAccess } from '@/lib/auth-server'

export async function GET() {
  try {
    const result = await validateProtectedAccess('wellness', {
      requireSubscription: false,
    })
    return Response.json({ success: true, result })
  } catch (error: any) {
    return Response.json({ 
      success: false, 
      error: error.message,
      stack: error.stack 
    }, { status: 500 })
  }
}
```

## Próximos Passos

1. Verificar logs do servidor
2. Testar validação simplificada (sem assinatura)
3. Verificar variáveis de ambiente
4. Testar helper diretamente via API

