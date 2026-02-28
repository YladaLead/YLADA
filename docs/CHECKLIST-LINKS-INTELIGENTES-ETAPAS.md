# Links Inteligentes — Checklist passo a passo (ordem de construção)

Use este doc para acompanhar: conclua uma etapa, avise **"já fiz essa etapa"** (ou peça para eu fazer), depois **autorize a próxima** para eu ter contexto e seguir com eficiência.

**Regra:** Só avançar para a próxima após você autorizar. Assim evitamos retrabalho e mantemos o contexto completo.

---

## Controle de progresso (atualize a cada “OK”)

| Campo | Valor |
|-------|--------|
| **Próxima etapa a executar** | — (todas concluídas) |
| **Última concluída** | **10+11** — Meta (theme_text) + telemetria já em uso |

**Como usar comigo:**  
- Você diz: **"OK"**, **"próxima etapa"** ou **"pode fazer a etapa X"**.  
- Eu leio esta seção, implemento só a próxima etapa, atualizo esta tabela e respondo com resumo + "Próxima: Etapa Y — [nome]".  
- Assim não perdemos contexto e cada passo fica isolado e verificável.

---

## ETAPA 1 — Catálogo de fluxos (código)

**O quê:** Arquivo `src/config/ylada-flow-catalog.ts` com os 5 fluxos universais (ou 2 no MVP: checklist + perfil).

**Contém:**
- Tipo `FlowCatalogItem`: id, architecture, type (qualidade/volume), display_name, impact_line, description, perfil_lead_atraido, question_labels[], result_preview, cta_default.
- Lista/registros para: diagnostico_risco, diagnostico_bloqueio, calculadora_projecao, perfil_comportamental, checklist_prontidao (ou só checklist + perfil no MVP).

**Como verificar:** Arquivo existe; importável; IDs batem com os usados em strategies.

**Status:** [x] Concluída

---

## ETAPA 2 — Regra de decisão (getStrategies)

**O quê:** Arquivo `src/lib/ylada/strategies.ts` com função `getStrategies(interpretacao)`.

**Contém:**
- Entrada: { objetivo, area_profissional, tema? } (ou interpretacao completa).
- Saída: { qualityFlowId, volumeFlowId } (2 IDs do catálogo).
- Tabela de decisão: saúde (captar → risco + bloqueio; educar/reter → checklist + perfil); liberal (captar → checklist + perfil); vendas (captar → checklist + calculadora); wellness (consumidor → risco + perfil; parceiro → checklist + calculadora).
- Fallback: [checklist_prontidao, perfil_comportamental].

**Como verificar:** Função exportada; para objetivo=captar e area=medico retorna [diagnostico_risco, diagnostico_bloqueio] ou [checklist, perfil] se MVP; fallback retorna 2 IDs válidos.

**Status:** [x] Concluída

---

## ETAPA 3 — Interpret retornando strategies

**O quê:** Ajustar `POST /api/ylada/interpret` para, após parse da Etapa 1, chamar `getStrategies(interpretacao)` e incluir no response `strategies: [qualityFlowId, volumeFlowId]`.

**Contém:**
- Import de getStrategies e do catálogo (se necessário).
- Após obter interpretacao (parseInterpretResponse), chamar getStrategies com objetivo + area_profissional (e tema se quiser).
- Adicionar ao objeto de resposta: strategies: [qualityFlowId, volumeFlowId].
- Manter compatibilidade: recommendedTemplateId/recommendedTemplateName podem vir do primeiro strategy (qualidade) para a UI antiga até a nova UI estar pronta.

**Como verificar:** POST /api/ylada/interpret com body { text: "quero captar pacientes para perda de peso" } retorna interpretacao + strategies com 2 IDs.

**Status:** [x] Concluída

---

## ETAPA 4 — UI: Tela 1 (Intenção) + Tela 2 (2 cards de estratégias)

**O quê:** Na página `src/app/pt/(matrix)/links/page.tsx`, reorganizar para:
- **Tela 1:** Título "Qual é o objetivo deste link?", chips Captar|Educar|Reter|Propagar|Indicar, campo "Em uma frase, o que você quer alcançar?" (placeholder ex.: "captar pessoas interessadas em perder peso"), botão [ Avançar ]. Microcopy: "Você não precisa escolher o tipo de quiz. A YLADA sugere a melhor estratégia."
- Ao clicar Avançar: chamar POST /api/ylada/interpret (com objective + text); receber interpretacao + strategies.
- **Tela 2:** Título "Entendemos seu objetivo." / "Você quer {objetivo} pessoas sobre {tema}." / "Identificamos duas estratégias… Escolha uma:" / 2 cards (QUALIDADE e VOLUME) com display_name, impact_line, botão [ Ver como funciona ]. Link "Alterar objetivo/tema" volta à Tela 1.
- Dados dos cards: buscar no catálogo por strategies[0] e strategies[1] (ou pelo ID retornado).

**Como verificar:** Fluxo completo: preencher objetivo + texto → Avançar → aparecem 2 cards com nomes e frases do catálogo; "Alterar objetivo" volta.

**Status:** [x] Concluída

---

## ETAPA 5 — UI: Tela 3 (Detalhe do fluxo) + Tela 4 (Preview)

