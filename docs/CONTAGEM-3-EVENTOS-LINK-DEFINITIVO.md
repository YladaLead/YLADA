# Contagem dos 3 eventos por link — Definitivo (Nutri, Wellness, futuro)

Objetivo: em **toda a plataforma** (Nutri, Wellness, Coach e futuras áreas), para **qualquer link** (calculadora, quiz, diagnóstico, formulário), medir de forma **única, eficiente e eficaz** estes três itens:

1. **Clique no link** — quando alguém acessa/abre o link  
2. **Clique no botão WhatsApp** — quando a pessoa clica no botão de chamar no WhatsApp no final do fluxo  
3. **Deixar nome e telefone (e WhatsApp)** — quando a pessoa não quer clicar no WhatsApp e prefere deixar nome, telefone e (se quiser) WhatsApp para ter acesso, entrar em grupo VIP, etc.

Todos os três precisam estar **isolados por link** (saber por qual ferramenta/quiz/link foi) e **por dono** (user_id + área), para a nutricionista (e outros) verem com clareza quantas conversas estão sendo geradas e quantas pessoas estão a procurando.

---

## 1. Como está hoje

### 1.1 Clique no link (visualização)

| Onde | Como é registrado | Onde fica armazenado |
|------|-------------------|----------------------|
| Nutri (ferramenta) | Página chama `POST /api/nutri/ferramentas/track-view` com `tool_id` | `user_templates.views` (incremento) |
| Wellness (ferramenta) | Página chama `POST /api/wellness/ferramentas/track-view` com `tool_id` | `user_templates.views` (incremento) |
| Coach (ferramenta) | Página chama `POST /api/coach/ferramentas/track-view` com `tool_id` | `user_templates.views` (incremento) |
| Matriz YLADA (`/l/[slug]`) | Componente chama `POST /api/ylada/links/events` com `slug` e `event_type: view` | `ylada_link_events` (linha por evento) |

**Problema:** Três jeitos diferentes (Nutri/Wellness/Coach em `user_templates.views`; matriz em outra tabela). Quizzes podem ter outro fluxo. Não existe um lugar único para “quantas vezes este link foi aberto” em qualquer área.

### 1.2 Clique no botão WhatsApp (final do fluxo)

| Onde | Como é registrado | Onde fica armazenado |
|------|-------------------|----------------------|
| Nutri (usa templates Wellness) | Botão usa `WellnessCTAButton` → `POST /api/wellness/conversions` com `template_id` ou `slug` | `user_templates.conversions_count` (incremento) |
| Wellness | Mesmo: `WellnessCTAButton` → `/api/wellness/conversions` | `user_templates.conversions_count` |
| Coach | Depende se usa o mesmo componente; se sim, mesmo endpoint | `user_templates.conversions_count` |
| Matriz YLADA | Componente chama `POST /api/ylada/links/events` com `event_type: cta_click` | `ylada_link_events` |

**Problema:** Matriz usa outra tabela (`ylada_link_events`). Nutri/Wellness/Coach usam `conversions_count` na ferramenta; não há uma tabela única de “eventos por link” que sirva para todas as áreas.

### 1.3 Deixar nome, telefone (e WhatsApp) — cadastro sem clicar no WhatsApp

| Onde | Como é registrado | Onde fica armazenado |
|------|-------------------|----------------------|
| Wellness / Nutri (captura pós-resultado) | Formulário envia para `POST /api/wellness/leads` com `user_slug`, `tool_slug`, nome, telefone | Tabela `leads` (com `additional_data.tool_slug`, `user_slug`). **Não atualiza** `user_templates.leads_count` |
| Outros fluxos (form por slug, etc.) | `POST /api/leads` com slug de `generated_links` | `leads` com `link_id`; atualiza `generated_links.leads_count` |
| Quizzes | Resposta salva em `quiz_respostas` + RPC `increment_quiz_leads` | `quizzes.leads_count`; **não** vai para tabela `leads` de forma padronizada |

**Problemas:**  
- Quem usa `wellness/leads` não atualiza `user_templates.leads_count` → contagem por ferramenta fica errada.  
- Cadastro “deixar nome/telefone para grupo VIP” precisa existir em todo fluxo que tiver essa opção e ser contado como “conversa iniciada” no mesmo lugar que os outros.  
- Não há um único critério: “uma conversa = um lead em `leads` com vínculo ao link”.

---

## 2. Como deve ser (modelo único)

Um único modelo para **toda a plataforma** e **qualquer tipo de link** (calculadora, quiz, formulário, etc.):

### 2.1 Os 3 eventos

- **Evento 1 — Acesso ao link (view)**  
  Uma linha por “alguém abriu este link”.  
  Uso: contagem “quantas pessoas clicaram no link”.

