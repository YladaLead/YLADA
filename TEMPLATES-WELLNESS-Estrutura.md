# 📋 Templates Wellness - Estrutura e Lógica de Integração

## 🎯 Visão Geral
Este documento define a nomenclatura padronizada e a estrutura de integração dos 13 templates para o YLADA.

---

## 📊 Nomenclatura Padronizada

### **Convenção de Nomes**
```
{ID}_wellness_{tipo}_{nome}
```

**Exemplos:**
- `calc_001_wellness_imc`
- `calc_002_wellness_proteina`
- `quiz_003_wellness_ganhos_prosperidade`

---

## 🗂️ Catálogo de Templates

### **CALCULADORAS (calc)**

#### 1. **IMC - Índice de Massa Corporal**
- **ID:** `calc_001_wellness_imc`
- **Nome:** Calculadora IMC
- **Campos:** idade, gênero, peso, altura
- **Fórmula:** `peso / (altura/100)²`
- **Saída:** Categoria IMC + Recomendações
- **WhatsApp:** "Olá! Calculei meu IMC e gostaria de saber mais sobre como alcançar meu objetivo."

#### 2. **PROTEINA - Proteína Diária**
- **ID:** `calc_002_wellness_proteina`
- **Nome:** Calculadora de Proteína
- **Campos:** idade, gênero, peso, altura, atividade, objetivo
- **Fórmula:** `peso * proteinPerKg` (ajustado por atividade e objetivo)
- **Saída:** Gramas de proteína + Distribuição + Fontes
- **WhatsApp:** "Olá! Calculei minhas necessidades proteicas e gostaria de saber como alcançar."

#### 3. **HIDRATACAO - Água Diária**
- **ID:** `calc_003_wellness_hidratacao`
- **Nome:** Calculadora de Hidratação
- **Campos:** idade, gênero, peso, atividade, clima
- **Fórmula:** `baseWater (35ml/kg) + activityAdjustment + climateAdjustment`
- **Saída:** Litros de água + Dicas de hidratação
- **WhatsApp:** "Olá! Calculei minha necessidade de hidratação e gostaria de estratégias práticas."

#### 4. **COMPOSICAO - Composição Corporal**
- **ID:** `calc_004_wellness_composicao`
- **Nome:** Composição Corporal
- **Campos:** idade, gênero, peso, altura, cintura
- **Cálculos:** BMI, BF% (gordura), LBM (massa magra), FM (gordura)
- **Saída:** Análise completa + Recomendações por categoria
- **WhatsApp:** "Olá! Avaliei minha composição corporal e gostaria de otimizar."

---

### **QUIZZES DE NEGÓCIO (quiz_negocio)**

#### 5. **GANHOS - Ganhos e Prosperidade**
- **ID:** `quiz_005_wellness_ganhos`
- **Nome:** Quiz: Ganhos e Prosperidade
- **Questões:** 5 (situação financeira, renda adicional, desenvolvimento, oportunidades, obstáculos)
- **Pontuação:** 0-15
- **Resultados:** Baixo Potencial / Potencial Moderado / Alto Potencial
- **WhatsApp:** "Olá! Completei o Quiz de Ganhos e gostaria de otimizar meu potencial de renda."

#### 6. **POTENCIAL - Potencial e Crescimento**
- **ID:** `quiz_006_wellness_potencial`
- **Nome:** Quiz: Potencial e Crescimento
- **Questões:** 5 (desempenho, metas, feedback, desenvolvimento, adaptação)
- **Pontuação:** 0-15
- **Resultados:** Subutilizado / Crescimento / Excelência
- **WhatsApp:** "Olá! Completei o Quiz de Potencial e gostaria de estratégias de desenvolvimento."

