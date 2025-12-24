# 🚀 IMPLEMENTAÇÃO PRÁTICA: Fluxos Hype Drink no Wellness

**Data:** 2025-01-27  
**Objetivo:** Guia completo com nomes exatos, estruturas e exemplos de código

---

## 📋 RESUMO EXECUTIVO

Este documento contém **todos os nomes exatos**, **estruturas de arquivos** e **exemplos de código** para implementar os 4 quizzes e 3 calculadoras focados em vender Hype Drink no Wellness.

---

## 🎯 1. NOMES EXATOS DOS TEMPLATES

### **QUIZZES (4 templates)**

| # | Nome no Banco | Slug | Arquivo Diagnóstico | Página |
|---|---------------|------|---------------------|--------|
| 1 | Quiz: Energia & Foco | `quiz-energia-foco` | `quiz-energia-foco.ts` | `energia-foco/page.tsx` |
| 2 | Quiz: Pré-Treino Ideal | `quiz-pre-treino` | `quiz-pre-treino.ts` | `pre-treino/page.tsx` |
| 3 | Quiz: Rotina Produtiva | `quiz-rotina-produtiva` | `quiz-rotina-produtiva.ts` | `rotina-produtiva/page.tsx` |
| 4 | Quiz: Constância & Rotina | `quiz-constancia` | `quiz-constancia.ts` | `constancia/page.tsx` |

### **CALCULADORAS (3 templates)**

| # | Nome no Banco | Slug | Arquivo Diagnóstico | Página |
|---|---------------|------|---------------------|--------|
| 1 | Calculadora: Consumo de Cafeína | `calc-consumo-cafeina` | `calc-consumo-cafeina.ts` | `consumo-cafeina/page.tsx` |
| 2 | Calculadora: Custo da Falta de Energia | `calc-custo-energia` | `calc-custo-energia.ts` | `custo-energia/page.tsx` |
| 3 | Calculadora: Hidratação (ajustar existente) | `calc-hidratacao` | `calculadora-agua.ts` (já existe) | `hidratacao/page.tsx` (já existe) |

---

## 📁 2. ESTRUTURA DE ARQUIVOS

### **2.1. Arquivos de Diagnóstico**

**Localização:** `/src/lib/diagnostics/wellness/`

```
src/lib/diagnostics/wellness/
├── quiz-energia-foco.ts          ← NOVO
├── quiz-pre-treino.ts            ← NOVO
├── quiz-rotina-produtiva.ts      ← NOVO
├── quiz-constancia.ts             ← NOVO
├── calc-consumo-cafeina.ts       ← NOVO
└── calc-custo-energia.ts          ← NOVO
```

### **2.2. Páginas de Templates**

**Localização:** `/src/app/pt/wellness/templates/`

```
src/app/pt/wellness/templates/
├── energia-foco/
│   └── page.tsx                   ← NOVO
├── pre-treino/
│   └── page.tsx                   ← NOVO
├── rotina-produtiva/
│   └── page.tsx                   ← NOVO
├── constancia/
│   └── page.tsx                   ← NOVO
├── consumo-cafeina/
│   └── page.tsx                   ← NOVO
└── custo-energia/
    └── page.tsx                   ← NOVO
```

### **2.3. Previews (Opcional - para modal)**

**Localização:** `/src/components/wellness-previews/quizzes/`

```
src/components/wellness-previews/quizzes/
├── QuizEnergiaFocoPreview.tsx     ← NOVO
├── QuizPreTreinoPreview.tsx        ← NOVO
├── QuizRotinaProdutivaPreview.tsx  ← NOVO
└── QuizConstanciaPreview.tsx       ← NOVO
```

---

## 🗄️ 3. ESTRUTURA NO BANCO DE DADOS

### **3.1. Tabela: `templates_nutrition`**

**Exemplo de INSERT para Quiz Energia & Foco:**

