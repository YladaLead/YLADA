# 📋 PASSO A PASSO: CONFIGURAR MERCADO PAGO

## 🎯 INFORMAÇÕES NECESSÁRIAS

Você precisa me passar:
1. ✅ **Access Token** (chave secreta)
2. ✅ **Public Key** (chave pública)
3. ✅ **Webhook Secret** (depois de configurar webhook)

---

## 📝 PASSO 1: ACESSAR CREDENCIAIS

### 1.1. Acesse o Dashboard do Mercado Pago
- URL: https://www.mercadopago.com.br/developers/panel
- Faça login com sua conta

### 1.2. Navegue até "Suas integrações"
- No menu lateral, clique em **"Suas integrações"**
- Ou acesse diretamente: https://www.mercadopago.com.br/developers/panel/app

### 1.3. Crie uma Aplicação (se ainda não tiver)
- Clique em **"Criar aplicação"**
- Preencha:
  - **Nome**: `YLADA Wellness` (ou o nome que preferir)
  - **Descrição**: `Integração de pagamentos para YLADA Wellness`
  - **Plataforma**: `Web`
- Clique em **"Criar"**

---

## 🔑 PASSO 2: OBTER ACCESS TOKEN

### 2.1. Acesse a aplicação criada
- Clique na aplicação que você criou
- Você verá duas abas: **"Produção"** e **"Teste"**

### 2.2. Obter Access Token de TESTE (para desenvolvimento)
1. Clique na aba **"Teste"**
2. Procure por **"Credenciais de teste"**
3. Você verá:
   - **Access Token** (começa com `TEST-...`)
   - **Public Key** (começa com `TEST-...`)

### 2.3. Obter Access Token de PRODUÇÃO (para depois)
1. Clique na aba **"Produção"**
2. Procure por **"Credenciais de produção"**
3. Você verá:
   - **Access Token** (começa com `APP_USR-...`)
   - **Public Key** (começa com `APP_USR-...`)

**⚠️ IMPORTANTE**: Por enquanto, me passe apenas as credenciais de **TESTE**.

---

## 📋 PASSO 3: COPIAR AS INFORMAÇÕES

### 3.1. Access Token de Teste
```
Exemplo: TEST-1234567890-123456-abcdef1234567890abcdef1234567890-123456789
```
- Copie o **Access Token** completo
- ⚠️ **NÃO compartilhe em locais públicos** (é uma chave secreta)

### 3.2. Public Key de Teste
```
Exemplo: TEST-abcdef12-3456-7890-abcd-ef1234567890
```
- Copie a **Public Key** completa

### 3.3. Verificar formato
- ✅ Access Token deve começar com `TEST-` (teste) ou `APP_USR-` (produção)
- ✅ Public Key deve começar com `TEST-` (teste) ou `APP_USR-` (produção)
- ✅ Ambos devem ter pelo menos 30 caracteres

---

## 🔗 PASSO 4: CONFIGURAR WEBHOOK (Depois)

### 4.1. Acesse "Webhooks"
- No menu lateral, clique em **"Webhooks"**
- Ou acesse: https://www.mercadopago.com.br/developers/panel/app/{SEU_APP_ID}/webhooks

### 4.2. Adicionar URL de Webhook
- Clique em **"Adicionar URL"**
- URL: `https://seu-dominio.com/api/webhooks/mercado-pago`
- Eventos a escutar:
  - ✅ `payment`
  - ✅ `merchant_order`

### 4.3. Obter Webhook Secret
- Após criar o webhook, você verá um **"Secret"** ou **"X-Signature"**
- Copie esse valor (será usado para validar webhooks)

**⚠️ NOTA**: O webhook só pode ser configurado depois que a aplicação estiver em produção ou usando ngrok para testes locais.

---

## 📤 PASSO 5: ME PASSAR AS INFORMAÇÕES

### Formato sugerido:
```
Access Token (Teste): TEST-xxxxxxxxxxxxx
Public Key (Teste): TEST-xxxxxxxxxxxxx
```

**⚠️ SEGURANÇA**: 
- Envie essas informações por mensagem privada
- Não compartilhe em locais públicos
- Essas são credenciais de TESTE (podem ser regeneradas)

---

## ✅ CHECKLIST

Antes de me passar, verifique:

- [ ] Acessei o dashboard do Mercado Pago
- [ ] Criei uma aplicação
- [ ] Copiei o **Access Token de TESTE**
- [ ] Copiei a **Public Key de TESTE**
- [ ] Verifiquei que ambos começam com `TEST-`
- [ ] As credenciais têm pelo menos 30 caracteres

---

## 🎯 PRÓXIMOS PASSOS (Depois que você me passar)

1. ✅ Adicionar credenciais no `.env.local`
2. ✅ Criar adaptador Mercado Pago
3. ✅ Configurar checkout
4. ✅ Testar integração
5. ✅ Configurar webhook

---

## 📸 ONDE ENCONTRAR (Visual)

### Dashboard do Mercado Pago:
```
Menu Lateral:
├─ Painel
├─ Suas integrações ← AQUI
│   └─ [Sua Aplicação]
│       ├─ Teste ← CREDENCIAIS DE TESTE
│       └─ Produção ← CREDENCIAIS DE PRODUÇÃO
├─ Webhooks ← CONFIGURAR DEPOIS
└─ ...
```

### Tela de Credenciais:
```
┌─────────────────────────────────────┐
│  Credenciais de teste               │
├─────────────────────────────────────┤
│  Access Token                       │
│  TEST-1234567890-...                │ ← COPIAR ESTE
│  [Mostrar] [Copiar]                 │
├─────────────────────────────────────┤
│  Public Key                         │
│  TEST-abcdef12-3456-...             │ ← COPIAR ESTE
│  [Mostrar] [Copiar]                 │
└─────────────────────────────────────┘
```

---

## ❓ DÚVIDAS COMUNS

### "Não encontro as credenciais"
- Certifique-se de estar na aba **"Teste"** (não "Produção")
- Verifique se criou uma aplicação primeiro

### "As credenciais não funcionam"
- Verifique se copiou completamente (sem espaços)
- Certifique-se de que são credenciais de **TESTE** (começam com `TEST-`)

### "Preciso de credenciais de produção?"
- Por enquanto, **NÃO**
- Use apenas credenciais de **TESTE** para desenvolvimento
- Produção configuramos depois

### "Onde configuro o webhook?"
- Webhook configuramos depois
- Por enquanto, só precisamos das credenciais

---

## 🚀 QUANDO ESTIVER PRONTO

Me envie as informações no formato:
```
Access Token (Teste): TEST-xxxxxxxxxxxxx
Public Key (Teste): TEST-xxxxxxxxxxxxx
```

E eu começo a implementação! 🎉

