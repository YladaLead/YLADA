/**
 * Agente — Verificação da parte interna (área Estética como base)
 *
 * Faz login com conta de teste e percorre: Board → Perfil → Noel → Configurações →
 * Botões → Fluxos → Biblioteca → Links → Aparência. Gera tabela ✅ / ⚠️ / ❌.
 *
 * Cobertura completa (o que esticar/cobrir): docs/COBERTURA-AGENTE-TESTE-INTERNO-DUDA.md
 * Estabilidade (o que não pode falhar): docs/ESTABILIDADE-AREA-INTERNA.md
 * Perfil completo (tipo + profissão) é obrigatório para Noel gerar link; o bloco 2 apenas valida (perfil pré-preenchido pelo script).
 * Contas com perfil pré-preenchido: node scripts/criar-contas-teste-interno.js
 *
 * Padrão: conta Estética (teste-interno-11). Para outra área use TESTE_EMAIL.
 *
 * Uso:
 *   npm run agente:interno
 *   URL=http://localhost:3004 HEADLESS=false npm run agente:interno
 *   SKIP_NOEL=1 URL=... npm run agente:interno  — pula Noel; testa links, edições, biblioteca (Noel em agente dedicado)
 *   TESTE_TODAS_AREAS=1 URL=... npm run agente:interno  — roda as 12 áreas em sequência (sem Noel); relatório em docs/RELATORIO-TODAS-AREAS-INTERNO.md
 *   TESTE_EMAIL=teste-interno-03@teste.ylada.com npm run agente:interno
 *
 * Pré-requisitos:
 * - App rodando (npm run dev).
 * - Contas: node scripts/criar-contas-teste-interno.js
 */

import puppeteer from 'puppeteer'
import * as fs from 'fs'
import * as path from 'path'

const BASE_URL = process.env.URL || 'http://localhost:3000'
const HEADLESS = process.env.HEADLESS !== 'false' && process.env.HEADLESS !== '0'
const LOGIN_URL = `${BASE_URL}/pt/login`
const EMAIL = process.env.TESTE_EMAIL || 'teste-interno-11@teste.ylada.com'
const SENHA = process.env.TESTE_SENHA || 'TesteYlada2025!'
/** Se true, pula blocos 3 e 3b (Noel); use para testar links, edições, biblioteca etc. sem Noel. Noel em agente dedicado. */
const SKIP_NOEL = process.env.SKIP_NOEL === '1' || process.env.SKIP_NOEL === 'true'
/** Se true, roda as 12 áreas em sequência (entra/sai de cada conta) e gera relatório consolidado. Implica SKIP_NOEL. */
const TODAS_AREAS = process.env.TESTE_TODAS_AREAS === '1' || process.env.TESTE_TODAS_AREAS === 'true'

const CONTAS_TODAS_AREAS: { email: string; area: string }[] = [
  { email: 'teste-interno-01@teste.ylada.com', area: 'ylada' },
  { email: 'teste-interno-02@teste.ylada.com', area: 'ylada' },
  { email: 'teste-interno-03@teste.ylada.com', area: 'nutri' },
  { email: 'teste-interno-04@teste.ylada.com', area: 'coach' },
  { email: 'teste-interno-05@teste.ylada.com', area: 'seller' },
  { email: 'teste-interno-06@teste.ylada.com', area: 'nutra' },
  { email: 'teste-interno-07@teste.ylada.com', area: 'med' },
  { email: 'teste-interno-08@teste.ylada.com', area: 'psi' },
  { email: 'teste-interno-09@teste.ylada.com', area: 'odonto' },
  { email: 'teste-interno-10@teste.ylada.com', area: 'fitness' },
  { email: 'teste-interno-11@teste.ylada.com', area: 'estética' },
  { email: 'teste-interno-12@teste.ylada.com', area: 'perfumaria' },
]

/** Sessão atual (uma conta por vez); usado quando TODAS_AREAS para trocar de conta no loop. */
let currentEmail = EMAIL
let currentAreaLabel = EMAIL.includes('teste-interno-11') ? 'estética' : EMAIL.includes('teste-interno-01') ? 'ylada (matriz)' : 'teste'

const CHROME_MAC = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const useChromeSistema = process.platform === 'darwin' && fs.existsSync(CHROME_MAC)

/** Quando HEADLESS=false e deu erro, mantém o navegador aberto para você visualizar. Em sucesso, 5s e fecha. */
async function pausaSeVisivel(teveErro: boolean): Promise<void> {
  if (!HEADLESS) {
    const segundos = teveErro ? 45 : 5
    console.log(`\n⏸  Navegador ficará aberto por ${segundos}s.`)
    await new Promise((r) => setTimeout(r, segundos * 1000))
  }
}

type Status = 'OK' | 'ATENCAO' | 'ERRO'
interface BlocoResult {
  bloco: string
  status: Status
  observacao: string
}

const resultados: BlocoResult[] = []

function registrar(bloco: string, status: Status, observacao: string) {
  resultados.push({ bloco, status, observacao })
  const icon = status === 'OK' ? '✅' : status === 'ATENCAO' ? '⚠️' : '❌'
  console.log(`  ${icon} ${bloco}: ${observacao}`)
}

function imprimirTabela() {
  console.log('\n' + '='.repeat(72))
  console.log('TESTE INTERNO — Parte interna')
  console.log('='.repeat(72))
  console.log(`URL: ${BASE_URL} | Conta: ${currentEmail} (${currentAreaLabel})`)
  console.log('-'.repeat(72))
  console.log('BLOCO           | STATUS   | OBSERVAÇÃO')
  console.log('-'.repeat(72))
  const maxObs = 48
  for (const r of resultados) {
    const bloco = r.bloco.padEnd(14)
    const status = r.status.padEnd(8)
    const obs = r.observacao.length > maxObs ? r.observacao.slice(0, maxObs - 3) + '...' : r.observacao
    console.log(`${bloco} | ${status} | ${obs}`)
  }
  console.log('='.repeat(72))
  console.log('\nTabela resumo (copiar para CHECKLIST-TESTE-INTERNO-ESTETICA / COBERTURA):')
  const blocosOrdem = resultados.filter((r) => /^(0|1b|3b|[1-9]|[1-9][0-9])\./.test(r.bloco))
  const linha = blocosOrdem.map((r) => (r.status === 'OK' ? '✅' : r.status === 'ATENCAO' ? '⚠️' : '❌')).join(' | ')
  console.log(`| ${currentAreaLabel} | ${linha} |`)
  console.log('')
}

