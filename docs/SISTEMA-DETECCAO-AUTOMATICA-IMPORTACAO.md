# 🧠 Sistema de Detecção Automática de Importação

## 📋 Visão Geral

Sistema inteligente que analisa planilhas personalizadas e mapeia automaticamente para o padrão do sistema, permitindo importação de qualquer formato de planilha.

---

## 🎯 Objetivo

Permitir que nutricionistas e coaches importem suas planilhas existentes sem precisar reformatar manualmente, através de detecção automática inteligente.

---

## 🔄 Fluxo Proposto

### **Opção 1: Template Padrão (Atual)**
1. Usuário baixa template padrão
2. Preenche com dados
3. Importa diretamente (100% automático)

### **Opção 2: Planilha Personalizada (Nova)**
1. Usuário arrasta planilha personalizada
2. Sistema analisa e detecta padrões automaticamente
3. Sistema sugere mapeamento inteligente
4. Usuário revisa e confirma
5. Sistema importa adaptando para padrão

---

## 🧩 Componentes do Sistema

### **1. Análise de Similaridade de Texto (Fuzzy Matching)**

```typescript
// Função de similaridade (Levenshtein ou Jaro-Winkler)
function calculateSimilarity(str1: string, str2: string): number {
  // Retorna 0-1 (0 = diferente, 1 = idêntico)
}

// Exemplo:
// "Nome Completo" vs "Nome do Cliente" = 0.75
// "Email" vs "E-mail" = 0.95
// "Peso" vs "Peso (kg)" = 0.85
```

**Estratégias:**
- Comparar cada coluna da planilha com todos os campos padrão
- Usar múltiplos algoritmos de similaridade
- Considerar sinônimos e variações comuns
- Ignorar acentos, maiúsculas, símbolos

---

### **2. Detecção de Tipo de Dados**

```typescript
function detectDataType(columnData: any[]): 'text' | 'email' | 'phone' | 'date' | 'number' | 'weight' | 'measurement' {
  // Analisa o conteúdo das células para inferir o tipo
  
  // Exemplos:
  // Se contém "@" e domínios → email
  // Se formato (XX) XXXXX-XXXX → phone
  // Se formato DD/MM/YYYY → date
  // Se números entre 30-200 com "kg" → weight
  // Se números decimais pequenos (1.50-2.50) → height
}
```

**Benefícios:**
- Valida se o mapeamento faz sentido
- Ajuda a identificar campos mesmo com nomes diferentes
- Detecta unidades (kg, cm, mm, %)

---

### **3. Análise de Contexto e Posição**

```typescript
function analyzeContext(headers: string[], index: number): {
  isFirstColumn: boolean,
  isLastColumn: boolean,
  nearbyColumns: string[],
  columnPattern: 'personal_data' | 'contact' | 'address' | 'measurements' | 'assessment'
} {
  // Analisa a posição e contexto da coluna
  
  // Exemplos:
  // Primeira coluna geralmente é nome
  // Colunas próximas a "Email" podem ser telefone
  // Colunas com números após dados pessoais podem ser medidas
}
```

---

### **4. Banco de Padrões Conhecidos**

```typescript
const KNOWN_PATTERNS = {
  // Padrões comuns de anotação
  name: [
    { patterns: ['nome', 'cliente', 'paciente'], weight: 1.0 },
    { patterns: ['ficha', 'cadastro'], context: 'first_column', weight: 0.8 },
    { patterns: ['pessoa', 'contato'], weight: 0.6 }
  ],
  email: [
    { patterns: ['email', 'e-mail', 'mail'], weight: 1.0 },
    { patterns: ['correio', 'contato'], dataType: 'email', weight: 0.9 }
  ],
  weight: [
    { patterns: ['peso', 'weight'], weight: 1.0 },
    { patterns: ['kg'], dataType: 'weight', weight: 0.95 },
    { patterns: ['massa'], context: 'after_height', weight: 0.7 }
  ]
  // ... todos os campos
}
```

