# Análise — Testes do Noel (teste interno 19/03/2026)

**Documento de referência:** `docs/NOEL-RESPOSTAS-TESTE-INTERNO.md`  
**Uso:** Base para definir comportamento esperado, links e tom. Ajustes no Noel.

---

## Resumo do que foi testado

| # | Pergunta | Resposta no doc | Observação |
|---|----------|-----------------|------------|
| — | (abertura) | Apresentação + “poucos diagnósticos ativos”, sugere criar novo | OK |
| 1 | Qual meu próximo passo? | Fase Atração/Diagnóstico → próximo é Conversa; usar diagnóstico para conversas | Sem link; poderia citar 1 link ativo |
| 2 | Qual o melhor diagnóstico para começar a conversar? | Genérico (dores, objetivos); pede mais info (nicho) | Intenção clara: deveria sugerir/entregar opções ou links |
| 3 | Como organizar minha semana para atrair mais leads? | Calendário Segunda–Domingo (longo) | Contrário a “resposta curta”; sem link proativo |
| 4 | Me dá o link do último diagnóstico que criei para eu compartilhar. | **Sem resposta no doc** | Crítico: pedido explícito de link; deveria entregar o link |

---

## Pontos positivos

- Tom de mentor, acolhedor.
- Faz sentido falar de “Atração e Diagnóstico” e “Conversa” como próximos passos.
- Na 2, a ideia de conectar diagnóstico a dores/objetivos do público está alinhada ao produto.

---

## Ajustes recomendados

### 1. Pergunta 1 — “Qual meu próximo passo?”

- **Comportamento esperado:** Dar o próximo passo em 1–2 frases e, se houver links ativos, citar um link concreto para usar (ex.: “Use este diagnóstico para iniciar conversas: [nome](url)”).
- **Regra no prompt:** Quando falar de “próximo passo” ou “conversa” e existir `[LINKS ATIVOS DO PROFISSIONAL]`, incluir pelo menos um link real (o primeiro da lista = mais recente).

### 2. Pergunta 2 — “Qual o melhor diagnóstico para começar a conversar?”

- **Problema:** Resposta genérica + pedir “mais informação sobre nicho” atrasa a ação. O prompt já diz: “Quando o usuário pedir EXPLICITAMENTE link, script ou material → entregue direto (não pergunte antes). Clarificação é para quando a intenção NÃO está clara.”
- **Comportamento esperado:** Se há links ativos, listar 1–2 (com nome + URL) e dizer quando usar cada um. Se não há, aí sim pode pedir tema/nicho e sugerir criar um diagnóstico.
- **Regra no prompt:** “Melhor diagnóstico para conversar” = intenção de usar link; entregar links da lista (e/ou sugerir criação) em vez de só explicar conceitos.

### 3. Pergunta 3 — “Como organizar minha semana para atrair mais leads?”

- **Problema:** Resposta longa (calendário dia a dia). O prompt pede: “Responda curto”, “Dê plano de ação imediato”, template “Diagnóstico rápido → Ajuste → Próxima ação em 24h”.
- **Comportamento esperado:** 3–5 bullets objetivos (ex.: segunda = planejar + 1 conteúdo; terça = compartilhar 1 diagnóstico; …) + uma “próxima ação em 24h” +, se fizer sentido, 1 link para compartilhar.
- **Regra no prompt:** Para “organizar semana” ou “rotina”, priorizar formato curto + 1 ação imediata + oferta de 1 link quando relevante.

### 4. Pergunta 4 — “Me dá o link do último diagnóstico que criei para eu compartilhar.” (sem resposta no doc)

- **Problema:** No doc não há resposta registrada. No código, o Noel Ylada recebe `[LINKS ATIVOS DO PROFISSIONAL]` ordenados por `created_at` descendente (o primeiro é o mais recente).
- **Comportamento esperado:** Resposta direta: “Aqui está o link do seu último diagnóstico: [Nome do diagnóstico](URL). Pode compartilhar esse link com seus contatos.”
- **Regra no prompt (crítica):**  
  “Quando o profissional pedir 'link do último diagnóstico', 'link do último que criei', 'link para compartilhar' ou similar, use a lista [LINKS ATIVOS DO PROFISSIONAL]. O primeiro link da lista é o mais recente. Entregue esse link em destaque (nome + URL clicável) e uma frase curta de como usar (ex.: compartilhar no WhatsApp/stories). Nunca diga que não tem acesso — você tem os links nessa lista.”
- **Backend:** Confirmar que `formatLinksAtivosParaNoel` deixa explícito que a ordem é “mais recente primeiro” (ex.: “Lista ordenada do mais recente ao mais antigo. O primeiro é o último criado.”).

---

## Checklist de implementação

- [ ] **Prompt Ylada/Noel:** regra explícita para “link do último diagnóstico” / “link para compartilhar” → usar primeiro item de LINKS ATIVOS; resposta curta com link em destaque.
- [ ] **Prompt:** em “próximo passo” e “melhor diagnóstico para conversar”, quando houver links ativos, incluir pelo menos um link real (não só texto).
- [ ] **Prompt:** em “organizar semana” / “rotina”, manter resposta curta + 1 ação em 24h + oferta de link quando fizer sentido.
- [ ] **Prompt:** em “melhor diagnóstico para X”, tratar como pedido de link/opção: entregar links da lista ou sugerir criação; evitar só clarificação.
- [ ] **noel-ylada-links.ts:** no texto de `formatLinksAtivosParaNoel`, deixar claro que a ordem é “mais recente primeiro” e que “último diagnóstico” = primeiro da lista.
- [ ] **Teste manual:** refazer as 4 perguntas (incl. “me dá o link do último diagnóstico”) e registrar as novas respostas para comparar.

---

## Observação

O teste foi feito com a conta `teste-interno-11@teste.ylada.com`. Se essa conta tem poucos ou nenhum link ativo, a pergunta 4 pode ter falhado por falta de dados no contexto. Mesmo assim, o Noel deve: (a) se houver links, entregar o primeiro; (b) se não houver, dizer de forma clara que ainda não há diagnóstico criado e orientar a criar um (com CTA para “criar diagnóstico”/Links).

Quando quiser, podemos aplicar essas regras direto no prompt do Noel (Ylada) e no `formatLinksAtivosParaNoel`.