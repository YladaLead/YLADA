# 🔍 Como Ver Logs das Invocações Anteriores

## ✅ NÃO PRECISA FAZER OUTRO PAGAMENTO!

Os logs das invocações anteriores já estão disponíveis no Vercel. Vamos verificar!

---

## 📋 COMO VER OS LOGS DAS INVOCAÇÕES ANTERIORES

### 1. Acessar a Função no Vercel

1. Acesse: https://vercel.com/dashboard
2. Seu projeto → **Observability** → **Vercel Functions**
3. Procure por `/api/webhooks/mercado-pago` na tabela
4. **Clique na função** (não apenas veja as métricas)

---

### 2. Ver Lista de Invocações

Após clicar na função, você verá:
- Lista de todas as 7 invocações
- Status de cada uma (200, 500, etc.)
- Data/hora de cada invocação
- Tempo de execução

---

### 3. Ver Logs Detalhados de Cada Invocação

1. **Clique em cada invocação** (especialmente as mais recentes)
2. Você verá os logs completos de cada uma
3. Procure por:
   - `📥 Webhook Mercado Pago recebido:`
   - `💳 Processando pagamento:`
   - `🔍 Tentando extrair user_id:` (se tiver os novos logs)
   - `❌ User ID não encontrado no metadata do pagamento`
   - `📋 Dados disponíveis:`

---

## 🎯 INVOCAÇÕES PARA VERIFICAR

### **Invocação mais recente (06:34:34):**
- Esta é a que mostrou o erro `User ID não encontrado`
- Clique nela e veja os logs completos
- Procure por `📋 Dados disponíveis:` que deve mostrar:
  - `metadata`
  - `external_reference`
  - `payer`
  - `payer_email`

---

## 📝 O QUE ME ENVIAR

**Me envie os logs das invocações anteriores:**

1. ✅ **Screenshot ou texto dos logs** da invocação de **06:34:34** (a que deu erro)
2. ✅ **Especialmente a parte** que mostra:
   - `📋 Dados disponíveis:` ou `📋 Dados disponíveis para debug:`
   - Ou qualquer log que mostre `metadata`, `external_reference`, `payer`
3. ✅ **Se possível, logs de outras invocações** também (para comparar)

---

## 🔍 ONDE ESTÃO OS LOGS

Os logs podem estar em diferentes lugares:

### **Opção 1: Na página da função**
- Após clicar na função, veja se há uma lista de invocações
- Clique em cada invocação para ver os logs

### **Opção 2: Na página de Logs (filtrado)**
- Vá em **Logs** (geral)
- Filtre por: `/api/webhooks/mercado-pago`
- Veja todas as invocações listadas
- Clique em cada uma para ver os detalhes

### **Opção 3: Expandir a mensagem de erro**
- Na lista de logs, você viu: `User ID não encontrado no metadata do pagamento`
- Tente **clicar ou expandir** essa mensagem
- Pode mostrar mais detalhes

---

## 💡 DICA

Se não conseguir ver os logs detalhados:
- Tente clicar com botão direito na linha do log
- Ou procure por um botão "View Details" ou "Expand"
- Ou tente exportar os logs (se houver essa opção)

---

**Última atualização:** 11/11/2025