#### 7. **PROPOSITO - Propósito e Equilíbrio**
- **ID:** `quiz_007_wellness_proposito`
- **Nome:** Quiz: Propósito e Equilíbrio
- **Questões:** 5 (propósito, equilíbrio, contribuição, alegria, futuro)
- **Pontuação:** 0-15
- **Resultados:** Desalinhamento / Busca de Equilíbrio / Alinhado
- **WhatsApp:** "Olá! Completei o Quiz de Propósito e gostaria de viver de forma mais alinhada."

#### 8. **PARASITAS - Diagnóstico de Parasitas**
- **ID:** `quiz_008_wellness_parasitas`
- **Nome:** Quiz: Diagnóstico de Parasitas
- **Questões:** 5 (digestão, energia, desconfortos, sono, alimentos crus)
- **Saída:** Interpretação de sintomas + Recomendações de limpeza
- **WhatsApp:** "Olá! Completei o Quiz de Parasitas e gostaria de saber sobre protocolos de limpeza."

---

### **TEMPLATES AVANÇADOS**

#### 9. **ALIMENTACAO - Alimentação Saudável**
- **ID:** `quiz_009_wellness_alimentacao`
- **Nome:** Quiz: Alimentação Saudável
- **Questões:** 5 (refeições/dia, frutas/verduras, proteína, água, avaliação geral)
- **Pontuação:** 0-15
- **Resultados:** A Melhorar / Moderados / Saudáveis
- **WhatsApp:** "Olá! Completei o Quiz de Alimentação e gostaria de melhorar meus hábitos."

#### 10. **DIARIO - Bem-Estar Diário (Tabela)**
- **ID:** `plan_010_wellness_diario`
- **Nome:** Tabela: Bem-Estar Diário
- **Campos:** data, peso, água, sono, energia, humor
- **Saída:** Planilha baixável
- **WhatsApp:** "Olá! Acompanho meu bem-estar através do YLADA e gostaria de otimizar."

#### 11. **REFEICOES - Planejador de Refeições**
- **ID:** `calc_011_wellness_refeicoes`
- **Nome:** Planejador de Refeições
- **Campos:** idade, gênero, peso, altura, atividade, objetivo, preferências, refeições
- **Saída:** Cardápio semanal + Macros + Receitas + Lista de compras
- **WhatsApp:** "Olá! Solicitei meu plano alimentar e gostaria de saber sobre implementação."

#### 12. **AVALIACAO - Avaliação Nutricional**
- **ID:** `quiz_012_wellness_avaliacao`
- **Nome:** Avaliação Nutricional Completa
- **Questões:** 7 (pós-refeição, fome, industrializados, açúcar, digestão, água, suplementos)
- **Saída:** Deficiências nutricionais + Recomendações
- **WhatsApp:** "Olá! Completei minha Avaliação Nutricional e gostaria de saber sobre os resultados."

#### 13. **PERFIL - Perfil de Bem-Estar**
- **ID:** `quiz_013_wellness_perfil`
- **Nome:** Quiz: Perfil de Bem-Estar
- **Questões:** 8 (3 saúde física + 3 saúde mental + 2 emocional)
- **Pontuação:** 0-50
- **Resultados:** Equilibrado / Moderado / Desenvolvimento
- **WhatsApp:** "Olá! Completei o Perfil de Bem-Estar e gostaria de estratégias de melhoria."

---

## 🔗 Estrutura de Integração

### **1. URLs Padronizadas**
```
/pt/wellness/calculadora/{nome}       # Calculadoras
/pt/wellness/quiz/{nome}               # Quizzes
/pt/wellness/planilha/{nome}           # Planilhas
```

### **2. Schema JSONB Padrão**

#### **Para Calculadoras:**
```json
{
  "type": "calculadora",
  "fields": [
    {
      "name": "field_name",
      "label": "Label do Campo",
      "type": "number|select|text",
      "required": true,
      "validation": {
        "min": 1,
        "max": 300,
        "step": 0.1
      },
      "options": ["Option 1", "Option 2"]  // Se for select
    }
  ],
  "formula": "weight * proteinPerKg",
  "results": {
    "categories": [
      {
        "range": [0, 1.0],
        "label": "Categoria",
        "color": "blue|green|orange|red",
        "recommendations": ["Dica 1", "Dica 2"]
      }
    ]
  }
}
```

