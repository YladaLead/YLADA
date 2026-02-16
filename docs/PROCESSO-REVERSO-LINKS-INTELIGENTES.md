# Processo reverso: das dores ao diagnóstico (Links Inteligentes)

**Objetivo:** Na área de Links Inteligentes, permitir que o profissional **descreva as dores em texto livre**; a IA, embasada nos **interpreters** (perfil, trilha, catálogo de ferramentas), **interpreta**, sugere quiz/calculadora e entrega um **diagnóstico** para o profissional **apenas validar/responder**.

---

## 1. Ideia em uma frase

**Hoje:** Profissional preenche formulário estruturado (perfil) → Noel usa para orientar e sugerir links.  
**Reverso:** Profissional **fala** das dores → IA **interpreta** → preenche perfil, sugere ferramenta e **entrega o diagnóstico** → profissional só **confirma ou ajusta**.

---

## 2. O que são os “interpreters”

São as fontes de contexto que a IA usa para interpretar o texto livre e gerar ações estruturadas:

| Interpreter | O que é | Uso no processo reverso |
|-------------|---------|---------------------------|
| **Perfil empresarial** | `ylada_noel_profile`: dor_principal, fase_negocio, prioridade_atual, metas, canais, etc. | Mapear texto livre → valores do perfil (ex.: "agenda vazia", "iniciante"). |
| **Trilha / snapshot** | `user_strategy_snapshot`: resumo estratégico, etapa atual, próximo passo. | Alinhar diagnóstico à necessidade atual da trilha (ex.: "agenda vazia" → playbook Indicação). |
| **Catálogo de ferramentas** | Quizzes, calculadoras, fluxos por segmento (med, psi, odonto, etc.). | Escolher qual quiz/calculadora/ferramenta melhor atende à dor descrita. |
| **Diagnósticos por ferramenta** | Estrutura de resultados por quiz/calculadora (ex.: `getDiagnostico`, diagnósticos Nutri/Wellness). | Montar o “diagnóstico sugerido” que o profissional só valida. |

Ou seja: a IA **interpreta** o que o profissional escreveu usando perfil + trilha + catálogo + lógica de diagnóstico, e devolve perfil preenchido + ferramenta recomendada + diagnóstico para ele **apenas responder** (confirmar/editar).

---

