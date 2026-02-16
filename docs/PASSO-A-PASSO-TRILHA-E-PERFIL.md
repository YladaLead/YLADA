# Passo a passo: Trilha Empresarial + Perfil (doc oficial)

Documento único para guiar a construção da Trilha Empresarial e do Perfil por área. Trabalhar **uma etapa por vez**; marcar o que foi feito para não perder contexto.

---

## Como vamos construir (ritual para não perder contexto)

1. **Uma etapa por vez:** só avançar para a próxima quando a atual estiver concluída (ou acordada como “feito por agora”).
2. **Provocação:** ao terminar uma etapa, quem está construindo (ou a IA) **pausa e pede:** *“Etapa X concluída. Me dê OK para seguir para a próxima.”*
3. **OK do responsável:** só após você (ou o dono da decisão) dar **OK**, seguimos para a próxima etapa.
4. **Marcar no doc:** ao concluir, marcar os checkboxes da etapa (trocar `- [ ]` por `- [x]`) para manter histórico do que já foi feito.

Assim o contexto permanece e nada é pulado sem validação.

---

## Onde acompanhar no localhost

Com o app rodando (`npm run dev`), use como base **http://localhost:3000** (ou a porta que estiver configurada).

| O quê | URL (hoje) | Observação |
|-------|------------|------------|
| **Med – landing** | `/pt/med` | Entrada área Medicina |
| **Med – login** | `/pt/med/login` | Login para acessar o board |
| **Med – Noel (home)** | `/pt/med/home` | Board: Noel + menu (precisa estar logado) |
| **Med – Trilha empresarial** | `/pt/med/trilha` | Lista da trilha; etapas hoje redirecionam para Nutri (jornada legada) |
| **Med – Perfil empresarial** | `/pt/med/perfil-empresarial` | Placeholder “em construção” |
| **Med – Fluxos / Leads / Config** | `/pt/med/fluxos`, `/pt/med/leads`, `/pt/med/configuracao` | |
| **Nutri – Jornada (legado)** | `/pt/nutri/metodo/jornada` | Lista de dias; conteúdo atual por “dias” |
| **Nutri – Dia da jornada** | `/pt/nutri/metodo/jornada/dia/1` … `/dia/30` | Etapas atuais (será substituído pela nova trilha) |

**Hoje:** Med já usa `/pt/med/trilha` (menu “Trilha empresarial”); distinção por área é `/pt/med/` vs `/pt/nutri/`. **Depois da construção (padrão novo):** conteúdo próprio em `/pt/[area]/trilha` (necessidades/playbooks/steps), sem redirecionar para Nutri.

---

## Visão e decisões de produto

| Decisão | O quê |
|--------|--------|
| **Trilha** | Por **necessidades + playbooks** (não por "dias"). Mesmo material para todas as áreas; conteúdo único no banco. |
| **Áreas** | Independentes: rotas próprias (`/pt/[area]/trilha`), UI sempre identificada pela área. Um progresso por usuário (mesma trilha, acessada por qualquer área). |
| **Noel** | IA mentor **dentro da plataforma**. Modelo 4.1 mini (economia de token). System prompt enxuto: identidade + perfil + resumo estratégico (snapshot). |
| **Carol** | IA de atendimento **via WhatsApp** (fora da plataforma). Suporte a quem chega; não é recurso da trilha/perfil. |
| **Ordem** | Fase 1 Trilha → Fase 2 Perfil. Mini-MVP Noel já na Fase 1 para validar modelo de dados. |

---

## Nomenclatura técnica (trilha)

- **Fundamentos** (sempre visível): Identidade, Postura, Ambiente, Rotina mínima, Metas/Painel.
- **Necessidades** (menu principal): agenda vazia, indicação, link, follow-up, etc.
- **Need** (necessidade) → **Playbook** (sequência de passos) → **Step** (etapa) → **Reflection** (respostas).
- Exemplo para o Noel: "Você está no Playbook de Indicação, Step 2."

---

## FASE 1 — TRILHA EMPRESARIAL

### 1.1 Estrutura (doc)

