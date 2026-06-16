// =====================================================
// NOEL - CONSTRUTOR DE RESPOSTA
// Constrói a resposta estruturada do NOEL
// =====================================================

import type { WellnessScript, WellnessObjeção, NoelOperationMode, WellnessInteractionContext } from '@/types/ylada-flow-legacy'
import { noelPersona } from '../core/persona'
import { regraFundamentalRecrutamento, validarRegraFundamental } from '../core/rules'
import { validarPersona } from '../core/persona'

/**
 * Estrutura padrão de resposta do NOEL (6 partes)
 */
export interface NoelResponseStructure {
  acolhimento: string // Parte 1: Reconhecer a pessoa
  contexto: string // Parte 2: Entender a situação
  acao_pratica: string // Parte 3: Microação específica
  script_sugerido?: WellnessScript // Parte 4: Script pronto
  reforco_emocional: string // Parte 5: Motivação leve
  proximo_passo: string // Parte 6: Direcionamento claro
}

/**
 * Constrói resposta estruturada do NOEL
 */
export function construirResposta(
  contexto: {
    mensagem_usuario: string
    tipo_interacao: string
    modo_operacao: NoelOperationMode
    script?: WellnessScript | null
    objeção?: WellnessObjeção | null
    resposta_objeção?: string
    contexto: WellnessInteractionContext
    nome_pessoa?: string
  }
): NoelResponseStructure {
  const { mensagem_usuario, tipo_interacao, modo_operacao, script, objeção, resposta_objeção, contexto: ctx, nome_pessoa } = contexto

  // 1. ACOLHIMENTO
  const acolhimento = construirAcolhimento(mensagem_usuario, nome_pessoa, tipo_interacao)

  // 2. CONTEXTO
  const contextoTexto = construirContexto(mensagem_usuario, modo_operacao, objeção)

  // 3. AÇÃO PRÁTICA
  const acao_pratica = construirAcaoPratica(modo_operacao, script, objeção, ctx, mensagem_usuario)

  // 4. SCRIPT SUGERIDO (já vem do contexto)

  // 5. REFORÇO EMOCIONAL
  const reforco_emocional = construirReforcoEmocional(modo_operacao, tipo_interacao)

  // 6. PRÓXIMO PASSO
  const proximo_passo = construirProximoPasso(modo_operacao, script, objeção, ctx)

  return {
    acolhimento,
    contexto: contextoTexto,
    acao_pratica,
    script_sugerido: script || undefined,
    reforco_emocional,
    proximo_passo
  }
}

/**
 * Constrói parte de acolhimento
 */
function construirAcolhimento(
  mensagem: string,
  nome_pessoa?: string,
  tipo_interacao?: string
): string {
  const saudacao = nome_pessoa ? `Oi, ${nome_pessoa}!` : 'Oi!'

  if (tipo_interacao === 'objeção') {
    return `${saudacao} Entendo totalmente sua preocupação.`
  }

  if (mensagem.match(/ajuda|ajudar|preciso/i)) {
    return `${saudacao} Claro, tô aqui pra caminhar com você.`
  }

  return `${saudacao} Tudo bem?`
}

/**
 * Constrói parte de contexto
 */
function construirContexto(
  mensagem: string,
  modo_operacao: NoelOperationMode,
  objeção?: WellnessObjeção | null
): string {
  if (objeção) {
    return `Essa preocupação é super comum, e faz todo sentido.`
  }

  switch (modo_operacao) {
    case 'venda':
      return 'Vamos encontrar a melhor opção pra você.'
    case 'recrutamento':
      return 'Vamos entender o que faz sentido pro seu momento.'
    case 'acompanhamento':
      return 'Vamos manter esse ritmo que tá funcionando.'
    case 'suporte':
      return 'Vamos resolver isso juntos, de forma leve.'
    default:
      return 'Vamos encontrar a melhor forma de te ajudar.'
  }
}

/**
 * Constrói parte de ação prática
 */
