/**
 * Flag da página de entrada `/[perfil]` nua (apresentação + hub de fluxos → loop).
 * Separada do piloto de render nativo (`YLADA_FLOW_NATIVE_PILOT`) de propósito:
 * gateia só a porta 3 (Paginas_Entrada_Arquitetura §1.1), sem acoplar ao motor.
 *
 * Com a flag OFF o middleware segue redirecionando `/x` → `/pt/x` (comportamento
 * atual), então a página `/[perfil]` fica inalcançável = byte-idêntico ao de hoje.
 * @see blueprint-plataforma/Paginas_Entrada_Arquitetura.md
 */
export function isPerfilNuEnabled(): boolean {
  return process.env.PERFIL_NU_ENABLED === 'true' || process.env.PERFIL_NU_ENABLED === '1'
}
