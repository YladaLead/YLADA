/**
 * Script para fazer upload em lote de imagens/vídeos/áudios para Supabase Storage
 * e popular a tabela media_library
 * 
 * Uso:
 *   npx tsx scripts/upload-media-library.ts /caminho/para/pasta/envato-downloads
 * 
 * Estrutura esperada:
 *   envato-downloads/
 *     ├── imagens/
 *     │   ├── nutri/
 *     │   ├── coach/
 *     │   ├── wellness/
 *     │   └── nutra/
 *     ├── videos/
 *     └── audios/
 */

import { createClient } from '@supabase/supabase-js'
import { readdir, stat, readFile } from 'fs/promises'
import { join, extname, basename } from 'path'
import { existsSync } from 'fs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: Variáveis de ambiente do Supabase não configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Mapeamento de extensões para tipos
const MEDIA_TYPES: Record<string, 'image' | 'video' | 'audio'> = {
  // Imagens
  '.jpg': 'image',
  '.jpeg': 'image',
  '.png': 'image',
  '.webp': 'image',
  '.gif': 'image',
  '.svg': 'image',
  // Vídeos
  '.mp4': 'video',
  '.mov': 'video',
  '.avi': 'video',
  '.webm': 'video',
  // Áudios
  '.mp3': 'audio',
  '.wav': 'audio',
  '.m4a': 'audio',
  '.ogg': 'audio',
}

// Mapeamento de áreas baseado no nome da pasta
const AREA_MAP: Record<string, 'nutri' | 'coach' | 'wellness' | 'nutra' | 'all'> = {
  'nutri': 'nutri',
  'coach': 'coach',
  'wellness': 'wellness',
  'nutra': 'nutra',
}

// Extrair tags do nome do arquivo
function extractTags(fileName: string): string[] {
  const name = basename(fileName, extname(fileName)).toLowerCase()
  const tags: string[] = []
  
  // Palavras-chave expandidas para melhor detecção
  const keywords = [
    // Agenda e consulta
    'agenda', 'vazia', 'cheia', 'consulta', 'atendimento', 'marcacao', 'horario',
    // Nutrição
    'nutricionista', 'nutri', 'dieta', 'alimentacao', 'alimentação', 'saude', 'saúde',
    'nutricao', 'nutrição', 'nutricional', 'nutriente',
    // Coach e fitness
    'coach', 'treino', 'exercicio', 'exercício', 'fitness', 'personal', 'trainer',
    'academia', 'gym', 'musculacao', 'musculação', 'corpo', 'transformacao',
    // Wellness
    'wellness', 'bem-estar', 'meditacao', 'meditação', 'yoga', 'mindfulness',
    'relaxamento', 'zen', 'calma', 'paz', 'equilibrio', 'equilíbrio',
    // Plataforma e dashboard
    'dashboard', 'plataforma', 'grafico', 'gráfico', 'resultado', 'analytics',
    'dados', 'metricas', 'métricas', 'estatistica', 'estatística',
    // Pessoas e emoções
    'pessoa', 'feliz', 'satisfeito', 'profissional', 'cliente', 'paciente',
    'mulher', 'homem', 'sorriso', 'alegria', 'sucesso', 'conquista',
    // Alimentos
    'comida', 'saudavel', 'saudável', 'fruta', 'verdura', 'legume', 'salada',
    'refeicao', 'refeição', 'prato', 'alimento',
    // Propósitos específicos
    'hook', 'impacto', 'chamada', 'dor', 'problema', 'frustracao', 'frustração',
    'solucao', 'solução', 'resultado', 'cta', 'acao', 'ação', 'background', 'fundo',
    // Outros
    'consultorio', 'consultório', 'clinica', 'clínica', 'escritorio', 'escritório',
    'natureza', 'verde', 'organico', 'orgânico', 'vida', 'estilo', 'lifestyle',
  ]
  
  keywords.forEach(keyword => {
    if (name.includes(keyword)) {
      tags.push(keyword)
    }
  })
  
  // Remover duplicatas e retornar
  return [...new Set(tags)]
}

// Calcular score de relevância baseado em tags e propósito
function calculateRelevanceScore(fileName: string, tags: string[], purpose: string): number {
  let score = 50 // Base
  
  // Aumentar score se tiver muitas tags relevantes
  if (tags.length >= 3) score += 10
  if (tags.length >= 5) score += 10
  
  // Aumentar score se propósito for específico (não 'all')
  if (purpose !== 'all') score += 15
  
  // Aumentar score para imagens de alta prioridade
  const highPriorityKeywords = ['agenda', 'vazia', 'nutricionista', 'dashboard', 'plataforma']
  const hasHighPriority = highPriorityKeywords.some(keyword => 
    fileName.toLowerCase().includes(keyword)
  )
  if (hasHighPriority) score += 10
  
  // Limitar entre 30 e 90
  return Math.min(90, Math.max(30, score))
}