function construirAcaoPratica(
  modo_operacao: NoelOperationMode,
  script?: WellnessScript | null,
  objeção?: WellnessObjeção | null,
  contexto?: WellnessInteractionContext,
  mensagemUsuario?: string
): string {
  // Verificar se é pergunta sobre rotina/planejamento (não é objeção)
  const isPerguntaRotina = mensagemUsuario && (
    mensagemUsuario.match(/não sei|o que fazer|o que fazer hoje|rotina|planejamento|começar/i)
  )

  // Se for objeção E não for pergunta de rotina, usar frase de objeção
  if (objeção && objeção.versao_curta && !isPerguntaRotina) {
    return 'Use essa resposta leve que funciona muito bem:'
  }

  // Se for pergunta de rotina, usar frase adequada
  if (isPerguntaRotina) {
    return 'Vou te dar uma orientação prática especializada:'
  }

  if (script) {
    // Se o script é muito genérico, adicionar orientação especializada
    const scriptConteudo = script.conteudo.toLowerCase()
    const isGenerico = scriptConteudo.includes('você não está sozinho') || 
                      scriptConteudo.includes('vamos juntos') ||
                      scriptConteudo.length < 50
    
    if (isGenerico) {
      // Adicionar orientação prática especializada
      return 'Vou te dar uma orientação prática especializada:'
    }
    
    return 'Aqui está o script perfeito pra essa situação:'
  }

  switch (modo_operacao) {
    case 'venda':
      return 'Vamos fazer uma proposta leve e sem pressão:'
    case 'recrutamento':
      return 'Vamos iniciar uma conversa natural:'
    case 'acompanhamento':
      return 'Vamos fazer um check-in leve:'
    case 'suporte':
      return 'Vamos fazer uma microação simples:'
    default:
      return 'Vamos dar o próximo passo:'
  }
}

/**
 * Constrói parte de reforço emocional
 */
function construirReforcoEmocional(
  modo_operacao: NoelOperationMode,
  tipo_interacao?: string
): string {
  if (tipo_interacao === 'objeção') {
    return 'Tudo aqui é no seu ritmo, sem pressão. ❤️'
  }

  switch (modo_operacao) {
    case 'venda':
      return 'O importante é fazer sentido pra você, não pra mim. 😊'
    case 'recrutamento':
      return 'Você não precisa decidir nada agora. Só vamos conversar. ❤️'
    case 'acompanhamento':
      return 'Constância leve vale mais que intensidade. 🌱'
    case 'suporte':
      return 'Você não está sozinho(a). Vamos juntos. 🙏'
    default:
      return 'Pequenos passos diários viram grandes resultados. ✨'
  }
}

/**
 * Constrói parte de próximo passo
 */
function construirProximoPasso(
  modo_operacao: NoelOperationMode,
  script?: WellnessScript | null,
  objeção?: WellnessObjeção | null,
  contexto?: WellnessInteractionContext
): string {
  if (script) {
    return 'Copie, cole e envie. Depois me conta como foi! 😊'
  }

  if (objeção?.gatilho_retomada) {
    return `Se quiser, posso te enviar ${objeção.gatilho_retomada.toLowerCase()}`
  }

  switch (modo_operacao) {
    case 'venda':
      return 'Se fizer sentido, me avisa e eu te ajudo a fechar. 😊'
    case 'recrutamento':
      return 'Se quiser entender melhor, posso te mostrar como funciona. ❤️'
    case 'acompanhamento':
      return 'Vamos manter esse ritmo. Qualquer coisa, tô aqui! 🌱'
    case 'suporte':
      return 'Me diz como foi e a gente ajusta juntos. 🙏'
    default:
      return 'Me diz o que você precisa e eu te ajudo. ✨'
  }
}

/**
 * Formata resposta completa em texto
 */
