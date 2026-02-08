# Plano de construção YLADA — passo a passo (sem perder contexto)

**Objetivo:** Construir a base YLADA com os mesmos princípios para todas as áreas (**med**, **psi**, **psicanalise**, **odonto**, **nutra**, **coach**), passo a passo, com pontos em que precisamos da sua decisão ou informação até tudo estar funcionando. **Preservar apenas Nutri e Wellness**; as demais áreas (incluindo Coach) seguem ou são reconstruídas nesse padrão. Futuramente, transferir a Nutri para esse mesmo modelo.

---

## Escopo fixo

| Item | Decisão |
|------|--------|
| **Áreas (códigos)** | **med** (medicina; pode desmembrar por especialidade, ex. psiquiatria), **psi** (psicologia), **psicanalise** (psicanálise), **odonto**, **nutra** (vendedores), **coach**. Todas no mesmo padrão. |
| **Área médica (med)** | Psiquiatria fica **dentro da medicina**; a área med pode ser desmembrada/identificada por especialidade (médico geral, psiquiatra, etc.) na escolha do usuário ou no perfil. |
| **Página matriz (/pt)** | Página **institucional** da YLADA falando de **todas as áreas**, com direcionamento (links) para cada área: med, psi, psicanalise, odonto, nutra, coach. |
| **Nutra hoje** | Já existe em `pt/nutra`; será **moldada** para o mesmo padrão das outras (mesma estrutura, formação, fluxos, métricas, Noel). |
| **Coach hoje** | Já existe em `pt/coach`; **desconsiderar** o que foi feito. **Apagar todo o conteúdo** de `pt/coach` e **reconstruir do zero** com o mesmo padrão YLADA (landing, login, protected: home, dashboard, formacao, fluxos, leads, configuracao). A **rota permanece** `/pt/coach`. A barra/área "C" (`/pt/c`) é outra; não alteramos aqui. |
| **Preservar (não mexer)** | **Apenas Nutri e Wellness.** Todas as outras áreas entram no padrão YLADA ou são reconstruídas. |
| **Modelo** | Página matriz (ylada.com/pt) + uma rota por área: `/pt/med`, `/pt/psi`, `/pt/psicanalise`, `/pt/odonto`, `/pt/nutra`, `/pt/coach`. |
| **Auth** | **Mesmo login** Supabase para YLADA; criar ambientes por área (product/ambiente = ylada, area = med | psi | psicanalise | odonto | nutra | coach). |
| **Noel** | Uma base só; contexto por área (med, psi, psicanalise, odonto, nutra, coach). |
| **Fluxos** | Plataforma fornece + usuário personaliza. Métricas: visualizações do link, preenchimentos (leads), cliques no WhatsApp. |
| **Formação empresarial** | Em todas as áreas: conteúdo de empreendedorismo (organização, comunicação, links que agregam valor). |

---

## Fases do plano (ordem de execução)

Cada fase termina com **“O que precisamos de você”** (decisão, copy, ou ok para seguir). Assim não perdemos contexto e você acompanha até tudo funcionando.

---

### Fase 0 — Decisões e combinados (antes de codar)

**Combinado:**
- Lista de áreas: **med** (medicina; especialidades ex. psiquiatria), **psi** (psicologia), **psicanalise** (psicanálise), **odonto**, **nutra**, **coach** (códigos e labels).
- Página **/pt** = página **institucional** YLADA falando de todas as áreas, com direcionamento para cada uma.
- **Mesmo login** Supabase para YLADA; ambientes por área (product/ambiente = ylada, area = med | psi | psicanalise | odonto | nutra | coach).
- **Preservar apenas Nutri e Wellness.** Coach: rota /pt/coach mantida; conteúdo atual de pt/coach será **removido** e reconstruído do zero no padrão YLADA. Barra /pt/c permanece como está (não é a área Coach).

**O que fazemos:**
- Registrar decisões acima no plano.
- (Opcional) Listar arquivos/pastas que serão removidos em pt/coach na Fase 1.

**O que precisamos de você:**
- [ ] Confirmar labels: "Medicina", "Psicologia", "Psicanálise", "Odontologia", "Nutra (vendedores)", "Coach"?
- [ ] Confirmar que podemos **apagar todo o conteúdo** de `src/app/pt/coach/` (e, se desejar, `pt/coach-backup/`) para reconstruir do zero?

---

### Fase 1 — Config e rotas base

