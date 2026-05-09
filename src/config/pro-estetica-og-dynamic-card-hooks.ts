/**
 * Copy **só** para o cartão OG gerado em `/l/[slug]/opengraph-image` (pré-visualização WhatsApp / redes).
 * Não altera título do fluxo, `config_json` nem migrações — ajusta aqui o texto que aparece **na imagem**.
 *
 * Chaves = stem do ficheiro em `pro-estetica-corporal` / `pro-estetica-capilar` (sem `.jpg`/`.png`), alinhado a `ylada-link-og-image-bank.ts`.
 */
import {
  PRO_ESTETICA_CAPILAR_OG_IMAGE_BANK,
  PRO_ESTETICA_CORPORAL_OG_IMAGE_BANK,
} from '@/config/ylada-link-og-image-bank'
import type { ProEsteticaDiagnosisVertical } from '@/lib/pro-estetica/pro-estetica-public-link-og'

export type ProEsteticaOgDynamicCardLines = {
  headline: string
  subline: string
}

const SUBLINE_CORPORAL =
  'Toque no link — check-up guiado em minutos e um primeiro recorte pro seu corpo.'

const SUBLINE_CAPILAR =
  'Toque no link — check-up guiado em minutos, foco em fios e couro cabeludo.'

/** Headlines pensadas para prévia (gancho), não cópia literal do painel. */
const CORPORAL_OG_HOOKS: [string, string][] = [
  ['agua-dia-a-dia-quanto-corpo-precisa', 'Água no dia a dia: quanto o corpo pede sem drama?'],
  ['calorias-diarias-alinhe-energia-objetivo-corporal', 'Calorias no radar: alinhe energia ao objetivo corporal.'],
  ['imc-contexto-primeiro-passo-esteticista', 'IMC com contexto: veja o primeiro passo com clareza.'],
  ['proteina-diaria-base-definicao-recuperacao', 'Proteína no prato: base pra definição e recuperação.'],
  ['hidratacao-treino-clima-meta-copos', 'Hidratação + treino + clima: meta de copos que cabe na rotina.'],
  ['retencao-liquido-corpo-sinais', 'Retenção de líquido: sinais que o corpo já mostrou.'],
  ['pele-cuidados-certos', 'Pele do corpo: cuidados certos vs. “mais do mesmo”.'],
  ['celulite-o-que-revela-sobre-corpo', 'Celulite: o que ela revela sobre o seu corpo hoje?'],
  ['pele-realmente-hidratada', 'Pele corporal: hidratação de verdade ou só sensação?'],
  ['sinais-flacidez-ainda-nao-percebeu', 'Flacidez: sinais que passam despercebidos no espelho.'],
  ['descubra-protocolo-corporal-ideal', 'Protocolo corporal ideal: descubra o encaixe pro seu perfil.'],
  ['qual-zona-corpo-atencao-primeiro', 'Qual zona do corpo merece atenção primeiro?'],
  ['corpo-desinchar-definir-tecnologia-primeiro', 'Desinchar ou definir: qual tecnologia entra primeiro?'],
  ['gordura-localizada-ou-retencao-caminho', 'Gordura localizada ou retenção: qual caminho faz sentido?'],
  ['quantas-sessoes-meta-contorno', 'Sessões até a meta: contorno com expectativa realista.'],
  ['protocolo-corporal-certo-ou-misturando', 'Protocolo corporal: tá certo ou misturando demais?'],
  ['tratamento-ajudando-resultado', 'Tratamento corporal: tá ajudando o resultado que você quer?'],
  ['corpo-mais-inchado-do-que-deveria', 'Corpo mais inchado do que deveria? Veja o recorte em minutos.'],
  ['qual-massagem-corpo-precisa', 'Qual massagem o seu corpo pede agora?'],
  ['drenagem-linfatica-faz-sentido-corpo', 'Drenagem linfática: faz sentido pro seu corpo hoje?'],
  ['massagem-modeladora-expectativa-realista', 'Massagem modeladora: expectativa alinhada ao corpo real.'],
  ['criolipolise-prontidao-duvidas-consulta', 'Criolipólise: prontidão e dúvidas antes da consulta.'],
  ['radiofrequencia-corporal-firmeza-textura', 'Radiofrequência corporal: firmeza e textura no foco.'],
  ['ultrassom-corporal-onde-entra-objetivo', 'Ultrassom corporal: onde entra no seu objetivo?'],
  ['lipocavitacao-indicacao-expectativa-perfil', 'Lipocavitação: indicação e expectativa pro seu perfil.'],
  ['endermologia-textura-circulacao-contorno', 'Endermologia: textura, circulação e contorno em jogo.'],
  ['celulite-flacidez-atacar-primeiro', 'Celulite e flacidez: o que atacar primeiro com calma?'],
  ['gordura-localizada-primeiro-passo-esteticista', 'Gordura localizada: primeiro passo com esteticista.'],
  ['detox-corporal-rotina-sensacao-clinica', 'Detox corporal: rotina, sensação e clínica na mesma conversa.'],
  ['black-peel-peeling-hollywood-pele-objetivo', 'Black peel / Hollywood: pele e objetivo sem promessa vazia.'],
  ['despigmentacao-tatuagem-micro-labios-expectativa', 'Despigmentação, tatuagem, micro: expectativa alinhada.'],
  ['clareamento-intimo-axilas-proximo-passo-seguro', 'Clareamento íntimo/axilas: próximo passo com segurança.'],
  ['clareamento-virilha-proximo-passo-seguro', 'Clareamento de virilha: próximo passo com segurança.'],
]

