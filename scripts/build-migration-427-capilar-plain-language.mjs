/**
 * Gera migrations/427-pro-estetica-capilar-diagnosis-plain-language-refresh.sql
 * a partir de 407 + 408 com substituições de tom (menos “consulta para protocolo” repetido;
 * alinhado à filosofia em src/config/ylada-diagnosis-result-standard.ts).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const migDir = path.join(root, 'migrations')
const outPath = path.join(migDir, '427-pro-estetica-capilar-diagnosis-plain-language-refresh.sql')

function getValuesTuples(sql) {
  const i = sql.indexOf('VALUES')
  if (i < 0) throw new Error('VALUES not found')
  const rest = sql.slice(i + 'VALUES'.length).trimStart()
  const end = rest.lastIndexOf(');')
  if (end < 0) throw new Error('); not found')
  return rest.slice(0, end + 1).trimEnd()
}

const files = [
  '407-pro-estetica-capilar-packaged-diagnosis-bloco284-base.sql',
  '408-pro-estetica-capilar-packaged-diagnosis-biblioteca-376-380.sql',
]

const tuples = files
  .map((f) => getValuesTuples(fs.readFileSync(path.join(migDir, f), 'utf8')))
  .join(',\n')

/** Ordem: frases mais longas / específicas primeiro. */
const replacements = [
  [
    `Quero consulta para protocolo e frequência realista com a equipe.'`,
    `Quero marcar avaliação para alinhar plano de cuidados e frequência com a equipe.'`,
  ],
  [
    `'profile_title', 'Queda com impacto na rotina — hora de protocolo com profissional'`,
    `'profile_title', 'Queda com impacto na rotina — faz sentido falar com uma profissional'`,
  ],
  [
    `'profile_title', 'Couro incómodo com frequência — fechar protocolo suave'`,
    `'profile_title', 'Couro incómodo com frequência — vale um plano de cuidados suave'`,
  ],
  [
    `'Quero consulta para definir protocolo, frequência e o que fazer em casa com orientação de vocês.'`,
    `'Quero marcar avaliação para alinhar frequência, cuidados em casa e próximos passos com orientação de vocês.'`,
  ],
  [
    `para protocolo seguro e orientação honesta.'`,
    `para orientação segura e próximos passos com honestidade.'`,
  ],
  [
    `'cta_text', 'Quero consulta para protocolo do meu fio'`,
    `'cta_text', 'Quero avaliação para o meu tipo de fio'`,
  ],
  [
    `'whatsapp_prefill', 'Oi! Questionário sobre tipo de fio; perfil moderado. Quero consulta para protocolo, produtos e frequência realista.'`,
    `'whatsapp_prefill', 'Oi! Questionário sobre tipo de fio; perfil moderado. Quero avaliação para produtos, frequência e o que fazer em casa com orientação de vocês.'`,
  ],
  [
    `'cta_text', 'Quero consulta para protocolo de couro'`,
    `'cta_text', 'Quero avaliação do meu couro cabeludo'`,
  ],
  [
    `'whatsapp_prefill', 'Oi! Quiz do couro cabeludo; perfil moderado. Quero consulta para protocolo, produtos e frequência com vocês.'`,
    `'whatsapp_prefill', 'Oi! Quiz do couro cabeludo; perfil moderado. Quero avaliação para produtos, frequência e o que posso fazer em casa com vocês.'`,
  ],
  [
    `'frase_identificacao', 'Se te identificas, queres saber se é só rotina ou precisa de protocolo.'`,
    `'frase_identificacao', 'Se te identificas, queres saber se é só rotina ou se precisa de orientação mais estruturada.'`,
  ],
  [
    `'growth_potential', 'Na consulta, peça protocolo mínimo para 4 semanas e data de revisão.'`,
    `'growth_potential', 'Na consulta, peça um plano mínimo para 4 semanas e data de revisão.'`,
  ],
]

