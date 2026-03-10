# Passo a passo: Implementação completa da Biblioteca Nutri no YLADA

> Objetivo: migrar todos os quizzes e calculadoras da área Nutri para a biblioteca YLADA, usando Nutri apenas como referência de conteúdo (textos e nomes). Nada aponta para Nutri.

---

## 1. Visão geral

| Etapa | Descrição | Status |
|-------|-----------|--------|
| 1 | Estrutura base (modelo, API, página) | ✅ Feito |
| 2 | Primeiro bloco: 8 quizzes (energia, intestino, metabolismo, etc.) | ✅ Feito |
| 3 | Segundo bloco: quizzes restantes | 🔲 Pendente |
| 4 | Terceiro bloco: calculadoras | 🔲 Pendente |
| 5 | Quarto bloco: avaliações e outros | 🔲 Pendente |

---

## 2. Inventário completo — Nutri

### 2.1. Quizzes (prioridade alta)

| # | Nome Nutri | Slug | Tema YLADA | Pilar | Onde está o conteúdo |
|---|------------|------|-----------|-------|----------------------|
| 1 | Quiz Energético | quiz-energetico | energia | energia | ✅ Migration 234 |
| 2 | Quiz Interativo | quiz-interativo | rotina_saudavel | habitos | `src/app/pt/wellness/templates/` |
| 3 | Quiz Alimentação Saudável | alimentacao-saudavel | alimentacao | habitos | `healthy-eating-quiz` |
| 4 | Risco de Síndrome Metabólica | sindrome-metabolica | metabolismo | metabolismo | `metabolic-syndrome-risk` |
| 5 | Seu corpo está pedindo Detox? | quiz-detox | vitalidade_geral | metabolismo | `src/lib/diagnostics/nutri/quiz-detox.ts` |
| 6 | Teste de Retenção de Líquidos | retencao-liquidos | inchaço_retencao | metabolismo | ✅ Migration 234 |
| 7 | Você conhece o seu corpo? | conhece-seu-corpo | vitalidade_geral | habitos | `body-awareness` |
| 8 | Disciplinado ou emocional com comida? | disciplinado-emocional | alimentacao | mente | `src/lib/diagnostics/nutri/disciplinado-emocional.ts` |
| 9 | Nutrido ou apenas alimentado? | nutrido-vs-alimentado | alimentacao | digestao | `nourished-vs-fed` |
| 10 | Descubra seu Perfil de Bem-Estar | descoberta-perfil-bem-estar | vitalidade_geral | energia | `wellness-profile` |
| 11 | Diagnóstico de Eletrólitos | eletrolitos | hidratacao | habitos | `electrolyte-diagnosis` |
| 12 | Diagnóstico de Parasitose | diagnostico-parasitose | intestino | digestao | `src/lib/diagnostics/nutri/diagnostico-parasitose.ts` |
| 13 | Diagnóstico de Sintomas Intestinais | sintomas-intestinais | intestino | digestao | ✅ Migration 234 |
| 14 | Pronto para Emagrecer? | pronto-emagrecer | peso_gordura | metabolismo | ✅ Migration 234 |
| 15 | Qual é o seu Tipo de Fome? | tipo-fome | alimentacao | habitos | `hunger-type` |
| 16 | Quiz de Bem-Estar | quiz-bem-estar | vitalidade_geral | energia | `src/lib/diagnostics/nutri/quiz-bem-estar.ts` |
| 17 | Quiz de Perfil Nutricional | quiz-perfil-nutricional | digestao | digestao | `src/lib/diagnostics/nutri/quiz-perfil-nutricional.ts` |
| 18 | Quiz Detox | quiz-detox | vitalidade_geral | metabolismo | `src/lib/diagnostics/nutri/quiz-detox.ts` |
| 19 | Avaliação de Intolerâncias | avaliacao-intolerancia | intestino | digestao | `intolerance-assessment` |
| 20 | Avaliação do Perfil Metabólico | perfil-metabolico | metabolismo | metabolismo | ✅ Migration 234 |
| 21 | Avaliação do Sono e Energia | avaliacao-sono-energia | sono | habitos | ✅ Migration 234 |
| 22 | Avaliação Inicial | avaliacao-inicial | vitalidade_geral | habitos | `initial-assessment` |
| 23 | Você está se alimentando conforme sua rotina? | alimentacao-rotina | rotina_saudavel | habitos | `eating-routine` |

### 2.2. Calculadoras (prioridade média)

| # | Nome Nutri | Slug | Tema YLADA | Pilar |
|---|------------|------|-----------|-------|
| 1 | Calculadora de Água | calculadora-agua | hidratacao | habitos |
| 2 | Calculadora de Calorias | calculadora-calorias | peso_gordura | metabolismo |
| 3 | Calculadora de IMC | calculadora-imc | peso_gordura | metabolismo |
| 4 | Calculadora de Proteína | calculadora-proteina | alimentacao | habitos |

### 2.3. Outros (prioridade baixa)

- Checklists, guias, desafios, planilhas — avaliar depois.

---

## 3. Passo a passo por bloco

### Bloco 1 — Já implementado (8 quizzes)

