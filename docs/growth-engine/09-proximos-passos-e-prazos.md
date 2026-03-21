# Próximos passos e prazos (construção dos agentes)

Este documento lista **o que falta fazer**, em **ordem**, e **faixas de tempo** realistas. Os prazos assumem **1 pessoa** dedicando parte da semana ao growth/docs; com **2+ pessoas** em paralelo (copy + produto + dados), dá para encurtar o que for independente.

**Referência:** fases detalhadas em [`08-roadmap-implantacao.md`](./08-roadmap-implantacao.md).

---

## O que já está pronto (não conta como “construir agente”)

- Estrutura conceitual (`01`–`08`) e **brief mestre** [`00-brief-mestre-ylada.md`](./00-brief-mestre-ylada.md).
- Checklists de primeiros usuários, métricas, free/pago (lógica).

Ou seja: o **cérebro em papel** existe; falta **operacionalizar** (prompts, dados, opcionalmente código).

---

## Próximos passos — lista completa

### Passo 1 — Fechar a “verdade operacional” no brief

| Ação | Detalhe |
|------|---------|
| Preencher **cores/fontes** oficiais no `00` (seção 4.4) | Evita o agente de experiência inventar paleta |
| Colar **limites numéricos** do free/upgrade em planilha interna + uma linha no `00` apontando para ela | Alimenta o agente financeiro com fatos |
| Validar **ordem dos nichos** e ICP com liderança | Uma reunião ou doc assinado |

**Prazo típico:** **0,5 a 2 dias** de trabalho disperso (depende de já existir guia de marca).

---

### Passo 2 — Planilha mínima de métricas (Control Center v0)

| Ação | Detalhe |
|------|---------|
| Abrir uma planilha (ou BI mínimo) com os blocos do [`07-metricas-e-control-center.md`](./07-metricas-e-control-center.md) | Mesmo que alguns campos sejam preenchidos **manualmente** na primeira semana |
| Definir **de onde vem** cada número (Stripe, Supabase, ads, manual) | Sem isso, Otimizador e Financeiro ficam genéricos |

**Prazo típico:** **2 a 5 dias** (o gargalo costuma ser **acordo** sobre definições, não a planilha em si).

---

### Passo 3 — Runbooks + prompts por agente (Fase 2 — núcleo da “construção”)

Para **cada** papel em [`02-catalogo-de-agentes.md`](./02-catalogo-de-agentes.md):

1. Documento ou bloco único com **prompt sistema** + **template de entrada** (campos obrigatórios).
2. **Formato fixo de saída** (títulos, limites de caracteres para ads, etc.).
3. Inclusão explícita: “obedecer [`00-brief-mestre-ylada.md`](./00-brief-mestre-ylada.md)”.

**Ordem sugerida de escrita (dependências):**

1. **Diretor** (define o que os outros recebem como contexto).
2. **Analista** → **Estratégico**.
3. **Criador** + **Experiência/message match** (podem ser um runbook só com duas saídas).
4. **Otimizador** (precisa do formato da planilha do passo 2).
5. **Financeiro** (precisa dos thresholds acordados no passo 1–2).

**Prazo típico:**

| Cenário | Tempo |
|---------|--------|
| **MVP** (prompts utilizáveis só para Diretor + Criador + Experiência) | **3 a 7 dias** |
| **Conjunto completo** (7 papéis + revisão interna + 1 teste real cada) | **2 a 4 semanas** em ritmo part-time |

Isso é o que a maioria das pessoas chama de **“construir os agentes”** neste estágio: **ainda sem backend**, só **documentação de prompts + procedimento**.

---

### Passo 4 — Teste piloto no mundo real (Fase 3)

| Ação | Detalhe |
|------|---------|
| Executar [`04-checklist-primeiros-usuarios.md`](./04-checklist-primeiros-usuarios.md) | Gera linguagem e objeções reais |
| Rodar **um ciclo completo** Analista → Estratégico → Criador + Experiência com **dados reais** | Ajustar prompts onde a saída fugir do `00` |
| Registrar **códigos de campanha** (message match) | Ver `06` |

