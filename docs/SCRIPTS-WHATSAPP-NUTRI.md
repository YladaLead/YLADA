# Scripts WhatsApp (Nutri) — visão geral

Este documento consolida os **textos pré-formulados** usados no fluxo de WhatsApp (Nutri), para revisão e ajustes.

## Como editar (onde cada texto vive)

- **Editáveis no admin (salvos no banco)**: `Admin → /admin/whatsapp/fluxo`
  - Fonte: `whatsapp_workshop_settings.flow_templates` (área `nutri`)
  - Variáveis suportadas: `{{nome}}`, `{{link}}`
  - Placeholder de opções: `[OPÇÕES inseridas automaticamente]` (substituído pelo sistema)

- **Textos fixos (sem IA) do menu “O que a Carol faça?”**: não ficam no `/admin/whatsapp/fluxo` hoje.
  - Fonte: `src/app/api/admin/whatsapp/carol/send-template/route.ts`
  - Variável suportada: `[NOME]` (substituída pelo primeiro nome)

- **Mensagens automáticas de lembretes / agendamento**: ficam no código.
  - Fontes principais:
    - `src/lib/whatsapp-automation/pre-class.ts` (24h/12h/2h/30min, agendadas)
    - `src/lib/whatsapp-carol-ai.ts` (link após escolha + lembretes/worker)
    - `src/app/api/admin/whatsapp/workshop/participants/enviar-lembretes/route.ts` (disparo manual de lembretes)

---

## 1) Templates editáveis em `/admin/whatsapp/fluxo` (Nutri)

### 1.1 `welcome_form_greeting` (Formulário — saudação)

```text
Oi {{nome}}! 😊

Seja muito bem-vinda!

Eu sou a Carol, da equipe Ylada Nutri.
```

### 1.2 `welcome_form_body` (Formulário — texto + opções)

> Observação: o bloco `[OPÇÕES inseridas automaticamente]` é preenchido com “Opção 1 / Opção 2 …”.

```text
A próxima aula é prática e vai te ajudar a ter mais constância pra preencher sua agenda.

As próximas aulas acontecerão nos seguintes dias e horários:

[OPÇÕES inseridas automaticamente]

Responde 1 ou 2 😊
```

### 1.3 `link_after_participou` (Pós-aula — quando marcar “Participou”)

```text
Olá {{nome}}! 💚

Parabéns por ter participado da aula — espero que tenha esclarecido os pontos que você precisava para realmente dar sua virada e começar a preencher sua agenda com mais segurança e estratégia.

Agora me conta: o que mais fez sentido pra você hoje?
Você está disposto(a) a mudar sua situação e começar agora?

Se sim, me diz: você prefere começar pelo plano *mensal* (pra validar com calma) ou já quer ir direto no *anual* (pra acelerar seus resultados)?

🔗 {{link}}

O que você acha? 😊
```

### 1.4 `remarketing_nao_participou` (Remarketing — quando marcar “Não participou”)

```text
Olá {{nome}}! 💚

Vi que você não conseguiu entrar na aula. Fica tranquilo(a), isso acontece.

Eu sei como é frustrante ver a agenda oscilando e sentir que você está fazendo tudo “certo”, mas mesmo assim não consegue preencher com constância. A aula foi justamente pra te mostrar um caminho mais claro e prático pra organizar isso.

Você ainda tem interesse em participar?
Se sim, eu te encaixo no próximo horário. Qual período fica melhor pra você: manhã, tarde ou noite?
```

---

## 2) Templates fixos (sem IA) — menu “O que a Carol faça?”

Fonte: `src/app/api/admin/whatsapp/carol/send-template/route.ts`

### 2.1 `pergunta_interesse_nao_respondeu`

```text
Oi, [NOME] 😊 tudo bem?
Só confirmando rapidinho: você ainda tem interesse em agendar a aula prática de agenda cheia?
```

### 2.2 `pergunta_interesse_nao_participou`

```text
Oi, [NOME] 😊 tudo bem?
Vi que você não conseguiu participar da aula, acontece!
Você ainda tem interesse em agendar uma nova data?
```

