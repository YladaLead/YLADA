const fs = require('fs')
const path = require('path')

const coachDir = path.join(__dirname, '../src/lib/diagnostics/coach')

// Função para substituir textos (mesma lógica do adaptarDiagnosticoParaCoach)
function substituirTexto(texto) {
  if (!texto) return texto
  
  let resultado = texto
    // Substituir "nutricionista"
    .replace(/nutricionista profissional/gi, 'Coach de bem-estar profissional')
    .replace(/com uma nutricionista/gi, 'com um Coach de bem-estar')
    .replace(/de uma nutricionista/gi, 'de um Coach de bem-estar')
    .replace(/da nutricionista/gi, 'do Coach de bem-estar')
    .replace(/a nutricionista/gi, 'o Coach de bem-estar')
    .replace(/sua nutricionista/gi, 'seu Coach de bem-estar')
    .replace(/uma nutricionista/gi, 'um Coach de bem-estar')
    .replace(/guiado por nutricionista/gi, 'guiado por Coach de bem-estar')
    .replace(/NUTRICIONISTA/gi, 'COACH DE BEM-ESTAR')
    .replace(/Nutricionista/gi, 'Coach de bem-estar')
    .replace(/nutricionista/gi, 'Coach de bem-estar')
  
  // Substituir "nutricional"
  resultado = resultado
    .replace(/avaliação nutricional especializada/gi, 'avaliação de bem-estar especializada')
    .replace(/avaliação nutricional completa/gi, 'avaliação de bem-estar completa')
    .replace(/avaliação nutricional preventiva/gi, 'avaliação de bem-estar preventiva')
    .replace(/avaliação nutricional/gi, 'avaliação de bem-estar')
    .replace(/consulta nutricional/gi, 'consulta de bem-estar')
    .replace(/análise nutricional completa/gi, 'análise de bem-estar completa')
    .replace(/análise nutricional/gi, 'análise de bem-estar')
    .replace(/acompanhamento nutricional especializado/gi, 'acompanhamento de bem-estar especializado')
    .replace(/acompanhamento nutricional e comportamental/gi, 'acompanhamento de bem-estar e comportamental')
    .replace(/acompanhamento nutricional preventivo/gi, 'acompanhamento de bem-estar preventivo')
    .replace(/acompanhamento nutricional/gi, 'acompanhamento de bem-estar')
    .replace(/marcadores nutricionais/gi, 'marcadores de bem-estar')
    .replace(/marcadores hormonais e nutricionais/gi, 'marcadores hormonais e de bem-estar')
    .replace(/estratégias nutricionais otimizadas/gi, 'estratégias de bem-estar otimizadas')
    .replace(/estratégias nutricionais/gi, 'estratégias de bem-estar')
    .replace(/plano nutricional/gi, 'plano de bem-estar')
    .replace(/protocolo nutricional/gi, 'protocolo de bem-estar')
    .replace(/\bnutricional\b/gi, 'de bem-estar')
  
  // Substituir "nutrição"
  resultado = resultado
    .replace(/\badequar nutrição\b/gi, 'adequar bem-estar')
    .replace(/\badequar nutrição ao\b/gi, 'adequar bem-estar ao')
    .replace(/\bnutrição ao estilo de vida\b/gi, 'bem-estar ao estilo de vida')
    .replace(/\bà nutrição\b/gi, 'ao bem-estar')
    .replace(/\bda nutrição\b/gi, 'do bem-estar')
    .replace(/\bde nutrição\b/gi, 'de bem-estar')
    .replace(/\bnutrição\b/gi, 'bem-estar')
  
  return resultado
}

// Processar cada arquivo
fs.readdir(coachDir, (err, files) => {
  if (err) {
    console.error('Erro ao ler diretório:', err)
    return
  }

  files.forEach(file => {
    if (!file.endsWith('.ts')) return

    const filePath = path.join(coachDir, file)
    let content = fs.readFileSync(filePath, 'utf8')

    // 1. Mudar comentário de "ÁREA NUTRI" para "ÁREA COACH"
    content = content.replace(/ÁREA NUTRI/gi, 'ÁREA COACH')

    // 2. Substituir 'nutri:' por 'coach:' na estrutura do objeto
    content = content.replace(/nutri:\s*{/g, 'coach: {')

    // 3. Adaptar textos dentro das strings (diagnostico, causaRaiz, acaoImediata, proximoPasso)
    // Usar regex para encontrar strings e substituir
    content = content.replace(/'([^']*)'/g, (match, texto) => {
      // Verificar se é uma string de diagnóstico (não é código TypeScript)
      if (texto.includes('DIAGNÓSTICO') || texto.includes('CAUSA RAIZ') || texto.includes('AÇÃO IMEDIATA') || texto.includes('PRÓXIMO PASSO') || 
          texto.includes('diagnostico') || texto.includes('causaRaiz') || texto.includes('acaoImediata') || texto.includes('proximoPasso')) {
        const textoAdaptado = substituirTexto(texto)
        return `'${textoAdaptado}'`
      }
      return match
    })

    // Também processar strings com aspas duplas
    content = content.replace(/"([^"]*)"/g, (match, texto) => {
      if (texto.includes('DIAGNÓSTICO') || texto.includes('CAUSA RAIZ') || texto.includes('AÇÃO IMEDIATA') || texto.includes('PRÓXIMO PASSO') || 
          texto.includes('diagnostico') || texto.includes('causaRaiz') || texto.includes('acaoImediata') || texto.includes('proximoPasso')) {
        const textoAdaptado = substituirTexto(texto)
        return `"${textoAdaptado}"`
      }
      return match
    })

    // 4. Remover campos plano7Dias, suplementacao, alimentacao se existirem
    content = content.replace(/^\s*(plano7Dias|suplementacao|alimentacao):\s*['"][^'"]*['"],?\s*$/gm, '')

    fs.writeFileSync(filePath, content, 'utf8')
    console.log(`✓ Processado: ${file}`)
  })

  console.log('\n✅ Todos os arquivos foram adaptados para Coach!')
})

