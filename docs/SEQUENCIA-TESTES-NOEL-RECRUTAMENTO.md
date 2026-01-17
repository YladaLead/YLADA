# 🧪 SEQUÊNCIA DE TESTES - NOEL v3.4 (RECRUTAMENTO E LINKS)

**Objetivo:** Testar o Noel v3.4 com foco em recrutamento, links, insegurança e scripts

---

## 📋 SEQUÊNCIA DE PERGUNTAS (10+)

### **TESTE 1: Pessoa Insegura / Não Sabe o Que Fazer**
```
Não sei o que fazer
```
**O que o Noel DEVE fazer:**
- ✅ Interpretar que a pessoa quer: script + link + ação prática
- ✅ Entregar diretamente (sem pedir permissão)
- ✅ Incluir pedido de indicação no script
- ✅ Usar linguagem coletiva ("nossa saúde", "coisa boa pra todos")

---

### **TESTE 2: Lista de Contatos Vazia**
```
Não tenho lista de contatos, não sei com quem falar
```
**O que o Noel DEVE fazer:**
- ✅ Dar dicas práticas imediatas (10 pessoas do WhatsApp)
- ✅ Oferecer script pronto para enviar
- ✅ Incluir link de captação
- ✅ Incluir pedido de indicação

---

### **TESTE 3: Como Abordar Alguém (Vago)**
```
Como abordar alguém?
```
**O que o Noel DEVE fazer:**
- ✅ Entregar script completo diretamente (sem perguntar "Quer que eu te envie?")
- ✅ Incluir link apropriado
- ✅ Explicar como usar
- ✅ Incluir pedido de indicação

---

### **TESTE 4: Pessoa Insegura sobre Recrutamento**
```
Tenho medo de abordar pessoas, não sei o que falar
```
**O que o Noel DEVE fazer:**
- ✅ Acolher a insegurança
- ✅ Oferecer script leve e provocativo
- ✅ Explicar por que o script funciona
- ✅ Incluir pedido de indicação

---

### **TESTE 5: Amigo/Conhecido (Contexto de Indicação)**
```
Tenho um amigo que quer emagrecer
```
**O que o Noel DEVE fazer:**
- ✅ Detectar automaticamente que precisa de script + link
- ✅ Chamar recomendarLinkWellness() ou getFerramentaInfo()
- ✅ Entregar script completo com pedido de indicação
- ✅ Usar linguagem coletiva ("nossa saúde")

---

### **TESTE 6: Qual Link Usar (Vago)**
```
Qual link eu uso?
```
**O que o Noel DEVE fazer:**
- ✅ Chamar recomendarLinkWellness() PRIMEIRO
- ✅ Oferecer link principal + opções
- ✅ Entregar script pronto para cada link
- ✅ Incluir pedido de indicação em todos

---

### **TESTE 7: Pessoa Cansada (Situação Específica)**
```
Tenho uma pessoa que está sempre cansada
```
**O que o Noel DEVE fazer:**
- ✅ Detectar necessidade (energia)
- ✅ Chamar getFerramentaInfo("calculadora-agua") e getQuizInfo("quiz-energetico")
- ✅ Oferecer 2-3 opções de links
- ✅ Entregar scripts completos com pedido de indicação

---

### **TESTE 8: Lista de Contatos (Pergunta Genérica)**
```
Como faço para ter mais contatos?
```
**O que o Noel DEVE fazer:**
- ✅ Direcionar para "fale com 10 pessoas hoje"
- ✅ Dar dicas práticas (grupos, WhatsApp, Instagram)
- ✅ Oferecer script para cada situação
- ✅ Incluir pedido de indicação

---

### **TESTE 9: Script de Recrutamento (Direto)**
```
Preciso de um script para recrutar
```
**O que o Noel DEVE fazer:**
- ✅ Buscar na KB ou criar seguindo "Propagação do Bem"
- ✅ Entregar script completo diretamente
- ✅ Incluir link da HOM gravada
- ✅ Incluir pedido de indicação

---

