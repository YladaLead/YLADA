/**
 * Templates por arquitetura do Strong Diagnosis Engine.
 * Slots: {THEME}, {LEVEL}, {BLOCKER}, {PROFILE}, {SCORE}, {NAME}, {DAYS}, etc.
 * RISK_DIAGNOSIS: variação por nível (leve=educativo, moderado=direcionador, alto=firme).
 * @see docs/LINKS-INTELIGENTES-DIAGNOSIS-ENGINE-SPEC.md (Bloco C)
 * @see docs/DIAGNOSTICO-FASE1-MAPEAMENTO.md
 */

import type { DiagnosisArchitecture, BlockerType } from './diagnosis-types'
import type { RiskLevel } from './diagnosis-types'

/** Variação por nível para RISK_DIAGNOSIS (5 blocos: nome, leitura, consequência, direção, CTA). */
export interface RiskLevelVariants {
  explanation: string
  consequence: string
  possibility: string
  cta_imperative: string
}

export const RISK_LEVEL_VARIANTS: Record<RiskLevel, RiskLevelVariants> = {
  baixo: {
    explanation:
      'Com base nas suas respostas, há sinais leves que merecem atenção. Vale organizar para evitar que evoluam.',
    consequence:
      'Se ignorar esses sinais, tendem a se tornar mais frequentes.',
    possibility:
      'Vale uma avaliação orientada para organizar os pontos principais e manter o equilíbrio.',
    cta_imperative: 'Clique para entender melhor seu caso',
  },
  medio: {
    explanation:
      'Com base nas suas respostas, há sinais consistentes de que sua rotina e hábitos podem estar contribuindo para esse quadro.',
    consequence:
      'Se continuar assim, o ciclo tende a se repetir e os desconfortos podem evoluir.',
    possibility:
      'Vale uma avaliação orientada para organizar os pontos principais e evitar que isso evolua.',
    cta_imperative: 'Clique para eu te explicar os próximos passos',
  },
  alto: {
    explanation:
      'Pelos sinais que você relatou, algo está pesando e vale atenção imediata.',
    consequence:
      'Se nada mudar, tende a continuar igual ou piorar. Quanto antes ajustar, melhor.',
    possibility:
      'Vale uma avaliação direcionada para definir o primeiro passo com segurança.',
    cta_imperative: 'Clique para entender qual ajuste faz sentido no seu caso',
  },
}

/** Variantes RISK para contexto estético (pele, skincare). */
export const RISK_LEVEL_VARIANTS_AESTHETICS: Record<RiskLevel, RiskLevelVariants> = {
  baixo: {
    explanation:
      'Com base nas suas respostas, há sinais leves na sua pele que merecem atenção. Vale organizar a rotina de cuidados para evitar que evoluam.',
    consequence:
      'Se ignorar esses sinais, a pele tende a refletir mais o desgaste do dia a dia.',
    possibility:
      'Vale uma avaliação orientada para organizar os cuidados principais e manter o equilíbrio da pele.',
    cta_imperative: 'Clique para entender melhor seu caso',
  },
  medio: {
    explanation:
      'Com base nas suas respostas, sua rotina de cuidados com a pele pode estar contribuindo para o que você está percebendo. Proteção solar, hidratação e consistência fazem diferença.',
    consequence:
      'Se continuar assim, os sinais tendem a se acentuar com o tempo.',
    possibility:
      'Vale uma avaliação orientada para organizar os pontos principais dos cuidados com a pele e evitar que evolua.',
    cta_imperative: 'Clique para eu te explicar os próximos passos',
  },
  alto: {
    explanation:
      'Pelos sinais que você relatou, sua pele está pedindo mais atenção. Proteção solar, hidratação e uma rotina mínima podem fazer diferença significativa.',
    consequence:
      'Se nada mudar, tende a continuar igual ou piorar. Quanto antes ajustar os cuidados, melhor.',
    possibility:
      'Vale uma avaliação direcionada para definir o primeiro passo com segurança nos cuidados com a pele.',
    cta_imperative: 'Clique para entender qual ajuste faz sentido no seu caso',
  },
}

/** Causa provável, preocupações, providências, ações, dica e frase emocional para RISK_DIAGNOSIS em estética. */
export const RISK_VARIANTS_EXTRA_AESTHETICS: Record<
  RiskLevel,
  {
    causa_provavel: string
    preocupacoes: string
    providencias: string
    specific_actions: string[]
    dica_rapida: string
    frase_identificacao: string
  }
> = {
  baixo: {
    causa_provavel: 'A causa provável: sinais leves na pele, quando ignorados, tendem a se acumular. Proteção solar e hidratação são a base.',
    preocupacoes: 'Deixar de organizar a rotina de cuidados agora pode permitir que os sinais evoluam.',
    providencias: 'Organizar um único ponto da rotina (proteção solar ou hidratação) já pode mudar a tendência. Vale conversar com quem entende de pele pra calibrar o próximo passo.',
    specific_actions: [
      'Incluir protetor solar na rotina diária (mesmo em dias nublados).',
      'Definir um horário fixo para hidratar a pele (manhã ou noite).',
      'Converse com {NAME} pra calibrar o próximo passo nos cuidados com a pele.',
    ],
    dica_rapida: 'Proteção solar e hidratação são a base. Pequenos ajustes na rotina já podem mudar a tendência da sua pele.',
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que alguns sinais na pele merecem atenção antes que evoluam.',
  },
  medio: {
    causa_provavel: 'A causa provável: rotina de cuidados irregular e falta de proteção ou hidratação contribuem para o que você está percebendo na pele.',
    preocupacoes: 'Se continuar assim, os sinais tendem a se acentuar. A pele reflete o que fazemos (ou deixamos de fazer) no dia a dia.',
    providencias: 'Ajustar proteção solar e hidratação já pode mudar a tendência. Vale conversar com quem entende de pele pra organizar uma rotina adequada.',
    specific_actions: [
      'Priorizar protetor solar diário e hidratante na rotina.',
      'Definir uma sequência fixa: limpeza → hidratação → proteção.',
      'Converse com {NAME} pra organizar os cuidados com a sua pele.',
    ],
    dica_rapida: 'Rotina irregular costuma ser a base. Proteção solar + hidratação em horários fixos já podem mudar o ritmo da sua pele.',
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que a rotina de cuidados com a pele tem pesado no que você está vendo.',
  },
  alto: {
    causa_provavel: 'A causa provável: pelos sinais relatados, a rotina atual de cuidados tende a ser insuficiente. Proteção solar, hidratação e consistência precisam de atenção.',
    preocupacoes: 'Quanto mais tempo sem ajustar os cuidados, maior a tendência de os sinais evoluírem.',
    providencias: 'Definir o primeiro passo com orientação profissional já pode destravar. Vale conversar com quem entende de pele pra agir com segurança.',
    specific_actions: [
      'Definir o primeiro passo com orientação profissional (avaliação da pele).',
      'Organizar uma rotina mínima: proteção solar + hidratação em horários fixos.',
      'Converse com {NAME} pra agir com segurança nos cuidados com a pele.',
    ],
    dica_rapida: 'Pelos sinais relatados, sua pele está pedindo mais estrutura. Quanto antes definir o primeiro passo com orientação, melhor a tendência de melhora.',
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que sua pele está pedindo mais atenção e cuidados estruturados.',
  },
}

