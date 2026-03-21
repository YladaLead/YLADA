# Brief mestre YLADA — fonte da verdade para growth e agentes

**Status:** documento vivo — revisar quando ICP, preços, limites do free ou áreas do produto mudarem.  
**Uso:** todo agente (Diretor, Analista, Estratégico, Criador, Otimizador, Financeiro, Experiência) deve **tratar este arquivo como prioridade** quando houver conflito com suposições genéricas.

**Relação com o produto:** o YLADA conecta **diagnóstico interativo** (links inteligentes, quizzes, fluxos por objetivo) à **continuidade no WhatsApp** do profissional, com apoio de IA (ex.: Noel/LYA conforme área). Detalhes técnicos de implementação estão em outros `docs/`; aqui fica apenas o que **orienta mensagem, oferta e risco**.

---

## 1. ICP real (não genérico)

### 1.1 ICP primário (validação e growth inicial)

**Perfil:** profissional liberal que **atende clientes diretamente**, com **agenda a preencher ou irregular**, que já usa **Instagram e/ou WhatsApp** mas **não converte de forma previsível**.

**Sinais comportamentais (estética — referência forte no produto):**

- Esteticista ou similar: facial/corporal, muitas vezes **autônoma** ou pequeno consultório.
- **Agenda vazia ou oscilante** como dor explícita.
- Posta no Instagram mas sente que **não sabe vender** ou **tem medo de parecer “vendedora”**.
- Quer **qualificar** quem chama no WhatsApp em vez de só receber “oi”.
- Objetivo de curto prazo típico: **ter link de diagnóstico**, postar com constância e **preencher agenda**.

**O que esse ICP não é (para não diluir mensagem):**

- Grande clínica com time de marketing interno maduro (pode usar o produto, mas não é o foco do *brief* de growth inicial).
- Quem busca só “ferramenta de IA genérica” sem compromisso com **atendimento e conversão no WhatsApp**.

### 1.2 ICPs secundários (mesmo produto, mensagem em “modos”)

Profissionais de **nutrição**, **coach/wellness** e outros perfis já presentes nas áreas do app: **mesma promessa central** (diagnóstico → conversa qualificada), **dores e provas sociais** diferentes — usar **modos por segmento** (seção 6).

---

## 2. Promessa central do YLADA (obrigatória)

**Frase-pilar (usar como bússola em copy, anúncios e landings):**

> **Gerar conversas qualificadas no WhatsApp a partir de um diagnóstico inteligente** (link/quiz/fluxo que reflete a realidade do visitante e prepara o próximo passo com o profissional).

**Extensões permitidas (desde que não violem a seção 3):**

- “Transformar cliques em **mensagens no WhatsApp** com contexto (o lead já passou pelo diagnóstico).”
- “Menos ‘oi sumida’ e mais **conversas com intenção**.”
- “Diagnóstico que **nomeia o padrão** do visitante e abre porta para o profissional **consultivamente**.”

**Não substituir a promessa por:**

- “IA que faz tudo por você” sem vínculo com **fluxo real e WhatsApp**.
- “Garantia de X clientes por mês” sem base e sem compliance.

**Alinhamento com especificações internas do motor de diagnóstico:**

- Tom de diagnóstico orientado a **clareza e direcionamento consultivo** (evitar CTA genérico tipo “falar com especialista”; preferir primeira pessoa e próximo passo concreto — ver `docs/LINKS-INTELIGENTES-DIAGNOSIS-ENGINE-SPEC.md`).
- Sempre que o fluxo gerar **mensagem para WhatsApp**, ela deve **carregar contexto** do resultado (bloqueio, perfil, nível, etc.), não ser um texto vazio.

---

## 3. O que NUNCA pode acontecer (compliance, ética, verdade)

### 3.1 Promessas e resultados

- **Não prometer milagre** nem resultado financeiro ou clínico **garantido** (ex.: “dobra faturamento em 7 dias”, “cura”, “resultado certo”).
- **Não inventar cases, números ou depoimentos** — só usar prova **real e verificável**.
- **Não prometer** que o YLADA substitui **judiciário, fiscal, médico ou ética profissional** do segmento.

### 3.2 Saúde, estética e públicos sensíveis

- Respeitar **limites de cada conselho/classe** e **regulamentos de anúncio** (Meta, Google, etc.) ao produzir criativos; revisão humana em qualquer claim sensível.
- **Antes/depois** e imagens de corpo: usar só com **autorização**, verdade e política da plataforma; nunca sensacionalismo enganoso.
- **Menores e famílias:** extremo cuidado com coleta, linguagem e segmentação de anúncio; cruzar com política de dados (`docs/PLANO-PROTECAO-DADOS-LGPD-GDPR.md` e páginas legais quando existirem).

