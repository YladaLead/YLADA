/**
 * Copy de diagnóstico por vertical de entrega (Pro Terapia Capilar, Pro Estética Corporal, Pro Líderes).
 * Usado pelo motor quando `meta.diagnosis_vertical` está definido no link.
 */
import type { BlockerType, RiskLevel } from './diagnosis-types'

export type RiskLevelCopy = {
  explanation: string
  consequence: string
  possibility: string
  cta_imperative: string
}

export type RiskExtraCopy = {
  causa_provavel: string
  preocupacoes: string
  providencias: string
  specific_actions: string[]
  dica_rapida: string
  frase_identificacao: string
}

export type BlockerVerticalCopy = {
  leitura: string
  causa_provavel: string
  preocupacoes: string
  espelho: string
  providencias: string
  specific_actions: string[]
  dica_rapida: string
  frase_identificacao: string
}

/** RISK — terapia / rotina capilar e couro cabeludo. */
export const RISK_LEVEL_VARIANTS_CAPILAR: Record<RiskLevel, RiskLevelCopy> = {
  baixo: {
    explanation:
      'Pelas suas respostas, há sinais leves nos fios ou no couro cabeludo que merecem atenção antes de virarem um padrão.',
    consequence:
      'Se esses sinais forem ignorados, costumam se repetir e o cabelo reflete mais o desgaste do dia a dia.',
    possibility:
      'Organizar uma rotina capilar mínima (limpeza adequada + hidratação ou tratamento indicado) já pode mudar a tendência.',
    cta_imperative: 'Quero entender o melhor próximo passo pro meu cabelo',
  },
  medio: {
    explanation:
      'Pelas suas respostas, sua rotina capilar parece irregular ou pouco alinhada ao que o fio e o couro cabeludo estão pedindo.',
    consequence:
      'Sem ajuste, o ciclo de quebra, oleosidade ou ressecamento tende a continuar e frustra objetivos como brilho e fortalecimento.',
    possibility:
      'Vale uma avaliação capilar pra definir prioridade (couro cabeludo x comprimento) e um plano simples de seguir.',
    cta_imperative: 'Quero uma avaliação capilar orientada',
  },
  alto: {
    explanation:
      'Pelos sinais que você relatou, o cabelo ou o couro cabeludo estão pedindo atenção mais estruturada — não só trocar de shampoo.',
    consequence:
      'Adiar o ajuste tende a manter o desconforto ou a queda perceptível no mesmo patamar, ou piorar com o tempo.',
    possibility:
      'O primeiro passo seguro é conversar com quem avalia couro cabeludo e fio pra montar um protocolo coerente com seu caso.',
    cta_imperative: 'Quero falar com um profissional sobre meu caso',
  },
}