/** Causa provável, preocupações, providências, ações, dica e frase emocional para RISK_DIAGNOSIS. */
export const RISK_VARIANTS_EXTRA: Record<
  RiskLevel,
  {
    causa_provavel: string
    preocupacoes: string
    providencias: string
    specific_actions: string[]
    dica_rapida: string
    frase_identificacao: string
  }
> = {
  baixo: {
    causa_provavel: 'A causa provável: sinais leves, quando ignorados, tendem a se acumular ao longo do tempo.',
    preocupacoes: 'Deixar de organizar agora pode permitir que o quadro evolua.',
    providencias: 'Organizar os pontos principais agora pode evitar que evolua. Vale conversar com quem entende pra ver o próximo passo.',
    specific_actions: [
      'Definir um horário fixo para pelo menos uma refeição por dia.',
      'Anotar 3 pontos da rotina que você quer manter esta semana.',
      'Converse com {NAME} pra calibrar o próximo passo.',
    ],
    dica_rapida: 'Muitas pessoas com sinais leves se beneficiam de pequenos ajustes na rotina. Organizar um único ponto já pode mudar a tendência.',
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que alguns sinais merecem atenção antes que evoluam.',
  },
  medio: {
    causa_provavel: 'A causa provável: rotina e hábitos contribuem para o quadro; o padrão tende a se repetir sem intervenção.',
    preocupacoes: 'Se continuar assim, o ciclo tende a se repetir e os desconfortos podem evoluir.',
    providencias: 'Ajustar alguns pontos da rotina já pode mudar a tendência. Vale conversar com quem entende pra organizar.',
    specific_actions: [
      'Escolher um único ponto da rotina (horário, refeição ou planejamento) pra ajustar.',
      'Planejar 3 refeições na noite anterior pra reduzir o improviso.',
      'Converse com {NAME} pra organizar.',
    ],
    dica_rapida: 'Rotina e hábitos costumam ser a base do problema. Pequenas mudanças em horários ou planejamento já podem mudar o ritmo da semana.',
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que a rotina e os hábitos têm pesado no seu dia a dia.',
  },
  alto: {
    causa_provavel: 'A causa provável: pelos sinais relatados, o padrão atual tende a se manter ou piorar se nada mudar.',
    preocupacoes: 'Quanto mais tempo sem ajuste, maior a tendência de piora.',
    providencias: 'Definir o primeiro passo com orientação já pode destravar. Vale conversar com quem entende pra agir com segurança.',
    specific_actions: [
      'Definir o primeiro passo com orientação profissional.',
      'Organizar uma avaliação pra ver o que ajustar no seu contexto.',
      'Converse com {NAME} pra agir com segurança.',
    ],
    dica_rapida: 'Pelos sinais relatados, algo está pesando. Quanto antes definir o primeiro passo com orientação, melhor a tendência de melhora.',
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que algo está pesando e vale atenção.',
  },
}

export interface ArchitectureTemplates {
  title: string[]
  explanation: string
  /** Fallback: causa provável (não certeza). */
  causa_provavel?: string
  /** Preocupações: pontos de atenção. */
  preocupacoes?: string
  consequence: string
  possibility: string
  cta_helper: string
  cta_button: string[]
  /** CTA imperativo (motor de decisão). Não usar "Quero" / "Quer que". */
  cta_imperative: string
  whatsapp_prefill: string
}

const RISK: ArchitectureTemplates = {
  title: [
    'Seu resultado em {THEME}',
    'O que apareceu em {THEME}',
  ],
  explanation:
    'Pelos sinais que você relatou, algo está pesando em {THEME} e vale atenção.',
  causa_provavel:
    'A causa provável: sinais relatados tendem a evoluir quando não há intervenção orientada.',
  preocupacoes:
    'Deixar sem atenção tende a manter ou piorar o quadro.',
  consequence:
    'Se nada mudar, tende a continuar igual ou piorar.',
  possibility:
    'Vale conversar com quem entende pra ver o próximo passo.',
  cta_helper: 'Quer que eu olhe seu caso e te diga o primeiro passo?',
  cta_button: ['Quero analisar meu caso', 'Quero meu próximo passo'],
  cta_imperative: 'Fale comigo sobre isso',
  whatsapp_prefill:
    'Oi {NAME}, fiz a análise de {THEME} e apareceu risco {LEVEL}. Quero entender o próximo passo pro meu caso.',
}

const BLOCKER: ArchitectureTemplates = {
  title: [
    'Seu resultado em {THEME}',
    'O que apareceu em {THEME}',
  ],
  explanation:
    'Não é falta de vontade. É algo no dia a dia que trava e quebra a constância.',
  consequence:
    'Se continuar assim, o ciclo tende a se repetir.',
  possibility: 'Dá pra ajustar com um passo simples. Vale conversar.',
  cta_helper: 'Quer que eu te diga como ajustar isso no seu caso?',
  cta_button: ['Quero destravar isso', 'Quero ajustar'],
  cta_imperative: 'Fale comigo sobre isso',
  whatsapp_prefill:
    'Oi {NAME}, fiz a análise de {THEME} e o resultado apontou {BLOCKER}. Gostaria de conversar sobre o próximo passo.',
}

/** Variantes por blocker_type: causa, preocupações, providências, ações, dica e frase emocional. */
export const BLOCKER_VARIANTS: Record<
  BlockerType,
  {
    leitura: string
    causa_provavel: string
    preocupacoes: string
    espelho: string
    providencias: string
    specific_actions: string[]
    dica_rapida: string
    frase_identificacao: string
  }
