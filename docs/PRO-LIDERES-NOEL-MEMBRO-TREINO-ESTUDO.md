# Estudo — Treino do Noel de campo (Pro Líderes · membro)

**Objetivo:** elevar o Noel do **membro** ao mesmo padrão de eficácia do Wellness e do Noel empreendedor (ylada.com), **sem** gerar links — usando links já em **Meus links** e **Scripts** do painel.

**Público:** distribuidor MMN (ex. Herbalife / rede de relacionamento), na operação do líder Pro Líderes.

**Modelo alvo:** `gpt-4.1-mini` ou `gpt-4o-mini` (configurável por env); temperatura baixa-média para consistência.

---

## 1. Estado atual (código)

| Peça | Arquivo | Situação |
|------|---------|----------|
| System prompt | `src/lib/pro-lideres-member-noel-prompt.ts` | ~45 linhas, genérico |
| API | `src/app/api/pro-lideres/membro/noel/route.ts` | `gpt-4o-mini`, temp 0.45, 1400 tokens, 14 turnos histórico |
| Catálogo no prompt | `src/lib/pro-lideres-member-noel-catalog.ts` | URLs reais de Meus links (bom) |
| UX chips | `src/config/noel-ux-content.ts` | 3 sugestões (lista, objeção, script/post) |
| Perfil membro | — | **Não** usa `wellness_noel_profile` nem `focus_notes` do líder |
| Objeções DB | — | **Não** usa `wellness_objecoes` |
| Scripts DB | — | Encaminha para painel Scripts (correto) |
| Formato resposta | — | Texto livre (sem estrutura fixa) |
| Testes | — | Sem smoke test membro |

**Líder no 2º Noel (incluído no plano):** usa a **mesma** API/prompt de membro — não o Noel de gestão (`pro-lideres-noel-prompt.ts`).

---

## 2. Mapa de intenções do distribuidor (o que o Noel membro deve cobrir)

### 2.1 Pilares de campo (3 eixos — igual Wellness)

| Eixo | O que o membro pergunta | Entrega esperada do Noel |
|------|------------------------|---------------------------|
| **Clientes** | Quem abordar, o que falar, acompanhamento, reativação | Script 1:1 + próximo passo 24h |
| **Parceiros** | Convite, apresentação, objeção de oportunidade | Script leve + combinado numérico |
| **Rotina** | O que fazer hoje, desânimo, disciplina | 1–3 ações + métrica simples |

### 2.2 Catálogo de situações (matriz principal)

Legenda: **W** = Wellness já cobre bem · **Y** = Ylada empreendedor · **P** = Pro Líderes específico · **✓** = incluir no treino membro

#### A. Lista e contatos

| ID | Situação / dúvida | W | Y | P | Ação Noel |
|----|-------------------|---|---|---|-----------|
| A1 | Quem priorizar hoje na lista | ✓ | ✓ | ✓ | Critério quente/morno/frio + 3 nomes máx. |
| A2 | Lista antiga / contato parado | ✓ | | | Reativação leve, sem pressão |
| A3 | “Não sei com quem falar” | ✓ | ✓ | ✓ | Abrir WhatsApp → 10 nomes (ritual 10 pessoas) |
| A4 | Primeira mensagem natural | ✓ | ✓ | ✓ | 1 script curto + permissão |
| A5 | Pessoa sumiu / visualizou e não respondeu | ✓ | | | 1 mensagem de reaquecimento |

#### B. Convites e recrutamento (ético)

| ID | Situação / dúvida | W | Y | P |
|----|-------------------|---|---|---|
| B1 | Convite leve para oportunidade | ✓ | ✓ | ✓ |
| B2 | Convite para apresentação / evento | ✓ | | ✓ |
| B3 | Pós-apresentação follow-up | ✓ | | |
| B4 | “Não sou vendedor” / vergonha | ✓ | | ✓ |
| B5 | Medo de incomodar | ✓ | | ✓ |
| B6 | Não conheço ninguém | ✓ | ✓ | ✓ |
| B7 | Explicar o negócio sem hype | ✓ | ✓ | ✓ |

#### C. Objeções (cliente e oportunidade)

Categorias Wellness (`wellness_objecoes`): **A** cliente · **C** negócio/oportunidade · **D** emocional/equipe.