const CAPILAR_TEMPLATE_IDS = [
  'b1000103-0103-4000-8000-000000000103',
  'b1000104-0104-4000-8000-000000000104',
  'b1000105-0105-4000-8000-000000000105',
  'b1000106-0106-4000-8000-000000000106',
  'b1000107-0107-4000-8000-000000000107',
  'b1000152-0152-4000-8000-000000000152',
  'b1000153-0153-4000-8000-000000000153',
  'b1000154-0154-4000-8000-000000000154',
  'b1000155-0155-4000-8000-000000000155',
  'b1000156-0156-4000-8000-000000000156',
  'b1000157-0157-4000-8000-000000000157',
  'b1000158-0158-4000-8000-000000000158',
  'b1000159-0159-4000-8000-000000000159',
  'b1000160-0160-4000-8000-000000000160',
  'b1000161-0161-4000-8000-000000000161',
  'b1000162-0162-4000-8000-000000000162',
  'b1000163-0163-4000-8000-000000000163',
  'b1000164-0164-4000-8000-000000000164',
  'b1000165-0165-4000-8000-000000000165',
  'b1000166-0166-4000-8000-000000000166',
  'b1000167-0167-4000-8000-000000000167',
  'b1000168-0168-4000-8000-000000000168',
  'b1000169-0169-4000-8000-000000000169',
  'b1000170-0170-4000-8000-000000000170',
  'b1000171-0171-4000-8000-000000000171',
  'b1000172-0172-4000-8000-000000000172',
  'b1000173-0173-4000-8000-000000000173',
  'b1000174-0174-4000-8000-000000000174',
  'b1000175-0175-4000-8000-000000000175',
  'b1000176-0176-4000-8000-000000000176',
  'b1000177-0177-4000-8000-000000000177',
  'b1000178-0178-4000-8000-000000000178',
  'b1000179-0179-4000-8000-000000000179',
  'b1000180-0180-4000-8000-000000000180',
  'b1000181-0181-4000-8000-000000000181',
  'b1000182-0182-4000-8000-000000000182',
  'b1000183-0183-4000-8000-000000000183',
  'b1000184-0184-4000-8000-000000000184',
  'b1000185-0185-4000-8000-000000000185',
  'b1000186-0186-4000-8000-000000000186',
  'b1000187-0187-4000-8000-000000000187',
  'b1000188-0188-4000-8000-000000000188',
  'b1000189-0189-4000-8000-000000000189',
  'b1000190-0190-4000-8000-000000000190',
  'b1000191-0191-4000-8000-000000000191',
]

let body = tuples
for (const [a, b] of replacements) {
  if (!body.includes(a)) continue
  body = body.split(a).join(b)
}

const uuidList = CAPILAR_TEMPLATE_IDS.map((id) => `    '${id}'::uuid`).join(',\n')

const header = `-- Pro Estética Capilar — refresh de copy (tom mais leigo; menos fórmula “consulta + protocolo” repetida).
-- Substitui pacotes capilares das migrações 407–408. Idempotente: DELETE + INSERT.
-- Limpa \`ylada_diagnosis_cache\` destes \`template_id\` para não servir texto antigo.
-- @see src/config/ylada-diagnosis-result-standard.ts (YLADA_DIAGNOSIS_CAPILAR_VOICE_CHECKLIST)

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical = 'capilar'
  AND template_id = ANY (
    ARRAY[
${uuidList}
    ]
  );

INSERT INTO public.ylada_flow_diagnosis_outcomes
  (template_id, architecture, archetype_code, diagnosis_vertical, content_json)
VALUES
`

const cacheFooter = `
-- Cache visitante
DELETE FROM ylada_diagnosis_cache c
USING ylada_links y
WHERE c.link_id = y.id
  AND y.status = 'active'
  AND (y.config_json -> 'meta' ->> 'pro_lideres_preset') IS DISTINCT FROM 'true'
  AND y.template_id = ANY (
    ARRAY[
${uuidList}
    ]
  );
`

const sql = `${header}${body}
;
${cacheFooter}`

fs.writeFileSync(outPath, sql, 'utf8')
console.log('Wrote', outPath, 'bytes', sql.length)