export const RISK_VARIANTS_EXTRA_CAPILAR: Record<RiskLevel, RiskExtraCopy> = {
  baixo: {
    causa_provavel:
      'A causa provável: hábitos ou produtos pouco alinhados ao seu tipo de fio/couro cabeludo, com sinais leves que somam com o tempo.',
    preocupacoes: 'Sem um mínimo de rotina, os sinais tendem a aparecer com mais frequência.',
    providencias:
      'Escolher um único eixo (ex.: hidratação do comprimento ou equilíbrio do couro cabeludo) e manter por 2 semanas já ajuda a ler o que muda.',
    specific_actions: [
      'Definir dias fixos de lavagem ou de máscara, conforme orientação.',
      'Evitar excesso de calor sem proteção, se isso aparece nas suas respostas.',
      'Converse com {NAME} pra calibrar produto e frequência pro seu tipo de fio.',
    ],
    dica_rapida:
      'Cabelo responde bem a constância: menos improviso na lavagem e no tratamento costuma mudar a tendência em poucas semanas.',
    frase_identificacao:
      'Se você se identificou com esse resultado, provavelmente já percebeu que pequenos sinais no cabelo ou no couro cabeludo vêm se repetindo.',
  },
  medio: {
    causa_provavel:
      'A causa provável: rotina capilar oscilante ou produtos que não conversam entre si — o fio e o couro cabeludo “pedem” coisas diferentes.',
    preocupacoes: 'Continuar no improviso tende a manter quebra, frizz, oleosidade ou falta de movimento.',
    providencias:
      'Priorizar diagnóstico visual e hábitos (secagem, química, frequência) costuma destravar mais que trocar vários produtos de uma vez.',
    specific_actions: [
      'Anotar o que piora (pontas, raiz, queda ao pentear) nos últimos 30 dias.',
      'Definir uma sequência simples: limpeza + tratamento + finalização adequada.',
      'Converse com {NAME} pra montar protocolo capilar pro seu caso.',
    ],
    dica_rapida:
      'Quando a rotina oscila, o cabelo “não acredita” no cuidado. Um protocolo curto e repetido vale mais que muitos passos esporádicos.',
    frase_identificacao:
      'Se você se identificou com esse resultado, provavelmente já sentiu que a rotina capilar não está sustentando o que você quer ver no espelho.',
  },
  alto: {
    causa_provavel:
      'A causa provável: soma de fatores (química, calor, estresse, produtos inadequados ou couro cabeludo sensível) exigindo avaliação guiada.',
    preocupacoes: 'Adiar orientação profissional tende a prolongar o ciclo de insatisfação com o cabelo.',
    providencias:
      'Avaliação presencial ou guiada permite separar o que é couro cabeludo, o que é fio e o que é hábito — e definir o primeiro passo com segurança.',
    specific_actions: [
      'Agendar conversa para avaliação capilar e histórico de química/tratamentos.',
      'Reduzir intervenções agressivas até ter plano (ex.: calor excessivo sem proteção).',
      'Converse com {NAME} pra definir o protocolo inicial.',
    ],
    dica_rapida:
      'Neste estágio, o que mais ajuda é prioridade clara: o que atacar primeiro (couro vs comprimento) com acompanhamento.',
    frase_identificacao:
      'Se você se identificou com esse resultado, provavelmente já percebeu que o cabelo ou o couro cabeludo estão pedindo um plano mais estruturado.',
  },
}

