# 👥 CONTAS DE TESTE MERCADO PAGO

## 📋 TIPOS DE CONTAS NECESSÁRIAS

Para testar a integração do Mercado Pago, você precisa de **pelo menos duas contas**:

### **1. Conta Vendedor (Seller)**
- **Função:** Configurar a aplicação e credenciais para cobrança
- **É a sua conta de usuário principal**
- Usa as credenciais de **Access Token** que configuramos

### **2. Conta Comprador (Buyer)**
- **Função:** Testar o processo de compra
- **Diferente da conta vendedor**
- Usada para simular compras no checkout

### **3. Conta Integrador (Integrator)** *(Opcional)*
- **Função:** Usada em integrações no modelo marketplace
- Só necessária se você estiver fazendo integração marketplace

---

## ⚠️ IMPORTANTE: CHECKOUT BRICKS

**Aviso da documentação:**
> "Integrações com Checkout Bricks não suportam usuários de teste para testes de integração."

**O que isso significa:**
- Se você estiver usando **Checkout Bricks**, não pode usar contas de teste
- Para **Checkout Pro** (que estamos usando), contas de teste funcionam normalmente ✅

---

## 🎯 COMO CRIAR CONTAS DE TESTE

### **1. Acessar Painel de Desenvolvedor**
1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em **"Suas integrações"** → **"Usuários de teste"**

### **2. Criar Conta de Teste**
1. Preencha as informações:
   - **País:** Brasil (não pode ser alterado depois)
   - **Identificação da conta:** Ex: "Conta de Teste Comprador"
2. Clique em **"Criar"**

### **3. Limites**
- Você pode criar **até 15 contas de teste**
- Pode reutilizar para diferentes integrações
- Contas de vendedor e comprador devem ser do **mesmo país**

---

## 💳 CARTÕES DE TESTE

Além das contas de teste, é importante usar **cartões de teste** para:
- Testar a integração de pagamento
- Simular o processo de compra
- Testar diferentes cenários (aprovado, recusado, etc.)

### **Cartões de Teste Válidos:**

**Mastercard (Aprovado):**
```
Número: 5031 4332 1540 6351
CVV: 123
Nome: Qualquer nome
Vencimento: Qualquer data futura
```

**Visa (Aprovado):**
```
Número: 5031 7557 3453 0604
CVV: 123
Nome: Qualquer nome
Vencimento: Qualquer data futura
```

---

## 🔍 TROUBLESHOOTING

### **Problema: Cartão de teste não funciona**

**Possíveis causas:**
1. Não está usando conta de teste do comprador
2. Conta vendedor e comprador são de países diferentes
3. Problema temporário do sandbox

**Solução:**
1. Verificar se criou conta de teste comprador
2. Verificar se ambas as contas são do Brasil
3. Tentar PIX ou Boleto (geralmente funcionam melhor)

### **Problema: Erro ao criar preferência**

**Possíveis causas:**
1. Access Token incorreto
2. Conta vendedor não configurada corretamente

**Solução:**
1. Verificar Access Token no painel
2. Verificar se está usando credenciais de teste

---

## 📝 CHECKLIST DE CONFIGURAÇÃO

- [ ] Conta vendedor criada (sua conta principal)
- [ ] Conta comprador criada (para testar compras)
- [ ] Ambas as contas são do Brasil
- [ ] Access Token de teste configurado
- [ ] Cartões de teste disponíveis
- [ ] Checkout Pro configurado (não Bricks)

---

## 🔗 LINKS ÚTEIS

- **Painel de Desenvolvedor:** https://www.mercadopago.com.br/developers/panel
- **Usuários de Teste:** https://www.mercadopago.com.br/developers/panel/app/{APP_ID}/test-users
- **Documentação:** https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/testing

---

**Última atualização:** Janeiro 2025

