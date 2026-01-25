# 📋 Resumo do Fluxo Completo da Carol

## 🎯 FLUXO VISUAL SIMPLIFICADO

```
┌─────────────────────────────────────┐
│  PESSOA PREENCHE WORKSHOP           │
└──────────────┬──────────────────────┘
               │
               ├─→ NÃO CHAMA NO WHATSAPP
               │   ↓
               │   [DIA 1 - 09:00] Boas-vindas automáticas
               │   ↓
               │   [DIA 2 - 09:00] Notificação 1 (24h depois)
               │   ↓
               │   [DIA 3 - 09:00] Notificação 2 (48h depois)
               │   ↓
               │   [DIA 4 - 09:00] Notificação 3 (72h depois - ÚLTIMA
               │
               └─→ CHAMA NO WHATSAPP
                   ↓
                   Carol responde automaticamente
                   ↓
                   ┌─→ PERGUNTA HORÁRIOS
                   │   ↓
                   │   Carol envia opções (sem links)
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

## ⏰ CRONOGRAMA COMPLETO

### **FASE 1: CHEGADA (DIA 1)**

| Horário | Ação | Mensagem |
|---------|------|----------|
| **09:00** | Boas-vindas automáticas | Opções de aula (sem links) |

---

### **FASE 2: FOLLOW-UP (Se não respondeu)**

| Horário | Ação | Mensagem |
|---------|------|----------|
| **DIA 2 - 09:00** | Notificação 1 (24h depois) | "Vi que você ainda não escolheu..." |
| **DIA 3 - 09:00** | Notificação 2 (48h depois) | "Ainda estou aqui..." + Opções |
| **DIA 4 - 09:00** | Notificação 3 (72h depois) | "Esta é minha última mensagem..." |

---

### **FASE 3: AGENDAMENTO (Quando escolhe)**

| Horário | Ação | Mensagem |
|---------|------|----------|
| **Imediato** | Flyer + Link | Link específico da reunião |

---

### **FASE 4: PRÉ-AULA**

| Horário | Ação | Mensagem |
|---------|------|----------|
| **24h antes** | Lembrete | "Sua aula é amanhã!" |
| **12h antes** | Recomendação computador | Mensagem sobre computador/notebook |
| **2h antes** | Aviso Zoom | Mensagem sobre 10 minutos antes |
| **30min antes** | Sala aberta | "A sala já está aberta!" |

---

### **FASE 5: PÓS-AULA (Se participou)**

| Horário | Ação | Mensagem |
|---------|------|----------|
| **15min depois** | Follow-up 1 | "Como foi sua experiência?" |
| **2h depois** | Follow-up 2 | "Como está se sentindo?" |
| **24h depois** | Follow-up 3 | "Como está aplicando?" |

---

### **FASE 6: REMARKETING (Se não participou)**

| Horário | Ação | Mensagem |
|---------|------|----------|
| **Imediato** | Remarketing | "Vi que você não conseguiu participar..." |
| **48h depois** | Última tentativa | "Ainda estou aqui caso queira reagendar..." |

---

## 📝 MENSAGENS ESPECÍFICAS

### **Mensagem 1: Recomendação Computador (12h antes)**
```
💻 Recomendação importante:

O ideal é participar pelo computador ou notebook, pois:
* Compartilhamos slides
* Fazemos explicações visuais
* É importante acompanhar e anotar

Pelo celular, a experiência fica limitada e você pode perder partes importantes da aula.
```

### **Mensagem 2: Aviso Zoom (2h antes)**
```
⚠️ Aviso importante:

A sala do Zoom será aberta 10 minutos antes do horário da aula.

⏰ Após o início da aula, não será permitido entrar, ok?

Isso porque os 10 primeiros minutos são essenciais:
é nesse momento que identificamos os principais desafios das participantes para que a aula seja realmente prática e personalizada.
```

---

## ⚙️ CRON JOBS CONFIGURADOS

| Cron | Horário | Função |
|------|---------|--------|
| **welcome** | 09:00 (diário) | Boas-vindas para quem não chamou |
| **follow-up** | A cada hora | Notificações para quem não respondeu |
| **pre-class** | A cada hora | Notificações pré-aula |
| **post-class** | A cada hora | Notificações pós-aula |
| **remarketing** | 10:00 (diário) | Remarketing para quem não participou |

---

## 🏷️ TAGS POR FASE

- **Chegada:** `veio_aula_pratica`, `primeiro_contato`
- **Agendou:** `recebeu_link_workshop`, `agendou_aula`
- **Participou:** `participou_aula`
- **Não participou:** `nao_participou_aula`, `recebeu_segundo_link`
- **Sem resposta:** `sem_resposta`

---

**Última atualização:** 2026-01-25
**Versão:** 1.0
