/**
 * Descoberta de perfil estratégico para médicos.
 * Mapeia público principal + foco + tempo para um perfil nome e focos.
 */

export interface StrategicProfileMedico {
  name: string
  focus: string[]
}

/**
 * Retorna o perfil estratégico identificado a partir das respostas do contexto (médico).
 */
export function getStrategicProfileMedico(
  publicoPrincipal: string[] | string | undefined,
  focoPrincipal: string | undefined,
  tempoAnos: number | '' | undefined
): StrategicProfileMedico {
  const publicos = Array.isArray(publicoPrincipal) ? publicoPrincipal : publicoPrincipal ? [publicoPrincipal] : []
  const foco = focoPrincipal || ''
  const anos = typeof tempoAnos === 'number' ? tempoAnos : 0

  if (publicos.includes('convenio')) {
    return {
      name: 'Médico com Convênio',
      focus: [
        'volume de pacientes',
        'triagem e agendamento',
        'organização da agenda',
      ],
    }
  }

  if (publicos.includes('particular') || publicos.includes('alta_renda')) {
    return {
      name: 'Consultório Particular',
      focus: [
        'qualificação de pacientes',
        'posicionamento premium',
        'comunicação de valor',
      ],
    }
  }

  if (foco === 'procedimentos' || foco === 'cirurgia') {
    return {
      name: 'Médico de Procedimentos',
      focus: [
        'captação para procedimentos',
        'qualificação de demanda',
        'posicionamento de especialista',
      ],
    }
  }

  if (foco === 'tratamento_continuo' || foco === 'acompanhamento_cronico') {
    return {
      name: 'Médico de Acompanhamento',
      focus: [
        'recorrência de pacientes',
        'indicação e retorno',
        'organização da carteira',
      ],
    }
  }

  if (anos < 2) {
    return {
      name: 'Médico em Crescimento',
      focus: [
        'construção de carteira',
        'indicação e divulgação',
        'primeiros pacientes',
      ],
    }
  }

  return {
    name: 'Médico em Estruturação',
    focus: [
      'captação de pacientes',
      'posicionamento digital',
      'organização da prática',
    ],
  }
}
