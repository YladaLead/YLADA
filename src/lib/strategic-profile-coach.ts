/**
 * Descoberta de perfil estratégico para profissionais de coaching.
 * Mapeia modelo de entrega + tempo para um perfil nome e focos.
 */

export interface StrategicProfileCoach {
  name: string
  focus: string[]
}

/**
 * Retorna o perfil estratégico identificado a partir das respostas do contexto (coach).
 */
export function getStrategicProfileCoach(
  modeloEntrega: string | undefined,
  tempoAnos: number | '' | undefined
): StrategicProfileCoach {
  const modelo = modeloEntrega || ''
  const anos = typeof tempoAnos === 'number' ? tempoAnos : 0

  if (modelo === 'sessoes_individuais') {
    return {
      name: 'Coach de Sessões Individuais',
      focus: [
        'qualificação de leads',
        'posicionamento de autoridade',
        'recorrência de sessões',
      ],
    }
  }

  if (modelo === 'grupo') {
    return {
      name: 'Coach de Grupo',
      focus: [
        'captação para turmas',
        'organização de grupos',
        'funil de avaliação',
      ],
    }
  }

  if (modelo === 'programa_estruturado') {
    return {
      name: 'Coach de Programa Estruturado',
      focus: [
        'conversão em programas',
        'posicionamento premium',
        'comunicação de valor',
      ],
    }
  }

  if (anos < 2) {
    return {
      name: 'Coach em Crescimento',
      focus: [
        'primeiros clientes',
        'construção de autoridade',
        'portfólio e indicação',
      ],
    }
  }

  return {
    name: 'Coach de Carreira',
    focus: [
      'captação de clientes',
      'posicionamento digital',
      'organização da prática',
    ],
  }
}
