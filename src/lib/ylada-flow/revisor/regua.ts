// =====================================================
// REVISOR — A RÉGUA VIRADA CÓDIGO (Chat 8, tijolo 1)
// =====================================================
//
// Fonte: blueprint-plataforma/Regua_Qualidade_Diagnosticos.md (§2–§7) +
//        Spec_Fundacao_Ylada_Grau1.md §4.2/§8/§12.
//
// O QUE É: a rubrica da Régua (§7: passa / morno / reprova) aplicada a um YladaFlow,
// parte por parte (abertura · perguntas · devolutiva · linguagem · salvaguarda). É a
// BASE do revisor que o Chat 8/9 vai rodar em escala. Aqui só a RÉGUA, determinística.
//
// HONESTIDADE (decisão de design): o código só EMITE veredito (passa/morno/reprova) no
// que dá pra checar com certeza — estrutura (campos presentes, papel declarado, ordem),
// e anti-vícios objetivos (promessa de renda, pressão, travessão, jargão, salvaguarda por
// finalidade). O que depende de TOM (espelho concreto, provoca sem constranger, causa que
// alivia) NÃO é decidido por regex — vira `precisaRevisaoHumana`, que o revisor (LLM) e a
// curadoria humana resolvem (Spec §8). Assim a régua não dá falso "passou" no que ela não
// consegue medir, nem reprova bom texto por engano.
//
// CUSTO: determinístico — zero LLM, zero DB. (Spec §9: o revisor-base é barato; o LLM só
// entra pra PROPOR a versão afiada do que ficou morno, num passo seguinte.)
//
// STATUS: adição pura. Nada importa este módulo ainda — risco zero, inerte.
// =====================================================

import type { YladaFlow, BlocoDevolutiva } from '@/types/ylada-flow'

// -----------------------------------------------------
// 1. Tipos do laudo.
// -----------------------------------------------------

export type Veredito = 'passa' | 'morno' | 'reprova'

export type ParteDiagnostico =
  | 'abertura'
  | 'perguntas'
  | 'devolutiva'
  | 'linguagem'
  | 'salvaguarda'

export interface NotaParte {
  parte: ParteDiagnostico
  veredito: Veredito
  /** achados determinísticos que fixaram o veredito (o porquê). */
  motivos: string[]
  /** pontos de TOM que o código não decide — vão pro revisor LLM + curadoria humana. */
  precisaRevisaoHumana: string[]
}

export interface LaudoFluxo {
  fluxoId: string
  /** pior parte manda: reprova > morno > passa (Régua §7 "nota do fluxo inteiro"). */
  veredito: Veredito
  porParte: NotaParte[]
  /** atalho: só migra fluxo que passa inteiro (Régua §7 / Chat 5/6). */
  migravel: boolean
}

// -----------------------------------------------------
// 2. Helpers.
// -----------------------------------------------------

const presente = (s?: string): boolean => typeof s === 'string' && s.trim().length > 0

function pior(a: Veredito, b: Veredito): Veredito {
  const ordem: Record<Veredito, number> = { passa: 0, morno: 1, reprova: 2 }
  return ordem[a] >= ordem[b] ? a : b
}

function consolidar(motivos: { veredito: Veredito; motivo: string }[]): {
  veredito: Veredito
  motivos: string[]
} {
  let v: Veredito = 'passa'
  const ms: string[] = []
  for (const { veredito, motivo } of motivos) {
    v = pior(v, veredito)
    ms.push(`[${veredito}] ${motivo}`)
  }
  return { veredito: v, motivos: ms }
}

/** Junta todo o texto visível do fluxo (pro check de linguagem). */
function textoVisivel(f: YladaFlow): string[] {
  const t: string[] = []
  const ab = f.abertura
  t.push(ab.gancho, ab.baixaFriccao, ab.autoridadeSutil ?? '', ab.ctaUnico, ab.coerenciaOrigem ?? '')
  for (const p of f.perguntas) {
    t.push(p.texto ?? '')
    const opcoes = (p as { opcoes?: unknown }).opcoes
    if (Array.isArray(opcoes)) for (const o of opcoes) t.push(String(o))
  }
  const blocos: BlocoDevolutiva[] = [
    ...Object.values(f.devolutiva.porPerfil),
    ...(f.devolutiva.porFaixa?.map((x) => x.bloco) ?? []),
  ]
  for (const b of blocos) t.push(b.espelho, b.causa, b.primeiroPasso, b.ctaWhatsApp)
  for (const g of f.ganchosIndicacao) t.push(g.frase)
  if (f.calculadora) t.push(f.calculadora.salvaguarda)
  return t.filter(presente)
}