export const BLOCKER_VARIANTS_CAPILAR: Record<BlockerType, BlockerVerticalCopy> = {
  rotina: {
    leitura:
      'Pelas suas respostas, a rotina capilar está mais no improviso: lavagens e tratamentos variam sem um padrão que o fio consiga “aprender”.',
    causa_provavel:
      'A causa provável é a falta de cadência: sem horários ou dias previsíveis, o cabelo oscila entre excesso e falta de cuidado.',
    preocupacoes: 'O improviso costuma gerar frustração e sensação de que “nada funciona”.',
    espelho: 'Isso não é preguiça. É falta de um ritmo mínimo sustentável.',
    providencias:
      'Um ritual curto (ex.: máscara no mesmo dia da semana) já cria previsibilidade. Vale alinhar com quem entende de capilar.',
    specific_actions: [
      'Definir 1–2 dias fixos por semana para tratamento ou nutrição dos fios.',
      'Padronizar secagem/penteado nos dias mais corridos.',
      'Converse com {NAME} pra ajustar a rotina ao seu tipo de fio.',
    ],
    dica_rapida: 'Cabelo responde a repetição: um ritual fixo, mesmo simples, costuma vencer o improviso.',
    frase_identificacao:
      'Se você se identificou com esse resultado, manter constância na rotina capilar provavelmente tem sido o maior desafio.',
  },
  emocional: {
    leitura:
      'Pelas suas respostas, cansaço ou ansiedade parecem pesar quando você tenta cuidar do cabelo com calma.',
    causa_provavel:
      'A causa provável é o desgaste emocional: em dias pesados, o cuidado vira algo que “fica pra depois”.',
    preocupacoes: 'Adiar sempre tende a acumular sinais no fio e no couro cabeludo.',
    espelho: 'Isso não é falta de vaidade. É sobrecarga no dia a dia.',
    providencias:
      'Ancorar o cuidado em um momento fixo (ex.: após o banho) reduz decisões. Quem entende de capilar pode simplificar o protocolo.',
    specific_actions: [
      'Escolher um único passo inegociável (ex.: leave-in ou óleo nas pontas).',
      'Evitar comparar seu cabelo com rotinas irreais de redes sociais.',
      'Converse com {NAME} pra um plano realista pro seu ritmo de vida.',
    ],
    dica_rapida: 'Menos passos, mas estáveis, costumam vencer protocolos longos que só funcionam em dias “perfeitos”.',
    frase_identificacao:
      'Se você se identificou com esse resultado, o emocional provavelmente tem interferido na constância dos cuidados.',
  },
  processo: {
    leitura:
      'Pelas suas respostas, falta clareza na ordem do que fazer: limpeza, tratamento, finalização — tudo parece opcional.',
    causa_provavel:
      'A causa provável é ausência de método: sem sequência mínima, cada dia vira tentativa e erro.',
    preocupacoes: 'Sem método, é fácil gastar com produto errado ou usar na ordem errada.',
    espelho: 'Isso não é falta de interesse. É falta de mapa simples.',
    providencias:
      'Definir uma sequência de 3 passos já organiza. Um profissional capilar costuma destravar isso em uma conversa.',
    specific_actions: [
      'Escrever a ordem: limpeza → tratamento (se for o dia) → proteção/finalização.',
      'Separar produtos por função (limpar / tratar / proteger).',
      'Converse com {NAME} pra validar a sequência pro seu caso.',
    ],
    dica_rapida: 'Ordem importa: tratar fio sujo ou selar sem preparo costuma anular o efeito do que você aplicou.',
    frase_identificacao:
      'Se você se identificou com esse resultado, provavelmente sente que falta um passo a passo claro nos cuidados.',
  },
  habitos: {
    leitura:
      'Pelas suas respostas, pequenos desvios (calor, pentear úmido, dormir com cabelo molhado) estão se acumulando.',
    causa_provavel:
      'A causa provável é hábito sem percepção de dano: micro-traumas somam e aparecem como quebra ou frizz.',
    preocupacoes: 'Ignorar esses hábitos mantém o cabelo em modo de “reparo constante”.',
    espelho: 'Isso não é descuido. Muitas vezes é costume que ninguém apontou.',
    providencias:
      'Ajustar um hábito por vez (ex.: proteção térmica) já muda a curva. Alinhar com especialista acelera.',
    specific_actions: [
      'Escolher um hábito a corrigir nesta semana (calor, tracionamento, travesseiro).',
      'Usar proteção térmica sempre que usar secador/chapinha.',
      'Converse com {NAME} pra priorizar o que mais impacta no seu fio.',
    ],
    dica_rapida: 'Um hábito ruim repetido vale mais que um produto bom usado de vez em quando.',
    frase_identificacao:
      'Se você se identificou com esse resultado, pequenos hábitos do dia a dia provavelmente estão pesando no resultado.',
  },
  expectativa: {
    leitura:
      'Pelas suas respostas, a expectativa de mudança rápida pode estar desalinhada com o tempo que o cabelo leva pra responder.',
    causa_provavel:
      'A causa provável é prazo irreal: fio precisa de ciclos de crescimento e tratamento, não de milagre em uma aplicação.',
    preocupacoes: 'Expectativa alta demais gera troca frenética de produtos e piora o quadro.',
    espelho: 'Isso não é impaciência “ruim”. É falta de referência realista.',
    providencias:
      'Recalibrar meta com quem entende (ex.: 6–8 semanas pra ler primeiro efeito de rotina) costuma devolver controle.',
    specific_actions: [
      'Definir uma meta menor para 30 dias (ex.: menos quebra ao pentear).',
      'Evitar mudar tudo de produto ao mesmo tempo.',
      'Converse com {NAME} pra alinhar expectativa e protocolo.',
    ],
    dica_rapida: 'Cabelo premia constância no tempo certo; trocar de estratégia toda semana costuma resetar o progresso.',
    frase_identificacao:
      'Se você se identificou com esse resultado, talvez a expectativa de resultado tenha sido o que mais atrapalhou a constância.',
  },
}