```sql
INSERT INTO templates_nutrition (
  name,
  type,
  language,
  specialization,
  objective,
  title,
  description,
  slug,
  content,
  cta_text,
  whatsapp_message,
  is_active,
  profession
) VALUES (
  'Quiz: Energia & Foco',
  'quiz',
  'pt',
  'bem-estar',
  'vender-hype',
  'Descubra como melhorar sua energia e foco',
  'Um quiz rápido para identificar seu nível de energia e foco ao longo do dia',
  'quiz-energia-foco',
  '{
    "template_type": "quiz",
    "profession": "wellness",
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
          "resultadoId": "energiaBaixa",
          "tags": ["energia_baixa", "hype_recomendado"]
        },
        {
          "min": 7,
          "max": 10,
          "result": "Energia Instável",
          "resultadoId": "energiaInstavel",
          "tags": ["energia_instavel", "hype_recomendado"]
        },
        {
          "min": 11,
          "max": 15,
          "result": "Alta Demanda Física/Mental",
          "resultadoId": "altaDemanda",
          "tags": ["alta_demanda", "hype_recomendado", "performance"]
        }
      ]
    }
  }'::jsonb,
  'Ver meu resultado personalizado',
  'Olá! Completei o Quiz de Energia & Foco e gostaria de saber mais sobre como melhorar minha energia e foco.',
  true,
  'wellness'
);
```

---

## 📝 4. ESTRUTURA DE DIAGNÓSTICOS

### **4.1. Exemplo: `quiz-energia-foco.ts`**

**Localização:** `/src/lib/diagnostics/wellness/quiz-energia-foco.ts`

```typescript
/**
 * DIAGNÓSTICOS: Quiz Energia & Foco - ÁREA WELLNESS
 * 
 * Focado em identificar necessidade de Hype Drink
 */

import { DiagnosticosPorFerramenta } from '../types'

export const quizEnergiaFocoDiagnosticos: DiagnosticosPorFerramenta = {
  wellness: {
    energiaBaixa: {
      diagnostico: '📋 DIAGNÓSTICO: Sua energia está baixa e precisa de apoio para se manter estável ao longo do dia',
      causaRaiz: '🔍 CAUSA RAIZ: Queda de energia constante pode estar relacionada a desequilíbrios nutricionais, falta de hidratação adequada ou necessidade de suporte energético funcional. Muitas pessoas recorrem a excesso de café ou estimulantes fortes, mas isso gera ansiedade e queda brusca depois. Uma bebida funcional com cafeína natural pode ajudar a manter energia mais equilibrada',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Considere uma bebida funcional com cafeína natural, vitaminas do complexo B e hidratação para apoiar sua energia de forma mais estável. O Hype Drink combina esses elementos em uma solução prática para o dia a dia',
      plano7Dias: '📅 PLANO 7 DIAS: Inclua o Hype Drink na sua rotina matinal ou no período de maior queda de energia. Ele pode ajudar a manter energia e foco sem os picos e quedas bruscas do café excessivo',
      suplementacao: '💊 SUPLEMENTAÇÃO: O Hype Drink é uma bebida funcional que combina cafeína natural (chá verde e preto), vitaminas do complexo B, taurina e hidratação. Ele não substitui refeições, mas pode apoiar energia e foco dentro de um estilo de vida saudável',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha uma alimentação equilibrada com carboidratos complexos, proteínas e hidratação adequada. O Hype Drink pode complementar sua rotina, especialmente nos momentos de maior demanda energética',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu perfil indica necessidade de apoio em energia e foco. O Hype Drink pode ajudar na sua rotina. Quer experimentar?'
    },
    energiaInstavel: {
      diagnostico: '📋 DIAGNÓSTICO: Você tem altos e baixos de energia ao longo do dia que podem ser equilibrados',
      causaRaiz: '🔍 CAUSA RAIZ: Energia instável geralmente está relacionada a consumo excessivo de cafeína, falta de hidratação ou necessidade de suporte energético mais equilibrado. Alternativas com cafeína natural e dosagem controlada podem ajudar a manter energia mais estável',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Considere uma alternativa ao café excessivo. O Hype Drink pode ajudar a manter energia mais estável, com cafeína natural e vitaminas do complexo B, sem os picos e quedas bruscas',
      plano7Dias: '📅 PLANO 7 DIAS: Substitua parte do seu consumo de café pelo Hype Drink nos momentos de maior necessidade. Ele pode ajudar a manter energia e foco de forma mais equilibrada',
      suplementacao: '💊 SUPLEMENTAÇÃO: O Hype Drink combina cafeína natural (chá verde e preto), vitaminas do complexo B e hidratação. Ele pode ser uma alternativa mais equilibrada ao café excessivo',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha uma alimentação equilibrada e hidratação adequada. O Hype Drink pode complementar sua rotina, especialmente para manter energia mais estável',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu perfil indica necessidade de energia mais estável. O Hype Drink pode ajudar. Quer experimentar?'
    },
    altaDemanda: {
      diagnostico: '📋 DIAGNÓSTICO: Sua rotina exige muita energia e foco, e você precisa de suporte funcional',
      causaRaiz: '🔍 CAUSA RAIZ: Rotinas intensas exigem suporte energético constante e foco mental. Bebidas funcionais com cafeína natural, vitaminas e hidratação podem ajudar a manter performance ao longo do dia, especialmente em momentos de alta demanda',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Para rotinas intensas, soluções práticas que apoiem energia e foco ajudam na constância diária. O Hype Drink é ideal para quem precisa de performance constante',
      plano7Dias: '📅 PLANO 7 DIAS: Use o Hype Drink pela manhã ou nos momentos de maior demanda. Ele combina energia, foco e hidratação em uma solução prática para rotinas intensas',
      suplementacao: '💊 SUPLEMENTAÇÃO: O Hype Drink é uma bebida funcional desenvolvida para apoiar energia, foco e hidratação. Ele combina cafeína natural, vitaminas do complexo B e hidratação em uma solução prática',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha uma alimentação equilibrada e hidratação adequada. O Hype Drink pode complementar sua rotina, especialmente em momentos de alta demanda física ou mental',
      proximoPasso: '🎯 PRÓXIMO PASSO: Para rotinas intensas como a sua, o Hype Drink pode ajudar a manter energia e foco. Quer experimentar?'
    }
  }
}
```

