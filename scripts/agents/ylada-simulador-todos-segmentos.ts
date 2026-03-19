/**
 * Roda o Agente 1 (Simulador) em TODOS os segmentos das páginas públicas
 * e imprime um resumo único no final.
 *
 * Uso:
 *   npm run agente:simulador-todos
 *   URL=https://www.ylada.com npm run agente:simulador-todos
 *
 * Requer: app rodando (npm run dev) ou URL de produção.
 */

import { spawnSync } from 'child_process'
import * as path from 'path'

const BASE_URL = process.env.URL || 'http://localhost:3000'

/** Segmentos das páginas públicas (Wellness não entra — proposta diferente). Coach é a única entrada para coaches. */
const SEGMENTOS: { nome: string; path: string }[] = [
  { nome: 'Estética', path: '/pt/estetica' },
  { nome: 'Medicina', path: '/pt/med' },
  { nome: 'Perfumaria', path: '/pt/perfumaria' },
  { nome: 'Nutri', path: '/pt/nutri' },
  { nome: 'Psi', path: '/pt/psi' },
  { nome: 'Odonto', path: '/pt/odonto' },
  { nome: 'Fitness', path: '/pt/fitness' },
  { nome: 'Seller', path: '/pt/seller' },
  { nome: 'Coach', path: '/pt/coach' },
]

interface EtapaStatus {
  etapa: string
  status: 'OK' | 'ATENCAO' | 'ERRO'
}

function rodarSimulador(funilPath: string): EtapaStatus[] {
  const scriptPath = path.join(__dirname, 'ylada-simulador.ts')
  const result = spawnSync('npx', ['tsx', scriptPath], {
    env: { ...process.env, FUNIL_PATH: funilPath, URL: BASE_URL, HEADLESS: 'true' },
    encoding: 'utf-8',
    maxBuffer: 2 * 1024 * 1024,
  })
  const out = (result.stdout || '') + (result.stderr || '')
  const linhas = out.split('\n')
  const etapas: EtapaStatus[] = []
  for (const line of linhas) {
    const match = line.match(/\|\s*(OK|ATENCAO|ERRO)\s*\|/)
    if (!match) continue
    const status = match[1] as 'OK' | 'ATENCAO' | 'ERRO'
    const parte = line.split('|')[0]?.trim() || ''
    const etapa = parte.replace(/\s+/g, ' ').trim() || '?'
    if (etapa && etapa !== 'ETAPA' && !etapas.some(e => e.etapa === etapa && e.status === status)) {
      // evitar duplicata; preferir a primeira ocorrência de cada etapa
      if (!etapas.some(e => e.etapa === etapa)) {
        etapas.push({ etapa, status })
      }
    }
  }
  // garantir ordem: Entrada, Landing, Diagnóstico, Resultado, CTA WhatsApp
  const ordem = ['Entrada', 'Landing', 'Diagnóstico', 'Resultado', 'CTA WhatsApp', 'Sistema']
  const ordenado: EtapaStatus[] = []
  for (const nome of ordem) {
    const e = etapas.find(x => x.etapa.startsWith(nome) || nome.startsWith(x.etapa))
    if (e) ordenado.push(e)
  }
  for (const e of etapas) {
    if (!ordenado.some(x => x.etapa === e.etapa)) ordenado.push(e)
  }
  return ordenado.length ? ordenado : etapas
}

function main() {
  console.log('🚀 Agente 1 — Simulador em TODOS os segmentos (páginas públicas)')
  console.log(`   URL base: ${BASE_URL}\n`)

  const resumos: { nome: string; path: string; etapas: EtapaStatus[] }[] = []

  for (const seg of SEGMENTOS) {
    console.log(`\n▶ ${seg.nome} (${seg.path})`)
    const etapas = rodarSimulador(seg.path)
    resumos.push({ nome: seg.nome, path: seg.path, etapas })
    const icons = etapas.map(e => (e.status === 'OK' ? '✅' : e.status === 'ATENCAO' ? '⚠️' : '❌')).join(' ')
    console.log(`   ${icons} ${etapas.map(e => e.etapa).join(' → ')}`)
  }

  // Tabela resumo final
  const colNome = 18
  const col = (s: string, w: number) => s.padEnd(w).slice(0, w)
  console.log('\n' + '='.repeat(100))
  console.log('RESUMO — Todas as páginas públicas')
  console.log('='.repeat(100))
  console.log(col('Segmento', colNome) + ' | Entrada | Landing | Diagnóst. | Resultado | CTA WhatsApp')
  console.log('-'.repeat(100))
  for (const r of resumos) {
    const e = (nome: string) => {
      const x = r.etapas.find(t => t.etapa.startsWith(nome) || nome.startsWith(t.etapa))
      if (!x) return ' — '
      return x.status === 'OK' ? '  ✅   ' : x.status === 'ATENCAO' ? '  ⚠️   ' : '  ❌   '
    }
    const linha =
      col(r.nome, colNome) +
      ' | ' +
      e('Entrada') +
      ' | ' +
      e('Landing') +
      ' | ' +
      e('Diagnóstico') +
      ' | ' +
      e('Resultado') +
      ' | ' +
      e('CTA WhatsApp')
    console.log(linha)
  }
  console.log('='.repeat(100))
  console.log('\nLegenda: ✅ OK  ⚠️ Atenção  ❌ Erro')
  console.log('Páginas de demonstração: CTA WhatsApp pode ser simbólico (OK = explicação na plataforma).')
}

main()