> = {
  rotina: {
    leitura: 'Pelas suas respostas, seu dia a dia está funcionando mais no improviso do que em um padrão organizado.',
    causa_provavel: 'A causa provável está na falta de estrutura: quando decisões são tomadas no momento, a constância tende a ser quebrada.',
    preocupacoes: 'Sem um mínimo de previsibilidade, a frustração pode aumentar e o padrão fica difícil de mudar.',
    espelho: 'Isso não é falta de disciplina. É falta de estrutura.',
    providencias: 'Organizar um único ponto da rotina (horário, refeição ou planejamento) já pode mudar o ritmo da semana. Vale conversar com quem entende pra calibrar o próximo passo.',
    specific_actions: [
      'Definir um horário fixo para o café da manhã.',
      'Planejar 3 refeições na noite anterior.',
      'Converse com {NAME} pra calibrar o próximo passo.',
    ],
    dica_rapida: 'Muitas pessoas com rotina bagunçada se beneficiam de organizar um único ponto: horário, refeição ou planejamento. Pequenas mudanças já podem mudar o ritmo da semana.',
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que manter um padrão organizado no dia a dia tem sido um desafio.',
  },
  emocional: {
    leitura: 'Pelas suas respostas, emoções como ansiedade, cansaço ou recompensa estão pesando nas suas escolhas.',
    causa_provavel: 'A causa provável está nas emoções: quando a comida vira válvula de escape, o plano tende a quebrar nos momentos de maior pressão.',
    preocupacoes: 'Ignorar os gatilhos emocionais pode manter o ciclo de descontrole e arrependimento.',
    espelho: 'Isso não é fraqueza. É falta de estratégias paralelas ao plano.',
    providencias: 'Identificar um gatilho emocional e ter uma alternativa pronta já pode mudar o jogo. Vale conversar com quem entende pra montar um plano que considere isso.',
    specific_actions: [
      'Identificar um gatilho emocional e ter uma alternativa pronta (ex.: caminhar, respirar).',
      'Anotar em que momento do dia a emoção mais pesa.',
      'Converse com {NAME} pra montar um plano que considere isso.',
    ],
    dica_rapida: 'Emoções como ansiedade e cansaço costumam pesar nas escolhas. Ter uma alternativa pronta (caminhar, respirar) já pode mudar o jogo nos momentos de pressão.',
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que emoções como ansiedade ou cansaço têm pesado nas suas escolhas.',
  },
  processo: {
    leitura: 'Pelas suas respostas, falta clareza no passo a passo do que fazer em cada momento.',
    causa_provavel: 'A causa provável está na falta de método: sem um plano mínimo previsível, cada dia vira uma decisão isolada.',
    preocupacoes: 'Improvisar dia a dia tende a gerar cansaço e sensação de estar sempre correndo atrás.',
    espelho: 'Isso não é falta de empenho. É falta de método.',
    providencias: 'Definir um único passo claro para o próximo dia já pode destravar. Vale conversar com quem entende pra estruturar o caminho.',
    specific_actions: [
      'Definir um único passo claro para o próximo dia.',
      'Escrever o que você vai fazer em cada refeição amanhã.',
      'Converse com {NAME} pra estruturar o caminho.',
    ],
    dica_rapida: 'Sem um plano mínimo previsível, cada dia vira uma decisão isolada. Definir um único passo claro para o próximo dia já pode destravar.',
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que falta clareza no passo a passo do que fazer em cada momento.',
  },
  habitos: {
    leitura: 'Pelas suas respostas, a constância está sendo quebrada por pequenos desvios que se acumulam.',
    causa_provavel: 'A causa provável está na falta de âncora: quando não existe um ritual mínimo, qualquer imprevisto vira motivo para sair do plano.',
    preocupacoes: 'Pequenos desvios, quando ignorados, tendem a se acumular e quebrar a adesão.',
    espelho: 'Isso não é falta de força de vontade. É falta de âncora no dia a dia.',
    providencias: 'Criar um ritual curto e repetível já pode sustentar melhor a constância. Vale conversar com quem entende pra ajustar ao seu contexto.',
    specific_actions: [
      "Criar um ritual curto e repetível (ex.: um copo d'água antes do café).",
      'Ancorar o ritual em um horário ou evento fixo do dia.',
      'Converse com {NAME} pra ajustar ao seu contexto.',
    ],
    dica_rapida: "Quando não existe um ritual mínimo, qualquer imprevisto vira motivo para sair do plano. Um ritual curto e repetível (ex.: um copo d'água antes do café) já pode sustentar a constância.",
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que pequenos desvios têm quebrado sua constância.',
  },
  expectativa: {
    leitura: 'Pelas suas respostas, a meta ou o prazo podem estar fora do que é sustentável no seu contexto.',
    causa_provavel: 'A causa provável está na calibragem: quando a expectativa não combina com a realidade, a frustração tende a quebrar a adesão cedo.',
    preocupacoes: 'Metas ou prazos fora do realista tendem a gerar desistência precoce.',
    espelho: 'Isso não é falta de ambição. É falta de calibragem.',
    providencias: 'Recalibrar um único ponto da meta ou do prazo já pode tornar o caminho viável. Vale conversar com quem entende pra calibrar.',
    specific_actions: [
      'Recalibrar um único ponto da meta ou do prazo.',
      'Definir um objetivo menor e alcançável em 2 semanas.',
      'Converse com {NAME} pra calibrar.',
    ],
    dica_rapida: 'Quando a expectativa não combina com a realidade, a frustração tende a quebrar a adesão cedo. Recalibrar um único ponto da meta ou do prazo já pode tornar o caminho viável.',
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que a meta ou o prazo podem estar fora do que é sustentável no seu contexto.',
  },
}

/** Variantes BLOCKER para contexto odontológico (cáries, saúde bucal, dentista). */
export const BLOCKER_VARIANTS_ODONTO: Record<
  BlockerType,
  {
    leitura: string
    causa_provavel: string
    preocupacoes: string
    espelho: string
    providencias: string
    specific_actions: string[]
    dica_rapida: string
    frase_identificacao: string
  }
> = {
  rotina: {
    leitura: 'Pelas suas respostas, os cuidados bucais estão mais no improviso do que em um padrão organizado.',
    causa_provavel: 'A causa provável está na falta de estrutura: quando a escovação e os cuidados variam de um dia pro outro, a constância tende a ser quebrada.',
    preocupacoes: 'Sem um mínimo de previsibilidade nos cuidados, a frustração pode aumentar e o padrão fica difícil de mudar.',
    espelho: 'Isso não é falta de disciplina. É falta de estrutura.',
    providencias: 'Organizar um único ponto da rotina de cuidados (horário fixo de escovação ou uso do fio dental) já pode mudar o ritmo. Vale conversar com seu dentista pra calibrar o próximo passo.',
    specific_actions: [
      'Definir um horário fixo para a escovação (manhã e noite).',
      'Incluir o fio dental em um momento fixo do dia.',
      'Converse com {NAME} pra calibrar o próximo passo.',
    ],
    dica_rapida: 'Muitas pessoas se beneficiam de organizar um único ponto: horário fixo de escovação ou uso do fio dental. Pequenas mudanças já podem mudar o ritmo dos cuidados.',
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que manter um padrão organizado nos cuidados bucais tem sido um desafio.',
  },
  emocional: {
    leitura: 'Pelas suas respostas, emoções como ansiedade ou cansaço estão pesando nos cuidados com a saúde bucal.',
    causa_provavel: 'A causa provável está nas emoções: quando o estresse ou a correria tomam conta, os cuidados bucais tendem a ser deixados de lado.',
    preocupacoes: 'Ignorar os momentos em que a emoção pesa pode manter o ciclo de descuido e arrependimento.',
    espelho: 'Isso não é fraqueza. É falta de estratégias paralelas aos cuidados.',
    providencias: 'Identificar um momento do dia em que os cuidados costumam falhar e criar um lembrete simples já pode mudar o jogo. Vale conversar com seu dentista pra montar um plano que considere isso.',
    specific_actions: [
      'Identificar em que momento do dia a escovação mais falha e criar um lembrete.',
      'Ancorar a escovação da noite em um evento fixo (ex.: depois do jantar).',
      'Converse com {NAME} pra montar um plano que considere isso.',
    ],
    dica_rapida: 'Emoções como ansiedade e cansaço costumam pesar nos cuidados. Ter um lembrete ou âncora fixa (ex.: escovar logo após o jantar) já pode mudar o jogo.',
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que emoções como ansiedade ou cansaço têm pesado nos cuidados com a saúde bucal.',
  },
  processo: {
    leitura: 'Pelas suas respostas, falta clareza no passo a passo dos cuidados bucais em cada momento.',
    causa_provavel: 'A causa provável está na falta de método: sem uma sequência mínima previsível (escovação, fio, enxágue), cada dia vira uma decisão isolada.',
    preocupacoes: 'Improvisar nos cuidados dia a dia tende a gerar cansaço e sensação de estar sempre correndo atrás.',
    espelho: 'Isso não é falta de empenho. É falta de método.',
    providencias: 'Definir uma sequência simples e fixa (ex.: fio → escovação → enxágue) já pode destravar. Vale conversar com seu dentista pra estruturar o caminho.',
    specific_actions: [
      'Definir uma sequência fixa: fio dental → escovação → enxágue.',
      'Anotar o que você vai fazer em cada escovação (duração, técnica).',
      'Converse com {NAME} pra estruturar o caminho.',
    ],
    dica_rapida: 'Sem uma sequência mínima previsível, cada dia vira uma decisão isolada. Definir uma ordem fixa (fio → escovação → enxágue) já pode destravar.',
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que falta clareza no passo a passo dos cuidados bucais.',
  },
  habitos: {
    leitura: 'Pelas suas respostas, a constância nos cuidados bucais está sendo quebrada por pequenos desvios que se acumulam.',
    causa_provavel: 'A causa provável está na falta de âncora: quando não existe um ritual mínimo (ex.: escovar sempre após o café), qualquer imprevisto vira motivo para pular.',
    preocupacoes: 'Pequenos desvios, quando ignorados, tendem a se acumular e quebrar a adesão aos cuidados.',
    espelho: 'Isso não é falta de força de vontade. É falta de âncora no dia a dia.',
    providencias: 'Criar um ritual curto e repetível (ex.: escovar logo após uma refeição fixa) já pode sustentar melhor a constância. Vale conversar com seu dentista pra ajustar ao seu contexto.',
    specific_actions: [
      "Criar um ritual: escovar sempre após o café da manhã ou após o jantar.",
      'Ancorar o fio dental em um horário ou evento fixo do dia.',
      'Converse com {NAME} pra ajustar ao seu contexto.',
    ],
    dica_rapida: "Quando não existe um ritual mínimo, qualquer imprevisto vira motivo para pular. Um ritual curto (ex.: escovar logo após o café) já pode sustentar a constância.",
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que pequenos desvios têm quebrado sua constância nos cuidados bucais.',
  },
  expectativa: {
    leitura: 'Pelas suas respostas, a meta ou o prazo podem estar fora do que é sustentável no seu contexto.',
    causa_provavel: 'A causa provável está na calibragem: quando a expectativa não combina com a realidade, a frustração tende a quebrar a adesão cedo.',
    preocupacoes: 'Metas ou prazos fora do realista tendem a gerar desistência precoce.',
    espelho: 'Isso não é falta de ambição. É falta de calibragem.',
    providencias: 'Recalibrar um único ponto da meta ou do prazo já pode tornar o caminho viável. Vale conversar com quem entende pra calibrar.',
    specific_actions: [
      'Recalibrar um único ponto da meta ou do prazo.',
      'Definir um objetivo menor e alcançável em 2 semanas.',
      'Converse com {NAME} pra calibrar.',
    ],
    dica_rapida: 'Quando a expectativa não combina com a realidade, a frustração tende a quebrar a adesão cedo. Recalibrar um único ponto da meta ou do prazo já pode tornar o caminho viável.',
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que a meta ou o prazo podem estar fora do que é sustentável no seu contexto.',
  },
}

