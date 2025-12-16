# 🔍 Análise: Problema de Renovação Manual e "Ferramenta não encontrada"

**Data:** 16 de dezembro de 2025  
**Problema relatado:** Usuário não consegue fazer renovação - sistema pede para fazer manualmente, mas ao tentar acessar o link aparece "Ferramenta não encontrada"

---

## 📋 Descrição do Problema

### Fluxo do Problema:
1. **Usuário entra em "Meus Links"** (`/pt/coach/ferramentas`)
2. **Sistema pede para fazer renovação manual** porque "não reconhece/recebe"
3. **Usuário tenta acessar um link** (provavelmente após fazer a renovação manual)
4. **Aparece erro: "Ferramenta não encontrada"** (404)

### Erro Visualizado:
- Mensagem: "Ferramenta não encontrada"
- Botões: "Voltar para Meus Links" e "Ir para Dashboard"
- Localização: Página de ferramenta (`/pt/c/[user-slug]/[tool-slug]`)

---

## 🔎 Análise Técnica

### 1. Fluxo de Acesso aos Links

#### Página "Meus Links" (`/pt/coach/(protected)/ferramentas/page.tsx`)
- Carrega ferramentas via `/api/coach/ferramentas?profession=coach`
- Exibe lista de links com URLs no formato: `/pt/c/{user-slug}/{tool-slug}`
- **Não verifica assinatura diretamente** - apenas lista as ferramentas

#### Página de Ferramenta (`/pt/c/[user-slug]/[tool-slug]/page.tsx`)
- Faz chamada para `/api/coach/ferramentas/by-url?user_slug={userSlug}&tool_slug={toolSlug}`
- Se retornar erro, mostra "Ferramenta não encontrada"

### 2. API de Busca por URL (`/api/coach/ferramentas/by-url/route.ts`)

#### Verificações Realizadas:
1. **Busca ferramenta** no banco:
   ```typescript
   .eq('user_profiles.user_slug', userSlug)
   .eq('slug', toolSlug)
   .eq('profession', 'coach')
   .eq('status', 'active')
   ```

2. **Verifica assinatura ativa**:
   ```typescript
   const subscriptionOk = await ensureActiveSubscription(ownerId)
   if (!subscriptionOk) {
     return NextResponse.json(
       { error: 'link_indisponivel', message: 'Assinatura expirada' },
       { status: 403 }
     )
   }
   ```

3. **Retorna erro 404** se ferramenta não encontrada:
   ```typescript
   if (error.code === 'PGRST116') {
     return NextResponse.json(
       { error: 'Ferramenta não encontrada' },
       { status: 404 }
     )
   }
   ```

### 3. Função de Verificação de Assinatura (`hasActiveSubscription`)

**Localização:** `src/lib/subscription-helpers.ts`

```typescript
export async function hasActiveSubscription(
  userId: string,
  area: 'wellness' | 'nutri' | 'coach' | 'nutra'
): Promise<boolean>
```

**Lógica:**
- Busca assinatura com `status = 'active'`
- Verifica se `current_period_end > NOW()`
- **NÃO verifica** `requires_manual_renewal`

### 4. Sistema de Renovação Manual

**Campo no banco:** `subscriptions.requires_manual_renewal` (boolean)

**Quando é usado:**
- Assinaturas migradas de sistema antigo
- Assinaturas PIX/Boleto que precisam renovação manual
- Sistema mostra banner pedindo renovação quando `requires_manual_renewal = true`

**Problema identificado:**
- A verificação `hasActiveSubscription` **não considera** `requires_manual_renewal`
- Se a assinatura está ativa mas marcada como `requires_manual_renewal = true`, o sistema pode estar bloqueando incorretamente

---

## 🎯 Possíveis Causas do Problema

### Causa 1: Assinatura Expirada mas Sistema Não Reconhece Renovação Manual
**Cenário:**
- Usuário tem `requires_manual_renewal = true`
- Assinatura expirou (`current_period_end < NOW()`)
- Usuário fez pagamento manual, mas admin ainda não atualizou `current_period_end`
- Sistema bloqueia acesso porque `hasActiveSubscription` retorna `false`

**Evidência:**
- Mensagem "pede para fazer manual porque não reconhece"
- Erro aparece após tentar acessar link

### Causa 2: Slug da Ferramenta Incorreto
**Cenário:**
- URL gerada em "Meus Links" usa `tool.slug` incorreto
- Ferramenta existe no banco mas com slug diferente
- API retorna 404 porque não encontra pelo slug informado

**Evidência:**
- Erro "Ferramenta não encontrada" (404, não 403)
- Link pode ter sido criado com slug diferente

### Causa 3: User Slug Incorreto ou Não Encontrado
**Cenário:**
- `user_profiles.user_slug` não existe ou está diferente
- Join com `user_profiles` falha
- Sistema tenta fallback mas ainda falha

**Evidência:**
- Erro 404 com mensagem genérica
- Logs mostram erro de relação/join

### Causa 4: Ferramenta com Status Inativo
**Cenário:**
- Ferramenta existe mas `status != 'active'`
- API filtra apenas ferramentas ativas
- Retorna 404 porque não encontra ferramenta ativa

**Evidência:**
- Ferramenta aparece em "Meus Links" mas não abre
- Status pode estar como 'inactive' no banco

### Causa 5: Problema na Verificação de Assinatura
**Cenário:**
- Assinatura está ativa mas verificação retorna `false`
- Pode ser problema de timezone ou data
- Ou problema na query do banco

