# 🔍 VERIFICAR ACCESS TOKEN MERCADO PAGO

## ❌ Erro: "At least one policy returned UNAUTHORIZED"

Este erro indica que o **Access Token** não tem permissões ou está incorreto.

---

## ✅ PASSO A PASSO: Verificar e Corrigir

### **1. Verificar Access Token no Painel**

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá na aplicação **YLADA**
3. Clique em **"Credenciais de teste"**
4. Verifique o **Access Token**:
   - Deve começar com `TEST-`
   - Deve ter aproximadamente 50-60 caracteres
   - Exemplo: `TEST-6484673849752001-110918-adce0427c426f14110cd2bd3af885523`

### **2. Verificar se Token está Correto**

**No `.env.local` (local):**
```env
MERCADOPAGO_ACCESS_TOKEN=TEST-6484673849752001-110918-adce0427c426f14110cd2bd3af885523
```

**Na Vercel (produção):**
- Settings → Environment Variables
- Verifique se `MERCADOPAGO_ACCESS_TOKEN` está configurado
- Valor deve ser o mesmo do painel

### **3. Regenerar Access Token (se necessário)**

Se o token estiver incorreto ou expirado:

1. No painel do Mercado Pago
2. Vá em **"Credenciais de teste"**
3. Clique em **"Regenerar"** no Access Token
4. **Copie o novo token**
5. Atualize no `.env.local` e na Vercel
6. **Faça redeploy**

### **4. Verificar Permissões da Aplicação**

1. No painel do Mercado Pago
2. Vá em **"Configurações"** da aplicação
3. Verifique se tem permissões para:
   - ✅ Criar preferências de pagamento
   - ✅ Processar pagamentos
   - ✅ Receber webhooks

### **5. Testar Token**

Execute no terminal (Node.js):

```bash
node -e "
const { MercadoPagoConfig, Preference } = require('mercadopago');
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-SEU_TOKEN'
});
const preference = new Preference(client);
preference.create({
  body: {
    items: [{ title: 'Teste', quantity: 1, unit_price: 100 }]
}).then(r => console.log('✅ Token OK:', r.id))
  .catch(e => console.error('❌ Token inválido:', e.message));
"
```

---

## 🔧 SOLUÇÃO RÁPIDA

Se o erro persistir:

1. **Regenere o Access Token** no painel do Mercado Pago
2. **Atualize** no `.env.local` e na Vercel
3. **Faça redeploy**
4. **Teste novamente**

---

**Última atualização:** Janeiro 2025

