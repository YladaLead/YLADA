# 🧮 YLADA SMART CALCULATORS SYSTEM

## 🎯 VISÃO GERAL DO SISTEMA INTELIGENTE

### **PERGUNTA RESPONDIDA:**
- **"Tem vários tipos outras de calculadora não tem"** → **Sistema inteligente com IA para busca**
- **"IA vai buscando pra que ela seja bem assertivo"** → **SIM! Busca inteligente implementada**
- **"Melhor levantar uma lista"** → **Sistema híbrido: IA + Lista completa**

---

## 🔧 ERRO CORRIGIDO

### **❌ ERRO ANTERIOR:**
```sql
ERROR: 42P01: relation "countries_compliance" does not exist
LINE 41: INSERT INTO countries_compliance
```

### **✅ CORREÇÃO IMPLEMENTADA:**
- **Criação das tabelas** antes dos INSERTs
- **CREATE TABLE IF NOT EXISTS** para evitar erros
- **ON CONFLICT DO NOTHING** para evitar duplicatas

---

## 🧠 SISTEMA INTELIGENTE DE CALCULADORAS

### **🏗️ ARQUITETURA IMPLEMENTADA:**

#### **1. 📊 TIPOS DE CALCULADORAS**
```sql
calculator_types (
  calculator_key,           -- Chave única (ex: "imc-calculator")
  name,                    -- Nome da calculadora
  description,             -- Descrição
  category,                -- Categoria (health, nutrition, fitness)
  formula,                 -- Fórmula matemática em JSON
  inputs,                  -- Campos de entrada
  outputs,                 -- Campos de saída
  ai_search_keywords,      -- Palavras-chave para IA
  ai_suggestions,          -- Sugestões automáticas
  related_calculators      -- Calculadoras relacionadas
)
```

#### **2. 🛠️ CALCULADORAS PERSONALIZADAS**
```sql
user_calculators (
  user_id,                 -- Usuário que criou
  calculator_type_id,      -- Tipo base
  custom_formula,          -- Fórmula personalizada
  custom_inputs,           -- Campos personalizados
  custom_outputs,          -- Saídas personalizadas
  target_country,          -- País de destino
  compliance_applied       -- Compliance aplicado
)
```

#### **3. 🔍 FUNÇÃO DE BUSCA POR IA**
```sql
-- Busca inteligente por IA
CREATE OR REPLACE FUNCTION search_calculators_by_ai(
  p_search_text TEXT,           -- Texto de busca
  p_profession VARCHAR(100),    -- Profissão do usuário
  p_objective VARCHAR(100)      -- Objetivo da ferramenta
) RETURNS TABLE (...)
```

---

## 🧮 CALCULADORAS IMPLEMENTADAS

### **📊 1. CALCULADORA DE IMC**
```json
{
  "calculator_key": "imc-calculator",
  "name": "Calculadora de IMC",
  "formula": {
    "formula": "imc = weight / (height/100)^2",
    "variables": ["weight", "height"],
    "result_format": "decimal",
    "decimals": 1
  },
  "inputs": {
    "weight": {
      "label": "Peso",
      "type": "number",
      "unit": "kg",
      "min": 5,
      "max": 300
    },
    "height": {
      "label": "Altura",
      "type": "number",
      "unit": "cm",
      "min": 50,
      "max": 250
    }
  },
  "outputs": {
    "imc": {"label": "IMC", "type": "number"},
    "category": {"label": "Categoria", "type": "text"},
    "recommendation": {"label": "Recomendação", "type": "text"}
  },
  "ai_search_keywords": ["imc", "indice massa corporal", "peso ideal", "obesidade", "sobrepeso"],
  "related_calculators": ["weight-ideal", "calories-calculator", "hydration-calculator"]
}
```

