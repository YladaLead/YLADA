/**
 * Casos: wiring do advisory do Recomendador na rota do Noel.
 * Cobre o mapa de segmento (Coach de bem-estar) e o wiring do membro de campo.
 * Rodar: npx tsx src/lib/ylada-flow/recomendador/noel-wiring.casos.ts
 */
import {
  construirCriterioNoel,
  construirCriterioMembro,
  recomendarParaNoel,
  buildRecomendacaoCuradaBlockMembro,
} from './noel-wiring'

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error('FAIL:', msg)
    process.exit(1)
  }
  console.log('OK:', msg)
}

// 1) Mapa de segmento: Coach de bem-estar casa o nicho curado; estética não casa.
{
  const crit = construirCriterioNoel({ message: 'quero um quiz de energia', segment: 'coach-bem-estar' })
  assert(crit !== null && crit.nicho === 'pro-lideres', "segment 'coach-bem-estar' → nicho 'pro-lideres'")

  const semNicho = construirCriterioNoel({ message: 'quero um quiz', segment: 'estetica' })
  assert(semNicho === null, "segment 'estetica' (sem nicho curado) → null (cai na geração)")
}

// 2) Critério do membro: oportunidade fixa finalidade recrutamento; cliente fica livre.
{
  const opo = construirCriterioMembro({ message: 'convidar pra oportunidade', audience: 'oportunidade' })
  assert(opo.nicho === 'pro-lideres', 'membro: nicho fixo pro-lideres')
  assert(opo.finalidade === 'recrutamento', 'membro oportunidade → finalidade recrutamento')

  const cli = construirCriterioMembro({ message: 'minha cliente quer melhorar', audience: 'cliente' })
  assert(cli.finalidade === undefined, 'membro cliente → finalidade livre (intenção rankeia)')

  const amb = construirCriterioMembro({ message: 'tenho uns nomes', audience: 'ambiguo' })
  assert(amb.finalidade === undefined, 'membro ambíguo → finalidade livre')
}

// 3) Recomendação do membro acompanha a audiência (lookup determinístico).
{
  const rec = recomendarParaNoel(
    construirCriterioMembro({ message: 'quero convidar alguém pra renda extra', audience: 'oportunidade' }),
  )
  assert(rec !== null, 'membro oportunidade/renda → tem recomendação')
  assert(rec!.fluxo.dimensoes.finalidade === 'recrutamento', 'oportunidade → fluxo de recrutamento')
  assert(rec!.fluxo.dimensoes.nicho === 'pro-lideres', 'recomendação respeita o nicho curado')

  const recCli = recomendarParaNoel(
    construirCriterioMembro({ message: 'minha cliente vive sem energia, muito cansada', audience: 'cliente' }),
  )
  assert(recCli !== null, 'membro cliente/energia → tem recomendação')
  assert(recCli!.fluxo.dimensoes.finalidade !== 'recrutamento', 'cliente não cai em recrutamento')
}

// 4) Bloco do membro: cita o fluxo, defere a Meus links, NUNCA fabrica URL.
{
  const rec = recomendarParaNoel(
    construirCriterioMembro({ message: 'renda extra', audience: 'oportunidade' }),
  )
  const bloco = buildRecomendacaoCuradaBlockMembro(rec!)
  assert(bloco.includes(rec!.fluxo.nome), 'bloco cita o nome do fluxo')
  assert(/meus links/i.test(bloco), 'bloco defere o link a "Meus links"')
  assert(/n[ãa]o invente url/i.test(bloco), 'bloco proíbe inventar URL')
  assert(!/https?:\/\//i.test(bloco), 'bloco não contém URL fabricada')
}

console.log('\nTODOS OS CASOS PASSARAM — wiring advisory (Coach de bem-estar + membro).')
