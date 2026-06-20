// =====================================================
// MOLDE — "Ganhos e Prosperidade" no contrato YladaFlow
// =====================================================
//
// Fonte da verdade do conteúdo: blueprint-plataforma/Chat5_Fase2_Molde_GanhosProsperidade.md (v3)
// Gate: blueprint-plataforma/Regua_Qualidade_Diagnosticos.md (passou INTEIRO — §8 do molde)
// Contrato: src/types/ylada-flow.ts
//
// O QUE É: o fluxo `quiz-recrut-ganhos-prosperidade` modelado ponta a ponta no
// contrato único, com cada peça afiada pela régua. Vira o MOLDE que os outros 16
// fluxos de recrutamento (2 quizzes + 14 aberturas) copiam — muda copy/outcomes,
// não a planta.
//
// DOIS EIXOS, SEPARADOS (molde §5):
//  - DOR / RISK (p1–p4 invertidas) → arquétipo leve/moderado/urgente → TOM da
//    devolutiva pública (vive nos outcomes empacotados, tabela
//    `ylada_flow_diagnosis_outcomes` por archetype_code — ver migrations/444).
//  - PRONTIDÃO (3 sinais da Aula 2: problema+urgência+abertura) → pronta × ainda-não
//    → qual SCRIPT e quão direto (vive aqui em `devolutiva.porPerfil` e no handoff).
//
// STATUS: adição pura. Nada importa este arquivo ainda — risco zero.
// Ligar SÓ num link de teste (`meta.use_ylada_flow_native: true`), nunca o env global.
// =====================================================

import type { YladaFlow } from '@/types/ylada-flow'

