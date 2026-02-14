# Fluxo de remate fixo — aula gratuita (participou e não participou)

Fluxo **fixo e efetivo** de fechamento/remarketing para quem participou da aula gratuita e para quem não participou. Executado automaticamente pelo **Process All** (cron ou botão no admin).

---

## Visão geral

| Público | 1ª mensagem | 2ª mensagem | 3ª mensagem |
|--------|-------------|-------------|-------------|
| **Participou** | Link + oferta (ao marcar "participou") | Lembrete com dor (10h depois) | Último argumento (+2 dias após 2ª) |
| **Não participou** | Remarketing "ainda tem interesse?" (ao marcar "não participou" ou disparo) | Reforço + oferta de horários (24h depois) | Último convite (+2 dias após 2ª) |

---

## Remate quem PARTICIPOU

### Gatilhos e condições

- **1ª mensagem:** ao marcar "✅ Participou" no admin → `sendRegistrationLinkAfterClass`. Envia link de oferta + imagem (se configurada). Marca `recebeu_1a_msg_fechamento` e `registration_link_sent`.
- **2ª mensagem:** `runRemateFechamentoParticipou()` (no Process All). Envia para quem:
  - Tem `participou_aula` e `registration_link_sent`
  - **Não** tem `cliente_nutri`, `respondeu_fechamento`, `nao_quer_mais`, `quer_falar_humano`
  - **Não** tem `recebeu_lembrete_fechamento`
  - Passaram **pelo menos 10h** desde `registration_link_sent_at`
- **3ª mensagem:** mesmo fluxo. Envia para quem:
  - Já tem `recebeu_lembrete_fechamento`
  - **Não** tem `recebeu_3a_msg_fechamento`
  - Passaram **pelo menos 2 dias** desde `recebeu_lembrete_fechamento_at`

### Conteúdo (2ª e 3ª)

- **2ª:** reforço de dor (“o que custa não dar o próximo passo”), link, pergunta “o que está te travando?”.
- **3ª:** “última mensagem sobre isso”, custo de adiar, valor R$ 97 e link; “se tiver dúvida, responde aqui”.

### Etiquetas / context

- Após 1ª: `recebeu_1a_msg_fechamento`, `registration_link_sent`, `registration_link_sent_at`.
- Após 2ª: `recebeu_lembrete_fechamento`, `recebeu_lembrete_fechamento_at`.
- Após 3ª: `recebeu_3a_msg_fechamento`.

---

## Remate quem NÃO PARTICIPOU

### Gatilhos e condições

- **1ª mensagem:** ao marcar "❌ Não participou" → `sendRemarketingToNonParticipant`. Ou em massa: `sendRemarketingToNonParticipants`. Mensagem: “não conseguiu entrar na aula… ainda tem interesse? Qual período: manhã, tarde ou noite?”. Marca `remarketing_enviado` e `last_remarketing_at`.
- **2ª mensagem:** `runRemateNaoParticipou()` (no Process All). Envia para quem:
  - Tem `nao_participou_aula` e **não** tem `participou_aula`
  - **Não** tem `recebeu_3a_remate_nao_participou`
  - Tem `last_remarketing_at` com **pelo menos 24h** de atraso
  - **Não** tem `recebeu_2a_remate_nao_participou`
- **3ª mensagem:** mesmo fluxo. Envia para quem:
  - Tem `recebeu_2a_remate_nao_participou`
  - **Não** tem `recebeu_3a_remate_nao_participou`
  - Passaram **pelo menos 2 dias** desde `recebeu_2a_remate_nao_participou_at`

### Conteúdo (2ª e 3ª)

- **2ª:** reforço (“aula é gratuita… ainda tem interesse?”), opções de horário (próximas sessões do workshop) ou “me responde que eu te mando as opções”; pergunta período (manhã, tarde, noite).
- **3ª:** “última mensagem sobre a aula gratuita”; “se um dia fizer sentido participar, é só me chamar que eu te encaixo”.

### Etiquetas / context

- Após 1ª: `remarketing_enviado`, `last_remarketing_at`.
- Após 2ª: `recebeu_2a_remate_nao_participou`, `recebeu_2a_remate_nao_participou_at`.
- Após 3ª: `recebeu_3a_remate_nao_participou`.

---

## Onde roda

- **Process All** (`POST /api/admin/whatsapp/automation/process-all`):
  - Passo **7:** `runRemateFechamentoParticipou()` → 2ª e 3ª para quem participou.
  - Passo **8:** `runRemateNaoParticipou()` → 2ª e 3ª para quem não participou.

Chamado pelo **cron** (Vercel Cron com `CRON_SECRET`) ou manualmente pelo admin. Respeita horário permitido (8h–19h seg–sex, até 13h sábado) e usa **delay + blocos** (`bulkSendDelay`) entre envios.

---

## Resumo

- **Participou:** 1ª = link pós-participou (admin marca); 2ª = 10h depois, lembrete com dor; 3ª = +2 dias, último argumento.
- **Não participou:** 1ª = remarketing “ainda tem interesse?” (admin ou disparo); 2ª = 24h depois, reforço + horários; 3ª = +2 dias, último convite.
- Tudo controlado por **tags e datas** no `context`; remates 2ª e 3ª rodam no **Process All** sem necessidade de campanha manual.

Data: fevereiro 2025.