- **Evento 2 — Clique no WhatsApp (whatsapp_click)**  
  Uma linha por “alguém clicou no botão WhatsApp no final do fluxo”.  
  Uso: contagem “quantas pessoas foram chamar no WhatsApp”.

- **Evento 3 — Cadastro (lead_capture)**  
  Uma linha por “alguém deixou nome e telefone (e opcionalmente WhatsApp)” (para acesso, grupo VIP, etc.). Os **dados** (nome, telefone, WhatsApp) ficam na tabela `leads`; a **contagem** pode vir da mesma tabela (uma linha = uma conversa) desde que sempre com vínculo ao link.  
  Uso: contagem “quantas pessoas deixaram cadastro”.

### 2.2 Onde armazenar (único e escalável)

**Opção recomendada:**

1. **Tabela única de eventos por link**  
   Exemplo de nome: `link_events` (ou reutilizar/estender `ylada_link_events` para todas as áreas).

   Colunas principais:
   - `event_type`: `'view'` | `'whatsapp_click'` | `'lead_capture'`
   - `link_source`: `'user_template'` | `'quiz'` | `'form'` | `'ylada_link'` | etc. (tipo do recurso)
   - `link_id`: UUID do recurso (id do user_template, do quiz, do formulário, do ylada_link)
   - `user_id`: dono do link
   - `area`: `'nutri'` | `'wellness'` | `'coach'` | `'ylada'` | etc.
   - `created_at`

   Assim:
   - **Clique no link** → inserir evento `view` com link_source + link_id + user_id + area.
   - **Clique no WhatsApp** → inserir evento `whatsapp_click` com os mesmos dados.
   - **Deixar nome/telefone** → inserir em `leads` (nome, telefone, WhatsApp, etc.) **com** link_source + link_id + user_id + area; e opcionalmente inserir também um evento `lead_capture` nessa tabela de eventos (ou considerar “contagem de lead_capture” = contar linhas em `leads` com esse link_id). O importante é: **só um lugar** para contar (ou eventos, ou leads com vínculo ao link).

2. **Tabela `leads`**  
   Para evento “deixar nome/telefone/WhatsApp”:
   - Sempre preencher: `user_id`, `link_source`, `link_id`, `area`, nome, telefone (e WhatsApp se tiver).
   - Contagem “conversas por link” = contar em `leads` onde `user_id` = X e `link_id` = Y (e `area` = Z se quiser).

3. **Contadores nas tabelas de link (opcional)**  
   Manter `user_templates.views`, `user_templates.leads_count`, `user_templates.conversions_count` (e equivalentes em quizzes) como **espelho** atualizado pela mesma lógica que grava em `link_events` e `leads`, para não quebrar telas que já leem esses números. Ou, com o tempo, passar a ler só da tabela de eventos + `leads`.

### 2.3 Regra de negócio

- **Todo link** (calculadora, quiz, formulário, etc.) deve:
  1. Ao ser aberto: registrar **1 view** (na tabela única de eventos).
  2. Ao clicar no botão WhatsApp no final: registrar **1 whatsapp_click** (na tabela única de eventos).
  3. Se houver opção “deixar nome/telefone/WhatsApp” (acesso, grupo VIP, etc.): ao enviar o formulário, salvar em `leads` com vínculo ao link (link_source + link_id + user_id + area) e contar como **1 lead_capture** (pela tabela de eventos ou pela contagem em `leads` — definir uma regra só).

- **Toda a plataforma** usa a **mesma API** (ou o mesmo conjunto de APIs) para registrar esses três eventos, passando sempre: identificador do link (link_source + link_id), user_id e area.

---

## 3. O que precisa ser ajustado (lista objetiva)

Para ficar **definitivo** e igual para Nutri, Wellness e futuro:

### 3.1 Banco de dados

1. **Criar tabela única de eventos por link** (se não for reutilizar `ylada_link_events` para tudo):
   - Colunas: `event_type` (view | whatsapp_click | lead_capture), `link_source`, `link_id`, `user_id`, `area`, `created_at`, e o que mais for necessário (ex.: id do lead para lead_capture).
   - Índices: por (user_id, link_id, event_type, created_at) para contagens rápidas por link e por período.

2. **Ajustar tabela `leads`**:
   - Garantir colunas: `link_source`, `link_id`, `area` (além de user_id, nome, telefone, etc.).
   - Quando um cadastro “deixar nome/telefone/WhatsApp” for salvo, sempre preencher link_source, link_id e area.

3. **Decisão:** Para “lead_capture”, a contagem oficial pode ser:
   - **Só** contar linhas em `leads` com link_id preenchido, **ou**
   - Inserir também um evento `lead_capture` na tabela de eventos (e contar por lá).  
   O importante é **uma única regra** em toda a plataforma.

