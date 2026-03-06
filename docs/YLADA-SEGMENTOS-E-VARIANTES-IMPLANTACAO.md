# YLADA — Segmentos e Variantes: Documento de Implantação

> **Objetivo:** Detalhar a arquitetura de segmentos, variantes por profissão e o fluxo de implantação para o posicionamento **Bem-estar e qualidade de vida**.

> **Posicionamento:** O YLADA não é um criador de quiz. É um **motor universal de diagnóstico humano + geração de leads** — estrutura universal (bloqueios) + linguagem adaptada por segmento.

---

## 1. Visão geral

O **segmento** que define as variantes do diagnóstico vem do **perfil** que a pessoa preenche ao se cadastrar ou ao criar o link. Não é uma lista fixa de profissões — é o resultado do fluxo de perfil (área principal, tipo de atendimento, etc.).

**Regra central:** `segment_code` = derivado do perfil → salvo no link → motor usa para escolher variantes.

---

## 2. Estrutura hierárquica

Fluxo completo do sistema:

```
Área (organizacional)
    ↓
Perfil profissional
    ↓
segment_code
    ↓
Temas
    ↓
Bloqueios (universais)
    ↓
Diagnóstico + CTA
```

### 2.1. Áreas principais (organizacionais)

Apenas para agrupamento (menu, filtros, posicionamento). Não afetam o motor.

| area_code | Área |
|-----------|------|
| `wellbeing` | Bem-estar e qualidade de vida |
| `health` | Saúde |
| `beauty` | Estética e imagem |
| `performance` | Performance física |

---

## 3. Segmentos oficiais (diagnóstico)

Dentro do guarda-chuva **Bem-estar e qualidade de vida**, os segmentos para variantes de diagnóstico são:

| segment_code | Label | Descrição |
|--------------|-------|-----------|
| `wellness` | Wellness | Genérico: energia, estresse, rotina, sono, disposição |
| `nutrition` | Nutrição | Alimentação, emagrecimento, metabolismo, intestino |
| `dentistry` | Odontologia | Cuidados bucais, cáries, escovação, gengiva |
| `aesthetics` | Estética | Pele, autocuidado, skincare, retenção, autoestima corporal |
| `fitness` | Fitness | Treino, atividade física, consistência, disposição |

**Fallback:** Quando o segmento não tiver variantes específicas, usa `BLOCKER_VARIANTS` (genérico).

---

## 4. Mapeamento: perfil → segment_code

O **profession** (ou área principal) vem do fluxo de perfil. O **segment_code** para diagnóstico é derivado assim:

### 4.1. Tabela completa de profissões

| profession (perfil) | segment_code |
|--------------------|--------------|
| **Nutrição** | |
| `nutricionista` | `nutrition` |
| `vendedor_suplementos` | `nutrition` |
| `herbalife` / wellness coach | `nutrition` |
| **Odontologia** | |
| `odonto` / dentista | `dentistry` |
| **Estética** | |
| `estetica` / esteticista | `aesthetics` |
| clínica estética | `aesthetics` |
| dermatologia estética | `aesthetics` |
| **Fitness** | |
| personal trainer | `fitness` |
| coach fitness | `fitness` |
| **Saúde / Bem-estar** | |
| `medico` | `wellness` |
| `cardiologista` | `wellness` |
| `psiquiatra` | `wellness` |
| `psi` / psicólogo | `wellness` |
| `psicanalise` / psicanalista | `wellness` |
| terapeuta | `wellness` |
| `coach` | `wellness` |
| **Especialidades ligadas a metabolismo/digestão** | |
| endocrinologista | `nutrition` |
| gastroenterologista | `nutrition` |
| **Outros** | |
| `vendedor_servicos`, `vendedor_produtos`, `vendedor` | `wellness` |
| `outro` | `wellness` |

**Regra:** Médicos gerais e de saúde mental → `wellness`. Médicos ligados a metabolismo/digestão → `nutrition`.

