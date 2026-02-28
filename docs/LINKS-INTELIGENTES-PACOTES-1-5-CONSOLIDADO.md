# Links Inteligentes — Pacotes 1–5 consolidados (base para implementação)

Este doc reúne os 5 pacotes aprovados: Arquiteturas Universais, Tabela de Decisão, Schema Técnico, UX + Microcopy, Plano de Implementação. É a referência única antes de codar.

**Contexto do projeto:** Página atual em `src/app/pt/(matrix)/links/page.tsx` (rota `/pt/links`). Tabela `ylada_links` já existe (template_id, config_json, slug, title, cta_whatsapp, status). APIs: `POST /api/ylada/interpret`, `GET/POST /api/ylada/links`, `POST /api/ylada/links/generate`.

---

# PACOTE 1 — Arquiteturas Universais (5 tipos)

Não se criam fluxos por tema. Criam-se 5 arquiteturas; o tema só preenche título/perguntas/resultado.

| # | Arquitetura | Tipo | Quando usar | Promessa | Saída mínima |
|---|-------------|------|-------------|----------|--------------|
| 1 | **Diagnóstico de Risco** | Qualidade | Consequência/urgência (saúde, jurídico, financeiro, estética com risco) | "Descubra se você está em risco de X" | risk_level, insight (bullets), next_step |
| 2 | **Diagnóstico de Bloqueio** | Volume | Dor "não consigo X" (não emagrece, não vende, agenda vazia) | "Descubra o que está te travando em X" | blocker_type, why, first_action |
| 3 | **Calculadora de Projeção** | Híbrido | Dá para estimar (perda de peso, economia, faturamento) | "Veja uma projeção realista de X em Y dias" | projection_value, projection_range, warning, recommended_path |
| 4 | **Perfil Comportamental** | Volume | Estilo/personalidade/rotina (liderança, organização, emagrecimento) | "Qual é o seu perfil de X?" | profile_type, strengths, pitfalls, best_next_step |
| 5 | **Checklist de Prontidão** | Qualidade | Validar se está pronto (tratamento, compra, processo) | "Você está pronto para X? Faça o checklist" | readiness_score, top_gaps, priority_actions |

**Regra universal:** Sempre 2 estratégias: 1 Qualidade + 1 Volume. Não perguntar "volume ou qualidade"; mostrar as duas.

**Refinamento (biblioteca):** Incluir campo `perfil_lead_atraido` (ex.: "pessoas preocupadas com saúde e exames") para a Camada 4.

---

# PACOTE 2 — Tabela de Decisão (objetivo + área → 2 arquiteturas)

Função: `getStrategies({ objective, area_profissional, theme_normalized?, subtype? }) → { qualityFlowId, volumeFlowId }`.

**Saúde (médico, nutri, dentista, psicólogo):**
- CAPTAR → Qualidade: Diagnóstico de Risco | Volume: Diagnóstico de Bloqueio
- EDUCAR → Qualidade: Checklist | Volume: Perfil
- RETER → Qualidade: Checklist | Volume: Perfil

**Profissional liberal (consultor, coach, advogado):**
- CAPTAR → Qualidade: Checklist | Volume: Perfil

**Vendas / representante:**
- CAPTAR → Qualidade: Checklist | Volume: Calculadora

**Wellness / multi:**
- CAPTAR consumidor → Qualidade: Diagnóstico de Risco | Volume: Perfil
- CAPTAR parceiro → Qualidade: Checklist | Volume: Calculadora

**Fallback (tema/área não reconhecidos):** Qualidade: Checklist | Volume: Perfil.

IDs sugeridos para o catálogo: `diagnostico_risco`, `diagnostico_bloqueio`, `calculadora_projecao`, `perfil_comportamental`, `checklist_prontidao`.

---

# PACOTE 3 — Schema técnico + contratos API + persistência

**Enums fixos:** objectives: captar | educar | reter | propagar | indicar. architectures: RISK_DIAGNOSIS | BLOCKER_DIAGNOSIS | PROJECTION_CALCULATOR | PROFILE_TYPE | READINESS_CHECKLIST.

**Catálogo (código ou tabela `ylada_flow_catalog`):** Por fluxo: id, architecture, type (qualidade/volume), display_name, impact_line, description, perfil_lead_atraido, question_labels[], result_preview, cta_default, template_version, is_active.

**Instância (`ylada_links`):** Manter id, user_id, template_id, slug, title, config_json, cta_whatsapp, status. Opcional: colunas objective, theme_text, theme_normalized, flow_id (ou guardar em config_json.meta).

**config_json (contrato único do front):**
- meta: version, objective, theme.raw, theme.normalized, flow_id, architecture
- page: title, subtitle, brand.professional_name, brand.whatsapp_number
- form: fields[], submit_label
- result: headline, summary_bullets, score/level/next_step, cta.text, cta.action, cta.value
- architecture_payload: conforme arquitetura (risk_dimensions, blocker_types, etc.)

**APIs:**
- `POST /api/ylada/interpret` → interpretacao + strategies: [id1, id2]
- `POST /api/ylada/links/generate` → body: { interpretacao, flow_id } → resp: link_id, slug, url, config

