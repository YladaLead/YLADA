# Roadmap de implantação (sem programação)

Este roadmap descreve **em que ordem** montar o sistema — da documentação até um possível produto interno. Ajuste prazos ao tamanho do time.

---

## Fase 0 — Fundação (concluída com esta pasta)

**Entregáveis:**

- [x] **Brief mestre central** (`00-brief-mestre-ylada.md`) — ICP, promessa, proibições, design/tom, free, modos por segmento.
- [x] Princípios e escopo (`01`).
- [x] Catálogo de agentes (`02`).
- [x] Fases e Diretor (`03`).
- [x] Checklist primeiros usuários (`04`).
- [x] Free/pago e financeiro (`05`).
- [x] Criativos, message match, segmentos (`06`).
- [x] Métricas (`07`).

**Ação humana:** validar com liderança se os nomes dos agentes e as fases refletem o modelo real do YLADA.

---

## Fase 1 — Verdade operacional (documentos vivos)

**Objetivo:** evitar respostas genéricas dos futuros agentes.

O **brief mestre** está em [`00-brief-mestre-ylada.md`](./00-brief-mestre-ylada.md). **Manter atualizado** quando mudar:

- ICP e ordem dos nichos.
- Política **numérica** de free e upgrade (preencher valores em planilha interna e refletir mudanças de regra no `00`).
- Tokens oficiais de cor/fonte (há placeholders no `00` até o time colar HEX/fontes finais).
- Novos segmentos ou áreas do produto (novos modos na seção 6 do `00`).

**Critério de saída:** qualquer pessoa consegue redigir um anúncio alinhado sem inventar regras novas.

---

## Fase 2 — Runbooks e prompts (ainda sem produto)

**Objetivo:** cada agente ter **instruções coláveis** (prompt + checklist de entrada/saída).

Para cada papel do catálogo (`02`):

1. Definir **entrada mínima** (campos obrigatórios).
2. Definir **formato de saída** (títulos fixos, limites de tamanho).
3. Incluir **regras do Diretor** e **gate financeiro** por referência (não duplicar dezenas de páginas).
4. Opcional: transformar em **Cursor Rules** ou **Skills** quando for o caso — fora do escopo deste roadmap se o time ainda não quiser.

**Critério de saída:** rodar um ciclo completo “Analista → Estratégico → Criador + Experiência” em um chat, com dados reais de um teste piloto.

---

## Fase 3 — Validação no mundo real

**Objetivo:** dados para o Otimizador e Financeiro.

- Executar `04-checklist-primeiros-usuarios.md`.
- Preencher `07-metricas-e-control-center.md` na versão planilha mínima.
- Registrar **variantes** (anúncio A + landing A) com código simples (ex.: `camp_est_001`).

**Critério de saída:** pelo menos um ciclo de “hipótese → teste → número → próximo teste” documentado.

---

## Fase 4 — Orquestração leve (opcional, ainda pode ser manual)

**Objetivo:** padronizar sequência sem backend.

- Checklist de “quem chama quem” (já descrito em `02`).
- Template de **relatório semanal** que junta saídas dos agentes + números da planilha.
- Nomear **responsável humano** por aprovar mudanças de free, preço e claims fortes.

---

## Fase 5 — Produto interno (futuro — especificação apenas)

Quando for hora de programar:

- **YLADA LAB:** formulário (nicho, objetivo, links, orçamento) → fila de etapas (analisar, estrategizar, criar, otimizar) com armazenamento de artefatos.
- **Integração de métricas:** leitura automática do control center.
- **Gates:** Financeiro bloqueia ações caras; Diretor define ordem.
- **Auditoria:** log de quem aprovou mudanças sensíveis.

Este repositório de docs serve de **especificação de comportamento** para essa fase; detalhes técnicos ficam para um doc de engenharia separado quando existir patrocínio de desenvolvimento.

---

## Resumo em uma linha por fase

| Fase | Foco |
|------|------|
| 0 | Estrutura conceitual (esta pasta) |
| 1 | Brief mestre + modos de segmento |
| 2 | Prompts/runbooks por agente |
| 3 | Testes reais + métricas mínimas |
| 4 | Orquestração manual + relatório semanal |
| 5 | LAB + APIs (quando priorizado) |

---

## O que não fazer cedo demais

- Automatizar mudança de **preço e limites de free** sem painel de custo.
- Gerar **dezenas de criativos** sem message match e sem medição.
- Expandir **segmentos** antes de validar um modo bem aprendido.

Referência cruzada: `03-fases-crescimento-e-agente-diretor.md`.
