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
const PAGINA_DEMO = /^pt\/(estetica|med|nutri|psi|odonto|fitness|perfumaria|seller|coach)$/.test(pathNorm)
/** Coach: landing com CTA para checkout (sem quiz obrigatório na página). */
const PAGINA_SEM_QUIZ = pathNorm === 'pt/coach'

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

    // --- ETAPA 2: Landing + CTA (aceita vários textos de botão/link) ---
    try {
      const clicked = await page.evaluate(() => {
        const textoCTA = /começar|iniciar|start|grátis|avaliação|quero|saber mais|diagnóstico|fazer|descobrir|entrar|vamos|comece|comece já|faça|avaliação grátis|quero começar|iniciar agora|começar agora/i
        const botoes = Array.from(document.querySelectorAll<HTMLButtonElement>('button'))
        let btn = botoes.find(b => textoCTA.test((b.textContent || '').trim()))
        if (btn) {
          btn.click()
          return true
        }
        const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'))
        const linkCTA = links.find(a => textoCTA.test((a.textContent || '').trim()) && !/^#|javascript:/i.test(a.href || ''))
        if (linkCTA) {
          linkCTA.click()
          return true
        }
        return false
      })
      if (clicked) {
        if (PAGINA_SEM_QUIZ) {
          await Promise.race([
            page.waitForNavigation({ timeout: 12000 }).catch(() => {}),
            page.waitForFunction("window.location.pathname.includes('login')", { timeout: 8000 }).catch(() => {}),
            new Promise(r => setTimeout(r, 3000)),
          ])
        } else {
          await page.waitForSelector('button, a', { timeout: 5000 }).catch(() => {})
        }
        registrar('Landing', 'OK', 'CTA encontrado e clicado. Clara.')
      } else {
        registrar('Landing', 'ATENCAO', 'Nenhum botão "Começar" encontrado. Possível confusão.')
      }
    } catch (e) {
      registrar('Landing', 'ERRO', (e as Error).message)
    }

    if (PAGINA_SEM_QUIZ) {
      // Coach bem-estar: não tem quiz na página pública; fluxo vai para login.
      registrar('Diagnóstico', 'OK', 'Página sem quiz; fluxo vai para login.')
      registrar('Resultado', 'OK', 'Página sem resultado; fluxo vai para login.')
    } else {
      // --- ETAPA 3: Quiz/Diagnóstico (até 6 cliques; aceita 3+ perguntas como OK) ---
      let quizOk = false
      let perguntasRespondidas = 0
      try {
        const maxPerguntas = 6
        for (let i = 0; i < maxPerguntas; i++) {
          await new Promise(r => setTimeout(r, 800))
          const clicked = await page.evaluate(() => {
            const ignora = /voltar|back|anterior/i
            const seletores = [
              'button.w-full.text-left',
              'button[class*="rounded-lg"][class*="border"]',
              'button[class*="rounded-xl"]',
              '[role="button"]',
              'button:not([disabled])',
            ]
            for (const sel of seletores) {
              const opts = Array.from(document.querySelectorAll<HTMLButtonElement>(sel))
              const opt = opts.find(b => {
                const t = (b.textContent || '').trim()
                return t.length > 0 && t.length < 200 && !ignora.test(t)
              })
              if (opt) {
                opt.click()
                return true
              }
            }
            const linksOpt = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href="#"], a[role="button"]'))
            const linkOpt = linksOpt.find(a => (a.textContent || '').trim().length > 0 && (a.textContent || '').length < 200 && !ignora.test(a.textContent || ''))
            if (linkOpt) {
              linkOpt.click()
              return true
            }
            return false
          })
          if (clicked) {
            quizOk = true
            perguntasRespondidas += 1
          } else {
            break
          }
        }
        if (quizOk) {
          const ok = perguntasRespondidas >= 3
          const exp = perguntasRespondidas >= 3 ? 'Fluido.' : `${perguntasRespondidas} perguntas; fluxo pode ter menos.`
          registrar('Diagnóstico', ok ? 'OK' : 'ATENCAO', `${perguntasRespondidas} perguntas respondidas. ${exp}`)
        } else {
          registrar('Diagnóstico', 'ATENCAO', 'Não foi possível responder as perguntas. Travamento ou seletor incorreto.')
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
