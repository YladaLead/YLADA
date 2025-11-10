# 💰 CÁLCULO DE VALORES COM PARCELADO VENDEDOR

## 🎯 SITUAÇÃO ATUAL

Você configurou **"Parcelado Vendedor"** (sem juros para o cliente), o que significa:
- ✅ Cliente paga **sem juros**
- ⚠️ **Você (vendedor) absorve as taxas** de parcelamento

---

## 📊 TAXAS DO MERCADO PAGO (Parcelado Vendedor)

As taxas variam conforme o número de parcelas:

| Parcelas | Taxa Adicional | Total de Taxas (aproximado) |
|----------|----------------|----------------------------|
| 2x | 2,03% | ~4,99% + 2,03% = ~7,02% |
| 3x | 4,06% | ~4,99% + 4,06% = ~9,05% |
| 4x | 6,09% | ~4,99% + 6,09% = ~11,08% |
| 5x | 7,64% | ~4,99% + 7,64% = ~12,63% |
| 6x | 8,92% | ~4,99% + 8,92% = ~13,91% |
| 12x | ~10-12% | ~4,99% + 10-12% = ~15-17% |

**Nota:** Taxa base do Mercado Pago: ~4,99% + taxa de parcelamento

---

## 💵 VALORES ATUAIS NO CÓDIGO

### Plano Anual:
- **À vista:** R$ 470,72
- **12x parcelado:** R$ 574,80 (12x de R$ 47,90)
  - Este valor era com juros do cliente
  - Cliente pagava mais, você recebia o valor integral

---

## 🔄 NOVA SITUAÇÃO (Parcelado Vendedor)

### Opção 1: Manter o mesmo valor para o cliente (R$ 574,80 em 12x)

**Cliente paga:**
- 12x de R$ 47,90 = **R$ 574,80** (sem juros)

**Você recebe (líquido):**
- R$ 574,80 - 15% (taxa aproximada) = **R$ 488,58**
- **Diferença:** Você recebe R$ 86,22 a menos que o valor à vista

### Opção 2: Ajustar para você receber o mesmo valor líquido

**Se você quer receber R$ 470,72 líquido em 12x:**

**Cálculo:**
- Valor líquido desejado: R$ 470,72
- Taxa total (12x): ~15%
- Valor bruto necessário: R$ 470,72 ÷ 0,85 = **R$ 554,14**
- Parcela: R$ 554,14 ÷ 12 = **R$ 46,18/mês**

**Cliente pagaria:**
- 12x de R$ 46,18 = **R$ 554,14** (sem juros)
- **Você recebe:** R$ 470,72 líquido (mesmo que à vista)

### Opção 3: Aumentar o valor para compensar as taxas

**Se você quer receber R$ 574,80 líquido em 12x:**

**Cálculo:**
- Valor líquido desejado: R$ 574,80
- Taxa total (12x): ~15%
- Valor bruto necessário: R$ 574,80 ÷ 0,85 = **R$ 676,24**
- Parcela: R$ 676,24 ÷ 12 = **R$ 56,35/mês**

**Cliente pagaria:**
- 12x de R$ 56,35 = **R$ 676,24** (sem juros)
- **Você recebe:** R$ 574,80 líquido

---

## 🎯 RECOMENDAÇÃO

### **Opção Recomendada: Opção 2**

**Valores sugeridos:**
- **À vista:** R$ 470,72 (mantém)
- **12x parcelado:** R$ 554,14 (12x de R$ 46,18)
  - Cliente paga sem juros
  - Você recebe o mesmo valor líquido que à vista

**Vantagens:**
- ✅ Cliente paga menos que antes (R$ 554,14 vs R$ 574,80)
- ✅ Você recebe o mesmo valor líquido (R$ 470,72)
- ✅ Mais atraente para o cliente (sem juros)
- ✅ Você não perde dinheiro

---

## 📝 PRÓXIMOS PASSOS

1. **Decidir qual opção usar:**
   - Opção 1: Cliente paga R$ 574,80, você recebe menos
   - Opção 2: Cliente paga R$ 554,14, você recebe o mesmo (recomendado)
   - Opção 3: Cliente paga R$ 676,24, você recebe mais

2. **Atualizar valores no código:**
   - `src/lib/payment-gateway.ts` (função `getPrice`)
   - `src/app/pt/wellness/checkout/page.tsx` (planDetails)

3. **Atualizar textos no checkout:**
   - "12x de R$ X,XX"
   - "Total parcelado: R$ XXX,XX"

---

## ⚠️ IMPORTANTE

- As taxas podem variar ligeiramente conforme o cartão do cliente
- O cálculo acima é uma **aproximação**
- Para valores exatos, consulte o painel do Mercado Pago após algumas transações
- Você pode ajustar os valores depois baseado nos valores reais recebidos

---

**Última atualização:** Janeiro 2025

