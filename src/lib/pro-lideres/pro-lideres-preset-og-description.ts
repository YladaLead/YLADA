/**
 * Texto curto para Open Graph / WhatsApp (meta description em `/l/[slug]`).
 * Separado do `page.subtitle` (objetivo técnico + contexto Pro Líderes).
 */
import { WELLNESS_HYPE_MEUS_LINKS } from '@/lib/wellness/wellness-hype-meus-links'

const HYPE_OG_BY_FLUXO_ID: Record<string, string> = Object.fromEntries(
  WELLNESS_HYPE_MEUS_LINKS.map((item) => [item.slug, item.description])
) as Record<string, string>

/** Vendas Wellness — quizzes (curiosidade + promessa leve, sem jargão técnico). */
const SALES_WELLNESS_OG_BY_ID: Record<string, string> = {
  'energia-matinal':
    'Sua manhã começa no automático ou já no cansaço? Responda em poucos minutos e veja o que isso diz sobre sua energia ao acordar.',
  'energia-tarde':
    'Aquela queda depois do almoço te puxa para baixo? Descubra em poucos minutos o que suas respostas revelam sobre sua tarde.',
  'troca-cafe':
    'Você depende de café para “funcionar”? Responda e veja um primeiro perfil sobre estímulo, ritmo e alternativas.',
  'anti-cansaco':
    'Cansaço que vira pano de fundo do dia? Faça o teste e veja um primeiro sinal do que pode estar por trás — em poucos minutos.',
  'rotina-puxada':
    'Sua rotina está puxando mais do que você aguenta? Responda e descubra um primeiro recorte do seu perfil de desgaste.',
  'foco-concentracao':
    'Foco sumindo no meio do expediente? Em poucos minutos você vê um primeiro mapa do seu perfil de concentração.',
  'motoristas':
    'Dirigir muito muda sono, postura e disposição? Responda e veja o que suas respostas sugerem sobre o seu dia a dia.',
  'metabolismo-lento':
    'Sensação de corpo “lento” ou resultado que demora? Descubra em poucos minutos um primeiro perfil para conversar com calma.',
  'avaliacao-perfil-metabolico':
    'Quer entender seu metabolismo sem complicação? Responda e receba um primeiro perfil — rápido e só seu.',
  'barriga-pesada':
    'Barriga pesada ou incomodando mais do que deveria? Faça o teste e veja um primeiro sinal do que suas respostas mostram.',
  'retencao-inchaço':
    'Inchaço ou retenção incomodando sua rotina? Em poucos minutos você vê um primeiro perfil para abrir a conversa certa.',
  'desconforto-pos-refeicao':
    'Desconforto depois de comer virou comum? Responda e descubra um primeiro recorte do seu perfil digestivo.',
  'inchaço-manha':
    'Acordar inchado(a) ou “pesado(a)” diz algo sobre o seu corpo. Responda e veja um primeiro perfil em minutos.',
  'ansiedade-doce':
    'Doce na ansiedade ou compulsão no fim do dia? Faça o teste e veja o que suas respostas revelam sobre esse padrão.',
  'mente-cansada':
    'Cérebro em curto-circuito no fim do dia? Descubra em poucos minutos um primeiro perfil de fadiga mental.',
  'falta-disposicao-treinar':
    'Quer treinar mas o corpo não acompanha? Responda e veja um primeiro sinal sobre disposição e rotina.',
  'trabalho-noturno':
    'Trabalhar à noite mexe com energia e sono? Em poucos minutos você vê um primeiro perfil do seu ritmo.',
  'rotina-estressante':
    'Estresse virou companhia diária? Faça o teste e descubra um primeiro recorte do que isso faz com você.',
  'maes-ocupadas':
    'Correria, filhos e energia no limite? Responda e veja um primeiro perfil pensado para quem vive nesse ritmo.',
  'fim-tarde-sem-energia':
    'O fim do dia chega e a energia some? Descubra em poucos minutos o que suas respostas mostram sobre esse padrão.',
  sedentarismo:
    'Pouco movimento e corpo pesado? Responda e veja um primeiro perfil — um passo simples para retomar disposição.',
  'calc-hidratacao':
    'Quanto de água faz sentido para você hoje? Em poucos minutos você vê uma primeira leitura com base nas suas respostas.',
  agua: 'Quanto de água faz sentido para você hoje? Em poucos minutos você vê uma primeira leitura com base nas suas respostas.',
  'calc-calorias':
    'Quer uma referência calórica sem achismo? Responda e veja um primeiro cenário com base no seu perfil.',
  'calc-proteina':
    'Proteína na rotina: falta ou excesso? Descubra em poucos minutos uma primeira leitura para conversar com quem te enviou o link.',
  'calc-imc':
    'Seu IMC é só um número — o contexto é seu. Faça a calculadora e veja um primeiro panorama em poucos minutos.',
}