- [x] Definir **Fundamentos** (sempre visível): Identidade, Postura & Comunicação, Ambiente & Organização, Rotina Mínima, Metas/Painel.
- [x] Definir **Necessidades** (menu principal): agenda vazia, posto e ninguém chama, conversas não viram agendamento, não consigo indicação, não uso links direito, follow-up fraco, quero escalar (ajustar conforme produto).
- [x] Para cada necessidade: definir **Playbook** (sequência de Steps).
- [x] Para cada Step: objetivo, orientação, checklist, **perguntas de reflexão** (ex.: O que você percebeu? O que está travando? Qual seu próximo passo? + "5 linhas situação atual").
- [x] Documentar em `docs/TRILHA-EMPRESARIAL-ESTRUTURA-NECESSIDADES-PLAYBOOKS.md` (ou equivalente).

**Decisão:** Duas camadas (Fundamentos + Necessidades) para não virar só "trilha tática".

→ **Pausar:** pedir OK antes de seguir para a etapa 1.2.

---

### 1.2 Modelo de dados (migrations)

- [x] Tabelas para **conteúdo** (necessidades, playbooks, steps) — ou adaptar `journey_days` para esse modelo (Need/Playbook/Step).
- [x] Tabela(s) para **progresso + reflexões** por `user_id`:
  - step (ou etapa) atual;
  - **status:** `not_started | in_progress | stuck | done`;
  - **confidence:** 1–5 (autoavaliação rápida);
  - respostas de reflexão (JSON ou normalizado).
- [x] Tabela (ou campo) **Resumo Estratégico Atual:** `user_strategy_snapshot` (texto + JSON). Estrutura sugerida:
  - Quem é
  - Dor atual
  - Etapa atual
  - O que travou
  - Próximo passo
- [ ] Toda vez que salvar reflexão: backend gera (ou Noel gera) e persiste o snapshot. É isso que será injetado no Noel. *(implementar na API 1.4)*
- [ ] Rodar migrations no ambiente. *(executar no Supabase: `migrations/202-trilha-empresarial-needs-steps-progress-snapshot.sql`)*

**Decisão:** status + confidence no progresso para o Noel detectar travas e intervir. Snapshot como artefato obrigatório do sistema.

→ **Pausar:** pedir OK antes de seguir para a etapa 1.4.

---

### 1.4 API mínima (ler / salvar)

- [x] **Ler:** listar necessidades; listar playbooks/steps de uma necessidade; detalhe de um step.
- [x] **Salvar:** progresso (step atual, status, confidence); reflexões por step; disparar geração/persistência do `user_strategy_snapshot`.
- [x] Autenticação: usuário logado; opcional enviar `area`/`segment` no request.
- [x] API não depende de "dia"; depende de necessidade/playbook/step.

**Decisão:** API mínima antes de popular conteúdo para não popular errado e refazer migration.

**Rotas criadas:** `GET /api/trilha/needs` (?steps=1), `GET /api/trilha/steps/[stepId]`, `GET/PUT /api/trilha/me/progress`, `GET/PUT /api/trilha/me/reflections`, `GET /api/trilha/me/snapshot`. Ao salvar reflexão (PUT reflections), o backend atualiza `user_strategy_snapshot`.

→ **Pausar:** pedir OK antes de seguir para a etapa 1.3.

---

### 1.3 Popular conteúdo

- [x] Popular necessidades, playbooks, steps (textos, checklists, perguntas de reflexão) a partir do doc 1.1.
- [x] Linguagem **neutra** (profissional, sua prática) para todas as áreas.
- [ ] Revisar/validar textos. *(opcional: ajustar redação depois)*

**Migration:** `migrations/203-trilha-empresarial-populate-needs-steps.sql` — insere F1–F5, N1–N7 e todos os steps com objetivo, orientação e checklist. Executar após a 202.

→ **Pausar:** pedir OK antes de seguir para a etapa 1.6.

---

### 1.6 UI básica (componentes agnósticos)

