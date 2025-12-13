/**
 * Parser para extrair os 4 blocos do formato fixo da resposta da LYA
 * 
 * Formato esperado:
 * ANÁLISE DA LYA — HOJE
 * 
 * 1) FOCO PRIORITÁRIO
 * [texto]
 * 
 * 2) AÇÃO RECOMENDADA
 * ☐ ação 1
 * ☐ ação 2
 * 
 * 3) ONDE APLICAR
 * [texto]
 * 
 * 4) MÉTRICA DE SUCESSO
 * [texto]
 */

export interface ParsedLyaResponse {
  foco_prioritario: string
  acoes_recomendadas: string[]
  onde_aplicar: string
  metrica_sucesso: string
  isValid: boolean
}

export function parseLyaResponse(response: string): ParsedLyaResponse {
  const result: ParsedLyaResponse = {
    foco_prioritario: '',
    acoes_recomendadas: [],
    onde_aplicar: '',
    metrica_sucesso: '',
    isValid: false
  }

  if (!response || typeof response !== 'string') {
    return result
  }

  // Normalizar quebras de linha
  const normalized = response.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  
  // Extrair blocos usando regex
  const focoMatch = normalized.match(/1\)\s*FOCO\s*PRIORITÁRIO\s*\n([^\n]+(?:\n[^\n]+)*?)(?=\n\s*2\)|$)/i)
  const acaoMatch = normalized.match(/2\)\s*AÇÃO\s*RECOMENDADA\s*\n([^\n]+(?:\n[^\n]+)*?)(?=\n\s*3\)|$)/i)
  const ondeMatch = normalized.match(/3\)\s*ONDE\s*APLICAR\s*\n([^\n]+(?:\n[^\n]+)*?)(?=\n\s*4\)|$)/i)
  const metricaMatch = normalized.match(/4\)\s*MÉTRICA\s*DE\s*SUCESSO\s*\n([^\n]+(?:\n[^\n]+)*?)(?=\n\s*$|$)/i)

  // Extrair foco prioritário
  if (focoMatch) {
    result.foco_prioritario = focoMatch[1].trim().replace(/\n/g, ' ').substring(0, 200)
  }

  // Extrair ações recomendadas (linhas que começam com ☐, □, ou -)
  if (acaoMatch) {
    const acoesText = acaoMatch[1]
    const acoes = acoesText
      .split('\n')
      .map(line => line.trim())
      .filter(line => {
        const trimmed = line.trim()
        return trimmed.startsWith('☐') || 
               trimmed.startsWith('□') || 
               trimmed.startsWith('-') ||
               trimmed.startsWith('•') ||
               /^\d+[\.\)]/.test(trimmed) // Números com ponto ou parêntese
      })
      .map(line => {
        // Remover marcadores e limpar
        return line
          .replace(/^[☐□•-]\s*/, '')
          .replace(/^\d+[\.\)]\s*/, '')
          .trim()
      })
      .filter(line => line.length > 0)
      .slice(0, 3) // Máximo 3 ações
    
    result.acoes_recomendadas = acoes.length > 0 ? acoes : [acoesText.trim().substring(0, 150)]
  }

  // Extrair onde aplicar (tentar múltiplos padrões)
  if (ondeMatch) {
    result.onde_aplicar = ondeMatch[1].trim().replace(/\n/g, ' ').substring(0, 200)
  } else {
    // Tentar padrão alternativo sem parêntese
    const ondeMatchAlt = normalized.match(/3[\.\)]\s*ONDE\s*APLICAR\s*:?\s*\n?([^\n]+(?:\n[^\n]+)*?)(?=\n\s*4[\.\)]|$)/i)
    if (ondeMatchAlt) {
      result.onde_aplicar = ondeMatchAlt[1].trim().replace(/\n/g, ' ').substring(0, 200)
    }
  }
  
  // Se ainda estiver vazio, tentar inferir do link_interno ou ação
  if (!result.onde_aplicar && result.acoes_recomendadas.length > 0) {
    const primeiraAcao = result.acoes_recomendadas[0].toLowerCase()
    if (primeiraAcao.includes('dia 1') || primeiraAcao.includes('jornada')) {
      result.onde_aplicar = 'Jornada 30 Dias → Dia 1'
    } else if (primeiraAcao.includes('quiz')) {
      result.onde_aplicar = 'Ferramentas → Criar Quiz'
    } else {
      result.onde_aplicar = 'Área Nutri → Home'
    }
  }

  // Extrair métrica de sucesso
  if (metricaMatch) {
    result.metrica_sucesso = metricaMatch[1].trim().replace(/\n/g, ' ').substring(0, 200)
  }

  // Validar se todos os blocos foram extraídos
  result.isValid = !!(
    result.foco_prioritario &&
    result.acoes_recomendadas.length > 0 &&
    result.onde_aplicar &&
    result.metrica_sucesso
  )

  return result
}

/**
 * Fallback: se o parser não conseguir extrair, retorna valores padrão
 */
export function getFallbackLyaResponse(): ParsedLyaResponse {
  return {
    foco_prioritario: 'Iniciar sua organização profissional com método.',
    acoes_recomendadas: ['Iniciar o Dia 1 da Jornada'],
    onde_aplicar: 'Jornada 30 Dias → Dia 1',
    metrica_sucesso: 'Dia 1 concluído até hoje.',
    isValid: true
  }
}

