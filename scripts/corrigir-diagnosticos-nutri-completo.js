const fs = require('fs')
const path = require('path')

const nutriDiagnosticsDir = path.join(__dirname, '../src/lib/diagnostics/nutri')

console.log('🔄 Iniciando correções completas dos diagnósticos Nutri...\n')

// Correções específicas baseadas nas imagens
const correcoes = {
  // 1. Remover palavras problemáticas e ajustar textos
  textoGeral: {
    // Remover palavras riscadas/problemáticas
    'tóxica': 'de toxinas',
    'carga tóxica': 'carga de toxinas', 
    'toxinas moderadas': 'sinais moderados de toxinas',
    'Alta carga tóxica': 'Alta carga de toxinas',
    
    // Padronizar linguagem
    'nutricionista': 'profissional de nutrição',
    'Uma nutricionista': 'Um profissional de nutrição',
    'um nutricionista': 'um profissional de nutrição',
    'da nutricionista': 'do profissional de nutrição',
    
    // Simplificar textos confusos
    'CONFUSO': '',
    'essa ferramenta serviria para vender um e-book???': '',
    'Ferramenta igual ao Quiz': '',
  },

  // 2. Correções específicas por arquivo
  arquivosEspecificos: {
    'quiz-detox.ts': {
      // Corrigir diagnóstico confuso
      'Seu corpo mostra sinais de acúmulo tóxica moderadas': 'Seu corpo mostra sinais de acúmulo moderado de toxinas',
      'Alta carga tóxica': 'Alta carga de toxinas',
      'podem reduzir carga tóxica': 'podem reduzir a carga de toxinas'
    },
    
    'quiz-interativo.ts': {
      // Remover textos confusos das perguntas
      'Quase nenhuma': 'Menos de 1 litro',
      'Mais ou menos 1 litro': 'De 1 a 1,5 litros', 
      'Sempre carrego minha garrafinha': 'Acima de 2 litros',
      'Quase nunca': 'Não pratico',
      'Quase todos os dias': '5 a 7 vezes por semana'
    },

    'calculadora-proteina.ts': {
      // Simplificar preview da calculadora
      'quantas proteínas': 'Qual a quantidade de proteína que você precisa consumir por dia?',
      'quantas proteínas (qual a quantidade de proteína que seu corpo precisa por dia)': 'Qual a quantidade de proteína que seu corpo precisa por dia'
    },

    'calculadora-agua.ts': {
      // Simplificar preview da calculadora
      'Quanta': 'Quanto de água você precisa por dia?',
      'quanta (quanto de) água seu corpo precisa por dia': 'quanto de água seu corpo precisa por dia'
    },

    'calculadora-calorias.ts': {
      // Corrigir diagnóstico de superávit
      'Sua ingestão calórica está equilibrada, mantenha o padrão': 'Sua ingestão calórica está equilibrada, mantenha o padrão (mas pode melhorar)',
      'Estudos indicam que superávit de 300-500 calorias por dia': 'Consumo calórico abaixo do necessário para ganho de massa'
    }
  }
}

// Função para aplicar correções gerais de texto
function aplicarCorrecaoTexto(content) {
  let novoContent = content
  
  Object.keys(correcoes.textoGeral).forEach(textoAntigo => {
    const textoNovo = correcoes.textoGeral[textoAntigo]
    const regex = new RegExp(textoAntigo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    novoContent = novoContent.replace(regex, textoNovo)
  })
  
  return novoContent
}

// Função para aplicar correções específicas por arquivo
function aplicarCorrecaoEspecifica(nomeArquivo, content) {
  if (!correcoes.arquivosEspecificos[nomeArquivo]) {
    return content
  }
  
  let novoContent = content
  const correcoesPorArquivo = correcoes.arquivosEspecificos[nomeArquivo]
  
  Object.keys(correcoesPorArquivo).forEach(textoAntigo => {
    const textoNovo = correcoesPorArquivo[textoAntigo]
    const regex = new RegExp(textoAntigo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    novoContent = novoContent.replace(regex, textoNovo)
  })
  
  return novoContent
}

// Função para remover campos desnecessários (já feito anteriormente, mas garantir)
function removerCamposDesnecessarios(content) {
  // Remover linhas com plano7Dias, suplementacao, alimentacao
  const linhasParaRemover = [
    /plano7Dias:\s*'[^']*',?\s*\n/gi,
    /suplementacao:\s*'[^']*',?\s*\n/gi,
    /alimentacao:\s*'[^']*',?\s*\n/gi
  ]
  
  let novoContent = content
  linhasParaRemover.forEach(regex => {
    novoContent = novoContent.replace(regex, '')
  })
  
  return novoContent
}

// Processar todos os arquivos
let totalArquivos = 0
let arquivosAlterados = 0

fs.readdir(nutriDiagnosticsDir, (err, files) => {
  if (err) {
    console.error('Erro ao ler diretório:', err)
    return
  }

  files.forEach(file => {
    if (file.endsWith('.ts')) {
      totalArquivos++
      const filePath = path.join(nutriDiagnosticsDir, file)
      let content = fs.readFileSync(filePath, 'utf8')
      const contentOriginal = content
      
      // Aplicar todas as correções
      content = aplicarCorrecaoTexto(content)
      content = aplicarCorrecaoEspecifica(file, content)
      content = removerCamposDesnecessarios(content)
      
      // Verificar se houve mudanças
      if (content !== contentOriginal) {
        fs.writeFileSync(filePath, content, 'utf8')
        console.log(`✅ ${file}: Correções aplicadas`)
        arquivosAlterados++
      } else {
        console.log(`- ${file}: Nenhuma alteração necessária`)
      }
    }
  })

  console.log(`\n📊 Resumo das Correções:`)
  console.log(`- Total de arquivos processados: ${totalArquivos}`)
  console.log(`- Arquivos corrigidos: ${arquivosAlterados}`)
  console.log(`\n✅ Correções completas dos diagnósticos Nutri finalizadas!`)
})
