/**
 * Casos de teste para as funções de Strategic Profile.
 * Rodar: npx tsx src/lib/strategic-profile-casos.ts
 */

import { getStrategicProfileEstetica } from './strategic-profile-estetica'
import { getStrategicProfileOdonto } from './strategic-profile-odonto'
import { getStrategicProfilePsi } from './strategic-profile-psi'
import { getStrategicProfileFitness } from './strategic-profile-fitness'
import { getStrategicProfileCoach } from './strategic-profile-coach'
import { getStrategicProfileNutricionista } from './strategic-profile-nutricionista'
import { getStrategicProfileMedico } from './strategic-profile-medico'

interface Caso<T> {
  descricao: string
  fn: () => T
  expected: { name: string; focusLength: number }
}

const casos: Caso<{ name: string; focus: string[] }>[] = [
  // Estética
  {
    descricao: 'Estética: harmonização → Especialista Premium',
    fn: () => getStrategicProfileEstetica('harmonizacao', 'autonoma', 5),
    expected: { name: 'Especialista Premium em Harmonização', focusLength: 3 },
  },
  {
    descricao: 'Estética: clínica própria → Clínica Estruturada',
    fn: () => getStrategicProfileEstetica('facial', 'clinica_propria', 3),
    expected: { name: 'Clínica Estruturada', focusLength: 3 },
  },
  {
    descricao: 'Estética: pouca experiência → Profissional em Crescimento',
    fn: () => getStrategicProfileEstetica('', '', 1),
    expected: { name: 'Profissional em Crescimento', focusLength: 3 },
  },
  // Odonto
  {
    descricao: 'Odonto: particular → Consultório Particular',
    fn: () => getStrategicProfileOdonto('particular', 5),
    expected: { name: 'Consultório Particular', focusLength: 3 },
  },
  {
    descricao: 'Odonto: convênio → Clínica com Convênio',
    fn: () => getStrategicProfileOdonto('convenio', 3),
    expected: { name: 'Clínica com Convênio', focusLength: 3 },
  },
  // Psi
  {
    descricao: 'Psi: empresas → Psicologia Organizacional',
    fn: () => getStrategicProfilePsi(['empresas'], 'presencial', 5),
    expected: { name: 'Psicologia Organizacional', focusLength: 3 },
  },
  {
    descricao: 'Psi: casais → Terapia de Casal',
    fn: () => getStrategicProfilePsi(['casais'], 'ambos', 3),
    expected: { name: 'Terapia de Casal', focusLength: 3 },
  },
  // Fitness
  {
    descricao: 'Fitness: personal → Personal Trainer',
    fn: () => getStrategicProfileFitness('personal', 4),
    expected: { name: 'Personal Trainer', focusLength: 3 },
  },
  {
    descricao: 'Fitness: online → Treinador Online',
    fn: () => getStrategicProfileFitness('online', 2),
    expected: { name: 'Treinador Online', focusLength: 3 },
  },
  // Coach
  {
    descricao: 'Coach: sessões individuais → Coach de Sessões Individuais',
    fn: () => getStrategicProfileCoach('sessoes_individuais', 3),
    expected: { name: 'Coach de Sessões Individuais', focusLength: 3 },
  },
  {
    descricao: 'Coach: grupo → Coach de Grupo',
    fn: () => getStrategicProfileCoach('grupo', 2),
    expected: { name: 'Coach de Grupo', focusLength: 3 },
  },
  // Nutricionista
  {
    descricao: 'Nutricionista: emagrecimento → Nutricionista de Emagrecimento',
    fn: () => getStrategicProfileNutricionista('emagrecimento', 'presencial', 4),
    expected: { name: 'Nutricionista de Emagrecimento', focusLength: 3 },
  },
  {
    descricao: 'Nutricionista: esportiva → Nutricionista Esportiva',
    fn: () => getStrategicProfileNutricionista('esportiva', 'online', 3),
    expected: { name: 'Nutricionista Esportiva', focusLength: 3 },
  },
  // Médico
  {
    descricao: 'Médico: convênio → Médico com Convênio',
    fn: () => getStrategicProfileMedico(['convenio'], undefined, 5),
    expected: { name: 'Médico com Convênio', focusLength: 3 },
  },
  {
    descricao: 'Médico: particular → Consultório Particular',
    fn: () => getStrategicProfileMedico(['particular'], undefined, 3),
    expected: { name: 'Consultório Particular', focusLength: 3 },
  },
]

let ok = 0
let fail = 0

for (const c of casos) {
  try {
    const result = c.fn()
    const nameOk = result.name === c.expected.name
    const focusOk = result.focus.length === c.expected.focusLength
    if (nameOk && focusOk) {
      console.log(`✅ ${c.descricao}`)
      ok++
    } else {
      console.log(`❌ ${c.descricao}`)
      console.log(`   Esperado: name="${c.expected.name}", focusLength=${c.expected.focusLength}`)
      console.log(`   Obtido:   name="${result.name}", focusLength=${result.focus.length}`)
      fail++
    }
  } catch (e) {
    console.log(`❌ ${c.descricao}`)
    console.log(`   Erro:`, e)
    fail++
  }
}

console.log(`\n--- Resultado: ${ok} ok, ${fail} falhas ---`)
process.exit(fail > 0 ? 1 : 0)