export const FLUXO_GANHOS_PROSPERIDADE: YladaFlow = {
  // --- Identidade ---
  id: 'quiz-recrut-ganhos-prosperidade',
  handle: 'ganhos', // ylada.com/[perfil]/ganhos
  nome: 'Ganhos e Prosperidade',
  objetivo:
    'Quem clica se vê na própria situação de renda e abre conversa com quem enviou o link.',
  tenantId: '<rede da líder>', // resolvido pelo tenant em runtime, não hard-coded
  ownerId: '<líder/membro>',
  idiomaPadrao: 'pt',

  // --- Dimensões (etiquetas) ---
  dimensoes: {
    frente: 'rede', // muitos levando a mesma pergunta
    nicho: 'pro-lideres',
    regiao: 'BR',
    funil: 'marketing', // serve/provoca primeiro, convida depois (molde §2 decisão 1)
    tipo: 'quiz',
    finalidade: 'recrutamento', // o mais sensível — nunca constranger, nunca prometer renda
    governanca: ['nenhuma'], // negócio: sem CFM/ANVISA; guardrails via finalidade
  },

  // --- Abertura (régua §2 — a tela do 1º clique) ---
  abertura: {
    gancho:
      'Você corre o mês todo e, no fim, não sobra o quanto devia. Em 5 perguntas, veja o que está prendendo o seu dinheiro.',
    baixaFriccao: 'Sem cadastro · 5 perguntas · 2 min · resultado na hora',
    autoridadeSutil:
      'Quem te mandou isso acompanha de perto gente que está virando esse jogo.',
    ctaUnico: 'Começar',
    coerenciaOrigem: 'Continua o convite de quem enviou o link (sem prometer renda).',
  },

  // --- Origem esperada (runtime completa com a OrigemContexto real) ---
  origemEsperada: { canal: 'whatsapp', funil: 'marketing', temperatura: 'morno' },

  // --- Perguntas (régua §3 + método Aula 2 — cada uma lê um sinal) ---
  // Mesmos eixos das 5 MCQs atuais, reescritas pra provocar sem constranger.
  // `sinal` liga a pergunta ao método (problema · urgência · abertura).
  // `inverter` herda meta.invert_risk_mcq_score (pior situação → RISK maior).
  perguntas: [
    {
      id: 'p1',
      texto: 'No fim do mês, sobra ou aperta?',
      tipo: 'multipla_escolha',
      opcoes: [
        'Aperta sempre, não chega no fim', // idx0 → +dor
        'Empata, não sobra nada',
        'Sobra um pouco, mas some rápido',
        'Sobra e consigo guardar', // idx3 → -dor
      ],
      // PROBLEMA: ela SENTE a dor financeira?
      papel: { alimentaLeitura: ['dor'], separa2080: { peso: 1, inverter: true, sinal: 'problema' } },
    },
    {
      id: 'p2',
      texto: 'Seu dinheiro vem de uma fonte só ou de mais de uma?',
      tipo: 'multipla_escolha',
      opcoes: [
        'Só de uma', // idx0 → +dor (dependência)
        'Uma fixa e uns extras de vez em quando',
        'Tenho um negócio próprio também',
        'Mais de uma firme, e ainda algo rendendo sozinho',
      ],
      // PROBLEMA (contexto): fragilidade da fonte única — aprofunda a dor.
      papel: {
        alimentaLeitura: ['dor', 'contexto'],
        separa2080: { peso: 1, inverter: true, sinal: 'problema' },
      },
    },
    {
      id: 'p3',
      texto: 'Se você parar de trabalhar um mês, o dinheiro para junto?',
      tipo: 'multipla_escolha',
      opcoes: [
        'Para na hora', // idx0 → +dor
        'Dura pouco, umas semanas',
        'Tenho fôlego de um ou dois meses',
        'Continua entrando mesmo parado',
      ],
      // PROBLEMA: confirma se a dor é sentida na pele (resiliência).
      papel: { alimentaLeitura: ['dor'], separa2080: { peso: 1, inverter: true, sinal: 'problema' } },
    },
    {
      id: 'p4',
      texto: 'Quando você pensa em ganhar mais, o que vem na cabeça?',
      tipo: 'multipla_escolha',
      opcoes: [
        'Que eu já faço o que dá e não muda', // SEM abertura (conformada)
        'Que dava pra mais, mas não sei por onde', // COM abertura (quer caminho)
        'Que tô quase no meu limite de tempo', // COM abertura (toparia algo que caiba)
        'Que tô no caminho que quero', // satisfeita
      ],
      // ABERTURA: ela topa uma solução / acredita que dá pra mudar?
      papel: { alimentaLeitura: ['perfil'], separa2080: { peso: 2, inverter: false, sinal: 'abertura' } },
    },
    {
      id: 'p5',
      texto:
        'Olhando pras próximas semanas, como tá sua cabeça sobre buscar uma renda a mais?',
      tipo: 'multipla_escolha',
      opcoes: [
        'Nem penso nisso, só no dia a dia', // SEM urgência
        'Acho possível, mas ainda não parei pra organizar', // SEM urgência (ainda)
        'Se fizer sentido no meu tempo, quero olhar com calma', // urgência morna
        'Quero um próximo passo claro, mesmo que pequeno, já', // urgência alta
      ],
      // URGÊNCIA: ela quer resolver agora ou só está dando uma olhada?
      papel: { alimentaLeitura: ['momento'], separa2080: { peso: 3, inverter: false, sinal: 'urgencia' } },
    },
  ],

  // --- Separação 20/80 = método da Aula 2 (molde §5) ---
  // PRONTA só se os 3 sinais positivos; faltou um → AINDA NÃO.
  // A regra determinística vive na Biblioteca 20/80 (a implementar: Passo 3 do briefing).
  separacao2080: {
    regraId: 'recrutamento-prontidao-aula2-v1',
  },

  // --- Devolutiva (molde §6) ---
  // Eixo DOR (tom leve/moderado/urgente) = outcomes empacotados (empacotadaId → tabela).
  // Eixo PRONTIDÃO (pronta × ainda-não) = porPerfil aqui (script/CTA).
  devolutiva: {
    empacotadaId: 'quiz-recrut-ganhos-prosperidade', // lookup por flow_id × archetype_code
    porPerfil: {
      // PRONTA (20%) — autoridade / caminho direto (molde §6.2)
      pronto: {
        espelho:
          'Você já sacou que precisa de mais de uma fonte. E quer um próximo passo claro, não mais um "talvez".',
        causa:
          'O que falta não é vontade. É um caminho que caiba na sua rotina sem virar mais um peso.',
        primeiroPasso:
          'O primeiro passo é uma conversa curta com quem te enviou pra montar isso do seu jeito.',
        ctaWhatsApp: 'Chama quem te mandou e diz: "quero começar, por onde eu vou?"',
      },
      // AINDA NÃO (80%) — servir / educar (molde §6.1)
      curioso: {
        espelho:
          'Você ganha, mas o dinheiro escorrega. No fim do mês some e você nem vê pra onde foi.',
        causa:
          'O problema não é falta de esforço. É que quase tudo depende de uma renda só.',
        primeiroPasso:
          'Dá pra começar pequeno, sem largar o que você já faz. Um passo só, no seu tempo.',
        ctaWhatsApp:
          'Fala com quem te mandou isso e pergunta como dar o primeiro passo.',
      },
    },
  },

  // --- Ganchos de indicação (sutis, sempre servindo) ---
  ganchosIndicacao: [
    {
      etapa: 'follow-up',
      frase: 'Conhece alguém que também corre o mês todo e não vê o dinheiro render?',
    },
    {
      etapa: 'compartilhar-devolutiva',
      frase: 'Se fez sentido pra você, manda pra quem você sabe que tá no mesmo aperto.',
    },
  ],

  // --- Handoff ao profissional (molde §7) ---
  handoff: {
    templateId: 'handoff-padrao',
    captacaoDados: false, // padrão Pró-Líderes: NÃO captura/armazena. Líder pode LIGAR (config do owner/tenant).
    inclui: { resumoRespostas: true, classificacao2080: true, scriptSugerido: true },
  },

  // --- Catálogo/curadoria ---
  origemBiblioteca: 'biblioteca-recrutamento-pro-lideres-v1',
  tags: ['recrutamento', 'pro-lideres', 'ganhos', 'prosperidade', 'renda'],
}

export default FLUXO_GANHOS_PROSPERIDADE
