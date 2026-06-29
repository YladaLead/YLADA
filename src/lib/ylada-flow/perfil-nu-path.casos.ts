/**
 * Casos: parsing/guarda do path `/[perfil]` nu. Puro, sem I/O.
 * Rodar: npx tsx src/lib/ylada-flow/perfil-nu-path.casos.ts
 */
import { isPerfilNuPublicPath, parsePerfilNuPath } from './perfil-nu-path'

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error('FAIL:', msg)
    process.exit(1)
  }
  console.log('OK:', msg)
}

// Handle válido de um segmento só
assert(parsePerfilNuPath('/andre') === 'andre', 'segmento simples vira handle')
assert(parsePerfilNuPath('/munra-joias') === 'munra-joias', 'handle com hífen')
assert(parsePerfilNuPath('/Andre/') === 'andre', 'normaliza caixa e barra final')
assert(isPerfilNuPublicPath('/andre'), 'isPerfilNuPublicPath true pra handle')

// Dois segmentos NÃO é perfil nu (é /[perfil]/[fluxo])
assert(parsePerfilNuPath('/andre/agua') === null, 'dois segmentos não casa o nu')

// Reservados / idioma / palavras-de-app NÃO são handle
assert(parsePerfilNuPath('/pt') === null, 'idioma pt não é handle')
assert(parsePerfilNuPath('/login') === null, 'login (app word) não é handle')
assert(parsePerfilNuPath('/wellness') === null, 'wellness (área) não é handle')
assert(parsePerfilNuPath('/admin') === null, 'admin (reservado) não é handle')
assert(parsePerfilNuPath('/conviccao') === null, 'conviccao (livro) não é handle')
assert(parsePerfilNuPath('/criar') === null, 'criar (loop) não é handle')
assert(parsePerfilNuPath('/nutri') === null, 'nutri (área) não é handle')
assert(parsePerfilNuPath('/precos') === null, 'precos (rota real) não é handle')
assert(parsePerfilNuPath('/comecar') === null, 'comecar (rota real) não é handle')
assert(parsePerfilNuPath('/sobre') === null, 'sobre (rota real) não é handle')
assert(parsePerfilNuPath('/cadastro') === null, 'cadastro (rota real) não é handle')

// Lixo
assert(parsePerfilNuPath('/') === null, 'raiz não é handle')
assert(parsePerfilNuPath('/arquivo.png') === null, 'caminho com ponto não é handle')

console.log('\nTodos os casos de perfil-nu-path passaram.')
