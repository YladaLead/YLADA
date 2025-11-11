# 🔍 Debug: Checkout Ficando Carregando

## ⚠️ PROBLEMA

A página de checkout fica com o botão "Carregando..." sem parar.

---

## ✅ CORREÇÕES APLICADAS

1. **Timeout de 30 segundos** - Se a requisição demorar mais de 30s, mostra erro
2. **Logs detalhados** - Cada etapa do processo é logada
3. **Métricas de tempo** - Mostra quanto tempo cada etapa leva
4. **Melhor tratamento de erros** - Mostra mensagens de erro mais claras

---

## 🔍 COMO VERIFICAR O PROBLEMA

### 1. Verificar Console do Navegador

1. Abra a página de checkout
2. Pressione `F12` (ou `Cmd+Option+I` no Mac)
3. Vá na aba **Console**
4. Clique em "Continuar para Pagamento"
5. Veja os logs que aparecem

**O que procurar:**
- `📤 Enviando requisição de checkout...`
- `📥 Resposta recebida:` (deve aparecer em até 30s)
- `✅ Dados recebidos:` (se sucesso)
- `❌ Erro no checkout:` (se erro)

**Me envie os logs que aparecerem!**

---

### 2. Verificar Logs da API no Vercel

1. Acesse: https://vercel.com/dashboard
2. Seu projeto → **Deployments** → Último deploy
3. Clique em **Functions** → `/api/wellness/checkout`
4. Veja os logs de invocações recentes

**O que procurar:**
- `📥 Checkout request recebido`
- `📋 Body recebido:`
- `🔄 Iniciando criação de checkout...`
- `✅ Checkout criado em Xms:`
- `⏱️ Tempo total do request: Xms`
- `❌ Erro ao criar checkout:` (se erro)

**Me envie os logs que aparecerem!**

---

### 3. Verificar Erros Comuns

#### Erro: "A requisição demorou muito"
**Causa:** API do Mercado Pago está demorando mais de 30s
**Solução:** Verificar logs do Vercel para ver onde está travando

#### Erro: "URL de checkout não retornada"
**Causa:** API do Mercado Pago não retornou URL
**Solução:** Verificar credenciais do Mercado Pago

#### Erro: "baseUrl inválido"
**Causa:** Variável de ambiente não configurada
**Solução:** Adicionar `NEXT_PUBLIC_APP_URL_PRODUCTION` no Vercel

---

## 🎯 PRÓXIMOS PASSOS

1. **Tente novamente** o checkout
2. **Verifique o console** do navegador (F12)
3. **Verifique os logs** no Vercel
4. **Me envie:**
   - Screenshot do console do navegador
   - Logs do Vercel (Functions → `/api/wellness/checkout`)
   - Mensagem de erro (se aparecer)

---

**Última atualização:** 11/11/2025