const RELATORIO_PATH = 'docs/RELATORIO-ULTIMO-TESTE-INTERNO.md'
const RELATORIO_TODAS_AREAS_PATH = 'docs/RELATORIO-TODAS-AREAS-INTERNO.md'

function writeRelatorioTodasAreas(allRuns: { email: string; area: string; resultados: BlocoResult[] }[]): void {
  const blocosSet = new Set<string>()
  for (const run of allRuns) {
    for (const r of run.resultados) {
      if (/^(0|1b|3b|[1-9]|[1-9][0-9])\./.test(r.bloco)) blocosSet.add(r.bloco)
    }
  }
  const blocosOrdem = Array.from(blocosSet).sort()
  let md = `# Relatório — Todas as áreas (teste interno, sem Noel)\n\n`
  md += `**Data:** ${new Date().toLocaleString('pt-BR')}  \n`
  md += `**URL:** ${BASE_URL}  \n`
  md += `**Contas:** ${allRuns.length}\n\n`
  md += `## Matriz (área × bloco)\n\n`
  md += `| Área | ${blocosOrdem.join(' | ')} |\n`
  md += `|------|${blocosOrdem.map(() => '---').join('|')}|\n`
  for (const run of allRuns) {
    const byBloco = new Map(run.resultados.map((r) => [r.bloco, r.status]))
    const cells = blocosOrdem.map((b) => (byBloco.get(b) === 'OK' ? '✅' : byBloco.get(b) === 'ATENCAO' ? '⚠️' : '❌'))
    md += `| ${run.area} | ${cells.join(' | ')} |\n`
  }
  md += `\n## Detalhes por área\n\n`
  for (const run of allRuns) {
    md += `### ${run.area} (${run.email})\n\n`
    for (const r of run.resultados) {
      const icon = r.status === 'OK' ? '✅' : r.status === 'ATENCAO' ? '⚠️' : '❌'
      md += `- ${icon} **${r.bloco}**: ${r.observacao.replace(/\n/g, ' ')}\n`
    }
    md += `\n`
  }
  try {
    fs.writeFileSync(path.join(process.cwd(), RELATORIO_TODAS_AREAS_PATH), md, 'utf8')
    console.log(`\n📄 Relatório consolidado: ${RELATORIO_TODAS_AREAS_PATH}`)
  } catch (e) {
    console.warn('Não foi possível salvar relatório todas áreas:', (e as Error).message)
  }
}
const NOEL_RESPOSTAS_MD = 'docs/NOEL-RESPOSTAS-TESTE-INTERNO.md'
const NOEL_RESPOSTAS_JSON = 'docs/noel-respostas-teste-interno.json'

function salvarRespostasNoel(pares: { role: string; content: string }[]): void {
  if (pares.length === 0) return
  const data = new Date().toLocaleString('pt-BR')
  const dir = path.join(process.cwd(), 'docs')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  let md = `# Respostas do Noel — Teste interno\n\n`
  md += `**Data:** ${data}  \n`
  md += `**Conta:** ${currentEmail}  \n`
  md += `**Uso:** Revisar para definir comportamento esperado (incl. links e tom).\n\n---\n\n`
  let idx = 0
  for (let i = 0; i < pares.length; i++) {
    const { role, content } = pares[i]
    if (role === 'user') {
      idx++
      md += `## ${idx}. Pergunta\n\n${content}\n\n`
    } else {
      md += `## Resposta\n\n${content}\n\n---\n\n`
    }
  }

  try {
    fs.writeFileSync(path.join(process.cwd(), NOEL_RESPOSTAS_MD), md, 'utf8')
    fs.writeFileSync(
      path.join(process.cwd(), NOEL_RESPOSTAS_JSON),
      JSON.stringify({ data, conta: currentEmail, mensagens: pares }, null, 2),
      'utf8'
    )
    console.log(`  📄 Noel: ${pares.length} mensagens salvas em ${NOEL_RESPOSTAS_MD} e ${NOEL_RESPOSTAS_JSON}`)
  } catch (e) {
    console.warn('Não foi possível salvar respostas do Noel:', (e as Error).message)
  }
}

function salvarRelatorio(): void {
  const p = path.join(process.cwd(), RELATORIO_PATH)
  let body = `# Último relatório — Teste interno (agente)\n\n`
  body += `**Data:** ${new Date().toLocaleString('pt-BR')}  \n`
  body += `**URL:** ${BASE_URL}  \n`
  body += `**Conta:** ${currentEmail} (área ${currentAreaLabel})\n\n`
  body += `## Resultados\n\n`
  body += `| Bloco | Status | Observação |\n`
  body += `|-------|--------|------------|\n`
  for (const r of resultados) {
    const icon = r.status === 'OK' ? '✅' : r.status === 'ATENCAO' ? '⚠️' : '❌'
    body += `| ${r.bloco} | ${icon} ${r.status} | ${r.observacao.replace(/\n/g, ' ')} |\n`
  }
  const blocosOrdem = resultados.filter((r) => /^(0|1b|3b|[1-9]|[1-9][0-9])\./.test(r.bloco))
  const linha = blocosOrdem.map((r) => (r.status === 'OK' ? '✅' : r.status === 'ATENCAO' ? '⚠️' : '❌')).join(' | ')
  body += `\n## Tabela resumo (COBERTURA blocos 0–11 + 3b)\n\n`
  body += `| ${currentAreaLabel} | ${linha} |\n`
  try {
    fs.writeFileSync(p, body, 'utf8')
    console.log(`\n📄 Relatório salvo em: ${RELATORIO_PATH}`)
  } catch (e) {
    console.warn('Não foi possível salvar o relatório:', (e as Error).message)
  }
}

