# 🎯 ANÁLISE: Fluxos Hype Drink no Wellness

**Data:** 2025-01-27  
**Baseado em:** Conversa ChatGPT + Filosofia Wellness System

---

## 📋 RESUMO EXECUTIVO

A proposta de criar fluxos para vender Hype Drink no Wellness está **100% alinhada** com a filosofia do sistema, mas precisa de **ajustes técnicos** para se integrar perfeitamente à estrutura existente.

### ✅ **O QUE ESTÁ CERTO**

1. **Filosofia Educativa** ✅
   - Foco em educar antes de vender
   - Linguagem de compliance (sem promessas médicas)
   - Uso de "apoia", "contribui", "ajuda" (não "cura", "garante")

2. **Estrutura de Fluxos** ✅
   - Dor → Diagnóstico → Solução → Ação
   - Múltiplos pontos de entrada (quizzes, calculadoras)
   - Personalização por perfil

3. **Integração com Hype Drink** ✅
   - Produto já existe no sistema (`tipo: 'hype'`)
   - Já mapeado em `personalization.ts` para objetivos `foco` e `performance`
   - Custo e PV já calculados

### ⚠️ **O QUE PRECISA AJUSTAR**

1. **Valores Nutricionais** - Ajustar para 1/2 dose de cada (NRG + Herbal)
2. **Estrutura de Templates** - Seguir padrão existente de quizzes/calculadoras
3. **Tags e Perfis** - Usar sistema de tags do Wellness
4. **Diagnósticos** - Integrar com sistema de diagnósticos existente

---

## 🧪 1. VALORES NUTRICIONAIS CORRETOS DO HYPE DRINK

### **Composição (Ajustada)**
- 1 dose CR7 Drive
- 1 tablete Liftoff
- **1/2 dose NRG** (100g = 120 doses)
- **1/2 dose Herbal Concentrate** (100g = 120 doses)

### **Valores Nutricionais Aproximados (por copo 1L)**

| Componente | Estimativa |
|------------|------------|
| **Calorias** | ~25-35 kcal |
| **Carboidratos** | ~6-8 g |
| **Açúcares** | ~3-5 g |
| **Gorduras** | 0 g |
| **Cafeína total** | ~90-110 mg |
| **Vitaminas** | Complexo B (B1, B2, B3, B5, B6, B12) + Vit. C |
| **Outros** | Taurina, Polifenóis (chá verde/preto) |

### **Descrição Técnica (Para o Sistema)**
```
Bebida funcional com cafeína natural, vitaminas do complexo B e carboidratos leves, desenvolvida para apoiar energia, foco, hidratação e disposição no dia a dia.
```

---

## 🎯 2. DORES QUE O HYPE ATACA (BASE DOS FLUXOS)

### **Dores Principais Identificadas**

1. **Cansaço logo pela manhã**
   - Tag: `energia_baixa`, `manha_produtiva`
   - Perfil: `energia_instavel`

2. **Queda de energia no meio do dia**
   - Tag: `energia_instavel`, `produtividade`
   - Perfil: `alta_demanda_mental`

3. **Falta de foco no trabalho ou estudo**
   - Tag: `foco_baixo`, `clareza_mental`
   - Perfil: `alta_demanda_mental`

4. **Treinos sem disposição**
   - Tag: `pre_treino_leve`, `performance`
   - Perfil: `alta_demanda_fisica`

5. **Uso excessivo de café**
   - Tag: `alto_consumo_cafe`, `dependencia_cafeina`
   - Perfil: `energia_instavel`

6. **Pré-treinos fortes que causam taquicardia**
   - Tag: `pre_treino_leve`, `sensibilidade_cafeina`
   - Perfil: `pre_treino_leve`

7. **Falta de constância na rotina saudável**
   - Tag: `rotina_corrida`, `constancia`
   - Perfil: `rotina_desorganizada`

8. **Dificuldade em beber água ao longo do dia**
   - Tag: `hidratacao`, `rotina_corrida`
   - Perfil: `hidratacao_baixa`

---

## 🚀 3. BENEFÍCIOS-CHAVE DO HYPE (LINGUAGEM DE VENDA)

### **Benefícios Mapeados (Compliance)**

