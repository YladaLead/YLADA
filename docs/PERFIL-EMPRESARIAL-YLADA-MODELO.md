# Perfil empresarial YLADA — modelo completo (todas as áreas)

Documento de planejamento do modelo de perfil que serve **todas as áreas** (med, psi, psicanalise, odonto, nutra, coach, **seller**). Usado pelo Noel para diagnóstico, plano de ação e personalização. Definir aqui **antes** de implementar a migration e a API (etapa 2.1).

---

## 1. Decisões de modelo

| Decisão | Escolha |
|--------|--------|
| **Uma tabela** | `ylada_noel_profile`: um registro por `(user_id, segment)` — usuário pode ter um perfil por área. |
| **Campos comuns** | Colunas fixas: metas, objetivos, **dor/fase/prioridade**, **modelo de atuação**, **canais/rotina**, etc. |
| **Campos por área** | JSONB `area_specific` para especialidade, abordagem, oferta (seller), etc. |
| **Segment** | med, psi, psicanalise, odonto, nutra, coach, **seller** (vendedor). Opcional: `service` (genérico). |

---

## 2. Campos comuns (todas as áreas)

Inclui o **kit diagnóstico** para o Noel: dor atual, fase, prioridade, modelo de atuação, canais e rotina.

### 2.1 Identificação e contexto

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `user_id` | UUID | sim | FK para auth.users. |
| `segment` | TEXT | sim | med, psi, psicanalise, odonto, nutra, coach, **seller** (e opcionalmente service). |
| `tempo_atuacao_anos` | INTEGER | não | Anos de atuação na área. |

### 2.2 Motor do Noel (diagnóstico e prioridade)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `dor_principal` | TEXT | não | O que está travando **agora**. Valores sugeridos: `agenda_vazia`, `agenda_instavel`, `sem_indicacao`, `nao_converte`, `nao_postar`, `followup_fraco`, `outra`. |
| `prioridade_atual` | TEXT | não | Texto livre: "o que você quer destravar primeiro". |
| `fase_negocio` | TEXT | não | `iniciante` \| `em_crescimento` \| `estabilizado` \| `escalando`. |

### 2.3 Metas e objetivos

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `metas_principais` | TEXT | não | Principais metas (ex.: "aumentar consultas", "montar consultório", "trilha empresarial"). |
| `objetivos_curto_prazo` | TEXT | não | Objetivos curto/médio prazo (ex.: "X pacientes/mês em 6 meses"). |

### 2.4 Modelo de atuação e capacidade

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `modelo_atuacao` | JSONB | não | Formas de trabalhar: ex. `["consultorio", "online", "domicilio", "delivery", "clinica"]`. |
| `capacidade_semana` | INTEGER | não | Quantos atendimentos/fechamentos por semana cabem na operação. |
| `ticket_medio` | NUMERIC | não | Opcional; ajuda o Noel a orientar metas e rotina. |
| `modelo_pagamento` | TEXT | não | Universal: `particular` \| `convenio` \| `plano` \| `recorrencia` \| `avulso` \| `comissao` \| `outro`. (Coach/seller usam avulso, comissão, etc.; não depender de "convênio".) |

### 2.5 Canais e rotina (para links e conteúdo certeiros)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `canais_principais` | JSONB | não | Ex.: `["instagram", "whatsapp", "indicacao", "trafego_pago"]`. |
| `rotina_atual_resumo` | TEXT | não | Resumo em poucas linhas da rotina atual (o Noel usa para sugerir próximo passo). |
| `frequencia_postagem` | TEXT | não | Ex.: "0/semana", "3x/semana", "diário". |

### 2.6 Observações e auditoria

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `observacoes` | TEXT | não | Observações livres para o Noel. **Máx. 1500 caracteres** (ou sem limite, conforme implementação). |
| `created_at` | TIMESTAMPTZ | sim | Criação. |
| `updated_at` | TIMESTAMPTZ | sim | Última atualização. |

**Constraint:** `UNIQUE(user_id, segment)` — um perfil por usuário por área.

---

## 3. Campos por área (area_specific JSONB)

Conteúdo que varia por segmento. Guardado em `area_specific` (JSONB). Front e API montam o bloco certo por área.

### 3.1 Med (Medicina)

```json
{
  "especialidades": ["clinica_geral", "psiquiatria", "ortopedia", "pediatria", "outra"],
  "especialidade_outra": "texto se outra"
}
```

### 3.2 Psi (Psicologia)

```json
{
  "abordagens": ["tcc", "psicanalise", "humanista", "sistemica", "outra"],
  "abordagem_outra": "texto",
  "faixa_etaria": ["infantil", "adolescente", "adulto", "idoso"]
}
```

