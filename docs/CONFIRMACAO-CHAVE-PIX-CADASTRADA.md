# ✅ CONFIRMAÇÃO: CHAVE PIX CADASTRADA

## 📋 CHAVE PIX CONFIGURADA

**Status:** ✅ **CHAVE PIX CADASTRADA**

- **Tipo:** E-mail
- **Chave:** `ylada.lead@gmail.com`
- **Localização:** Painel Mercado Pago → "Minhas chaves"

---

## ✅ PRÓXIMOS PASSOS

### **1. Verificar se PIX está habilitado como forma de pagamento**

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em **"Seu Negócio"** → **"Configurações"** → **"Formas de pagamento"**
3. Verifique se **PIX** está **ativado**
4. Se não estiver, **ative** e salve

### **2. Verificar se os dados da conta estão validados**

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em **"Seu Negócio"** → **"Meus dados"**
3. Verifique se todos os campos estão completos:
   - Nome completo
   - CPF/CNPJ
   - Endereço
   - Telefone
   - E-mail verificado

### **3. Testar o checkout**

1. Acesse: `/pt/wellness/checkout`
2. Selecione um plano (Mensal ou Anual)
3. Clique em **"Continuar para Pagamento"**
4. No Mercado Pago, selecione **"Pix"**
5. Deve aparecer o **QR Code** para pagamento

---

## 🔍 SE AINDA NÃO FUNCIONAR

### **Verificar logs do servidor:**

1. Acesse: https://vercel.com/seu-projeto
2. Vá em **Deployments** → Último deploy
3. Clique em **Functions** → `/api/wellness/checkout`
4. Procure por erros relacionados a PIX

### **Verificar no console do navegador:**

1. Abra o DevTools (F12)
2. Vá na aba **Console**
3. Procure por erros relacionados a PIX ou pagamento

### **Possíveis problemas:**

1. **Chave PIX não validada ainda:**
   - Aguarde alguns minutos após cadastrar
   - Verifique se recebeu e-mail de confirmação

2. **Conta não validada:**
   - Complete todos os dados pendentes
   - Aguarde validação do Mercado Pago

3. **Modo sandbox:**
   - Se estiver em teste, pode ter limitações
   - Considere testar com credenciais de produção

---

## ✅ CHECKLIST FINAL

- [x] Chave PIX cadastrada: `ylada.lead@gmail.com`
- [ ] PIX habilitado em "Formas de pagamento"
- [ ] Dados da conta completos e validados
- [ ] Testado no checkout (QR Code aparece)

---

**Última atualização:** Janeiro 2025

