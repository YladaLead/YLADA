/**
 * Conteúdo do carrossel por área — personalização conforme FLOWS-POR-AREA-YLADA
 */
export type AreaCodigo =
  | 'med'
  | 'nutri'
  | 'psi'
  | 'psicanalise'
  | 'odonto'
  | 'estetica'
  | 'coach'
  | 'fitness'
  | 'perfumaria'
  | 'seller'

export interface AreaFlowContent {
  /** Slide 1 - Dor (problem-solution) */
  slide1Problem: string
  slide1ProblemHint: string
  /** Slide 3 - Pergunta no chat */
  slide3Question: string
  /** Slide 5/6/7 - Link e share (conteúdo que o cliente vê — atrativo por área) */
  linkTitle: string
  linkHint: string
  /** Slide 8 - Formulário */
  formQuestion: string
  formOptions: string[]
  /** Slide 9 - Resultado */
  resultInsight: string
  resultSubtext: string
  resultInsights: string[]
  resultCta: string
  /** Slide 10 - WhatsApp */
  whatsappProTitle: string
  whatsappClientMsg1: string
  whatsappClientMsg2: string
  /** Slide 11 - Fechamento */
  closingBenefit: string
}

const FLOW_NUTRI: AreaFlowContent = {
  slide1Problem: 'Você tenta emagrecer, mas nada funciona.',
  slide1ProblemHint: 'Tenta várias coisas, mas nada conecta',
  slide3Question: 'O que está me impedindo de emagrecer?',
  linkTitle: 'Descubra o que está impedindo seus resultados',
  linkHint: '3 perguntas · Resultado na hora',
  formQuestion: 'Como está sua rotina alimentar?',
  formOptions: ['Falta de constância', 'Sente ansiedade', 'Não sei por onde começar', 'Já tentei tudo'],
  resultInsight: 'O problema não é dieta. É rotina.',
  resultSubtext: 'Você até tenta, mas sua rotina não sustenta consistência.',
  resultInsights: ['Você começa e para', 'Falta organização no dia a dia', 'Depende de motivação'],
  resultCta: 'Quero ajuda com isso',
  whatsappProTitle: 'Nutri · Consultório',
  whatsappClientMsg1: 'Oi! Fiz seu diagnóstico. Vi que meu problema é mais rotina.',
  whatsappClientMsg2: 'Quero falar com você.',
  closingBenefit: 'Pessoas chegam prontas',
}

const FLOW_ESTETICA: AreaFlowContent = {
  slide1Problem: 'Você posta, mas não atrai clientes.',
  slide1ProblemHint: 'Tenta várias coisas, mas nada conecta',
  slide3Question: 'Por que não estou atraindo clientes?',
  linkTitle: 'Descubra o que sua pele precisa',
  linkHint: '3 perguntas · Resultado na hora',
  formQuestion: 'Você mostra seus resultados?',
  formOptions: ['Sim, mas pouco', 'Não sei como', 'Meu posicionamento não está claro', 'Clientes não entendem meu valor'],
  resultInsight: 'Seu problema não é cliente. É posicionamento.',
  resultSubtext: 'Seus clientes precisam entender seu valor antes de chegar.',
  resultInsights: ['Posicionamento mais claro', 'Resultados que atraem', 'Comunicação que converte'],
  resultCta: 'Quero melhorar isso',
  whatsappProTitle: 'Estética · Consultório',
  whatsappClientMsg1: 'Oi! Fiz seu diagnóstico. Vi que preciso trabalhar meu posicionamento.',
  whatsappClientMsg2: 'Quero falar com você.',
  closingBenefit: 'Conversas mais fáceis',
}

const FLOW_PSI: AreaFlowContent = {
  slide1Problem: 'Conversas não evoluem.',
  slide1ProblemHint: 'Tenta várias coisas, mas nada conecta',
  slide3Question: 'Por que as pessoas não iniciam terapia?',
  linkTitle: 'Entenda o que você precisa agora',
  linkHint: '3 perguntas · Resultado na hora',
  formQuestion: 'Você sente dificuldade emocional?',
  formOptions: ['Sim, às vezes', 'Já tentei resolver sozinho', 'O que mais me incomoda hoje', 'Não sei por onde começar'],
  resultInsight: 'Você não precisa de mais informação. Precisa de acompanhamento.',
  resultSubtext: 'O próximo passo é conversar com quem pode te ajudar.',
  resultInsights: ['Clareza sobre o que sente', 'Reconhecer que precisa de apoio', 'Pronto para conversar'],
  resultCta: 'Quero conversar',
  whatsappProTitle: 'Psicólogo · Consultório',
  whatsappClientMsg1: 'Oi! Fiz seu diagnóstico. Vi que preciso de acompanhamento.',
  whatsappClientMsg2: 'Quero falar com você.',
  closingBenefit: 'Pacientes mais preparados',
}

