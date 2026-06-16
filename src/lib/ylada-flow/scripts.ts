/**
 * WELLNESS SYSTEM - Biblioteca de Scripts
 * 
 * Scripts organizados por tipo para uso nos fluxos
 * Re-exporta os scripts completos da biblioteca oficial
 */

import { Script, TipoScript } from '@/types/wellness-system'
import { 
  scriptsGerais, 
  getAllScripts as getAllScriptsCompleto,
  getScriptsByTipo as getScriptsByTipoCompleto,
  getScriptById as getScriptByIdCompleto
} from './scripts-completo'

// Re-exportar scripts gerais como scripts principais
export const scripts: Record<TipoScript, Script[]> = scriptsGerais

// Manter compatibilidade com código existente
export const scriptsLegacy: Record<TipoScript, Script[]> = {
  abertura: [
    {
      id: 'abertura-1',
      tipo: 'abertura',
      titulo: 'Abertura Curiosa e Leve',
      conteudo: `Olá! 👋

Vi que você tem interesse em [TEMA]. Que tal fazer um teste rápido e gratuito para descobrir qual é o seu perfil?

São só 5 perguntas e leva menos de 2 minutos! 😊`,
      contexto: 'Usar quando enviar o link do fluxo pela primeira vez',
      variacoes: [
        'Versão mais curta: "Olá! Que tal descobrir seu perfil? Teste rápido e gratuito: [LINK]"',
        'Versão mais pessoal: "Oi [NOME]! Vi que você se interessa por [TEMA]. Fiz um teste rápido que pode te ajudar. Quer ver? [LINK]"'
      ]
    },
    {
      id: 'abertura-2',
      tipo: 'abertura',
      titulo: 'Abertura Consultiva',
      conteudo: `Olá! 

Percebi que você pode se beneficiar de algo relacionado a [TEMA]. 

Tenho um diagnóstico rápido que ajuda a identificar seu perfil e te direciona para a melhor solução.

Quer fazer? É gratuito e leva menos de 2 minutos! 🎯`,
      contexto: 'Usar quando já tem algum contexto ou conversa prévia',
      variacoes: []
    }
  ],
  'pos-link': [
    {
      id: 'pos-link-1',
      tipo: 'pos-link',
      titulo: 'Pós-Link Padrão',
      conteudo: `Acabei de te enviar o link! 🔗

É só clicar e responder as perguntas. É bem rápido e você vai descobrir seu perfil.

Me avisa quando terminar que eu te explico o resultado! 😊`,
      contexto: 'Enviar logo após compartilhar o link',
      variacoes: []
    },
    {
      id: 'pos-link-2',
      tipo: 'pos-link',
      titulo: 'Pós-Link com Urgência Leve',
      conteudo: `Link enviado! ⚡

Quanto antes você fizer, mais rápido eu consigo te ajudar com o resultado.

São só 5 perguntas rápidas! 🚀`,
      contexto: 'Usar quando quiser criar um pouco mais de urgência',
      variacoes: []
    }
  ],
  'pos-diagnostico': [
    {
      id: 'pos-diagnostico-1',
      tipo: 'pos-diagnostico',
      titulo: 'Pós-Diagnóstico Padrão',
      conteudo: `Vi que você completou o diagnóstico! 🎉

Seu perfil é: [PERFIL_IDENTIFICADO]

Pessoas com seu perfil geralmente têm excelentes resultados com [SOLUÇÃO].

Quer que eu te explique melhor como funciona? 😊`,
      contexto: 'Enviar quando a pessoa completa o diagnóstico',
      variacoes: []
    },
    {
      id: 'pos-diagnostico-2',
      tipo: 'pos-diagnostico',
      titulo: 'Pós-Diagnóstico com Resultado',
      conteudo: `Parabéns por completar! 🎯

Seu resultado mostra que você tem um perfil [PERFIL_IDENTIFICADO] - isso é muito positivo!

Baseado no seu diagnóstico, a melhor solução para você é [KIT_RECOMENDADO].

Posso te explicar como funciona?`,
      contexto: 'Usar quando quiser ser mais específico sobre o resultado',
      variacoes: []
    }
  ],
  oferta: [
    {
      id: 'oferta-1',
      tipo: 'oferta',
      titulo: 'Oferta Kit de Teste',
      conteudo: `Com base no seu diagnóstico, o ideal para você é o [KIT_RECOMENDADO] - 5 dias.

É um kit de teste perfeito para você sentir a diferença já nos primeiros dias.

Quer que eu te explique como funciona e os valores? 💚`,
      contexto: 'Usar para oferecer o kit de 5 dias',
      variacoes: []
    },
    {
      id: 'oferta-2',
      tipo: 'oferta',
      titulo: 'Oferta Produto Fechado',
      conteudo: `Para você que quer resultados mais consistentes, recomendo o produto fechado.

São [X] doses que duram aproximadamente [TEMPO].

O investimento é [VALOR] e você tem [BENEFÍCIO].

Quer saber mais detalhes?`,
      contexto: 'Usar para oferecer produto fechado',
      variacoes: []
    }
  ],
  fechamento: [
    {
      id: 'fechamento-1',
      tipo: 'fechamento',
      titulo: 'Fechamento Direto',
      conteudo: `Perfeito! 

Vou te passar os dados para pagamento e já envio o [PRODUTO] para você.

Pode ser por [FORMA_PAGAMENTO]? 💰`,
      contexto: 'Usar quando a pessoa já demonstrou interesse',
      variacoes: []
    },
    {
      id: 'fechamento-2',
      tipo: 'fechamento',
      titulo: 'Fechamento com Urgência',
      conteudo: `Ótimo! 

Para garantir que você receba ainda esta semana, preciso do pagamento até [PRAZO].

Pode ser? 🚀`,
      contexto: 'Usar quando quiser criar urgência',
      variacoes: []
    }
  ],
  objecoes: [
    {
      id: 'objecoes-preco',
      tipo: 'objecoes',
      titulo: 'Objeção: Preço',
      conteudo: `Entendo sua preocupação com o investimento! 💰

Mas pensa assim: o kit de 5 dias custa apenas R$ [VALOR], que dá menos de R$ [VALOR_DIA] por dia.

É menos que um café por dia para ter mais energia e disposição.

Vale muito a pena testar! O que acha?`,
      contexto: 'Usar quando pessoa reclama do preço',
      variacoes: []
    },
    {
      id: 'objecoes-duvida',
      tipo: 'objecoes',
      titulo: 'Objeção: Dúvida',
      conteudo: `Entendo sua dúvida! É normal ter questionamentos. 🤔

O que especificamente te deixa em dúvida? Posso esclarecer para você.

Muitas pessoas começam com o kit de teste de 5 dias justamente para experimentar sem compromisso maior.

Faz sentido para você?`,
      contexto: 'Usar quando pessoa tem dúvidas',
      variacoes: []
    },
    {
      id: 'objecoes-tempo',
      tipo: 'objecoes',
      titulo: 'Objeção: Não Tenho Tempo',
      conteudo: `Entendo! A rotina está corrida mesmo. ⏰

Mas a boa notícia é que o [PRODUTO] é super prático - você só mistura na água e bebe.

Não precisa de preparo, não precisa cozinhar, não precisa de nada complicado.

É literalmente 30 segundos do seu dia. Vale a pena testar?`,
      contexto: 'Usar quando pessoa diz que não tem tempo',
      variacoes: []
    }
  ],
  recuperacao: [
    {
      id: 'recuperacao-1',
      tipo: 'recuperacao',
      titulo: 'Recuperação Padrão',
      conteudo: `Oi! Vi que você começou o diagnóstico mas não completou. 😊

Acontece algo? Precisa de ajuda?

Se quiser, posso te enviar o link novamente ou tirar qualquer dúvida!`,
      contexto: 'Enviar para quem começou mas não completou',
      variacoes: []
    },
    {
      id: 'recuperacao-2',
      tipo: 'recuperacao',
      titulo: 'Recuperação com Benefício',
      conteudo: `Olá! 

Lembrei de você! Você começou o diagnóstico mas não completou.

Completar leva menos de 2 minutos e você descobre qual é a melhor solução para o seu caso.

Quer que eu te envie o link novamente? 🎯`,
      contexto: 'Usar para reativar interesse',
      variacoes: []
    }
  ],
  indicacoes: [
    {
      id: 'indicacoes-1',
      tipo: 'indicacoes',
      titulo: 'Pedido de Indicação',
      conteudo: `Olá! 

Você conhece alguém que também poderia se beneficiar do [PRODUTO/SERVIÇO]?

Se indicar e a pessoa comprar, você ganha [BENEFÍCIO]! 🎁

Quer saber mais?`,
      contexto: 'Usar para pedir indicações',
      variacoes: []
    },
    {
      id: 'indicacoes-2',
      tipo: 'indicacoes',
      titulo: 'Agradecimento por Indicação',
      conteudo: `Muito obrigado(a) pela indicação! 🙏

Sua indicação é muito importante para mim.

Vou cuidar bem da pessoa que você indicou! 💚`,
      contexto: 'Enviar quando receber uma indicação',
      variacoes: []
    }
  ],
  'pos-venda': [
    {
      id: 'pos-venda-1',
      tipo: 'pos-venda',
      titulo: 'Pós-Venda - Primeiro Contato',
      conteudo: `Oi! 

Você já recebeu o [PRODUTO]? 

Como está sendo a experiência? Está sentindo alguma diferença? 😊

Se tiver qualquer dúvida, estou aqui!`,
      contexto: 'Enviar alguns dias após a venda',
      variacoes: []
    },
    {
      id: 'pos-venda-2',
      tipo: 'pos-venda',
      titulo: 'Pós-Venda - Acompanhamento',
      conteudo: `Olá! 

Como está indo com o [PRODUTO]? 

Já está no [DIA] de uso. Está gostando? Notou alguma melhoria?

Se precisar de algo, me avisa! 💚`,
      contexto: 'Enviar durante o uso do produto',
      variacoes: []
    }
  ],
  recompra: [
    {
      id: 'recompra-1',
      tipo: 'recompra',
      titulo: 'Recompra - Lembrete',
      conteudo: `Oi! 

Vi que você está no final do seu kit de 5 dias.

Como foi a experiência? Está sentindo os benefícios?

Se quiser continuar, posso te preparar um novo pedido. O que acha? 🚀`,
      contexto: 'Enviar quando o kit está acabando',
      variacoes: []
    },
    {
      id: 'recompra-2',
      tipo: 'recompra',
      titulo: 'Recompra - Oferta Produto Fechado',
      conteudo: `Olá! 

Como você gostou do kit de teste, que tal pegar o produto fechado agora?

Você economiza e tem produto para [TEMPO].

Quer que eu te passe os valores? 💰`,
      contexto: 'Oferecer produto fechado após kit de teste',
      variacoes: []
    }
  ]
}

export function getScriptsByTipo(tipo: TipoScript): Script[] {
  return getScriptsByTipoCompleto(tipo)
}

export function getScriptById(id: string): Script | undefined {
  return getScriptByIdCompleto(id)
}

export function getAllScripts(): Script[] {
  return getAllScriptsCompleto()
}