/** RISK — estética corporal (protocolo, corpo, consistência de cuidado). */
export const RISK_LEVEL_VARIANTS_CORPORAL: Record<RiskLevel, RiskLevelCopy> = {
  baixo: {
    explanation:
      'Pelas suas respostas, há sinais leves no corpo ou na rotina de cuidados que vale observar antes de virarem um padrão.',
    consequence:
      'Pequenos desvios de hábito ou pausas no protocolo tendem a se acumular e aparecer mais na pele, no inchaço ou na flacidez.',
    possibility:
      'Organizar um protocolo mínimo (hidratação, movimento leve ou frequência de sessões) já pode mudar a tendência.',
    cta_imperative: 'Quero organizar meu próximo passo com orientação',
  },
  medio: {
    explanation:
      'Pelas suas respostas, sua rotina atual parece contribuir para o que você está percebendo no corpo — consistência e método fazem diferença.',
    consequence:
      'Sem ajuste, o ciclo de retenção, flacidez ou falta de firmeza tende a continuar no mesmo ritmo.',
    possibility:
      'Uma avaliação corporal orientada ajuda a priorizar: circulação, firmeza, protocolo em casa ou em clínica.',
    cta_imperative: 'Quero uma avaliação orientada pro meu caso',
  },
  alto: {
    explanation:
      'Pelos sinais relatados, o corpo está pedindo um plano mais estruturado — não só uma mudança pontual de hábito.',
    consequence:
      'Adiar um direcionamento claro tende a manter o incômodo ou a insatisfação com o mesmo padrão.',
    possibility:
      'Definir o primeiro passo com profissional (avaliação + protocolo) costuma destravar o que a rotina sozinha não resolve.',
    cta_imperative: 'Quero falar com um profissional sobre meu objetivo',
  },
}

export const RISK_VARIANTS_EXTRA_CORPORAL: Record<RiskLevel, RiskExtraCopy> = {
  baixo: {
    causa_provavel:
      'A causa provável: hábitos leves (sono, líquidos, movimento ou pausas no protocolo) somando no resultado que você vê.',
    preocupacoes: 'Ignorar esses sinais permite que o padrão se instale.',
    providencias:
      'Escolher um eixo (ex.: drenagem leve em casa ou frequência de hidratação da pele) por 2 semanas já gera leitura do que muda.',
    specific_actions: [
      'Definir 2–3 dias por semana para o cuidado combinado (casa ou profissional).',
      'Anotar o que piora (inchaço de manhã, firmeza, textura da pele).',
      'Converse com {NAME} pra calibrar protocolo e expectativa.',
    ],
    dica_rapida: 'Corpo responde quando há repetibilidade: pouco, mas todo dia, costuma vencer intensidade esporádica.',
    frase_identificacao:
      'Se você se identificou com esse resultado, provavelmente já notou pequenos sinais que valem atenção antes de evoluírem.',
  },
  medio: {
    causa_provavel:
      'A causa provável: rotina inconsistente ou protocolo que não conversa com seu objetivo (ex.: só cosmético sem suporte de hábito).',
    preocupacoes: 'O padrão tende a se repetir: melhora pontual e volta ao mesmo ponto.',
    providencias:
      'Priorizar uma avaliação que una hábito + tratamento costuma destravar mais que tentar várias soluções ao mesmo tempo.',
    specific_actions: [
      'Listar o que você já tentou nos últimos 60 dias.',
      'Definir uma meta única para 30 dias (ex.: firmeza, textura, inchaço).',
      'Converse com {NAME} pra montar combinação realista.',
    ],
    dica_rapida: 'Foco num objetivo corporal por vez reduz ruído e aumenta adesão ao protocolo.',
    frase_identificacao:
      'Se você se identificou com esse resultado, a inconsistência entre hábito e tratamento provavelmente é o que mais pesa.',
  },
  alto: {
    causa_provavel:
      'A causa provável: soma de fatores que pedem avaliação — protocolo em casa sozinho tende a ser insuficiente.',
    preocupacoes: 'Postergar orientação mantém o ciclo de tentativa e erro.',
    providencias:
      'Plano com profissional (sessões + rotina em casa) costuma devolver previsibilidade ao resultado.',
    specific_actions: [
      'Reservar avaliação para alinhar objetivo e frequência de tratamento.',
      'Evitar misturar muitas novidades sem acompanhamento.',
      'Converse com {NAME} pra definir o primeiro passo com segurança.',
    ],
    dica_rapida: 'Nestes casos, clareza de plano vale mais que mais um produto ou procedimento isolado.',
    frase_identificacao:
      'Se você se identificou com esse resultado, provavelmente já sentiu que falta um plano mais estruturado pro seu corpo.',
  },
}

