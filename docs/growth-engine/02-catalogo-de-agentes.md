# Catálogo de agentes (papéis)

Cada “agente” é um **papel** com entrada/saída definidas. Pode ser implementado como prompt dedicado, skill, rota de API ou time humano seguindo o mesmo roteiro.

## 1. Agente Diretor (priorização)

**Função:** responder “qual é o **próximo melhor passo** para atingir o objetivo atual (ex.: primeiros usuários, primeiros leads pagantes)”.

**Entrada sugerida:**

- Fase declarada: validação | conversão | escala.
- Objetivo numérico ou qualitativo na semana.
- O que já foi testado (lista curta).
- Restrições: orçamento, tempo, nichos excluídos, compliance.

**Saída sugerida:**

- Uma ou duas ações **prioritárias** com critério de sucesso em 7–14 dias.
- O que **não** fazer agora (anti-padrões).
- Quais outros agentes acionar na sequência.

**Regra de ouro:** se não há leads ou conversas reais, o Diretor **não** deve priorizar escala ou volume de posts como ação principal.

---

## 2. Agente Analista (scanner)

**Função:** diagnosticar fricção e clareza em funil, copy e jornada.

**Entrada:** URL ou export de página; textos de anúncio/post; descrição do fluxo (ex.: anúncio → landing → quiz → WhatsApp).

**Saída:**

- Lista de problemas (CTA fraco, promessa ≠ página, público difuso, etc.).
- Hipóteses testáveis priorizadas.

---

## 3. Agente Estratégico (cérebro de funil)

**Função:** transformar diagnóstico em **posicionamento de campanha**, estrutura de funil (topo/meio/fundo) e mensagens-pilar **por segmento**.

**Entrada:** saída do Analista + brief de negócio (ICP, oferta, prova social disponível).

**Saída:**

- Mapa de funil por etapa e canal sugerido.
- Ângulos de mensagem alinhados ao produto real (incluindo uso de **dados agregados** de diagnósticos, quando existirem e forem permitidos).

---

## 4. Agente Criador (execução de conteúdo)

**Função:** gerar entregáveis em **texto** e **especificação** para produção externa.

**Saída típica:**

- Posts, roteiros, anúncios (variações), sequências de WhatsApp.
- **Prompts prontos** para geradores de imagem/vídeo externos.
- **Pacote message match:** variantes de headline, seções e CTA para landing coerente com cada criativo (ver documento 06).

**Limite consciente:** não obrigar o Criador a “renderizar” assets finais dentro do YLADA no MVP; o foco é **brief + copy + prompts**.

---

## 5. Agente Otimizador (growth / experimentação)

**Função:** propor próximos testes com base em **resultados** (taxa de clique, resposta, agendamento, etc.).

**Entrada:** métricas mínimas + hipótese anterior + o que mudou.

**Saída:**

- Próximo experimento (uma variável principal).
- Critério de parada e duração sugerida.

---

## 6. Agente Financeiro / Risco (unit economics)

**Função:** delimitar **quanto** crescer e **quando travar** free, mídia ou limites de uso custosos.

**Entrada:** custo total variável (API, infra, ferramentas), usuários ativos, ativação, leads, receita (se houver), políticas atuais do free.

**Saída:**

- Recomendação: manter/ampliar/restringir free; pausar ou subir mídia; alertas (ex.: custo por usuário acima de limite).
- **Nunca** substituir contador ou CFO: é **camada de decisão assistida** com thresholds definidos pelo negócio.

---

## 7. Agente Experiência / Message match (coerência visual e textual)

**Função:** garantir que **anúncio → landing → próximas páginas** mantenham promessa, tom, prova e CTA alinhados; propor ajustes **dentro do design system** (tokens, componentes), não “nova marca por campanha”.

**Entrada:** brief do criativo ou do anúncio + URL/estrutura atual da página + segmento.

**Saída:**

- Especificação de variantes (ordem de blocos, copy, sugestão de cores/tipografia **dentro de guia**).
- Checklist de coerência antes de publicar.

**Nota:** Pode ser agente dedicado **ou** entrega obrigatória do Criador em todo pacote de anúncio; ver trade-off no documento 06.

---

## Orquestração típica (conceitual)

```text
Diretor define “o que fazer agora”
    → Analista (se houver algo para inspecionar)
    → Estratégico (se já houver diagnóstico ou brief sólido)
    → Criador + Experiência (pacote alinhado)
    → Otimizador (após dados)
    → Financeiro (gate antes de escala paga ou mudança agressiva de free)
```

Fluxos podem **voltar atrás**: se a estratégia falhar, o Diretor reabre com o Analista.

## Matriz rápida: quem faz o quê

| Pergunta | Agente principal |
|----------|------------------|
| Por onde começo esta semana? | Diretor |
| O que está errado no funil? | Analista |
| Como estruturo topo/meio/fundo? | Estratégico |
| Quais textos e prompts gerar? | Criador |
| O que testar na próxima rodada? | Otimizador |
| Posso gastar mais / abrir free? | Financeiro |
| Landing bate com o anúncio? | Experiência / Message match |