- [x] Tela de **lista:** Fundamentos + Necessidades; destacar etapa atual e próximo passo. Sem "Dia 1…30".
- [x] Tela de **step:** objetivo, orientação, checklist, bloco de **reflexão** (3 perguntas + "5 linhas situação atual"), botão salvar. Campos opcionais: status, confidence.
- [x] Componentes **agnósticos de área**; o shell (layout, menu, "Voltar") é por área.
- [ ] Testar fluxo: listar → abrir step → preencher reflexão → salvar → ver progresso. *(validar em /pt/med/trilha após rodar migrations 202 e 203)*

**Componentes:** `components/trilha/TrilhaNeedsList.tsx`, `components/trilha/TrilhaStepView.tsx`. Páginas Med: `/pt/med/trilha` (lista), `/pt/med/trilha/step/[stepId]` (etapa + reflexão). Recebem `basePath` para serem reutilizados em outras áreas.

→ **Pausar:** pedir OK antes de seguir para a etapa 1.7.

---

### 1.7 Mini-MVP Noel (validar modelo)

- [x] **Um endpoint** (ex.: GET ou POST que recebe `user_id`): busca perfil (se existir), etapa atual, respostas/reflexões e snapshot.
- [x] Monta **resumo** (ou usa o snapshot já gerado).
- [x] Retorna **"plano da semana"** (texto gerado pelo 4.1 mini com base nesse contexto).
- [x] Objetivo: validar se trilha + dados estão bem modelados antes de seguir. Não é o Noel completo; é prova de conceito.

**Decisão:** Mini Noel cedo para validar formato de dados e consumo pelo modelo.

**Implementado:** `GET /api/trilha/me/plano-semana` — busca snapshot + progresso (etapa in_progress/stuck), monta contexto e gera plano com gpt-4o-mini. Componente `TrilhaPlanoSemana` na página Med trilha exibe o plano e botão "Atualizar plano".

→ **Pausar:** pedir OK antes de seguir para a etapa 1.5.

---

### 1.5 Rotas por área (parametrizadas)

- [x] **Conteúdo parametrizado por área:** mesmo componente de trilha; só muda `area` (e `basePath`) por área. Shell (layout, header, "Voltar à home [Área]") usa `area`.
- [x] **Med** usa `/pt/med/trilha` e `/pt/med/trilha/step/[stepId]` via componentes compartilhados.
- [x] **Evitar duplicar lógica:** `TrilhaAreaView` (lista + plano semana) e `TrilhaStepAreaView` (etapa + reflexão) recebem `areaCodigo` e `areaLabel`; cada área tem apenas duas páginas finas que passam esses props.
- [ ] Para **novas áreas** (Psi, Odonto, Nutra, Coach): criar `(protected)/trilha/page.tsx` e `(protected)/trilha/step/[stepId]/page.tsx` que renderizam `<TrilhaAreaView areaCodigo="psi" areaLabel="Psicologia" />` e `<TrilhaStepAreaView areaCodigo="psi" areaLabel="Psicologia" />` (e menu já aponta para `path: 'trilha'` em `ylada-areas`).

**Decisão:** Não usar segmento dinâmico `pt/[area]` porque no Next.js rotas estáticas (`pt/med`) têm precedência; a abordagem adotada é **componentes compartilhados + página fina por área**, mantendo uma única fonte de verdade e rotas claras por área.

→ **Pausar:** pedir OK antes de seguir para a Fase 2 (Perfil).

---

## FASE 2 — PERFIL POR ÁREA

### 2.1 Modelo de perfil (comum + por área)

- [x] **Planejamento documentado** em `docs/PERFIL-EMPRESARIAL-YLADA-MODELO.md`: campos comuns (metas, objetivos, tempo_atuacao, tipo_atendimento, observacoes), campos por área em `area_specific` (JSONB) por segmento (med, psi, psicanalise, odonto, nutra, coach), resumo para o Noel, RLS e trigger.
- [ ] Campos **comuns:** metas, objetivos, tempo de atuação, tipo de atendimento (ex.: particular, convênio, ambos).
- [ ] Campos **por área:** ex. Med = especialidade; Psi = abordagem + faixa etária; Odonto = especialidades; Nutra = tipo atuação + nível; Coach = nichos. *(especificação completa no doc do modelo)*
- [ ] Tabela `ylada_noel_profile`: `user_id`, `segment`, colunas comuns, `area_specific` (JSONB). Migration.

