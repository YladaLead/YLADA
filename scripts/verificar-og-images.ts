/**
 * Script para verificar consistência das imagens OG
 * Verifica se todas as imagens existem e se todos os mapeamentos estão corretos
 */

import { readdir } from 'fs/promises'
import { join } from 'path'
import { OG_IMAGE_MAP } from '../src/lib/og-image-map'
import { OG_MESSAGES_MAP } from '../src/lib/og-messages-map'
import { existsSync } from 'fs'

async function verificarImagensOG() {
  console.log('🔍 Verificando imagens OG...\n')

  const imagesDir = join(process.cwd(), 'public', 'images', 'og', 'wellness')
  
  // Listar todas as imagens JPG no diretório
  const files = await readdir(imagesDir)
  const jpgFiles = files.filter(f => f.endsWith('.jpg')).sort()
  
  console.log(`📁 Total de imagens encontradas: ${jpgFiles.length}\n`)

  // 1. Verificar se todas as imagens do mapeamento existem
  console.log('1️⃣ Verificando se todas as imagens do mapeamento existem...')
  const missingImages: string[] = []
  const imagePaths = Object.values(OG_IMAGE_MAP)
  
  for (const imagePath of imagePaths) {
    const fileName = imagePath.split('/').pop() || ''
    const fullPath = join(imagesDir, fileName)
    
    if (!existsSync(fullPath)) {
      missingImages.push(imagePath)
      console.log(`  ❌ Faltando: ${imagePath}`)
    }
  }
  
  if (missingImages.length === 0) {
    console.log('  ✅ Todas as imagens do mapeamento existem!\n')
  } else {
    console.log(`  ⚠️  ${missingImages.length} imagem(ns) faltando\n`)
  }

  // 2. Verificar se há imagens no diretório sem mapeamento
  console.log('2️⃣ Verificando imagens sem mapeamento...')
  const unmappedImages: string[] = []
  
  for (const jpgFile of jpgFiles) {
    const imagePath = `/images/og/wellness/${jpgFile}`
    const isMapped = imagePaths.includes(imagePath)
    
    if (!isMapped && jpgFile !== 'default.jpg') {
      unmappedImages.push(jpgFile)
      console.log(`  ⚠️  Sem mapeamento: ${jpgFile}`)
    }
  }
  
  if (unmappedImages.length === 0) {
    console.log('  ✅ Todas as imagens têm mapeamento!\n')
  } else {
    console.log(`  ⚠️  ${unmappedImages.length} imagem(ns) sem mapeamento\n`)
  }

  // 3. Verificar se todas as mensagens OG têm imagem correspondente
  console.log('3️⃣ Verificando se todas as mensagens têm imagem...')
  const messagesWithoutImage: string[] = []
  
  for (const [slug, _] of Object.entries(OG_MESSAGES_MAP)) {
    if (!OG_IMAGE_MAP[slug] && slug !== 'portal') {
      messagesWithoutImage.push(slug)
      console.log(`  ⚠️  Mensagem sem imagem: ${slug}`)
    }
  }
  
  if (messagesWithoutImage.length === 0) {
    console.log('  ✅ Todas as mensagens têm imagem correspondente!\n')
  } else {
    console.log(`  ⚠️  ${messagesWithoutImage.length} mensagem(ns) sem imagem\n`)
  }

  // 4. Verificar se todas as imagens têm mensagens correspondentes
  console.log('4️⃣ Verificando se todas as imagens têm mensagens...')
  const imagesWithoutMessage: string[] = []
  
  for (const [slug, imagePath] of Object.entries(OG_IMAGE_MAP)) {
    if (slug !== 'default' && !OG_MESSAGES_MAP[slug]) {
      imagesWithoutMessage.push(slug)
      console.log(`  ⚠️  Imagem sem mensagem: ${slug} (${imagePath})`)
    }
  }
  
  if (imagesWithoutMessage.length === 0) {
    console.log('  ✅ Todas as imagens têm mensagens correspondentes!\n')
  } else {
    console.log(`  ⚠️  ${imagesWithoutMessage.length} imagem(ns) sem mensagem\n`)
  }

  // 5. Resumo final
  console.log('📊 RESUMO FINAL:')
  console.log(`  ✅ Imagens no diretório: ${jpgFiles.length}`)
  console.log(`  ✅ Imagens mapeadas: ${Object.keys(OG_IMAGE_MAP).length}`)
  console.log(`  ✅ Mensagens mapeadas: ${Object.keys(OG_MESSAGES_MAP).length}`)
  
  if (missingImages.length > 0) {
    console.log(`  ❌ Imagens faltando: ${missingImages.length}`)
  }
  if (unmappedImages.length > 0) {
    console.log(`  ⚠️  Imagens sem mapeamento: ${unmappedImages.length}`)
  }
  if (messagesWithoutImage.length > 0) {
    console.log(`  ⚠️  Mensagens sem imagem: ${messagesWithoutImage.length}`)
  }
  if (imagesWithoutMessage.length > 0) {
    console.log(`  ⚠️  Imagens sem mensagem: ${imagesWithoutMessage.length}`)
  }
  
  const hasIssues = missingImages.length > 0 || unmappedImages.length > 0 || 
                    messagesWithoutImage.length > 0 || imagesWithoutMessage.length > 0
  
  if (!hasIssues) {
    console.log('\n  🎉 Tudo OK! Todas as imagens e mapeamentos estão corretos!')
  } else {
    console.log('\n  ⚠️  Alguns problemas encontrados. Verifique acima.')
  }
}

verificarImagensOG().catch(console.error)

