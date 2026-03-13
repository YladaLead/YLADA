/**
 * Sistema de 3 diagnósticos — copy e naming para o YLADA.
 * O YLADA analisa três coisas: seu negócio, seus clientes, suas conversas.
 */

export const SISTEMA_CRESCIMENTO = {
  titulo: 'Seu sistema de crescimento',
  subtitulo: 'O YLADA analisa três coisas para ajudar seu negócio a crescer: seu negócio, seus clientes e suas conversas.',

  diagnostico_profissional: {
    titulo: 'Seu negócio',
    descricao: 'Perfil estratégico, bloqueio principal e próximo movimento.',
    ciclo: 'Diagnóstico do profissional → Noel define estratégia',
  },
  diagnostico_cliente: {
    titulo: 'Seus clientes',
    descricao: 'Diagnósticos e quizzes que você envia para atrair e qualificar.',
    ciclo: 'Diagnóstico do cliente → gera interessados',
  },
  diagnostico_conversa: {
    titulo: 'Suas conversas',
    descricao: 'Insights do Noel sobre como você conduz as conversas.',
    ciclo: 'Diagnóstico da conversa → melhora conversão',
  },

  ciclo_completo: 'Diagnóstico do profissional → Noel define estratégia → Diagnóstico do cliente → gera interessados → Diagnóstico da conversa → melhora conversão',
} as const
