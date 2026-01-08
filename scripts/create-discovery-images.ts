/**
 * Script para criar imagens da página de descoberta
 * Gera 2 imagens usando DALL-E com visual da plataforma YLADA Nutri
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import OpenAI from 'openai'

// Carregar variáveis de ambiente
config({ path: resolve(process.cwd(), '.env.local') })

const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) {
  console.error('❌ OPENAI_API_KEY não encontrada no .env.local')
  process.exit(1)
}

const openai = new OpenAI({
  apiKey,
})

async function createDiscoveryImages() {
  console.log('🎨 Criando imagens para página de descoberta...\n')

  // IMAGEM 1: Hero - Nutricionista usando a plataforma
  console.log('📸 Criando Imagem 1: Nutricionista usando a plataforma...')
  const prompt1 = `Professional Brazilian female nutritionist using YLADA Nutri platform on laptop, modern clean interface with blue color scheme (#3B82F6, #3CA3E0), dashboard visible showing organized schedule and tools, warm natural lighting, professional but friendly atmosphere, high quality, realistic, 16:9 aspect ratio`

  try {
    const image1 = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt1,
      n: 1,
      size: '1792x1024', // 16:9
      quality: 'hd',
    })

    console.log('✅ Imagem 1 criada:', image1.data[0].url)
    console.log('   URL:', image1.data[0].url)
    console.log('   Prompt revisado:', image1.data[0].revised_prompt || 'N/A')
    console.log('')

    // IMAGEM 2: Dashboard com agenda cheia (resultado)
    console.log('📸 Criando Imagem 2: Dashboard com agenda cheia...')
    const prompt2 = `YLADA Nutri platform dashboard interface showing full calendar schedule with many appointments, blue color scheme (#3B82F6, #3CA3E0), modern clean design with cards and metrics, growth charts visible, professional nutritionist workspace, organized and successful, high quality, realistic UI mockup, 16:9 aspect ratio`

    const image2 = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt2,
      n: 1,
      size: '1792x1024', // 16:9
      quality: 'hd',
    })

    console.log('✅ Imagem 2 criada:', image2.data[0].url)
    console.log('   URL:', image2.data[0].url)
    console.log('   Prompt revisado:', image2.data[0].revised_prompt || 'N/A')
    console.log('')

    console.log('🎉 Imagens criadas com sucesso!')
    console.log('\n📋 URLs para adicionar na página:')
    console.log('Imagem 1 (Hero):', image1.data[0].url)
    console.log('Imagem 2 (Dashboard):', image2.data[0].url)

    return {
      heroImage: image1.data[0].url,
      dashboardImage: image2.data[0].url,
    }
  } catch (error: any) {
    console.error('❌ Erro ao criar imagens:', error.message)
    throw error
  }
}

// Executar
createDiscoveryImages()
  .then(() => {
    console.log('\n✅ Processo concluído!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erro:', error)
    process.exit(1)
  })

