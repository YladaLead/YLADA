# Análise: fluxo de entrada progressiva (textos por área)

> **Março/2026 — revisão de copy aplicada:** dor mais ligada a resultado (cliente, agenda, pedido, sessão), gancho com “Na prática…”, Noel reforçado, passos 7–11 alinhados ao fluxo otimizado. A lista detalhada na §3 abaixo pode estar **desatualizada**; fonte de verdade: `STEPS` em cada `*EntradaSocraticaContent.tsx`.

Documento para **revisão de copy e coerência** entre verticais. Reflete o código atual dos componentes `*EntradaSocraticaContent.tsx` (março/2026).

**Áreas cobertas:** Estética, Nutri, Odonto, Nutra, Psicologia (psi).

**Rotas:** `/pt/estetica`, `/pt/nutri`, `/pt/odonto`, `/pt/nutra`, `/pt/psi` (rollbacks minimal em `…v2`).

---

## 1. Sequência padronizada (molde mental)

Todas as áreas usam **12 passos** (índices **0 a 11** no código), com a mesma função narrativa:

| # | Índice | Função |
|---|--------|--------|
| 1 | 0 | **Gancho:** pergunta + **3 escolhas** (só grava analytics; **não muda** o texto dos passos seguintes) |
| 2 | 1 | **Dor real:** posta mas não vira resultado; preço/some; “Isso cansa.” (**sem** link ainda) |
| 3 | 2 | **Reframe:** “E não é você” + problema não é o trabalho clínico/procedimento → compara preço |
| 4 | 3 | **Contraste:** “já chegasse diferente?” + 3 linhas concretas por área |
| 5 | 4 | **Mecanismo:** direct/Zap → “perguntas simples, mas certas” + parar e pensar |
| 6 | 5 | **Noel:** CTA **Ver como funciona** (abre modal demo) + secundário **Continuar** |
| 7 | 6 | **Exemplo de prompt** + entrega do Noel (perguntas, sequência…) |
| 8 | 7 | **Ponte pós-demo** (só quem voltou do exemplo; ver §2) |
| 9 | 8 | **Distribuição:** compartilhar o link (redes / Zap / anúncios) |
| 10 | 9 | **Efeito:** quem responde percebe coisas antes de escrever |
| 11 | 10 | **Benefícios práticos** (bullet list) |
| 12 | 11 | **Fechamento** + CTA cadastro **grátis** |

**Botões recorrentes (rótulos):**  
`Exatamente isso` (passo 1, onde existe) · `Continuar` · `Quero entender isso` · `Ver como funciona` · `Quero testar isso` · `Gostei, quero começar grátis agora`.

---

## 2. Fluxo “direcionado” na prática (o que muda de verdade)

### 2.1 Escolha inicial (passo 0)

- Há **três botões** (`preco` | `conversas` | `prontos` nos analytics).
- **O fluxo linear é o mesmo** depois disso: o texto do passo 1 em diante **não** depende da opção clicada.
- A escolha serve para **métrica** (`{area}_landing_escolha_inicial`) e opcionalmente `sessionStorage` (`ylada_{area}_entrada_opcao`).

### 2.2 Passo 5: demo ou pular

- **Primário:** abre **modal** (local/contexto → nicho → “Começar experiência” → rota `/{area}/exemplo-cliente?nicho=…`).
- **Secundário “Continuar”:** avança sem abrir o demo.

### 2.3 Pular o passo “pós-demo” no fluxo linear (6 → 8)

- Quem **não** fez o demo e avança normalmente: ao sair do passo **6**, o código vai direto ao passo **8** (pula o **7**).
- O passo **7** é a **ponte** (“você viu pelo olhar do paciente/cliente…”) e só faz sentido para quem **voltou** do exemplo.

### 2.4 Quem completa o exemplo-cliente

- Ao concluir, grava flag em `sessionStorage` e volta para a landing.
- A landing **reabre no passo 7** (`*_LANDING_STEP_APOS_DEMO = 7`).

### 2.5 Demo (fora da sequência 0–11)

- **Modal:** perguntas de **contexto** (rótulos variam por área: salão, consultório, redes, etc.) → **nicho** (lista vem de `*-demo-cliente-data.ts`) → confirmação.
- **Exemplo-cliente:** mini-quiz por nicho (textos **não** estão neste documento; estão nos ficheiros `src/lib/*-demo-cliente-data.ts`).

