# 🔍 Diagnóstico: Erro de Login no NOEL - Área Wellness

## 📋 Problema Reportado

Usuários "Noel" e "Monica" estão recebendo a mensagem **"❌ Você precisa fazer login para continuar"** ao tentar usar o NOEL na área Wellness.

---

## 🔎 Análise do Fluxo de Autenticação

### 1. **Fluxo de Chamada**

```
Frontend (Página NOEL)
  ↓
useAuthenticatedFetch() → Adiciona access token no header
  ↓
POST /api/wellness/noel
  ↓
requireApiAuth() → Verifica autenticação
  ↓
Se falhar → Retorna 401: "Você precisa fazer login para continuar"
```

### 2. **Arquivos Envolvidos**

#### Frontend:
- **`src/app/pt/wellness/(protected)/noel/noel/page.tsx`** (linha 238)
  - Faz chamada para `/api/wellness/noel` usando `authenticatedFetch`
  - Trata erros e exibe mensagem ao usuário

- **`src/hooks/useAuthenticatedFetch.ts`**
  - Adiciona access token no header `Authorization: Bearer <token>`
  - Inclui `credentials: 'include'` para enviar cookies

#### Backend:
- **`src/app/api/wellness/noel/route.ts`** (linha 904)
  - Usa `requireApiAuth(request, ['wellness', 'admin'])`
  - Se autenticação falhar, retorna erro 401

- **`src/lib/api-auth.ts`** (linhas 10-298)
  - Função `requireApiAuth()` que verifica:
    1. **Cookies** do Supabase (prioridade 1)
    2. **Access token** no header Authorization (fallback)
    3. Se ambos falharem → retorna erro 401

---

## 🎯 Possíveis Causas

### **Causa 1: Cookies não estão sendo enviados**
- **Sintoma**: Sessão não encontrada nos cookies
- **Verificação**: Verificar se cookies do Supabase estão presentes no navegador
- **Localização**: `src/lib/api-auth.ts` linha 95

### **Causa 2: Access token não está sendo incluído**
- **Sintoma**: Header Authorization não contém token válido
- **Verificação**: Verificar se `useAuthenticatedFetch` está obtendo o token corretamente
- **Localização**: `src/hooks/useAuthenticatedFetch.ts` linha 21-24

### **Causa 3: Sessão expirada**
- **Sintoma**: Usuário estava logado mas sessão expirou
- **Verificação**: Verificar se usuário precisa fazer login novamente
- **Localização**: `src/lib/api-auth.ts` linha 142-156

### **Causa 4: Problema de sincronização de cookies**
- **Sintoma**: Cookies não sincronizam entre cliente e servidor
- **Verificação**: Verificar configuração de cookies (SameSite, Secure, etc.)
- **Localização**: `src/lib/api-auth.ts` linhas 51-92

### **Causa 5: Perfil do usuário não autorizado**
- **Sintoma**: Usuário logado mas perfil não é 'wellness' ou 'admin'
- **Verificação**: Verificar perfil dos usuários "Noel" e "Monica" no banco
- **Localização**: `src/lib/api-auth.ts` linhas 238-273

---

## 🔍 Pontos de Verificação

### **1. Verificar se usuários estão logados**
```sql
-- Verificar sessões ativas
SELECT 
  u.email,
  up.perfil,
  up.is_admin,
  up.is_support
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
WHERE u.email IN (
  'email_do_noel@exemplo.com',
  'email_da_monica@exemplo.com'
);
```

### **2. Verificar perfil dos usuários**
```sql
-- Verificar se têm perfil 'wellness' ou 'admin'
SELECT 
  email,
  perfil,
  is_admin,
  is_support
FROM user_profiles
WHERE email IN (
  'email_do_noel@exemplo.com',
  'email_da_monica@exemplo.com'
);
```

### **3. Verificar logs do servidor**
- Procurar por logs: `❌ [NOEL] Autenticação falhou`
- Verificar se há informações técnicas no erro (apenas em desenvolvimento)

### **4. Verificar cookies no navegador**
- Abrir DevTools → Application → Cookies
- Verificar se existem cookies do Supabase (ex: `sb-<project>-auth-token`)

---

## 🛠️ Como Diagnosticar

### **Passo 1: Verificar no Console do Navegador**
1. Abrir DevTools (F12)
2. Ir para aba "Console"
3. Tentar enviar mensagem no NOEL
4. Verificar se há erros relacionados a autenticação