const CAPILAR_OG_HOOKS: [string, string][] = [
  ['cabelo-queda', 'Queda de cabelo: veja o que mais pesa na sua rotina agora.'],
  ['cabelo-tipo-fio', 'Tipo de fio: descubra o cuidado que realmente combina.'],
  ['couro-cabeludo', 'Couro cabeludo: check rápido antes de gastar com produto errado.'],
  ['cabelo-hidratacao', 'Hidratação capilar: brilho de verdade ou só “efeito espelho”?'],
  ['cabelo-tintura', 'Tintura nos fios: cor bonita sem sacrificar saúde?'],
  ['falhas-entradas-cabelo', 'Falhas e entradas: entenda o padrão sem medo de perguntar.'],
  ['caspa-coceira-couro', 'Caspa e coceira: couro pedindo socorro — por onde começar?'],
  ['oleosidade-couro-fios', 'Oleosidade: couro e fios no mesmo radar, sem confusão.'],
  ['fios-fracos-quebradicos', 'Fios fracos e quebradiços: rotina que fortalece de verdade.'],
  ['crescimento-capilar-lento', 'Crescimento lento: o que travar costuma ser surpreendente.'],
  ['pos-parto-hormonal-cabelo', 'Pós-parto e hormonal: cabelo em transição com direcionamento.'],
  ['estresse-queda-capilar', 'Estresse e queda: conecte sintomas sem dramatizar.'],
  ['danos-quimicos-capilar', 'Danos químicos: recuperação com passos claros.'],
  ['couro-sensivel-inflamacao', 'Couro sensível: inflamação leve exige escuta fina.'],
  ['potencial-crescimento-comprimento', 'Crescimento e comprimento: potencial real vs. modinha.'],
  ['fortalecimento-preventivo-fios', 'Fortalecimento preventivo: antes da queda acelerar.'],
  ['terapia-capilar-preventiva', 'Terapia preventiva: investimento no que sustenta o fio.'],
  ['checkin-saude-couro-cabeludo', 'Check-in do couro: saúde capilar em poucos minutos.'],
  ['pos-quimica-recuperacao', 'Pós-química: recuperação com expectativa honesta.'],
  ['rotina-salao-casa-alinhada', 'Salão + casa: rotina que conversa entre si.'],
  ['detox-capilar-expectativa', 'Detox capilar: expectativa alinhada ao que o fio aguenta.'],
  ['saude-real-fios-brilho', 'Saúde real dos fios: brilho que sustenta, não só “luz”.'],
  ['qual-terapia-capilar-hub', 'Qual terapia capilar faz sentido pra você hoje?'],
  ['microagulhamento-capilar', 'Microagulhamento: onde entra no seu objetivo capilar?'],
  ['laser-capilar', 'Laser capilar: candidatura e resultado sem achismo.'],
  ['led-capilar', 'LED capilar: frequência, constância e resultado esperado.'],
  ['ozonioterapia-capilar', 'Ozonioterapia: benefício real vs. moda de salão.'],
  ['argila-oleos-capilar', 'Argila e óleos: blend que respeita couro e fio.'],
  ['alta-frequencia-capilar', 'Alta frequência: indicação e sensação na hora certa.'],
  ['detox-profundo-salao', 'Detox profundo no salão: quando vale a pena investir.'],
  ['terapia-combinada-capilar', 'Terapia combinada: ordem e tempo fazem diferença.'],
  ['mitos-queda-capilar', 'Mitos sobre queda: desmistifique em poucos toques.'],
  ['erros-rotina-capilar', 'Erros de rotina: ajustes simples com impacto grande.'],
  ['produtos-uso-errado', 'Produtos no cabelo: uso errado que sabotar resultados.'],
  ['frequencia-lavagem-capilar', 'Frequência de lavagem: menos não é sempre mais.'],
  ['habitos-prejudicam-fios', 'Hábitos silenciosos: o que prejudica o fio sem avisar.'],
  ['inflamacao-couro-educativo', 'Inflamação do couro: leitura educativa, sem pânico.'],
  ['hormonios-cabelo-educativo', 'Hormônios e cabelo: contexto claro pra conversar com profissional.'],
  ['tres-sinais-atencao-couro', 'Três sinais no couro: atenção antes de piorar.'],
  ['queda-sazonal-capilar', 'Queda sazonal: é fase ou precisa de olhar clínico?'],
  ['pos-verao-capilar', 'Pós-verão: sol, cloro e piscina no mesmo balanço.'],
  ['pos-progressiva-alisamento', 'Pós-progressiva/alisamento: recuperação com prioridade certa.'],
  ['menopausa-cabelo', 'Menopausa e cabelo: mudanças que dá pra navegar com apoio.'],
  ['fim-ano-estresse-capilar', 'Fim de ano e estresse: cabelo no reflexo da rotina.'],
  ['masculino-entradas-capilar', 'Entradas masculinas: abordagem direta e sem tabu.'],
]

