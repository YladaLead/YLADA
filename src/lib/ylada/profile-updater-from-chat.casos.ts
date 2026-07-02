/**
 * Casos de teste para profile-updater-from-chat.ts
 * Roda: npx tsx src/lib/ylada/profile-updater-from-chat.casos.ts
 */
import { deveExtrair } from './profile-updater-from-chat'

type ChatMessage = { role: string; content: string }

function assert(label: string, value: boolean) {
  if (!value) throw new Error(`❌ FALHOU: ${label}`)
  console.log(`✅ ${label}`)
}

// deveExtrair — deve rodar a cada 5ª mensagem do usuário
const histWith4Users: ChatMessage[] = [
  { role: 'user', content: 'oi' },
  { role: 'assistant', content: 'olá' },
  { role: 'user', content: 'msg 2' },
  { role: 'assistant', content: 'resp' },
  { role: 'user', content: 'msg 3' },
  { role: 'assistant', content: 'resp' },
  { role: 'user', content: 'msg 4' },
  { role: 'assistant', content: 'resp' },
]
// histórico tem 4 mensagens de usuário + a atual = 5 → deve extrair
assert('deveExtrair quando history tem 4 user + atual = 5', deveExtrair(histWith4Users))

// histórico tem 4 mensagens de usuário mas atual é a 2ª (history tem 1 user) = 2 → não extrai
const histWith1User: ChatMessage[] = [
  { role: 'user', content: 'oi' },
  { role: 'assistant', content: 'olá' },
]
assert('não extrai quando só tem 2 mensagens do usuário', !deveExtrair(histWith1User))

// 9 user no history + atual = 10 → extrai
const histWith9Users: ChatMessage[] = Array.from({ length: 9 }, (_, i) => ({
  role: 'user' as const,
  content: `msg ${i + 1}`,
}))
assert('deveExtrair quando history tem 9 user + atual = 10', deveExtrair(histWith9Users))

// 14 user → 15 → extrai
const histWith14: ChatMessage[] = Array.from({ length: 14 }, (_, i) => ({
  role: 'user' as const,
  content: `msg ${i}`,
}))
assert('deveExtrair quando history tem 14 user + atual = 15', deveExtrair(histWith14))

console.log('\n✅ Todos os casos passaram.')
