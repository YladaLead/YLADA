# Princípios e escopo

## Visão

Construir um **sistema interno** (não voltado ao cliente final como “chat de marketing”) que:

- Analisa funis, páginas e conteúdos com base em **inputs fornecidos** (links, textos, dados agregados).
- Propõe **estratégia** e **próximo passo** priorizado.
- Produz **pacotes executáveis** (copy, roteiros, briefs, prompts para ferramentas externas, variantes de landing em texto/especificação).
- Respeita **limites de caixa e custo marginal** antes de recomendar escala (especialmente mídia paga).

Isso pode existir, na evolução, como **fluxos no Cursor** (regras, skills, prompts) e/ou como **produto interno** (ex.: YLADA LAB). Este pacote define o **comportamento desejado** independentemente da ferramenta.

## Premissas

1. **Validação antes de escala:** sem conversas reais, leads ou sinais de valor, automatizar “conteúdo por 30 dias” ou grandes investimentos em tráfego **atrasam** ou **aumentam prejuízo**.
2. **Dados ou não há loop fechado:** “otimização contínua” exige eventos e números (ativação, lead, WhatsApp, conversão, custo). Sem instrumentação, o sistema opera como **consultoria assistida**, não como autopilot.
3. **Humano no circuito em pontos críticos:** mudança de preço, limite agressivo do free, copy sensível (saúde, menores, promessas fortes) e identidade visual **fora** do design system devem passar por **aprovação explícita**.
4. **Coerência anúncio → destino:** promessa, tom e CTA devem ser **espelhados** na página de chegada; isso é prioridade de conversão, não opcional.
5. **Segmentos em “modos”:** mesma estrutura de playbook (hipótese → mensagem → prova → CTA → canais), **parâmetros** diferentes por segmento (linguagem, compliance, criativo).

## O que não está no escopo desta documentação

- Código, endpoints, filas ou integrações concretas com modelos de IA.
- Substituição de **decisão estratégica humana** sobre posicionamento final da empresa.
- Garantia de meta numérica de usuários: agentes **melhoram** execução e consistência; o teto depende de produto, distribuição, orçamento e mercado.

## Onde cada camada “mora”

| Camada | Agora (sem produto) | Depois (produto interno) |
|--------|---------------------|---------------------------|
| Conhecimento (marca, ICP, regras) | Docs no repo, regras Cursor | Mesmo + painel admin |
| Execução de copy/brief | Chats com prompts padronizados | Formulário LAB → pipeline de agentes |
| Métricas | Planilha + exports | Control center no produto |
| Publicação de criativo | Ferramentas externas de ads/design | Integrações opcionais |

## Glossário rápido

- **Message match:** alinhamento entre criativo/anúncio e página de destino (mensagem, prova, CTA).
- **Unit economics:** relação entre custo de aquisição/ serviço por usuário e receita/valor gerado.
- **Gate:** condição que **bloqueia** ou **libera** a próxima ação (ex.: “não escalar mídia se CAC > X”).
