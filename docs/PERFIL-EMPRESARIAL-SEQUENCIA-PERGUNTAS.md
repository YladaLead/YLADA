# Perfil empresarial — Sequência de perguntas por área

Documento de referência para análise: **quais perguntas** aparecem em **qual ordem** quando a pessoa escolhe cada tipo de atuação e profissão no perfil empresarial.  
Reflete o estado atual dos fluxos em `src/config/ylada-profile-flows.ts` e `src/types/ylada-profile.ts`.

---

## Como usar

- **Etapa 0** = tela “Área de atuação” (comum a todos).
- **Etapas 1 em diante** = steps do fluxo da profissão escolhida.
- Em cada etapa: **título** (e descrição quando existe), depois a lista **exata das perguntas** na ordem em que aparecem, com tipo (texto, número, select, multiselect) e opções quando for select/multiselect.

---

## Etapa 0 — Área de atuação (todas as áreas)

Texto da tela: *“Isso ajuda o Noel a adaptar as perguntas e as estratégias ao seu tipo de negócio.”*

| # | Pergunta | Tipo | Opções / observação |
|---|----------|------|----------------------|
| 1 | **Você atua como** | select | Atendo clientes diretamente (consultório, clínica, atendimento individual) / Trabalho com vendas de produtos ou serviços (suplementos, cosméticos, etc.) |
| 2 | **Qual é sua área principal?** (se liberal) ou **O que você vende principalmente?** (se vendas) | select | Depende do segmento (ex.: Médico, Estética, Odontologia, Psicológica, Nutrição, Coaching, Suplementos/Nutra, etc.; sempre “Outro” por último) |
| 3 | **Descreva sua atuação** | texto | Só aparece se a pessoa escolheu **Outro** na pergunta 2. Placeholder: “Ex.: outra área de atendimento ou especialidade...” (liberal) ou “Ex.: outro tipo de produto ou serviço que você vende...” (vendas) |

---

## 1. Médico

**Título do topo:** Perfil estratégico para médicos  
**Subtítulo:** Contexto da sua prática e modelo de atuação.  
**Total de etapas:** 1 (área) + 6 = **7 etapas**.

### Etapa 1 — Contexto da sua prática

- **Título:** Como você atua na sua prática médica?
- **Descrição:** Quanto mais específico for seu perfil, mais estratégicas serão as orientações do Noel para sua clínica ou consultório.
- **Frase de reforço (fim da etapa):** Isso ajudará o Noel a orientar você com foco real em posicionamento e agenda.

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | Especialidade principal | texto | — |
| 2 | Subespecialidade (se houver) | texto | — |
| 3 | Você atende principalmente | multiselect | Adultos, Crianças, Idosos, Público feminino, Público masculino, Alta renda, Convênio, Particular |
| 4 | Há quantos anos você atua como médico? | número | — |

### Etapa 2 — Especialidade e aprofundamento

- **Título:** Especialidade e aprofundamento
- **Descrição:** Detalhe sua atuação para orientações mais precisas.

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | Especialidades | multiselect | Clínica geral, Psiquiatria, Ortopedia, Pediatria, Ginecologia, Cardiologia, Dermatologia, Outra |
| 2 | Outra especialidade | texto | (exibido se marcou “Outra”) |
| 3 | Seu foco principal hoje é | select | Consulta de rotina, Tratamento contínuo, Procedimentos, Cirurgia, Acompanhamento crônico |

### Etapa 3 — Diagnóstico

- **Título:** Diagnóstico
- **Descrição:** O que está travando agora na sua prática?

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | O que mais está travando na sua prática agora? | select | Agenda vazia, Agenda instável, Sem indicação, Não converte contatos em consultas, Não consigo postar/divulgar, Leads que não retornam (não reconecto para agendar ou fechar), Falta de autoridade/visibilidade, Poucos remarcam ou retornam, Dificuldade de precificação, Organização da rotina, Outra |
| 2 | Onde você sente maior desperdício hoje? | multiselect | Falta de retorno do paciente, Faltas/cancelamentos, Baixa conversão de indicação, Falta de posicionamento digital, Tempo mal distribuído, Preço abaixo do ideal |
| 3 | O que você quer destravar primeiro? | texto | — |
| 4 | Fase da sua prática | select | Iniciante, Em crescimento, Estabilizado, Escalando |