**Limpeza Coach (antes de criar rotas):**
- **Apagar todo o conteúdo** de `src/app/pt/coach/` (exceto a pasta em si) e reconstruir do zero. Opcional: apagar ou arquivar `src/app/pt/coach-backup/` se não for mais necessário.
- Lista do que será removido: todas as subpastas e arquivos em `pt/coach/` (layout, page, login, (protected)/ com home, dashboard, formularios, clientes, leads, etc.). A rota **/pt/coach** permanece; o conteúdo é substituído pela nova estrutura YLADA (landing, login, (protected)/home, dashboard, formacao, fluxos, leads, configuracao).

**O que fazemos:**
- Criar `src/config/ylada-areas.ts`: áreas **med**, **psi**, **psicanalise**, **odonto**, **nutra**, **coach** com `codigo`, `slug` (para URL), `label`, `ativo`.
- Criar estrutura de rotas para cada área:
  - Pastas fixas `pt/med`, `pt/psi`, `pt/psicanalise`, `pt/odonto`; **nutra** já existe em `pt/nutra` — adaptar; **coach**: após limpeza, criar mesma estrutura (landing, login, (protected)/home, dashboard, formacao, fluxos, leads, configuracao).
- Layout base por área reutilizável; páginas mínimas: landing, login, cadastro.
- **Não alterar** pt/nutri nem pt/wellness. Página **/pt** = institucional com links para as 6 áreas.

**Entregável:** Ao acessar `/pt/med`, `/pt/psi`, `/pt/psicanalise`, `/pt/odonto`, `/pt/nutra`, `/pt/coach` as landings existem e seguem o mesmo padrão. Config central define as 6 áreas. Coach reconstruído do zero.

**O que precisamos de você:**
- [ ] Preferência: apagar também **coach-backup** ou manter como backup?
- [ ] Após esta fase, você testa as 6 URLs e confirma se podemos seguir para Fase 2.

---

### Fase 2 — Auth, perfil e área (usuário YLADA)

**O que fazemos:**
- Garantir que o perfil (ex.: `user_profiles` ou tabela equivalente) tenha:
  - identificação do produto/ambiente: ex. `product = 'ylada'` ou `ambiente = 'ylada'`;
  - área do usuário: `area = 'med' | 'psi' | 'psicanalise' | 'odonto' | 'nutra' | 'coach'`.
- Fluxo de cadastro/login para YLADA: após auth, se usuário não tiver área, exibir **escolha de área** (med, psi, psicanalise, odonto, nutra, coach) e salvar.
- Proteção das rotas `(protected)` por área: usuário só acessa o conteúdo da **sua** área (med só vê /pt/med/(protected), etc.).
- Adaptar **nutra** existente: passar a usar esse perfil (product = ylada, area = nutra) e o mesmo layout protegido que as outras áreas.

**Entregável:** Login/cadastro por área; usuário tem área salva; área protegida acessível apenas para quem tem aquela área. Nutra integrada ao mesmo fluxo.

**O que precisamos de você:**
- [ ] Confirmar se o cadastro é **por área** (usuário escolhe “Sou médico” e cai em /pt/med) ou se um único cadastro depois escolhe área no primeiro acesso.
- [ ] Após esta fase, você testa: cadastro em uma área, login, e acesso à área protegida; confirma para seguir.

---

### Fase 3 — Estrutura protegida (home, dashboard, menu)

**O que fazemos:**
- Para cada área (med, psi, psicanalise, odonto, nutra, coach), criar dentro de `(protected)`:
  - **home** (página inicial logada)
  - **dashboard** (placeholder para métricas: links, leads, cliques WhatsApp)
  - **formacao** (placeholder para formação empresarial)
  - **fluxos** (placeholder para lista de fluxos/links)
  - **leads** (placeholder para quem preencheu)
  - **configuracao** (placeholder)
- Menu lateral ou topo **único** (componente reutilizável) que recebe a área e exibe labels da config (Formação, Fluxos, Leads, etc.).
- Conteúdo das páginas pode ser mínimo (título + texto “Em breve” ou um parágrafo); o importante é a estrutura e navegação iguais nas 5 áreas.

**Entregável:** Todas as áreas têm o mesmo menu e as mesmas subpáginas; navegação funciona.

**O que precisamos de você:**
- [ ] Se quiser nomes diferentes no menu por área (ex. “Meus fluxos” vs “Meus links”), dizer agora ou deixamos iguais.
- [ ] Após esta fase, você navega em cada área e confirma se a estrutura está ok para seguir.

---

### Fase 4 — Banco de dados (links, leads, eventos)