**IA:** Só para personalizar título/subtítulo e texto do WhatsApp; não define arquitetura nem schema.

---

# PACOTE 4 — UX (tela a tela) + microcopy

- **Tela 0 — Lista:** "Links Inteligentes" / "Crie links que geram conversas qualificadas." / [ Criar novo link ]. Cards: nome, objetivo, tipo, Copiar / Ver / Excluir.
- **Tela 1 — Intenção:** "Qual é o objetivo deste link?" / Chips Captar|Educar|Reter|Propagar|Indicar / "Em uma frase, o que você quer alcançar?" placeholder "Ex.: captar pessoas interessadas em perder peso" / [ Avançar ] / "Você não precisa escolher o tipo de quiz. A YLADA sugere a melhor estratégia."
- **Tela 2 — Estratégias:** "Entendemos seu objetivo." / "Você quer {objetivo} pessoas sobre {tema}." / "Identificamos duas estratégias… Escolha uma:" / 2 cards (QUALIDADE / VOLUME) com nome, impact_line, [ Ver como funciona ] / "Alterar objetivo/tema".
- **Tela 3 — Detalhe:** Nome + badge / "O que este link faz" (description) / "Perguntas que serão feitas" (question_labels) / "O que a pessoa recebe" (result_preview) / "Como isso vira conversa" (CTA) / [ Gerar esse link ] / "Ver outra estratégia".
- **Tela 4 — Preview:** "Prévia do seu link" / título, subtítulo, perguntas, resultado, CTA / [ Confirmar e gerar link ] / "Voltar".
- **Tela 5 — Sucesso:** "Seu link está pronto." / URL + [ Copiar link ] / [ Ver página ] / [ Criar outro link ].

**Regras:** Um único "Gerar link" (no detalhe); sem dropdown; sem botão duplicado.

---

# PACOTE 5 — Ordem de implementação (PRs)

1. **PR 1 — Catálogo:** Criar `src/config/ylada-flow-catalog.ts` (ou migration + seed). 5 itens (ou MVP 2: checklist + perfil). Tipo FlowCatalogItem com display_name, impact_line, description, question_labels, result_preview, cta_default, perfil_lead_atraido, architecture, type.
2. **PR 2 — getStrategies:** `src/lib/ylada/strategies.ts` com tabela de decisão + fallback [checklist, perfil].
3. **PR 3 — Interpret + strategies:** Ajustar `POST /api/ylada/interpret` para retornar interpretacao + strategies: [qualityId, volumeId] (chamando getStrategies após parse).
4. **PR 4 — UI Tela 1 + 2:** Intenção (chips + texto + Avançar) → chamar interpret → Tela 2 com 2 cards do catálogo; clique → Tela 3.
5. **PR 5 — UI Tela 3 + 4:** Detalhe (descrição, perguntas, resultado, CTA) + [ Gerar esse link ] + "Ver outra estratégia". Preview (modal/step) com [ Confirmar e gerar link ].
6. **PR 6 — Generate:** `POST /api/ylada/links/generate` recebe interpretacao + flow_id; monta config_json; gera slug; persiste em ylada_links; retorna url/slug/config. Persistir objective, theme_text, flow_id (em config_json.meta ou colunas).
7. **PR 7 — Página pública:** Rota `/link/[slug]` (ou existente) lê ylada_links por slug, renderiza form + resultado + WhatsApp a partir de config_json.
8. **PR 8 — Limpeza:** Remover dropdown e botão duplicado "Gerar link" da página antiga.
9. **PR 9 — Telemetria:** Garantir ylada_link_events (created_link, opened_link, submitted_form, clicked_whatsapp) para métricas por arquitetura/área.

**MVP rápido:** Ativar só 2 arquiteturas (Checklist + Perfil) no catálogo; decisão sempre retorna [checklist, perfil]. Depois ligar Risk, Blocker, Calc.

---

# Próximo passo recomendado

Para avançar com eficiência, a sequência prática é:

1. **Implementar o catálogo em código** (`src/config/ylada-flow-catalog.ts`) com os 5 fluxos (ou 2 no MVP), incluindo `perfil_lead_atraido`.
2. **Implementar `getStrategies()`** em `src/lib/ylada/strategies.ts` com a tabela de decisão do Pacote 2 e fallback.
3. **Ajustar `POST /api/ylada/interpret`** para, após a Etapa 1, chamar getStrategies(interpretacao) e retornar `strategies: [qualityFlowId, volumeFlowId]`.

Com isso, o backend já entrega intenção + 2 estratégias; a UI pode então ser alterada para Telas 2 e 3 (cards + detalhe + um único botão Gerar). Em seguida: endpoint de geração (flow_id + interpretacao → config_json + slug) e página pública do link.

**Arquivos a criar/alterar no próximo passo:**
- Criar: `src/config/ylada-flow-catalog.ts`
- Criar: `src/lib/ylada/strategies.ts`
- Alterar: `src/app/api/ylada/interpret/route.ts` (adicionar chamada a getStrategies e retorno de strategies)

Se quiser, o próximo passo concreto é eu te entregar o conteúdo desses três (catálogo + getStrategies + patch do interpret) prontos para colar no projeto.