**Evidência:**
- Assinatura válida mas acesso bloqueado
- Logs mostram `subscriptionOk = false` mesmo com assinatura ativa

---

## 🔍 Pontos de Verificação Necessários

### 1. Verificar Dados no Banco
```sql
-- Verificar assinatura do usuário
SELECT 
  id, 
  user_id, 
  area, 
  status, 
  current_period_end, 
  requires_manual_renewal,
  current_period_end > NOW() as ainda_valida
FROM subscriptions
WHERE user_id = '{user_id}' 
  AND area = 'coach'
ORDER BY created_at DESC;

-- Verificar ferramentas do usuário
SELECT 
  id,
  title,
  slug,
  template_slug,
  status,
  user_id
FROM coach_user_templates
WHERE user_id = '{user_id}'
  AND profession = 'coach'
ORDER BY created_at DESC;

-- Verificar user_slug
SELECT 
  user_id,
  user_slug,
  nome_completo,
  email
FROM user_profiles
WHERE user_id = '{user_id}';
```

### 2. Verificar Logs da API
- Procurar por chamadas a `/api/coach/ferramentas/by-url`
- Verificar se retorna 404 ou 403
- Verificar valores de `userSlug` e `toolSlug` recebidos
- Verificar resultado de `hasActiveSubscription`

### 3. Verificar URLs Geradas
- Comparar URL exibida em "Meus Links" com URL real da ferramenta
- Verificar se `user_slug` e `tool_slug` estão corretos
- Verificar se há diferença entre slug exibido e slug no banco

---

## 💡 Soluções Propostas

### Solução 1: Melhorar Tratamento de Erro 403 vs 404
**Problema:** Frontend trata 403 como 404

**Ação:**
- Distinguir entre "Ferramenta não encontrada" (404) e "Link indisponível" (403)
- Mostrar mensagem diferente para cada caso
- Para 403, mostrar: "Sua assinatura precisa ser renovada. Entre em contato com o suporte."

**Arquivo:** `src/app/pt/c/[user-slug]/[tool-slug]/page.tsx`
```typescript
if (response.status === 403) {
  setError('link_indisponivel') // Já existe, mas precisa melhorar mensagem
  // ...
}
```

### Solução 2: Melhorar Verificação de Assinatura
**Problema:** `hasActiveSubscription` não considera renovação manual pendente

**Ação:**
- Adicionar lógica para verificar se renovação manual está pendente
- Se `requires_manual_renewal = true` e assinatura expirou, retornar erro específico
- Permitir acesso se renovação foi feita recentemente (últimas 24h)

**Arquivo:** `src/lib/subscription-helpers.ts`

### Solução 3: Adicionar Logs Detalhados
**Problema:** Difícil diagnosticar sem logs

**Ação:**
- Adicionar logs em pontos críticos:
  - Quando verifica assinatura
  - Quando busca ferramenta
  - Quando retorna erro
- Incluir informações: user_id, tool_id, subscription_status, error_code

### Solução 4: Validar Slugs Antes de Buscar
**Problema:** Slugs podem estar incorretos

**Ação:**
- Validar formato de slug antes de buscar
- Normalizar slugs (remover espaços, caracteres especiais)
- Tentar busca alternativa se slug não encontrado

### Solução 5: Melhorar Mensagem de Erro
**Problema:** Mensagem genérica não ajuda usuário

**Ação:**
- Mensagem específica para cada tipo de erro:
  - 404: "Este link não existe ou foi removido"
  - 403: "Sua assinatura precisa ser renovada. Clique aqui para renovar."
  - 500: "Erro técnico. Tente novamente em alguns instantes."
- Adicionar link direto para renovação quando for erro 403

---

## 📊 Checklist de Diagnóstico

Para identificar a causa exata, verificar:

- [ ] Assinatura está ativa? (`status = 'active'` e `current_period_end > NOW()`)
- [ ] `requires_manual_renewal` está como `true`?
- [ ] `user_slug` existe e está correto?
- [ ] `tool_slug` existe e está correto?
- [ ] Ferramenta tem `status = 'active'`?
- [ ] URL gerada em "Meus Links" corresponde ao slug no banco?
- [ ] API retorna 404 ou 403?
- [ ] Logs mostram qual erro específico?
- [ ] Renovação manual foi processada pelo admin?
- [ ] `current_period_end` foi atualizado após renovação?

---

## 🚨 Ações Imediatas Recomendadas

1. **Verificar logs do servidor** para ver qual erro está sendo retornado (404 ou 403)
2. **Verificar dados do usuário** no banco (assinatura, ferramentas, user_slug)
3. **Testar URL diretamente** acessando `/api/coach/ferramentas/by-url?user_slug={slug}&tool_slug={slug}`
4. **Verificar se renovação manual foi processada** (se `current_period_end` foi atualizado)
5. **Comparar URL exibida** em "Meus Links" com dados reais no banco

---

## 📝 Notas Adicionais

- O erro "Ferramenta não encontrada" pode ser tanto 404 (não existe) quanto 403 (bloqueado por assinatura)
- O frontend precisa distinguir melhor entre esses casos
- A verificação de assinatura pode estar muito restritiva para assinaturas manuais
- Pode haver problema de sincronização entre pagamento manual e atualização no banco

---

**Próximos Passos:**
1. Coletar dados específicos do usuário afetado
2. Verificar logs da API
3. Testar cenários específicos
4. Implementar melhorias baseadas nos achados
