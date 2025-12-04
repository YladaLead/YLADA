# 💰 NOEL - Custo Real Médio por Usuário/Mês

## 📊 CENÁRIO: 10 PERGUNTAS/RESPOSTAS POR DIA

### **Premissas:**
- **10 perguntas/dia** (usuário envia)
- **10 respostas/dia** (NOEL responde)
- **30 dias/mês**
- **Modelo:** gpt-4-turbo
- **Preços:** Input US$ 3,00 / Output US$ 12,00 por 1M tokens
- **Taxa de câmbio:** R$ 5,00 = US$ 1,00

---

## 🧮 CÁLCULO DETALHADO

### **1. Volume Mensal:**
```
10 perguntas/dia × 30 dias = 300 perguntas/mês
10 respostas/dia × 30 dias = 300 respostas/mês
```

### **2. Tokens por Interação (baseado em observação real):**

**Input (pergunta do usuário + contexto):**
- System prompt: ~4.000 tokens (few-shots + contexto consultor + base conhecimento)
- Histórico (6 mensagens): ~1.200 tokens
- Pergunta do usuário: ~100 tokens
- **Total Input:** ~5.300 tokens por pergunta

**Output (resposta do NOEL):**
- Resposta média: ~500 tokens (max_tokens: 1.000, mas média observada: 500)
- **Total Output:** ~500 tokens por resposta

### **3. Tokens Mensais:**

**Input:**
```
300 perguntas × 5.300 tokens = 1.590.000 tokens/mês
```

**Output:**
```
300 respostas × 500 tokens = 150.000 tokens/mês
```

### **4. Custo Mensal:**

**Input:**
```
1.590.000 tokens × (US$ 3,00 / 1.000.000) = US$ 4,77
US$ 4,77 × R$ 5,00 = R$ 23,85
```

**Output:**
```
150.000 tokens × (US$ 12,00 / 1.000.000) = US$ 1,80
US$ 1,80 × R$ 5,00 = R$ 9,00
```

**TOTAL:**
```
R$ 23,85 (input) + R$ 9,00 (output) = R$ 32,85/mês
```

---

## ✅ RESULTADO FINAL

### **Custo Médio por Usuário/Mês: R$ 32,85**

---

## 💡 CENÁRIO COM BASE DE CONHECIMENTO

### **Se 65% das perguntas vierem da base (sem IA):**

**Perguntas que usam IA:**
- 35% de 300 = **105 perguntas/mês**

**Tokens com IA:**
- Input: 105 × 5.300 = 556.500 tokens
- Output: 105 × 500 = 52.500 tokens

**Custo:**
- Input: 556.500 × (US$ 3,00 / 1.000.000) × R$ 5,00 = **R$ 8,35**
- Output: 52.500 × (US$ 12,00 / 1.000.000) × R$ 5,00 = **R$ 3,15**
- **Total:** **R$ 11,50/mês**

**Economia:** R$ 21,35/mês (65% de redução)

---

## 📊 RESUMO COMPARATIVO

| Cenário | Perguntas/Mês | Custo/Mês |
|---------|---------------|-----------|
| **Sem base de conhecimento** | 300 | **R$ 32,85** |
| **Com base (65% economia)** | 300 | **R$ 11,50** |
| **Economia** | - | **R$ 21,35** |

---

**Última atualização:** Janeiro 2025  
**Cenário:** 10 perguntas/respostas por dia

