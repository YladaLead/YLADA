# 🔧 Correção: Problema na Recuperação de Senha

## 🐛 Problemas Identificados

### 1. **Link do Supabase apontando para domínio errado**
- O Supabase retorna `action_link` que aponta para o próprio domínio do Supabase (ex: `https://[project].supabase.co/auth/v1/verify?token=...`)
- Quando o usuário clicava no link, era redirecionado para o Supabase em vez da aplicação
- O token não estava sendo extraído corretamente do `action_link`

### 2. **Token não sendo decodificado corretamente**
- Tokens codificados na URL (com `%`) não estavam sendo decodificados antes da verificação
- Isso causava falha na verificação do token pelo Supabase

### 3. **Mensagens de erro pouco claras**
- Erros genéricos não ajudavam o usuário a entender o problema
- Falta de logs detalhados para debug

### 4. **Verificação prematura do token**
- A rota `/auth/v1/verify` estava tentando verificar o token antes de redirecionar, consumindo-o prematuramente
- O token só pode ser usado uma vez, então isso impedia o reset de senha

## ✅ Correções Implementadas

### 1. **Extração e construção correta do link** (`/api/auth/forgot-password/route.ts`)
- ✅ Extrai o token do `action_link` do Supabase
- ✅ Constrói link direto para `/auth/v1/verify` da aplicação em vez de usar o link do Supabase
- ✅ Suporta múltiplos formatos de retorno do Supabase (`action_link`, `hashed_token`, `otp_hash`, `verification_url`)
- ✅ Sempre usa o domínio da aplicação (`baseUrl`) em vez do domínio do Supabase

**Antes:**
```typescript
if (linkData.properties?.action_link) {
  resetLink = linkData.properties.action_link // ❌ Aponta para Supabase
}
```

**Depois:**
```typescript
if (linkData.properties?.action_link) {
  const actionLinkUrl = new URL(linkData.properties.action_link)
  const token = actionLinkUrl.searchParams.get('token')
  if (token) {
    resetLink = `${baseUrl}/auth/v1/verify?token=${encodeURIComponent(token)}&type=${type}`
    // ✅ Link direto para nossa aplicação
  }
}
```

### 2. **Decodificação do token nas páginas de reset**
- ✅ Decodifica tokens codificados na URL antes de verificar
- ✅ Aplicado em todas as páginas de reset: Wellness, Nutri, Coach e Admin

**Código adicionado:**
```typescript
// Decodificar token se estiver codificado na URL
let decodedToken = token
try {
  if (token.includes('%')) {
    decodedToken = decodeURIComponent(token)
    console.log('✅ Token decodificado da URL')
  }
} catch (decodeErr) {
  console.warn('⚠️ Não foi possível decodificar token, usando original:', decodeErr)
  decodedToken = token
}
```

### 3. **Melhorias na rota `/auth/v1/verify`**
- ✅ Não verifica o token prematuramente (não consome o token)
- ✅ Apenas determina a área e redireciona para a página de reset
- ✅ O token é verificado apenas quando o usuário submete o formulário de reset

**Antes:**
```typescript
const { data: verifyData } = await supabase.auth.verifyOtp({
  token_hash: token,
  type: 'recovery',
}) // ❌ Consome o token prematuramente
```

**Depois:**
```typescript
// IMPORTANTE: Não verificar o token aqui, pois isso consumiria o token
// O token será verificado na página de reset quando o usuário submeter o formulário
// Apenas redirecionar com o token na URL
```

### 4. **Mensagens de erro mais claras**
- ✅ Mensagens específicas para token expirado
- ✅ Mensagens específicas para token inválido
- ✅ Logs detalhados para debug

**Exemplo:**
```typescript
let errorMessage = 'Token inválido ou expirado. Solicite um novo link de reset.'
if (verifyError.message?.includes('expired') || verifyError.message?.includes('expirado')) {
  errorMessage = 'O link de recuperação expirou. Por favor, solicite um novo link de reset de senha.'
} else if (verifyError.message?.includes('invalid') || verifyError.message?.includes('inválido')) {
  errorMessage = 'Link de recuperação inválido. Por favor, solicite um novo link de reset de senha.'
}
```

## 📋 Arquivos Modificados