export const BLOCKER_VARIANTS_CORPORAL: Record<BlockerType, BlockerVerticalCopy> = {
  rotina: {
    leitura:
      'Pelas suas respostas, a rotina de cuidados corporais ou de tratamento está irregular — difícil manter frequência.',
    causa_provavel:
      'A causa provável é falta de encaixe no calendário: sem slots fixos, o protocolo vira evento esporádico.',
    preocupacoes: 'Tratamentos esporádicos costumam dar resultado abaixo do esperado.',
    espelho: 'Isso não é falta de compromisso. É agenda que não sustenta o protocolo.',
    providencias:
      'Marcar horários como compromisso (casa ou clínica) já muda a adesão. Alinhar com profissional reduz fricção.',
    specific_actions: [
      'Definir dia/horário fixo para autocuidado ou sessão.',
      'Reduzir o protocolo ao mínimo viável na semana corrida.',
      'Converse com {NAME} pra encaixar o ideal no seu ritmo.',
    ],
    dica_rapida: 'Protocolo corporal pede ritmo: menos etapas, mas nas semanas certas, costuma superar “maratonas” isoladas.',
    frase_identificacao:
      'Se você se identificou com esse resultado, manter frequência provavelmente é o maior desafio.',
  },
  emocional: {
    leitura:
      'Pelas suas respostas, emoção ou cansaço parecem derrubar a constância do cuidado com o corpo.',
    causa_provavel:
      'A causa provável é desgaste: quando o emocional pesa, o autocuidado é o primeiro a ser cortado.',
    preocupacoes: 'Isso mantém o corpo sem suporte estável de hábito ou tratamento.',
    espelho: 'Isso não é fraqueza. É prioridade que muda com a carga do dia.',
    providencias:
      'Um passo mínimo em dias difíceis (5 minutos de protocolo) mantém a linha. Profissional pode simplificar.',
    specific_actions: [
      'Definir um “mínimo inegociável” nos dias pesados.',
      'Evitar culpa: voltar no dia seguinte já é progresso.',
      'Converse com {NAME} pra um plano compassivo e realista.',
    ],
    dica_rapida: 'Recuperar após um dia ruim é parte do processo; o que mata resultado é abandonar por semanas.',
    frase_identificacao:
      'Se você se identificou com esse resultado, o emocional provavelmente tem sido o que mais quebra a constância.',
  },
  processo: {
    leitura:
      'Pelas suas respostas, falta clareza no que fazer em casa versus o que esperar de sessão profissional.',
    causa_provavel:
      'A causa provável é método: sem combinação clara, cada tentativa parece solta.',
    preocupacoes: 'Expectativa sem roteiro gera frustração e abandono.',
    espelho: 'Isso não é falta de esforço. É falta de mapa.',
    providencias:
      'Separar “o que é casa” e “o que é clínica” em 3 bullets já organiza. Quem acompanha o caso costuma fechar isso rápido.',
    specific_actions: [
      'Escrever 3 ações só sua casa e 3 só com profissional.',
      'Perguntar qual métrica acompanhar (ex.: firmeza, medida, foto).',
      'Converse com {NAME} pra fechar o método.',
    ],
    dica_rapida: 'Corpo muda com combinação coerente: hábito + tratamento alinhados batem só um dos dois isolado.',
    frase_identificacao:
      'Se você se identificou com esse resultado, provavelmente sentiu falta de um método claro.',
  },
  habitos: {
    leitura:
      'Pelas suas respostas, pequenos hábitos (líquidos, sono, movimento, posição) estão trabalhando contra o resultado.',
    causa_provavel:
      'A causa provável é efeito cumulativo: detalhes do dia a dia sustentam inchaço, textura ou flacidez.',
    preocupacoes: 'Sem ajuste de hábito, tratamento costuma parecer “fraco”.',
    espelho: 'Isso não é falta de vontade. É hábito invisível até alguém apontar.',
    providencias:
      'Corrigir um hábito-base (sono ou hidratação, por exemplo) amplifica qualquer protocolo.',
    specific_actions: [
      'Escolher um hábito-base para 14 dias.',
      'Registrar dias em que nota diferença visível.',
      'Converse com {NAME} pra ver o que priorizar no seu caso.',
    ],
    dica_rapida: 'Hábito errado todo dia compete com tratamento certo uma vez por mês.',
    frase_identificacao:
      'Se você se identificou com esse resultado, hábitos do dia a dia provavelmente são a peça que falta.',
  },
  expectativa: {
    leitura:
      'Pelas suas respostas, a expectativa de mudança rápida pode estar acima do que corpo e protocolo sustentam.',
    causa_provavel:
      'A causa provável é calibragem: resultado corporal costuma exigir semanas de constância.',
    preocupacoes: 'Expectativa alta leva a trocar de estratégia antes do tempo.',
    espelho: 'Isso não é impaciência ruim. É falta de referência.',
    providencias:
      'Recalibrar prazo com profissional devolve motivação e adesão.',
    specific_actions: [
      'Definir marco de 30/60 dias com indicador simples.',
      'Evitar comparar com resultados de contexto diferente.',
      'Converse com {NAME} pra alinhar meta e frequência.',
    ],
    dica_rapida: 'Corpo responde a constância no tempo certo; trocar tudo a cada 7 dias reinicia o relógio.',
    frase_identificacao:
      'Se você se identificou com esse resultado, expectativa e prazo provavelmente precisam ser recalibrados.',
  },
}