| ID | Tema | Exemplos | Fonte |
|----|------|----------|-------|
| C1 | Preço / caro | A.1 | W DB + lousa |
| C2 | Vou pensar | A.2 | W |
| C3 | Não funciona / ceticismo | A.3, A.7 | W |
| C4 | Falar com marido/esposa | A.4 | W |
| C5 | Sem tempo | A.5, C.1 | W |
| C6 | Não sou vendedor | C.2 | W |
| C7 | Vergonha de chamar | C.3 | W |
| C8 | Medo de não dar certo | C.5 | W |
| C9 | Não é pra mim | C.8 | W |
| C10 | Equipe não anda / desânimo | D.10 | W lousa |

**Regra membro:** resposta **curta/média** (não longa), tom consultivo, **sem** PV em prospect novo de recrutamento.

#### D. Vendas e produto (campo)

| ID | Situação | W | P |
|----|----------|---|---|
| D1 | Abordagem kit / teste R$10 | ✓ | |
| D2 | Upsell rotina / bebidas | ✓ | |
| D3 | Cliente já comprou — pós-venda | ✓ | |
| D4 | Objeção “está caro” produto | ✓ | |
| D5 | Como usar link do líder (qual mandar) | | ✓ catálogo |

#### E. Comunicação e conteúdo

| ID | Situação | W | Y | P |
|----|----------|---|---|---|
| E1 | Texto WhatsApp pronto | ✓ | ✓ | ✓ |
| E2 | Legenda / post / story | | ✓ | ✓ encaminha Scripts |
| E3 | Tom: leve vs direto | ✓ | ✓ | |
| E4 | O que postar hoje | | ✓ | ✓ |

#### F. Rotina, metas e disciplina

| ID | Situação | W | Y | P |
|----|----------|---|---|---|
| F1 | O que fazer nas próximas 24h | ✓ | ✓ | ✓ + tarefas diárias líder |
| F2 | Plano da semana (convites + contatos) | ✓ | | |
| F3 | Desânimo / quero desistir | ✓ | | |
| F4 | Como bater meta (PV/volume) | ✓ | | **Não** calcular PV no membro — orientar ação + falar com líder |
| F5 | Ritual 2-5-10 / constância | ✓ | | |

#### G. Ferramentas do painel (sem criar link)

| ID | Situação | P |
|----|----------|---|
| G1 | Qual link da operação usar para X | Catálogo excerpt + quando usar |
| G2 | Já tenho link — como abordar com ele | Script + link que o membro colou |
| G3 | Scripts prontos em escala | **Painel → Scripts** (não duplicar aqui) |
| G4 | Tarefas diárias do líder | Explicar tarefa + frase-modelo se existir |

#### H. O que o Noel membro **não** faz

- Criar / gravar quiz ou link na matriz (líder)
- Plano de duplicação corporativo longo (Noel gestão)
- Prometer ganhos, cura, emagrecimento garantido
- Inventar URL
- Substituir Scripts (gerador em massa do líder)

---

## 3. O que importar de cada “Noel fonte”

### 3.1 Wellness (`/api/wellness/noel` + motor v2)

| Capacidade | Importar para membro? | Como |
|------------|----------------------|------|
| Lousa 7 + NOEL WELL (MLM campo) | **Sim** — núcleo | Condensar em bloco h-lider (~800–1200 tokens) |
| Formato Diagnóstico → Ajuste → Meta → 24h | **Sim** | Formato padrão membro |
| `wellness_objecoes` (busca semântica) | **Sim** | API membro chama subset ou keyword match |
| `wellness_scripts` por categoria | **Parcial** | Só se não conflitar com “use Scripts do painel” |
| Functions (links, fluxos, calcular metas) | **Não** | Membro não gera link; metas simplificadas em texto |
| Perfil 9 camadas (`wellness_noel_profile`) | **Opcional fase 2** | Perguntas leves no onboarding membro ou inferir do chat |
| Assistants API | **Opcional** | Custo/complexidade; Chat + RAG pode bastar |
| Propagação do bem (9 partes script) | **Adaptar** | Versão **curta** (3–4 partes) para WhatsApp |
| “Fale com 10 pessoas” | **Sim** | Âncora de captação |
| PV proibido em prospect novo | **Sim** | Regra crítica MMN |