/** Variantes BLOCKER para contexto estético (pele, skincare, autocuidado). */
export const BLOCKER_VARIANTS_AESTHETICS: Record<
  BlockerType,
  {
    leitura: string
    causa_provavel: string
    preocupacoes: string
    espelho: string
    providencias: string
    specific_actions: string[]
    dica_rapida: string
    frase_identificacao: string
  }
> = {
  rotina: {
    leitura: 'Pelas suas respostas, sua rotina de cuidados com a pele está mais no improviso do que em um padrão organizado.',
    causa_provavel: 'A causa provável está na falta de estrutura: quando os cuidados variam de um dia pro outro, a constância tende a ser quebrada.',
    preocupacoes: 'Sem um mínimo de previsibilidade nos cuidados, a frustração pode aumentar e o padrão fica difícil de mudar.',
    espelho: 'Isso não é falta de disciplina. É falta de estrutura.',
    providencias: 'Organizar um único ponto da rotina (horário fixo de limpeza ou hidratação) já pode mudar o ritmo. Vale conversar com quem entende pra calibrar o próximo passo.',
    specific_actions: [
      'Definir um horário fixo para a rotina de skincare (manhã e noite).',
      'Incluir hidratação em um momento fixo do dia.',
      'Converse com {NAME} pra calibrar o próximo passo.',
    ],
    dica_rapida: 'Muitas pessoas se beneficiam de organizar um único ponto: horário fixo de limpeza ou hidratação. Pequenas mudanças já podem mudar o ritmo dos cuidados.',
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que manter um padrão organizado nos cuidados com a pele tem sido um desafio.',
  },
  emocional: {
    leitura: 'Pelas suas respostas, emoções como ansiedade ou cansaço estão pesando nos cuidados com a pele.',
    causa_provavel: 'A causa provável está nas emoções: quando o estresse ou a correria tomam conta, os cuidados com a pele tendem a ser deixados de lado.',
    preocupacoes: 'Ignorar os momentos em que a emoção pesa pode manter o ciclo de descuido e arrependimento.',
    espelho: 'Isso não é fraqueza. É falta de estratégias paralelas aos cuidados.',
    providencias: 'Identificar um momento do dia em que os cuidados costumam falhar e criar um lembrete simples já pode mudar o jogo. Vale conversar com quem entende pra montar um plano que considere isso.',
    specific_actions: [
      'Identificar em que momento do dia a rotina de skincare mais falha e criar um lembrete.',
      'Ancorar a hidratação da noite em um evento fixo (ex.: depois do banho).',
      'Converse com {NAME} pra montar um plano que considere isso.',
    ],
    dica_rapida: 'Emoções como ansiedade e cansaço costumam pesar nos cuidados. Ter um lembrete ou âncora fixa (ex.: hidratar logo após o banho) já pode mudar o jogo.',
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que emoções como ansiedade ou cansaço têm pesado nos cuidados com a pele.',
  },
  processo: {
    leitura: 'Pelas suas respostas, falta clareza no passo a passo dos cuidados com a pele em cada momento.',
    causa_provavel: 'A causa provável está na falta de método: sem uma sequência mínima previsível (limpeza, hidratação, proteção), cada dia vira uma decisão isolada.',
    preocupacoes: 'Improvisar nos cuidados dia a dia tende a gerar cansaço e sensação de estar sempre correndo atrás.',
    espelho: 'Isso não é falta de empenho. É falta de método.',
    providencias: 'Definir uma sequência simples e fixa (ex.: limpeza → hidratação → proteção) já pode destravar. Vale conversar com quem entende pra estruturar o caminho.',
    specific_actions: [
      'Definir uma sequência fixa: limpeza → hidratação → proteção solar.',
      'Anotar o que você vai fazer em cada momento do dia (manhã e noite).',
      'Converse com {NAME} pra estruturar o caminho.',
    ],
    dica_rapida: 'Sem uma sequência mínima previsível, cada dia vira uma decisão isolada. Definir uma ordem fixa (limpeza → hidratação → proteção) já pode destravar.',
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que falta clareza no passo a passo dos cuidados com a pele.',
  },
  habitos: {
    leitura: 'Pelas suas respostas, a constância nos cuidados com a pele está sendo quebrada por pequenos desvios que se acumulam.',
    causa_provavel: 'A causa provável está na falta de âncora: quando não existe um ritual mínimo (ex.: hidratar sempre após o banho), qualquer imprevisto vira motivo para pular.',
    preocupacoes: 'Pequenos desvios, quando ignorados, tendem a se acumular e quebrar a adesão aos cuidados.',
    espelho: 'Isso não é falta de força de vontade. É falta de âncora no dia a dia.',
    providencias: 'Criar um ritual curto e repetível (ex.: hidratar logo após o banho) já pode sustentar melhor a constância. Vale conversar com quem entende pra ajustar ao seu contexto.',
    specific_actions: [
      'Criar um ritual: hidratar sempre após o banho ou ao acordar.',
      'Ancorar a limpeza em um horário ou evento fixo do dia.',
      'Converse com {NAME} pra ajustar ao seu contexto.',
    ],
    dica_rapida: "Quando não existe um ritual mínimo, qualquer imprevisto vira motivo para pular. Um ritual curto (ex.: hidratar logo após o banho) já pode sustentar a constância.",
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que pequenos desvios têm quebrado sua constância nos cuidados com a pele.',
  },
  expectativa: {
    leitura: 'Pelas suas respostas, a meta ou o prazo podem estar fora do que é sustentável no seu contexto.',
    causa_provavel: 'A causa provável está na calibragem: quando a expectativa não combina com a realidade, a frustração tende a quebrar a adesão cedo.',
    preocupacoes: 'Metas ou prazos fora do realista tendem a gerar desistência precoce.',
    espelho: 'Isso não é falta de ambição. É falta de calibragem.',
    providencias: 'Recalibrar um único ponto da meta ou do prazo já pode tornar o caminho viável. Vale conversar com quem entende pra calibrar.',
    specific_actions: [
      'Recalibrar um único ponto da meta ou do prazo.',
      'Definir um objetivo menor e alcançável em 2 semanas.',
      'Converse com {NAME} pra calibrar.',
    ],
    dica_rapida: 'Quando a expectativa não combina com a realidade, a frustração tende a quebrar a adesão cedo. Recalibrar um único ponto da meta ou do prazo já pode tornar o caminho viável.',
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que a meta ou o prazo podem estar fora do que é sustentável no seu contexto.',
  },
}

