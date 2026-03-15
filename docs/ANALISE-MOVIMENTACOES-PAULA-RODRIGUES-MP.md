# Análise das movimentações – Paula Rodrigues (Mercado Pago)

## Extrato (resumo da imagem)

| Data       | Hora  | Tipo              | ID Transação | Valor    | Observação                    |
|------------|-------|--------------------|--------------|----------|-------------------------------|
| 9 fev      | 18:09 | Venda assinatura   | 144868205799 | + R$ 97  | 1ª cobrança (compra inicial) |
| 9 fev      | 18:36 | Venda assinatura   | 145559939476 | + R$ 97  | 2ª cobrança (mesmo dia)       |
| 9 fev      | 18:36 | Reembolso         | 2917344686   | - R$ 97  | Reembolso que você fez        |
| 9 mar      | 19:00 | Venda assinatura   | 149623435742 | + R$ 97  | 3ª cobrança                   |
| 9 mar      | 19:01 | Venda assinatura   | 149623679638 | + R$ 97  | 4ª cobrança (1 min depois)    |

---

## O que aconteceu (linha do tempo)

### 9 de fevereiro

1. **18:09 – 1ª cobrança (144868205799)**  
   Primeira assinatura YLADA NUTRI Plano Mensal. Ela assinou e foi cobrada.

2. **Ela pediu cancelamento e você reembolsou**  
   O reembolso que aparece às 18:36 (ID 2917344686) é esse estorno.

3. **18:36 – 2ª cobrança (145559939476)**  
   No mesmo dia surgiu outra cobrança de R$ 97. Possibilidades:
   - **A)** Ela (ou o sistema) abriu outro checkout e gerou uma **segunda assinatura (segundo Preapproval)** no MP – aí o MP cobrou de novo.
   - **B)** O **primeiro Preapproval não foi cancelado** no MP; o MP enviou outra cobrança (retry ou nova tentativa).
   - **C)** Dois cliques no “Assinar” / dois checkouts concluídos.

4. **Reembolso 2917344686**  
   Esse valor negativo às 18:36 é o reembolso que você fez. Normalmente está ligado a uma das vendas do mesmo horário (provavelmente 145559939476).  
   **Problema:** mesmo após o reembolso, o **Preapproval da primeira compra (144868205799) provavelmente continuou ativo** no Mercado Pago. Quem para cobranças futuras é o **cancelamento do Preapproval**, não só o reembolso de uma transação.

### 9 de março (duas cobranças em 1 minuto)

1. **19:00 – 3ª cobrança (149623435742)**  
2. **19:01 – 4ª cobrança (149623679638)**  

Dois pagamentos com 1 minuto de diferença indicam **duas origens de cobrança** ao mesmo tempo:

- **Cenário A – “Replicou a assinatura”:**  
  Ela fez uma **nova assinatura** (novo checkout) em 9 de março. Isso criou um **novo Preapproval** no MP → uma das cobranças (ex.: 19:00 ou 19:01).  
  A outra cobrança pode ser:
  - do **Preapproval antigo** (144868205799) que nunca foi cancelado e cobrou de novo no ciclo (mensal), ou
  - **outro Preapproval** (ex.: segundo clique / segunda conclusão de checkout no mesmo dia).

- **Cenário B – Dois checkouts no mesmo dia:**  
  Dois acessos ao checkout (duplo clique, duas abas, ou “assinar” duas vezes) geraram **dois Preapprovals** e os dois cobraram em 9 de março.

Conclusão prática: hoje ela tem **pelo menos dois Preapprovals ativos** no Mercado Pago (ou um ativo + uma cobrança recorrente do antigo). Por isso houve duas cobranças em março.

---

## Por que isso acontece no sistema

1. **Reembolso não cancela Preapproval**  
   No MP, reembolsar uma transação **não** encerra a assinatura (Preapproval). É preciso **cancelar o Preapproval** para parar cobranças futuras.  
   No nosso app, o cancelamento pelo app chama a API do MP para cancelar a assinatura; se esse ID não for o do Preapproval certo ou a chamada falhar, o Preapproval continua ativo.

2. **Várias assinaturas para a mesma pessoa**  
   Se ela (ou o fluxo) concluir o checkout mais de uma vez, o MP cria mais de um Preapproval. Cada um cobra independentemente → várias cobranças no mesmo mês.

3. **IDs no app vs no MP**  
   No banco podemos ter `stripe_subscription_id` no formato `mp_144868205799` (ID do **pagamento**), enquanto no MP a assinatura recorrente tem um **ID de Preapproval** (outro número). Se o cancelamento no app usar só o ID de pagamento, o MP pode não achar o Preapproval e não cancelar.

---

## O que fazer agora (checklist)

### 1) No Mercado Pago

- **Assinaturas / Preapprovals**  
  - Buscar por “Paula Rodrigues” ou pelo e-mail dela.  
  - Listar **todos** os Preapprovals (assinaturas recorrentes) ligados a ela.  
  - **Cancelar todos** que forem YLADA NUTRI, para não gerar mais cobranças.

- **Reembolsos**  
  - **9 de março:** as duas transações (149623435742 e 149623679638) são indevidas (ela já tinha cancelado e você já tinha reembolsado em fev).  
  - Fazer **reembolso das duas** no painel do MP (ou as duas, se a política for devolver tudo desde a primeira cobrança indevida).

- **9 de fevereiro:**  
  - Você já reembolsou uma (2917344686).  
  - Se a **144868205799** não tiver sido reembolsada e ela tiver pedido cancelamento dentro dos 7 dias, reembolsar também.  
  - A **145559939476** – se não tiver certeza se já entrou no reembolso 2917344686, conferir no MP qual venda foi estornada e, se ainda houver valor pago por ela, reembolsar.

### 2) No app (Supabase)

- Rodar o script **`scripts/suporte-consulta-paula-rodrigues-nutri.sql`** e conferir:
  - Quantas **subscriptions** ativas ela tem (área nutri).  
  - Se houver mais de uma ativa, **cancelar no banco** as duplicadas (ou marcar como canceladas), deixando no máximo uma, e só se vocês quiserem reativar no futuro.
- Garantir que, para essa usuária, não exista **nenhuma** assinatura ativa na área Nutri, já que ela cancelou e foi indevidamente cobrada.

### 3) Resposta para a Paula

- Dizer que você identificou **duas cobranças em 9 de março** e que ambas serão reembolsadas.  
- Explicar que o problema foi:
  - assinatura não cancelada no sistema de pagamento na primeira vez, e/ou  
  - nova assinatura feita em março (e que isso gerou cobrança duplicada).  
- Informar o prazo de estorno no cartão (ex.: até X dias úteis) e que **todas as assinaturas dela no pagamento foram canceladas** para não haver nova cobrança.

---

## Evitar no futuro

1. **Sempre cancelar o Preapproval no MP** quando fizer reembolso por desistência/cancelamento nos 7 dias – não só reembolsar a transação.  
2. **No app:** ao cancelar assinatura, usar o **ID do Preapproval** (não só o ID do pagamento) na chamada à API do MP para cancelar.  
3. **Checkout:** evitar duplo clique / duas conclusões de assinatura (botão desabilitado após clique, ou checagem “já existe assinatura ativa” antes de criar outro Preapproval).

Se quiser, no próximo passo podemos: (1) mapear no código onde está o cancelamento no MP e ajustar para usar o ID de Preapproval quando existir; (2) sugerir uma consulta no banco para listar todas as subscriptions ativas da Paula e os IDs salvos (para cruzar com o MP).