---

### **5. Sistema de Pontuação e Ranking**

```typescript
interface MappingScore {
  sourceColumn: string,
  targetField: string,
  confidence: number, // 0-100
  reasons: string[] // Explicações do porquê
}

function scoreMapping(
  sourceColumn: string,
  targetField: string,
  columnData: any[],
  context: Context
): MappingScore {
  let score = 0
  const reasons: string[] = []
  
  // 1. Similaridade de texto (0-40 pontos)
  const textSimilarity = calculateSimilarity(sourceColumn, targetField)
  score += textSimilarity * 40
  if (textSimilarity > 0.7) reasons.push('Nome muito similar')
  
  // 2. Tipo de dados (0-30 pontos)
  const dataType = detectDataType(columnData)
  const expectedType = getExpectedDataType(targetField)
  if (dataType === expectedType) {
    score += 30
    reasons.push('Tipo de dados compatível')
  }
  
  // 3. Padrões conhecidos (0-20 pontos)
  const patternMatch = checkKnownPatterns(sourceColumn, targetField)
  if (patternMatch) {
    score += patternMatch.weight * 20
    reasons.push(`Padrão conhecido: ${patternMatch.pattern}`)
  }
  
  // 4. Contexto e posição (0-10 pontos)
  const contextScore = analyzeContextualFit(sourceColumn, targetField, context)
  score += contextScore * 10
  if (contextScore > 0.7) reasons.push('Contexto adequado')
  
  return {
    sourceColumn,
    targetField,
    confidence: Math.min(100, score),
    reasons
  }
}
```

---

## 🎨 Interface do Usuário

### **Etapa 1: Upload e Análise**
```
┌─────────────────────────────────────┐
│  📁 Arraste sua planilha aqui       │
│                                     │
│  [Analisando estrutura...]         │
│  ✓ 15 colunas detectadas           │
│  ✓ Padrões identificados           │
└─────────────────────────────────────┘
```

### **Etapa 2: Mapeamento Sugerido (com Confiança)**
```
┌─────────────────────────────────────────────────────────┐
│  Mapeamento Automático Detectado                       │
│                                                         │
│  Campo do Sistema    ←  Sua Planilha    Confiança      │
│  ────────────────────────────────────────────────────  │
│  Nome Completo    ←  "Nome do Cliente"  ✅ 95%         │
│  Email            ←  "E-mail"          ✅ 98%         │
│  Telefone         ←  "Celular"          ✅ 88%         │
│  Peso (kg)        ←  "Peso"             ✅ 92%         │
│  Altura (m)       ←  "Altura"           ⚠️  65%         │
│  [Não detectado]  ←  "Ficha Avaliação"  ❌  0%         │
└─────────────────────────────────────────────────────────┘

[✓ Aprovar Mapeamento]  [✏️ Ajustar Manualmente]
```

### **Etapa 3: Revisão e Ajuste Manual (se necessário)**
```
┌─────────────────────────────────────────────────────────┐
│  Ajustar Mapeamento                                     │
│                                                         │
│  Nome Completo:                                         │
│  [▼] "Nome do Cliente" ✅ (95% confiança)              │
│      Outras opções:                                     │
│      • "Ficha Avaliação" (15%)                         │
│      • "Cliente" (45%)                                 │
│                                                         │
│  Altura (m):                                            │
│  [▼] "Altura" ⚠️ (65% confiança - verificar)          │
│      Outras opções:                                     │
│      • "Estatura" (80%)                                │
│      • "Altura (cm)" (75%)                             │
└─────────────────────────────────────────────────────────┘
```