### 4.2. Fallback por tema

Se `segment_code` não vier do perfil, o motor pode inferir pelo `theme_raw`:
- "cáries", "saúde bucal", "dentário" → `dentistry`
- "pele", "skincare", "estética", "retenção" → `aesthetics`
- "emagrecimento", "intestino", "metabolismo" → `nutrition`
- "treino", "disposição", "fitness" → `fitness`

---

## 5. Variantes por segmento (estrutura)

Cada segmento tem o mesmo conjunto de **bloqueios** (rotina, emocional, processo, hábitos, expectativa). O que muda é a **linguagem** e os **exemplos**.

### 5.1. Bloqueios universais (motor principal)

Não mudam nunca. São o coração do diagnóstico.

| blocker_code | Significado |
|--------------|-------------|
| `rotina` | Falta de organização |
| `emocional` | Emoções interferindo |
| `processo` | Falta de clareza no próximo passo |
| `habitos` | Dificuldade em manter consistência |
| `expectativa` | Expectativa desalinhada |

### 5.2. Campos por variante

Cada variante tem:

- `leitura` — Parágrafo de identificação
- `causa_provavel` — Causa provável, linguagem suave
- `preocupacoes` — Pontos de atenção
- `espelho` — "Isso não é X. É Y." (remove culpa)
- `providencias` — Próximos passos gerais
- `specific_actions` — 3 ações concretas (com slot `{NAME}`)
- `dica_rapida` — Dica curta
- `frase_identificacao` — Frase de empatia

---

## 6. Variantes detalhadas por segmento

### 6.1. Genérico (wellness / fallback)

**Arquivo:** `diagnosis-templates.ts` → `BLOCKER_VARIANTS`

**Exemplo rotina:**
- Leitura: "seu dia a dia está funcionando mais no improviso do que em um padrão organizado"
- Providências: "horário, refeição ou planejamento"
- Ações: "café da manhã", "3 refeições na noite anterior"

---

### 6.2. Odontologia (dentistry)

**Arquivo:** `diagnosis-templates.ts` → `BLOCKER_VARIANTS_ODONTO`

**Exemplo rotina:**
- Leitura: "os cuidados bucais estão mais no improviso do que em um padrão organizado"
- Causa: "quando a escovação e os cuidados variam de um dia pro outro"
- Providências: "horário fixo de escovação ou uso do fio dental"
- Ações: "horário fixo para escovação (manhã e noite)", "fio dental em momento fixo"

**Status:** ✅ Implementado

---

### 6.3. Estética (aesthetics)

**Arquivo:** `diagnosis-templates.ts` → `BLOCKER_VARIANTS_AESTHETICS` (a criar)

**Exemplo rotina:**

| Campo | Texto sugerido |
|-------|----------------|
| leitura | Pelas suas respostas, sua rotina de cuidados com a pele está mais no improviso do que em um padrão organizado. |
| causa_provavel | A causa provável está na falta de estrutura: quando os cuidados variam de um dia pro outro, a constância tende a ser quebrada. |
| preocupacoes | Sem um mínimo de previsibilidade nos cuidados, a frustração pode aumentar e o padrão fica difícil de mudar. |
| espelho | Isso não é falta de disciplina. É falta de estrutura. |
| providencias | Organizar um único ponto da rotina (horário fixo de limpeza ou hidratação) já pode mudar o ritmo. Vale conversar com quem entende pra calibrar o próximo passo. |
| specific_actions | Definir um horário fixo para a rotina de skincare (manhã e noite). / Incluir hidratação em um momento fixo do dia. / Converse com {NAME} pra calibrar o próximo passo. |
| dica_rapida | Muitas pessoas se beneficiam de organizar um único ponto: horário fixo de limpeza ou hidratação. Pequenas mudanças já podem mudar o ritmo dos cuidados. |
| frase_identificacao | Se você se identificou com esse resultado, provavelmente já percebeu que manter um padrão organizado nos cuidados com a pele tem sido um desafio. |

