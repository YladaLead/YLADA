/**
 * Script para criar imagens OG placeholder
 * Copia o logo Wellness para todos os arquivos necessários
 */

import * as fs from 'fs'
import * as path from 'path'

const sourceImage = path.join(process.cwd(), 'public/images/logo/wellness/Logo_Wellness_horizontal.png')
const targetDir = path.join(process.cwd(), 'public/images/og/wellness')

// Lista de todos os arquivos de imagem necessários
const imageFiles = [
  'calc-imc.jpg',
  'calc-proteina.jpg',
  'calc-hidratacao.jpg',
  'calc-calorias.jpg',
  'calc-composicao.jpg',
  'quiz-ganhos.jpg',
  'quiz-potencial.jpg',
  'quiz-proposito.jpg',
  'quiz-alimentacao.jpg',
  'quiz-wellness-profile.jpg',
  'quiz-nutrition-assessment.jpg',
  'quiz-personalizado.jpg',
  'template-desafio-7dias.jpg',
  'template-desafio-21dias.jpg',
  'guia-hidratacao.jpg',
  'avaliacao-intolerancia.jpg',
  'avaliacao-perfil-metabolico.jpg',
  'avaliacao-emocional.jpg',
  'template-avaliacao-inicial.jpg',
  'diagnostico-eletrolitos.jpg',
  'diagnostico-sintomas-intestinais.jpg',
  'pronto-emagrecer.jpg',
  'tipo-fome.jpg',
  'sindrome-metabolica.jpg',
  'retencao-liquidos.jpg',
  'conhece-seu-corpo.jpg',
  'nutrido-vs-alimentado.jpg',
  'alimentacao-rotina.jpg',
  'template-story-interativo.jpg',
  'planilha-meal-planner.jpg',
  'planilha-diario-alimentar.jpg',
  'planilha-metas-semanais.jpg',
  'cardapio-detox.jpg',
  'portal.jpg',
  'default.jpg',
]

function criarImagensPlaceholder() {
  console.log('🖼️  Criando imagens OG placeholder...\n')
  
  // Verificar se a imagem fonte existe
  if (!fs.existsSync(sourceImage)) {
    console.error(`❌ Imagem fonte não encontrada: ${sourceImage}`)
    console.log('💡 Por favor, certifique-se de que o logo Wellness existe.')
    process.exit(1)
  }
  
  // Criar diretório se não existir
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
    console.log(`✅ Diretório criado: ${targetDir}`)
  }
  
  // Ler a imagem fonte
  const sourceBuffer = fs.readFileSync(sourceImage)
  
  // Copiar para cada arquivo de destino
  let criadas = 0
  let jaExistentes = 0
  
  imageFiles.forEach((filename) => {
    const targetPath = path.join(targetDir, filename)
    
    if (fs.existsSync(targetPath)) {
      console.log(`⏭️  Já existe: ${filename}`)
      jaExistentes++
    } else {
      // Copiar a imagem (como PNG, depois pode ser convertida para JPG)
      const targetPathPNG = targetPath.replace('.jpg', '.png')
      fs.writeFileSync(targetPathPNG, sourceBuffer)
      console.log(`✅ Criado: ${filename.replace('.jpg', '.png')}`)
      criadas++
    }
  })
  
  console.log(`\n📊 Resumo:`)
  console.log(`   ✅ Criadas: ${criadas}`)
  console.log(`   ⏭️  Já existentes: ${jaExistentes}`)
  console.log(`   📁 Total: ${imageFiles.length}`)
  console.log(`\n💡 Nota: As imagens foram criadas como PNG.`)
  console.log(`   Você pode convertê-las para JPG depois se preferir.`)
  console.log(`   Todas começam com o logo Wellness como placeholder.`)
}

// Executar
criarImagensPlaceholder()

