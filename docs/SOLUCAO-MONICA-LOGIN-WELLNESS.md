# 🔧 Solução: Monica - Problema de Login na Área Wellness

## 📋 Problema Reportado

**Usuária:** MONICA MIGUEL DA SILVA  
**Email:** mmg.monica@hotmail.com  
**Problema:** Não consegue avançar na área wellness, sempre pede para fazer login  
**Tentativas:** Já fez login, saiu e voltou, tentou aba anônima

---

## 🔍 Diagnóstico Passo a Passo

### **Passo 1: Verificar Banco de Dados**

Execute o script SQL de diagnóstico completo:

```bash
# Arquivo: scripts/08-diagnostico-monica-login-wellness.sql
```

Este script verifica:
- ✅ Usuário existe e email confirmado
- ✅ Perfil = 'wellness'
- ✅ Assinatura wellness ativa
- ✅ Múltiplos perfis/assinaturas (pode causar conflito)
- ✅ Bloqueios de rate limit
- ✅ Perfil NOEL

**Resultado Esperado:** Se tudo estiver OK no banco, o problema é no navegador/cookies.

---

### **Passo 2: Verificar no Navegador da Monica**

Peça para a Monica fazer o seguinte:

#### **2.1. Abrir DevTools (F12)**

1. Abrir o navegador
2. Pressionar **F12** (ou clicar com botão direito → Inspecionar)
3. Ir na aba **Console**

#### **2.2. Verificar Sessão Ativa**

No console, executar:

```javascript
// Verificar se há sessão ativa
const { createClient } = require('@supabase/supabase-js')
// Ou verificar localStorage diretamente:
Object.keys(localStorage).filter(k => k.includes('supabase') || k.includes('auth'))
```

#### **2.3. Verificar Cookies**

1. No DevTools, ir em **Application** (Chrome) ou **Storage** (Firefox)
2. Clicar em **Cookies** → selecionar o domínio do site
3. Procurar por cookies do Supabase:
   - `sb-<project>-auth-token`
   - `sb-<project>-auth-token.0`
   - `sb-<project>-auth-token.1`

**Se não existirem:** Cookies não estão sendo salvos (problema de configuração)

#### **2.4. Testar Requisição NOEL**

1. Ir na aba **Network** do DevTools
2. Filtrar por `/api/wellness/noel`
3. Tentar usar o NOEL (enviar uma mensagem)
4. Clicar na requisição que falhou
5. Verificar:

**Headers (Request):**
- ✅ `Cookie:` deve conter cookies do Supabase
- ✅ `Authorization: Bearer <token>` deve estar presente

**Response:**
- Verificar mensagem de erro exata
- Verificar status code (deve ser 401 se autenticação falhou)

**Screenshot necessário:**
- Aba **Headers** (mostrando cookies e Authorization)
- Aba **Response** (mostrando resposta do servidor)
- Aba **Console** (qualquer erro JavaScript)

---

## ✅ Soluções Implementadas

### **1. Melhorias no useAuthenticatedFetch** ✅

**Arquivo:** `src/hooks/useAuthenticatedFetch.ts`

**Melhorias:**
- ✅ Tenta múltiplas estratégias para obter token:
  1. `getSession()` (padrão)
  2. `getUser()` + `refreshSession()` (valida com servidor)
  3. Tentativa final com `getSession()`
- ✅ Logs detalhados em desenvolvimento
- ✅ Fallback robusto quando token não é encontrado

**Como funciona:**
```typescript
1. Tenta getSession() até 3 segundos
2. Se falhar, tenta getUser() + refreshSession()
3. Se ainda falhar, tenta getSession() uma última vez
4. Se conseguir token, adiciona no header Authorization
5. Sempre inclui credentials: 'include' para cookies
```

---

## 🔧 Soluções para Testar

### **Solução 1: Limpar Cache e Cookies Completamente**

**Instruções para Monica:**

1. **Fazer logout** da aplicação
2. **Fechar todas as abas** do navegador
3. **Limpar dados do navegador:**
   - Chrome: Configurações → Privacidade → Limpar dados de navegação
   - Selecionar: Cookies e dados de sites, Cache
   - Período: Última hora
4. **Fechar completamente o navegador** (não apenas a aba)
5. **Abrir navegador novamente**
6. **Fazer login novamente**
7. **Tentar usar NOEL**

---

### **Solução 2: Verificar Extensões do Navegador**

Algumas extensões podem bloquear cookies:

1. **Desabilitar extensões temporariamente:**
   - Chrome: chrome://extensions/
   - Firefox: about:addons
2. **Especialmente verificar:**
   - Bloqueadores de anúncios (AdBlock, uBlock Origin)
   - Extensões de privacidade (Privacy Badger, Ghostery)
   - Extensões de segurança