**Status:** ✅ Implementado

---

### 6.4. Nutrição (nutrition)

**Arquivo:** `diagnosis-templates.ts` → `BLOCKER_VARIANTS_NUTRITION` (a criar)

**Exemplo rotina:**

| Campo | Texto sugerido |
|-------|----------------|
| leitura | Pelas suas respostas, sua rotina alimentar está mais no improviso do que em um padrão organizado. |
| causa_provavel | A causa provável está na falta de estrutura: quando as refeições variam de um dia pro outro, a constância tende a ser quebrada. |
| preocupacoes | Sem um mínimo de previsibilidade nos horários e nas escolhas, a frustração pode aumentar e o padrão fica difícil de mudar. |
| espelho | Isso não é falta de disciplina. É falta de estrutura. |
| providencias | Organizar um único ponto da rotina (horário fixo de uma refeição ou planejamento) já pode mudar o ritmo da semana. Vale conversar com quem entende pra calibrar o próximo passo. |
| specific_actions | Definir um horário fixo para o café da manhã ou almoço. / Planejar 3 refeições na noite anterior. / Converse com {NAME} pra calibrar o próximo passo. |
| dica_rapida | Muitas pessoas se beneficiam de organizar um único ponto: horário fixo de refeição ou planejamento. Pequenas mudanças já podem mudar o ritmo da semana. |
| frase_identificacao | Se você se identificou com esse resultado, provavelmente já percebeu que manter um padrão organizado na alimentação tem sido um desafio. |

**Status:** ✅ Implementado

---

### 6.5. Fitness (fitness)

**Arquivo:** `diagnosis-templates.ts` → `BLOCKER_VARIANTS_FITNESS`

**Exemplo rotina:**

| Campo | Texto sugerido |
|-------|----------------|
| leitura | Pelas suas respostas, sua rotina de treino está mais no improviso do que em um padrão organizado. |
| causa_provavel | A causa provável está na falta de estrutura: quando os treinos variam de um dia pro outro, a constância tende a ser quebrada. |
| preocupacoes | Sem um mínimo de previsibilidade nos horários e na frequência, a frustração pode aumentar e o padrão fica difícil de mudar. |
| espelho | Isso não é falta de disciplina. É falta de estrutura. |
| providencias | Organizar um único ponto da rotina (horário fixo de treino ou dias da semana) já pode mudar o ritmo. Vale conversar com quem entende pra calibrar o próximo passo. |
| specific_actions | Definir um horário fixo para o treino (ex.: 3x por semana). / Anotar os dias da semana em que vai treinar. / Converse com {NAME} pra calibrar o próximo passo. |
| dica_rapida | Muitas pessoas se beneficiam de organizar um único ponto: horário fixo ou dias fixos de treino. Pequenas mudanças já podem mudar o ritmo da semana. |
| frase_identificacao | Se você se identificou com esse resultado, provavelmente já percebeu que manter um padrão organizado nos treinos tem sido um desafio. |

**Status:** ✅ Implementado

---

## 7. Fluxo do link

### 7.1. Criação do link

1. Profissional entra no Noel / fluxo de criação de link.
2. Sistema identifica **segment** (ex.: ylada, odonto, nutra) e **profession** (ex.: estetica, odonto, nutricionista) do perfil.
3. Profissional escolhe objetivo + tema (ex.: "cáries e saúde bucal", "pele e autocuidado").
4. Sistema gera o link e **grava no meta**:
   - `theme_raw`
   - `flow_id`
   - `architecture`
   - **`segment_code`** ← derivado de profession/segment (ou tema)

### 7.2. Geração do diagnóstico

