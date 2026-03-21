# Métricas e control center (especificação conceitual)

## Finalidade

Centralizar **números mínimos** para alimentar o **Agente Financeiro**, o **Otimizador** e o **Diretor**. Pode começar como **planilha** e evoluir para “YLADA Control Center” no produto.

## Princípio

Sem uma visão periódica (diária ou semanal) de custo + uso + conversão, as recomendações dos agentes permanecem **genéricas**.

---

## Painel sugerido (camadas)

### Camada 1 — Saúde do produto e custo

- Usuários novos (período).
- Usuários ativos (definir janela: DAU, WAU).
- Custo variável total estimado (API, infra proporcional, ferramentas).
- **Custo por usuário ativo** ou por “sessão significativa” (definir fórmula).

### Camada 2 — Funil

- Visitas / cliques em links principais.
- Início vs conclusão de fluxo crítico (ex.: diagnóstico, cadastro).
- Leads gerados (WhatsApp, formulário — conforme modelo).
- Tempo médio ou taxa de abandono por etapa (quando disponível).

### Camada 3 — Monetização

- Assinaturas / vendas / upgrades (conforme modelo).
- Ticket médio ou MRR (se aplicável).
- Cancelamentos ou churn simples.

### Camada 4 — Campanhas (quando houver mídia)

- Spend por canal.
- CPA ou CPL (definir “L” qualificado ou não).
- Message match: código da variante de landing × variante de anúncio.

---

## Cadência recomendada

| Frequência | Uso |
|------------|-----|
| Diária | Custo + alertas de anomalia (pico de uso ou custo) |
| Semanal | Diretor + Otimizador + revisão de hipóteses |
| Mensal | Política de free, preço, orçamento de canal |

---

## Responsabilidades

- **Dados:** time produto/engenharia ou ops define **de onde vêm** os números (BI, Supabase, ads, planilha manual no início).
- **Interpretação:** agentes assistem; **decisão final** em políticas sensíveis fica com liderança.
- **Privacidade:** agregações para copy estratégico; evitar expor dados pessoais em prompts.

---

## Próximo passo (sem código)

1. Listar **de onde** cada métrica virá hoje (mesmo que manual).
2. Definir **uma** planilha ou dashboard mínimo como “fonte oficial” da semana.
3. Ao implementar agentes, anexar **export ou resumo** dessa fonte no prompt do Financeiro e do Diretor.
