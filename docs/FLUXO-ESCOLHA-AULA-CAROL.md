# 🎯 Novo Fluxo: Escolha de Aula com Imagem

## 📋 COMO FUNCIONA AGORA

### **ANTES:**
1. Carol enviava opções com links diretos
2. Pessoa recebia tudo de uma vez

### **AGORA:**
1. **Primeiro:** Carol envia apenas dias/horários (formato bonito, sem links)
2. **Pessoa escolhe:** Digita número da opção ou dia/horário
3. **Depois:** Carol envia imagem do flyer + link específico da reunião escolhida

---

## 🎨 FORMATO DAS OPÇÕES (SEM LINKS)

Quando a pessoa pergunta sobre horários ou quer agendar, Carol envia:

```
📅 *Opções de Aula Disponíveis:*

*Opção 1:*
Segunda-feira, 26/01/2026
🕒 10:00 (horário de Brasília)

*Opção 2:*
Segunda-feira, 26/01/2026
🕒 15:00 (horário de Brasília)

💬 *Para escolher, digite o número da opção (ex: "1", "opção 1", "primeira") ou o dia/horário (ex: "segunda às 10:00")*
```

**Sem links!** Apenas dias e horários de forma bonita.

---

## 🔍 DETECÇÃO DE ESCOLHA

A Carol detecta quando a pessoa escolhe uma opção de várias formas:

### **Por Número:**
- "1"
- "opção 1"
- "opcao 1"
- "primeira"
- "segunda" (opção 2)
- "terceira" (opção 3)

### **Por Dia/Horário:**
- "segunda às 10:00"
- "26/01 às 10:00"
- "segunda-feira às 10:00"

---

## 📤 O QUE ACONTECE QUANDO DETECTA ESCOLHA

1. **Busca a sessão específica** escolhida
2. **Busca o flyer** das configurações do workshop
3. **Envia imagem do flyer** (se configurado) com legenda
4. **Envia mensagem com link** específico da reunião

### **Mensagem com Link:**
```
✅ *Perfeito! Aqui está o link da sua aula:*

📅 Segunda-feira, 26/01/2026
🕒 10:00 (horário de Brasília)

🔗 https://us02web.zoom.us/j/...

✅ Se precisar reagendar, responda REAGENDAR.

Qualquer dúvida, estou aqui! 💚
```

---

## 🖼️ CONFIGURAÇÃO DO FLYER

O flyer é configurado em:
- **Admin → WhatsApp → Workshop → Configurações**
- Campo: "Link Zoom" (URL da imagem)
- Campo: "Legenda do Flyer" (texto que aparece na imagem)

**Se o flyer não estiver configurado:**
- Apenas a mensagem com link é enviada
- A imagem não é enviada

---

## 📊 ATUALIZAÇÃO DO CONTEXTO

Quando a pessoa escolhe uma opção:

1. **Tags adicionadas:**
   - `recebeu_link_workshop`
   - `agendou_aula`

2. **Contexto atualizado:**
   - `workshop_session_id`: ID da sessão escolhida
   - `scheduled_date`: Data/hora da sessão escolhida

3. **Mensagens salvas:**
   - Mensagem da imagem (se enviada)
   - Mensagem com link

---

## 🧪 COMO TESTAR

### **Teste 1: Escolha por Número**
1. Enviar: "Quais horários?"
2. Carol envia opções (sem links)
3. Enviar: "1" ou "opção 1"
4. **Esperado:** Carol envia imagem + link

### **Teste 2: Escolha por Dia/Horário**
1. Enviar: "Quais horários?"
2. Carol envia opções (sem links)
3. Enviar: "segunda às 10:00"
4. **Esperado:** Carol envia imagem + link

### **Teste 3: Sem Flyer Configurado**
1. Desativar flyer nas configurações
2. Escolher opção
3. **Esperado:** Apenas mensagem com link (sem imagem)

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

Quando envia imagem:
```
[Z-API] Enviando imagem: {
  phone: "5519996049800",
  image: "https://...",
  caption: "..."
}
```

---

## ⚠️ OBSERVAÇÕES IMPORTANTES

1. **Flyer é opcional:** Se não estiver configurado, apenas o link é enviado
2. **Detecção inteligente:** Funciona com várias formas de escolher (número, dia, horário)
3. **Contexto preservado:** Tags e dados da sessão são salvos automaticamente
4. **Formato bonito:** Opções são formatadas de forma clara e agradável

---

## 📝 EXEMPLO COMPLETO DE CONVERSA

**Cliente:** Quais horários?

**Carol:**
```
📅 *Opções de Aula Disponíveis:*

*Opção 1:*
Segunda-feira, 26/01/2026
🕒 10:00 (horário de Brasília)

*Opção 2:*
Segunda-feira, 26/01/2026
🕒 15:00 (horário de Brasília)

💬 *Para escolher, digite o número da opção (ex: "1", "opção 1", "primeira") ou o dia/horário (ex: "segunda às 10:00")*
```

**Cliente:** 1

**Carol:** [Envia imagem do flyer]

**Carol:**
```
✅ *Perfeito! Aqui está o link da sua aula:*

📅 Segunda-feira, 26/01/2026
🕒 10:00 (horário de Brasília)

🔗 https://us02web.zoom.us/j/84314536380?pwd=...

✅ Se precisar reagendar, responda REAGENDAR.

Qualquer dúvida, estou aqui! 💚
```

---

**Última atualização:** 2026-01-25
**Versão:** 1.0
