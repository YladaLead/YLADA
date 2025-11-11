# 🔍 Como Encontrar a Função do Webhook no Vercel

## ⚠️ IMPORTANTE

Os logs gerais (`/logs`) mostram apenas requisições HTTP normais (GET, POST, etc.).
**Para ver os logs do webhook, você precisa ir em Functions, não em Logs!**

---

## 📋 PASSO A PASSO CORRETO

### 1. Acessar o Deploy Específico

1. Acesse: https://vercel.com/dashboard
2. Clique em **"Ylada's projects"** (ou seu projeto)
3. Clique em **"Deployments"** no menu lateral
4. Clique no **último deploy** (o mais recente, com o ID mais recente)

---

### 2. Ir em Functions (NÃO em Logs)

1. Na página do deploy, você verá várias abas no topo:
   - **Deployment** (padrão)
   - **Logs** ← NÃO é aqui!
   - **Resources**
   - **Source**
   - **Open Graph**

2. **NÃO clique em "Logs"** - isso mostra apenas requisições HTTP gerais

3. **Clique em "Functions"** (ou procure por "Functions" na página)

---

### 3. Encontrar a Função do Webhook

1. Na lista de Functions, procure por:
   - `/api/webhooks/mercado-pago`
   - Ou apenas `mercado-pago`

2. Você verá uma lista de funções com:
   - Nome da rota
   - Número de invocações
   - Última invocação
   - Status

---

### 4. Ver os Logs da Função

1. Clique na função `/api/webhooks/mercado-pago`
2. Você verá:
   - Lista de invocações recentes
   - Status de cada invocação (200, 500, etc.)
   - Tempo de execução
   - Logs detalhados de cada invocação

---

## 🎯 ALTERNATIVA: Filtrar Logs por Rota

Se não encontrar "Functions", tente filtrar os logs:

1. Vá em **Logs** (geral)
2. No filtro **"Route"** (lado esquerdo), procure por:
   - `api/webhooks/mercado-pago`
   - Ou digite `webhook` na busca

---

## 📸 O QUE VOCÊ DEVE VER

### ✅ **Se o webhook foi chamado:**

Você verá uma entrada com:
- **Request:** `POST /api/webhooks/mercado-pago`
- **Status:** `200` (sucesso) ou `500` (erro)
- **Time:** Data/hora da invocação
- **Logs:** Detalhes do processamento

### ❌ **Se o webhook NÃO foi chamado:**

- Não haverá nenhuma entrada para `/api/webhooks/mercado-pago`
- Isso significa que o Mercado Pago não está chamando o webhook

---

## 🔍 VERIFICAR SE WEBHOOK ESTÁ CONFIGURADO

Se não encontrar nenhuma invocação, o problema pode ser:

1. **Webhook não configurado no Mercado Pago**
2. **URL do webhook incorreta**
3. **Webhook configurado mas não está sendo chamado**

### Como verificar no Mercado Pago:

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em **"Webhooks"** ou **"Notificações"**
3. Verifique se há uma URL configurada:
   - Deve ser: `https://www.ylada.com/api/webhooks/mercado-pago`
   - Ou: `https://ylada.vercel.app/api/webhooks/mercado-pago`

---

## 📝 PRÓXIMOS PASSOS

1. **Tente encontrar a função em Functions** (não em Logs)
2. **Se não encontrar, verifique a configuração do webhook no Mercado Pago**
3. **Me envie:**
   - Screenshot da página Functions (se encontrar)
   - Screenshot da configuração do webhook no Mercado Pago
   - Ou confirme se não há nenhuma invocação

---

**Última atualização:** 11/11/2025