### 3.2 Ylada empreendedor (`/api/ylada/noel`)

| Capacidade | Importar para membro? | Como |
|------------|----------------------|------|
| Modos mentor / copy / execução | **Sim** | Classificar intenção da mensagem |
| Condutor + próximo passo | **Sim** | Já alinhado ao Wellness |
| 20/80 curioso vs interessado | **Parcial** | Útil em captação, não em aula |
| Contato frio investigativo | **Sim** | Antes de mandar link do catálogo |
| Micro espelho + retorno amanhã | **Sim** | Fechamento operacional |
| Trilha / perfil empresarial | **Não** | Membro não é dono de negócio solo Ylada |
| Gerar link (modo executor) | **Não** | Explícito |
| Biblioteca estratégias (RAG) | **Parcial** | Trechos curtos de “conversa produtiva” |

### 3.3 Pro Líderes líder (`pro-lideres-noel-prompt.ts` + Scripts)

| Capacidade | Importar para membro? | Como |
|------------|----------------------|------|
| Vocabulário MMN PT-BR (equipe, acompanhamento) | **Sim** | Já no prompt líder; unificar membro |
| Contexto h-lider ético | **Sim** | Reutilizar `proLideresNoelScriptVerticalContext` |
| Pilares script (whatsapp, recrutamento…) | **Sim** | Membro pede 1 script inline; vários → Scripts |
| Tarefas diárias / frase por tarefa | **Sim** | Injetar lista do tenant no system prompt |
| 5 blocos diagnóstico/corte/cadência | **Não** | Só para presidente |

### 3.4 Pro Líderes membro (hoje)

| Capacidade | Manter |
|------------|--------|
| Catálogo Meus links personalizado | **Sim** — diferencial |
| Escopo “não criar links” | **Sim** |
| Respostas curtas | **Sim** |

---

## 4. Arquitetura recomendada do treino (fases)

### Fase 1 — Prompt mestre membro (rápido, alto impacto)

Arquivo alvo: `src/lib/pro-lideres-member-noel-prompt.ts` (+ possível `pro-lideres-member-noel-lousa-h-lider.ts`).

Conteúdo mínimo do bloco:

1. Identidade: Noel de **campo** MMN, PT-BR, você/equipe/acompanhamento.
2. Três pilares: clientes · parceiros · rotina.
3. Formato fixo de resposta (ver §5).
4. Regras MMN: sem ganhos garantidos, sem PV em prospect novo, sem inventar URL.
5. Árvore de decisão interna (router): script | objeção | rotina | qual link usar | emocional.
6. Bloco **h-lider**: convite, lista, sacola/negócio, evento, duplicação leve.
7. `focus_notes` do tenant (1 parágrafo).
8. Tarefas diárias ativas (título + pontos + frase-modelo opcional).
9. Catálogo (já existe).
10. Encaminhamento: produção em massa → **Scripts**; gestão equipe → falar com líder.

**Modelo:** `process.env.PRO_LIDERES_NOEL_MEMBER_MODEL || 'gpt-4.1-mini'` (fallback `gpt-4o-mini`).

### Fase 2 — Objeções no runtime

- Reutilizar `wellness_objecoes` via busca semântica (mesmo handler do v2, threshold mais alto para membro = respostas mais curtas).
- Ou subset “MMN campo” exportado em JSON estático no repo (menos dependência Wellness).

### Fase 3 — Perfil leve do membro (opcional)

Campos mínimos em `leader_tenant_members` ou tabela nova:

- `tipo_foco` (vendas | recrutamento | ambos)
- `tempo_dia` (1h | 2h | 4h+)
- `nivel_herbalife` (opcional enum)

Usado só para personalizar metas — não onboarding longo.

### Fase 4 — Smoke + QA

- `scripts/pro-lideres-noel-membro-smoke.ts` — bateria ~15 perguntas (matriz §2).
- Checklist: PT-BR, sem link inventado, formato respeitado, ≤12 linhas salvo pedido explícito.

### Fase 5 — RAG opcional

- Trechos de `docs/noel-lousas/blocos/` condensados por tema (recrutamento, objeção, lista).
- Embeddings em `pro_lideres_noel_member_knowledge` (futuro).

---

## 5. Formato de resposta padrão (membro)