### 3.3 Dados e LGPD

- Não expor **dados pessoais** de usuários ou leads em prompts, relatórios públicos ou exemplos de agente.
- Usar **agregados e anonimização** quando copy for “baseada em diagnósticos reais”.
- Manter **finalidade clara** na coleta (captação, atendimento, melhoria do produto) conforme documentação legal do YLADA.

### 3.4 Marca e experiência

- Em páginas **públicas do profissional**, respeitar **marca do cliente** (logo, cor, nome) quando aplicável — ver seção 4 e `docs/FEATURE-BRANDING.md` (ex.: Nutri).
- Não **destruir acessibilidade** por mudança arbitrária de contraste ou tipografia só por “criativo novo”.

---

## 4. Design system (simplificado) — para travar o agente de experiência

### 4.1 Duas camadas

| Camada | O quê | Regra para o agente |
|--------|--------|---------------------|
| **YLADA (institucional / growth)** | Páginas e campanhas da **empresa** YLADA | Manter **consistência** com identidade YLADA vigente (cores, logo, tipografia dos materiais oficiais). Se não houver token exportado no repo, **pedir ao time** a referência (Figma/PDF) antes de inventar paleta nova. |
| **Profissional (link público)** | Formulários, diagnósticos, headers de ferramenta | **Respeitar branding do profissional** quando existir: `brand_color` (HEX), `brand_name`, `logo_url`, credencial — sem substituir a identidade do cliente pela da YLADA nesses contextos. |

### 4.2 Estrutura típica de página pública (lógica, não código)

1. **Contexto** — para quem é e qual dor/necessidade.
2. **Prova leve** — credencial, número de passos, ou social proof real.
3. **Fluxo de diagnóstico** — claro, sem jargão excessivo.
4. **CTA consultivo** — alinhado ao resultado esperado (WhatsApp com contexto).
5. **Confiança** — privacidade, o que acontece com os dados, em linguagem simples.

### 4.3 Tom de comunicação (institucional + diagnóstico)

- **Institucional / growth YLADA:** claro, direto, empático com o profissional que vende **serviço** e tem vergonha de “parecer vendedor”; mostrar **caminho** (diagnóstico → WhatsApp).
- **Diagnóstico (conteúdo gerado no fluxo):** ~**70% estratégico**, ~**20% emocional leve**, ~**10% técnico** — sem genérico vazio (“melhore seus hábitos” sem ligação com as respostas).
- Evitar tom **agressivo** ou **humilhante**; preferir **consultivo** e **primeira pessoa** nos CTAs para o visitante.

### 4.4 Cores “base” (placeholders até haver export oficial)

Até existir um token único versionado no repositório, o agente de experiência deve:

- Usar **cor primária** já definida nos materiais oficiais atuais do time, **ou**
- Manter **monocromático + uma cor de destaque** aprovada, sem gradientes “de marca nova” não validados.

**Ação humana:** colar abaixo quando estiver fixado:

- Primária: `________________`
- Secundária / destaque: `________________`
- Neutros: `________________`
- Fontes: `________________`

---

## 5. Regras do FREE (sem números fixos — lógica de negócio)

Os **valores** (limites, duração, créditos) são decisão de produto/financeiro e podem estar em `docs/PLANO-PLANO-GRATUITO-E-MIGRACAO-ASSINATURAS.md` e afins; aqui ficam só as **regras de intenção** que os agentes devem respeitar.

### 5.1 Liberar (ou manter generoso) quando

- Objetivo é **aprender**: ativação, mensagens reais, qualidade de lead, prova para case.
- Custo marginal por uso **estiver sob controle** e houver hipótese clara de conversão futura.
- O gargalo for **atrito** e não **qualidade do produto**.

### 5.2 Travar (ou endurecer) quando

- Houver **abuso** ou uso que **não gera valor** para o ecossistema (profissional + visitante).
- Custo por usuário ativo ou por lead **ultrapassar limites** definidos pelo negócio (agente financeiro).
- O free estiver **canibalizando** upgrade sem trazer aprendizado proporcional.

### 5.3 Incentivar upgrade quando

- O profissional já teve **sucesso parcial** (conversas, diagnósticos concluídos, retorno).
- Há **feature clara** só no pago que destrava o próximo degrau (mais links, automações, áreas, etc. — conforme produto).
- Copy de upgrade deve ser **baseada em valor percebido**, não em medo gratuito vazio.

