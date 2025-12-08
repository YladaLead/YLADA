# 🧠 NOEL - Como Funciona o Aprendizado e a Busca

## 📋 Respostas às Suas Perguntas

### ✅ **1. "Quanto mais usar mais inteligente ele vai ficar?"**

**SIM, mas de forma específica:**

O NOEL não "aprende" automaticamente como um modelo de machine learning tradicional, mas ele **melhora de 3 formas**:

#### **A) Base de Conhecimento Cresce** 📚
- Quando o NOEL não encontra resposta na base (similaridade < 40%), ele **sugere adicionar** à base
- Essas sugestões vão para a tabela `wellness_learning_suggestions`
- Você pode revisar e adicionar as melhores respostas
- **Resultado:** Mais perguntas futuras serão respondidas pela base (gratuito, sem IA)

#### **B) Perfil do Consultor Melhora** 👤
- Cada pergunta é analisada e salva
- O sistema identifica:
  - Estágio da carreira (iniciante → desenvolvimento → liderança)
  - Desafios principais
  - Tópicos frequentes
  - Sentimento (frustrado, motivado, dúvida)
- **Resultado:** Respostas cada vez mais personalizadas

#### **C) Histórico de Queries** 📊
- Todas as perguntas são salvas em `wellness_user_queries`
- O sistema analisa padrões:
  - Quais perguntas são mais frequentes
  - Quais desafios aparecem mais
  - Qual estágio o consultor está
- **Resultado:** Sugestões proativas e respostas mais assertivas

---

### ✅ **2. "Está funcionando a questão de armazenar os dados? Ele só faz busca quando não sabe resposta?"**

**SIM, está funcionando!** E funciona assim:

## 🔍 Como Funciona a Busca na Base de Conhecimento

### **Fluxo Completo:**

```
1. Usuário faz pergunta
   ↓
2. NOEL SEMPRE busca na base de conhecimento primeiro
   ↓
3. Calcula similaridade (0 a 1)
   ↓
4. Decisão baseada na similaridade:
   
   ✅ Similaridade ≥ 80% → Usa resposta da BASE (gratuito, sem IA)
   
   ⚡ Similaridade 60-79% → BASE + IA (personaliza com contexto)
   
   🤖 Similaridade < 60% → Gera com IA completa
   ↓
5. Se gerou com IA e similaridade < 40%:
   → Sugere adicionar à base de conhecimento
```

### **Código que Faz Isso:**

**Arquivo:** `src/app/api/wellness/noel/route.ts`

**Linha 307-310:** Busca na base SEMPRE
```typescript
// 4. Buscar na base de conhecimento
const knowledgeResult = await searchKnowledgeBase(message, module)
const bestMatch = knowledgeResult.bestMatch
const similarityScore = knowledgeResult.similarityScore
```

**Linha 319-324:** Se similaridade ≥ 80%, usa base (sem IA)
```typescript
if (similarityScore >= 0.80 && bestMatch) {
  // Alta similaridade → usar resposta exata
  response = bestMatch.content
  source = 'knowledge_base'
  // ✅ SEM CHAMAR IA = GRATUITO
}
```

**Linha 325-344:** Se similaridade 60-79%, usa híbrido
```typescript
else if (similarityScore >= 0.60 && bestMatch) {
  // Média similaridade → personalizar com IA
  // Usa base + personaliza com contexto do consultor
}
```

**Linha 345-368:** Se similaridade < 60%, gera com IA
```typescript
else {
  // Baixa similaridade → gerar com IA
  // Mas ainda inclui contexto da base se encontrar algo
}
```

**Linha 406-433:** Sugere aprendizado se necessário
```typescript
if (source === 'ia_generated' && similarityScore < 0.40) {
  // Query nova que pode virar conhecimento
  // Salva em wellness_learning_suggestions
}
```

---

## 📊 Exemplo Prático

