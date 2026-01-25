# 💰 Processo de Fechamento Pós-Aula

## 🎯 COMO FUNCIONA

### **Passo 1: Você Etiqueta**
Após a aula, você adiciona manualmente a tag:
- ✅ `participou_aula` - Se a pessoa participou
- ❌ `nao_participou_aula` - Se a pessoa não participou

### **Passo 2: Sistema Detecta**
O sistema detecta automaticamente quando a tag `participou_aula` é adicionada.

### **Passo 3: Carol Inicia Fechamento**
Carol inicia automaticamente um processo de fechamento/vendas com:
- Foco emocional
- Lembrança do motivo
- Mensagens estratégicas em horários específicos

---

## 📋 FLUXO COMPLETO

```
AULA ACONTECE
    ↓
VOCÊ ETIQUETA: participou_aula
    ↓
SISTEMA DETECTA A TAG
    ↓
CAROL INICIA PROCESSO DE FECHAMENTO
    ↓
[3h depois] Mensagem 1: Lembra o sonho
    ↓
[6h depois] Mensagem 2: Trabalha o emocional
    ↓
[12h depois] Mensagem 3: Reforça o motivo
    ↓
[24h depois] Mensagem 4: Urgência
    ↓
[48h depois] Mensagem 5: Última tentativa
```

---

## 💬 MENSAGENS DO PROCESSO

### **Mensagem 1 (3 horas depois):**
```
Olá [Nome]! 💚

Espero que a aula tenha sido transformadora para você! 

Lembro que você veio porque tinha um sonho, um objetivo... algo que te moveu a buscar essa mudança. 🌟

Agora que você já viu o caminho, que tal darmos o próximo passo juntas?

Estou aqui para te ajudar a transformar esse sonho em realidade. 

Quer conversar sobre como podemos fazer isso acontecer? 😊

Carol - Secretária YLADA Nutri
```

### **Mensagem 2 (6 horas depois):**
```
Olá [Nome]! 

Pensando em você aqui... 💭

Sabe, muitas vezes a gente sabe o que precisa fazer, mas falta aquele empurrãozinho, aquele apoio para realmente começar.

Você não precisa fazer isso sozinha. 

Estou aqui para te apoiar em cada passo dessa jornada. 

Que tal conversarmos sobre como podemos fazer isso acontecer? 💚

Carol - Secretária YLADA Nutri
```

### **Mensagem 3 (12 horas depois):**
```
Olá [Nome]! 

Lembro do motivo que te trouxe até aqui... 🌟

Você tinha um objetivo, um sonho. Algo que te moveu a buscar essa mudança.

Não deixe que esse momento passe. Não deixe que a rotina te distraia do que realmente importa.

Você merece ver esse sonho se tornar realidade. 

Estou aqui para te ajudar. Vamos conversar? 💚

Carol - Secretária YLADA Nutri
```

### **Mensagem 4 (24 horas depois):**
```
Olá [Nome]! 

Passou um dia desde a aula... 

E eu fico pensando: será que você já começou a aplicar o que aprendeu? 

Ou será que ainda está esperando o "momento perfeito"? 

Sabe, o momento perfeito não existe. O momento certo é AGORA. 

Você já deu o primeiro passo ao participar da aula. 

Agora é hora de dar o segundo passo e transformar isso em realidade. 

Estou aqui para te ajudar. Vamos conversar? 💚

Carol - Secretária YLADA Nutri
```

### **Mensagem 5 (48 horas depois - ÚLTIMA):**
```
Olá [Nome]! 

Esta é minha última mensagem sobre isso... 

Mas antes, quero te lembrar: você veio até aqui por um motivo. 

Você tinha um sonho, um objetivo. Algo que te moveu. 

Não deixe que esse momento passe. Não deixe que a vida te distraia do que realmente importa. 

Você merece ver esse sonho se tornar realidade. 

Se ainda quiser conversar sobre como podemos fazer isso acontecer, estou aqui. 

Mas não deixe passar mais tempo. O momento é AGORA. 💚

Carol - Secretária YLADA Nutri
```

---

## 🎯 ESTRATÉGIA EMOCIONAL

### **Elementos Usados:**
1. **Lembrança do Motivo** - "Lembro que você veio porque..."
2. **Trabalho Emocional** - "Você não precisa fazer isso sozinha"
3. **Urgência** - "O momento certo é AGORA"
4. **Apoio** - "Estou aqui para te ajudar"
5. **Sonho/Objetivo** - "Transformar esse sonho em realidade"

---

## ⚙️ CONFIGURAÇÃO

### **Automático:**
- O sistema verifica a cada hora
- Detecta quem tem tag `participou_aula`
- Envia mensagens conforme horário desde a aula

### **Cron Job:**
- Executa: A cada hora
- Endpoint: `/api/cron/whatsapp-carol?tipo=sales-follow-up`

---

## 🏷️ TAGS IMPORTANTES

### **Para Iniciar o Processo:**
- ✅ `participou_aula` - Inicia o processo de fechamento

### **Para Parar o Processo:**
- ✅ `cliente_nutri` - Para o processo (já é cliente)
- ❌ Remover tag `participou_aula` - Para o processo

---

## 📊 RESUMO DOS HORÁRIOS

| Tempo | Mensagem | Foco |
|-------|----------|------|
| **3h depois** | Lembra o sonho | Motivo |
| **6h depois** | Trabalha emocional | Apoio |
| **12h depois** | Reforça motivo | Persistência |
| **24h depois** | Urgência | Ação |
| **48h depois** | Última tentativa | Decisão |

---

## ✅ CHECKLIST

- [ ] Aula aconteceu
- [ ] Você adiciona tag `participou_aula`
- [ ] Sistema detecta automaticamente
- [ ] Carol inicia processo de fechamento
- [ ] Mensagens são enviadas automaticamente
- [ ] Você acompanha as respostas
- [ ] Se fechar, adiciona tag `cliente_nutri`

---

**Última atualização:** 2026-01-25
**Versão:** 1.0
