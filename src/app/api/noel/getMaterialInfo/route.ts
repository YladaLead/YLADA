/**
 * POST /api/noel/getMaterialInfo
 * 
 * Busca material da biblioteca Wellness por nome, tags ou link_atalho
 * Usado pelo NOEL para entregar links de materiais quando perguntado
 */

import { NextRequest, NextResponse } from 'next/server'
import { validateNoelFunctionAuth } from '@/lib/noel-assistant-handler'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Autenticação especial para NOEL
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const isValid = await validateNoelFunctionAuth(token)
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { busca, link_atalho, tipo, categoria } = body

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ylada.app'

    // Se forneceu link_atalho, buscar diretamente
    if (link_atalho) {
      const { data: material, error } = await supabaseAdmin
        .from('wellness_materiais')
        .select('*')
        .eq('link_atalho', link_atalho)
        .eq('ativo', true)
        .maybeSingle()

      if (error || !material) {
        return NextResponse.json({
          success: false,
          data: null,
          message: 'Material não encontrado'
        })
      }

      return NextResponse.json({
        success: true,
        data: {
          ...material,
          link_atalho_completo: `${baseUrl}/m/${material.link_atalho}`,
          link_direto: material.url
        }
      })
    }

    // Buscar por texto (título, descrição, tags)
    let query = supabaseAdmin
      .from('wellness_materiais')
      .select('*')
      .eq('ativo', true)

    if (busca) {
      // Busca por título ou descrição (case insensitive)
      query = query.or(`titulo.ilike.%${busca}%,descricao.ilike.%${busca}%`)
      
      // Também buscar em tags
      const { data: porTags } = await supabaseAdmin
        .from('wellness_materiais')
        .select('*')
        .eq('ativo', true)
        .contains('tags', [busca.toLowerCase()])
      
      if (porTags && porTags.length > 0) {
        const { data: porTexto } = await query
        const todosIds = new Set([
          ...(porTexto || []).map((m: any) => m.id),
          ...porTags.map((m: any) => m.id)
        ])
        
        const { data: todos } = await supabaseAdmin
          .from('wellness_materiais')
          .select('*')
          .in('id', Array.from(todosIds))
          .eq('ativo', true)
          .limit(10)

        return NextResponse.json({
          success: true,
          data: (todos || []).map((m: any) => ({
            ...m,
            link_atalho_completo: m.link_atalho ? `${baseUrl}/m/${m.link_atalho}` : null,
            link_direto: m.url
          }))
        })
      }
    }

    if (tipo) {
      query = query.eq('tipo', tipo)
    }

    if (categoria) {
      query = query.eq('categoria', categoria)
    }

    const { data: materiais, error } = await query
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('❌ Erro ao buscar materiais:', error)
      return NextResponse.json({
        success: false,
        data: [],
        error: error.message
      })
    }

    return NextResponse.json({
      success: true,
      data: (materiais || []).map((m: any) => ({
        ...m,
        link_atalho_completo: m.link_atalho ? `${baseUrl}/m/${m.link_atalho}` : null,
        link_direto: m.url
      }))
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar material:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
