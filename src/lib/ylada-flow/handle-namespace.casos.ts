/**
 * Casos: unicidade de handle entre os 3 espaços de nomes. I/O mockado (fake nomeado).
 * Rodar: npx tsx src/lib/ylada-flow/handle-namespace.casos.ts
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import { findHandleConflict, isHandleAvailableAcrossNamespaces } from './handle-namespace'

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error('FAIL:', msg)
    process.exit(1)
  }
  console.log('OK:', msg)
}

type Seed = {
  user_profiles?: Record<string, string> // slug → user_id
  leader_tenants?: Record<string, string> // slug → owner_user_id
  leader_tenant_members?: Record<string, string> // slug → user_id
}

/** Fake do supabase: resolve maybeSingle() pela tabela + valor do eq(). */
function fakeAdmin(seed: Seed): SupabaseClient {
  const ownerColByTable: Record<string, string> = {
    user_profiles: 'user_id',
    leader_tenants: 'owner_user_id',
    leader_tenant_members: 'user_id',
  }
  return {
    from(table: string) {
      const map = (seed as Record<string, Record<string, string> | undefined>)[table] ?? {}
      return {
        select() {
          return {
            eq(_col: string, value: string) {
              return {
                async maybeSingle() {
                  const owner = map[value]
                  if (!owner) return { data: null, error: null }
                  return { data: { [ownerColByTable[table]]: owner }, error: null }
                },
              }
            },
          }
        },
      }
    },
  } as unknown as SupabaseClient
}

async function run() {
  // Livre em tudo
  const vazio = fakeAdmin({})
  assert((await findHandleConflict(vazio, 'andre')).taken === false, 'handle livre não tem conflito')
  assert(await isHandleAvailableAcrossNamespaces(vazio, 'andre'), 'disponível quando livre')

  // Tomado por user_profiles
  const porUser = fakeAdmin({ user_profiles: { andre: 'u1' } })
  const c1 = await findHandleConflict(porUser, 'andre')
  assert(c1.taken && c1.source === 'user_slug', 'conflito em user_profiles')

  // Tomado por leader_tenants (uma rede) — não pode ser usado por outro
  const porRede = fakeAdmin({ leader_tenants: { munra: 't1' } })
  const c2 = await findHandleConflict(porRede, 'munra')
  assert(c2.taken && c2.source === 'leader_tenant', 'conflito em leader_tenants (rede protegida)')

  // Tomado por membro
  const porMembro = fakeAdmin({ leader_tenant_members: { maria: 'm1' } })
  const c3 = await findHandleConflict(porMembro, 'maria')
  assert(c3.taken && c3.source === 'pro_lideres_member_share_slug', 'conflito em membro')

  // excludeUserId = próprio dono → não é conflito (edição do próprio handle)
  const proprio = fakeAdmin({ user_profiles: { andre: 'u1' } })
  assert(
    (await findHandleConflict(proprio, 'andre', 'u1')).taken === false,
    'próprio dono não colide consigo (edição)',
  )

  // Normaliza antes de comparar (acento/caixa)
  const norm = fakeAdmin({ user_profiles: { munra: 'u1' } })
  assert((await findHandleConflict(norm, 'Munrá')).taken, 'normaliza acento/caixa antes de comparar')

  console.log('\nTodos os casos de handle-namespace passaram.')
}

void run()
