/**
 * Definições de Functions para LYA - Formulários
 * 
 * Estas functions permitem que a LYA interaja com o sistema de formulários
 * através da OpenAI Assistants API ou Function Calling
 */

export const lyaFormulariosFunctions = [
  {
    name: 'criarFormulario',
    description: 'Cria um novo formulário personalizado baseado em uma descrição em linguagem natural. Use quando o usuário pedir para criar um formulário, anamnese, questionário, etc.',
    parameters: {
      type: 'object',
      properties: {
        descricao_solicitada: {
          type: 'string',
          description: 'Descrição em linguagem natural do que o usuário quer no formulário. Ex: "anamnese básica", "formulário de acompanhamento semanal", "questionário sobre hábitos alimentares"'
        }
      },
      required: ['descricao_solicitada']
    }
  },
  {
    name: 'resumirRespostas',
    description: 'Resume as respostas de um formulário de forma inteligente e útil para a nutricionista. Use quando o usuário pedir para resumir, ver ou analisar respostas de um cliente.',
    parameters: {
      type: 'object',
      properties: {
        response_id: {
          type: 'string',
          description: 'ID específico de uma resposta (opcional)'
        },
        form_id: {
          type: 'string',
          description: 'ID do formulário para resumir a última resposta (opcional)'
        },
        client_id: {
          type: 'string',
          description: 'ID do cliente para resumir sua última resposta (opcional)'
        }
      }
    }
  },
  {
    name: 'identificarPadroes',
    description: 'Identifica padrões e insights nas respostas dos formulários. Use quando o usuário pedir para ver padrões, tendências, problemas comuns, etc.',
    parameters: {
      type: 'object',
      properties: {
        form_id: {
          type: 'string',
          description: 'ID de um formulário específico para analisar (opcional)'
        },
        form_type: {
          type: 'string',
          description: 'Tipo de formulário para analisar: "anamnese", "questionario", "avaliacao", etc (opcional)',
          enum: ['anamnese', 'questionario', 'avaliacao', 'consentimento', 'outro']
        },
        period_days: {
          type: 'number',
          description: 'Período em dias para análise (padrão: 30)',
          default: 30
        }
      }
    }
  }
]

/**
 * Handler para executar as functions da LYA relacionadas a formulários
 */
export async function executeLyaFormulariosFunction(
  functionName: string,
  args: any,
  userId: string
): Promise<any> {
  console.log(`🔧 [LYA] Executando function: ${functionName}`, args)

  try {
    switch (functionName) {
      case 'criarFormulario': {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/nutri/lya/criarFormulario`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            descricao_solicitada: args.descricao_solicitada
          })
        })
        
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Erro ao criar formulário')
        }
        
        return {
          success: true,
          message: data.data.message,
          form_id: data.data.form.id,
          form_name: data.data.form.name
        }
      }

      case 'resumirRespostas': {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/nutri/lya/resumirRespostas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            response_id: args.response_id,
            form_id: args.form_id,
            client_id: args.client_id
          })
        })
        
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Erro ao resumir respostas')
        }
        
        return {
          success: true,
          resumo: data.data.resumo,
          form_name: data.data.form_name,
          client_name: data.data.client_name
        }
      }

      case 'identificarPadroes': {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/nutri/lya/identificarPadroes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            form_id: args.form_id,
            form_type: args.form_type,
            period_days: args.period_days || 30
          })
        })
        
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Erro ao identificar padrões')
        }
        
        return {
          success: true,
          padroes: data.data.padroes,
          estatisticas: data.data.estatisticas
        }
      }

      default:
        throw new Error(`Function desconhecida: ${functionName}`)
    }
  } catch (error: any) {
    console.error(`❌ [LYA] Erro ao executar ${functionName}:`, error)
    return {
      success: false,
      error: error.message || 'Erro ao executar função'
    }
  }
}
