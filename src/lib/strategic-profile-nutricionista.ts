/**
 * Descoberta de perfil estratégico para nutricionistas.
 * Mapeia área principal + modalidade de atendimento + tempo para um perfil nome e focos.
 */

export interface StrategicProfileNutricionista {
  name: string
  focus: string[]
}

/**
 * Retorna o perfil estratégico identificado a partir das respostas do contexto (nutricionista).
 */
export function getStrategicProfileNutricionista(
  areaNutri: string | undefined,
  modalidade: string | undefined,
  tempoAnos: number | '' | undefined
): StrategicProfileNutricionista {
  const area = areaNutri || ''
  const mod = modalidade || ''
  const anos = typeof tempoAnos === 'number' ? tempoAnos : 0

  if (area === 'emagrecimento') {
    return {
      name: 'Nutricionista de Emagrecimento',
      focus: [
        'diagnósticos de metabolismo e alimentação',
        'qualificação de leads',
        'acompanhamento e recorrência',
      ],
    }
  }

  if (area === 'esportiva') {
    return {
      name: 'Nutricionista Esportiva',
      focus: [
        'avaliação de performance',
        'atletas e praticantes',
        'posicionamento premium',
      ],
    }
  }

  if (area === 'clinica') {
    return {
      name: 'Nutricionista Clínica',
      focus: [
        'diagnósticos de saúde',
        'qualificação de pacientes',
        'acompanhamento contínuo',
      ],
    }
  }

  if (area === 'infantil') {
    return {
      name: 'Nutricionista Infantil',
      focus: [
        'avaliações para os pais',
        'triagem e encaminhamento',
        'posicionamento para famílias',
      ],
    }
  }

  if (mod === 'online') {
    return {
      name: 'Nutricionista Online',
      focus: [
        'captação digital',
        'alcance nacional',
        'diagnósticos para qualificação',
      ],
    }
  }

  if (anos < 2) {
    return {
      name: 'Nutricionista em Crescimento',
      focus: [
        'primeiros pacientes',
        'construção de autoridade',
        'portfólio e indicação',
      ],
    }
  }

  return {
    name: 'Nutricionista',
    focus: [
      'captação de pacientes',
      'posicionamento digital',
      'organização da prática',
    ],
  }
}
