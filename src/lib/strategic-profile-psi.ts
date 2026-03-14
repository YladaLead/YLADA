/**
 * Descoberta de perfil estratégico para profissionais de psicologia.
 * Mapeia público + modalidade de atendimento para um perfil nome e focos.
 */

export interface StrategicProfilePsi {
  name: string
  focus: string[]
}

/**
 * Retorna o perfil estratégico identificado a partir das respostas do contexto (psi).
 */
export function getStrategicProfilePsi(
  publico: string[] | string | undefined,
  modalidade: string | undefined,
  tempoAnos: number | '' | undefined
): StrategicProfilePsi {
  const publicos = Array.isArray(publico) ? publico : publico ? [publico] : []
  const mod = modalidade || ''
  const anos = typeof tempoAnos === 'number' ? tempoAnos : 0

  if (publicos.includes('empresas')) {
    return {
      name: 'Psicologia Organizacional',
      focus: [
        'diagnósticos de bem-estar corporativo',
        'qualificação de leads B2B',
        'posicionamento para empresas',
      ],
    }
  }

  if (publicos.includes('casais')) {
    return {
      name: 'Terapia de Casal',
      focus: [
        'avaliações pré-sessão',
        'qualificação de demanda',
        'comunicação de valor',
      ],
    }
  }

  if (publicos.includes('criancas')) {
    return {
      name: 'Atendimento Infantil',
      focus: [
        'avaliações para os pais',
        'triagem e encaminhamento',
        'posicionamento para famílias',
      ],
    }
  }

  if (mod === 'online') {
    return {
      name: 'Psicólogo Online',
      focus: [
        'captação digital',
        'alcance nacional',
        'diagnósticos para qualificação',
      ],
    }
  }

  if (anos < 2) {
    return {
      name: 'Profissional em Crescimento',
      focus: [
        'construção de carteira',
        'indicação e divulgação',
        'primeiros clientes',
      ],
    }
  }

  return {
    name: 'Psicólogo Clínico',
    focus: [
      'diagnósticos para ansiedade e estresse',
      'qualificação de primeiros contatos',
      'posicionamento digital',
    ],
  }
}