// -----------------------------------------------------
// 3. Régua da Abertura (§2).
// -----------------------------------------------------

function avaliarAbertura(f: YladaFlow): NotaParte {
  const ab = f.abertura
  const achados: { veredito: Veredito; motivo: string }[] = []
  const revisar: string[] = []

  if (!presente(ab.gancho)) achados.push({ veredito: 'reprova', motivo: 'sem gancho (a tela do 1º clique não promete descoberta).' })
  if (!presente(ab.ctaUnico)) achados.push({ veredito: 'reprova', motivo: 'sem CTA único (nada pra clicar).' })
  if (!presente(ab.baixaFriccao)) achados.push({ veredito: 'morno', motivo: 'fricção não está visível (faltou "sem cadastro · X perguntas · 2 min").' })
  if (!presente(ab.autoridadeSutil)) achados.push({ veredito: 'morno', motivo: 'sem autoridade sutil (uma linha que mostra que entende do assunto).' })

  revisar.push('Tom: o gancho é sobre a PESSOA (o que ela descobre) e não sobre o produto? (§2.1)')
  revisar.push('Coerência com a origem: a abertura continua a promessa do anúncio/post? (§2.5)')

  const { veredito, motivos } = consolidar(achados)
  return { parte: 'abertura', veredito, motivos, precisaRevisaoHumana: revisar }
}

// -----------------------------------------------------
// 4. Régua das Perguntas (§3) — regra dura: sem papel, não entra.
// -----------------------------------------------------

function avaliarPerguntas(f: YladaFlow): NotaParte {
  const achados: { veredito: Veredito; motivo: string }[] = []
  const revisar: string[] = []

  if (f.perguntas.length === 0) {
    achados.push({ veredito: 'reprova', motivo: 'fluxo sem perguntas.' })
  }

  f.perguntas.forEach((p, i) => {
    const papel = p.papel
    const temPapel =
      !!papel &&
      ((Array.isArray(papel.alimentaLeitura) && papel.alimentaLeitura.length > 0) ||
        !!papel.separa2080)
    if (!temPapel) {
      // REGRA DURA (§3.1 / Spec §4.2): sem papel declarado, a pergunta não entra.
      achados.push({ veredito: 'reprova', motivo: `pergunta ${i + 1} sem papel declarado (não alimenta leitura nem separa 20/80).` })
    }
    const opcoes = (p as { opcoes?: unknown }).opcoes
    if (Array.isArray(opcoes) && opcoes.length === 1) {
      achados.push({ veredito: 'morno', motivo: `pergunta ${i + 1} com uma opção só (não mede nada).` })
    }
  })

  revisar.push('Tom: cada pergunta PROVOCA enquanto mede (faz a pessoa se ver), ou é formulário frio? (§3.2)')
  revisar.push('Respeito: nenhuma pergunta constrange (renda crua, peso, fracasso)? (§3.3)')
  revisar.push('Ordem que esquenta: começa leve e vai apertando? (§3.4)')

  const { veredito, motivos } = consolidar(achados)
  return { parte: 'perguntas', veredito, motivos, precisaRevisaoHumana: revisar }
}

// -----------------------------------------------------
// 5. Régua da Devolutiva (§4) — estrutura obrigatória.
// -----------------------------------------------------

// CTA "com pergunta na boca" (§4.7): o espírito é dar à pessoa a pergunta pra fazer —
// não exige literalmente o "?". Aceita "?" OU verbo de pedir/perguntar (pergunta como…,
// diz:, chama e fala, pede pra…). Calibragem da "régua viva" (§9) após rodar nos reais.
// Aceita: "?" · verbo de pedir/perguntar (pergunta…, diz:, fala com, chama, peça) ·
// E a frase PRONTA em 1ª pessoa que o lead manda ("Quero entender meu resultado",
// "Me ajuda a…", "Preciso de…") — esse é o formato canônico do handoff (a frase na boca).
const RX_CTA_PERGUNTA = /\?|\bpergunt|\bdiz\s*:|\bfala\s+(com|que)|\bchama\b|\bpe[çc]a\b|\bpede\b|\bquero\b|\bqueria\b|\bme ajuda\b|\bpreciso\b/i