const FLOW_PSICANALISE: AreaFlowContent = {
  slide1Problem: 'Primeiros contatos não viram processo.',
  slide1ProblemHint: 'Muita explicação, pouca escuta antes da sessão',
  slide3Question: 'Por que as pessoas não entendem o que é análise?',
  linkTitle: 'O que você busca ao falar com um analista?',
  linkHint: '3 perguntas · Resultado na hora',
  formQuestion: 'O que mais te incomoda hoje?',
  formOptions: ['Ansiedade ou tensão', 'Padrões que se repetem', 'Relações que esgotam', 'Quero entender melhor o que sinto'],
  resultInsight: 'Às vezes não falta informação. Falta espaço para nomear o que está acontecendo.',
  resultSubtext: 'Um bom primeiro contato prepara o terreno para o processo — sem prometer atalhos.',
  resultInsights: ['Mais clareza sobre a demanda', 'Expectativas mais realistas', 'Pronto para conversar com contexto'],
  resultCta: 'Quero conversar',
  whatsappProTitle: 'Psicanalista · Consultório',
  whatsappClientMsg1: 'Oi! Fiz a avaliação. Acho que faz sentido conversarmos com mais calma.',
  whatsappClientMsg2: 'Quero falar com você.',
  closingBenefit: 'Analisandos mais alinhados ao processo',
}

const FLOW_ODONTO: AreaFlowContent = {
  slide1Problem: 'Pessoas perguntam preço e somem.',
  slide1ProblemHint: 'Tenta várias coisas, mas nada conecta',
  slide3Question: 'Como atrair pacientes mais preparados?',
  linkTitle: 'Descubra o que seu sorriso precisa',
  linkHint: '3 perguntas · Resultado na hora',
  formQuestion: 'Você sente dor ou desconforto?',
  formOptions: ['Sim, às vezes', 'Já avaliei esse problema', 'Isso afeta minha rotina', 'Quero prevenir'],
  resultInsight: 'Você está adiando algo que precisa de atenção.',
  resultSubtext: 'A avaliação é o primeiro passo para resolver.',
  resultInsights: ['Reconhecer a necessidade', 'Entender o valor do tratamento', 'Pronto para avaliar'],
  resultCta: 'Quero avaliar isso',
  whatsappProTitle: 'Odontologia · Clínica',
  whatsappClientMsg1: 'Oi! Fiz seu diagnóstico. Vi que estou adiando algo importante.',
  whatsappClientMsg2: 'Quero falar com você.',
  closingBenefit: 'Pacientes conscientes',
}

const FLOW_MED: AreaFlowContent = {
  slide1Problem: 'Pacientes perguntam e somem, ou não chegam.',
  slide1ProblemHint: 'Tenta várias coisas, mas nada conecta',
  slide3Question: 'Como atrair pacientes que já entendem o valor da consulta?',
  linkTitle: 'Avalie o que merece sua atenção',
  linkHint: '3 perguntas · Resultado na hora',
  formQuestion: 'Você sente algum sintoma recorrente?',
  formOptions: ['Sim, às vezes', 'Já procurei avaliação', 'Isso afeta minha qualidade de vida', 'Quero prevenir'],
  resultInsight: 'Você está adiando algo que merece atenção.',
  resultSubtext: 'A avaliação é o primeiro passo.',
  resultInsights: ['Reconhecer a necessidade', 'Entender o valor da consulta', 'Pronto para agendar'],
  resultCta: 'Quero agendar uma avaliação',
  whatsappProTitle: 'Médico · Consultório',
  whatsappClientMsg1: 'Oi! Fiz seu diagnóstico. Vi que preciso de uma avaliação.',
  whatsappClientMsg2: 'Quero falar com você.',
  closingBenefit: 'Pacientes mais conscientes',
}

const FLOW_COACH: AreaFlowContent = {
  slide1Problem: 'Conversas não viram sessão.',
  slide1ProblemHint: 'Tenta várias coisas, mas nada conecta',
  slide3Question: 'Por que as pessoas não iniciam uma conversa com você?',
  linkTitle: 'Descubra o que você precisa agora',
  linkHint: '3 perguntas · Resultado na hora',
  formQuestion: 'O que mais você quer transformar?',
  formOptions: ['Bem-estar e hábitos', 'Carreira e produtividade', 'Vida e autoconhecimento', 'Não sei por onde começar'],
  resultInsight: 'Você não precisa de mais informação. Precisa de uma conversa com contexto.',
  resultSubtext: 'O próximo passo é falar com quem pode te acompanhar.',
  resultInsights: ['Clareza sobre o que busca', 'Reconhecer o momento', 'Pronto para conversar'],
  resultCta: 'Quero conversar',
  whatsappProTitle: 'Coach · Sessões',
  whatsappClientMsg1: 'Oi! Fiz seu diagnóstico. Vi que preciso de uma conversa com contexto.',
  whatsappClientMsg2: 'Quero falar com você.',
  closingBenefit: 'Clientes chegam preparados',
}

