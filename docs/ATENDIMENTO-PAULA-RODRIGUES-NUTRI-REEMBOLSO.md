# Atendimento: Paula Rodrigues (Nutri) – Cobrança indevida dentro dos 7 dias

## Situação relatada

- **Cliente:** Paula Rodrigues (área Nutri)
- **Problema:** Cancelou o cartão / assinatura ainda durante os 7 dias gratuitos e mesmo assim foi cobrada no cartão.

## Possíveis causas

1. **Ela “cancelou o cartão”** (bloqueou o cartão no banco) em vez de **cancelar a assinatura** dentro do app. A assinatura no Mercado Pago continuou ativa e a cobrança foi feita (ou tentada).
2. **Cancelou pelo app**, mas o sistema **não cancelou no Mercado Pago** (ID da assinatura no app diferente do formato esperado, ou falha na API).
3. **Primeira cobrança já tinha sido feita** no início do trial; ela cancelou dentro dos 7 dias, mas o **reembolso não é automático** – o sistema só avisa o admin para reembolso manual.

## O que o sistema faz hoje

- **Cancelamento pelo app:**  
  Configurações → Cancelar Assinatura → Confirmar.  
  O endpoint `confirm-cancel` tenta cancelar no **Mercado Pago** (se tiver `gateway_subscription_id` / preapproval) e sempre cancela no **banco**.
- **Reembolso:**  
  Se a pessoa pede reembolso e está dentro dos 7 dias, o sistema **não reembolsa sozinho**. Apenas:
  - Registra a solicitação
  - Envia notificação (email/WhatsApp) para o **admin**  
  O reembolso precisa ser feito **manualmente** no Mercado Pago (ou Stripe).

---

## Passo a passo para o atendimento

### 1) Identificar a cliente no sistema

- Email provável: **anarodriguespr10@gmail.com** (Ana Paula Rodrigues – mesma pessoa dos scripts de diagnóstico).
- Use o script: **`scripts/suporte-consulta-paula-rodrigues-nutri.sql`** (rodar no Supabase → SQL Editor).  
  Ele retorna: usuário, perfil, assinaturas, pagamentos e IDs do gateway.

### 2) Confirmar se a assinatura está cancelada no app

- No resultado do script, veja `subscriptions.status` e `subscriptions.canceled_at`.
- Se ainda estiver `active`, cancele pelo admin ou peça para ela cancelar em Configurações → Cancelar Assinatura.

### 3) Garantir cancelamento no Mercado Pago

- No script, anote: `stripe_subscription_id` ou `gateway_subscription_id` ou `mercado_pago_preapproval_id`.
- Se o valor for tipo `mp_144868205799`, no MP o ID real costuma ser só o número (ex.: `144868205799`).  
  No **Mercado Pago** (painel de assinaturas / preapprovals):
  - Localize a assinatura pelo ID ou pelo email da cliente.
  - **Cancele a assinatura** para não gerar novas cobranças.

### 4) Fazer o reembolso (ela estava nos 7 dias)

- Política do app: **garantia de 7 dias** – quem cancela nesse prazo tem direito a **reembolso**.
- No **Mercado Pago**:  
  Pagamentos → localize a transação da cobrança (ex.: ID **144868205799** mencionado nos scripts) → **Reembolsar** (valor total).
- Se a cobrança foi no **Stripe**, faça o reembolso pelo Stripe Dashboard na charge correspondente.

### 5) Resposta sugerida para a cliente

> Olá, Paula!  
> Verificamos seu caso: você cancelou dentro do período de 7 dias, e nossa política é de reembolso nessa situação.  
> Sua assinatura foi cancelada em nosso sistema e **o reembolso no cartão será processado em até X dias úteis** [ajustar conforme o que o MP/Stripe indicar].  
> Qualquer nova cobrança não deve ocorrer; se aparecer algo no extrato, nos avise que conferimos de novo.  
> Desculpe pelo transtorno.

---

## Evitar casos assim no futuro

1. **Comunicar claramente:**  
   “Para não ser cobrada, é preciso **cancelar a assinatura** em Configurações do app. Só bloquear o cartão não cancela a assinatura.”
2. **Reembolso automático:**  
   O código hoje só notifica o admin. Implementar reembolso automático no Mercado Pago (e Stripe) quando `requestRefund === true` e `withinGuarantee === true` reduz atrito e reclamações.

---

## Scripts relacionados

- **Diagnóstico geral Nutri:** `scripts/diagnostico-clientes-area-nutri.sql`
- **Diagnóstico desta cliente:** `scripts/verificar-ana-paula-rodrigues.sql`
- **Consulta para suporte (esta cliente):** `scripts/suporte-consulta-paula-rodrigues-nutri.sql`
