# Correção: pagamento Wellness não reconhecido (transferência bancária)

## O que aconteceu

Pagamentos aprovados no Mercado Pago (ex.: **transferência bancária**) às vezes não são reconhecidos automaticamente no painel porque:

1. **Webhook não notifica** — Em alguns fluxos (ex.: transferência), o MP pode atrasar ou não enviar o webhook.
2. **Metadata/referência incompleta** — O link de pagamento pode não ter enviado `user_id` ou a referência pode vir truncada.
3. **E-mail do pagador em outro campo** — Na API do MP, o e-mail pode vir em `additional_info.payer` ou em outros campos, e o código antigo só olhava `payer.email`.

## Correção definitiva (já aplicada no código)

- **Webhook** (`src/app/api/webhooks/mercado-pago/route.ts`):
  - Extração do **e-mail do pagador** em mais fontes: `payer`, `payer_email`, `additional_info.payer`, `collector`, e **e-mail extraído do `external_reference`** (ex.: `wellness_monthly_temp_email@dominio.com`).
  - Assim, mesmo que o pagamento venha com poucos dados (ex.: transferência), o sistema consegue identificar o usuário pelo e-mail e criar/atualizar a assinatura.

Com isso, novos pagamentos tendem a ser reconhecidos automaticamente. Para pagamentos **já aprovados** que ficaram sem acesso, use a correção imediata abaixo.

---

## Correção imediata: Marcia Dalavechia e Rose Leite (17/02)

**Transações:**
- **Marcia Dalavechia** — N.º 146535078400 — e-mail: `ecommerceherbalife@gmail.com` — YLADA WELLNESS - Plano Mensal  
- **Rose Leite** — N.º 146559917050 — e-mail: `rosecarlaleite@gmail.com` — YLADA WELLNESS - Plano Mensal  

### Passo 1: Sincronizar os pagamentos (recomendado)

Com usuário **admin** logado, chame a API de sync para cada transação. Isso busca o pagamento no Mercado Pago, associa ao usuário (por e-mail ou referência), cria/atualiza a assinatura e envia o e-mail de boas-vindas (se ainda não enviado).

**Opção A — pelo front (devtools ou Postman):**

```http
POST /api/admin/mercado-pago/sync-payment
Content-Type: application/json
Cookie: <sessão admin>

{ "payment_id": "146535078400" }
```

Depois:

```http
POST /api/admin/mercado-pago/sync-payment
Content-Type: application/json
Cookie: <sessão admin>

{ "payment_id": "146559917050" }
```

**Opção B — cURL (com token de sessão):**

Substitua `SEU_TOKEN_OU_COOKIE` por um Bearer token ou use o cookie de sessão após logar no app como admin.

```bash
curl -X POST 'https://<SEU_DOMINIO>/api/admin/mercado-pago/sync-payment' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: sb-access-token=SEU_TOKEN_OU_COOKIE' \
  -d '{"payment_id": "146535078400"}'

curl -X POST 'https://<SEU_DOMINIO>/api/admin/mercado-pago/sync-payment' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: sb-access-token=SEU_TOKEN_OU_COOKIE' \
  -d '{"payment_id": "146559917050"}'
```

Resposta esperada: `{ "success": true, "message": "Pagamento sincronizado com sucesso." }`.  
Após o sync, as duas já terão assinatura ativa. Em seguida, escolha **uma** das opções abaixo para elas acessarem e comunique.

---

### Passo 2: Dar acesso imediato e comunicar

Escolha **uma** das formas abaixo. A partir daí elas já conseguem entrar na plataforma.

#### Opção A — Senha fixa temporária (mais simples de comunicar)

Você define uma senha única e envia por WhatsApp/e-mail. Elas entram com o **e-mail delas** + essa senha.

1. **Definir a senha** (com admin logado). Exemplo para a Márcia com senha `Herba123`:

```http
POST /api/admin/reset-password
Content-Type: application/json
Cookie: <sessão admin>

{ "email": "ecommerceherbalife@gmail.com", "newPassword": "Herba123" }
```

Depois o mesmo para a Rose (outra senha se quiser):

```http
POST /api/admin/reset-password
Content-Type: application/json
Cookie: <sessão admin>

{ "email": "rosecarlaleite@gmail.com", "newPassword": "Ylada2025!" }
```

2. **Mensagem para enviar (WhatsApp ou e-mail)** — personalize o nome:

**Para Márcia (senha Herba123):**
> Olá, Márcia! Seu pagamento foi confirmado e seu acesso ao YLADA Wellness está liberado.  
> Acesse: https://www.ylada.com/pt/wellness/login  
> E-mail: ecommerceherbalife@gmail.com  
> Senha: **Herba123**  
> (Recomendamos trocar a senha no primeiro acesso em Configurações.)  
> Qualquer dúvida: (19) 99604-9800.