| Benefício | Linguagem Correta | Tag |
|-----------|-------------------|-----|
| **Energia funcional** | "Apoia energia estável, sem pico e sem queda brusca" | `energia_estavel` |
| **Foco mental** | "Ajuda na clareza mental para trabalhar, estudar ou treinar melhor" | `foco`, `clareza_mental` |
| **Hidratação ativa** | "Ajuda a manter o corpo hidratado mesmo em rotinas corridas" | `hidratacao`, `rotina_corrida` |
| **Constância** | "Facilita manter uma rotina saudável todos os dias" | `constancia`, `rotina` |
| **Alternativa ao café** | "Pode ajudar a reduzir dependência de café ao longo do dia" | `alternativa_cafe`, `cafeina_natural` |

### **Frase Final Padrão (Compliance)**
```
"O Hype Drink não substitui refeições nem tratamentos. Ele é uma bebida funcional que apoia energia, foco e hidratação dentro de um estilo de vida saudável."
```

---

## 🧩 4. ESTRUTURA DE FLUXOS (INTEGRAÇÃO COM SISTEMA)

### **FLUXO 1: Energia & Foco (Principal)**

**Tipo:** Quiz (`quiz_wellness_energia_foco`)

**Estrutura:**
```json
{
  "template_type": "quiz",
  "profession": "wellness",
  "objective": "vender-hype",
  "questions": [
    {
      "id": 1,
      "question": "Em qual período do dia sua energia mais cai?",
      "type": "multiple_choice",
      "options": [
        {"id": "a", "label": "Manhã", "weight": 2},
        {"id": "b", "label": "Meio da tarde", "weight": 3},
        {"id": "c", "label": "Noite", "weight": 1},
        {"id": "d", "label": "Varia o dia todo", "weight": 3}
      ]
    },
    {
      "id": 2,
      "question": "Como você costuma lidar com a queda de energia?",
      "type": "multiple_choice",
      "options": [
        {"id": "a", "label": "Café", "weight": 2},
        {"id": "b", "label": "Energético", "weight": 3},
        {"id": "c", "label": "Aguento até acabar o dia", "weight": 3},
        {"id": "d", "label": "Não tenho estratégia", "weight": 2}
      ]
    },
    {
      "id": 3,
      "question": "Quantas xícaras de café você consome por dia?",
      "type": "multiple_choice",
      "options": [
        {"id": "a", "label": "Nenhuma", "weight": 1},
        {"id": "b", "label": "1-2", "weight": 1},
        {"id": "c", "label": "3-4", "weight": 2},
        {"id": "d", "label": "5 ou mais", "weight": 3}
      ]
    },
    {
      "id": 4,
      "question": "Como está seu foco mental ao longo do dia?",
      "type": "multiple_choice",
      "options": [
        {"id": "a", "label": "Bom", "weight": 1},
        {"id": "b", "label": "Oscila", "weight": 2},
        {"id": "c", "label": "Cai rápido", "weight": 3},
        {"id": "d", "label": "Muito difícil manter", "weight": 3}
      ]
    },
    {
      "id": 5,
      "question": "Você pratica atividade física?",
      "type": "multiple_choice",
      "options": [
        {"id": "a", "label": "Não", "weight": 1},
        {"id": "b", "label": "1-2x/semana", "weight": 1},
        {"id": "c", "label": "3-4x/semana", "weight": 2},
        {"id": "d", "label": "5x ou mais", "weight": 2}
      ]
    }
  ],
  "scoring": {
    "ranges": [
      {
        "min": 0,
        "max": 6,
        "result": "Energia Baixa",
        "tags": ["energia_baixa", "hype_recomendado"],
        "recommendations": [
          "Seu perfil indica necessidade de apoio em energia e foco.",
          "Bebidas funcionais como o Hype Drink podem ajudar na sua rotina.",
          "O Hype Drink combina cafeína natural, vitaminas do complexo B e hidratação."
        ]
      },
      {
        "min": 7,
        "max": 10,
        "result": "Energia Instável",
        "tags": ["energia_instavel", "hype_recomendado"],
        "recommendations": [
          "Você tem altos e baixos de energia ao longo do dia.",
          "O Hype Drink pode ajudar a manter energia mais estável.",
          "Com cafeína natural e vitaminas, ele apoia foco e disposição."
        ]
      },
      {
        "min": 11,
        "max": 15,
        "result": "Alta Demanda Física/Mental",
        "tags": ["alta_demanda", "hype_recomendado", "performance"],
        "recommendations": [
          "Sua rotina exige muita energia e foco.",
          "O Hype Drink é ideal para quem precisa de performance constante.",
          "Ele combina energia, foco e hidratação em uma bebida funcional."
        ]
      }
    ]
  }
}
```

