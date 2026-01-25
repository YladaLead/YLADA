# 💰 Fluxo Completo Pós-Aula → Vendas → Suporte

## 🎯 VISÃO GERAL

Fluxo completo desde quando a pessoa participa da aula até ser direcionada para suporte após pagamento.

---

## 📋 FLUXO PASSO A PASSO

### **1. PESSOA PARTICIPA DA AULA**

**Ação:** Você adiciona tag `participou_aula` manualmente

**O que acontece automaticamente:**
- ✅ Sistema detecta que tag foi adicionada
- ✅ Envia link de cadastro IMEDIATAMENTE
- ✅ Mensagem com argumentação: "Qual você prefere começar?"

**Mensagem enviada:**
```
Olá [Nome]! 🎉

Que alegria ter você aqui! Espero que a aula tenha sido transformadora para você! 💚

Agora que você já viu o caminho, que tal darmos o próximo passo juntas?

Temos programas incríveis que vão te ajudar a transformar seu sonho em realidade:

🌟 *Qual você prefere começar?*

🔗 *Acesse aqui para ver os programas e fazer seu cadastro:*
[LINK DE CADASTRO]

O que você acha? Já quer começar ou tem alguma dúvida? 

Estou aqui para te ajudar em cada passo! 😊

Carol - Secretária YLADA Nutri
```

---

### **2. CAROL TRABALHA VENDAS E OBJEÇÕES**

**Estratégia:**
- ✅ Trabalha o emocional (lembra motivo, sonho, objetivo)
- ✅ Provoca que a pessoa fale: "O que você acha?", "O que te preocupa?"
- ✅ Detecta objeções automaticamente
- ✅ Trabalha cada objeção de forma específica

**Objeções comuns:**
- **Preço:** "Entendo sua preocupação. Vamos pensar no investimento vs retorno..."
- **Tempo:** "Sei que tempo é precioso. Por isso criamos algo prático e eficiente..."
- **Dúvida:** "Que bom que você está pensando! O que especificamente te deixa em dúvida?"
- **"Vou pensar":** "Claro! O que você precisa pensar? Posso ajudar a esclarecer..."
- **"Não tenho dinheiro agora":** "Entendo. Que tal começarmos de forma mais acessível?"

**Prompt da Carol atualizado:**
- Trabalha objeções de forma empática
- Provoca manifestação de objeções
- Usa perguntas abertas
- Trabalha emocional + racional

---

### **3. PESSOA FAZ PAGAMENTO**

**O que acontece:**
- ✅ Webhook Mercado Pago detecta pagamento aprovado
- ✅ Sistema busca conversa do WhatsApp (por telefone ou email)
- ✅ Direciona automaticamente para suporte

**Mensagem enviada:**
```
Olá [Nome]! 🎉

Parabéns! Seu pagamento foi confirmado! 🎉

Agora você vai receber todo o suporte e orientação que precisa para começar sua jornada!

📱 *Entre em contato com nosso suporte:*
https://wa.me/5519996049800

Ou envie uma mensagem para: 5519996049800

Lá você vai receber:
✅ Materiais de suporte e orientação
✅ Acompanhamento personalizado
✅ Tudo que precisa para começar

Estamos aqui para te apoiar em cada passo! 💚

Carol - Secretária YLADA Nutri
```

**Tags adicionadas:**
- `pagamento_confirmado`
- `direcionado_suporte`

---

### **4. PESSOA RECEBE SUPORTE**

**Número do suporte:** `5519996049800`

**O que ela recebe:**
- ✅ Materiais de suporte e orientação
- ✅ Acompanhamento personalizado
- ✅ Sequência de materiais
- ✅ Tudo que precisa para começar

---

## 🔄 FLUXO VISUAL

```
AULA ACONTECE
    ↓
VOCÊ ETIQUETA: participou_aula
    ↓
SISTEMA DETECTA AUTOMATICAMENTE
    ↓
CAROL ENVIA LINK DE CADASTRO (IMEDIATO)
    ↓
CAROL TRABALHA VENDAS E OBJEÇÕES
    ├─→ Trabalha emocional
    ├─→ Provoca manifestação de objeções
    ├─→ Detecta e trabalha objeções
    └─→ Persiste estrategicamente
    ↓
PESSOA FAZ PAGAMENTO
    ↓
WEBHOOK MERCADO PAGO DETECTA
    ↓
SISTEMA BUSCA CONVERSA (telefone/email)
    ↓
CAROL DIRECIONA PARA SUPORTE (AUTOMÁTICO)
    ↓
PESSOA RECEBE SUPORTE
    └─→ 5519996049800
```

---

## ⚙️ CONFIGURAÇÕES

### **Link de Cadastro:**
- Variável de ambiente: `NUTRI_REGISTRATION_URL`
- Padrão: `https://ylada.com/pt/nutri/cadastro`

### **Número de Suporte:**
- Fixo: `5519996049800`
- Link: `https://wa.me/5519996049800`

---

## 🏷️ TAGS DO FLUXO

| Fase | Tag | Quando |
|------|-----|--------|
| Participou | `participou_aula` | Você adiciona manualmente |
| Recebeu link | `registration_link_sent` | Automático (no contexto) |
| Pagou | `pagamento_confirmado` | Automático (webhook) |
| Direcionado | `direcionado_suporte` | Automático (webhook) |

---

## ✅ CHECKLIST

- [x] Detecção automática quando tag `participou_aula` é adicionada
- [x] Envio imediato de link de cadastro
- [x] Prompt da Carol atualizado para trabalhar objeções
- [x] Integração com webhook Mercado Pago
- [x] Busca de conversa por telefone/email
- [x] Direcionamento automático para suporte
- [x] Mensagens com argumentação e foco emocional

---

**Última atualização:** 2026-01-25
**Versão:** 1.0
