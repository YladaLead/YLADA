/**
 * NOEL WELLNESS - Integração HOM (Hora do Mentor)
 * 
 * Fornece informações sobre apresentações de negócio para o NOEL
 */

import { getApresentacaoNegocio } from '@/lib/wellness-system/apresentacao-negocio'

export interface HOMInfo {
  apresentacoes: Array<{
    dia: string
    horario: string
    horarioTexto: string
    linkZoom: string
  }>
  linkApresentacao: string
  script: string
  estrutura: {
    abertura: string
    demonstracao: string[]
    historia: string
    oportunidade: string
    planoSimples: {
      ganho1: string
      ganho2: string
      ganho3: string
    }
    fechamento: string
  }
}

/**
 * Retorna informações completas sobre HOM
 */
export function getHOMInfo(baseUrl: string = 'https://ylada.app'): HOMInfo {
  const apresentacao = getApresentacaoNegocio()
  
  const apresentacoes = [
    {
      dia: 'Segunda-feira',
      horario: '20:00',
      horarioTexto: '8h da noite',
      linkZoom: 'https://us02web.zoom.us/j/83406912762?pwd=leMxo4G4ImVKHGSx5oQ3ff2ldfHTMG.1'
    },
    {
      dia: 'Quarta-feira',
      horario: '09:00',
      horarioTexto: '9h da manhã',
      linkZoom: 'https://us02web.zoom.us/j/88580290270?pwd=pawdvClnfRSS7ccDq7ibRI7iTVfzSx.1'
    }
  ]

  const linkApresentacao = `${baseUrl}/pt/wellness/system/recrutar/apresentacao`

  // Script padrão para enviar
  const script = `Olá! 👋

Tenho uma oportunidade interessante para compartilhar com você!

É sobre o mercado de bebidas funcionais - um mercado que está crescendo muito.

Quer conhecer? É só clicar no link abaixo:

${linkApresentacao}

São apenas alguns minutos e pode mudar sua perspectiva sobre renda! 🚀`

  return {
    apresentacoes,
    linkApresentacao,
    script,
    estrutura: apresentacao.estrutura
  }
}

/**
 * Gera contexto sobre HOM para o NOEL
 */
export function generateHOMContext(baseUrl?: string): string {
  const homInfo = getHOMInfo(baseUrl)
  
  return `📅 HOM - Hora do Mentor (Apresentações de Negócio)

Apresentações agendadas:
- ${homInfo.apresentacoes[0].dia} às ${homInfo.apresentacoes[0].horarioTexto} (Link Zoom: ${homInfo.apresentacoes[0].linkZoom})
- ${homInfo.apresentacoes[1].dia} às ${homInfo.apresentacoes[1].horarioTexto} (Link Zoom: ${homInfo.apresentacoes[1].linkZoom})

Link da apresentação online: ${homInfo.linkApresentacao}

Estrutura da apresentação:
1. Abertura: ${homInfo.estrutura.abertura.substring(0, 100)}...
2. Demonstração de produtos: ${homInfo.estrutura.demonstracao.join(', ')}
3. Histórias de sucesso: ${homInfo.estrutura.historia.substring(0, 100)}...
4. Oportunidade: ${homInfo.estrutura.oportunidade.substring(0, 100)}...
5. Plano simples: ${homInfo.estrutura.planoSimples.ganho1}, ${homInfo.estrutura.planoSimples.ganho2}, ${homInfo.estrutura.planoSimples.ganho3}
6. Fechamento: ${homInfo.estrutura.fechamento.substring(0, 100)}...

Script para enviar:
${homInfo.script}

Quando o usuário perguntar sobre apresentações, recrutamento, HOM, ou quiser convidar alguém para conhecer o negócio, forneça essas informações e o link.`
}

/**
 * Detecta se a mensagem do usuário está relacionada a HOM/apresentações
 */
export function isHOMRelated(message: string): boolean {
  const keywords = [
    'hom',
    'hora do mentor',
    'apresentação',
    'apresentacoes',
    'apresentar negócio',
    'convidar para conhecer',
    'link de apresentação',
    'zoom',
    'segunda-feira',
    'quarta-feira',
    'recrutar',
    'recrutamento',
    'oportunidade de negócio'
  ]
  
  const messageLower = message.toLowerCase()
  return keywords.some(keyword => messageLower.includes(keyword))
}