1. Visitante responde o quiz e envia para o endpoint de diagnóstico.
2. API lê o meta do link (incluindo `segment_code`).
3. Motor chama `getBlockerVariants(theme_raw, segment_code)`.
4. Retorna variantes do segmento escolhido (ou fallback genérico).

---

## 8. Estrutura do link no banco

Um link no config (`config_json`) deve conter no mínimo:

```json
{
  "meta": {
    "profession": "nutricionista",
    "segment_code": "nutrition",
    "theme_raw": "intestino",
    "flow_id": "liberal_v1",
    "architecture": "BLOCKER_DIAGNOSIS"
  }
}
```

O motor de diagnóstico usa `segment_code` e `theme_raw` para escolher as variantes. O `blockers` é calculado pelas respostas do visitante, não armazenado no link.

---

## 9. Catálogo de temas por segmento

Catálogo completo para geração de links inteligentes:

| segment_code | Temas |
|--------------|-------|
| **nutrition** | emagrecimento, intestino, metabolismo, hidratação, retenção, energia, alimentação |
| **aesthetics** | pele, skincare, autocuidado, retenção, rejuvenescimento, manchas, flacidez |
| **dentistry** | cáries, gengiva, escovação, sensibilidade, saúde bucal |
| **fitness** | treino, energia, consistência, condicionamento, disposição |
| **wellness** | energia, estresse, sono, rotina, qualidade de vida, equilíbrio emocional |

**Para médicos e psicólogos:** Usar temas neutros de saúde (estresse, qualidade de vida, energia, sono, rotina, equilíbrio emocional). Evitar linguagem de marketing; priorizar educação e triagem.

---

## 10. Escalabilidade

Com a estrutura atual:

- **5 segmentos** × **~6 temas** × **5 bloqueios** ≈ **150 diagnósticos possíveis**

Sem aumentar a complexidade do motor. Cada combinação gera um link único e um diagnóstico adaptado.

---

## 11. Linguagem para médicos e psicólogos

Temas para profissionais de saúde mental e médicos devem ser **neutros**:

- ✔ Estresse, qualidade de vida, energia, sono, rotina, equilíbrio emocional
- ✔ Não promete tratamento
- ✔ Não substitui consulta
- ✔ Gera educação e triagem

**Exemplo de CTA para médico:** "Veja algumas orientações iniciais para melhorar equilíbrio e energia no dia a dia."

---

## 12. Pré-triagem para médicos

A YLADA pode funcionar como **ferramenta de pré-triagem**:

```
Paciente responde diagnóstico
    ↓
Resultado
    ↓
Agenda consulta
```

Médicos valorizam triagem antes do atendimento. O diagnóstico orienta o paciente e qualifica o lead.

---

## 13. Checklist de implantação

**Prioridade de implementação:** Começar por `nutrition`, `aesthetics` e `wellness` — cobrem Herbalife, nutrição, estética, coaches, terapeutas, médicos e psicólogos.

### Fase 1 — Persistir segment_code no link

- [ ] Na geração do link (flow_id + interpretação), derivar `segment_code` de `profession` ou `segment`.
- [ ] Adicionar `segment_code` em `config.meta` ao salvar o link.
- [ ] Na rota de diagnóstico, passar `meta.segment_code` para o motor.

### Fase 2 — Variantes de estética

- [ ] Criar `BLOCKER_VARIANTS_AESTHETICS` em `diagnosis-templates.ts`.
- [ ] Incluir em `getBlockerVariants()` para `segment_code === 'aesthetics'`.
- [ ] Revisar textos com foco em pele, autocuidado, skincare.

### Fase 3 — Variantes de nutrição

- [ ] Criar `BLOCKER_VARIANTS_NUTRITION` em `diagnosis-templates.ts`.
- [ ] Incluir em `getBlockerVariants()` para `segment_code === 'nutrition'`.
- [ ] Revisar textos com foco em alimentação, refeições, metabolismo.

### Fase 4 — Variantes de fitness