1. ✅ `/src/app/api/auth/forgot-password/route.ts`
   - Extração correta do token do `action_link`
   - Construção de link direto para aplicação

2. ✅ `/src/app/auth/v1/verify/route.ts`
   - Removida verificação prematura do token
   - Apenas redireciona com token na URL

3. ✅ `/src/app/pt/wellness/reset-password/page.tsx`
   - Decodificação do token
   - Mensagens de erro melhoradas
   - Logs detalhados

4. ✅ `/src/app/pt/nutri/reset-password/page.tsx`
   - Decodificação do token
   - Mensagens de erro melhoradas

5. ✅ `/src/app/pt/coach/reset-password/page.tsx`
   - Decodificação do token
   - Mensagens de erro melhoradas

6. ✅ `/src/app/admin/reset-password/page.tsx`
   - Decodificação do token
   - Mensagens de erro melhoradas

## 🔍 Como Testar

1. **Teste de recuperação de senha:**
   - Acesse `/pt/wellness/recuperar-senha` (ou nutri/coach)
   - Digite um email válido
   - Verifique se recebe o email
   - Clique no link do email
   - Verifique se redireciona para a página de reset
   - Defina uma nova senha
   - Verifique se consegue fazer login com a nova senha

2. **Verificar logs:**
   - Console do servidor deve mostrar:
     - `✅ Extraído token do action_link e construído link direto para aplicação`
     - `✅ Token decodificado da URL`
     - `✅ Token verificado, atualizando senha...`

3. **Teste de erro:**
   - Use um link expirado (aguarde 1 hora)
   - Deve mostrar mensagem clara: "O link de recuperação expirou"

## ⚠️ Configurações Necessárias

### Supabase Dashboard
Certifique-se de que as seguintes URLs estão configuradas em **Authentication → URL Configuration**:

- Site URL: `https://www.ylada.com`
- Redirect URLs:
  - `https://www.ylada.com/auth/callback`
  - `https://www.ylada.com/auth/v1/verify` ⬅️ **IMPORTANTE**
  - `https://www.ylada.com/pt/wellness/reset-password`
  - `https://www.ylada.com/pt/nutri/reset-password`
  - `https://www.ylada.com/pt/coach/reset-password`
  - `https://www.ylada.com/admin/reset-password`

### Variáveis de Ambiente
Certifique-se de que estão configuradas:
- `NEXT_PUBLIC_SITE_URL=https://www.ylada.com` (ou `NEXT_PUBLIC_APP_URL_PRODUCTION`)
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY` (para envio de emails)

## 📝 Notas Importantes

1. **Token único:** O token de recovery só pode ser usado uma vez. Se o usuário clicar no link novamente, precisará solicitar um novo link.

2. **Validade:** O link de recovery expira em 1 hora (configuração padrão do Supabase).

3. **Segurança:** O sistema sempre retorna sucesso na solicitação de reset (mesmo se o email não existir) para não revelar quais emails estão cadastrados.

4. **Logs:** Todos os logs importantes estão no console do servidor para facilitar debug em caso de problemas.

## 🔒 Validação de Segurança: Impedir Reutilização de Senha

### Problema
Usuários podiam reutilizar a mesma senha antiga após recuperar/resetar a senha, o que é uma falha de segurança.

### Solução Implementada
- ✅ Validação que verifica se a nova senha é diferente da senha atual
- ✅ Antes de atualizar, tenta fazer login com a nova senha
- ✅ Se o login funcionar, significa que a senha é a mesma e rejeita a atualização
- ✅ Aplicado em todas as páginas de reset: Wellness, Nutri, Coach e Admin

**Código adicionado:**
```typescript
// Verificar se a nova senha é diferente da senha atual
const { data: testLogin, error: testError } = await tempSupabase.auth.signInWithPassword({
  email: userEmail,
  password: password
})

if (!testError && testLogin?.session) {
  setError('A nova senha deve ser diferente da senha atual. Por favor, escolha uma senha diferente.')
  return
}
```

## ✅ Status

- ✅ Correção implementada
- ✅ Validação de segurança adicionada (impedir reutilização de senha)
- ✅ Testes recomendados antes de deploy em produção
- ✅ Documentação atualizada
