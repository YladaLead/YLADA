import type { FluxoCliente } from '@/types/wellness-system'

/**
 * Slugs alinhados ao Meus Links Wellness (`/agua`, `/calc-calorias`, `/calc-proteina`)
 * e ao preview dos campos (peso, altura, atividade, etc.).
 */
export const WELLNESS_CALCULADORAS_BASICAS_PRESET_SLUGS = [
  'agua',
  'calc-hidratacao',
  'calc-calorias',
  'calc-proteina',
] as const

export function isWellnessCalculadoraBasicaPresetFluxoId(fluxoId: string): boolean {
  return (WELLNESS_CALCULADORAS_BASICAS_PRESET_SLUGS as readonly string[]).includes(fluxoId)
}

/** Só para `ensure`: links antigos `…-v-agua` recebem o mesmo formulário que `calc-hidratacao`. */
export function getProLideresLegacyAguaPresetFluxo(): FluxoCliente {
  return fluxoCalculadoraAguaWellness('agua', 'Calculadora de Água')
}

/** Mesmas perguntas para `agua` e `calc-hidratacao` (slug canónico Meus Links / template). */
function fluxoCalculadoraAguaWellness(id: 'agua' | 'calc-hidratacao', nome: string): FluxoCliente {
  return {
    id,
    nome,
    objetivo:
      'Mesmos dados da Calculadora de Hidratação no Wellness (peso, atividade, clima) — para continuar no WhatsApp com quem enviou o link.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Peso (kg) *',
        tipo: 'numero',
        placeholder: 'Ex: 70.5',
        min: 1,
        max: 300,
        step: 0.1,
      },
      {
        id: 'p2',
        texto: 'Nível de atividade física *',
        tipo: 'multipla_escolha',
        opcoes: [
          'Sedentário',
          'Leve (caminhadas leves)',
          'Moderado (1-3x por semana)',
          'Intenso (4-6x por semana)',
          'Muito intenso (atleta)',
        ],
      },
      {
        id: 'p3',
        texto: 'Clima onde você vive *',
        tipo: 'multipla_escolha',
        opcoes: ['Temperado', 'Quente', 'Muito quente'],
      },
    ],
    diagnostico: {
      titulo: 'Perfil de hidratação',
      descricao:
        'Com peso, rotina de movimento e clima dá para enquadrar a sua necessidade de água no dia a dia — o próximo passo é alinhar hábitos com quem te enviou o link.',
      sintomas: ['Variação de sede e energia ao longo do dia', 'Rotina com mais ou menos suor e calor'],
      beneficios: ['Orientação simples para lembrar de beber água', 'Conversa prática no WhatsApp'],
      mensagemPositiva: 'Pequenos ajustes na garrafa ao alcance e no ritmo dos goles costumam fazer diferença rápida.',
    },
    kitRecomendado: 'energia',
    cta: 'Quero falar no WhatsApp',
    tags: ['wellness', 'calculadora', 'agua', 'hidratacao'],
  }
}

/**
 * Textos de pergunta e opções espelhados dos templates Wellness:
 * - `src/app/pt/wellness/templates/hidratacao/page.tsx`
 * - `src/app/pt/wellness/templates/calorias/page.tsx`
 * - `src/app/pt/wellness/templates/proteina/page.tsx`
 *
 * Água / hidratação: no `/l/…` permanece `RISK_DIAGNOSIS` + p1–p3 (peso, atividade, clima), sem vertical Pro Líderes no meta.
 * Calorias / proteína: `PROJECTION_CALCULATOR` + q1–q4 via `wellnessFluxoToYladaConfigJson`.
 */
