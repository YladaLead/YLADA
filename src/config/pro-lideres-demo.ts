/**
 * Conta demo Pro Líderes (`demo@prolider.com` + script `pro-lideres-demo-prolider-equipe.sql`).
 * Convite fixo para cadastrar um membro “de verdade” e testar Noel membro / Mercado Pago.
 */
export const PRO_LIDERES_DEMO_MEMBER_INVITE_TOKEN = 'ylada_pl_demo_membro_noel_v1'

/** E-mail gravado no convite — será o login da conta criada a partir do link. */
export const PRO_LIDERES_DEMO_MEMBER_INVITE_EMAIL = 'pldemo.noel.membro@ylada.app'

export function proLideresDemoMemberInviteHref(): string {
  return `/pro-lideres/convite/${PRO_LIDERES_DEMO_MEMBER_INVITE_TOKEN}`
}
