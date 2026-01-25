# 📋 Fluxo Completo da Carol - Workshop até Pós-Participação

## 🎯 VISÃO GERAL DO FLUXO

```
WORKSHOP → BOAS-VINDAS → AGENDAMENTO → NOTIFICAÇÕES PRÉ-AULA → AULA → PÓS-AULA
```

---

## 📥 FASE 1: CHEGADA DO WORKSHOP

### **Cenário A: Pessoa preenche workshop e NÃO chama no WhatsApp**

**Quando:** Pessoa preenche formulário do workshop

**Ação Automática (Cron Job):**
- **Tempo:** Executa diariamente (ex: 09:00)
- **Busca:** Leads dos últimos 7 dias que não têm conversa ativa
- **Envia:** Mensagem de boas-vindas com opções

**Mensagem Enviada:**
```
Olá [Nome], seja bem-vindo! 👋

Obrigada por fazer sua inscrição na Aula Prática ao Vivo de Como Encher a Agenda! 🎉

📅 *Opções de Aula Disponíveis:*

*Opção 1:*
Segunda-feira, 26/01/2026
🕒 10:00 (horário de Brasília)

*Opção 2:*
Segunda-feira, 26/01/2026
🕒 15:00 (horário de Brasília)

💬 *Qual você prefere?*
Digite o número da opção (ex: "1", "opção 1", "primeira") ou o dia/horário (ex: "segunda às 10:00")

Carol - Secretária YLADA Nutri
```

**Tags Adicionadas:**
- `veio_aula_pratica`
- `recebeu_link_workshop`
- `primeiro_contato`

---

### **Cenário B: Pessoa preenche workshop e CHAMA no WhatsApp**

**Quando:** Pessoa envia primeira mensagem no WhatsApp

**Reação da Carol:**
- Carol responde automaticamente
- Se pergunta sobre horários → Envia opções
- Se pergunta sobre a aula → Explica brevemente
- Se quer agendar → Envia opções

**Tags Adicionadas:**
- `veio_aula_pratica`
- `primeiro_contato`

---

## ⏰ FASE 2: AGENDAMENTO

### **Se Pessoa NÃO Responde (Após Boas-vindas)**

**Notificação 1:** 24 horas depois
```
Olá! 👋

Vi que você ainda não escolheu um horário para a aula. 

Ainda está disponível? Se precisar de ajuda, é só me chamar! 😊

Carol - Secretária YLADA Nutri
```

**Notificação 2:** 48 horas depois (se ainda não respondeu)
```
Olá! 

Ainda estou aqui caso queira agendar a aula. 

Se alguma dessas opções funcionar, é só me avisar:

📅 *Opções Disponíveis:*
[Opções atualizadas]

Qualquer dúvida, estou à disposição! 💚

Carol - Secretária YLADA Nutri
```

**Notificação 3:** 72 horas depois (última tentativa)
```
Olá! 

Esta é minha última mensagem sobre a aula. Se ainda tiver interesse, me avise! 

Caso contrário, tudo bem também. 😊

Carol - Secretária YLADA Nutri
```

**Tags Adicionadas:**
- `sem_resposta` (após 72h sem resposta)

---

### **Se Pessoa Responde mas NÃO Agenda**

**Quando:** Pessoa responde mas não escolhe opção

**Reação da Carol:**
- Tenta entender o que a pessoa precisa
- Oferece ajuda
- Reenvia opções se necessário
- Mantém conversa natural

**Notificação:** 12 horas depois (se não agendou)
```
Olá! 

Vi que você respondeu mas ainda não escolheu um horário. 

Precisa de ajuda para decidir? Posso te ajudar! 😊

Carol - Secretária YLADA Nutri
```

---

### **Quando Pessoa ESCOLHE uma Opção**

**Ação Imediata:**
1. Carol detecta escolha ("1", "opção 1", "segunda às 10:00")
2. Envia **imagem do flyer** (se configurado)
3. Envia **mensagem com link** específico

**Mensagem com Link:**
```
✅ *Perfeito! Aqui está o link da sua aula:*

📅 Segunda-feira, 26/01/2026
🕒 10:00 (horário de Brasília)

🔗 https://us02web.zoom.us/j/...

✅ Se precisar reagendar, responda REAGENDAR.

Qualquer dúvida, estou aqui! 💚

Carol - Secretária YLADA Nutri
```

**Tags Adicionadas:**
- `recebeu_link_workshop`
- `agendou_aula`

**Dados Salvos:**
- `workshop_session_id`: ID da sessão escolhida
- `scheduled_date`: Data/hora da sessão