- energia, intestino, metabolismo, inchaço, peso, estresse, sono, vitalidade
- `migrations/234-ylada-templates-biblioteca-nutri-content.sql`
- `src/config/ylada-quiz-temas.ts`

### Bloco 2 — Quizzes restantes (15 itens)

**Para cada quiz:**

1. **Localizar o conteúdo** — Abrir a página de template em `src/app/pt/wellness/templates/` ou o arquivo de diagnóstico em `src/lib/diagnostics/nutri/`.
2. **Extrair perguntas** — Copiar o array `perguntas` com `pergunta`, `opcoes` (ou equivalente).
3. **Converter para schema YLADA** — Formato:
   ```json
   {"id": "q1", "text": "Pergunta?", "type": "single", "options": ["Op1", "Op2", "Op3", "Op4"]}
   ```
4. **Criar migration** — Nova migration (ex: `235-ylada-biblioteca-quiz-bloco2.sql`) com:
   - INSERT em `ylada_link_templates` (id, name, type, schema_json)
   - INSERT em `ylada_biblioteca_itens` (tipo, tema, pilar, titulo, description, template_id, flow_id, source_type: 'custom', source_id: null)
5. **Mapear tema → pilar** — Usar `src/config/ylada-pilares-temas.ts` (Top 12).

**Ordem sugerida para Bloco 2:**

1. quiz-interativo
2. quiz-alimentacao-saudavel
3. sindrome-metabolica
4. quiz-detox (já tem diagnóstico Nutri)
5. conhece-seu-corpo
6. disciplinado-emocional
7. nutrido-vs-alimentado
8. perfil-bem-estar
9. eletrolitos
10. diagnostico-parasitose
11. tipo-fome
12. quiz-bem-estar
13. quiz-perfil-nutricional
14. avaliacao-intolerancia
15. avaliacao-inicial
16. alimentacao-rotina

### Bloco 3 — Calculadoras (4 itens)

**Diferença:** calculadoras usam `type: 'calculator'` e schema com `fields`, `formula`, `resultLabel`.

1. **Localizar** — `src/app/pt/wellness/templates/hidratacao/`, `calorias/`, `imc/`, `proteina/`.
2. **Extrair** — Campos (label, type, min, max, default), fórmula, texto do resultado.
3. **Criar template** — `schema_json` no formato:
   ```json
   {
     "title": "...",
     "fields": [{"id": "f1", "label": "...", "type": "number", "min": 0, "max": 100, "default": 50}],
     "formula": "...",
     "resultLabel": "...",
     "ctaDefault": "..."
   }
   ```
4. **Biblioteca** — `tipo: 'calculadora'`, flow_id: `calculadora_projecao` ou similar (verificar se existe).

**Nota:** O fluxo de calculadora pode ser diferente (PROJECTION_CALCULATOR). Verificar `ylada-flow-catalog.ts` e `PublicLinkView` para suporte a calculator.

### Bloco 4 — Avaliações e outros

- Avaliação Inicial, Desafio 21 Dias, etc.
- Avaliar se entram como quiz ou link.

---

## 4. Checklist por item

Para cada item novo:

- [ ] Conteúdo extraído do Nutri (perguntas/opções ou campos)
- [ ] `ylada_link_templates` criado com schema_json
- [ ] `ylada_biblioteca_itens` criado com:
  - `tipo`: quiz | calculadora
  - `tema`: do Top 12
  - `pilar`: energia | metabolismo | digestao | mente | habitos
  - `titulo`, `description`
  - `template_id`: UUID do template criado
  - `flow_id`: diagnostico_risco (quiz) ou calculadora_projecao (calculadora)
  - `source_type`: 'custom'
  - `source_id`: null
  - `segment_codes`: array

---

## 5. Arquivos de referência

| Arquivo | Uso |
|---------|-----|
| `src/app/pt/wellness/templates/*/page.tsx` | Perguntas e estrutura dos quizzes |
| `src/lib/diagnostics/nutri/*.ts` | Diagnósticos (só referência; motor YLADA gera o diagnóstico) |
| `src/lib/template-slug-map-nutri.ts` | Mapeamento slug Nutri |
| `src/config/ylada-pilares-temas.ts` | Temas e pilares |
| `migrations/234-*.sql` | Modelo de template e biblioteca |
| `src/lib/diagnostics/nutri/` | Lista de 50 arquivos de diagnóstico |

---

## 6. Nomenclatura

- **Template:** `quiz_{tema}` ou `calc_{tema}` (ex: `quiz_tipo_fome`, `calc_imc`)
- **UUID:** `b10000XX-000X-4000-8000-00000000000X` (sequencial)
- **Tema:** usar valores do Top 12 (`energia`, `intestino`, `metabolismo`, etc.)

---

## 7. Resumo de prioridade

| Prioridade | Bloco | Itens | Esforço |
|------------|-------|-------|---------|
| 1 | Já feito | 8 | — |
| 2 | Quizzes restantes | ~16 | Médio |
| 3 | Calculadoras | 4 | Médio (schema diferente) |
| 4 | Outros | ~10 | Baixo |
