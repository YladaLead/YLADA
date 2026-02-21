# Etapa 1: Contagem clara de conversas por link

Objetivo: a nutricionista (e futuramente outros segmentos) ver **por link** e **no total** quantas conversas estão sendo geradas, com uma regra única e armazenamento preparado para multiárea.

---

## 1. Estado atual (fragmentação)

### Onde “conversa” ou “lead” é registrado hoje

| Origem | Tabela de destino | Referência ao link/ferramenta | Contador no link |
|--------|-------------------|-------------------------------|------------------|
| **generated_links** (form por slug) | `leads` | `link_id` = id do generated_links | `generated_links.leads_count` é incrementado em `/api/leads` |
| **Wellness / Nutri** (captura pós-resultado) | `leads` | `additional_data.tool_slug` + `user_slug`; `template_id` opcional | **user_templates.leads_count NÃO é atualizado** |
| **Quizzes** (resposta de quiz) | `quiz_respostas` + RPC | `quiz_id` (tabela `quizzes`) | `quizzes.leads_count` via RPC `increment_quiz_leads` |
| **Matriz YLADA** (`/l/[slug]`) | `ylada_link_events` | `link_id` = id do `ylada_links` | Apenas eventos: view, start, complete, cta_click (sem “lead”) |
| **Workshop Nutri** | `workshop_inscricoes` | — | Não vai para `leads` |
| **Quiz carreira Nutri** | `quiz_nutri_leads` | — | Tabela separada |
| **Formulários Nutri** | respostas de formulário (custom_forms) | form_id | Não vai para `leads` |

Consequências:

- **Nutri ferramentas** (`user_templates`): o número em `leads_count` **não é atualizado** quando o lead vem de `/api/wellness/leads` (usado para calculadoras etc.), então a contagem fica errada ou parada.
- **Regras diferentes**: “conversa” em um lugar é lead em `leads`, em outro é linha em `quiz_respostas` ou em `ylada_link_events` (cta_click).
- **Sem vínculo único**: em `leads` às vezes tem `link_id` (generated_links), às vezes só `additional_data.tool_slug` + `user_slug`, e não tem `tool_id` (user_templates) nem `area`.

Para a Nutri (e depois outros), o que importa é: **por cada “link” (ferramenta, quiz, formulário, etc.) quantas conversas foram iniciadas** e **no total do mês/semana**. Hoje isso não está unificado.

---

## 2. Regra única proposta: “conversa iniciada”

Definir em todo o produto:

- **“Conversa iniciada”** = uma pessoa se identificou (nome/email/telefone) a partir de um link/ferramenta e isso foi registrado de forma que dá para atribuir ao link e ao dono (user_id + area).

Na prática, isso se traduz em:

- **Uma linha em `leads`** com:
  - `user_id` = dono do link
  - Referência ao link (veja modelo abaixo)
  - `source` ou `area` para segmento (nutri, wellness, coach, etc.)

Eventos só de engajamento (view, cta_click) podem continuar em `ylada_link_events` para matriz; para **contagem de conversas** usamos só `leads` (e, se quisermos, no futuro um agregado que leia de um único lugar).

---

## 3. Modelo unificado (pensando em multiárea)

Objetivo: um único lugar para “conversas por link” e “conversas totais”, funcionando para Nutri, Wellness, Coach, médicos, etc.

### 3.1 Tabela `leads` como fonte da verdade

- Manter **uma tabela `leads`** para todos os segmentos.
- Garantir que **toda** captação que for “conversa iniciada” (nome/telefone/email a partir de um link) grave em `leads` com:
  - `user_id`
  - **Referência ao link** (ver 3.2)
  - **Área/segmento** (ex.: `area` ou `source` normalizado)

### 3.2 Referência ao link (escalável)

Hoje em `leads` existe:

- `link_id` → usado para `generated_links`.
- `template_id` → usado em alguns fluxos (Coach, etc.).
- `additional_data` → JSON com `tool_slug`, `user_slug`, etc.

Para ficar **claro e eficiente** para contagem por link e por área:

- **Opção A (recomendada):**  
  - Adicionar colunas em `leads`:
    - `link_source` (enum ou text): `generated_link` | `user_template` | `quiz` | `ylada_link` | `form` | etc.
    - `link_id` (uuid, nullable): id do “recurso” que gerou a conversa.
  - Convenção:
    - Para `user_templates` (Nutri/Wellness/Coach): `link_source = 'user_template'`, `link_id = user_templates.id`.
    - Para `quizzes`: `link_source = 'quiz'`, `link_id = quizzes.id`.
    - Para `ylada_links`: `link_source = 'ylada_link'`, `link_id = ylada_links.id`.
    - Para `generated_links`: manter `link_id` como hoje e usar `link_source = 'generated_link'`.
  - Assim: contagem por link = `WHERE user_id = ? AND link_source = ? AND link_id = ?`; contagem total = `WHERE user_id = ?` (e por período).