#### **Para Quizzes:**
```json
{
  "type": "quiz",
  "questions": [
    {
      "id": 1,
      "question": "Texto da pergunta?",
      "type": "multipla",
      "options": ["Opção 1", "Opção 2", "Opção 3", "Opção 4"],
      "weight": 1  // Peso na pontuação
    }
  ],
  "scoring": {
    "ranges": [
      {
        "min": 0,
        "max": 5,
        "result": "Resultado Baixo",
        "recommendations": ["Recomendação 1", "Recomendação 2"]
      }
    ]
  }
}
```

---

## 🛠️ Como Implementar

### **Fase 1: Criar Componentes Base**
```
src/components/wellness/
  ├── CalculatorBase.tsx        # Base para todas calculadoras
  ├── QuizBase.tsx               # Base para todos quizzes
  └── plans/
      ├── DailyWellness.tsx      # Planilha de bem-estar
      └── MealPlanner.tsx         # Planejador de refeições
```

### **Fase 2: Criar Páginas**
```
src/app/pt/wellness/calculadora/
  ├── imc/page.tsx
  ├── proteina/page.tsx
  ├── hidratacao/page.tsx
  └── composicao/page.tsx

src/app/pt/wellness/quiz/
  ├── ganhos/page.tsx
  ├── potencial/page.tsx
  ├── proposito/page.tsx
  ├── parasitas/page.tsx
  ├── alimentacao/page.tsx
  ├── avaliacao/page.tsx
  └── perfil/page.tsx

src/app/pt/wellness/planilha/
  ├── diario/page.tsx
  └── refeicoes/page.tsx
```

### **Fase 3: Criar Lógica de Cálculo**
```
src/lib/wellness-calculators/
  ├── imc.ts
  ├── proteina.ts
  ├── hidratacao.ts
  └── composicao.ts

src/lib/wellness-quizzes/
  ├── ganhos.ts
  ├── potencial.ts
  ├── proposito.ts
  └── parasitas.ts
```

---

## 📦 Estrutura de Dados no Supabase

### **Tabela: templates_nutrition**
```sql
INSERT INTO templates_nutrition (
  name,           -- 'Calculadora IMC'
  type,           -- 'calculadora', 'quiz', 'planilha'
  language,       -- 'pt'
  specialization, -- 'avaliacao', 'nutricao', 'bem-estar', 'negocio'
  objective,      -- 'capturar-leads', 'vender-suplementos'
  title,          -- 'Calcule seu Índice de Massa Corporal'
  description,    -- 'Descubra seu IMC e receba orientações...'
  content,        -- JSONB com toda estrutura
  cta_text,       -- 'Ver meu resultado personalizado'
  whatsapp_message, -- Mensagem pré-formatada
  is_active       -- true
)
```

---

## 🚀 Próximos Passos

1. ✅ **Criar arquivo de nomenclatura** (este documento)
2. ⏳ **Criar componentes base** (CalculatorBase, QuizBase)
3. ⏳ **Implementar cada calculadora** (1-4)
4. ⏳ **Implementar cada quiz** (5-9, 12-13)
5. ⏳ **Criar planilhas** (10-11)
6. ⏳ **Integrar com sistema de entrega YLADA**
7. ⏳ **Conectar com captura de leads**

---

## 📝 Notas Importantes

- **Filosofia YLADA:** Educar → Servir → Engajar → Converter
- **Entrega:** Use o sistema de entrega do YLADA (não do Herbalead)
- **WhatsApp:** Mensagens já pré-configuradas para cada template
- **Reutilização:** Templates são `multi`, usados por Nutri, Coach e Wellness

