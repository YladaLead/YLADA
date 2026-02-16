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

## 8. O que já foi implementado (base)

- **Doc**: este arquivo.
- **Config**: `src/config/ylada-profile-flows.ts` — `ProfileType`, `ProfessionCode`, fluxos liberal/vendas (steps + fields), `getProfileFlow()`, `getProfessionsForSegment()`, labels.
- **Migration**: `migrations/210-ylada-profile-type-profession.sql` — colunas `profile_type`, `profession` em `ylada_noel_profile`.
- **API**: GET/PUT `/api/ylada/profile` aceitam e retornam `profile_type` e `profession`.
- **Resumo Noel**: `buildProfileResumo` inclui "Tipo: X. Profissão: Y." quando preenchido.
- **Tipos**: `YladaProfileFormData` e helpers em `src/types/ylada-profile.ts` com `profile_type` e `profession`.
- **Formulário**: em Perfil empresarial, na seção Contexto foram adicionados os campos opcionais "Tipo de perfil" e "Profissão / tópico"; o restante do formulário permanece único (fluxo por etapas pode ser implementado depois usando `getProfileFlow()`).

Próximos passos sugeridos: (1) Renderizar o formulário por etapas (wizard/accordion) usando `getProfileFlow(profileType, profession)` quando tipo/profissão estiverem definidos; (2) Ajustar opções de `dor_principal` por tipo (ex.: vendas com sem_leads, nao_converte, ticket_baixo); (3) Noel: instruções adicionais no system prompt por `profile_type` quando desejado.

Basta colar este contexto no novo chat e seguir a conversa a partir daí.