**O quê:**
- **Tela 3:** Ao clicar "Ver como funciona" em um card: mostrar detalhe do fluxo (nome + badge Qualidade/Volume, "O que este link faz" = description, "Perguntas que serão feitas" = question_labels, "O que a pessoa recebe" = result_preview, "Como isso vira conversa" = CTA). Botão [ Gerar esse link ]. Link "Ver outra estratégia" volta aos 2 cards.
- **Tela 4 (Preview):** Antes de gerar de fato, mostrar prévia: título, subtítulo, perguntas, resultado, CTA. Botão [ Confirmar e gerar link ]. Link "Voltar" volta ao detalhe. Sem edição de campos (só leitura).

**Como verificar:** Escolher um card → ver detalhe → Gerar esse link → ver preview → Confirmar e gerar link (por enquanto pode chamar generate atual ou placeholder).

**Status:** [x] Concluída

---

## ETAPA 6 — Endpoint generate (interpretacao + flow_id)

**O quê:** Ajustar `POST /api/ylada/links/generate` para aceitar body com `interpretacao` + `flow_id` (ID do catálogo), além de ou em vez de template_id.

**Contém:**
- Se vier flow_id: buscar dados do fluxo no catálogo; definir qual template_id usar (mapeamento flow_id → template_id existente em ylada_link_templates, ou usar um template genérico por arquitetura).
- Montar config_json no formato do Pacote 3 (meta, page, form, result) com tema/objetivo e placeholders (nome do profissional pode vir do perfil depois).
- Gerar slug único; inserir em ylada_links (template_id, config_json, slug, title, etc.). Guardar em config_json.meta: objective, theme_raw, theme_normalized, flow_id, architecture.
- Retornar: link_id, slug, url, config (ou pelo menos url).

**Como verificar:** POST com interpretacao + flow_id retorna 200 e cria linha em ylada_links com config_json preenchido.

**Status:** [x] Concluída

---

## ETAPA 7 — Integrar "Confirmar e gerar link" ao generate

**O quê:** Na UI, ao clicar [ Confirmar e gerar link ] no preview, chamar POST /api/ylada/links/generate com interpretacao (guardada no state) + flow_id (fluxo escolhido). Receber url; mostrar Tela 5 (Sucesso).

**Como verificar:** Fluxo completo: Intenção → Estratégias → Detalhe → Preview → Confirmar → ver "Seu link está pronto" + URL + Copiar link.

**Status:** [x] Concluída

---

## ETAPA 8 — Página pública do link

**O quê:** Rota pública (ex.: `/l/[slug]` ou `/link/[slug]`) que: busca ylada_links por slug; lê config_json; renderiza título, subtítulo, formulário (fields), após submit mostra resultado (headline, summary_bullets, next_step, etc.) e botão WhatsApp (cta.text, link wa.me).

**Contém:** Página Next.js que usa config_json para montar o form e o resultado. MVP pode usar resultado “mock” por arquitetura (ex.: nível baixo/médio/alto para risco) sem cálculo real ainda.

**Como verificar:** Abrir URL do link gerado; preencher; ver resultado e botão WhatsApp.

**Status:** [x] Concluída

---

## ETAPA 9 — Remover UI antiga (dropdown + botão duplicado)

**O quê:** Na página de links, remover: dropdown "Quiz ou calculadora" e o botão "Gerar link" que ficava na seção inferior. Garantir que a única forma de gerar link seja: escolher estratégia → detalhe → [ Gerar esse link ] → preview → [ Confirmar e gerar link ].

**Como verificar:** Não existe mais segundo botão de gerar nem dropdown de template na tela.

**Status:** [x] Concluída

---

## ETAPA 10 — Persistência de decisão (opcional para métricas)

**O quê:** Ao salvar em ylada_links, garantir que objective, theme_text (ou theme_raw), flow_id e type (qualidade/volume) estejam em config_json.meta (ou em colunas se fizer migration). Assim depois dá para analisar: qual estratégia converte mais, por área.

**Como verificar:** Links gerados têm meta preenchida com objective, theme, flow_id.

**Status:** [x] Concluída (meta já persistida no generate; theme_text adicionado)

---

## ETAPA 11 — Telemetria (eventos do link)

**O quê:** Garantir que eventos (view, start, complete, cta_click) sejam registrados em ylada_link_events quando o visitante acessa a página pública (e opcionalmente created_link no backend ao gerar). Documentar ou implementar se ainda não existir.

**Como verificar:** Acessar link público; preencher; clicar WhatsApp; verificar registros em ylada_link_events.

**Status:** [x] Concluída (POST /api/ylada/links/events + trackEvent no PublicLinkView)

---

## Resumo da sequência

| # | Etapa | Depende de |
|---|-------|-------------|
| 1 | Catálogo (ylada-flow-catalog.ts) | — |
| 2 | getStrategies (strategies.ts) | 1 |
| 3 | Interpret retorna strategies | 1, 2 |
| 4 | UI Tela 1 + Tela 2 (intenção + 2 cards) | 3 |
| 5 | UI Tela 3 + Tela 4 (detalhe + preview) | 4 |
| 6 | Generate com interpretacao + flow_id | 1, 2 |
| 7 | Botão "Confirmar e gerar" chama generate + Tela 5 | 5, 6 |
| 8 | Página pública /l/[slug] | 6 |
| 9 | Remover dropdown e botão duplicado | 4, 5, 7 |
| 10 | Persistir decisão (meta) | 6 |
| 11 | Telemetria | 8 |

---

**Como usar:**  
- Para a **Etapa 1**, você pode dizer: "pode fazer a Etapa 1" (ou "já fiz a Etapa 1").  
- Quando a Etapa 1 estiver concluída: "autorize a Etapa 2" (ou "pode fazer a Etapa 2").  
- Eu sigo com a próxima etapa só após você autorizar, mantendo contexto e eficiência.