/** Variantes BLOCKER para contexto nutricional (alimentação, emagrecimento, metabolismo, intestino). */
export const BLOCKER_VARIANTS_NUTRITION: Record<
  BlockerType,
  {
    leitura: string
    causa_provavel: string
    preocupacoes: string
    espelho: string
    providencias: string
    specific_actions: string[]
    dica_rapida: string
    frase_identificacao: string
  }
> = {
  rotina: {
    leitura: 'Pelas suas respostas, sua rotina alimentar está mais no improviso do que em um padrão organizado.',
    causa_provavel: 'A causa provável está na falta de estrutura: quando as refeições variam de um dia pro outro, a constância tende a ser quebrada.',
    preocupacoes: 'Sem um mínimo de previsibilidade nos horários e nas escolhas, a frustração pode aumentar e o padrão fica difícil de mudar.',
    espelho: 'Isso não é falta de disciplina. É falta de estrutura.',
    providencias: 'Organizar um único ponto da rotina (horário fixo de uma refeição ou planejamento) já pode mudar o ritmo da semana. Vale conversar com quem entende pra calibrar o próximo passo.',
    specific_actions: [
      'Definir um horário fixo para o café da manhã ou almoço.',
      'Planejar 3 refeições na noite anterior.',
      'Converse com {NAME} pra calibrar o próximo passo.',
    ],
    dica_rapida: 'Muitas pessoas se beneficiam de organizar um único ponto: horário fixo de refeição ou planejamento. Pequenas mudanças já podem mudar o ritmo da semana.',
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que manter um padrão organizado na alimentação tem sido um desafio.',
  },
  emocional: {
    leitura: 'Pelas suas respostas, emoções como ansiedade, cansaço ou recompensa estão pesando nas suas escolhas alimentares.',
    causa_provavel: 'A causa provável está nas emoções: quando a comida vira válvula de escape, o plano tende a quebrar nos momentos de maior pressão.',
    preocupacoes: 'Ignorar os gatilhos emocionais pode manter o ciclo de descontrole e arrependimento.',
    espelho: 'Isso não é fraqueza. É falta de estratégias paralelas ao plano.',
    providencias: 'Identificar um gatilho emocional e ter uma alternativa pronta já pode mudar o jogo. Vale conversar com quem entende pra montar um plano que considere isso.',
    specific_actions: [
      'Identificar um gatilho emocional e ter uma alternativa pronta (ex.: caminhar, respirar).',
      'Anotar em que momento do dia a emoção mais pesa nas escolhas.',
      'Converse com {NAME} pra montar um plano que considere isso.',
    ],
    dica_rapida: 'Emoções como ansiedade e cansaço costumam pesar nas escolhas alimentares. Ter uma alternativa pronta (caminhar, respirar) já pode mudar o jogo nos momentos de pressão.',
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que emoções como ansiedade ou cansaço têm pesado nas suas escolhas alimentares.',
  },
  processo: {
    leitura: 'Pelas suas respostas, falta clareza no passo a passo da alimentação em cada momento.',
    causa_provavel: 'A causa provável está na falta de método: sem um plano mínimo previsível, cada dia vira uma decisão isolada.',
    preocupacoes: 'Improvisar dia a dia tende a gerar cansaço e sensação de estar sempre correndo atrás.',
    espelho: 'Isso não é falta de empenho. É falta de método.',
    providencias: 'Definir um único passo claro para o próximo dia já pode destravar. Vale conversar com quem entende pra estruturar o caminho.',
    specific_actions: [
      'Definir um único passo claro para o próximo dia (ex.: o que comer no almoço).',
      'Escrever o que você vai fazer em cada refeição amanhã.',
      'Converse com {NAME} pra estruturar o caminho.',
    ],
    dica_rapida: 'Sem um plano mínimo previsível, cada dia vira uma decisão isolada. Definir um único passo claro para o próximo dia já pode destravar.',
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que falta clareza no passo a passo da alimentação.',
  },
  habitos: {
    leitura: 'Pelas suas respostas, a constância na alimentação está sendo quebrada por pequenos desvios que se acumulam.',
    causa_provavel: 'A causa provável está na falta de âncora: quando não existe um ritual mínimo, qualquer imprevisto vira motivo para sair do plano.',
    preocupacoes: 'Pequenos desvios, quando ignorados, tendem a se acumular e quebrar a adesão.',
    espelho: 'Isso não é falta de força de vontade. É falta de âncora no dia a dia.',
    providencias: 'Criar um ritual curto e repetível já pode sustentar melhor a constância. Vale conversar com quem entende pra ajustar ao seu contexto.',
    specific_actions: [
      "Criar um ritual curto e repetível (ex.: um copo d'água antes do café).",
      'Ancorar uma refeição em um horário ou evento fixo do dia.',
      'Converse com {NAME} pra ajustar ao seu contexto.',
    ],
    dica_rapida: "Quando não existe um ritual mínimo, qualquer imprevisto vira motivo para sair do plano. Um ritual curto (ex.: um copo d'água antes do café) já pode sustentar a constância.",
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que pequenos desvios têm quebrado sua constância na alimentação.',
  },
  expectativa: {
    leitura: 'Pelas suas respostas, a meta ou o prazo podem estar fora do que é sustentável no seu contexto.',
    causa_provavel: 'A causa provável está na calibragem: quando a expectativa não combina com a realidade, a frustração tende a quebrar a adesão cedo.',
    preocupacoes: 'Metas ou prazos fora do realista tendem a gerar desistência precoce.',
    espelho: 'Isso não é falta de ambição. É falta de calibragem.',
    providencias: 'Recalibrar um único ponto da meta ou do prazo já pode tornar o caminho viável. Vale conversar com quem entende pra calibrar.',
    specific_actions: [
      'Recalibrar um único ponto da meta ou do prazo.',
      'Definir um objetivo menor e alcançável em 2 semanas.',
      'Converse com {NAME} pra calibrar.',
    ],
    dica_rapida: 'Quando a expectativa não combina com a realidade, a frustração tende a quebrar a adesão cedo. Recalibrar um único ponto da meta ou do prazo já pode tornar o caminho viável.',
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que a meta ou o prazo podem estar fora do que é sustentável no seu contexto.',
  },
}