### **💧 2. CALCULADORA DE HIDRATAÇÃO**
```json
{
  "calculator_key": "hydration-calculator",
  "name": "Calculadora de Hidratação",
  "formula": {
    "formula": "water = weight * 35 + (activity_level * 500)",
    "variables": ["weight", "activity_level"],
    "result_format": "decimal",
    "decimals": 1,
    "unit": "ml"
  },
  "inputs": {
    "weight": {
      "label": "Peso",
      "type": "number",
      "unit": "kg",
      "min": 20,
      "max": 200
    },
    "activity_level": {
      "label": "Nível de Atividade",
      "type": "select",
      "options": [
        {"value": 0, "label": "Sedentário"},
        {"value": 1, "label": "Leve"},
        {"value": 2, "label": "Moderado"},
        {"value": 3, "label": "Intenso"}
      ]
    }
  },
  "outputs": {
    "water_amount": {"label": "Quantidade de Água", "unit": "ml"},
    "glasses": {"label": "Copos de 200ml", "type": "integer"},
    "recommendation": {"label": "Recomendação", "type": "text"}
  },
  "ai_search_keywords": ["hidratacao", "agua", "liquidos", "desidratacao"],
  "related_calculators": ["imc-calculator", "calories-calculator", "macros-calculator"]
}
```

### **🔥 3. CALCULADORA DE CALORIAS**
```json
{
  "calculator_key": "calories-calculator",
  "name": "Calculadora de Calorias",
  "formula": {
    "formula": "calories = (weight * 10 + height * 6.25 - age * 5 + gender_factor) * activity_multiplier",
    "variables": ["weight", "height", "age", "gender", "activity_level"],
    "result_format": "integer"
  },
  "inputs": {
    "weight": {"label": "Peso", "type": "number", "unit": "kg"},
    "height": {"label": "Altura", "type": "number", "unit": "cm"},
    "age": {"label": "Idade", "type": "number", "unit": "anos"},
    "gender": {
      "label": "Sexo",
      "type": "select",
      "options": [
        {"value": "male", "label": "Masculino", "factor": 5},
        {"value": "female", "label": "Feminino", "factor": -161}
      ]
    },
    "activity_level": {
      "label": "Nível de Atividade",
      "type": "select",
      "options": [
        {"value": 1.2, "label": "Sedentário"},
        {"value": 1.375, "label": "Leve"},
        {"value": 1.55, "label": "Moderado"},
        {"value": 1.725, "label": "Intenso"},
        {"value": 1.9, "label": "Muito Intenso"}
      ]
    }
  },
  "outputs": {
    "calories": {"label": "Calorias Diárias", "unit": "kcal"},
    "macros": {
      "label": "Macronutrientes",
      "carbohydrates": {"percentage": 50, "unit": "g"},
      "proteins": {"percentage": 25, "unit": "g"},
      "fats": {"percentage": 25, "unit": "g"}
    }
  },
  "ai_search_keywords": ["calorias", "energia", "metabolismo", "dieta", "emagrecimento"],
  "related_calculators": ["imc-calculator", "macros-calculator", "hydration-calculator"]
}
```

---

## 🔍 COMO FUNCIONA A BUSCA POR IA

### **🧠 ALGORITMO DE BUSCA INTELIGENTE:**
```sql
-- Exemplo de busca
SELECT * FROM search_calculators_by_ai(
  'peso ideal',           -- Texto de busca
  'nutricionista',        -- Profissão
  'capturar-leads'        -- Objetivo
);
```

### **📊 SCORE DE RELEVÂNCIA:**
1. **Palavras-chave exatas:** 100% de relevância
2. **Palavras-chave parciais:** 80% de relevância
3. **Texto na descrição:** 60% de relevância
4. **Calculadoras relacionadas:** 40% de relevância

### **🎯 FILTROS INTELIGENTES:**
- **Por profissão:** Nutricionista, Personal Trainer, Médico
- **Por objetivo:** Capturar leads, Educar valor, Avaliar hábitos
- **Por categoria:** Health, Nutrition, Fitness, Finance

---

## 🚀 EXEMPLO PRÁTICO DE USO

### **📋 CENÁRIO: Nutricionista busca calculadora**

#### **1. 🔍 BUSCA POR IA**
```typescript
// Usuário digita: "calculadora de peso ideal"
const results = await searchCalculatorsByAI(
  'calculadora de peso ideal',
  'nutricionista',
  'capturar-leads'
);
```