**Saída Padrão:**
```
"Seu perfil indica necessidade de apoio em energia, foco e hidratação. Bebidas funcionais como o Hype Drink podem ajudar na sua rotina."
```

**CTA:**
```
"Quer experimentar o Hype Drink na sua rotina?"
```

---

### **FLUXO 2: Pré-Treino Leve**

**Tipo:** Quiz (`quiz_wellness_pre_treino`)

**Estrutura:**
```json
{
  "template_type": "quiz",
  "profession": "wellness",
  "objective": "vender-hype",
  "questions": [
    {
      "id": 1,
      "question": "Você sente disposição antes de treinar?",
      "type": "multiple_choice",
      "options": [
        {"id": "a", "label": "Sempre", "weight": 1},
        {"id": "b", "label": "Às vezes", "weight": 2},
        {"id": "c", "label": "Raramente", "weight": 3},
        {"id": "d", "label": "Nunca", "weight": 3}
      ]
    },
    {
      "id": 2,
      "question": "Já teve desconforto com pré-treinos fortes?",
      "type": "multiple_choice",
      "options": [
        {"id": "a", "label": "Sim, taquicardia", "weight": 3},
        {"id": "b", "label": "Sim, ansiedade", "weight": 3},
        {"id": "c", "label": "Sim, desconforto", "weight": 2},
        {"id": "d", "label": "Não", "weight": 1}
      ]
    },
    {
      "id": 3,
      "question": "Seu treino é mais:",
      "type": "multiple_choice",
      "options": [
        {"id": "a", "label": "Força", "weight": 2},
        {"id": "b", "label": "Cardio", "weight": 2},
        {"id": "c", "label": "Funcional", "weight": 2},
        {"id": "d", "label": "Misto", "weight": 2}
      ]
    },
    {
      "id": 4,
      "question": "Você treina em qual horário?",
      "type": "multiple_choice",
      "options": [
        {"id": "a", "label": "Manhã", "weight": 2},
        {"id": "b", "label": "Tarde", "weight": 2},
        {"id": "c", "label": "Noite", "weight": 1}
      ]
    },
    {
      "id": 5,
      "question": "Você prefere algo:",
      "type": "multiple_choice",
      "options": [
        {"id": "a", "label": "Leve", "weight": 3},
        {"id": "b", "label": "Moderado", "weight": 2},
        {"id": "c", "label": "Forte", "weight": 1}
      ]
    }
  ],
  "scoring": {
    "ranges": [
      {
        "min": 0,
        "max": 8,
        "result": "Pré-treino Leve Recomendado",
        "tags": ["pre_treino_leve", "hype_recomendado"],
        "recommendations": [
          "Para o seu perfil, uma bebida funcional com cafeína natural e hidratação pode ser mais adequada.",
          "O Hype Drink é uma alternativa mais leve aos pré-treinos agressivos.",
          "Ele combina cafeína natural, vitaminas e hidratação sem excessos."
        ]
      }
    ]
  }
}
```

**Saída Padrão:**
```
"Para o seu perfil, uma bebida funcional com cafeína natural e hidratação pode ser mais adequada do que pré-treinos agressivos."
```

**CTA:**
```
"Quer aprender como usar o Hype Drink antes do treino?"
```

---

### **FLUXO 3: Rotina Produtiva (Manhã)**

**Tipo:** Quiz (`quiz_wellness_rotina_produtiva`)