### Etapa 4 — Metas e modelo

- **Título (stepHeaderPart):** Metas e modelo

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | Você trabalha com | select | Apenas consulta avulsa, Pacotes, Acompanhamento mensal, Procedimentos de alto ticket, Modelo híbrido |
| 2 | Metas principais | texto | — |
| 3 | Objetivos curto e médio prazo | texto | — |
| 4 | Como você atende (consultório, online, etc.) | multiselect | Consultório, Online, Domicílio, Delivery, Clínica |
| 5 | Quantos atendimentos por semana você consegue fazer? | número | — |
| 6 | Valor médio da consulta (R$) | número | — |
| 7 | Forma de pagamento | select | Particular, Convênio, Plano, Recorrência, Avulso, Comissão, Outro |

### Etapa 5 — Canais e rotina

- **Título (stepHeaderPart):** Canais e rotina

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | De onde vêm a maioria dos seus pacientes hoje? | multiselect | Indicação, Instagram, Google, Convênio, Tráfego pago, Parcerias médicas |
| 2 | Você tem secretária ou faz tudo sozinho? | select | Faço tudo, Tenho secretária, Tenho equipe |
| 3 | Como está sua rotina hoje? | textarea | — |
| 4 | Com que frequência você posta ou divulga? | texto | — |

### Etapa 6 — Observações

| # | Pergunta | Tipo |
|---|----------|------|
| 1 | Algo mais que o Noel deve saber? | textarea |

---

## 2. Estética

**Título do topo:** Perfil estratégico para profissionais de estética  
**Total de etapas:** 1 (área) + 6 = **7 etapas**.

### Etapa 1 — Estrutura do seu atendimento

- **Título:** Como está estruturado seu atendimento estético hoje?
- **Descrição:** Vamos entender seu foco principal para que as estratégias sejam direcionadas ao seu tipo de serviço.
- **Frase de reforço:** Isso ajuda o Noel a trabalhar estratégias de agenda e recorrência específicas para o seu nicho.

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | Qual é sua área principal na estética? | select | Facial, Corporal, Capilar, Harmonização, Depilação/Laser, Outro |
| 2 | Você atua como | select | Autônoma, Clínica própria, Dentro de salão, Equipe/colaboradora |
| 3 | Há quantos anos você atua na área? | número | — |

### Etapa 2 — Sua área na estética

- **Título:** Sua área na estética
- **Descrição:** Subárea ou nicho (opcional).

| # | Pergunta | Tipo |
|---|----------|------|
| 1 | Subárea ou nicho (opcional) | texto |

### Etapa 3 — Diagnóstico

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | O que mais está travando agora? | select | (mesmas opções de dor liberal) |
| 2 | O que você quer destravar primeiro? | texto | — |
| 3 | Fase do seu negócio | select | Iniciante, Em crescimento, Estabilizado, Escalando |

### Etapa 4 — Metas e modelo

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | Metas principais | texto | — |
| 2 | Objetivos curto e médio prazo | texto | — |
| 3 | Quantos atendimentos por semana? | número | — |
| 4 | Ticket médio (R$) | número | — |
| 5 | Forma de pagamento | select | Particular, Convênio, Plano, Recorrência, Avulso, Comissão, Outro |

### Etapa 5 — Canais e rotina

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | Onde seus clientes te encontram? | multiselect | Instagram, WhatsApp, Indicação, Tráfego pago |
| 2 | Como está sua rotina hoje? | textarea | — |
| 3 | Com que frequência você posta ou divulga? | texto | — |

### Etapa 6 — Observações

| # | Pergunta | Tipo |
|---|----------|------|
| 1 | Algo mais que o Noel deve saber? | textarea |

---

## 3. Odontologia

**Título do topo:** Perfil estratégico para dentistas  
**Total de etapas:** 1 (área) + 6 = **7 etapas**.

### Etapa 1 — Estrutura do consultório

