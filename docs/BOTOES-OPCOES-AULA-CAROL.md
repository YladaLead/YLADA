# 💬 Opções de Aula - Carol (Conversa Direta)

## 🎯 COMO FUNCIONA

Quando a pessoa pergunta sobre horários ou quer agendar, a Carol envia as opções de forma **direta e simples**, perguntando qual a pessoa prefere.

---

## 📱 FORMATO DA MENSAGEM

### **Mensagem Enviada:**
```
📅 *Opções de Aula Disponíveis:*

*Opção 1:*
Segunda-feira, 26/01/2026
🕒 10:00 (horário de Brasília)

*Opção 2:*
Segunda-feira, 26/01/2026
🕒 15:00 (horário de Brasília)

💬 *Qual você prefere?*
Digite o número da opção (ex: "1", "opção 1", "primeira") ou o dia/horário (ex: "segunda às 10:00")
```

**Formato simples e direto, sem botões.**

---

## 🔍 DETECÇÃO DE ESCOLHA

A Carol detecta a escolha de **2 formas**:

### **1. Por Número**
- "1", "opção 1", "primeira"
- "prefiro a primeira"
- "escolho a opção 1"
- "quero a primeira"

### **2. Por Dia/Horário**
- "segunda às 10:00"
- "26/01 às 10:00"
- "segunda-feira às 10:00"

---

## 📤 O QUE ACONTECE APÓS ESCOLHA

1. **Carol detecta a escolha**
2. **Busca a sessão específica** escolhida
3. **Envia imagem do flyer** (se configurado)
4. **Envia mensagem com link** específico da reunião

---

## ⚙️ COMO FUNCIONA

### **Quando Opções São Enviadas:**
- ✅ Pessoa pergunta sobre horários
- ✅ Pessoa quer agendar
- ✅ Há sessões disponíveis
- ✅ Ainda não escolheu uma opção

### **Formato:**
- Mensagem direta e clara
- Sem botões (conversa natural)
- Pessoa responde digitando

---

## 🧪 TESTE

### **Teste 1: Escolher por Número**
1. Enviar: "Quais horários?"
2. Carol envia opções
3. Enviar: "1" ou "opção 1"
4. **Esperado:** Carol envia imagem + link

### **Teste 2: Escolher por Dia/Horário**
1. Enviar: "Quais horários?"
2. Carol envia opções
3. Enviar: "segunda às 10:00"
4. **Esperado:** Carol envia imagem + link

### **Teste 3: Escolher com Texto Natural**
1. Enviar: "Quais horários?"
2. Carol envia opções
3. Enviar: "prefiro a primeira"
4. **Esperado:** Carol envia imagem + link

---

## 🔍 LOGS PARA DEBUG

Quando detecta escolha:
```
[Carol AI] ✅ Escolha detectada: {
  sessionId: "uuid-da-sessao",
  startsAt: "2026-01-26T13:00:00.000Z",
  message: "1"
}
```

---

## ⚠️ OBSERVAÇÕES

1. **Conversa direta:** Sem botões, apenas texto natural
2. **Detecção inteligente:** Funciona com várias formas de escolher
3. **Simples e confiável:** Funciona em todos os dispositivos
4. **Compatível:** Qualquer pessoa consegue responder naturalmente

---

## 📝 EXEMPLO COMPLETO

**Cliente:** Quais horários?

**Carol:** [Envia mensagem com opções + botões]

**Cliente:** 1

**Carol:** [Envia imagem do flyer]

**Carol:**
```
✅ *Perfeito! Aqui está o link da sua aula:*

📅 Segunda-feira, 26/01/2026
🕒 10:00 (horário de Brasília)

🔗 https://us02web.zoom.us/j/...

✅ Se precisar reagendar, responda REAGENDAR.

Qualquer dúvida, estou aqui! 💚
```

---

**Última atualização:** 2026-01-25
**Versão:** 1.0