**Estrutura:**
```json
{
  "template_type": "quiz",
  "profession": "wellness",
  "objective": "vender-hype",
  "questions": [
    {
      "id": 1,
      "question": "Seu dia começa organizado?",
      "type": "multiple_choice",
      "options": [
        {"id": "a", "label": "Sempre", "weight": 1},
        {"id": "b", "label": "Às vezes", "weight": 2},
        {"id": "c", "label": "Raramente", "weight": 3},
        {"id": "d", "label": "Nunca", "weight": 3}
      ]
    },
    {
      "id": 2,
      "question": "Você sente queda de produtividade antes das 15h?",
      "type": "multiple_choice",
      "options": [
        {"id": "a", "label": "Sempre", "weight": 3},
        {"id": "b", "label": "Às vezes", "weight": 2},
        {"id": "c", "label": "Raramente", "weight": 1},
        {"id": "d", "label": "Nunca", "weight": 1}
      ]
    },
    {
      "id": 3,
      "question": "Você costuma pular refeições ou esquecer de beber água?",
      "type": "multiple_choice",
      "options": [
        {"id": "a", "label": "Sempre", "weight": 3},
        {"id": "b", "label": "Às vezes", "weight": 2},
        {"id": "c", "label": "Raramente", "weight": 1},
        {"id": "d", "label": "Nunca", "weight": 1}
      ]
    },
    {
      "id": 4,
      "question": "Sua rotina é:",
      "type": "multiple_choice",
      "options": [
        {"id": "a", "label": "Previsível", "weight": 1},
        {"id": "b", "label": "Corrida", "weight": 2},
        {"id": "c", "label": "Caótica", "weight": 3}
      ]
    },
    {
      "id": 5,
      "question": "Você busca mais:",
      "type": "multiple_choice",
      "options": [
        {"id": "a", "label": "Energia", "weight": 2},
        {"id": "b", "label": "Foco", "weight": 3},
        {"id": "c", "label": "Organização", "weight": 2},
        {"id": "d", "label": "Tudo", "weight": 3}
      ]
    }
  ],
  "scoring": {
    "ranges": [
      {
        "min": 0,
        "max": 7,
        "result": "Rotina Organizada",
        "tags": ["rotina_organizada"],
        "recommendations": [
          "Sua rotina está bem organizada!",
          "O Hype Drink pode ajudar a manter essa constância."
        ]
      },
      {
        "min": 8,
        "max": 11,
        "result": "Rotina Corrida",
        "tags": ["rotina_corrida", "hype_recomendado"],
        "recommendations": [
          "Sua rotina é intensa e exige muita energia e foco.",
          "O Hype Drink pode ajudar a manter produtividade constante.",
          "Ele combina energia, foco e hidratação em uma solução prática."
        ]
      },
      {
        "min": 12,
        "max": 15,
        "result": "Alta Demanda Mental",
        "tags": ["alta_demanda_mental", "hype_recomendado", "foco"],
        "recommendations": [
          "Para rotinas intensas, soluções simples que apoiem energia e foco ajudam na constância diária.",
          "O Hype Drink é ideal para quem precisa de performance mental constante.",
          "Muitas pessoas usam o Hype pela manhã para começar o dia com mais disposição."
        ]
      }
    ]
  }
}
```

**Saída Padrão:**
```
"Para rotinas intensas, soluções simples que apoiem energia e foco ajudam na constância diária."
```

**CTA:**
```
"Quer testar essa rotina matinal com o Hype Drink?"
```

---

### **FLUXO 4: Constância & Rotina Saudável**

**Tipo:** Quiz (`quiz_wellness_constancia`)

**Estrutura:**
```json
{
  "template_type": "quiz",
  "profession": "wellness",
  "objective": "vender-hype",
  "questions": [
    {
      "id": 1,
      "question": "Você sente dificuldade em manter uma rotina saudável todos os dias?",
      "type": "multiple_choice",
      "options": [
        {"id": "a", "label": "Sempre", "weight": 3},
        {"id": "b", "label": "Às vezes", "weight": 2},
        {"id": "c", "label": "Raramente", "weight": 1},
        {"id": "d", "label": "Nunca", "weight": 1}
      ]
    },
    {
      "id": 2,
      "question": "O que mais te atrapalha na rotina?",
      "type": "multiple_choice",
      "options": [
        {"id": "a", "label": "Falta de energia", "weight": 3},
        {"id": "b", "label": "Falta de foco", "weight": 3},
        {"id": "c", "label": "Falta de tempo", "weight": 2},
        {"id": "d", "label": "Falta de motivação", "weight": 2}
      ]
    },
    {
      "id": 3,
      "question": "Você já iniciou alguma rotina saudável?",
      "type": "multiple_choice",
      "options": [
        {"id": "a", "label": "Sim, e mantive", "weight": 1},
        {"id": "b", "label": "Sim, mas parei", "weight": 2},
        {"id": "c", "label": "Não, nunca tentei", "weight": 3}
      ]
    }
  ],
  "scoring": {
    "ranges": [
      {
        "min": 0,
        "max": 5,
        "result": "Rotina Estabelecida",
        "tags": ["rotina_estabelecida"],
        "recommendations": [
          "Ótimo! Você já tem uma rotina estabelecida.",
          "O Hype Drink pode ajudar a manter essa constância nos dias mais puxados."
        ]
      },
      {
        "min": 6,
        "max": 9,
        "result": "Dificuldade de Constância",
        "tags": ["constancia", "hype_recomendado"],
        "recommendations": [
          "Sem energia e foco, a rotina não se sustenta.",
          "O Hype Drink entra como um facilitador de constância, ajudando nos dias mais puxados.",
          "Ele combina energia, foco e hidratação em uma solução prática para o dia a dia."
        ]
      }
    ]
  }
}
```