export function formatarRespostaCompleta(
  estrutura: NoelResponseStructure,
  incluirScript: boolean = true,
  mensagemUsuario?: string,
  perfilConsultor?: any
): string {
  const partes: string[] = []

  // Parte 1: Acolhimento
  partes.push(estrutura.acolhimento)

  // Parte 2: Contexto
  if (estrutura.contexto) {
    partes.push(estrutura.contexto)
  }

  // Parte 3: Ação prática
  partes.push(estrutura.acao_pratica)

  // Verificar se precisa adicionar orientação especializada
  const precisaOrientacaoEspecializada = mensagemUsuario && (
    mensagemUsuario.match(/não sei|o que fazer|o que fazer hoje|rotina|planejamento|começar/i) ||
    (estrutura.script_sugerido && (
      estrutura.script_sugerido.conteudo.toLowerCase().includes('você não está sozinho') ||
      estrutura.script_sugerido.conteudo.toLowerCase().includes('vamos juntos') ||
      estrutura.script_sugerido.conteudo.length < 100
    ))
  )

  // Adicionar orientação especializada se necessário
  if (precisaOrientacaoEspecializada && mensagemUsuario) {
    const orientacao = gerarOrientacaoEspecializada(mensagemUsuario, estrutura.script_sugerido, perfilConsultor)
    if (orientacao) {
      partes.push('')
      partes.push('🎯 Orientação Especializada:')
      partes.push(orientacao)
    }
  }

  // Parte 4: Script sugerido
  if (incluirScript && estrutura.script_sugerido) {
    partes.push('')
    partes.push('💬 Script:')
    partes.push(estrutura.script_sugerido.conteudo)
    
    // 🚀 NOVO: Adicionar dica proativa sobre pedir indicações
    partes.push('')
    partes.push('💡 Dica: Não esqueça de pedir indicações também para seus inscritos que já têm indicações! Eles podem conhecer outras pessoas interessadas. Sempre peça de forma natural após enviar o link.')
  }

  // Parte 5: Reforço emocional
  partes.push('')
  partes.push(estrutura.reforco_emocional)

  // Parte 6: Próximo passo
  partes.push('')
  partes.push(estrutura.proximo_passo)

  return partes.join('\n')
}

/**
 * Gera orientação especializada baseada na pergunta do usuário e perfil do consultor
 */
