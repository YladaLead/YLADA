# 🔍 Busca Semântica NOEL - Como Funciona

## 🎯 Problema Resolvido

**Antes:** O sistema só encontrava scripts/objeções se a pergunta tivesse palavras-chave exatas.

**Agora:** O sistema encontra scripts/objeções por **significado**, mesmo com palavras diferentes.

---

## 🚀 Como Funciona

### **1. Busca Híbrida (2 Etapas)**

#### **Etapa 1: Busca Rápida por Texto** ⚡
- Extrai palavras-chave da pergunta
- Busca scripts/objeções que contenham essas palavras
- **Vantagem:** Rápido, sem custo de API
- **Se encontrar:** Usa o resultado imediatamente

#### **Etapa 2: Busca Semântica (se necessário)** 🧠
- Só executa se a busca por texto não encontrou resultados suficientes
- Gera **embedding** da pergunta (vetor numérico que representa o significado)
- Compara com embeddings dos scripts/objeções
- Calcula **similaridade cosseno** (0.0 a 1.0)
- **Vantagem:** Encontra por significado, não por palavras
- **Custo:** Usa API OpenAI (mas limitado a 5 scripts para economizar)

---

## 📊 Exemplo Prático

### **Pergunta do Usuário:**
"preciso de ajuda para falar com uma pessoa que conheço sobre os produtos"

### **O que o sistema faz:**

1. **Busca por texto:**
   - Palavras-chave: `ajuda`, `falar`, `pessoa`, `conheço`, `produtos`
   - Encontra scripts com essas palavras

2. **Se não encontrar suficiente, busca semântica:**
   - Gera embedding da pergunta
   - Compara com embeddings de scripts sobre:
     - "Como abordar pessoas próximas"
     - "Script para pessoa conhecida"
     - "Conversa inicial sobre produtos"
   - Encontra por **significado similar**, não por palavras exatas

---

## ⚙️ Configuração

### **Thresholds (Limites de Similaridade)**

- **Scripts:** 35% de similaridade mínimo (`threshold: 0.35`)
- **Objeções:** 40% de similaridade mínimo (`threshold: 0.4`)

### **Limites de Performance**

- **Scripts analisados:** Máximo 5 para busca semântica (economiza tokens)
- **Objeções analisadas:** Máximo 5 para busca semântica

---

## 🔧 Arquivos Criados

1. **`script-semantic-search.ts`**
   - Busca semântica de scripts
   - Busca híbrida (texto + semântica)

2. **`objection-semantic-search.ts`**
   - Busca semântica de objeções
   - Busca híbrida (texto + semântica)

3. **Integração no `route.ts`**
   - Usa busca semântica quando necessário
   - Fallback inteligente

---

## 📈 Resultados Esperados

### **Antes:**
- ❌ "estou sem saber o que faco hoje" → Não encontrava nada
- ❌ "preciso falar com alguém sobre produtos" → Não encontrava nada

### **Agora:**
- ✅ "estou sem saber o que faco hoje" → Encontra scripts sobre rotina/planejamento
- ✅ "preciso falar com alguém sobre produtos" → Encontra scripts de abordagem
- ✅ "como começar uma conversa" → Encontra scripts de abertura
- ✅ Qualquer variação da pergunta → Encontra por significado

---

## 💡 Otimizações Implementadas

1. **Busca por texto primeiro** (rápido e grátis)
2. **Busca semântica limitada** (máximo 5 itens para economizar)
3. **Cache de embeddings** (futuro: pré-calcular embeddings dos scripts)
4. **Fallback inteligente** (se não encontrar, usa IA)

---

## 🎯 Próximas Melhorias (Futuro)

1. **Pré-calcular embeddings** dos scripts/objeções no banco
2. **Usar pgvector** para busca direta no banco (mais rápido)
3. **Cache de embeddings** para perguntas similares
4. **Ajuste automático de threshold** baseado em resultados

---

## ✅ Status

**Implementado e funcionando!**

O sistema agora encontra scripts/objeções mesmo quando a pergunta é formulada de forma diferente.


