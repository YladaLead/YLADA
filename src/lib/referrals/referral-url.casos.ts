/**
 * Casos: montagem/parsing de URL do loop. Puro, sem I/O.
 * Rodar: npx tsx src/lib/referrals/referral-url.casos.ts
 */
import {
  buildReferralLandingUrl,
  buildSignupUrlWithReferral,
  parseReferralParams,
} from './referral-url'

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error('FAIL:', msg)
    process.exit(1)
  }
  console.log('OK:', msg)
}

// Selo com código → página dedicada com ref + source
assert(
  buildReferralLandingUrl({ code: 'a3f9k2', source: 'diagnostico' }) ===
    '/criar?ref=a3f9k2&source=diagnostico',
  'landing url com code e source diagnostico',
)

// Sem código → fallback compatível (só a página com source, sem ref)
assert(
  buildReferralLandingUrl({ code: null }) === '/criar?source=diagnostico',
  'landing url sem code cai no fallback com source padrão',
)

assert(
  buildReferralLandingUrl({ code: '', source: 'conteudo' }) === '/criar?source=conteudo',
  'code vazio é ignorado; source conteudo preservado',
)

// Encaminhar pro cadastro preservando ref + area
assert(
  buildSignupUrlWithReferral({ code: 'a3f9k2', area: 'estetica' }) ===
    '/pt/cadastro?area=estetica&ref=a3f9k2',
  'signup url preserva area e ref',
)

assert(
  buildSignupUrlWithReferral({ code: null, area: null }) === '/pt/cadastro',
  'signup url sem nada cai no cadastro cru',
)

// Parsing tolerante
{
  const p = parseReferralParams('?ref=a3f9k2&source=conteudo')
  assert(p.ref === 'a3f9k2' && p.source === 'conteudo', 'parse ref + source conteudo')
}
{
  const p = parseReferralParams('source=lixo')
  assert(p.ref === null && p.source === 'diagnostico', 'source inválido vira diagnostico; ref ausente = null')
}
{
  const p = parseReferralParams('?ref=%20%20')
  assert(p.ref === null, 'ref só com espaço vira null')
}

console.log('\nTodos os casos de referral-url passaram.')
