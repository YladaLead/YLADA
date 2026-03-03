# Plano de Implantação — Direção Estratégica (YLADA)

**Objetivo:** Transformar a experiência de Links em mentor estratégico: perfil → diagnóstico → 2 estratégias → 1 clique.

**Regra:** Executar etapa por etapa. Você confirma "OK" para avançar. Não alterar Wellness, Nutri, Coach.

---

## Controle de progresso

| # | Etapa | Status | Próxima ação |
|---|-------|--------|--------------|
| 1 | Strategy Engine | ✅ Concluída | — |
| 2 | Interpret profile-first | ✅ Concluída | — |
| 3 | API /strategy | ✅ Concluída | — |
| 4 | UI Links — Direção Estratégica | ✅ Concluída | — |
| 5 | Comportamento básico | ✅ Concluída | — |
| 6 | Integração e polish | ✅ Concluída | — |

---

## ETAPA 1 — Strategy Engine (módulo isolado)

**Objetivo:** Criar `src/lib/ylada/strategy-engine/` com lógica de diagnóstico do profissional e recomendação de estratégias.

**Arquivos a criar:**
- `src/lib/ylada/strategy-engine/types.ts` — tipos
- `src/lib/ylada/strategy-engine/profile-diagnosis.ts` — diagnóstico a partir do perfil
- `src/lib/ylada/strategy-engine/strategy-recommendation.ts` — 2 estratégias (activation + authority)
- `src/lib/ylada/strategy-engine/index.ts` — exports

**Contrato:**
```ts
// profile-diagnosis.ts
export function getProfessionalDiagnosis(profile: ProfileInput): ProfessionalDiagnosis

// strategy-recommendation.ts  
export function getStrategyRecommendation(
  profile: ProfileInput,
  behavior?: BehaviorInput
): StrategyRecommendation
```

**Saída esperada:**
- `professional_diagnosis`: bloqueio principal, foco da semana
- `strategies`: [activation, authority] com flow_id, title, reason, questions

**Não alterar:** `src/app/api/`, `src/app/pt/wellness/`, `src/app/pt/nutri/`

**Como validar:** Importar e chamar as funções; verificar retorno estruturado.

---

## ETAPA 2 — Interpret profile-first

**Objetivo:** Estender `POST /api/ylada/interpret` para aceitar `mode: "profile_first"` sem `text` obrigatório.

**Alterações:**
- Se `body.mode === "profile_first"`: buscar perfil, chamar strategy-engine, montar resposta
- Manter fluxo atual quando `text` for enviado (retrocompatível)

**Body novo:**
```json
{ "mode": "profile_first", "segment": "ylada" }
```

**Resposta:** Mesma estrutura atual + `professional_diagnosis`, `strategic_focus`

**Arquivos:** `src/app/api/ylada/interpret/route.ts`

**Não alterar:** Wellness, Nutri, generate, PublicLinkView

**Como validar:** POST com mode profile_first retorna diagnóstico + 2 estratégias.

---

## ETAPA 3 — API /strategy (opcional, pode fundir na Etapa 2)

**Objetivo:** Endpoint dedicado `POST /api/ylada/strategy` que retorna só Direção Estratégica + 2 estratégias.

**Body:** `{ segment?: "ylada" }`

**Resposta:**
```json
{
  "professional_diagnosis": "...",
  "strategic_focus": "...",
  "strategies": [
    { "type": "activation", "flow_id": "...", "title": "...", "reason": "...", "questions": [...] },
    { "type": "authority", "flow_id": "...", "title": "...", "reason": "...", "questions": [...] }
  ]
}
```

**Arquivos:** `src/app/api/ylada/strategy/route.ts` (novo)

**Como validar:** POST retorna JSON estruturado.

---

## ETAPA 4 — UI Links — Direção Estratégica

**Objetivo:** Reestruturar a página `/pt/links` para fluxo: Diagnóstico → 2 estratégias → 1 clique.

**Comportamento:**
1. Ao carregar: buscar perfil + chamar `/api/ylada/strategy` (ou interpret profile_first)
2. Exibir bloco "Direção Estratégica" com diagnóstico e foco
3. Exibir 2 cards (Estratégia 1 — Conversas Diretas, Estratégia 2 — Autoridade)
4. Botão "Criar essa ferramenta" em cada card
5. Ao clicar: chamar generate com flow_id + interpretacao → mostrar link

**Manter:** Lista de links existentes, edição, exclusão.

**Arquivos:** `src/app/pt/(matrix)/links/page.tsx`

**Não alterar:** YladaAreaShell, sidebar, rotas de wellness/nutri

**Como validar:** Entrar em /pt/links → ver Direção Estratégica → escolher estratégia → gerar link.

---

## ETAPA 5 — Comportamento básico

**Objetivo:** Incluir métricas de comportamento na recomendação.

**Dados a buscar:**
- `links_created_total` (count em ylada_links por user_id)
- `last_link_created_at`
- `submissions_last_7_days` (ylada_link_events complete ou ylada_diagnosis_metrics)

**Lógica simples:**
- 0 links → sugerir ativação simples
- Links de ativação + poucos submissions → manter ativação
- Links de ativação + bons submissions → sugerir autoridade

