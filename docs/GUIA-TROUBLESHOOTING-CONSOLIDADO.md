# 🔧 GUIA CONSOLIDADO: Troubleshooting - Problemas Comuns e Soluções

**Objetivo:** Documentar problemas comuns e suas soluções para facilitar resolução rápida  
**Última atualização:** Hoje  
**Versão:** 1.0.0

---

## 📋 ÍNDICE RÁPIDO

1. [Autenticação e Acesso](#1-autenticação-e-acesso)
2. [Dashboard e Carregamento](#2-dashboard-e-carregamento)
3. [Checkout e Pagamentos](#3-checkout-e-pagamentos)
4. [E-mails](#4-e-mails)
5. [Templates e Ferramentas](#5-templates-e-ferramentas)
6. [Banco de Dados](#6-banco-de-dados)
7. [Deploy e Produção](#7-deploy-e-produção)
8. [Cache e Navegador](#8-cache-e-navegador)

---

## 1. AUTENTICAÇÃO E ACESSO

### 🔴 Problema: Loop Infinito "Carregando perfil..."

**Sintomas:**
- Dashboard fica travado em "Carregando perfil..."
- Console mostra: "Perfil não carregou ainda, mas allowAdmin=true e loadingTimeout passou"
- Funciona em localhost, mas não em produção

**Causa:**
- `RequireSubscription` bloqueando acesso mesmo quando `ProtectedRoute` já permitiu
- `profileCheckTimeout` não está sendo verificado corretamente

**Solução:**
```typescript
// Verificar diretamente o timeout, sem depender de canBypass
if (profileCheckTimeout && !userProfile && user && !authLoading) {
  return <>{children}</>
}
```

**Arquivo:** `src/components/auth/RequireSubscription.tsx` (linha 268)

**Status:** ✅ Resolvido

---

### 🔴 Problema: Redirecionamento Infinito

**Sintomas:**
- Página fica redirecionando entre login e dashboard
- Loop de redirecionamento

**Soluções Rápidas:**
1. Limpar cache do navegador (Ctrl+Shift+Delete)
2. Limpar cookies do site
3. Testar em modo anônimo
4. Verificar console (F12) por erros

**Verificações:**
- [ ] `ProtectedRoute` não está redirecionando incorretamente
- [ ] `useAuth` não está causando loop
- [ ] Cookies estão sendo setados corretamente

---

### 🔴 Problema: "useAuth must be used within AuthProvider"

**Sintomas:**
- Erro: "Cannot read properties of undefined (reading 'call')"
- Página não carrega

**Causa:**
- Context Provider não está configurado corretamente
- Componente usando `useAuth` fora do `AuthProvider`

**Solução:**
- Verificar se `AuthProvider` está no layout raiz
- Verificar se todos os componentes usam `useAuth` do contexto

**Status:** ⚠️ Context Provider foi revertido (causou problemas)

---

## 2. DASHBOARD E CARREGAMENTO

### 🔴 Problema: Dashboard Não Carrega

**Sintomas:**
- Página fica em loading infinito
- Console mostra erros

**Soluções:**
1. **Limpar cache do Next.js:**
   ```bash
   rm -rf .next
   npm run dev
   ```

2. **Verificar variáveis de ambiente:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Verificar console do navegador:**
   - Abrir DevTools (F12)
   - Verificar erros em vermelho
   - Enviar logs para análise

---

### 🔴 Problema: "Internal Server Error"

**Sintomas:**
- Erro 500 em produção
- Página não carrega

**Soluções:**
1. **Limpar cache do Next.js:**
   ```bash
   rm -rf .next
   ```

2. **Reiniciar servidor:**
   ```bash
   pkill -f "next dev"
   npm run dev
   ```

3. **Verificar logs do Vercel:**
   - Acessar Vercel Dashboard
   - Ver logs do último deploy
   - Identificar erro específico

---

## 3. CHECKOUT E PAGAMENTOS

### 🔴 Problema: Checkout Travando "Carregando..."

**Sintomas:**
- Botão "Continuar para Pagamento" fica em "Carregando..."
- Não redireciona para Mercado Pago

**Soluções:**
1. **Verificar console do navegador:**
   - Abrir DevTools (F12)
   - Verificar erros JavaScript
   - Verificar logs de requisição

2. **Verificar logs da API:**
   - Vercel → Functions → `/api/wellness/checkout`
   - Verificar se requisição chegou
   - Verificar se Mercado Pago respondeu

3. **Verificar credenciais:**
   - `MERCADOPAGO_ACCESS_TOKEN` configurado
   - Token válido e não expirado

**Timeout:** 30 segundos (se demorar mais, mostra erro)

---

### 🔴 Problema: Checkout Redirecionando para Login

**Sintomas:**
- Página de checkout redireciona para login
- Não mostra opções de pagamento

**Causa:**
- Página de checkout não deve usar `ProtectedRoute`
- Login é exigido apenas ao clicar em "Continuar para Pagamento"

**Solução:**
- Verificar se `checkout/page.tsx` não tem `ProtectedRoute`
- Verificar se `useAuth` não está causando redirecionamento

---

### 🔴 Problema: Parcelamento Não Aparece

**Sintomas:**
- Plano anual não mostra opções de parcelamento
- Apenas opção "À vista" aparece

**Soluções:**
1. **Verificar configuração no Mercado Pago:**
   - Acessar: https://www.mercadopago.com.br/
   - "Seu Negócio" → "Custos" → "Configurar parcelamento"
   - Habilitar "Parcelado cliente" (com juros)
   - Definir número máximo de parcelas: 12

2. **Verificar se está em modo TESTE:**
   - Sandbox pode não mostrar parcelamento
   - Testar com credenciais de PRODUÇÃO

3. **Verificar tipo de cartão:**
   - Parcelamento funciona apenas com **cartão de crédito**
   - Cartões de débito não oferecem parcelamento

**Documentação:** `docs/TROUBLESHOOTING-PARCELAMENTO-NAO-APARECE.md`

---

### 🔴 Problema: PIX/Boleto Não Aparecem

**Sintomas:**
- Apenas cartão de crédito aparece
- PIX e Boleto não estão disponíveis

**Soluções:**
1. **Verificar configuração no Mercado Pago:**
   - "Seu Negócio" → "Formas de pagamento"
   - Habilitar PIX e Boleto

2. **Verificar código:**
   - `src/lib/mercado-pago.ts`
   - Verificar se PIX está habilitado
   - Verificar se chave PIX está configurada

---

### 🔴 Problema: Erro no Cartão de Teste

**Sintomas:**
- "Não é possível continuar o pagamento com este cartão"
- Erro JavaScript no checkout

**Soluções:**
1. **Limpar cache do navegador**
2. **Tentar em modo anônimo**
3. **Tentar outro navegador**
4. **Aguardar alguns minutos** (pode ser problema temporário do sandbox)

**Cartões de Teste:**
- Mastercard: `5031 4332 1540 6351`
- CVV: `123`
- Data: Qualquer data futura

---

## 4. E-MAILS

### 🔴 Problema: E-mails Não Estão Sendo Enviados

**Sintomas:**
- E-mails de boas-vindas não chegam
- E-mails de recuperação não chegam
- API retorna 200, mas e-mail não é enviado

**Diagnóstico Passo a Passo:**

#### 1. Verificar Variáveis de Ambiente
- `RESEND_API_KEY` configurada no Vercel
- `RESEND_FROM_EMAIL` = `noreply@ylada.com`
- `RESEND_FROM_NAME` = `YLADA`

#### 2. Testar API de E-mail
```bash
curl -X POST https://www.ylada.com/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"email": "seu-email@gmail.com"}'
```

**Resultado esperado:**
```json
{
  "success": true,
  "message": "E-mail de teste enviado com sucesso!",
  "emailId": "abc123...",
  "from": "noreply@ylada.com",
  "to": "seu-email@gmail.com"
}
```

#### 3. Verificar Logs no Vercel
- Vercel → Functions → Logs
- Procurar por: `📧 Tentando enviar e-mail`
- Verificar se há erros

#### 4. Verificar Logs no Resend
- Acessar: https://resend.com/logs
- Verificar se há tentativas de envio
- Verificar status dos e-mails

**Problemas Comuns:**
- ❌ API Key inválida → Verificar se está correta
- ❌ Domínio não verificado → Verificar se `ylada.com` está verificado
- ❌ FROM_EMAIL incorreto → Deve ser `noreply@ylada.com`
- ❌ Variáveis não aplicadas → Fazer novo deploy após alterar

**Documentação:** `docs/TROUBLESHOOTING-EMAIL-NAO-ENVIADO.md`

---

## 5. TEMPLATES E FERRAMENTAS

### 🔴 Problema: Template Não Aparece

**Sintomas:**
- Template não aparece na lista
- Template não carrega

**Soluções:**
1. **Verificar banco de dados:**
   ```sql
   SELECT * FROM templates_nutrition 
   WHERE profession = 'wellness' 
   AND is_active = true;
   ```

2. **Verificar se está ativo:**
   - `is_active = true`
   - `profession` correto
   - `language` correto

3. **Verificar API:**
   - `/api/wellness/templates`
   - Verificar se retorna o template

---

### 🔴 Problema: Preview Não Funciona

**Sintomas:**
- Preview não carrega
- Erro ao abrir preview

**Soluções:**
1. **Verificar diagnóstico:**
   - Arquivo existe em `src/lib/diagnostics/wellness/`
   - Import está correto

2. **Verificar console:**
   - Erros JavaScript
   - Erros de import

---

## 6. BANCO DE DADOS

### 🔴 Problema: "Column does not exist"

**Sintomas:**
- Erro: "Could not find the 'X' column in the schema cache"
- Query falha

**Soluções:**
1. **Verificar se coluna existe:**
   ```sql
   SELECT column_name 
   FROM information_schema.columns 
   WHERE table_name = 'user_profiles';
   ```

2. **Criar coluna se não existir:**
   ```sql
   ALTER TABLE user_profiles 
   ADD COLUMN IF NOT EXISTS nome_coluna TYPE;
   ```

---

### 🔴 Problema: "Foreign key constraint"

**Sintomas:**
- Erro ao inserir/atualizar
- Foreign key não encontrada

**Soluções:**
1. **Verificar se registro existe:**
   ```sql
   SELECT * FROM tabela_referenciada WHERE id = 'xxx';
   ```

2. **Criar registro se não existir**

---

## 7. DEPLOY E PRODUÇÃO

### 🔴 Problema: Deploy Falha

**Sintomas:**
- Build falha no Vercel
- Erro de compilação

**Soluções:**
1. **Verificar logs do build:**
   - Vercel → Deployments → Último deploy
   - Verificar erros de compilação

2. **Testar build localmente:**
   ```bash
   npm run build
   ```

3. **Verificar variáveis de ambiente:**
   - Todas as variáveis necessárias estão configuradas
   - Valores estão corretos

---

### 🔴 Problema: Variáveis de Ambiente Não Funcionam

**Sintomas:**
- Variáveis não são carregadas
- Valores são `undefined`

**Soluções:**
1. **Verificar se variável começa com `NEXT_PUBLIC_`:**
   - Variáveis do cliente devem começar com `NEXT_PUBLIC_`
   - Variáveis do servidor não precisam

2. **Fazer novo deploy:**
   - Variáveis só são aplicadas em novos deploys
   - Após alterar, fazer novo deploy

3. **Verificar se está no ambiente correto:**
   - Produção vs Preview
   - Variáveis podem ser diferentes

---

## 8. CACHE E NAVEGADOR

### 🔴 Problema: Página Mostra Versão Antiga

**Sintomas:**
- Mudanças não aparecem
- Página mostra código antigo

**Soluções:**

#### 1. Limpar Cache do Navegador
**Chrome/Edge:**
- `Ctrl+Shift+Delete` (Windows) ou `Cmd+Shift+Delete` (Mac)
- Selecionar "Imagens e arquivos em cache"
- Limpar dados

**Firefox:**
- `Ctrl+Shift+Delete`
- Selecionar "Cache"
- Limpar agora

**Safari:**
- Menu Safari → Preferências → Avançado
- Marcar "Mostrar menu Desenvolvedor"
- Menu Desenvolvedor → Limpar Caches

#### 2. Hard Refresh
- `Ctrl+F5` (Windows) ou `Cmd+Shift+R` (Mac)
- Força recarregar sem cache

#### 3. Limpar Cache do Next.js
```bash
rm -rf .next
npm run dev
```

#### 4. Limpar Cookies
- DevTools (F12) → Application → Cookies
- Deletar cookies do site
- Recarregar página

---

### 🔴 Problema: Página Funciona em Modo Anônimo Mas Não Normal

**Sintomas:**
- Funciona em janela anônima
- Não funciona em janela normal

**Causa:** Cache ou cookies corrompidos

**Solução:**
1. Limpar cache (ver acima)
2. Limpar cookies
3. Desabilitar extensões (podem interferir)

---

## 📋 CHECKLIST GERAL DE TROUBLESHOOTING

### Antes de Reportar um Problema:

- [ ] Limpei o cache do navegador
- [ ] Testei em modo anônimo
- [ ] Limpei os cookies
- [ ] Verifiquei o console (F12) por erros
- [ ] Testei em outro navegador
- [ ] Verifiquei se JavaScript está habilitado
- [ ] Verifiquei as variáveis de ambiente
- [ ] Verifiquei os logs do Vercel
- [ ] Testei em localhost (se aplicável)
- [ ] Verifiquei se o problema é específico de produção

---

## 🔍 COMO COLETAR INFORMAÇÕES PARA DEBUG

### 1. Console do Navegador
1. Abrir DevTools (F12)
2. Aba **Console**
3. Copiar todos os erros (vermelho)
4. Copiar logs relevantes

### 2. Network Tab
1. DevTools → **Network**
2. Reproduzir o problema
3. Filtrar por "XHR" ou "Fetch"
4. Verificar requisições que falharam
5. Copiar URL, status, e resposta

### 3. Logs do Vercel
1. Acessar: https://vercel.com/dashboard
2. Seu projeto → **Deployments** → Último deploy
3. **Functions** → Rota específica
4. Verificar logs de invocações

### 4. Logs do Supabase
1. Acessar: https://supabase.com/dashboard
2. Seu projeto → **Logs**
3. Filtrar por tipo de log
4. Verificar erros

---

## 📚 REFERÊNCIAS RÁPIDAS

### Documentos Relacionados:
- `TROUBLESHOOTING-CHECKOUT-TRAVANDO.md`
- `TROUBLESHOOTING-EMAIL-NAO-ENVIADO.md`
- `TROUBLESHOOTING-PARCELAMENTO-NAO-APARECE.md`
- `TROUBLESHOOTING-MERCADO-PAGO.md`
- `TROUBLESHOOTING-PIX-NAO-CRIA-PAGAMENTO.md`
- `DEBUG-CHECKOUT-CARREGANDO.md`
- `ANALISE-LOOP-INFINITO-PRODUCAO.md`

### Links Úteis:
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Resend Dashboard:** https://resend.com/logs
- **Mercado Pago Dashboard:** https://www.mercadopago.com.br/developers/panel

---

## ✅ CONCLUSÃO

Este guia consolida os problemas mais comuns e suas soluções. Se um problema não estiver listado aqui:

1. Verificar logs (console, Vercel, Supabase)
2. Coletar informações (screenshots, erros, passos para reproduzir)
3. Consultar documentação específica (ver referências acima)
4. Verificar se é problema conhecido (buscar em issues/documentação)

---

**Última atualização:** Hoje  
**Versão:** 1.0.0  
**Mantido por:** Equipe YLADA

