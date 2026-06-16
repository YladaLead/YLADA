// =====================================================
// NOEL - EXTRATOR DE CONTEXTO PARA CRIAÇÃO DE SCRIPTS
// Extrai contexto da mensagem para criar scripts personalizados
// =====================================================

import type { WellnessInteractionContext } from '@/types/wellness-system'

export interface ScriptCreationContext {
  ferramenta?: string // IMC, calculadora, quiz, link
  pessoa_tipo?: string // amigo, cliente, conhecido, pessoas do espaço
  objetivo?: string // emagrecer, energia, saúde, IMC
  incluirLink: boolean
  incluirIndicacao: boolean
  tom: 'servico' | 'venda' | 'neutro'
  linkMencionado?: string
}

/**
 * Extrai contexto da mensagem para criar script personalizado
 */
export function extrairContextoParaScript(
  mensagem: string,
  contexto: WellnessInteractionContext
): ScriptCreationContext {
  const mensagemLower = mensagem.toLowerCase()
  
  // Detectar ferramenta mencionada
  let ferramenta: string | undefined
  if (mensagemLower.match(/imc|índice.*massa|massa.*corporal/i)) {
    ferramenta = 'imc'
  } else if (mensagemLower.match(/calculadora|calc/i)) {
    ferramenta = 'calculadora'
  } else if (mensagemLower.match(/quiz/i)) {
    ferramenta = 'quiz'
  } else if (mensagemLower.match(/link|ferramenta/i)) {
    ferramenta = 'ferramenta'
  } else if (mensagemLower.match(/água|hidratação/i)) {
    ferramenta = 'agua'
  } else if (mensagemLower.match(/proteína|proteina/i)) {
    ferramenta = 'proteina'
  }
  
  // Detectar tipo de pessoa
  let pessoa_tipo: string | undefined
  if (mensagemLower.match(/pessoas.*espaço|espaço|meu espaço|minhas pessoas/i)) {
    pessoa_tipo = 'espaco'
  } else if (mensagemLower.match(/amigo|amiga|amigos/i)) {
    pessoa_tipo = 'amigo'
  } else if (mensagemLower.match(/cliente|clientes/i)) {
    pessoa_tipo = 'cliente'
  } else if (mensagemLower.match(/conhecido|conhecida|conhecidos/i)) {
    pessoa_tipo = 'conhecido'
  } else if (mensagemLower.match(/inscrito|inscrita|inscritos|seguidor|seguidores/i)) {
    pessoa_tipo = 'inscrito'
  }
  
  // Detectar objetivo
  let objetivo: string | undefined
  if (mensagemLower.match(/emagrecer|perder peso|emagrecimento/i)) {
    objetivo = 'emagrecimento'
  } else if (mensagemLower.match(/energia|disposição|disposicao/i)) {
    objetivo = 'energia'
  } else if (mensagemLower.match(/saúde|saude|bem-estar|bem estar/i)) {
    objetivo = 'saude'
  } else if (mensagemLower.match(/imc/i)) {
    objetivo = 'imc'
  }
  
  // Detectar link mencionado
  const linkMatch = mensagem.match(/https?:\/\/[^\s]+|www\.[^\s]+/i)
  const linkMencionado = linkMatch ? linkMatch[0] : undefined
  
  // Para scripts de Wellness, sempre incluir link e indicação
  return {
    ferramenta,
    pessoa_tipo: pessoa_tipo || contexto.pessoa_tipo,
    objetivo: objetivo || contexto.objetivo as string,
    incluirLink: true, // Sempre incluir link para Wellness
    incluirIndicacao: true, // Sempre incluir pedido de indicação
    tom: 'servico', // Sempre tom de serviço para Wellness
    linkMencionado
  }
}

/**
 * Detecta ferramenta mencionada na mensagem
 */
export function detectarFerramentaMencionada(mensagem: string): string | null {
  const mensagemLower = mensagem.toLowerCase()
  
  if (mensagemLower.match(/imc|índice.*massa|massa.*corporal/i)) {
    return 'imc'
  } else if (mensagemLower.match(/calculadora.*água|calculadora.*agua|hidratação|hidratacao/i)) {
    return 'calculadora-agua'
  } else if (mensagemLower.match(/calculadora.*proteína|calculadora.*proteina/i)) {
    return 'calculadora-proteina'
  } else if (mensagemLower.match(/quiz.*energia|quiz.*energético|quiz.*energetico/i)) {
    return 'quiz-energetico'
  } else if (mensagemLower.match(/avaliação.*metabólico|avaliacao.*metabolico|perfil.*metabólico|perfil.*metabolico/i)) {
    return 'avaliacao-perfil-metabolico'
  }
  
  return null
}
