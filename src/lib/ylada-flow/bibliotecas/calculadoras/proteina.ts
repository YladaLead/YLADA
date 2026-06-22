// =====================================================
// MOLDE — Calculadora de Proteína (g/kg) no contrato YladaFlow
// =====================================================
//
// Fonte: blueprint-plataforma/Chat5_Calculadoras_Revisao_Formulas.md §4
// ⚠️ INPUTS SIMPLIFICADOS (régua "só pergunte o que a fórmula usa"): a calculadora
// antiga pedia idade/sexo/altura, que um cálculo por g/kg NÃO usa. Aqui pede só
// PESO + OBJETIVO. (Sexo não muda g/kg.)
//
// FÓRMULA (formulaId 'proteina-gkg-v1'): gramas = peso × fator por objetivo
//   manter 1,4 · perder 1,8 · ganhar 2,0 (teto de segurança 2,2 g/kg).
//
// STATUS: adição pura. Inert até o motor de calculadora ser generalizado (briefing Cursor).
// =====================================================

import type { YladaFlow } from '@/types/ylada-flow'

export const FLUXO_CALCULADORA_PROTEINA: YladaFlow = {
  id: 'calc-proteina',
  handle: 'proteina',
  nome: 'Calculadora de Proteína',
  objetivo: 'A pessoa descobre quanta proteína por dia o objetivo dela pede e abre conversa com quem enviou.',
  tenantId: '<rede da líder>',
  ownerId: '<líder/membro>',
  idiomaPadrao: 'pt',

  dimensoes: {
    frente: 'rede',
    nicho: 'pro-lideres',
    regiao: 'BR',
    funil: 'marketing',
    tipo: 'calculadora',
    finalidade: 'diagnostico-servico',
    governanca: ['bem-estar'],
  },

  abertura: {
    gancho: 'Descubra em 30 segundos quanta proteína o seu objetivo realmente pede por dia.',
    baixaFriccao: 'Sem cadastro · 2 perguntas · 30 seg · resultado na hora',
    autoridadeSutil: 'Usa as faixas de g por kg recomendadas pela ciência do esporte.',
    ctaUnico: 'Calcular minha proteína',
    coerenciaOrigem: 'Continua a dica de quem te enviou (serve, não vende).',
  },

  origemEsperada: { canal: 'whatsapp', funil: 'marketing', temperatura: 'morno' },

  // Só o que a fórmula usa: peso + objetivo.
  perguntas: [
    { id: 'peso', texto: 'Seu peso (kg)', tipo: 'numero', placeholder: 'Ex: 70.5', min: 30, max: 300, step: 0.1, papel: { alimentaLeitura: ['contexto'] } },
    {
      id: 'objetivo',
      texto: 'Qual é o seu objetivo hoje?',
      tipo: 'multipla_escolha',
      opcoes: ['Manter o peso e a massa', 'Perder peso preservando músculo', 'Ganhar massa muscular'], // engine → manter/perder/ganhar
      papel: { alimentaLeitura: ['perfil'] },
    },
  ],

  separacao2080: { regraId: 'servico-sem-prontidao-v1' },

  calculadora: {
    formulaId: 'proteina-gkg-v1',
    inputs: [
      { id: 'peso', unidade: 'kg', min: 30, max: 300 },
      { id: 'objetivo', unidade: '' },
    ],
    unidadeSaida: 'g/dia',
    sufixoSaida: 'de proteína por dia',
    casasDecimais: 0,
    faixaSegura: { min: 30, max: 300 }, // teto da fórmula = 2,2 g/kg
    salvaguarda: 'É uma meta orientativa. Quem tem doença renal deve falar com o médico antes de aumentar a proteína.',
  },

  devolutiva: {
    porPerfil: {
      pronto: {
        espelho: 'Sua meta de proteína ficou em torno de {gramas} g por dia.',
        causa: 'A maioria das pessoas come bem menos do que precisa, e nem percebe.',
        primeiroPasso: 'Pra encaixar isso na sua comida do dia a dia, vale uma conversa com quem te enviou.',
        ctaWhatsApp: 'Quero ajuda pra bater minha proteína',
      },
      curioso: {
        espelho: 'Sua meta de proteína ficou em torno de {gramas} g por dia.',
        causa: 'A maioria das pessoas come bem menos do que precisa, e nem percebe.',
        primeiroPasso: 'Pra encaixar isso na sua comida do dia a dia, vale uma conversa com quem te enviou.',
        ctaWhatsApp: 'Quero ajuda pra bater minha proteína',
      },
    },
    porFaixa: [
      {
        id: 'manter',
        rotulo: 'Manter',
        quando: 'manter',
        bloco: {
          espelho: 'Pra manter sua massa, a meta é cerca de {gramas} g de proteína por dia.',
          causa: 'Proteína suficiente é o que segura o músculo ao longo dos anos, não só na academia.',
          primeiroPasso: 'Vale ver com profissional como distribuir isso nas refeições, sem complicar.',
          ctaWhatsApp: 'Quero distribuir minha proteína no dia',
        },
      },
      {
        id: 'perder',
        rotulo: 'Perder peso',
        quando: 'perder',
        bloco: {
          espelho: 'Pra emagrecer sem perder músculo, a meta sobe pra cerca de {gramas} g de proteína por dia.',
          causa: 'No déficit, proteína é o que protege a massa magra e segura a fome.',
          primeiroPasso: 'Vale alinhar com profissional como chegar nessa meta comendo de verdade.',
          ctaWhatsApp: 'Quero emagrecer preservando músculo',
        },
      },
      {
        id: 'ganhar',
        rotulo: 'Ganhar massa',
        quando: 'ganhar',
        bloco: {
          espelho: 'Pra ganhar massa, a meta é cerca de {gramas} g de proteína por dia, junto de treino de força.',
          causa: 'Sem proteína suficiente, o treino rende menos do que poderia.',
          primeiroPasso: 'Vale montar com profissional as fontes e os horários que funcionam pra você.',
          ctaWhatsApp: 'Quero ganhar massa do jeito certo',
        },
      },
    ],
  },

  ganchosIndicacao: [
    { etapa: 'compartilhar-devolutiva', frase: 'Conhece alguém que treina mas não sabe quanta proteína comer? Manda essa conta.' },
  ],

  handoff: {
    templateId: 'handoff-padrao',
    captacaoDados: false,
    inclui: { resumoRespostas: true, classificacao2080: true, scriptSugerido: true },
    // Dados costurados na frase (peso + objetivo) + resultado + pedido de ajuda.
    prefillWhatsApp:
      'Oi! Fiz a calculadora de proteína ({peso} kg, objetivo: {objetivo}) e deu {gramas} g de proteína por dia. Queria ajuda pra encaixar isso na rotina sem complicar. Pode me ajudar?',
  },

  origemBiblioteca: 'biblioteca-calculadoras-servico-v1',
  tags: ['calculadora', 'proteina', 'nutricao', 'servico', 'pro-lideres'],
}

export default FLUXO_CALCULADORA_PROTEINA