### **Etapa 4: Preview e Validação**
```
┌─────────────────────────────────────────────────────────┐
│  Preview dos Dados Mapeados                            │
│                                                         │
│  Registro 1:                                            │
│  • Nome: João Silva                                     │
│  • Email: joao@email.com                               │
│  • Peso: 85.5 kg                                       │
│  • Altura: 1.75 m                                      │
│                                                         │
│  [✓ Tudo correto!]  [← Voltar para ajustar]            │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Implementação Técnica

### **API: Análise Inteligente**

```typescript
// POST /api/coach/import/analyze
{
  headers: string[],
  sampleRows: any[][], // Primeiras 5 linhas para análise
  totalRows: number
}

// Resposta:
{
  mappings: MappingScore[],
  confidence: number, // Confiança geral (0-100)
  suggestions: {
    highConfidence: MappingScore[], // >80%
    mediumConfidence: MappingScore[], // 50-80%
    lowConfidence: MappingScore[], // <50%
    unmapped: string[] // Colunas não mapeadas
  },
  warnings: string[],
  recommendations: string[]
}
```

### **Algoritmo de Detecção**

```typescript
async function analyzeSpreadsheet(headers: string[], sampleRows: any[][]): Promise<AnalysisResult> {
  const mappings: MappingScore[] = []
  
  // Para cada campo do sistema
  for (const targetField of FIELD_MAPPINGS) {
    let bestMatch: MappingScore | null = null
    
    // Para cada coluna da planilha
    for (const header of headers) {
      const columnData = sampleRows.map(row => row[headers.indexOf(header)])
      
      // Calcular score
      const score = scoreMapping(header, targetField.key, columnData, {
        headers,
        index: headers.indexOf(header)
      })
      
      // Manter o melhor match
      if (!bestMatch || score.confidence > bestMatch.confidence) {
        bestMatch = score
      }
    }
    
    if (bestMatch && bestMatch.confidence > 50) {
      mappings.push(bestMatch)
    }
  }
  
  return {
    mappings,
    confidence: calculateOverallConfidence(mappings),
    suggestions: categorizeMappings(mappings),
    warnings: generateWarnings(mappings),
    recommendations: generateRecommendations(mappings, headers)
  }
}
```

---

## 📊 Exemplos de Detecção

### **Cenário 1: Planilha com nomes diferentes**
```
Planilha:          →  Sistema:
─────────────────────────────────
"Cliente"          →  "Nome Completo" (85%)
"Correio"          →  "Email" (90%)
"Fone"             →  "Telefone" (88%)
"Peso Atual"       →  "Peso (kg)" (92%)
```

### **Cenário 2: Planilha com símbolos/emojis**
```
Planilha:                    →  Sistema:
─────────────────────────────────────────
"✔ FICHA DE AVALIAÇÃO"       →  "Nome Completo" (70%)
"📧 E-mail"                   →  "Email" (95%)
"📱 WhatsApp"                 →  "Telefone" (85%)
```

### **Cenário 3: Planilha em outra ordem**
```
Planilha (ordem diferente):  →  Sistema:
─────────────────────────────────────────
"Email" (coluna 3)           →  "Email" (98%)
"Nome" (coluna 1)            →  "Nome Completo" (95%)
"Peso" (coluna 8)            →  "Peso (kg)" (92%)
```

---

## ✅ Vantagens

1. **Flexibilidade**: Aceita qualquer formato de planilha
2. **Inteligência**: Detecta padrões automaticamente
3. **Transparência**: Mostra confiança e razões
4. **Controle**: Usuário pode revisar e ajustar
5. **Aprendizado**: Pode melhorar com uso

---

## 🚀 Próximos Passos

1. Implementar função de similaridade (Levenshtein)
2. Criar API de análise inteligente
3. Desenvolver interface de revisão
4. Adicionar sistema de pontuação
5. Testar com planilhas reais
6. Melhorar baseado em feedback

---

## 📝 Notas

- Sistema deve ser **conservador**: melhor não mapear do que mapear errado
- Sempre permitir **revisão manual**
- Mostrar **confiança** para cada mapeamento
- Sugerir **alternativas** quando confiança for baixa
- **Aprender** com correções do usuário (futuro)

