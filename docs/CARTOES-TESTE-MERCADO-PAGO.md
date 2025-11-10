# 💳 CARTÕES DE TESTE MERCADO PAGO

## ❌ Erro: "Não é possível continuar o pagamento com este cartão"

Se você está recebendo este erro ao usar um cartão de teste, pode ser que o cartão esteja incorreto ou o Mercado Pago não esteja aceitando esse cartão específico.

---

## ✅ CARTÕES DE TESTE CORRETOS

### **Cartão Aprovado (Mastercard)**

```
Número: 5031 4332 1540 6351
CVV: 123
Nome: Qualquer nome
Vencimento: Qualquer data futura (ex: 11/30)
```

### **Cartão Aprovado (Visa)**

```
Número: 5031 7557 3453 0604
CVV: 123
Nome: Qualquer nome
Vencimento: Qualquer data futura (ex: 11/30)
```

### **Cartão Recusado (para testar recusa)**

```
Número: 5031 4332 1540 6351
CVV: 123
Nome: Qualquer nome
Vencimento: Qualquer data futura
```

**Nota:** O mesmo cartão pode ser usado para testar aprovação e recusa, dependendo do valor ou outras condições.

---

## 🔍 TROUBLESHOOTING

### **Problema 1: Cartão não é aceito**

**Sintoma:** "Não é possível continuar o pagamento com este cartão"

**Soluções:**
1. Verifique se está usando um cartão de teste válido (veja lista acima)
2. Verifique se o CVV está correto (geralmente `123`)
3. Verifique se a data de vencimento é futura
4. Tente outro cartão de teste da lista

### **Problema 2: PIX e Boleto não aparecem**

**Sintoma:** Só aparece "Cartão de crédito" como opção

**Causa:** No checkout do Mercado Pago, PIX e Boleto podem aparecer:
- Na tela inicial (antes de escolher método)
- Ou podem não aparecer se você já selecionou "Cartão de crédito"

**Solução:**
1. Volte para a tela inicial (clique em "Voltar")
2. Você deve ver as opções: Cartão, PIX, Boleto
3. Selecione PIX ou Boleto diretamente

### **Problema 3: Erro JavaScript no console**

**Sintoma:** `Cannot read properties of null (reading 'id')`

**Causa:** Este é um erro interno do Mercado Pago, não do nosso código.

**Solução:**
- Este erro geralmente não afeta o funcionamento
- Se o pagamento está funcionando, pode ser ignorado
- Se o pagamento não funciona, tente:
  1. Limpar cache do navegador
  2. Tentar em modo anônimo
  3. Tentar outro navegador

---

## 📝 NOTAS IMPORTANTES

1. **Ambiente Sandbox:** Todos os cartões de teste funcionam apenas no ambiente de teste (sandbox)
2. **Valor do Plano:** O valor pode não aparecer na tela de preenchimento do cartão, mas está configurado corretamente
3. **PIX e Boleto:** Aparecem na tela inicial de seleção de método de pagamento

---

## 🧪 TESTE COMPLETO

1. **Acessar checkout** → Deve mostrar opções: Cartão, PIX, Boleto
2. **Selecionar PIX** → Deve gerar QR Code
3. **Selecionar Boleto** → Deve gerar código de barras
4. **Selecionar Cartão** → Preencher dados do cartão de teste
5. **Confirmar pagamento** → Deve processar e redirecionar

---

**Última atualização:** Janeiro 2025

