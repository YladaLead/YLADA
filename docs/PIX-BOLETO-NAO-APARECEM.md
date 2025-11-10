# 🔍 PIX E BOLETO NÃO APARECEM NO CHECKOUT

## ❓ Por que PIX e Boleto não aparecem?

No checkout do Mercado Pago, PIX e Boleto aparecem na **tela inicial** de seleção de método de pagamento, **não** na tela de preenchimento do cartão.

---

## ✅ ONDE ENCONTRAR PIX E BOLETO

### **Tela Inicial do Checkout**

Quando você acessa o checkout do Mercado Pago, você deve ver uma tela com **3 opções**:

1. **Cartão de crédito** 💳
2. **Boleto** 📄
3. **Pix** 💰

### **Se você já selecionou "Cartão de crédito"**

Se você já está na tela de preenchimento do cartão, PIX e Boleto **não aparecem** porque você já escolheu o método.

**Solução:** Clique em **"Voltar"** para voltar à tela inicial e ver todas as opções.

---

## 🔄 FLUXO CORRETO

### **1. Tela Inicial (Seleção de Método)**
```
┌─────────────────────────┐
│ Como você prefere pagar?│
├─────────────────────────┤
│ 💳 Cartão de crédito    │
│ 📄 Boleto               │
│ 💰 Pix                  │
└─────────────────────────┘
```

### **2. Se você escolher Cartão**
```
┌─────────────────────────┐
│ Preencha os dados do    │
│ seu cartão              │
├─────────────────────────┤
│ [Campos do cartão]      │
│                         │
│ ← Voltar                │
└─────────────────────────┘
```

**Nota:** Nesta tela, PIX e Boleto não aparecem porque você já escolheu Cartão.

### **3. Se você escolher PIX**
```
┌─────────────────────────┐
│ Pagamento via Pix       │
├─────────────────────────┤
│ [QR Code]               │
│                         │
│ ← Voltar                │
└─────────────────────────┘
```

---

## 🔍 VERIFICAÇÃO

### **PIX e Boleto estão habilitados?**

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em **"Seu Negócio"** → **"Configurações"** → **"Formas de pagamento"**
3. Verifique se **PIX** e **Boleto** estão **ativados**

### **No código:**

O código já está configurado para **não excluir** nenhum método:
```typescript
payment_methods: {
  excluded_payment_types: [], // ✅ Vazio = todos habilitados
  excluded_payment_methods: [], // ✅ Vazio = todos habilitados
}
```

---

## 🚨 SE AINDA NÃO APARECEM

### **1. Verificar se está em modo TESTE**

No ambiente de **sandbox**, algumas opções podem não aparecer. Teste com credenciais de **PRODUÇÃO** (se disponível).

### **2. Verificar conta do Mercado Pago**

Certifique-se de que a conta tem PIX e Boleto habilitados:
- Acesse o painel do Mercado Pago
- Verifique as configurações de formas de pagamento

### **3. Voltar para tela inicial**

Se você está na tela de cartão, clique em **"Voltar"** para ver todas as opções.

---

## 📝 NOTAS

- PIX e Boleto aparecem na **tela inicial**, não na tela de cartão
- Se você já escolheu um método, precisa voltar para ver os outros
- No sandbox, algumas opções podem não aparecer

---

**Última atualização:** Janeiro 2025