- **Opção B (mínima):**  
  - Não criar novas colunas e padronizar só em `additional_data`:
    - Ex.: `link_source`, `link_id` (ou `tool_id`, `quiz_id`) sempre preenchidos quando houver link.
  - Contagem por link: filtrar por `additional_data->>'link_source'` e `additional_data->>'link_id'` (ou equivalente). Menos eficiente e mais frágil que Opção A.

Recomendação: **Opção A** (colunas explícitas) para índices e clareza em todas as áreas.

### 3.3 Área/segmento

- Adicionar em `leads` algo como `area` (text) ou normalizar `source` para sempre incluir o segmento (ex.: `nutri_template`, `wellness_template`, `coach_form`).
- Valores sugeridos: `nutri`, `wellness`, `coach`, `ylada` (matriz), e no futuro `med`, `psi`, etc.
- Isso permite:
  - Contagem por usuário e área.
  - Filtros no painel por área (quando houver mais de uma).
  - Relatórios e metas por área (ex.: meta semanal Nutri).

---

## 4. O que fazer na Etapa 1 (resumo)

1. **Migration**
   - Adicionar em `leads` (se não existirem):
     - `link_source` (text, ex.: 'user_template', 'quiz', 'generated_link', 'ylada_link', 'form').
     - `link_id` (uuid, nullable) — hoje já pode existir para generated_links; padronizar como “id do recurso que gerou a conversa”.
     - `area` (text, nullable) — ex.: nutri, wellness, coach.
   - Criar índices para consultas por usuário + período e por link:
     - `(user_id, created_at)`
     - `(user_id, link_source, link_id)` (para contagem por link).

2. **Produção de leads (escrever sempre com link e área)**
   - **Wellness/leads** (usado também para Nutri): ao inserir em `leads`, resolver `user_slug` + `tool_slug` para obter `user_templates.id`; preencher `link_source = 'user_template'`, `link_id = user_templates.id`, `area = 'nutri'` ou `'wellness'`; e **atualizar `user_templates.leads_count`** (incremento atômico ou RPC) para a ferramenta correspondente.
   - **Quizzes**: além de `quiz_respostas` e `increment_quiz_leads`, criar (ou manter) lead em `leads` com `link_source = 'quiz'`, `link_id = quiz_id`, `area = nutri|wellness|coach`. Assim a contagem “conversas” vem só de `leads`.
   - **generated_links** (/api/leads): manter lógica atual e setar `link_source = 'generated_link'`, `area` conforme contexto (se houver).
   - **Formulários Nutri** (quando quiser contar como conversa): ao salvar resposta, inserir em `leads` com `link_source = 'form'`, `link_id = form_id`, `area = 'nutri'`.

3. **Contagem (leitura)**
   - **Por link (ferramenta/quiz/form):**  
     `SELECT count(*) FROM leads WHERE user_id = ? AND link_source = ? AND link_id = ? [AND created_at entre período].`
   - **Total do mês/semana (painel, home):**  
     Já feito em `/api/nutri/painel/stats` (leads por período); garantir que usa apenas `leads` (e que todos os fluxos Nutri escrevem em `leads` com `area = 'nutri'`).
   - **Por ferramenta na listagem:**  
     Para cada `user_templates` (e quizzes) do usuário, buscar contagem em `leads` por `link_source` + `link_id` (ou usar `user_templates.leads_count` depois de passarmos a atualizá-lo sempre).

4. **Exibição**
   - Painel de links (Captar): mostrar por ferramenta/quiz “Conversas (X)” usando a contagem unificada (ou `leads_count` já sincronizado).
   - Home Nutri (bloco Sistema de Conversas Ativas): “Conversas este mês” = contagem em `leads` para `user_id` + `area = 'nutri'` no mês.
   - Painel diário: idem, com período desejado (dia/semana/mês).

5. **ylada_links (matriz)**
   - Para não misturar com “link que gera conversa” da Nutri/Wellness: ou (a) quando houver captação por ylada_link, gravar em `leads` com `link_source = 'ylada_link'` e `link_id`, ou (b) deixar só eventos em `ylada_link_events` e tratar “conversa” da matriz só quando houver um fluxo de captação que escreva em `leads`. O importante é que, em cada área (Nutri, Wellness, etc.), a regra seja: **conversa = lead em `leads` com referência ao link e área**.

---

## 5. Ordem sugerida de implementação

1. Migration: colunas `link_source`, `link_id` (padronizar), `area` e índices em `leads`.
2. Ajustar `/api/wellness/leads`: preencher `link_source`, `link_id` (user_templates.id), `area` e incrementar `user_templates.leads_count`.
3. API ou função de contagem: “conversas por link” e “conversas no período” a partir de `leads` (por user_id, área, período, opcionalmente link_source + link_id).
4. Painel Nutri (Captar): consumir essa contagem por ferramenta/quiz.
5. (Opcional) Quizzes: passar a criar lead em `leads` com link_source = 'quiz' e link_id = quiz_id, além do fluxo atual de quiz_respostas.

Com isso, a contagem fica **única**, **clara** e **preparada para outras áreas** (médicos, psicólogos, etc.): basta que novos fluxos escrevam em `leads` com `area` e `link_source`/`link_id` adequados.
