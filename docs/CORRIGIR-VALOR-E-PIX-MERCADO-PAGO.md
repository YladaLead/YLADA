# 🔧 CORRIGIR VALOR E HABILITAR PIX NO MERCADO PAGO

## ❌ Problemas Identificados

1. **Valor exibido incorretamente**: R$ 5.990,00 em vez de R$ 59,90
2. **PIX não aparece** como opção de pagamento

---

## ✅ SOLUÇÃO 1: Verificar Valor Enviado

O valor está sendo enviado corretamente em centavos (5990 = R$ 59,90), mas o Mercado Pago pode estar interpretando incorretamente.

### Verificar nos Logs

Após o deploy, verifique os logs do Vercel:
1. Vá em **Deployments** → Último deploy
2. Clique em **Functions** → `/api/wellness/checkout`
3. Procure por: `💰 Conversão de valor:`
4. Deve mostrar:
   ```
   valorOriginal: 59.9
   valorEmCentavos: 5990
   esperado: "R$ 59.90 = 5990 centavos"
   ```

### Se o valor estiver errado

Verifique se `getPrice()` está retornando o valor correto:
- **Mensal**: deve retornar `59.90` (não `5990`)
- **Anual**: deve retornar `570.00` (não `57000`)

---

## ✅ SOLUÇÃO 2: Habilitar PIX no Mercado Pago

### **Passo 1: Verificar na Conta do Mercado Pago**

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em **"Seu Negócio"** → **"Configurações"**
3. Em **"Formas de pagamento"**, verifique se **PIX** está ativado
4. Se não estiver, **ative o PIX**

### **Passo 2: Verificar Credenciais**

1. No painel do Mercado Pago
2. Vá em **"Credenciais de teste"** (ou **"Credenciais de produção"**)
3. Verifique se está usando a **mesma conta** que tem PIX habilitado

### **Passo 3: Verificar no Código**

O código já está configurado para **não excluir** nenhum tipo de pagamento:
```typescript
payment_methods: {
  excluded_payment_types: [], // ✅ Vazio = todos habilitados
  excluded_payment_methods: [], // ✅ Vazio = todos habilitados
}
```

Isso significa que **PIX, Boleto, Cartão** devem aparecer automaticamente.

---

## 🔍 TROUBLESHOOTING

### PIX ainda não aparece?

1. **Verifique se está em modo TESTE**:
   - No sandbox, algumas opções podem não aparecer
   - Teste com credenciais de **PRODUÇÃO** (se disponível)

2. **Verifique se a conta tem PIX habilitado**:
   - Acesse: https://www.mercadopago.com.br/developers/panel
   - Vá em **"Seu Negócio"** → **"Configurações"** → **"Formas de pagamento"**
   - PIX deve estar **ativado**

3. **Verifique os logs**:
   - Procure por: `paymentMethods:`
   - Deve mostrar `excluded_types: []` e `excluded_methods: []`

### Valor ainda está errado?

1. **Verifique os logs**:
   - Procure por: `💰 Conversão de valor:`
   - Verifique se `valorOriginal` está correto (59.90, não 5990)

2. **Verifique `getPrice()`**:
   - Deve retornar valores em **reais** (59.90, não 5990)
   - A conversão para centavos é feita automaticamente

---

## 📝 NOTAS IMPORTANTES

- **Valor em centavos**: O Mercado Pago espera valores em centavos (5990 = R$ 59,90)
- **PIX automático**: Se não excluirmos tipos de pagamento, PIX aparece automaticamente
- **Sandbox**: Algumas opções podem não aparecer no ambiente de teste

---

**Última atualização:** Janeiro 2025