→ **Pausar:** pedir OK antes de seguir para a etapa 2.2.

---

### 2.2 Onboarding e tela de perfil

- [ ] Onboarding na primeira entrada no board da área (modal ou página "Complete seu perfil"). *(opcional; pode ser feito depois)*
- [x] **Página Perfil empresarial** em cada área: `/pt/[area]/perfil-empresarial`. Med implementado: usa `PerfilEmpresarialView` (componente parametrizado por área).
- [x] **Formulário:** blocos comuns (contexto, diagnóstico, metas, modelo de atuação, canais/rotina, observações) + bloco por área (Med = especialidades). Salva via `PUT /api/ylada/profile`.

→ **Pausar:** pedir OK antes de seguir para a etapa 2.4 (integração Noel).

---

### 2.3 API de perfil

- [x] **GET** `/api/ylada/profile?segment=med` — perfil do usuário logado para o segmento; retorna `{ profile, resumo }` (resumo = texto pronto para o Noel).
- [x] **PUT** `/api/ylada/profile` — body com `segment` + campos do perfil; upsert por `(user_id, segment)`; retorna perfil salvo + resumo.
- [x] Helper `buildProfileResumo(profile)` em `src/lib/ylada-profile-resumo.ts` para montar o texto injetável no prompt (reutilizado na 2.4).

→ **Pausar:** pedir OK antes de seguir para a etapa 2.4.

---

### 2.4 Integração Noel (perfil + trilha)

- [x] Na chamada do Noel (`POST /api/ylada/noel`): buscar **perfil** (`ylada_noel_profile` por user_id + segment) e **snapshot** (`user_strategy_snapshot`) em paralelo.
- [x] System prompt: bloco identidade/área (SEGMENT_CONTEXT) + bloco **[PERFIL DO PROFISSIONAL]** (resumo via `buildProfileResumo`) + bloco **[RESUMO ESTRATÉGICO DA TRILHA]** (snapshot_text). Se perfil vazio, mensagem sugerindo completar o perfil.
- [ ] Testar conversa do Noel com perfil e trilha preenchidos (validar personalização).

→ **Pausar:** etapa final da Fase 2. Conferir checklist e marcar concluído no doc.

---

## Ordem de execução (resumo)

| # | Etapa |
|---|--------|
| 1 | 1.1 Estrutura (doc Fundamentos + Necessidades + Playbooks) |
| 2 | 1.2 Modelo de dados (migrations, status, confidence, snapshot) |
| 3 | 1.4 API mínima (ler/salvar trilha + snapshot) |
| 4 | 1.3 Popular conteúdo |
| 5 | 1.6 UI básica (lista + step + reflexão) |
| 6 | 1.7 Mini-MVP Noel (plano da semana) |
| 7 | 1.5 Rotas por área (`/pt/[area]/trilha`) |
| 8 | 2.1 Modelo de perfil (comum + por área) |
| 9 | 2.2 Onboarding + tela Perfil empresarial |
| 10 | 2.3 API de perfil |
| 11 | 2.4 Noel completo (perfil + snapshot no system prompt) |

---

## Referências no repo

- Visão trilha todas as áreas: `docs/TRILHA-EMPRESARIAL-TODAS-AREAS.md`
- **Modelo de perfil (comum + por área):** `docs/PERFIL-EMPRESARIAL-YLADA-MODELO.md`
- **UI Perfil empresarial:** `src/components/perfil/PerfilEmpresarialView.tsx`, `src/types/ylada-profile.ts`
- Noel + perfil (YLADA): `docs/NOEL-YLADA-PERFIL-E-INTEGRACAO.md`
- Áreas/config: `src/config/ylada-areas.ts`
- Jornada atual (legado): `migrations/populate-jornada-30-dias.sql`, `migrations/create-jornada-tables.sql`
