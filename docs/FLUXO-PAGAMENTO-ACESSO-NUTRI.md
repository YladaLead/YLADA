# Fluxo: Pagamento → Acesso à plataforma Nutri

Revisão do processo para garantir que **quem paga entre na plataforma com acesso correto**, sem depender de ajustes manuais. Inclui correções aplicadas após casos em que a cliente pagou mas não conseguiu acessar ou viu "Acesso Restrito".

---

## 1. Fluxo atual (resumo)

1. **Checkout** (`/pt/nutri/checkout`)
   - Usuário logado ou não (pode informar só e-mail).
   - Front chama `POST /api/nutri/checkout` com `planType`, `productType` (ex.: `platform_monthly`, `platform_annual`).
   - Gateway (Mercado Pago BR) cria Preference com **metadata**: `user_id` (ou `temp_<email>`), `area`, `plan_type`, **`product_type`**.
   - Usuário é redirecionado ao MP para pagar.

2. **Após o pagamento**
   - MP redireciona para **`/pt/nutri/pagamento-sucesso?gateway=mercadopago`** (sem `payment_id` na URL; o ID vem só no webhook).
   - Em paralelo, MP chama o **webhook** com o pagamento aprovado.

3. **Webhook** (`/api/webhooks/mercado-pago`)
   - Lê `metadata` do pagamento (às vezes o MP **não repassa** o metadata da Preference para o Payment).
   - Obtém `user_id` (ou `temp_<email>`) e, se for `temp_`, **cria usuário** no Auth e perfil em `user_profiles`.
   - Calcula **features** com `determineFeatures(area, planType, productType)`.
   - Cria ou atualiza linha em **`subscriptions`** com `status: active`, `current_period_end` e **`features`**.
   - Envia **e-mail de boas-vindas** com link de acesso (quando aplicável).

4. **Acesso à plataforma**
   - Layout protegido exige **assinatura ativa** (`hasActiveSubscription`).
   - Páginas de ferramentas/área restrita exigem **features** `ferramentas` ou `completo` (`RequireFeature` / `hasFeatureAccess`).
   - Se `subscriptions.features` estiver vazio ou sem `ferramentas`/`completo`, a pessoa vê **"Acesso Restrito"**.

---

## 2. Onde podia falhar (e o que foi ajustado)

### 2.1. Metadata do pagamento sem `product_type`

- **Problema:** No webhook, o Payment do MP às vezes não traz o `metadata` da Preference (ou traz sem `product_type`). Aí `productType` ficava `undefined` e a lógica antiga podia não definir features para Nutri como esperado.
- **Correção:** Em **`determineFeatures`**:
  - Para **Nutri**, se `productType` for `undefined` ou qualquer um de `platform_monthly`, `platform_monthly_12x`, `platform_annual`, passamos a retornar sempre **`['ferramentas', 'cursos']`**.
  - Só `formation_only` continua retornando `['cursos']`.
- **Efeito:** Todo pagamento Nutri (plataforma) passa a ter acesso às áreas restritas, mesmo quando o metadata não vier no Payment.

### 2.2. Garantia extra no webhook

- **Problema:** Se, por qualquer bug ou edge case, `features` viesse vazio para Nutri, a assinatura era salva com array vazio e a pessoa via "Acesso Restrito".
- **Correção:** No webhook (tanto no fluxo de **pagamento único** quanto no de **assinatura recorrente**), logo após `determineFeatures`:
  - Se `area === 'nutri'` e `features` for vazio ou inexistente, forçamos **`features = ['ferramentas', 'cursos']`** antes de gravar em `subscriptions`.
- **Efeito:** Nunca gravamos assinatura Nutri sem acesso à plataforma.

### 2.3. Quem não conseguiu acessar (login/senha)

- **Problema:** Quem paga **sem estar logado** tem conta criada pelo webhook (com `temp_<email>`). O MP redireciona para a página de sucesso, mas a pessoa **não está logada** nesse momento; o acesso depende do **e-mail de boas-vindas** ou de "Recuperar senha".
- **Fluxo correto:** Na página **Pagamento confirmado**, a pessoa deve:
  - Clicar em "Continuar e Completar Cadastro" (ou "Preencher seu Cadastro") → vai para `/pt/nutri/onboarding?payment=success`, ou
  - Usar o link do e-mail de boas-vindas, ou
  - Ir em "Já tem conta? Fazer login" ou "Não recebeu o e-mail? Recuperar acesso".
- **Suporte:** Se a pessoa não recebeu o e-mail ou não lembra a senha, usar **senha provisória** (ex.: script/API de reset) e enviar o passo a passo (ver `scripts/senha-provisoria-diapitt.md`). Confirmar com ela o **e-mail cadastrado** (pode ser outro que o informado).

---

## 3. Nada antigo atrapalhando

- A lógica de **features** foi revisada e centralizada em **`determineFeatures`** no webhook; não há outro lugar que defina features para Nutri de forma conflitante.
- **Layout protegido** e **RequireFeature** continuam iguais: exigem assinatura ativa e, nas rotas restritas, features `ferramentas` ou `completo`. A diferença é que, a partir das correções, toda assinatura Nutri (plataforma) passa a ser criada/atualizada já com essas features.
- Para **assinaturas antigas** já criadas sem features (ex.: caso Diana), usar o script **`scripts/corrigir-assinatura-nutri-diana-diapitt.sql`** (ou equivalente para outro e-mail) para atualizar `subscriptions.features` para `["ferramentas", "cursos"]`.

---

## 4. Resumo das alterações no código

| Arquivo | Alteração |
|--------|-----------|
| `src/app/api/webhooks/mercado-pago/route.ts` | `determineFeatures`: Nutri sem `productType` ou com `platform_*` retorna `['ferramentas', 'cursos']`. Fallback defensivo: para Nutri, se `features` vier vazio antes de gravar, forçar `['ferramentas', 'cursos']` (tanto no fluxo de payment quanto no de subscription). |

---

## 5. Checklist pós-pagamento (suporte)

- [ ] Cliente recebeu e-mail de boas-vindas? Se não, reenviar ou usar "Reenviar E-mail" na página de pagamento-sucesso (ou enviar link de recuperar senha).
- [ ] E-mail usado no pagamento é o mesmo do cadastro? Se não, corrigir senha/acesso para o e-mail correto.
- [ ] Cliente vê "Acesso Restrito"? Verificar em `subscriptions` se o `user_id` dela tem `features` com `ferramentas` (e/ou `cursos`/`completo`). Se estiver vazio, rodar script de correção (ex.: `corrigir-assinatura-nutri-diana-diapitt.sql` para o e-mail correto).
