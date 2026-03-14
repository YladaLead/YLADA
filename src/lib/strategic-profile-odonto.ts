/**
 * Descoberta de perfil estratégico para profissionais de odontologia.
 * Mapeia modelo de atendimento (particular/convênio/misto) + tempo para um perfil nome e focos.
 */

export interface StrategicProfileOdonto {
  name: string
  focus: string[]
}

/**
 * Retorna o perfil estratégico identificado a partir das respostas do contexto (odonto).
 */
export function getStrategicProfileOdonto(
  voceAtende: string | undefined,
  tempoAnos: number | '' | undefined
): StrategicProfileOdonto {
  const modelo = voceAtende || ''
  const anos = typeof tempoAnos === 'number' ? tempoAnos : 0

  if (modelo === 'particular') {
    return {
      name: 'Consultório Particular',
      focus: [
        'qualificação de leads',
        'posicionamento premium',
        'comunicação de valor',
      ],
    }
  }

  if (modelo === 'convenio') {
    return {
      name: 'Clínica com Convênio',
      focus: [
        'volume de pacientes',
        'triagem e agendamento',
        'organização da agenda',
      ],
    }
  }

  if (modelo === 'misto') {
    return {
      name: 'Modelo Misto',
      focus: [
        'equilíbrio entre volume e ticket',
        'segmentação de pacientes',
        'funil de qualificação',
      ],
    }
  }

  // Fallback: iniciante ou sem definição
  if (anos < 2) {
    return {
      name: 'Profissional em Crescimento',
      focus: [
        'construção de carteira',
        'indicação e divulgação',
        'primeiros pacientes',
      ],
    }
  }

  return {
    name: 'Dentista em Estruturação',
    focus: [
      'captação de pacientes',
      'posicionamento digital',
      'organização da prática',
    ],
  }
}