**Prazo típico:** **2 a 6 semanas** em calendário (porque depende de **conversas reais**, não só de escrita).

---

### Passo 5 — Orquestração leve (Fase 4)

| Ação | Detalhe |
|------|---------|
| Template de **relatório semanal** (saídas dos agentes + números da planilha) | |
| Nomear **aprovador humano** para preço, free agressivo e claims fortes | |

**Prazo típico:** **1 a 3 dias**.

---

### Passo 6 — Opcional: Cursor Rules / Skills

| Ação | Detalhe |
|------|---------|
| Colar regras no `.cursor/rules` ou skills que **apontem** para `docs/growth-engine/` | Reduz erro de contexto nos chats de desenvolvimento |

**Prazo típico:** **0,5 a 2 dias**.

---

### Passo 7 — Produto interno YLADA LAB + APIs (Fase 5 — **o que mais demora**)

| Ação | Detalhe |
|------|---------|
| Formulário interno, fila de etapas, armazenamento de artefatos | |
| Chamadas a modelo (API), custos, filas, permissões | |
| Integração **automática** com métricas | Depende de instrumentação no produto |
| Gates, logs de aprovação | |

**Prazo típico (engenharia):**

| Escopo | Tempo |
|--------|--------|
| **MVP técnico** (form + salvar resultado + chamar modelo em sequência, sem BI lindo) | **3 a 8 semanas** (1 dev, conforme stack e segurança) |
| **Produto robusto** (auth interno, auditoria, integração métricas, retries, UI polida) | **2 a 6 meses** |

Este é de longe o item com **maior calendário** se a definição de “agentes prontos” incluir **produto**.

---

## Resumo: quanto tempo para “ter agentes”?

| Definição de “pronto” | Prazo total (ordem de grandeza) |
|------------------------|----------------------------------|
| **Agentes = prompts + runbooks + 1 ciclo testado no chat** | **~3 a 6 semanas** após brief fechado (part-time) ou **~1,5 a 3 semanas** se full-time focado |
| **Agentes + validação com usuários reais e planilha alimentada** | **+2 a 6 semanas** de calendário (paralelo ao resto do negócio) |
| **Agentes dentro do produto (LAB) com pipeline estável** | **+1 a 6 meses**, conforme escopo e time |

---

## O que vai demorar **mais** em qualquer cenário

1. **YLADA LAB em código** (Fase 5) — engenharia, segurança, custo de API, UX interna.
2. **Dados confiáveis** — até a planilha estar preenchida com disciplina semanal, Financeiro e Otimizador são limitados.
3. **Validação no mercado** — não comprime só com mais prompt; precisa de execução comercial real.

---

## Linha do tempo sugerida (visão única)

```text
Semana 1     → Passos 1 + 2 (brief números + planilha v0)
Semanas 2–4  → Passo 3 (prompts dos 7 papéis, começando pelo Diretor)
Semanas 3–8  → Passo 4 em paralelo (primeiros usuários + ajuste de prompts)
Semana 5+    → Passos 5 e 6 (relatório semanal, rules/skills)
Quando priorizar eng → Passo 7 (LAB)
```

Ajuste as semanas se o time for maior ou se vocês **cortarem** escopo do passo 3 para só **Diretor + Criador + Experiência** no primeiro mês.

---

## Checklist rápido “estamos prontos para dizer que os agentes existem?”

- [ ] Todo prompt começa com “seguir o `00-brief-mestre-ylada.md`”.
- [ ] Pelo menos **um** ciclo real documentou entrada → saída → decisão humana.
- [ ] Planilha do `07` existe e alguém **atualiza** semanalmente.
- [ ] Ninguém publica anúncio sem **message match** (checklist do `00`).

Quando isso for verdade, o sistema está **operacional em modo assistido**; o LAB é **escala e conveniência**, não o primeiro passo obrigatório.