/** RISK — Pro Líderes: conversa com quem enviou o link / próximo passo com o líder. */
export const RISK_LEVEL_VARIANTS_PRO_LIDERES: Record<RiskLevel, RiskLevelCopy> = {
  baixo: {
    explanation:
      'Pelas suas respostas, há espaço para organizar melhor seu próximo passo — com apoio de quem te enviou este link.',
    consequence:
      'Sem um direcionamento rápido, tendências boas não viram plano e oportunidades passam mais despercebidas.',
    possibility:
      'Uma conversa curta com seu consultor ou líder costuma destravar prioridade e próximo passo prático.',
    cta_imperative: 'Quero conversar com quem me enviou este link',
  },
  medio: {
    explanation:
      'Pelas suas respostas, há sinais de que consistência e clareza no caminho fazem diferença — e isso se acelera com orientação próxima.',
    consequence:
      'Continuar sozinho(a) tende a manter o mesmo ritmo de tentativas sem um plano que acompanhe seu contexto.',
    possibility:
      'Falar com quem te enviou o link ajuda a montar um plano simples e sustentável para as próximas semanas.',
    cta_imperative: 'Quero alinhar meu próximo passo com meu líder',
  },
  alto: {
    explanation:
      'Pelas suas respostas, é importante não deixar isso só no papel: o próximo passo pede conversa direta com quem te acompanha.',
    consequence:
      'Adiar a conversa tende a manter incertezas e postergar decisões que fariam diferença agora.',
    possibility:
      'Priorize retornar o contato de quem te enviou este link — é a forma mais rápida de clareza e direção.',
    cta_imperative: 'Quero que meu líder me oriente no próximo passo',
  },
}

