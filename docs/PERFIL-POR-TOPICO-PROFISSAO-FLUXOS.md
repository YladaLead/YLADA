# Perfil por tópico/profissão — fluxos diferentes por tipo

Objetivo: refinar o perfil YLADA para separar **quem é a pessoa** (profissional liberal vs vendas), com **fluxo de preenchimento e campos diferentes por tipo**, sem quebrar o que já existe.

---

## 1. Problema atual

- Perfil hoje é **genérico**: mesmo formulário para todos (segment = ylada, psi, odonto, nutra, coach, seller).
- Só há um bloco extra por segment (ex.: especialidades para `med`).
- Não diferencia claramente:
  - **Profissional liberal**: médico, estética, dentista, psi, coach (foco em consultório, agenda, formação).
  - **Vendas**: Nutra/suplementos, vendedor (foco em funil, ticket, conversão, recorrência).

---

## 2. Decisões de desenho

| Decisão | Escolha |
|--------|--------|
| **Onde guardar “tipo”** | Colunas opcionais em `ylada_noel_profile`: `profile_type` ('liberal' \| 'vendas') e `profession` (medico, estetica, odonto, psi, nutra, seller, coach). |
| **Compatibilidade** | Campos novos **nullable**. Quem já tem perfil continua válido; fluxo “clássico” (formulário único) segue disponível quando `profile_type`/`profession` forem null. |
| **Fluxos** | Definidos em **config** (ex.: `src/config/ylada-profile-flows.ts`): por `profile_type` ou por `profession`, lista de **etapas** (steps) e **campos** por etapa. Front renderiza wizard/accordion por etapa. |
| **Campos** | Não criar novas colunas por profissão; usar as atuais + `area_specific`. A config só define **quais** campos mostrar e em **qual ordem** por tipo. |
| **Noel** | `buildProfileResumo` passa a receber `profile_type`/`profession` e (opcional) formatar ou enfatizar blocos diferentes (ex.: vendas → funil, ticket, recorrência; liberal → especialidade, aprofundamento). |

---

## 3. Camadas (reuso do doc Três Camadas)

- **Segment** (rota/mercado): ylada, psi, psicanalise, odonto, nutra, coach, seller. Já existe.
- **Profile type**: `liberal` | `vendas` — separação de alto nível para fluxo e copy.
- **Profession** (tópico/profissão): medico, estetica, odonto, psi, nutricionista, vendedor_suplementos, vendedor, coach. Refinamento para próximas etapas e linguagem do Noel.

Fluxo sugerido na UI: primeiro escolher **profile_type** (ou ser inferido pelo segment), depois **profession** quando houver opções (ex.: segment ylada → medico | estetica | outro liberal; segment nutra → vendedor_suplementos). Depois, preencher **etapas** do fluxo daquele tipo.

---

## 4. Fluxos por tipo (exemplos)

### 4.1 Liberal (médico, estética, odonto, psi, coach)

- **Etapa 1 — Contexto**: categoria, sub_category, tempo_atuacao_anos.
- **Etapa 2 — Especialidade / Aprofundamento** (evitar “estética” genérico):
  - Med: especialidades (area_specific), outra.
  - Estética: subcategoria obrigatória (cabelo, pele, corporal, unhas, etc.) + área (facial, corporal, capilar).
  - Odonto: especialidades (area_specific).
  - Psi: abordagens, faixa etária (area_specific).
  - Coach: nichos (area_specific).
- **Etapa 3 — Diagnóstico**: dor_principal, prioridade_atual, fase_negocio.
- **Etapa 4 — Metas e modelo**: metas_principais, objetivos_curto_prazo, modelo_atuacao, capacidade_semana, ticket_medio, modelo_pagamento.
- **Etapa 5 — Canais e rotina**: canais_principais, rotina_atual_resumo, frequencia_postagem.
- **Etapa 6 — Observações**: observacoes.

Próximos passos sugeridos (UI/Noel): “Completar trilha empresarial”, “Configurar link inteligente para [especialidade]”.

### 4.2 Vendas (Nutra, seller)

- **Etapa 1 — Tipo de atuação**: oferta (serviço/produto/ambos), categoria (ex.: nutraceutico, estética) em area_specific.
- **Etapa 2 — Funil e ticket**: capacidade_semana, ticket_medio, modelo_pagamento, canal_principal_vendas (area_specific); opcional fase_negocio.
- **Etapa 3 — Dor e prioridade**: dor_principal (opções ajustadas: sem_leads, nao_converte, followup_fraco, ticket_baixo, etc.), prioridade_atual.
- **Etapa 4 — Metas e canais**: metas_principais, objetivos_curto_prazo, canais_principais, rotina_atual_resumo.
- **Etapa 5 — Observações**: observacoes.

Próximos passos sugeridos: “Montar funil no link inteligente”, “Aumentar ticket médio”, “Recorrência”.

---

## 5. Onde fica cada coisa

