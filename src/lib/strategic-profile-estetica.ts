/**
 * Descoberta de perfil estratégico para profissionais de estética.
 * Mapeia área + tipo de atuação + tempo para um perfil nome e focos.
 */

export interface StrategicProfileEstetica {
  name: string
  focus: string[]
}

const AREA_LABELS: Record<string, string> = {
  facial: 'Estética Facial',
  corporal: 'Estética Corporal',
  depilacao_laser: 'Depilação / Laser',
  harmonizacao: 'Harmonização Facial',
  capilar: 'Capilar / Tricologia',
  integrativa: 'Estética Integrativa',
  outro: 'Outro',
}

/**
 * Retorna o perfil estratégico identificado a partir das respostas do contexto (estética).
 */
export function getStrategicProfileEstetica(
  areaEstetica: string | undefined,
  tipoAtuacao: string | undefined,
  tempoAnos: number | '' | undefined
): StrategicProfileEstetica {
  const area = areaEstetica || ''
  const tipo = tipoAtuacao || ''
  const anos = typeof tempoAnos === 'number' ? tempoAnos : 0
  const areaLabel = AREA_LABELS[area] || 'Estética'

  // Especialista Premium: harmonização ou procedimentos de alto valor
  if (area === 'harmonizacao') {
    return {
      name: 'Especialista Premium em Harmonização',
      focus: [
        'autoridade e posicionamento',
        'poucos clientes de alto ticket',
        'comunicação de valor',
      ],
    }
  }

  // Clínica Estruturada: dona de clínica ou profissional em equipe
  if (tipo === 'clinica_propria' || tipo === 'equipe_colaboradora') {
    return {
      name: 'Clínica Estruturada',
      focus: [
        'aquisição constante de clientes',
        'posicionamento premium',
        'funil de avaliação',
      ],
    }
  }

  // Profissional em Crescimento: pouca experiência
  if (anos < 2 || (tipo === 'autonoma' && !area)) {
    return {
      name: 'Profissional em Crescimento',
      focus: [
        'geração dos primeiros clientes',
        'construção de autoridade',
        'portfólio e indicação',
      ],
    }
  }

  // Especialista Local: autônoma ou dentro de salão, facial/corporal/depilação/capilar
  const sufixo = area ? ` em ${areaLabel}` : ''
  return {
    name: `Especialista Local${sufixo}`,
    focus: [
      'recorrência de clientes',
      'indicação de clientes satisfeitas',
      'organização da agenda',
    ],
  }
}
