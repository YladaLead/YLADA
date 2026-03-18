/**
 * Agente 1 — YLADA Simulador (nível produção)
 *
 * Agentes para Ylada.com. Valida funil: Landing → Quiz (se houver) → Resultado → CTA WhatsApp.
 * Foco: áreas Ylada (medicina, perfumaria, estética, nutri, psi, odonto, fitness, seller).
 * Wellness (Herbalife) é opcional — use FUNIL_PATH para testar.
 *
 * Uso:
 *   npm run agente:simulador
 *   FUNIL_PATH=/pt/estetica npm run agente:simulador   (estética)
 *   FUNIL_PATH=/pt/med npm run agente:simulador        (medicina)
 *   FUNIL_PATH=/pt/perfumaria npm run agente:simulador
 *   URL="https://ylada.com" FUNIL_PATH=/pt/estetica npm run agente:simulador
 *   HEADLESS=false npm run agente:simulador            (abre o Chrome para ver o fluxo)
 *
 * Requer: Puppeteer, app rodando (npm run dev)
 */

import puppeteer from 'puppeteer'
import * as fs from 'fs'

const BASE_URL = process.env.URL || 'http://localhost:3000'
const HEADLESS = process.env.HEADLESS !== 'false' && process.env.HEADLESS !== '0'
/** Caminho do funil: /pt/estetica, /pt/med, /pt/perfumaria, etc. Default = wellness (opcional). */
const FUNIL_PATH = process.env.FUNIL_PATH || '/pt/wellness/templates/initial-assessment'

const CHROME_MAC = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const useChromeSistema = process.platform === 'darwin' && fs.existsSync(CHROME_MAC)

const FUNIL_URL = `${BASE_URL}${FUNIL_PATH.startsWith('/') ? FUNIL_PATH : '/' + FUNIL_PATH}`

