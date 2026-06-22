// =====================================================
// MOLDE — Calculadora de Hidratação (água) no contrato YladaFlow
// =====================================================
//
// Fonte da verdade da mecânica: Spec_Fundacao_Ylada_Grau1.md §12.2 (calculadora assertiva)
// Gate: blueprint-plataforma/Regua_Qualidade_Diagnosticos.md (finalidade = diagnóstico-serviço)
// Contrato: src/types/ylada-flow.ts (tipo === 'calculadora' → usa ConfigCalculadora)
// Passo de código pra ligar o cálculo no render: blueprint-plataforma/Chat5_Fase2_Calculadora_Hidratacao_Briefing.md
//
// POR QUE ESTE MOLDE: a "calculadora de água" de hoje NÃO calcula — ela só joga o
// lead em 3 baldes (baixa/moderada/alta) com texto genérico de wellness
// (`src/lib/diagnostics/wellness/calculadora-agua.ts`), o que a régua reprova.
// Aqui ela vira uma calculadora DE VERDADE: fórmula validada → ml/dia + copos de
// 250 ml, casas decimais certas (corrige o bug `13,00`), faixa segura e salvaguarda.
//
// FÓRMULA (determinística — formulaId 'hidratacao-35ml-kg-v1'):
//   base   = peso_kg × 35 ml                      (necessidade hídrica de adulto, Spec §12.2)
//   + atividade:  Sedentário 0 · Leve +250 · Moderado +500 · Intenso +750 · Muito intenso +1000 (ml)
//   + clima:      Temperado 0 · Quente +300 · Muito quente +600 (ml)
//   total  = clamp(base + atividade + clima, faixaSegura.min, faixaSegura.max)
//   copos  = round(total / 250)
//   Saída: total em ml (0 casas) + sufixo "copos de 250 ml". NUNCA sugerir extremo (faixa segura).
//
// STATUS: adição pura. Nada importa este arquivo ainda — risco zero.
// Ligar SÓ num link de teste (`meta.use_ylada_flow_native: true`), nunca o env global —
// E só depois que o Cursor wirar o cálculo no render (ver Briefing).
// =====================================================

import type { YladaFlow } from '@/types/ylada-flow'