### 5.4 Papel dos agentes

- **Diretor / Estratégico:** não recomendar “escala paga” antes de **validação** (ver `03-fases-crescimento-e-agente-diretor.md`).
- **Financeiro:** amarrar recomendações de free a **sinais** em `07-metricas-e-control-center.md`.
- **Criador:** não prometer “tudo grátis para sempre” se a política do produto for outra.

---

## 6. Modos por segmento (estratégia e abordagem)

Cada modo altera **dor principal**, **ângulo emocional**, **prova** e **exemplos** — **não** altera a promessa central (seção 2).

### 6.1 Estética

- **Dor:** agenda vazia, irregularidade, dificuldade em vender sem parecer invasiva.
- **Abordagem:** **emocional + agenda** — confiança, autoimagem, rotina de salão/clínica; prova com procedimentos e disponibilidade.
- **Canais:** Instagram, WhatsApp, indicação.
- **Cuidados:** antes/depois, promessas de resultado, regulamentação de anúncios.

### 6.2 Nutrição

- **Dor:** lead desinformado, desistência de plano, necessidade de **educar** antes da consulta.
- **Abordagem:** **educativo + dor/sintoma** (sem diagnosticar doença em anúncio) — clareza, hábitos, próximo passo com nutricionista.
- **Prova:** CRN, linha de cuidado, método (sem promessa milagrosa).
- **Branding:** forte uso de **marca do profissional** nas páginas públicas (`FEATURE-BRANDING.md`).

### 6.3 Coach / wellness

- **Dor:** dispersão, falta de compromisso, necessidade de **nomear padrão** e próximo passo.
- **Abordagem:** **transformação + consistência** — pequenas vitórias, rotina, acompanhamento; tom acolhedor e responsabilizador leve.
- **Cuidados:** não confundir com terapia clínica; linguagem de **bem-estar e performance pessoal** conforme posicionamento do profissional.

### 6.4 Vendas / negócios (quando o fluxo for esse perfil)

- **Dor:** pipeline frio, follow-up fraco, tempo perdido com lead errado.
- **Abordagem:** **performance + dinheiro/tempo** — qualificação, priorização, conversão.
- **Prova:** números reais, processo, ferramentas; evitar hype vazio.

### 6.5 Prioridade de uso dos modos

Para **growth interno YLADA** até nova ordem:

1. **Estética** (ICP primário para mensagem e primeiros testes).
2. Nutrição e coach/wellness em **paridade** conforme pipeline comercial real.
3. Demais modos conforme expansão de área no produto.

---

## 7. Message match (obrigatório em qualquer campanha)

- O **anúncio ou criativo** e a **primeira dobra da landing** devem repetir a **mesma promessa explícita** (ex.: diagnóstico para preencher agenda / qualificar WhatsApp).
- CTA e **texto do botão WhatsApp** devem refletir o **ângulo do anúncio** (não trocar “agenda” por “ebook” na página se o anúncio falou em agenda).
- Registrar **código de variante** (ex.: `camp_est_agenda_01`) para o Otimizador — ver `06-criativos-message-match-segmentos.md`.

---

## 8. Checklist rápido antes de publicar qualquer peça

- [ ] Promessa alinhada à **seção 2**.
- [ ] Nenhum item da **seção 3** violado.
- [ ] Modo de segmento correto (**seção 6**).
- [ ] Design respeitando **seção 4** (YLADA vs marca do profissional).
- [ ] Free/upgrade coerente com **seção 5** e política atual do produto.
- [ ] Message match **seção 7** verificado.

---

## 9. Documentos irmãos (não duplicar — referenciar)

| Documento | Função |
|-----------|--------|
| `01-principios-e-escopo.md` | Escopo do sistema de agentes |
| `02-catalogo-de-agentes.md` | Papéis e orquestração |
| `03-fases-crescimento-e-agente-diretor.md` | Fases validar → escalar |
| `04-checklist-primeiros-usuarios.md` | Execução manual inicial |
| `05-unit-economics-free-pago.md` | Lógica financeira dos agentes |
| `06-criativos-message-match-segmentos.md` | Fluxo criativo + landing |
| `07-metricas-e-control-center.md` | Métricas mínimas |
| `08-roadmap-implantacao.md` | Próximas fases (prompts, LAB) |

---

**Última linha:** se um agente **não tiver dado** para afirmar algo (preço exato, limite exato do free, cor oficial), deve **dizer que falta input** ou **pedir ao time**, em vez de inventar — exceto quando estiver gerando **hipótese claramente rotulada como tal** para teste.
