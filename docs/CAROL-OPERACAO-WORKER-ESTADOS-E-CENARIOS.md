# Carol — Operação Worker, Estados e Cenários (fonte única)

Objetivo: uma única referência para operar a automação da Carol, derivar estado a partir das tags e validar comportamento com cenários Given/When/Then.

---

## 1. Worker (não usar Cron)

**Automação oficial:** Worker on-demand. O sistema **não usa Cron**.

| O quê | Endpoint | Quando usar |
|-------|----------|-------------|
| Processar tudo (boas-vindas + fila + pré-aula + follow-up + participou/não participou) | `POST /api/admin/whatsapp/automation/process-all` | Rodar periodicamente (ex.: 1x/dia ou 1x a cada 1–2h), ou manualmente pelo admin |
| Processar só a fila de mensagens agendadas | `POST /api/admin/whatsapp/automation/process` | Quando quiser escoar a fila sem rodar o “process-all” |

**Legado (não usar como rotina):**  
`GET /api/cron/whatsapp-carol?tipo=...` e `GET /api/cron/whatsapp-carol/pre-class` existem só para compatibilidade/chamada manual. Preferir sempre o worker.

---

## 2. Regra da primeira mensagem (cadastro → WhatsApp)

- Depois do **cadastro no workshop**, o sistema espera **60 segundos** antes de enviar a mensagem automática.
- Objetivo: dar tempo de a pessoa **clicar no botão do WhatsApp** primeiro. Se ela clicar, **ela nos chama**; nós não iniciamos a conversa. Reduz risco de problema com o WhatsApp.
- Se, após 60s, já existir **qualquer mensagem do cliente** nessa conversa → **não enviar** a mensagem automática (ela já nos chamou).
- **Nome na primeira mensagem:** tanto quando **ela** envia pelo WhatsApp quanto quando **nós** abrimos a conversa após 60s, usar **apenas o primeiro nome** preenchido no cadastro (ex.: "Maria Silva" → "Maria"). Nunca nome completo nem e-mail no lugar do nome.
- Implementação: `sendWorkshopInviteToFormLead` em `src/lib/whatsapp-form-automation.ts` (delay 60s + checagem de mensagem do customer + `getFirstName` para o nome); Carol usa `getFirstName(getRegistrationName(...))` quando responde à primeira mensagem dela.

---

## 3. Derivação de estado (tags → estado)

A Carol e o backend devem usar **estado derivado das tags/contexto**, não do texto da conversa.

| Estado | Nome | Condição (tags/contexto) | Carol |
|--------|------|---------------------------|-------|
| **A** | Inscrito, não chamou no WhatsApp | Lead inscrito; ainda não há mensagem do cliente OU conversa sem tags de workshop | Não atua (a primeira mensagem é da automação) |
| **B** | Chamou no WhatsApp, ainda não fechou aula | `veio_aula_pratica` ou `recebeu_link_workshop`; sem `participou_aula` e sem `nao_participou_aula`; pode ter ou não `workshop_session_id` | Modo Secretária: logística, confirmar horário, não persuadir |
| **C1** | Participou da aula | `participou_aula` | Modo Decisão: fechamento, âncora + pergunta reflexiva |
| **C2** | Não participou da aula | `nao_participou_aula` (e não `participou_aula`) | Modo Reengajamento: reagendar, 1 âncora, pergunta reflexiva |
| **D** | Pós-aula (decisão) | Igual C1 ou C2 para efeito de copy; fluxos de follow-up/vendas | Idem C1/C2 |

**Regras de derivação no código (resumo):**

- **A:** inscrição existe; na conversa do WhatsApp ainda não há `sender_type = 'customer'` OU não há tags `veio_aula_pratica` / `recebeu_link_workshop`.
- **B:** tem `veio_aula_pratica` ou `recebeu_link_workshop`; não tem `participou_aula` nem `nao_participou_aula`.
- **C1:** `participou_aula` ∈ tags.
- **C2:** `nao_participou_aula` ∈ tags e `participou_aula` ∉ tags.
- Quem **muda** C1/C2 é só o admin (ex.: POST em `/api/admin/whatsapp/workshop/participants`). A Carol só **lê** essas tags.

---

## 4. Cenários Given/When/Then (para testes e validação)

### 4.1 Estado B — Ela clicou no botão (“Acabei de me inscrever…”)

