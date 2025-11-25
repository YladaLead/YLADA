const fs = require('fs')
const path = require('path')

const coachDiagnosticsDir = path.join(__dirname, '../src/lib/diagnostics/coach')

console.log('🚀 Iniciando correção completa de vírgulas nos arquivos Coach...')

fs.readdir(coachDiagnosticsDir, (err, files) => {
  if (err) {
    console.error('❌ Erro ao ler diretório:', err)
    return
  }

  console.log(`📁 Encontrados ${files.length} arquivos para processar...`)
  let filesChanged = 0

  files.forEach(file => {
    if (file.endsWith('.ts')) {
      const filePath = path.join(coachDiagnosticsDir, file)
      let content = fs.readFileSync(filePath, 'utf8')
      let changed = false

      // Padrões de correção de vírgulas
      const corrections = [
        // Vírgula após diagnostico (quando seguido por causaRaiz)
        {
          pattern: /(diagnostico:\s*['"`][^'"`]*['"`])\s*\n\s*causaRaiz:/g,
          replacement: '$1,\n      causaRaiz:'
        },
        // Vírgula após causaRaiz (quando seguido por acaoImediata)
        {
          pattern: /(causaRaiz:\s*['"`][^'"`]*['"`])\s*\n\s*acaoImediata:/g,
          replacement: '$1,\n      acaoImediata:'
        },
        // Vírgula após acaoImediata (quando seguido por proximoPasso)
        {
          pattern: /(acaoImediata:\s*['"`][^'"`]*['"`])\s*\n\s*proximoPasso:/g,
          replacement: '$1,\n      proximoPasso:'
        },
        // Vírgula após proximoPasso (quando seguido por } e depois novo objeto)
        {
          pattern: /(proximoPasso:\s*['"`][^'"`]*['"`])\s*\n\s*}\s*\n\s*(\w+):\s*{/g,
          replacement: '$1\n    },\n    $2: {'
        },
        // Vírgula após último campo de objeto (quando seguido por } e depois novo objeto)
        {
          pattern: /(proximoPasso:\s*['"`][^'"`]*['"`])\s*\n\s*}\s*\n\s*(\w+):\s*{/g,
          replacement: '$1\n    },\n    $2: {'
        }
      ]

      // Aplicar todas as correções
      corrections.forEach(correction => {
        const newContent = content.replace(correction.pattern, correction.replacement)
        if (newContent !== content) {
          content = newContent
          changed = true
        }
      })

      // Correções específicas para casos mais complexos
      // Corrigir vírgulas faltantes em campos multiline
      const multilineCorrections = [
        // diagnostico multiline
        {
          pattern: /(diagnostico:\s*\n\s*['"`][^'"`]*['"`])\s*\n\s*causaRaiz:/g,
          replacement: '$1,\n      causaRaiz:'
        },
        // causaRaiz multiline
        {
          pattern: /(causaRaiz:\s*\n\s*['"`][^'"`]*['"`])\s*\n\s*acaoImediata:/g,
          replacement: '$1,\n      acaoImediata:'
        },
        // acaoImediata multiline
        {
          pattern: /(acaoImediata:\s*\n\s*['"`][^'"`]*['"`])\s*\n\s*proximoPasso:/g,
          replacement: '$1,\n      proximoPasso:'
        }
      ]

      multilineCorrections.forEach(correction => {
        const newContent = content.replace(correction.pattern, correction.replacement)
        if (newContent !== content) {
          content = newContent
          changed = true
        }
      })

      if (changed) {
        fs.writeFileSync(filePath, content, 'utf8')
        console.log(`✅ Corrigido: ${file}`)
        filesChanged++
      } else {
        console.log(`⚪ Sem mudanças: ${file}`)
      }
    }
  })

  console.log(`\n🎯 CORREÇÃO COMPLETA!`)
  console.log(`📊 Arquivos corrigidos: ${filesChanged}`)
  console.log(`📊 Total de arquivos: ${files.filter(f => f.endsWith('.ts')).length}`)
  console.log(`✨ Pronto para commit único!`)
})