export function getProLideresWellnessCalculadorasBasicasPresetFluxos(): FluxoCliente[] {
  return [
    fluxoCalculadoraAguaWellness('calc-hidratacao', 'Calculadora de Hidratação'),
    {
      id: 'calc-calorias',
      nome: 'Calculadora de Calorias',
      objetivo:
        'Mesmos campos da Calculadora de Calorias no Wellness (idade, gênero, peso, altura, atividade, objetivo) — para falar de meta calórica com quem compartilhou o link.',
      perguntas: [
        {
          id: 'p1',
          texto: 'Idade *',
          tipo: 'numero',
          placeholder: 'Ex: 30',
          min: 1,
          max: 120,
          step: 1,
        },
        {
          id: 'p2',
          texto: 'Gênero *',
          tipo: 'multipla_escolha',
          opcoes: ['Masculino', 'Feminino'],
        },
        {
          id: 'p3',
          texto: 'Peso (kg) *',
          tipo: 'numero',
          placeholder: 'Ex: 70',
          min: 1,
          max: 300,
          step: 0.1,
        },
        {
          id: 'p4',
          texto: 'Altura (cm) *',
          tipo: 'numero',
          placeholder: 'Ex: 175',
          min: 50,
          max: 250,
          step: 0.5,
        },
        {
          id: 'p5',
          texto: 'Nível de Atividade Física *',
          tipo: 'multipla_escolha',
          opcoes: [
            'Sedentário (pouco ou nenhum exercício)',
            'Leve (exercício leve 1-3 dias/semana)',
            'Moderado (exercício moderado 3-5 dias/semana)',
            'Intenso (exercício intenso 6-7 dias/semana)',
            'Muito Intenso (exercício muito intenso, trabalho físico)',
          ],
        },
        {
          id: 'p6',
          texto: 'Objetivo *',
          tipo: 'multipla_escolha',
          opcoes: ['Perder Peso', 'Manter Peso', 'Ganhar Peso'],
        },
      ],
      diagnostico: {
        titulo: 'Perfil calórico (visão geral)',
        descricao:
          'Idade, gênero, peso, altura, movimento e objetivo ajudam a enquadrar a conversa sobre energia no dia a dia — sem substituir avaliação profissional.',
        sintomas: ['Oscilação de fome e energia', 'Dúvida se come “demais” ou “de menos” para o objetivo'],
        beneficios: ['Linha de conversa clara com quem enviou o link', 'Próximo passo simples no WhatsApp'],
        mensagemPositiva: 'Alinhar objetivo com rotina real costuma destravar resultados com mais tranquilidade.',
      },
      kitRecomendado: 'energia',
      cta: 'Quero falar no WhatsApp',
      tags: ['wellness', 'calculadora', 'calorias'],
    },
    {
      id: 'calc-proteina',
      nome: 'Calculadora de Proteína',
      objetivo:
        'Mesmos campos da Calculadora de Proteína no Wellness (idade, gênero, peso, altura, atividade, objetivo) — para falar de proteína na rotina com quem enviou o link.',
      perguntas: [
        {
          id: 'p1',
          texto: 'Idade *',
          tipo: 'numero',
          placeholder: 'Ex: 30',
          min: 1,
          max: 120,
          step: 1,
        },
        {
          id: 'p2',
          texto: 'Gênero *',
          tipo: 'multipla_escolha',
          opcoes: ['Masculino', 'Feminino'],
        },
        {
          id: 'p3',
          texto: 'Peso (kg) *',
          tipo: 'numero',
          placeholder: 'Ex: 70.5',
          min: 1,
          max: 300,
          step: 0.1,
        },
        {
          id: 'p4',
          texto: 'Altura (cm) *',
          tipo: 'numero',
          placeholder: 'Ex: 175',
          min: 100,
          max: 250,
          step: 0.5,
        },
        {
          id: 'p5',
          texto: 'Nível de atividade física *',
          tipo: 'multipla_escolha',
          opcoes: [
            'Sedentário',
            'Leve (1-2x por semana)',
            'Moderado (3-4x por semana)',
            'Intenso (5-6x por semana)',
            'Muito intenso (2x ao dia)',
          ],
        },
        {
          id: 'p6',
          texto: 'Objetivo *',
          tipo: 'multipla_escolha',
          opcoes: ['Manter peso', 'Perda de peso', 'Ganhar massa muscular'],
        },
      ],
      diagnostico: {
        titulo: 'Perfil de proteína na rotina',
        descricao:
          'Idade, gênero, peso, altura, movimento e objetivo ajudam a contextualizar quanta proteína faz sentido conversar — bom gancho para o WhatsApp.',
        sintomas: ['Fome logo após refeições', 'Treino sem recuperação satisfatória'],
        beneficios: ['Dicas práticas na conversa com quem enviou o link', 'Foco no que é simples de ajustar'],
        mensagemPositiva: 'Distribuir proteína ao longo do dia costuma melhorar saciedade e disposição.',
      },
      kitRecomendado: 'energia',
      cta: 'Quero falar no WhatsApp',
      tags: ['wellness', 'calculadora', 'proteina'],
    },
  ]
}
