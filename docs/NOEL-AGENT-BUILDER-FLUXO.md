# 🔄 NOEL Agent Builder - Estrutura do Fluxo

## ✅ Estrutura Correta do Fluxo

### **Fluxo Básico (Recomendado):**

```
Start → Agent → End
```

**Sim, você precisa conectar:**
1. ✅ **Start** → **Agent** (obrigatório)
2. ✅ **Agent** → **End** (obrigatório)

---

## 📋 Passo a Passo

### **1. Começar com Start**
- O nó **Start** é o ponto de entrada do workflow
- Ele recebe a mensagem do usuário

### **2. Conectar Start → Agent**
- Arraste uma conexão do **Start** para o **Agent**
- Isso faz o fluxo iniciar no Agent quando receber uma mensagem

### **3. Conectar Agent → End**
- Arraste uma conexão do **Agent** para o **End**
- Isso finaliza o fluxo após o Agent processar

---

## 🎯 Estrutura Visual

```
┌──────┐
│Start │
└──┬───┘
   │
   ▼
┌──────┐
│Agent │  ← Seu NOEL (com instruções e few-shots)
└──┬───┘
   │
   ▼
┌──────┐
│ End  │
└──────┘
```

---

## ⚠️ Importante

### **O que cada nó faz e o que configurar:**

1. **Start:**
   - ✅ **NÃO precisa configurar nada**
   - Recebe automaticamente a mensagem do usuário
   - Inicia o workflow
   - Passa a mensagem para o próximo nó
   - **Apenas conecte ao Agent**

2. **Agent:**
   - ✅ **SIM, precisa configurar tudo aqui**
   - **Instructions:** Cole o prompt completo de `docs/PROMPT-NOEL-MENTOR-COMPLETO-COM-FEW-SHOTS.md`
   - **Model:** `gpt-4o` ou `gpt-4o-mini`
   - **Temperature:** `0.7`
   - Processa a mensagem usando as instruções
   - Gera a resposta

3. **End:**
   - ✅ **NÃO precisa configurar nada**
   - Finaliza automaticamente o workflow
   - Retorna a resposta para o usuário
   - Encerra o fluxo
   - **Apenas conecte do Agent para o End**

---

## 🔧 Configuração do Agent

No nó **Agent**, você deve ter:

1. **Instructions (Instruções):**
   - Cole o prompt completo de `docs/PROMPT-NOEL-MENTOR-COMPLETO-COM-FEW-SHOTS.md`
   - Isso define o comportamento do NOEL

2. **Model:**
   - `gpt-4o` (para Mentor - análises profundas)
   - `gpt-4o-mini` (para Suporte/Técnico - respostas diretas)

3. **Temperature:**
   - `0.7` (recomendado)

---

## ✅ Checklist

### **Start:**
- [ ] Nó **Start** criado (não precisa configurar nada)
- [ ] Conexão **Start → Agent** criada

### **Agent (AQUI você configura tudo):**
- [ ] Nó **Agent** criado
- [ ] **Instructions:** Prompt completo do NOEL colado
- [ ] **Model:** `gpt-4o` (Mentor) ou `gpt-4o-mini` (Suporte/Técnico)
- [ ] **Temperature:** `0.7`
- [ ] Conexão **Agent → End** criada

### **End:**
- [ ] Nó **End** criado (não precisa configurar nada)

### **Finalização:**
- [ ] Workflow publicado

---

## 🚀 Resumo

**Sim, você precisa:**
1. ✅ Conectar **Start → Agent**
2. ✅ Conectar **Agent → End**

**Estrutura mínima:**
```
Start → Agent → End
```

**Sem o End, o fluxo não finaliza corretamente!**

---

**Status:** ✅ Estrutura correta documentada

