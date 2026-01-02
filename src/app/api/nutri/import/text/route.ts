import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface ExtractedClient {
  name: string
  email?: string
  phone?: string
  weight?: number
  height?: number
  goal?: string
  notes?: string
  birth_date?: string
  gender?: 'masculino' | 'feminino'
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    
    const { user } = authResult

    const { text } = await request.json()

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Texto é obrigatório' },
        { status: 400 }
      )
    }

    if (text.length > 50000) {
      return NextResponse.json(
        { error: 'Texto muito longo. Por favor, limite a 50.000 caracteres.' },
        { status: 400 }
      )
    }

    // Verificar se OpenAI está configurado
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Serviço de IA não configurado. Por favor, use a importação por Excel.' },
        { status: 503 }
      )
    }

    // Prompt para extrair dados de clientes do texto
    const systemPrompt = `Você é um assistente especializado em extrair dados COMPLETOS de pacientes/clientes de textos livres.

O texto pode conter:
- Anotações soltas sobre pacientes
- Listas de múltiplos pacientes
- Respostas de formulários/questionários de um único paciente
- Dados em formatos variados
- Informações misturadas

REGRA CRÍTICA: Você DEVE extrair TODOS os dados disponíveis no texto. Não deixe campos vazios se a informação estiver presente!

Para cada paciente encontrado, extraia TODOS os campos disponíveis:
- Nome (OBRIGATÓRIO - procure por: "Nome:", "Nome Completo:", "Paciente:", ou no início do texto)
- Email (procure por: "Email:", "E-mail:", "email:", ou padrões como "xxx@xxx.com")
- Telefone (procure por: "Telefone:", "Fone:", "Celular:", "WhatsApp:", ou números com DDD)
- Peso em kg (procure por: "Peso:", "Peso Atual:", "Peso (kg):", valores seguidos de "kg" ou números que parecem peso)
- Altura em cm (procure por: "Altura:", "Altura (cm):", valores seguidos de "cm" ou números que parecem altura)
- Objetivo (procure por: "Objetivo:", "Meta:", "Finalidade:", ou frases que descrevem o que o paciente quer alcançar)
- Observações/Anotações (INCLUA TUDO: histórico de saúde, hábitos alimentares, atividade física, sono, intestino, observações gerais - consolide TODAS as informações relevantes aqui)
- Data de nascimento (procure por: "Data de Nascimento:", "Nascimento:", "Aniversário:", datas no formato DD/MM/YYYY)
- Gênero (procure por: "Gênero:", "Sexo:", palavras como "masculino", "feminino", "M", "F", "homem", "mulher")

IMPORTANTE SOBRE OBSERVAÇÕES:
- Se o texto for um formulário/questionário, consolide TODAS as respostas no campo "notes"
- Inclua: histórico de saúde, hábitos alimentares, atividade física, sono, intestino, medicações, alergias, etc.
- Seja detalhado - quanto mais informações, melhor!

IMPORTANTE SOBRE OBJETIVO:
- Se houver uma seção "OBJETIVO:" ou "Meta:", extraia o texto completo
- Se não houver seção explícita, mas o texto mencionar o que o paciente quer (emagrecer, ganhar massa, melhorar saúde), extraia isso

FORMATO DE SAÍDA:
- Retorne APENAS um JSON válido, sem markdown, sem explicações
- Formato: { "clients": [ { "name": "...", "email": "...", "phone": "...", "weight": 70, "height": 165, "goal": "...", "notes": "...", "birth_date": "1990-03-15", "gender": "feminino" } ] }
- Se não encontrar nenhum paciente, retorne { "clients": [] }
- Se um campo não estiver disponível, omita-o (não coloque null ou vazio)
- Para telefone, normalize para formato brasileiro: (XX) XXXXX-XXXX
- Para peso, use apenas números (ex: 75.5, não "75,5kg" ou "75.5 kg")
- Para altura, use cm (ex: 165, não "1.65m" ou "165 cm")
- Para gênero, use apenas "masculino" ou "feminino"
- Para data, use formato YYYY-MM-DD (ex: "1990-03-15")
- Se o texto for um formulário sem nome explícito, use "Paciente" como nome temporário

EXEMPLO DE EXTRAÇÃO CORRETA:
Se o texto contém "Peso Atual: 75,5 kg" e "Altura: 165 cm" e "Objetivo: Emagrecimento saudável", você DEVE extrair:
{
  "weight": 75.5,
  "height": 165,
  "goal": "Emagrecimento saudável"
}

NÃO deixe campos vazios se a informação estiver no texto!`

    const userPrompt = `Extraia os dados dos pacientes/clientes do seguinte texto. 
Se for um formulário/questionário, trate como um único paciente e consolide todas as informações nas observações:

${text}

Retorne APENAS o JSON no formato especificado, sem explicações adicionais.`

    // Chamar OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Modelo mais barato e eficiente
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3, // Baixa temperatura para respostas mais consistentes
      max_tokens: 2000,
      response_format: { type: 'json_object' } // Forçar JSON
    })

    const responseText = completion.choices[0]?.message?.content || '{"clients": []}'
    
    // Parsear resposta JSON
    let parsedResponse: { clients: ExtractedClient[] }
    try {
      parsedResponse = JSON.parse(responseText)
    } catch (parseError) {
      // Tentar extrair JSON se vier com markdown
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Resposta da IA não está em formato JSON válido')
      }
    }

    // Validar e limpar dados extraídos
    const validatedClients: ExtractedClient[] = []
    
    // Log para debug (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      console.log('📋 Dados extraídos pela IA:', JSON.stringify(parsedResponse.clients, null, 2))
    }
    
    for (const client of parsedResponse.clients || []) {
      // Validar nome (obrigatório) - aceitar "Paciente" como nome temporário
      let clientName = client.name
      if (!clientName || typeof clientName !== 'string' || clientName.trim().length === 0) {
        // Se não tem nome mas tem outras informações, usar "Paciente" como nome temporário
        if (client.email || client.phone || client.notes || client.goal) {
          clientName = 'Paciente'
        } else {
          continue
        }
      }

      const validated: ExtractedClient = {
        name: clientName.trim()
      }

      // Validar e limpar email
      if (client.email) {
        const email = String(client.email).toLowerCase().trim()
        if (isValidEmail(email)) {
          validated.email = email
        }
      }

      // Validar e formatar telefone
      if (client.phone) {
        const phone = cleanPhone(String(client.phone))
        if (phone.length >= 10) {
          validated.phone = formatPhone(phone)
        }
      }

      // Validar peso - aceitar formatos variados (75.5, 75,5, "75.5 kg", etc)
      if (client.weight) {
        let weightValue = client.weight
        if (typeof weightValue === 'string') {
          // Remover "kg", espaços e converter vírgula para ponto
          weightValue = weightValue.replace(/kg/gi, '').replace(/\s/g, '').replace(',', '.')
        }
        const weight = typeof weightValue === 'number' 
          ? weightValue 
          : parseFloat(String(weightValue))
        if (!isNaN(weight) && weight > 0 && weight <= 500) {
          validated.weight = weight
        }
      }

      // Validar altura - aceitar formatos variados (165, "165 cm", "1.65m", etc)
      if (client.height) {
        let heightValue = client.height
        if (typeof heightValue === 'string') {
          // Se tiver "m" ou "metros", converter para cm
          if (heightValue.toLowerCase().includes('m') && !heightValue.toLowerCase().includes('cm')) {
            const meters = parseFloat(heightValue.replace(/m/gi, '').replace(/\s/g, '').replace(',', '.'))
            if (!isNaN(meters)) {
              heightValue = (meters * 100).toString()
            }
          }
          // Remover "cm", espaços e converter vírgula para ponto
          heightValue = heightValue.replace(/cm/gi, '').replace(/\s/g, '').replace(',', '.')
        }
        const height = typeof heightValue === 'number'
          ? heightValue
          : parseFloat(String(heightValue))
        if (!isNaN(height) && height > 0 && height <= 250) {
          validated.height = height
        }
      }

      // Validar objetivo
      if (client.goal && String(client.goal).trim().length > 0) {
        validated.goal = String(client.goal).trim()
      }

      // Validar observações
      if (client.notes && String(client.notes).trim().length > 0) {
        validated.notes = String(client.notes).trim()
      }

      // Validar data de nascimento
      if (client.birth_date) {
        const date = parseDate(String(client.birth_date))
        if (date) {
          validated.birth_date = date
        }
      }

      // Validar gênero
      if (client.gender) {
        const gender = String(client.gender).toLowerCase()
        if (gender === 'masculino' || gender === 'feminino') {
          validated.gender = gender as 'masculino' | 'feminino'
        }
      }

      validatedClients.push(validated)
    }

    return NextResponse.json({
      success: true,
      clients: validatedClients,
      total: validatedClients.length,
      message: `${validatedClients.length} paciente(s) extraído(s) do texto`
    })

  } catch (error: any) {
    console.error('Erro ao processar texto com IA:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Erro ao processar texto com IA',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

function formatPhone(phone: string): string {
  // Formato brasileiro
  if (phone.length === 11) {
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`
  } else if (phone.length === 10) {
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(6)}`
  }
  return phone
}

function parseDate(dateStr: string): string | null {
  try {
    // Tentar diferentes formatos de data
    const formats = [
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // DD/MM/YYYY
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // YYYY-MM-DD
      /^(\d{1,2})-(\d{1,2})-(\d{4})$/, // DD-MM-YYYY
    ]

    for (const format of formats) {
      const match = dateStr.match(format)
      if (match) {
        let day, month, year
        if (format === formats[1]) { // YYYY-MM-DD
          [, year, month, day] = match
        } else { // DD/MM/YYYY ou DD-MM-YYYY
          [, day, month, year] = match
        }
        
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0]
        }
      }
    }

    // Tentar parsing direto
    const date = new Date(dateStr)
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]
    }

    return null
  } catch {
    return null
  }
}