export const RISK_VARIANTS_EXTRA_PRO_LIDERES: Record<RiskLevel, RiskExtraCopy> = {
  baixo: {
    causa_provavel:
      'A causa provável: falta de um plano curto e de follow-up — pequenos ajustes já mudam resultado quando há apoio.',
    preocupacoes: 'Sem alinhamento, boas intenções não viram hábito de execução.',
    providencias:
      'Pedir uma conversa de 10 minutos para definir “uma ação esta semana” já muda o ritmo.',
    specific_actions: [
      'Enviar mensagem para quem te enviou o link com seu principal objetivo.',
      'Perguntar qual seria o primeiro passo recomendado para o seu caso.',
      'Combinar dia/horário para falar com calma.',
    ],
    dica_rapida: 'Em liderança e negócio, clareza vem de conversa — não de adivinhar sozinho o próximo passo.',
    frase_identificacao:
      'Se você se identificou com esse resultado, provavelmente sente que falta um empurrão organizado no próximo passo.',
  },
  medio: {
    causa_provavel:
      'A causa provável: rotina e prioridades competindo — sem calendário com o líder, o plano perde força.',
    preocupacoes: 'Continuar sem alinhamento mantém esforço disperso.',
    providencias:
      'Agendar check-in com quem te enviou o link costuma recolocar foco em 1–2 prioridades.',
    specific_actions: [
      'Listar suas 3 maiores dúvidas antes da conversa.',
      'Pedir um modelo simples de acompanhamento (meta semanal).',
      'Confirmar o melhor canal (ligação ou mensagem) para respostas rápidas.',
    ],
    dica_rapida: 'Quem já caminhou o caminho encurta trial-and-error — use o contato que você já tem.',
    frase_identificacao:
      'Se você se identificou com esse resultado, consistência e prioridade provavelmente são o foco da conversa com seu líder.',
  },
  alto: {
    causa_provavel:
      'A causa provável: decisões importantes pedindo conversa direta — texto sozinho não substitui alinhamento.',
    preocupacoes: 'Postergar o contato tende a aumentar dúvida e reduzir momentum.',
    providencias:
      'Ligar ou pedir retorno imediato a quem te enviou o link é o passo mais eficiente agora.',
    specific_actions: [
      'Enviar mensagem curta pedindo ligação ou horário para falar hoje.',
      'Dizer em uma frase o que você quer decidir (ex.: começar, entender produto, ver oportunidade).',
      'Anote 2 perguntas que não podem ficar em aberto.',
    ],
    dica_rapida: 'Momentum importa: quanto antes falar com seu líder, mais rápido você sai do “talvez”.',
    frase_identificacao:
      'Se você se identificou com esse resultado, provavelmente já sabe que precisa de uma conversa, não de mais uma informação solta.',
  },
}