- **Título:** Como está estruturada sua prática odontológica?
- **Descrição:** Queremos entender sua especialidade e modelo de atuação para direcionar melhor suas estratégias.

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | Especialidade principal | texto | — |
| 2 | Você atende | select | Particular, Convênio, Misto |
| 3 | Há quantos anos atua como dentista? | número | — |

### Etapa 2 — Especialidade

- **Descrição:** Subespecialidade (opcional).

| # | Pergunta | Tipo |
|---|----------|------|
| 1 | Subespecialidade (opcional) | texto |

### Etapa 3 — Diagnóstico

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | O que mais está travando? | select | (dor liberal) |
| 2 | O que você quer destravar primeiro? | texto | — |
| 3 | Fase do consultório | select | Iniciante, Em crescimento, Estabilizado, Escalando |

### Etapa 4 — Metas e modelo

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | Metas principais | texto | — |
| 2 | Objetivos curto e médio prazo | texto | — |
| 3 | Quantos atendimentos por semana? | número | — |
| 4 | Ticket médio (R$) | número | — |
| 5 | Forma de pagamento | select | Particular, Convênio, Plano, etc. |

### Etapa 5 — Canais e rotina

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | Onde seus pacientes te encontram? | multiselect | Instagram, WhatsApp, Indicação, Tráfego pago |
| 2 | Como está sua rotina hoje? | textarea | — |
| 3 | Frequência de postagem | texto | — |

### Etapa 6 — Observações

| # | Pergunta | Tipo |
|---|----------|------|
| 1 | Algo mais que o Noel deve saber? | textarea |

---

## 4. Psicologia

**Título do topo:** Perfil estratégico para psicólogos  
**Total de etapas:** 1 (área) + 6 = **7 etapas**.

### Etapa 1 — Modelo de atendimento

- **Título:** Como você estrutura seus atendimentos?
- **Descrição:** Isso ajuda o Noel a orientar você com foco em posicionamento e captação ética.

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | Abordagem principal | texto | — |
| 2 | Atende qual público? | multiselect | Adultos, Crianças, Casais, Empresas |
| 3 | Há quantos anos você atua na psicologia? | número | — |

### Etapa 2 — Atendimento (modalidade)

- **Título (step):** Atendimento
- **Descrição:** Modalidade principal.

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | Atendimento | select | Presencial, Online, Ambos |

### Etapa 3 — Diagnóstico

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | O que mais está travando? | select | (dor liberal) |
| 2 | O que você quer destravar primeiro? | texto | — |
| 3 | Fase da sua prática | select | Iniciante, Em crescimento, Estabilizado, Escalando |

### Etapa 4 — Metas e modelo

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | Metas principais | texto | — |
| 2 | Objetivos curto e médio prazo | texto | — |
| 3 | Quantos atendimentos por semana? | número | — |
| 4 | Valor médio da sessão (R$) | número | — |
| 5 | Forma de pagamento | select | Particular, Convênio, etc. |

### Etapa 5 — Canais e rotina

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | Onde seus clientes te encontram? | multiselect | Instagram, WhatsApp, Indicação, Tráfego pago |
| 2 | Como está sua rotina hoje? | textarea | — |
| 3 | Frequência de postagem | texto | — |

### Etapa 6 — Observações

| # | Pergunta | Tipo |
|---|----------|------|
| 1 | Algo mais que o Noel deve saber? | textarea |

---

## 5. Nutricionista

**Título do topo:** Perfil estratégico para nutricionistas  
**Total de etapas:** 1 (área) + 6 = **7 etapas**.

### Etapa 1 — Estrutura do atendimento

- **Título:** Como você atua hoje como nutricionista?
- **Descrição:** Vamos entender seu posicionamento para que as estratégias sejam adaptadas ao seu perfil profissional.

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | Área principal de atuação | select | Emagrecimento, Esportiva, Clínica, Infantil, Outro |
| 2 | Atendimento | select | Presencial, Online, Ambos |
| 3 | Tempo de atuação | número | — |

### Etapa 2 — Subárea

- **Descrição:** Subárea (opcional).

| # | Pergunta | Tipo |
|---|----------|------|
| 1 | Subárea (opcional) | texto |