---

## 📅 FASE 3: NOTIFICAÇÕES PRÉ-AULA

### **24 Horas Antes da Aula**

**Mensagem:**
```
Olá! 👋

Lembrete: Sua aula é amanhã!

📅 Segunda-feira, 26/01/2026
🕒 10:00 (horário de Brasília)

🔗 https://us02web.zoom.us/j/...

Nos vemos lá! 😊

Carol - Secretária YLADA Nutri
```

---

### **12 Horas Antes da Aula**

**Mensagem:**
```
Olá! 

Sua aula é hoje às 10:00! 

💻 *Recomendação importante:*

O ideal é participar pelo computador ou notebook, pois:
* Compartilhamos slides
* Fazemos explicações visuais
* É importante acompanhar e anotar

Pelo celular, a experiência fica limitada e você pode perder partes importantes da aula.

🔗 https://us02web.zoom.us/j/...

Carol - Secretária YLADA Nutri
```

---

### **2 Horas Antes da Aula**

**Mensagem:**
```
Olá! 

Sua aula começa em 2 horas! ⏰

⚠️ *Aviso importante:*

A sala do Zoom será aberta 10 minutos antes do horário da aula.

⏰ Após o início da aula, não será permitido entrar, ok?

Isso porque os 10 primeiros minutos são essenciais:
é nesse momento que identificamos os principais desafios das participantes para que a aula seja realmente prática e personalizada.

🔗 https://us02web.zoom.us/j/...

Nos vemos em breve! 😊

Carol - Secretária YLADA Nutri
```

---

### **10 Minutos Antes da Aula**

**Mensagem:**
```
Olá! 

A sala do Zoom já está aberta! 🎉

Você pode entrar agora:

🔗 https://us02web.zoom.us/j/...

Nos vemos em 10 minutos! 😊

Carol - Secretária YLADA Nutri
```

---

## ✅ FASE 4: APÓS A AULA (Se Participou)

### **IMPORTANTE: Você Etiqueta Primeiro!**

**Após a aula, você adiciona manualmente a tag:**
- ✅ `participou_aula` - Se a pessoa participou
- ❌ `nao_participou_aula` - Se a pessoa não participou

**Depois disso, o sistema inicia automaticamente:**

### **Processo de Fechamento/Vendas (Automático)**

**3 Horas Depois:**
```
Lembro que você veio porque tinha um sonho...
Agora que você já viu o caminho, que tal darmos o próximo passo juntas?
```

**6 Horas Depois:**
```
Você não precisa fazer isso sozinha.
Estou aqui para te apoiar em cada passo dessa jornada.
```

**12 Horas Depois:**
```
Lembro do motivo que te trouxe até aqui...
Não deixe que esse momento passe.
```

**24 Horas Depois:**
```
O momento perfeito não existe. O momento certo é AGORA.
Você já deu o primeiro passo. Agora é hora de dar o segundo.
```

**48 Horas Depois (Última):**
```
Esta é minha última mensagem sobre isso...
Você veio até aqui por um motivo. Não deixe passar mais tempo.
```

**Tags Adicionadas:**
- `participou_aula` (você adiciona manualmente)
- Processo de fechamento inicia automaticamente

---

## ❌ FASE 5: APÓS A AULA (Se NÃO Participou)

### **Imediatamente Após o Horário da Aula**

**Mensagem:**
```
Olá! 

Vi que você não conseguiu participar da aula hoje. Tudo bem, acontece! 😊

Que tal tentarmos novamente? Aqui estão novas opções de dias e horários:

📅 *Opções Disponíveis:*
[Novas opções]

Se alguma dessas opções funcionar para você, é só me avisar! 

Qualquer dúvida, estou aqui! 💚

Carol - Secretária YLADA Nutri
```

**Tags Adicionadas:**
- `nao_participou_aula`
- `recebeu_segundo_link`

---

### **48 Horas Depois (Se Não Respondeu ao Remarketing)**

**Mensagem:**
```
Olá! 

Ainda estou aqui caso queira reagendar a aula. 

Se tiver interesse, me avise! 😊

Carol - Secretária YLADA Nutri
```

---

## 📊 RESUMO DOS INTERVALOS