### **4.2. Exemplo: `quiz-pre-treino.ts`**

**Localização:** `/src/lib/diagnostics/wellness/quiz-pre-treino.ts`

```typescript
/**
 * DIAGNÓSTICOS: Quiz Pré-Treino - ÁREA WELLNESS
 * 
 * Focado em identificar necessidade de Hype Drink como pré-treino leve
 */

import { DiagnosticosPorFerramenta } from '../types'

export const quizPreTreinoDiagnosticos: DiagnosticosPorFerramenta = {
  wellness: {
    preTreinoLeve: {
      diagnostico: '📋 DIAGNÓSTICO: Para o seu perfil, uma bebida funcional leve pode ser mais adequada do que pré-treinos agressivos',
      causaRaiz: '🔍 CAUSA RAIZ: Pré-treinos muito estimulantes podem causar taquicardia, ansiedade ou desconforto. Uma alternativa mais leve, com cafeína natural e hidratação, pode ser ideal para quem busca desempenho sem exageros',
      acaoImediata: '⚡ AÇÃO IMEDIATA: O Hype Drink é uma alternativa mais leve aos pré-treinos agressivos. Ele combina cafeína natural, vitaminas e hidratação sem excessos',
      plano7Dias: '📅 PLANO 7 DIAS: Use o Hype Drink antes do treino. Ele pode ajudar a manter energia e hidratação durante o exercício, sem os efeitos colaterais de pré-treinos muito fortes',
      suplementacao: '💊 SUPLEMENTAÇÃO: O Hype Drink combina cafeína natural (chá verde e preto), vitaminas do complexo B e hidratação. Ele pode ser uma alternativa mais leve aos pré-treinos tradicionais',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha uma alimentação equilibrada antes do treino. O Hype Drink pode complementar sua rotina, especialmente para quem não se adapta bem a pré-treinos muito fortes',
      proximoPasso: '🎯 PRÓXIMO PASSO: Para o seu perfil, o Hype Drink pode ser uma alternativa mais adequada. Quer aprender como usar antes do treino?'
    }
  }
}
```

