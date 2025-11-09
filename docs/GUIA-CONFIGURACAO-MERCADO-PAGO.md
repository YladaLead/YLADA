# 🚀 GUIA COMPLETO: Configuração Mercado Pago

## 📋 O QUE VOCÊ PRECISA DO MERCADO PAGO

### **Credenciais Necessárias:**

1. **Access Token** (Token de Acesso)
   - Usado para criar preferências de pagamento
   - Formato: `TEST-xxxxxxxxxxxxx` (teste) ou `APP_USR-xxxxxxxxxxxxx` (produção)

2. **Public Key** (Chave Pública)
   - Usado no frontend (opcional, se usar checkout pro)
   - Formato: `TEST-xxxxxxxxxxxxx` (teste) ou `APP_USR-xxxxxxxxxxxxx` (produção)

3. **Webhook Secret** (Chave do Webhook)
   - Usado para validar webhooks
   - Formato: `xxxxxxxxxxxxx` (string aleatória)

---

## 🔧 PASSO A PASSO: Como Obter as Credenciais

### **PASSO 1: Criar Conta no Mercado Pago**

1. Acesse: https://www.mercadopago.com.br/
2. Clique em **"Criar conta"** ou **"Cadastre-se"**
3. Preencha seus dados:
   - Nome completo
   - E-mail
   - CPF/CNPJ
   - Telefone
   - Senha
4. Confirme seu e-mail
5. Complete a verificação de identidade (se solicitado)

---

### **PASSO 2: Acessar o Painel de Desenvolvedores**

1. Faça login na sua conta Mercado Pago
2. Acesse: https://www.mercadopago.com.br/developers/panel
3. Ou vá em: **"Seu Negócio"** → **"Configurações"** → **"Integrações"**

---

### **PASSO 3: Criar uma Aplicação**

1. No painel de desenvolvedores, clique em **"Criar aplicação"**
2. Preencha os dados:
   - **Nome da aplicação:** `YLADA` (ou o nome que preferir)
   - **Tipo de solução:** Selecione **"Pagamentos on-line"**
   - **Descrição:** `Sistema de assinaturas YLADA - Wellness, Nutri, Coach, Nutra`
3. Clique em **"Criar"**

---

### **PASSO 4: Obter Credenciais de TESTE**

1. Após criar a aplicação, você verá duas abas:
   - **Credenciais de teste** (para desenvolvimento)
   - **Credenciais de produção** (para vendas reais)

2. Clique na aba **"Credenciais de teste"**

3. Você verá:
   - **Public Key** (Chave pública)
   - **Access Token** (Token de acesso)

4. **Copie essas credenciais** e guarde em local seguro

**Exemplo de como aparecem:**
```
Public Key: TEST-12345678-1234-1234-1234-123456789012-123456-12345678-12345678-12345678-12345678-12345678
Access Token: TEST-1234567890123456-123456-12345678901234567890123456789012-123456789
```

---

### **PASSO 5: Configurar Webhook (IMPORTANTE!)**

1. No painel da aplicação, vá em **"Webhooks"** ou **"Notificações"**
2. Clique em **"Configurar webhooks"** ou **"Adicionar URL"**
3. Preencha:
   - **URL do webhook:** `https://ylada.app/api/webhooks/mercado-pago`
     - ⚠️ **IMPORTANTE:** Use sua URL de produção
     - Para teste local, use: `https://seu-ngrok.ngrok.io/api/webhooks/mercado-pago`
   - **Eventos para receber:** Selecione:
     - ✅ `payment` (Pagamento)
     - ✅ `merchant_order` (Ordem do comerciante)
     - ✅ `preference` (Preferência)
4. Clique em **"Salvar"**

5. **Copie o Webhook Secret** que será gerado
   - Aparece após salvar a URL
   - Formato: `xxxxxxxxxxxxx` (string aleatória)

---

### **PASSO 6: Configurar Credenciais de PRODUÇÃO**

⚠️ **IMPORTANTE:** Só faça isso quando estiver pronto para receber pagamentos reais!

1. No painel da aplicação, clique na aba **"Credenciais de produção"**
2. Você precisará:
   - Completar a verificação da conta
   - Adicionar dados bancários para receber pagamentos