### **Passo 2: Verificar Network Tab**
1. Abrir DevTools → Network
2. Filtrar por `/api/wellness/noel`
3. Verificar a requisição:
   - **Headers**: Verificar se `Authorization: Bearer <token>` está presente
   - **Cookies**: Verificar se cookies estão sendo enviados
   - **Response**: Verificar mensagem de erro retornada

### **Passo 3: Verificar Logs do Servidor**
- Procurar por logs que começam com `🚀 [NOEL]` ou `❌ [NOEL]`
- Verificar se há `❌ [NOEL] Autenticação falhou`

---

## 📝 Código Relevante

### **Mensagem de Erro (Backend)**
```typescript
// src/lib/api-auth.ts linha 142-156
if (sessionError || !session || !session.user) {
  return NextResponse.json(
    { 
      error: 'Você precisa fazer login para continuar.',
      technical: process.env.NODE_ENV === 'development' ? {
        sessionError: sessionError?.message,
        errorCode: sessionError?.status,
        hasRequestCookies: !!requestCookies,
        cookieHeaderLength: requestCookies.length,
        hasAccessToken: !!accessToken
      } : undefined
    },
    { status: 401 }
  )
}
```

### **Tratamento de Erro (Frontend)**
```typescript
// src/app/pt/wellness/(protected)/noel/noel/page.tsx linha 259-262
if (!response.ok) {
  const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }))
  throw new Error(errorData.error || 'Erro ao processar mensagem')
}
```

---

## ✅ Próximos Passos Recomendados

1. **Verificar emails dos usuários "Noel" e "Monica"**
   - Confirmar se são emails reais ou se "Noel" se refere ao chatbot
   - Verificar se têm perfis corretos no banco

2. **Testar com usuário conhecido**
   - Fazer login com um usuário wellness conhecido
   - Tentar usar o NOEL
   - Verificar se o problema é específico ou geral

3. **Verificar logs em produção**
   - Procurar por erros de autenticação nos logs
   - Verificar informações técnicas (se disponíveis)

4. **Verificar configuração de cookies**
   - Verificar se cookies estão configurados corretamente
   - Verificar se SameSite/Secure estão corretos para o ambiente

---

## 🔗 Arquivos Relacionados

- `src/app/api/wellness/noel/route.ts` - Endpoint principal do NOEL
- `src/lib/api-auth.ts` - Função de autenticação de API
- `src/hooks/useAuthenticatedFetch.ts` - Hook de fetch autenticado
- `src/app/pt/wellness/(protected)/noel/noel/page.tsx` - Página do NOEL
- `src/lib/error-messages.ts` - Tradução de erros

---

## 📌 Notas Importantes

1. **"NOEL" pode ser confusão**: O chatbot se chama "NOEL", mas pode haver um usuário real com esse nome. Verificar se é o chatbot ou um usuário.

2. **Mensagem aparece mesmo logado**: Se o usuário está vendo a página do NOEL (que é protegida), significa que passou pela autenticação inicial. O problema pode ser específico da API.

3. **Cookies vs Token**: O sistema tenta usar cookies primeiro, depois o access token. Se ambos falharem, retorna erro 401.

4. **Ambiente de desenvolvimento**: Em desenvolvimento, o erro retorna informações técnicas que podem ajudar no diagnóstico.

---

---

## 🔄 Atualização - Teste Realizado (2025-12-16)

### **Resultado do Teste**

O usuário testou no próprio ambiente e o problema **NÃO é de autenticação/login**. O problema é no **processamento da mensagem** pela Assistants API.

### **Evidências do Console**

1. **Autenticação funcionou**:
   - `useAuth: Auth state changed: SIGNED_IN`
   - `✔ Login bem-sucedido!`
   - Perfil encontrado e carregado
   - Redirecionamento para `/pt/wellness/noel` bem-sucedido

2. **Erro no processamento**:
   - Usuário enviou: "tem sugestao para hoje ?"
   - Resposta: "Desculpe, tive um problema técnico ao processar sua mensagem..."

### **Causa Identificada**

O erro está ocorrendo em **`processMessageWithAssistant()`** (Assistants API da OpenAI):

**Localização do erro**: `src/app/api/wellness/noel/route.ts` linhas 1074-1119

**Fluxo do erro**:
1. Primeira tentativa de `processMessageWithAssistant()` → **FALHA**
2. Retry automático → **TAMBÉM FALHA**
3. Retorna mensagem genérica de erro técnico (linha 1107)