export function gerarOrientacaoEspecializada(
  mensagem: string,
  script?: WellnessScript | null,
  perfilConsultor?: any
): string | null {
  const lowerMsg = mensagem.toLowerCase()

  // Extrair dados do perfil
  const objetivoPrincipal = perfilConsultor?.objetivo_principal
  const metaPV = perfilConsultor?.meta_pv
  const metaFinanceira = perfilConsultor?.meta_financeira
  const tempoDisponivel = perfilConsultor?.tempo_disponivel
  const canalPrincipal = perfilConsultor?.canal_principal || perfilConsultor?.canal_preferido?.[0] || 'whatsapp'
  const contatosWhatsApp = perfilConsultor?.contatos_whatsapp
  const experiencia = perfilConsultor?.experiencia_herbalife || perfilConsultor?.experiencia_vendas

  // Pergunta sobre rotina/planejamento diário
  if (lowerMsg.match(/não sei|o que fazer|o que fazer hoje|rotina|planejamento|começar/i)) {
    // Adaptar tempo baseado no perfil
    let tempoTotal = '20 minutos'
    let tempoLista = '5 min'
    let tempoDivulgacao = '10 min'
    let tempoFollowup = '5 min'
    let quantidadeContatos = 10
    let quantidadeEnviar = 3

    if (tempoDisponivel === '15_minutos' || tempoDisponivel === 'pouco') {
      tempoTotal = '15 minutos'
      tempoLista = '3 min'
      tempoDivulgacao = '10 min'
      tempoFollowup = '2 min'
      quantidadeContatos = 5
      quantidadeEnviar = 2
    } else if (tempoDisponivel === '1_hora' || tempoDisponivel === 'muito') {
      tempoTotal = '30 minutos'
      tempoLista = '10 min'
      tempoDivulgacao = '15 min'
      tempoFollowup = '5 min'
      quantidadeContatos = 20
      quantidadeEnviar = 5
    }

    // Adaptar canal baseado no perfil
    let acaoDivulgacao = ''
    if (canalPrincipal === 'instagram' || canalPrincipal?.includes('instagram')) {
      acaoDivulgacao = `- Escolha 1 produto (Energia, Acelera ou Turbo Detox)
   - Faça um story no Instagram mostrando o produto
   - Marque ${quantidadeEnviar} pessoas próximas que podem se interessar
   - Use uma legenda simples: "Testei esse produto e amei! Quem quer saber mais?"`
    } else {
      acaoDivulgacao = `- Escolha 1 produto (Energia, Acelera ou Turbo Detox)
   - Envie o link do produto para ${quantidadeEnviar} pessoas da sua lista
   - Use um texto simples: "Oi [nome]! Vi esse produto e lembrei de você. Quer ver?"`
    }

    // Adaptar baseado no objetivo
    let focoObjetivo = ''
    if (objetivoPrincipal === 'vender_mais' || objetivoPrincipal === 'vender') {
      focoObjetivo = '\n**Foco:** Vamos gerar vendas hoje mesmo. Se alguém demonstrar interesse, já faça a proposta do kit R$39,90.'
    } else if (objetivoPrincipal === 'construir_carteira' || objetivoPrincipal === 'carteira') {
      focoObjetivo = '\n**Foco:** Vamos construir sua base de clientes. O importante é criar conexões, não apenas vender.'
    } else if (objetivoPrincipal === 'melhorar_rotina' || objetivoPrincipal === 'rotina') {
      focoObjetivo = '\n**Foco:** Vamos criar uma rotina leve e sustentável. Pequenos passos diários valem mais que grandes ações esporádicas.'
    }

    // Adaptar baseado na experiência
    let dicaExperiencia = ''
    if (experiencia === 'nunca_vendeu' || experiencia === 'iniciante') {
      dicaExperiencia = '\n💡 **Dica:** Como você está começando, não se preocupe em ser perfeito. O importante é começar e aprender no caminho.'
    } else if (experiencia === 'ja_vendeu' || experiencia === 'intermediario') {
      dicaExperiencia = '\n💡 **Dica:** Você já tem experiência, então pode acelerar um pouco. Foque em reativar contatos antigos também.'
    }

    return `Aqui está um plano prático para HOJE (adaptado ao seu perfil):

1. **Lista de Contatos (${tempoLista})**
   - Pegue sua agenda/${canalPrincipal === 'instagram' ? 'Instagram' : 'WhatsApp'}
   - Liste ${quantidadeContatos} pessoas próximas que você já conhece
   - Não precisa pensar muito, só anotar nomes${contatosWhatsApp ? ` (você tem ${contatosWhatsApp} contatos no WhatsApp)` : ''}

2. **Ação de Divulgação (${tempoDivulgacao})**
   ${acaoDivulgacao}${focoObjetivo}

3. **Follow-up (${tempoFollowup})**
   - Responda quem te chamar
   - Se alguém perguntar, explique de forma leve
   - Não force, só responda dúvidas${metaPV ? `\n   - Lembre-se: sua meta é ${metaPV} PV este mês` : ''}${metaFinanceira ? `\n   - Meta financeira: R$ ${metaFinanceira.toLocaleString('pt-BR')}` : ''}

**Total: ${tempoTotal} hoje**${dicaExperiencia}

Isso já te coloca em movimento. Amanhã a gente ajusta conforme o que acontecer.`
  }

  // Pergunta sobre vendas
  if (lowerMsg.match(/vender|vendas|como vender|começar a vender/i)) {
    // Adaptar meta baseada no perfil
    let metaVenda = '1 venda esta semana'
    if (metaPV) {
      // Calcular quantas vendas precisa para atingir meta
      // Assumindo que cada venda média é ~100 PV
      const vendasNecessarias = Math.ceil(metaPV / 100)
      metaVenda = `${vendasNecessarias} vendas este mês (para atingir ${metaPV} PV)`
    }

    // Adaptar canal
    let estrategiaCanal = ''
    if (canalPrincipal === 'instagram' || canalPrincipal?.includes('instagram')) {
      estrategiaCanal = `3. **Use Instagram Stories** (mais visual)
   - Mostre o produto em uso
   - Marque pessoas que podem se interessar
   - Use link na bio ou DM para quem perguntar`
    } else {
      estrategiaCanal = `3. **Use o link direto** (mais prático)
   - Envie o link do produto
   - Deixe a pessoa ver e decidir
   - Você só responde dúvidas`
    }

    return `Estratégia prática para começar a vender${objetivoPrincipal ? ` (seu objetivo: ${objetivoPrincipal.replace('_', ' ')})` : ''}:

1. **Comece com pessoas próximas** (mais fácil)
   - Família, amigos, colegas de trabalho
   - Pessoas que já confiam em você${contatosWhatsApp ? `\n   - Você tem ${contatosWhatsApp} contatos no WhatsApp para começar` : ''}

2. **Foque em 1 produto** (não tente vender tudo)
   - Escolha: Energia, Acelera ou Turbo Detox
   - Aprenda sobre esse produto específico

${estrategiaCanal}

4. **Comece com kit R$39,90** (mais fácil de vender)
   - Valor baixo = menos objeção
   - Mais pessoas podem comprar
   - Depois você oferece upgrade${metaFinanceira ? `\n   - Cada venda te aproxima da sua meta de R$ ${metaFinanceira.toLocaleString('pt-BR')}` : ''}

**Meta inicial: ${metaVenda}**

Não precisa ser perfeito, só precisa começar.${experiencia === 'nunca_vendeu' ? '\n\n💡 **Dica:** Como você está começando, comece devagar. A primeira venda é a mais difícil, depois fica mais fácil.' : ''}`
  }

  // Pergunta sobre recrutamento
  if (lowerMsg.match(/recrutar|equipe|duplicação|como recrutar/i)) {
    return `Estratégia para recrutar:

1. **Identifique pessoas certas**
   - Que já compram produtos similares
   - Que estão insatisfeitas com trabalho atual
   - Que gostam de ajudar outras pessoas

2. **Abordagem leve**
   - Não fale de "negócio" logo de cara
   - Fale sobre "oportunidade de ganhar uma renda extra"
   - Mostre como você está ganhando

3. **Mostre o sistema**
   - Convide para ver como funciona
   - Deixe a pessoa experimentar
   - Não force, só apresente

4. **Acompanhe**
   - Mantenha contato sem pressão
   - Responda dúvidas
   - Deixe a pessoa decidir no tempo dela

**Meta inicial: 1 conversa esta semana**

Recrutamento é sobre conexão, não sobre vender.`
  }

  return null
}

/**
 * Valida resposta antes de enviar
 */
export function validarResposta(resposta: string, contexto: WellnessInteractionContext): {
  valido: boolean
  problemas?: string[]
} {
  const problemas: string[] = []

  // Validar persona
  const validacaoPersona = validarPersona(resposta)
  if (!validacaoPersona.valido && validacaoPersona.problemas) {
    problemas.push(...validacaoPersona.problemas)
  }

  // Validar regra fundamental (recrutamento)
  if (contexto.prospect_id) {
    const validacaoRegra = validarRegraFundamental(resposta, {
      tipo: 'recrutamento',
      etapa: 'semente',
      prospect_novo: true
    })
    if (!validacaoRegra.valido && validacaoRegra.violacao) {
      problemas.push(validacaoRegra.violacao)
    }
  }

  return {
    valido: problemas.length === 0,
    problemas: problemas.length > 0 ? problemas : undefined
  }
}