### Etapa 3 — Diagnóstico

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | O que mais está travando? | select | (dor liberal) |
| 2 | O que você quer destravar primeiro? | texto | — |
| 3 | Fase do seu negócio | select | Iniciante, Em crescimento, Estabilizado, Escalando |

### Etapa 4 — Metas e modelo

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | Metas principais | texto | — |
| 2 | Objetivos curto e médio prazo | texto | — |
| 3 | Quantos atendimentos por semana? | número | — |
| 4 | Ticket médio (R$) | número | — |
| 5 | Forma de pagamento | select | Particular, Convênio, etc. |

### Etapa 5 — Canais e rotina

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | Onde seus clientes te encontram? | multiselect | Instagram, WhatsApp, Indicação, Tráfego pago |
| 2 | Como está sua rotina hoje? | textarea | — |
| 3 | Frequência de postagem | texto | — |

### Etapa 6 — Observações

| # | Pergunta | Tipo |
|---|----------|------|
| 1 | Algo mais que o Noel deve saber? | textarea |

---

## 6. Coach

**Título do topo:** Perfil estratégico para coaches  
**Total de etapas:** 1 (área) + 6 = **7 etapas**.

### Etapa 1 — Modelo de atuação

- **Título:** Como você estrutura seu trabalho como coach?
- **Descrição:** Isso ajuda o Noel a orientar você em posicionamento, oferta e autoridade.

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | Nicho principal | texto | — |
| 2 | Modelo de entrega | select | Sessões individuais, Grupo, Programa estruturado |
| 3 | Tempo de atuação | número | — |

### Etapa 2 — Subárea

- **Descrição:** Subárea (opcional).

| # | Pergunta | Tipo |
|---|----------|------|
| 1 | Subárea (opcional) | texto |

### Etapa 3 — Diagnóstico

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | O que mais está travando? | select | (dor liberal) |
| 2 | O que você quer destravar primeiro? | texto | — |
| 3 | Fase do seu negócio | select | Iniciante, Em crescimento, Estabilizado, Escalando |

### Etapa 4 — Metas e modelo

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | Metas principais | texto | — |
| 2 | Objetivos curto e médio prazo | texto | — |
| 3 | Quantas sessões ou entregas por semana? | número | — |
| 4 | Ticket médio (R$) | número | — |
| 5 | Forma de pagamento | select | Particular, Convênio, etc. |

### Etapa 5 — Canais e rotina

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | Onde seus clientes te encontram? | multiselect | Instagram, WhatsApp, Indicação, Tráfego pago |
| 2 | Como está sua rotina hoje? | textarea | — |
| 3 | Frequência de postagem | texto | — |

### Etapa 6 — Observações

| # | Pergunta | Tipo |
|---|----------|------|
| 1 | Algo mais que o Noel deve saber? | textarea |

---

## 7. Vendedor de suplementos (Nutra)

**Título do topo:** Perfil estratégico para vendas de suplementos  
**Total de etapas:** 1 (área) + 5 = **6 etapas**.

### Etapa 1 — Estrutura comercial

- **Título:** Como funciona seu modelo de vendas hoje?
- **Descrição:** Vamos entender seu funil atual para que o Noel possa ajudar a aumentar conversão e ticket.

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | Você vende principalmente | select | Direto ao consumidor, Por equipe/rede, Ambos |
| 2 | Categoria do produto (ex.: vitamínico, proteína) | texto | — |
| 3 | Canal principal de vendas | select | WhatsApp, Instagram, Presencial, Marketplace |

### Etapa 2 — Funil e ticket

- **Título:** Funil e ticket
- **Descrição:** Capacidade, ticket médio e como você cobra.

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | Quantos atendimentos ou vendas por semana? | número | — |
| 2 | Ticket médio (R$) | número | — |
| 3 | Forma de pagamento | select | Particular, Convênio, Plano, Recorrência, Avulso, Comissão, Outro |
| 4 | Fase do negócio | select | Iniciante, Em crescimento, Estabilizado, Escalando |

