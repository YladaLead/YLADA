# Links inteligentes — próximos passos de implementação

Objetivo: interpretação apurada (qualquer segmento / “o que captar”) → match com catálogo → sugestão que entrega valor e estimula contato. Sistema aberto, raciocínio único.

**Princípio do fluxo:** Quiz e calculadora têm a **mesma função**: despertar interesse (em quem procura algo ou em curiosos que podem propagar o link), **entregar um diagnóstico** e fazer a pessoa que preencheu querer chamar o profissional de volta e valorizar a autoridade dele. O que importa é que o conteúdo (diagnóstico/resultado) seja **sobre um assunto referente ao tópico e à profissão** do usuário — a escolha entre quiz ou calculadora é pelo alinhamento do tema do template ao tópico/profissão.

---

## Modelo em 5 etapas (implementação progressiva)

| Etapa | Nome | Responsabilidade | Status |
|-------|------|------------------|--------|
| 1 | Interpretação Estrutural | Entender: objetivo, tema, tipo_publico, area_profissional, contexto_detectado. **Não** decide fluxo. | ✅ Implementado |
| 2 | Qualificação Estratégica | 1–2 perguntas (volume/qualidade, saúde/estética). Saída: prioridade, posicionamento. | Pendente |
| 3 | Decisão de Arquitetura | Escolher fluxo (ex.: diagnostico_risco_metabolico, quiz_por_que_nao_emagrece). Não gera conteúdo. | Pendente |
| 4 | Geração do fluxo | Buscar template + personalizar título, CTA, linguagem. Saída: JSON do fluxo. | Pendente |
| 5 | Amarração | Orquestração: persistir, slug, link pronto, página. Sem IA. | Parcial (generate link atual) |

**Contrato Etapa 1 (saída da API):** `interpretacao: { objetivo, tema, tipo_publico, area_profissional, contexto_detectado }`, mais `o_que_captar` (espelho de tema), `recommendedTemplateId`/`recommendedTemplateName` (fallback por regra até existir Etapa 3).

---

## 1. Interpretação: saída estruturada com “o que a pessoa quer captar”

**Onde:** `src/app/api/ylada/interpret/route.ts`

**O quê:**
- Estender o schema de resposta da IA para incluir explicitamente:
  - `o_que_captar` (string ou array de strings): tema/substância/serviço que o profissional quer usar para atrair (ex.: "B12", "vitamina C", "emagrecimento", "agenda", "consulta nutricional").
  - Manter `profileSuggest` (segment, category, sub_category) como contexto, não como lista fechada por área.
- Ajustar o system prompt para:
  - Pedir que a IA extraia “o que o profissional quer entregar ao visitante para que ele preencha e, no fim, queira contatar quem enviou”.
  - Deixar segment/category abertos (qualquer valor coerente), não restritos a uma lista fixa.
- Atualizar `InterpretResponse` e `parseInterpretResponse` para incluir `o_que_captar` (e persistir no front se for útil para o próximo passo).

**Entrega:** API `/api/ylada/interpret` retornando `o_que_captar` + profileSuggest + recommendedTemplateId (podendo vir do match dinâmico abaixo).

---

## 2. Catálogo: metadados para match

**Onde:** tabela `ylada_link_templates` (nova migration).

**O quê:**
- Adicionar colunas (ou um JSONB único) para match:
  - `themes` ou `themes_json` (JSONB): temas/assuntos que o template cobre (ex.: `["agenda", "atendimento", "potencial"]`, `["emagrecimento", "nutrição"]`). Servem para casar com `o_que_captar`.
  - `objectives` (JSONB, opcional): objetivos em que o template faz sentido (`["captar", "educar"]`).
  - `segment_hint` (JSONB ou TEXT[], opcional): segmentos em que o template é mais indicado; vazio = todos.
- Popular esses metadados nos 2 templates atuais (diagnostico_agenda, calculadora_perda) e documentar a convenção para templates novos.

**Entrega:** Migration aplicada + templates existentes com `themes`/objectives preenchidos.

---

## 3. Match interpretação → templates (dinâmico)

**Onde:** `src/app/api/ylada/interpret/route.ts` ou módulo auxiliar chamado por ele.

**O quê:**
- Antes (ou em vez de) a IA devolver um `recommendedTemplateId` fixo:
  - Buscar templates ativos no banco com os metadados (themes, objectives, segment).
  - Fazer match por: `o_que_captar` (texto da interpretação) vs `themes` dos templates. Pode ser:
    - Match por palavras-chave (temas contêm token de o_que_captar), ou
    - Busca semântica (embeddings de o_que_captar vs temas) em uma fase posterior.
  - Se houver um único template que case bem, usá-lo como `recommendedTemplateId`; se houver empate ou nenhum, a IA pode escolher entre os N melhores ou o fluxo atual (2 IDs fixos) como fallback.
- Remover (ou deixar só como fallback) a lista fixa de 2 template IDs no prompt; passar para a IA a lista dinâmica de templates (id, name, type, themes) para ela sugerir, ou fazer o match só no backend e a IA só devolver `o_que_captar` + profileSuggest.

**Entrega:** Recomendação de template vinda do banco + metadados, não mais hardcoded.

---

## 4. Resultados do quiz: convenção “valor + ponte para consulta”

**Onde:** schema dos templates (quiz/diagnóstico) em `schema_json.results`.

**O quê:**
- Garantir que cada resultado tenha:
  - `headline` e `description` (valor para o visitante).
  - Texto ou CTA que naturalmente leve ao contato (ex.: “Quer entender melhor? Fale comigo no WhatsApp”). Pode ser um campo opcional `ctaConsultation` ou convenção no `description`.
- Revisar os resultados dos 2 templates atuais para seguir essa convenção; documentar no seed ou em comentário na migration para novos templates.

**Entrega:** Convenção documentada + templates atuais alinhados.

---

## 5. Front: usar `o_que_captar` (opcional na primeira fase)

**Onde:** `src/app/pt/(matrix)/links/page.tsx`.

**O quê:**
- Se a API passar a retornar `o_que_captar`, exibir ou usar na sugestão (ex.: “Quiz para captar quem se interessa por [o_que_captar]”) para deixar claro que o sistema entendeu. Pode ser em uma segunda fase, após 1–3 estáveis.

**Entrega:** Opcional; pode ficar para depois do match dinâmico funcionar.

---

## Ordem sugerida

1. **Migration:** metadados em `ylada_link_templates` (themes, objectives) e preencher os 2 atuais.  
2. **Interpret:** incluir `o_que_captar` no prompt e no schema de resposta; manter recomendação atual (2 IDs) como está.  
3. **Match:** implementar busca de templates por `o_que_captar` + themes (e objetivos); passar a definir `recommendedTemplateId` no backend com base nessa busca (e, se quiser, reduzir a IA a só devolver o_que_captar + profileSuggest).  
4. **Convenção** de resultados com ponte para consulta nos schemas e documentação.  
5. **Front:** usar `o_que_captar` na copy quando fizer sentido.

Assim a interpretação fica mais apurada, o catálogo rastreável e o sistema aberto para novos segmentos e temas sem trancar por área.