| O quê | Onde |
|-------|------|
| Valores de profile_type | Constante em config (liberal, vendas). |
| Valores de profession | Config por segment (quais profissões cada segment pode ter). |
| Definição de etapas e campos por tipo | `src/config/ylada-profile-flows.ts` (ou equivalente). |
| Persistência | `ylada_noel_profile.profile_type`, `ylada_noel_profile.profession` (nullable). |
| API GET/PUT perfil | Aceitar e devolver profile_type e profession; PUT pode receber só o que mudou. |
| Resumo Noel | `buildProfileResumo` em `src/lib/ylada-profile-resumo.ts`: incluir profile_type/profession e, se desejado, blocos por tipo. |
| Página Perfil empresarial | Escolher tipo → carregar fluxo da config → renderizar por etapas (ou accordion); manter fallback para formulário único quando profession/profile_type for null. |

---

## 6. Implementação sem quebrar o existente

1. **Migration**: adicionar em `ylada_noel_profile` colunas opcionais `profile_type` TEXT, `profession` TEXT; CHECK (profile_type IN ('liberal', 'vendas')) se quiser; índice opcional por profession.
2. **Config**: criar `ylada-profile-flows.ts` com lista de profession/profile_type, steps e fields por step (referindo colunas e chaves de area_specific).
3. **API profile**: no GET, retornar profile_type e profession; no PUT, aceitar e persistir ambos. Sem mudar contrato dos outros campos.
4. **buildProfileResumo**: ler profile_type/profession do row; acrescentar ao texto (ex.: “Tipo: vendas. Profissão: vendedor_suplementos.”) e, opcional, formatar blocos por tipo.
5. **Frontend**: na página Perfil empresarial, se não tiver profession/profile_type, mostrar primeiro passo “Quem é você?” (liberal vs vendas + profession quando aplicável). Depois, renderizar etapas do fluxo configurado para esse tipo. Manter possibilidade de “formulário completo” para quem já tem perfil antigo.
6. **Noel**: já usa o resumo; com profile_type/profession no resumo, as orientações podem ser mais relevantes (ex.: SEGMENT_CONTEXT ou instruções adicionais por profile_type no route do Noel, se necessário).

---

## 7. Resumo

- **Perfil por tópico/profissão** = segment (já existe) + profile_type (liberal | vendas) + profession (medico, estetica, nutra, seller, …).
- **Fluxos diferentes por tipo** = config de etapas e campos por profile_type (e opcionalmente por profession); mesma tabela e mesma API, só mudam a ordem e o conjunto de campos na UI.
- **Noel** = usa o resumo já injetado; refinando resumo com tipo e profissão (e blocos por tipo), a orientação fica mais relevante sem quebrar o que já existe.

---

## 8. Ajustes aplicados (whitelist, versionamento, mapTo, sinais, dor por tipo)

- **Ajuste 1 — Profession sempre pertence ao segment**: `PROFESSION_BY_SEGMENT` é a whitelist (ex.: ylada → medico | estetica | vendedor | outro; odonto → odonto; nutra → nutricionista | vendedor_suplementos). `validateProfessionForSegment(segment, profession)` na API rejeita combinações inválidas.
- **Ajuste 2 — Versionamento do flow**: Colunas `flow_id` (TEXT) e `flow_version` (INTEGER) em `ylada_noel_profile` (migration 211). Cada flow na config tem `flow_id` (ex.: liberal_v1, vendas_v1) e `flow_version: 1`. Ao salvar, o front envia o flow atual; o resumo do Noel inclui "Flow: flow_id vN".
- **Ajuste 3 — Campo com source/path (mapTo)**: Em `ylada-profile-flows.ts`, cada campo é `ProfileFieldDef`: `key`, `source` ('column' | 'area_specific'), `path` (para area_specific), `required`, `type`, `options`, `dependsOn`. `getFieldPersistTarget(field)` devolve onde persistir. Dois fluxos completos: liberal.medico e vendas.vendedor_suplementos.
- **Upgrade A — Sinais estruturados**: `buildProfileSignals(profile)` em `ylada-profile-resumo.ts` retorna `{ foco?, ticket_medio?, canal_principal?, gargalo? }`. O resumo em texto inclui "[Sinais] Foco: X. Canal principal: Y. Gargalo: Z." para o Noel e futura UI de próximo passo.
- **Upgrade B — Dor por tipo**: `DOR_PRINCIPAL_OPTIONS_LIBERAL` e `DOR_PRINCIPAL_OPTIONS_VENDAS` em `src/types/ylada-profile.ts`; `getDorPrincipalOptions(profileType)` retorna a lista correta; o formulário usa no select de dor principal.

## 9. O que está implementado

- **Config**: `src/config/ylada-profile-flows.ts` — whitelist, `ProfileFieldDef`, fluxos com flow_id/flow_version, `validateProfessionForSegment`, `getProfileFlow`, `getProfessionsForSegment`, `getFieldPersistTarget`.
- **Migrations**: 210 (profile_type, profession), 211 (flow_id, flow_version).
- **API**: PUT valida profession contra segment; aceita e persiste flow_id, flow_version.
- **Resumo Noel**: `buildProfileResumo` com tipo, profissão, flow, e bloco [Sinais]; `buildProfileSignals(profile)` exportado.
- **Formulário**: Tipo e profissão (whitelist); dor principal por tipo; ao salvar, flow_id/flow_version preenchidos a partir do flow config.

Próximos passos sugeridos: (1) Wizard/accordion por etapas usando `getProfileFlow()` e `ProfileFieldDef`; (2) Noel: usar sinais no prompt ou em lógica de próximo passo.

Basta colar este contexto no novo chat e seguir a conversa a partir daí.
