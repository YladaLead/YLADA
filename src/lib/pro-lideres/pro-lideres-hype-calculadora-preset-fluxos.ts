import type { FluxoCliente } from '@/types/wellness-system'

/** Presets espelhados em `src/app/pt/wellness/templates/hype-drink/consumo-cafeina` e `.../custo-energia`. */
export const HYPE_CALCULADORA_PRESET_FLUXO_IDS = ['consumo-cafeina', 'custo-energia'] as const

export function isHypeCalculadoraPresetFluxoId(fluxoId: string): boolean {
  return (HYPE_CALCULADORA_PRESET_FLUXO_IDS as readonly string[]).includes(fluxoId)
}

/**
 * Definição espelha o Wellness (conteúdo interno); no `/l/…` o JSON é montado em
 * `wellnessFluxoToYladaConfigJson` como `PROJECTION_CALCULATOR` + q1–q4 numéricos.
 */
export function getProLideresHypeCalculadoraPresetFluxos(): FluxoCliente[] {
  return [
    {
      id: 'consumo-cafeina',
      nome: 'Calculadora: Consumo de Cafeína',
      objetivo:
        'Mesmos dados da calculadora de cafeína no Wellness (xícaras, energético, treino e horário) — para falar com quem enviou o link.',
      perguntas: [
        {
          id: 'p1',
          texto: 'Quantas xícaras de café você consome por dia?',
          tipo: 'numero',
          placeholder: 'Ex: 3',
          min: 0,
          max: 40,
          step: 1,
        },
        {
          id: 'p2',
          texto: 'Você consome energético regularmente?',
          tipo: 'sim_nao',
        },
        {
          id: 'p3',
          texto: 'Você pratica atividade física?',
          tipo: 'sim_nao',
        },
        {
          id: 'p4',
          texto: 'Horário do treino (se pratica atividade física)',
          tipo: 'multipla_escolha',
          opcional: true,
          opcoes: ['Manhã', 'Tarde', 'Noite'],
        },
      ],
      diagnostico: {
        titulo: 'Hábitos de cafeína e rotina',
        descricao:
          'Com volume de café, uso de energético e treino dá para enquadrar a conversa sobre energia estável — próximo passo no WhatsApp com quem enviou o link.',
        sintomas: ['Consumo de cafeína ao longo do dia', 'Rotina com ou sem treino'],
        beneficios: ['Leitura prática do padrão', 'Alternativas com dosagem mais previsível'],
        mensagemPositiva: 'Ajustar cafeína costuma melhorar sono e disposição em poucas semanas com apoio certo.',
      },
      kitRecomendado: 'energia',
      cta: 'Quero falar no WhatsApp',
      tags: ['hype', 'cafeina', 'wellness'],
    },
    {
      id: 'custo-energia',
      nome: 'Calculadora: Custo da Falta de Energia',
      objetivo:
        'Mesmos dados da calculadora de custo de energia no Wellness (horas trabalhadas, improdutivas, tipo de trabalho, valor da hora opcional).',
      perguntas: [
        {
          id: 'p1',
          texto: 'Quantas horas você trabalha por dia?',
          tipo: 'numero',
          placeholder: 'Ex: 8',
          min: 1,
          max: 24,
          step: 0.5,
        },
        {
          id: 'p2',
          texto: 'Quantas horas você fica improdutivo por cansaço?',
          tipo: 'numero',
          placeholder: 'Ex: 2',
          min: 0,
          max: 24,
          step: 0.5,
        },
        {
          id: 'p3',
          texto: 'Tipo de trabalho',
          tipo: 'multipla_escolha',
          opcoes: ['Mental/Intelectual', 'Físico', 'Misto'],
        },
        {
          id: 'p4',
          texto: 'Valor da sua hora trabalhada (opcional, para estimar custo em R$)',
          tipo: 'numero',
          opcional: true,
          placeholder: 'Ex: 50',
          min: 0,
          max: 999999,
          step: 0.01,
        },
      ],
      diagnostico: {
        titulo: 'Energia e produtividade no dia',
        descricao:
          'Horas úteis vs improdutivas e tipo de esforço ajudam a falar de onde a fadiga “custa” — bom gancho com quem compartilhou o link.',
        sintomas: ['Trechos improdutivos por cansaço', 'Tipo de demanda mental ou física'],
        beneficios: ['Visão simples do gargalo', 'Próximo passo no WhatsApp'],
        mensagemPositiva: 'Pequenos ajustes de rotina e suporte certo costumam recuperar fôlego rápido.',
      },
      kitRecomendado: 'energia',
      cta: 'Quero falar no WhatsApp',
      tags: ['hype', 'produtividade', 'energia', 'wellness'],
    },
  ]
}