**Saída Padrão:**
```
"Agora que você já iniciou sua rotina, o Hype Drink entra como um acelerador de energia e constância, principalmente nos dias mais puxados."
```

**CTA:**
```
"Quer incluir o Hype Drink no seu acompanhamento Wellness?"
```

---

## 🧮 5. CALCULADORAS (SENSAÇÃO DE PERSONALIZAÇÃO)

### **CALCULADORA 1: Consumo de Cafeína**

**Tipo:** Calculadora (`calc_wellness_consumo_cafeina`)

**Campos:**
- Quantos cafés por dia? (number)
- Usa energético? (boolean)
- Treina? (boolean)
- Horário do treino? (select: manhã/tarde/noite)

**Cálculo (interno):**
```typescript
let consumoEstimado = 0
if (cafes > 0) consumoEstimado += cafes * 80 // mg por xícara
if (energetico) consumoEstimado += 80 // mg por energético
if (treina) consumoEstimado += 50 // estimativa de pré-treino

let categoria = 'baixo'
if (consumoEstimado > 300) categoria = 'alto'
else if (consumoEstimado > 200) categoria = 'moderado'
```

**Saída:**
```
"Seu consumo de cafeína pode estar elevado ou mal distribuído ao longo do dia. Alternativas com cafeína natural e dosagem controlada podem ajudar."
```

**Tags:** `alto_consumo_cafe`, `hype_recomendado`

---

### **CALCULADORA 2: Nível de Hidratação**

**Tipo:** Calculadora (`calc_wellness_hidratacao`)

**Campos:**
- Peso corporal (kg)
- Quantos copos de água/dia? (number)
- Atividade física? (boolean)
- Horas de atividade? (number)

**Cálculo:**
```typescript
const necessidadeBase = peso * 35 // ml/kg
const ajusteAtividade = atividade ? horasAtividade * 500 : 0
const necessidadeTotal = necessidadeBase + ajusteAtividade
const consumoAtual = coposAgua * 250 // ml por copo

let status = 'adequado'
if (consumoAtual < necessidadeTotal * 0.7) status = 'baixo'
else if (consumoAtual < necessidadeTotal * 0.9) status = 'moderado'
```

**Saída:**
```
"Seu nível de hidratação está abaixo do ideal para sua rotina. Bebidas funcionais podem ajudar a aumentar a ingestão de líquidos."
```

**Tags:** `hidratacao_baixa`, `hype_recomendado`

---

### **CALCULADORA 3: Custo da Falta de Energia**

**Tipo:** Calculadora (`calc_wellness_custo_energia`)

**Campos:**
- Horas trabalhadas/dia (number)
- Horas improdutivas por cansaço (number)
- Tipo de trabalho (select: mental/físico/misto)
- Valor hora trabalhada (number, opcional)

**Cálculo:**
```typescript
const percentualImprodutivo = (horasImprodutivas / horasTrabalhadas) * 100
const custoEstimado = valorHora ? horasImprodutivas * valorHora : null

let impacto = 'baixo'
if (percentualImprodutivo > 30) impacto = 'alto'
else if (percentualImprodutivo > 15) impacto = 'moderado'
```

**Saída:**
```
"A perda de energia ao longo do dia pode impactar diretamente sua produtividade. Estratégias simples de suporte energético ajudam na performance."
```

**Tags:** `produtividade`, `energia_baixa`, `hype_recomendado`

---

## 🏷️ 6. SISTEMA DE TAGS E PERFIS

### **Tags Principais para Hype Drink**

```typescript
const tagsHype = [
  'energia_baixa',
  'energia_instavel',
  'foco_baixo',
  'clareza_mental',
  'pre_treino_leve',
  'performance',
  'rotina_corrida',
  'alta_demanda_mental',
  'alta_demanda_fisica',
  'alto_consumo_cafe',
  'alternativa_cafe',
  'hidratacao_baixa',
  'constancia',
  'hype_recomendado'
]
```

### **Lógica de Decisão (Para o Sistema)**