/** Variantes BLOCKER para contexto fitness (treino, atividade física, consistência). */
export const BLOCKER_VARIANTS_FITNESS: Record<
  BlockerType,
  {
    leitura: string
    causa_provavel: string
    preocupacoes: string
    espelho: string
    providencias: string
    specific_actions: string[]
    dica_rapida: string
    frase_identificacao: string
  }
> = {
  rotina: {
    leitura: 'Pelas suas respostas, sua rotina de treino está mais no improviso do que em um padrão organizado.',
    causa_provavel: 'A causa provável está na falta de estrutura: quando os treinos variam de um dia pro outro, a constância tende a ser quebrada.',
    preocupacoes: 'Sem um mínimo de previsibilidade nos horários e na frequência, a frustração pode aumentar e o padrão fica difícil de mudar.',
    espelho: 'Isso não é falta de disciplina. É falta de estrutura.',
    providencias: 'Organizar um único ponto da rotina (horário fixo de treino ou dias da semana) já pode mudar o ritmo. Vale conversar com quem entende pra calibrar o próximo passo.',
    specific_actions: [
      'Definir um horário fixo para o treino (ex.: 3x por semana).',
      'Anotar os dias da semana em que vai treinar.',
      'Converse com {NAME} pra calibrar o próximo passo.',
    ],
    dica_rapida: 'Muitas pessoas se beneficiam de organizar um único ponto: horário fixo ou dias fixos de treino. Pequenas mudanças já podem mudar o ritmo da semana.',
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que manter um padrão organizado nos treinos tem sido um desafio.',
  },
  emocional: {
    leitura: 'Pelas suas respostas, emoções como cansaço ou desânimo estão pesando na sua rotina de treino.',
    causa_provavel: 'A causa provável está nas emoções: quando o estresse ou a correria tomam conta, o treino tende a ser deixado de lado.',
    preocupacoes: 'Ignorar os momentos em que a emoção pesa pode manter o ciclo de falta de consistência.',
    espelho: 'Isso não é fraqueza. É falta de estratégias paralelas ao treino.',
    providencias: 'Identificar um momento do dia em que o treino costuma falhar e criar um lembrete simples já pode mudar o jogo. Vale conversar com quem entende pra montar um plano que considere isso.',
    specific_actions: [
      'Identificar em que momento do dia o treino mais falha e criar um lembrete.',
      'Ancorar o treino em um evento fixo (ex.: logo após o trabalho).',
      'Converse com {NAME} pra montar um plano que considere isso.',
    ],
    dica_rapida: 'Emoções como cansaço e desânimo costumam pesar no treino. Ter um horário ou âncora fixa já pode mudar o jogo.',
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que emoções como cansaço ou desânimo têm pesado na sua rotina de treino.',
  },
  processo: {
    leitura: 'Pelas suas respostas, falta clareza no passo a passo do treino em cada momento.',
    causa_provavel: 'A causa provável está na falta de método: sem um plano mínimo previsível (o que fazer, quando, por quanto tempo), cada dia vira uma decisão isolada.',
    preocupacoes: 'Improvisar nos treinos dia a dia tende a gerar cansaço e sensação de estar sempre correndo atrás.',
    espelho: 'Isso não é falta de empenho. É falta de método.',
    providencias: 'Definir um plano simples e fixo (ex.: 3 dias por semana, 30 min) já pode destravar. Vale conversar com quem entende pra estruturar o caminho.',
    specific_actions: [
      'Definir um plano fixo: quantos dias por semana e por quanto tempo.',
      'Anotar o que você vai fazer em cada treino (tipo de atividade, duração).',
      'Converse com {NAME} pra estruturar o caminho.',
    ],
    dica_rapida: 'Sem um plano mínimo previsível, cada dia vira uma decisão isolada. Definir dias fixos e duração já pode destravar.',
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que falta clareza no passo a passo do treino.',
  },
  habitos: {
    leitura: 'Pelas suas respostas, a constância no treino está sendo quebrada por pequenos desvios que se acumulam.',
    causa_provavel: 'A causa provável está na falta de âncora: quando não existe um ritual mínimo (ex.: treinar sempre no mesmo horário), qualquer imprevisto vira motivo para pular.',
    preocupacoes: 'Pequenos desvios, quando ignorados, tendem a se acumular e quebrar a adesão ao treino.',
    espelho: 'Isso não é falta de força de vontade. É falta de âncora no dia a dia.',
    providencias: 'Criar um ritual curto e repetível (ex.: treinar sempre após o café) já pode sustentar melhor a constância. Vale conversar com quem entende pra ajustar ao seu contexto.',
    specific_actions: [
      'Criar um ritual: treinar sempre no mesmo horário ou após um evento fixo.',
      'Ancorar o treino em um dia da semana fixo.',
      'Converse com {NAME} pra ajustar ao seu contexto.',
    ],
    dica_rapida: "Quando não existe um ritual mínimo, qualquer imprevisto vira motivo para pular. Um horário ou dia fixo já pode sustentar a constância.",
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que pequenos desvios têm quebrado sua constância no treino.',
  },
  expectativa: {
    leitura: 'Pelas suas respostas, a meta ou o prazo podem estar fora do que é sustentável no seu contexto.',
    causa_provavel: 'A causa provável está na calibragem: quando a expectativa não combina com a realidade, a frustração tende a quebrar a adesão cedo.',
    preocupacoes: 'Metas ou prazos fora do realista tendem a gerar desistência precoce.',
    espelho: 'Isso não é falta de ambição. É falta de calibragem.',
    providencias: 'Recalibrar um único ponto da meta ou do prazo já pode tornar o caminho viável. Vale conversar com quem entende pra calibrar.',
    specific_actions: [
      'Recalibrar um único ponto da meta ou do prazo.',
      'Definir um objetivo menor e alcançável em 2 semanas.',
      'Converse com {NAME} pra calibrar.',
    ],
    dica_rapida: 'Quando a expectativa não combina com a realidade, a frustração tende a quebrar a adesão cedo. Recalibrar um único ponto da meta ou do prazo já pode tornar o caminho viável.',
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que a meta ou o prazo podem estar fora do que é sustentável no seu contexto.',
  },
}

/** Variantes BLOCKER para contexto perfumaria (fragrâncias, perfume, preferências olfativas). */
export const BLOCKER_VARIANTS_PERFUMARIA: Record<
  BlockerType,
  {
    leitura: string
    causa_provavel: string
    preocupacoes: string
    espelho: string
    providencias: string
    specific_actions: string[]
    dica_rapida: string
    frase_identificacao: string
  }
