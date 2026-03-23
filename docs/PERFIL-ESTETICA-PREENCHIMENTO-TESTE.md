# Perfil Estética — Preenchimento para teste interno (conta 11)

**Objetivo:** Valores exatos para o perfil da área estética (liberal) usados pelo agente de teste e pelo script de contas. Com isso o Noel e as ferramentas funcionam sem erro (perfil completo).

**Referência:** `config/ylada-profile-flows.ts`, `src/types/ylada-profile.ts`, `scripts/criar-contas-teste-interno.js`.

---

## 1. Pré-requisito (onboarding)

| Campo   | Valor              |
|---------|--------------------|
| Nome    | Teste Interno 11   |
| Telefone| 5519997230912      |

---

## 2. Tela inicial do perfil

| Campo           | Valor (value no sistema) | Label exibido   |
|-----------------|--------------------------|-----------------|
| Tipo de atuação | liberal                  | Liberal         |
| Profissão       | estetica                 | Estética        |

---

## 3. Etapas do wizard (valores por campo)

| Etapa   | Campo (key)            | Valor (value ou texto)                    | Observação |
|---------|-------------------------|-------------------------------------------|------------|
| 1 – Contexto | area_estetica         | facial                                    | Estética facial |
| 1 – Contexto | estetica_tipo_atuacao | autonoma                                  | Autônoma   |
| 1 – Contexto | tempo_atuacao_anos    | 3                                         | Número     |
| 2 – Especialidade | sub_category       | Limpeza de pele e facial                  | Texto livre |
| 3 – Diagnóstico | dor_principal       | agenda_vazia                              | Agenda vazia |
| 3 – Diagnóstico | prioridade_atual     | (texto livre — ex.: Aumentar agenda e divulgar mais) | |
| 3 – Diagnóstico | fase_negocio        | em_crescimento                            | Em crescimento |
| 4 – Metas e modelo | metas_principais   | (texto livre — ex.: Preencher agenda e qualificar leads) | |
| 4 – Metas e modelo | objetivos_curto_prazo | (texto livre — ex.: Link com diagnóstico para engajar) | |
| 4 – Metas e modelo | capacidade_semana  | 15                                        | Número     |
| 4 – Metas e modelo | ticket_medio        | 180                                       | Número     |
| 4 – Metas e modelo | modelo_pagamento   | avulso                                    | Avulso     |
| 5 – Canais e rotina | canais_principais  | instagram, whatsapp, indicacao            | Multiselect |
| 5 – Canais e rotina | rotina_atual_resumo | (texto livre — ex.: Atendimentos alguns dias, quero captar mais) | |
| 6 – Observações | observacoes         | (texto opcional ou vazio)                 | |

---

## 4. Nome e WhatsApp no perfil

Garantir **nome** e **whatsapp** em `area_specific` (ou no onboarding/perfil), com os valores acima, para o sistema considerar perfil completo.

| Campo (em area_specific ou user) | Valor        |
|----------------------------------|--------------|
| whatsapp                         | 5519997230912 |
| nome (onboarding / user_profiles)| Teste Interno 11 |

---

## 5. Tabela única (campo → valor exato)

| Campo                  | Valor exato                                      |
|------------------------|--------------------------------------------------|
| profile_type           | liberal                                          |
| profession             | estetica                                         |
| segment                | estetica                                         |
| area_estetica          | facial                                           |
| estetica_tipo_atuacao  | autonoma                                         |
| tempo_atuacao_anos     | 3                                                |
| sub_category           | Limpeza de pele e facial                         |
| dor_principal          | agenda_vazia                                     |
| prioridade_atual       | Aumentar agenda e divulgar mais                  |
| fase_negocio           | em_crescimento                                   |
| metas_principais       | Preencher agenda e qualificar leads              |
| objetivos_curto_prazo  | Link com diagnóstico para engajar no Instagram   |
| capacidade_semana     | 15                                               |
| ticket_medio           | 180                                              |
| modelo_pagamento       | avulso                                           |
| canais_principais      | ['instagram', 'whatsapp', 'indicacao']           |
| rotina_atual_resumo    | Atendimentos alguns dias por semana, quero captar mais clientes |
| observacoes            | (vazio ou opcional)                              |
| area_specific.whatsapp | 5519997230912                                    |

---

## 6. Ordem de preenchimento (passo a passo)

1. **Login** com teste-estetica@teste.ylada.com e senha.
2. **Onboarding** (se existir): Nome = Teste Interno 11, Telefone = 5519997230912 → Salvar.
3. **Perfil empresarial:** Tipo = Liberal → Profissão = Estética.
4. **Wizard:** Etapa 1 (Contexto) → Etapa 2 (Especialidade) → Etapa 3 (Diagnóstico) → Etapa 4 (Metas e modelo) → Etapa 5 (Canais e rotina) → Etapa 6 (Observações), com os valores da tabela acima.
5. **Salvar** no final do wizard.
6. **Verificar no Noel:** “Gere um link para eu usar no post” → o Noel deve gerar o link (perfil completo).

---

**Uso pelo script:** `scripts/criar-contas-teste-interno.js` usa o objeto `PERFIL_NOEL_POR_AREA.estetica` para preencher `ylada_noel_profile` de `teste-estetica@teste.ylada.com` com esses valores. Rodar `node scripts/criar-contas-teste-interno.js` antes do agente deixa o perfil completo no backend.

**Uso pelo agente:** Para o agente “vivenciar” a experiência e preencher a UI etapa por etapa, usar esta tabela e a ordem acima em um fluxo de preenchimento do perfil (onboarding → perfil → wizard → Salvar).