| Fase | Quando | Intervalo | Ação |
|------|--------|-----------|------|
| **Boas-vindas** | Após preencher workshop | Imediato (cron diário) | Envia opções |
| **Não responde** | Após boas-vindas | 24h, 48h, 72h | Notifica |
| **Responde mas não agenda** | Após resposta | 12h | Oferece ajuda |
| **Agendou** | Imediato | 0h | Envia link + flyer |
| **Pré-aula** | Antes da aula | 24h, 12h, 2h, 10min | Lembretes |
| **Pós-aula (participou)** | Após aula | 15min, 2h, 24h | Follow-up |
| **Pós-aula (não participou)** | Após horário | Imediato, 48h | Remarketing |

---

## 🏷️ TAGS POR FASE

### **Fase 1: Chegada**
- `veio_aula_pratica`
- `primeiro_contato`

### **Fase 2: Agendamento**
- `recebeu_link_workshop`
- `agendou_aula`

### **Fase 3: Pré-Aula**
- (Sem tags novas, mantém `agendou_aula`)

### **Fase 4: Pós-Aula (Participou)**
- `participou_aula`

### **Fase 5: Pós-Aula (Não Participou)**
- `nao_participou_aula`
- `recebeu_segundo_link`

---

## 💬 MENSAGENS ESPECÍFICAS (Conforme Solicitado)

### **Mensagem 1: Recomendação de Computador**
```
💻 Recomendação importante:

O ideal é participar pelo computador ou notebook, pois:
* Compartilhamos slides
* Fazemos explicações visuais
* É importante acompanhar e anotar

Pelo celular, a experiência fica limitada e você pode perder partes importantes da aula.
```

**Quando enviar:** 12 horas antes da aula

---

### **Mensagem 2: Aviso sobre Zoom**
```
⚠️ Aviso importante:

A sala do Zoom será aberta 10 minutos antes do horário da aula.

⏰ Após o início da aula, não será permitido entrar, ok?

Isso porque os 10 primeiros minutos são essenciais:
é nesse momento que identificamos os principais desafios das participantes para que a aula seja realmente prática e personalizada.
```

**Quando enviar:** 2 horas antes da aula

---

## 🔄 FLUXO VISUAL COMPLETO

```
┌─────────────────────────────────────┐
│  PESSOA PREENCHE WORKSHOP           │
└──────────────┬──────────────────────┘
               │
               ├─→ NÃO CHAMA
               │   ↓
               │   [24h] Boas-vindas automáticas
               │   ↓
               │   [24h] Notificação 1
               │   ↓
               │   [48h] Notificação 2
               │   ↓
               │   [72h] Notificação 3 (última)
               │
               └─→ CHAMA NO WHATSAPP
                   ↓
                   Carol responde automaticamente
                   ↓
                   ┌─→ PERGUNTA HORÁRIOS
                   │   ↓
                   │   Carol envia opções
                   │   ↓
                   │   ┌─→ ESCOLHE OPÇÃO
                   │   │   ↓
                   │   │   Carol envia flyer + link
                   │   │   ↓
                   │   │   [24h antes] Lembrete
                   │   │   ↓
                   │   │   [12h antes] Recomendação computador
                   │   │   ↓
                   │   │   [2h antes] Aviso Zoom
                   │   │   ↓
                   │   │   [30min antes] Sala aberta
                   │   │   ↓
                   │   │   ┌─→ PARTICIPOU
                   │   │   │   ↓
                   │   │   │   [15min depois] Como foi?
                   │   │   │   ↓
                   │   │   │   [2h depois] Como está se sentindo?
                   │   │   │   ↓
                   │   │   │   [24h depois] Como está aplicando?
                   │   │   │
                   │   │   └─→ NÃO PARTICIPOU
                   │   │       ↓
                   │   │       [Imediato] Remarketing
                   │   │       ↓
                   │   │       [48h depois] Última tentativa
                   │   │
                   │   └─→ NÃO ESCOLHE
                   │       ↓
                   │       [12h depois] Oferece ajuda
                   │
                   └─→ PERGUNTA OUTRA COISA
                       ↓
                       Carol responde naturalmente
```

---

## ⚙️ IMPLEMENTAÇÃO TÉCNICA

### **Cron Jobs Necessários:**

1. **Boas-vindas (Diário - 09:00)**
   - Função: `sendWelcomeToNonContactedLeads()`

2. **Notificações Pré-Aula (A cada hora)**
   - Verifica quem agendou
   - Envia lembretes conforme horário

3. **Follow-up Pós-Aula (A cada hora)**
   - Verifica quem participou
   - Envia mensagens conforme horário

4. **Remarketing (Diário - 10:00)**
   - Função: `sendRemarketingToNonParticipants()`

---

**Última atualização:** 2026-01-25
**Versão:** 1.0
