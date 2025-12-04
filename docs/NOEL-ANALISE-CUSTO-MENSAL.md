# 💰 NOEL Wellness - Análise de Custo Mensal por Usuário

## 📊 RESUMO EXECUTIVO

**Custo Estimado por Usuário/Mês:**
- **Cenário Conservador (5 mensagens/dia):** R$ 2,50 - R$ 5,00
- **Cenário Moderado (15 mensagens/dia):** R$ 7,50 - R$ 15,00
- **Cenário Intensivo (30 mensagens/dia):** R$ 15,00 - R$ 30,00

**Economia com Base de Conhecimento:** 70-80% de redução de custos

---

## 🔍 ANÁLISE TÉCNICA

### **1. Modelo Utilizado**
- **Modelo:** `gpt-4-turbo` (ChatGPT 4.1)
- **Preços (Janeiro 2025):**
  - **Input:** US$ 3,00 por 1M tokens
  - **Output:** US$ 12,00 por 1M tokens
  - **Taxa de Câmbio (estimada):** R$ 5,00 = US$ 1,00

### **2. Configuração do NOEL**

#### **Parâmetros de API:**
- `max_tokens`: 1000 por resposta
- `temperature`: 0.7
- `model`: `gpt-4-turbo`
- Histórico: últimos 6 mensagens

#### **System Prompt:**
- Base prompt: ~500 tokens
- Few-shots (15 exemplos): ~3.000 tokens
- Contexto do consultor: ~200 tokens
- Contexto da base de conhecimento: ~300 tokens
- **Total estimado:** ~4.000 tokens por chamada

#### **Mensagem do Usuário:**
- Média: 50-150 palavras = 100-200 tokens
- Histórico (6 mensagens): ~600-1.200 tokens

#### **Resposta do NOEL:**
- Média: 200-400 palavras = 300-600 tokens
- Máximo: 1.000 tokens (limitado)

### **3. Estratégia de Otimização (Fallback)**

O NOEL usa uma estratégia inteligente que **reduz drasticamente** o custo:

```
1. Agent Builder (se configurado) → Custo variável
2. Base de Conhecimento (similaridade ≥ 80%) → 0 tokens (gratuito)
3. Híbrido (similaridade 60-80%) → ~50% dos tokens
4. IA Pura (similaridade < 60%) → 100% dos tokens
```

**Taxa de acerto estimada na base de conhecimento:**
- **Iniciantes:** 70-80% (muitas perguntas comuns)
- **Intermediários:** 60-70% (perguntas mais específicas)
- **Avançados:** 50-60% (perguntas complexas)

**Média geral:** ~65% das perguntas resolvidas sem IA

---

## 💵 CÁLCULO DETALHADO

### **Cenário 1: Usuário Conservador (5 mensagens/dia)**

**Uso diário:**
- 5 mensagens/dia × 30 dias = 150 mensagens/mês

**Distribuição de fontes:**
- Base de conhecimento (65%): 98 mensagens → **0 tokens**
- Híbrido (20%): 30 mensagens → **50% dos tokens**
- IA Pura (15%): 22 mensagens → **100% dos tokens**

**Tokens por tipo:**

**Híbrido (30 mensagens):**
- Input: 30 × 4.000 tokens × 0.5 = 60.000 tokens
- Output: 30 × 500 tokens × 0.5 = 7.500 tokens

**IA Pura (22 mensagens):**
- Input: 22 × 4.000 tokens = 88.000 tokens
- Output: 22 × 500 tokens = 11.000 tokens

**Total mensal:**
- Input: 60.000 + 88.000 = **148.000 tokens**
- Output: 7.500 + 11.000 = **18.500 tokens**

**Custo:**
- Input: 148.000 × (US$ 3,00 / 1.000.000) = **US$ 0,44**
- Output: 18.500 × (US$ 12,00 / 1.000.000) = **US$ 0,22**
- **Total:** US$ 0,66 = **R$ 3,30/mês**

---

### **Cenário 2: Usuário Moderado (15 mensagens/dia)**

**Uso diário:**
- 15 mensagens/dia × 30 dias = 450 mensagens/mês

**Distribuição:**
- Base de conhecimento (65%): 293 mensagens → **0 tokens**
- Híbrido (20%): 90 mensagens → **50% dos tokens**
- IA Pura (15%): 67 mensagens → **100% dos tokens**

**Tokens:**

**Híbrido (90 mensagens):**
- Input: 90 × 4.000 × 0.5 = 180.000 tokens
- Output: 90 × 500 × 0.5 = 22.500 tokens

**IA Pura (67 mensagens):**
- Input: 67 × 4.000 = 268.000 tokens
- Output: 67 × 500 = 33.500 tokens

**Total mensal:**
- Input: 180.000 + 268.000 = **448.000 tokens**
- Output: 22.500 + 33.500 = **56.000 tokens**

**Custo:**
- Input: 448.000 × (US$ 3,00 / 1.000.000) = **US$ 1,34**
- Output: 56.000 × (US$ 12,00 / 1.000.000) = **US$ 0,67**
- **Total:** US$ 2,01 = **R$ 10,05/mês**

---

### **Cenário 3: Usuário Intensivo (30 mensagens/dia)**

**Uso diário:**
- 30 mensagens/dia × 30 dias = 900 mensagens/mês

**Distribuição:**
- Base de conhecimento (65%): 585 mensagens → **0 tokens**
- Híbrido (20%): 180 mensagens → **50% dos tokens**
- IA Pura (15%): 135 mensagens → **100% dos tokens**

**Tokens:**

**Híbrido (180 mensagens):**
- Input: 180 × 4.000 × 0.5 = 360.000 tokens
- Output: 180 × 500 × 0.5 = 45.000 tokens

