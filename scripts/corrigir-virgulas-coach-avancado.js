const fs = require('fs')
const path = require('path')

const coachDiagnosticsDir = path.join(__dirname, '../src/lib/diagnostics/coach')

console.log('🔧 Iniciando correção AVANÇADA de vírgulas nos arquivos Coach...')

fs.readdir(coachDiagnosticsDir, (err, files) => {
  if (err) {
    console.error('❌ Erro ao ler diretório:', err)
    return
  }

  console.log(`📁 Processando ${files.length} arquivos...`)
  let filesChanged = 0

  files.forEach(file => {
    if (file.endsWith('.ts')) {
      const filePath = path.join(coachDiagnosticsDir, file)
      let content = fs.readFileSync(filePath, 'utf8')
      let originalContent = content
      
      // Estratégia mais agressiva: encontrar TODOS os padrões problemáticos
      
      // 1. Corrigir campos sem vírgula seguidos por outro campo
      const fieldPatterns = [
        // diagnostico sem vírgula
        /(\s+diagnostico:\s*['"`][^'"`]*['"`])\s*\n(\s+causaRaiz:)/g,
        /(\s+diagnostico:\s*\n\s*['"`][^'"`]*['"`])\s*\n(\s+causaRaiz:)/g,
        
        // causaRaiz sem vírgula
        /(\s+causaRaiz:\s*['"`][^'"`]*['"`])\s*\n(\s+acaoImediata:)/g,
        /(\s+causaRaiz:\s*\n\s*['"`][^'"`]*['"`])\s*\n(\s+acaoImediata:)/g,
        
        // acaoImediata sem vírgula
        /(\s+acaoImediata:\s*['"`][^'"`]*['"`])\s*\n(\s+proximoPasso:)/g,
        /(\s+acaoImediata:\s*\n\s*['"`][^'"`]*['"`])\s*\n(\s+proximoPasso:)/g,
      ]

      fieldPatterns.forEach(pattern => {
        content = content.replace(pattern, '$1,$2')
      })

      // 2. Corrigir objetos sem vírgula (proximoPasso seguido por })
      const objectPatterns = [
        // proximoPasso sem vírgula antes de fechar objeto
        /(\s+proximoPasso:\s*['"`][^'"`]*['"`])\s*\n(\s+})\s*\n(\s+\w+:\s*{)/g,
        /(\s+proximoPasso:\s*\n\s*['"`][^'"`]*['"`])\s*\n(\s+})\s*\n(\s+\w+:\s*{)/g,
      ]

      objectPatterns.forEach(pattern => {
        content = content.replace(pattern, '$1\n$2,\n$3')
      })

      // 3. Casos específicos mais complexos - buscar por padrões sem vírgula
      const complexPatterns = [
        // Qualquer campo que termine com aspas/backtick seguido diretamente por outro campo
        /(:\s*['"`][^'"`]*['"`])\s*\n\s*(diagnostico|causaRaiz|acaoImediata|proximoPasso):/g,
        
        // Qualquer } seguido por nome de objeto sem vírgula
        /(\s*})\s*\n(\s*\w+:\s*{)/g,
      ]

      complexPatterns.forEach(pattern => {
        content = content.replace(pattern, (match, p1, p2) => {
          if (pattern.source.includes('}')) {
            return p1 + ',\n' + p2
          } else {
            return p1 + ',\n      ' + p2 + ':'
          }
        })
      })

      // 4. Limpeza final - garantir que não há vírgulas duplas
      content = content.replace(/,,+/g, ',')
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8')
        console.log(`✅ Corrigido: ${file}`)
        filesChanged++
      } else {
        console.log(`⚪ Sem mudanças: ${file}`)
      }
    }
  })

  console.log(`\n🎯 CORREÇÃO AVANÇADA COMPLETA!`)
  console.log(`📊 Arquivos corrigidos: ${filesChanged}`)
  console.log(`📊 Total de arquivos: ${files.filter(f => f.endsWith('.ts')).length}`)
  console.log(`✨ Todos os erros de vírgula devem estar corrigidos!`)
})