> = {
  rotina: {
    leitura: 'Pelas suas respostas, sua relação com fragrâncias está mais no improviso do que em escolhas conscientes.',
    causa_provavel: 'A causa provável está na falta de clareza: quando não existe um critério mínimo (família olfativa, ocasião, tipo de pele), cada compra vira uma decisão isolada.',
    preocupacoes: 'Sem um mínimo de direção, a confusão tende a aumentar e fica difícil encontrar o perfume certo.',
    espelho: 'Isso não é falta de gosto. É falta de critério.',
    providencias: 'Definir um único critério (ex.: família olfativa preferida ou ocasião principal) já pode mudar o jogo. Vale conversar com quem entende pra orientar sua escolha.',
    specific_actions: [
      'Identificar uma família olfativa que você gosta (floral, amadeirado, cítrico, etc.).',
      'Definir a ocasião principal de uso (dia a dia, trabalho, noite).',
      'Converse com {NAME} pra orientar sua escolha.',
    ],
    dica_rapida: 'Sem critério mínimo, cada compra vira decisão isolada. Definir família olfativa ou ocasião principal já pode destravar.',
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que falta clareza na hora de escolher fragrâncias.',
  },
  emocional: {
    leitura: 'Pelas suas respostas, emoções como impulso ou indecisão estão pesando na escolha de fragrâncias.',
    causa_provavel: 'A causa provável está nas emoções: quando a compra vira impulso ou a dúvida paralisa, fica difícil acertar.',
    preocupacoes: 'Comprar por impulso ou evitar por indecisão tende a manter o ciclo de insatisfação.',
    espelho: 'Isso não é falta de critério. É falta de orientação.',
    providencias: 'Testar fragrâncias com calma e anotar o que gostou já pode mudar o jogo. Vale conversar com quem entende pra montar um perfil olfativo.',
    specific_actions: [
      'Testar 2–3 fragrâncias com calma antes de decidir.',
      'Anotar o que você gostou em cada uma (notas, sensação).',
      'Converse com {NAME} pra montar seu perfil olfativo.',
    ],
    dica_rapida: 'Comprar por impulso ou evitar por indecisão tende a manter a insatisfação. Testar com calma e anotar preferências já pode mudar o jogo.',
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que emoções como impulso ou indecisão têm pesado na escolha de fragrâncias.',
  },
  processo: {
    leitura: 'Pelas suas respostas, falta clareza no passo a passo para escolher a fragrância certa.',
    causa_provavel: 'A causa provável está na falta de método: sem saber por onde começar (família olfativa, tipo de pele, ocasião), cada tentativa vira tiro no escuro.',
    preocupacoes: 'Improvisar na escolha tende a gerar frustração e acúmulo de perfumes que não combinam.',
    espelho: 'Isso não é falta de empenho. É falta de método.',
    providencias: 'Seguir um passo simples (ex.: identificar sua família olfativa preferida) já pode destravar. Vale conversar com quem entende pra estruturar o caminho.',
    specific_actions: [
      'Identificar sua família olfativa preferida (floral, amadeirado, cítrico, oriental, etc.).',
      'Considerar seu tipo de pele (oleosa fixa mais, seca pode precisar de mais reaplicação).',
      'Converse com {NAME} pra estruturar o caminho.',
    ],
    dica_rapida: 'Sem método, cada tentativa vira tiro no escuro. Identificar família olfativa preferida já pode destravar.',
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que falta clareza no passo a passo para escolher fragrâncias.',
  },
  habitos: {
    leitura: 'Pelas suas respostas, a constância na escolha de fragrâncias está sendo quebrada por pequenos desvios.',
    causa_provavel: 'A causa provável está na falta de âncora: quando não existe um critério mínimo, qualquer novidade ou opinião alheia vira motivo para mudar de direção.',
    preocupacoes: 'Pequenos desvios, quando ignorados, tendem a gerar acúmulo de fragrâncias que não combinam com você.',
    espelho: 'Isso não é falta de consistência. É falta de critério fixo.',
    providencias: 'Definir um perfil olfativo base (ex.: "gosto de florais suaves") já pode sustentar melhor as escolhas. Vale conversar com quem entende pra ajustar ao seu contexto.',
    specific_actions: [
      'Definir um perfil olfativo base (família e intensidade preferidas).',
      'Usar esse critério como filtro antes de comprar.',
      'Converse com {NAME} pra ajustar ao seu contexto.',
    ],
    dica_rapida: 'Sem critério fixo, qualquer novidade vira motivo para mudar. Definir perfil olfativo base já pode sustentar as escolhas.',
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que pequenos desvios têm quebrado sua constância na escolha de fragrâncias.',
  },
  expectativa: {
    leitura: 'Pelas suas respostas, a expectativa em relação à fragrância pode estar fora do que é realista.',
    causa_provavel: 'A causa provável está na calibragem: quando se espera duração excessiva ou efeito que a fragrância não oferece, a frustração tende a aparecer.',
    preocupacoes: 'Expectativas fora do realista tendem a gerar insatisfação mesmo com boas escolhas.',
    espelho: 'Isso não é falta de critério. É falta de calibragem.',
    providencias: 'Entender o que cada tipo de fragrância oferece (duração, projeção, ocasião) já pode calibrar. Vale conversar com quem entende pra ajustar expectativas.',
    specific_actions: [
      'Pesquisar duração e projeção típicas do tipo de fragrância que você busca.',
      'Ajustar expectativas conforme seu tipo de pele e clima.',
      'Converse com {NAME} pra calibrar expectativas.',
    ],
    dica_rapida: 'Expectativas fora do realista tendem a gerar insatisfação. Entender o que cada fragrância oferece já pode calibrar.',
    frase_identificacao: 'Se você se identificou com esse resultado, provavelmente já percebeu que a expectativa em relação à fragrância pode estar fora do realista.',
  },
}

const PROJECTION: ArchitectureTemplates = {
  title: [
    'Sua projeção para {THEME}',
    'Cenário provável em {THEME}',
  ],
  explanation:
    'Com base nos números que você informou, uma faixa possível fica entre {PROJ_MIN} e {PROJ_MAX} {UNIT} ao longo de cerca de {DAYS} dias — o ajuste fino depende da sua rotina e de acompanhamento.',
  causa_provavel:
    'O que costuma acontecer: prazo curto e mudança grande ao mesmo tempo pedem consistência muito alta; quando isso não bate com o dia a dia real, o ritmo quebra antes da meta.',
  preocupacoes:
    'Se a diferença desejada ({DELTA} na unidade informada) estiver comprimida em poucos dias, aumenta o risco de cortes extremos, oscilação de peso e sensação de fracasso — não é falta de disciplina.',
  consequence:
    'Sem recalibrar meta ou prazo, a tendência é ir e voltar: esforço intenso seguido de desistência, com resultado instável mesmo com vontade.',
  possibility:
    'Metas intermediárias e prazo mais alinhado à consistência que você colocou costumam sustentar melhor o processo. Vale alinhar isso com quem acompanha.',
  cta_helper: 'Quer que eu monte seu próximo passo com base nisso?',
  cta_button: ['Quero calibrar', 'Quero um plano'],
  cta_imperative: 'Fale comigo sobre isso',
  whatsapp_prefill:
    'Oi {NAME}, vi minha projeção para {THEME}. Quero calibrar e entender o próximo passo.',
}

const PROFILE: ArchitectureTemplates = {
  title: [
    'Seu perfil em {THEME}: {PROFILE}',
    'Seu estilo em {THEME}: {PROFILE}',
  ],
  explanation:
    'Seu jeito de lidar com isso tem pontos fortes e alguns que atrapalham.',
  causa_provavel:
    'A causa provável: quando o caminho não combina com seu perfil, a inconsistência tende a aparecer.',
  preocupacoes:
    'Seguir um método que não combina com seu jeito tende a gerar abandono.',
  consequence:
    'Se o caminho não combinar com seu perfil, tende a ficar inconsistente.',
  possibility:
    'Quando combina, fica mais leve. Vale conversar pra alinhar.',
  cta_helper: 'Quer que eu te diga o caminho ideal pro seu perfil?',
  cta_button: ['Quero o caminho do meu perfil', 'Quero aplicar'],
  cta_imperative: 'Fale comigo sobre isso',
  whatsapp_prefill:
    'Oi {NAME}, meu perfil em {THEME} deu {PROFILE}. Quero o caminho ideal pro meu caso.',
}

