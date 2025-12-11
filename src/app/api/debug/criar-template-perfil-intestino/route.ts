import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * Rota para criar/corrigir template base "perfil-intestino"
 * Uso: POST /api/debug/criar-template-perfil-intestino
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar se já existe e remover se tiver slug/nome diferente
    await supabaseAdmin
      .from('templates_nutrition')
      .delete()
      .or('slug.eq.perfil-intestino,name.ilike.%perfil%intestino%')
      .eq('profession', 'wellness')

    // Inserir template base "perfil-intestino"
    const content = {
      template_type: 'quiz',
      profession: 'wellness',
      questions: [
        {
          id: 1,
          question: 'Como é a frequência das suas evacuações?',
          type: 'multiple_choice',
          options: [
            { id: 'a', label: 'Diariamente, de forma regular' },
            { id: 'b', label: 'A cada 2-3 dias' },
            { id: 'c', label: 'Menos de 3 vezes por semana' },
            { id: 'd', label: 'Muito irregular, varia muito' }
          ]
        },
        {
          id: 2,
          question: 'Você costuma sentir desconforto digestivo após refeições?',
          type: 'multiple_choice',
          options: [
            { id: 'a', label: 'Nunca' },
            { id: 'b', label: 'Raramente' },
            { id: 'c', label: 'Às vezes' },
            { id: 'd', label: 'Frequentemente' },
            { id: 'e', label: 'Sempre' }
          ]
        },
        {
          id: 3,
          question: 'Você sente gases, inchaço ou distensão abdominal?',
          type: 'multiple_choice',
          options: [
            { id: 'a', label: 'Nunca' },
            { id: 'b', label: 'Raramente' },
            { id: 'c', label: 'Às vezes' },
            { id: 'd', label: 'Frequentemente' },
            { id: 'e', label: 'Sempre' }
          ]
        },
        {
          id: 4,
          question: 'Consome alimentos probióticos ou fermentados regularmente?',
          type: 'multiple_choice',
          options: [
            { id: 'a', label: 'Nunca' },
            { id: 'b', label: 'Raramente' },
            { id: 'c', label: 'Às vezes' },
            { id: 'd', label: 'Frequentemente' },
            { id: 'e', label: 'Sempre' }
          ]
        },
        {
          id: 5,
          question: 'Como é sua ingestão de fibras no dia a dia?',
          type: 'multiple_choice',
          options: [
            { id: 'a', label: 'Consumo muitas fibras (frutas, verduras, grãos integrais)' },
            { id: 'b', label: 'Consumo uma quantidade moderada' },
            { id: 'c', label: 'Consumo pouco' },
            { id: 'd', label: 'Quase não consumo fibras' }
          ]
        },
        {
          id: 6,
          question: 'Você sente que absorve bem os nutrientes (sem sintomas de deficiência)?',
          type: 'multiple_choice',
          options: [
            { id: 'a', label: 'Sim, absorvo bem' },
            { id: 'b', label: 'Às vezes sinto que não absorvo bem' },
            { id: 'c', label: 'Não, tenho sinais de deficiências' },
            { id: 'd', label: 'Não sei avaliar' }
          ]
        },
        {
          id: 7,
          question: 'Você tem histórico de uso de antibióticos ou medicamentos que afetam o intestino?',
          type: 'multiple_choice',
          options: [
            { id: 'a', label: 'Nunca usei' },
            { id: 'b', label: 'Usei raramente' },
            { id: 'c', label: 'Usei algumas vezes' },
            { id: 'd', label: 'Uso com frequência' }
          ]
        },
        {
          id: 8,
          question: 'Como é sua hidratação diária?',
          type: 'multiple_choice',
          options: [
            { id: 'a', label: 'Bebo muita água (mais de 2 litros/dia)' },
            { id: 'b', label: 'Bebo uma quantidade adequada (1,5-2 litros/dia)' },
            { id: 'c', label: 'Bebo pouco (menos de 1 litro/dia)' },
            { id: 'd', label: 'Quase não bebo água' }
          ]
        },
        {
          id: 9,
          question: 'Você sente que sua digestão está comprometida ou lenta?',
          type: 'multiple_choice',
          options: [
            { id: 'a', label: 'Não, minha digestão é rápida e eficiente' },
            { id: 'b', label: 'Às vezes sinto que está lenta' },
            { id: 'c', label: 'Sim, frequentemente sinto digestão lenta' },
            { id: 'd', label: 'Sempre sinto que está muito lenta' }
          ]
        },
        {
          id: 10,
          question: 'Você tem sinais de inflamação ou sensibilidade intestinal?',
          type: 'multiple_choice',
          options: [
            { id: 'a', label: 'Não, não tenho esses sinais' },
            { id: 'b', label: 'Às vezes sinto algum desconforto' },
            { id: 'c', label: 'Sim, tenho sinais frequentes' },
            { id: 'd', label: 'Sim, tenho sinais constantes' }
          ]
        }
      ]
    }

    // Verificar se já existe (pode estar com profession diferente)
    const { data: templateExistente } = await supabaseAdmin
      .from('templates_nutrition')
      .select('id, profession')
      .eq('slug', 'perfil-intestino')
      .maybeSingle()

    const templateData = {
      name: 'Qual é seu perfil de intestino?',
      type: 'quiz',
      language: 'pt',
      objective: 'Identificar o tipo de funcionamento intestinal e saúde digestiva',
      title: 'Qual é seu perfil de intestino?',
      description: 'Identifique o tipo de funcionamento intestinal e saúde digestiva',
      profession: 'wellness',
      is_active: true,
      slug: 'perfil-intestino', // ✅ Slug correto e padrão
      content: content
    }

    let template
    let error

    if (templateExistente) {
      // Atualizar existente (pode estar com profession diferente)
      const result = await supabaseAdmin
        .from('templates_nutrition')
        .update(templateData)
        .eq('slug', 'perfil-intestino')
        .select()
        .single()
      template = result.data
      error = result.error
    } else {
      // Inserir novo
      const result = await supabaseAdmin
        .from('templates_nutrition')
        .insert(templateData)
        .select()
        .single()
      template = result.data
      error = result.error
    }

    if (error) {
      return NextResponse.json(
        { 
          sucesso: false,
          erro: error.message,
          detalhes: error
        },
        { status: 500 }
      )
    }

    // Verificar se foi criado corretamente
    const { data: verificacao } = await supabaseAdmin
      .from('templates_nutrition')
      .select('id, name, slug, profession, is_active')
      .eq('slug', 'perfil-intestino')
      .eq('profession', 'wellness')
      .single()

    return NextResponse.json({
      sucesso: true,
      mensagem: 'Template "perfil-intestino" criado/corrigido com sucesso!',
      template: verificacao,
      diagnostico: {
        slug_correto: verificacao?.slug === 'perfil-intestino',
        nome_correto: verificacao?.name === 'Qual é seu perfil de intestino?',
        ativo: verificacao?.is_active === true,
        profession_correta: verificacao?.profession === 'wellness'
      }
    }, { status: 200 })

  } catch (error: any) {
    return NextResponse.json(
      { 
        sucesso: false,
        erro: error.message,
        stack: error.stack 
      },
      { status: 500 }
    )
  }
}