### **Possíveis Causas do Erro na Assistants API**

1. **ASSISTANT_ID não configurado ou inválido**
   - Verificar variável `OPENAI_ASSISTANT_NOEL_ID` ou `OPENAI_ASSISTANT_ID`
   - Localização: `src/lib/noel-assistant-handler.ts` linha 226-230

2. **Erro ao criar thread**
   - Problema na criação do thread da Assistants API
   - Localização: `src/lib/noel-assistant-handler.ts` linha 238-251

3. **Erro ao processar run**
   - Run falhou ou excedeu limite de iterações
   - Localização: `src/lib/noel-assistant-handler.ts` linha 510-537

4. **Rate limit da OpenAI**
   - Limite de requisições atingido
   - Localização: `src/lib/noel-assistant-handler.ts` linha 522-523

5. **Timeout**
   - Requisição demorou muito
   - Localização: `src/lib/noel-assistant-handler.ts` linha 526-527

### **Como Diagnosticar o Erro Específico**

1. **Verificar logs do servidor**:
   - Procurar por: `❌ [NOEL] Erro ao processar mensagem:`
   - Procurar por: `❌ [NOEL] Retry também falhou:`
   - Procurar por: `❌ [NOEL Handler]`

2. **Verificar variáveis de ambiente**:
   - `OPENAI_ASSISTANT_NOEL_ID` está configurado?
   - `OPENAI_API_KEY` está configurado?

3. **Verificar console do navegador**:
   - Abrir DevTools → Network
   - Filtrar por `/api/wellness/noel`
   - Verificar resposta da API (deve conter `error: true` e `errorMessage`)

### **Código que Gera a Mensagem de Erro**

```typescript
// src/app/api/wellness/noel/route.ts linha 1095-1118
} catch (retryError: any) {
  console.error('❌ [NOEL] Retry também falhou:', retryError)
  console.error('❌ [NOEL] Retry error message:', retryError.message)
  
  // Retornar resposta útil baseada na mensagem original
  let helpfulResponse = `Desculpe, tive um problema técnico ao processar sua mensagem. Mas posso te ajudar!`
  
  // ... lógica de resposta baseada no tipo de mensagem ...
  
  return NextResponse.json({
    response: helpfulResponse,
    module: intention.module,
    source: 'assistant_api',
    threadId: threadId || 'new',
    modelUsed: 'gpt-4.1-assistant',
    error: true,
    errorMessage: retryError.message || functionError.message || 'Erro ao processar mensagem'
  })
}
```

### **Próximos Passos para Resolver**

1. ✅ **Verificar logs do servidor** para ver o erro específico
2. ✅ **Verificar variáveis de ambiente** (OPENAI_ASSISTANT_NOEL_ID, OPENAI_API_KEY)
3. ✅ **Testar Assistants API diretamente** para verificar se está funcionando
4. ✅ **Verificar se há rate limit** ou problemas na conta OpenAI

---

---

## 🎯 **DIAGNÓSTICO FINAL - Logs Analisados (2025-12-16 15:13)**

### **Problemas Identificados nos Logs**

#### **1. ✅ RATE LIMIT ATINGIDO - Noel**
**Log encontrado:**
```
❌ [NOEL] Retry error message: Limite de requisições atingido. Aguarde alguns minutos.
```

**Causa**: O usuário Noel atingiu o **rate limit da OpenAI Assistants API**.

**Localização do código**: 
- `src/lib/noel-assistant-handler.ts` linha 522-523
- Detecta `rate_limit_exceeded` e retorna mensagem amigável

**Solução**:
- ⏳ **Aguardar alguns minutos** para o rate limit resetar
- 🔄 **Implementar backoff exponencial** nas requisições
- 📊 **Monitorar uso da API** para evitar atingir limites

---

#### **2. ⚠️ PERFIL DO NOEL NÃO ENCONTRADO**
**Log encontrado:**
```
[getUserProfile] Resultado: { 
  encontrado: false, 
  error: 'Cannot coerce the result to a single JSON object', 
  errorCode: 'PGF' 
}
```

**Causa**: Erro ao buscar perfil do usuário Noel no banco de dados.

**Possíveis causas**:
- Múltiplos registros retornados quando deveria ser único
- Query SQL retornando estrutura incorreta
- Problema na função `getUserProfile`

**Localização**: Endpoint `/api/noel/getUserProfile`

