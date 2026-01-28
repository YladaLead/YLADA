# Fluxo: Cadastro → Botão WhatsApp → O que acontece (objetivo)

**Objetivo:** Entender de forma direta o que acontece depois do cadastro, quando a pessoa clica no botão do WhatsApp, o que é fluxo automático (script fixo) e quando a Carol (IA) entra.

---

## 1. Cadastro (pessoa preenche o formulário)

| Passo | O que acontece |
|-------|----------------|
| 1 | Pessoa preenche nome, email, telefone na página (ex.: `/pt/nutri/workshop-agenda-instavel`). |
| 2 | Front chama **POST `/api/nutri/workshop/inscricao`**. |
| 3 | **Supabase:** dados vão para a tabela `workshop_inscricoes` (nome, email, telefone, status `inscrito`). |
| 4 | **Email:** é enviado email de confirmação para o email cadastrado (Resend). |
| 5 | **Automação WhatsApp (se ligada):** a API chama `sendWorkshopInviteToFormLead(telefone, nome, 'nutri')`. Essa função **não envia na hora**: ela agenda um delay de **60 segundos** e só depois tenta enviar uma mensagem de boas-vindas (script fixo). O motivo: dar tempo da pessoa **clicar no botão do WhatsApp** e enviar a primeira mensagem antes; se ela já tiver enviado, a automação **não envia** (evita duplicar). |
| 6 | A página mostra **“Cadastro confirmado”** e o botão **“Quero agendar no WhatsApp agora”**. |

**Resumo:** Cadastro → grava no Supabase → email → em paralelo, “timer” de 60s para possível mensagem automática (script fixo).

---

## 2. Botão “Quero agendar no WhatsApp agora”

| Passo | O que acontece |
|-------|----------------|
| 1 | O botão abre o **WhatsApp** (wa.me) do número da Ylada Nutri com uma mensagem **pré-preenchida**: *“Acabei de me inscrever na aula prática da YLADA NUTRI e gostaria de agendar”*. |
| 2 | A pessoa pode **editar** a mensagem ou **só enviar** como está. |
| 3 | **Nada acontece no nosso sistema** até a pessoa **enviar** de fato a mensagem no WhatsApp. Quando ela envia, o WhatsApp envia para o número conectado à Z-API; a Z-API chama nosso **webhook**. |

**Resumo:** Clicar no botão = só abre o WhatsApp com texto pronto. O fluxo no backend só começa quando a **primeira mensagem do cliente** chega no webhook.

---

## 3. Primeira mensagem no WhatsApp (cliente envia)

Quando a pessoa **envia** a primeira mensagem no WhatsApp (por exemplo depois de clicar no botão):

| Passo | O que acontece |
|-------|----------------|
| 1 | **Z-API** recebe a mensagem e chama nosso **POST `/api/webhooks/z-api`**. |
| 2 | **Conversa:** `getOrCreateConversation` — cria ou busca a conversa pelo telefone (normalizado BR). |
| 3 | **Cadastro na conversa:** `syncConversationFromCadastro(conversationId, phone)` — busca nome/telefone em `workshop_inscricoes` (e outras fontes) e grava na conversa (`name`, `context.display_name`, `context.display_phone`). |
| 4 | **Mensagem salva** no banco (`whatsapp_messages`). |
| 5 | **Carol (IA):** o webhook chama `processIncomingMessageWithCarol(...)`. A Carol lê o histórico, o contexto (nome do cadastro, tags, sessões do workshop) e **responde com IA** (OpenAI). A resposta é enviada pela Z-API e salva como mensagem da “Carol - Secretária”. |

**Resumo:** Primeira mensagem do cliente → webhook → conversa criada/atualizada → sync do cadastro → **Carol responde na hora** (IA).

---

## 4. O que é “fluxo automático” (script fixo) e quando a Carol entra

| Tipo | O que é | Quando acontece |
|------|--------|------------------|
| **Script fixo (sem IA)** | Uma mensagem **pré-definida**: boas-vindas + “Oi [nome], seja bem-vinda…” + duas opções de data/hora da próxima aula. Enviada pela **form automation** (`sendWorkshopInviteToFormLead`). | **60 segundos depois do cadastro**, e **só se** a pessoa **ainda não** tiver enviado nenhuma mensagem no WhatsApp. Se ela já tiver clicado no botão e enviado a mensagem, a form automation **não envia** (evita duplicar). |
| **Carol (IA)** | Resposta **gerada por IA** (OpenAI), usando contexto (nome, tags, sessões, histórico). | **Sempre que uma mensagem do cliente chega** no webhook (Z-API), desde que a automação esteja ligada e não haja regras que bloqueiem (ex.: duplicação, número de notificação). |

**Em uma frase:**  
- **Script fixo** = uma mensagem única, 60s depois do cadastro, só se ela não tiver falado antes no WhatsApp.  
- **Carol** = toda vez que o cliente **manda mensagem**, a Carol processa e responde com IA.

---

## 5. Dois cenários lado a lado

### Cenário A: Pessoa **clicou** no botão e **enviou** a mensagem no WhatsApp

```
Cadastro → Supabase + email
    ↓
“Quero agendar no WhatsApp agora” → abre WhatsApp com texto pronto
    ↓
Pessoa envia a mensagem no WhatsApp
    ↓
Webhook Z-API → cria/busca conversa → sync cadastro → salva mensagem
    ↓
Carol (IA) responde na hora
    ↓
(60s depois) Form automation verifica: “já tem mensagem do cliente?” → SIM → não envia (evita duplicar)
```