---

## 🎨 5. ESTRUTURA DE PÁGINAS

### **5.1. Exemplo: `energia-foco/page.tsx`**

**Localização:** `/src/app/pt/wellness/templates/energia-foco/page.tsx`

```typescript
'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import LeadCapturePostResult from '@/components/wellness/LeadCapturePostResult'
import WellnessActionButtons from '@/components/wellness/WellnessActionButtons'
import { getTemplateBenefits } from '@/lib/template-benefits'
import { quizEnergiaFocoDiagnosticos } from '@/lib/diagnostics'

interface Pergunta {
  id: number
  pergunta: string
  tipo: 'multipla'
  opcoes: string[]
}

interface Resultado {
  score: number
  perfil: string
  descricao: string
  cor: string
  recomendacoes: string[]
  resultadoId: string
  diagnostico?: any
}

export default function QuizEnergiaFoco({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'quiz' | 'resultado'>('landing')
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [resultado, setResultado] = useState<Resultado | null>(null)

  const perguntas: Pergunta[] = [
    {
      id: 1,
      pergunta: 'Em qual período do dia sua energia mais cai?',
      tipo: 'multipla',
      opcoes: [
        'Manhã',
        'Meio da tarde',
        'Noite',
        'Varia o dia todo'
      ]
    },
    {
      id: 2,
      pergunta: 'Como você costuma lidar com a queda de energia?',
      tipo: 'multipla',
      opcoes: [
        'Café',
        'Energético',
        'Aguento até acabar o dia',
        'Não tenho estratégia'
      ]
    },
    {
      id: 3,
      pergunta: 'Quantas xícaras de café você consome por dia?',
      tipo: 'multipla',
      opcoes: [
        'Nenhuma',
        '1-2',
        '3-4',
        '5 ou mais'
      ]
    },
    {
      id: 4,
      pergunta: 'Como está seu foco mental ao longo do dia?',
      tipo: 'multipla',
      opcoes: [
        'Bom',
        'Oscila',
        'Cai rápido',
        'Muito difícil manter'
      ]
    },
    {
      id: 5,
      pergunta: 'Você pratica atividade física?',
      tipo: 'multipla',
      opcoes: [
        'Não',
        '1-2x/semana',
        '3-4x/semana',
        '5x ou mais'
      ]
    }
  ]

  const pontosPorOpcao = [
    [2, 3, 1, 3], // Pergunta 1
    [2, 3, 3, 2], // Pergunta 2
    [1, 1, 2, 3], // Pergunta 3
    [1, 2, 3, 3], // Pergunta 4
    [1, 1, 2, 2]  // Pergunta 5
  ]

  const iniciarQuiz = () => {
    setEtapa('quiz')
    setPerguntaAtual(0)
    setRespostas([])
  }

  const responder = (opcaoIndex: number) => {
    const novasRespostas = [...respostas, opcaoIndex]
    setRespostas(novasRespostas)

    if (perguntaAtual < perguntas.length - 1) {
      setPerguntaAtual(perguntaAtual + 1)
    } else {
      calcularResultado(novasRespostas)
    }
  }

  const calcularResultado = (respostas: number[]) => {
    let score = 0
    respostas.forEach((resposta, index) => {
      score += pontosPorOpcao[index][resposta]
    })

    let resultado: Resultado

    if (score <= 6) {
      resultado = {
        score,
        perfil: 'Energia Baixa',
        descricao: 'Seu perfil indica necessidade de apoio em energia e foco.',
        cor: 'orange',
        recomendacoes: [
          'Bebidas funcionais como o Hype Drink podem ajudar na sua rotina.',
          'O Hype Drink combina cafeína natural, vitaminas do complexo B e hidratação.'
        ],
        resultadoId: 'energiaBaixa'
      }
    } else if (score <= 10) {
      resultado = {
        score,
        perfil: 'Energia Instável',
        descricao: 'Você tem altos e baixos de energia ao longo do dia.',
        cor: 'yellow',
        recomendacoes: [
          'O Hype Drink pode ajudar a manter energia mais estável.',
          'Com cafeína natural e vitaminas, ele apoia foco e disposição.'
        ],
        resultadoId: 'energiaInstavel'
      }
    } else {
      resultado = {
        score,
        perfil: 'Alta Demanda Física/Mental',
        descricao: 'Sua rotina exige muita energia e foco.',
        cor: 'red',
        recomendacoes: [
          'O Hype Drink é ideal para quem precisa de performance constante.',
          'Ele combina energia, foco e hidratação em uma bebida funcional.'
        ],
        resultadoId: 'altaDemanda'
      }
    }

    // Buscar diagnóstico completo
    const diagnostico = quizEnergiaFocoDiagnosticos.wellness?.[resultado.resultadoId as keyof typeof quizEnergiaFocoDiagnosticos.wellness]
    if (diagnostico) {
      resultado.diagnostico = diagnostico
    }

    setResultado(resultado)
    setEtapa('resultado')
  }

  const voltar = () => {
    if (perguntaAtual > 0) {
      setPerguntaAtual(perguntaAtual - 1)
      setRespostas(respostas.slice(0, -1))
    } else {
      setEtapa('landing')
    }
  }

  const recomecar = () => {
    setEtapa('landing')
    setPerguntaAtual(0)
    setRespostas([])
    setResultado(null)
  }

  if (etapa === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <WellnessHeader config={config} />
        <WellnessLanding
          title="Descubra como melhorar sua energia e foco"
          description="Um quiz rápido para identificar seu nível de energia e foco ao longo do dia e receber recomendações personalizadas"
          benefits={getTemplateBenefits('quiz-energia-foco')}
          onStart={iniciarQuiz}
          ctaText="Começar Quiz"
        />
      </div>
    )
  }

  if (etapa === 'resultado' && resultado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <WellnessHeader config={config} />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-4">Seu Resultado</h2>
            <div className={`p-4 rounded-lg mb-6 bg-${resultado.cor}-50 border-2 border-${resultado.cor}-200`}>
              <h3 className="text-xl font-semibold mb-2">{resultado.perfil}</h3>
              <p className="text-gray-700 mb-4">{resultado.descricao}</p>
              <ul className="list-disc list-inside space-y-2">
                {resultado.recomendacoes.map((rec, index) => (
                  <li key={index} className="text-gray-600">{rec}</li>
                ))}
              </ul>
            </div>

            {resultado.diagnostico && (
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-semibold mb-2">{resultado.diagnostico.diagnostico}</h4>
                  <p className="text-gray-600">{resultado.diagnostico.causaRaiz}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{resultado.diagnostico.acaoImediata}</h4>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{resultado.diagnostico.plano7Dias}</h4>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{resultado.diagnostico.suplementacao}</h4>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{resultado.diagnostico.alimentacao}</h4>
                </div>
                {resultado.diagnostico.proximoPasso && (
                  <div>
                    <h4 className="font-semibold mb-2">{resultado.diagnostico.proximoPasso}</h4>
                  </div>
                )}
              </div>
            )}

            <LeadCapturePostResult
              templateSlug="quiz-energia-foco"
              resultado={resultado.perfil}
              config={config}
            />

            <WellnessActionButtons
              onRecalculate={recomecar}
              onBack={() => setEtapa('quiz')}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <WellnessHeader config={config} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                Pergunta {perguntaAtual + 1} de {perguntas.length}
              </span>
              <span className="text-sm text-gray-600">
                {Math.round(((perguntaAtual + 1) / perguntas.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((perguntaAtual + 1) / perguntas.length) * 100}%` }}
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6">
            {perguntas[perguntaAtual].pergunta}
          </h2>

          <div className="space-y-3">
            {perguntas[perguntaAtual].opcoes.map((opcao, index) => (
              <button
                key={index}
                onClick={() => responder(index)}
                className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                {opcao}
              </button>
            ))}
          </div>

          {perguntaAtual > 0 && (
            <button
              onClick={voltar}
              className="mt-6 text-blue-600 hover:text-blue-800"
            >
              ← Voltar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
```

---

## 🔗 6. INTEGRAÇÃO COM SISTEMA DE DIAGNÓSTICOS

### **6.1. Atualizar `src/lib/diagnostics/index.ts`**

```typescript
// Adicionar exports
export { quizEnergiaFocoDiagnosticos } from './wellness/quiz-energia-foco'
export { quizPreTreinoDiagnosticos } from './wellness/quiz-pre-treino'
export { quizRotinaProdutivaDiagnosticos } from './wellness/quiz-rotina-produtiva'
export { quizConstanciaDiagnosticos } from './wellness/quiz-constancia'
export { calcConsumoCafeinaDiagnosticos } from './wellness/calc-consumo-cafeina'
export { calcCustoEnergiaDiagnosticos } from './wellness/calc-custo-energia'
```

### **6.2. Atualizar `src/components/shared/DynamicTemplatePreview.tsx`**

Adicionar mapeamento de slugs:

```typescript
const DIAGNOSTICOS_MAP = {
  // ... existentes
  'quiz-energia-foco': quizEnergiaFocoDiagnosticos,
  'quiz-pre-treino': quizPreTreinoDiagnosticos,
  'quiz-rotina-produtiva': quizRotinaProdutivaDiagnosticos,
  'quiz-constancia': quizConstanciaDiagnosticos,
  'calc-consumo-cafeina': calcConsumoCafeinaDiagnosticos,
  'calc-custo-energia': calcCustoEnergiaDiagnosticos,
}
```

---

## 🏷️ 7. INTEGRAÇÃO COM SISTEMA DE TAGS

### **7.1. Atualizar `src/lib/noel-wellness/personalization.ts`**

Adicionar lógica para detectar tags de Hype:

```typescript
export function personalizeByObjective(objective: Objective): {
  product: PersonalizedFlow['product']
  flow: string[]
  script: string
} {
  const configs: Record<Objective, { product: PersonalizedFlow['product']; flow: string[]; script: string }> = {
    // ... existentes
    foco: {
      product: 'hype',
      flow: ['Abertura', 'Diagnóstico de foco', 'Oferta de Hype Drink', 'Script', 'Follow-up'],
      script: 'Pelo que você contou, você precisa de mais foco. O Hype Drink ajuda muito nisso. Quer testar?'
    },
    performance: {
      product: 'hype',
      flow: ['Abertura', 'Diagnóstico de performance', 'Oferta de CR7 + Hype', 'Script', 'Follow-up'],
      script: 'Pelo que você contou, você quer melhorar performance. O Hype + CR7 é perfeito pra isso. Quer testar?'
    },
    // ... outros
  }
  
  return configs[objective]
}
```

### **7.2. Atualizar `src/lib/noel-wellness/tools-integration.ts`**

Adicionar detecção de tags de Hype:

```typescript
export function interpretToolResult(result: ToolResult): ToolInterpretation {
  // ... código existente
  
  // Detectar tags de Hype
  if (result.tags?.includes('hype_recomendado') || 
      result.tags?.includes('energia_baixa') || 
      result.tags?.includes('foco_baixo')) {
    idealProduct = 'hype'
  }
  
  // ... resto do código
}
```

---

## 📊 8. MIGRAÇÃO SQL COMPLETA

### **8.1. Script de Criação dos Templates**

**Arquivo:** `migrations/XXX-criar-templates-hype-drink.sql`

```sql
-- =====================================================
-- CRIAR TEMPLATES HYPE DRINK - WELLNESS
-- =====================================================

-- 1. Quiz: Energia & Foco
INSERT INTO templates_nutrition (
  name, type, language, specialization, objective, title, description, slug,
  content, cta_text, whatsapp_message, is_active, profession
) VALUES (
  'Quiz: Energia & Foco',
  'quiz',
  'pt',
  'bem-estar',
  'vender-hype',
  'Descubra como melhorar sua energia e foco',
  'Um quiz rápido para identificar seu nível de energia e foco ao longo do dia',
  'quiz-energia-foco',
  '{"template_type": "quiz", "profession": "wellness", "questions": [...]}'::jsonb,
  'Ver meu resultado personalizado',
  'Olá! Completei o Quiz de Energia & Foco e gostaria de saber mais sobre como melhorar minha energia e foco.',
  true,
  'wellness'
) ON CONFLICT (slug, profession) DO UPDATE SET
  name = EXCLUDED.name,
  content = EXCLUDED.content,
  updated_at = NOW();

-- 2. Quiz: Pré-Treino Ideal
INSERT INTO templates_nutrition (
  name, type, language, specialization, objective, title, description, slug,
  content, cta_text, whatsapp_message, is_active, profession
) VALUES (
  'Quiz: Pré-Treino Ideal',
  'quiz',
  'pt',
  'bem-estar',
  'vender-hype',
  'Descubra o pré-treino ideal para você',
  'Um quiz para identificar se você precisa de um pré-treino leve ou forte',
  'quiz-pre-treino',
  '{"template_type": "quiz", "profession": "wellness", "questions": [...]}'::jsonb,
  'Ver meu resultado personalizado',
  'Olá! Completei o Quiz de Pré-Treino e gostaria de saber mais sobre o Hype Drink.',
  true,
  'wellness'
) ON CONFLICT (slug, profession) DO UPDATE SET
  name = EXCLUDED.name,
  content = EXCLUDED.content,
  updated_at = NOW();

-- 3. Quiz: Rotina Produtiva
INSERT INTO templates_nutrition (
  name, type, language, specialization, objective, title, description, slug,
  content, cta_text, whatsapp_message, is_active, profession
) VALUES (
  'Quiz: Rotina Produtiva',
  'quiz',
  'pt',
  'bem-estar',
  'vender-hype',
  'Descubra como melhorar sua rotina produtiva',
  'Um quiz para identificar como melhorar sua produtividade e constância',
  'quiz-rotina-produtiva',
  '{"template_type": "quiz", "profession": "wellness", "questions": [...]}'::jsonb,
  'Ver meu resultado personalizado',
  'Olá! Completei o Quiz de Rotina Produtiva e gostaria de saber mais sobre como melhorar minha produtividade.',
  true,
  'wellness'
) ON CONFLICT (slug, profession) DO UPDATE SET
  name = EXCLUDED.name,
  content = EXCLUDED.content,
  updated_at = NOW();

-- 4. Quiz: Constância & Rotina
INSERT INTO templates_nutrition (
  name, type, language, specialization, objective, title, description, slug,
  content, cta_text, whatsapp_message, is_active, profession
) VALUES (
  'Quiz: Constância & Rotina',
  'quiz',
  'pt',
  'bem-estar',
  'vender-hype',
  'Descubra como manter constância na sua rotina',
  'Um quiz para identificar como manter uma rotina saudável todos os dias',
  'quiz-constancia',
  '{"template_type": "quiz", "profession": "wellness", "questions": [...]}'::jsonb,
  'Ver meu resultado personalizado',
  'Olá! Completei o Quiz de Constância e gostaria de saber mais sobre como manter uma rotina saudável.',
  true,
  'wellness'
) ON CONFLICT (slug, profession) DO UPDATE SET
  name = EXCLUDED.name,
  content = EXCLUDED.content,
  updated_at = NOW();

-- 5. Calculadora: Consumo de Cafeína
INSERT INTO templates_nutrition (
  name, type, language, specialization, objective, title, description, slug,
  content, cta_text, whatsapp_message, is_active, profession
) VALUES (
  'Calculadora: Consumo de Cafeína',
  'calculator',
  'pt',
  'bem-estar',
  'vender-hype',
  'Calcule seu consumo de cafeína',
  'Uma calculadora para identificar se seu consumo de cafeína está adequado',
  'calc-consumo-cafeina',
  '{"template_type": "calculator", "profession": "wellness", "fields": [...]}'::jsonb,
  'Ver meu resultado personalizado',
  'Olá! Calculei meu consumo de cafeína e gostaria de saber mais sobre alternativas.',
  true,
  'wellness'
) ON CONFLICT (slug, profession) DO UPDATE SET
  name = EXCLUDED.name,
  content = EXCLUDED.content,
  updated_at = NOW();

-- 6. Calculadora: Custo da Falta de Energia
INSERT INTO templates_nutrition (
  name, type, language, specialization, objective, title, description, slug,
  content, cta_text, whatsapp_message, is_active, profession
) VALUES (
  'Calculadora: Custo da Falta de Energia',
  'calculator',
  'pt',
  'bem-estar',
  'vender-hype',
  'Calcule o custo da falta de energia',
  'Uma calculadora para identificar o impacto da falta de energia na sua produtividade',
  'calc-custo-energia',
  '{"template_type": "calculator", "profession": "wellness", "fields": [...]}'::jsonb,
  'Ver meu resultado personalizado',
  'Olá! Calculei o custo da falta de energia e gostaria de saber mais sobre soluções.',
  true,
  'wellness'
) ON CONFLICT (slug, profession) DO UPDATE SET
  name = EXCLUDED.name,
  content = EXCLUDED.content,
  updated_at = NOW();
```

---

## ✅ 9. CHECKLIST DE IMPLEMENTAÇÃO

### **Fase 1: Preparação**
- [ ] Criar arquivos de diagnóstico (6 arquivos)
- [ ] Criar páginas de templates (6 páginas)
- [ ] Criar previews (opcional - 4 arquivos)

### **Fase 2: Banco de Dados**
- [ ] Executar migração SQL
- [ ] Verificar templates criados
- [ ] Testar slugs únicos

### **Fase 3: Integração**
- [ ] Atualizar `src/lib/diagnostics/index.ts`
- [ ] Atualizar `DynamicTemplatePreview.tsx`
- [ ] Atualizar `personalization.ts`
- [ ] Atualizar `tools-integration.ts`

### **Fase 4: Testes**
- [ ] Testar cada quiz individualmente
- [ ] Testar cada calculadora individualmente
- [ ] Verificar diagnósticos exibidos corretamente
- [ ] Verificar tags e recomendações
- [ ] Testar integração com NOEL

### **Fase 5: Validação**
- [ ] Validar compliance (linguagem)
- [ ] Validar valores nutricionais
- [ ] Validar CTAs e WhatsApp
- [ ] Validar responsividade

---

## 🎯 10. PRÓXIMOS PASSOS

1. **Criar arquivos de diagnóstico** seguindo os exemplos acima
2. **Criar páginas de templates** seguindo o padrão `energia-foco/page.tsx`
3. **Executar migração SQL** para criar templates no banco
4. **Atualizar integrações** com sistema de diagnósticos e NOEL
5. **Testar tudo** antes de colocar em produção

---

## 📝 NOTAS IMPORTANTES

- **Slugs devem ser únicos** por profissão (wellness)
- **Diagnósticos devem seguir** a estrutura `DiagnosticosPorFerramenta`
- **Páginas devem seguir** o padrão de `wellness-profile/page.tsx`
- **Tags devem ser mapeadas** no sistema de personalização do NOEL
- **Compliance:** Sempre usar linguagem de "apoia", "ajuda", "contribui"

---

**Fim do documento**

