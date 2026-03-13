/**
 * Sistema de 3 diagnósticos — copy e naming para o YLADA.
 * O YLADA analisa três coisas: seu negócio, seus clientes, suas conversas.
 */

export const SISTEMA_CRESCIMENTO = {
  titulo: 'Seu sistema de crescimento',
  subtitulo: 'O YLADA analisa seu negócio, seus clientes e suas conversas para ajudar você a crescer.',

  diagnostico_profissional: {
    titulo: 'Seu negócio',
    descricao: 'Perfil estratégico, bloqueio principal e próximo movimento.',
    ciclo: 'Diagnóstico do profissional → Estratégia',
  },
  diagnostico_cliente: {
    titulo: 'Seus clientes',
    descricao: 'Diagnósticos que você compartilha para atrair pessoas interessadas e gerar leads.',
    ciclo: 'Diagnóstico do cliente → Conversas',
  },
  diagnostico_conversa: {
    titulo: 'Suas conversas',
    descricao: 'O Noel analisa suas conversas e sugere melhorias para aumentar suas conversões.',
    ciclo: 'Diagnóstico da conversa → Mais clientes',
  },

  ciclo_completo: 'Diagnóstico do profissional → Estratégia → Diagnóstico do cliente → Conversas → Mais clientes',
} as const