**O que fazemos:**
- Definir/migrations:
  - **Links YLADA:** tabela (ex. `ylada_links` ou uso de `generated_links` com filtro por produto) com `user_id`, `area`, `slug`, `title`, `content` (fluxo/quiz), `diagnostico_aprovado`, `whatsapp_number`, `status`, etc.
  - **Leads:** tabela (ex. `ylada_leads`) com `link_id`, `nome`, `email` ou `telefone`, `area`, `created_at`.
  - **Eventos de métrica:** tabela (ex. `ylada_link_events`) com `link_id`, `event_type` ('view' | 'lead' | 'whatsapp_click'), `created_at`, e opcionalmente payload (user_agent, referrer).
- Ou estender tabelas existentes com `product = 'ylada'` e `area` onde fizer sentido, sem duplicar lógica de Nutri/Wellness.
- RLS/políticas: usuário só acessa seus próprios links e leads da sua área.

**Entregável:** Schema e migrations aplicáveis; documentação do que cada tabela guarda.

**O que precisamos de você:**
- [ ] Confirmar se prefere **tabelas novas** para YLADA (`ylada_links`, `ylada_leads`, `ylada_link_events`) ou **reaproveitar** `generated_links` + uma tabela de leads existente, apenas filtrando por `product/area`. (Recomendado: tabelas novas para não acoplar ao legado.)
- [ ] Após esta fase, rodamos as migrations no seu ambiente e você confirma para seguir.

---

### Fase 5 — APIs (links, leads, eventos)

**O que fazemos:**
- **APIs para o usuário logado:**
  - Listar meus links (por área do usuário).
  - Criar/editar link (título, fluxo, diagnóstico, WhatsApp); gerar slug único.
  - Listar leads de um link (ou de todos os meus links).
- **APIs para métricas:**
  - Registrar **view** (quando alguém abre o link público).
  - Registrar **lead** (quando alguém preenche o formulário do fluxo).
  - Registrar **whatsapp_click** (quando alguém clica no botão WhatsApp).
- **API pública:** GET link por slug (para a página pública do link) — retorna título, content (fluxo), diagnóstico, CTA WhatsApp; ao ser chamada, registrar view.

**Entregável:** Endpoints documentados e testáveis (Postman/curl); front ainda pode usar placeholders que chamem as APIs.

**O que precisamos de você:**
- [ ] Após esta fase, podemos fazer um teste manual (criar link, abrir link, preencher, clicar WhatsApp) e você confirma se os eventos estão sendo gravados.

---

### Fase 6 — Página pública do link e captura de leads

**O que fazemos:**
- Rota pública (ex. `/link/[slug]` ou `/l/[slug]`) que:
  - Busca o link pelo slug (ylada_links ou equivalente).
  - Exibe o fluxo (quiz/calculadora/formulário) e, ao final, o diagnóstico e o botão WhatsApp.
  - Ao carregar a página: chama API para registrar **view**.
  - Ao enviar formulário (fim do fluxo): envia dados para API que grava **lead** e opcionalmente envia resposta (ex. “Obrigado! Entraremos em contato”).
  - No botão WhatsApp: link para wa.me/numero?text=... e chamada à API para registrar **whatsapp_click**.
- Fluxo pode ser estático (um formulário simples ou quiz fixo) no primeiro momento; depois evoluímos para fluxos configuráveis por área.

**Entregável:** Link público funcionando: abre → registra view → preenche → registra lead → clica WhatsApp → registra evento e redireciona.

**O que precisamos de você:**
- [ ] Enviar um exemplo de **texto de diagnóstico** e **mensagem padrão** do WhatsApp para usarmos como placeholder (ou ok para usar texto genérico).
- [ ] Após esta fase, você testa um link de ponta a ponta e confirma para seguir.

---

### Fase 7 — Dashboard (métricas por link e resumo)

**O que fazemos:**
- Na página **dashboard** de cada área, exibir:
  - Lista dos **meus links** com, por link: número de **visualizações**, **leads** (preenchimentos), **cliques no WhatsApp**.
  - Opcional: resumo total da área (soma de views, leads, whatsapp).
- Dados vindos das APIs já criadas (listar links + contagens por link ou por eventos).

**Entregável:** Usuário logado vê no dashboard as métricas de cada link e um resumo.

**O que precisamos de você:**
- [ ] Confirmar se quer também gráfico (ex. últimos 7 dias) ou só números totais por link por enquanto.
- [ ] Após esta fase, você valida os números (abre link, preenche, clica WhatsApp e confere no dashboard).

---

### Fase 8 — Noel (IA única, contexto por área)

