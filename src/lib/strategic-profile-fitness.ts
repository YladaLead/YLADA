/**
 * Descoberta de perfil estratégico para profissionais de fitness.
 * Mapeia tipo de atuação + tempo para um perfil nome e focos.
 */

export interface StrategicProfileFitness {
  name: string
  focus: string[]
}

/**
 * Retorna o perfil estratégico identificado a partir das respostas do contexto (fitness).
 */
export function getStrategicProfileFitness(
  tipoAtuacao: string | undefined,
  tempoAnos: number | '' | undefined
): StrategicProfileFitness {
  const tipo = tipoAtuacao || ''
  const anos = typeof tempoAnos === 'number' ? tempoAnos : 0

  if (tipo === 'personal') {
    return {
      name: 'Personal Trainer',
      focus: [
        'recorrência com pacotes',
        'avaliação física e acompanhamento',
        'indicação de clientes',
      ],
    }
  }

  if (tipo === 'academia') {
    return {
      name: 'Profissional em Academia',
      focus: [
        'captação de alunos',
        'turmas e avaliação',
        'funil de triagem',
      ],
    }
  }

  if (tipo === 'online') {
    return {
      name: 'Treinador Online',
      focus: [
        'captação digital',
        'alcance amplo',
        'diagnósticos para qualificação',
      ],
    }
  }

  if (tipo === 'grupo') {
    return {
      name: 'Instrutor de Turmas',
      focus: [
        'recorrência de turmas',
        'captação de alunos',
        'organização da agenda',
      ],
    }
  }

  if (tipo === 'ambos') {
    return {
      name: 'Profissional Híbrido',
      focus: [
        'estratégias para presencial e online',
        'diversificação de oferta',
        'captação multicanal',
      ],
    }
  }

  if (anos < 2) {
    return {
      name: 'Profissional em Crescimento',
      focus: [
        'primeiros alunos',
        'construção de autoridade',
        'portfólio e indicação',
      ],
    }
  }

  return {
    name: 'Profissional de Fitness',
    focus: [
      'captação de alunos',
      'posicionamento digital',
      'organização da rotina',
    ],
  }
}