---

## 3. Textos por passo e por área

Linhas em branco no código viram espaço visual (`h-2`); aqui aparecem como linha vazia entre parágrafos.

### Passo 0 — Gancho (3 escolhas)

**Introdução comum:**  
`Posso te fazer uma pergunta rápida?`  
`Seu marketing hoje atrai mais:`

| Área | Opção A | Opção B | Opção C |
|------|---------|---------|---------|
| **Estética** | Pessoas perguntando preço | Conversas que não viram agendamento | Clientes realmente prontos |
| **Nutri** | Pessoas perguntando preço | Conversas que não viram agendamento | Pacientes realmente prontos |
| **Odonto** | Pessoas pedindo preço no escuro | Conversas que não viram avaliação ou retorno | Pacientes com intenção clara de tratamento |
| **Nutra** | Gente pedindo preço no escuro | Conversas que não viram pedido | Clientes prontos pra comprar com orientação |
| **Psi** | Pessoas perguntando preço antes de contexto | Conversas que não viram sessão ou retorno | Pessoas com intenção clara de começar um processo |

---

### Passo 1 — Dor no digital (“Exatamente isso”)

**Estética** — abertura: `Se você trabalha com estética…`  
Corpo comum (todas as linhas abaixo iguais às outras áreas com mesma estrutura):  
`Você capricha no conteúdo, mas na prática quase não vira conversa.`  
`Muitas vezes você nem sabe direito o que postar.`  
`Muitas vezes você nem tem gente suficiente te chamando.`  
`Até quando o post bomba em curtida, isso nem sempre vira alguém te procurando de verdade.`

**Nutri** — abertura: `Se você atende como nutricionista…` (idem corpo).

**Odonto** — abertura: `Se você atende em odontologia…` (idem corpo).

**Nutra** — abertura: `Se você vende ou indica suplementos…` (idem corpo).

**Psi** — abertura: `Se você atende como psicólogo ou psicóloga…` (idem corpo).

---

### Passo 2 — Reframe (“Continuar”)

**Estética**

- `O problema não é o seu atendimento.`
- `Nem você.`
- `É que a maioria das pessoas chega sem entender o que realmente precisa.`
- `E quem não entende…`
- `compara preço.`  
*(Sem a frase “Faz sentido?” presente nas outras áreas.)*

**Nutri**

- `O problema não é o seu atendimento.` / `Nem você.`
- `É que a maioria chega sem entender o que realmente precisa.`
- `E quem não entende…` / `compara preço.`
- `Faz sentido?`

**Odonto** — como Nutri, mas:  
`É que a maioria chega sem entender o que precisa, nem o que espera do primeiro passo.`

**Nutra** — como Nutri, mas:  
`É que a maioria chega sem entender o que quer resolver, nem o que espera da primeira conversa.`

**Psi** — como Nutri, mas:  
`É que a maioria chega sem entender o que sente, nem o que espera da primeira conversa.`

---

### Passo 3 — Contraste futuro (“Quero entender isso”)

**Estética**

- `Agora pensa comigo:`
- `E se, antes da conversa…`
- `a pessoa já tivesse mais clareza?`
- `Mais noção do que precisa` / `Mais abertura para ouvir` / `Mais chance de agendar`

**Nutri**

- `Então imagina:`
- `E se, antes de vocês conversarem a fundo…`
- `essa pessoa já chegasse com mais noção de hábitos, objetivo e o que é prioridade pra ela?`
- `Menos suposição da sua parte.` / `Mais abertura pra ouvir você.` / `Mais chance de consulta ou plano com congruência.`

**Odonto** — como Nutri, mas terceiro bloco:  
`essa pessoa já chegasse com mais noção de sintoma, urgência e o que quer resolver na boca?`  
Última linha de benefício: `Mais chance de avaliação ou plano com congruência.`

**Nutra** — como Nutri, mas:  
`essa pessoa já chegasse com mais noção de objetivo, rotina e prioridade?`  
`Mais abertura pra ouvir sua orientação.`  
`Mais chance de pedido com congruência (e menos medo de errar na indicação).`

