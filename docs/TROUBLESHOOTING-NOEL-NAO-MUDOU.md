# 🔧 Troubleshooting: NOEL Não Mudou Comportamento

## 🚨 PROBLEMA IDENTIFICADO

Mesmo após atualizar o prompt, o NOEL continua:
- ❌ Inventando links (não usa functions)
- ❌ Bloqueando perguntas sobre planos

---

## ✅ QUAL MODELO USAR

### **Recomendado: `gpt-4.1-mini-2025-04-14`**

**Por quê:**
- ✅ Versão mais recente do mini (abril 2025)
- ✅ Mais barato que gpt-4.1 completo
- ✅ Qualidade suficiente com prompts bem estruturados
- ✅ Velocidade melhor

**NÃO usar:**
- ❌ `gpt-4.1-nano-2025-04-14` (muito limitado)
- ❌ `gpt-4.1-2025-04-14` (muito caro, desnecessário)
- ❌ Versões antigas sem data (podem ter bugs)

---

## 🔍 CHECKLIST DE TROUBLESHOOTING

### **1. Verificar se o Prompt foi Atualizado**

**Passo a passo:**
1. Acesse: https://platform.openai.com/assistants
2. Encontre o Assistant do NOEL
3. Clique em "Edit"
4. Role até o campo "Instructions"
5. **Verifique se tem as "REGRA CRÍTICA #1" e "#2" no início**
6. Se NÃO tiver → O prompt não foi atualizado corretamente

**O que deve aparecer no início do prompt:**
```
🚨 REGRA CRÍTICA #1 - FUNCTIONS (PRIORIDADE MÁXIMA)

**NUNCA INVENTE INFORMAÇÕES. SEMPRE USE FUNCTIONS.**
```

Se não aparecer isso, o prompt não foi atualizado.

---

### **2. Verificar se Salvou Corretamente**

**Após colar o prompt:**
1. Role até o final da página
2. Clique em **"Save"** (não apenas feche)
3. Aguarde confirmação de salvamento
4. Verifique se aparece "Saved" ou "Changes saved"

**Erro comum:** Colar o prompt mas não salvar.

---

### **3. Verificar Cache/Threads Antigos**

**Problema:** Threads antigos podem ter contexto do prompt antigo.

**Solução:**
1. No chat do NOEL, comece uma **nova conversa**
2. Ou limpe o threadId (se estiver usando threads persistentes)
3. Teste com uma pergunta nova

**Como testar:**
- Abra uma nova aba/incógnito
- Acesse o NOEL
- Faça uma pergunta nova (não continue conversa antiga)

---

### **4. Verificar se Está Usando o Assistant Correto**

**Verificar:**
1. No código, qual `OPENAI_ASSISTANT_NOEL_ID` está configurado?
2. Na plataforma, qual Assistant tem esse ID?
3. Você atualizou o Assistant correto?

**Como verificar:**
- Vercel → Settings → Environment Variables
- Ver `OPENAI_ASSISTANT_NOEL_ID`
- Confirmar que é o mesmo Assistant que você editou

---

### **5. Verificar Modelo do Assistant**

**Configuração correta:**
- **Model:** `gpt-4.1-mini-2025-04-14` (ou `gpt-4o-mini` se não tiver a versão 4.1)
- **Temperature:** 0.7 (recomendado)
- **Max tokens:** 1000-2000 (suficiente)

**Verificar:**
1. No Assistant, campo "Model"
2. Deve estar: `gpt-4.1-mini-2025-04-14`
3. Se estiver diferente, altere e salve

---

### **6. Verificar Functions Configuradas**

**O Assistant DEVE ter estas functions:**
- ✅ `getFluxoInfo`
- ✅ `getFerramentaInfo`
- ✅ `getQuizInfo`
- ✅ `getLinkInfo`
- ✅ `getUserProfile`
- ✅ `saveInteraction`
- ✅ `getPlanDay`
- ✅ `updatePlanDay`
- ✅ `registerLead`
- ✅ `getClientData`
- ✅ `recomendarLinkWellness`
- ✅ `buscarTreino`

**Verificar:**
1. No Assistant, seção "Functions"
2. Deve ter todas as functions listadas acima
3. Se faltar alguma, adicione

---

### **7. Testar com Prompt Mínimo (Debug)**

**Se nada funcionar, teste com prompt mínimo:**

```
Você é NOEL, mentor do Wellness System.

REGRAS CRÍTICAS:
1. SEMPRE chame getFluxoInfo() quando mencionar fluxos. NUNCA invente links.
2. SEMPRE ajude com planos/estratégias. NUNCA bloqueie perguntas sobre planos.

Quando o usuário perguntar sobre fluxos, chame getFluxoInfo() e use o link retornado.
Quando o usuário perguntar sobre planos, ajude com orientações práticas.
```

**Se este prompt mínimo funcionar:**
- O problema é o tamanho/complexidade do prompt completo
- Pode precisar simplificar ou dividir

**Se este prompt mínimo NÃO funcionar:**
- Problema pode ser no modelo ou na configuração do Assistant
- Verificar se functions estão configuradas corretamente

---

## 🎯 SOLUÇÃO RÁPIDA (TENTE ISSO PRIMEIRO)

### **Passo 1: Verificar Prompt**
1. Abra o Assistant na OpenAI Platform
2. Veja o campo "Instructions"
3. Procure por "REGRA CRÍTICA #1"
4. Se NÃO encontrar → O prompt não foi atualizado

### **Passo 2: Atualizar Corretamente**
1. Copie TODO o conteúdo de `NOEL-MASTER-v3-FINAL-PRONTO.md`
2. **DELETE todo o conteúdo antigo** do campo Instructions
3. Cole o novo prompt
4. **Clique em "Save"**
5. Aguarde confirmação

### **Passo 3: Verificar Modelo**
1. No Assistant, campo "Model"
2. Deve ser: `gpt-4.1-mini-2025-04-14`
3. Se não for, altere e salve

### **Passo 4: Testar em Nova Conversa**
1. Abra nova aba/incógnito
2. Acesse o NOEL
3. Faça pergunta nova: "Como funciona o Fluxo 2-5-10?"
4. Deve chamar `getFluxoInfo()` e retornar link real

---

## 🔍 DIAGNÓSTICO AVANÇADO

### **Se o Prompt Está Correto mas Não Funciona:**

**Possível causa 1: Modelo muito antigo**
- Solução: Use `gpt-4.1-mini-2025-04-14` (versão mais recente)

**Possível causa 2: Functions não configuradas**
- Solução: Verifique se todas as functions estão no Assistant

**Possível causa 3: Cache do navegador**
- Solução: Limpe cache ou use modo incógnito

**Possível causa 4: Thread antigo com contexto antigo**
- Solução: Comece nova conversa

**Possível causa 5: Prompt muito longo**
- Solução: Teste com prompt mínimo primeiro

---

## 📊 VERIFICAÇÃO FINAL

Após fazer todas as verificações, teste:

**Teste 1:**
```
Como funciona o Fluxo 2-5-10?
```
**Esperado:** Deve chamar `getFluxoInfo()` e retornar link real

**Teste 2:**
```
Quero aumentar minha receita em 50%. Me dê um plano.
```
**Esperado:** Deve ajudar, não bloquear

---

## 💡 DICA IMPORTANTE

**A ordem importa:**
1. Atualizar prompt
2. Salvar
3. Verificar modelo
4. Testar em nova conversa

**NÃO:**
- Atualizar prompt mas não salvar
- Testar em conversa antiga
- Usar modelo errado

---

**Se ainda não funcionar após todas essas verificações, me avise e investigamos mais a fundo.**