/** Páginas de demonstração/vendas (áreas Ylada): explicam o fluxo; link WhatsApp fica na plataforma após o diagnóstico. */
const pathNorm = FUNIL_PATH.replace(/^\//, '')
const PAGINA_DEMO = /^pt\/(estetica|med|nutri|psi|odonto|fitness|perfumaria|seller|coach-bem-estar)$/.test(pathNorm)

interface EtapaResult {
  etapa: string
  status: 'OK' | 'ATENCAO' | 'ERRO'
  observacao: string
}

const resultados: EtapaResult[] = []
/** Diagnóstico capturado da tela de resultado — usado pelo Agente 2 */
let diagnosticoCapturado = ''

function registrar(etapa: string, status: EtapaResult['status'], observacao: string) {
  resultados.push({ etapa, status, observacao })
  const icon = status === 'OK' ? '✅' : status === 'ATENCAO' ? '⚠️' : '❌'
  console.log(`  ${icon} ${etapa}: ${observacao}`)
}

function imprimirTabela() {
  console.log('\n' + '='.repeat(72))
  console.log('DIAGNÓSTICO DO FUNIL — YLADA Simulador')
  console.log('='.repeat(72))
  console.log(`URL testada: ${FUNIL_URL}`)
  console.log('-'.repeat(72))
  console.log('ETAPA         | STATUS   | OBSERVAÇÃO')
  console.log('-'.repeat(72))
  const maxObs = 46
  for (const r of resultados) {
    const etapa = r.etapa.padEnd(12)
    const status = r.status.padEnd(8)
    const obs = r.observacao.length > maxObs ? r.observacao.slice(0, maxObs - 3) + '...' : r.observacao
    console.log(`${etapa} | ${status} | ${obs}`)
  }
  console.log('='.repeat(72))
}

function imprimirDiagnosticoCapturado() {
  if (!diagnosticoCapturado.trim()) {
    console.log('\n⚠️ Nenhum diagnóstico capturado')
    return
  }
  console.log('\n' + '-'.repeat(72))
  console.log('DIAGNÓSTICO CAPTURADO (para Agente 2)')
  console.log('-'.repeat(72))
  console.log(diagnosticoCapturado)
  console.log('-'.repeat(72))
}

async function main() {
  console.log('🚀 Agente 1 — YLADA Simulador')
  console.log(`   URL: ${FUNIL_URL}\n`)

  let browser
  try {
    browser = await puppeteer.launch({
      headless: HEADLESS,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: useChromeSistema ? CHROME_MAC : undefined,
    })
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(30000)
    page.setDefaultTimeout(10000)

    // --- ETAPA 1: Entrada ---
    try {
      const res = await page.goto(FUNIL_URL, { waitUntil: 'networkidle2' })
      if (res && res.status() >= 400) {
        registrar('Entrada', 'ERRO', `HTTP ${res.status()}`)
      } else {
        registrar('Entrada', 'OK', 'Página carregou. Clara.')
      }
    } catch (e) {
      registrar('Entrada', 'ERRO', `Falha ao carregar: ${(e as Error).message}`)
      imprimirTabela()
      imprimirDiagnosticoCapturado()
      await browser.close()
      process.exit(1)
    }

    // --- ETAPA 2: Landing + CTA ---
    try {
      const clicked = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'))
        const startBtn = buttons.find(b => /começar|iniciar|start|grátis|avaliação/i.test(b.textContent || ''))
        if (startBtn) {
          (startBtn as HTMLButtonElement).click()
          return true
        }
        return false
      })
      if (clicked) {
        await page.waitForSelector('button', { timeout: 5000 }).catch(() => {})
        registrar('Landing', 'OK', 'CTA encontrado e clicado. Clara.')
      } else {
        registrar('Landing', 'ATENCAO', 'Nenhum botão "Começar" encontrado. Possível confusão.')
      }
    } catch (e) {
      registrar('Landing', 'ERRO', (e as Error).message)
    }

    // --- ETAPA 3: Quiz/Diagnóstico (5 perguntas) ---
    let quizOk = false
    let perguntasRespondidas = 0
    try {
      for (let i = 0; i < 5; i++) {
        await new Promise(r => setTimeout(r, 800))
        const clicked = await page.evaluate(() => {
          const opts = Array.from(document.querySelectorAll('button.w-full.text-left, button[class*="rounded-lg"][class*="border"]'))
          const opt = opts.find(b => !/voltar|back/i.test(b.textContent || ''))
          if (opt) {
            (opt as HTMLButtonElement).click()
            return true
          }
          return false
        })
        if (clicked) {
          quizOk = true
          perguntasRespondidas += 1
        }
      }
      if (quizOk) {
        const exp = perguntasRespondidas === 5 ? 'Fluido.' : 'Alguma etapa travou.'
        registrar('Diagnóstico', perguntasRespondidas === 5 ? 'OK' : 'ATENCAO', `${perguntasRespondidas} perguntas respondidas. ${exp}`)
      } else {
        registrar('Diagnóstico', 'ATENCAO', 'Não foi possível responder todas as perguntas. Travamento ou seletor incorreto.')
      }
    } catch (e) {
      registrar('Diagnóstico', 'ERRO', (e as Error).message)
    }

    // --- ETAPA 4: Resultado + CAPTURA DO DIAGNÓSTICO (crítico para Agente 2) ---
    try {
      await new Promise(r => setTimeout(r, 2000))
      const temResultado = await page.evaluate(() => {
        return /perfil|resultado|diagnóstico|recomendação/i.test(document.body.innerText)
      })
      if (temResultado) {
        // Captura o bloco completo do resultado (perfil + descrição + recomendações + diagnóstico completo)
        diagnosticoCapturado = await page.evaluate(() => {
          const sel = document.querySelector('[class*="border-4"][class*="rounded-2xl"]')
          if (sel) return (sel as HTMLElement).innerText.trim()
          const diag = document.querySelector('h2')?.closest('div')?.parentElement
          if (diag) return (diag as HTMLElement).innerText.trim()
          const all = document.body.innerText
          const start = all.indexOf('Seu Perfil')
          if (start >= 0) return all.slice(start, start + 8000).trim()
          return all.slice(0, 4000).trim()
        })
        const perfilLinha = diagnosticoCapturado.split('\n').find(l => /alto potencial|pronto para transformação|precisa de mais/i.test(l)) || ''
        const exp = diagnosticoCapturado.length > 200 ? 'Claro.' : 'Pouco conteúdo capturado.'
        registrar('Resultado', 'OK', `Diagnóstico exibido. ${exp} Perfil: ${(perfilLinha || '—').slice(0, 40)}`)
      } else {
        registrar('Resultado', 'ERRO', 'Não chegou no resultado.')
      }
    } catch (e) {
      registrar('Resultado', 'ERRO', (e as Error).message)
    }

    // --- ETAPA 5: CTA WhatsApp — validar URL (wa.me ou api.whatsapp.com) ---
    try {
      const whatsappInfo = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'))
        const wa = links.find(a => /wa\.me|api\.whatsapp\.com|whatsapp\.com\/send/i.test(a.href))
        if (!wa) return { found: false, href: '', valid: false }
        const href = wa.href
        const valid = /^https?:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(href)
        return { found: true, href, valid }
      })
      if (whatsappInfo.found) {
        if (whatsappInfo.valid) {
          registrar('CTA WhatsApp', 'OK', `URL válida: ${whatsappInfo.href.slice(0, 55)}...`)
        } else {
          registrar('CTA WhatsApp', 'ATENCAO', `Link presente mas URL não é wa.me/api.whatsapp: ${whatsappInfo.href.slice(0, 50)}...`)
        }
      } else if (PAGINA_DEMO) {
        registrar('CTA WhatsApp', 'OK', 'Página de demonstração: WhatsApp na plataforma após o diagnóstico.')
      } else {
        registrar('CTA WhatsApp', 'ATENCAO', 'Nenhum link WhatsApp encontrado (pode exigir config do template).')
      }
    } catch (e) {
      registrar('CTA WhatsApp', 'ERRO', (e as Error).message)
    }

  } catch (e) {
    console.error('Erro fatal:', e)
    registrar('Sistema', 'ERRO', (e as Error).message)
  } finally {
    if (browser) await browser.close()
  }

  imprimirTabela()
  imprimirDiagnosticoCapturado()
}

main().catch(console.error)