### 3.3 Psicanalise

```json
{
  "formacao_principal": "texto",
  "faixa_etaria": ["infantil", "adolescente", "adulto", "idoso"]
}
```

### 3.4 Odonto (Odontologia)

```json
{
  "especialidades": ["clinica_geral", "ortodontia", "implantodontia", "pediatria", "estetica", "outra"],
  "especialidade_outra": "texto"
}
```

### 3.5 Nutra

```json
{
  "tipo_atuacao": "consultoria|produtos|ambos",
  "nivel_empresarial": "iniciante|em_crescimento|estabilizado|escalando"
}
```

### 3.6 Coach

```json
{
  "nichos": ["carreira", "vida", "negocios", "saude", "outra"],
  "nicho_outra": "texto"
}
```

### 3.7 Seller (vendedor)

Inclui vendedores de serviço e/ou produto; modelo de operação e canais no perfil comum, detalhes no `area_specific`:

```json
{
  "oferta": "servico|produto|ambos",
  "categoria": "texto (ex: nutraceutico, estetica, limpeza)",
  "canal_principal_vendas": "whatsapp|instagram|presencial|marketplace"
}
```

*(Campos comuns como `canais_principais`, `modelo_atuacao`, `capacidade_semana` e `ticket_medio` já cobrem operação; aqui só o que é específico de “vendedor”.)*

---

## 4. Resumo para o Noel (exemplo de injeção no prompt)

O resumo injetado no system prompt deve seguir o espírito abaixo, para o Noel **diagnosticar rápido**, **definir próximo passo** e **recomendar link/rotina coerente**:

**Exemplo:**

```
Segment: odonto. Fase: em_crescimento. Dor principal: agenda_instavel.
Modelo: clínica + Instagram + WhatsApp. Capacidade: 25/semana. Ticket médio: R$ 180.
Meta: 40 consultas/mês. Prioridade atual: preencher agenda nos próximos 30 dias.
Rotina atual: (texto do usuário). Frequência postagem: 2x/semana.
[Bloco area_specific:] Especialidades: clínica geral, estética.
```

Assim a resposta do Noel deixa de ser genérica.

---

## 5. Tabela (resumo para a migration)

- **Nome:** `ylada_noel_profile`
- **Colunas:**  
  `id` (PK), `user_id` (NOT NULL), `segment` (NOT NULL),  
  `tempo_atuacao_anos`,  
  `dor_principal`, `prioridade_atual`, `fase_negocio`,  
  `metas_principais`, `objetivos_curto_prazo`,  
  `modelo_atuacao` (JSONB), `capacidade_semana` (INTEGER), `ticket_medio` (NUMERIC), `modelo_pagamento` (TEXT),  
  `canais_principais` (JSONB), `rotina_atual_resumo` (TEXT), `frequencia_postagem` (TEXT),  
  `observacoes` (TEXT, até 1500 ou sem limite),  
  `area_specific` (JSONB),  
  `created_at`, `updated_at`.
- **UNIQUE(user_id, segment)**
- **CHECK(segment)** em lista permitida (med, psi, psicanalise, odonto, nutra, coach, seller).
- **RLS:** usuário só acessa o próprio `user_id`; políticas SELECT/INSERT/UPDATE.
- **Trigger:** `updated_at` na atualização.

---

## 6. Uso no produto

- **Onboarding:** primeira entrada no board da área (ou "Perfil empresarial"): formulário com blocos comuns + bloco dinâmico por `segment` (med → especialidades; psi → abordagens; seller → oferta/categoria/canal).
- **Perfil empresarial:** página `/pt/[area]/perfil-empresarial` com os mesmos blocos (edição).
- **Noel:** antes de chamar o modelo, buscar perfil por `user_id` e `segment`, montar resumo (como no §4) e injetar no system prompt junto com o snapshot da trilha.

---

## 7. Segmentos e config (ylada-areas)

- **Incluir `seller`** em `YladaSegmentCode` e em `YLADA_AREAS` quando a rota `/pt/seller` for criada (menu, layout protegido).
- Opcional: `service` para profissional liberal genérico; pode ser adicionado depois sem quebrar o modelo.

---

## 8. Próximos passos (após validar este doc)

1. **2.1** — Migration criando `ylada_noel_profile` com todos os campos acima (ver `migrations/204-ylada-noel-profile.sql`).
2. **2.2** — Onboarding + tela Perfil empresarial (formulário comum + por área).
3. **2.3** — API GET/PUT perfil (por user_id e segment).
4. **2.4** — Integração Noel (buscar perfil + montar resumo no system prompt).

Se quiser ajustar campos ou blocos por área, altere este documento antes de rodar a migration.
