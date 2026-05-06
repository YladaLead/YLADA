/**
 * Quizzes de recrutamento Pro Líderes (entradas temáticas). As **perguntas** são as do quiz Ganhos
 * no Wellness — ver `pro-lideres-recruitment-unified-perguntas.ts` (unificado para toda a biblioteca).
 *
 * O motor YLADA soma índices 0..n das MCQs; no Wellness o índice maior costuma ser “melhor”.
 * No Pro Líderes, `meta.invert_risk_mcq_score` alinha o arquétipo RISK (ver `wellnessFluxoToYladaConfigJson`).
 *
 * Idioma: português do Brasil.
 */
import type { FluxoCliente } from '@/types/wellness-system'
import { PRO_LIDERES_RECRUITMENT_UNIFIED_PERGUNTAS } from '@/lib/pro-lideres/pro-lideres-recruitment-unified-perguntas'

export const PRO_LIDERES_RECRUITMENT_WELLNESS_MIRROR_QUIZ_IDS = [
  'quiz-recrut-ganhos-prosperidade',
  'quiz-recrut-potencial-crescimento',
  'quiz-recrut-proposito-equilibrio',
] as const

export const proLideresRecruitmentQuizFluxos: FluxoCliente[] = [
  {
    id: 'quiz-recrut-ganhos-prosperidade',
    nome: 'Quiz: Ganhos e Prosperidade',
    objetivo:
      'Mesmas perguntas do quiz Ganhos no Wellness — para continuar a conversa com quem enviou o link.',
    perguntas: PRO_LIDERES_RECRUITMENT_UNIFIED_PERGUNTAS,
    diagnostico: {
      titulo: 'Perfil financeiro e energia para conversar',
      descricao:
        'As mesmas leituras do quiz de Ganhos no Wellness — o próximo passo é alinhar com quem te enviou o link o que faz sentido para você.',
      sintomas: ['Situação de renda e tempo', 'Satisfação com o que você gera hoje'],
      beneficios: ['Conversa com contexto real', 'Próximo passo no WhatsApp sem suposições'],
      mensagemPositiva: 'Entender onde você está hoje já ajuda a definir o que explorar com calma.',
    },
    kitRecomendado: 'energia',
    cta: 'Quero conhecer novas oportunidades',
    tags: ['quiz', 'ganhos', 'prosperidade', 'recrutamento', 'pro-lideres'],
  },
  {
    id: 'quiz-recrut-potencial-crescimento',
    nome: 'Quiz: Potencial e Crescimento',
    objetivo:
      'Entrada temática Potencial — mesmo questionário padrão da biblioteca; o resultado continua específico deste fluxo.',
    perguntas: PRO_LIDERES_RECRUITMENT_UNIFIED_PERGUNTAS,
    diagnostico: {
      titulo: 'Potencial e ritmo de crescimento',
      descricao:
        'Mesma linha de perguntas do quiz Potencial no Wellness — útil para falar de metas e apoio com quem compartilhou o link.',
      sintomas: ['Uso do potencial', 'Frequência de revisão de metas', 'Investimento em desenvolvimento'],
      beneficios: ['Conversa objetiva sobre ritmo', 'Encaixe com mentoria e equipe'],
      mensagemPositiva: 'Crescimento com direção costuma começar com uma conversa honesta sobre onde você quer chegar.',
    },
    kitRecomendado: 'energia',
    cta: 'Quero conhecer novas oportunidades',
    tags: ['quiz', 'potencial', 'crescimento', 'recrutamento', 'pro-lideres'],
  },
  {
    id: 'quiz-recrut-proposito-equilibrio',
    nome: 'Quiz: Propósito e Equilíbrio',
    objetivo:
      'Entrada temática Propósito — mesmo questionário padrão da biblioteca; o resultado continua específico deste fluxo.',
    perguntas: PRO_LIDERES_RECRUITMENT_UNIFIED_PERGUNTAS,
    diagnostico: {
      titulo: 'Propósito, valores e equilíbrio',
      descricao:
        'Mesma estrutura do quiz Propósito no Wellness — bom gancho para falar de tempo, sentido e flexibilidade com quem te convidou.',
      sintomas: ['Clareza de propósito', 'Equilíbrio vida–trabalho', 'Alinhamento com valores'],
      beneficios: ['Conversa centrada no que importa para você', 'Transparência sobre próximos passos'],
      mensagemPositiva: 'Pequenos ajustes de alinhamento costumam liberar energia para decidir com mais tranquilidade.',
    },
    kitRecomendado: 'energia',
    cta: 'Quero conhecer novas oportunidades',
    tags: ['quiz', 'propósito', 'equilíbrio', 'recrutamento', 'pro-lideres'],
  },
]