const FLOW_FITNESS: AreaFlowContent = {
  slide1Problem: 'Você não consegue fechar alunos.',
  slide1ProblemHint: 'Tenta várias coisas, mas nada conecta',
  slide3Question: 'Por que as pessoas não começam treino?',
  linkTitle: 'Descubra como começar certo',
  linkHint: '3 perguntas · Resultado na hora',
  formQuestion: 'Você tem constância?',
  formOptions: ['Falta motivação', 'Já tentei antes', 'Não sei por onde começar', 'Preciso de um plano'],
  resultInsight: 'Você não precisa de mais treino. Precisa de consistência.',
  resultSubtext: 'O começo certo faz toda a diferença.',
  resultInsights: ['Constância antes de intensidade', 'Plano que funciona', 'Começar do jeito certo'],
  resultCta: 'Quero começar certo',
  whatsappProTitle: 'Personal · Academia',
  whatsappClientMsg1: 'Oi! Fiz seu diagnóstico. Vi que preciso de consistência.',
  whatsappClientMsg2: 'Quero falar com você.',
  closingBenefit: 'Alunos mais preparados',
}

const FLOW_PERFUMARIA: AreaFlowContent = {
  slide1Problem: 'Você mostra produtos, mas não vende.',
  slide1ProblemHint: 'Tenta várias coisas, mas nada conecta',
  slide3Question: 'Como ajudar o cliente a escolher a fragrância certa?',
  linkTitle: 'Descubra sua fragrância ideal',
  linkHint: '3 perguntas · Resultado na hora',
  formQuestion: 'Prefere fragrâncias suaves ou marcantes?',
  formOptions: ['Suaves ou marcantes?', 'Dia ou noite?', 'Elegante ou casual?', 'Quero descobrir'],
  resultInsight: 'Sua fragrância ideal é mais marcante e sofisticada.',
  resultSubtext: 'Baseado nas suas respostas.',
  resultInsights: ['Perfil identificado', 'Fragrância sugerida', 'Pronto para testar'],
  resultCta: 'Quero testar isso',
  whatsappProTitle: 'Consultor · Perfumaria',
  whatsappClientMsg1: 'Oi! Fiz seu diagnóstico. Encontrei minha fragrância ideal.',
  whatsappClientMsg2: 'Quero falar com você.',
  closingBenefit: 'Cliente já decidido',
}

const FLOW_SELLER: AreaFlowContent = {
  slide1Problem: 'Você tenta vender, mas as pessoas não se interessam.',
  slide1ProblemHint: 'Tenta várias coisas, mas nada conecta',
  slide3Question: 'Como atrair clientes mais qualificados?',
  linkTitle: 'Descubra o que sua energia precisa',
  linkHint: '3 perguntas · Resultado na hora',
  formQuestion: 'Como está sua energia?',
  formOptions: ['Sinto cansaço', 'Quero mais resultados', 'Não estou satisfeito com meu corpo', 'Preciso de constância'],
  resultInsight: 'Seu problema não é o produto. É constância e energia.',
  resultSubtext: 'O diagnóstico mostra o que realmente importa.',
  resultInsights: ['Constância antes de mais', 'Energia como base', 'Resultados que vêm'],
  resultCta: 'Quero melhorar isso',
  whatsappProTitle: 'Consultor · Vendas',
  whatsappClientMsg1: 'Oi! Fiz seu diagnóstico. Vi que preciso de constância.',
  whatsappClientMsg2: 'Quero falar com você.',
  closingBenefit: 'Clientes chegam prontos',
}

const FLOWS: Record<AreaCodigo, AreaFlowContent> = {
  med: FLOW_MED,
  nutri: FLOW_NUTRI,
  psi: FLOW_PSI,
  psicanalise: FLOW_PSICANALISE,
  odonto: FLOW_ODONTO,
  estetica: FLOW_ESTETICA,
  coach: FLOW_COACH,
  fitness: FLOW_FITNESS,
  perfumaria: FLOW_PERFUMARIA,
  seller: FLOW_SELLER,
}

export function getFlowForArea(area: string | null): AreaFlowContent | null {
  if (!area) return null
  const flow = FLOWS[area as AreaCodigo]
  return flow ?? null
}
