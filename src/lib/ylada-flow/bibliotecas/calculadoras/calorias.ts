// =====================================================
// MOLDE — Calculadora de Calorias (Mifflin-St Jeor) no contrato YladaFlow
// =====================================================
//
// Fonte: blueprint-plataforma/Chat5_Calculadoras_Revisao_Formulas.md §3
// FÓRMULA (formulaId 'calorias-mifflin-v1'):
//   TMB (Mifflin-St Jeor): Homem 10·peso + 6,25·altura − 5·idade + 5; Mulher … − 161
//   GET = TMB × fator de atividade (Sed 1,2 · Leve 1,375 · Mod 1,55 · Int 1,725 · M.Int 1,9)
//   Objetivo: perder GET−500 (piso 1200 mulher / 1500 homem) · manter GET · ganhar GET+400
// Inputs (todos entram na conta): idade, sexo, peso, altura, atividade, objetivo.
//
// STATUS: adição pura. Inert até o motor de calculadora ser generalizado (briefing Cursor).
// =====================================================

import type { YladaFlow } from '@/types/ylada-flow'

export const FLUXO_CALCULADORA_CALORIAS: YladaFlow = {
  id: 'calc-calorias',
  handle: 'calorias',
  nome: 'Calculadora de Calorias',
  objetivo: 'A pessoa descobre quantas calorias o corpo dela gasta por dia e o que isso muda no objetivo dela.',
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
    gancho: 'Descubra quantas calorias o seu corpo realmente gasta por dia, pelo seu perfil.',
    baixaFriccao: 'Sem cadastro · 6 perguntas · 1 min · resultado na hora',
    autoridadeSutil: 'Usa a fórmula de Mifflin-St Jeor, a mais precisa pra adulto hoje.',
    ctaUnico: 'Calcular minhas calorias',
    coerenciaOrigem: 'Continua a dica de quem te enviou (serve, não vende).',
  },

  origemEsperada: { canal: 'whatsapp', funil: 'marketing', temperatura: 'morno' },

  perguntas: [
    { id: 'idade', texto: 'Sua idade', tipo: 'numero', placeholder: 'Ex: 30', min: 14, max: 100, step: 1, papel: { alimentaLeitura: ['contexto'] } },
    { id: 'sexo', texto: 'Você é:', tipo: 'multipla_escolha', opcoes: ['Mulher', 'Homem'], papel: { alimentaLeitura: ['contexto'] } },
    { id: 'peso', texto: 'Seu peso (kg)', tipo: 'numero', placeholder: 'Ex: 70.5', min: 30, max: 300, step: 0.1, papel: { alimentaLeitura: ['contexto'] } },
    { id: 'altura', texto: 'Sua altura (cm)', tipo: 'numero', placeholder: 'Ex: 170', min: 100, max: 250, step: 1, papel: { alimentaLeitura: ['contexto'] } },
    {
      id: 'atividade',
      texto: 'Quanto você se movimenta no dia a dia?',
      tipo: 'multipla_escolha',
      opcoes: [
        'Quase não me movimento', // 1.2
        'Caminhadas leves', // 1.375
        'Treino 1 a 3x por semana', // 1.55
        'Treino 4 a 6x por semana', // 1.725
        'Sou atleta / treino pesado', // 1.9
      ],
      papel: { alimentaLeitura: ['contexto'] },
    },
    {
      id: 'objetivo',
      texto: 'Qual é o seu objetivo hoje?',
      tipo: 'multipla_escolha',
      opcoes: ['Perder peso', 'Manter o peso', 'Ganhar massa muscular'], // engine → perder/manter/ganhar
      papel: { alimentaLeitura: ['perfil'] },
    },
  ],

  separacao2080: { regraId: 'servico-sem-prontidao-v1' },

  calculadora: {
    formulaId: 'calorias-mifflin-v1',
    inputs: [
      { id: 'idade', unidade: 'anos', min: 14, max: 100 },
      { id: 'sexo', unidade: '' },
      { id: 'peso', unidade: 'kg', min: 30, max: 300 },
      { id: 'altura', unidade: 'cm', min: 100, max: 250 },
      { id: 'atividade', unidade: 'fator' },
      { id: 'objetivo', unidade: '' },
    ],
    unidadeSaida: 'kcal/dia',
    casasDecimais: 0,
    faixaSegura: { min: 1000, max: 5000 }, // piso de segurança por sexo aplicado na fórmula
    salvaguarda: 'É uma estimativa do seu gasto. Déficit ou ganho mais agressivo pede acompanhamento de um profissional de saúde.',
  },

  devolutiva: {
    porPerfil: {
      pronto: {
        espelho: 'Sua necessidade ficou em torno de {kcal} kcal por dia.',
        causa: 'É a conta do seu corpo com a sua rotina de hoje.',
        primeiroPasso: 'Pra transformar esse número em resultado, vale alinhar com quem te enviou como distribuir.',
        ctaWhatsApp: 'Quero ajuda pra usar esse número',
      },
      curioso: {
        espelho: 'Sua necessidade ficou em torno de {kcal} kcal por dia.',
        causa: 'É a conta do seu corpo com a sua rotina de hoje.',
        primeiroPasso: 'Pra transformar esse número em resultado, vale alinhar com quem te enviou como distribuir.',
        ctaWhatsApp: 'Quero ajuda pra usar esse número',
      },
    },
    porFaixa: [
      {
        id: 'perder',
        rotulo: 'Perder peso',
        quando: 'perder',
        bloco: {
          espelho: 'Pra perder peso com saúde, sua meta fica em torno de {kcal} kcal por dia.',
          causa: 'É um déficit suave, não passar fome. Cortar demais derruba o pique e sabota o resultado.',
          primeiroPasso: 'Vale montar com profissional como distribuir essas calorias pra emagrecer sem sofrimento.',
          ctaWhatsApp: 'Quero um plano pra emagrecer com saúde',
        },
      },
      {
        id: 'manter',
        rotulo: 'Manter o peso',
        quando: 'manter',
        bloco: {
          espelho: 'Pra manter seu peso, sua necessidade é de cerca de {kcal} kcal por dia.',
          causa: 'É o seu ponto de equilíbrio com a rotina atual.',
          primeiroPasso: 'Se quiser mudar composição corporal sem mudar o peso, dá pra ajustar com orientação.',
          ctaWhatsApp: 'Quero melhorar minha composição',
        },
      },
      {
        id: 'ganhar',
        rotulo: 'Ganhar massa',
        quando: 'ganhar',
        bloco: {
          espelho: 'Pra ganhar massa, sua meta fica em torno de {kcal} kcal por dia.',
          causa: 'Construir músculo pede comer um pouco a mais, com proteína e treino de força.',
          primeiroPasso: 'Vale alinhar com profissional o tipo de alimento, não só a quantidade.',
          ctaWhatsApp: 'Quero ganhar massa do jeito certo',
        },
      },
    ],
  },

  ganchosIndicacao: [
    { etapa: 'compartilhar-devolutiva', frase: 'Conhece alguém tentando emagrecer ou ganhar massa no escuro? Manda essa conta.' },
  ],

  handoff: {
    templateId: 'handoff-padrao',
    captacaoDados: false,
    inclui: { resumoRespostas: true, classificacao2080: true, scriptSugerido: true },
    // Dados costurados (peso + objetivo) + resultado + pedido de ajuda.
    prefillWhatsApp:
      'Oi! Fiz a calculadora de calorias ({peso} kg, objetivo: {objetivo}) e deu {kcal} kcal por dia. Queria ajuda pra usar esse número no meu dia a dia. Pode me ajudar?',
  },

  origemBiblioteca: 'biblioteca-calculadoras-servico-v1',
  tags: ['calculadora', 'calorias', 'tdee', 'servico', 'pro-lideres'],
}

export default FLUXO_CALCULADORA_CALORIAS