```typescript
function sugerirHype(perfil: PerfilWellness): boolean {
  const tags = perfil.tags || []
  
  // Se tem tag específica
  if (tags.includes('hype_recomendado')) return true
  
  // Se tem múltiplas dores que o Hype resolve
  const doresHype = [
    'energia_baixa',
    'energia_instavel',
    'foco_baixo',
    'pre_treino_leve',
    'alto_consumo_cafe'
  ]
  
  const doresPresentes = doresHype.filter(dor => tags.includes(dor))
  if (doresPresentes.length >= 2) return true
  
  // Se tem objetivo de foco ou performance
  if (perfil.objetivo === 'foco' || perfil.objetivo === 'performance') {
    return true
  }
  
  return false
}
```

---

## 📝 7. COPY PRONTA PARA IMPLEMENTAÇÃO

### **Frase Base Padrão (Compliance)**
```
"O Hype Drink é uma bebida funcional com cafeína natural, vitaminas do complexo B e ingredientes que ajudam na disposição, foco e hidratação, sendo uma opção prática para quem precisa de energia no dia a dia."
```

### **Scripts por Situação**

#### **Energia & Foco**
```
"Quando a energia cai, a produtividade despenca. Muitas pessoas recorrem a excesso de café ou estimulantes fortes, mas isso gera ansiedade e queda brusca depois. O Hype Drink é uma bebida funcional com cafeína natural, vitaminas do complexo B e hidratação, criada para apoiar energia e foco de forma mais equilibrada. Quer experimentar o Hype na sua rotina?"
```

#### **Pré-Treino Leve**
```
"Pré-treinos muito estimulantes podem causar taquicardia, ansiedade ou desconforto. O Hype é uma alternativa mais leve, com cafeína natural, hidratação e vitaminas, ideal para quem busca desempenho sem exageros. Quer aprender como usar antes do treino?"
```

#### **Manhã Produtiva**
```
"Começar o dia sem energia compromete decisões, humor e produtividade. Muitas pessoas usam o Hype logo pela manhã para iniciar o dia com mais disposição, foco e hidratação. Quer testar essa rotina matinal?"
```

#### **Constância & Rotina**
```
"Sem energia e foco, a rotina não se sustenta. O Hype entra como um facilitador de constância, ajudando nos dias mais puxados. Quer incluir o Hype no seu acompanhamento Wellness?"
```

---

## ✅ 8. PRÓXIMOS PASSOS (IMPLEMENTAÇÃO)

### **Fase 1: Criar Templates no Banco**
1. Criar 4 quizzes no `templates_nutrition`:
   - `quiz_wellness_energia_foco`
   - `quiz_wellness_pre_treino`
   - `quiz_wellness_rotina_produtiva`
   - `quiz_wellness_constancia`

2. Criar 3 calculadoras no `templates_nutrition`:
   - `calc_wellness_consumo_cafeina`
   - `calc_wellness_hidratacao` (já existe, ajustar)
   - `calc_wellness_custo_energia`

### **Fase 2: Criar Páginas**
1. Criar páginas em `src/app/pt/wellness/quiz/`:
   - `energia-foco/page.tsx`
   - `pre-treino/page.tsx`
   - `rotina-produtiva/page.tsx`
   - `constancia/page.tsx`

2. Criar páginas em `src/app/pt/wellness/calculadora/`:
   - `consumo-cafeina/page.tsx`
   - `custo-energia/page.tsx`

### **Fase 3: Integrar com Sistema de Diagnósticos**
1. Criar arquivos de diagnóstico em `src/lib/diagnostics/wellness/`:
   - `quiz-energia-foco.ts`
   - `quiz-pre-treino.ts`
   - `quiz-rotina-produtiva.ts`
   - `quiz-constancia.ts`

2. Mapear resultados para tags e recomendações de Hype Drink

### **Fase 4: Integrar com NOEL**
1. Atualizar `personalization.ts` para incluir novos fluxos
2. Atualizar `tools-integration.ts` para mapear resultados dos quizzes
3. Atualizar `links-recommender.ts` para sugerir links de Hype Drink

### **Fase 5: Testes e Validação**
1. Testar todos os fluxos
2. Validar tags e recomendações
3. Ajustar copy conforme feedback

---

## 🎯 CONCLUSÃO

A proposta está **muito bem estruturada** e alinhada com a filosofia do Wellness. Os principais ajustes são:

1. ✅ **Ajustar valores nutricionais** para 1/2 dose de cada
2. ✅ **Seguir estrutura de templates** existente
3. ✅ **Integrar com sistema de tags** do Wellness
4. ✅ **Usar diagnósticos** existentes como base
5. ✅ **Manter compliance** em todas as comunicações

**Próximo passo:** Implementar os templates seguindo a estrutura documentada acima.