**Psi** — como Nutri, mas:  
`essa pessoa já chegasse com mais noção do que incomoda, do contexto e do que quer explorar?`  
`Mais abertura pra escuta clínica.`  
`Mais chance de vínculo e continuidade no processo.`

---

### Passo 4 — Mecanismo (“Continuar”)

**Estética**

- `Em vez de explicar tudo no direct ou no WhatsApp…`
- `você começa com perguntas simples.`
- `Perguntas que fazem a pessoa pensar`
- `e entender melhor a própria pele, rotina ou objetivo.`

**Nutri, Odonto, Nutra, Psi** (estrutura comum)

- `Quando o post vira mensagem e o WhatsApp acende, o que costuma acontecer?`
- `Você tenta explicar tudo num puxão só.`
- `E se o primeiro passo fosse outro:`
- **Nutri:** `perguntas simples que fazem a pessoa pensar` + `e alinhar rotina, objetivo e prioridade de saúde antes do papo longo?`
- **Odonto:** idem + `e alinhar dor, expectativa e prioridade antes do papo longo?`
- **Nutra:** idem + `e alinhar objetivo, rotina e dúvida antes do papo longo?`
- **Psi:** `perguntas simples que ajudam a pessoa a refletir` + `e alinhar dor, contexto e expectativa antes do papo longo?`

---

### Passo 5 — Noel (demo-modal + Continuar)

**Estética** — título do “travar”: `Mas e se você travar na hora de montar isso?`  
`É aqui que entra o Noel.`  
Bullets: `organizar suas ideias` · `montar perguntas certas` · `transformar seu conhecimento em algo simples`  
`Sem complicação.`

**Nutri, Odonto, Nutra, Psi** (alinhados)

- `E se você travar na hora de montar essas perguntas?`
- `É aí que entra o Noel.`
- `Ele te ajuda a:` → `organizar suas ideias` · `montar perguntas certas` · `traduzir seu conhecimento em algo simples`
- `Sem enrolação.`

---

### Passo 6 — Exemplo de prompt (“Continuar”; no linear seguinte pula 7)

**Estética** — citação: `“Quero atrair clientes para limpeza de pele”`

**Nutri** — `“Quero atrair consultas para emagrecimento saudável”`

**Odonto** — `“Quero atrair pacientes para avaliação de implante”`

**Nutra** — `“Quero qualificar quem busca proteína pra treino”`

**Psi** — `“Quero atrair primeiras conversas sobre ansiedade e rotina”`

**Bloco comum (todas):**  
`Você pode escrever algo como:` → citação → `E o Noel te entrega:` → `perguntas prontas` · `sequência lógica` · `estrutura fácil de usar` → `Você só ajusta e usa.`

---

### Passo 7 — Ponte pós-demo (“Continuar”) — só quem voltou do exemplo

**Estética**

- `Você acabou de ver o fluxo pelo olhar da sua cliente.`
- `Enquanto responde, ela vai percebendo melhor o que precisa, antes de te escrever.`
- `Tem biblioteca com vários fluxos já montados pra sua área.` / `Ou você personaliza tudo conforme a tua realidade.`
- `Se não souber por onde começar, fica tranquilo: o Noel te ajuda.`
- `Com seu link personalizado, você divulga e sua cliente também costuma repassar.` / `Quanto mais o link circula, mais gente preenche o fluxo.`

**Nutri**

- `Você acabou de ver o fluxo pelo olhar do seu paciente.`
- `Responder no ritmo dele…` / `ir clareando o que precisa…` / `e chegar no WhatsApp com contexto, não com um “oi” vazio.`
- `Na sua conta: biblioteca com fluxos prontos em nutrição` / `ou tudo personalizado à tua realidade.`
- `Travou? O Noel te guia.`
- `Link seu: você divulga, o paciente repassa, e mais gente entra no fluxo.`

**Odonto** — como Nutri, mas biblioteca: `em odontologia`.

**Nutra** — como Nutri, mas: `pelo olhar do seu cliente` e `biblioteca com fluxos prontos pra suplementos`.

**Psi** — como Nutri, mas: `pelo olhar de quem busca psicologia` · `Responder no ritmo da pessoa…` · `ir clareando o que sente…` · biblioteca `em psicologia` · `a pessoa repassa`.