// Detectar propósito baseado no nome/tags
function detectPurpose(fileName: string, tags: string[]): string {
  const name = fileName.toLowerCase()
  
  // Hook - Imagens de impacto/chamada
  if (name.includes('hook') || name.includes('chamada') || name.includes('impacto') || 
      name.includes('chocante') || name.includes('surpreendente')) {
    return 'hook'
  }
  
  // Dor - Problemas/frustrações
  if (name.includes('dor') || name.includes('problema') || name.includes('frustracao') || 
      name.includes('frustração') || name.includes('dificuldade') || name.includes('vazia') ||
      name.includes('vazio') || name.includes('falta') || name.includes('sem')) {
    return 'dor'
  }
  
  // Solução - Resultados/sucessos
  if (name.includes('solucao') || name.includes('solução') || name.includes('resultado') || 
      name.includes('sucesso') || name.includes('conquista') || name.includes('cheia') ||
      name.includes('cheio') || name.includes('feliz') || name.includes('satisfeito')) {
    return 'solucao'
  }
  
  // CTA - Chamadas para ação
  if (name.includes('cta') || name.includes('acao') || name.includes('ação') || 
      name.includes('botao') || name.includes('botão') || name.includes('clique')) {
    return 'cta'
  }
  
  // Background - Fundos
  if (name.includes('background') || name.includes('fundo') || name.includes('bg') ||
      name.includes('textura') || name.includes('padrao') || name.includes('padrão')) {
    return 'background'
  }
  
  // B-roll (para vídeos)
  if (name.includes('b-roll') || name.includes('broll') || name.includes('suporte')) {
    return 'b-roll'
  }
  
  return 'all'
}

async function uploadFile(filePath: string, area: string, mediaType: 'image' | 'video' | 'audio') {
  try {
    const fileName = basename(filePath)
    const ext = extname(fileName)
    const fileStats = await stat(filePath)
    const fileBuffer = await readFile(filePath)
    
    // Criar caminho no storage: media-library/{area}/{type}/{fileName}
    const storagePath = `media-library/${area}/${mediaType}/${fileName}`
    
    // Upload para Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media-library')
      .upload(storagePath, fileBuffer, {
        contentType: getMimeType(ext),
        upsert: true, // Sobrescrever se existir
      })
    
    if (uploadError) {
      console.error(`❌ Erro ao fazer upload de ${fileName}:`, uploadError.message)
      return null
    }
    
    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from('media-library')
      .getPublicUrl(storagePath)
    
    const publicUrl = urlData.publicUrl
    
    // Extrair metadados
    const tags = extractTags(fileName)
    const purpose = detectPurpose(fileName, tags)
    
    // Inserir na tabela media_library
    const { data: dbData, error: dbError } = await supabase
      .from('media_library')
      .insert({
        file_name: fileName,
        file_path: storagePath,
        file_url: publicUrl,
        file_size: fileStats.size,
        mime_type: getMimeType(ext),
        media_type: mediaType,
        area: area,
        purpose: purpose,
        tags: tags,
        title: fileName.replace(ext, '').replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        relevance_score: calculateRelevanceScore(fileName, tags, purpose), // Score inteligente
        source: 'envato',
      })
      .select()
      .single()
    
    if (dbError) {
      console.error(`❌ Erro ao inserir ${fileName} no banco:`, dbError.message)
      return null
    }
    
    return dbData
  } catch (error: any) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message)
    return null
  }
}

function getMimeType(ext: string): string {
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
  }
  return mimeTypes[ext.toLowerCase()] || 'application/octet-stream'
}

async function processDirectory(dirPath: string, area: string, mediaType: 'image' | 'video' | 'audio') {
  if (!existsSync(dirPath)) {
    console.log(`⚠️  Pasta não encontrada: ${dirPath}`)
    return 0
  }
  
  const files = await readdir(dirPath)
  let uploaded = 0
  
  for (const file of files) {
    const filePath = join(dirPath, file)
    const stats = await stat(filePath)
    
    if (stats.isDirectory()) {
      // Processar subdiretório
      uploaded += await processDirectory(filePath, area, mediaType)
    } else {
      const ext = extname(file).toLowerCase()
      if (MEDIA_TYPES[ext] === mediaType) {
        const result = await uploadFile(filePath, area, mediaType)
        if (result) {
          uploaded++
          console.log(`✅ Uploaded: ${file} (${area}/${mediaType})`)
        }
      }
    }
  }
  
  return uploaded
}

async function main() {
  const basePath = process.argv[2]
  
  if (!basePath) {
    console.error('❌ Erro: Forneça o caminho da pasta de downloads')
    console.log('Uso: npx tsx scripts/upload-media-library.ts /caminho/para/envato-downloads')
    process.exit(1)
  }
  
  if (!existsSync(basePath)) {
    console.error(`❌ Erro: Pasta não encontrada: ${basePath}`)
    process.exit(1)
  }
  
  console.log('🚀 Iniciando upload em lote...')
  console.log(`📁 Pasta base: ${basePath}\n`)
  
  let totalUploaded = 0
  
  // Processar cada tipo de mídia
  for (const [typeKey, typeValue] of Object.entries({ image: 'image', video: 'video', audio: 'audio' })) {
    const typePath = join(basePath, typeKey === 'image' ? 'imagens' : typeKey === 'video' ? 'videos' : 'audios')
    
    if (!existsSync(typePath)) {
      console.log(`⚠️  Pasta não encontrada: ${typePath}`)
      continue
    }
    
    console.log(`\n📂 Processando ${typeValue}s...`)
    
    // Processar cada área
    for (const [areaKey, areaValue] of Object.entries(AREA_MAP)) {
      const areaPath = join(typePath, areaKey)
      const uploaded = await processDirectory(areaPath, areaValue, typeValue as 'image' | 'video' | 'audio')
      totalUploaded += uploaded
    }
  }
  
  console.log(`\n✅ Upload concluído! Total: ${totalUploaded} arquivos`)
}

main().catch(console.error)