- [ ] Criar `BLOCKER_VARIANTS_FITNESS` em `diagnosis-templates.ts`.
- [ ] Incluir em `getBlockerVariants()` para `segment_code === 'fitness'`.
- [ ] Revisar textos com foco em treino, frequência, consistência.

### Fase 5 — Mapeamento profession → segment_code

- [ ] Criar função `getDiagnosisSegmentFromProfile(profession, segment, themeRaw?)`.
- [ ] Usar na geração do link para definir `meta.segment_code`.
- [ ] Documentar mapeamento em `ylada-profile-flows.ts` ou config dedicada.

### Fase 6 — Otimização de variantes

- [ ] Revisar textos com especialistas por segmento.
- [ ] Testar com links reais.
- [ ] Ajustar linguagem conforme feedback.

---

## 14. Tabelas e calculadoras compartilhadas

Sim, a maioria serve para vários nichos:

| Recurso | Compartilhado? | O que muda por segmento |
|---------|----------------|--------------------------|
| Bloqueios (rotina, emocional, etc.) | ✅ Sim | Só os textos |
| Níveis de risco (baixo/médio/alto) | ✅ Sim | Só os textos |
| Perfil (consistente, ansioso, etc.) | ✅ Sim | Só os exemplos |
| Checklist | ✅ Sim | Itens por tema |
| Projeção (calculadora) | ✅ Sim | Unidade (kg, sessões, etc.) |
| Motor de decisão | ✅ Sim | Nada |

---

## 15. Evolução futura: camada tema

Hoje o fluxo é:

```
segmento → bloqueio → diagnóstico
```

Uma evolução possível é inserir o **tema** entre segmento e bloqueio:

```
segmento → tema → bloqueio → diagnóstico
```

**Exemplo:**

| segmento | tema | bloqueio | resultado |
|----------|------|----------|-----------|
| nutrition | intestino | rotina | "sua rotina alimentar está irregular" (foco intestino) |
| nutrition | emagrecimento | rotina | "sua rotina alimentar está irregular" (foco emagrecimento) |
| aesthetics | pele | rotina | "sua rotina de skincare está inconsistente" |
| aesthetics | retenção | rotina | "sua rotina de cuidados com o corpo está improvisada" |

**Benefício:** Criar muito mais links sem novos templates. O tema refina a linguagem dentro do mesmo segmento.

**Quando implementar:** Quando houver volume de links e necessidade de granularidade maior (ex.: "intestino" vs "emagrecimento" em nutrição com exemplos distintos).

**Hoje:** O `theme_raw` já existe e é usado para fallback (detecção por palavras-chave quando `segment_code` não vem do perfil). A camada tema seria uma extensão dessa lógica.

---

## 16. Catálogo inicial de links (30 links)

Links prontos para adoção, organizados por segmento. Cada título gera identificação imediata no visitante.

### Nutrition (nutricionistas, Herbalife, wellness coach)

| # | Título | theme_raw |
|---|--------|-----------|
| 1 | Seu intestino está funcionando como deveria? | intestino |
| 2 | Descubra se seu intestino está lento ou irregular | intestino |
| 3 | Seu corpo está mostrando sinais de intestino desregulado? | intestino |
| 4 | Seu metabolismo pode estar mais lento do que deveria? | metabolismo |
| 5 | O que pode estar bloqueando seu emagrecimento? | emagrecimento |
| 6 | Seu corpo está acumulando mais retenção do que deveria? | retenção |
| 7 | Por que sua energia pode estar baixa durante o dia? | energia |
| 8 | Seu corpo está pedindo mais energia e foco? | energia |
| 9 | Descubra o que pode estar drenando sua disposição | energia |
| 10 | Você está consumindo água suficiente para seu corpo? | hidratação |

### Aesthetics (esteticistas, clínicas, dermatologia estética)