export const BLOCKER_VARIANTS_PRO_LIDERES: Record<BlockerType, BlockerVerticalCopy> = {
  rotina: {
    leitura:
      'Pelas suas respostas, sua rotina de follow-up e organização do dia a dia parece irregular — difícil manter o ritmo sozinho(a).',
    causa_provavel:
      'A causa provável é falta de estrutura: sem horários combinados com seu líder, as ações ficam sempre “para depois”.',
    preocupacoes: 'Improviso tende a gerar abandono de metas e oportunidades.',
    espelho: 'Isso não é falta de capacidade. É falta de cadência combinada.',
    providencias:
      'Combinar um check-in semanal ou pontos fixos de contato com quem te enviou o link já muda o jogo.',
    specific_actions: [
      'Sugerir um horário fixo de ligação ou mensagem com seu líder.',
      'Definir uma meta mínima para os próximos 7 dias.',
      'Pedir um modelo simples de acompanhamento.',
    ],
    dica_rapida: 'Negócio e desenvolvimento respondem a ritmo — combine o ritmo com quem te orienta.',
    frase_identificacao:
      'Se você se identificou com esse resultado, organizar a rotina com apoio do líder provavelmente é o que destrava.',
  },
  emocional: {
    leitura:
      'Pelas suas respostas, medo, vergonha ou cansaço parecem segurar o próximo passo — mesmo quando você vê oportunidade.',
    causa_provavel:
      'A causa provável é carga emocional: sem conversa, a dúvida fica em loop.',
    preocupacoes: 'Adiar por vergonha ou ansiedade costuma aumentar a distância do primeiro passo.',
    espelho: 'Isso não é falta de coragem. É normal pedir apoio para destravar.',
    providencias:
      'Uma conversa franca com quem te enviou o link costuma normalizar o medo e virar plano.',
    specific_actions: [
      'Dizer honestamente o que te trava (tempo, medo de errar, dúvida sobre encaixe).',
      'Pedir exemplos de próximo passo para alguém no seu perfil.',
      'Combinar um primeiro passo pequeno e mensurável.',
    ],
    dica_rapida: 'Líder de verdade ajuda a traduzir emoção em ação pequena — vale usar o canal que você já tem.',
    frase_identificacao:
      'Se você se identificou com esse resultado, o emocional provavelmente é o que mais pede conversa com seu líder.',
  },
  processo: {
    leitura:
      'Pelas suas respostas, falta clareza no processo: o que vem depois, com quem falar e em que ordem.',
    causa_provavel:
      'A causa provável é método: sem mapa, cada passo parece opcional.',
    preocupacoes: 'Sem processo, você testa no escuro e cansa mais rápido.',
    espelho: 'Isso não é falta de interesse. É falta de roteiro.',
    providencias:
      'Peça a quem te enviou o link um passo a passo em 3 bullets — isso fecha o processo.',
    specific_actions: [
      'Perguntar: qual é o passo 1, 2 e 3 no meu caso?',
      'Pedir materiais ou links oficiais para validar informação.',
      'Marcar data para revisar dúvidas.',
    ],
    dica_rapida: 'Processo claro reduz ansiedade: peça o mapa a quem já fez o caminho.',
    frase_identificacao:
      'Se você se identificou com esse resultado, clareza de processo provavelmente é o que você mais precisa do líder.',
  },
  habitos: {
    leitura:
      'Pelas suas respostas, hábitos de consistência (contato, estudo, acompanhamento) ainda não estão firmes.',
    causa_provavel:
      'A causa provável é falta de âncora: sem compromisso mínimo, qualquer imprevisto quebra o ritmo.',
    preocupacoes: 'Hábito fraco mantém resultado abaixo do potencial.',
    espelho: 'Isso não é preguiça. É falta de sistema simples.',
    providencias:
      'Definir um hábito mínimo com accountability do líder (ex.: check-in curto) sustenta evolução.',
    specific_actions: [
      'Combinar um hábito mínimo diário ou semanal.',
      'Pedir que seu líder cobre gentilmente esse hábito.',
      'Registrar por 14 dias se cumpriu ou não — sem julgamento.',
    ],
    dica_rapida: 'Accountability gentil funciona: deixe seu líder entrar no seu ritmo.',
    frase_identificacao:
      'Se você se identificou com esse resultado, construir hábito com apoio provavelmente é o caminho.',
  },
  expectativa: {
    leitura:
      'Pelas suas respostas, expectativa e realidade podem estar desalinhadas — o que gera frustração e paralisa.',
    causa_provavel:
      'A causa provável é calibragem: sem conversa, é fácil imaginar prazos e resultados irreais.',
    preocupacoes: 'Expectativa errada leva a desistir antes do tempo certo.',
    espelho: 'Isso não é ingenuidade. É falta de alinhamento.',
    providencias:
      'Uma conversa para recalibrar meta, prazo e esforço com quem te enviou o link resolve a maior parte.',
    specific_actions: [
      'Perguntar o que é realista no seu contexto (tempo disponível, experiência).',
      'Definir marco de 30 dias com indicador simples.',
      'Ajustar compromisso se necessário — melhor menor e sustentável.',
    ],
    dica_rapida: 'Alinhar expectativa com quem já viu dezenas de casos evita comparar com ilusão.',
    frase_identificacao:
      'Se você se identificou com esse resultado, recalibrar expectativa com seu líder provavelmente é o próximo passo certo.',
  },
}

export const RISK_MAIN_BLOCKER_CAPILAR: Record<RiskLevel, string> = {
  baixo: 'Sinais leves nos fios ou no couro cabeludo que merecem atenção',
  medio: 'Seu cabelo está pedindo mais consistência nos cuidados',
  alto: 'Seu cabelo e couro cabeludo pedem um plano mais estruturado',
}

export const RISK_MAIN_BLOCKER_CORPORAL: Record<RiskLevel, string> = {
  baixo: 'Sinais leves no corpo e na rotina de cuidados que merecem atenção',
  medio: 'Seu corpo está pedindo mais método no protocolo e nos hábitos',
  alto: 'Seu objetivo corporal pede direcionamento profissional mais claro',
}

export const RISK_MAIN_BLOCKER_PRO_LIDERES: Record<RiskLevel, string> = {
  baixo: 'Próximo passo ainda precisa ser organizado com quem te acompanha',
  medio: 'Consistência e clareza pedem alinhamento com seu líder',
  alto: 'Decisão e direção pedem conversa direta com quem te enviou este link',
}
