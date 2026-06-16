/**
 * WELLNESS SYSTEM - Apresentação de Negócio
 * 
 * Estrutura padrão para apresentações de negócio focadas em bebidas funcionais
 */

export interface ApresentacaoNegocio {
  id: string
  titulo: string
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

export const apresentacaoNegocio: ApresentacaoNegocio = {
  id: 'apresentacao-padrao',
  titulo: 'Apresentação de Negócio - Bebidas Funcionais',
  estrutura: {
    abertura: `O mercado de bebidas funcionais está em crescimento constante no mundo inteiro.

Pessoas buscam cada vez mais soluções práticas para energia, foco, metabolismo e bem-estar.

E o melhor: você pode fazer parte desse mercado de forma simples e duplicável.`,
    demonstracao: [
      'NRG Energia - Para quem precisa de energia estável e foco',
      'Acelera Herbal Concentrate - Para quem quer ativar o metabolismo e reduzir retenção',
      'Turbo Detox - Para desintoxicação e leveza',
      'Hype Drink - Para hidratação inteligente'
    ],
    historia: `Muitas pessoas começaram apenas testando os produtos para si mesmas.

Depois, viram que funcionava e começaram a indicar para amigos e família.

Hoje, essas mesmas pessoas têm uma renda complementar significativa trabalhando com algo que já usam e acreditam.`,
    oportunidade: `A oportunidade é simples:

1. Você usa os produtos (com desconto)
2. Você indica para outras pessoas (gera renda)
3. Você ensina outras pessoas a fazer o mesmo (construção de equipe)

Tudo isso trabalhando pelo celular, sem precisar guardar estoque.`,
    planoSimples: {
      ganho1: 'Consumo - Você usa os produtos com desconto de distribuidor',
      ganho2: 'Vendas - Você indica e ganha comissão em cada venda',
      ganho3: 'Construção - Você ensina outros e ganha sobre a equipe que você forma'
    },
    fechamento: `Se você tem interesse em conhecer melhor como funciona, posso te mostrar o passo a passo.

É simples, prático e você pode começar hoje mesmo.

Quer que eu te explique melhor? 😊`
  }
}

export function getApresentacaoNegocio(): ApresentacaoNegocio {
  return apresentacaoNegocio
}

