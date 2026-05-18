/**
 * Só para **membro** em `/pro-lideres/membro/noel-membro` (antes de aderir).
 * Benefícios diretos — sem parágrafo introdutório. Não usar na UI do líder.
 */
const ADESAO_ITENS = [
  {
    title: 'Tirar dúvidas na hora',
    detail: 'Antes de mandar mensagem, ligar ou responder alguém da sua lista.',
  },
  {
    title: 'Saber o que postar',
    detail: 'Ideia e tom para o dia — sem ficar olhando a tela sem saber o que escrever.',
  },
  {
    title: 'Mensagem na hora',
    detail: 'Convite, acompanhamento e retomada de conversa com texto curto e natural.',
  },
  {
    title: 'Objeções sem travar',
    detail: 'Como responder com leveza, sem pressão e no tom certo para o seu time.',
  },
  {
    title: 'Próximo passo claro',
    detail: 'O que fazer nas próximas 24h em campo — lista, rotina e foco do dia.',
  },
] as const

export function ProLideresNoelMembroAdesaoPitch({ brlMensal }: { brlMensal: string }) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold leading-snug text-gray-900">
        Com o Noel você conta com apoio para:
      </p>
      <ul className="space-y-3 text-sm text-gray-800" aria-label="O que a adesão ao Noel oferece">
        {ADESAO_ITENS.map((item) => (
          <li key={item.title} className="flex items-start gap-2.5">
            <span className="mt-0.5 shrink-0 font-bold text-emerald-600" aria-hidden>
              ✓
            </span>
            <span>
              <strong className="font-semibold text-gray-900">{item.title}</strong>
              <span className="text-gray-700"> — {item.detail}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="text-center text-xs text-gray-500">R$ {brlMensal}/mês · cancela quando quiser no Mercado Pago</p>
    </div>
  )
}
