/**
 * Script auxiliar para organizar arquivos baixados do Envato Elements
 * 
 * Este script ajuda a renomear e organizar arquivos baixados do Envato
 * seguindo a convenção esperada pelo script de upload
 * 
 * Uso:
 *   npx tsx scripts/organize-envato-downloads.ts /caminho/para/pasta/envato-downloads
 * 
 * O script vai:
 * - Listar todos os arquivos
 * - Sugerir nomes baseados no conteúdo
 * - (Opcional) Renomear automaticamente
 */

import { readdir, stat, rename } from 'fs/promises'
import { join, extname, basename, dirname } from 'path'
import { existsSync } from 'fs'
import * as readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve))
}

// Mapeamento de palavras-chave comuns do Envato para nosso formato
const KEYWORD_MAP: Record<string, string> = {
  // Nutrição
  'nutrition': 'nutri',
  'nutritionist': 'nutricionista',
  'diet': 'dieta',
  'food': 'comida',
  'healthy': 'saudavel',
  'meal': 'refeicao',
  
  // Agenda
  'calendar': 'agenda',
  'schedule': 'agenda',
  'empty': 'vazia',
  'full': 'cheia',
  'busy': 'cheia',
  
  // Consulta
  'consultation': 'consulta',
  'appointment': 'consulta',
  'meeting': 'atendimento',
  
  // Dashboard
  'dashboard': 'dashboard',
  'analytics': 'grafico',
  'chart': 'grafico',
  'data': 'dados',
  
  // Emoções
  'happy': 'feliz',
  'satisfied': 'satisfeito',
  'success': 'sucesso',
  'problem': 'problema',
  'frustration': 'frustracao',
  
  // Coach
  'fitness': 'fitness',
  'workout': 'treino',
  'exercise': 'exercicio',
  'training': 'treino',
  'gym': 'academia',
  
  // Wellness
  'wellness': 'wellness',
  'meditation': 'meditacao',
  'yoga': 'yoga',
  'relax': 'relaxamento',
  'calm': 'calma',
}

// Detectar área baseado no nome do arquivo ou pasta
function detectArea(fileName: string, folderPath: string): string {
  const name = fileName.toLowerCase()
  const folder = folderPath.toLowerCase()
  
  if (name.includes('nutri') || folder.includes('nutri') || 
      name.includes('nutrition') || name.includes('diet')) {
    return 'nutri'
  }
  if (name.includes('coach') || folder.includes('coach') || 
      name.includes('fitness') || name.includes('workout')) {
    return 'coach'
  }
  if (name.includes('wellness') || folder.includes('wellness') || 
      name.includes('meditation') || name.includes('yoga')) {
    return 'wellness'
  }
  if (name.includes('nutra') || folder.includes('nutra') || 
      name.includes('supplement')) {
    return 'nutra'
  }
  
  return 'all'
}

// Detectar propósito
function detectPurpose(fileName: string): string {
  const name = fileName.toLowerCase()
  
  if (name.includes('hook') || name.includes('impact') || name.includes('shock')) {
    return 'hook'
  }
  if (name.includes('problem') || name.includes('empty') || name.includes('frustration')) {
    return 'dor'
  }
  if (name.includes('success') || name.includes('result') || name.includes('happy') || name.includes('full')) {
    return 'solucao'
  }
  if (name.includes('cta') || name.includes('action') || name.includes('button')) {
    return 'cta'
  }
  if (name.includes('background') || name.includes('bg') || name.includes('texture')) {
    return 'background'
  }
  
  return 'all'
}

