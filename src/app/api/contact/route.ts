import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, phone, question } = await request.json()

    // Validar dados obrigatórios
    if (!name || !phone || !question) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Simples: apenas mostrar no console
    console.log('📧 NOVO CONTATO RECEBIDO:')
    console.log('================================')
    console.log('👤 Nome:', name)
    console.log('📱 Telefone:', phone)
    console.log('❓ Dúvida:', question)
    console.log('⏰ Data:', new Date().toLocaleString('pt-BR'))
    console.log('================================')

    // Simular delay de envio
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json(
      { message: 'Mensagem enviada com sucesso!' },
      { status: 200 }
    )

  } catch (error) {
    console.error('❌ Erro ao processar contato:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