**IA Pura (135 mensagens):**
- Input: 135 × 4.000 = 540.000 tokens
- Output: 135 × 500 = 67.500 tokens

**Total mensal:**
- Input: 360.000 + 540.000 = **900.000 tokens**
- Output: 45.000 + 67.500 = **112.500 tokens**

**Custo:**
- Input: 900.000 × (US$ 3,00 / 1.000.000) = **US$ 2,70**
- Output: 112.500 × (US$ 12,00 / 1.000.000) = **US$ 1,35**
- **Total:** US$ 4,05 = **R$ 20,25/mês**

---

## 📈 PROJEÇÃO POR VOLUME DE USUÁRIOS

### **100 Usuários Wellness**

**Distribuição estimada:**
- 50% Conservadores (5 msg/dia): 50 usuários
- 40% Moderados (15 msg/dia): 40 usuários
- 10% Intensivos (30 msg/dia): 10 usuários

**Custo mensal:**
- Conservadores: 50 × R$ 3,30 = **R$ 165,00**
- Moderados: 40 × R$ 10,05 = **R$ 402,00**
- Intensivos: 10 × R$ 20,25 = **R$ 202,50**
- **Total:** **R$ 769,50/mês**

**Custo por usuário médio:** R$ 7,70/mês

---

### **500 Usuários Wellness**

**Custo mensal:**
- Conservadores: 250 × R$ 3,30 = **R$ 825,00**
- Moderados: 200 × R$ 10,05 = **R$ 2.010,00**
- Intensivos: 50 × R$ 20,25 = **R$ 1.012,50**
- **Total:** **R$ 3.847,50/mês**

**Custo por usuário médio:** R$ 7,70/mês

---

### **1.000 Usuários Wellness**

**Custo mensal:**
- Conservadores: 500 × R$ 3,30 = **R$ 1.650,00**
- Moderados: 400 × R$ 10,05 = **R$ 4.020,00**
- Intensivos: 100 × R$ 20,25 = **R$ 2.025,00**
- **Total:** **R$ 7.695,00/mês**

**Custo por usuário médio:** R$ 7,70/mês

---

## 🎯 FATORES DE REDUÇÃO DE CUSTO

### **1. Base de Conhecimento (Principal)**
- **Impacto:** Reduz 65% das chamadas à IA
- **Economia:** ~R$ 5,00 por usuário/mês

### **2. Agent Builder (Se configurado)**
- **Impacto:** Pode reduzir custos em 20-30% (dependendo da configuração)
- **Economia adicional:** ~R$ 1,50 por usuário/mês

### **3. Limite de Tokens (max_tokens: 1000)**
- **Impacto:** Controla o tamanho das respostas
- **Economia:** ~R$ 1,00 por usuário/mês

### **4. Histórico Limitado (6 mensagens)**
- **Impacto:** Reduz tokens de contexto
- **Economia:** ~R$ 0,50 por usuário/mês

---

## 💡 RECOMENDAÇÕES DE OTIMIZAÇÃO

### **1. Expandir Base de Conhecimento**
- **Ação:** Adicionar mais scripts e respostas prontas
- **Impacto:** Aumentar taxa de acerto de 65% para 75-80%
- **Economia:** ~R$ 1,00 por usuário/mês

### **2. Usar Agent Builder**
- **Ação:** Configurar Agent Builder com workflow otimizado
- **Impacto:** Reduzir custos em 20-30%
- **Economia:** ~R$ 1,50 por usuário/mês

### **3. Cache de Respostas Similares**
- **Ação:** Implementar cache para perguntas frequentes
- **Impacto:** Reduzir 10-15% das chamadas
- **Economia:** ~R$ 0,75 por usuário/mês

### **4. Monitoramento e Alertas**
- **Ação:** Implementar dashboard de custos
- **Impacto:** Identificar usuários com uso excessivo
- **Benefício:** Otimização contínua

---

## 📊 COMPARAÇÃO COM OUTRAS SOLUÇÕES

| Solução | Custo por Usuário/Mês | Observações |
|---------|----------------------|-------------|
| **NOEL (atual)** | R$ 7,70 | Com base de conhecimento |
| **NOEL (sem base)** | R$ 25,00 | Sem otimizações |
| **ChatGPT Plus** | R$ 50,00 | Assinatura mensal |
| **Assistente Humano** | R$ 500,00+ | Custo de mão de obra |

---

## ⚠️ VARIÁVEIS QUE PODEM AFETAR O CUSTO

### **Aumentam o Custo:**
- ❌ Usuários muito ativos (>30 msg/dia)
- ❌ Perguntas muito complexas (requerem mais tokens)
- ❌ Base de conhecimento pequena (<50% de acerto)
- ❌ Agent Builder não configurado

### **Reduzem o Custo:**
- ✅ Base de conhecimento expandida (>75% de acerto)
- ✅ Agent Builder configurado
- ✅ Cache de respostas similares
- ✅ Limites de uso por usuário (se necessário)

---

## 🎯 CONCLUSÃO

**Custo médio estimado por usuário Wellness/mês: R$ 7,70**

Este custo é **muito competitivo** considerando:
- ✅ Personalização completa
- ✅ Respostas em tempo real
- ✅ Suporte 24/7
- ✅ Aprendizado contínuo
- ✅ Integração com sistema YLADA

**ROI esperado:**
- Se o NOEL ajudar a converter 1 cliente adicional por mês (R$ 50-100), já cobre o custo de 10-20 usuários
- Se reduzir churn em 5%, economiza muito mais do que o custo do NOEL

---

**Última atualização:** Janeiro 2025  
**Baseado em:** Código do NOEL, preços OpenAI, testes realizados

