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
  
  return `📅 HOM - Herbalife Opportunity Meeting

🚨 DEFINIÇÃO CRÍTICA E PRIORITÁRIA:
HOM = "Herbalife Opportunity Meeting" (Encontro de Apresentação de Negócio do Herbalife)

HOM é a PALAVRA MATRIZ do sistema de recrutamento e duplicação.
É o ENCONTRO OFICIAL de apresentação de negócio do Herbalife.
É onde direcionamos tudo relacionado a recrutamento e duplicação.

⚠️ NUNCA CONFUNDIR - HOM NÃO É:
- "Hora do Mentor" (essa tradução não é usada)
- "Hábito, Oferta e Mensagem"
- "Histórico de Ocorrências de Mix"
- Qualquer outra coisa que não seja "Herbalife Opportunity Meeting"

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

QUANDO O USUÁRIO PERGUNTAR SOBRE HOM OU MENCIONAR HOM:
- SEMPRE explique que HOM = "Herbalife Opportunity Meeting" (Encontro de Apresentação de Negócio do Herbalife)
- Explique que é a PALAVRA MATRIZ do sistema de recrutamento e duplicação
- Explique que é o ENCONTRO OFICIAL onde direcionamos tudo relacionado a recrutamento
- Forneça os horários e links das apresentações
- Ofereça o script para convidar pessoas
- NUNCA use "Hora do Mentor" - essa tradução não é usada
- NUNCA diga que HOM significa "Hábito, Oferta e Mensagem" - isso está ERRADO
- NUNCA diga que HOM significa "Histórico de Ocorrências de Mix" - isso está ERRADO

ESTÍMULOS IMPORTANTES SOBRE HOM:
Quando mencionar HOM, sempre incentive o consultor a:
1. **Trabalhar para colocar pessoas no HOM**: "Cada pessoa que você convida para o HOM é uma oportunidade de transformar vidas. Trabalhe para apresentar o projeto para o máximo de pessoas possível - você está dando a elas a chance de conhecer uma oportunidade real."
2. **Dar oportunidade para as pessoas conhecerem**: "O HOM é onde as pessoas podem ver, ouvir e entender o projeto completo. Mesmo que não gostem, pelo menos tiveram a oportunidade de conhecer. E quem sabe, pode ser a porta de entrada para uma nova vida."
3. **Participar para ganhar conhecimento**: "Cada vez que você participa do HOM, você aprende algo novo. Cada apresentação reforça conceitos, mostra novas formas de abordagem e te dá mais confiança para apresentar o projeto. Participe sempre que puder!"
4. **Entender melhor a cada participação**: "O conhecimento se constrói com repetição. Cada HOM que você assiste, você entende melhor como funciona o plano, como apresentar, como responder objeções. É como uma faculdade de negócio - quanto mais você participa, mais você aprende."

Sempre termine mencionando HOM com um estímulo positivo e prático para ação.`
}

/**
 * Detecta se a mensagem do usuário está relacionada a HOM/apresentações
 */
export function isHOMRelated(message: string): boolean {
  const keywords = [
    'hom',
    'hora do mentor',
    'herbalife opportunity',
    'herbalife opportunity meeting',
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
    'oportunidade de negócio',
    'reunião de apresentação',
    'faculdade de negócio'
  ]
  
  // Padrões para perguntas sobre HOM
  const questionPatterns = [
    /o que é hom/i,
    /o que significa hom/i,
    /o que é hora do mentor/i,
    /o que significa hora do mentor/i,
    /explique hom/i,
    /explique hora do mentor/i,
    /defin.*hom/i,
    /defin.*hora do mentor/i
  ]
  
  const messageLower = message.toLowerCase()
  
  // Verificar palavras-chave
  const hasKeyword = keywords.some(keyword => messageLower.includes(keyword))
  
  // Verificar padrões de pergunta
  const hasQuestionPattern = questionPatterns.some(pattern => pattern.test(message))
  
  return hasKeyword || hasQuestionPattern
}