#### **2. 📊 RESULTADOS RETORNADOS**
```json
[
  {
    "calculator_key": "imc-calculator",
    "name": "Calculadora de IMC",
    "description": "Calcula o Índice de Massa Corporal",
    "category": "health",
    "relevance_score": 95.0
  },
  {
    "calculator_key": "calories-calculator",
    "name": "Calculadora de Calorias",
    "description": "Calcula a necessidade calórica diária",
    "category": "nutrition",
    "relevance_score": 85.0
  },
  {
    "calculator_key": "hydration-calculator",
    "name": "Calculadora de Hidratação",
    "description": "Calcula a quantidade ideal de água por dia",
    "category": "nutrition",
    "relevance_score": 70.0
  }
]
```

#### **3. ✏️ CRIAÇÃO PERSONALIZADA**
```typescript
// Usuário escolhe IMC e personaliza
const customCalculator = await createCustomCalculator(
  userId,
  'imc-calculator',
  'Meu Quiz de Peso Ideal',
  'BRA'
);
```

#### **4. 🎯 RESULTADO FINAL**
```json
{
  "id": "calc-uuid",
  "name": "Meu Quiz de Peso Ideal",
  "slug": "meu-quiz-peso-ideal-a1b2c3d4",
  "url": "https://ylada.com/calc/meu-quiz-peso-ideal-a1b2c3d4",
  "formula": "imc = weight / (height/100)^2",
  "inputs": {
    "weight": {"label": "Peso", "unit": "kg"},
    "height": {"label": "Altura", "unit": "cm"}
  },
  "outputs": {
    "imc": {"label": "IMC"},
    "category": {"label": "Categoria"},
    "recommendation": {"label": "Recomendação"}
  },
  "compliance_applied": {
    "BRA": {
      "disclaimer": "Este cálculo é apenas uma estimativa..."
    }
  }
}
```

---

## 📈 EXPANSÃO DO SISTEMA

### **🔄 COMO ADICIONAR NOVAS CALCULADORAS:**

#### **1. 📝 MÉTODO MANUAL (Recomendado para começar):**
```sql
-- Adicionar nova calculadora
INSERT INTO calculator_types (
  calculator_key, name, description, category,
  formula, inputs, outputs, validation_rules,
  ai_search_keywords, ai_suggestions, related_calculators
) VALUES (
  'new-calculator',
  'Nova Calculadora',
  'Descrição da nova calculadora',
  'category',
  '{"formula": "result = input1 + input2"}',
  '{"input1": {"label": "Campo 1", "type": "number"}}',
  '{"result": {"label": "Resultado", "type": "number"}}',
  '{"input1": {"min": 0, "max": 100}}',
  ARRAY['palavra1', 'palavra2', 'palavra3'],
  '{"suggestions": ["Sugestão 1"], "professions": ["nutricionista"]}',
  ARRAY['related-calc1', 'related-calc2']
);
```

#### **2. 🤖 MÉTODO POR IA (Futuro):**
```typescript
// IA analisa prompt e cria calculadora automaticamente
const newCalculator = await aiCreateCalculator(
  "Crie uma calculadora de percentual de gordura corporal"
);
```

---

## 💡 BENEFÍCIOS DO SISTEMA INTELIGENTE

### **✅ PARA O USUÁRIO (Criador da ferramenta):**
- **Busca inteligente** por IA
- **Sugestões automáticas** baseadas no contexto
- **Personalização completa** das calculadoras
- **Compliance automático** por país

### **✅ PARA A YLADA:**
- **Escalabilidade** através de IA
- **Dados valiosos** sobre uso de calculadoras
- **Melhoria contínua** baseada em métricas
- **Diferencial competitivo** único

### **✅ PARA O USUÁRIO FINAL:**
- **Calculadoras precisas** e validadas
- **Resultados personalizados** e relevantes
- **Avisos de segurança** obrigatórios
- **Experiência profissional**

---

## 🎯 RESULTADO FINAL

**O sistema YLADA agora oferece:**

✅ **Sistema inteligente** de calculadoras
✅ **Busca por IA** com score de relevância
✅ **3 calculadoras** implementadas (IMC, Hidratação, Calorias)
✅ **Personalização completa** das calculadoras
✅ **Compliance automático** por país
✅ **Escalabilidade** para novas calculadoras
✅ **Métricas de uso** e performance

**Transformamos uma lista estática em um sistema inteligente e escalável!** 🧮🚀
