/**
 * Biblioteca para gerenciar uploads no Supabase Storage
 */

import { createClient } from '@/lib/supabase-client'

export type BucketType = 'wellness-cursos-pdfs' | 'wellness-cursos-videos' | 'wellness-cursos-thumbnails'

/**
 * Upload de arquivo para o Supabase Storage
 */
export async function uploadFile(
  bucket: BucketType,
  file: File,
  path: string,
  options?: {
    cacheControl?: string
    contentType?: string
  }
) {
  const supabase = createClient()
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: options?.cacheControl || '3600',
      upsert: false,
      contentType: options?.contentType || file.type
    })

  if (error) {
    throw new Error(`Erro ao fazer upload: ${error.message}`)
  }

  // Obter URL pública do arquivo
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return {
    path: data.path,
    url: urlData.publicUrl
  }
}

/**
 * Deletar arquivo do Supabase Storage
 */
export async function deleteFile(bucket: BucketType, path: string) {
  const supabase = createClient()
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])

  if (error) {
    throw new Error(`Erro ao deletar arquivo: ${error.message}`)
  }
}

/**
 * Obter URL pública de um arquivo
 */
export function getPublicUrl(bucket: BucketType, path: string) {
  const supabase = createClient()
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return data.publicUrl
}

/**
 * Validar tipo de arquivo
 */
export function validarTipoArquivo(file: File, tipoEsperado: 'pdf' | 'video' | 'image'): boolean {
  const tiposPermitidos = {
    pdf: ['application/pdf'],
    video: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
    image: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  }

  return tiposPermitidos[tipoEsperado].includes(file.type)
}

/**
 * Validar tamanho de arquivo
 */
export function validarTamanhoArquivo(file: File, tamanhoMaximoMB: number): boolean {
  const tamanhoMaximoBytes = tamanhoMaximoMB * 1024 * 1024
  return file.size <= tamanhoMaximoBytes
}

/**
 * Gerar nome único para arquivo
 */
export function gerarNomeArquivo(originalName: string, prefix?: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 9)
  const extensao = originalName.split('.').pop()
  const nomeBase = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-z0-9]/gi, '-').toLowerCase()
  
  const nomeFinal = prefix 
    ? `${prefix}/${timestamp}-${random}-${nomeBase}.${extensao}`
    : `${timestamp}-${random}-${nomeBase}.${extensao}`
  
  return nomeFinal
}

