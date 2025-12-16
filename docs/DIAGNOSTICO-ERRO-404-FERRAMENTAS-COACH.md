# 🔍 Diagnóstico: Erro 404 em `/api/coach/ferramentas`

## 📋 Problema Identificado

O console do navegador mostra um erro 404 ao tentar acessar:
```
Failed to load resource: the server responded with a status of 404 ()
/api/coach/ferrament...b8cf-213475c414ef:1
```

A URL aparece truncada, mas parece ser uma tentativa de acessar `/api/coach/ferramentas/{id}` onde o ID pode estar incorreto ou ser um ID de cliente em vez de ferramenta.

## 🔎 Análise

### Estrutura de Endpoints Existentes

✅ **Endpoints corretos:**
- `/api/coach/ferramentas` - GET/POST (listar/criar)
- `/api/coach/ferramentas/[id]` - GET/PUT/DELETE (buscar/atualizar/deletar por ID)
- `/api/coach/ferramentas/by-url` - GET (buscar por user_slug + tool_slug)
- `/api/coach/ferramentas/check-slug` - GET (verificar disponibilidade de slug)
- `/api/coach/ferramentas/check-short-code` - GET (verificar disponibilidade de código curto)
- `/api/coach/ferramentas/track-view` - POST (registrar visualização)

### Possíveis Causas

1. **Prefetch do Next.js**: O Next.js pode estar tentando fazer prefetch de links que não existem
2. **URL malformada**: Algum componente pode estar construindo URLs incorretamente
3. **ID incorreto**: Tentativa de buscar ferramenta usando ID de cliente
4. **Rota dinâmica**: Problema com a rota `/api/coach/ferramentas/[id]` recebendo parâmetros incorretos

## ✅ Soluções Propostas

### 1. Adicionar Validação no Endpoint `[id]`

Adicionar validação mais robusta no endpoint `/api/coach/ferramentas/[id]/route.ts` para:
- Validar formato do ID (UUID)
- Retornar erro mais claro se o ID não for válido
- Logar tentativas de acesso com IDs inválidos

### 2. Verificar Prefetch do Next.js

Verificar se há links com `href` apontando para rotas de ferramentas que não existem:
- Verificar se há links usando IDs de clientes em vez de ferramentas
- Adicionar `prefetch={false}` em links suspeitos

### 3. Adicionar Tratamento de Erro no Frontend

Adicionar tratamento de erro mais robusto nas chamadas de API:
- Capturar erros 404 silenciosamente quando apropriado
- Logar erros apenas em desenvolvimento
- Não mostrar erros ao usuário para requisições não críticas

### 4. Verificar Componentes que Fazem Chamadas

Verificar se algum componente está fazendo chamadas incorretas:
- Buscar por padrões como `fetch('/api/coach/ferramentas/${clientId}')`
- Verificar se há confusão entre IDs de clientes e ferramentas

## 🛠️ Implementação

### Passo 1: Melhorar Validação no Endpoint

```typescript
// src/app/api/coach/ferramentas/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Validar formato UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      console.warn('⚠️ Tentativa de acessar ferramenta com ID inválido:', id)
      return NextResponse.json(
        { error: 'ID de ferramenta inválido' },
        { status: 400 }
      )
    }
    
    // ... resto do código
  } catch (error) {
    // ...
  }
}
```

### Passo 2: Adicionar Tratamento de Erro Silencioso

Para requisições não críticas (como prefetch), adicionar tratamento silencioso:

```typescript
// Em componentes que fazem prefetch ou chamadas não críticas
try {
  await fetch(`/api/coach/ferramentas/${id}`)
} catch (error) {
  // Silencioso - não logar em produção
  if (process.env.NODE_ENV === 'development') {
    console.warn('Erro ao fazer prefetch de ferramenta:', error)
  }
}
```

### Passo 3: Verificar Links e Navegação

Verificar se há links incorretos:
```bash
# Buscar por padrões suspeitos
grep -r "ferramentas/\${.*clientId" src/
grep -r "ferramentas/\${.*cliente" src/
```

## 📝 Próximos Passos

1. ✅ Adicionar validação de UUID no endpoint `[id]`
2. ✅ Verificar e corrigir links incorretos
3. ✅ Adicionar tratamento de erro silencioso para prefetch
4. ✅ Monitorar logs para identificar origem do problema
5. ✅ Adicionar testes para prevenir regressões

---

## ✅ MIGRAÇÃO CONCLUÍDA - Estrutura Consolidada

**Data:** Janeiro 2025

### Estrutura Final

Todas as páginas de ferramentas foram migradas para a estrutura `(protected)`:

```
/pt/coach/
├── (protected)/
│   ├── ferramentas/          ✅ Estrutura protegida (server-side)
│   │   ├── page.tsx          ✅ Lista de ferramentas
│   │   ├── nova/page.tsx     ✅ Criar nova ferramenta
│   │   ├── [id]/editar/page.tsx  ✅ Editar ferramenta
│   │   └── templates/page.tsx    ✅ Templates disponíveis
│   └── layout.tsx            ✅ Validação server-side
└── ferramentas/page.tsx      ✅ Redirect para (protected)/ferramentas
```

### Mudanças Implementadas

1. **Consolidação de Rotas**
   - ✅ Removida estrutura duplicada `/pt/coach/c/ferramentas`
   - ✅ Migradas todas as páginas para `(protected)/ferramentas`
   - ✅ URLs simplificadas: `/pt/coach/ferramentas` (em vez de `/c/ferramentas`)

2. **Validação Server-Side**
   - ✅ Todas as páginas protegidas com validação no layout
   - ✅ Sem necessidade de `ProtectedRoute` ou `RequireSubscription` nas páginas
   - ✅ Validação única e determinística no servidor

3. **Tratamento de Erros**
   - ✅ Validação de UUID no endpoint (retorna 400 em vez de 404)
   - ✅ Tratamento silencioso de 404/400 no frontend
   - ✅ Logs apenas em desenvolvimento

4. **Links Atualizados**
   - ✅ Todos os links internos atualizados para nova estrutura
   - ✅ CoachSidebar usando rotas corretas
   - ✅ Navegação consistente em toda aplicação

### Benefícios

- **Eficiência**: Código consolidado, sem duplicação
- **Eficácia**: Rotas protegidas com validação server-side
- **Manutenibilidade**: Estrutura única e clara
- **Performance**: Menos rotas, menos overhead
- **UX**: URLs mais limpas e consistentes

## 🔗 Referências

- Documentação do Next.js sobre prefetch: https://nextjs.org/docs/app/api-reference/components/link#prefetch
- Estrutura de rotas da API: `src/app/api/coach/ferramentas/`
