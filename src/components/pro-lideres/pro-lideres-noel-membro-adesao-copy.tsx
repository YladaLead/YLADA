/**
 * Só para **membro** em `/pro-lideres/membro/noel-membro` (antes de aderir).
 * Checklist + preço discreto — sem texto longo. Não usar na UI do líder.
 */
const ADESAO_ITENS = [
  'Tirar dúvidas na hora',
  'Saber o que postar',
  'Saber se comunicar melhor',
  'Lidar com objeções',
] as const

export function ProLideresNoelMembroAdesaoPitch({ brlMensal }: { brlMensal: string }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Por que aderir ao Noel</p>
        <p className="text-sm leading-relaxed text-gray-800">
          Porque você leva uma <strong>inteligência artificial orientando você na prática</strong>: não é curso para
          depois — é apoio na hora em que você abre o WhatsApp, monta mensagem ou pensa no post. Menos chute, mais
          clareza para agir.
        </p>
      </div>
      <p className="text-sm font-semibold text-gray-900">Com o Noel membro você conta com apoio para:</p>
      <ul className="space-y-2.5 text-sm text-gray-800" aria-label="O que a adesão ao Noel ajuda">
        {ADESAO_ITENS.map((t) => (
          <li key={t} className="flex items-start gap-2.5">
            <span className="mt-0.5 shrink-0 font-bold text-emerald-600" aria-hidden>
              ✓
            </span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
      <p className="text-center text-xs text-gray-500">R$ {brlMensal}/mês</p>
    </div>
  )
}
