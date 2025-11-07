# 📦 CONFIGURAR PRODUTOS STRIPE - BRASIL

## 🎯 PRODUTO 1: YLADA Wellness Brasil

### Passo a Passo no Stripe Dashboard:

1. **Acesse:** Stripe Dashboard → Products → Add product

2. **Informações do Produto:**
   - **Name:** `YLADA Wellness Brasil`
   - **Description:** `Plataforma Wellness Brasil (sem coleta de dados). Inclui criação de links, portal básico e suporte padrão.`
   - **Image:** (opcional) Upload do logo YLADA

3. **Criar Preço Mensal:**
   - Clique em **"Add price"** dentro do produto
   - **Billing period:** `Recurring` → `Monthly`
   - **Price:** `59.90` (em reais)
   - **Currency:** `BRL` (Real brasileiro)
   - **Name:** `YLADA BR Wellness - Mensal`
   - Clique em **"Add price"**
   - ✅ **Copiar o Price ID:** `price_xxxxxxxxxxxxx` (vai precisar depois!)

4. **Criar Preço Anual:**
   - Clique em **"Add price"** novamente
   - **Billing period:** `Recurring` → `Yearly`
   - **Price:** `570.00` (valor total anual em reais)
   - **Currency:** `BRL`
   - **Name:** `YLADA BR Wellness - Anual`
   - ⚠️ **IMPORTANTE:** O Stripe cobra o valor total de uma vez (R$ 570,00)
   - Clique em **"Add price"**
   - ✅ **Copiar o Price ID:** `price_xxxxxxxxxxxxx`

---

## 🎯 PRODUTO 2: YLADA Pro Brasil (Nutra/Nutri/Coach)

### Passo a Passo:

1. **Acesse:** Stripe Dashboard → Products → Add product

2. **Informações do Produto:**
   - **Name:** `YLADA Pro Brasil`
   - **Description:** `Plataforma YLADA Pro Brasil com coleta de dados, relatórios de engajamento, funis completos e suporte prioritário.`
   - **Image:** (opcional) Upload do logo YLADA

3. **Criar Preço Mensal:**
   - **Billing period:** `Recurring` → `Monthly`
   - **Price:** `97.00` (em reais)
   - **Currency:** `BRL`
   - **Name:** `YLADA BR Pro - Mensal`
   - ✅ **Copiar o Price ID**

4. **Criar Preço Anual:**
   - **Billing period:** `Recurring` → `Yearly`
   - **Price:** `776.00` (valor total anual = 8 × R$ 97,00)
   - **Currency:** `BRL`
   - **Name:** `YLADA BR Pro - Anual`
   - ⚠️ **IMPORTANTE:** O Stripe cobra o valor total de uma vez (R$ 776,00)
   - ✅ **Copiar o Price ID**

---

## ⚠️ IMPORTANTE: SOBRE PARCELAMENTO

### Como o Stripe Funciona:

- **Mensal:** Cobra R$ 59,90 todo mês automaticamente
- **Anual:** Cobra R$ 570,00 **de uma vez** no início do ano

### Se Você Quiser Parcelar:

O Stripe **não faz parcelamento automático**. Se você quer oferecer "12x de R$ 47,50", você tem duas opções:

#### Opção A: Explicar ao Cliente (Recomendado)
- Mostrar na página: "Anual: R$ 570,00 (equivalente a 12x de R$ 47,50)"
- O Stripe cobra o total de uma vez
- Você pode adicionar uma nota: "Pagamento único anual - equivalente a 12 parcelas"

#### Opção B: Usar Gateway Brasileiro
- Integrar com **Mercado Pago** ou **Asaas** para parcelamento real
- Mais complexo, mas oferece parcelamento verdadeiro

---

## 📋 CHECKLIST DE CONFIGURAÇÃO

### Para Cada Produto:

- [ ] Produto criado com nome e descrição
- [ ] Preço mensal criado (billing: Monthly)
- [ ] Preço anual criado (billing: Yearly)
- [ ] Price IDs copiados e salvos
- [ ] Valores em BRL (Real brasileiro)
- [ ] Nomes dos preços descritivos

### Price IDs para Salvar:

```
Wellness BR Mensal: price_xxxxxxxxxxxxx
Wellness BR Anual:  price_xxxxxxxxxxxxx
Pro BR Mensal:      price_xxxxxxxxxxxxx
Pro BR Anual:       price_xxxxxxxxxxxxx
```

---

## 💡 DICA: Como Mostrar na Página de Checkout

Na sua página de checkout, você pode mostrar assim:

**Plano Mensal:**
- R$ 59,90/mês
- Cobrado mensalmente

**Plano Anual:**
- R$ 570,00/ano
- Equivalente a R$ 47,50/mês (economia de 20,7%)
- Pagamento único anual
- ⚠️ O Stripe cobrará o valor total de uma vez

---

## 🔄 Próximos Passos

1. Criar os produtos no Stripe
2. Copiar todos os Price IDs
3. Adicionar os Price IDs nas variáveis de ambiente ou no código
4. Testar checkout com cartão de teste

---

**Última atualização:** {{ data atual }}