3. Após verificar, copie as credenciais de produção:
   - **Public Key** (produção)
   - **Access Token** (produção)

---

## 🔐 ONDE COLOCAR AS CREDENCIAIS NO SEU PROJETO

### **1. Arquivo `.env.local` (Desenvolvimento)**

Adicione as seguintes variáveis:

```env
# MERCADO PAGO - TESTE
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY=TEST-xxxxxxxxxxxxx
MERCADOPAGO_WEBHOOK_SECRET=xxxxxxxxxxxxx

# MERCADO PAGO - PRODUÇÃO (quando estiver pronto)
# MERCADOPAGO_ACCESS_TOKEN_LIVE=APP_USR-xxxxxxxxxxxxx
# MERCADOPAGO_PUBLIC_KEY_LIVE=APP_USR-xxxxxxxxxxxxx
```

### **2. Vercel (Produção)**

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto `ylada-app`
3. Vá em **"Settings"** → **"Environment Variables"**
4. Adicione as variáveis:

```
MERCADOPAGO_ACCESS_TOKEN = APP_USR-xxxxxxxxxxxxx (produção)
MERCADOPAGO_PUBLIC_KEY = APP_USR-xxxxxxxxxxxxx (produção)
MERCADOPAGO_WEBHOOK_SECRET = xxxxxxxxxxxxx (webhook secret)
```

5. Clique em **"Save"**

---

## 📝 RESUMO: O QUE VOCÊ PRECISA

### **Para Desenvolvimento (TESTE):**
- ✅ Access Token de teste
- ✅ Public Key de teste
- ✅ Webhook Secret
- ✅ URL do webhook configurada

### **Para Produção:**
- ✅ Access Token de produção
- ✅ Public Key de produção
- ✅ Webhook Secret (mesmo do teste)
- ✅ URL do webhook configurada para produção
- ✅ Conta verificada no Mercado Pago
- ✅ Dados bancários cadastrados

---

## 🧪 TESTAR A CONFIGURAÇÃO

### **1. Verificar se as credenciais estão corretas:**

Execute no terminal:
```bash
node -e "console.log('Access Token:', process.env.MERCADOPAGO_ACCESS_TOKEN ? '✅ Configurado' : '❌ Não configurado')"
```

### **2. Testar criação de preferência:**

Faça um checkout de teste no seu site e verifique se:
- ✅ A URL do Mercado Pago é gerada
- ✅ O checkout abre corretamente
- ✅ Você consegue fazer um pagamento de teste

### **3. Testar webhook:**

1. Faça um pagamento de teste
2. Verifique os logs do servidor
3. Confirme que o webhook foi recebido

---

## ⚠️ IMPORTANTE: Dados de Teste

### **Cartões de Teste do Mercado Pago:**

Para testar pagamentos, use estes cartões:

**Cartão Aprovado:**
- Número: `5031 4332 1540 6351`
- CVV: `123`
- Data: Qualquer data futura
- Nome: Qualquer nome

**Cartão Recusado:**
- Número: `5031 4332 1540 6351`
- CVV: `123`
- Data: Qualquer data futura
- Nome: Qualquer nome

**PIX de Teste:**
- Use o QR Code gerado no checkout de teste
- O pagamento será aprovado automaticamente após alguns segundos

---

## 🔗 LINKS ÚTEIS

- **Painel de Desenvolvedores:** https://www.mercadopago.com.br/developers/panel
- **Documentação API:** https://www.mercadopago.com.br/developers/pt/docs
- **Cartões de Teste:** https://www.mercadopago.com.br/developers/pt/docs/checkout-api/testing
- **Webhooks:** https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks

---

## ✅ CHECKLIST FINAL

Antes de ir para produção, verifique:

- [ ] Access Token de teste configurado no `.env.local`
- [ ] Public Key de teste configurado no `.env.local`
- [ ] Webhook Secret configurado
- [ ] URL do webhook configurada no Mercado Pago
- [ ] Teste de checkout funcionando
- [ ] Teste de webhook funcionando
- [ ] Conta verificada no Mercado Pago
- [ ] Dados bancários cadastrados
- [ ] Access Token de produção configurado na Vercel
- [ ] Public Key de produção configurada na Vercel
- [ ] Webhook configurado para URL de produção

---

**Última atualização:** Janeiro 2025