## 3. Fluxo do processo reverso (visão geral)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. PROFISSIONAL ESCREVE (texto livre)                                    │
│    "Minha agenda está vazia, não tenho indicação e não sei por onde      │
│     começar a divulgar. Estou começando agora."                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 2. IA INTERPRETA (com base nos interpreters)                             │
│    • Perfil: dor_principal ≈ agenda_vazia, sem_indicacao;                │
│              fase_negocio ≈ iniciante; prioridade ≈ divulgação           │
│    • Trilha: necessidade "agenda vazia" / "não uso links" → playbook X   │
│    • Catálogo: qual quiz/calculadora/ferramenta combina (ex.: quiz        │
│      de perfil, calculadora de valor, link de avaliação)                 │
│    • Diagnóstico: monta resultado típico dessa ferramenta para o perfil  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 3. ENTREGA PARA O PROFISSIONAL “APENAS RESPONDER”                         │
│    • Perfil sugerido (campos preenchidos) → "É isso? Ajuste se quiser"   │
│    • Ferramenta sugerida (quiz/calculadora) → link + script               │
│    • Diagnóstico sugerido (texto/resultado) → "Confirma ou edita"         │
└─────────────────────────────────────────────────────────────────────────┘
```

O profissional não precisa preencher tudo do zero: ele **valida** o que a IA inferiu e só responde/ajusta.

---

## 4. Onde encaixar na área de Links Inteligentes

- **Página:** `/pt/med/fluxos` (e equivalentes por área: psi, odonto, nutra, coach).
- **Opções de UX:**
  - **A)** Um bloco “Descreva suas dores” (textarea ou chat) na própria página de Links Inteligentes; ao enviar, a IA devolve perfil + ferramenta + diagnóstico para confirmar.
  - **B)** Integrado ao Noel na Home: o profissional fala no chat; o Noel, ao detectar “dores” ou “me ajuda a montar meu perfil/links”, dispara o mesmo fluxo (interpretação → perfil + link + diagnóstico) e pode redirecionar para “Seus links” com o resultado.
  - **C)** Ambas: atalho no Noel + experiência dedicada em Links Inteligentes.

Recomendação inicial: **A** na página de Links Inteligentes (fluxos) como MVP, depois **B** no Noel para quem preferir falar no chat.

---

## 5. Peças técnicas necessárias

### 5.1 API de interpretação (nova)

- **Rota sugerida:** `POST /api/ylada/interpret-dores` (ou `/api/ylada/links/from-dores`).
- **Input:** `{ segment, text }` (segmento da área + texto livre das dores).
- **Processo:**
  1. Chamar modelo (ex.: gpt-4o-mini) com prompt que:
     - Recebe o texto e as **opções válidas** dos interpreters (lista de `dor_principal`, `fase_negocio`, necessidades da trilha, slugs de ferramentas do catálogo).
     - Devolve JSON estruturado: `{ profileSuggest, recommendedToolSlug, diagnosticSummary }`.
  2. Opcional: buscar catálogo de ferramentas por `segment` (med, psi, etc.) para restringir slugs no prompt.
  3. Se existir diagnóstico por ferramenta (ex.: `getDiagnostico` por slug), usar o `recommendedToolSlug` para montar um `diagnosticSummary` padrão ou template.
- **Output:**  
  `{ profileSuggest, recommendedToolSlug, recommendedToolName, diagnosticSummary, scriptSugerido }`  
  para o front preencher perfil (sugestão), mostrar link da ferramenta e o diagnóstico para “apenas responder”.

### 5.2 Catálogo de ferramentas por segmento

- Hoje o Wellness/Nutri têm `getFerramentaInfo`, `getQuizInfo`, `recomendarLinkWellness`; a área Med (YLADA) ainda não expõe esse tipo de função para o Noel.
- Para o processo reverso em Med (e outras áreas):
  - Ter uma **lista de slugs** (ou tabela) de quizzes/calculadoras/ferramentas disponíveis por `segment` (med, psi, odonto, nutra, coach).
  - A API de interpretação usar essa lista no prompt para a IA escolher `recommendedToolSlug` e, se houver, montar o diagnóstico.

### 5.3 Preenchimento do perfil a partir da sugestão

- O front já tem `PerfilEmpresarialView` e `PUT /api/ylada/profile`.
- Após a interpretação, o front pode:
  - Mostrar o perfil sugerido em modo “edição” (campos preenchidos) e um botão “Usar e salvar” (ou “Ajustar e salvar”).
  - Chamar `PUT /api/ylada/profile` com o payload derivado de `profileSuggest` quando o profissional confirmar.

### 5.4 Diagnóstico “para apenas responder”

- **Significado:** Em vez do profissional fazer o quiz/calculadora sozinho, a IA já entrega um **diagnóstico sugerido** (texto ou estrutura) baseado na ferramenta recomendada e no que foi dito.
- O profissional **responde** no sentido de: “Está certo” / “Ajusto isso” / “Quero usar esse diagnóstico como meu resultado padrão para esse link”.
- Implementação possível:
  - Se a ferramenta tiver resultados/diagnósticos definidos (ex.: faixas de IMC, perfis de quiz), a IA escolhe o mais coerente com o texto e devolve em `diagnosticSummary`.
  - Na UI: um bloco “Diagnóstico sugerido” com opção “Usar este” / “Editar” / “Gerar link com este diagnóstico”.

---

## 6. Resumo: dá para fazer?

Sim. O processo reverso é viável:

1. **Interpretação:** IA com prompt estruturado + opções dos interpreters (perfil, trilha, catálogo) → JSON com perfil sugerido, ferramenta e diagnóstico.
2. **Quiz/calculadora:** A IA indica qual ferramenta usar (slug); o sistema gera o link (quando existir API de links por área/segmento) e o script.
3. **Diagnóstico:** A IA monta um diagnóstico coerente com a ferramenta e com o texto; o profissional só valida ou edita.

Próximos passos sugeridos:

- Definir **lista de ferramentas por segmento** (med primeiro) para o catálogo.
- Implementar **POST /api/ylada/interpret-dores** (ou nome equivalente) com prompt e schema de resposta.
- Na página **Links Inteligentes** (`/pt/med/fluxos`), adicionar o bloco “Descreva suas dores” e a exibição do resultado (perfil + link + diagnóstico para validar).
- Opcional: no **Noel**, detectar intenção “quero preencher por dores” e chamar o mesmo fluxo ou redirecionar para Links Inteligentes com o resultado.

---

## 7. Referências no repo

- Perfil: `docs/PERFIL-EMPRESARIAL-YLADA-MODELO.md`, `src/lib/ylada-profile-resumo.ts`, `src/types/ylada-profile.ts`
- Trilha/snapshot: `docs/PASSO-A-PASSO-TRILHA-E-PERFIL.md`, `user_strategy_snapshot`
- Noel: `src/app/api/ylada/noel/route.ts`, `docs/NOEL-YLADA-PERFIL-E-INTEGRACAO.md`
- Links/ferramentas Wellness: `src/app/api/noel/getFerramentaInfo`, `getQuizInfo`, `recomendarLinkWellness`

---

## 8. Alinhamento com esta base (matriz YLADA)

Nesta base, o processo reverso está implementado assim:

| Peça | Implementação |
|------|----------------|
| **Página Links Inteligentes** | `/pt/links` — `src/app/pt/(matrix)/links/page.tsx` (não mais `/pt/med/fluxos`). |
| **API de interpretação** | **POST /api/ylada/interpret** — body `{ text, segment? }`. Devolve `profileSuggest`, `recommendedTemplateId`, `recommendedTemplateName`, **`diagnosticSummary`**, `confidence`. |
| **Catálogo** | Templates em `ylada_link_templates` (ids no seed 208); a IA escolhe entre eles. |
| **Diagnóstico “apenas validar”** | **`diagnosticSummary`** = resumo **oficial** do template (extraído do `schema_json` no banco): ex. “Quiz com 3 perguntas. Resultados possíveis: Grande potencial, Em construção, Primeiro passo. O visitante responde e recebe um resultado; depois pode clicar no WhatsApp.” O profissional vê esse texto na UI e, se estiver de acordo, clica em “Gerar link”. Não se gera diagnóstico novo; o conteúdo é sempre o do template. |
| **Fluxo na UI** | Campo “Para que você quer usar este link?” + sugestões (chips do banco) → Interpretar → bloco “Sugestão (processo reverso — apenas valide)” com perfil, template e **Diagnóstico (conteúdo oficial deste link)** → “Gerar link” abaixo. |

Próximas evoluções possíveis (sem quebrar o atual): enriquecer o interpret com perfil atual + snapshot da trilha (body opcional); no Noel, detectar intenção “montar por dores” e redirecionar para `/pt/links` com resultado.