// Gerar nome sugerido
function generateSuggestedName(fileName: string, folderPath: string): string {
  const ext = extname(fileName)
  const baseName = basename(fileName, ext).toLowerCase()
  const area = detectArea(fileName, folderPath)
  const purpose = detectPurpose(fileName)
  
  // Extrair palavras-chave do nome original
  const words = baseName
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2)
    .slice(0, 3) // Máximo 3 palavras-chave
  
  // Traduzir palavras-chave
  const translatedWords = words.map(word => {
    return KEYWORD_MAP[word] || word
  })
  
  // Montar nome: {area}-{palavras-chave}-{numero}
  const keywords = translatedWords.join('-')
  const number = Math.floor(Math.random() * 999).toString().padStart(3, '0')
  
  let suggestedName = `${area}`
  if (keywords) {
    suggestedName += `-${keywords}`
  }
  if (purpose !== 'all') {
    suggestedName += `-${purpose}`
  }
  suggestedName += `-${number}${ext}`
  
  return suggestedName
}

async function processFile(filePath: string, folderPath: string) {
  const fileName = basename(filePath)
  const suggestedName = generateSuggestedName(fileName, folderPath)
  const suggestedPath = join(dirname(filePath), suggestedName)
  
  return {
    original: fileName,
    suggested: suggestedName,
    area: detectArea(fileName, folderPath),
    purpose: detectPurpose(fileName),
    originalPath: filePath,
    suggestedPath: suggestedPath,
  }
}

async function main() {
  const basePath = process.argv[2]
  
  if (!basePath) {
    console.error('❌ Erro: Forneça o caminho da pasta de downloads')
    console.log('Uso: npx tsx scripts/organize-envato-downloads.ts /caminho/para/envato-downloads')
    process.exit(1)
  }
  
  if (!existsSync(basePath)) {
    console.error(`❌ Erro: Pasta não encontrada: ${basePath}`)
    process.exit(1)
  }
  
  console.log('📁 Analisando arquivos...\n')
  
  const suggestions: Array<{
    original: string
    suggested: string
    area: string
    purpose: string
    originalPath: string
    suggestedPath: string
  }> = []
  
  async function scanDirectory(dirPath: string, relativePath: string = '') {
    const files = await readdir(dirPath)
    
    for (const file of files) {
      const filePath = join(dirPath, file)
      const stats = await stat(filePath)
      
      if (stats.isDirectory()) {
        await scanDirectory(filePath, join(relativePath, file))
      } else {
        const ext = extname(file).toLowerCase()
        if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp4', '.mov', '.avi', '.mp3', '.wav'].includes(ext)) {
          const suggestion = await processFile(filePath, relativePath)
          suggestions.push(suggestion)
        }
      }
    }
  }
  
  await scanDirectory(basePath)
  
  if (suggestions.length === 0) {
    console.log('⚠️  Nenhum arquivo de mídia encontrado')
    process.exit(0)
  }
  
  console.log(`\n📊 Encontrados ${suggestions.length} arquivos\n`)
  console.log('📋 Sugestões de renomeação:\n')
  
  suggestions.forEach((s, i) => {
    console.log(`${i + 1}. ${s.original}`)
    console.log(`   → ${s.suggested}`)
    console.log(`   Área: ${s.area} | Propósito: ${s.purpose}\n`)
  })
  
  const answer = await question('\n❓ Deseja renomear os arquivos automaticamente? (s/n): ')
  
  if (answer.toLowerCase() === 's' || answer.toLowerCase() === 'sim') {
    console.log('\n🔄 Renomeando arquivos...\n')
    
    let renamed = 0
    let errors = 0
    
    for (const suggestion of suggestions) {
      try {
        // Verificar se já existe arquivo com o nome sugerido
        if (existsSync(suggestion.suggestedPath)) {
          console.log(`⚠️  Já existe: ${suggestion.suggested}`)
          continue
        }
        
        await rename(suggestion.originalPath, suggestion.suggestedPath)
        console.log(`✅ ${suggestion.original} → ${suggestion.suggested}`)
        renamed++
      } catch (error: any) {
        console.error(`❌ Erro ao renomear ${suggestion.original}:`, error.message)
        errors++
      }
    }
    
    console.log(`\n✅ Concluído! ${renamed} arquivos renomeados, ${errors} erros`)
  } else {
    console.log('\nℹ️  Arquivos não foram renomeados. Você pode renomear manualmente seguindo as sugestões acima.')
  }
  
  rl.close()
}

main().catch(console.error)


