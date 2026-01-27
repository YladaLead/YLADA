# 📱 FLUXO COMPLETO - WhatsApp Workshop
## Documento com Todos os Scripts e Fluxos Exatos

**Data:** 2026-01-26  
**Versão:** 1.0

---

## 📋 ÍNDICE

1. [Fluxo Inicial - Cadastro](#1-fluxo-inicial---cadastro)
2. [Fluxo Pré-Aula](#2-fluxo-pré-aula)
3. [Fluxo Pós-Aula - Quem Participou](#3-fluxo-pós-aula---quem-participou)
4. [Fluxo Pós-Aula - Quem NÃO Participou](#4-fluxo-pós-aula---quem-não-participou)
5. [Trabalho de Objeções](#5-trabalho-de-objeções)
6. [Follow-ups Automáticos](#6-follow-ups-automáticos)

---

## 1. FLUXO INICIAL - CADASTRO

### 1.1. Pessoa faz cadastro E clica no botão WhatsApp

**Quando:** Imediatamente após cadastro (sem verificação de horário - 24/7)

**Script Exato:**

```
Olá [NOME], seja bem-vindo! 👋

Obrigada por fazer sua inscrição na Aula Prática ao Vivo de Como Encher a Agenda! 🎉

Teremos aula na próxima [DIA DA SEMANA], [DATA]. Aqui estão as opções:

📅 Opção 1:
[DIASEMANA], [DATA]
🕒 [HORA] (Brasília)

📅 Opção 2:
[DIASEMANA], [DATA]
🕒 [HORA] (Brasília)

Qual você prefere? 💚
```

**Tags adicionadas:** `veio_aula_pratica`, `recebeu_link_workshop`, `primeiro_contato`

**O que acontece depois:**
- Carol responde automaticamente a qualquer mensagem da pessoa
- Se pessoa escolher uma opção, Carol envia link do Zoom
- Se pessoa não responder, recebe follow-ups (ver seção 6)

---

### 1.2. Pessoa faz cadastro mas NÃO clica no botão

**Quando:** Agendado automaticamente (respeita horário comercial: 8h-19h seg-sex, até 13h sábado)

**Script Exato:**

```
Olá [NOME], seja bem-vindo! 👋

Obrigada por fazer sua inscrição na Aula Prática ao Vivo de Como Encher a Agenda! 🎉

Aqui estão as duas próximas opções de aula:

🗓️ **Opção 1:**
[DIASEMANA], [DATA]
🕒 [HORA] (Brasília)
🔗 [LINK ZOOM]

🗓️ **Opção 2:**
[DIASEMANA], [DATA]
🕒 [HORA] (Brasília)
🔗 [LINK ZOOM]

✅ Se precisar reagendar, responda REAGENDAR.

Qualquer dúvida, é só me chamar! 💚

Carol - Secretária YLADA Nutri
```

**Tags adicionadas:** `veio_aula_pratica`, `recebeu_link_workshop`, `primeiro_contato`

**O que acontece depois:**
- Se pessoa responder, Carol responde automaticamente
- Se pessoa não responder, recebe follow-ups (ver seção 6)

---

### 1.3. Primeira Mensagem da Pessoa (Carol responde automaticamente)

**Quando:** Pessoa envia qualquer mensagem pela primeira vez

**Script Exato (gerado pela IA - pode variar, mas segue este padrão):**

```
Oi [NOME], tudo bem? 😊

Seja muito bem-vinda!

Eu sou a Carol, da equipe Ylada Nutri.

Obrigada por se inscrever na Aula Prática ao Vivo – Agenda Cheia para Nutricionistas.

Essa aula é 100% prática e foi criada para ajudar nutricionistas que estão com agenda ociosa a organizar, atrair e preencher atendimentos de forma mais leve e estratégica.

As próximas aulas ao vivo vão acontecer nos seguintes dias e horários:

🗓️ **Opção 1:**
[DIASEMANA], [DATA]
🕒 [HORA] (horário de Brasília)

🗓️ **Opção 2:**
[DIASEMANA], [DATA]
🕒 [HORA] (horário de Brasília)

Qual desses horários funciona melhor pra você? 😊
```

**Nota:** Carol usa IA (OpenAI) para gerar respostas personalizadas, mas sempre segue o padrão acima na primeira mensagem.

---

## 2. FLUXO PRÉ-AULA

### 2.1. Notificação 24h Antes

**Quando:** 24 horas antes da aula (respeita horário comercial)

**Script Exato:**

```
Olá [NOME]! 👋

Lembrete: Sua aula é amanhã!

🗓️ [DIASEMANA], [DATA]
🕒 [HORA] (horário de Brasília)

🔗 [LINK ZOOM]

Nos vemos lá! 😊

Carol - Secretária YLADA Nutri
```

---

### 2.2. Notificação 12h Antes

**Quando:** 12 horas antes da aula (respeita horário comercial)

**Script Exato:**

```
Olá [NOME]! 

Sua aula é hoje às [HORA]! 

💻 *Recomendação importante:*

O ideal é participar pelo computador ou notebook, pois:
* Compartilhamos slides
* Fazemos explicações visuais
* É importante acompanhar e anotar

Pelo celular, a experiência fica limitada e você pode perder partes importantes da aula.

🔗 [LINK ZOOM]

Carol - Secretária YLADA Nutri
```

---

### 2.3. Notificação 2h Antes

**Quando:** 2 horas antes da aula (respeita horário comercial)

**Script Exato:**

```
Olá [NOME]! 

Sua aula começa em 2 horas! ⏰

⚠️ *Aviso importante:*

A sala do Zoom será aberta 10 minutos antes do horário da aula.

⏰ Após o início da aula, não será permitido entrar, ok?

Isso porque os 10 primeiros minutos são essenciais:
é nesse momento que identificamos os principais desafios das participantes para que a aula seja realmente prática e personalizada.

🔗 [LINK ZOOM]

Nos vemos em breve! 😊

Carol - Secretária YLADA Nutri
```

---

### 2.4. Notificação 30min Antes

**Quando:** 30 minutos antes da aula (respeita horário comercial)

**Script Exato:**

```
Olá [NOME]! 

A sala já está aberta! 🎉

🔗 [LINK ZOOM]

Você pode entrar agora e já começar a se preparar! 

Nos vemos em breve! 😊

Carol - Secretária YLADA Nutri
```

---

## 3. FLUXO PÓS-AULA - QUEM PARTICIPOU

### 3.1. Link de Cadastro (Imediato após marcar "participou")

**Quando:** Quando admin marca como "participou_aula" (respeita horário comercial)

**Script Exato:**

```
Olá [NOME]! 💚

Excelente! Parabéns por ter participado! 🎉

Espero que tenha gostado e tenho certeza que isso realmente pode fazer diferença na sua vida.

Agora me conta: o que você mais gostou? E como você prefere começar?

Você prefere começar com o plano mensal para validar e verificar, ou você já está determinado a mudar sua vida e prefere o plano anual?

🔗 [LINK DE CADASTRO - https://www.ylada.com/pt/nutri#oferta]

O que você acha? 😊

Carol - Secretária YLADA Nutri
```

**Tags adicionadas:** `participou_aula`, `registration_link_sent`

---

### 3.2. Follow-up 15min Depois

**Quando:** 15 minutos após término da aula (respeita horário comercial)

**Script Exato:**

```
Olá! 

Espero que tenha gostado da aula! 😊

Como foi sua experiência? Tem alguma dúvida?

Carol - Secretária YLADA Nutri
```

---

### 3.3. Follow-up 2h Depois

**Quando:** 2 horas após término da aula (respeita horário comercial)

**Script Exato:**

```
Olá! 

Como está se sentindo após a aula? 

Se tiver alguma dúvida sobre o que foi apresentado, estou aqui para ajudar! 😊

Carol - Secretária YLADA Nutri
```

---

### 3.4. Follow-up 24h Depois

**Quando:** 24 horas após término da aula (respeita horário comercial)

**Script Exato:**

```
Olá! 

Passou um dia desde a aula. Como está sendo aplicar o que aprendeu?

Se precisar de ajuda ou tiver dúvidas, estou aqui! 💚

Carol - Secretária YLADA Nutri
```

---

### 3.5. Follow-up de Vendas - 3h Depois

**Quando:** 3 horas após término da aula (respeita horário comercial)

**Script Exato:**

```
Oi [NOME]! 

Ficou alguma dúvida? 

Você não quer começar? Vamos começar?

O que está passando pela sua cabeça? 😊

Carol - Secretária YLADA Nutri
```

---

### 3.6. Follow-up de Vendas - 12h Depois

**Quando:** 12 horas após término da aula (respeita horário comercial)

**Script Exato:**

```
Olá [NOME]! 💚

Lembro do motivo que te trouxe até aqui... 🌟

Você tinha um sonho, um objetivo. Algo que te moveu a buscar essa mudança.

Pensa comigo: quanto custa NÃO mudar? Quanto custa continuar adiando esse sonho?

O investimento é de apenas R$ 197 por mês. Menos de R$ 7 por dia.

Pensa no que você vai ganhar: um estado de espírito completamente diferente, a transformação que você busca, a realização desse sonho que te moveu até aqui.

E você pode começar pelo menos com o mensal para se certificar de que é isso mesmo que você quer. Sem compromisso de longo prazo.

Qual é a sua maior dúvida ou objeção para começar agora? 😊

Carol - Secretária YLADA Nutri
```

---

### 3.7. Follow-up de Vendas - 24h Depois

**Quando:** 24 horas após término da aula (respeita horário comercial)

**Script Exato:**

```
Olá [NOME]! 

Passou um dia desde a aula... 

E eu fico pensando: será que você já começou a aplicar o que aprendeu? 

Ou será que ainda está esperando o "momento perfeito"? 

Sabe, o momento perfeito não existe. O momento certo é AGORA. 

Você veio até aqui porque tinha um sonho. Pensa: quanto custa NÃO realizar esse sonho? Quanto custa continuar adiando?

O investimento é de apenas R$ 197 por mês. Menos de R$ 7 por dia para transformar sua vida.

Pensa no estado de espírito que você vai adquirir, na transformação que você busca, na realização desse sonho.

E você pode começar pelo menos com o mensal para se certificar. Sem pressão, sem compromisso de longo prazo.

O que está te impedindo de começar agora? É o investimento, o tempo, ou alguma dúvida específica? 💚

Carol - Secretária YLADA Nutri
```

---

### 3.8. Follow-up de Vendas - 48h Depois (Última)

**Quando:** 48 horas após término da aula (respeita horário comercial)

**Script Exato:**

```
Olá [NOME]! 

Esta é minha última mensagem sobre isso... 

Mas antes, quero te lembrar: você veio até aqui por um motivo. 

Você tinha um sonho, um objetivo. Algo que te moveu. 

Pensa: quanto custa NÃO mudar? Quanto custa continuar adiando esse sonho que te trouxe até aqui?

O investimento é de apenas R$ 197 por mês. Menos de R$ 7 por dia.

Pensa no que você vai ganhar: um estado de espírito completamente diferente, a transformação que você busca, a realização desse sonho.

E você pode começar pelo menos com o mensal para se certificar. Sem compromisso, sem pressão.

Não deixe que esse momento passe. Não deixe que a vida te distraia do que realmente importa. 

Você merece ver esse sonho se tornar realidade.

Qual é a sua maior objeção? Investimento, tempo, ou outra coisa? 

O que está te travando exatamente? O momento é AGORA. Vamos conversar? 💚

Carol - Secretária YLADA Nutri
```

---

## 4. FLUXO PÓS-AULA - QUEM NÃO PARTICIPOU

### 4.1. Remarketing (Imediato após marcar "não participou")

**Quando:** Quando admin marca como "nao_participou_aula" (respeita horário comercial)

**Script Exato:**

```
Olá [NOME]! 👋

Vi que você não conseguiu participar da aula anterior. Tudo bem, acontece! 😊

Que tal tentarmos novamente? Aqui estão novas opções de dias e horários:

🗓️ **Opção 1:**
[DIASEMANA], [DATA]
🕒 [HORA] (Brasília)
🔗 [LINK ZOOM]

🗓️ **Opção 2:**
[DIASEMANA], [DATA]
🕒 [HORA] (Brasília)
🔗 [LINK ZOOM]

Se alguma dessas opções funcionar para você, é só me avisar! 

Qualquer dúvida, estou aqui! 💚

Carol - Secretária YLADA Nutri
```

**Tags adicionadas:** `nao_participou_aula`, `recebeu_segundo_link`

**Nota:** Se pessoa responder, Carol trabalha automaticamente com IA para entender objeções e trabalhar vendas.

---

## 5. TRABALHO DE OBJEÇÕES

### 5.1. Como Carol Trabalha Objeções

Carol usa **IA (OpenAI)** para detectar e trabalhar objeções automaticamente. Ela segue estas diretrizes:

**Princípios:**
- Sempre trabalha o emocional: lembra o motivo, o sonho, o objetivo
- Provoca que a pessoa fale: "O que você acha?", "O que te preocupa?", "O que está te impedindo?"
- Não aceita "não" sem entender o motivo real
- Usa perguntas abertas para entender melhor a objeção
- Trabalha cada objeção de forma específica e personalizada
- Sempre oferece soluções, não apenas responde objeções

---

### 5.2. Objeções Comuns e Como Carol Trabalha

#### **1. PREÇO / VALOR**

**Carol responde (exemplos gerados pela IA):**

```
Entendo sua preocupação com o investimento. Vamos pensar juntas: quanto você está perdendo por NÃO ter uma agenda cheia? Quanto você ganharia se tivesse 10 clientes a mais por mês? O investimento se paga rapidamente quando você aplica o que aprende.
```

OU

```
Sei que parece um investimento agora, mas pense no retorno. Quantas consultas você precisa fazer para recuperar esse valor? Provavelmente apenas algumas. E depois disso, é só lucro.
```

OU

```
Que tal pensarmos de outra forma? Quanto você investiria em uma consultoria que te ensina a encher sua agenda? Esse é exatamente o que você está recebendo, mas por uma fração do preço.
```

---

#### **2. TEMPO**

**Carol responde (exemplos gerados pela IA):**

```
Sei que tempo é precioso. Por isso criamos algo prático e eficiente. Você não precisa dedicar horas e horas. São estratégias que você aplica no seu dia a dia, enquanto trabalha.
```

OU

```
Entendo sua preocupação com tempo. Mas pense: quanto tempo você gasta tentando conseguir clientes sem resultado? Com essas estratégias, você vai economizar tempo e ter mais resultados.
```

---

#### **3. DÚVIDA / INCERTEZA**

**Carol responde (exemplos gerados pela IA):**

```
Que bom que você está pensando! Isso mostra que você leva a sério. O que especificamente te deixa em dúvida? Posso ajudar a esclarecer.
```

OU

```
É normal ter dúvidas. Muitas pessoas que estão aqui hoje também tinham. O que te ajudaria a ter mais certeza?
```

---

#### **4. "VOU PENSAR" / "PRECISO CONVERSAR"**

**Carol responde (exemplos gerados pela IA):**

```
Claro! O que você precisa pensar? Posso ajudar a esclarecer qualquer dúvida.
```

OU

```
Entendo. Com quem você precisa conversar? Posso preparar informações para você compartilhar.
```

OU

```
Que bom que você quer pensar! Mas me diga: o que especificamente você precisa pensar? Às vezes, quando a gente coloca em palavras, fica mais claro.
```

---

#### **5. "NÃO TENHO DINHEIRO AGORA"**

**Carol responde (exemplos gerados pela IA):**

```
Entendo. Que tal começarmos de forma mais acessível? Temos opções que podem se encaixar melhor no seu momento.
```

OU

```
Sei que dinheiro pode ser uma preocupação. Mas pense: quanto você está perdendo por não ter clientes? Às vezes, o que falta é justamente o que vai te ajudar a ter mais.
```

---

#### **6. "JÁ TENHO MUITAS COISAS"**

**Carol responde (exemplos gerados pela IA):**

```
Entendo que você já tem muitas coisas para fazer. Por isso criamos algo prático e direto. Você não precisa mudar tudo, apenas aplicar estratégias específicas.
```

OU

```
Sei que pode parecer mais uma coisa na sua lista. Mas essa é diferente: é algo que vai te ajudar a organizar tudo e ter mais resultados.
```

---

### 5.3. Estratégia de Carol para Objeções

**Sempre:**
1. **Provoca que a pessoa fale mais:** "O que especificamente?", "Me conta mais sobre isso"
2. **Nunca aceita um "não" sem entender o motivo real**
3. **Trabalha o emocional:** lembra o sonho, o motivo, o objetivo
4. **Oferece soluções:** não apenas responde objeções
5. **É empática mas persistente**

**Exemplo de conversa com objeção:**

```
Pessoa: "É muito caro"

Carol: "Entendo sua preocupação. O que especificamente te preocupa no investimento? É o valor mensal ou você prefere pensar em outra forma de pagamento?"

Pessoa: "Não tenho dinheiro agora"

Carol: "Sei que dinheiro pode ser uma preocupação. Mas pense: quanto você está perdendo por não ter clientes? Às vezes, o que falta é justamente o que vai te ajudar a ter mais. Que tal começarmos de forma mais acessível? Temos opções que podem se encaixar melhor no seu momento."
```

---

## 6. FOLLOW-UPS AUTOMÁTICOS

### 6.1. Follow-up para Quem Não Respondeu - 24h

**Quando:** 24 horas após receber boas-vindas (respeita horário comercial)

**Script Exato:**

```
Olá! 👋

Vi que você ainda não escolheu um horário para a aula. 

Ainda está disponível? Se precisar de ajuda, é só me chamar! 😊

Carol - Secretária YLADA Nutri
```

---

### 6.2. Follow-up para Quem Não Respondeu - 48h

**Quando:** 48 horas após receber boas-vindas (respeita horário comercial)

**Script Exato:**

```
Olá! 

Ainda estou aqui caso queira agendar a aula. 

Se alguma dessas opções funcionar, é só me avisar:

🗓️ *Opções Disponíveis:*

*Opção 1:*
[DIASEMANA], [DATA]
🕒 [HORA] (horário de Brasília)

*Opção 2:*
[DIASEMANA], [DATA]
🕒 [HORA] (horário de Brasília)

Qualquer dúvida, estou à disposição! 💚

Carol - Secretária YLADA Nutri
```

---

### 6.3. Follow-up para Quem Não Respondeu - 72h (Última)

**Quando:** 72 horas após receber boas-vindas (respeita horário comercial)

**Script Exato:**

```
Olá! 

Esta é minha última mensagem sobre a aula. Se ainda tiver interesse, me avise! 

Caso contrário, tudo bem também. 😊

Carol - Secretária YLADA Nutri
```

**Tags adicionadas:** `sem_resposta`

---

## 7. HORÁRIOS DE ENVIO

### 7.1. Respostas Imediatas (24/7 - Sem verificação de horário)
- ✅ Quando pessoa faz cadastro e clica no botão WhatsApp
- ✅ Respostas automáticas da Carol (quando pessoa envia mensagem)

### 7.2. Mensagens Agendadas (Respeitam horário comercial)
- ⏰ **Segunda a Sexta:** 8h00 às 19h00 (horário de Brasília)
- ⏰ **Sábado:** 8h00 às 13h00
- ⏰ **Domingo:** Não envia (exceto lembretes especiais de segunda 10h)

**Mensagens que respeitam horário:**
- Boas-vindas agendadas
- Notificações pré-aula
- Remarketing
- Follow-ups
- Link de cadastro após participar

---

## 8. TAGS DO SISTEMA

### Tags Principais:
- `veio_aula_pratica` - Recebeu boas-vindas
- `recebeu_link_workshop` - Recebeu link do workshop
- `primeiro_contato` - Primeiro contato
- `agendou_aula` - Agendou uma sessão
- `participou_aula` - Participou da aula
- `nao_participou_aula` - Não participou da aula
- `registration_link_sent` - Link de cadastro enviado
- `recebeu_segundo_link` - Recebeu remarketing
- `sem_resposta` - Não respondeu após 72h
- `cliente_nutri` - Já é cliente

---

## 9. OBSERVAÇÕES IMPORTANTES

### 9.1. Respostas da Carol (IA)
- Carol usa **OpenAI GPT** para gerar respostas personalizadas
- Respostas variam, mas sempre seguem as diretrizes do System Prompt
- Carol lê o histórico completo antes de responder
- Carol NÃO repete informações já ditas
- Carol trabalha objeções automaticamente

### 9.2. Cancelamento Automático
- Se pessoa responde após receber boas-vindas agendadas, mensagens pendentes são canceladas
- Sistema detecta automaticamente quando pessoa responde

### 9.3. Processamento Automático
- Use o botão "🚀 Processar TUDO Automaticamente" na página `/admin/whatsapp/automation`
- Ou marque o checkbox para processar automaticamente ao abrir a página

---

## 10. RESUMO DO FLUXO COMPLETO

```
1. PESSOA FAZ CADASTRO
   ├─ Clica no botão WhatsApp → Resposta IMEDIATA (24/7)
   └─ NÃO clica → Boas-vindas agendadas (horário comercial)

2. PESSOA RECEBE BOAS-VINDAS
   ├─ Responde → Carol responde automaticamente (IA)
   └─ NÃO responde → Follow-ups 24h, 48h, 72h

3. PESSOA AGENDA AULA
   └─ Recebe notificações: 24h, 12h, 2h, 30min antes

4. APÓS AULA
   ├─ PARTICIPOU
   │  ├─ Link de cadastro imediato
   │  ├─ Follow-ups: 15min, 2h, 24h
   │  └─ Follow-ups de vendas: 3h, 12h, 24h, 48h
   │
   └─ NÃO PARTICIPOU
      └─ Remarketing com novas opções

5. TRABALHO DE OBJEÇÕES
   └─ Carol trabalha automaticamente (IA) quando detecta objeções
```

---

**Fim do Documento**
