/**
 * GET /m/[slug]
 * 
 * Rota de redirecionamento para links de atalho de materiais
 * Exemplo: /m/bebida-funcional → redireciona para o material real
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  try {
    const slug = params.slug?.join('/') || ''
    
    if (!slug) {
      return NextResponse.redirect(new URL('/pt/wellness/biblioteca', request.url))
    }

    // Buscar material por link_atalho
    const { data: material, error } = await supabaseAdmin
      .from('wellness_materiais')
      .select('url, titulo, ativo')
      .eq('link_atalho', slug)
      .eq('ativo', true)
      .maybeSingle()

    if (error || !material || !material.ativo) {
      // Se não encontrar, redirecionar para biblioteca
      return NextResponse.redirect(new URL('/pt/wellness/biblioteca', request.url))
    }

    // Redirecionar para a URL do material
    return NextResponse.redirect(material.url)
  } catch (error) {
    console.error('❌ Erro ao redirecionar link de atalho:', error)
    return NextResponse.redirect(new URL('/pt/wellness/biblioteca', request.url))
  }
}
