/**
 * Texto da primeira tela dos fluxos de RECRUTAMENTO — para quem CLICOU no link (lead).
 * Usado em Coach de bem-estar (`FluxoDiagnosticoCoach`) e Pro Líderes (`/l/[slug]`).
 *
 * Regra: 2ª pessoa ("você"), curiosidade sobre renda/perfil — nunca instrução ao distribuidor
 * ("identificar pessoas", "conectar com", "direcioná-las").
 */
export const RECRUITMENT_FLUXO_PUBLIC_INTRO: Record<string, string> = {
  'renda-extra-imediata':
    'Você está pensando em ganhar uma renda extra, sem abrir mão do que já faz hoje? Responda algumas perguntas rápidas e veja se esse caminho combina com você.',
  'transformar-consumo-renda':
    'Você já cuida da saúde e do bem-estar no dia a dia? Descubra se dá para transformar esse hábito em uma forma de renda extra.',
  'maes-trabalhar-casa':
    'Você é mãe e gostaria de trabalhar de casa, no seu ritmo? Veja se esse modelo encaixa na sua rotina.',
  'ja-consome-bem-estar':
    'Você já consome produtos de bem-estar e saúde? Veja se faz sentido explorar uma forma de renda alinhada ao que você já usa no dia a dia.',
  'ja-usa-energia-acelera':
    'Você já usa produtos de energia e disposição no dia a dia? Descubra se dá para transformar esse hábito em uma oportunidade de renda extra.',
  'perderam-emprego-transicao':
    'Passando por uma mudança no trabalho ou buscando um novo caminho? Algumas perguntas para entender o que faz sentido para você agora.',
  'cansadas-trabalho-atual':
    'Cansada(o) da rotina de sempre e pensando em uma renda a mais, com mais liberdade? Este quiz é para você.',
  'trabalhar-apenas-links':
    'Prefere trabalhar pelo celular, sem estoque e sem precisar sair vendendo de porta em porta? Veja se esse formato combina com você.',
  'ja-tentaram-outros-negocios':
    'Já tentou empreender antes e não deu certo? Responda com calma — o objetivo é entender se este caminho é diferente do que você já viveu.',
  'querem-trabalhar-digital':
    'Quer trabalhar 100% online, no seu tempo e com mais privacidade? Algumas perguntas para ver se isso combina com você.',
  'ja-empreendem':
    'Já tem um negócio e pensa em uma renda extra que encaixe no que você já faz? Veja se faz sentido para o seu momento.',
  'querem-emagrecer-renda':
    'Quer emagrecer, cuidar da saúde e ainda busca uma renda extra? Descubra se os dois objetivos podem caminhar juntos.',
  'boas-venda-comercial':
    'Você gosta de conversar, indicar e ajudar pessoas? Veja se um trabalho flexível no digital combina com o seu perfil.',
  'jovens-empreendedores':
    'Jovem e pensando em independência financeira cedo? Algumas perguntas para entender seu momento e seus objetivos.',
  'quiz-recrut-ganhos-prosperidade':
    'Como está sua relação com renda e prosperidade hoje? Responda em poucos minutos e receba uma leitura personalizada.',
  'quiz-recrut-proposito-equilibrio':
    'Propósito e equilíbrio entre vida e trabalho importam para você? Este quiz ajuda a clarear onde você está.',
  'quiz-recrut-potencial-crescimento':
    'Quer crescer profissionalmente no seu ritmo? Algumas perguntas para entender seu potencial e seus próximos passos.',
}

const COACH_FACING_OBJETIVO =
  /^(identificar|conectar com|alcançar)\s+pessoas|direcioná-l|apresentação de negócio|mostrar que o projeto|mesmas perguntas do quiz|entrada temática|com leitura estratégica das inteligências/i

export function isCoachFacingRecruitmentObjetivo(text: string): boolean {
  const t = text.trim()
  if (!t) return true
  return COACH_FACING_OBJETIVO.test(t)
}

/** Subtítulo da intro pública por `fluxo_id`. */
export function getRecruitmentFluxoPublicIntro(
  fluxoId: string,
  options?: { nome?: string; fallbackObjetivo?: string }
): string {
  const id = fluxoId.trim()
  const mapped = RECRUITMENT_FLUXO_PUBLIC_INTRO[id]
  if (mapped) return mapped

  const fallback = (options?.fallbackObjetivo || '').trim()
  if (
    fallback.length >= 20 &&
    !isCoachFacingRecruitmentObjetivo(fallback) &&
    !/noel|pro.?líderes|inteligências/i.test(fallback)
  ) {
    return fallback
  }

  const nome = options?.nome?.trim()
  if (nome) {
    return `Responda em poucos minutos e veja se “${nome}” combina com o seu momento — sem compromisso e no seu ritmo.`
  }

  return 'Responda em poucos minutos e veja uma leitura personalizada sobre o seu perfil e seus objetivos.'
}

/** IDs de recrutamento clássicos + quizzes (Pro Líderes completo). */
export const RECRUITMENT_FLUXO_IDS_ALL = [
  'quiz-recrut-ganhos-prosperidade',
  'quiz-recrut-proposito-equilibrio',
  'quiz-recrut-potencial-crescimento',
  'renda-extra-imediata',
  'transformar-consumo-renda',
  'maes-trabalhar-casa',
  'ja-consome-bem-estar',
  'perderam-emprego-transicao',
  'cansadas-trabalho-atual',
  'trabalhar-apenas-links',
  'ja-usa-energia-acelera',
  'ja-tentaram-outros-negocios',
  'querem-trabalhar-digital',
  'ja-empreendem',
  'querem-emagrecer-renda',
  'boas-venda-comercial',
  'jovens-empreendedores',
] as const