---

### Passo 8 — Distribuição (“Continuar”)

**Estética:** `Depois disso, você compartilha o link.` + Instagram / WhatsApp / anúncios  

**Demais (Nutri, Odonto, Nutra, Psi):** `Com esse fluxo montado, o próximo passo é compartilhar o link.` + mesmas três linhas.

---

### Passo 9 — Efeito (“Continuar”)

**Estética**

- `O cliente responde…`
- `E começa a perceber coisas que antes ele não via.`
- `Antes mesmo de falar com você.`

**Demais**

- `Quem entra no link responde às perguntas.`
- `E vai percebendo coisas que antes não enxergava.`
- `Às vezes antes mesmo de te escrever.`

---

### Passo 10 — Benefícios (“Quero testar isso”)

**Estética** — título: `O que muda na prática:`  
Bullets: `menos curiosos perguntando preço` · `menos gente sumindo` · `mais clareza nas conversas` · `mais chance de agendamento` · `E menos esforço pra você.`

**Nutri** — `O que isso muda no seu dia a dia:`  
`menos curioso pedindo preço no escuro` · `menos gente sumindo depois da primeira mensagem` · `mais clareza quando você abre o WhatsApp` · `mais chance de consulta ou plano` · `E menos esforço repetitivo pra você.`

**Odonto** — como Nutri, mas: `menos curioso pedindo preço sem contexto` · `mais chance de avaliação ou retorno`

**Nutra** — como Nutri, mas: `mais chance de pedido com segurança na indicação`

**Psi** — como Nutri, mas: `menos curioso pedindo valor de sessão sem contexto` · `menos conversa que morre na primeira mensagem` · `mais chance de primeira sessão com alinhamento`

---

### Passo 11 — Fechamento (cadastro grátis)

**Estética**

- `Biblioteca com fluxos prontos na estética.`
- `Ou personalize conforme a tua realidade.`
- `Travou? O Noel te guia.`
- `Seu link personalizado: você compartilha, a cliente repassa e o fluxo ganha alcance.`

**Nutri**

- `Biblioteca ou fluxo do seu jeito.` / `Noel quando der branco.` / `Link que o paciente também repassa.`
- `Menos aula gratuita no Zap.` / `Mais conversa com quem já deu o primeiro passo certo.`

**Odonto** — como Nutri, últimas linhas: `Menos consultório gratuito no Zap.`

**Nutra** — como Nutri, mas: `Link que o cliente também repassa.` · `Menos catálogo gratuito no Zap.`

**Psi** — como Nutri, mas: `Link que a pessoa também repassa.` · `Menos triagem gratuita infinita no Zap.`

**CTA final (todas):** `Gostei, quero começar grátis agora` → cadastro com `area=` da vertical.

---

## 4. Observações para análise de copy

1. **Estética** é a única com passo 2 **sem** `Faz sentido?` e com narrativa um pouco mais curta no reframe.
2. **Passos 8–9** Estética usa “cliente” e voz ligeiramente diferente das outras (“Depois disso…” vs “Com esse fluxo montado…”).
3. A **escolha inicial não personaliza texto**: se quiser fluxo realmente direcionado por dor, seria evolução de produto (novos ramos no `STEPS` ou `step` condicional).
4. **Psi** cuida vocabulário clínico no demo (ficheiros separados); na landing, “diagnóstico” aparece sobretudo no ecossistema YLada (link/diagnóstico do produto), não como avaliação CFP no passo a passo da landing.

---

## 5. Ficheiros de código (atualização)

| Área | Componente principal |
|------|----------------------|
| Estética | `src/app/pt/estetica/EsteticaEntradaSocraticaContent.tsx` |
| Nutri | `src/app/pt/nutri/NutriEntradaSocraticaContent.tsx` |
| Odonto | `src/app/pt/odonto/OdontoEntradaSocraticaContent.tsx` |
| Nutra | `src/app/pt/nutra/NutraEntradaSocraticaContent.tsx` |
| Psi | `src/app/pt/psi/PsiEntradaSocraticaContent.tsx` |

*Este documento pode ficar desatualizado se o copy for editado só no código; use-o como snapshot de análise ou regenere a partir dos `STEPS`.*
