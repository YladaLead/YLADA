# ⚡ RESUMO RÁPIDO: Configuração Mercado Pago

## 🎯 O QUE VOCÊ PRECISA

### **3 Credenciais:**
1. **Access Token** → Para criar pagamentos
2. **Public Key** → Para frontend (opcional)
3. **Webhook Secret** → Para validar notificações

---

## 📍 ONDE PEGAR (Passo a Passo)

### **1. Acesse o Painel:**
👉 https://www.mercadopago.com.br/developers/panel

### **2. Crie uma Aplicação:**
- Clique em **"Criar aplicação"**
- Nome: `YLADA`
- Tipo: **"Pagamentos on-line"**

### **3. Copie as Credenciais de TESTE:**
- Aba **"Credenciais de teste"**
- Copie: **Access Token** e **Public Key**

### **4. Configure Webhook:**
- Vá em **"Webhooks"**
- URL: `https://ylada.app/api/webhooks/mercado-pago`
- Eventos: `payment`, `merchant_order`, `preference`
- Copie o **Webhook Secret** gerado

---

## 🔐 ONDE COLOCAR NO CÓDIGO

### **Arquivo `.env.local`:**
```env
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY=TEST-xxxxxxxxxxxxx
MERCADOPAGO_WEBHOOK_SECRET=xxxxxxxxxxxxx
```

### **Vercel (Produção):**
- Settings → Environment Variables
- Adicione as mesmas variáveis com credenciais de **PRODUÇÃO**

---

## ✅ CHECKLIST

- [ ] Conta criada no Mercado Pago
- [ ] Aplicação criada
- [ ] Access Token de teste copiado
- [ ] Public Key de teste copiada
- [ ] Webhook configurado
- [ ] Webhook Secret copiado
- [ ] Variáveis adicionadas no `.env.local`
- [ ] Teste de checkout funcionando

---

## 🧪 TESTAR

**Cartão de Teste:**
- Número: `5031 4332 1540 6351`
- CVV: `123`
- Data: Qualquer data futura

**PIX:**
- Use o QR Code gerado no checkout
- Aprova automaticamente

---

📖 **Guia completo:** `docs/GUIA-CONFIGURACAO-MERCADO-PAGO.md`

