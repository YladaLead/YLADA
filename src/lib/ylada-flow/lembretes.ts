// Sistema de Lembretes Contextuais do Wellness System
// Gera lembretes baseados nas ações do distribuidor

export type TipoAcao = 
  | 'gerou_link'
  | 'visualizou_fluxo'
  | 'copiou_script'
  | 'enviou_link'
  | 'visualizou_apresentacao'
  | 'acessou_ferramentas'
  | 'visualizou_diagnosticos'
  | 'configurou_perfil'

export interface Acao {
  tipo: TipoAcao
  descricao: string
  metadata?: Record<string, any>
  pagina?: string
  rota?: string
}

export interface Lembrete {
  id: string
  titulo: string
  mensagem: string
  tipo: 'info' | 'success' | 'warning' | 'action'
  acao?: {
    texto: string
    rota: string
  }
  prioridade: 'baixa' | 'media' | 'alta'
}

// Configuração de lembretes baseados em ações
export const configuracaoLembretes: Record<TipoAcao, {
  proximosPassos: Lembrete[]
  tempoParaLembrete?: number // em horas
}> = {
  gerou_link: {
    proximosPassos: [
      {
        id: 'enviar-link-gerado',
        titulo: '📤 Envie o link gerado',
        mensagem: 'Você gerou um link personalizado. Que tal enviar para alguém agora?',
        tipo: 'action',
        acao: {
          texto: 'Ver Links Gerados',
          rota: '/pt/wellness/system/ferramentas/gerador-link'
        },
        prioridade: 'alta'
      }
    ],
    tempoParaLembrete: 2 // 2 horas depois
  },
  visualizou_fluxo: {
    proximosPassos: [
      {
        id: 'usar-fluxo-visualizado',
        titulo: '🎯 Use o fluxo que você visualizou',
        mensagem: 'Você visualizou um fluxo. Que tal gerar um link e começar a usar?',
        tipo: 'action',
        acao: {
          texto: 'Gerar Link',
          rota: '/pt/wellness/system/ferramentas/gerador-link'
        },
        prioridade: 'media'
      }
    ],
    tempoParaLembrete: 24 // 24 horas depois
  },
  copiou_script: {
    proximosPassos: [
      {
        id: 'usar-script-copiado',
        titulo: '💬 Use o script que você copiou',
        mensagem: 'Você copiou um script. Não esqueça de usar na sua próxima conversa!',
        tipo: 'info',
        prioridade: 'baixa'
      }
    ],
    tempoParaLembrete: 1 // 1 hora depois
  },
  enviou_link: {
    proximosPassos: [
      {
        id: 'fazer-follow-up',
        titulo: '⏰ Faça follow-up',
        mensagem: 'Você enviou um link. Lembre-se de fazer follow-up em 2 horas se a pessoa não responder.',
        tipo: 'warning',
        prioridade: 'alta'
      }
    ],
    tempoParaLembrete: 2 // 2 horas depois
  },
  visualizou_apresentacao: {
    proximosPassos: [
      {
        id: 'enviar-link-apresentacao',
        titulo: '📅 Envie o link da apresentação',
        mensagem: 'Você visualizou os links de apresentação. Que tal enviar para alguém?',
        tipo: 'action',
        acao: {
          texto: 'Enviar Link',
          rota: '/pt/wellness/system/recrutar/enviar-link'
        },
        prioridade: 'media'
      }
    ],
    tempoParaLembrete: 4 // 4 horas depois
  },
  acessou_ferramentas: {
    proximosPassos: [
      {
        id: 'usar-ferramentas',
        titulo: '🛠️ Explore as ferramentas',
        mensagem: 'Você acessou as ferramentas. Já gerou seu link personalizado?',
        tipo: 'action',
        acao: {
          texto: 'Gerar Link',
          rota: '/pt/wellness/system/ferramentas/gerador-link'
        },
        prioridade: 'baixa'
      }
    ],
    tempoParaLembrete: 48 // 48 horas depois
  },
  visualizou_diagnosticos: {
    proximosPassos: [
      {
        id: 'analisar-conversoes',
        titulo: '📊 Analise suas conversões',
        mensagem: 'Você visualizou os diagnósticos. Veja o painel de conversões para entender melhor seus resultados.',
        tipo: 'action',
        acao: {
          texto: 'Ver Conversões',
          rota: '/pt/wellness/system/ferramentas/painel-conversoes'
        },
        prioridade: 'media'
      }
    ],
    tempoParaLembrete: 24 // 24 horas depois
  },
  configurou_perfil: {
    proximosPassos: [
      {
        id: 'verificar-perfil-completo',
        titulo: '✅ Perfil configurado!',
        mensagem: 'Ótimo! Agora que seu perfil está configurado, que tal gerar seu primeiro link personalizado?',
        tipo: 'success',
        acao: {
          texto: 'Gerar Link',
          rota: '/pt/wellness/system/ferramentas/gerador-link'
        },
        prioridade: 'alta'
      }
    ],
    tempoParaLembrete: 1 // 1 hora depois
  }
}

// Lembretes gerais (não baseados em ações específicas)
export const lembretesGerais: Lembrete[] = [
  {
    id: 'primeiro-link',
    titulo: '🚀 Gere seu primeiro link',
    mensagem: 'Comece agora! Gere seu primeiro link personalizado e compartilhe com seus contatos.',
    tipo: 'action',
    acao: {
      texto: 'Gerar Link >',
      rota: '/pt/wellness/system/ferramentas/gerador-link'
    },
    prioridade: 'alta'
  },
  {
    id: 'configurar-perfil',
    titulo: '⚙️ Configure seu perfil',
    mensagem: 'Configure seu perfil para personalizar seus links e melhorar sua experiência.',
    tipo: 'info',
    acao: {
      texto: 'Configurar',
      rota: '/pt/wellness/configuracao'
    },
    prioridade: 'media'
  },
  {
    id: 'explorar-fluxos',
    titulo: '📋 Explore os fluxos disponíveis',
    mensagem: 'Conheça todos os fluxos de recrutamento e vendas disponíveis no sistema.',
    tipo: 'info',
    acao: {
      texto: 'Ver Fluxos',
      rota: '/pt/wellness/system/recrutar/fluxos'
    },
    prioridade: 'baixa'
  }
]

// Função para gerar lembretes baseados em ações recentes
export function gerarLembretes(acoes: Acao[]): Lembrete[] {
  const lembretes: Lembrete[] = []
  const acoesProcessadas = new Set<string>()

  // Processar cada ação e gerar lembretes
  for (const acao of acoes) {
    const config = configuracaoLembretes[acao.tipo]
    if (config && !acoesProcessadas.has(acao.tipo)) {
      lembretes.push(...config.proximosPassos)
      acoesProcessadas.add(acao.tipo)
    }
  }

  return lembretes
}