### **TESTE 10: Pessoa que Não Responde (Follow-up)**
```
Enviei o link mas a pessoa não respondeu
```
**O que o Noel DEVE fazer:**
- ✅ Chamar getFluxoInfo("reaquecimento") PRIMEIRO
- ✅ Entregar script de reaquecimento completo
- ✅ Explicar quando usar
- ✅ Incluir pedido de indicação

---

### **TESTE 11: Não Sabe o Que Falar (Insegurança)**
```
Não sei o que falar quando envio o link
```
**O que o Noel DEVE fazer:**
- ✅ Entregar script completo para enviar junto com link
- ✅ Explicar por que funciona
- ✅ Incluir pedido de indicação
- ✅ Usar linguagem coletiva

---

### **TESTE 12: Quer Indicações (Direto)**
```
Como consigo indicações?
```
**O que o Noel DEVE fazer:**
- ✅ Explicar estratégia de indicações
- ✅ Oferecer scripts com pedido de indicação natural
- ✅ Ensinar como pedir de forma leve
- ✅ Incluir exemplos práticos

---

### **TESTE 13: Pessoa Interessada em Negócio**
```
Tenho uma pessoa que quer renda extra
```
**O que o Noel DEVE fazer:**
- ✅ Detectar interesse em negócio
- ✅ Chamar recomendarLinkWellness() com objetivo "recrutamento"
- ✅ Oferecer link da HOM gravada
- ✅ Entregar script completo com pedido de indicação

---

### **TESTE 14: Múltiplas Pessoas (Volume)**
```
Tenho várias pessoas que posso abordar, não sei por onde começar
```
**O que o Noel DEVE fazer:**
- ✅ Priorizar ação imediata
- ✅ Oferecer script único que funciona para todos
- ✅ Explicar estratégia de abordagem em massa
- ✅ Incluir pedido de indicação

---

### **TESTE 15: Pessoa que Visualiza mas Não Responde**
```
A pessoa visualiza minhas mensagens mas não responde
```
**O que o Noel DEVE fazer:**
- ✅ Chamar getFluxoInfo("reaquecimento") PRIMEIRO
- ✅ Entregar script de reaquecimento
- ✅ Explicar estratégia de temperatura
- ✅ Incluir pedido de indicação

---

## ✅ CHECKLIST DE VALIDAÇÃO

Para cada pergunta, verificar se o Noel:

- [ ] **Interpretou proativamente** (não esperou pergunta perfeita)
- [ ] **Entregou script completo** (sem pedir permissão)
- [ ] **Incluiu link completo** (chamou function primeiro)
- [ ] **Incluiu pedido de indicação** (em todo script)
- [ ] **Usou linguagem coletiva** ("nossa saúde", "coisa boa pra todos")
- [ ] **Explicou como usar** (passo a passo prático)
- [ ] **Não inventou links** (sempre usou dados das functions)
- [ ] **Foi direto e prático** (sem floreios desnecessários)

---

## 🎯 RESULTADOS ESPERADOS

### **Perguntas Vagas → Respostas Completas**
- "Não sei o que fazer" → Script + Link + Como usar + Pedido de indicação
- "Como abordar?" → Script completo + Link + Explicação

### **Perguntas Específicas → Links Apropriados**
- "Pessoa cansada" → Links de energia + Scripts
- "Quer emagrecer" → Links de diagnóstico + Scripts

### **Todas as Respostas → Pedido de Indicação**
- Todo script termina com: "Compartilhe com quem você gosta!"
- Nunca deixa script sem pedido de indicação

---

## 📝 OBSERVAÇÕES IMPORTANTES

1. **O Noel NÃO deve perguntar "Quer que eu te envie?"** → Sempre entregar diretamente
2. **O Noel NÃO deve inventar links** → Sempre chamar functions primeiro
3. **O Noel SEMPRE deve incluir pedido de indicação** → Em todo script
4. **O Noel deve usar linguagem coletiva** → "nossa saúde", não "sua saúde"

---

**Status:** ✅ Sequência pronta para testes