**Para Rose:**
> Olá, Rose! Seu pagamento foi confirmado e seu acesso ao YLADA Wellness está liberado.  
> Acesse: https://www.ylada.com/pt/wellness/login  
> E-mail: rosecarlaleite@gmail.com  
> Senha: **Rose2025!** (ou a que você definir no admin)  
> (Recomendamos trocar a senha no primeiro acesso em Configurações.)  
> Qualquer dúvida: (19) 99604-9800.

**Telefone do suporte:** (19) 99604-9800 — use nas mensagens/e-mails quando quiser que a cliente tenha onde ligar.

---

#### Opção B — Link de acesso por e-mail (um clique, sem senha)

O sistema envia um e-mail com um link. Elas clicam e já entram, sem digitar senha.

1. **Enviar o link** (pode ser chamado sem ser admin; o e-mail só é enviado se a pessoa tiver assinatura ativa — por isso faça o **sync antes**):

```http
POST /api/email/send-access-link
Content-Type: application/json

{ "email": "ecommerceherbalife@gmail.com" }
```

Depois:

```http
POST /api/email/send-access-link
Content-Type: application/json

{ "email": "rosecarlaleite@gmail.com" }
```

2. **Mensagem para enviar (WhatsApp ou e-mail):**

> Olá! Seu pagamento foi confirmado e seu acesso ao YLADA Wellness está liberado.  
> Enviamos um e-mail com um **link de acesso** (verifique também a pasta de spam/promoções). Clique no link para entrar na plataforma. Se não receber em alguns minutos, responda aqui que te ajudamos.

---

### Resumo

| O que fazer | Quando |
|-------------|--------|
| Sync dos dois pagamentos | Sempre (Passo 1). |
| Opção A (senha fixa) | Se quiser enviar login e senha direto por WhatsApp. |
| Opção B (link por e-mail) | Se quiser que elas entrem só clicando no link do e-mail. |

O canal para comunicar é o que você já usa com elas (WhatsApp, e-mail, etc.); use os textos acima conforme a opção escolhida.

---

## Jeito mais simples na prática

- **Márcia (você já está falando com ela)**  
  O mais simples: na conversa que já existe, manda o acesso.  
  - Ou senha fixa: você define a senha (Passo 2, Opção A), aí manda: “Seu acesso está liberado. Entra aqui: https://www.ylada.com/pt/wellness/login — e-mail: ecommerceherbalife@gmail.com — senha: [a senha que você definiu]. Troca a senha no primeiro acesso.”  
  - Ou link por e-mail: você chama o send-access-link para o e-mail dela e fala: “Te enviamos um e-mail com o link de acesso; olha a caixa de entrada e o spam.”

- **Rose Carla (você nem sabe quem é)**  
  O único dado que você tem é o **e-mail do pagamento**: rosecarlaleite@gmail.com.  
  O mais simples: **não precisa falar com ela por outro canal**.  
  1. Fazer o sync do pagamento dela (Passo 1).  
  2. Chamar `POST /api/email/send-access-link` com `{ "email": "rosecarlaleite@gmail.com" }`.  
  O sistema envia o e-mail com o link de acesso para esse endereço. Ela abre o e-mail, clica no link e já entra. Você não precisa achar WhatsApp nem “comunicar” ela manualmente — o próprio e-mail do sistema já comunica.

  **Senha e próximos acessos:** A conta dela foi criada com uma senha aleatória (ela não sabe). No sistema ela aparece normal (e-mail, assinatura); senha não fica visível em nenhum lugar. No primeiro acesso ela entra só pelo link do e-mail. Para entrar de novo depois, ela precisa usar "Recuperar acesso" (recebe novo link) ou ter uma senha. Recomendação: definir uma senha fixa para ela também (ex.: `Rose2025!`) via admin (`POST /api/admin/reset-password` com `"email": "rosecarlaleite@gmail.com"`, `"newPassword": "Rose2025!"`) e avisar por e-mail: "Quando for entrar de novo, use seu e-mail e a senha: Rose2025!. Pode trocar em Configurações depois."

---

## Se o sync não resolver (alternativa em SQL)

Se por algum motivo o sync retornar erro (ex.: pagamento já processado com outro formato, ou usuário já existe sem assinatura), use o script SQL em `scripts/corrigir-assinatura-wellness-marcia-rose.sql`: ele cria/atualiza assinatura e registro de pagamento para os dois e-mails. **Só use após tentar o sync**, pois o sync é a forma oficial e ainda dispara o e-mail de boas-vindas.

---

## Uso futuro do sync-payment

Sempre que um pagamento **aprovado** no Mercado Pago não refletir no painel:

1. Anote o **N.º da transação** (payment_id) no MP.
2. Chame `POST /api/admin/mercado-pago/sync-payment` com `{ "payment_id": "<id>" }` (e `"is_test": true` só se for pagamento de teste).
3. Confira no admin se a assinatura e o usuário foram criados/atualizados e avise a cliente.

Referência do endpoint: `src/app/api/admin/mercado-pago/sync-payment/route.ts`.
