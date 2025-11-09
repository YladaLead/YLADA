# 🔧 TROUBLESHOOTING: Erros Mercado Pago

## ❌ Erro: "At least one policy returned UNAUTHORIZED"

### **Causas Possíveis:**

1. **Access Token inválido ou expirado**
2. **Access Token sem permissões necessárias**
3. **Aplicação não configurada corretamente no Mercado Pago**

### **Soluções:**

#### **1. Verificar Access Token**

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá na sua aplicação **YLADA**
3. Clique em **"Credenciais de teste"**
4. Verifique se o **Access Token** está correto
5. **Copie novamente** e atualize no `.env.local` e na Vercel

#### **2. Verificar Permissões da Aplicação**

1. No painel do Mercado Pago, vá em **"Configurações"** da aplicação
2. Verifique se a aplicação tem permissão para:
   - ✅ Criar preferências de pagamento
   - ✅ Processar pagamentos
   - ✅ Receber webhooks

#### **3. Recriar Access Token (se necessário)**

1. No painel do Mercado Pago
2. Vá em **"Credenciais"**
3. Clique em **"Regenerar"** no Access Token
4. **Copie o novo token**
5. Atualize no `.env.local` e na Vercel
6. **Faça redeploy**

#### **4. Verificar se está usando o Token correto**

**Teste:**
- Token de teste deve começar com `TEST-`
- Token de produção deve começar com `APP_USR-`

**No `.env.local`:**
```env
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxxxxxxx  # ✅ Correto para teste
```

**Na Vercel:**
- Para desenvolvimento: use token de teste
- Para produção: use token de produção

---

## ❌ Erro: "Mercado Pago Access Token não configurado"

### **Solução:**

1. Verifique se a variável está no `.env.local`:
   ```env
   MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxxxxxxx
   ```

2. Verifique se está na Vercel (Settings → Environment Variables)

3. **Reinicie o servidor** após adicionar a variável

---

## ❌ Erro: "URL de checkout não retornada"

### **Causa:**
Mercado Pago não retornou `init_point` ou `sandbox_init_point`

### **Solução:**

1. Verifique os logs do servidor
2. Verifique se o Access Token está correto
3. Verifique se a aplicação está ativa no Mercado Pago

---

## ✅ CHECKLIST DE VERIFICAÇÃO

Antes de reportar erro, verifique:

- [ ] Access Token está no `.env.local` (local)
- [ ] Access Token está na Vercel (produção)
- [ ] Access Token começa com `TEST-` (teste) ou `APP_USR-` (produção)
- [ ] Aplicação está ativa no Mercado Pago
- [ ] Aplicação tem permissões necessárias
- [ ] Redeploy foi feito após adicionar variáveis
- [ ] Servidor foi reiniciado (se local)

---

## 🧪 TESTAR ACCESS TOKEN

Execute no terminal (Node.js):

```javascript
const { MercadoPagoConfig, Preference } = require('mercadopago');

const client = new MercadoPagoConfig({
  accessToken: 'TEST-SEU_TOKEN_AQUI'
});

const preference = new Preference(client);

// Tentar criar uma preferência simples
preference.create({
  body: {
    items: [{
      title: 'Teste',
      quantity: 1,
      unit_price: 100
    }]
  }
}).then(response => {
  console.log('✅ Token válido!', response.id);
}).catch(error => {
  console.error('❌ Token inválido:', error.message);
});
```

---

**Última atualização:** Janeiro 2025