**Resultado:** A pessoa recebe **só a resposta da Carol** (IA), na hora.

---

### Cenário B: Pessoa **não clicou** no botão (ou não enviou nada no WhatsApp)

```
Cadastro → Supabase + email
    ↓
Pessoa não abre o WhatsApp (ou abre e não envia)
    ↓
(60 segundos depois) Form automation: “já tem mensagem do cliente?” → NÃO
    ↓
Form automation envia mensagem de boas-vindas (script fixo): “Oi [nome], seja bem-vinda…” + opções de data
    ↓
Conversa criada/atualizada com tags (veio_aula_pratica, primeiro_contato); mensagem salva como “Carol - Secretária” (mas é script fixo, não IA)
    ↓
Quando a pessoa responder essa mensagem no WhatsApp → webhook → Carol (IA) responde
```

**Resultado:** A pessoa recebe primeiro a **mensagem automática (script fixo)**; a partir da primeira **resposta dela**, quem responde é a **Carol (IA)**.

---

## 6. Resumo em uma tabela

| Momento | O que acontece | Quem “fala” |
|---------|----------------|-------------|
| Cadastro | Dados no Supabase + email | — |
| Botão WhatsApp | Abre wa.me com texto pronto | — |
| Cliente **envia** 1ª mensagem | Webhook → conversa → sync cadastro → Carol responde | **Carol (IA)** |
| 60s depois do cadastro, cliente **não** enviou nada | Form automation envia boas-vindas + opções | **Script fixo** (nome “Carol - Secretária” no banco) |
| Cliente responde a qualquer mensagem | Webhook → Carol processa e responde | **Carol (IA)** |

---

## 7. Arquivos principais (para rastrear no código)

- **Cadastro:** `src/app/api/nutri/workshop/inscricao/route.ts` — POST inscrição, chama `sendWorkshopInviteToFormLead`.
- **Botão / URL WhatsApp:** `src/app/pt/nutri/workshop-agenda-instavel/page.tsx` — `buildWhatsappUrl`, `whatsappUrl`.
- **Script fixo (60s):** `src/lib/whatsapp-form-automation.ts` — `sendWorkshopInviteToFormLead` (delay 60s, verifica se já tem mensagem do cliente).
- **Webhook (mensagem chega):** `src/app/api/webhooks/z-api/route.ts` — getOrCreateConversation, syncConversationFromCadastro, processIncomingMessageWithCarol.
- **Carol (IA):** `src/lib/whatsapp-carol-ai.ts` — `processIncomingMessageWithCarol`.

---

## 8. Comunicado antes da aula (pré-aula) — quem recebe “daqui a pouco às 9h temos aula”

O sistema **envia comunicados antes da aula** para quem está **cadastrado naquela sessão**:

| Quando | O que é enviado |
|--------|------------------|
| **24h antes** | Lembrete: “Sua aula é amanhã!”, dia/hora, link Zoom |
| **12h antes** | “Sua aula é hoje às [hora]!”, recomendação computador, link Zoom |
| **2h antes** | “Sua aula começa em 2 horas! ⏰” — aviso sala aberta 10 min antes, link Zoom |
| **30min antes** | “Começamos em 30 minutos! ⏰” — link Zoom |
| **10min antes** | “A sala está aberta! 🎉 Você pode entrar agora.” — link Zoom |

**Gatilho dos lembretes:** estar **cadastrado na sessão** — seja pelo **sistema** (escolheu Opção 1 ou 2) ou **manualmente** (Adicionar participante). O sistema usa a lista de participantes da sessão (conversas com `workshop_session_id` = ID da sessão) como fonte única.

**Quem recebe:** quem tem conversa com **`workshop_session_id`** = ID da sessão (ex.: aula de hoje 9h).

- Quem **escolheu Opção 1 ou 2** no fluxo já fica com `workshop_session_id` + `scheduled_date` na conversa → recebe os lembretes (via agendamento ou worker).
- Quem você **adiciona manualmente** (ex.: Marisa) **recebe** os lembretes: a conversa é associada à sessão (ou criada se não existir) ao usar **"Adicionar participante"**. Não é preciso que a pessoa já tenha conversado no WhatsApp.

**O que fazer para todo mundo cadastrado para “agora às 9h” receber o comunicado antes:**

**Como ficam as pessoas já cadastradas para “daqui a pouco às 9h” (lista de participantes da sessão):**

- Quem aparece na **lista de participantes** da sessão (ex.: quarta 28/01 às 09:00) já tem a conversa com **`workshop_session_id`** daquela sessão → **recebem** os comunicados 2h, 30min e 10min antes quando o worker (ou o agendamento) rodar nas janelas certas.
- Para a **aula das 9h**: rodar o **worker** (ou process-all) por volta de **7h** (2h antes), **8h30** (30min antes) e **8h50** (10min antes) para todos da lista receberem os três comunicados.
- Quem você **adicionar manualmente** depois: usar **“Adicionar participante”** (sessão + telefone) para associar à sessão; se não houver conversa, uma é criada e a pessoa passa a receber os lembretes.

**Arquivos:** `src/lib/carol-v2/worker.ts` (janelas 2h, 30min, 10min), `src/lib/carol-v2/scripts-workshop.ts` (textos), `src/lib/carol-v2/disparos.ts` — `enviarPreAula`, `src/app/api/admin/whatsapp/workshop/participants/adicionar/route.ts` — adiciona participante e agenda pré-aula.
