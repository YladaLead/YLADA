// =====================================================
// CONSTRUTOR — PERMISSÃO POR PAPEL (Chat 8, tijolo 3)
// =====================================================
//
// Fonte: Spec_Fundacao_Ylada_Grau1.md §6 (matriz de papéis) + §9 (Construtor é a
// skill CARA e a única PERMISSIONADA).
//
// O QUE É: o portão determinístico que decide QUEM pode criar/personalizar fluxos.
// Matriz §6:
//   - Ylada (serviço)      → cria (no setup).
//   - Empresa (contratante)→ define VIA Ylada (não cria direto).
//   - Líder de rede        → cria SÓ se a empresa liberar (opcional).
//   - Distribuidor         → nunca.
//   - Profissional liberal → cria os próprios.
//
// FIAÇÃO (depois): de onde vem o `papel` e o flag `empresaLiberouLider` (perfil/tenant)
// é um passo posterior. Aqui é função pura — recebe o contexto como entrada. Inerte.
// =====================================================

/** Papéis da matriz §6 (mais amplo que o PapelProfissional do Recomendador). */
export type PapelCriacao = 'ylada' | 'empresa' | 'liberal' | 'lider' | 'distribuidor'

export interface ContextoPermissao {
  papel: PapelCriacao
  /** a empresa/rede liberou o líder a criar? (default false). Só pesa pro papel 'lider'. */
  empresaLiberouLider?: boolean
}

export interface ResultadoPermissao {
  pode: boolean
  motivo: string
}

/** Aplica a matriz §6. Determinístico. */
export function podeCriarFluxo(ctx: ContextoPermissao): ResultadoPermissao {
  switch (ctx.papel) {
    case 'ylada':
      return { pode: true, motivo: 'Ylada cria/personaliza no setup (matriz §6).' }
    case 'liberal':
      return { pode: true, motivo: 'Profissional liberal cria os próprios fluxos (matriz §6).' }
    case 'lider':
      return ctx.empresaLiberouLider
        ? { pode: true, motivo: 'Líder com criação liberada pela empresa (matriz §6).' }
        : { pode: false, motivo: 'Líder só cria se a empresa liberar — não liberado (matriz §6).' }
    case 'empresa':
      return { pode: false, motivo: 'Empresa define VIA Ylada (não cria direto) — matriz §6.' }
    case 'distribuidor':
      return { pode: false, motivo: 'Distribuidor usa a biblioteca, não cria (matriz §6). Foco do líder é monitorar.' }
    default:
      return { pode: false, motivo: 'Papel desconhecido — criação negada por padrão.' }
  }
}