const READINESS: ArchitectureTemplates = {
  title: [
    'Seu nível em {THEME}: {SCORE}/100',
    'Resultado do checklist: {SCORE}/100',
  ],
  explanation:
    'Alguns pontos pesam mais. Quando falham, o resultado fica instável.',
  causa_provavel:
    'A causa provável: quando os pontos críticos falham, o resto do plano tende a não sustentar o resultado.',
  preocupacoes:
    'Ignorar os pontos que mais pesam corrige efeito, não causa.',
  consequence: 'Ignorar os críticos corrige efeito, não causa.',
  possibility: 'Ajustando poucos pontos, melhora bastante. Vale conversar.',
  cta_helper: 'Quer que eu te diga por onde começar?',
  cta_button: ['Quero revisar', 'Quero meu plano'],
  cta_imperative: 'Fale comigo sobre isso',
  whatsapp_prefill:
    'Oi {NAME}, meu checklist de {THEME} deu {SCORE}/100. Você pode me orientar por onde começar?',
}

const PERFUME_PROFILE: ArchitectureTemplates = {
  title: ['Seu perfil de fragrância: {PROFILE}', 'Seu estilo olfativo: {PROFILE}'],
  explanation: 'Sua combinação de respostas revelou um perfil de fragrância.',
  causa_provavel: 'Fragrâncias que combinam com seu perfil tendem a fixar melhor e transmitir sua energia.',
  preocupacoes: 'Perfumes fora do seu perfil podem não transmitir quem você é.',
  consequence: 'Quando o perfume combina com seu perfil, a presença fica mais autêntica.',
  possibility: 'Vale conversar com quem entende pra indicar fragrâncias que combinem com você.',
  cta_helper: 'Quer que eu te mostre fragrâncias que combinam com seu perfil?',
  cta_button: ['Quero ver sugestões', 'Quero indicações'],
  cta_imperative: 'Quero descobrir meu perfume ideal',
  whatsapp_prefill:
    'Oi {NAME}, descobri meu perfil de fragrância: {PROFILE}. Quero receber sugestões de perfumes que combinem comigo.',
}

export const DIAGNOSIS_TEMPLATES: Record<DiagnosisArchitecture, ArchitectureTemplates> = {
  RISK_DIAGNOSIS: RISK,
  BLOCKER_DIAGNOSIS: BLOCKER,
  PROJECTION_CALCULATOR: PROJECTION,
  PROFILE_TYPE: PROFILE,
  READINESS_CHECKLIST: READINESS,
  PERFUME_PROFILE,
}

const SLOT_REGEX = /\{([A-Z_]+)\}/g

export function fillSlots(
  text: string,
  slots: Record<string, string | number | undefined>
): string {
  return text.replace(SLOT_REGEX, (_, key) => {
    const v = slots[key]
    return v !== undefined && v !== null ? String(v) : `{${key}}`
  })
}

export function pickTitle(arch: DiagnosisArchitecture, slots: Record<string, string | number | undefined>): string {
  const t = DIAGNOSIS_TEMPLATES[arch]
  const choice = t.title[Math.floor(Math.random() * t.title.length)] ?? t.title[0]
  return fillSlots(choice, slots)
}

export function pickCtaButton(arch: DiagnosisArchitecture): string {
  const t = DIAGNOSIS_TEMPLATES[arch]
  const choice = t.cta_button[Math.floor(Math.random() * t.cta_button.length)] ?? t.cta_button[0]
  return choice
}

/** Detecta contexto odontológico pelo tema (cáries, saúde bucal, dentista, etc.). */
export function isDentalContext(themeRaw: string): boolean {
  const t = (themeRaw || '').toLowerCase()
  return /cárie|cáries|bucal|dentário|dental|odontológico|escovação|gengiva|dentista/.test(t)
}

/** Detecta contexto estético pelo tema (pele, skincare, etc.). */
export function isAestheticsContext(themeRaw: string): boolean {
  const t = (themeRaw || '').toLowerCase()
  return /pele|skincare|estética|estetica|retenção|rejuvenescimento|manchas|flacidez|autocuidado|cosmético|celulite|idade real/.test(t)
}

/** Detecta contexto nutricional pelo tema (emagrecimento, intestino, metabolismo, etc.). */
function isNutritionContext(themeRaw: string): boolean {
  const t = (themeRaw || '').toLowerCase()
  return /emagrecimento|intestino|metabolismo|alimentação|hidratação|nutrição|retenção|energia/.test(t)
}

/** Detecta contexto fitness pelo tema (treino, atividade física, etc.). */
function isFitnessContext(themeRaw: string): boolean {
  const t = (themeRaw || '').toLowerCase()
  return /treino|fitness|condicionamento|disposição|atividade física|consistência/.test(t)
}

/** Detecta contexto perfumaria pelo tema (perfume, fragrância, olfativo, etc.). */
function isPerfumariaContext(themeRaw: string): boolean {
  const t = (themeRaw || '').toLowerCase()
  return /perfume|fragrância|fragrancia|olfativo|perfumaria|família olfativa|ocasião de uso/.test(t)
}

/** Retorna variantes BLOCKER por contexto: dentistry, aesthetics, nutrition, fitness, perfumaria ou genérico. */
export function getBlockerVariants(
  themeRaw: string,
  segmentCode?: string
): typeof BLOCKER_VARIANTS {
  if (segmentCode === 'dentistry' || segmentCode === 'odonto' || isDentalContext(themeRaw)) return BLOCKER_VARIANTS_ODONTO
  if (segmentCode === 'aesthetics' || isAestheticsContext(themeRaw)) return BLOCKER_VARIANTS_AESTHETICS
  if (segmentCode === 'nutrition' || isNutritionContext(themeRaw)) return BLOCKER_VARIANTS_NUTRITION
  if (segmentCode === 'fitness' || isFitnessContext(themeRaw)) return BLOCKER_VARIANTS_FITNESS
  if (segmentCode === 'perfumaria' || isPerfumariaContext(themeRaw)) return BLOCKER_VARIANTS_PERFUMARIA
  return BLOCKER_VARIANTS
}

/** Retorna templates por nível para RISK_DIAGNOSIS. Fallback para RISK base se level ausente. */
export function getRiskLevelVariants(level: RiskLevel | undefined, themeRaw?: string): RiskLevelVariants {
  if (level && isAestheticsContext(themeRaw ?? '')) return RISK_LEVEL_VARIANTS_AESTHETICS[level]
  if (level && RISK_LEVEL_VARIANTS[level]) return RISK_LEVEL_VARIANTS[level]
  return RISK_LEVEL_VARIANTS.medio
}

/** Retorna variantes extra (causa, preocupações, etc.) para RISK_DIAGNOSIS. */
export function getRiskVariantsExtra(level: RiskLevel | undefined, themeRaw?: string): typeof RISK_VARIANTS_EXTRA[RiskLevel] {
  if (level && isAestheticsContext(themeRaw ?? '')) return RISK_VARIANTS_EXTRA_AESTHETICS[level]
  if (level && RISK_VARIANTS_EXTRA[level]) return RISK_VARIANTS_EXTRA[level]
  return RISK_VARIANTS_EXTRA.medio
}