export const FLUXO_CALCULADORA_HIDRATACAO: YladaFlow = {
  // --- Identidade ---
  id: 'calc-hidratacao',
  handle: 'agua', // ylada.com/[perfil]/agua
  nome: 'Calculadora de Hidratação',
  objetivo:
    'A pessoa descobre quanta água o corpo dela pede por dia e abre conversa com quem enviou o link.',
  tenantId: '<rede da líder>', // resolvido pelo tenant em runtime, não hard-coded
  ownerId: '<líder/membro>',
  idiomaPadrao: 'pt',

  // --- Dimensões (etiquetas) ---
  dimensoes: {
    frente: 'rede',
    nicho: 'pro-lideres', // água é neutra/reusável; aqui modelada como o preset Pró-Líderes
    regiao: 'BR',
    funil: 'marketing', // serve primeiro (entrega uma descoberta útil), conversa depois
    tipo: 'calculadora',
    finalidade: 'diagnostico-servico', // servir/educar — puxa salvaguarda, sem oferta
    governanca: ['bem-estar'], // orientativo; não é diagnóstico médico (CFM/ANVISA)
  },

  // --- Abertura (régua §2 — a tela do 1º clique) ---
  abertura: {
    gancho: 'Descubra em 1 minuto quanta água o seu corpo pede por dia.',
    baixaFriccao: 'Sem cadastro · 3 perguntas · 1 min · resultado na hora',
    autoridadeSutil: 'A conta usa o seu peso, a sua rotina e o seu clima, não um número genérico.',
    ctaUnico: 'Calcular',
    coerenciaOrigem: 'Continua a dica de quem te enviou (serve, não vende).',
  },

  // --- Origem esperada ---
  origemEsperada: { canal: 'whatsapp', funil: 'marketing', temperatura: 'morno' },

  // --- Perguntas = os INPUTS da fórmula (régua §3: papel declarado obrigatório) ---
  // Numa calculadora, a pergunta alimenta o cálculo (contexto), não separa 20/80.
  perguntas: [
    {
      id: 'p1',
      texto: 'Seu peso (kg)',
      tipo: 'numero',
      placeholder: 'Ex: 70.5',
      min: 1,
      max: 300,
      step: 0.1,
      // input numérico principal da fórmula
      papel: { alimentaLeitura: ['contexto'] },
    },
    {
      id: 'p2',
      texto: 'Quanto você se movimenta no dia a dia?',
      tipo: 'multipla_escolha',
      opcoes: [
        'Quase não me movimento', // Sedentário → +0
        'Caminhadas leves', // Leve → +250
        'Treino 1 a 3x por semana', // Moderado → +500
        'Treino 4 a 6x por semana', // Intenso → +750
        'Sou atleta / treino pesado', // Muito intenso → +1000
      ],
      papel: { alimentaLeitura: ['contexto'] },
    },
    {
      id: 'p3',
      texto: 'Como é o clima onde você vive?',
      tipo: 'multipla_escolha',
      opcoes: [
        'Mais ameno', // Temperado → +0
        'Quente', // Quente → +300
        'Muito quente', // Muito quente → +600
      ],
      papel: { alimentaLeitura: ['contexto'] },
    },
  ],

  // --- Separação 20/80 ---
  // Calculadora de serviço NÃO classifica prontidão pela resposta (a leitura é o
  // resultado do cálculo, não pronta×curiosa). Mantém o campo (contrato exige),
  // com regra neutra: a prontidão real se lê pela reação ao CTA (engajamento), em runtime.
  separacao2080: {
    regraId: 'servico-sem-prontidao-v1',
  },

  // --- Calculadora assertiva (Spec §12.2) ---
  calculadora: {
    formulaId: 'hidratacao-35ml-kg-v1',
    inputs: [
      { id: 'peso', unidade: 'kg', min: 1, max: 300 },
      { id: 'atividade', unidade: 'nível' }, // 0/250/500/750/1000 ml (ordem das opções de p2)
      { id: 'clima', unidade: 'nível' }, // 0/300/600 ml (ordem das opções de p3)
    ],
    unidadeSaida: 'ml',
    sufixoSaida: 'copos de 250 ml', // corrige o bug 13,00: número inteiro + unidade clara
    casasDecimais: 0,
    faixaSegura: { min: 1500, max: 5000 }, // nunca sugerir extremo (Spec §12.2)
    salvaguarda: 'Cálculo orientativo. Não substitui a avaliação de um profissional de saúde.',
  },

  // --- Devolutiva (a leitura do resultado; régua §4) ---
  // Tokens {resultado_ml} e {resultado_copos} preenchidos em runtime pelo cálculo.
  // Serviço não ramifica por prontidão: as duas chaves carregam a MESMA leitura
  // (o contrato exige pronto+curioso). Quem ramifica de fato é o resultado calculado.
  devolutiva: {
    porPerfil: {
      pronto: {
        espelho:
          'Pelo seu peso e a sua rotina, o seu corpo pede cerca de {resultado_ml} ml por dia, uns {resultado_copos} copos.',
        causa:
          'A maioria das pessoas bebe menos do que precisa sem perceber, porque a sede chega tarde.',
        primeiroPasso:
          'Deixa uma garrafa marcada do seu lado e vai bebendo em goles ao longo do dia, sem esperar a sede.',
        ctaWhatsApp:
          'Quer ajuda pra transformar isso em hábito? Fala com quem te enviou este link.',
      },
      curioso: {
        espelho:
          'Pelo seu peso e a sua rotina, o seu corpo pede cerca de {resultado_ml} ml por dia, uns {resultado_copos} copos.',
        causa:
          'A maioria das pessoas bebe menos do que precisa sem perceber, porque a sede chega tarde.',
        primeiroPasso:
          'Deixa uma garrafa marcada do seu lado e vai bebendo em goles ao longo do dia, sem esperar a sede.',
        ctaWhatsApp:
          'Quer ajuda pra transformar isso em hábito? Fala com quem te enviou este link.',
      },
    },
  },

  // --- Ganchos de indicação (sutis) ---
  ganchosIndicacao: [
    {
      etapa: 'compartilhar-devolutiva',
      frase: 'Conhece alguém que vive esquecendo de beber água? Manda essa conta pra ela.',
    },
  ],

  // --- Handoff ---
  handoff: {
    templateId: 'handoff-padrao',
    captacaoDados: false, // padrão Pró-Líderes: não captura/armazena (config do owner/tenant manda)
    inclui: { resumoRespostas: true, classificacao2080: true, scriptSugerido: true },
    // Dado costurado (peso = {p1}, pois as perguntas da água usam p1/p2/p3) + resultado + pedido de ajuda.
    prefillWhatsApp:
      'Oi! Fiz a calculadora de água ({p1} kg) e a minha meta deu {resultado_litros} por dia ({resultado_copos} copos). Tô achando difícil manter isso na correria. Me ajuda a montar uma rotina que caiba no meu dia?',
  },

  // --- Catálogo/curadoria ---
  origemBiblioteca: 'biblioteca-calculadoras-servico-v1',
  tags: ['calculadora', 'hidratacao', 'agua', 'servico', 'pro-lideres'],
}

export default FLUXO_CALCULADORA_HIDRATACAO
