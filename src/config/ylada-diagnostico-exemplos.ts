/**
 * Exemplos de diagnóstico por categoria para a seção "Veja como uma avaliação pode gerar uma consulta".
 * Cada área tem: avaliação, perfil, sinais, mensagem do paciente e cards de exemplos.
 */

export type DiagnosticoExemploArea =
  | 'med'
  | 'nutri'
  | 'psi'
  | 'odonto'
  | 'estetica'
  | 'fitness'
  | 'perfumaria'
  | 'seller'
  | 'coach'

export interface DiagnosticoExemploConfig {
  avaliacao: string
  perfil: string
  /** Uma linha que explica o perfil (como no resultado real). */
  explicacao: string
  sinais: string[]
  mensagem: string
  sugestao: string
  /** Frase final do card, por área: consulta, conversa, agendamento... */
  fraseAgendamento: string
  cards: [string, string, string]
  labelPaciente: string
  tituloSecaoCards: string
  tituloSecaoCardsDesc: string
}

export const DIAGNOSTICO_EXEMPLOS: Record<DiagnosticoExemploArea, DiagnosticoExemploConfig> = {
  med: {
    avaliacao: 'Seus sintomas podem estar relacionados ao estresse?',
    perfil: 'Sobrecarga física moderada',
    explicacao: 'Sinais que merecem uma avaliação médica para entender causa e conduta.',
    sinais: ['cansaço persistente', 'dificuldade para recuperar energia', 'corpo sobrecarregado'],
    mensagem: 'Vi o resultado da avaliação. Acho que preciso investigar isso melhor.',
    sugestao: 'Esse resultado sugere que uma avaliação médica pode ajudar a entender melhor esses sinais.',
    fraseAgendamento: 'Isso desperta interesse e facilita o agendamento da consulta.',
    cards: ['Estresse', 'Energia', 'Sobrecarga física'],
    labelPaciente: 'paciente',
    tituloSecaoCards: 'Avaliações usadas por médicos',
    tituloSecaoCardsDesc: 'Médicos usam avaliações como:',
  },
  nutri: {
    avaliacao: 'Seu metabolismo pode estar lento?',
    perfil: 'Possível desaceleração metabólica',
    explicacao: 'Padrões que indicam que uma avaliação nutricional pode trazer clareza.',
    sinais: ['dificuldade para perder peso', 'baixa energia', 'sensação de metabolismo lento'],
    mensagem: 'Achei interessante o resultado. Você poderia avaliar minha alimentação?',
    sugestao: 'Esse resultado sugere que uma avaliação nutricional pode ajudar.',
    fraseAgendamento: 'Isso desperta interesse e facilita o agendamento da consulta.',
    cards: ['Metabolismo', 'Alimentação', 'Hábitos'],
    labelPaciente: 'paciente',
    tituloSecaoCards: 'Avaliações usadas por nutricionistas',
    tituloSecaoCardsDesc: 'Nutricionistas usam avaliações como:',
  },
  psi: {
    avaliacao: 'Seu nível de ansiedade pode estar alto?',
    perfil: 'Possível sobrecarga emocional',
    explicacao: 'Sinais que podem indicar benefício em conversar com um profissional.',
    sinais: ['preocupação frequente', 'dificuldade para relaxar', 'acúmulo de estresse'],
    mensagem: 'Vi o resultado da avaliação. Acho que seria bom conversarmos sobre isso.',
    sugestao: 'Esse resultado sugere que uma conversa profissional pode ajudar.',
    fraseAgendamento: 'Isso desperta interesse e facilita o agendamento da conversa.',
    cards: ['Ansiedade', 'Estresse', 'Bem-estar emocional'],
    labelPaciente: 'cliente',
    tituloSecaoCards: 'Avaliações usadas por psicólogos',
    tituloSecaoCardsDesc: 'Psicólogos usam avaliações como:',
  },
  odonto: {
    avaliacao: 'Sua saúde bucal pode precisar de atenção?',
    perfil: 'Possível necessidade de avaliação preventiva',
    explicacao: 'Sinais que indicam que uma avaliação odontológica pode trazer orientação.',
    sinais: ['sensibilidade nos dentes', 'gengivas sensíveis', 'interesse em cuidados preventivos'],
    mensagem: 'Vi o resultado da avaliação. Gostaria de agendar uma consulta para avaliar melhor.',
    sugestao: 'Esse resultado sugere que uma avaliação odontológica pode ajudar.',
    fraseAgendamento: 'Isso desperta interesse e facilita o agendamento da consulta.',
    cards: ['Saúde bucal', 'Prevenção', 'Tratamentos'],
    labelPaciente: 'paciente',
    tituloSecaoCards: 'Avaliações usadas por dentistas',
    tituloSecaoCardsDesc: 'Dentistas usam avaliações como:',
  },
  estetica: {
    avaliacao: 'Sua pele pode estar pedindo mais cuidados?',
    perfil: 'Rotina de cuidados insuficiente',
    explicacao: 'Indicativos que ajudam a direcionar para o procedimento mais adequado.',
    sinais: ['sinais de desidratação', 'pele sem viço', 'rotina irregular de cuidados'],
    mensagem: 'Vi o resultado da avaliação. Você poderia me orientar sobre tratamento?',
    sugestao: 'Esse resultado sugere que uma avaliação pode ajudar a escolher o procedimento ideal.',
    fraseAgendamento: 'Isso desperta interesse e facilita o agendamento.',
    cards: ['Pele', 'Procedimentos', 'Rotina de cuidados'],
    labelPaciente: 'cliente',
    tituloSecaoCards: 'Avaliações usadas por profissionais de estética',
    tituloSecaoCardsDesc: 'Profissionais usam avaliações como:',
  },
  fitness: {
    avaliacao: 'Você está pronto para começar a treinar?',
    perfil: 'Interesse em treino personalizado',
    explicacao: 'Perfil que se beneficia de uma avaliação para montar o plano ideal.',
    sinais: ['objetivo de ganhar massa ou emagrecer', 'disposição para mudar hábitos', 'interesse em acompanhamento'],
    mensagem: 'Gostaria de saber como funciona o treino. Posso agendar uma avaliação?',
    sugestao: 'Esse resultado sugere que um treino personalizado pode ajudar.',
    fraseAgendamento: 'Isso desperta interesse e facilita o agendamento da avaliação.',
    cards: ['Treino', 'Objetivos', 'Condicionamento'],
    labelPaciente: 'aluno',
    tituloSecaoCards: 'Avaliações usadas por profissionais de fitness',
    tituloSecaoCardsDesc: 'Profissionais usam avaliações como:',
  },
  perfumaria: {
    avaliacao: 'Qual fragrância combina com seu perfil?',
    perfil: 'Preferência por notas florais',
    explicacao: 'Perfil olfativo que orienta a recomendação das fragrâncias ideais.',
    sinais: ['gosta de fragrâncias suaves', 'ocasião: dia a dia', 'interesse em descobrir novas fragrâncias'],
    mensagem: 'Adorei o resultado! Quais fragrâncias vocês recomendam?',
    sugestao: 'Esse resultado sugere fragrâncias que podem combinar com o perfil.',
    fraseAgendamento: 'Isso desperta interesse e facilita a conversa.',
    cards: ['Perfil olfativo', 'Ocasiões', 'Preferências'],
    labelPaciente: 'cliente',
    tituloSecaoCards: 'Avaliações usadas em perfumaria',
    tituloSecaoCardsDesc: 'Consultores usam avaliações como:',
  },
  seller: {
    avaliacao: 'Qual solução pode atender sua necessidade?',
    perfil: 'Interesse em solução personalizada',
    explicacao: 'Perfil que indica momento e interesse para uma conversa qualificada.',
    sinais: ['necessidade específica identificada', 'momento de decisão próximo', 'interesse em conhecer opções'],
    mensagem: 'Gostaria de saber mais sobre as opções. Podemos conversar?',
    sugestao: 'Esse resultado sugere que uma conversa pode ajudar a encontrar a solução ideal.',
    fraseAgendamento: 'Isso desperta interesse e facilita a conversa.',
    cards: ['Necessidade', 'Momento de compra', 'Perfil'],
    labelPaciente: 'cliente',
    tituloSecaoCards: 'Avaliações usadas por vendedores',
    tituloSecaoCardsDesc: 'Vendedores usam avaliações como:',
  },
  coach: {
    avaliacao: 'Você está pronto para uma transformação?',
    perfil: 'Momento de mudança',
    explicacao: 'Possíveis sinais de disposição para mudar hábitos e buscar autoconhecimento.',
    sinais: ['disposição para mudar hábitos', 'interesse em autoconhecimento', 'busca por equilíbrio'],
    mensagem: 'Achei interessante esse resultado. Como funciona o processo?',
    sugestao: 'Esse resultado sugere que um processo de coaching pode ajudar.',
    fraseAgendamento: 'Isso gera curiosidade e abre espaço para iniciar uma conversa.',
    cards: ['Transformação', 'Bem-estar', 'Equilíbrio'],
    labelPaciente: 'cliente',
    tituloSecaoCards: 'Avaliações usadas por coaches',
    tituloSecaoCardsDesc: 'Coaches usam avaliações como:',
  },
}