/** Recrutamento — quizzes de entrada (mesmo questionário, ângulos diferentes). */
const RECRUITMENT_QUIZ_OG_BY_ID: Record<string, string> = {
  'quiz-recrut-ganhos-prosperidade':
    'Quanto da sua vida financeira conversa com o que você quer viver? Responda e veja um primeiro perfil — sem compromisso.',
  'quiz-recrut-potencial-crescimento':
    'Onde está seu potencial hoje — e o que falta para acelerar com segurança? Descubra em poucos minutos.',
  'quiz-recrut-proposito-equilibrio':
    'Tempo, propósito e equilíbrio: o que está em jogo para você? Responda e veja um primeiro mapa para conversar no seu ritmo.',
}

/** Recrutamento — fluxos clássicos (curiosidade + conversa, sem promessa vazia). */
const RECRUITMENT_CLASSIC_OG_BY_ID: Record<string, string> = {
  'renda-extra-imediata':
    'Renda extra sem complicar a vida: será que esse perfil combina com você? Responda em poucos minutos e descubra.',
  'maes-trabalhar-casa':
    'Mães em busca de flexibilidade: veja em poucos minutos um primeiro perfil e o que faz sentido explorar com calma.',
  'perderam-emprego-transicao':
    'Em transição e precisando de recomeço? Responda e veja um primeiro sinal do perfil que mais se aproxima do seu momento.',
  'transformar-consumo-renda':
    'Transformar o que você já consome em oportunidade faz sentido para você? Descubra em poucos minutos.',
  'jovens-empreendedores':
    'Jovem, digital e com vontade de crescer? Faça o teste e veja um primeiro recorte do seu perfil de empreendedor.',
  'ja-consome-bem-estar':
    'Você já cuida do bem-estar — e isso pode ser uma porta. Responda e veja o que suas respostas sugerem sobre o próximo passo.',
  'trabalhar-apenas-links':
    'Trabalhar só com links e indicações combina com seu jeito? Em poucos minutos você vê um primeiro perfil.',
  'ja-usa-energia-acelera':
    'Já usa produtos de energia e quer acelerar resultados? Responda e descubra um primeiro alinhamento de perfil.',
  'cansadas-trabalho-atual':
    'Cansada do trabalho atual e buscando outra forma de viver? Faça o teste e veja um primeiro mapa — no seu ritmo.',
  'ja-tentaram-outros-negocios':
    'Já tentou outros negócios e quer algo mais simples? Responda e veja o que suas respostas mostram sobre seu perfil agora.',
  'querem-trabalhar-digital':
    'Trabalhar 100% digital: sonho ou realidade para você? Descubra em poucos minutos um primeiro perfil.',
  'ja-empreendem':
    'Já empreende e quer expansão com menos atrito? Responda e veja um primeiro sinal do que conversar a seguir.',
  'querem-emagrecer-renda':
    'Cuidar do corpo e explorar renda: como separar com clareza? Faça o teste e veja um primeiro perfil.',
  'boas-venda-comercial':
    'Você comunica bem e gosta de gente — isso abre portas. Responda e descubra em poucos minutos um primeiro perfil.',
}

export function buildProLideresPresetOgDescription(input: {
  fluxoId: string
  kind: 'sales' | 'recruitment'
  nome: string
}): string {
  const { fluxoId, kind, nome } = input
  const nomeTrim = nome.trim()

  if (kind === 'recruitment') {
    const q = RECRUITMENT_QUIZ_OG_BY_ID[fluxoId]
    if (q) return q
    const c = RECRUITMENT_CLASSIC_OG_BY_ID[fluxoId]
    if (c) return c
    return `Em poucos minutos você vê um primeiro perfil em “${nomeTrim}” — e pode conversar no seu ritmo com quem te enviou o link.`
  }

  const hype = HYPE_OG_BY_FLUXO_ID[fluxoId]
  if (hype) return hype

  const sales = SALES_WELLNESS_OG_BY_ID[fluxoId]
  if (sales) return sales

  return `Responda em poucos minutos e descubra um primeiro sinal sobre “${nomeTrim}”. É simples, personalizado e ajuda a abrir a conversa com quem te enviou o link.`
}