function avaliarBloco(nome: string, b: BlocoDevolutiva): { veredito: Veredito; motivo: string }[] {
  const faltas: string[] = []
  if (!presente(b.espelho)) faltas.push('espelho')
  if (!presente(b.causa)) faltas.push('causa')
  if (!presente(b.primeiroPasso)) faltas.push('1º passo')
  if (!presente(b.ctaWhatsApp)) faltas.push('CTA')
  const out: { veredito: Veredito; motivo: string }[] = []
  if (faltas.length > 0) {
    out.push({ veredito: 'reprova', motivo: `devolutiva "${nome}" sem ${faltas.join(', ')} (estrutura quebrada — §4).` })
  }
  if (presente(b.ctaWhatsApp) && !RX_CTA_PERGUNTA.test(b.ctaWhatsApp)) {
    out.push({ veredito: 'morno', motivo: `devolutiva "${nome}": CTA não puxa pra conversa (§4.7).` })
  }
  return out
}

function avaliarDevolutiva(f: YladaFlow): NotaParte {
  const achados: { veredito: Veredito; motivo: string }[] = []
  const revisar: string[] = []

  for (const [perfil, bloco] of Object.entries(f.devolutiva.porPerfil)) {
    achados.push(...avaliarBloco(perfil, bloco))
  }
  if (f.devolutiva.porFaixa) {
    for (const faixa of f.devolutiva.porFaixa) achados.push(...avaliarBloco(`faixa:${faixa.id}`, faixa.bloco))
  }

  revisar.push('Espelho concreto: a pessoa se reconhece na cena dela ("você trabalha o mês todo…"), não "você tem potencial"? (§4.3)')
  revisar.push('Causa que ALIVIA, não que culpa ("não é falta de esforço, é…")? (§4.4)')
  revisar.push('Varia por perfil: o 20% (pronto) recebe autoridade; o 80% (curioso) recebe serviço? (§4.8)')

  const { veredito, motivos } = consolidar(achados)
  return { parte: 'devolutiva', veredito, motivos, precisaRevisaoHumana: revisar }
}

// -----------------------------------------------------
// 6. Régua da Linguagem (§5) — anti-vícios objetivos.
// -----------------------------------------------------

const RX_PROMESSA_RENDA = /\bganhe?\b|\brenda garantida\b|\bfature\b|\blucre\b|r\$\s?\d|\bganhos? de r\$/i
const RX_PRESSAO = /\b[uú]ltima chance\b|\bs[óo] hoje\b|\bagora ou nunca\b|\b[uú]ltimas vagas\b|contagem regressiva/i
const RX_JARGAO = /\botimiz|\bpotencializ|\bestrat[ée]gic|\bjornada\b|\bmindset\b|\bescal[áa]vel\b/i
const RX_RELATORIO = /\bem resumo\b|\bidentificamos que\b|\bvari[áa]vel estrat[ée]gica\b/i

function avaliarLinguagem(f: YladaFlow): NotaParte {
  const achados: { veredito: Veredito; motivo: string }[] = []
  const revisar: string[] = []
  const textos = textoVisivel(f)
  const ehRecrutamentoOuVendas =
    f.dimensoes.finalidade === 'recrutamento' || f.dimensoes.finalidade === 'vendas'

  const hit = (rx: RegExp): string | null => textos.find((t) => rx.test(t)) ?? null

  const promessa = hit(RX_PROMESSA_RENDA)
  if (promessa && ehRecrutamentoOuVendas) {
    achados.push({ veredito: 'reprova', motivo: `promessa de ganho/renda (§5 anti-vício): "${promessa.slice(0, 60)}".` })
  } else if (promessa) {
    revisar.push(`Possível menção a valor/renda — confirmar que não vira promessa: "${promessa.slice(0, 60)}".`)
  }

  const pressao = hit(RX_PRESSAO)
  if (pressao) achados.push({ veredito: 'reprova', motivo: `pressão agressiva (§5): "${pressao.slice(0, 60)}".` })

  const jargao = hit(RX_JARGAO)
  if (jargao) achados.push({ veredito: 'morno', motivo: `jargão/palavra difícil (§5): "${jargao.slice(0, 60)}".` })

  const relatorio = hit(RX_RELATORIO)
  if (relatorio) achados.push({ veredito: 'morno', motivo: `cara de relatório de IA (§5): "${relatorio.slice(0, 60)}".` })

  const travessao = textos.find((t) => t.includes('—'))
  if (travessao) {
    achados.push({ veredito: 'morno', motivo: `travessão "—" presente (vício de IA, §5.4) — confirmar se é aparte: "${travessao.slice(0, 60)}".` })
  }

  revisar.push('Linguagem popular, frase curta, "você", concreto (cena, não conceito)? (§5)')

  const { veredito, motivos } = consolidar(achados)
  return { parte: 'linguagem', veredito, motivos, precisaRevisaoHumana: revisar }
}

