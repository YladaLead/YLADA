# Motor de crescimento YLADA — documentação de estratégia

Esta pasta reúne a **estrutura de implantação** (o que existe conceptualmente, em que ordem aplicar e quais documentos usar) para o sistema de **agentes internos de growth**, **coerência criativo → página**, **free/pago com risco financeiro** e **primeiros usuários**.

**Escopo:** estratégia, papéis, fluxos, checklists e roadmap de implantação. **Não** inclui implementação de código ou APIs (fase posterior).

**Fonte da verdade para mensagem, oferta, compliance e modos de segmento:** [00-brief-mestre-ylada.md](./00-brief-mestre-ylada.md) — ler **antes** de rodar qualquer agente em produção de copy ou estratégia.

**No painel admin:** hub com links para todos estes arquivos (GitHub) em `/admin/motor-crescimento`; checklist em `/admin/minhas-acoes`.

## Ordem sugerida de leitura

| Ordem | Documento | Conteúdo |
|------|-----------|----------|
| 0 | [**00-brief-mestre-ylada.md**](./00-brief-mestre-ylada.md) | **ICP, promessa central, proibições, design/tom, free, modos por segmento** |
| 1 | [01-principios-e-escopo.md](./01-principios-e-escopo.md) | Visão, premissas, o que é/não é automático |
| 2 | [02-catalogo-de-agentes.md](./02-catalogo-de-agentes.md) | Papéis, entradas/saídas, encaixe entre si |
| 3 | [03-fases-crescimento-e-agente-diretor.md](./03-fases-crescimento-e-agente-diretor.md) | Validar → converter → escalar; regras de decisão |
| 4 | [04-checklist-primeiros-usuarios.md](./04-checklist-primeiros-usuarios.md) | Passo a passo manual até prova inicial |
| 5 | [05-unit-economics-free-pago.md](./05-unit-economics-free-pago.md) | Free, paywall, custo/usuário, quando escalar mídia |
| 6 | [06-criativos-message-match-segmentos.md](./06-criativos-message-match-segmentos.md) | Híbrido repo/ferramentas externas; landing alinhada ao anúncio; segmentos |
| 7 | [07-metricas-e-control-center.md](./07-metricas-e-control-center.md) | O que medir; insumos para o agente financeiro |
| 8 | [08-roadmap-implantacao.md](./08-roadmap-implantacao.md) | Fases de implantação: documentação → prompts → produto |
| 9 | [09-proximos-passos-e-prazos.md](./09-proximos-passos-e-prazos.md) | **Lista de próximos passos + faixas de prazo** para construir os agentes |
| 10 | [**10-passo-a-passo-suas-acoes.md**](./10-passo-a-passo-suas-acoes.md) | **O que você executa** — captação semanal, planilha, paralelos, uso dos agentes depois |

## Relação com o restante do repositório

- Planos já existentes (ex.: plano gratuito, LGPD, branding) **continuam válidos**; estes documentos **referenciam** decisões de negócio e produto sem duplicar implementação técnica.
- Quando houver **YLADA LAB** ou orquestração por API, este pacote serve de **especificação de comportamento** esperado dos agentes e dos gates (Diretor + Financeiro).

## Manutenção

Ao mudar ICP, preços, limites do free ou canais prioritários, atualizar primeiro os **documentos de verdade** já usados pelo time (ou criar um `BRIEF-GROWTH-YLADA.md` único) e refletir aqui os **princípios** que não mudam — evitar três versões conflitantes da mesma regra.