### 3.2 APIs (registro dos 3 eventos)

4. **Uma API única (ou uma por evento) para registrar eventos de link**  
   Exemplo: `POST /api/link-events` (ou `/api/ylada/links/events` generalizada) com body:
   - `event_type`: view | whatsapp_click | lead_capture
   - `link_source`: user_template | quiz | form | ylada_link
   - `link_id`: UUID
   - `area`: nutri | wellness | coach | ylada
   - (user_id vem do link_id: buscar dono pelo link.)

   Essa API:
   - Insere na tabela única de eventos (para view e whatsapp_click).
   - Para lead_capture: pode só redirecionar para “salvar lead + opcionalmente inserir evento”, desde que o lead seja sempre salvo com link_source, link_id, area.

5. **Substituir/redirecionar os endpoints atuais:**
   - `POST /api/nutri/ferramentas/track-view` → passar a chamar a API unificada (event_type view, link_source user_template, link_id = tool_id, area nutri).
   - `POST /api/wellness/ferramentas/track-view` → idem (area wellness).
   - `POST /api/coach/ferramentas/track-view` → idem (area coach).
   - Clique WhatsApp (WellnessCTAButton): além de ou em vez de `/api/wellness/conversions`, chamar a API unificada com event_type whatsapp_click.
   - Matriz YLADA: `/api/ylada/links/events` pode passar a gravar na mesma tabela (com link_source ylada_link, area ylada) ou a API unificada aceitar esse caso.

6. **API de cadastro “deixar nome/telefone/WhatsApp”:**
   - Garantir que `POST /api/wellness/leads` (e qualquer outro que receba esse cadastro) sempre:
     - Grave em `leads` com `link_source`, `link_id`, `area` (resolvendo link_id a partir de user_slug + tool_slug quando necessário).
     - Atualize o contador do link (ex.: `user_templates.leads_count`) **ou** registre evento lead_capture na tabela única, conforme a regra escolhida.

### 3.3 Frontend (garantir os 3 comportamentos)

7. **Clique no link:**  
   Em toda página pública de ferramenta/quiz/form que for “link”, ao carregar (ou ao exibir o conteúdo), chamar a API unificada com event_type `view` e os dados do link (link_source, link_id, area). Nutri, Wellness, Coach e matriz devem usar a mesma lógica.

8. **Clique no botão WhatsApp:**  
   Em todo botão “Chamar no WhatsApp” no final do fluxo, ao clicar, chamar a API unificada com event_type `whatsapp_click` (além de abrir o WhatsApp). Um único componente ou uma única função para não duplicar lógica.

9. **Opção “deixar nome, telefone e WhatsApp”:**  
   Onde fizer sentido (ex.: “não quero chamar agora; quero entrar no grupo VIP” ou “receber acesso”), ter um formulário com nome, telefone e (opcional) WhatsApp que:
   - Envie para um endpoint que salve em `leads` **com** link_source, link_id, user_id, area.
   - Esse endpoint deve ser o mesmo conceito em toda a plataforma (ex.: `POST /api/wellness/leads` com link_id resolvido, ou um `POST /api/leads/capture` que aceite link_source + link_id + area). Assim esse tipo de “conversa” entra na contagem junto com as outras.

### 3.4 Contagem e exibição

10. **Contagem por link e total:**
    - Por link: para cada link (ferramenta, quiz, form), buscar na tabela de eventos (e em `leads` se lead_capture for só em leads) os totais de view, whatsapp_click e lead_capture (por link_id + user_id).
    - Total do mês/semana: somar por user_id (e área) no período. Isso já alimenta o bloco “Conversas este mês” e o painel, desde que “conversa” seja definido (ex.: whatsapp_click + lead_capture, ou só lead_capture; o importante é ser consistente).

11. **Painel de links (Captar):**  
    Exibir por link os três números (acessos ao link, cliques no WhatsApp, cadastros nome/telefone) usando sempre a mesma fonte (tabela de eventos + leads).

---

## 4. Resumo em uma frase

**Hoje:** views, cliques no WhatsApp e cadastros estão em lugares e formatos diferentes (user_templates, ylada_link_events, leads sem vínculo certo, quizzes em outra tabela).  
**Objetivo:** ter **uma tabela de eventos por link** (view + whatsapp_click + lead_capture) e **leads sempre com link_source + link_id + area**, com **uma API única** para registrar os 3 eventos em toda a plataforma, e **sempre oferecer a opção de deixar nome/telefone/WhatsApp** onde fizer sentido, contando isso como “conversa” no mesmo lugar.

Assim a contagem fica **eficiente, eficaz e definitiva** para Nutri, Wellness e qualquer tipo de link no futuro.
