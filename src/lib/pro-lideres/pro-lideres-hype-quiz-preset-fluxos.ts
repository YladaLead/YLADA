import type { FluxoCliente } from '@/types/wellness-system'
import { PRO_LIDERES_HYPE_UNIFIED_PERGUNTAS } from '@/lib/pro-lideres/pro-lideres-hype-unified-perguntas'

/**
 * Quizzes HYPE Drink na biblioteca Pro Líderes.
 * Perguntas unificadas — ver `pro-lideres-hype-unified-perguntas.ts`.
 */
export function getProLideresHypeQuizPresetFluxos(): FluxoCliente[] {
  return [
    {
      id: 'energia-foco',
      nome: 'Quiz: Energia & Foco',
      objetivo:
        'Entender padrões de energia e foco ao longo do dia para conversar com quem enviou o link.',
      perguntas: PRO_LIDERES_HYPE_UNIFIED_PERGUNTAS,
      diagnostico: {
        titulo: 'Perfil de energia e foco',
        descricao:
          'Suas respostas ajudam a ver onde a energia oscila e como isso se conecta à rotina — próximo passo é alinhar com quem te enviou o link.',
        sintomas: ['Oscilação de energia ao longo do dia', 'Estratégias variadas para manter o ritmo'],
        beneficios: ['Conversa personalizada com base no seu perfil', 'Próximos passos simples e práticos'],
        mensagemPositiva: 'Pequenos ajustes na rotina costumam gerar ganhos rápidos de disposição e clareza.',
      },
      kitRecomendado: 'energia',
      cta: 'Quero falar no WhatsApp',
      tags: ['hype', 'energia', 'foco', 'wellness'],
    },
    {
      id: 'pre-treino',
      nome: 'Quiz: Pré-Treino Ideal',
      objetivo:
        'Entrada temática pré-treino — mesmo questionário padrão HYPE; o resultado continua específico deste fluxo.',
      perguntas: PRO_LIDERES_HYPE_UNIFIED_PERGUNTAS,
      diagnostico: {
        titulo: 'Perfil pré-treino',
        descricao:
          'O questionário indica preferências de intensidade e horário — útil para uma recomendação alinhada ao que você pratica.',
        sintomas: ['Sensibilidade variável a estimulantes', 'Rotina de treino com horários diferentes'],
        beneficios: ['Direcionamento mais seguro e personalizado na conversa', 'Foco no que combina com seu estilo'],
        mensagemPositiva: 'Treinar com apoio certo para o seu perfil costuma melhorar consistência e conforto.',
      },
      kitRecomendado: 'energia',
      cta: 'Quero falar no WhatsApp',
      tags: ['hype', 'pre-treino', 'treino', 'wellness'],
    },
    {
      id: 'rotina-produtiva',
      nome: 'Quiz: Rotina Produtiva',
      objetivo:
        'Entrada temática produtividade — mesmo questionário padrão HYPE; o resultado continua específico deste fluxo.',
      perguntas: PRO_LIDERES_HYPE_UNIFIED_PERGUNTAS,
      diagnostico: {
        titulo: 'Perfil de rotina e produtividade',
        descricao:
          'Suas respostas mostram como energia, foco e organização aparecem no seu dia — base para próximos passos na conversa.',
        sintomas: ['Picos e vales de produtividade', 'Rotina com diferentes níveis de previsibilidade'],
        beneficios: ['Plano de conversa mais direto ao ponto', 'Sugestões alinhadas ao seu ritmo'],
        mensagemPositiva: 'Ajustes simples na rotina frequentemente liberam energia e clareza no trabalho.',
      },
      kitRecomendado: 'energia',
      cta: 'Quero falar no WhatsApp',
      tags: ['hype', 'produtividade', 'rotina', 'wellness'],
    },
    {
      id: 'constancia',
      nome: 'Quiz: Constância & Rotina',
      objetivo:
        'Entrada temática constância — mesmo questionário padrão HYPE; o resultado continua específico deste fluxo.',
      perguntas: PRO_LIDERES_HYPE_UNIFIED_PERGUNTAS,
      diagnostico: {
        titulo: 'Perfil de constância',
        descricao:
          'As respostas indicam padrões de energia e hábito — útil para personalizar o próximo passo no WhatsApp.',
        sintomas: ['Barreiras recorrentes à constância', 'Histórico de tentativas e pausas'],
        beneficios: ['Conversa focada no que mais trava ou sustenta o hábito', 'Próximo passo mais simples'],
        mensagemPositiva: 'Constância se constrói com passos pequenos e apoio certo — dá para evoluir.',
      },
      kitRecomendado: 'energia',
      cta: 'Quero falar no WhatsApp',
      tags: ['hype', 'constancia', 'rotina', 'wellness'],
    },
  ]
}