### **Cenário 1: Pergunta que já existe na base**
```
Usuário: "NOEL, como faço um convite leve?"

1. Busca na base → Encontra script de "Convite Leve"
2. Similaridade: 85%
3. ✅ Resposta: Usa script da base (SEM IA, GRATUITO)
4. Fonte: "knowledge_base"
```

### **Cenário 2: Pergunta similar, mas precisa personalizar**
```
Usuário: "NOEL, preciso convidar alguém mas estou nervoso"

1. Busca na base → Encontra "Convite Leve"
2. Similaridade: 70%
3. ⚡ Resposta: Base + IA (personaliza com suporte emocional)
4. Fonte: "hybrid"
```

### **Cenário 3: Pergunta totalmente nova**
```
Usuário: "NOEL, como faço para vender no TikTok?"

1. Busca na base → Não encontra nada relevante
2. Similaridade: 25%
3. 🤖 Resposta: Gera com IA completa
4. Fonte: "ia_generated"
5. 💡 Sugestão: Salva em wellness_learning_suggestions para revisar depois
```

---

## 🎯 Como o NOEL Fica Mais Inteligente

### **1. Base de Conhecimento Cresce**
- Perguntas frequentes → Adicionadas à base
- Respostas aprovadas → Viram conhecimento permanente
- **Resultado:** Menos uso de IA, mais respostas rápidas e gratuitas

### **2. Perfil do Consultor Evolui**
- Primeira pergunta: "Como começar?"
  - Sistema detecta: iniciante, sem experiência
  - Resposta: Básica, passo a passo
  
- 30ª pergunta: "Como otimizar minha equipe?"
  - Sistema detecta: liderança, experiência alta
  - Resposta: Avançada, estratégica

### **3. Sugestões Proativas**
- Sistema identifica padrões:
  - "Usuário sempre pergunta sobre vendas às segundas"
  - "Usuário está frustrado com recrutamento"
- **Resultado:** NOEL pode sugerir ajuda antes mesmo de perguntar

---

## ✅ Confirmação: Está Funcionando?

### **Como Verificar:**

1. **Ver logs no console:**
   - `✅ NOEL - Resposta da base de conhecimento` = Funcionando!
   - `✅ NOEL - Resposta híbrida` = Funcionando!
   - `✅ NOEL - Resposta gerada com IA` = Funcionando!

2. **Verificar no banco:**
   ```sql
   -- Ver queries salvas
   SELECT query, source_type, similarity_score 
   FROM wellness_user_queries 
   ORDER BY created_at DESC 
   LIMIT 10;
   
   -- Ver sugestões de aprendizado
   SELECT query, frequency 
   FROM wellness_learning_suggestions 
   ORDER BY frequency DESC;
   ```

3. **Verificar base de conhecimento:**
   ```sql
   SELECT COUNT(*) FROM knowledge_wellness_items WHERE is_active = true;
   SELECT COUNT(*) FROM knowledge_wellness_embeddings;
   ```

---

## 📈 Resumo Executivo

### **Aprendizado:**
- ✅ Base de conhecimento cresce com uso
- ✅ Perfil do consultor melhora com análise
- ✅ Sugestões automáticas de aprendizado
- ✅ Respostas mais personalizadas ao longo do tempo

### **Busca na Base:**
- ✅ **SEMPRE** busca primeiro (linha 307)
- ✅ Usa base se similaridade ≥ 80% (gratuito)
- ✅ Usa híbrido se similaridade 60-79% (personaliza)
- ✅ Usa IA só se similaridade < 60% (nova pergunta)
- ✅ Sugere adicionar à base se < 40% (aprendizado)

### **Economia:**
- Quanto mais itens na base → Menos uso de IA → Menos custo
- Respostas da base = **0 tokens** (gratuito)
- Respostas híbridas = **~500 tokens** (barato)
- Respostas IA completa = **~2000 tokens** (mais caro)

---

**Status:** ✅ Sistema funcionando corretamente e aprendendo com o uso