- **Given:** estado B, tag `recebeu_link_workshop` ou `veio_aula_pratica`, já existe mensagem do bot com opções de aula.
- **When:** usuário envia “Acabei de me inscrever na aula prática da YLADA NUTRI e gostaria de agendar”.
- **Then:** Carol responde em 1–2 frases; **não** repete boas-vindas; **não** repete lista de opções; pergunta qual horário funciona melhor (ex.: “As opções já foram enviadas na mensagem acima. Qual delas funciona melhor para você?”).

### 4.2 Estado B — Resposta curta “Ok” / “Entendi”

- **Given:** estado B, já existe mensagem do bot com opções.
- **When:** usuário envia “Ok” ou “Entendi” ou “Certo”.
- **Then:** Carol responde em **uma** frase curta; **não** repete opções nem boas-vindas (ex.: “Qualquer dúvida, é só me chamar!” ou “Fico no aguardo da sua escolha!”).

### 4.3 Estado B — Pedido explícito de horários

- **Given:** estado B.
- **When:** usuário pergunta horários ou “quais opções?”.
- **Then:** Carol envia opções no formato padrão (duas próximas sessões); termina com pergunta (ex.: “Qual desses horários funciona melhor pra você?”).

### 4.4 Estado C2 — Não participou

- **Given:** tags contêm `nao_participou_aula`, não contêm `participou_aula`.
- **When:** usuário envia qualquer mensagem OU admin dispara remarketing.
- **Then:** Carol usa copy de reengajamento; **uma** âncora emocional autorizada; **uma** pergunta reflexiva; **não** lista benefícios nem justifica preço; **não** usa “Posso ajudar?”, “Tem dúvida?”, “Quer que eu explique?”.

### 4.5 Estado C1 / D — Participou (fechamento)

- **Given:** tags contêm `participou_aula`.
- **When:** usuário envia mensagem ou é disparado fluxo de fechamento.
- **Then:** Carol usa copy de decisão; **uma** âncora emocional; **uma** pergunta reflexiva; **não** repete “não conseguiu participar”; **não** usa perguntas genéricas proibidas.

### 4.6 Prioridade estado vs. texto

- **Given:** tags dizem `participou_aula` e na conversa há texto que sugere “não participou”.
- **When:** Carol gera resposta.
- **Then:** Carol segue o **estado/tags** (`participou_aula`), não o texto da conversa. Ou seja: nunca dizer “não conseguiu participar” nesse caso.

### 4.7 Cadastro + 60s — Ela já clicou no WhatsApp

- **Given:** pessoa acabou de se inscrever no workshop; em menos de 60s ela já enviou uma mensagem pelo WhatsApp (clicou no botão).
- **When:** passam 60s e o sistema vai enviar a mensagem automática de boas-vindas.
- **Then:** o sistema **não** envia a mensagem automática (já existe mensagem do cliente nessa conversa = “ela nos chamou”).

### 4.8 Cadastro + 60s — Ela não clicou

- **Given:** pessoa acabou de se inscrever; em 60s ela **não** enviou nenhuma mensagem no WhatsApp.
- **When:** passam 60s e o sistema dispara `sendWorkshopInviteToFormLead`.
- **Then:** o sistema envia a mensagem de boas-vindas com opções de aula (uma vez só para essa conversa/telefone).

---

## 5. Onde está no código

| Conceito | Onde |
|----------|------|
| Delay 60s + “não enviar se ela já mandou msg” | `src/lib/whatsapp-form-automation.ts` → `sendWorkshopInviteToFormLead` |
| Worker process-all | `src/app/api/admin/whatsapp/automation/process-all/route.ts` |
| Worker process (fila) | `src/app/api/admin/whatsapp/automation/process` + `src/lib/whatsapp-automation/worker.ts` |
| Definição de estado/tags na Carol | `src/lib/whatsapp-carol-ai.ts` → `processIncomingMessageWithCarol` / `generateCarolResponse` |
| Admin marca participou/não participou | `POST /api/admin/whatsapp/workshop/participants` |

---

## 6. Checklist operacional

- [ ] Automação recorrente feita por **Worker** (`process-all`), não por Cron.
- [ ] Após cadastro no workshop: **60s** de espera; se a pessoa já mandou mensagem, **não** enviar mensagem automática.
- [ ] Carol usa **estado** (tags) para decidir o que falar; **não** deduce fase pelo texto.
- [ ] Em estado B: Carol **não** repete boas-vindas nem opções quando a pessoa clicou no botão ou respondeu “Ok”/“Entendi”.
- [ ] C1/C2 só mudam pelo admin; Carol só lê `participou_aula` / `nao_participou_aula`.

---

*Última atualização: janeiro 2026. Fonte única para operação Worker, estados e cenários da Carol.*