### Etapa 3 — Dor e prioridade

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | O que mais está travando nas vendas? | select | Sem leads/poucos leads, Não converte leads, Não reconecto leads após o primeiro contato (perco conversões), Ticket médio baixo, Não consigo postar/divulgar, Falta de recorrência, Outra |
| 2 | O que você quer destravar primeiro? | texto | — |

### Etapa 4 — Metas e canais

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | Metas principais | texto | — |
| 2 | Objetivos curto e médio prazo | texto | — |
| 3 | Canais principais | multiselect | Instagram, WhatsApp, Indicação, Tráfego pago |
| 4 | Como está sua rotina hoje? | textarea | — |

### Etapa 5 — Observações

| # | Pergunta | Tipo |
|---|----------|------|
| 1 | Algo mais que o Noel deve saber? | textarea |

---

## 8. Outro (fluxo genérico liberal)

Quando a pessoa escolhe **Atendo clientes diretamente** e **Outro** na área de atuação, usa o fluxo liberal genérico (sem campos específicos de médico/estética/odonto/psi/nutri/coach).

**Título do topo:** Perfil estratégico  
**Total de etapas:** 1 (área) + 6 = **7 etapas**.

### Etapa 1 — Contexto da sua atuação

- **Título:** Como você atua na sua área?
- **Descrição:** Quanto mais específico for seu perfil, mais estratégicas serão as orientações do Noel.

| # | Pergunta | Tipo |
|---|----------|------|
| 1 | Sua área ou especialidade | texto |
| 2 | Subárea (opcional) | texto |
| 3 | Há quantos anos você atua na área? | número |

### Etapa 2 — Detalhes da atuação

- **Descrição:** (fallback do step)

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | Especialidades | multiselect | (lista genérica de especialidades médicas como fallback) |
| 2 | Outra especialidade | texto | (se “Outra”) |

### Etapa 3 — Diagnóstico

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | O que mais está travando? | select | (dor liberal) |
| 2 | O que você quer destravar primeiro? | texto | — |
| 3 | Fase do seu negócio | select | Iniciante, Em crescimento, Estabilizado, Escalando |

### Etapa 4 — Metas e modelo

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | Metas principais | texto | — |
| 2 | Objetivos curto e médio prazo | texto | — |
| 3 | Como você atende | multiselect | Consultório, Online, Domicílio, Delivery, Clínica |
| 4 | Capacidade por semana | número | — |
| 5 | Ticket médio (R$) | número | — |
| 6 | Forma de pagamento | select | Particular, Convênio, etc. |

### Etapa 5 — Canais e rotina

| # | Pergunta | Tipo | Opções |
|---|----------|------|--------|
| 1 | Onde seus clientes te encontram? | multiselect | Instagram, WhatsApp, Indicação, Tráfego pago |
| 2 | Como está sua rotina hoje? | textarea | — |
| 3 | Frequência de postagem | texto | — |

### Etapa 6 — Observações

| # | Pergunta | Tipo |
|---|----------|------|
| 1 | Algo mais que o Noel deve saber? | textarea |

---

## Resumo rápido (quantidade de etapas e perguntas)

| Área | Etapas (incl. área) | Observação |
|------|----------------------|------------|
| Médico | 7 | 6 steps com mais perguntas (público, foco, desperdício, modelo receita, equipe, canais médico) |
| Estética | 7 | Área + tipo atuação em select |
| Odonto | 7 | Você atende: Particular/Convênio/Misto |
| Psicologia | 7 | Público (multiselect) + Atendimento Presencial/Online/Ambos |
| Nutricionista | 7 | Área (Emagrecimento/Esportiva/etc.) + Atendimento |
| Coach | 7 | Nicho + Modelo de entrega (Sessões/Grupo/Programa) |
| Vendedor Suplementos | 6 | 5 steps (estrutura comercial, funil, dor, metas/canais, observações) |
| Outro (liberal) | 7 | Fluxo genérico (category, sub_category, especialidades, dor, metas, canais, observações) |

---

*Documento gerado a partir da configuração atual do perfil empresarial. Para alterar perguntas ou ordem, editar `src/config/ylada-profile-flows.ts` e `src/types/ylada-profile.ts`.*
