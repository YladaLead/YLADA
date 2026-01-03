/**
 * Função para extrair cenas e descrições de imagens de um roteiro
 */

export interface Scene {
  number: number
  timestamp: string
  startTime: number
  endTime: number
  imageDescription: string
  text: string
  searchQuery: string
}

export function parseScriptScenes(script: string): Scene[] {
  const scenes: Scene[] = []
  const seenSceneNumbers = new Set<number>()
  
  // Mapeamento de termos de busca que o usuário já forneceu (já estão em inglês!)
  const searchTermsMap: Record<number, string> = {
    1: 'female nutritionist stressed office',
    2: 'nutritionist using instagram phone',
    3: 'professional woman desk thinking',
    4: 'professional woman serious expression',
    5: 'confident nutritionist laptop',
    6: 'business organization dashboard laptop',
    7: 'clean background with down arrow',
  }
  
  // Padrão: CENA 1 (0-3s) ou CENA 1 (0–3s)
  // Usar matchAll mas filtrar duplicatas
  const allMatches = [...script.matchAll(/CENA\s+(\d+)\s*\((\d+)[–-](\d+)s?\)/gi)]
  
  // Filtrar duplicatas - pegar apenas a primeira ocorrência de cada número de cena
  const uniqueMatches: Array<{ match: RegExpMatchArray; sceneNum: number }> = []
  for (const match of allMatches) {
    const sceneNum = parseInt(match[1])
    if (!seenSceneNumbers.has(sceneNum)) {
      seenSceneNumbers.add(sceneNum)
      uniqueMatches.push({ match, sceneNum })
    }
  }
  
  if (uniqueMatches.length > 0) {
    // Processar cada cena única
    uniqueMatches.forEach(({ match, sceneNum: uniqueSceneNum }) => {
      const sceneNum = uniqueSceneNum
      const startTime = parseInt(match[2])
      const endTime = parseInt(match[3])
      
      // Pegar o texto após a cena até a próxima cena ou fim
      const startIndex = match.index! + match[0].length
      const nextCenaMatch = script.substring(startIndex).match(/CENA\s+\d+\s*\(/i)
      const endIndex = nextCenaMatch 
        ? startIndex + nextCenaMatch.index! 
        : script.length
      
      const sceneText = script.substring(startIndex, endIndex)
      
      // Extrair descrição da imagem - procurar por "Imagem:" seguido de texto até quebra de linha
      const imageMatch = sceneText.match(/Imagem:\s*([^\n]+(?:\n(?!\s*(?:Texto|Text|CENA|$))[^\n]+)*)/i) ||
                        sceneText.match(/Image:\s*([^\n]+(?:\n(?!\s*(?:Texto|Text|CENA|$))[^\n]+)*)/i)
      
      const imageDescription = imageMatch ? imageMatch[1].trim().replace(/\n/g, ' ') : ''
      
      // Extrair texto da cena
      const textMatch = sceneText.match(/Texto[^:]*:\s*([^\n]+(?:\n[^\n]+)*?)(?=\n\s*(?:CENA|$))/i) ||
                       sceneText.match(/Text[^:]*:\s*([^\n]+(?:\n[^\n]+)*?)(?=\n\s*(?:CENA|$))/i)
      
      const text = textMatch ? textMatch[1].trim() : ''
      
      // Usar termo de busca do mapa se disponível, senão traduzir descrição
      let searchQuery = searchTermsMap[sceneNum]
      
      if (!searchQuery && imageDescription) {
        // Traduzir descrição para inglês
        searchQuery = imageDescription
          .toLowerCase()
          .replace(/nutricionista/gi, 'nutritionist')
          .replace(/preocupada/gi, 'worried stressed')
          .replace(/olhando/gi, 'looking at')
          .replace(/agenda/gi, 'calendar')
          .replace(/ou celular/gi, 'or phone')
          .replace(/celular/gi, 'phone')
          .replace(/mexendo no instagram/gi, 'using instagram')
          .replace(/instagram/gi, 'instagram')
          .replace(/pensativa/gi, 'thoughtful thinking')
          .replace(/mão no rosto/gi, 'hand on face')
          .replace(/confiante/gi, 'confident')
          .replace(/notebook/gi, 'laptop')
          .replace(/tela de organização/gi, 'organization dashboard')
          .replace(/dashboard/gi, 'dashboard')
          .replace(/sucesso profissional/gi, 'professional success')
          .replace(/fundo limpo/gi, 'clean background')
          .replace(/seta apontando para baixo/gi, 'down arrow')
          .replace(/close profissional/gi, 'professional close-up')
          .replace(/expressão mais firme/gi, 'serious expression')
          .replace(/profissional/gi, 'professional')
          .replace(/escritório/gi, 'office')
          .replace(/expressão/gi, 'expression')
          .replace(/tela/gi, 'screen')
          .replace(/sucesso/gi, 'success')
          .replace(/seta/gi, 'arrow')
          .replace(/apontando para baixo/gi, 'pointing down')
          .replace(/[^\w\s]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
      }
      
      // Fallback genérico
      if (!searchQuery || searchQuery.length < 3) {
        searchQuery = `nutritionist professional scene ${sceneNum}`
      }
      
      scenes.push({
        number: sceneNum,
        timestamp: `${startTime}-${endTime}s`,
        startTime,
        endTime,
        imageDescription,
        text,
        searchQuery,
      })
    })
  } else {
    // Fallback: tentar padrão de timestamps simples
    const timestampMatches = [...script.matchAll(/(\d+)[–-](\d+)s?\s*:\s*([^\n]+)/gi)]
    
    timestampMatches.forEach((match, index) => {
      const startTime = parseInt(match[1])
      const endTime = parseInt(match[2])
      const content = match[3].trim()
      
      const imageMatch = content.match(/[Ii]magem[^:]*:\s*([^\n]+)/)
      const imageDescription = imageMatch ? imageMatch[1].trim() : ''
      
      let searchQuery = searchTermsMap[index + 1] || `nutritionist scene ${index + 1}`
      
      if (!searchTermsMap[index + 1] && imageDescription) {
        searchQuery = imageDescription
          .toLowerCase()
          .replace(/nutricionista/gi, 'nutritionist')
          .replace(/[^\w\s]/g, ' ')
          .trim()
      }
      
      scenes.push({
        number: index + 1,
        timestamp: `${startTime}-${endTime}s`,
        startTime,
        endTime,
        imageDescription,
        text: content,
        searchQuery,
      })
    })
  }
  
  return scenes.sort((a, b) => a.startTime - b.startTime)
}