| # | Título | theme_raw |
|---|--------|-----------|
| 11 | Sua rotina de cuidados com a pele está funcionando? | pele |
| 12 | Sua pele está recebendo os cuidados certos? | pele |
| 13 | Descubra o que sua pele pode estar precisando | pele |
| 14 | Seu nível de autocuidado está adequado? | autocuidado |
| 15 | Sua rotina de cuidados pessoais está organizada? | autocuidado |
| 16 | Seu corpo pode estar retendo mais líquido do que deveria? | retenção |
| 17 | Descubra sinais de retenção e inchaço no seu corpo | retenção |
| 18 | Sua pele está mostrando sinais de desgaste precoce? | rejuvenescimento |

### Wellness (médicos, psicólogos, terapeutas, coaches)

| # | Título | theme_raw |
|---|--------|-----------|
| 19 | Seu nível de estresse pode estar acima do ideal? | estresse |
| 20 | Descubra se sua rotina está gerando sobrecarga mental | estresse |
| 21 | Seu nível de energia está equilibrado? | energia |
| 22 | Por que você pode estar se sentindo mais cansado ultimamente? | energia |
| 23 | Seu sono está realmente restaurando sua energia? | sono |
| 24 | Descubra se sua qualidade de sono pode melhorar | sono |
| 25 | Sua rotina está ajudando ou prejudicando sua saúde? | rotina |

### Fitness (personal trainer, coach fitness)

| # | Título | theme_raw |
|---|--------|-----------|
| 26 | Seu treino está gerando os resultados que deveria? | treino |
| 27 | Descubra se sua rotina de treino está equilibrada | treino |
| 28 | O que pode estar bloqueando sua consistência no treino? | consistência |
| 29 | Seu corpo está preparado para sua rotina de atividade física? | energia |
| 30 | Seu condicionamento físico está evoluindo como deveria? | condicionamento |

### 6 links principais para lançamento

Para MVP, priorizar:

1. **intestino** — Seu intestino está funcionando como deveria?
2. **metabolismo** — Seu metabolismo pode estar mais lento do que deveria?
3. **energia** — Por que sua energia pode estar baixa durante o dia?
4. **pele** — Sua pele está recebendo os cuidados certos?
5. **estresse** — Seu nível de estresse pode estar acima do ideal?
6. **treino** — Seu treino está gerando os resultados que deveria?

---

## 17. Próximos passos e ordem de execução

### Ordem de execução (implementação)

| Fase | Tarefa | Onde |
|------|--------|------|
| 1 | Persistir `segment_code` no meta do link | `api/ylada/links/generate/route.ts` |
| 2 | Criar `getDiagnosisSegmentFromProfile(profession, segment, themeRaw?)` | `lib/ylada/` ou config |
| 3 | Passar `segment_code` para o motor na rota de diagnóstico | `api/ylada/links/[slug]/diagnosis/route.ts` |
| 4 | Criar `BLOCKER_VARIANTS_AESTHETICS` | `lib/ylada/diagnosis-templates.ts` |
| 5 | Criar `BLOCKER_VARIANTS_NUTRITION` | `lib/ylada/diagnosis-templates.ts` |
| 6 | Incluir aesthetics e nutrition em `getBlockerVariants()` | `lib/ylada/diagnosis-templates.ts` |
| 7 | Criar `BLOCKER_VARIANTS_FITNESS` (opcional, após 4–6) | `lib/ylada/diagnosis-templates.ts` |
| 8 | Popular catálogo de links (templates ou fluxos) com os 6 principais | Banco / config |

### Prioridade por segmento

1. **nutrition** — Herbalife, nutricionistas
2. **aesthetics** — clínicas, esteticistas
3. **wellness** — médicos, psicólogos, coaches (já tem fallback genérico)
4. **fitness** — personal trainers
5. **dentistry** — ✅ já implementado

---

*Documento criado em: 2026-02-28. Atualizar conforme a implantação avançar.*
