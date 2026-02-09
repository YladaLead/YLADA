# Vendedores: atribuição de venda e comissão

Como funciona a atribuição de vendas a vendedores (ex.: Paula) e como filtrar por vendedor nas Receitas.

---

## 1. Atribuir venda a um vendedor

O sistema usa o parâmetro **`ref`** na URL do checkout. Quem comprar por um link que tenha `ref=nome_do_vendedor` terá a assinatura gravada com `ref_vendedor = nome_do_vendedor`.

### Exemplos de links

- **Paula (página própria):**  
  `/pt/vendas/paula` — os botões já levam para o checkout com `ref=paula`.

- **Checkout direto com ref:**  
  - Mensal: `/pt/nutri/checkout?plan=monthly&ref=paula`  
  - Anual: `/pt/nutri/checkout?plan=annual&ref=paula`

- **Outro vendedor (ex.: Maria):**  
  `/pt/nutri/checkout?plan=annual&ref=maria`

O `ref` é lido na página de checkout e enviado na criação do pagamento/assinatura (Mercado Pago). O webhook grava em **subscriptions.ref_vendedor**.

---

## 2. Onde o ref é salvo

- **Tabela:** `subscriptions`
- **Coluna:** `ref_vendedor` (ex.: `paula`, `maria`)

Funciona para:

- **Plano anual** (pagamento único): webhook de **payment** preenche `ref_vendedor` ao criar a assinatura.
- **Plano mensal** (assinatura recorrente): webhook de **subscription/preapproval** lê `ref_vendedor` do metadata e grava na assinatura.

Renovações mensais **não** alteram `ref_vendedor`; a venda continua atribuída ao mesmo vendedor.

---

## 3. Comissão: 20% em todo pagamento (inicial e recorrente)

- **Percentual:** sempre **20%**.
- **Quando gera comissão:** em **todo** pagamento ligado a uma assinatura que tenha `ref_vendedor`:
  - **Primeiro pagamento** (entrada no plano mensal ou anual).
  - **Cada renovação** (cobrança mensal do plano mensal).

Ou seja: o vendedor ganha comissão na venda inicial **e** em todas as recorrências.

- **Onde fica registrado:** tabela **`vendedor_comissoes`**:
  - `ref_vendedor`, `subscription_id`, `payment_id`
  - `amount_cents` (valor do pagamento em centavos)
  - `commission_pct` = 20
  - `commission_amount_cents` (20% do valor em centavos)
  - `status` = `pending` (depois pode ser marcado como `paid` quando for pago ao vendedor)

O webhook do Mercado Pago (pagamento aprovado) grava o pagamento e, se a assinatura tiver `ref_vendedor`, cria um registro em `vendedor_comissoes` com 20% do valor.

---

## 4. Filtrar por vendedor em Admin > Receitas

1. Acesse **Admin > Receitas**.
2. No filtro **Vendedor**:
   - **Todos:** todas as assinaturas.
   - **Paula**, **Maria**, etc.: apenas assinaturas com aquele `ref_vendedor` (lista preenchida automaticamente com os valores que já existem no banco).

A lista de vendedores no filtro vem da API **GET /api/admin/receitas/vendedores**, que retorna os `ref_vendedor` distintos das assinaturas.

---

## 5. Adicionar um novo vendedor

Não é preciso cadastrar em lugar nenhum. Basta:

1. Usar links de checkout com `ref=novo_nome` (ex.: `ref=maria`, `ref=carlos`).
2. Quando existir pelo menos uma assinatura com esse `ref_vendedor`, o nome passará a aparecer no filtro de Vendedor em Receitas.

Recomendação: usar **um** código por vendedor, em minúsculo e sem espaços (ex.: `paula`, `maria`, `carlos`).

---

## 6. Resumo técnico

| Onde              | O que acontece |
|-------------------|----------------|
| URL do checkout   | `?ref=paula` é lido e enviado como `refVendedor` na API. |
| Payment gateway   | Envia `ref_vendedor` no metadata da Preference (pagamento único) e do Preapproval (assinatura mensal). |
| Webhook payment   | Lê `metadata.ref_vendedor` e grava em `subscriptions.ref_vendedor`. |
| Webhook subscription | Lê `metadata.ref_vendedor` e grava em `subscriptions.ref_vendedor`. |
| API receitas      | Parâmetro `ref_vendedor` filtra por esse valor. |
| API vendedores    | **GET /api/admin/receitas/vendedores** retorna lista de `ref_vendedor` distintos. |
| Comissão          | 20% de cada pagamento (inicial + renovações) → tabela **vendedor_comissoes**. |

Com isso, a Paula (e qualquer outro vendedor com `ref` nos links) passa a ter as vendas atribuídas e a comissão de 20% em todo pagamento, incluindo recorrente.