const CORP_HOOK_MAP = new Map(CORPORAL_OG_HOOKS)
const CAP_HOOK_MAP = new Map(CAPILAR_OG_HOOKS)

export function proEsteticaOgAssetStem(
  vertical: ProEsteticaDiagnosisVertical,
  templateId: string | null | undefined,
): string | null {
  const tid = typeof templateId === 'string' ? templateId.trim() : ''
  if (!tid) return null
  const bank =
    vertical === 'capilar' ? PRO_ESTETICA_CAPILAR_OG_IMAGE_BANK : PRO_ESTETICA_CORPORAL_OG_IMAGE_BANK
  const file = bank.byTemplateId[tid]
  if (!file) return null
  return file.replace(/\.(png|jpe?g)$/i, '').trim() || null
}

export function getProEsteticaOgDynamicCardLines(input: {
  vertical: ProEsteticaDiagnosisVertical
  templateId: string | null | undefined
  linkTitle: string
}): ProEsteticaOgDynamicCardLines {
  const stem = proEsteticaOgAssetStem(input.vertical, input.templateId)
  const sub = input.vertical === 'capilar' ? SUBLINE_CAPILAR : SUBLINE_CORPORAL
  const map = input.vertical === 'capilar' ? CAP_HOOK_MAP : CORP_HOOK_MAP
  if (stem) {
    const headline = map.get(stem)
    if (headline) return { headline, subline: sub }
  }
  const raw = (input.linkTitle || '').trim()
  const short = raw.length > 64 ? `${raw.slice(0, 61)}…` : raw
  return {
    headline: short || (input.vertical === 'capilar' ? 'Check-up capilar guiado' : 'Check-up corporal guiado'),
    subline: sub,
  }
}