### 2.3 `followup_ficou_pensar`

```text
Oi, [NOME] 😊
Eu vi o seu interesse em se desenvolver de verdade, e isso pode começar agora.

A partir do momento que você faz a sua inscrição, você já tem acesso imediato à LYA e ganha a segurança que precisava pra saber exatamente o que fazer, passo a passo, pra preencher sua agenda com mais constância.

Vamos começar agora?
```

### 2.4 `ultima_chance`

```text
[NOME], prometo ser rápida 😊
Você quer que eu reserve uma vaga na próxima aula ou prefere deixar pra depois?
```

---

## 3) Primeira mensagem quando a pessoa chama no WhatsApp (Carol)

> Observação: a Carol envia uma **saudação curta** e depois segue com texto + opções.

### 3.1 Saudação (mensagem separada)

```text
Oi {NOME}! 😊

Seja muito bem-vinda!

Eu sou a Carol, da equipe Ylada Nutri.
```

### 3.2 Segunda parte (texto curto + opções + CTA)

```text
A próxima aula é prática e vai te ajudar a ter mais constância pra preencher sua agenda.

As próximas aulas acontecerão nos seguintes dias e horários:

[OPÇÕES]

Responde 1 ou 2 😊
```

---

## 4) Mensagem de “agendamento confirmado” (quando a pessoa escolhe Opção 1/2)

Fonte: `src/lib/whatsapp-carol-ai.ts` (envio do link da sessão escolhida)

```text
✅ *Perfeito! Você vai adorar essa aula!* 🎉

🗓️ {DIA}, {DATA}
🕒 {HORA} (horário de Brasília)

🔗 {LINK_ZOOM}

💡 *Dica importante:* A sala do Zoom será aberta 10 minutos antes do horário da aula. Chegue com antecedência para garantir sua vaga! 😊

Qualquer dúvida, é só me chamar! 💚
```

---

## 5) Notificações pré-aula (agendadas) — 24h / 12h / 2h / 30min

Fonte: `src/lib/whatsapp-automation/pre-class.ts`

### 5.1 24h antes (`pre_class_24h`)

```text
Olá {NOME}! 👋

Lembrete: Sua aula é amanhã!

🗓️ {DIA}, {DATA}
🕒 {HORA} (horário de Brasília)

🔗 {LINK_ZOOM}

Nos vemos lá! 😊
```

### 5.2 12h antes (`pre_class_12h`)

```text
Olá {NOME}!

Sua aula é hoje às {HORA}!

💻 *Recomendação importante:*

O ideal é participar pelo computador ou notebook, pois:
* Compartilhamos slides
* Fazemos explicações visuais
* É importante acompanhar e anotar

Pelo celular, a experiência fica limitada e você pode perder partes importantes da aula.

🔗 {LINK_ZOOM}
```

### 5.3 2h antes (`pre_class_2h`) — sem link

```text
Olá {NOME}! Só um aviso: começaremos pontualmente na {DIA}, {DATA} às {HORA} (horário de Brasília).

💡 Dicas: use o computador, tenha caneta e papel à mão e mantenha a câmera aberta — é uma aula prática.

⚠️ Após 10 minutos do início não será mais permitida a entrada.

Nos vemos em breve! 😊
```

### 5.4 30min antes (`pre_class_30min`)

```text
Olá {NOME}! Em breve começaremos juntos! ⏰
```

---

## 6) Lembretes manuais (admin) — “aula hoje” / “30min” / “sala aberta”

Fonte: `src/app/api/admin/whatsapp/workshop/participants/enviar-lembretes/route.ts`

### 6.1 Tipo `aula_hoje`

```text
Olá {NOME}! Sua aula é hoje às {HORA}!

Ideal participar pelo computador e ter caneta e papel à mão — a aula é bem prática.

🔗 {LINK_ZOOM}
```

### 6.2 Tipo `30min`

```text
Olá {NOME}! Em breve começaremos juntos! ⏰
```

### 6.3 Tipo “sala aberta”

```text
A sala está aberta! 🎉

🔗 {LINK_ZOOM}
```