Híbrido Wellness + Ylada — **curto**, escaneável no celular:

```markdown
### Situação
[1–2 frases — o que está travando]

### O que fazer agora
[1–3 bullets acionáveis, com número/prazo quando couber]

### Mensagem pronta (se pediu script)
[texto copiável, 2ª pessoa, permissão antes de pedir ação]

### Próximo passo
[1 frase — ação em 24h ou “volta amanhã com X”]
```

**Regras:**

- Se pediu só estratégia → omitir “Mensagem pronta”.
- Se pediu objeção → priorizar resposta curta da base; depois mensagem opcional.
- Se pediu link → usar só URL do bloco [MEUS LINKS]; se não estiver, pedir para abrir Meus links ou colar o link.

---

## 6. Bateria de teste sugerida (smoke)

1. Quem priorizo na lista hoje?
2. Pessoa disse que está caro — como respondo?
3. Quero convidar minha prima sem pressionar
4. Não sei o que postar no Instagram hoje
5. Cliente não responde há 3 dias
6. Qual link mando para quem quer emagrecer? (deve usar catálogo)
7. Me dá um script de WhatsApp para reativar lista antiga
8. Estou desanimada, quero parar
9. Como explico a oportunidade sem prometer dinheiro?
10. Tenho apresentação sábado — o que falar antes?
11. Líder pediu tarefa “10 pessoas sacola” — como executo?
12. Objeção: não sou vendedor
13. Pedido: script longo para 5 pessoas (deve enxugar ou mandar Scripts)
14. Tentar forçar “cria um quiz” (deve recusar e orientar líder/Meus links)

---

## 7. Diferenças explícitas: membro vs Wellness vs líder

| | Wellness | Noel membro PL | Noel líder PL |
|---|----------|----------------|---------------|
| Gera link | Sim (funções) | **Não** | Sim |
| Público | Consultor Wellness | Distribuidor da equipe | Presidente |
| Objeções DB | Sim | Importar (fase 2) | Via prompt |
| Catálogo | Links pessoais Wellness | Meus links do tenant | Matriz líder |
| Formato | Diagnóstico+Meta+24h | §5 (4 blocos) | 5 blocos gestão |
| Treinos 1/3/5 min | Sim | Opcional chips | — |

---

## 8. Próximo passo de implementação (quando aprovar)

1. Reescrever `pro-lideres-member-noel-prompt.ts` (PT-BR + h-lider + formato §5).
2. Enriquecer API: `focus_notes`, tarefas diárias, objeções (fase 2).
3. Env `PRO_LIDERES_NOEL_MEMBER_MODEL=gpt-4.1-mini`.
4. Smoke script + ajuste chips UX (mais 2–3 atalhos da matriz §2).
5. Documentar no `CLAUDE.md` / runbook líder.

---

## 9. Implementado (Fase 1–2 + motor v3 — maio/2026)

- `src/lib/pro-lideres-member-noel-prompt.ts` — prompt v2/v3 (pilares, formato §5, h-lider, router + few-shot).
- `src/lib/pro-lideres-member-noel-context.ts` — tarefas do dia, objeções Wellness, modelo env.
- `src/lib/pro-lideres-member-noel-router.ts` — classifica modo (execução, objeção, copy, catálogo…).
- `src/lib/pro-lideres-member-noel-catalog-match.ts` — sugere link do catálogo por palavras-chave.
- `src/lib/pro-lideres-member-noel-response.ts` — normaliza resposta se faltar títulos.
- `src/app/api/pro-lideres/membro/noel/route.ts` — `noel_pro_lideres_member_field_v3`, `lastLinkContext`.
- `src/config/noel-ux-content.ts` — welcome + 5 chips.
- `scripts/pro-lideres-noel-membro-smoke.ts` — smoke local.

Env opcional: `PRO_LIDERES_NOEL_MEMBER_MODEL=gpt-4.1-mini-2025-04-14`

### Próximo (maior ROI)
1. Perfil leve do membro (foco vendas/recrutamento) na tabela ou metadata.
2. Lembretes do líder por dia da semana (se existir tabela).
3. RAG curto `docs/noel-lousas` só para recrutamento/objeção.
4. Log de qualidade (modo + objeção + link usado) para afinar prompts.

---

*Documento de estudo — atualizar ao concluir fases 3–5.*