**O que fazemos:**
- Um endpoint (ex. `POST /api/ylada/noel` ou `/api/noel`) que recebe a mensagem do usuário e, a partir do token/sessão, identifica `user_id` e **área** (med, psi, psicanalise, odonto, nutra, coach).
- System prompt **base** (filosofia YLADA: empreendedorismo, organização, comunicação, agregar valor, uso dos links) + **bloco de contexto por área** (“Você está falando com um médico” / “com um psicólogo” / “com um dentista” / “com um vendedor Nutra” / “com um coach” / “com um psicanalista”).
- Resposta da IA exibida no front (chat ou página “Fale com a Noel” dentro da área protegida).

**Entregável:** Noel respondendo no contexto da área do usuário, sem duplicar código por área.

**O que precisamos de você:**
- [ ] Se já existir um **system prompt** ou regras da Noel (Wellness ou outro), enviar para alinharmos; senão, usamos um prompt base e refinamos depois.
- [ ] Após esta fase, você testa a Noel em pelo menos duas áreas e confirma se o contexto está adequado.

---

### Fase 9 — Formação empresarial (conteúdo por área)

**O que fazemos:**
- Preencher a seção **formacao** de cada área com conteúdo (textos, blocos, links para materiais) de empreendedorismo aplicado.
- Conteúdo carregado por **área** (config ou banco: med, psi, psicanalise, odonto, nutra, coach) para permitir textos específicos por segmento.
- Estrutura igual nas 4 áreas (mesmos módulos ou blocos), com copy por área.

**Entregável:** Formação empresarial acessível e visível em med, psi, psicanalise, odonto, nutra e coach, com conteúdo mínimo ou completo conforme o que for definido.

**O que precisamos de você:**
- [ ] Definir se o conteúdo da formação vem de **config em código** (arquivos por área) ou de **banco** (tabela de conteúdos por área). Para MVP, config em código é mais rápido.
- [ ] Enviar ou aprovar **textos base** da formação (1–2 blocos por área) ou ok para placeholders; depois iteramos.

---

### Fase 10 — Ajustes finais; Nutra e Coach no padrão

**O que fazemos:**
- Revisar **nutra** e **coach**: garantir que tenham exatamente a mesma estrutura (home, dashboard, formacao, fluxos, leads, configuracao), mesmo menu, mesma lógica de perfil (area = nutra | coach) e mesmas métricas.
- Ajustes de copy, links da página institucional (/pt) para as 6 áreas, e qualquer redirecionamento (ex. antiga landing nutra ou coach → nova estrutura).
- Testes de ponta a ponta: matriz → escolha de área → cadastro/login → área protegida → criar link → abrir link → preencher → clicar WhatsApp → ver métricas no dashboard → falar com Noel → ver formação.

**Entregável:** Base YLADA funcionando para **med**, **psi**, **psicanalise**, **odonto**, **nutra** e **coach** com os mesmos princípios; nada quebrado em Nutri/Wellness.

**O que precisamos de você:**
- [ ] Lista de **ajustes de copy ou UX** que queira antes de considerar “pronto”.
- [ ] Confirmação de que está tudo ok para considerar a base pronta e, no futuro, planejar a migração da Nutri para esse modelo.

---

## Resumo das áreas (códigos e URLs)

| Código  | URL      | Label / público        |
|---------|----------|------------------------|
| **med** | `/pt/med`   | Medicina (pode desmembrar por especialidade; ex. psiquiatria) |
| **psi** | `/pt/psi`   | Psicologia             |
| **psicanalise** | `/pt/psicanalise` | Psicanálise        |
| **odonto** | `/pt/odonto` | Odontologia          |
| **nutra** | `/pt/nutra`  | Nutra (Dutrac, Iko, suplementos) |
| **coach** | `/pt/coach`  | Coach (coach em geral)  |

---

## Controle de progresso (checklist geral)

- [ ] Fase 0 — Decisões e combinados
- [ ] Fase 1 — Config e rotas base
- [ ] Fase 2 — Auth, perfil e área (incl. nutra no padrão)
- [ ] Fase 3 — Estrutura protegida (home, dashboard, menu)
- [ ] Fase 4 — Banco (links, leads, eventos)
- [ ] Fase 5 — APIs (links, leads, eventos)
- [ ] Fase 6 — Página pública do link e captura
- [ ] Fase 7 — Dashboard com métricas
- [ ] Fase 8 — Noel (IA, contexto por área)
- [ ] Fase 9 — Formação empresarial
- [ ] Fase 10 — Ajustes; Nutra e Coach no padrão

---

Sempre que avançarmos uma fase, atualizamos este doc e marcamos o que precisamos de você. Quando você responder ou testar, seguimos para a próxima fase até tudo estar funcionando.