**Solução**:
- Verificar se há múltiplos registros para o mesmo usuário
- Corrigir query SQL para retornar objeto único
- Verificar constraints no banco de dados

---

#### **3. ⚠️ ERRO SUPABASE - rjcoaches (Possivelmente Monica)**
**Log encontrado:**
```
❌ Supabase query failed: { 
  userSlug: 'rjcoaches', 
  toolSlug: 'avaliacao-inicial', 
  error: "Could not find a relat" 
}
```

**Causa**: Erro ao buscar ferramenta 'avaliacao-inicial' para o usuário 'rjcoaches'.

**Possíveis causas**:
- Relacionamento não encontrado no banco
- Tabela ou coluna não existe
- Foreign key quebrada

**Solução**:
- Verificar se a ferramenta existe no banco
- Verificar se o usuário 'rjcoaches' existe
- Verificar relacionamentos na tabela de ferramentas

---

## 📊 **Resumo dos Problemas**

| Usuário | Problema | Status | Solução |
|---------|----------|--------|---------|
| **Noel** | Rate limit OpenAI | 🔴 **CRÍTICO** | Aguardar reset ou implementar backoff |
| **Noel** | Perfil não encontrado | 🟡 **MÉDIO** | Corrigir query SQL |
| **rjcoaches** (Monica?) | Query Supabase falhou | 🟡 **MÉDIO** | Verificar relacionamentos |

---

## ✅ **Ações Imediatas Recomendadas**

### **1. Para o Rate Limit (Urgente)**
```typescript
// Implementar backoff exponencial em src/lib/noel-assistant-handler.ts
// Adicionar delay entre requisições quando rate limit é detectado
```

### **2. Para o Perfil do Noel**
```sql
-- Verificar se há múltiplos registros
SELECT user_id, COUNT(*) 
FROM user_profiles 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'email_do_noel')
GROUP BY user_id
HAVING COUNT(*) > 1;
```

### **3. Para rjcoaches**
```sql
-- Verificar se ferramenta existe
SELECT * FROM wellness_ferramentas 
WHERE slug = 'avaliacao-inicial';

-- Verificar se usuário existe
SELECT * FROM user_profiles 
WHERE slug = 'rjcoaches';
```

---

---

## 🔧 **CORREÇÃO APLICADA - Thread ID Inválido (2025-12-16 15:20)**

### **Erro Encontrado nos Logs**

```
❌ [NOEL] Retry error message: 400 Invalid 'thread_id': 'new'. 
Expected an ID that begins with 'thread'.
```

### **Causa do Problema**

O código estava enviando a string `'new'` como `threadId` quando não havia thread existente, mas a API da OpenAI espera:
- `undefined` ou `null` para criar um novo thread
- Um ID válido que comece com `'thread_'` para usar thread existente

**NÃO aceita** a string literal `'new'`.

### **Correções Aplicadas**

#### **1. Backend (`src/app/api/wellness/noel/route.ts`)**
- ✅ Validação do `threadId` recebido: se for `'new'` ou não começar com `'thread_'`, usa `undefined`
- ✅ Removido `threadId || 'new'` e substituído por `threadId || undefined` nas respostas

#### **2. Frontend (`src/app/pt/wellness/(protected)/noel/noel/page.tsx`)**
- ✅ Validação ao carregar `threadId` do localStorage: só aceita IDs que começam com `'thread_'`
- ✅ Limpeza automática de `threadId` inválido (`'new'` ou vazio) do localStorage
- ✅ Validação ao salvar `threadId` retornado pela API

### **Arquivos Modificados**

1. `src/app/api/wellness/noel/route.ts`
   - Linha ~913: Validação do threadId recebido
   - Linha ~1047: Removido `'new'` da resposta
   - Linha ~1114: Removido `'new'` da resposta de erro

2. `src/app/pt/wellness/(protected)/noel/noel/page.tsx`
   - Linha ~104: Validação ao carregar do localStorage
   - Linha ~267: Validação ao salvar threadId retornado

### **Como Testar**

1. Limpar localStorage do navegador (ou usar modo anônimo)
2. Enviar uma mensagem no NOEL
3. Verificar que:
   - Um novo thread é criado automaticamente
   - O threadId retornado começa com `'thread_'`
   - Não há mais erro de "Invalid thread_id"

---

**Data do Diagnóstico**: 2025-12-16
**Status**: ✅ **CORRIGIDO** - Thread ID inválido corrigido. Rate limit ainda pode ocorrer se muitas requisições forem feitas.






