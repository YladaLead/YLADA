# Pagamentos do Mercado Pago – identificação e correção definitiva

## Correção definitiva aplicada (verificação geral)

- **Preference e Preapproval**: `external_reference` é montada com `buildExternalReference(area, planType, userId)` e limitada a 256 caracteres (limite do MP). Log da referência ao criar preferência.
- **Webhook de pagamento (Payment)**:
  - Extração de `user_id`: metadata → `external_reference` (formato `area_planType_userId`) → e-mail do pagador como `temp_` → se referência inválida (não UUID nem `temp_`), busca usuário por e-mail em `user_profiles`.
  - Área/plano: metadata → `external_reference` → descrição do pagamento (ex.: "YLADA WELLNESS - Plano Anual").
- **Webhook de assinatura (Preapproval)**:
  - Mesmos fallbacks: metadata → `external_reference` → usuário por e-mail; área/plano por `reason`.
  - Se `user_id` for `temp_email`, resolve para UUID (busca por e-mail ou cria usuário) antes de gravar assinatura.

Assim, mesmo com troca de valores ou links/planos criados no painel do MP, a identificação por e-mail e descrição cobre os casos em que a referência vem truncada ou em outro formato.

---

## Por que às vezes não eram identificados (Nutri, Wellness)

Alguns pagamentos aprovados não criam/atualizam assinatura automaticamente. Isso pode ter começado a aparecer mais por um ou mais dos motivos abaixo.

---

## Causas prováveis

### 1. **Metadata da Preference não vem no Payment** (comportamento do MP)

Quando criamos o checkout, enviamos na **Preference**:

- `metadata`: `user_id`, `area`, `plan_type`, etc.
- `external_reference`: `wellness_annual_temp_email@...` (formato `area_planType_userId`).

Quando o cliente paga, o Mercado Pago cria um **Payment**. Na API, o **GET Payment** devolve `external_reference` e, no exemplo da documentação, **metadata vem vazio** (`"metadata": {}`). Ou seja: o MP **não garante** que o metadata da Preference seja copiado para o Payment.  
Por isso o sistema sempre dependeu (e deve continuar dependendo) da **external_reference** para identificar usuário, área e plano. Se essa referência vier errada ou em outro formato, a identificação falha.

### 2. **Uso de Link de pagamento (criado no painel do MP)**

Se o cliente paga por um **Link de pagamento** criado manualmente no painel do Mercado Pago (em vez de usar o checkout do app):

- A referência externa costuma ser outra (ex.: `wellness...f0674781` ou um ID interno).
- Não existe nosso formato `area_planType_userId`.
- O webhook recebe o pagamento mas não consegue extrair `user_id` (e às vezes nem área/plano) só pela referência.

**Conclusão:** Se vocês passaram a enviar mais “links de pagamento” para clientes (WhatsApp, e-mail, etc.), isso explica o aumento de “não identificados”.

### 3. **Checkout só com e-mail (sem login)**

O app permite checkout apenas com e-mail (`temp_email@...`). A Preference é criada com:

- `external_reference`: `wellness_annual_temp_mvcristovao@hotmail.com`

Se, em algum fluxo ou versão da API, o MP não repassar essa `external_reference` igual no Payment (ou truncar), o sistema não acha o usuário.  
Nesses casos o **e-mail do pagador** (`payer.email`) é a única âncora; por isso entrou o fallback por e-mail no webhook.

### 4. **Mudança de conta, ambiente ou produto MP**

- Troca de **produção** vs **teste** (ou de aplicação).
- Uso de outro tipo de produto (ex.: outro tipo de link, outro fluxo de checkout).

Qualquer mudança assim pode alterar o formato da referência ou o que vem em metadata/external_reference no webhook.

---

## O que já está no código (mitigações)

1. **Fallback por e-mail**  
   Se a referência não tiver formato `area_planType_userId` e o `user_id` extraído não for UUID nem `temp_...`, o sistema busca usuário por **e-mail do pagador** em `user_profiles` e associa o pagamento a esse usuário.

2. **Fallback por descrição do pagamento**  
   Área e plano passam a ser inferidos também pela descrição (ex.: “YLADA WELLNESS - Plano Anual”) quando a referência não vier no formato esperado.

3. **Scripts de correção**  
   Para casos que já caíram “não identificados”, existem scripts (ex.: Marcelino Wellness, Ana Paula Nutri) para registrar o pagamento e ajustar assinatura/valor, para o dinheiro ser computado e o acesso ficar correto.

---

## O que conferir na operação

1. **Origem do pagamento**  
   Para os casos que falharam (Nutri, Marcelino): o cliente pagou pelo **checkout do app** (link que o próprio app gera) ou por um **link de pagamento** criado no painel do MP e enviado por vocês (WhatsApp, e-mail, etc.)?  
   Se for o segundo, o aumento de “não identificados” faz sentido; a solução é priorizar sempre o checkout do app quando possível.

2. **No painel do MP**  
   Em um pagamento que não foi identificado, abrir “Detalhe da transação” e ver:
   - **Referência adicional** (external_reference): está no formato `area_planType_userId` (ex.: `wellness_annual_temp_xxx@email.com`) ou é algo como `wellness...f0674781` / outro formato?
   - Isso confirma se o problema é “link manual” vs “checkout app” ou se o MP está mudando/truncando a referência.

3. **Sempre que possível**  
   Orientar cliente a pagar pelo **link de checkout que o app gera** (tela de checkout do site/app), para garantir que a referência venha no formato esperado e o pagamento seja identificado na hora.

---

## Resumo

- O sistema **depende da external_reference** (e, quando existe, do metadata) para identificar quem é o usuário e qual o plano.
- **Metadata da Preference pode não vir no Payment**; referência truncada ou em outro formato (ex.: link de pagamento manual) quebra a identificação.
- **Por isso “não tínhamos esse desafio antes”** pode ser: mais uso de link de pagamento manual, mais checkout só com e-mail, ou mudança de conta/ambiente no MP.
- As alterações no webhook (fallback por e-mail e por descrição) e os scripts de correção reduzem o impacto quando isso acontecer.