3. **Testar em modo anônimo SEM extensões:**
   - Chrome: Ctrl+Shift+N (ou Cmd+Shift+N no Mac)
   - Firefox: Ctrl+Shift+P (ou Cmd+Shift+P no Mac)
   - Fazer login e testar NOEL

---

### **Solução 3: Verificar Configurações de Cookies**

**Chrome:**
1. Configurações → Privacidade e segurança → Cookies
2. Verificar se não está bloqueando cookies de terceiros
3. Verificar se o site não está na lista de bloqueados

**Firefox:**
1. Configurações → Privacidade e segurança → Cookies e dados do site
2. Verificar se não está bloqueando cookies

---

### **Solução 4: Testar em Outro Navegador**

Se o problema persistir:
1. Testar em outro navegador (Chrome, Firefox, Edge, Safari)
2. Se funcionar em outro navegador → problema específico do navegador
3. Se não funcionar em nenhum → problema no servidor/backend

---

### **Solução 5: Verificar se Token está Sendo Enviado**

**No console do navegador, executar:**

```javascript
// Verificar se há sessão e token
const supabase = window.supabase || (await import('@/lib/supabase-client')).createClient()
const { data: { session } } = await supabase.auth.getSession()
console.log('Sessão:', session ? 'OK' : 'NÃO ENCONTRADA')
console.log('Token:', session?.access_token ? 'PRESENTE' : 'AUSENTE')
console.log('Token (primeiros 20 chars):', session?.access_token?.substring(0, 20))
```

**Se não houver sessão:**
- Problema de autenticação no cliente
- Precisa fazer login novamente

**Se houver sessão mas não token:**
- Problema de sincronização
- Tentar refresh: `await supabase.auth.refreshSession()`

---

## 🚨 Se Nada Funcionar

### **Última Solução: Resetar Sessão no Banco**

Se todas as soluções acima falharem, pode ser necessário resetar a sessão no banco:

```sql
-- ATENÇÃO: Use apenas como último recurso
-- Isso vai forçar a Monica a fazer login novamente

-- Verificar sessões ativas (se possível)
-- Nota: Supabase gerencia sessões internamente, mas podemos verificar

-- Verificar se há algum problema específico com o usuário
SELECT * FROM auth.users WHERE email = 'mmg.monica@hotmail.com';

-- Se necessário, forçar logout de todas as sessões
-- (isso requer acesso admin ao Supabase Dashboard)
```

**Alternativa:** Pedir para Monica fazer logout e login novamente, mas desta vez:
1. Limpar cookies ANTES de fazer login
2. Fazer login
3. Verificar se cookies foram criados
4. Tentar usar NOEL imediatamente após login

---

## 📊 Checklist de Diagnóstico

- [ ] Executar script SQL de diagnóstico
- [ ] Verificar Console do navegador (erros JavaScript)
- [ ] Verificar Network tab (requisições HTTP)
- [ ] Verificar se cookies estão sendo enviados
- [ ] Verificar se Authorization header está presente
- [ ] Verificar resposta do servidor (status code, mensagem)
- [ ] Limpar cookies e fazer login novamente
- [ ] Testar em modo anônimo
- [ ] Testar em outro navegador
- [ ] Verificar extensões do navegador
- [ ] Verificar configurações de cookies do navegador

---

## 🔗 Arquivos Relacionados

- `src/hooks/useAuthenticatedFetch.ts` - Hook de fetch autenticado (melhorado)
- `src/lib/api-auth.ts` - Autenticação de API (já tem fallback)
- `src/app/api/wellness/noel/route.ts` - Endpoint do NOEL
- `scripts/08-diagnostico-monica-login-wellness.sql` - Script de diagnóstico

---

## 💡 Hipótese Principal

Baseado no código e nos sintomas, a hipótese é que:

1. **A Monica consegue acessar a página** → Autenticação server-side funciona (cookies OK)
2. **Mas não consegue usar NOEL** → Autenticação de API falha (cookies não sendo enviados OU token não no header)

**Possíveis causas:**
- Cookies não estão sendo enviados nas requisições fetch
- Access token não está sendo obtido pelo `useAuthenticatedFetch`
- Race condition: requisição sendo feita antes da sessão carregar

**Solução implementada:**
- ✅ `useAuthenticatedFetch` agora tenta múltiplas estratégias
- ✅ Aguarda até 3 segundos para sessão carregar
- ✅ Tenta refresh da sessão se necessário
- ✅ Logs detalhados para debug

---

**Data:** 2025-12-17  
**Status:** ⚠️ **Aguardando diagnóstico completo do navegador da Monica**