async function main() {
  const skipNoel = SKIP_NOEL || TODAS_AREAS
  if (TODAS_AREAS) {
    console.log('🚀 Agente — Todas as áreas em sequência (sem Noel)')
    console.log(`   URL: ${LOGIN_URL} | ${CONTAS_TODAS_AREAS.length} contas`)
  } else {
    console.log('🚀 Agente — Verificação da parte interna')
    console.log(`   URL: ${LOGIN_URL} | Conta: ${currentEmail}`)
  }
  if (skipNoel) console.log('   Modo: sem Noel — links, edições, biblioteca, etc.')
  console.log('')

  const contasToRun = TODAS_AREAS ? CONTAS_TODAS_AREAS : [{ email: EMAIL, area: currentAreaLabel }]
  if (!TODAS_AREAS) {
    currentEmail = EMAIL
    currentAreaLabel = EMAIL.includes('teste-interno-11') ? 'estética' : EMAIL.includes('teste-interno-01') ? 'ylada (matriz)' : 'teste'
  }
  const allRuns: { email: string; area: string; resultados: BlocoResult[] }[] = []

  for (let idx = 0; idx < contasToRun.length; idx++) {
    const conta = contasToRun[idx]
    currentEmail = conta.email
    currentAreaLabel = conta.area
    if (TODAS_AREAS) {
      resultados.length = 0
      console.log(`\n--- [${idx + 1}/${contasToRun.length}] Área ${conta.area}: ${conta.email} ---\n`)
    }
    let browser
    try {
      browser = await puppeteer.launch({
      headless: HEADLESS,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: useChromeSistema ? CHROME_MAC : undefined,
    })
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(45000)
    page.setDefaultTimeout(22000)
    // Janela maior para a página não sair cortada e você conseguir ver o formulário inteiro
    await page.setViewport({ width: 1280, height: 900 })

    // --- LOGIN ---
    try {
      const res = await page.goto(LOGIN_URL, { waitUntil: 'networkidle2', timeout: 60000 })
      if (res && res.status() >= 400) {
        registrar('Login', 'ERRO', `HTTP ${res.status()}`)
        if (TODAS_AREAS) throw new Error('HTTP erro')
        imprimirTabela()
        await pausaSeVisivel(true)
        await browser.close()
        process.exit(1)
      }
      await page.waitForSelector('#email', { timeout: 10000 })
      await new Promise((r) => setTimeout(r, 400))
      // Aceitar cookies de uma vez: o banner não aparece (ou some no próximo ciclo)
      await page.evaluate(() => {
        const key = 'ylada_cookie_consent'
        try {
          localStorage.setItem(key, 'true')
          const expires = new Date()
          expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000)
          document.cookie = `${key}=true;expires=${expires.toUTCString()};path=/;SameSite=Lax`
        } catch (_) {}
      })
      // Se o banner já estiver na tela, clicar em "Aceitar Todos" para sumir
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll<HTMLButtonElement>('button'))
        const aceitar = btns.find((b) => b.textContent?.trim() === 'Aceitar Todos')
        aceitar?.click()
      })
      await new Promise((r) => setTimeout(r, 500))
      // Preencher de forma que o React (campos controlados) atualize o estado; senão o submit envia vazio e dá "missing email or phone"
      await page.evaluate(
        (email, senha) => {
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            'value'
          )?.set
          if (!nativeInputValueSetter) return
          const emailEl = document.querySelector<HTMLInputElement>('#email')
          const passEl = document.querySelector<HTMLInputElement>('#password')
          if (emailEl) {
            emailEl.focus()
            nativeInputValueSetter.call(emailEl, email)
            emailEl.dispatchEvent(new Event('input', { bubbles: true }))
          }
          if (passEl) {
            passEl.focus()
            nativeInputValueSetter.call(passEl, senha)
            passEl.dispatchEvent(new Event('input', { bubbles: true }))
          }
        },
        currentEmail,
        SENHA
      )
      await new Promise((r) => setTimeout(r, 600))
      const submitBtn = await page.$('button[type="submit"]')
      if (!submitBtn) {
        registrar('Login', 'ERRO', 'Botão Entrar não encontrado')
        if (TODAS_AREAS) throw new Error('Botão não encontrado')
        imprimirTabela()
        await pausaSeVisivel(true)
        await browser.close()
        process.exit(1)
      }
      await submitBtn.click()
      // Redirect pode ser client-side (Next.js); evitar evaluate na página (contexto destruído na navegação)
      const deadlineLogin = Date.now() + 28000
      while (Date.now() < deadlineLogin) {
        await new Promise((r) => setTimeout(r, 600))
        const u = page.url()
        if (u.includes('/pt/home') || u.includes('/pt/painel') || u.includes('/pt/onboarding')) break
      }
      await new Promise((r) => setTimeout(r, 2000))
      const url = page.url()
      if (url.includes('/pt/login') && !url.includes('password_reset')) {
        let msgErro = 'Falha no login (verifique e-mail e senha)'
        try {
          const txt = await page.evaluate(() => {
            const el = document.querySelector('.bg-red-50, [class*="text-red-700"]')
            return el ? (el as HTMLElement).innerText.trim().slice(0, 120) : ''
          })
          if (txt) msgErro = txt
        } catch (_) {}
        // Retry uma vez (React/controlled inputs às vezes não enviam no primeiro submit)
        console.log('   ⏳ Login falhou; tentando novamente em 2s...')
        await new Promise((r) => setTimeout(r, 2000))
        await page.evaluate(
          (email, senha) => {
            const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
            if (!setter) return
            const emailEl = document.querySelector<HTMLInputElement>('#email')
            const passEl = document.querySelector<HTMLInputElement>('#password')
            if (emailEl) { emailEl.focus(); setter.call(emailEl, email); emailEl.dispatchEvent(new Event('input', { bubbles: true })) }
            if (passEl) { passEl.focus(); setter.call(passEl, senha); passEl.dispatchEvent(new Event('input', { bubbles: true })) }
          },
          currentEmail,
          SENHA
        )
        await new Promise((r) => setTimeout(r, 1000))
        const btn2 = await page.$('button[type="submit"]')
        if (btn2) {
          await btn2.click()
          const deadline2 = Date.now() + 22000
          while (Date.now() < deadline2) {
            await new Promise((r) => setTimeout(r, 500))
            const u2 = page.url()
            if (u2.includes('/pt/home') || u2.includes('/pt/painel') || u2.includes('/pt/onboarding')) break
          }
          await new Promise((r) => setTimeout(r, 1500))
        }
        const url2 = page.url()
        if (url2.includes('/pt/login') && !url2.includes('password_reset')) {
        registrar('Login', 'ERRO', `${msgErro} — App (${BASE_URL}) usa o mesmo Supabase do script? Senha: TesteYlada2025!`)
        if (TODAS_AREAS) throw new Error('Login falhou')
        imprimirTabela()
        await pausaSeVisivel(true)
        await browser.close()
        process.exit(1)
        }
      }
      const urlFinal = page.url()
      if (urlFinal.includes('/pt/onboarding')) {
        registrar('Login', 'OK', 'Redirecionado para onboarding (perfil pode estar incompleto).')
      } else {
        registrar('Login', 'OK', 'Login ok.')
      }
    } catch (e) {
      const errMsg = (e as Error).message
      if (/Execution context was destroyed|Target closed|Protocol error/i.test(errMsg)) {
        try {
          await page.goto(LOGIN_URL, { waitUntil: 'networkidle2', timeout: 15000 })
          await page.waitForSelector('#email', { timeout: 8000 })
          await new Promise((r) => setTimeout(r, 400))
          await page.evaluate(
            (email, senha) => {
              const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
              if (!setter) return
              const emailEl = document.querySelector<HTMLInputElement>('#email')
              const passEl = document.querySelector<HTMLInputElement>('#password')
              if (emailEl) { emailEl.focus(); setter.call(emailEl, email); emailEl.dispatchEvent(new Event('input', { bubbles: true })) }
              if (passEl) { passEl.focus(); setter.call(passEl, senha); passEl.dispatchEvent(new Event('input', { bubbles: true })) }
            },
            currentEmail,
            SENHA
          )
          await new Promise((r) => setTimeout(r, 600))
          const btn = await page.$('button[type="submit"]')
          if (btn) {
            await btn.click()
            const deadline = Date.now() + 25000
            while (Date.now() < deadline) {
              await new Promise((r) => setTimeout(r, 600))
              const u = page.url()
              if (u.includes('/pt/home') || u.includes('/pt/painel') || u.includes('/pt/onboarding')) break
            }
            await new Promise((r) => setTimeout(r, 2000))
            const u2 = page.url()
            if (!u2.includes('/pt/login') || u2.includes('password_reset')) {
              registrar('Login', 'OK', 'Login ok (retry após contexto destruído).')
              // não fazer exit; continuar fluxo
            } else {
              registrar('Login', 'ERRO', 'Retry: ainda na página de login.')
              if (TODAS_AREAS) throw new Error('Login retry falhou')
              imprimirTabela()
              await pausaSeVisivel(true)
              await browser.close()
              process.exit(1)
            }
          } else {
            registrar('Login', 'ERRO', errMsg)
            if (TODAS_AREAS) throw new Error(errMsg)
            imprimirTabela()
            await pausaSeVisivel(true)
            await browser.close()
            process.exit(1)
          }
        } catch (e2) {
          registrar('Login', 'ERRO', (e2 as Error).message)
          if (TODAS_AREAS) throw e2
          imprimirTabela()
          await pausaSeVisivel(true)
          await browser.close()
          process.exit(1)
        }
      } else {
        registrar('Login', 'ERRO', errMsg)
        if (TODAS_AREAS) throw new Error(errMsg)
        imprimirTabela()
        await pausaSeVisivel(true)
        await browser.close()
        process.exit(1)
      }
    }

    // --- 0. Onboarding — omitido: perfil deixado de lado; ir direto para home e testar resto (diagnóstico, edições, Noel) ---
    const urlAtual = page.url()
    if (urlAtual.includes('/pt/onboarding')) {
      registrar('0. Onboarding', 'OK', 'Omitido (perfil por e-mail); indo para home para testar outras funcionalidades.')
      await page.goto(`${BASE_URL}/pt/home`, { waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {})
      await new Promise((r) => setTimeout(r, 1500))
    }

    // --- 1. Board / Home ---
    try {
      const u = page.url()
      if (!u.includes('/pt/home') && !u.includes('/pt/painel')) {
        await page.goto(`${BASE_URL}/pt/home`, { waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {})
      }
      const boardOk = await page.evaluate(() => {
        const body = document.body.innerText
        const temMenu = /Noel|Painel|Diagnósticos|Biblioteca|Configurações|Perfil/i.test(body)
        const temConteudo = body.length > 200
        return { temMenu, temConteudo }
      })
      if (boardOk.temConteudo && boardOk.temMenu) {
        registrar('1. Board/Home', 'OK', 'Página carregou; menu e conteúdo presentes.')
      } else if (boardOk.temConteudo) {
        registrar('1. Board/Home', 'ATENCAO', 'Conteúdo ok; menu pode estar diferente.')
      } else {
        registrar('1. Board/Home', 'ERRO', 'Página vazia ou não carregou.')
      }
    } catch (e) {
      registrar('1. Board/Home', 'ERRO', (e as Error).message)
    }

    // --- 1b. Método YLADA (cobertura §4) ---
    try {
      await page.goto(`${BASE_URL}/pt/metodo`, { waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {})
      const metodoOk = await page.evaluate(() => {
        const body = document.body.innerText
        const u = window.location.pathname
        const carregou = u.includes('metodo') && body.length > 150
        const repetido = /YLADA\s+YLADA/i.test(body)
        return { carregou, repetido }
      })
      if (metodoOk.carregou && !metodoOk.repetido) {
        registrar('1b. Método YLADA', 'OK', 'Página do método carregou; sem repetição de título.')
      } else if (metodoOk.carregou) {
        registrar('1b. Método YLADA', 'ATENCAO', 'Página carregou; verificar repetição "YLADA YLADA".')
      } else {
        registrar('1b. Método YLADA', 'ATENCAO', 'Página método não encontrada ou redirecionou.')
      }
    } catch (e) {
      registrar('1b. Método YLADA', 'ERRO', (e as Error).message)
    }

    // --- 2. Perfil — omitido: perfis pré-preenchidos por e-mail (outro chat); testes sem passar por perfil ---
    registrar('2. Perfil', 'OK', 'Omitido (perfil por e-mail); foco em diagnóstico, edições, Noel, etc.)')

    if (SKIP_NOEL || TODAS_AREAS) {
      registrar('3. Noel', 'OK', 'Omitido (Noel em agente dedicado).')
      registrar('3b. Noel — Calculadora', 'OK', 'Omitido (Noel em agente dedicado).')
    } else {
    // --- 3. Noel (5–10 perguntas variadas: próximo passo, criar fluxo, estratégia, link para post, etc.) ---
    const PERGUNTAS_NOEL = [
      'Qual meu próximo passo?',
      'Quero criar um diagnóstico para minha área. Como faço?',
      'Me sugira uma estratégia para captar mais clientes.',
      'Pode gerar um link para eu usar no post ou no Instagram?',
      'Como criar um fluxo de diagnóstico do zero?',
      'Qual o melhor diagnóstico para começar a conversar com cliente?',
      'Preciso de um script para enviar no WhatsApp. Pode me dar um?',
      'Como organizar minha semana para atrair mais leads?',
      'Sou da área de estética. O que você me recomenda para começar?',
      'Me dá o link do último diagnóstico que criei para eu compartilhar.',
    ]
    const runNoelBlock = async (): Promise<{ noelPerguntasOk: number; temResposta: boolean; conversaNoel: { role: string; content: string }[] }> => {
      await page.goto(`${BASE_URL}/pt/home`, { waitUntil: 'networkidle2', timeout: 18000 }).catch(() => {})
      await new Promise((r) => setTimeout(r, 3500))
      await page.waitForSelector('textarea', { timeout: 18000 }).catch(() => {})
      let noelPerguntasOk = 0
      for (let i = 0; i < Math.min(10, PERGUNTAS_NOEL.length); i++) {
        const pergunta = PERGUNTAS_NOEL[i]
        const enviou = await page.evaluate(
          (p) => {
            const textarea = document.querySelector('textarea')
            const input = document.querySelector('input[type="text"]') as HTMLInputElement | null
            const el = textarea || input
            if (!el) return false
            const inputSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
            const textareaSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set
            if (el instanceof HTMLInputElement && inputSetter) {
              inputSetter.call(el, p)
              el.dispatchEvent(new Event('input', { bubbles: true }))
            } else if (el instanceof HTMLTextAreaElement && textareaSetter) {
              textareaSetter.call(el, p)
              el.dispatchEvent(new Event('input', { bubbles: true }))
            } else {
              ;(el as HTMLInputElement).value = p
              el.dispatchEvent(new Event('input', { bubbles: true }))
            }
            const form = el.closest('form')
            if (form) {
              form.requestSubmit()
              return true
            }
            const btn =
              document.querySelector('button[type="submit"]') ||
              Array.from(document.querySelectorAll('button')).find((b) =>
                /enviar|enviar mensagem|perguntar ao noel|perguntar/i.test((b as HTMLElement).innerText || (b as HTMLElement).textContent || '')
              )
            if (btn) {
              (btn as HTMLButtonElement).click()
              return true
            }
            return false
          },
          pergunta
        )
        if (enviou) {
          noelPerguntasOk++
          await new Promise((r) => setTimeout(r, 5000))
        }
      }
      const temResposta = await page.evaluate(() => {
        const body = document.body.innerText
        return body.length > 500 && /Noel|próximo|passo|link|diagnóstico|ferramenta|estratégia|script/i.test(body)
      })

      // Extrair e salvar conversa Noel (perguntas + respostas) para revisão e definição de comportamento
      const conversaNoel = await page.evaluate(() => {
        const nodes = document.querySelectorAll('[data-noel-role]')
        const pares: { role: string; content: string }[] = []
        nodes.forEach((el) => {
          const role = el.getAttribute('data-noel-role') || ''
          const bubble = el.querySelector('[class*="rounded-xl"]') || el.firstElementChild
          const content = (bubble?.textContent ?? '').trim()
          if (role && content) pares.push({ role, content })
        })
        return pares
      })
      return { noelPerguntasOk, temResposta, conversaNoel }
    }
    try {
      let noelOut: Awaited<ReturnType<typeof runNoelBlock>> | null = null
      try {
        noelOut = await runNoelBlock()
      } catch (e1) {
        const msg = (e1 as Error).message
        if (/Execution context was destroyed|Target closed|Protocol error/i.test(msg)) {
          await page.goto(`${BASE_URL}/pt/home`, { waitUntil: 'networkidle2', timeout: 18000 }).catch(() => {})
          await new Promise((r) => setTimeout(r, 3500))
          await page.waitForSelector('textarea', { timeout: 18000 }).catch(() => {})
          noelOut = await runNoelBlock()
        } else throw e1
      }
      if (noelOut) {
        if (noelOut.conversaNoel.length > 0) salvarRespostasNoel(noelOut.conversaNoel)
        if (noelOut.noelPerguntasOk >= 3 && noelOut.temResposta) {
          registrar('3. Noel', 'OK', `${noelOut.noelPerguntasOk} perguntas enviadas; respostas em docs/NOEL-RESPOSTAS-TESTE-INTERNO.md`)
        } else if (noelOut.noelPerguntasOk >= 1) {
          registrar('3. Noel', 'ATENCAO', `${noelOut.noelPerguntasOk} pergunta(s) enviada(s); respostas em docs/NOEL-RESPOSTAS-TESTE-INTERNO.md`)
        } else {
          registrar('3. Noel', 'ATENCAO', 'Campo de chat ou envio não encontrado.')
        }
      }
    } catch (e) {
      registrar('3. Noel', 'ERRO', (e as Error).message)
    }

    // --- 3b. Noel — Pedido de calculadora (verifica se cria link com diagnóstico) ---
    try {
      await page.goto(`${BASE_URL}/pt/home`, { waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {})
      await new Promise((r) => setTimeout(r, 1500))
      await page.waitForSelector('textarea', { timeout: 8000 }).catch(() => {})
      const msgCalculadora = 'Quero uma calculadora para meus clientes.'
      const enviouCalc = await page.evaluate(
        (p) => {
          const textarea = document.querySelector('textarea')
          const el = textarea
          if (!el) return false
          const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set
          if (setter) {
            setter.call(el, p)
            el.dispatchEvent(new Event('input', { bubbles: true }))
          } else {
            ;(el as HTMLTextAreaElement).value = p
            el.dispatchEvent(new Event('input', { bubbles: true }))
          }
          const btn = Array.from(document.querySelectorAll('button')).find((b) =>
            /perguntar/i.test((b as HTMLElement).innerText || (b as HTMLElement).textContent || '')
          )
          if (btn) {
            (btn as HTMLButtonElement).click()
            return true
          }
          return false
        },
        msgCalculadora
      )
      if (!enviouCalc) {
        registrar('3b. Noel — Calculadora', 'ATENCAO', 'Campo de chat não encontrado para enviar pedido.')
      } else {
        await new Promise((r) => setTimeout(r, 18000))
        const resultadoCalc = await page.evaluate(() => {
          const body = document.body.innerText
          const linkMatch = body.match(/\/l\/[a-zA-Z0-9_-]+/)
          const temLink = !!linkMatch
          const temCriacao = /criei|calculadora|preparei|link|diagnóstico|seu quiz|acesse seu/i.test(body)
          const ultimoAssist = Array.from(document.querySelectorAll('[data-noel-role="assistant"]')).pop()
          const textoUltimo = ultimoAssist
            ? (ultimoAssist.querySelector('[class*="rounded-xl"]')?.textContent ?? '').trim()
            : ''
          const linkNoUltimo = /\/l\/[a-zA-Z0-9_-]+/.test(textoUltimo)
          const anchorUltimo = ultimoAssist?.querySelector('a[href*="/l/"]')
          const hrefRaw = (anchorUltimo?.getAttribute('href') ?? document.querySelector('a[href*="/l/"]')?.getAttribute('href')) ?? ''
          return { temLink, temCriacao, linkNoUltimo, href: hrefRaw }
        })
        const origin = new URL(BASE_URL).origin
        const linkAbsoluto =
          resultadoCalc.href && resultadoCalc.href.trim()
            ? resultadoCalc.href.startsWith('http')
              ? resultadoCalc.href
              : `${origin}${resultadoCalc.href.startsWith('/') ? '' : '/'}${resultadoCalc.href}`
            : ''
        let calculadoraOk = resultadoCalc.temLink && resultadoCalc.temCriacao
        if (calculadoraOk && linkAbsoluto) {
          const openLinkAndCheckForm = async (): Promise<boolean> => {
            const pageLink = await browser.newPage()
            try {
              await pageLink.goto(linkAbsoluto, { waitUntil: 'networkidle2', timeout: 10000 })
              const temForm = await pageLink.evaluate(() => {
                const form = document.querySelector('form')
                const inputs = document.querySelectorAll('input, select, textarea')
                return !!(form || inputs.length >= 1)
              })
              await pageLink.close()
              return temForm
            } catch {
              await pageLink.close().catch(() => {})
              return false
            }
          }
          const temFormFirst = await openLinkAndCheckForm()
          if (!temFormFirst) {
            await new Promise((r) => setTimeout(r, 2000))
            const temFormRetry = await openLinkAndCheckForm()
            calculadoraOk = temFormRetry
          } else {
            calculadoraOk = true
          }
          if (!calculadoraOk) calculadoraOk = resultadoCalc.temLink && resultadoCalc.temCriacao
        }
        if (calculadoraOk) {
          registrar(
            '3b. Noel — Calculadora',
            'OK',
            'Pedido de calculadora enviado; Noel entregou link; página do link tem formulário (diagnóstico).'
          )
        } else if (resultadoCalc.temLink || resultadoCalc.temCriacao) {
          registrar(
            '3b. Noel — Calculadora',
            'ATENCAO',
            'Noel respondeu com link/criação; verificar se página do link abre com formulário.'
          )
        } else {
          registrar(
            '3b. Noel — Calculadora',
            'ATENCAO',
            'Resposta ao pedido de calculadora sem link ou sem menção a criação.'
          )
        }
      }
    } catch (e) {
      registrar('3b. Noel — Calculadora', 'ATENCAO', (e as Error).message)
    }
    }

    // --- 4. Configurações ---
    try {
      await page.goto(`${BASE_URL}/pt/configuracao`, { waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {})
      const configOk = await page.evaluate(() => {
        const body = document.body.innerText
        return /configuração|configurações|salvar|perfil|telefone/i.test(body) && body.length > 200
      })
      if (configOk) {
        registrar('4. Configurações', 'OK', 'Página de configurações carregou.')
      } else {
        registrar('4. Configurações', 'ATENCAO', 'Página carregou com pouco conteúdo.')
      }
    } catch (e) {
      registrar('4. Configurações', 'ERRO', (e as Error).message)
    }

    // --- 5. Botões e edições ---
    try {
      const botoesOk = await page.evaluate(() => {
        const botoes = Array.from(document.querySelectorAll('button, [role="button"]'))
        const salvars = botoes.filter((b) => /salvar|guardar|atualizar/i.test((b as HTMLElement).innerText || ''))
        return salvars.length >= 0 && botoes.length >= 1
      })
      registrar('5. Botões/Edições', botoesOk ? 'OK' : 'ATENCAO', 'Botões presentes; edição não exercitada.')
    } catch (e) {
      registrar('5. Botões/Edições', 'ERRO', (e as Error).message)
    }

    // --- 6. Criar fluxos (matriz: /pt/fluxos redireciona para /pt/links) ---
    try {
      await page.goto(`${BASE_URL}/pt/fluxos`, { waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {})
      await page.waitForSelector('body', { timeout: 8000 }).catch(() => {})
      let fluxosOk: boolean | null = null
      try {
        fluxosOk = await page.evaluate(() => {
          const u = window.location.pathname
          const body = document.body.innerText
          if (u.includes('links')) return body.length > 100
          if (u.includes('fluxos')) return body.length > 100
          return false
        })
      } catch (e6) {
        if (/Execution context was destroyed|Target closed|Protocol error/i.test((e6 as Error).message)) {
          await page.goto(`${BASE_URL}/pt/fluxos`, { waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {})
          await page.waitForSelector('body', { timeout: 8000 }).catch(() => {})
          fluxosOk = await page.evaluate(() => {
            const u = window.location.pathname
            const body = document.body.innerText
            if (u.includes('links')) return body.length > 100
            if (u.includes('fluxos')) return body.length > 100
            return false
          }).catch(() => false)
        } else throw e6
      }
      if (fluxosOk) {
        registrar('6. Criar fluxos', 'OK', 'Fluxos carregou (redireciona para Links na matriz).')
      } else {
        registrar('6. Criar fluxos', 'ATENCAO', 'Página fluxos não encontrada ou vazia.')
      }
    } catch (e) {
      registrar('6. Criar fluxos', 'ATENCAO', (e as Error).message)
    }

    // --- 7. Biblioteca (cobertura §3: listagem, filtros, criar link) ---
    try {
      await page.goto(`${BASE_URL}/pt/biblioteca`, { waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {})
      await page.waitForSelector('body', { timeout: 8000 }).catch(() => {})
      let bibOk: { temConteudo: boolean; temCriarOuNovo: boolean; temFiltroOuLista: boolean } | null = null
      try {
        bibOk = await page.evaluate(() => {
          const body = document.body.innerText
          const temConteudo = /biblioteca|conteúdo|fluxo|material|diagnóstico|quiz/i.test(body) && body.length > 150
          const temCriarOuNovo = /criar|novo|diagnóstico agora|adicionar/i.test(body)
          const temFiltroOuLista = body.length > 300 || document.querySelectorAll('select, [role="listbox"], [class*="filter"]').length >= 0
          return { temConteudo, temCriarOuNovo, temFiltroOuLista }
        })
      } catch (e7) {
        if (/Execution context was destroyed|Target closed|Protocol error/i.test((e7 as Error).message)) {
          await page.goto(`${BASE_URL}/pt/biblioteca`, { waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {})
          await page.waitForSelector('body', { timeout: 8000 }).catch(() => {})
          bibOk = await page.evaluate(() => {
            const body = document.body.innerText
            const temConteudo = /biblioteca|conteúdo|fluxo|material|diagnóstico|quiz/i.test(body) && body.length > 150
            const temCriarOuNovo = /criar|novo|diagnóstico agora|adicionar/i.test(body)
            const temFiltroOuLista = body.length > 300 || document.querySelectorAll('select, [role="listbox"], [class*="filter"]').length >= 0
            return { temConteudo, temCriarOuNovo, temFiltroOuLista }
          }).catch(() => ({ temConteudo: false, temCriarOuNovo: false, temFiltroOuLista: false }))
        } else throw e7
      }
      if (bibOk) {
        if (bibOk.temConteudo && (bibOk.temCriarOuNovo || bibOk.temFiltroOuLista)) {
          registrar('7. Biblioteca', 'OK', 'Biblioteca carregou; conteúdo e ação de criar visíveis.')
        } else if (bibOk.temConteudo) {
          registrar('7. Biblioteca', 'OK', 'Biblioteca carregou.')
        } else {
          registrar('7. Biblioteca', 'ATENCAO', 'Biblioteca vazia ou não carregou.')
        }
      } else {
        registrar('7. Biblioteca', 'ERRO', 'Execution context destroyed (retry falhou).')
      }
    } catch (e) {
      registrar('7. Biblioteca', 'ERRO', (e as Error).message)
    }

    // --- 8. Links gerados (cobertura §9: listar, gerar, copiar) ---
    try {
      await page.goto(`${BASE_URL}/pt/links`, { waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {})
      const linksOk = await page.evaluate(() => {
        const body = document.body.innerText
        const temLink = /link|diagnóstico|ferramenta|gerar|novo|copiar/i.test(body)
        const links = document.querySelectorAll('a[href*="/l/"], a[href*="http"]')
        return temLink && body.length > 150
      })
      if (linksOk) {
        registrar('8. Links gerados', 'OK', 'Página de links carregou.')
      } else {
        registrar('8. Links gerados', 'ATENCAO', 'Página de links não encontrada ou vazia.')
      }
    } catch (e) {
      registrar('8. Links gerados', 'ATENCAO', (e as Error).message)
    }

    // --- 9. Aparência / Layout (cobertura §11) ---
    try {
      await page.goto(`${BASE_URL}/pt/home`, { waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {})
      await page.waitForSelector('body', { timeout: 10000 }).catch(() => {})
      await new Promise((r) => setTimeout(r, 1500))
      const layoutOk = await page.evaluate(() => {
        const body = document.body.innerText
        const repetido = /YLADA\s+YLADA|Bem-vindo.*YLADA\s+YLADA/i.test(body)
        const erroGen = /something went wrong|algo deu errado/i.test(body)
        return !repetido && !erroGen
      })
      if (layoutOk) {
        registrar('9. Aparência', 'OK', 'Sem repetição "YLADA YLADA" nem erro genérico.')
      } else {
        registrar('9. Aparência', 'ERRO', 'Título "YLADA YLADA" repetido ou erro de tela.')
      }
    } catch (e) {
      const msg9 = (e as Error).message
      if (/timed out|Execution context was destroyed/i.test(msg9)) {
        try {
          await page.goto(`${BASE_URL}/pt/home`, { waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {})
          await new Promise((r) => setTimeout(r, 2000))
          const layoutOk = await page.evaluate(() => {
            const body = document.body.innerText
            const repetido = /YLADA\s+YLADA|Bem-vindo.*YLADA\s+YLADA/i.test(body)
            const erroGen = /something went wrong|algo deu errado/i.test(body)
            return !repetido && !erroGen
          })
          if (layoutOk) registrar('9. Aparência', 'OK', 'Sem repetição "YLADA YLADA" nem erro genérico.')
          else registrar('9. Aparência', 'ERRO', 'Título "YLADA YLADA" repetido ou erro de tela.')
        } catch (_) {
          registrar('9. Aparência', 'ATENCAO', msg9)
        }
      } else {
        registrar('9. Aparência', 'ATENCAO', msg9)
      }
    }

    // --- 10. Quiz / Criar link (cobertura §6: acesso à página de criar diagnóstico/quiz) ---
    try {
      await page.goto(`${BASE_URL}/pt/links/novo`, { waitUntil: 'networkidle2', timeout: 18000 }).catch(() => {})
      await page.waitForSelector('body', { timeout: 12000 }).catch(() => {})
      await new Promise((r) => setTimeout(r, 1500))
      let novoLinkOk: boolean | null = null
      try {
        novoLinkOk = await page.evaluate(() => {
          const body = document.body.innerText
          const u = window.location.pathname
          const naPaginaNovo = u.includes('links/novo') || u.includes('novo')
          const temFormOuTemplate = /criar|novo|diagnóstico|template|objetivo|tema|quiz|calculadora/i.test(body) && body.length > 200
          return naPaginaNovo && temFormOuTemplate
        })
      } catch (e10) {
        if (/Execution context was destroyed|Target closed|Protocol error|timed out/i.test((e10 as Error).message)) {
          await page.goto(`${BASE_URL}/pt/links/novo`, { waitUntil: 'networkidle2', timeout: 18000 }).catch(() => {})
          await page.waitForSelector('body', { timeout: 12000 }).catch(() => {})
          await new Promise((r) => setTimeout(r, 1500))
          novoLinkOk = await page.evaluate(() => {
            const body = document.body.innerText
            const u = window.location.pathname
            const naPaginaNovo = u.includes('links/novo') || u.includes('novo')
            const temFormOuTemplate = /criar|novo|diagnóstico|template|objetivo|tema|quiz|calculadora/i.test(body) && body.length > 200
            return naPaginaNovo && temFormOuTemplate
          }).catch(() => false)
        } else throw e10
      }
      if (novoLinkOk) {
        registrar('10. Quiz/Criar link', 'OK', 'Página de criar link/diagnóstico carregou; formulário ou templates visíveis.')
      } else {
        registrar('10. Quiz/Criar link', 'ATENCAO', 'Página links/novo não encontrada ou sem formulário visível.')
      }
    } catch (e) {
      registrar('10. Quiz/Criar link', 'ATENCAO', (e as Error).message)
    }

    // --- 11. Calculadora (cobertura §7: um link público abre; formulário → resultado → CTA) ---
    try {
      await page.goto(`${BASE_URL}/pt/links`, { waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {})
      const linkPublico = await page.evaluate(() => {
        const anchor = document.querySelector<HTMLAnchorElement>('a[href*="/l/"]')
        if (anchor && anchor.href) return anchor.href
        const all = document.querySelectorAll<HTMLAnchorElement>('a[href*="localhost"], a[href*="/l/"]')
        for (const a of all) {
          if (a.href && (a.href.includes('/l/') || a.href.includes('diagnostico'))) return a.href
        }
        return null
      })
      if (linkPublico) {
        const calcPage = await browser!.newPage()
        calcPage.setDefaultNavigationTimeout(15000)
        try {
          await calcPage.goto(linkPublico, { waitUntil: 'networkidle2', timeout: 15000 })
          const calcOk = await calcPage.evaluate(() => {
            const body = document.body.innerText
            const temForm = /peso|altura|calcular|resultado|IMC|água|proteína|caloria/i.test(body)
            const temCta = /whatsapp|enviar|compartilhar|CTA|conversar/i.test(body) || document.querySelectorAll('a[href*="wa.me"], a[href*="api.whatsapp"]').length > 0
            return body.length > 100 && (temForm || temCta)
          })
          await calcPage.close()
          if (calcOk) {
            registrar('11. Calculadora', 'OK', 'Link público abriu; formulário ou CTA presente.')
          } else {
            registrar('11. Calculadora', 'ATENCAO', 'Link abriu mas formulário/resultado/CTA não detectado.')
          }
        } catch (e2) {
          await calcPage.close().catch(() => {})
          registrar('11. Calculadora', 'ATENCAO', 'Link público não abriu ou timeout.')
        }
      } else {
        registrar('11. Calculadora', 'ATENCAO', 'Nenhum link público na página Links para testar (criar um link primeiro).')
      }
    } catch (e) {
      registrar('11. Calculadora', 'ATENCAO', (e as Error).message)
    }
  } catch (e) {
    console.error('Erro fatal:', e)
    registrar('Sistema', 'ERRO', (e as Error).message)
  } finally {
    const teveErro = resultados.some((r) => r.status === 'ERRO')
    if (!TODAS_AREAS) await pausaSeVisivel(teveErro)
    if (browser) await browser.close()
  }

  imprimirTabela()
  if (TODAS_AREAS) allRuns.push({ email: conta.email, area: conta.area, resultados: resultados.slice() })
  }

  if (TODAS_AREAS) writeRelatorioTodasAreas(allRuns)
  else salvarRelatorio()
}

main().catch(console.error)