// -----------------------------------------------------
// 7. Régua da Salvaguarda/Governança (§6) — por finalidade.
// -----------------------------------------------------

const GOV_SAUDE = new Set(['CFM', 'ANVISA'])

function avaliarSalvaguarda(f: YladaFlow): NotaParte {
  const achados: { veredito: Veredito; motivo: string }[] = []
  const revisar: string[] = []
  const fin = f.dimensoes.finalidade
  const temGovSaude = f.dimensoes.governanca.some((g) => GOV_SAUDE.has(g))
  const temSalvaguarda = !!f.calculadora && presente(f.calculadora.salvaguarda)

  const ehSaude = fin === 'diagnostico-servico' && temGovSaude
  const ehNegocio = fin === 'vendas' || fin === 'recrutamento'

  if (ehSaude && f.dimensoes.tipo === 'calculadora' && !temSalvaguarda) {
    achados.push({ veredito: 'reprova', motivo: 'finalidade de saúde sem salvaguarda ("caráter orientativo, não substitui avaliação profissional") — §6.' })
  }
  if (ehNegocio && temSalvaguarda) {
    achados.push({ veredito: 'morno', motivo: 'salvaguarda clínica num fluxo de negócio (esfria à toa) — §6.' })
  }

  if (fin === 'recrutamento') {
    revisar.push('Recrutamento (o mais sensível): não expõe situação financeira de forma constrangedora, não promete renda, separa "saúde" de "renda"? (§6)')
  }
  if (fin === 'diagnostico-servico' && temGovSaude) {
    revisar.push('Saúde: orientativo, nunca diagnostica/prescreve; fórmula validada + faixa + unidade certas? (§6 / Spec §12.2)')
  }

  const { veredito, motivos } = consolidar(achados)
  return { parte: 'salvaguarda', veredito, motivos, precisaRevisaoHumana: revisar }
}

// -----------------------------------------------------
// 8. O laudo do fluxo inteiro.
// -----------------------------------------------------

/**
 * Aplica a Régua (§7) a um YladaFlow. Determinístico: emite veredito só no que dá pra
 * checar com certeza; o resto sai como `precisaRevisaoHumana`. Espelho (Sujeito A) tem
 * exceções declaradas — pulamos perguntas-sem-handoff etc. quando a finalidade é o
 * autodiagnóstico de convicção (não é fluxo de lead).
 */
export function avaliarFluxo(f: YladaFlow): LaudoFluxo {
  const ehEspelho = f.dimensoes.finalidade === 'autodiagnostico-conviccao'

  const porParte: NotaParte[] = [
    avaliarAbertura(f),
    avaliarPerguntas(f),
    avaliarDevolutiva(f),
    avaliarLinguagem(f),
  ]
  // Salvaguarda só faz sentido em fluxo de lead (saúde/negócio). O Espelho é Sujeito A.
  if (!ehEspelho) porParte.push(avaliarSalvaguarda(f))

  const veredito = porParte.reduce<Veredito>((acc, p) => pior(acc, p.veredito), 'passa')

  return {
    fluxoId: f.id,
    veredito,
    porParte,
    migravel: veredito === 'passa', // só migra fluxo que passa inteiro (Régua §7).
  }
}

/** Laudo curto pro Noel/curadoria verbalizar. */
export function resumirLaudo(l: LaudoFluxo): string {
  const linhas = l.porParte.map((p) => {
    const motivos = p.motivos.length ? ` — ${p.motivos.join(' ')}` : ''
    return `· ${p.parte}: ${p.veredito}${motivos}`
  })
  return `Fluxo "${l.fluxoId}": ${l.veredito.toUpperCase()} (migrável: ${l.migravel ? 'sim' : 'não'})\n${linhas.join('\n')}`
}