**Arquivos:** `src/lib/ylada/strategy-engine/behavior.ts`, `strategy-recommendation.ts`

**Como validar:** Criar links, ver se recomendação muda.

---

## ETAPA 6 — Integração e polish

**Objetivo:** Ajustes finais, fallback para perfil vazio, copy.

**Tarefas:**
- Se perfil vazio: mensagem "Complete seu perfil para receber recomendações" + link para perfil
- Garantir que generate receba questions e cta_suggestion da estratégia escolhida
- Revisar textos (Direção Estratégica, labels dos cards)
- Remover ou ocultar fluxo antigo (Tela 1 com texto livre) se desejado

**Como validar:** Fluxo completo com perfil completo e com perfil vazio.

---

## Ordem de execução

```
Etapa 1 → OK → Etapa 2 → OK → Etapa 4 → OK → Etapa 5 → OK → Etapa 6
```

(Etapa 3 pode ser pulada se Etapa 2 já entregar o contrato.)

---

## Regras de segurança

- **Nunca alterar:** `src/app/pt/wellness/`, `src/app/api/wellness/`, `src/app/pt/nutri/`, `src/app/api/nutri/`
- **Sempre testar** após cada etapa
- **Commit** após cada etapa concluída

---

## Etapa 1 concluída

Arquivos criados:
- `src/lib/ylada/strategy-engine/types.ts`
- `src/lib/ylada/strategy-engine/profile-diagnosis.ts`
- `src/lib/ylada/strategy-engine/strategy-recommendation.ts`
- `src/lib/ylada/strategy-engine/index.ts`

---

## Etapa 2 concluída

- `POST /api/ylada/interpret` aceita `{ "mode": "profile_first", "segment": "ylada" }`
- Sem `text` obrigatório nesse modo
- Busca perfil (ylada_noel_profile) + comportamento (links, submissions)
- Chama strategy-engine e retorna diagnóstico + 2 estratégias
- Resposta inclui `professional_diagnosis` e `strategic_focus`

---

## Etapa 3 concluída

- `POST /api/ylada/strategy` — endpoint dedicado
- Body: `{ segment?: "ylada" }`
- Retorna: `professional_diagnosis`, `strategic_focus`, `strategies`
- Lógica extraída para `profile-fetcher.ts` (compartilhado com interpret)

---

## Etapa 4 concluída

- `/pt/links` carrega Direção Estratégica ao abrir
- Bloco com diagnóstico + foco + 2 cards (Conversas Diretas, Autoridade)
- "Criar essa ferramenta" → generate em 1 clique
- "Quero algo diferente" → fluxo por texto (Tela 1–4)
- "Voltar para Direção Estratégica" no fluxo por texto

---

## Etapa 5 concluída

- `behavior.ts`: mapeamento flow_id → activation/authority
- `fetchBehavior` enriquece com `last_link_type` via config_json do último link
- Lógica: 0 links → checklist + diagnostico; activation + poucos submissions → manter ativação; bons submissions → sugerir autoridade (calculadora)

---

## Etapa 6 concluída

- `profile_incomplete` na resposta da API strategy
- Banner "Complete seu perfil para recomendações personalizadas" + link para /pt/perfil-empresarial
- generate já recebe questions e cta_suggestion da estratégia (handleCreateFromStrategy)
- Fluxo por texto mantido ("Quero algo diferente")

---

## Extensão: Tema primeiro, ferramenta depois

**Objetivo:** O profissional pensa em tema ("quero pacientes de emagrecimento"), não em ferramenta. Fluxo: tema → ferramenta.

**Implementado:**
- `src/config/ylada-temas.ts` — temas por profissão (medico, nutricionista, vendedor_suplementos, etc.)
- Perfil: campo opcional "Quais temas você atende?" em `area_specific.temas_atuacao` (última etapa do wizard, segment ylada)
- Links: primeira pergunta "Qual tema você quer trabalhar agora?" → opções do perfil ou padrão da profissão + "Outro tema"
- Depois: 2 cards de ferramenta (quiz/calculadora) para o tema escolhido
- Perfis simulados: `temas_atuacao` adicionado para testes

**Checklist de testes:**
1. [ ] Acessar `/pt/links` — primeira tela deve mostrar "Qual tema você quer trabalhar agora?"
2. [ ] Sem perfil: temas padrão da profissão "outro" (emagrecimento, alimentação, energia, bem-estar, outro)
3. [ ] Com perfil simulado (ex.: Médico): temas do perfil (emagrecimento, intestino, alimentação) ou padrão da profissão
4. [ ] Clicar em um tema → Direção Estratégica + 2 cards com tema no título
5. [ ] Clicar "Outro tema" → input livre → Avançar → 2 cards com tema digitado
6. [ ] "Criar essa ferramenta" → link gerado com tema correto
7. [ ] Perfil empresarial: última etapa (ylada) mostra "Quais temas você atende?" (opcional)
8. [ ] Marcar temas no perfil → salvar → em Links, temas do perfil aparecem primeiro

---

## Plano concluído

Todas as 6 etapas foram implementadas. Extensão "tema primeiro" implementada.
